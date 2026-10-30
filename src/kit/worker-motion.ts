/** Deterministic Worker rig, shared by the SVG artwork and attachment calculations. */
export const ARM = {
  idle: [12, -8], hip: [40, -80], hold: [10, -100], point: [85, 5],
  raise: [165, 10], wave: [140, 30], chin: [-71, 234],
} as const satisfies Record<string, readonly [number, number]>;
export type WorkerArm = keyof typeof ARM | readonly [number, number];

const finite = (n: number, fallback = 0) => Number.isFinite(n) ? n : fallback;
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, finite(n)));
const angles = (a: WorkerArm) => typeof a === 'string' ? ARM[a] : a;

/** Linear blend, with bounded input. Apply the scene's easing to u before calling. */
export const mixArm = (a: WorkerArm, b: WorkerArm, u: number): readonly [number, number] => {
  const from = angles(a), to = angles(b), k = clamp(u, 0, 1);
  return [from[0] + (to[0] - from[0]) * k, from[1] + (to[1] - from[1]) * k];
};

/** Two fixed-length bones; side is local SVG left (-1) or right (+1). */
export const armAt = (side: -1 | 1, pose: WorkerArm, time = 0) => {
  const t = finite(time), [baseShoulder, baseElbow] = angles(pose);
  const waving = pose === 'wave';
  const a1 = finite(baseShoulder) + (waving ? Math.sin(t * 3.5) * 1.8 : 0);
  const a2 = finite(baseElbow) + (waving ? Math.sin(t * 7) * 14 + Math.sin(t * 3.5 - 0.4) * 3 : 0);
  const r1 = a1 * Math.PI / 180, r2 = (a1 + a2) * Math.PI / 180;
  const shoulder: readonly [number, number] = [56 * side, -300];
  const elbow: readonly [number, number] = [shoulder[0] + 70 * Math.sin(r1) * side, shoulder[1] + 70 * Math.cos(r1)];
  const hand: readonly [number, number] = [elbow[0] + 70 * Math.sin(r2) * side, elbow[1] + 70 * Math.cos(r2)];
  return {shoulder, elbow, hand, d: `M${shoulder.join(' ')} L${elbow.join(' ')} L${hand.join(' ')}`};
};

export type WorkerMotionInput = {
  walk?: number;
  dip?: number;
  look?: readonly [number, number];
  /** Stable per-character idle offset in seconds. Do not derive this from moving x. */
  idleOffset?: number;
};

export const workerMotion = (time: number, {walk = 0, dip = 0, look = [0, 0], idleOffset = 0}: WorkerMotionInput = {}) => {
  const t = finite(time), offset = finite(idleOffset);
  const phase = ((t + offset + 1.6) % 3.7 + 3.7) % 3.7;
  // Smooth close/open with zero velocity at the ends of the blink window.
  const blink = phase < 0.18 ? 1 - 0.85 * Math.sin(Math.PI * phase / 0.18) ** 2 : 1;
  const step = Math.sin(finite(walk) * Math.PI * 2);
  const lift: readonly [number, number] = [Math.max(0, step) ** 2 * 18, Math.max(0, -step) ** 2 * 18];
  const amount = clamp(dip, 0, 1);
  const scale: readonly [number, number] = [1 + 0.03 * amount, 1 - 0.05 * amount];
  const upper = -2.4 * Math.sin(t * 2.1 + offset) - 0.6 * Math.sin(t * 1.05 + offset) - (lift[0] + lift[1]) * 0.35;
  return {blink, lift, scale, upper, groundOffset: 0, dip: amount,
    look: [clamp(look[0], -1, 1), clamp(look[1], -1, 1)] as const};
};
