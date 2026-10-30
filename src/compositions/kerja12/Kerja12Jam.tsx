import {AbsoluteFill, Easing, Sequence, interpolate, interpolateColors, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {z} from 'zod';
import {BEATS, CUES, EMERGENCY_STEPS, LAND, NEEDS, NEED_DELAY, SEGMENT_ORDER, SFX, dayHours, type Seg} from './timeline';

export const kerja12Schema = z.object({
  watermark: z.string(),
  sfxVolume: z.number().min(0).max(1),
  showTimecode: z.boolean(),
});

const C = {
  bg: '#171C24',
  text: '#F4F0E8',
  work: '#F2AD45',
  travel: '#76A9B5',
  sleep: '#7386C8',
  free: '#8CC9A5',
  alert: '#E57870',
  muted: '#3A4352',
  track: '#222934',
  dim: 'rgba(244,240,232,0.66)',
  body: '#465062',
};
// Poppins is not installed; Segoe UI (Windows system font, weights 600/900) is the local substitute.
const FONT = '"Segoe UI", system-ui, sans-serif';
const SHADOW = '0 8px 28px rgba(0,0,0,0.5)';

const CL = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const OUT = Easing.bezier(0.22, 1, 0.36, 1);
const IN = Easing.bezier(0.5, 0, 0.75, 0);
const INOUT = Easing.bezier(0.65, 0, 0.35, 1);
const POP = Easing.bezier(0.34, 1.45, 0.64, 1);
const k = (t: number, a: number, b: number, from: number, to: number, easing = OUT) =>
  interpolate(t, [a, b], [from, to], {...CL, easing});
/** 0 → 1 → 0 lifecycle: enters at a, fully gone at b. */
const life = (t: number, a: number, b: number, fin = 0.35, fout = 0.3) =>
  Math.min(k(t, a, a + fin, 0, 1), k(t, b - fout, b, 1, 0, IN));
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;

const useT = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return frame / fps;
};

