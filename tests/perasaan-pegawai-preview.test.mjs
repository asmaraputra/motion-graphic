import test from 'node:test';
import assert from 'node:assert/strict';
import {getShot} from '../src/kit2d/engine/core.js';
import '../src/videos/perasaan-pegawai/scenes/index.js';

for (const id of ['pp01', 'pp07', 'pp10']) {
  test(`perasaan-pegawai preview: ${id} provides a real 2D drawing`, () => {
    const shot = getShot(id);
    assert.ok(shot, `${id} is not implemented`);
    assert.equal(shot.kind, '2d');
    assert.equal(typeof shot.draw, 'function');
  });
}
