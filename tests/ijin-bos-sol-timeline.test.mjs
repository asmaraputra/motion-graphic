import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const story = JSON.parse(fs.readFileSync('src/videos/ijin-bos-sol/story.json', 'utf8'));

test('ijin-bos-sol: sparse sound cues leave at least two seconds between attacks', () => {
  const cues = story.shots.flatMap((shot) => (shot.sfx || []).map((cue) => shot.start + cue.at)).sort((a, b) => a - b);
  for (let i = 1; i < cues.length; i++) {
    assert.ok(cues[i] - cues[i - 1] >= 2, `crowded SFX: ${cues[i - 1]}s and ${cues[i]}s`);
  }
});

test('ijin-bos-sol: final question has a readable hold inside the unextended voiceover', () => {
  const final = story.shots.at(-1);
  // The question enters at local 0.25s over 0.45s; the global fade starts 0.4s before the end.
  assert.ok(final.end - final.start - 0.25 - 0.45 - story.fadeOut >= 1.5);
});
