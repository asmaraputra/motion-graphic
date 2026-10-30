/**
 * Escalator loop in world units (y down). One closed chain path: carry run (up-right), top turn,
 * return run (down-left, the carry run shifted by H), bottom turn. 1 unit is about 4.3 mm.
 */
const DEG = Math.PI / 180;
export const THETA = 35 * DEG;
export const R = 500; // rail curve radius
export const H = 260; // vertical gap between carry and return run
export const RT = H / 2; // turnaround radius
export const X0 = -120;
export const Y0 = 900;
const LA = 380; // flat landing run (half of it is hidden under the floor)
const LC_INCLINE = 600;

type Pose = {x: number; y: number; a: number};
type Seg = {len: number; at: (u: number) => Pose};
const SEGS: Seg[] = [];
let cx = X0;
let cy = Y0;
let ca = 0;

const line = (len: number) => {
  const [x0, y0, a0] = [cx, cy, ca];
  SEGS.push({len, at: (u) => ({x: x0 + Math.cos(a0) * u, y: y0 + Math.sin(a0) * u, a: a0})});
  cx = x0 + Math.cos(a0) * len;
  cy = y0 + Math.sin(a0) * len;
};

/** Arc turning dphi radians (positive = clockwise on screen). */
const arc = (r: number, dphi: number) => {
  const sg = Math.sign(dphi);
  const [x0, y0, a0] = [cx, cy, ca];
  const ox = x0 - r * sg * Math.sin(a0);
  const oy = y0 + r * sg * Math.cos(a0);
  const len = r * Math.abs(dphi);
  const at = (a: number): Pose => ({x: ox + r * sg * Math.sin(a), y: oy - r * sg * Math.cos(a), a});
  SEGS.push({len, at: (u) => at(a0 + (dphi * u) / len)});
  ca = a0 + dphi;
  ({x: cx, y: cy} = at(ca));
};

line(LA);
arc(R, -THETA);
line(LC_INCLINE);
arc(R, THETA);
line(LA);
export const LC = SEGS.reduce((n, g) => n + g.len, 0); // end of the carry run
arc(RT, Math.PI);
line(LA);
arc(R, -THETA);
line(LC_INCLINE);
arc(R, THETA);
line(LA);
arc(RT, Math.PI);
export const L = SEGS.reduce((n, g) => n + g.len, 0);
export const END = {x: cx, y: cy, a: ca};

export const N = 56; // steps on the loop
export const D = L / N; // chain pitch
export const V = 90; // chain speed, units per second (about real speed at 4.3 mm per unit)

/** Start s of each carry-run part: lower flat, lower curve, incline, upper curve, upper flat. */
export const S_B = LA;
export const S_C = LA + R * THETA;
export const S_D = S_C + LC_INCLINE;
export const S_E = S_D + R * THETA;

/** Rear (trailing) wheel offset from the front wheel, in the step's own frame. */
export const REAR = {x: -62, y: 96};
export const TOFF = 30; // pivot to tread top

export const pt = (s: number): Pose => {
  let u = ((s % L) + L) % L;
  for (const g of SEGS) {
    if (u <= g.len) return g.at(u);
    u -= g.len;
  }
  const g = SEGS[SEGS.length - 1];
  return g.at(g.len);
};

const TURN = Math.PI * RT;
/** Step tilt in radians: flat on the carry run, a half turn around each turnaround. */
export const rot = (s: number) => {
  const u = ((s % L) + L) % L;
  if (u < LC) return 0;
  if (u < LC + TURN) return (Math.PI * (u - LC)) / TURN;
  if (u < L - TURN) return Math.PI;
  return Math.PI + (Math.PI * (u - (L - TURN))) / TURN;
};

/** Rear wheel position of the step whose front wheel sits at chain position s. */
export const rear = (s: number) => {
  const p = pt(s);
  const r = rot(s);
  return {x: p.x + REAR.x * Math.cos(r) - REAR.y * Math.sin(r), y: p.y + REAR.x * Math.sin(r) + REAR.y * Math.cos(r)};
};

/** Chain position of step i at time t (seconds). */
export const stepS = (i: number, t: number) => (((i * D + V * t) % L) + L) % L;

/** Step index that sits at chain position s at time t. */
export const stepAt = (s: number, t: number) => (((Math.round((s - V * t) / D) % N) + N) % N);

const f = (n: number) => n.toFixed(1);
/** Polyline path of the loop from s=a to s=b, shifted by (dx, dy). */
export const pathD = (a: number, b: number, dx = 0, dy = 0, ds = 6) => {
  let d = '';
  for (let s = a; s < b; s += ds) {
    const p = pt(s);
    d += `${d ? 'L' : 'M'}${f(p.x + dx)} ${f(p.y + dy)}`;
  }
  const p = pt(b);
  return `${d}L${f(p.x + dx)} ${f(p.y + dy)}`;
};
