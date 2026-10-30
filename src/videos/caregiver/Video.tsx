import type {ReactNode} from 'react';
import {AbsoluteFill, interpolate, staticFile} from 'remotion';
import {fitText} from '@remotion/layout-utils';
import {Audio} from '@remotion/media';
import {z} from 'zod';
import {FONT, SAFE, kitSchema} from '../../kit/brand';
import {ReviewOverlay, Sfx, Title, Watermark} from '../../kit/components';
import {EASE, k, lerp, life, useT} from '../../kit/motion';
import {Bubble, Chair, Door, Family, FocusRing, GLOW, HangingLamp, Lines, PaperDefs, PaperGrain, PAPER, PC, QuestionMark, RoomShell, Rug, float, popIn, type FamMood} from '../../kit/papercut';
import {AUDIO_SECONDS, CUES, SFX, scene, TITLES, type SceneId} from './timeline';

/** Papercut diorama (src/kit/papercut.tsx): one warm house world plus full-frame paper inserts. */
const C = {
  ...PC,
  text: PC.paper,
  care: '#4C9A92',
  boss: '#6A5784',
  art: PC.kidShirt,
  sheet: '#D9E4E0',
  blanket: '#8FB3C9',
  note: '#9CC59A',
  noteDark: '#5E8F5C',
  insert: '#3B2A2E',
};
/** 10^((-19.5 - 19 - (-17.5)) / 20): measured narration and music LUFS, music 19 dB under. */
const MUSIC_VOLUME = 0.089;

type Move = 'fade' | 'zoom' | 'push' | 'up' | 'cut';

/** Scene layer from a to b with an entrance and exit move (push and cut stay opaque). */
const Layer: React.FC<{a: number; b: number; enter?: Move; exit?: Move; children: ReactNode}> = ({a, b, enter = 'fade', exit = 'fade', children}) => {
  const t = useT();
  if (t < a - 0.5 || t > b + 0.3) return null;
  const pin = enter === 'cut' ? Number(t >= a) : k(t, a - 0.15, a + 0.45, 0, 1);
  const pout = b >= AUDIO_SECONDS ? 0 : exit === 'cut' ? Number(t >= b) : k(t, b - 0.3, b + 0.05, 0, 1, EASE.in);
  const solidIn = enter === 'push' || enter === 'cut';
  const solidOut = exit === 'push' || exit === 'cut';
  const o = (solidIn ? Number(pin > 0) : pin) * (solidOut ? Number(pout < 1) : 1 - pout);
  if (o <= 0) return null;
  const x = (enter === 'push' ? lerp(1080, 0, pin) : 0) + (exit === 'push' ? lerp(0, -1080, pout) : 0);
  const y = (enter === 'up' ? lerp(420, 0, pin) : 0) + (exit === 'up' ? lerp(0, -420, pout) : 0);
  const s = (enter === 'zoom' ? lerp(1.12, 1, pin) : 1) * (exit === 'zoom' ? lerp(1, 1.4, pout) : 1);
  return <AbsoluteFill style={{opacity: o, translate: `${x}px ${y}px`, scale: `${s}`}}>{children}</AbsoluteFill>;
};

const Insert: React.FC<{id: SceneId; enter?: Move; exit?: Move; children: ReactNode}> = ({id, ...rest}) => {
  const {a, b} = scene(id);
  return <Layer a={a} b={b} {...rest} />;
};

const Svg: React.FC<{children: ReactNode}> = ({children}) => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
    {children}
  </svg>
);


/* ---------- props (world and inserts share them) ---------- */

