import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {readWavInfo} from '../scripts/lib/wav.mjs';
import {getShot} from '../src/kit2d/engine/core.js';
import '../src/videos/perasaan-pegawai/scenes/index.js';

const story = JSON.parse(fs.readFileSync('src/videos/perasaan-pegawai/story.json', 'utf8'));
const wav = readWavInfo('public/videos/perasaan-pegawai/narration.wav');

test('perasaan-pegawai: twelve shots cover the untouched narration', () => {
  assert.equal(story.shots.length, 12);
  assert.equal(story.duration, wav.seconds);
  assert.equal(story.shots[0].start, 0);
  assert.equal(story.shots.at(-1).end, wav.seconds);
  for (let i = 0; i < story.shots.length; i++) {
    const shot = story.shots[i];
    assert.ok(shot.end > shot.start);
    if (i) assert.equal(shot.start, story.shots[i - 1].end);
  }
});
test('perasaan-pegawai: all twelve scenes are implemented, with no cross-kit imports', () => {
  assert.equal(story.shots.length, 12);
  for (const shot of story.shots) {
    assert.equal(getShot(shot.id)?.kind, '2d', `missing ${shot.id}`);
  }
  for (const file of fs.readdirSync('src/videos/perasaan-pegawai/scenes/shots')) {
    assert.doesNotMatch(fs.readFileSync(`src/videos/perasaan-pegawai/scenes/shots/${file}`, 'utf8'), /kit\//);
  }
});
test('perasaan-pegawai: sparse sound design stays inside audio and away from keyword windows', () => {
  const cues = story.shots.flatMap(s => (s.sfx ?? []).map(c => ({...c, t: s.start + c.at}))).sort((a,b) => a.t - b.t);
  assert.ok(cues.length >= 12);
  for (let i = 0; i < cues.length; i++) {
    assert.ok(cues[i].t >= 0 && cues[i].t + cues[i].dur <= wav.seconds + 0.001);
    if (i) assert.ok(cues[i].t - cues[i - 1].t >= 1.999, `crowded at ${cues[i].t}`);
  }
  for (const [a,b] of [[14.65,16.65],[73.16,74.8],[87.23,89.7],[93.5,94.18]]) {
    assert.ok(cues.every(c => c.t + c.dur <= a || c.t >= b), `SFX conflicts with protected quote ${a}..${b}`);
  }
});
test('perasaan-pegawai: final question holds before punchline, hook has no blackout', () => {
  const end = story.shots.at(-1);
  assert.ok(end, 'ending missing');
  assert.ok(end.end - end.start - end.params.questionAt >= 1.5);
  assert.equal(end.start + end.params.penAt, 93.55);
  assert.equal(story.fadeIn, 0);
  assert.equal(story.fadeOut, 0);
  assert.equal(story.style, 'dusk');
  assert.equal(story.captions, false);
});
