"""Synthesize the shared soft whoosh/tick/pop SFX (no samples, deterministic).

Run: .venv-kelindihan/Scripts/python.exe scripts/make-sfx.py
Out: public/kit/sfx/{whoosh,tick,pop}.wav, 48 kHz mono int16, peak -12 dBFS.
Loudness under narration is set per video via the sfxVolume prop.
"""
from pathlib import Path

import numpy as np
from scipy.io import wavfile

SR = 48000
PEAK = 10 ** (-12 / 20)
OUT = Path(__file__).resolve().parents[1] / "public" / "kit" / "sfx"
rng = np.random.default_rng(1226)


def save(name, x):
    x = x / np.abs(x).max() * PEAK
    wavfile.write(OUT / f"{name}.wav", SR, np.round(x * 32767).astype(np.int16))
    return x


def whoosh(sec=0.5):
    n = int(sec * SR)
    t = np.arange(n) / SR
    noise = rng.standard_normal(n)
    a = np.exp(-2 * np.pi * (350 * (2400 / 350) ** (t / sec)) / SR)  # sweeping one-pole lowpass
    y, s = np.empty(n), 0.0
    for i in range(n):
        s = (1 - a[i]) * noise[i] + a[i] * s
        y[i] = s
    p = t / sec
    return y * p**1.4 * (1 - p) ** 1.1


def tick(sec=0.05):
    t = np.arange(int(sec * SR)) / SR
    return np.sin(2 * np.pi * 2300 * t) * np.exp(-t / 0.006) * np.minimum(1, t / 0.0008)


def pop(sec=0.22):
    t = np.arange(int(sec * SR)) / SR
    phase = 2 * np.pi * np.cumsum(420 + 480 * np.exp(-t / 0.02)) / SR
    return np.sin(phase) * np.exp(-t / 0.035) * np.minimum(1, t / 0.002)


OUT.mkdir(parents=True, exist_ok=True)
for name, x in {"whoosh": whoosh(), "tick": tick(), "pop": pop()}.items():
    y = save(name, x)
    assert abs(np.abs(y).max() - PEAK) < 1e-9 and abs(y[-1]) < 0.01 * PEAK, name  # peak set, no click at tail
    print(name, f"{len(y) / SR:.3f}s")
