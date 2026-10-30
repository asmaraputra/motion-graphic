import {AbsoluteFill, Easing, interpolateColors, spring, staticFile} from 'remotion';
import {evolvePath} from '@remotion/paths';
import {Audio} from '@remotion/media';
import {z} from 'zod';
import {FONT, INK, kitSchema} from '../../kit/brand';
import {ReviewOverlay, Sfx, Title, Watermark, type TitleLine} from '../../kit/components';
import {EASE, k, lerp, life, useT} from '../../kit/motion';
import {AUDIO_SECONDS, CUES, FPS, SFX, scene, type SceneId} from './timeline';

/** Editorial flat: paper cream, forest greens, palm orange, water blue. No outlines except icon strokes. */
const C = {
  ...INK,
  bg: '#F3EBDC',
  bg2: '#E8DCC4',
  ink: '#1E2B24',
  dim: 'rgba(30,43,36,0.62)',
  forest: '#2E6A4C',
  leaf: '#4F9160',
  moss: '#7FB06A',
  ground: '#A9C67F',
  trunk: '#6B4A33',
  palm: '#D98A2B',
  palmText: '#B5631A',
  frond: '#8A9A3A',
  water: '#3C8DC2',
  waterText: '#22699C',
  soil: '#A47450',
  soilDark: '#7A5236',
  fire: '#E4572E',
  fireText: '#C23E1C',
  flame: '#F4B23E',
  smoke: '#8F8A83',
  ash: '#9C968C',
  carbon: '#3F4552',
  ape: '#B4532A',
  apeFace: '#E3A877',
  paper: '#FFFCF5',
};
const SW = 6; // one icon stroke weight for the whole video
const CX = 500; // center of the safe width (100..900)
const GROUND_Y = 1480;
/** Top of the curved ground strip at x (the Backdrop path is a quadratic with x linear in its parameter). */
const groundAt = (x: number) => GROUND_Y + 10 - 80 * (x / 1080) * (1 - x / 1080);
// music.wav -19.6 LUFS vs narration -20.9 LUFS: -20.3 dB puts it about 19 dB under the voice.
const MUSIC_VOLUME = 0.097;
const lin = Easing.linear;

type Move = 'fade' | 'zoom' | 'push' | 'up' | 'cut';

/** Slow sine float for living holds. */
const float = (t: number, amp = 6, period = 4, phase = 0) => Math.sin((t / period + phase) * Math.PI * 2) * amp;
/** Spring 0 → 1 from time a; damping 15 keeps overshoot near 5% (illustration limit 8%). */
const pop = (t: number, a: number) => (t < a ? 0 : spring({frame: (t - a) * FPS, fps: FPS, config: {damping: 15, stiffness: 120}}));
const blink = (t: number, phase = 0) => ((t + phase) % 3.7 < 0.12 ? 0.15 : 1);

/** Scene layer with a per-scene entrance and exit move (push and cut stay opaque). */
const Layer: React.FC<{id: SceneId; enter?: Move; exit?: Move; children: React.ReactNode}> = ({id, enter = 'fade', exit = 'fade', children}) => {
  const t = useT();
  const {a, b} = scene(id);
  if (t < a - 0.5 || t > b + 0.3) return null;
  const pin = a === 0 ? 1 : enter === 'cut' ? Number(t >= a) : k(t, a - 0.15, a + 0.45, 0, 1);
  const pout = b >= AUDIO_SECONDS ? 0 : exit === 'cut' ? Number(t >= b) : k(t, b - 0.3, b + 0.05, 0, 1, EASE.in);
  const solidIn = enter === 'push' || enter === 'cut' || a === 0;
  const solidOut = exit === 'push' || exit === 'cut';
  const o = (solidIn ? Number(pin > 0) : pin) * (solidOut ? Number(pout < 1) : 1 - pout);
  if (o <= 0) return null;
  const x = (enter === 'push' ? lerp(1080, 0, pin) : 0) + (exit === 'push' ? lerp(0, -1080, pout) : 0);
  const y = (enter === 'up' ? lerp(380, 0, pin) : 0) + (exit === 'up' ? lerp(0, -380, pout) : 0);
  const s = (enter === 'zoom' ? lerp(1.12, 1, pin) : 1) * (exit === 'zoom' ? lerp(1, 1.5, pout) : 1);
  return <AbsoluteFill style={{opacity: o, translate: `${x}px ${y}px`, scale: `${s}`}}>{children}</AbsoluteFill>;
};

const Svg: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', inset: 0, ...style}}>
    {children}
  </svg>
);

/** Scale a group around (x, y). */
const Grow: React.FC<{x: number; y: number; s: number; children: React.ReactNode}> = ({x, y, s, children}) =>
  s <= 0 ? null : <g transform={`translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})`}>{children}</g>;

/** Keyword title in dark ink (kit Title defaults to light text for dark backgrounds). */
const T: React.FC<{a: number; b: number; top: number; lines: TitleLine[]}> = ({lines, ...p}) => (
  <Title {...p} shadow="none" lines={lines.map((l) => ({...l, color: l.color ?? C.ink}))} />
);

/** Rounded keyword chip centered on (x, y); no overshoot (text limit 3%). */
const Chip: React.FC<{a: number; b: number; x: number; y: number; text: string; color: string}> = ({a, b, x, y, text, color}) => {
  const t = useT();
  const o = life(t, a, b, 0.3, 0.25);
  if (o <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y + float(t, 4, 4.5, x / 900),
        translate: '-50% -50%',
        scale: `${0.92 + 0.08 * k(t, a, a + 0.35, 0, 1)}`,
        opacity: o,
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: 56,
        color,
        padding: '4px 30px 6px',
        border: `5px solid ${color}`,
        borderRadius: 999,
        background: C.paper,
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
  );
};

/* ---------- backdrop: paper sky, drifting clouds, one ground strip that changes with the story ---------- */

