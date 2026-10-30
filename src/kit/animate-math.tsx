// Animate Math adapter for Remotion (rules: vendor/animate/styles/math/STYLE.md). Optional asset:
// a video may use all, some, or none of it. Deterministic sigmoid easing, Written text
// (outline sweep, then fill), ShowCreation strokes, Flash, Arrow and a faint number plane.
// First used by src/videos/bumi-berputar-cepat/.
import type {CSSProperties} from 'react';

/**
 * Manim colour constants. Give each quantity one colour per video and keep it everywhere
 * (formula, figure, labels, subtitles). `pi` is the hero/object colour, never a quantity.
 */
export const M = {
  bg: '#0E0E10',
  white: '#FFFFFF',
  grey: '#BBBBBB',
  greyC: '#888888',
  greyD: '#444444',
  blueD: '#29ABCA',
  pi: '#2E86AB',
  red: '#FC6255',
  green: '#83C167',
  teal: '#5CD0B3',
  blue: '#58C4DD',
  yellow: '#F7D96F',
  gold: '#F0AC5F',
  orange: '#FF862F',
  purple: '#9A72AC',
  pink: '#D147BD',
  yellowP: '#FFFF00', // Flash only
};

export const SERIF = 'Cambria, "Cambria Math", "Latin Modern Roman", "STIX Two Text", "Times New Roman", Georgia, serif';

/** Text column centre: the safe area is x 100..900 (180 px kept free on the right). */
export const TX = 500;

const sig = (x: number) => 1 / (1 + Math.exp(-x));
const clamp01 = (u: number) => Math.min(1, Math.max(0, u));

/** Manim `smooth`: sigmoid with inflection 10, exactly 0 at 0 and 1 at 1. */
export const smooth = (u: number) => (sig(10 * (clamp01(u) - 0.5)) - sig(-5)) / (sig(5) - sig(-5));
/** Progress of a play(run_time=d) that starts at t0. */
export const run = (t: number, t0: number, d: number) => smooth((t - t0) / d);
/** 0 → 1 → 0, for Indicate. */
export const thereBack = (u: number) => smooth(clamp01(u) < 0.5 ? 2 * clamp01(u) : 2 - 2 * clamp01(u));
/** Visible from a to b: smooth fade in, fade out ending exactly at b. */
export const fade = (t: number, a: number, b: number, fin = 0.4, fout = 0.3) => Math.min(run(t, a, fin), 1 - run(t, b - fout, fout));
/** Smoothly keyframed value: [[time, value], ...]. */
export const keys = (t: number, K: readonly (readonly [number, number])[]) => {
  if (t <= K[0][0]) return K[0][1];
  for (let i = 0; i < K.length - 1; i++) {
    const [t0, v0] = K[i];
    const [t1, v1] = K[i + 1];
    if (t < t1) return v0 + (v1 - v0) * smooth((t - t0) / (t1 - t0));
  }
  return K[K.length - 1][1];
};
/** Linear tracker (only for values a readout counts). */
export const track = (t: number, t0: number, t1: number, v0: number, v1: number) => v0 + (v1 - v0) * clamp01((t - t0) / (t1 - t0));

/** SVG ShowCreation: pass to any stroked shape; p is 0..1 of its length. */
export const dash = (p: number) => ({pathLength: 1, strokeDasharray: '1 1', strokeDashoffset: 1 - clamp01(p)});

export type Seg = string | {s: string; c?: string; it?: boolean};

/** Indonesian number formatting with a true minus sign. */
export const fmt = (v: number, d = 0) =>
  v.toLocaleString('id-ID', {minimumFractionDigits: d, maximumFractionDigits: d}).replace('-', '−');

/**
 * Written text: the outline sweeps left to right over the first 60% of d, the fill fades in
 * over the rest, then the whole line fades out by b. (x, y) is the anchor of `align`.
 */
