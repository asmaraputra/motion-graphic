import test from 'node:test';
import assert from 'node:assert/strict';

// Dynamic import makes an absent rig fail as a missing behavior, not a loader crash.
const rig = await import('../src/kit/worker-motion.ts').catch(error => {
  if (error.code === 'ERR_MODULE_NOT_FOUND') return {};
  throw error;
});
const api = name => {assert.equal(typeof rig[name], 'function', `${name} must exist`); return rig[name];};

test('Worker: preserve the seven established arm poses', () => {
  assert.deepEqual(Object.keys(rig.ARM ?? {}), ['idle','hip','hold','point','raise','wave','chin']);
});
test('Worker: arm interpolation clamps endpoints and does not overshoot', () => {
  const mix=api('mixArm');
  assert.deepEqual(mix('idle','point',-0.5),rig.ARM.idle);
  assert.deepEqual(mix('idle','point',1.5),rig.ARM.point);
  assert.deepEqual(mix('idle','point',0.5),[48.5,-1.5]);
  assert.deepEqual(mix('idle','point',NaN),rig.ARM.idle);
});
test('Worker: custom arm angles remain supported', () => {
  const mix=api('mixArm');
  assert.deepEqual(mix([20,-40],[40,80],0.5),[30,20]);
});
test('Worker: elbows keep two fixed-length bones for every pose', () => {
  const armAt=api('armAt');
  for (const pose of Object.keys(rig.ARM)) for (const side of [-1,1]) {
    const a=armAt(side,pose,1.25);
    assert.ok(Math.abs(Math.hypot(a.elbow[0]-a.shoulder[0],a.elbow[1]-a.shoulder[1])-70)<1e-8);
    assert.ok(Math.abs(Math.hypot(a.hand[0]-a.elbow[0],a.hand[1]-a.elbow[1])-70)<1e-8);
  }
});
test('Worker: left and right arm poses are mirrored around the body', () => {
  const armAt=api('armAt');
  for (const pose of Object.keys(rig.ARM)) {
    const l=armAt(-1,pose,2),r=armAt(1,pose,2);
    assert.ok(Math.abs(l.hand[0]+r.hand[0])<1e-8);
    assert.equal(l.hand[1],r.hand[1]);
  }
});
test('Worker: wave is continuous and deterministic at the same timestamp', () => {
  const armAt=api('armAt');
  assert.deepEqual(armAt(1,'wave',2.5),armAt(1,'wave',2.5));
  const a=armAt(1,'wave',2.5),b=armAt(1,'wave',2.5+1/300);
  assert.ok(Math.hypot(a.hand[0]-b.hand[0],a.hand[1]-b.hand[1])<1.5);
  assert.notDeepEqual(a.hand,armAt(1,'wave',2.8).hand);
});
test('Worker: dip is clamped and squashes around a fixed floor origin', () => {
  const state=api('workerMotion');
  assert.deepEqual(state(1,{dip:-4}).scale,[1,1]);
  assert.deepEqual(state(1,{dip:4}).scale,[1.03,0.95]);
  for (const dip of [0,0.25,0.5,1]) assert.equal(state(1,{dip}).groundOffset,0);
});
test('Worker: eye direction never leaves the face and invalid controls stay finite', () => {
  const state=api('workerMotion');
  assert.deepEqual(state(1,{look:[8,-8]}).look,[1,-1]);
  const frame=state(NaN,{dip:NaN,walk:Infinity,look:[NaN,Infinity]});
  assert.deepEqual(frame.look,[0,0]);
  assert.ok([...frame.lift,...frame.scale,frame.blink,frame.upper].every(Number.isFinite));
});
test('Worker: blink closes smoothly and is not driven by changing screen x', () => {
  const state=api('workerMotion');
  let previous=state(0).blink;
  for (let i=1;i<=1500;i++) {
    const value=state(i/300).blink;
    assert.ok(value>=0.15-1e-8 && value<=1);
    assert.ok(Math.abs(value-previous)<0.06, `abrupt blink at ${i/300}`);
    previous=value;
  }
  assert.notEqual(state(2.2,{idleOffset:0}).blink,state(2.2,{idleOffset:0.5}).blink);
});
test('Worker: a stance foot remains grounded through the walk cycle', () => {
  const state=api('workerMotion');
  for (let i=0;i<=60;i++) {
    const frame=state(i/30,{walk:i/60});
    assert.ok(Math.min(...frame.lift)<1e-8);
    assert.ok(Math.max(...frame.lift)<=18);
  }
});
