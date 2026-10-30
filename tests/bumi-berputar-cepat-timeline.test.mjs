import test from 'node:test';
import assert from 'node:assert/strict';
import * as timeline from '../src/videos/bumi-berputar-cepat/timeline.ts';
import {readWavInfo} from '../scripts/lib/wav.mjs';

// Catch gaps, late endings, or accidental changes to the uncut narration duration.
test('bumi-berputar-cepat: scenes cover every narration frame without gaps', () => {
  const wav = readWavInfo('public/videos/bumi-berputar-cepat/narration.wav');
  assert.equal(timeline.TOTAL_FRAMES, Math.ceil(wav.seconds * timeline.FPS));
  assert.ok(Math.abs(timeline.AUDIO_SECONDS - wav.seconds) < 0.000001);
  assert.equal(timeline.SCENES[0].a, 0);
  for (const [i, scene] of timeline.SCENES.entries()) {
    assert.ok(scene.b > scene.a, scene.id);
    if (i) assert.equal(scene.a, timeline.SCENES[i - 1].b, scene.id);
  }
  assert.equal(timeline.SCENES.at(-1).b, timeline.AUDIO_SECONDS);
  const closing = timeline.SCENES.at(-1);
  assert.ok(closing.b - closing.a >= 1.5, 'closing/CTA must stay at least 1.5 s');
});

// Catch subtitle lines that flash by, overlap, or run past the audio.
test('bumi-berputar-cepat: subtitles are ordered, readable and inside the audio', () => {
  for (const [i, sub] of timeline.SUBS.entries()) {
    assert.ok(sub.text.trim().length > 0);
    assert.ok(sub.b - sub.a >= 1, `too short: ${sub.text}`);
    assert.ok(sub.a >= 0 && sub.b <= timeline.AUDIO_SECONDS, sub.text);
    if (i) assert.equal(sub.a, timeline.SUBS[i - 1].b, sub.text);
  }
  assert.equal(timeline.SUBS.at(-1).b, timeline.AUDIO_SECONDS);
});

// Catch accents on speech instead of in a pause, and excessive SFX density.
test('bumi-berputar-cepat: accents are sparse, bounded and inside measured pauses', () => {
  assert.ok(timeline.SFX.length > 0, 'sound design is missing');
  for (const [i, sfx] of timeline.SFX.entries()) {
    assert.ok(sfx.t >= 0 && sfx.t + 0.6 <= timeline.AUDIO_SECONDS);
    if (i) assert.ok(sfx.t - timeline.SFX[i - 1].t >= 2, `dense accent ${sfx.t}`);
    assert.ok(timeline.SFX_WINDOWS.some(([a, b]) => sfx.t >= a && sfx.t <= b), `accent on speech ${sfx.t}`);
  }
});
