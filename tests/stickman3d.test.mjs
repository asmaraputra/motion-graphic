/*
Adapted from michxlai/stickman (vendor/stickman), MIT.
MIT License

Copyright (c) 2026 michxlai

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
import assert from 'node:assert/strict';
import test from 'node:test';
import {Scene} from 'three';
import {HERO, Person, walk3, ik3, V, createStickmanScene} from '../src/kit/stickman3d/scene.js';

const path = () => walk3({pts: [[0, 0], [0, 2], [2, 2]], t0: 1, t1: 6});

test('engine imports without a browser and walking is independent of seek order', () => {
  assert.equal(typeof createStickmanScene, 'function');
  const walk = path();
  const expected = walk.at(3.4);
  walk.at(8);
  walk.at(0);
  assert.deepEqual(walk.at(3.4), expected);
  assert.deepEqual(walk.at(0), walk.at(1));
  assert.deepEqual(walk.at(6), walk.at(8));
  assert.throws(() => walk3({pts: [[0, 0], [0, 0]], t0: 0, t1: 1}), /positive length/);
  assert.throws(() => walk3({pts: [[0, 0], [1, 0]], t0: 1, t1: 1}), /t0 < t1/);
});

test('actor poses seek exactly and keep mouth GPU geometry allocated once', () => {
  const scene = new Scene(), actor = new Person(scene, HERO), walk = path();
  const geometry = actor.mouth.geometry;
  const poseAt = time => actor.pose({...walk.at(time), face: {mouth: Math.sin(time), blink: 0.2}});
  const snapshot = () => {
    scene.updateMatrixWorld(true);
    const matrices = [];
    actor.g.traverse(object => matrices.push([...object.matrixWorld.elements]));
    return {matrices, mouth: [...geometry.attributes.position.array]};
  };
  poseAt(3.4);
  const expected = snapshot();
  poseAt(0);
  poseAt(8);
  poseAt(3.4);
  assert.deepEqual(snapshot(), expected);
  assert.equal(actor.mouth.geometry, geometry);
  actor.dispose();
});

test('actor disposal never releases resources owned by a sibling actor', () => {
  const scene = new Scene(), first = new Person(scene, HERO), second = new Person(scene, HERO);
  let released = 0;
  second.g.traverse(object => {
    object.geometry?.addEventListener('dispose', () => released++);
    object.material?.addEventListener('dispose', () => released++);
  });
  first.dispose();
  assert.equal(released, 0);
  assert.equal(second.g.parent, scene);
  second.dispose();
  assert.ok(released > 0);
});

test('degenerate IK targets retain finite joint positions', () => {
  for (const target of [V(), V(0, 1, 0)]) {
    const result = ik3(V(), target, 0.3, 0.3, V(0, 1, 0));
    assert.ok([...result.e.toArray(), ...result.h.toArray()].every(Number.isFinite));
  }
});
