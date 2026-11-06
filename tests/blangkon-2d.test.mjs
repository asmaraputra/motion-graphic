import test from 'node:test';
import assert from 'node:assert/strict';

import {readFile} from 'node:fs/promises';
import ts from 'typescript';

// Exercise the actual production module with its bundler-style local import.
const source = await readFile(new URL('../src/kit/blangkon-motion.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {compilerOptions: {module: ts.ModuleKind.ESNext}}).outputText;
const workerUrl = new URL('../src/kit/worker-motion.ts', import.meta.url).href;
const rig = await import(
  `data:text/javascript;base64,${Buffer.from(compiled.replace("'./worker-motion'", JSON.stringify(workerUrl))).toString('base64')}`
);
const state = (...args) => {
  assert.equal(typeof rig.blangkonState, 'function', 'the blangkon pose resolver must exist');
  return rig.blangkonState(...args);
};

const near = (a, b, eps = 1e-6) => assert.ok(Math.abs(a - b) < eps, `${a} != ${b}`);

test('blangkon 2D: every pose resolves to finite hands and a mood', () => {
  const poses = [
    'neutral', 'wave', 'point', 'think', 'hip', 'happy', 'sad', 'angry',
    'surprised', 'walk', 'sembah', 'explain', 'bow', 'lift', 'alert',
  ];
  for (const pose of poses) {
    const s = state(1, {pose});
    assert.ok(s.mood, `pose ${pose} needs a mood`);
    for (const arm of [s.left, s.right]) {
      assert.ok(arm.hand.every(Number.isFinite), `pose ${pose} has a non-finite hand`);
      assert.ok(arm.shoulder.every(Number.isFinite));
    }
  }
  assert.equal(state(1, {pose: 'angry'}).mood, 'angry');
  assert.equal(state(1, {pose: 'think'}).mood, 'thinking');
  assert.equal(state(1, {pose: 'happy', mood: 'sad'}).mood, 'sad');
});

test('blangkon 2D: sembah cups both wrists at chest height, above the elbows', () => {
  const s = state(1, {pose: 'sembah'});
  assert.ok(Math.abs(s.left.hand[0] + s.right.hand[0]) < 1, 'wrists must mirror across the centre line');
  for (const arm of [s.left, s.right]) {
    assert.ok(arm.hand[1] > -280 && arm.hand[1] < -150, `wrist height ${arm.hand[1]} is not chest level`);
    assert.ok(arm.hand[1] < arm.elbow[1], 'wrists must sit above the elbows');
  }
});

test('blangkon 2D: walk alternates the feet without widening the stance', () => {
  const a = state(0, {pose: 'walk', walk: 0.25});
  const b = state(0, {pose: 'walk', walk: 0.75});
  assert.notEqual(a.footX[0], b.footX[0], 'feet must move across the walk cycle');
  for (const x of [...a.footX, ...b.footX]) assert.ok(Math.abs(x) <= 20, `foot offset ${x} too wide`);
  near(a.footX[0], -a.footX[1]);
  near(state(0, {pose: 'neutral'}).footX[0], 0);
});

test('blangkon 2D: state is deterministic and leaves the input alone', () => {
  const input = {pose: 'explain', walk: 0.3, look: [0.5, -0.2]};
  const a = state(2.5, input);
  const b = state(2.5, input);
  assert.deepEqual(a.left, b.left);
  assert.deepEqual(a.footX, b.footX);
  assert.deepEqual(input, {pose: 'explain', walk: 0.3, look: [0.5, -0.2]});
});

test('blangkon 2D: idleOffset shifts the blink but not the hands', () => {
  const base = state(1.2, {pose: 'neutral'});
  const offsets = Array.from({length: 60}, (_, i) => i * 0.05);
  const blinks = offsets.map((idleOffset) => state(1.2, {pose: 'neutral', idleOffset}));
  for (const s of blinks) assert.deepEqual(s.left.hand, base.left.hand, 'hands must not move with idleOffset');
  assert.ok(new Set(blinks.map((s) => s.blink)).size > 1, 'some offset must land mid-blink');
});

test('blangkon 2D: lean is reserved for the bow pose', () => {
  assert.ok(state(0, {pose: 'bow'}).lean > 10);
  near(state(0, {pose: 'neutral'}).lean, 0);
  near(state(0, {pose: 'alert'}).lean, 0);
});