// Day diagram geometry: ring (u = 0) morphs into a timeline (u = 1).
const CX = 520;
const CY = 900;
const R = 250;
const LX0 = 110;
const LX1 = 890;
const LY = 1300;
const hx = (h: number) => LX0 + (h / 24) * (LX1 - LX0);
const ringPt = (h: number, r: number): [number, number] => {
  const a = -Math.PI / 2 + (h / 24) * Math.PI * 2;
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
};
const pt = (h: number, u: number): [number, number] => {
  const [x, y] = ringPt(h, R);
  return [lerp(x, hx(h), u), lerp(y, LY, u)];
};
const sample = (h0: number, h1: number, at: (h: number) => [number, number]) => {
  if (h1 - h0 < 0.001) return '';
  const n = Math.max(2, Math.ceil((h1 - h0) * 6));
  let d = '';
  for (let i = 0; i <= n; i++) {
    const [x, y] = at(h0 + ((h1 - h0) * i) / n);
    d += `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
};
const segPath = (h0: number, h1: number, u: number) => sample(h0, h1, (h) => pt(h, u));
const arcPath = (h0: number, h1: number, r: number) => sample(h0, h1, (h) => ringPt(h, r));

const spans = (t: number) => {
  const h = dayHours(t);
  let acc = 0;
  const out = {} as Record<Seg, [number, number]>;
  for (const s of SEGMENT_ORDER) {
    out[s] = [acc, acc + h[s]];
    acc += h[s];
  }
  return {h, out, mid: (s: Seg) => (out[s][0] + out[s][1]) / 2};
};

const unroll = (t: number) =>
  k(t, BEATS.UNROLL, BEATS.UNROLL + 1.1, 0, 1, INOUT) * (1 - k(t, BEATS.REROLL, BEATS.REROLL + 1, 0, 1, INOUT));
const stageOn = (t: number) =>
  k(t, BEATS.ROOM_OPEN, BEATS.ROOM_OPEN + 0.5, 0, 1) * (1 - k(t, BEATS.ROOM_CLOSE, BEATS.ROOM_CLOSE + 0.4, 0, 1));
const endFade = (t: number) => 1 - k(t, 94.55, 94.95, 0, 1, IN);

const segColor = (s: Seg, t: number) =>
  s === 'work'
    ? C.work
    : s === 'commute' || s === 'prep'
      ? C.travel
      : s === 'sleep'
        ? C.sleep
        : s === 'emergency'
          ? C.alert
          : interpolateColors(t, [CUES.REMAINING_2H - 0.1, CUES.REMAINING_2H + 0.4], [C.muted, C.free]);

// ---------- Icons (centered on 0,0, about 80 px) ----------
const Factory = () => (
  <g>
    <path d="M-42 32 L-42 -6 L-20 6 L-20 -6 L2 6 L2 -6 L22 4 L22 -34 L36 -34 L36 32 Z" fill={C.work} />
    <rect x={-32} y={12} width={10} height={10} fill={C.bg} />
    <rect x={-10} y={12} width={10} height={10} fill={C.bg} />
    <rect x={12} y={12} width={10} height={10} fill={C.bg} />
  </g>
);
const Road = () => (
  <g fill="none" strokeLinecap="round">
    <path d="M-38 30 C-10 18 8 -14 38 -28" stroke={C.travel} strokeWidth={16} />
    <path d="M-38 30 C-10 18 8 -14 38 -28" stroke={C.bg} strokeWidth={3} strokeDasharray="7 9" />
    <circle cx={-38} cy={30} r={7} fill={C.text} />
    <circle cx={38} cy={-28} r={7} fill={C.work} />
  </g>
);
const Shirt = () => (
  <path
    d="M-14 -30 L-36 -18 L-28 -2 L-20 -6 L-20 30 L20 30 L20 -6 L28 -2 L36 -18 L14 -30 C10 -22 -10 -22 -14 -30 Z"
    fill={C.travel}
  />
);
const Alarm = ({color}: {color: string}) => (
  <g fill="none" stroke={color} strokeWidth={5} strokeLinecap="round">
    <circle r={20} cy={3} />
    <path d="M0 -8 V3 L8 9" />
    <path d="M-22 -14 L-12 -22 M22 -14 L12 -22" />
  </g>
);
const Thermometer = () => (
  <g>
    <rect x={-8} y={-30} width={16} height={42} rx={8} fill="none" stroke={C.alert} strokeWidth={5} />
    <rect x={-3} y={-14} width={6} height={30} fill={C.alert} />
    <circle cy={20} r={13} fill={C.alert} />
  </g>
);
const Motor = () => (
  <g fill="none" stroke={C.alert} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round">
    <circle cx={-24} cy={14} r={13} />
    <circle cx={24} cy={14} r={13} />
    <path d="M-24 14 L-6 -6 H14 L24 14 M8 -6 L14 -22 H24" />
  </g>
);
const Family = () => (
  <g fill={C.alert}>
    <circle cx={-12} cy={-16} r={11} />
    <path d="M-32 26 C-32 4 8 4 8 26 Z" />
    <circle cx={18} cy={-4} r={8} />
    <path d="M4 26 C4 10 32 10 32 26 Z" />
  </g>
);

// ---------- Text ----------
type Line = {text: string; size: number; color?: string; delay?: number};
const Title: React.FC<{a: number; b: number; lines: Line[]; top: number; fout?: number}> = ({a, b, lines, top, fout = 0.35}) => {
  const t = useT();
  if (t < a - 0.05 || t > b + 0.05) return null;
  const out = k(t, b - fout, b, 0, 1, IN);
  return (
    <div
      style={{
        position: 'absolute',
        left: 100,
        width: 800,
        top,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        opacity: 1 - out,
        translate: `0px ${-30 * out}px`,
      }}
    >
      {lines.map((l, i) => {
        const s = a + (l.delay ?? i * 0.12);
        const p = k(t, s, s + 0.55, 0, 1, POP);
        return (
          <div
            key={l.text}
            style={{
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: l.size,
              lineHeight: 1.04,
              color: l.color ?? C.text,
              letterSpacing: l.size > 80 ? '-0.02em' : '0.02em',
              whiteSpace: 'nowrap',
              textShadow: SHADOW,
              opacity: k(t, s, s + 0.25, 0, 1),
              translate: `0px ${(1 - p) * 44}px`,
              scale: `${0.9 + 0.1 * p}`,
            }}
          >
            {l.text}
          </div>
        );
      })}
    </div>
  );
};

const Pill: React.FC<{a: number; b: number; text: string; top: number; left?: number; color?: string}> = ({
  a,
  b,
  text,
  top,
  left = 100,
  color = C.dim,
}) => {
  const t = useT();
  const o = life(t, a, b);
  if (o <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        opacity: o,
        translate: `${(1 - o) * -20}px 0px`,
        fontFamily: FONT,
        fontWeight: 600,
        fontSize: 26,
        letterSpacing: '0.12em',
        color,
        padding: '8px 18px',
        border: `2px solid ${color}`,
        borderRadius: 999,
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
  );
};

const Center: React.FC<{a: number; b: number; big: string; small: string; color: string}> = ({a, b, big, small, color}) => {
  const t = useT();
  const o = life(t, a, b, 0.3, 0.3);
  if (o <= 0) return null;
  const p = k(t, a, a + 0.55, 0, 1, POP);
  return (
    <div
      style={{
        position: 'absolute',
        left: CX - 200,
        top: CY - 130,
        width: 400,
        height: 260,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: o,
        scale: `${0.8 + 0.2 * p}`,
        fontFamily: FONT,
      }}
    >
      <div style={{fontSize: 170, fontWeight: 900, lineHeight: 0.95, letterSpacing: '-0.04em', color, textShadow: SHADOW}}>{big}</div>
      <div style={{fontSize: 30, fontWeight: 600, letterSpacing: '0.14em', color: C.dim, whiteSpace: 'nowrap'}}>{small}</div>
    </div>
  );
};

const Counter: React.FC = () => {
  const t = useT();
  const n = t < CUES.HOOK_12H ? 8 : Math.round(k(t, CUES.HOOK_12H, CUES.HOOK_12H + 0.9, 8, 12, INOUT));
  return <Center a={CUES.HOOK_8H} b={BEATS.ZOOM_IN + 0.2} big={String(n)} small="JAM KERJA" color={C.work} />;
};

// ---------- Day diagram ----------
const Diagram: React.FC = () => {
  const t = useT();
  const u = unroll(t);
  const {h, out, mid} = spans(t);
  const sw = lerp(84, 64, u);
  const draw = k(t, 0.1, 1.5, 0, 1, INOUT);
  const cam = 1 + 0.06 * k(t, BEATS.ZOOM_IN, BEATS.ZOOM_IN + 1.1, 0, 1, INOUT) - 0.06 * k(t, BEATS.UNROLL - 0.2, BEATS.UNROLL + 0.9, 0, 1, INOUT);
  const night = k(t, BEATS.NIGHT, BEATS.NIGHT + 1.8, 0, 1, INOUT);
  const workHi = life(t, CUES.WORK_CONTROL, 77.9, 0.5, 0.6);
  const stage = stageOn(t);
  const opacity = (1 - stage) * lerp(1, 0.16 + 0.3 * workHi, night) * endFade(t);
  const ring = 1 - k(u, 0, 0.3, 0, 1);
  const lineLabel = k(u, 0.8, 1, 0, 1);
  const outer = R + sw / 2;

  const icon = (s: Seg, a: number, b: number, label: string, glyph: React.ReactNode) => {
    const o = life(t, a, b) * ring;
    if (o <= 0) return null;
    const [rx, y] = ringPt(mid(s), 345);
    const x = Math.min(rx, 850); // keep right-side icon inside the 180 px safe margin
    const p = k(t, a, a + 0.5, 0, 1, POP);
    return (
      <g transform={`translate(${x} ${y}) scale(${0.6 + 0.4 * p})`} opacity={o}>
        {glyph}
        <text y={y < CY - 100 ? -52 : 66} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={24} letterSpacing="0.1em" fill={C.dim}>
          {label}
        </text>
      </g>
    );
  };

  const bracket = life(t, CUES.TOTAL_14H, CUES.DAY + 0.4);
  const late = life(t, CUES.LATE_SLEEP, BEATS.NIGHT + 0.3, 0.4, 0.5);
  const hs = out.sleep[0];
  const hd = out.prep[1];
  const ghosts = EMERGENCY_STEPS.slice(3)
    .filter((s) => t > s.t + s.d)
    .map((s) => spans(s.t - 0.001).out.sleep[0]);
  const shake = [CUES.FIXED_DEPARTURE, CUES.SAME_TIME].reduce(
    (sum, c) => sum + (t > c ? 14 * Math.sin((t - c) * 38) * Math.exp(-(t - c) * 4) : 0),
    0,
  );
  const scene6 = life(t, BEATS.REROLL + 1, BEATS.NIGHT);
  const emgLabel = life(t, CUES.EMG_ANAK + LAND + 0.3, BEATS.NIGHT);
  const emgPt = ringPt(mid('emergency'), outer + 6);
  const ringLabel = (s: Seg, o: number, lines: string[], color: string, r = 345) => {
    if (o <= 0 || h[s] < 0.05) return null;
    const [rx, y] = ringPt(mid(s), r);
    const x = Math.min(rx, 840);
    return (
      <text x={x} y={y - (lines.length - 1) * 15 + 10} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={28} letterSpacing="0.06em" fill={color} opacity={o}>
        {lines.map((l, i) => (
          <tspan key={l} x={x} dy={i ? 32 : 0}>
            {l}
          </tspan>
        ))}
      </text>
    );
  };
  const lineText = (s: Seg, text: string) =>
    lineLabel > 0 && h[s] > 0.5 ? (
      <text x={hx(mid(s))} y={LY + 11} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill={C.bg} opacity={lineLabel}>
        {text}
      </text>
    ) : null;

  if (opacity <= 0.001) return null;
  return (
    <AbsoluteFill
      style={{
        opacity,
        transformOrigin: `${CX}px ${CY}px`,
        translate: `0px ${-200 * night}px`,
        scale: `${cam * (1 - 0.25 * night)}`,
        filter: night > 0 ? `blur(${3 * night}px)` : undefined,
      }}
    >
      <svg width={1080} height={1920} style={{position: 'absolute', overflow: 'visible', filter: 'drop-shadow(0 18px 26px rgba(0,0,0,0.45))'}}>
        <defs>
          <filter id="k12glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={10} />
          </filter>
        </defs>
        <path d={segPath(0, 24, u)} fill="none" stroke={C.track} strokeWidth={sw} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - draw} />
        {ring > 0
          ? Array.from({length: 24}, (_, i) => {
              const [x1, y1] = ringPt(i, R - sw / 2 - 8);
              const [x2, y2] = ringPt(i, R - sw / 2 - (i % 6 ? 18 : 30));
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.muted} strokeWidth={3} opacity={ring * k(t, 0.4 + i * 0.03, 0.8 + i * 0.03, 0, 1)} />;
            })
          : null}
        {SEGMENT_ORDER.map((s) => (
          <path key={s} d={segPath(out[s][0], out[s][1], u)} fill="none" stroke={segColor(s, t)} strokeWidth={sw} />
        ))}
        <path
          d={segPath(out.free[0], out.free[1], u)}
          fill="none"
          stroke={C.free}
          strokeWidth={sw + 20}
          filter="url(#k12glow)"
          opacity={life(t, CUES.REMAINING_2H, BEATS.ROOM_OPEN, 0.4, 0.4) * (0.35 + 0.15 * Math.sin(t * 3))}
        />
        <path d={segPath(out.work[0], out.work[1], u)} fill="none" stroke={C.work} strokeWidth={sw + 24} filter="url(#k12glow)" opacity={0.6 * workHi} />

        {/* Scene 2: 14-hour bracket inside the ring */}
        {bracket > 0 ? (
          <g opacity={bracket} fill="none" stroke={C.text} strokeWidth={4} strokeLinecap="round">
            <path d={arcPath(0, out.commute[1], 172)} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - k(t, CUES.TOTAL_14H, CUES.TOTAL_14H + 0.7, 0, 1, INOUT)} />
            {[0, out.commute[1]].map((hh) => {
              const [x1, y1] = ringPt(hh, 160);
              const [x2, y2] = ringPt(hh, 184);
              return <line key={hh} x1={x1} y1={y1} x2={x2} y2={y2} />;
            })}
          </g>
        ) : null}

        {icon('work', CUES.FACTORY, CUES.DAY + 0.4, 'KERJA', <Factory />)}
        {icon('commute', CUES.COMMUTE, CUES.DAY + 0.4, 'PULANG-PERGI', <Road />)}
        {icon('prep', CUES.PREP, CUES.DAY + 0.4, 'PERSIAPAN', <Shirt />)}

        {lineText('work', 'KERJA 12')}
        {lineText('sleep', 'TIDUR 8')}
        {lineText('free', '2')}
        {lineText('commute', '1')}
        {lineText('prep', '1')}

        {/* Scenes 6-7: block labels show work fixed while sleep shrinks */}
        {scene6 > 0 ? (
          <g opacity={scene6}>
            <line x1={ringPt(mid('work'), outer + 6)[0]} y1={ringPt(mid('work'), outer + 6)[1]} x2={860} y2={1222} stroke={C.work} strokeWidth={2} />
            <circle cx={ringPt(mid('work'), outer + 6)[0]} cy={ringPt(mid('work'), outer + 6)[1]} r={5} fill={C.work} />
            <text x={890} y={1262} textAnchor="end" fontFamily={FONT} fontWeight={900} fontSize={30} letterSpacing="0.06em" fill={C.work}>
              KERJA 12 JAM
            </text>
          </g>
        ) : null}
        {ringLabel('sleep', life(t, BEATS.REROLL + 1, CUES.LATE_SLEEP), ['TIDUR'], C.sleep)}
        {emgLabel > 0 && h.emergency > 0.05 ? (
          <g opacity={emgLabel}>
            <line x1={emgPt[0]} y1={emgPt[1]} x2={170} y2={1222} stroke={C.alert} strokeWidth={2} />
            <circle cx={emgPt[0]} cy={emgPt[1]} r={5} fill={C.alert} />
            <text x={110} y={1262} fontFamily={FONT} fontWeight={900} fontSize={30} letterSpacing="0.06em" fill={C.alert}>
              URUSAN MENDADAK
            </text>
          </g>
        ) : null}

        {/* Scene 7: bedtime marker slides later, departure marker stays */}
        {late > 0 ? (
          <g opacity={late}>
            <path d={arcPath(hs, 24 + hd, 172)} fill="none" stroke={C.sleep} strokeWidth={5} strokeLinecap="round" />
            {ghosts.map((g) => {
              const [x1, y1] = ringPt(g, outer + 4);
              const [x2, y2] = ringPt(g, outer + 18);
              return <line key={g} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.dim} strokeWidth={3} opacity={0.5} />;
            })}
            {[
              {hh: hs, color: C.text, anchor: [250, 562]},
              {hh: hd, color: C.work, anchor: [735, 562]},
            ].map(({hh, color, anchor}) => {
              const [x1, y1] = ringPt(hh, R - sw / 2 - 12);
              const [x2, y2] = ringPt(hh, outer + 12);
              return (
                <g key={color}>
                  <line x1={anchor[0]} y1={anchor[1]} x2={x2} y2={y2} stroke={color} strokeWidth={2} opacity={0.6} />
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={7} strokeLinecap="round" />
                  <circle cx={x2} cy={y2} r={8} fill={color} />
                </g>
              );
            })}
          </g>
        ) : null}
      </svg>

      <Counter />
      <Center a={CUES.TOTAL_14H} b={CUES.DAY + 0.1} big="14" small="JAM TERPAKAI" color={C.text} />
      <Center a={CUES.DAY_24H} b={CUES.REMAINING_2H} big="24" small="JAM SEHARI" color={C.text} />
      <Center a={CUES.REMAINING_2H} b={BEATS.UNROLL + 0.2} big="2" small="JAM TERSISA" color={C.free} />
      <Center a={BEATS.REROLL + 1} b={CUES.LATE_SLEEP} big="24" small="TOTAL TETAP" color={C.text} />

      {late > 0 ? (
        <>
          {[
            {x: 250, text: 'MULAI TIDUR', color: C.text, alarm: false},
            {x: 735, text: 'WAKTU BERANGKAT', color: C.work, alarm: true},
          ].map((m) => (
            <div
              key={m.text}
              style={{
                position: 'absolute',
                left: m.x - 200,
                width: 400,
                top: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                opacity: late,
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: 30,
                letterSpacing: '0.06em',
                color: m.color,
                whiteSpace: 'nowrap',
                textShadow: SHADOW,
              }}
            >
              {m.alarm ? (
                <svg width={44} height={44} viewBox="-25 -25 50 50" style={{rotate: `${shake}deg`}}>
                  <Alarm color={C.work} />
                </svg>
              ) : null}
              {m.text}
            </div>
          ))}
        </>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- Scenes 4-5: the 2-hour box becomes the room ----------
type Rect = {x: number; y: number; w: number; h: number};
const SLOT: Rect = {x: hx(14), y: LY - 32, w: hx(16) - hx(14), h: 64};
const BOX: Rect = {x: 120, y: 560, w: 760, h: 460};
const STAGE: Rect = {x: 110, y: 470, w: 780, h: 1090};
const mixRect = (a: Rect, b: Rect, p: number): Rect => ({x: lerp(a.x, b.x, p), y: lerp(a.y, b.y, p), w: lerp(a.w, b.w, p), h: lerp(a.h, b.h, p)});

const PILL_POS = [
  {x: 190, y: 190, r: -5},
  {x: 540, y: 200, r: 6},
  {x: 370, y: 290, r: -2},
  {x: 200, y: 385, r: 5},
  {x: 520, y: 385, r: -4},
];
const ADVICE = [
  {t: CUES.ADVICE_OLAHRAGA, text: 'OLAHRAGA', x: 300, y: 560, r: -6, from: [-700, 0]},
  {t: CUES.ADVICE_SKILL, text: 'BELAJAR SKILL', x: 640, y: 660, r: 5, from: [700, 0]},
  {t: CUES.ADVICE_USAHA, text: 'USAHA SAMPINGAN', x: 470, y: 770, r: -3, from: [0, -520]},
];
const SHOE: [number, number] = [428, 1426];

const Room: React.FC = () => {
  const t = useT();
  if (t < 33.2 || t > BEATS.ROOM_CLOSE + 0.7) return null;
  const p1 = k(t, 33.3, 34.1, 0, 1);
  const p2 = k(t, BEATS.ROOM_OPEN, BEATS.ROOM_OPEN + 0.8, 0, 1, INOUT);
  const rect = mixRect(mixRect(SLOT, BOX, p1), STAGE, p2);
  const close = k(t, BEATS.ROOM_CLOSE, BEATS.ROOM_CLOSE + 0.6, 0, 1, IN);
  const fall = k(t, BEATS.ROOM_OPEN - 0.1, BEATS.ROOM_OPEN + 0.4, 0, 1, IN);
  const entered = NEEDS.reduce((sum, n) => sum + k(t, n.t + NEED_DELAY, n.t + NEED_DELAY + 0.4, 0, 1), 0);
  const zoom = k(t, BEATS.SHOE_ZOOM, BEATS.SHOE_ZOOM + 1, 0, 1, INOUT);
  const slump = k(t, CUES.JUST_HOME, CUES.JUST_HOME + 0.8, 0, 1);
  const walk = k(t, 40.8, 41.9, 0, 1);
  const shoeRing = life(t, CUES.STILL_ON, BEATS.ROOM_CLOSE);

  return (
    <AbsoluteFill
      style={{
        transformOrigin: `${SLOT.x + SLOT.w / 2}px ${LY}px`,
        scale: `${1 - 0.95 * close}`,
        opacity: 1 - k(t, BEATS.ROOM_CLOSE + 0.35, BEATS.ROOM_CLOSE + 0.6, 0, 1),
      }}
    >
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <polygon
          points={`${rect.x},${rect.y + rect.h} ${rect.x + rect.w},${rect.y + rect.h} ${SLOT.x + SLOT.w},${SLOT.y} ${SLOT.x},${SLOT.y}`}
          fill={C.free}
          opacity={0.12 * p1 * (1 - p2)}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: rect.x,
          top: rect.y,
          width: rect.w,
          height: rect.h,
          borderRadius: 28,
          border: `3px solid ${C.free}`,
          background: interpolateColors(p2, [0, 1], ['rgba(140,201,165,0.10)', '#1C222C']),
          boxShadow: '0 30px 60px rgba(0,0,0,0.45)',
          opacity: k(t, 33.2, 33.4, 0, 1),
        }}
      />
      <div style={{position: 'absolute', left: BOX.x + 30, top: BOX.y + 22, display: 'flex', alignItems: 'baseline', gap: 16, opacity: life(t, 33.8, BEATS.ROOM_OPEN + 0.2), fontFamily: FONT}}>
        <span style={{fontSize: 48, fontWeight: 900, color: C.free}}>2 JAM</span>
        <span style={{fontSize: 24, fontWeight: 600, letterSpacing: '0.14em', color: C.dim}}>WAKTU PRIBADI</span>
      </div>
      {NEEDS.map((n, i) => {
        const s = n.t + NEED_DELAY;
        if (t < s) return null;
        const p = k(t, s, s + 0.5, 0, 1, POP);
        const squeeze = Math.max(0, entered - (i + 1));
        const pos = PILL_POS[i];
        return (
          <div
            key={n.label}
            style={{
              position: 'absolute',
              left: BOX.x + pos.x,
              top: BOX.y + pos.y,
              translate: `-50% calc(-50% + ${(1 - p) * -160 + squeeze * 6 + fall * 520}px)`,
              rotate: `${pos.r + fall * 22 * (i % 2 ? 1 : -1)}deg`,
              scale: `${1 - 0.035 * squeeze}`,
              opacity: k(t, s, s + 0.2, 0, 1) * (1 - fall),
              padding: '14px 28px',
              borderRadius: 999,
              background: '#2A3340',
              border: `3px solid ${C.free}`,
              boxShadow: '0 14px 26px rgba(0,0,0,0.45)',
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 40,
              color: C.text,
              whiteSpace: 'nowrap',
            }}
          >
            {n.label}
          </div>
        );
      })}

      {/* Stage contents, framed by the expanded box */}
      <AbsoluteFill
        style={{
          clipPath: `inset(${STAGE.y}px ${1080 - STAGE.x - STAGE.w}px ${1920 - STAGE.y - STAGE.h}px ${STAGE.x}px round 28px)`,
          opacity: k(t, BEATS.ROOM_OPEN + 0.5, BEATS.ROOM_OPEN + 0.9, 0, 1),
        }}
      >
        <AbsoluteFill
          style={{
            transformOrigin: `${SHOE[0]}px ${SHOE[1]}px`,
            translate: `${(500 - SHOE[0]) * zoom}px ${(1120 - SHOE[1]) * zoom}px`,
            scale: `${1 + 1.5 * zoom}`,
          }}
        >
          <svg width={1080} height={1920} style={{position: 'absolute'}}>
            <defs>
              <linearGradient id="k12door" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#3B4656" />
                <stop offset="1" stopColor="#262E3A" />
              </linearGradient>
            </defs>
            <polygon points="690,1440 850,1440 780,1540 520,1540" fill={C.text} opacity={0.05} />
            <line x1={130} y1={1440} x2={870} y2={1440} stroke={C.muted} strokeWidth={4} />
            <rect x={690} y={860} width={160} height={580} fill="url(#k12door)" stroke={C.muted} strokeWidth={8} />
            <polygon points="690,860 640,892 640,1420 690,1440" fill="#2B3442" stroke={C.muted} strokeWidth={4} />
            <g opacity={walk} transform={`translate(${260 * (1 - walk)} 0)`}>
              <ellipse cx={428} cy={1446} rx={110} ry={12} fill="rgba(0,0,0,0.35)" />
              <rect x={380} y={1200} width={32} height={220} fill={C.muted} />
              <rect x={444} y={1200} width={32} height={220} fill={C.muted} />
              <g transform={`translate(0 ${4 * slump})`}>
                <rect x={318} y={975} width={28} height={205} rx={14} fill="#3E4757" />
                <rect x={510} y={975} width={28} height={205} rx={14} fill="#3E4757" />
                <rect x={340} y={955} width={176} height={260} rx={44} fill={C.body} />
                <rect x={460} y={1010} width={26} height={36} rx={4} fill={C.work} />
                <line x1={352} y1={968} x2={506} y2={1150} stroke="#2A313C" strokeWidth={10} />
                <rect x={490} y={1120} width={62} height={72} rx={10} fill="#2A313C" />
              </g>
              <circle cx={428} cy={900 + 8 * slump} r={54} fill={C.body} />
              <ellipse cx={SHOE[0]} cy={SHOE[1]} rx={96} ry={44} fill="none" stroke={C.travel} strokeWidth={3} opacity={shoeRing * (0.6 + 0.3 * Math.sin(t * 5))} />
              {[368, 436].map((x) => (
                <g key={x}>
                  <rect x={x} y={1408} width={56} height={36} rx={14} fill={C.travel} />
                  <rect x={x} y={1436} width={56} height={8} rx={4} fill="#E9E3D2" />
                  {[0, 1, 2].map((j) => (
                    <line key={j} x1={x + 18 + j * 9} y1={1414} x2={x + 22 + j * 9} y2={1424} stroke={C.bg} strokeWidth={3} strokeLinecap="round" />
                  ))}
                </g>
              ))}
            </g>
          </svg>
          {ADVICE.map((a) => {
            if (t < a.t) return null;
            const p = k(t, a.t, a.t + 0.55, 0, 1, POP);
            const nudge = k(t, CUES.JUST_HOME, CUES.JUST_HOME + 0.5, 0, 1);
            return (
              <div
                key={a.text}
                style={{
                  position: 'absolute',
                  left: a.x,
                  top: a.y,
                  translate: `calc(-50% + ${a.from[0] * (1 - p)}px) calc(-50% + ${a.from[1] * (1 - p)}px)`,
                  rotate: `${a.r}deg`,
                  scale: `${1 - 0.05 * nudge}`,
                  opacity: k(t, a.t, a.t + 0.2, 0, 1) * (1 - k(t, BEATS.SHOE_ZOOM, BEATS.SHOE_ZOOM + 0.5, 0, 1)),
                  padding: '18px 30px',
                  borderRadius: '22px 22px 22px 6px',
                  background: C.text,
                  boxShadow: '0 18px 34px rgba(0,0,0,0.5)',
                  fontFamily: FONT,
                  fontWeight: 900,
                  fontSize: 44,
                  color: C.bg,
                  whiteSpace: 'nowrap',
                }}
              >
                {a.text}
              </div>
            );
          })}
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- Scene 6: emergencies fly into the sleep block ----------
const EMERGENCIES = [
  {t: CUES.EMG_ANAK, x: 230, lines: ['ANAK', 'SAKIT'], glyph: <Thermometer />},
  {t: CUES.EMG_MOTOR, x: 500, lines: ['MOTOR', 'BERMASALAH'], glyph: <Motor />},
  {t: CUES.EMG_KELUARGA, x: 770, lines: ['KELUARGA', 'BUTUH BANTUAN'], glyph: <Family />},
];
const CHIP_TOP = 1370;
const CHIP_H = 160;

const EmergencyChips: React.FC = () => {
  const t = useT();
  if (t < CUES.EMG_ANAK || t > CUES.EMG_KELUARGA + LAND + 0.6) return null;
  const {out} = spans(t);
  const [tx, ty] = ringPt(out.sleep[0], R);
  return (
    <>
      {EMERGENCIES.map((e) => {
        if (t < e.t) return null;
        const p = k(t, e.t, e.t + 0.5, 0, 1, POP);
        const fly = k(t, e.t + LAND, e.t + LAND + 0.5, 0, 1, INOUT);
        const cy = CHIP_TOP + CHIP_H / 2;
        return (
          <div
            key={e.x}
            style={{
              position: 'absolute',
              left: e.x - 125,
              top: CHIP_TOP,
              width: 250,
              height: CHIP_H,
              boxSizing: 'border-box',
              translate: `${(tx - e.x) * fly}px ${(1 - p) * 80 + (ty - cy) * fly}px`,
              scale: `${1 - 0.8 * fly}`,
              opacity: k(t, e.t, e.t + 0.2, 0, 1) * (1 - k(t, e.t + LAND + 0.3, e.t + LAND + 0.5, 0, 1)),
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              borderRadius: 24,
              background: '#222A35',
              border: `3px solid ${C.alert}`,
              boxShadow: '0 16px 30px rgba(0,0,0,0.45)',
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 26,
              lineHeight: 1.1,
              textAlign: 'center',
              color: C.text,
            }}
          >
            <svg width={64} height={64} viewBox="-40 -40 80 80">
              {e.glyph}
            </svg>
            <div>
              {e.lines.map((l) => (
                <div key={l} style={{whiteSpace: 'nowrap'}}>
                  {l}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
};

// ---------- Scene 8: quiet night, phone light ----------
const Night: React.FC = () => {
  const t = useT();
  if (t < BEATS.NIGHT) return null;
  const n = BEATS.NIGHT;
  const fade = endFade(t);
  const glow = (0.82 + 0.18 * Math.sin(t * 1.3)) * k(t, n + 1.1, n + 2, 0, 1);
  return (
    <AbsoluteFill style={{opacity: fade, transformOrigin: '500px 1200px', scale: `${k(t, 80, 95, 1, 1.04, Easing.linear)}`}}>
      <AbsoluteFill style={{background: '#0F131A', opacity: 0.55 * k(t, n, n + 1.2, 0, 1)}} />
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <defs>
          <radialGradient id="k12phone">
            <stop offset="0" stopColor="#BFD6EA" stopOpacity={0.45} />
            <stop offset="1" stopColor="#BFD6EA" stopOpacity={0} />
          </radialGradient>
        </defs>
        <g opacity={k(t, n + 0.3, n + 1, 0, 1)} transform={`translate(0 ${4 * Math.sin(t * 0.6)})`}>
          <rect x={690} y={930} width={180} height={210} rx={10} fill="#141A23" stroke={C.muted} strokeWidth={6} />
          <line x1={780} y1={930} x2={780} y2={1140} stroke={C.muted} strokeWidth={4} />
          <line x1={690} y1={1035} x2={870} y2={1035} stroke={C.muted} strokeWidth={4} />
          <circle cx={835} cy={978} r={22} fill="#E9E3D2" opacity={0.9} />
          <circle cx={846} cy={970} r={20} fill="#141A23" />
        </g>
        <g opacity={k(t, n + 0.6, n + 1.4, 0, 1)} transform={`translate(0 ${(1 - k(t, n + 0.6, n + 1.4, 0, 1)) * 40})`}>
          <rect x={120} y={1330} width={760} height={120} rx={20} fill="#202733" />
          <ellipse cx={270} cy={1272} rx={115} ry={42} fill="#2A3240" />
          <circle cx={300} cy={1222} r={52} fill={C.body} />
          <circle cx={300} cy={1222} r={52} fill="#BFD6EA" opacity={0.2 * glow} />
          <path d="M340 1240 C420 1200 820 1210 870 1250 L870 1340 L330 1340 Z" fill="#2E3758" />
          <line x1={430} y1={1236} x2={392} y2={1150} stroke={C.body} strokeWidth={28} strokeLinecap="round" />
        </g>
        <circle cx={378} cy={1120} r={280} fill="url(#k12phone)" opacity={glow} />
        <g opacity={k(t, n + 0.9, n + 1.5, 0, 1)} transform="rotate(-12 378 1120)">
          <rect x={346} y={1066} width={64} height={110} rx={10} fill="#0E1116" />
          <rect x={352} y={1074} width={52} height={94} rx={6} fill="#BFD6EA" opacity={0.75 * glow + 0.1} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ---------- Screen-space text ----------
const Texts: React.FC = () => (
  <>
    <Pill a={0.4} b={CUES.NOW + 0.1} text="EPISODE KEMARIN" top={250} left={350} />
    <Pill a={CUES.NOW + 0.2} b={CUES.HOOK_12H} text="SEKARANG" top={250} left={410} color={C.work} />
    <Title
      a={CUES.HOOK_12H + 0.25}
      b={BEATS.ZOOM_IN}
      top={240}
      lines={[
        {text: 'KERJA 12 JAM', size: 96, color: C.work},
        {text: 'SISA HIDUP BERAPA?', size: 62, delay: CUES.QUESTION - CUES.HOOK_12H - 0.25},
      ]}
    />
    <Pill a={BEATS.ZOOM_IN + 0.4} b={BEATS.NIGHT} text="SIMULASI SEHARI" top={190} />
    <Equation />
    <Title a={37.3} b={41.2} top={270} lines={[{text: 'SEMUA MASUK', size: 92}, {text: 'KE SINI?', size: 92, color: C.free}]} />
    <Title a={CUES.STILL_ON} b={BEATS.ROOM_CLOSE} top={1250} lines={[{text: 'BELUM DILEPAS', size: 72, color: C.travel}]} />
    <Title a={CUES.SLEEP_REDUCED} b={CUES.FIXED_DEPARTURE - 0.1} top={270} lines={[{text: 'YANG DIKURANGI:', size: 52, color: C.dim}, {text: 'TIDUR', size: 130, color: C.sleep, delay: 0.3}]} />
    <Title
      a={CUES.FIXED_DEPARTURE}
      b={BEATS.NIGHT}
      top={270}
      lines={[
        {text: 'BESOK TETAP BERANGKAT', size: 54},
        {text: 'JAM YANG SAMA', size: 90, color: C.work, delay: CUES.SAME_TIME - CUES.FIXED_DEPARTURE},
      ]}
    />
    <Title a={68.6} b={73.2} top={300} lines={[{text: 'MENUNDA TIDUR', size: 92, color: C.sleep}]} />
    <Title a={CUES.WORK_CONTROL} b={77.9} top={300} lines={[{text: 'DIATUR', size: 80, color: C.work}, {text: 'PEKERJAAN', size: 80, color: C.work}]} />
    <Title
      a={CUES.MY_TIME}
      b={CUES.CAPE}
      fout={0.4}
      top={290}
      lines={[
        {text: 'SEKARANG,', size: 64, color: C.dim},
        {text: 'GILIRAN', size: 124, color: C.free, delay: CUES.MY_TIME_2 - CUES.MY_TIME},
        {text: 'WAKTUKU.', size: 124, color: C.free, delay: CUES.MY_TIME_2 - CUES.MY_TIME + 0.25},
      ]}
    />
    <Title
      a={CUES.CAPE}
      b={CUES.NIKMATI - 0.05}
      top={300}
      lines={[
        {text: 'CAPE YA?', size: 72, color: C.dim},
        {text: 'SABAR...', size: 124, color: C.sleep, delay: CUES.SABAR - CUES.CAPE},
      ]}
    />
    <Title
      a={CUES.NIKMATI}
      b={CUES.ORANG_LAIN - 0.05}
      top={300}
      lines={[
        {text: 'NIKMATI', size: 72, color: C.dim},
        {text: 'PERANMU', size: 124, color: C.free, delay: CUES.PERANMU - CUES.NIKMATI},
      ]}
    />
    <Title
      a={CUES.ORANG_LAIN}
      b={CUES.LELAH - 0.05}
      top={300}
      lines={[
        {text: 'BELUM TENTU MAMPU', size: 56, color: C.dim},
        {text: 'DI POSISIMU', size: 104, color: C.work, delay: CUES.POSISIMU - CUES.ORANG_LAIN},
      ]}
    />
    <Title
      a={CUES.LELAH}
      b={CUES.SEMANGAT - 0.05}
      top={280}
      lines={[
        {text: 'LELAH BOLEH,', size: 72, color: C.dim},
        {text: 'NYERAH?', size: 116, color: C.alert, delay: CUES.NYERAH - CUES.LELAH},
        {text: 'JANGAN.', size: 116, color: C.text, delay: CUES.JANGAN - CUES.LELAH},
      ]}
    />
    <Title
      a={CUES.SEMANGAT}
      b={94.95}
      top={320}
      lines={[
        {text: 'SEMANGAT', size: 132, color: C.free},
        {text: 'YA!', size: 132, color: C.free, delay: 0.5},
      ]}
    />
  </>
);

type Tok = {text: string; t: number; color?: string};
const EqRow: React.FC<{toks: Tok[]; a: number; b: number; size: number; top: number}> = ({toks, a, b, size, top}) => {
  const t = useT();
  const o = life(t, a, b, 0.2, 0.35);
  if (o <= 0) return null;
  return (
    <div style={{position: 'absolute', left: 100, width: 800, top, display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 18, opacity: o, fontFamily: FONT, fontWeight: 900, fontSize: size, letterSpacing: '-0.02em', whiteSpace: 'nowrap', textShadow: SHADOW}}>
      {toks.map((tok, i) => {
        const p = k(t, tok.t, tok.t + 0.5, 0, 1, POP);
        return (
          <span key={i} style={{color: tok.color ?? C.dim, opacity: k(t, tok.t, tok.t + 0.2, 0, 1), translate: `0px ${(1 - p) * 30}px`, display: 'inline-block'}}>
            {tok.text}
          </span>
        );
      })}
    </div>
  );
};

const Equation: React.FC = () => {
  const t = useT();
  return (
    <>
      <EqRow
        a={CUES.WORK_12H}
        b={CUES.DAY + 0.3}
        size={110}
        top={1360}
        toks={[
          {text: '12', t: CUES.WORK_12H, color: C.work},
          {text: '+', t: CUES.COMMUTE_1H},
          {text: '1', t: CUES.COMMUTE_1H, color: C.travel},
          {text: '+', t: CUES.PREP_1H},
          {text: '1', t: CUES.PREP_1H, color: C.travel},
        ]}
      />
      {life(t, CUES.BREAK_INCLUDED, CUES.DAY + 0.3) > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: 100,
            width: 800,
            top: 1508,
            textAlign: 'center',
            opacity: life(t, CUES.BREAK_INCLUDED, CUES.DAY + 0.3),
            fontFamily: FONT,
            fontWeight: 600,
            fontSize: 28,
            letterSpacing: '0.1em',
            color: C.work,
            whiteSpace: 'nowrap',
          }}
        >
          12 JAM SUDAH TERMASUK ISTIRAHAT
        </div>
      ) : null}
      <EqRow
        a={CUES.DAY_24H}
        b={33.6}
        size={78}
        top={1390}
        toks={[
          {text: '24', t: CUES.DAY_24H, color: C.text},
          {text: '−', t: 27.44},
          {text: '14', t: 27.44, color: C.work},
          {text: '−', t: CUES.SLEEP_8H + 0.52},
          {text: '8', t: CUES.SLEEP_8H + 0.52, color: C.sleep},
          {text: '=', t: CUES.REMAINING_2H},
          {text: '2 JAM', t: CUES.REMAINING_2H, color: C.free},
        ]}
      />
    </>
  );
};

// ---------- Frame chrome ----------
const Backdrop: React.FC = () => (
  <AbsoluteFill style={{background: 'radial-gradient(circle at 48% 45%, #1F2631 0%, #171C24 55%, #12161D 100%)'}} />
);
const Foreground: React.FC = () => (
  <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,12,16,0.55) 0%, rgba(10,12,16,0) 9%, rgba(10,12,16,0) 86%, rgba(10,12,16,0.6) 100%)', pointerEvents: 'none'}} />
);
const Watermark: React.FC<{text: string}> = ({text}) => {
  const t = useT();
  return (
    <div style={{position: 'absolute', left: 100, top: 1570, fontFamily: FONT, fontWeight: 600, fontSize: 26, letterSpacing: '0.04em', color: C.text, opacity: 0.5 * k(t, 0, 0.6, 0, 1)}}>
      {text}
    </div>
  );
};
const Timecode: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div style={{position: 'absolute', right: 24, top: 24, fontFamily: 'Consolas, monospace', fontSize: 28, color: '#FFE08A', background: 'rgba(0,0,0,0.6)', padding: '6px 12px'}}>
      {(frame / fps).toFixed(2)}s · f{frame}
    </div>
  );
};

const Sfx: React.FC<{volume: number}> = ({volume}) => {
  const {fps} = useVideoConfig();
  return (
    <>
      {SFX.map((s, i) => (
        <Sequence key={i} name={`sfx ${s.type}`} from={Math.round(s.t * fps)} durationInFrames={Math.round(0.6 * fps)} layout="none">
          <Audio src={staticFile(`kerja12/${s.type}.wav`)} volume={volume * s.gain} />
        </Sequence>
      ))}
    </>
  );
};

export const Kerja12Jam: React.FC<z.infer<typeof kerja12Schema>> = ({watermark, sfxVolume, showTimecode}) => (
  <AbsoluteFill style={{background: C.bg, overflow: 'hidden'}}>
    <Backdrop />
    <Diagram />
    <Room />
    <EmergencyChips />
    <Night />
    <Texts />
    <Foreground />
    <Watermark text={watermark} />
    {showTimecode ? <Timecode /> : null}
    <Audio src={staticFile('kerja12/kerja-12jam.wav')} />
    <Sfx volume={sfxVolume} />
  </AbsoluteFill>
);