const Backdrop: React.FC = () => {
  const t = useT();
  const haze = k(t, 44.9, 46, 0, 0.32) * k(t, 51.7, 53, 1, 0);
  const grey = k(t, 51.7, 53, 0, 0.22) * k(t, 57, 59, 1, 0);
  return (
    <Svg>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.bg} />
          <stop offset="1" stopColor={C.bg2} />
        </linearGradient>
        <linearGradient id="haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.fire} stopOpacity={0.15} />
          <stop offset="1" stopColor={C.flame} stopOpacity={0.9} />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#sky)" />
      <rect width={1080} height={1920} fill="url(#haze)" opacity={haze} />
      <rect width={1080} height={1920} fill={C.smoke} opacity={grey} />
      {[0, 1].map((i) => {
        const x = ((i * 640 + t * 9) % 1500) - 250;
        return (
          <g key={i} transform={`translate(${x} ${560 + i * 260})`} fill={C.paper} opacity={0.8}>
            <ellipse cx={0} cy={0} rx={110} ry={34} />
            <ellipse cx={-40} cy={-24} rx={56} ry={36} />
            <ellipse cx={34} cy={-30} rx={64} ry={42} />
          </g>
        );
      })}
      {/* Ground: green forest, scorched, ash, bare plantation soil, green again, then neutral for the scale. */}
      <path
        d={`M0 ${GROUND_Y + 10} Q 540 ${GROUND_Y - 30} 1080 ${GROUND_Y + 10} L1080 1920 L0 1920 Z`}
        fill={interpolateColors(
          t,
          [0, 44.6, 46, 51.7, 52.6, 68.1, 69, 74.2, 75.2, 78.8, 79.6],
          [C.ground, C.ground, '#8A5038', '#8A5038', C.ash, C.ash, '#C9B47C', '#C9B47C', '#9CC56C', '#9CC56C', C.bg2],
        )}
      />
    </Svg>
  );
};

/* ---------- illustrations (SVG, origin at the base unless noted) ---------- */

const TREE_FILL = [
  [C.forest, C.leaf],
  [C.leaf, C.moss],
  [C.moss, C.forest],
];

/** Mixed forest trees: kind 0 round, 1 tall, 2 layered. burn 0..1 chars the canopy. */
const Tree: React.FC<{x: number; y: number; s?: number; kind?: number; t: number; burn?: number; phase?: number}> = ({x, y, s = 1, kind = 0, t, burn = 0, phase = 0}) => {
  const sway = float(t, 1.6, 3.5, phase);
  const [c1, c2] = TREE_FILL[kind % 3].map((c) => interpolateColors(burn, [0, 1], [c, '#3B2A22']));
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-13} y={-180} width={26} height={180} rx={9} fill={C.trunk} />
      <g transform={`rotate(${sway} 0 -150)`}>
        {kind % 3 === 0 ? (
          <>
            <circle cx={-52} cy={-205} r={70} fill={c1} />
            <circle cx={52} cy={-215} r={66} fill={c1} />
            <circle cx={0} cy={-275} r={82} fill={c2} />
          </>
        ) : kind % 3 === 1 ? (
          <>
            <ellipse cx={0} cy={-300} rx={72} ry={150} fill={c1} />
            <ellipse cx={-18} cy={-330} rx={34} ry={96} fill={c2} />
          </>
        ) : (
          <>
            <ellipse cx={0} cy={-205} rx={132} ry={56} fill={c1} />
            <ellipse cx={0} cy={-262} rx={96} ry={50} fill={c2} />
            <ellipse cx={0} cy={-312} rx={56} ry={38} fill={c1} />
          </>
        )}
      </g>
    </g>
  );
};

const FRONDS = [-178, -152, -126, -102, -78, -54, -28, -2];
/** Oil palm: ringed trunk, drooping fronds, orange fruit bunch. About 470 px tall at s = 1. */
const Palm: React.FC<{x: number; y: number; s?: number; t: number; phase?: number}> = ({x, y, s = 1, t, phase = 0}) => {
  const sway = float(t, 2, 4.2, phase);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-18 0 L-11 -300 L11 -300 L18 0 Z" fill="#7C5B3B" />
      {[-60, -120, -180, -240].map((yy) => (
        <path key={yy} d={`M-14 ${yy} L0 ${yy - 16} L14 ${yy}`} fill="none" stroke="#5E4329" strokeWidth={5} strokeLinecap="round" />
      ))}
      <g transform={`translate(0 -300) rotate(${sway})`}>
        {FRONDS.map((deg, i) => {
          const r = (deg * Math.PI) / 180;
          const L = i % 2 ? 160 : 185;
          const ex = Math.cos(r) * L;
          const ey = Math.sin(r) * L + 55;
          return <path key={deg} d={`M0 0 Q ${Math.cos(r) * L * 0.55} ${Math.sin(r) * L * 0.55 - 34} ${ex} ${ey}`} fill="none" stroke={i % 2 ? C.frond : '#6F8530'} strokeWidth={17} strokeLinecap="round" />;
        })}
        <circle cx={-14} cy={12} r={14} fill={C.palm} />
        <circle cx={12} cy={14} r={14} fill={C.palm} />
        <circle cx={0} cy={28} r={13} fill="#C0721F" />
      </g>
    </g>
  );
};