/** Wall clock at the origin. turns = hour-hand turns; the minute hand runs 12x. */
const Clock: React.FC<{r: number; turns: number; mark?: number}> = ({r, turns, mark = 0}) => (
  <g filter={PAPER}>
    <circle r={r + r * 0.12} fill={C.door} />
    <circle r={r} fill={C.paper} />
    {Array.from({length: 12}, (_, i) => (
      <rect key={i} x={-r * 0.025} y={-r * 0.92} width={r * 0.05} height={r * (i % 3 === 0 ? 0.16 : 0.09)} rx={r * 0.02} fill={C.ink} opacity={0.7} transform={`rotate(${i * 30})`} />
    ))}
    {mark > 0 ? (
      <path d={`M0 0 L ${r * 0.8 * Math.sin(Math.PI / 3)} ${-r * 0.8 * Math.cos(Math.PI / 3)} A ${r * 0.8} ${r * 0.8} 0 0 1 ${r * 0.8} 0 Z`} fill={C.defect} opacity={0.28 * mark} />
    ) : null}
    <rect x={-r * 0.045} y={-r * 0.5} width={r * 0.09} height={r * 0.55} rx={r * 0.04} fill={C.ink} transform={`rotate(${turns * 360})`} />
    <rect x={-r * 0.03} y={-r * 0.78} width={r * 0.06} height={r * 0.83} rx={r * 0.03} fill={C.ink} transform={`rotate(${turns * 360 * 12})`} />
    <circle r={r * 0.07} fill={C.defect} />
  </g>
);

/** Paper banknote centered at the origin (300 x 160); label is optional diegetic text. */
const Note: React.FC<{label?: string}> = ({label}) => (
  <g filter={PAPER}>
    <rect x={-150} y={-80} width={300} height={160} rx={14} fill={C.note} />
    <rect x={-130} y={-60} width={260} height={120} rx={10} fill="none" stroke={C.noteDark} strokeWidth={5} />
    <circle cx={label ? -82 : 0} cy={0} r={30} fill={C.noteDark} opacity={0.45} />
    {label ? (
      <text x={30} y={16} fontFamily={FONT} fontWeight={900} fontSize={46} fill={C.ink} textAnchor="middle">
        {label}
      </text>
    ) : null}
  </g>
);

export type Task = 'piring' | 'cucian' | 'sapu' | 'setrika';

/** Paper task card (150 x 150) centered at the origin with a neutral chore icon. */
const TaskCard: React.FC<{kind: Task}> = ({kind}) => (
  <g filter={PAPER}>
    <rect x={-75} y={-75} width={150} height={150} rx={22} fill={C.paper} />
    {kind === 'piring' ? (
      <>
        <ellipse cx={0} cy={18} rx={52} ry={18} fill={C.paperDim} stroke={C.ink} strokeWidth={5} />
        <ellipse cx={0} cy={0} rx={52} ry={18} fill={C.paper} stroke={C.ink} strokeWidth={5} />
        <ellipse cx={0} cy={-18} rx={52} ry={18} fill={C.paper} stroke={C.ink} strokeWidth={5} />
      </>
    ) : kind === 'cucian' ? (
      <>
        <path d="M-50 -12 L 50 -12 L 38 50 L -38 50 Z" fill={C.rug} stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
        <path d="M-30 -12 Q -20 -44 4 -30 Q 26 -50 34 -12" fill={C.blanket} stroke={C.ink} strokeWidth={5} />
      </>
    ) : kind === 'sapu' ? (
      <>
        <rect x={-5} y={-58} width={10} height={70} rx={5} fill={C.woodDark} transform="rotate(18)" />
        <path d="M-6 12 L 40 12 L 52 54 L -30 54 Z" fill={C.wood} stroke={C.ink} strokeWidth={5} strokeLinejoin="round" transform="rotate(18)" />
      </>
    ) : (
      <>
        <path d="M-52 30 Q -48 -24 18 -24 L 52 -24 L 52 30 Z" fill={C.metal} stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
        <path d="M-8 -24 Q -8 -48 20 -48 L 40 -48" fill="none" stroke={C.ink} strokeWidth={8} strokeLinecap="round" />
      </>
    )}
  </g>
);

/** Call bell icon at the origin; ring = 0..1 shake + rings. */
const Bell: React.FC<{ring: number}> = ({ring}) => (
  <g transform={`rotate(${Math.sin(ring * Math.PI * 6) * 14 * ring})`} filter={PAPER}>
    <path d="M-40 26 Q -40 -40 0 -44 Q 40 -40 40 26 Z" fill={C.glow} stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
    <rect x={-50} y={22} width={100} height={14} rx={7} fill={C.ink} />
    <circle cy={46} r={10} fill={C.ink} />
    {ring > 0 ? (
      <g stroke={C.paper} strokeWidth={6} strokeLinecap="round" fill="none" opacity={ring}>
        <path d="M-64 -30 Q -78 -6 -64 18 M64 -30 Q 78 -6 64 18" />
      </g>
    ) : null}
  </g>
);

