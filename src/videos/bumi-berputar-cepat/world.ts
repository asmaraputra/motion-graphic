import {fade, keys, run, track} from '../../kit/animate-math';

/**
 * Earth placement over the whole video: [t, cx, top, r, polar]. `top` keys the surface
 * point, so zooming r up to 4000 turns the top of the globe into the horizon (match cut).
 * polar 0 = side view (meridians), 1 = seen from above the north pole (radial lines).
 */
const GLOBE: readonly (readonly [number, number, number, number, number])[] = [
  [0, 500, 610, 240, 0],
  [5.8, 500, 610, 240, 0],
  [6.6, 500, 1000, 150, 0],
  [12.12, 500, 1000, 150, 0],
  [12.9, 500, 880, 180, 0],
  [15.2, 500, 880, 180, 0],
  [16.2, 500, 520, 300, 0],
  [35, 500, 520, 300, 0],
  [36.2, 500, 520, 300, 1],
  [37.2, 500, 480, 340, 1],
  [42.4, 500, 480, 340, 1],
  [43.4, 600, 640, 240, 1],
  [50.95, 600, 640, 240, 1],
  [51.9, 500, 620, 260, 1],
  [57.4, 500, 620, 260, 1],
  [58.4, 500, 1000, 150, 1],
  [64.55, 500, 1000, 150, 1],
  [66, 500, 1180, 4000, 1],
  [73.1, 500, 1180, 4000, 1],
  [74.3, 500, 840, 120, 1],
  [89.55, 500, 840, 120, 1],
  [90.8, 500, 1180, 4000, 1],
  [107, 500, 1180, 4000, 1],
  [108.2, 500, 560, 150, 0],
];

export const globeAt = (t: number) => {
  const col = (c: 1 | 2 | 3 | 4) => keys(t, GLOBE.map((g) => [g[0], g[c]] as const));
  const r = col(3);
  return {cx: col(1), cy: col(2) + r, r, polar: col(4)};
};

/**
 * Rotation (radians, counterclockwise seen from above the north pole): an illustrative drift
 * plus the full turns the narration counts. The drift is far faster than the real 0.25° per
 * minute (an on-screen tag says so); it slows to 0.05 rad/s in the "one minute" scene.
 */
export const spinAt = (t: number) =>
  0.25 * t -
  0.2 * (Math.min(Math.max(t, 57.4), 64.55) - 57.4) +
  2 * Math.PI * (run(t, 24.12, 3) + run(t, 38, 3.6) + run(t, 45.84, 2.6) + run(t, 85.4, 3.3));

/** Orbit centre = Earth centre while the globe sits small (73.1-89.55 s). */
export const ORBIT = {cx: 500, cy: 960, r: 330};
/** The Moon advances 1/27 of its orbit while the Earth turns once (85.4-88.7 s). */
export const moonAngle = (t: number) => -0.9 - 0.03 * (t - 73.1) - ((2 * Math.PI) / 27) * run(t, 85.4, 3.3);

/** Moon drifting in the evening sky over the horizon (64.55-73.1 s). */
export const skyMoon = (t: number) => ({x: track(t, 64.55, 73.1, 300, 430), y: track(t, 64.55, 73.1, 760, 690)});

/** Moon beside the roof tip: slow drift, then visibly moved after some time (90.8-107 s). */
export const ROOF_MOON = {x: 570, y: 880};
const ROOF_MOON_END = {x: 760, y: 700};
export const roofMoon = (t: number) => {
  const drift = track(t, 90.8, 98.48, 0, 1);
  const move = run(t, 98.48, 2.4);
  const x0 = ROOF_MOON.x + 14 * drift;
  const y0 = ROOF_MOON.y - 6 * drift;
  return {x: x0 + (ROOF_MOON_END.x - x0) * move, y: y0 + (ROOF_MOON_END.y - y0) * move};
};

/** One continuous Moon: hook, sky, orbit, sky again, gone before the closing. */
export const moonAt = (t: number) => {
  if (t < 12.12) return {x: 800, y: 520, o: fade(t, 3.35, 6.4)};
  if (t < 64.55 || t >= 107) return {x: 0, y: 0, o: 0};
  const o = Math.min(run(t, 65.3, 0.5), 1 - run(t, 106.6, 0.4));
  const a = moonAngle(t);
  const orbit = {x: ORBIT.cx + ORBIT.r * Math.cos(a), y: ORBIT.cy + ORBIT.r * Math.sin(a)};
  const [from, to, u] = t < 89.55 ? [skyMoon(t), orbit, run(t, 73.1, 1.2)] : [orbit, roofMoon(t), run(t, 89.55, 1.25)];
  return {x: from.x + (to.x - from.x) * u, y: from.y + (to.y - from.y) * u, o};
};