/** Orangutan hanging from a branch; origin at the gripping hands. */
const Orangutan: React.FC<{x: number; y: number; s?: number; t: number}> = ({x, y, s = 1, t}) => {
  const swing = float(t, 5, 3.2);
  const e = blink(t, 0.8);
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) rotate(${swing})`}>
      <path d="M-26 0 Q -50 60 -46 118 M26 0 Q 50 60 46 118" fill="none" stroke={C.ape} strokeWidth={24} strokeLinecap="round" />
      <ellipse cx={0} cy={180} rx={60} ry={78} fill={C.ape} />
      <path d="M-30 240 Q -40 290 -22 312 M30 240 Q 40 290 22 312" fill="none" stroke={C.ape} strokeWidth={22} strokeLinecap="round" />
      <circle cx={0} cy={98} r={44} fill={C.ape} />
      <ellipse cx={0} cy={108} rx={30} ry={25} fill={C.apeFace} />
      <ellipse cx={-11} cy={100} rx={4.5} ry={5 * e} fill={C.ink} />
      <ellipse cx={11} cy={100} rx={4.5} ry={5 * e} fill={C.ink} />
      <path d="M-8 120 Q 0 125 8 120" fill="none" stroke={C.ink} strokeWidth={3} strokeLinecap="round" />
    </g>
  );
};

/** Flickering flame; base at (x, y). */
const Flame: React.FC<{x: number; y: number; s?: number; t: number; phase?: number}> = ({x, y, s = 1, t, phase = 0}) => {
  if (s <= 0) return null;
  const fy = 1 + 0.08 * Math.sin(t * 7 + phase * 5);
  const fx = 1 + 0.05 * Math.sin(t * 5.3 + phase * 3);
  return (
    <g transform={`translate(${x} ${y}) scale(${s * fx} ${s * fy})`}>
      <path d="M0 0 C-38 -6 -44 -60 -8 -120 C-4 -86 18 -78 14 -112 C44 -70 40 -8 0 0Z" fill={C.fire} />
      <path d="M0 0 C-20 -4 -22 -36 0 -66 C20 -36 20 -4 0 0Z" fill={C.flame} />
    </g>
  );
};

/** Rising smoke column from (x, y) between a and b. */
const Smoke: React.FC<{x: number; y: number; a: number; b: number; t: number; n?: number; rise?: number}> = ({x, y, a, b, t, n = 6, rise = 520}) => {
  const o = life(t, a, b, 0.6, 0.8);
  if (o <= 0) return null;
  return (
    <g opacity={o}>
      {Array.from({length: n}, (_, i) => {
        const age = ((t - a) * 0.28 + i / n) % 1;
        return <circle key={i} cx={x + Math.sin(age * 5 + i) * 30 + age * 40} cy={y - age * rise} r={24 + age * 60} fill={C.smoke} opacity={0.55 * (1 - age)} />;
      })}
    </g>
  );
};

const DROP = 'M0 -30 C14 -12 20 0 20 9 A20 20 0 0 1 -20 9 C-20 0 -14 -12 0 -30Z';
const Drop: React.FC<{x: number; y: number; s?: number; color?: string}> = ({x, y, s = 1, color = C.water}) => <path d={DROP} transform={`translate(${x} ${y}) scale(${s})`} fill={color} />;

/** Line icons, centered on (x, y), about 100 px. */
const icon = {fill: 'none', strokeWidth: SW, strokeLinecap: 'round', strokeLinejoin: 'round'} as const;
const FuelCan: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-38 -30 L22 -30 L40 -12 L40 46 L-38 46 Z" fill={C.palm} />
    <path d="M-26 -30 L-26 -46 L4 -46 L4 -30" {...icon} stroke={C.soilDark} />
    <path d="M-20 0 L22 30 M22 0 L-20 30" {...icon} stroke={C.paper} />
  </g>
);
const House: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-50 0 L0 -44 L50 0 L50 50 L-50 50 Z" fill={C.soil} />
    <path d="M-62 4 L0 -52 L62 4" {...icon} stroke={C.soilDark} strokeWidth={10} />
    <rect x={-14} y={14} width={28} height={36} rx={4} fill={C.flame} />
  </g>
);
const Coin: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle r={42} fill={C.flame} />
    <circle r={30} {...icon} stroke={C.palm} />
  </g>
);
const CloudIcon: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="#8FB7D6">
    <ellipse cx={0} cy={10} rx={50} ry={22} />
    <circle cx={-16} cy={-6} r={24} />
    <circle cx={16} cy={-12} r={28} />
  </g>
);
const SoilIcon: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-52 24 Q 0 -40 52 24 Z" fill={C.soil} />
    <path d="M0 -6 L0 -36 M0 -26 Q 16 -40 24 -30 M0 -20 Q -14 -34 -22 -24" {...icon} stroke={C.leaf} strokeWidth={5} />
  </g>
);
const ApeHead: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle r={40} fill={C.ape} />
    <ellipse cy={8} rx={27} ry={22} fill={C.apeFace} />
    <circle cx={-10} cy={0} r={4} fill={C.ink} />
    <circle cx={10} cy={0} r={4} fill={C.ink} />
  </g>
);

/* ---------- scenes ---------- */

const FOREST = [
  {x: 150, s: 0.78, kind: 1},
  {x: 330, s: 0.86, kind: 2},
  {x: 520, s: 0.8, kind: 0},
  {x: 700, s: 0.9, kind: 1},
  {x: 880, s: 0.76, kind: 2},
  {x: 240, s: 1.05, kind: 0},
  {x: 600, s: 1.1, kind: 2},
  {x: 900, s: 1.0, kind: 0},
];

/** 1. Forest; each tree morphs into a palm on "diganti". */
const STanya: React.FC = () => {
  const t = useT();
  return (
    <Layer id="tanya" exit="zoom">
      <Svg>
        {FOREST.map((f, i) => {
          const s = CUES.DIGANTI + 0.1 + i * 0.1;
          const y = groundAt(f.x) + (i < 5 ? 6 : 40);
          return (
            <g key={i}>
              <Grow x={f.x} y={y} s={k(t, s, s + 0.25, 1, 0, EASE.in)}>
                <Tree x={f.x} y={y} s={f.s} kind={f.kind} t={t} phase={i * 0.3} />
              </Grow>
              <Grow x={f.x} y={y} s={pop(t, s + 0.2)}>
                <Palm x={f.x} y={y} s={f.s * 0.85} t={t} phase={i * 0.3} />
              </Grow>
            </g>
          );
        })}
      </Svg>
      <T a={0.3} b={6.9} top={300} lines={[{text: 'Kalau seluruh hutan', size: 64, color: C.dim}, {text: 'diganti sawit', size: 104, color: C.palmText, delay: 1.85}]} />
      <Chip a={CUES.KAYA - 0.1} b={6.9} x={CX} y={640} text="Makin kaya…" color={C.forest} />
      <Chip a={CUES.RUGI - 0.15} b={6.9} x={CX} y={770} text="atau rugi besar?" color={C.fireText} />
    </Layer>
  );
};

/** 2. Zoom to one palm; its products pop out. */
const PRODUCTS = [
  {a: CUES.MINYAK - 0.1, text: 'Minyak', y: 640},
  {a: CUES.BAHAN_BAKAR - 0.1, text: 'Bahan bakar', y: 790},
  {a: CUES.PENGHIDUPAN - 0.1, text: 'Penghidupan', y: 940},
];
const SHasil: React.FC = () => {
  const t = useT();
  return (
    <Layer id="hasil" enter="zoom" exit="push">
      <Svg>
        <Palm x={760} y={GROUND_Y + 20} s={1.5} t={t} />
        {PRODUCTS.map((p, i) => {
          const s = pop(t, p.a) * k(t, 11.75, 12.1, 1, 0, EASE.in);
          const y = p.y + float(t, 5, 4, i * 0.3);
          return (
            <Grow key={p.text} x={200} y={y} s={s}>
              {i === 0 ? <Drop x={200} y={y + 8} s={2.2} color={C.palm} /> : i === 1 ? <FuelCan x={200} y={y} /> : <House x={200} y={y - 6} />}
            </Grow>
          );
        })}
      </Svg>
      <T a={CUES.SAWIT} b={12.1} top={300} lines={[{text: 'Sawit menghasilkan', size: 84, color: C.palmText}]} />
      {PRODUCTS.map((p) => (
        <Chip key={p.text} a={p.a + 0.08} b={12.1} x={p.text === 'Minyak' ? 420 : 470} y={p.y} text={p.text} color={C.ink} />
      ))}
    </Layer>
  );
};

/** 3. Diverse forest vs one crop: a row of identical palms slides in on "satu jenis". */
const SFungsi: React.FC = () => {
  const t = useT();
  const row = k(t, CUES.SATU_JENIS - 0.35, CUES.SATU_JENIS + 0.25, 0, 1);
  const dimForest = 1 - 0.55 * row;
  return (
    <Layer id="fungsi" enter="push" exit="cut">
      <Svg>
        <g opacity={dimForest}>
          {FOREST.map((f, i) => (
            <Tree key={i} x={f.x} y={groundAt(f.x) + (i < 5 ? 6 : 40)} s={f.s} kind={(f.kind + i) % 3} t={t} phase={i * 0.3} />
          ))}
        </g>
        <g transform={`translate(${lerp(700, 0, row)} 0)`} opacity={row}>
          {[300, 500, 700].map((x, i) => (
            <Palm key={x} x={x} y={GROUND_Y + 60} s={0.95} t={t} phase={i * 0.1} />
          ))}
        </g>
      </Svg>
      <T a={CUES.FUNGSI - 0.3} b={17.3} top={300} lines={[{text: 'Fungsi hutan', size: 104, color: C.forest}, {text: 'nggak bisa digantikan', size: 60, color: C.dim, delay: 1.3}]} />
      <Chip a={CUES.SATU_JENIS - 0.1} b={17.3} x={CX} y={700} text="satu jenis tanaman" color={C.palmText} />
    </Layer>
  );
};

/** Soil cross-section used by the water and carbon scenes; top edge at y. */
const SoilBlock: React.FC<{y: number}> = ({y}) => (
  <>
    <rect x={0} y={y} width={1080} height={1920 - y} fill={C.soil} />
    <rect x={0} y={y + 180} width={1080} height={1920 - y} fill={C.soilDark} opacity={0.55} />
    <rect x={0} y={y - 14} width={1080} height={28} rx={14} fill={C.moss} />
  </>
);

const ROOTS = [
  'M500 1100 C 500 1200 440 1260 360 1330 S 260 1420 220 1480',
  'M500 1100 C 505 1220 520 1330 500 1460',
  'M500 1100 C 520 1190 600 1250 680 1320 S 790 1400 830 1470',
  'M480 1180 C 430 1210 380 1220 320 1210',
  'M520 1200 C 580 1230 640 1230 700 1215',
];
const RAIN = Array.from({length: 14}, (_, i) => ({x: 140 + ((i * 263) % 780), d: (i * 0.137) % 0.9}));
const LEAVES = [380, 470, 560, 640];

/** 4. Cut below ground: roots draw, leaves fall, rain soaks into the soil. */
const SAir: React.FC = () => {
  const t = useT();
  return (
    <Layer id="air" enter="cut" exit="push">
      <Svg>
        <SoilBlock y={1100} />
        {ROOTS.map((d, i) => {
          const ev = evolvePath(k(t, CUES.AKAR + i * 0.12, CUES.AKAR + 1.1 + i * 0.12, 0, 1), d);
          return <path key={i} d={d} fill="none" stroke={C.trunk} strokeWidth={i < 3 ? 14 : 9} strokeLinecap="round" strokeDasharray={ev.strokeDasharray} strokeDashoffset={ev.strokeDashoffset} />;
        })}
        <Tree x={CX} y={1100} s={1.1} kind={0} t={t} />
        {LEAVES.map((x, i) => {
          const u = k(t, 18.9 + i * 0.18, 20.2 + i * 0.18, 0, 1, EASE.inOut);
          if (u <= 0) return null;
          return <ellipse key={x} cx={x + Math.sin(u * 9 + i) * 34} cy={lerp(830, 1096, u)} rx={16} ry={8} fill={i % 2 ? C.moss : C.palm} transform={`rotate(${u * 220 + i * 40} ${x} ${lerp(830, 1096, u)})`} />;
        })}
        {RAIN.map((r, i) => {
          const u = k(t, CUES.AIR_HUJAN - 0.3 + r.d * 0.6, CUES.AIR_HUJAN + 0.6 + r.d * 0.6, 0, 1, lin);
          const soak = k(t, CUES.MERESAP - 0.1 + r.d * 0.4, CUES.MERESAP + 0.8 + r.d * 0.4, 0, 1);
          if (u <= 0) return null;
          const y = u < 1 ? lerp(560, 1090, u) : lerp(1090, 1260 + (i % 4) * 50, soak);
          return <Drop key={i} x={r.x} y={y} s={0.6} color={C.water} />;
        })}
      </Svg>
      <T a={CUES.AKAR} b={21.6} top={300} lines={[{text: 'Akar & dedaunan', size: 64, color: C.dim}, {text: 'Air meresap', size: 104, color: C.waterText, delay: CUES.MERESAP - CUES.AKAR - 0.1}]} />
    </Layer>
  );
};

/** 5. Vegetated slope: runoff crawls down slowly, soil stays. */
const SLOPE = 'M100 900 L980 1450';
const SErosi: React.FC = () => {
  const t = useT();
  const flow = k(t, 22.2, 26.6, 0, 1, lin);
  return (
    <Layer id="erosi" enter="push" exit="zoom">
      <Svg>
        <path d="M0 860 L100 900 L980 1450 L1080 1480 L1080 1920 L0 1920 Z" fill={C.soil} />
        <path d="M0 846 L100 886 L980 1436 L1080 1466" fill="none" stroke={C.leaf} strokeWidth={28} strokeLinecap="round" />
        {[180, 330, 480, 630, 780, 930].map((x, i) => {
          const y = 900 + ((x - 100) / 880) * 550;
          return <Tree key={x} x={x} y={y + 6} s={0.5 + (i % 2) * 0.12} kind={i % 3} t={t} phase={i * 0.4} />;
        })}
        {[0, 1, 2].map((i) => {
          const off = 30 + i * 22;
          const dash = 1040 * flow;
          return (
            <path
              key={i}
              d={SLOPE}
              transform={`translate(${-off * 0.5} ${off})`}
              fill="none"
              stroke={C.water}
              strokeWidth={8}
              strokeLinecap="round"
              strokeDasharray="38 46"
              strokeDashoffset={-dash * (0.5 + i * 0.12)}
              opacity={k(t, 22.0 + i * 0.15, 22.5 + i * 0.15, 0, 0.8)}
            />
          );
        })}
      </Svg>
      <T a={CUES.TUTUPAN - 0.1} b={26.6} top={300} lines={[{text: 'Tutupan vegetasi', size: 96, color: C.forest}]} />
      <Chip a={CUES.EROSI - 0.2} b={26.6} x={640} y={560} text="Menahan erosi" color={C.soilDark} />
      <Chip a={CUES.ALIRAN - 0.2} b={26.6} x={600} y={680} text="Aliran melambat" color={C.waterText} />
    </Layer>
  );
};

const DOTS = Array.from({length: 16}, (_, i) => ({
  x: CX + (((i * 97) % 300) - 150),
  y: i < 10 ? GROUND_Y - 330 + ((i * 53) % 150) : GROUND_Y + 40 + ((i * 41) % 70),
}));

/** 6. Carbon dots stored in tree and soil; tree opens and burns, dots rise into a CO₂ cloud. */
const SKarbon: React.FC = () => {
  const t = useT();
  const fall = k(t, CUES.DIBUKA, CUES.DIBUKA + 0.9, 0, -14, EASE.inOut);
  const burn = k(t, CUES.TERBAKAR, CUES.TERBAKAR + 1.2, 0, 1);
  const cloud = pop(t, CUES.ATMOSFER - 0.3);
  const thermo = k(t, CUES.PEMANASAN - 0.2, CUES.PEMANASAN + 0.9, 0, 1);
  return (
    <Layer id="karbon" enter="zoom" exit="cut">
      <Svg>
        <rect x={0} y={GROUND_Y} width={1080} height={440} fill={C.soil} opacity={0.75} />
        <g transform={`rotate(${fall} ${CX + 20} ${GROUND_Y})`}>
          <Tree x={CX} y={GROUND_Y} s={1.4} kind={0} t={t} burn={burn} />
        </g>
        {[-120, -20, 90].map((dx, i) => (
          <Flame key={dx} x={CX + dx} y={GROUND_Y + 4} s={pop(t, CUES.TERBAKAR + i * 0.15) * 0.9} t={t} phase={i} />
        ))}
        <Smoke x={CX} y={GROUND_Y - 120} a={CUES.TERBAKAR + 0.2} b={35.9} t={t} />
        {DOTS.map((d, i) => {
          const show = pop(t, CUES.KARBON - 0.3 + i * 0.04);
          const u = k(t, CUES.LEPAS - 0.2 + i * 0.07, CUES.LEPAS + 1.1 + i * 0.07, 0, 1, EASE.inOut);
          const x = lerp(d.x, CX + ((i % 5) - 2) * 40, u);
          const y = lerp(d.y, 760 + (i % 3) * 20, u) + float(t, 4, 3, i * 0.17);
          return <circle key={i} cx={x} cy={y} r={13 * show * (1 - 0.6 * k(t, CUES.ATMOSFER + 0.6, CUES.ATMOSFER + 1.2, 0, 1))} fill={C.carbon} />;
        })}
        <Grow x={CX} y={760} s={cloud}>
          <g transform={`translate(${CX} 760)`} fill={C.smoke}>
            <ellipse cx={0} cy={10} rx={190} ry={62} />
            <circle cx={-70} cy={-20} r={70} />
            <circle cx={60} cy={-36} r={84} />
          </g>
        </Grow>
        <g transform={`translate(880 ${1000 + float(t, 4)})`} opacity={k(t, CUES.PEMANASAN - 0.3, CUES.PEMANASAN, 0, 1)}>
          <rect x={-22} y={-150} width={44} height={170} rx={22} fill={C.paper} stroke={C.ink} strokeWidth={SW} />
          <circle cx={0} cy={40} r={36} fill={C.fire} stroke={C.ink} strokeWidth={SW} />
          <rect x={-10} y={lerp(10, -130, thermo)} width={20} height={lerp(20, 160, thermo)} rx={10} fill={C.fire} />
        </g>
      </Svg>
      <T a={CUES.POHON} b={31.5} top={300} lines={[{text: 'Pohon & tanah', size: 64, color: C.dim}, {text: 'menyimpan karbon', size: 92, color: C.carbon, delay: CUES.KARBON - CUES.POHON - 0.3}]} />
      <T a={31.7} b={35.9} top={300} lines={[{text: 'Karbon lepas', size: 96, color: C.carbon}, {text: 'ke atmosfer', size: 64, color: C.dim, delay: CUES.ATMOSFER - 31.8}]} />
      <div
        style={{position: 'absolute', left: CX, top: 770, translate: '-50% -50%', fontFamily: FONT, fontWeight: 700, fontSize: 64, color: C.paper, opacity: k(t, CUES.ATMOSFER + 0.2, CUES.ATMOSFER + 0.5, 0, 1)}}
      >
        CO₂
      </div>
      <Chip a={CUES.PEMANASAN - 0.1} b={35.9} x={460} y={1010} text="Pemanasan global" color={C.fireText} />
    </Layer>
  );
};

const FRUIT = [
  {x: 300, y: 820},
  {x: 380, y: 760},
  {x: 720, y: 800},
];

/** 7. Orangutan swings from the canopy; three needs pop as chips. */
const SHabitat: React.FC = () => {
  const t = useT();
  // Branch M120 700 Q540 760 1100 680, bobbing as one piece; the orangutan swings in from the right along it.
  const bob = float(t, 4, 5);
  const u = k(t, CUES.ORANGUTAN - 0.5, CUES.ORANGUTAN + 0.5, 1.15, 0.4846, EASE.out);
  const gx = 120 + 840 * u + 140 * u * u;
  const gy = 700 + 120 * u - 140 * u * u + bob;
  return (
    <Layer id="habitat" enter="cut" exit="push">
      <Svg>
        <Tree x={170} y={GROUND_Y} s={1.5} kind={1} t={t} />
        <Tree x={900} y={GROUND_Y} s={1.6} kind={0} t={t} phase={0.5} />
        <path d={`M120 ${700 + bob} Q 540 ${760 + bob} 1100 ${680 + bob}`} fill="none" stroke={C.trunk} strokeWidth={22} strokeLinecap="round" />
        {FRUIT.map((f, i) => (
          <circle key={i} cx={f.x} cy={f.y + float(t, 4, 3, i * 0.3)} r={20 * pop(t, CUES.MAKAN - 0.2 + i * 0.1)} fill={C.palm} />
        ))}
        <Orangutan x={gx} y={gy + 4} s={1.25} t={t} />
      </Svg>
      <T a={CUES.HABITAT - 0.3} b={44.4} top={300} lines={[{text: 'Hutan = habitat', size: 100, color: C.forest}, {text: 'orangutan & satwa lain', size: 60, color: C.dim, delay: CUES.ORANGUTAN - CUES.HABITAT + 0.3}]} />
      <Chip a={CUES.MAKAN - 0.2} b={44.4} x={300} y={1300} text="Makan" color={C.palmText} />
      <Chip a={CUES.BERLINDUNG - 0.05} b={44.4} x={680} y={1300} text="Berlindung" color={C.forest} />
      <Chip a={CUES.BERTAHAN - 0.2} b={44.4} x={CX} y={1420} text="Bertahan hidup" color={C.ink} />
    </Layer>
  );
};

const FIRE_TREES = [
  {x: 150, s: 0.9, kind: 1},
  {x: 360, s: 1.0, kind: 0},
  {x: 600, s: 0.95, kind: 2},
  {x: 840, s: 1.05, kind: 1},
];

/** 8. Karhutla: canopy chars, flames spread left to right, smoke rises; warga + satwa icons. */
const SKarhutla: React.FC = () => {
  const t = useT();
  return (
    <Layer id="karhutla" enter="push" exit="cut">
      <Svg>
        {FIRE_TREES.map((f, i) => {
          const s = CUES.KARHUTLA + i * 0.35;
          return (
            <g key={i}>
              <Tree x={f.x} y={GROUND_Y} s={f.s} kind={f.kind} t={t} burn={k(t, s, s + 1.6, 0, 1)} phase={i * 0.3} />
              <Flame x={f.x - 30} y={GROUND_Y + 4} s={pop(t, s) * 1.1} t={t} phase={i} />
              <Flame x={f.x + 40} y={GROUND_Y + 4} s={pop(t, s + 0.2) * 0.8} t={t} phase={i + 0.5} />
              <Smoke x={f.x} y={GROUND_Y - 260} a={s + 0.4} b={51.9} t={t} n={5} />
            </g>
          );
        })}
        <Grow x={330} y={1200} s={pop(t, CUES.WARGA - 0.25)}>
          <House x={330} y={1200 + float(t, 4)} s={1.3} />
        </Grow>
        <Grow x={680} y={1210} s={pop(t, CUES.SATWA - 0.25)}>
          <ApeHead x={680} y={1210 + float(t, 4, 4, 0.3)} s={1.3} />
        </Grow>
      </Svg>
      <T a={CUES.KARHUTLA - 0.2} b={51.7} top={300} lines={[{text: 'Karhutla', size: 116, color: C.fireText}, {text: 'Kalimantan, tahun ini', size: 60, color: C.ink, delay: CUES.KALIMANTAN - CUES.KARHUTLA + 0.1}]} />
      <Chip a={CUES.WARGA - 0.1} b={51.7} x={330} y={1400} text="Warga" color={C.ink} />
      <Chip a={CUES.SATWA - 0.1} b={51.7} x={680} y={1400} text="Satwa" color={C.ape} />
    </Layer>
  );
};

const STUMPS = [170, 360, 600, 840];
const NEEDS = [
  {a: CUES.TANAH, text: 'Tanah', x: 240},
  {a: CUES.AIR, text: 'Air', x: CX},
  {a: CUES.KEHIDUPAN, text: 'Kehidupan', x: 760},
];

/** 9. Fire out: charred stumps, last smoke wisps; questions about soil, water, life. */
const SPadam: React.FC = () => {
  const t = useT();
  return (
    <Layer id="padam" enter="cut" exit="push">
      <Svg>
        {STUMPS.map((x, i) => (
          <g key={x}>
            <path d={`M${x - 20} ${GROUND_Y + 6} L${x - 14} ${GROUND_Y - 120 - (i % 2) * 40} L${x + 2} ${GROUND_Y - 100 - (i % 2) * 40} L${x + 14} ${GROUND_Y - 140} L${x + 20} ${GROUND_Y + 6} Z`} fill="#3B2A22" />
            <Smoke x={x} y={GROUND_Y - 120} a={51.7} b={56.5} t={t} n={3} rise={360} />
          </g>
        ))}
        {NEEDS.map((n, i) => (
          <Grow key={n.text} x={n.x} y={1060} s={pop(t, n.a - 0.25)}>
            {i === 0 ? <SoilIcon x={n.x} y={1060 + float(t, 4, 4, i * 0.3)} s={1.3} /> : i === 1 ? <Drop x={n.x} y={1070 + float(t, 4, 4, i * 0.3)} s={2.2} /> : <ApeHead x={n.x} y={1060 + float(t, 4, 4, i * 0.3)} s={1.2} />}
          </Grow>
        ))}
      </Svg>
      <T a={CUES.PADAM - 0.4} b={55.0} top={300} lines={[{text: 'Api padam,', size: 64, color: C.dim}, {text: 'belum selesai', size: 100, color: C.ink, delay: CUES.BELUM_SELESAI - CUES.PADAM + 0.3}]} />
      <T a={55.1} b={60.3} top={300} lines={[{text: 'Masih bisa', size: 64, color: C.dim}, {text: 'dipulihkan?', size: 104, color: C.forest, delay: CUES.DIPULIHKAN - 55.4}]} />
      {NEEDS.map((n) => (
        <Chip key={n.text} a={n.a - 0.05} b={60.3} x={n.x} y={1200} text={n.text} color={C.ink} />
      ))}
    </Layer>
  );
};

/** 10. Paper card: "sudah rusak" stamp lands, then "Pulihkan hutan" gets struck through. */
const SRusak: React.FC = () => {
  const t = useT();
  const card = pop(t, 60.4);
  const stamp = k(t, CUES.SUDAH_RUSAK - 0.1, CUES.SUDAH_RUSAK + 0.25, 1.4, 1, EASE.out);
  const strike = k(t, CUES.DICORET - 0.35, CUES.DICORET + 0.15, 0, 1, lin);
  const tilt = -3 + float(t, 0.6, 5);
  return (
    <Layer id="rusak" enter="push" exit="zoom">
      <div style={{position: 'absolute', left: 150, top: 760, width: 700, height: 520, background: C.paper, borderRadius: 28, boxShadow: '0 18px 40px rgba(30,43,36,0.18)', rotate: `${tilt}deg`, scale: `${0.85 + 0.15 * card}`, opacity: Math.min(1, card * 1.5)}}>
        {[90, 150].map((y, i) => (
          <div key={y} style={{position: 'absolute', left: 60, top: y, width: i ? 380 : 520, height: 14, borderRadius: 7, background: C.bg2}} />
        ))}
        <div style={{position: 'absolute', left: 60, top: 270, fontFamily: FONT, fontWeight: 700, fontSize: 64, color: C.forest}}>Pulihkan hutan</div>
        <div style={{position: 'absolute', left: 50, top: 312, width: 520 * strike, height: 12, borderRadius: 6, background: C.fireText}} />
        <div
          style={{position: 'absolute', right: 40, top: 380, fontFamily: FONT, fontWeight: 900, fontSize: 56, color: C.fireText, padding: '2px 22px', border: `6px solid ${C.fireText}`, borderRadius: 14, rotate: '-8deg', scale: `${stamp}`, opacity: k(t, CUES.SUDAH_RUSAK - 0.1, CUES.SUDAH_RUSAK + 0.05, 0, 0.9)}}
        >
          “sudah rusak”
        </div>
      </div>
      <T a={CUES.MEMULIHKAN - 0.2} b={65.95} top={300} lines={[{text: 'Jangan langsung', size: 64, color: C.dim}, {text: 'dicoret', size: 112, color: C.fireText, delay: CUES.DICORET - CUES.MEMULIHKAN - 0.2}]} />
    </Layer>
  );
};

const ROWS = [
  {dy: 6, xs: [220, 420, 620, 820], s: 0.62},
  {dy: 60, xs: [120, 320, 520, 720, 920], s: 0.8},
];
const LIFE = ['ape', 'bird', 'leaf', 'fish'] as const;

/** 11. Same plot becomes a plantation: rows grow, a coin pops, then the life meter drains. */
const SKebun: React.FC = () => {
  const t = useT();
  const meter = k(t, CUES.KERAGAMAN, CUES.BERKURANG + 0.4, 1, 0.25, EASE.inOut);
  return (
    <Layer id="kebun" enter="zoom" exit="cut">
      <Svg>
        {ROWS.map((r, ri) =>
          r.xs.map((x, i) => (
            <Grow key={`${ri}-${x}`} x={x} y={groundAt(x) + r.dy} s={pop(t, CUES.KEBUN - 0.3 + ri * 0.25 + i * 0.1)}>
              <Palm x={x} y={groundAt(x) + r.dy} s={r.s} t={t} phase={i * 0.2} />
            </Grow>
          )),
        )}
        <Grow x={800} y={760} s={pop(t, CUES.UANG - 0.3) * k(t, 71.1, 71.5, 1, 0, EASE.in)}>
          <Coin x={800} y={760 + float(t, 5)} s={1.5} />
        </Grow>
        <g opacity={k(t, CUES.KERAGAMAN - 0.4, CUES.KERAGAMAN, 0, 1)}>
          <rect x={200} y={1000} width={600} height={30} rx={15} fill={C.paper} />
          <rect x={200} y={1000} width={600 * meter} height={30} rx={15} fill={C.forest} />
          {LIFE.map((l, i) => {
            const x = 260 + i * 160;
            // Only the leaf stays bright: the plot is green again while the other life fades.
            const o = 0.25 + 0.75 * k(t, CUES.BERKURANG - 1.2 + i * 0.3, CUES.BERKURANG - 0.6 + i * 0.3, 1, l === 'leaf' ? 1 : 0.15);
            const y = 920 + float(t, 4, 4, i * 0.25);
            return (
              <g key={l} opacity={o}>
                {l === 'ape' ? (
                  <ApeHead x={x} y={y} s={0.9} />
                ) : l === 'bird' ? (
                  <path d={`M${x - 40} ${y} Q ${x - 20} ${y - 30} ${x} ${y} Q ${x + 20} ${y - 30} ${x + 40} ${y}`} {...icon} stroke={C.ink} />
                ) : l === 'leaf' ? (
                  <path d={`M${x} ${y + 30} Q ${x - 40} ${y} ${x} ${y - 34} Q ${x + 40} ${y} ${x} ${y + 30}Z`} fill={C.leaf} />
                ) : (
                  <path d={`M${x - 34} ${y} Q ${x} ${y - 28} ${x + 22} ${y} Q ${x} ${y + 28} ${x - 34} ${y} M${x + 22} ${y} L${x + 40} ${y - 16} L${x + 40} ${y + 16} Z`} fill={C.water} />
                )}
              </g>
            );
          })}
        </g>
      </Svg>
      <T
        a={66.2}
        b={71.3}
        top={300}
        lines={[
          {text: 'Bekas habitat', size: 64, color: C.dim},
          {text: 'jadi kebun sawit', size: 92, color: C.palmText, delay: CUES.KEBUN - 66.4},
          {text: 'menghasilkan uang', size: 60, color: C.dim, delay: CUES.UANG - 66.5},
        ]}
      />
      <T a={71.4} b={74.0} top={300} lines={[{text: 'Fungsi hutan', size: 64, color: C.dim}, {text: 'nggak otomatis kembali', size: 76, color: C.forest, delay: CUES.OTOMATIS - 71.6}]} />
      <T a={CUES.HAMPARAN - 0.1} b={78.8} top={300} lines={[{text: 'Hijau lagi,', size: 96, color: C.leaf}, {text: 'keragaman berkurang', size: 64, color: C.ink, delay: CUES.KERAGAMAN - CUES.HAMPARAN}]} />
    </Layer>
  );
};

/** 12. Balance: harvest on the left, forest functions pile on the right and tip it. Closing hold. */
const GOODS = [
  {a: CUES.AIR2, text: 'Air'},
  {a: CUES.TANAH2, text: 'Tanah'},
  {a: CUES.IKLIM, text: 'Iklim'},
  {a: CUES.SATWA2, text: 'Satwa'},
];
const STimbang: React.FC = () => {
  const t = useT();
  const n = GOODS.filter((g) => t >= g.a).length;
  const tipTarget = -2 + n * 3.2;
  const tip = k(t, CUES.MENJAGA, CUES.SATWA2 + 0.8, -2, tipTarget, EASE.inOut) * (t < CUES.MENJAGA ? 0 : 1) + float(t, 0.6, 3);
  const r = (tip * Math.PI) / 180;
  const L = 300;
  const lx = CX - Math.cos(r) * L;
  const ly = 900 - Math.sin(r) * L;
  const rx = CX + Math.cos(r) * L;
  const ry = 900 + Math.sin(r) * L;
  const zoom = 1 + 0.04 * k(t, CUES.BELUM_TENTU - 0.3, CUES.BELUM_TENTU + 1.5, 0, 1);
  return (
    <Layer id="timbang" enter="push">
      <Svg>
        <g transform={`translate(${CX} 1000) scale(${zoom}) translate(${-CX} -1000)`}>
          <path d={`M${CX} 900 L${CX - 90} 1360 L${CX + 90} 1360 Z`} fill={C.ink} opacity={0.85} />
          <line x1={lx} y1={ly} x2={rx} y2={ry} stroke={C.ink} strokeWidth={14} strokeLinecap="round" />
          <circle cx={CX} cy={900} r={18} fill={C.ink} />
          {[
            [lx, ly],
            [rx, ry],
          ].map(([x, y], i) => (
            <g key={i}>
              <path d={`M${x} ${y} L${x - 110} ${y + 170} M${x} ${y} L${x + 110} ${y + 170}`} stroke={C.ink} strokeWidth={4} />
              <path d={`M${x - 140} ${y + 170} L${x + 140} ${y + 170} Q ${x} ${y + 240} ${x - 140} ${y + 170}Z`} fill={C.paper} stroke={C.ink} strokeWidth={SW} />
            </g>
          ))}
          <Grow x={lx} y={ly + 168} s={pop(t, 79.0)}>
            <Palm x={lx - 30} y={ly + 168} s={0.42} t={t} />
            <Coin x={lx + 70} y={ly + 140} s={0.7} />
          </Grow>
          {GOODS.map((g, i) => {
            const x = rx - 90 + i * 60;
            const y = ry + 140 - (i % 2) * 30;
            return (
              <Grow key={g.text} x={x} y={y} s={pop(t, g.a - 0.2)}>
                {i === 0 ? <Drop x={x} y={y + 6} s={1.2} /> : i === 1 ? <SoilIcon x={x} y={y} s={0.75} /> : i === 2 ? <CloudIcon x={x} y={y} s={0.7} /> : <ApeHead x={x} y={y} s={0.7} />}
              </Grow>
            );
          })}
        </g>
      </Svg>
      <Chip a={79.3} b={85.6} x={lx} y={ly + 330} text="Hasil panen" color={C.palmText} />
      <Chip a={CUES.MENJAGA} b={85.6} x={rx} y={ry + 330} text="Fungsi hutan" color={C.forest} />
      <T a={CUES.PANEN - 0.6} b={86.6} top={300} lines={[{text: 'Sawit: hasil panen', size: 72, color: C.palmText}, {text: 'Hutan: air, tanah, iklim, satwa', size: 56, color: C.forest, delay: CUES.MENJAGA - CUES.PANEN + 0.6}]} />
      <T a={CUES.SEMUANYA - 0.2} b={AUDIO_SECONDS + 1} top={300} lines={[{text: 'Semuanya diganti sawit?', size: 64, color: C.dim}, {text: 'Belum tentu sebanding', size: 92, color: C.ink, delay: CUES.BELUM_TENTU - CUES.SEMUANYA}]} />
    </Layer>
  );
};

export const Video: React.FC<z.infer<typeof kitSchema>> = ({watermark, sfxVolume, showReview}) => (
  <AbsoluteFill style={{background: C.bg, overflow: 'hidden'}}>
    <Backdrop />
    <STanya />
    <SHasil />
    <SFungsi />
    <SAir />
    <SErosi />
    <SKarbon />
    <SHabitat />
    <SKarhutla />
    <SPadam />
    <SRusak />
    <SKebun />
    <STimbang />
    <Watermark text={watermark} color={C.ink} />
    <Audio src={staticFile('videos/sawit/narration.wav')} />
    {/* music.wav fades itself in over 2.5 s; this ramp finishes the fade-out at the last frame. */}
    <Audio src={staticFile('videos/sawit/music.wav')} volume={(f) => MUSIC_VOLUME * k(f / FPS, AUDIO_SECONDS - 3, AUDIO_SECONDS, 1, 0, lin)} />
    <Sfx cues={SFX} volume={sfxVolume} />
    {showReview ? <ReviewOverlay /> : null}
  </AbsoluteFill>
);