/** Paper energy bar at the origin (160 x 64); level 0..1. */
const Battery: React.FC<{level: number}> = ({level}) => (
  <g filter={PAPER}>
    <rect x={-80} y={-32} width={160} height={64} rx={14} fill={C.paper} />
    <rect x={80} y={-14} width={14} height={28} rx={4} fill={C.paper} />
    <rect x={-68} y={-20} width={136 * level} height={40} rx={8} fill={level > 0.4 ? C.care : C.defect} />
  </g>
);

/** Own-need icons for the "waiting turn" queue: water, meal, sleep. */
const Need: React.FC<{kind: 'minum' | 'makan' | 'tidur'}> = ({kind}) => (
  <g filter={PAPER}>
    <circle r={62} fill={C.paper} />
    {kind === 'minum' ? (
      <>
        <path d="M-24 -32 L 24 -32 L 18 36 L -18 36 Z" fill={C.blanket} stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
        <path d="M-22 -10 L 22 -10" stroke={C.ink} strokeWidth={4} />
      </>
    ) : kind === 'makan' ? (
      <>
        <ellipse cx={0} cy={10} rx={40} ry={16} fill={C.paperDim} stroke={C.ink} strokeWidth={5} />
        <path d="M-26 6 Q 0 -30 26 6 Z" fill={C.wood} stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
      </>
    ) : (
      <path d="M14 -36 A 38 38 0 1 0 30 22 A 30 30 0 1 1 14 -36 Z" fill={C.glow} stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
    )}
  </g>
);

/** Phone (420 x 760) centered at the origin; children draw in screen-local units inside the glass. */
const Phone: React.FC<{children?: ReactNode}> = ({children}) => (
  <g>
    <rect x={-210} y={-380} width={420} height={760} rx={56} fill={C.ink} filter={PAPER} />
    <rect x={-186} y={-350} width={372} height={700} rx={36} fill={C.wall2} />
    <rect x={-50} y={-366} width={100} height={10} rx={5} fill={C.wall2} />
    {children}
  </g>
);

/* ---------- house world (one set, one camera) ---------- */

const FLOOR = 1500;
const CLOCK = {x: 700, y: 880, r: 80};

/** Keyframes [seconds, value...]; eased between neighbours, held outside. */
type Key = readonly [number, ...number[]];
const track = (t: number, keys: readonly Key[], i: number) => {
  if (t <= keys[0][0]) return keys[0][i];
  for (let j = 1; j < keys.length; j++) {
    const [a, b] = [keys[j - 1], keys[j]];
    if (t <= b[0]) return interpolate(t, [a[0], b[0]], [a[i], b[i]], {easing: EASE.inOut});
  }
  return keys[keys.length - 1][i];
};
/** Walk phase while a figure's x track is moving. */
const walkOf = (t: number, keys: readonly Key[]) => (Math.abs(track(t + 0.05, keys, 1) - track(t - 0.05, keys, 1)) > 2 ? t * 1.7 : 0);

/** Camera [t, world x, world y at screen center, zoom]. Repeated values = hold (drift added on top). */
const CAM: Key[] = [
  [0, 620, 1150, 1.25],
  [6.3, 620, 1150, 1.3],
  [7.3, 1180, 1150, 1.1],
  [8.45, 1180, 1150, 1.12],
  [9.15, CLOCK.x, CLOCK.y, 4.6],
  [14.9, CLOCK.x, CLOCK.y, 4.6],
  [15.6, 640, 1150, 1.3],
  [22.5, 640, 1150, 1.45],
  [23.4, 1160, 1150, 1.15],
  [30.4, 1160, 1150, 1.2],
  [31.4, 640, 1150, 1.3],
  [38.3, 640, 1150, 1.4],
  [42.3, 900, 1150, 1.15],
  [49.0, 900, 1150, 1.2],
  [49.6, 760, 1150, 1.3],
  [55.6, 760, 1150, 1.45],
  [56.4, 600, 1150, 1.15],
  [64.6, 600, 1150, 1.25],
  [75.7, 640, 1150, 1.3],
  [77.4, 800, 1150, 0.76],
  [82.4, 800, 1150, 0.75],
];

