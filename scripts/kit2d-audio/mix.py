"""scripts/kit2d-audio/mix.py: Kerangka B soundtrack (music + SFX + ambience), ported from aiTrends 2D Studio audio/mix.py.

  .venv-kelindihan/Scripts/python.exe scripts/kit2d-audio/mix.py <slug> [--no-music] [--no-sfx]

Reads src/videos/<slug>/story.json:
  shots[].sfx   [{"at": 0.3, "name": "whoosh", "gain": -8, "dur": 0.7, "seed": 3, "pitch": 1.0}]  (at = seconds from shot start)
  shots[].amb   {"name": "murmur", "gain": -26}  ambience bed looped under that shot (0.4 s fades)
  music         [{"start": 0, "end": 42, "mood": "mystery", "intensity": 0.4}]  plan for music.py
  sfx           [{"t": 12.5, "name": "impact", "gain": -6}]  global cues (seconds)
  musicMix      {"enabled": true, "gainDb": -19, "seed": 1, "key": null}  gainDb is relative to the narration level
  sfxMix        {"enabled": true, "gainDb": -6}
Ducks music -9 dB and ambience -5 dB while public/videos/<slug>/narration.wav speaks, writes
public/videos/<slug>/soundtrack.wav WITHOUT the narration (Video.tsx plays both; scripts/render.mjs
normalises the final mix to -14 LUFS), then sets story.json "soundtrack": true.
"""
import argparse, json, os, subprocess, sys
import numpy as np
sys.path.insert(0, os.path.dirname(__file__))
from dsp import SR, secs, db, rms_db, place, write_wav, as_stereo
import sfx as SFX
import music as MUSIC

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def load_audio(path):
    """Decode any audio file with ffmpeg into float32 stereo [n, 2] at SR."""
    p = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-f", "f32le", "-acodec", "pcm_f32le", "-ac", "2", "-ar", str(SR), "-"], capture_output=True)
    if p.returncode != 0:
        sys.exit(f"ffmpeg could not decode {path}: {p.stderr.decode()[-800:]}")
    return np.frombuffer(p.stdout, dtype=np.float32).copy().reshape(-1, 2)


def envelope(x, att=0.03, rel=0.45):
    """smoothed voice level 0..1 used to duck the music."""
    mono = np.abs(x).mean(axis=1)
    hop = secs(0.01); frames = np.sqrt(np.add.reduceat(mono ** 2, np.arange(0, len(mono), hop)) / hop)
    lv = np.clip((20 * np.log10(frames + 1e-9) + 50) / 30, 0, 1)
    out = np.zeros_like(lv); a, r = np.exp(-0.01 / att), np.exp(-0.01 / rel); v = 0.0
    for i, s in enumerate(lv):
        v = a * v + (1 - a) * s if s > v else r * v + (1 - r) * s; out[i] = v
    return np.repeat(out, hop)[: len(mono)]


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("slug"); ap.add_argument("--no-music", action="store_true"); ap.add_argument("--no-sfx", action="store_true")
    a = ap.parse_args()
    story_path = os.path.join(ROOT, "src", "videos", a.slug, "story.json")
    pub = os.path.join(ROOT, "public", "videos", a.slug)
    story = json.load(open(story_path, encoding="utf-8"))
    total = story["duration"]; n = secs(total)
    narr = os.path.join(pub, "narration.wav")
    if os.path.exists(narr):
        voice = load_audio(narr)
        voice = np.concatenate([voice, np.zeros((max(0, n - len(voice)), 2), np.float32)])[:n]
    else:
        print(f"no narration at {narr}: mixing without ducking")
        voice = np.zeros((n, 2), np.float32)
    loud = np.abs(voice).mean(1) > db(-40)
    v_rms = rms_db(voice[loud]) if np.any(loud) else -20
    env = envelope(voice)
    mix = np.zeros((n, 2), np.float32)
    # ---- music
    mcfg = story.get("musicMix", {}) or {}
    if mcfg.get("enabled", True) and not a.no_music:
        plan = story.get("music") or MUSIC.default_plan(total)
        print("generating music: " + ", ".join(f"{s['mood']}@{s.get('intensity', .5)}" for s in plan))
        mus = as_stereo(MUSIC.render_score(plan, total, mcfg.get("seed", 1), mcfg.get("key")))[:n]
        mus = np.concatenate([mus, np.zeros((n - len(mus), 2), np.float32)])
        mus *= db(v_rms + mcfg.get("gainDb", -19) - rms_db(mus))
        mus *= db(-9 * env)[:, None]
        mix += mus
    # ---- sfx + ambience
    scfg = story.get("sfxMix", {}) or {}
    if scfg.get("enabled", True) and not a.no_sfx:
        bed = np.zeros((n, 2), np.float32); hits = np.zeros((n, 2), np.float32); cache = {}
        cues = []
        for s in story["shots"]:
            for c in s.get("sfx", []) or []: cues.append({**c, "t": s["start"] + float(c.get("at", 0))})
            if s.get("amb"):
                am = s["amb"]; ln = s["end"] - s["start"]
                key = (am["name"], am.get("seed", 1)); base = cache.get(key)
                if base is None: base = cache[key] = SFX.make(am["name"], dur=6.0, seed=am.get("seed", 1))
                loop = np.concatenate([base] * int(np.ceil(ln / (len(base) / SR) + 1)))[: secs(ln)]
                f = min(secs(0.4), len(loop) // 2); loop[:f] *= np.linspace(0, 1, f)[:, None]; loop[-f:] *= np.linspace(1, 0, f)[:, None]
                place(bed, loop, secs(s["start"]), db(am.get("gain", -20)))
        for c in story.get("sfx", []) or []: cues.append({**c, "t": float(c["t"])})
        for c in cues:
            snd = SFX.make(c["name"], dur=c.get("dur"), seed=c.get("seed"), pitch=c.get("pitch"))
            place(hits, snd, secs(c["t"]), db(c.get("gain", -8)))
        bed *= db(-5 * env)[:, None]
        mix += (hits + bed) * db(scfg.get("gainDb", -6) + (v_rms + 18))   # SFX levels are relative to the voice level
        print(f"sfx: {len(cues)} cue(s), ambience on {sum(1 for s in story['shots'] if s.get('amb'))} shot(s)")
    # soft clip so voice + soundtrack never clip before render.mjs loudnorm
    peak = np.abs(mix).max()
    if peak > 0.7: mix = np.tanh(mix / peak * 1.2) / np.tanh(1.2) * 0.7
    os.makedirs(pub, exist_ok=True)
    out = os.path.join(pub, "soundtrack.wav"); write_wav(out, mix)
    story["soundtrack"] = True
    with open(story_path, "w", encoding="utf-8") as fh: json.dump(story, fh, ensure_ascii=False, indent=1); fh.write("\n")
    print(f"wrote {out}  ({total:.1f}s)")


if __name__ == "__main__":
    main()
