"""Synthesize a soft instrumental lo-fi loop (no samples, deterministic, royalty-free).

Run: .venv-kelindihan/Scripts/python.exe scripts/make-lofi.py <slug> <seconds> [bpm]
Out: public/videos/<slug>/music.wav, 48 kHz stereo int16, fades in 2 s and out 3 s.
Level is set in the video via the Audio volume prop.
"""
import sys
from pathlib import Path

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

SR = 48000
slug, dur = sys.argv[1], float(sys.argv[2])
bpm = float(sys.argv[3]) if len(sys.argv) > 3 else 72
rng = np.random.default_rng(1028)
n = int(dur * SR)
beat = 60 / bpm
mid = lambda m: 440 * 2 ** ((m - 69) / 12)

# Cmaj7 - Am7 - Dm7 - G7, one chord per bar of 4 beats
CHORDS = [[60, 64, 67, 71], [57, 60, 64, 67], [62, 65, 69, 72], [55, 59, 62, 65]]
BASS = [36, 33, 38, 31]


def lp(x, hz, order=2):
    return sosfilt(butter(order, hz, 'low', fs=SR, output='sos'), x, axis=0)


def add(buf, start, sig):
    i = int(start * SR)
    if i >= len(buf):
        return
    m = min(len(sig), len(buf) - i)
    buf[i : i + m] += sig[:m]


def epiano(freq, sec):
    t = np.arange(int(sec * SR)) / SR
    y = np.sin(2 * np.pi * freq * t) + 0.35 * np.sin(2 * np.pi * freq * 2 * t) * np.exp(-t / 0.4) + 0.12 * np.sin(2 * np.pi * freq * 3 * t) * np.exp(-t / 0.15)
    env = np.minimum(1, t / 0.012) * np.exp(-t / (sec * 0.55)) * np.minimum(1, (sec - t) / 0.08)
    return y * env


def bass(freq, sec):
    t = np.arange(int(sec * SR)) / SR
    return np.sin(2 * np.pi * freq * t) * np.minimum(1, t / 0.01) * np.exp(-t / (sec * 0.8)) * np.minimum(1, (sec - t) / 0.05)


keys, low, drums = np.zeros(n), np.zeros(n), np.zeros(n)
bar = 4 * beat
for b in range(int(dur / bar) + 1):
    t0 = b * bar
    ch, bs = CHORDS[b % 4], BASS[b % 4]
    for j, m in enumerate(ch):  # rolled chord, slight humanized timing
        add(keys, t0 + j * 0.03 + rng.uniform(0, 0.012), 0.22 * epiano(mid(m), bar * 0.95))
    add(keys, t0 + 2.5 * beat, 0.12 * epiano(mid(ch[-1] + 12), beat * 1.4))  # soft upper note on the "and" of 3
    add(low, t0, 0.5 * bass(mid(bs), beat * 1.9))
    add(low, t0 + 2 * beat, 0.4 * bass(mid(bs), beat * 1.9))
    for s in range(8):  # closed hat, off-beat accents
        th = t0 + s * beat / 2 + (0.02 if s % 2 else 0)
        h = rng.standard_normal(int(0.04 * SR)) * np.exp(-np.arange(int(0.04 * SR)) / SR / 0.008)
        add(drums, th, (0.05 if s % 2 else 0.03) * h)
    for kb in (0, 2.5):  # soft kick
        tk = np.arange(int(0.22 * SR)) / SR
        kick = np.sin(2 * np.pi * np.cumsum(120 * np.exp(-tk / 0.04) + 45) / SR) * np.exp(-tk / 0.07)
        add(drums, t0 + kb * beat, 0.35 * kick)

keys = lp(keys, 2600)
drums = lp(drums, 5000)
# slow tape wobble on the keys: one-sample-accurate resample via interpolation
wob = np.arange(n) + 14 * np.sin(2 * np.pi * 0.35 * np.arange(n) / SR)
keys = np.interp(wob, np.arange(n), keys)
crackle = np.zeros(n)
hits = rng.integers(0, n, int(dur * 6))
crackle[hits] = rng.uniform(-1, 1, len(hits)) * 0.02
hiss = lp(rng.standard_normal(n) * 0.004, 6000)

mono = keys + low + drums + crackle + hiss
echo = np.zeros(n)  # light stereo width from two short delays
echo[int(0.017 * SR) :] = mono[: n - int(0.017 * SR)]
echo2 = np.zeros(n)
echo2[int(0.029 * SR) :] = mono[: n - int(0.029 * SR)]
stereo = np.stack([mono + 0.25 * echo, mono + 0.25 * echo2], axis=1)

t = np.arange(n) / SR
fade = np.minimum(1, t / 2.0) * np.minimum(1, (dur - t) / 3.0)
stereo *= fade[:, None]
stereo = stereo / np.abs(stereo).max() * 10 ** (-3 / 20)
out = Path(__file__).resolve().parents[1] / 'public' / 'videos' / slug / 'music.wav'
out.parent.mkdir(parents=True, exist_ok=True)
wavfile.write(out, SR, np.round(stereo * 32767).astype(np.int16))
print(out, f'{n / SR:.2f}s')