/** Caregiver feet x. Jumps happen under full-frame inserts. */
const CARE_X: Key[] = [
  [0, 760], [6.4, 760], [7.3, 1080], [9.15, 1080], [9.2, 760],
  [18.8, 760], [19.4, 980], [20.2, 980], [20.8, 760],
  [23.3, 760], [24.4, 1060], [30.4, 1060], [31.6, 760],
  [55.6, 760], [56.6, 600], [80.4, 600], [81.6, 1000],
];
/** Boss feet x; off-stage at 1800. */
const BOSS_X: Key[] = [
  [22.8, 1800], [24.0, 1300], [30.5, 1300], [31.6, 1800],
  [42.3, 1800], [43.3, 1120], [48.2, 1120], [49.0, 1800],
];

const careMood = (t: number): FamMood => {
  if (t < 4.2) return 'neutral';
  if (t < 30.4) return t > 18.7 ? 'concerned' : 'curious';
  if (t < 34.6) return 'neutral';
  return 'concerned';
};

/** Call-bell onsets: patient needs her (narration "siap", "berantakan", final wide). */
const RINGS = [4.3, 15.3, 19.0, 20.6, 80.2];
const ringAt = (t: number) => Math.max(0, ...RINGS.map((r) => life(t, r, r + 0.9, 0.1, 0.3)));

/** Patient resting in bed: pillow, head with closed eyes, breathing blanket. */
const Patient: React.FC = () => {
  const t = useT();
  const br = Math.sin(t * 1.6) * 4;
  return (
    <g>
      <ellipse cx={210} cy={1280} rx={90} ry={34} fill={C.paper} filter={PAPER} />
      <g transform="translate(220 1240)" filter={PAPER}>
        <circle r={46} fill={C.famSkin} />
        <path d="M-48 6 Q -50 -50 0 -50 Q 40 -50 46 -20 Q 10 -34 -20 -20 Q -36 -10 -48 6 Z" fill={C.paperDim} />
        <path d="M-24 4 Q -16 10 -8 4 M8 4 Q 16 10 24 4" stroke={C.ink} strokeWidth={4} strokeLinecap="round" fill="none" />
      </g>
      <path d={`M260 ${1270 - br} Q 400 ${1236 - br} 560 ${1262 - br} L 560 1340 L 250 1340 Z`} fill={C.blanket} filter={PAPER} />
    </g>
  );
};

const House: React.FC<{t: number}> = ({t}) => {
  const turns = t / 50 + 0.12 * Math.sin(t * 2.3) * k(t, 18.7, 19.2, 0, 1) * (1 - k(t, 22, 22.4, 0, 1)) + 0.08 * k(t, 52.3, 55.2, 0, 1, EASE.inOut);
  return (
    <>
      <g transform="translate(1000 0)">
        <RoomShell floorY={FLOOR} />
      </g>
      <RoomShell floorY={FLOOR} />
      {/* patient room */}
      <HangingLamp x={340} y={900} glow={0.5 + 0.05 * Math.sin(t * 0.9)} />
      <g transform={`translate(${CLOCK.x} ${CLOCK.y})`}>
        <Clock r={CLOCK.r} turns={turns} />
      </g>
      <g filter={PAPER}>
        <rect x={110} y={1180} width={34} height={320} rx={10} fill={C.door} />
        <rect x={130} y={1320} width={460} height={110} rx={18} fill={C.sheet} />
        <rect x={130} y={1420} width={460} height={30} rx={10} fill={C.door} />
        <rect x={556} y={1260} width={30} height={240} rx={10} fill={C.door} />
      </g>
      <Patient />
      <rect x={600} y={1370} width={110} height={130} rx={12} fill={C.wood} filter={PAPER} />
      <g transform="translate(655 1322) scale(0.75)">
        <Bell ring={ringAt(t)} />
      </g>
      <g transform={`translate(860 ${FLOOR - 89 * 1.3}) scale(1.3)`} filter={PAPER}>
        <Chair />
      </g>
      <Door x={980} y={FLOOR} />
      {/* kitchen */}
      <g filter={PAPER}>
        <rect x={1260} y={860} width={360} height={170} rx={14} fill={C.woodDark} />
        <rect x={1300} y={1330} width={340} height={170} rx={14} fill={C.wood} />
        <rect x={1290} y={1310} width={360} height={30} rx={10} fill={C.woodDark} />
        <rect x={1360} y={1290} width={120} height={22} rx={8} fill={C.metal} />
      </g>
      <g transform="translate(1560 1270) scale(0.5)">
        <TaskCard kind="piring" />
      </g>
      <Rug x={760} y={FLOOR + 60} rx={360} ry={50} />
    </>
  );
};

