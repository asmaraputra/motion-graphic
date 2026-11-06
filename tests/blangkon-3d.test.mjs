import test from 'node:test';
import assert from 'node:assert/strict';
import {Raycaster, Scene, Vector3} from 'three';

const create = async () => {
  const {BlangkonCharacter} = await import('../src/kit/stickman3d/blangkon-character.js');
  return new BlangkonCharacter(new Scene());
};

const pose = (talk) => ({
  pos: [0, 0.72, 0], yaw: 0,
  feet: {l: [-0.13, 0.07, 0], r: [0.13, 0.07, 0]},
  face: {mouth: 0, talk},
});

const mouthBounds = (character) => {
  character.speechMouth.geometry.computeBoundingBox();
  const {min, max} = character.speechMouth.geometry.boundingBox;
  return {top: max.y, bottom: min.y};
};

test('speech opens downward while keeping the upper lip in place', async () => {
  const character = await create();
  try {
    character.pose(pose(0));
    const closed = mouthBounds(character);
    character.pose(pose(1));
    const open = mouthBounds(character);
    assert.ok(Math.abs(open.top - closed.top) < 0.005, 'upper lip must not travel toward the nose');
    assert.ok(open.bottom < closed.bottom - 0.01, 'lower lip must open downward');
    assert.ok(open.bottom > closed.bottom - 0.09, 'mouth must remain proportional to the head');
  } finally {character.dispose();}
});

test('speech state clamps and is deterministic after seeking', async () => {
  const character = await create();
  try {
    character.pose(pose(0.5));
    const halfway = mouthBounds(character);
    character.pose(pose(1));
    character.pose(pose(0.5));
    assert.deepEqual(mouthBounds(character), halfway);
    character.pose(pose(5));
    const max = mouthBounds(character);
    character.pose(pose(1));
    assert.deepEqual(mouthBounds(character), max);
  } finally {character.dispose();}
});

test('open mouth stays in front of the head surface across its visible area', async () => {
  const character = await create();
  const ray = new Raycaster();
  try {
    for (const talk of [0.25, 0.5, 0.75, 1]) {
      character.pose(pose(talk));
      character.head.updateMatrixWorld(true);
      const head = character.head.children[0];
      const direction = new Vector3(0, 0, -1).transformDirection(character.head.matrixWorld);
      let sampled = 0;
      for (let y = -0.15; y < -0.087; y += 0.002) {
        for (let x = -0.062; x <= 0.062; x += 0.002) {
          ray.set(character.head.localToWorld(new Vector3(x, y, 1)), direction);
          const [mouth] = ray.intersectObject(character.speechMouth);
          const [skin] = ray.intersectObject(head);
          if (!mouth || !skin) continue;
          sampled++;
          assert.ok(mouth.distance < skin.distance, `skin intersects mouth at talk=${talk}, x=${x}, y=${y}`);
        }
      }
      assert.ok(sampled > 0, `no mouth samples at talk=${talk}`);
    }
  } finally {character.dispose();}
});
