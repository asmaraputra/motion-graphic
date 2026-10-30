import test from 'node:test';
import assert from 'node:assert/strict';
import {AUDIO_SECONDS, CUES, FPS, SFX, TITLES, TOTAL_FRAMES} from '../src/videos/eskalator/timeline.ts';

test('frames match audio and titles stay inside it, in order, without overlap', () => {
  assert.equal(TOTAL_FRAMES, Math.round(AUDIO_SECONDS * FPS));
  for (let i = 0; i < TITLES.length; i++) {
    const q = TITLES[i];
    assert.ok(q.a >= 0 && q.b > q.a, `bad window at ${q.a}`);
    assert.ok(q.b - q.a >= 1, `title at ${q.a} shows under 1 s`);
    if (i > 0) assert.ok(q.a >= TITLES[i - 1].b - 0.05, `titles overlap at ${q.a}`);
  }
});

test('closing title holds at least 1.5 s after the punchline starts', () => {
  assert.ok(AUDIO_SECONDS - CUES.SEPARUH >= 1.5);
  assert.ok(TITLES.at(-1).b >= AUDIO_SECONDS - 0.5);
});

test('cues and SFX sit inside the audio; SFX at most one per 2 s', () => {
  for (const [name, t] of Object.entries(CUES)) assert.ok(t >= 0 && t < AUDIO_SECONDS, name);
  const ts = SFX.map((s) => s.t).sort((a, b) => a - b);
  for (const t of ts) assert.ok(t >= 0 && t * FPS + 18 <= TOTAL_FRAMES, `sfx at ${t}`);
  for (let i = 1; i < ts.length; i++) assert.ok(ts[i] - ts[i - 1] >= 2, `sfx too dense at ${ts[i]}`);
});