/** Task cards floating at world positions, each with its own lifecycle. */
const Cards: React.FC<{t: number; items: readonly {a: number; b: number; x: number; y: number; kind: Task; s?: number}[]}> = ({t, items}) => (
  <>
    {items.map((c, i) => {
      const o = life(t, c.a, c.b, 0.3, 0.25);
      if (o <= 0) return null;
      return (
        <g key={i} opacity={o} transform={`translate(${c.x} ${c.y + float(t, 5, 3.6, i * 0.23)}) scale(${(c.s ?? 0.8) * popIn(t, c.a)}) rotate(${(i % 2 ? 1 : -1) * 5})`}>
          <TaskCard kind={c.kind} />
        </g>
      );
    })}
  </>
);

const KINDS: Task[] = ['piring', 'cucian', 'sapu', 'setrika'];
const PILE = Array.from({length: 6}, (_, i) => ({a: 49.25 + i * 0.85, b: 55.5, x: 930 + (i % 2) * 14, y: 1420 - i * 96, kind: KINDS[i % 4], s: 0.62}));

const World: React.FC = () => {
  const t = useT();
  const inInsert = (['jam', 'kapan', 'ringkas', 'video', 'cta'] as const).some((id) => t >= scene(id).a + 0.6 && t < scene(id).b - 0.4);
  if (inInsert) return null;
  const z = track(t, CAM, 3);
  const cx = track(t, CAM, 1) + float(t, 6, 6.5);
  const cy = track(t, CAM, 2) + float(t, 4, 5.2, 0.3);
  const cxPos = track(t, CARE_X, 1);
  const bx = track(t, BOSS_X, 1);
  const dip = Math.max(...RINGS.map((r) => k(t, r, r + 0.2, 0, 1) * (1 - k(t, r + 0.2, r + 0.5, 0, 1))));
  const lean = k(t, 56.6, 57.2, 0, 1) * (1 - k(t, 80.2, 80.5, 0, 1));
  const battery = life(t, 32.0, 38.2) > 0 ? {o: life(t, 32.0, 38.2), level: 0.35} : {o: life(t, 49.4, 55.5), level: k(t, 49.6, 55.2, 0.9, 0.12, EASE.inOut)};
  return (
    <Svg>
      <g transform={`translate(540 960) scale(${z}) translate(${-cx} ${-cy})`}>
        <House t={t} />
        {/* gaji: the salary as a paper note above her (number lives in the title) */}
        <g opacity={life(t, 0.3, 4.1)} transform={`translate(${cxPos - 200} ${1060 + float(t, 6, 3.4)}) scale(${0.7 * popIn(t, 0.3)}) rotate(-6)`}>
          <Note />
        </g>
        {/* ART is always in the kitchen; highlighted when narration names her */}
        <Family x={1470} y={FLOOR + 10} mood="neutral" shirt={C.art} />
        <FocusRing x={1470} y={1150} s={life(t, 27.5, 30.2) * popIn(t, 27.5)} />
        {bx < 1760 ? <Family x={bx} y={FLOOR + 14} s={1.06} mood={t > 42.3 ? 'happy' : 'neutral'} shirt={C.boss} walk={walkOf(t, BOSS_X)} talk={(t > 24.2 && t < 26.4) || (t > 44.6 && t < 45.9)} /> : null}
        <g transform={`rotate(${-6 * lean} ${cxPos} ${FLOOR})`}>
          <Family x={cxPos} y={FLOOR + 8 + dip * 10} mood={careMood(t)} shirt={C.care} walk={walkOf(t, CARE_X)} />
        </g>
        {battery.o > 0 ? (
          <g opacity={battery.o} transform={`translate(${cxPos} ${1010 + float(t, 4, 3)}) scale(${0.8 * popIn(t, battery.level > 0.35 ? 49.4 : 32)})`}>
            <Battery level={battery.level} />
          </g>
        ) : null}
        {/* gaji: the side chores */}
        <Cards
          t={t}
          items={[
            {a: 6.5, b: 8.7, x: 1100, y: 1000, kind: 'piring'},
            {a: 6.65, b: 8.7, x: 1260, y: 940, kind: 'cucian'},
            {a: 6.8, b: 8.7, x: 1420, y: 1000, kind: 'sapu'},
          ]}
        />
        {/* bos: chores handed over */}
        <Cards
          t={t}
          items={[
            {a: 24.6, b: 30.2, x: 920, y: 1000, kind: 'piring'},
            {a: 25.4, b: 30.2, x: 1060, y: 940, kind: 'cucian'},
            {a: 26.2, b: 30.2, x: 1200, y: 1000, kind: 'sapu'},
          ]}
        />
        {/* senggang: free time is not free */}
        <g opacity={life(t, 31.4, 34.4)} transform={`translate(860 ${1250 + float(t, 6, 3)}) scale(${0.8 * popIn(t, 31.4)})`}>
          <QuestionMark x={0} y={0} />
        </g>
        <Cards
          t={t}
          items={KINDS.map((kind, i) => ({a: 34.7 + i * 0.35, b: 38.2, x: 930 + (i % 2) * 120, y: 960 + Math.floor(i / 2) * 150, kind, s: 0.7}))}
        />
        {/* sekalian: one small extra task */}
        <Cards t={t} items={[{a: 46.8, b: 48.9, x: 930, y: 1000, kind: 'setrika', s: 0.7}]} />
        {/* tumpuk: the pile grows; clock highlighted on "waktu istirahat" */}
        <Cards t={t} items={PILE} />
        <FocusRing x={CLOCK.x} y={CLOCK.y} s={life(t, 52.4, 55.4) * popIn(t, 52.4)} />
        {/* giliran: patient first, own needs queue */}
        <FocusRing x={220} y={1240} s={life(t, 59.0, 61.1) * popIn(t, 59.0)} />
        {(['minum', 'makan', 'tidur'] as const).map((kind, i) => {
          const a = 61.35 + i * 0.3;
          return (
            <g key={kind} opacity={0.88 * life(t, a, 64.5)} transform={`translate(${720 + i * 100} ${980 + float(t, 5, 3.2, i * 0.3)}) scale(${0.72 * popIn(t, a)})`}>
              <Need kind={kind} />
            </g>
          );
        })}
        {/* sendiri: wide, she is alone with the work */}
        <FocusRing x={cxPos} y={1150} s={life(t, 77.5, 80.0) * popIn(t, 77.5) * 1.6} />
      </g>
    </Svg>
  );
};

