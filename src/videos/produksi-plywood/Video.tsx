import {AbsoluteFill, Easing, interpolateColors, spring, staticFile} from 'remotion';
import {evolvePath} from '@remotion/paths';
import {Audio} from '@remotion/media';
import {z} from 'zod';
import {FONT, INK, kitSchema} from '../../kit/brand';
import {Pill, ReviewOverlay, Sfx, Title, Watermark, type TitleLine} from '../../kit/components';
import {EASE, k, lerp, life, useT} from '../../kit/motion';
import {AUDIO_SECONDS, CUES, FPS, SFX, scene, type SceneId} from './timeline';

/** Editorial flat: warm paper, veneer woods, teal = inspection, green/amber/red = grade. */
const C = {
  ...INK,
  bg: '#F2ECE0',
  bg2: '#E4D8C4',
  ink: '#25211C',
  dim: 'rgba(37,33,28,0.62)',
  face: '#E2B77E',
  faceDark: '#C9955A',
  core: '#B98149',
  coreDark: '#8A5A30',
  glue: '#F6D36B',
  qc: '#1F6F78',
  pass: '#3E8E57',
  passText: '#2D7044',
  low: '#E09A2C',
  lowText: '#9A6008',
  bad: '#D2553A',
  badText: '#B23C22',
  paper: '#FFFCF6',
  skin: '#D9A27A',
  shirt: '#3D6FA8',
  helmet: '#F2C230',
  steel: '#7D8790',
};
const SW = 6; // one icon stroke weight for the whole video
const CX = 500; // center of the safe width (100..900)
// music.wav -17.6 LUFS vs narration -22.3 LUFS: -23.7 dB puts it 19 dB under the voice. The file fades itself in/out.
const MUSIC_VOLUME = 0.065;
const lin = Easing.linear;

type Move = 'fade' | 'zoom' | 'push' | 'up' | 'cut';

/** Slow sine float for living holds. */
const float = (t: number, amp = 6, period = 4, phase = 0) => Math.sin((t / period + phase) * Math.PI * 2) * amp;
/** Spring 0 → 1 from time a; damping 15 keeps overshoot near 5% (illustration limit 8%). */
const pop = (t: number, a: number) => (t < a ? 0 : spring({frame: (t - a) * FPS, fps: FPS, config: {damping: 15, stiffness: 120}}));
const blink = (t: number, phase = 0) => ((t + phase) % 3.7 < 0.12 ? 0.15 : 1);

/** Scene layer with a per-scene entrance and exit move (push and cut stay opaque). `to` stretches it to a later scene's end. */
const Layer: React.FC<{id: SceneId; to?: SceneId; enter?: Move; exit?: Move; children: React.ReactNode}> = ({id, to, enter = 'fade', exit = 'fade', children}) => {
  const t = useT();
  const a = scene(id).a;
  const b = scene(to ?? id).b;
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

const Svg: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
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
const Chip: React.FC<{a: number; b: number; x: number; y: number; text: string; color: string; size?: number}> = ({a, b, x, y, text, color, size = 56}) => {
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
        fontSize: size,
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

/** Speech/thought bubble with short text; tail dots run toward (tx, ty). */
const Bubble: React.FC<{a: number; b: number; x: number; y: number; tx: number; ty: number; text: string; color?: string}> = ({a, b, x, y, tx, ty, text, color = C.ink}) => {
  const t = useT();
  const o = life(t, a, b, 0.3, 0.25);
  if (o <= 0) return null;
  const p = pop(t, a);
  return (
    <>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: o}}>
        {[0.35, 0.6, 0.82].map((u, i) => (
          <circle key={u} cx={lerp(x, tx, u)} cy={lerp(y + 60, ty, u)} r={(16 - i * 4) * p} fill={C.paper} stroke={C.ink} strokeWidth={4} />
        ))}
      </svg>
      <div
        style={{
          position: 'absolute',
          left: x,
          top: y + float(t, 4, 3.6),
          translate: '-50% -50%',
          scale: `${0.9 + 0.1 * p}`,
          opacity: o,
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 58,
          color,
          padding: '18px 40px 22px',
          border: `5px solid ${C.ink}`,
          borderRadius: 60,
          background: C.paper,
          whiteSpace: 'nowrap',
        }}
      >
        {text}
      </div>
    </>
  );
};

