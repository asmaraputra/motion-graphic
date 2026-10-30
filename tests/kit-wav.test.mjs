import test from 'node:test';
import assert from 'node:assert/strict';
import {readWavInfo} from '../scripts/lib/wav.mjs';

// This file carries an extra non-data chunk that the parser must skip.
test('reads sample count past unknown chunks', () => {
  const info = readWavInfo('public/kerja12/kerja-12jam.wav');
  assert.deepEqual([info.channels, info.sampleRate, info.samples, info.seconds], [1, 24000, 2280000, 95]);
});