/* ---------- full-frame paper inserts ---------- */

const Backdrop: React.FC = () => (
  <>
    <rect width={1080} height={1920} fill={C.insert} />
    <circle cx={540} cy={1060} r={620} fill={GLOW} opacity={0.35} />
  </>
);

/** Match cut from the wall clock: free time is unclear, then the hands run on with no end. */
const SJam: React.FC = () => {
  const t = useT();
  const {a} = scene('jam');
  const run = Math.max(0, t - CUES.LHA);
  const turns = 0.12 + (t - a) / 40 + 0.05 * run * run;
  return (
    <Insert id="jam" enter="zoom" exit="fade">
      <Svg>
        <Backdrop />
        <g transform={`translate(540 ${1060 + float(t, 6, 4)}) scale(${popIn(t, a - 0.1)})`}>
          <Clock r={280} turns={turns} mark={life(t, 9.85, 12.0)} />
        </g>
        {[
          {x: 220, y: 760, rot: -14},
          {x: 860, y: 820, rot: 12},
          {x: 840, y: 1460, rot: 8},
        ].map((q, i) => {
          const s = popIn(t, CUES.LHA + 0.4 + i * 0.15) * life(t, CUES.LHA + 0.4 + i * 0.15, 14.7);
          return s > 0 ? (
            <g key={i} opacity={Math.min(1, s)} transform={`translate(${q.x} ${q.y + float(t, 6, 3, i * 0.3)}) scale(${s})`}>
              <QuestionMark x={0} y={0} rot={q.rot} />
            </g>
          ) : null;
        })}
      </Svg>
    </Insert>
  );
};

