import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {getShot} from '../src/kit2d/engine/core.js';
import {readWavInfo} from '../scripts/lib/wav.mjs';

// Every Kerangka B video (src/videos/<slug>/story.json) that already has shots.
const videos = fs
  .readdirSync('src/videos')
  .filter((slug) => fs.existsSync(path.join('src/videos', slug, 'story.json')))
  .map((slug) => ({slug, story: JSON.parse(fs.readFileSync(path.join('src/videos', slug, 'story.json'), 'utf8'))}))
  .filter(({story}) => story.shots.length > 0);

for (const {slug, story} of videos) {
  test(`${slug}: shots tile the whole video without gaps`, () => {
    const {shots} = story;
    assert.equal(shots[0].start, 0);
    assert.equal(shots.at(-1).end, story.duration);
    for (let i = 1; i < shots.length; i++) assert.equal(shots[i].start, shots[i - 1].end, `gap before ${shots[i].id}`);
    for (const s of shots) assert.ok(s.end > s.start, `${s.id} has no length`);
    const narration = path.join('public/videos', slug, 'narration.wav');
    if (fs.existsSync(narration)) assert.ok(Math.abs(readWavInfo(narration).seconds - story.duration) < 1e-3, 'duration must equal the narration');
  });

  test(`${slug}: every shot has a 2D scene module and SFX stay inside the video`, async () => {
    await import(pathToFileURL(path.resolve('src/videos', slug, 'scenes/index.js')).href);
    for (const s of story.shots) {
      const def = getShot(s.id);
      assert.ok(def, `missing registerShot('${s.id}')`);
      assert.equal(def.kind, '2d', `${s.id}: 3D shots are not supported`);
      for (const c of s.sfx ?? []) assert.ok(s.start + c.at >= 0 && s.start + c.at < story.duration, `${s.id} sfx at ${c.at}`);
    }
  });
}
