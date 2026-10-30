import test from 'node:test';
import assert from 'node:assert/strict';
import {AUDIO_SECONDS, CUES, FPS, SCENES, SFX, TOTAL_FRAMES} from '../src/videos/produksi-plywood/timeline.ts';

test('scenes cover the whole audio without gaps', () => {
  assert.equal(SCENES[0].a, 0);
  assert.equal(SCENES.at(-1).b, AUDIO_SECONDS);
  for (let i = 1; i < SCENES.length; i++) assert.equal(SCENES[i].a, SCENES[i - 1].b, `gap before ${SCENES[i].id}`);
  for (const s of SCENES) assert.ok(s.b > s.a, `empty scene ${s.id}`);
  assert.equal(TOTAL_FRAMES, Math.ceil(AUDIO_SECONDS * FPS));
});

test('closing line holds at least 1.5 s', () => {
  // The closing title appears at 74.25 s (just before "bukan") and stays to the end.
  assert.ok(AUDIO_SECONDS - 74.25 >= 1.5);
  assert.ok(CUES.BUKAN >= 74.25 - 0.2);
});

test('cues are ordered and inside the audio; SFX at least 2 s apart', () => {
  const ts = Object.values(CUES);
  for (const [name, t] of Object.entries(CUES)) assert.ok(t >= 0 && t < AUDIO_SECONDS, name);
  for (let i = 1; i < ts.length; i++) assert.ok(ts[i] >= ts[i - 1], `cue out of order at ${Object.keys(CUES)[i]}`);
  const sfx = SFX.map((s) => s.t).sort((a, b) => a - b);
  for (const t of sfx) assert.ok(t >= 0 && t * FPS + 18 <= TOTAL_FRAMES, `sfx at ${t}`);
  for (let i = 1; i < sfx.length; i++) assert.ok(sfx[i] - sfx[i - 1] >= 2, `sfx too dense at ${sfx[i]}`);
});
