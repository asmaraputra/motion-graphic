import {armAt, workerMotion, type WorkerArm, type WorkerMotionInput} from './worker-motion';

export type BlangkonMood = 'neutral' | 'happy' | 'sad' | 'angry' | 'surprised' | 'thinking';
export type BlangkonPose =
  | 'neutral'
  | 'wave'
  | 'point'
  | 'think'
  | 'hip'
  | 'happy'
  | 'sad'
  | 'angry'
  | 'surprised'
  | 'walk'
  | 'sembah'
  | 'explain'
  | 'bow'
  | 'lift'
  | 'alert';

export type BlangkonMotionInput = WorkerMotionInput & {
  pose?: BlangkonPose;
  mood?: BlangkonMood;
  armL?: WorkerArm;
  armR?: WorkerArm;
};

type Preset = {
  mood: BlangkonMood;
  l: WorkerArm;
  r: WorkerArm;
  /** Absolute hand targets (local units, shoulders at ±52/-292) when the rig cannot reach them. */
  hands?: {l?: readonly [number, number]; r?: readonly [number, number]};
  /** Extra torso lean in degrees, positive bows forward. */
  lean?: number;
};

const POSES: Record<BlangkonPose, Preset> = {
  neutral: {mood: 'neutral', l: 'idle', r: 'idle'},
  wave: {mood: 'happy', l: 'idle', r: 'wave'},
  point: {mood: 'neutral', l: 'hip', r: [74, 4]},
  think: {mood: 'thinking', l: 'hip', r: 'chin'},
  hip: {mood: 'neutral', l: 'hip', r: 'hip'},
  happy: {mood: 'happy', l: [128, 4], r: [128, 4]},
  sad: {mood: 'sad', l: 'idle', r: 'idle'},
  angry: {mood: 'angry', l: 'hip', r: 'hip'},
  surprised: {mood: 'surprised', l: 'hold', r: 'hold'},
  walk: {mood: 'neutral', l: 'idle', r: 'idle'},
  // Palms together in front of the chest.
  sembah: {mood: 'neutral', l: 'hold', r: 'hold', hands: {l: [-22, -250], r: [22, -250]}},
  // Both arms open toward the listener.
  explain: {mood: 'neutral', l: [62, -26], r: [62, -26]},
  bow: {mood: 'neutral', l: 'hold', r: 'hold', lean: 22},
  // Both hands cupped under a lifted object.
  lift: {mood: 'neutral', l: 'hold', r: 'hold', hands: {l: [-42, -246], r: [42, -246]}},
  alert: {mood: 'neutral', l: [42, -34], r: [42, -34]},
};

/** Shoulder joint in this rig's local units, matching the jacket's top corners. */
const SHOULDER: Record<'-1' | '1', readonly [number, number]> = {'-1': [-48, -288], 1: [48, -288]};

const compact = (side: -1 | 1, pose: WorkerArm, time: number) => {
  const arm = armAt(side, pose, time);
  const shoulder = SHOULDER[side === -1 ? '-1' : '1'];
  // Worker's elbow/hand are absolute; convert them to offsets from this rig's shoulder.
  const elbow = [shoulder[0] + (arm.elbow[0] - arm.shoulder[0]) * 0.74, shoulder[1] + (arm.elbow[1] - arm.shoulder[1]) * 0.74] as const;
  const hand = [shoulder[0] + (arm.hand[0] - arm.shoulder[0]) * 0.74, shoulder[1] + (arm.hand[1] - arm.shoulder[1]) * 0.74] as const;
  return {shoulder, elbow, hand};
};

const segment = (from: readonly [number, number], elbow: readonly [number, number], to: readonly [number, number]) =>
  `M${from.join(' ')} Q${elbow.join(' ')} ${to.join(' ')}`;

/** Deterministic rig for the 2D blangkon mascot, sharing Worker's skeleton and blink. */
export const blangkonState = (time: number, input: BlangkonMotionInput = {}) => {
  const t = Number.isFinite(time) ? time : 0;
  const {pose = 'neutral', mood, armL, armR, idleOffset = 0, ...motionInput} = input;
  const preset = POSES[pose] ?? POSES.neutral;
  const walk = motionInput.walk ?? (pose === 'walk' ? t * 1.5 : 0);
  const motion = workerMotion(t, {...motionInput, walk, idleOffset});
  const clock = t + (Number.isFinite(idleOffset) ? idleOffset : 0);
  const swing = Math.sin(walk * Math.PI * 2) * 26;

  const side = (dir: -1 | 1, arm: WorkerArm, target?: readonly [number, number]) => {
    const rest = compact(dir, arm, clock);
    if (!target) return {shoulder: rest.shoulder, elbow: rest.elbow, hand: rest.hand, d: segment(rest.shoulder, rest.elbow, rest.hand)};
    const shoulder = SHOULDER[dir === -1 ? '-1' : '1'];
    // Elbow rides out and below the wrist, so a raised hand still reads as a bent arm.
    const elbow = [
      shoulder[0] + (target[0] - shoulder[0]) * 0.5 + dir * 14,
      Math.max(target[1] + 20, shoulder[1] + (target[1] - shoulder[1]) * 0.5 + 18),
    ] as const;
    return {shoulder, elbow, hand: target, d: segment(shoulder, elbow, target)};
  };

  // Front view cannot show fore/aft swing, so the hands travel out and up with the step.
  const walkHand = (dir: -1 | 1) => [SHOULDER[dir === -1 ? '-1' : '1'][0] + dir * (44 + Math.abs(swing) * 0.4) + swing * 0.3, -206 + swing * 0.8] as const;
  /** Alternating foot offset, so the stance reads as a step from the front. */
  const stepX = Math.sin(walk * Math.PI * 2) * 16;
  const handsFor = (dir: -1 | 1, poseHands?: readonly [number, number]) =>
    pose === 'walk' ? walkHand(dir) : poseHands;

  return {
    ...motion,
    mood: mood ?? preset.mood,
    lean: preset.lean ?? 0,
    left: side(-1, armL ?? preset.l, handsFor(-1, preset.hands?.l)),
    right: side(1, armR ?? preset.r, handsFor(1, preset.hands?.r)),
    footX: [pose === 'walk' ? -stepX : 0, pose === 'walk' ? stepX : 0] as const,
  };
};
