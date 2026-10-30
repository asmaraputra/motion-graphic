import test from 'node:test';
import assert from 'node:assert/strict';
import {AUDIO_SECONDS, CUES, FPS, SCENES, SFX, TOTAL_FRAMES} from '../src/videos/orang-tua/timeline.ts';

test('scenes cover the whole audio without gaps', () => {
  assert.equal(SCENES[0].a, 0);
  assert.equal(SCENES.at(-1).b, AUDIO_SECONDS);
  for (let i = 1; i < SCENES.length; i++) assert.equal(SCENES[i].a, SCENES[i - 1].b, `gap before ${SCENES[i].id}`);
  for (const s of SCENES) assert.ok(s.b > s.a, `empty scene ${s.id}`);
  assert.equal(TOTAL_FRAMES, Math.round(AUDIO_SECONDS * FPS));
});

test('closing scene holds at least 1.5 s', () => {
  const last = SCENES.at(-1);
  assert.ok(last.b - CUES.SEMENTARA >= 1.5);
});

test('cues and SFX sit inside the audio; SFX at most about one per 2 s', () => {
  for (const [name, t] of Object.entries(CUES)) assert.ok(t >= 0 && t < AUDIO_SECONDS, name);
  const ts = SFX.map((s) => s.t).sort((a, b) => a - b);
  for (const t of ts) assert.ok(t >= 0 && t * FPS + 18 <= TOTAL_FRAMES, `sfx at ${t}`);
  for (let i = 1; i < ts.length; i++) assert.ok(ts[i] - ts[i - 1] >= 2, `sfx too dense at ${ts[i]}`);
});
