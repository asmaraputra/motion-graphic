import test from 'node:test';
import assert from 'node:assert/strict';

import {readFile} from 'node:fs/promises';
import ts from 'typescript';
// Exercise the actual production module with its bundler-style local import.
const source = await readFile(new URL('../src/kit/orang-hindu-motion.ts',import.meta.url),'utf8');
const compiled = ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext}}).outputText;
const workerUrl = new URL('../src/kit/worker-motion.ts',import.meta.url).href;
const rig = await import(`data:text/javascript;base64,${Buffer.from(compiled.replace("'./worker-motion'",JSON.stringify(workerUrl))).toString('base64')}`);
const state = (...args) => {
  assert.equal(typeof rig.orangHinduState, 'function', 'the reusable mascot pose resolver must exist');
  return rig.orangHinduState(...args);
};

test('orang-hindu: ten semantic poses resolve to usable acting and manual overrides win', () => {
  for (const pose of ['neutral','wave','point','think','hip','happy','sad','angry','surprised','walk']) {
    const s = state(1, {pose});
    assert.ok(s.mood);
    assert.equal(s.left.hand.length, 2);
    assert.ok(s.left.hand.every(Number.isFinite));
  }
  assert.equal(state(1, {pose:'angry'}).mood, 'angry');
  assert.equal(state(1, {pose:'think'}).mood, 'thinking');
  assert.equal(state(1, {pose:'happy', mood:'sad'}).mood, 'sad');
  assert.deepEqual(state(1, {pose:'point', armR:'idle'}).right, state(1).right);
});

test('orang-hindu: compact arms have fixed bones and mirrored hand anchors', () => {
  for (const pose of ['neutral','hip','point','think']) {
    const s = state(0, {pose});
    for (const a of [s.left,s.right]) {
      assert.ok(Math.abs(Math.hypot(a.elbow[0]-a.shoulder[0],a.elbow[1]-a.shoulder[1])-45.5)<1e-8);
      assert.ok(Math.abs(Math.hypot(a.hand[0]-a.elbow[0],a.hand[1]-a.elbow[1])-45.5)<1e-8);
    }
  }
  const s=state(0);
  assert.equal(s.left.shoulder[1], -210);
  assert.ok(Math.abs(s.left.hand[0]+s.right.hand[0])<1e-8);
});

test('orang-hindu: walk keeps a stance foot grounded and is deterministic', () => {
  assert.deepEqual(state(1.25,{pose:'walk'}),state(1.25,{pose:'walk'}));
  assert.notDeepEqual(state(1,{pose:'walk'}).lift,state(1.2,{pose:'walk'}).lift);
  assert.deepEqual(state(1,{pose:'walk',walk:0}).lift,[0,0]);
  for (let i=0;i<120;i++) {
    const s=state(i/30,{pose:'walk'});
    assert.equal(Math.min(...s.lift),0);
    assert.ok(Math.max(...s.lift)<=18);
    assert.equal(s.groundOffset,0);
  }
});

test('orang-hindu: happy pose keeps both hands outside the oversized face', () => {
  const s=state(1,{pose:'happy'});
  assert.ok(s.left.hand[0]<-95);
  assert.ok(s.right.hand[0]>95);
  assert.ok(s.left.hand[1]<-240);
  assert.ok(s.right.hand[1]<-240);
});

test('orang-hindu: controls clamp safely and wave moves continuously', () => {
  const s=state(NaN,{dip:Infinity,look:[99,-99],walk:NaN});
  assert.deepEqual(s.look,[1,-1]);
  assert.ok([...s.lift,...s.scale,s.upper,s.blink].every(Number.isFinite));
  const a=state(1,{pose:'wave'}), b=state(1+1/300,{pose:'wave'});
  assert.ok(Math.hypot(a.right.hand[0]-b.right.hand[0],a.right.hand[1]-b.right.hand[1])<1);
  assert.notDeepEqual(a.right.hand,state(1.2,{pose:'wave'}).right.hand);
});

test('orang-hindu: cue drive opens only inside its window and ramps in and out', () => {
  const talk = (...args) => {
    assert.equal(typeof rig.talkFromCues, 'function', 'mouth drive from cues must exist');
    return rig.talkFromCues(...args);
  };
  const cues = [[1, 1.6], [2.2, 2.9]];
  assert.equal(talk(0.5, cues), 0);
  assert.equal(talk(1.7, cues), 0);
  assert.ok(talk(1.3, cues) > 0.2);
  assert.ok(talk(1.02, cues) < talk(1.3, cues), 'entrance ramps in, never pops');
  assert.ok(talk(1.58, cues) < talk(1.3, cues), 'exit ramps out');
  assert.equal(talk(NaN, cues), 0);
  // The flap must actually move: two frames a syllable apart differ.
  assert.notEqual(talk(1.3, cues), talk(1.34, cues));
  assert.ok([0, 1, 2].every((i) => { const v = talk(1 + i * 0.05, cues); return v >= 0 && v <= 1; }));
});

test('orang-hindu: audio drive maps silence closed and speech open', () => {
  const {blockLevel, loudestLevel, mouthLevel} = rig;
  assert.equal(typeof blockLevel, 'function');
  assert.equal(typeof loudestLevel, 'function');
  assert.equal(typeof mouthLevel, 'function');
  const rate = 1000, samples = new Float32Array(rate * 2);
  for (let i = rate; i < rate * 1.5; i++) samples[i] = 0.5; // 0.5 s of "speech" inside 2 s
  const loudest = loudestLevel(samples, 80);
  assert.ok(Math.abs(loudest - 0.5) < 1e-6);
  assert.equal(mouthLevel(samples, rate, 0.2, loudest), 0, 'silence keeps the mouth shut');
  assert.ok(mouthLevel(samples, rate, 1.25, loudest) > 0.8, 'speech opens the mouth');
  assert.equal(mouthLevel(samples, rate, 1.25, 0), 0, 'no reference level means no mouth drive');
  assert.ok(mouthLevel(samples, rate, 0.98, loudest) < mouthLevel(samples, rate, 1.25, loudest));
  assert.equal(blockLevel(samples, 5, 5), 0, 'empty window is silence');
  assert.ok(mouthLevel(samples, rate, NaN, loudest) >= 0);
});