/** Big live number (counting), centered in the safe width. */
const Counter: React.FC<{a: number; b: number; top: number; value: number; size: number; color: string; suffix?: string}> = ({a, b, top, value, size, color, suffix = ''}) => {
  const t = useT();
  const o = life(t, a, b, 0.3, 0.3);
  if (o <= 0) return null;
  return (
    <div style={{position: 'absolute', left: 100, width: 800, top, textAlign: 'center', opacity: o, fontFamily: FONT, fontWeight: 900, fontSize: size, color, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums'}}>
      {Math.round(value).toLocaleString('id-ID')}
      {suffix}
    </div>
  );
};

/* ---------- plywood ---------- */

/** One plywood sheet seen slightly from above: grained top face, front edge with 5 plies, right side. (x, y) = front-left-bottom center line. */
const Sheet: React.FC<{x: number; y: number; w: number; d?: number; e?: number; tint?: string}> = ({x, y, w, d = w * 0.22, e = Math.max(12, w * 0.05), tint = C.face}) => {
  const l = x - w / 2;
  const sx = d * 0.45; // depth skew
  return (
    <g>
      <path d={`M${l + sx} ${y - d} L${l + w + sx} ${y - d} L${l + w} ${y} L${l} ${y} Z`} fill={tint} />
      {[0.3, 0.55, 0.78].map((u) => (
        <path
          key={u}
          d={`M${l + sx * (1 - u) + w * 0.06} ${y - d * (1 - u)} q ${w * 0.25} ${-d * 0.08} ${w * 0.5} 0 t ${w * 0.38} 0`}
          stroke={C.faceDark}
          strokeWidth={3}
          fill="none"
          opacity={0.7}
        />
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={l} y={y + (i * e) / 5} width={w} height={e / 5 + 0.5} fill={i % 2 ? C.core : C.faceDark} />
      ))}
      <path d={`M${l + w} ${y} L${l + w + sx} ${y - d} L${l + w + sx} ${y - d + e} L${l + w} ${y + e} Z`} fill={C.coreDark} />
    </g>
  );
};

/** Stack of n sheets; sheet i drops in at times[i] (seconds) when given. Returns top y via the same formula callers can use. */
const Stack: React.FC<{x: number; y: number; w: number; n: number; e?: number; t: number; drop?: (i: number) => number}> = ({x, y, w, n, e = 24, t, drop}) => (
  <g>
    <ellipse cx={x + w * 0.05} cy={y + e + 10} rx={w * 0.62} ry={16} fill={C.ink} opacity={0.12} />
    {Array.from({length: n}, (_, i) => {
      const a = drop ? drop(i) : -1;
      if (drop && t < a) return null;
      const dy = drop ? lerp(-220, 0, k(t, a, a + 0.28, 0, 1, EASE.in)) : 0;
      const squash = drop ? 1 - 0.04 * Math.sin(Math.PI * k(t, a + 0.28, a + 0.45, 0, 1)) : 1;
      return (
        <g key={i} transform={`translate(0 ${dy}) translate(${x} ${y - i * e}) scale(1 ${squash}) translate(${-x} ${-(y - i * e)})`}>
          <Sheet x={x} y={y - i * e} w={w} e={e} />
        </g>
      );
    })}
  </g>
);

/* ---------- worker (original flat character) ---------- */

type Mood = 'neutral' | 'happy' | 'surprised';

/** Factory worker; (x, y) = feet. Breathes, blinks, and dips slightly before a mood change (`dip` 0..1). */
const Worker: React.FC<{x: number; y: number; s?: number; mood: Mood; t: number; dip?: number; arm?: number}> = ({x, y, s = 1, mood, t, dip = 0, arm = 0}) => {
  const breath = 1 + 0.012 * Math.sin(t * 2.4);
  const by = -dip * 12;
  const eye = blink(t, x / 300) * (mood === 'surprised' ? 1.35 : 1);
  const mouth =
    mood === 'happy' ? 'M-22 18 Q 0 38 22 18' : mood === 'surprised' ? 'M-9 22 a 9 11 0 1 0 18 0 a 9 11 0 1 0 -18 0' : 'M-18 24 L 18 24';
  const brow = mood === 'surprised' ? -10 : mood === 'happy' ? -4 : 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={6} rx={90} ry={14} fill={C.ink} opacity={0.14} />
      <rect x={-38} y={-150} width={30} height={152} rx={14} fill={C.ink} />
      <rect x={8} y={-150} width={30} height={152} rx={14} fill={C.ink} />
      <g transform={`translate(0 ${by}) scale(1 ${breath})`} style={{transformOrigin: '0px -150px'}}>
        <rect x={-62} y={-330} width={124} height={196} rx={40} fill={C.shirt} />
        <rect x={-62} y={-250} width={124} height={16} fill={C.helmet} opacity={0.9} />
        <path d="M-56 -300 Q -96 -230 -84 -170" stroke={C.shirt} strokeWidth={30} strokeLinecap="round" fill="none" />
        <path d={`M56 -300 Q ${96 + arm * 40} ${-230 - arm * 90} ${84 + arm * 70} ${-170 - arm * 150}`} stroke={C.shirt} strokeWidth={30} strokeLinecap="round" fill="none" />
        <circle cx={-84} cy={-166} r={16} fill={C.skin} />
        <circle cx={84 + arm * 70} cy={-166 - arm * 150} r={16} fill={C.skin} />
      </g>
      <g transform={`translate(0 ${by * 1.3 - 400})`}>
        <circle cx={0} cy={0} r={62} fill={C.skin} />
        <path d="M-70 -14 A 70 64 0 0 1 70 -14 Z" fill={C.helmet} />
        <rect x={-82} y={-18} width={164} height={12} rx={6} fill={C.helmet} />
        <ellipse cx={-22} cy={4} rx={7} ry={9 * eye} fill={C.ink} />
        <ellipse cx={22} cy={4} rx={7} ry={9 * eye} fill={C.ink} />
        <path d={`M-32 ${-10 + brow} L -12 ${-12 + brow} M12 ${-12 + brow} L 32 ${-10 + brow}`} stroke={C.ink} strokeWidth={4} strokeLinecap="round" />
        <path d={mouth} stroke={C.ink} strokeWidth={5} strokeLinecap="round" fill={mood === 'surprised' ? C.ink : 'none'} />
      </g>
    </g>
  );
};

/* ---------- icons ---------- */

const icon = {fill: 'none', strokeWidth: SW, strokeLinecap: 'round', strokeLinejoin: 'round'} as const;

const Magnifier: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cx={0} cy={0} r={70} fill={C.paper} fillOpacity={0.35} stroke={C.qc} strokeWidth={14} />
    <path d="M50 50 L 120 120" stroke={C.qc} strokeWidth={26} strokeLinecap="round" />
  </g>
);

