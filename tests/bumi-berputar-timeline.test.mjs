import test from 'node:test';
import assert from 'node:assert/strict';
import * as timeline from '../src/videos/bumi-berputar/timeline.ts';
import {readWavInfo} from '../scripts/lib/wav.mjs';

// Catch gaps, late endings, or accidental changes to the uncut narration duration.
test('bumi: scenes cover every narration frame without gaps', () => {
  const wav = readWavInfo('public/videos/bumi-berputar/narration.wav');
  assert.equal(timeline.TOTAL_FRAMES, Math.ceil(wav.seconds * timeline.FPS));
  assert.ok(Math.abs(timeline.AUDIO_SECONDS - wav.seconds) < 0.000001);
  assert.ok(Array.isArray(timeline.SCENES), 'authored scenes are missing');
  assert.equal(timeline.SCENES[0].a, 0);
  for (const [i, scene] of timeline.SCENES.entries()) {
    assert.ok(scene.b > scene.a, scene.id);
    if (i) assert.equal(scene.a, timeline.SCENES[i - 1].b, scene.id);
  }
  assert.equal(timeline.SCENES.at(-1).b, timeline.AUDIO_SECONDS);
});

// Catch unreadable or overlapping keyword windows and a truncated closing CTA.
test('bumi: keyword holds are readable, nonoverlapping and closing stays >=1.5s', () => {
  assert.ok(Array.isArray(timeline.TITLES), 'keyword timing is missing');
  for (const [i, title] of timeline.TITLES.entries()) {
    assert.ok(title.b - title.a >= 1.7, title.lines.join(' '));
    assert.ok(title.a >= 0 && title.b <= timeline.AUDIO_SECONDS);
    if (i) assert.ok(title.a >= timeline.TITLES[i - 1].b);
  }
  const closing = timeline.TITLES.at(-1);
  assert.ok(closing.b >= timeline.AUDIO_SECONDS - 0.05);
  assert.ok(closing.b - closing.a - 0.7 >= 1.5);
});

// Catch accents on speech instead of in a pause, and excessive SFX density.
test('bumi: accents are sparse, bounded and mapped to pause windows', () => {
  assert.ok(timeline.SFX.length > 0, 'sound design is missing');
  for (const [i, sfx] of timeline.SFX.entries()) {
    assert.ok(sfx.t >= 0 && sfx.t + 0.6 <= timeline.AUDIO_SECONDS);
    if (i) assert.ok(sfx.t - timeline.SFX[i - 1].t >= 2);
    assert.ok(timeline.SFX_WINDOWS.some(([a, b]) => sfx.t >= a && sfx.t <= b), `unapproved accent ${sfx.t}`);
  }
});
