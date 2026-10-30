"""Slug-only lo-fi + SFX mixer. Never writes story or narration.

Run from the repository root:
  .venv-kelindihan/Scripts/python.exe src/videos/perasaan-pegawai/make_soundtrack.py
The existing lo-fi generator is rerun before scaling music.wav (no double gain).
Soundtrack contains only music + exactly the story SFX; no ambient or voice.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import math
import os
from pathlib import Path
import shlex
import subprocess
import sys

import numpy as np
from scipy.io import wavfile

ROOT = Path(__file__).resolve().parents[3]
SLUG = "perasaan-pegawai"
PUBLIC = ROOT / "public" / "videos" / SLUG
OUT = ROOT / "out" / "videos" / SLUG
STORY = ROOT / "src" / "videos" / SLUG / "story.json"
NARRATION = PUBLIC / "narration.wav"
SR = 48000
EXPECTED_DURATION = 94.28
MUSIC_RELATIVE_DB = -19.0
SFX_RELATIVE_DB = -19.0
PEAK_CEILING_DBTP = -1.0
# Prevent importing shared modules from writing __pycache__ outside our scope.
sys.dont_write_bytecode = True
sys.path.insert(0, str(ROOT / "scripts" / "kit2d-audio"))
import dsp  # noqa: E402
import sfx as sfx_library  # noqa: E402

COMMANDS = []


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def run(command, label, data=None):
    command = [str(v) for v in command]
    COMMANDS.append({"label": label, "argv": command})
    proc = subprocess.run(command, cwd=ROOT, input=data, capture_output=True)
    log = "$ " + shlex.join(command) + "\n"
    log += proc.stdout.decode("utf-8", errors="replace")
    log += proc.stderr.decode("utf-8", errors="replace")
    (OUT / f"audio-{label}.log").write_text(log, encoding="utf-8")
    if proc.returncode:
        raise RuntimeError(f"{label}: exit {proc.returncode}; see audio-{label}.log")
    return proc


def loudness(label, path=None, samples=None):
    command = ["ffmpeg", "-hide_banner", "-nostats", "-nostdin"]
    payload = None
    if path is not None:
        command += ["-i", path]
    else:
        payload = np.asarray(samples, dtype="<f4").tobytes()
        command += ["-f", "f32le", "-ar", SR, "-ac", 2, "-i", "pipe:0"]
    command += ["-af", "loudnorm=I=-14:TP=-1:LRA=11:print_format=json", "-f", "null", "-"]
    proc = run(command, label, payload)
    text = proc.stderr.decode("utf-8", errors="replace")
    decoder = json.JSONDecoder()
    result = None
    for index, character in enumerate(text):
        if character != "{":
            continue
        try:
            candidate, _ = decoder.raw_decode(text[index:])
        except json.JSONDecodeError:
            continue
        if isinstance(candidate, dict) and "input_i" in candidate and "input_tp" in candidate:
            result = candidate
    if result is None:
        raise RuntimeError(f"No measured loudnorm JSON for {label}")
    measured = {"integrated_lufs": float(result["input_i"]),
                "true_peak_dbtp": float(result["input_tp"]),
                "lra_lu": float(result["input_lra"]),
                "threshold_lufs": float(result["input_thresh"]),
                "ffmpeg_loudnorm": result}
    if not all(math.isfinite(measured[k]) for k in ("integrated_lufs", "true_peak_dbtp")):
        raise ValueError(f"Invalid/nonfinite measurement: {label}")
    return measured


def read_float(path):
    rate, x = wavfile.read(path)
    if x.dtype.kind in "iu":
        x = x.astype(np.float64) / (2 ** (np.iinfo(x.dtype).bits - 1))
    else:
        x = x.astype(np.float64)
    return rate, x


def write_audio(path, x):
    if x.ndim != 2 or x.shape[1] != 2 or not np.isfinite(x).all():
        raise ValueError("Output must be finite stereo audio")
    if np.max(np.abs(x)) >= 1:
        raise ValueError(f"Clipping would occur in {path}")
    # Float PCM avoids excessive quantization of the deliberately quiet stems.
    wavfile.write(path, SR, np.asarray(x, dtype=np.float32))


def validate(story, narration_rate, narration):
    duration = float(story["duration"])
    assert duration == EXPECTED_DURATION
    assert len(narration) / narration_rate == duration, "Never trim/retime narration"
    assert story.get("musicMix", {}).get("gainDb", -19) == MUSIC_RELATIVE_DB
    assert story.get("musicMix", {}).get("bpm", 72) == 72
    cues = []
    previous_end = 0.0
    for shot in story["shots"]:
        start, end = float(shot["start"]), float(shot["end"])
        assert abs(start - previous_end) < 1e-8 and end > start
        assert not shot.get("amb"), "This task forbids ambience"
        previous_end = end
        for cue_index, cue in enumerate(shot.get("sfx", [])):
            at, dur, gain = (float(cue[key]) for key in ("at", "dur", "gain"))
            assert all(math.isfinite(v) for v in (at, dur, gain))
            # Local attack belongs to its shot; duration may bridge a cut.
            # Final story has two 20 ms overlaps; preserve the exact cue dur.
            assert 0 <= at < end - start and dur >= 0.01
            assert start + at + dur <= duration + 1e-8
            assert cue["name"] in sfx_library.LIB, f"Unknown effect: {cue['name']}"
            assert cue["name"] not in {"rain", "wind", "city", "roomtone", "murmur", "hum"}
            cues.append({"shot_id": shot["id"], "cue_index": cue_index,
                         "global_at": start + at, "at": at, "dur": dur,
                         "gain_db": gain, "name": cue["name"],
                         "seed": int(cue.get("seed", 1)),
                         "pitch": float(cue.get("pitch", 1.0))})
    assert previous_end == duration
    assert cues, "Expected story SFX"
    return duration, cues


def synthesize_cues(cues, sample_count):
    stem = np.zeros((sample_count, 2), dtype=np.float64)
    support = np.zeros(sample_count, dtype=bool)
    for cue in cues:
        start = round(cue["global_at"] * SR)
        length = round(cue["dur"] * SR)
        raw = sfx_library.make(cue["name"], dur=cue["dur"], seed=cue["seed"], pitch=cue["pitch"])
        # Explicit length restriction: no reverb tail may escape story duration.
        sound = np.zeros((length, 2), dtype=np.float64)
        copied = min(length, len(raw))
        sound[:copied] = raw[:copied]
        # Preserve attack timing; short edge ramps prevent cut-induced clicks.
        fade_in = min(0.002, cue["dur"] / 4)
        fade_out = min(0.020, cue["dur"] / 4)
        sound = dsp.fade(sound, fin=fade_in, fout=fade_out).astype(np.float64)
        assert np.all(sound[0] == 0) and np.all(sound[-1] == 0)
        sound *= dsp.db(cue["gain_db"])
        assert start >= 0 and start + length <= sample_count
        dsp.place(stem, sound, start)
        support[start:start + length] = True
        cue.update({"start_sample": start, "sample_count": length,
                    "end_sample_exclusive": start + length,
                    "fade_in_seconds": fade_in, "fade_out_seconds": fade_out,
                    "first_sample_zero": True, "last_sample_zero": True})
    assert np.all(stem[~support] == 0), "No SFX outside declared cue windows"
    return stem, support


def scale_to_target(x, measured, target, label, path):
    gain_db = target - measured["integrated_lufs"]
    result = x * dsp.db(gain_db)
    write_audio(path, result)
    final = loudness(label, path=path)
    # R128 absolute gating can move after a large gain change. Correct using
    # another actual measurement, never an RMS-based loudness estimate.
    for attempt in range(3):
        error = target - final["integrated_lufs"]
        if abs(error) <= 0.10:
            break
        gain_db += error
        result = x * dsp.db(gain_db)
        write_audio(path, result)
        final = loudness(f"{label}-correction-{attempt + 1}", path=path)
    assert abs(final["integrated_lufs"] - target) <= 0.15
    return result, final, gain_db


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    PUBLIC.mkdir(parents=True, exist_ok=True)
    original_story_hash = sha256(STORY)
    original_narration_hash = sha256(NARRATION)
    story = json.loads(STORY.read_text(encoding="utf-8"))
    narration_rate, narration = read_float(NARRATION)
    duration, cues = validate(story, narration_rate, narration)
    count = round(duration * SR)
    narrative_measure = loudness("narration", path=NARRATION)
    # This shared generator writes only the authorized slug music.wav.
    run([sys.executable, "scripts/make-lofi.py", SLUG, str(duration), "72"], "lofi-generator")
    music_path = PUBLIC / "music.wav"
    rate, music = read_float(music_path)
    assert rate == SR and music.shape == (count, 2)
    raw_music_measure = loudness("music-unscaled", path=music_path)
    target_music = narrative_measure["integrated_lufs"] + MUSIC_RELATIVE_DB
    music, music_measure, music_gain = scale_to_target(
        music, raw_music_measure, target_music, "music-scaled", music_path)
    sfx, support = synthesize_cues(cues, count)
    raw_sfx_measure = loudness("sfx-unscaled", samples=sfx)
    target_sfx = narrative_measure["integrated_lufs"] + SFX_RELATIVE_DB
    sfx, sfx_measure, sfx_gain = scale_to_target(
        sfx, raw_sfx_measure, target_sfx, "sfx-scaled", PUBLIC / "sfx.wav")
    # No normalization to -14 here: parent mixes this with the untouched voice.
    soundtrack = music + sfx
    write_audio(PUBLIC / "soundtrack.wav", soundtrack)
    soundtrack_measure = loudness("soundtrack", path=PUBLIC / "soundtrack.wav")
    measurements = {"narration_original": narrative_measure,
                    "music_generator_unscaled": raw_music_measure,
                    "music_scaled": music_measure, "sfx_unscaled": raw_sfx_measure,
                    "sfx_scaled": sfx_measure, "soundtrack": soundtrack_measure}
    artifacts = {}
    for name in ("music", "sfx", "soundtrack"):
        path = PUBLIC / f"{name}.wav"
        probe = run(["ffprobe", "-v", "error", "-show_entries",
                     "stream=codec_name,sample_rate,channels,duration,duration_ts,time_base:format=duration,size",
                     "-of", "json", path], f"probe-{name}")
        metadata = json.loads(probe.stdout)
        audio = metadata["streams"][0]
        actual_rate, actual = read_float(path)
        assert actual_rate == SR and actual.shape == (count, 2)
        assert int(audio["channels"]) == 2 and int(audio["sample_rate"]) == SR
        assert abs(float(audio["duration"]) - duration) < 1e-8
        assert measurements["music_scaled" if name == "music" else
                            "sfx_scaled" if name == "sfx" else "soundtrack"]["true_peak_dbtp"] <= PEAK_CEILING_DBTP
        run(["ffmpeg", "-hide_banner", "-nostats", "-nostdin", "-v", "error", "-i", path,
             "-f", "null", "-"], f"decode-{name}")
        artifacts[name] = {"path": str(path), "sha256": sha256(path),
                           "sample_peak_dbfs": float(20 * np.log10(np.max(np.abs(actual)))),
                           "sample_count": len(actual), "ffprobe": metadata}
    assert sha256(STORY) == original_story_hash, "Story was changed during build"
    assert sha256(NARRATION) == original_narration_hash, "Narration changed"
    rate, saved_sfx = read_float(PUBLIC / "sfx.wav")
    assert np.all(saved_sfx[~support] == 0)
    rate, saved_mix = read_float(PUBLIC / "soundtrack.wav")
    # Float32 storage introduces only rounding error; proves music+SFX only.
    assert np.max(np.abs(saved_mix - soundtrack)) < 1e-7
    report = {"slug": SLUG, "duration_seconds": duration, "sample_rate": SR,
              "channels": 2, "sample_count": count, "wav_format": "IEEE float32 PCM",
              "music_bpm": 72, "music_instruments": ["synth electric piano", "synth bass", "kick", "hi-hat"],
              "music_fades_seconds": {"in": 2, "out": 3},
              "music_relative_target_db": MUSIC_RELATIVE_DB, "music_gain_db": music_gain,
              "music_gain_linear": float(dsp.db(music_gain)),
              "music_relative_measured_lu": music_measure["integrated_lufs"] - narrative_measure["integrated_lufs"],
              "sfx_relative_target_db": SFX_RELATIVE_DB, "sfx_global_gain_db": sfx_gain,
              "sfx_gain_policy": "One common additional gain; every cue gain in story is preserved in dB.",
              "sfx_relative_measured_lu": sfx_measure["integrated_lufs"] - narrative_measure["integrated_lufs"],
              "sfx_cue_count": len(cues), "cues": cues,
              "measurements": measurements, "artifacts": artifacts,
              "story_sha256_before": original_story_hash, "story_sha256_after": sha256(STORY),
              "narration_sha256_before": original_narration_hash, "narration_sha256_after": sha256(NARRATION),
              "narration_channels_original": 1 if narration.ndim == 1 else narration.shape[1],
              "normalization_note": "LUFS comparison uses original native-channel narration, per project formula. Mono duplication in stereo playback changes the reference by about 3 LU. Parent normalizes final voice+soundtrack to -14 LUFS / <=-1 dBTP.",
              "ambience_added": False, "narration_in_soundtrack": False,
              "peak_policy": "Measured true peaks must be <=-1 dBTP; headroom sufficient without a nonlinear limiter.",
              "technical_qa": {"all_outputs_decode": True, "exact_duration": True,
                               "stereo_48khz": True, "no_sfx_outside_cues": True,
                               "cue_endpoints_zero": True, "no_clipping": True,
                               "story_unchanged": True, "narration_unchanged": True},
              "listened": False, "listening_note": "Technical measurements only; audio has not been listened to.",
              "commands_executed": COMMANDS}
    for path in (PUBLIC / "audio-report.json", OUT / "audio-metrics.json"):
        path.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps({"duration": duration, "cue_count": len(cues),
                      "music_gain_db": music_gain, "music_gain_linear": float(dsp.db(music_gain)),
                      "measurements": {k: {a: v[a] for a in ("integrated_lufs", "true_peak_dbtp")}
                                       for k, v in measurements.items()},
                      "report": str(PUBLIC / "audio-report.json"), "listened": False}, indent=2))


if __name__ == "__main__":
    main()