export const Write: React.FC<{
  t: number;
  segs: Seg | Seg[];
  x: number;
  y: number;
  size: number;
  a: number;
  b: number;
  d?: number;
  color?: string;
  align?: 'center' | 'left' | 'right';
  it?: boolean;
  maxW?: number;
  scale?: number;
}> = ({t, segs, x, y, size, a, b, d = 0.9, color = M.white, align = 'center', it = false, maxW, scale = 1}) => {
  if (t < a || t > b) return null;
  const reveal = run(t, a, d * 0.6);
  const fill = run(t, a + d * 0.4, d * 0.6);
  const out = 1 - run(t, b - 0.3, 0.3);
  const list = (Array.isArray(segs) ? segs : [segs]).map((s) => (typeof s === 'string' ? {s} : s));
  const shift = align === 'center' ? '-50%' : align === 'right' ? '-100%' : '0%';
  const box: CSSProperties = {
    position: 'absolute',
    left: x,
    top: y,
    transform: `translate(${shift}, -50%) scale(${scale})`,
    transformOrigin: align === 'left' ? 'left center' : align === 'right' ? 'right center' : 'center',
    opacity: out,
    fontFamily: SERIF,
    fontSize: size,
    lineHeight: 1.18,
    textAlign: align,
    whiteSpace: maxW ? 'normal' : 'nowrap',
    width: maxW,
    padding: '0.18em 0.2em',
    clipPath: `inset(0 ${(1 - reveal) * 100}% 0 0)`,
  };
  const layer = (stroke: boolean): CSSProperties => ({
    position: stroke ? 'absolute' : 'relative',
    inset: stroke ? 0 : undefined,
    padding: stroke ? 'inherit' : 0,
    opacity: stroke ? 1 - fill * 0.85 : fill,
  });
  const spans = (stroke: boolean) =>
    list.map((g, i) => (
      <span
        key={i}
        style={{
          color: stroke ? 'transparent' : (g.c ?? color),
          WebkitTextStroke: stroke ? `${Math.max(1.2, size * 0.022)}px ${g.c ?? color}` : undefined,
          fontStyle: (g.it ?? it) ? 'italic' : 'normal',
        }}
      >
        {g.s}
      </span>
    ));
  return (
    <div style={box}>
      <div style={layer(false)}>{spans(false)}</div>
      <div style={layer(true)}>{spans(true)}</div>
    </div>
  );
};

/** Flash: short rays bursting from (x, y), u = 0..1 of the flash. */
export const Flash: React.FC<{x: number; y: number; u: number; r?: number; c?: string}> = ({x, y, u, r = 70, c = M.yellowP}) => {
  if (u <= 0 || u >= 1) return null;
  const r0 = r * (0.35 + 0.65 * smooth(u));
  const len = r * 0.45 * (1 - u);
  return (
    <g stroke={c} strokeWidth={4} strokeLinecap="round" opacity={1 - u * 0.4}>
      {Array.from({length: 12}, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <line key={i} x1={x + Math.cos(a) * r0} y1={y + Math.sin(a) * r0} x2={x + Math.cos(a) * (r0 + len)} y2={y + Math.sin(a) * (r0 + len)} />;
      })}
    </g>
  );
};

/** Arrow from (x1, y1) to (x2, y2), drawn with ShowCreation progress p. */
export const Arrow: React.FC<{x1: number; y1: number; x2: number; y2: number; c: string; p: number; w?: number}> = ({x1, y1, x2, y2, c, p, w = 5}) => {
  if (p <= 0) return null;
  const ex = x1 + (x2 - x1) * p;
  const ey = y1 + (y2 - y1) * p;
  const a = Math.atan2(y2 - y1, x2 - x1);
  const h = 22;
  return (
    <g stroke={c} strokeWidth={w} strokeLinecap="round" fill="none">
      <line x1={x1} y1={y1} x2={ex} y2={ey} />
      <path
        d={`M ${ex - h * Math.cos(a - 0.45)} ${ey - h * Math.sin(a - 0.45)} L ${ex} ${ey} L ${ex - h * Math.cos(a + 0.45)} ${ey - h * Math.sin(a + 0.45)}`}
        strokeLinejoin="round"
        opacity={smooth((p - 0.6) / 0.4)}
      />
    </g>
  );
};

/** Faint number plane: the quiet background life of the Math style. Place inside an <svg>. */
export const NumberPlane: React.FC<{w?: number; h?: number; step?: number; offsetX?: number; opacity?: number}> = ({
  w = 1080,
  h = 1920,
  step = 90,
  offsetX = -40,
  opacity = 0.16,
}) => (
  <g stroke={M.blueD} strokeWidth={1.5} opacity={opacity}>
    {Array.from({length: Math.ceil(w / step) + 1}, (_, i) => (
      <line key={`v${i}`} x1={i * step + offsetX} y1={0} x2={i * step + offsetX} y2={h} />
    ))}
    {Array.from({length: Math.ceil(h / step) + 1}, (_, i) => (
      <line key={`h${i}`} x1={0} y1={i * step} x2={w} y2={i * step} />
    ))}
  </g>
);
