import test from 'node:test';
import assert from 'node:assert/strict';
import {Scene} from 'three';
import {BlangkonCharacter} from '../src/kit/stickman3d/blangkon-character.js';
import {gesturePose} from '../src/kit/stickman3d/blangkon-motion.js';
import {ANK, STAND, walk3} from '../src/kit/stickman3d/scene.js';

const standing = () => ({
  pos: [0, STAND, 0], yaw: 0,
  feet: {l: [0.13, ANK, 0], r: [-0.13, ANK, 0]},
  face: {talk: 0.4},
});

test('salam brings hands together without exceeding arm reach', () => {
  const actor = new BlangkonCharacter(new Scene());
  try {
    const base = standing();
    const result = actor.pose(gesturePose(base, 'salam', 1));
    assert.ok(result.l.hand.distanceTo(result.r.hand) < 0.1, 'both hands should meet');
    assert.ok(result.l.over < 0.01 && result.r.over < 0.01, 'hands must be reachable');
    assert.equal(base.face.talk, 0.4);
  } finally {actor.dispose();}
});

test('wave moves the raised hand and seeks to the same pose', () => {
  const actor = new BlangkonCharacter(new Scene());
  try {
    const at = (t) => actor.pose(gesturePose(standing(), 'wave', t)).r.hand.clone();
    const first = at(0.5);
    const next = at(0.75);
    assert.ok(first.distanceTo(next) > 0.01, 'waving should move the hand');
    assert.ok(first.y > 1.05, 'waving hand should be raised');
    at(2);
    assert.ok(first.distanceTo(at(0.5)) < 1e-9, 'seek must reproduce the same pose');
  } finally {actor.dispose();}
});

test('walk gesture preserves the walking path and visible arm swing', () => {
  const walk = walk3({pts: [[-1, 0], [1, 0]], t0: 0, t1: 6, stride: 0.35});
  const actor = new BlangkonCharacter(new Scene());
  try {
    const a = gesturePose(walk.at(2), 'walk', 2);
    const b = gesturePose(walk.at(3), 'walk', 3);
    assert.ok(b.pos[0] > a.pos[0]);
    const handA = actor.pose(a).r.hand.clone();
    const handB = actor.pose(b).r.hand.clone();
    assert.ok(handA.distanceTo(handB) > 0.05);
    assert.ok(Number.isFinite(handB.x));
  } finally {actor.dispose();}
});

test('point and explain keep their targets reachable without mutating the base pose', () => {
  const actor = new BlangkonCharacter(new Scene());
  try {
    const base = standing();
    const original = globalThis.structuredClone(base);
    const idle = actor.pose(gesturePose(base, 'idle', 1));
    const point = actor.pose(gesturePose(base, 'point', 1));
    const explain = actor.pose(gesturePose(base, 'explain', 1));
    assert.ok(point.r.hand.x < idle.r.hand.x - 0.1, 'point should extend outward');
    assert.ok(explain.l.hand.z > idle.l.hand.z + 0.1);
    assert.ok(explain.r.hand.z > idle.r.hand.z + 0.1);
    for (const pose of [point, explain]) {
      assert.ok(pose.l.over < 0.01 && pose.r.over < 0.01, 'gesture must stay within arm reach');
    }
    assert.deepEqual(base, original);
  } finally {actor.dispose();}
});

test('walking foot stays planted during consecutive stance frames', () => {
  const walk = walk3({pts: [[-1, 0], [1, 0]], t0: 0, t1: 6, stride: 0.35});
  let previous = walk.at(1);
  let checked = 0;
  for (let frame = 31; frame <= 150; frame++) {
    const current = walk.at(frame / 30);
    for (const side of ['l', 'r']) {
      const a = previous.feet[side];
      const b = current.feet[side];
      if (Math.abs(a[1] - ANK) < 1e-8 && Math.abs(b[1] - ANK) < 1e-8) {
        assert.ok(Math.hypot(a[0] - b[0], a[2] - b[2]) < 1e-8, `${side} foot slipped`);
        checked++;
      }
    }
    previous = current;
  }
  assert.ok(checked > 0, 'walking must include stance frames');
});
