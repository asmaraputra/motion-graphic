import test from 'node:test';
import assert from 'node:assert/strict';
import {CUES, SFX, TOTAL_FRAMES, dayHours} from '../src/compositions/kerja12/timeline.ts';

const near = (a, b, eps = 1e-6) => assert.ok(Math.abs(a - b) < eps, `${a} != ${b}`);

test('day always totals 24 hours', () => {
  for (let t = 0; t <= 95; t += 0.1) {
    const h = dayHours(t);
    near(Object.values(h).reduce((s, v) => s + v, 0), 24);
    for (const v of Object.values(h)) assert.ok(v >= -1e-9, `negative block at ${t}`);
  }
});

test('brief arithmetic holds at the spoken cues', () => {
  const at14 = dayHours(CUES.TOTAL_14H);
  near(at14.work + at14.commute + at14.prep, 14);
  const at2 = dayHours(CUES.REMAINING_2H);
  near(at2.sleep, 8);
  near(at2.free, 2);
});

test('emergencies take only from sleep; work and free time stay fixed', () => {
  const before = dayHours(CUES.EMERGENCY);
  const after = dayHours(80);
  near(after.work, 12);
  near(after.free, before.free);
  near(after.sleep + after.emergency, 8);
  assert.ok(after.emergency > 0 && after.sleep < 8);
});

test('every SFX lands inside the audio', () => {
  for (const s of SFX) assert.ok(s.t >= 0 && s.t * 30 + 18 <= TOTAL_FRAMES, `sfx at ${s.t}`);
});