/** The empty chair: rest is right there, but chores keep sliding in front of it. */
const SKapan: React.FC = () => {
  const t = useT();
  const {a} = scene('kapan');
  return (
    <Insert id="kapan" enter="up" exit="zoom">
      <Svg>
        <Backdrop />
        <ellipse cx={540} cy={1440} rx={300} ry={40} fill={C.ink} opacity={0.3} />
        <g transform={`translate(540 ${1440 - 89 * 2.6 + float(t, 4, 4.4)}) scale(${2.6 * popIn(t, a)})`} filter={PAPER}>
          <Chair />
        </g>
        <g opacity={life(t, 39.3, 42.0)} transform={`translate(560 ${880 + float(t, 6, 3)}) scale(${popIn(t, 39.3)})`}>
          <QuestionMark x={0} y={0} rot={8} />
        </g>
        {KINDS.slice(0, 3).map((kind, i) => {
          const s = 40.3 + i * 0.2;
          const x = k(t, s, s + 0.5, 1300, 330 + i * 210, EASE.out);
          return (
            <g key={kind} opacity={life(t, s, 42.1, 0.2)} transform={`translate(${x} ${1300 + float(t, 5, 3, i * 0.3)}) scale(0.9) rotate(${(i - 1) * 6})`}>
              <TaskCard kind={kind} />
            </g>
          );
        })}
      </Svg>
    </Insert>
  );
};

/** Recap: the note stays the same size while the tasks pile up and the clock has no end. */
const SRingkas: React.FC = () => {
  const t = useT();
  const {a} = scene('ringkas');
  const fan = [-150, 150, -230, 230, 0];
  return (
    <Insert id="ringkas" enter="push" exit="zoom">
      <Svg>
        <Backdrop />
        {fan.map((dx, i) => {
          const s = CUES.GAJINYA + 0.9 + i * 0.3;
          return (
            <g key={i} opacity={life(t, s, 71.6, 0.25)} transform={`translate(${540 + dx} ${880 - Math.abs(dx) * 0.5 - (i === 4 ? 200 : 0) + float(t, 5, 3.4, i * 0.2)}) scale(${0.85 * popIn(t, s)}) rotate(${dx / 14})`}>
              <TaskCard kind={KINDS[i % 4]} />
            </g>
          );
        })}
        <g transform={`translate(540 ${1040 + float(t, 4, 4)}) scale(${1.25 * popIn(t, a + 0.2)}) rotate(-4)`}>
          <Note label="2 JUTA" />
        </g>
        <g opacity={life(t, CUES.TETAPI, 71.6)} transform={`translate(540 ${1380 + float(t, 4, 3.6, 0.4)}) scale(${popIn(t, CUES.TETAPI)})`}>
          <Clock r={120} turns={0.2 + 0.06 * Math.max(0, t - CUES.TETAPI) ** 2} />
        </g>
        <g opacity={life(t, 69.5, 71.6)} transform={`translate(720 ${1300 + float(t, 5, 3)}) scale(${0.7 * popIn(t, 69.5)})`}>
          <QuestionMark x={0} y={0} rot={10} />
        </g>
      </Svg>
    </Insert>
  );
};

/** Phone showing the earlier video: the same caregiver figure as a thumbnail. */
const ThumbScreen: React.FC<{t: number; a: number}> = ({t, a}) => (
  <>
    <rect x={-160} y={-300} width={320} height={460} rx={22} fill={C.wall} />
    <rect x={-160} y={60} width={320} height={100} fill={C.floor} />
    <Family x={0} y={110} s={0.55} mood="concerned" shirt={C.care} />
    <g opacity={1 - k(t, a + 1.2, a + 1.6, 0, 1)}>
      <circle cx={0} cy={-170} r={52} fill={C.ink} opacity={0.6} />
      <path d="M-16 -196 L 26 -170 L -16 -144 Z" fill={C.paper} />
    </g>
    <rect x={-160} y={196} width={320} height={10} rx={5} fill={C.paperDim} opacity={0.4} />
    <rect x={-160} y={196} width={320 * k(t, a + 1.2, a + 4, 0, 0.7, (u) => u)} height={10} rx={5} fill={C.defect} />
    <rect x={-160} y={236} width={200} height={16} rx={8} fill={C.paperDim} opacity={0.6} />
    <rect x={-160} y={270} width={130} height={16} rx={8} fill={C.paperDim} opacity={0.4} />
  </>
);