const LogIcon: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-80} y={-36} width={130} height={72} rx={14} fill={C.core} />
    <ellipse cx={50} cy={0} rx={30} ry={36} fill={C.face} />
    <ellipse cx={50} cy={0} rx={16} ry={20} {...icon} stroke={C.faceDark} strokeWidth={4} />
  </g>
);

const GearIcon: React.FC<{x: number; y: number; s?: number; rot: number}> = ({x, y, s = 1, rot}) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${rot})`}>
    {Array.from({length: 8}, (_, i) => (
      <rect key={i} x={-12} y={-74} width={24} height={30} rx={5} fill={C.steel} transform={`rotate(${i * 45})`} />
    ))}
    <circle cx={0} cy={0} r={52} fill={C.steel} />
    <circle cx={0} cy={0} r={20} fill={C.paper} />
  </g>
);

const GlueIcon: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-40} y={-30} width={80} height={90} rx={16} fill={C.paper} stroke={C.ink} strokeWidth={SW} />
    <path d="M-16 -30 L -8 -62 L 8 -62 L 16 -30 Z" fill={C.ink} />
    <rect x={-40} y={0} width={80} height={26} fill={C.glue} />
    <path d="M58 10 Q 74 34 58 46 Q 42 34 58 10 Z" fill={C.glue} stroke={C.lowText} strokeWidth={3} />
  </g>
);

const ProcessIcon: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[-60, 0, 60].map((dx) => (
      <rect key={dx} x={dx - 20} y={-20} width={40} height={40} rx={8} fill={dx === 0 ? C.qc : C.faceDark} />
    ))}
    <path d="M-36 0 L -24 0 M24 0 L 36 0" {...icon} stroke={C.ink} />
    <path d="M-60 -34 Q 0 -80 60 -34" {...icon} stroke={C.ink} />
    <path d="M48 -48 L 60 -34 L 42 -28" {...icon} stroke={C.ink} />
  </g>
);

/* ---------- backdrop: warm paper wall, one floor line, slow drifting dust ---------- */

const FLOOR_Y = 1560;
const Backdrop: React.FC = () => {
  const t = useT();
  return (
    <Svg>
      <defs>
        <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.bg} />
          <stop offset="1" stopColor={C.bg2} />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#wall)" />
      <rect y={FLOOR_Y} width={1080} height={1920 - FLOOR_Y} fill={C.bg2} />
      <line x1={0} y1={FLOOR_Y} x2={1080} y2={FLOOR_Y} stroke={C.ink} strokeOpacity={0.15} strokeWidth={4} />
      {Array.from({length: 9}, (_, i) => {
        const x = (i * 131 + t * (6 + (i % 3) * 3)) % 1080;
        const y = 520 + ((i * 197) % 900) + float(t, 14, 6 + i, i * 0.3);
        return <circle key={i} cx={x} cy={y} r={4 + (i % 3) * 2} fill={C.faceDark} opacity={0.25} />;
      })}
    </Svg>
  );
};

/* ---------- 1-2. The finished pile: 1.000 sheets, then two equal sheets that end differently ---------- */

const PILE = {x: CX, y: 1380, w: 520, n: 14, e: 26};
const SPembuka: React.FC = () => {
  const t = useT();
  // Two sheets slide out of the pile: same wood, different fate.
  const out = k(t, CUES.SAMA - 0.2, CUES.SAMA + 0.4, 0, 1);
  const fate = k(t, CUES.BEDA_NASIB - 0.1, CUES.BEDA_NASIB + 0.4, 0, 1);
  const topY = PILE.y - (PILE.n - 1) * PILE.e;
  const surprise = t >= CUES.LHO - 0.1;
  return (
    <Layer id="tumpuk" to="nasib" exit="zoom">
      <Svg>
        <g transform={`translate(0 ${float(t, 4, 5)})`}>
          <Stack x={PILE.x} y={PILE.y} w={PILE.w} n={PILE.n} e={PILE.e} t={t} drop={(i) => 0.25 + i * 0.16} />
        </g>
        {[-1, 1].map((side) => {
          const x = lerp(PILE.x, PILE.x + side * 230, out);
          const y = lerp(topY - 30, 760, out) + float(t, 5, 4, side * 0.25);
          const tint = side > 0 ? interpolateColors(fate, [0, 1], [C.face, C.low]) : interpolateColors(fate, [0, 1], [C.face, C.pass]);
          return t < CUES.SAMA - 0.2 ? null : (
            <g key={side} transform={`translate(${x} ${y}) rotate(${side * 4 * out}) translate(${-x} ${-y})`}>
              <Sheet x={x} y={y} w={340} e={20} tint={tint} />
            </g>
          );
        })}
      </Svg>
      <Counter a={CUES.SERIBU - 0.2} b={CUES.LHO - 0.1} top={480} value={k(t, CUES.SERIBU - 0.1, CUES.SERIBU + 0.9, 0, 1000, lin)} size={150} color={C.ink} />
      <T a={0.4} b={CUES.LHO - 0.1} top={300} lines={[{text: 'Selesai diproduksi', size: 64, color: C.dim}]} />
      <Chip a={CUES.KELAS - 0.1} b={CUES.LHO - 0.1} x={CX} y={760} text="Kelas pesanan?" color={C.qc} />
      <T a={CUES.LHO} b={CUES.BEDA_NASIB - 0.15} top={300} lines={[{text: 'Sama-sama', size: 64, color: C.dim}, {text: 'kayu lapis', size: 96, delay: CUES.KAYU_LAPIS - CUES.LHO}]} />
      <T a={CUES.BEDA_NASIB - 0.1} b={scene('nasib').b} top={300} lines={[{text: 'Kok beda nasib?', size: 92}]} />
      <Bubble a={CUES.LHO - 0.1} b={CUES.SUDAH_JADI} x={300} y={1000} tx={220} ty={1200} text="Lho?" color={surprise ? C.ink : C.dim} />
    </Layer>
  );
};

/* ---------- 3-4. Zoom to one sheet; the magnifier finds surface defects on it ---------- */

const BIG = {x: CX - 40, y: 1360, w: 680, d: 400, e: 34};
/** Point on the big sheet's top face: u across (0 left .. 1 right), v depth (0 front .. 1 back). */
const onFace = (u: number, v: number) => ({x: BIG.x - BIG.w / 2 + BIG.d * 0.45 * v + BIG.w * u, y: BIG.y - BIG.d * v});
const CRACK = onFace(0.22, 0.62);
const KNOT = onFace(0.62, 0.3);
const SAND = onFace(0.7, 0.78);
const SPeriksa: React.FC = () => {
  const t = useT();
  const crack = k(t, CUES.RETAK - 0.15, CUES.RETAK + 0.45, 0, 1, lin);
  const knot = pop(t, CUES.LUBANG - 0.1);
  const sand = k(t, CUES.AMPLAS - 0.1, CUES.AMPLAS + 0.6, 0, 1);
  // The magnifier visits each defect as it is named.
  const stops = [
    {t: CUES.PEMERIKSAAN, ...onFace(0.5, 0.5)},
    {t: CUES.RETAK - 0.3, ...CRACK},
    {t: CUES.LUBANG - 0.3, ...KNOT},
    {t: CUES.AMPLAS - 0.3, ...SAND},
  ];
  const i = Math.max(0, stops.filter((s) => t >= s.t).length - 1);
  const from = stops[Math.max(0, i - 1)];
  const to = stops[i];
  const u = k(t, to.t, to.t + 0.4, 0, 1, EASE.inOut);
  const mx = lerp(from.x, to.x, u) + float(t, 6, 3.2);
  const my = lerp(from.y, to.y, u) + float(t, 5, 3.8, 0.3);
  const crackD = `M${CRACK.x - 70} ${CRACK.y - 20} L${CRACK.x - 30} ${CRACK.y + 6} L${CRACK.x} ${CRACK.y - 14} L${CRACK.x + 40} ${CRACK.y + 12} L${CRACK.x + 80} ${CRACK.y - 4}`;
  const crackPath = evolvePath(crack, crackD);
  return (
    <Layer id="periksa" to="permukaan" enter="zoom" exit="push">
      <Svg>
        <g transform={`translate(0 ${float(t, 4, 5)})`}>
          <ellipse cx={BIG.x + 80} cy={BIG.y + BIG.e + 16} rx={420} ry={22} fill={C.ink} opacity={0.12} />
          <Sheet x={BIG.x} y={BIG.y} w={BIG.w} d={BIG.d} e={BIG.e} />
          <path d={crackD} stroke={C.badText} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={crackPath.strokeDasharray} strokeDashoffset={crackPath.strokeDashoffset} />
          <Grow x={KNOT.x} y={KNOT.y} s={knot}>
            <ellipse cx={KNOT.x} cy={KNOT.y} rx={46} ry={26} fill={C.coreDark} />
            <ellipse cx={KNOT.x} cy={KNOT.y} rx={22} ry={12} fill={C.ink} />
          </Grow>
          <g opacity={sand}>
            <ellipse cx={SAND.x} cy={SAND.y} rx={90 * sand} ry={36 * sand} fill={C.paper} opacity={0.6} />
            <path d={`M${SAND.x - 60} ${SAND.y - 6} L${SAND.x + 60} ${SAND.y - 12} M${SAND.x - 50} ${SAND.y + 10} L${SAND.x + 54} ${SAND.y + 4}`} stroke={C.faceDark} strokeWidth={3} />
          </g>
        </g>
        {t >= CUES.PEMERIKSAAN - 0.4 ? (
          <Grow x={mx} y={my} s={pop(t, CUES.PEMERIKSAAN - 0.4)}>
            <Magnifier x={mx} y={my} />
          </Grow>
        ) : null}
      </Svg>
      <T a={scene('periksa').a + 0.1} b={CUES.PERMUKAAN - 0.1} top={300} lines={[{text: 'Setelah produksi', size: 64, color: C.dim}, {text: 'pemeriksaan mutu', size: 92, color: C.qc, delay: CUES.PEMERIKSAAN - scene('periksa').a - 0.1}]} />
      <T a={CUES.PERMUKAAN} b={scene('permukaan').b} top={300} lines={[{text: 'Permukaan diperiksa', size: 76}]} />
      <Chip a={CUES.RETAK} b={scene('permukaan').b} x={290} y={560} text="Retak" color={C.badText} />
      <Chip a={CUES.MATA_KAYU - 0.2} b={scene('permukaan').b} x={640} y={560} text="Mata kayu" color={C.coreDark} />
      <Chip a={CUES.AMPLAS} b={scene('permukaan').b} x={CX} y={680} text="Amplas lewat batas" color={C.lowText} />
    </Layer>
  );
};

/* ---------- 5. Cross-section of the edge: size, thickness, glue lines ---------- */

const PLY = {l: 180, r: 820, top: 900, h: 70};
const SUkuran: React.FC = () => {
  const t = useT();
  const width = k(t, CUES.UKURAN - 0.1, CUES.UKURAN + 0.5, 0, 1);
  const thick = k(t, CUES.KETEBALAN - 0.1, CUES.KETEBALAN + 0.5, 0, 1);
  const glue = k(t, CUES.REKATAN - 0.2, CUES.REKATAN + 0.4, 0, 1);
  const ok = pop(t, CUES.PERSYARATAN - 0.1);
  const bottom = PLY.top + 5 * PLY.h;
  const cx = (PLY.l + PLY.r) / 2;
  return (
    <Layer id="ukuran" enter="push" exit="up">
      <Svg>
        <g transform={`translate(0 ${float(t, 4, 5)})`}>
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x={PLY.l} y={PLY.top + i * PLY.h} width={PLY.r - PLY.l} height={PLY.h} rx={6} fill={i % 2 ? C.core : C.face} />
          ))}
          {[1, 2, 3, 4].map((i) => (
            <rect key={i} x={PLY.l} y={PLY.top + i * PLY.h - 6} width={(PLY.r - PLY.l) * glue} height={12} rx={6} fill={C.glue} opacity={0.4 + 0.5 * glue + 0.1 * Math.sin(t * 3 + i)} />
          ))}
          {/* width: arrow above the section */}
          <g opacity={width}>
            <line x1={cx - (cx - PLY.l) * width} y1={PLY.top - 60} x2={cx + (PLY.r - cx) * width} y2={PLY.top - 60} stroke={C.qc} strokeWidth={SW} />
            <path d={`M${PLY.l} ${PLY.top - 84} V${PLY.top - 36} M${PLY.r} ${PLY.top - 84} V${PLY.top - 36}`} stroke={C.qc} strokeWidth={SW} />
          </g>
          {/* thickness: bracket on the right edge */}
          <g opacity={thick}>
            <line x1={PLY.r + 40} y1={PLY.top} x2={PLY.r + 40} y2={lerp(PLY.top, bottom, thick)} stroke={C.qc} strokeWidth={SW} />
            <path d={`M${PLY.r + 20} ${PLY.top} H${PLY.r + 60} M${PLY.r + 20} ${bottom} H${PLY.r + 60}`} stroke={C.qc} strokeWidth={SW} />
          </g>
        </g>
        <Grow x={cx} y={bottom + 170} s={ok}>
          <circle cx={cx} cy={bottom + 170} r={74} fill={C.pass} />
          <path d={`M${cx - 34} ${bottom + 172} L${cx - 8} ${bottom + 198} L${cx + 38} ${bottom + 146}`} stroke={C.paper} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </Grow>
      </Svg>
      <Chip a={CUES.UKURAN} b={scene('ukuran').b} x={cx} y={PLY.top - 140} text="Ukuran" color={C.qc} />
      <Chip a={CUES.KETEBALAN} b={scene('ukuran').b} x={710} y={PLY.top + 5 * PLY.h + 60} text="Ketebalan" color={C.qc} />
      <Chip a={CUES.REKATAN - 0.1} b={scene('ukuran').b} x={290} y={PLY.top + 5 * PLY.h + 60} text="Rekatan" color={C.lowText} />
      <T a={CUES.PERSYARATAN - 0.2} b={scene('ukuran').b} top={300} lines={[{text: 'Harus sesuai', size: 64, color: C.dim}, {text: 'persyaratan', size: 92, color: C.passText}]} />
      <T a={scene('ukuran').a + 0.15} b={CUES.PERSYARATAN - 0.3} top={300} lines={[{text: 'Ukuran, ketebalan,', size: 72}, {text: 'rekatan', size: 72, color: C.lowText, delay: CUES.REKATAN - scene('ukuran').a - 0.15}]} />
    </Layer>
  );
};

/* ---------- 6. From far it looks smooth; up close the crack shows ---------- */

const SJauh: React.FC = () => {
  const t = useT();
  const near = k(t, CUES.BELUM_TENTU2 - 0.2, CUES.LOLOS, 0.4, 1.25, EASE.inOut);
  const crack = k(t, CUES.BELUM_TENTU2 + 0.3, CUES.LOLOS, 0, 1, lin);
  const x = CX;
  const y = 1220;
  const crackD = `M${x - 120} ${y - 120} L${x - 60} ${y - 90} L${x - 20} ${y - 116} L${x + 50} ${y - 86} L${x + 110} ${y - 104}`;
  const crackPath = evolvePath(crack, crackD);
  return (
    <Layer id="jauh" enter="up">
      <Svg>
        <g transform={`translate(${x} ${y - 100}) scale(${near}) translate(${-x} ${-(y - 100)}) translate(0 ${float(t, 5, 4.5)})`}>
          <Sheet x={x} y={y} w={560} d={300} e={30} />
          <path d={crackD} stroke={C.badText} strokeWidth={6} fill="none" strokeLinecap="round" strokeDasharray={crackPath.strokeDasharray} strokeDashoffset={crackPath.strokeDashoffset} />
        </g>
      </Svg>
      <T a={scene('jauh').a + 0.2} b={CUES.BELUM_TENTU2 - 0.1} top={300} lines={[{text: 'Kelihatan mulus', size: 84}, {text: 'dari jauh', size: 64, color: C.dim, delay: CUES.JAUH - scene('jauh').a - 0.2}]} />
      <T a={CUES.BELUM_TENTU2} b={scene('jauh').b} top={300} lines={[{text: 'Belum tentu', size: 64, color: C.dim}, {text: 'langsung lolos', size: 92, color: C.badText, delay: CUES.LOLOS - CUES.BELUM_TENTU2 - 0.3}]} />
    </Layer>
  );
};

/* ---------- 7-8. Simulation: 100 tiles (10 sheets each) take a grade, then morph into one 80/20 bar ---------- */

const TILE = {l: 180, top: 820, w: 56, h: 40, dx: 64, dy: 48};
const BAR = {l: 140, w: 720, top: 960, h: 130};
const SSimulasi: React.FC = () => {
  const t = useT();
  const m = k(t, CUES.BERARTI - 0.2, CUES.BERARTI + 0.5, 0, 1, EASE.inOut);
  const rest = k(t, CUES.DUA_PULUH - 0.1, CUES.DUA_PULUH + 0.4, 0, 1);
  const at = {pass: CUES.DELAPAN_RATUS - 0.2, low: CUES.SERATUS_LIMA_PULUH - 0.2, bad: CUES.LIMA_PULUH - 0.2};
  const col = {pass: C.pass, low: C.low, bad: C.bad};
  const sim = scene('simulasi');
  return (
    <Layer id="simulasi" to="persen" enter="push" exit="zoom">
      <Svg>
        <g transform={`translate(0 ${float(t, 4, 5)})`}>
          {Array.from({length: 100}, (_, i) => {
            const g = i < 80 ? 'pass' : i < 95 ? 'low' : 'bad';
            const shown = k(t, sim.a + 0.3 + i * 0.012, sim.a + 0.6 + i * 0.012, 0, 1);
            if (shown <= 0) return null;
            const c = k(t, at[g] + (i % 80) * 0.006, at[g] + 0.3 + (i % 80) * 0.006, 0, 1);
            const gx = TILE.l + (i % 10) * TILE.dx;
            const gy = TILE.top + Math.floor(i / 10) * TILE.dy;
            const bx = BAR.l + (i * BAR.w) / 100;
            // After "20 persen", the 80 % part steps back and the other 20 % lifts.
            const lift = g === 'pass' ? 0 : -24 * rest;
            return (
              <rect
                key={i}
                x={lerp(gx, bx, m)}
                y={lerp(gy, BAR.top, m) + lift}
                width={lerp(TILE.w, BAR.w / 100 + 0.6, m)}
                height={lerp(TILE.h, BAR.h, m)}
                rx={lerp(6, 0, m)}
                opacity={shown * (g === 'pass' ? 1 - 0.55 * rest : 1)}
                fill={interpolateColors(c, [0, 1], [C.face, col[g]])}
              />
            );
          })}
          <g opacity={m}>
            <path d={`M${BAR.l} ${BAR.top + BAR.h + 30} H${BAR.l + BAR.w * 0.8 - 6}`} stroke={C.passText} strokeWidth={SW} strokeLinecap="round" />
            <path d={`M${BAR.l + BAR.w * 0.8 + 6} ${BAR.top - 54} H${BAR.l + BAR.w}`} stroke={C.lowText} strokeWidth={SW} strokeLinecap="round" opacity={rest} />
          </g>
        </g>
      </Svg>
      <Pill a={sim.a + 0.2} b={CUES.BERARTI - 0.2} text="SIMULASI" top={200} color={C.dim} />
      <T a={sim.a + 0.3} b={CUES.DELAPAN_RATUS - 0.25} top={330} lines={[{text: 'Dari 1.000 lembar', size: 84}]} />
      <T a={CUES.DELAPAN_RATUS - 0.2} b={CUES.SERATUS_LIMA_PULUH - 0.25} top={330} lines={[{text: '800', size: 140, color: C.passText}, {text: 'kelas pesanan', size: 64, color: C.dim}]} />
      <T a={CUES.SERATUS_LIMA_PULUH - 0.2} b={CUES.LIMA_PULUH - 0.25} top={330} lines={[{text: '150', size: 140, color: C.lowText}, {text: 'kelas lebih rendah', size: 64, color: C.dim}]} />
      <T a={CUES.LIMA_PULUH - 0.2} b={CUES.BERARTI - 0.2} top={330} lines={[{text: '50', size: 140, color: C.badText}, {text: 'diperbaiki / ditolak', size: 64, color: C.dim}]} />
      <Counter a={CUES.BERARTI} b={CUES.DUA_PULUH - 0.15} top={420} value={k(t, CUES.BERARTI + 0.3, CUES.DELAPAN_PULUH + 0.2, 0, 80, lin)} size={170} color={C.passText} suffix="%" />
      <T a={CUES.BERARTI + 0.3} b={CUES.DUA_PULUH - 0.15} top={300} lines={[{text: 'Langsung kelas pesanan', size: 60, color: C.dim}]} />
      <T a={CUES.DUA_PULUH - 0.1} b={CUES.PENANGANAN - 0.15} top={300} lines={[{text: '20% lainnya', size: 96, color: C.lowText}, {text: 'nggak otomatis sampah', size: 64, color: C.ink, delay: CUES.SAMPAH - CUES.DUA_PULUH - 0.6}]} />
      <T a={CUES.PENANGANAN - 0.1} b={scene('persen').b} top={300} lines={[{text: 'Penanganannya beda', size: 76, color: C.lowText}]} />
      <Chip a={CUES.HARGA - 0.3} b={scene('persen').b} x={CX} y={1300} text="Harga belum tentu sama" color={C.ink} />
    </Layer>
  );
};

/* ---------- 9-10. The worker and the tall pile; the pile then stands alone as "output" ---------- */

const TALL = {x: 730, y: 1480, w: 300, n: 22, e: 24};
const SPekerja: React.FC = () => {
  const t = useT();
  const mood: Mood = t >= CUES.TERNYATA - 0.1 ? 'surprised' : t >= CUES.LEGA - 0.2 ? 'happy' : 'neutral';
  // Anticipation dip right before each mood change.
  const dip = Math.max(Math.sin(Math.PI * k(t, CUES.LEGA - 0.45, CUES.LEGA - 0.1, 0, 1)), Math.sin(Math.PI * k(t, CUES.TERNYATA - 0.4, CUES.TERNYATA, 0, 1)));
  const arm = k(t, CUES.LEGA - 0.1, CUES.LEGA + 0.4, 0, 1) * k(t, CUES.TERNYATA - 0.2, CUES.TERNYATA + 0.2, 1, 0);
  const leave = k(t, CUES.MENGHITUNG - 0.3, CUES.MENGHITUNG + 0.3, 0, 1, EASE.in);
  const px = lerp(TALL.x, CX, k(t, CUES.MENGHITUNG - 0.2, CUES.MENGHITUNG + 0.5, 0, 1, EASE.inOut));
  const topY = TALL.y - (TALL.n - 1) * TALL.e;
  return (
    <Layer id="pekerja" to="hitung" enter="push" exit="push">
      <Svg>
        <g transform={`translate(0 ${float(t, 3, 5)})`}>
          <Stack x={px} y={TALL.y} w={TALL.w} n={TALL.n} e={TALL.e} t={t} />
        </g>
        {leave < 1 ? (
          <g transform={`translate(${-500 * leave} 0)`}>
            <Worker x={300} y={1500} mood={mood} t={t} dip={dip} arm={arm} />
          </g>
        ) : null}
      </Svg>
      <T a={scene('pekerja').a + 0.3} b={CUES.TADI - 0.15} top={300} lines={[{text: 'Buat yang kerja', size: 84}]} />
      <Bubble a={CUES.LEGA - 0.2} b={CUES.TERNYATA - 0.2} x={360} y={760} tx={320} ty={1010} text="Lega, tinggi!" />
      <Bubble a={CUES.TERNYATA} b={scene('pekerja').b - 0.1} x={CX} y={720} tx={320} ty={1010} text="Nunggu sortir…" color={C.qc} />
      <Chip a={CUES.SORTIR - 0.2} b={scene('pekerja').b - 0.1} x={TALL.x} y={topY - 80} text="Belum disortir" color={C.lowText} size={48} />
      <T a={CUES.MENGHITUNG - 0.1} b={scene('hitung').b} top={300} lines={[{text: 'Nggak cukup dari', size: 64, color: C.dim}, {text: 'berapa lembar keluar', size: 80, delay: CUES.KELUAR - CUES.MENGHITUNG - 1.4}]} />
    </Layer>
  );
};

/* ---------- 11-12. Quantity vs quality; four quality factors, which then line up as the trace path ---------- */

const FACTORS = [
  {a: CUES.BAHAN, text: 'Bahan', grid: [300, 1000]},
  {a: CUES.MESIN, text: 'Mesin', grid: [700, 1000]},
  {a: CUES.PEREKAT, text: 'Perekat', grid: [300, 1300]},
  {a: CUES.PROSES, text: 'Proses', grid: [700, 1300]},
] as const;
const ROW_Y = 1080;
const SFaktor: React.FC = () => {
  const t = useT();
  const end = scene('faktor').b;
  const split = k(t, CUES.MUTUNYA + 0.8, CUES.MUTUNYA + 1.3, 0, 1, EASE.inOut);
  const m = k(t, end - 0.2, end + 0.5, 0, 1, EASE.inOut);
  const trace = k(t, CUES.PENYEBAB, CUES.DITELUSURI + 0.5, 0, 1, lin);
  const traceD = `M${CX} 800 L${CX} 900 Q ${CX} 960 ${CX - 100} ${ROW_Y - 40} L 200 ${ROW_Y - 40} L 200 ${ROW_Y}`;
  const traceP = evolvePath(trace, `${traceD} M200 ${ROW_Y} L 800 ${ROW_Y}`);
  const point = pop(t, 74.2);
  const cross = k(t, CUES.MENUNJUK - 0.1, CUES.MENUNJUK + 0.3, 0, 1);
  const crossP = evolvePath(cross, 'M-50 -50 L 50 50 M50 -50 L -50 50');
  const telusur = k(t, end - 0.1, end + 0.4, 0, 1);
  return (
    <Layer id="faktor" to="telusur" enter="push">
      <Svg>
        {/* quantity column: small pile, fades when quality takes the stage */}
        <g opacity={k(t, CUES.JUMLAH - 0.2, CUES.JUMLAH + 0.2, 0, 1) * (1 - split)} transform={`translate(0 ${float(t, 4, 4.5)})`}>
          <Stack x={300} y={1120} w={220} n={6} e={20} t={t} />
        </g>
        <g opacity={k(t, CUES.MUTUNYA - 0.2, CUES.MUTUNYA + 0.2, 0, 1) * (1 - split) * (1 - telusur)}>
          <Magnifier x={680 + float(t, 5, 3.5)} y={1000} s={0.9} />
        </g>
        {FACTORS.map((f, i) => {
          const x = lerp(f.grid[0], 200 + i * 200, m);
          const y = lerp(f.grid[1], ROW_Y, m) + float(t, 5, 4, i * 0.25);
          const s = pop(t, f.a - 0.2) * lerp(1, 0.75, m);
          return (
            <g key={f.text}>
              <line x1={CX} y1={760} x2={x} y2={y} stroke={C.ink} strokeOpacity={0.15 * (1 - m) * s} strokeWidth={4} />
              <Grow x={x} y={y} s={s}>
                <circle cx={x} cy={y} r={95} fill={C.paper} stroke={C.ink} strokeWidth={4} strokeOpacity={0.2} />
                {i === 0 ? <LogIcon x={x} y={y} s={0.85} /> : i === 1 ? <GearIcon x={x} y={y} s={0.9} rot={t * 40} /> : i === 2 ? <GlueIcon x={x} y={y} s={0.9} /> : <ProcessIcon x={x} y={y} s={1} />}
              </Grow>
            </g>
          );
        })}
        {/* trace: from the faulty sheet down through every factor */}
        <g opacity={telusur}>
          <g transform={`translate(0 ${float(t, 4, 5)})`}>
            <Sheet x={CX} y={760} w={360} d={150} e={22} />
            <path d={`M${CX - 80} 690 L${CX - 30} 712 L${CX + 10} 694 L${CX + 70} 716`} stroke={C.badText} strokeWidth={6} fill="none" strokeLinecap="round" />
          </g>
          <path d={`${traceD} M200 ${ROW_Y} L 800 ${ROW_Y}`} stroke={C.qc} strokeWidth={SW} fill="none" strokeLinecap="round" strokeDasharray={traceP.strokeDasharray} strokeDashoffset={traceP.strokeDashoffset} />
        </g>
        {t >= 74.2 ? (
          <g opacity={point}>
            <Worker x={CX - 60} y={1540} s={0.5} mood={cross > 0.5 ? 'happy' : 'neutral'} t={t} />
            <g transform={`translate(${lerp(820, 640, point)} 1320)`}>
              <path d="M60 0 L -40 0 M-10 -28 L -44 0 L -10 28" {...icon} stroke={C.badText} strokeWidth={12} />
              <path d="M-42 -50 L 58 50 M58 -50 L -42 50" stroke={C.ink} strokeWidth={14} strokeLinecap="round" strokeDasharray={crossP.strokeDasharray} strokeDashoffset={crossP.strokeDashoffset} />
            </g>
          </g>
        ) : null}
      </Svg>
      <Chip a={CUES.JUMLAH - 0.2} b={CUES.MUTUNYA + 0.9} x={300} y={760} text="Jumlah" color={C.ink} />
      <Chip a={CUES.MUTUNYA - 0.2} b={end - 0.15} x={lerp(700, CX, split)} y={760} text="Mutu" color={C.qc} />
      {FACTORS.map((f) => (
        <Chip key={f.text} a={f.a} b={end - 0.15} x={f.grid[0]} y={f.grid[1] + 140} text={f.text} color={C.ink} size={48} />
      ))}
      <T a={scene('faktor').a + 0.15} b={CUES.MUTUNYA + 0.9} top={300} lines={[{text: 'Ada jumlahnya,', size: 72, color: C.dim}, {text: 'ada mutunya', size: 92, color: C.qc, delay: CUES.MUTUNYA - scene('faktor').a - 0.35}]} />
      <T a={CUES.MUTUNYA + 1.0} b={end - 0.15} top={300} lines={[{text: 'Mutu dipengaruhi', size: 80}]} />
      <T a={end + 0.1} b={74.15} top={300} lines={[{text: 'Penyebabnya', size: 64, color: C.dim}, {text: 'perlu ditelusuri', size: 92, color: C.qc, delay: CUES.DITELUSURI - end - 1.0}]} />
      <T a={74.25} b={AUDIO_SECONDS + 1} top={300} lines={[{text: 'Bukan langsung menunjuk', size: 64, color: C.badText}, {text: 'orang terakhir', size: 92, delay: CUES.MENUNJUK - 74.25}]} />
    </Layer>
  );
};

export const Video: React.FC<z.infer<typeof kitSchema>> = ({watermark, sfxVolume, showReview}) => (
  <AbsoluteFill style={{background: C.bg, overflow: 'hidden'}}>
    <Backdrop />
    <SPembuka />
    <SPeriksa />
    <SUkuran />
    <SJauh />
    <SSimulasi />
    <SPekerja />
    <SFaktor />
    <Watermark text={watermark} color={C.ink} />
    <Audio src={staticFile('videos/produksi-plywood/narration.wav')} />
    <Audio src={staticFile('videos/produksi-plywood/music.wav')} volume={MUSIC_VOLUME} />
    <Sfx cues={SFX} volume={sfxVolume} />
    {showReview ? <ReviewOverlay /> : null}
  </AbsoluteFill>
);
