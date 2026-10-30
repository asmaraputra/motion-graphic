import test from 'node:test';
import assert from 'node:assert/strict';
import {recapLayers} from '../src/videos/bumi-berputar/recap-motion.ts';

// A visible globe must rotate in place, not fall through the bottom behind the house.
test('bumi recap: the visible Earth does not translate or get clipped during the handoff', () => {
  for (const progress of [0, 0.1, 0.25, 0.5, 0.75, 1]) {
    const layer = recapLayers(progress);
    if (layer.earthOpacity > 0) assert.equal(layer.earthY, 1130, `falling globe at progress ${progress}`);
  }
});

// Two incompatible scales must not overlap as if the house is on top of the globe.
test('bumi recap: the house enters only after Earth and its observer cone have left', () => {
  for (let frame = 0; frame <= 60; frame++) {
    const layer = recapLayers(frame / 60);
    assert.ok(!(layer.earthOpacity > 0 && layer.roofOpacity > 0), `planet/house overlap at ${frame}`);
    if (layer.roofOpacity > 0) {
      assert.equal(layer.roofX, -90);
      assert.equal(layer.roofY, 0);
    }
  }
  assert.equal(recapLayers(0).earthOpacity, 1);
  assert.equal(recapLayers(0).roofOpacity, 0);
  assert.equal(recapLayers(1).earthOpacity, 0);
  assert.equal(recapLayers(1).roofOpacity, 1);
});