const SVideo: React.FC = () => {
  const t = useT();
  const {a} = scene('video');
  return (
    <Insert id="video" enter="zoom" exit="zoom">
      <Svg>
        <Backdrop />
        <g transform={`translate(540 ${1100 + float(t, 6, 4.2)}) scale(${1.15 * popIn(t, a - 0.1)}) rotate(${-3 + float(t, 1, 5)})`}>
          <Phone>
            <ThumbScreen t={t} a={a} />
          </Phone>
        </g>
      </Svg>
    </Insert>
  );
};

/** Closing: the same phone returns, comments (abstract rows) keep arriving. */
const COMMENTS = [83.0, 84.6, 86.75, 88.8];
const SCta: React.FC = () => {
  const t = useT();
  const {a} = scene('cta');
  const scroll = COMMENTS.reduce((s, c, i) => s + (i > 1 ? k(t, c - 0.1, c + 0.35, 0, 1) * 130 : 0), 0);
  return (
    <Insert id="cta" enter="up">
      <Svg>
        <Backdrop />
        <g transform={`translate(540 ${1150 + float(t, 6, 4.2)}) scale(1.1)`}>
          <Phone>
            <g transform="translate(0 -250) scale(0.42)">
              <ThumbScreen t={t} a={a - 6} />
            </g>
            <rect x={-186} y={-120} width={372} height={4} fill={C.paperDim} opacity={0.3} />
            <g transform={`translate(0 ${-scroll})`}>
              {COMMENTS.map((c, i) => {
                const p = k(t, c, c + 0.4, 0, 1);
                const y = -60 + i * 130;
                return (
                  <g key={c} opacity={p * k(t, c, c + 0.2, 0, 1) * (y - scroll < -100 ? 0 : 1)} transform={`translate(${(1 - p) * 60} ${y})`}>
                    <circle cx={-140} cy={20} r={26} fill={[C.care, C.rug, C.art, C.blanket][i]} />
                    <rect x={-100} y={-10} width={260} height={84} rx={20} fill={C.paper} />
                    <rect x={-80} y={10} width={200 - (i % 2) * 60} height={14} rx={7} fill={C.ink} opacity={0.5} />
                    <rect x={-80} y={40} width={130 + (i % 2) * 40} height={14} rx={7} fill={C.ink} opacity={0.35} />
                  </g>
                );
              })}
            </g>
          </Phone>
        </g>
      </Svg>
    </Insert>
  );
};

/* ---------- root ---------- */

const TITLE_W = 1080 - SAFE.left - SAFE.right - 40;
const titleSize = (text: string) => Math.min(96, Math.floor(fitText({text, withinWidth: TITLE_W, fontFamily: FONT, fontWeight: 900, letterSpacing: '0.02em'}).fontSize));

export const Video: React.FC<z.infer<typeof kitSchema>> = ({watermark, sfxVolume, showReview}) => (
  <AbsoluteFill style={{background: C.insert, overflow: 'hidden'}}>
    <PaperDefs />
    <World />
    {/* bos hands over chores (abstract), later the short line from the script */}
    <Bubble a={24.2} b={26.8} x={360} y={560} tail="right" maxW={420}>
      <Lines n={3} w={240} />
    </Bubble>
    <Bubble a={CUES.SEKALIAN - 0.3} b={46.55} x={300} y={560} tail="right" maxW={600}>
      Sekalian bantu.
    </Bubble>
    <SJam />
    <SKapan />
    <SRingkas />
    <SVideo />
    <SCta />
    {TITLES.map((w) => (
      <Title key={w.a} a={w.a} b={w.b} top={SAFE.top + 40} lines={w.lines.map((text, i) => ({text, size: titleSize(text), color: i === w.lines.length - 1 && w.lines.length > 1 ? C.glow : C.text}))} />
    ))}
    <PaperGrain />
    <Watermark text={watermark} color={C.text} />
    <Audio src={staticFile('videos/caregiver/narration.wav')} />
    <Audio src={staticFile('videos/caregiver/music.wav')} volume={MUSIC_VOLUME} />
    <Sfx cues={SFX} volume={sfxVolume} />
    {showReview ? <ReviewOverlay /> : null}
  </AbsoluteFill>
);
