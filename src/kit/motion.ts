import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

export const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const EASE = {
  out: Easing.bezier(0.22, 1, 0.36, 1),
  in: Easing.bezier(0.5, 0, 0.75, 0),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  /** Small overshoot then settle. */
  pop: Easing.bezier(0.34, 1.45, 0.64, 1),
};

/** Clamped keyframe in seconds: `from` at time a, `to` at time b. */
export const k = (t: number, a: number, b: number, from: number, to: number, easing = EASE.out) =>
  interpolate(t, [a, b], [from, to], {...CLAMP, easing});

/** 0 → 1 → 0 lifecycle: enters at a, fully gone at b. */
export const life = (t: number, a: number, b: number, fin = 0.35, fout = 0.3) =>
  Math.min(k(t, a, a + fin, 0, 1), k(t, b - fout, b, 1, 0, EASE.in));

export const lerp = (a: number, b: number, u: number) => a + (b - a) * u;

/** Current composition time in seconds. */
export const useT = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return frame / fps;
};
