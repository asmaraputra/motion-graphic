import {AbsoluteFill, Easing, staticFile} from 'remotion';
import {Audio} from '@remotion/media';
import {z} from 'zod';
import {FONT, INK, kitSchema} from '../../kit/brand';
import {ReviewOverlay, Sfx, Title, Watermark} from '../../kit/components';
import {EASE, k, lerp, life, useT} from '../../kit/motion';
import {AUDIO_SECONDS, CUES, FPS, SFX, scene, SCENES} from './timeline';

/** Night blue, one warm lamp accent, thin line art. */
const C = {
  ...INK,
  bg: '#0C172C',
  bg2: '#172A4B',
  line: '#9FB4D8',
  lineDim: 'rgba(159,180,216,0.35)',
  lamp: '#FFC857',
  text: '#F3EEE2',
  dim: 'rgba(243,238,226,0.6)',
};
const SW = 6; // one outline weight for the whole video
const CX = 500; // center of the safe width (100..900)
const MUSIC_VOLUME = 0.063; // -24 dB: music.wav -20 LUFS vs narration -25.4 LUFS, about 19 dB under

type SceneId = (typeof SCENES)[number]['id'];
type Move = 'fade' | 'zoom' | 'push' | 'up' | 'cut';

/** Slow sine float for living holds. */
const float = (t: number, amp = 6, period = 4, phase = 0) => Math.sin((t / period + phase) * Math.PI * 2) * amp;

/** Scene layer with a per-scene entrance and exit move (push and cut stay opaque). */
const Layer: React.FC<{id: SceneId; enter?: Move; exit?: Move; children: React.ReactNode}> = ({id, enter = 'fade', exit = 'fade', children}) => {
  const t = useT();
  const {a, b} = scene(id);
  if (t < a - 0.5 || t > b + 0.3) return null;
  const pin = enter === 'cut' ? Number(t >= a) : k(t, a - 0.15, a + 0.45, 0, 1);
  const pout = b >= AUDIO_SECONDS ? 0 : exit === 'cut' ? Number(t >= b) : k(t, b - 0.3, b + 0.05, 0, 1, EASE.in);
  const solidIn = enter === 'push' || enter === 'cut';
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

const stroke = {fill: 'none', stroke: C.line, strokeWidth: SW, strokeLinecap: 'round', strokeLinejoin: 'round'} as const;

/** Night sky: gradient, slow twinkling stars, faint drift. */
const STARS = Array.from({length: 46}, (_, i) => ({
  x: (i * 197.3) % 1080,
  y: (i * 331.7) % 1500,
  r: 1.5 + ((i * 7) % 5) * 0.5,
  p: (i * 0.37) % 1,
}));
const Sky: React.FC = () => {
  const t = useT();
  return (
    <Svg>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.bg} />
          <stop offset="1" stopColor={C.bg2} />
        </linearGradient>
        {/* Shared lamp glow; ids are document-wide, so other SVG layers can use url(#glow). */}
        <radialGradient id="glow">
          <stop offset="0" stopColor={C.lamp} stopOpacity={0.3} />
          <stop offset="1" stopColor={C.lamp} stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#sky)" />
      {STARS.map((s, i) => (
        <circle key={i} cx={s.x + float(t, 6, 14, s.p)} cy={s.y} r={s.r} fill={C.text} opacity={0.18 + 0.22 * (0.5 + 0.5 * Math.sin((t / 4.5 + s.p) * Math.PI * 2))} />
      ))}
    </Svg>
  );
};

/** Text drawn inside SVG illustrations (labels on screens). */
const Label: React.FC<{x: number; y: number; size: number; children: React.ReactNode; color?: string; weight?: number; opacity?: number}> = ({x, y, size, children, color = C.text, weight = 700, opacity = 1}) => (
  <text x={x} y={y} fontFamily={FONT} fontWeight={weight} fontSize={size} fill={color} textAnchor="middle" opacity={opacity}>
    {children}
  </text>
);

/** Handset glyph, centered on 0,0, about 60 px. */
const Handset: React.FC<{color: string}> = ({color}) => (
  <path
    transform="translate(-30 -30) scale(2.5)"
    fill={color}
    d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
  />
);

/** Abstract chat lines (never the narration text). */
const Lines: React.FC<{x: number; y: number; widths: number[]; p: number; color?: string}> = ({x, y, widths, p, color = C.line}) => (
  <g>
    {widths.map((w, i) => (
      <line key={i} x1={x} y1={y + i * 30} x2={x + w * k(p, i * 0.15, i * 0.15 + 0.5, 0, 1)} y2={y + i * 30} stroke={color} strokeWidth={10} strokeLinecap="round" opacity={0.8} />
    ))}
  </g>
);

type Screen = 'call' | 'off' | 'talk';
/** The same phone across the opening and the call scene. Centered on x, y. */
const Phone: React.FC<{x: number; y: number; s: number; screen: Screen; on: number}> = ({x, y, s, screen, on}) => {
  const t = useT();
  const ring = (t * 1.1) % 1;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={0} rx={420} ry={600} fill="url(#glow)" opacity={on} />
      <rect x={-190} y={-380} width={380} height={760} rx={56} {...stroke} fill={C.bg} />
      <rect x={-162} y={-340} width={324} height={680} rx={36} fill={C.bg2} opacity={0.4 + 0.6 * on} />
      <line x1={-40} y1={-356} x2={40} y2={-356} stroke={C.line} strokeWidth={SW} strokeLinecap="round" />
      <g opacity={on}>
        <circle cx={0} cy={-150} r={72} {...stroke} stroke={C.text} />
        <circle cx={0} cy={-172} r={26} fill="none" stroke={C.text} strokeWidth={SW} />
        <path d="M-44 -100 Q0 -150 44 -100" fill="none" stroke={C.text} strokeWidth={SW} strokeLinecap="round" />
        <Label x={0} y={-20} size={56}>
          Ibu
        </Label>
        {screen === 'call' ? (
          <g transform="translate(0 220)">
            <circle r={60 + 50 * ring} fill="none" stroke={C.lamp} strokeWidth={4} opacity={1 - ring} />
            <circle r={60} fill={C.lamp} />
            <Handset color={C.bg} />
          </g>
        ) : null}
        {screen === 'talk' ? (
          <g transform="translate(0 110)">
            {Array.from({length: 9}, (_, i) => {
              const h = 16 + 46 * Math.abs(Math.sin(t * 3.1 + i * 0.9) * Math.sin(t * 1.3 + i * 0.4));
              return <line key={i} x1={-120 + i * 30} y1={-h / 2} x2={-120 + i * 30} y2={h / 2} stroke={C.lamp} strokeWidth={10} strokeLinecap="round" />;
            })}
            <g transform="translate(0 150)">
              <circle r={52} fill="none" stroke={C.lamp} strokeWidth={SW} />
              <g transform="scale(0.8)">
                <Handset color={C.lamp} />
              </g>
            </g>
          </g>
        ) : null}
      </g>
    </g>
  );
};

/** Line-art parent. Feet at x, y. stoop 0..1 bends the posture (morph from memory to now). */
const Parent: React.FC<{x: number; y: number; s?: number; stoop: number; walk?: number; mood?: 'smile' | 'neutral' | 'tired'; glow?: number}> = ({
  x,
  y,
  s = 1,
  stoop,
  walk = 0,
  mood = 'smile',
  glow = 0,
}) => {
  const t = useT();
  const breathe = Math.sin(t * 1.6) * 3;
  const swing = Math.sin(t * Math.PI * 1.1) * 14 * walk;
  const lean = -22 * stoop;
  const blink = (t + 0.7) % 3.4 < 0.12;
  const leg = (deg: number) => {
    const r = (deg * Math.PI) / 180;
    return `M0 -230 L${Math.sin(r) * 230} ${-230 + Math.cos(r) * 230}`;
  };
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {glow > 0 ? <ellipse cx={0} cy={-300} rx={340} ry={460} fill="url(#glow)" opacity={glow} /> : null}
      <ellipse cx={0} cy={4} rx={110} ry={14} fill="#000" opacity={0.3} />
      <path d={`${leg(10 + swing)} ${leg(-10 - swing)}`} {...stroke} />
      <g transform={`rotate(${lean} 0 -230)`}>
        <path d={`M0 -230 L0 ${-440 + breathe}`} {...stroke} />
        <path d={`M0 ${-420 + breathe} L${-70 - 20 * stoop} ${-300 + breathe}`} {...stroke} />
        <path d={`M0 ${-420 + breathe} L${70 + 10 * stoop} ${-310 + 40 * stoop + breathe}`} {...stroke} />
        <g transform={`translate(0 ${-500 + breathe}) rotate(${12 * stoop})`}>
          <circle r={56} {...stroke} fill={C.bg} />
          <circle cx={-6} cy={-60} r={22} {...stroke} fill={C.bg} stroke={stoop > 0.5 ? C.text : C.line} />
          {blink ? (
            <path d="M-26 -6 L-12 -6 M12 -6 L26 -6" {...stroke} strokeWidth={4} />
          ) : (
            <>
              <circle cx={-19} cy={-6} r={5} fill={C.line} />
              <circle cx={19} cy={-6} r={5} fill={C.line} />
            </>
          )}
          <path d={mood === 'smile' ? 'M-18 18 Q0 32 18 18' : mood === 'tired' ? 'M-16 24 Q0 16 16 24' : 'M-16 21 L16 21'} {...stroke} strokeWidth={4} />
        </g>
      </g>
      <path d="M100 0 L100 -280 Q100 -300 80 -300" {...stroke} stroke={C.lamp} opacity={k(stoop, 0.55, 1, 0, 1)} />
    </g>
  );
};

/** House at night with one lamp-lit window. */
const House: React.FC<{x: number; y: number; lit: number}> = ({x, y, lit}) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M-300 -360 L0 -600 L300 -360" {...stroke} />
    <rect x={-260} y={-380} width={520} height={380} {...stroke} fill={C.bg} />
    <rect x={-200} y={-300} width={170} height={150} rx={10} fill={C.lamp} opacity={0.15 + 0.85 * lit} stroke={C.line} strokeWidth={SW} />
    <path d="M-115 -300 L-115 -150 M-200 -225 L-30 -225" stroke={C.bg} strokeWidth={SW} opacity={lit} />
    <rect x={60} y={-230} width={130} height={230} rx={8} {...stroke} fill={C.bg} />
    <circle cx={160} cy={-110} r={7} fill={C.line} />
    <line x1={-420} y1={0} x2={420} y2={0} stroke={C.lineDim} strokeWidth={SW} strokeLinecap="round" />
  </g>
);

/** TV whose sound arcs grow with `loud`. */
const Tv: React.FC<{x: number; y: number; loud: number}> = ({x, y, loud}) => {
  const t = useT();
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-170} y={-240} width={340} height={230} rx={22} {...stroke} fill={C.bg2} />
      <rect x={-140} y={-210} width={280} height={170} rx={12} fill={C.lamp} opacity={0.18 + 0.06 * Math.sin(t * 2.3)} />
      <path d="M-60 -10 L-90 40 M60 -10 L90 40" {...stroke} />
      {[0, 1, 2].map((i) => {
        const p = (t * 0.9 + i / 3) % 1;
        return (
          <g key={i} opacity={loud * (1 - p)}>
            <path d={`M${200 + p * 120} -200 Q${250 + p * 160} -125 ${200 + p * 120} -50`} {...stroke} stroke={C.lamp} />
            <path d={`M${-200 - p * 120} -200 Q${-250 - p * 160} -125 ${-200 - p * 120} -50`} {...stroke} stroke={C.lamp} />
          </g>
        );
      })}
    </g>
  );
};

/** Hourglass; `fallen` 0..1 is how much sand has dropped. */
const Hourglass: React.FC<{x: number; y: number; s?: number; fallen: number}> = ({x, y, s = 1, fallen}) => {
  const t = useT();
  const top = 1 - fallen;
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) rotate(${float(t, 2, 6)})`}>
      {top > 0.01 ? <path d={`M${-150 * top} ${-250 * top} L${150 * top} ${-250 * top} L0 0 Z`} fill={C.lamp} opacity={0.85} /> : null}
      <path d={`M-150 250 L150 250 L${150 * (1 - fallen)} ${250 - 250 * fallen} L${-150 * (1 - fallen)} ${250 - 250 * fallen} Z`} fill={C.lamp} opacity={0.85} />
      {top > 0.01 ? <line x1={0} y1={0} x2={0} y2={250 - 250 * fallen} stroke={C.lamp} strokeWidth={5} strokeDasharray="14 10" strokeDashoffset={-t * 60} /> : null}
      <path d="M-170 -270 L170 -270 M-170 270 L170 270 M-150 -270 L-150 -240 Q-150 -120 -16 0 Q-150 120 -150 240 L-150 270 M150 -270 L150 -240 Q150 -120 16 0 Q150 120 150 240 L150 270" {...stroke} />
    </g>
  );
};

/** Wall clock; `turns` advances the hour hand (linear progress allowed). */
const Clock: React.FC<{x: number; y: number; turns: number}> = ({x, y, turns}) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={150} {...stroke} fill={C.bg} />
    {Array.from({length: 12}, (_, i) => (
      <line key={i} x1={0} y1={-128} x2={0} y2={-112} stroke={C.line} strokeWidth={SW} strokeLinecap="round" transform={`rotate(${i * 30})`} />
    ))}
    <line x1={0} y1={0} x2={0} y2={-70} stroke={C.text} strokeWidth={SW + 2} strokeLinecap="round" transform={`rotate(${180 + turns * 360})`} />
    <line x1={0} y1={0} x2={0} y2={-108} stroke={C.lamp} strokeWidth={SW} strokeLinecap="round" transform={`rotate(${turns * 360 * 12})`} />
    <circle r={9} fill={C.lamp} />
  </g>
);

/** Speech bubble with abstract lines. Tail on `side`. p 0..1 pops it in. */
const Bubble: React.FC<{x: number; y: number; w: number; side: 'l' | 'r'; p: number; lines: number[]; accent?: boolean}> = ({x, y, w, side, p, lines, accent}) => {
  if (p <= 0) return null;
  const h = 60 + lines.length * 30;
  const tail = side === 'l' ? `M30 ${h - 10} L10 ${h + 34} L80 ${h - 10}` : `M${w - 30} ${h - 10} L${w - 10} ${h + 34} L${w - 80} ${h - 10}`;
  const col = accent ? C.lamp : C.line;
  return (
    <g transform={`translate(${x} ${y}) scale(${lerp(0.9, 1, p)})`} opacity={Math.min(1, p * 2)} style={{transformBox: 'fill-box'}}>
      <rect width={w} height={h} rx={34} fill={C.bg2} stroke={col} strokeWidth={SW} />
      <path d={tail} fill={C.bg2} stroke={col} strokeWidth={SW} strokeLinejoin="round" />
      <rect x={20} y={h - 16} width={w - 40} height={12} fill={C.bg2} />
      <Lines x={40} y={45} widths={lines} p={p} color={col} />
    </g>
  );
};

/** Battery that drains with `level` 0..1. */
const Battery: React.FC<{x: number; y: number; s: number; level: number}> = ({x, y, s, level}) => {
  const t = useT();
  const low = level < 0.3;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-170} y={-80} width={320} height={160} rx={26} {...stroke} fill={C.bg} />
      <rect x={156} y={-30} width={22} height={60} rx={6} fill={C.line} />
      <rect x={-148} y={-58} width={276 * level} height={116} rx={14} fill={low ? C.lamp : C.line} opacity={low ? 0.6 + 0.3 * Math.sin(t * Math.PI * 2) : 0.8} />
    </g>
  );
};

// ---------- Scenes ----------

const lin = Easing.linear;

const SNanti: React.FC = () => {
  const t = useT();
  const declined = t >= CUES.NANTI + 0.2;
  return (
    <Layer id="nanti" exit="push">
      <Svg>
        <Phone x={CX} y={860 + float(t)} s={1} screen={declined ? 'off' : 'call'} on={k(t, 0, 0.5, 0, 1) * k(t, CUES.NANTI + 0.2, CUES.NANTI + 0.7, 1, 0.3)} />
      </Svg>
      <Title a={1.0} b={4.75} top={1320} lines={[{text: 'Kepikiran mau telepon', size: 60, color: C.dim}, {text: 'orang tua', size: 104, color: C.lamp, delay: 0.98}]} />
      <Title a={CUES.NANTI} b={6.8} top={1320} lines={[{text: '“Nanti deh,', size: 100}, {text: 'habis ini.”', size: 72, color: C.dim, delay: 0.99}]} />
    </Layer>
  );
};

const SMalam: React.FC = () => {
  const t = useT();
  return (
    <Layer id="malam" enter="push" exit="zoom">
      <Svg>
        <g transform={`translate(${780 + float(t, 5, 6)} 380)`}>
          <circle r={70} fill={C.lamp} opacity={0.9} />
          <circle cx={-30} cy={-18} r={64} fill={C.bg} />
        </g>
        <Clock x={CX} y={820 + float(t)} turns={k(t, 7.0, 9.4, 0.3, 1.9, lin)} />
      </Svg>
      <Title a={7.1} b={9.0} top={1220} lines={[{text: 'Tahu-tahu', size: 64, color: C.dim}, {text: 'sudah malam.', size: 100, color: C.lamp, delay: 1.1}]} />
      <Title a={9.0} b={10.45} top={1220} lines={[{text: 'Besoknya', size: 64, color: C.dim}, {text: 'lupa lagi.', size: 100, delay: 0.5}]} />
    </Layer>
  );
};

/** The same hourglass carries "waktu" into "tunggu", then shrinks up. */
const HourglassTrack: React.FC = () => {
  const t = useT();
  const o = Math.min(k(t, 10.3, 10.9, 0, 1), k(t, 21.75, 22.1, 1, 0, EASE.in));
  if (o <= 0) return null;
  const m = k(t, 14.7, 15.4, 0, 1, EASE.inOut);
  return (
    <Svg style={{opacity: o}}>
      <Hourglass x={CX} y={lerp(800, 520, m) + float(t)} s={lerp(k(t, 10.3, 10.9, 1.25, 1.05), 0.6, m)} fallen={k(t, 10.45, 22, 0.05, 0.4, lin)} />
    </Svg>
  );
};

const SWaktu: React.FC = () => (
  <Layer id="waktu" enter="zoom" exit="cut">
    <Title a={12.4} b={14.7} top={1240} lines={[{text: 'Masih punya', size: 64, color: C.dim}, {text: 'banyak waktu', size: 104, color: C.lamp, delay: 1.0}]} />
  </Layer>
);

const STunggu: React.FC = () => (
  <Layer id="tunggu" enter="cut" exit="push">
    <Title
      a={15.0}
      b={22.0}
      top={880}
      lines={[
        {text: 'Nunggu libur.', size: 76, delay: 1.2},
        {text: 'Uangnya longgar.', size: 76, delay: 4.6},
        {text: 'Ada saja yang kita tunggu.', size: 64, color: C.lamp, delay: 5.3},
      ]}
    />
  </Layer>
);

const SSibuk: React.FC = () => {
  const t = useT();
  return (
    <Layer id="sibuk" enter="push" exit="push">
      <Svg>
        <Battery x={CX} y={700 + float(t)} s={1.3} level={k(t, 22.5, 29.3, 1, 0.12, lin)} />
      </Svg>
      <Title a={22.7} b={25.4} top={1020} lines={[{text: 'Kita memang', size: 64, color: C.dim}, {text: 'sibuk.', size: 120, color: C.lamp, delay: 0.97}]} />
      <Title
        a={25.5}
        b={29.5}
        top={1000}
        lines={[
          {text: 'Capek.', size: 76, delay: 0.1},
          {text: 'Urusan rumah.', size: 76, delay: 1.5},
          {text: 'Pikiran soal besok.', size: 64, color: C.dim, delay: 2.8},
        ]}
      />
    </Layer>
  );
};

const SPulang: React.FC = () => {
  const t = useT();
  return (
    <Layer id="pulang" enter="push" exit="zoom">
      <Svg>
        <House x={CX} y={1250 + float(t, 4)} lit={k(t, CUES.PULANG2 - 0.1, CUES.PULANG2 + 0.5, 0, 1)} />
      </Svg>
      <Title a={31.1} b={33.45} top={1330} lines={[{text: 'Akhirnya pulang,', size: 88}, {text: 'baru sadar...', size: 64, color: C.dim, delay: 1.4}]} />
    </Layer>
  );
};

const SRumah: React.FC = () => {
  const t = useT();
  const tv = life(t, 35.9, 38.4, 0.4, 0.3);
  return (
    <Layer id="rumah" enter="zoom">
      {tv > 0 ? (
        <Svg style={{opacity: tv}}>
          <Tv x={720} y={1250} loud={k(t, CUES.KERAS - 0.3, CUES.KERAS + 0.2, 0, 1)} />
        </Svg>
      ) : null}
      <Title a={33.8} b={36.0} top={300} lines={[{text: 'Kok jalannya', size: 64, color: C.dim}, {text: 'lebih pelan?', size: 104, color: C.lamp, delay: 1.55}]} />
      <Title a={36.05} b={38.15} top={300} lines={[{text: 'Kok televisinya', size: 64, color: C.dim}, {text: 'keras banget?', size: 104, color: C.lamp, delay: 1.2}]} />
    </Layer>
  );
};

/** One parent carries rumah → cerita → dulu → ditanya; posture morphs now → memory → now. */
const ParentTrack: React.FC = () => {
  const t = useT();
  const o = Math.min(k(t, 33.3, 33.9, 0, 1), k(t, 57.9, 58.35, 1, 0, EASE.in));
  if (o <= 0) return null;
  const stoop = t < 50 ? k(t, 44.6, 46.6, 0.85, 0, EASE.inOut) : k(t, 52.2, 53.3, 0, 0.9, EASE.inOut);
  const x = t < 40 ? k(t, 33.6, 37.5, 300, 400, EASE.inOut) : t < 50 ? k(t, 44.6, 46.6, 400, 500, EASE.inOut) : k(t, 52.2, 53.3, 500, 360, EASE.inOut);
  const walk = Math.min(k(t, 33.6, 34.0, 0, 0.5), k(t, 37.1, 37.6, 0.5, 0));
  const glow = Math.min(k(t, 44.6, 46.6, 0, 0.8), k(t, 52.2, 53.3, 0.8, 0));
  return (
    <Svg style={{opacity: o}}>
      <line x1={100} y1={1250} x2={900} y2={1250} stroke={C.lineDim} strokeWidth={SW} strokeLinecap="round" />
      <Parent x={x} y={1250} stoop={stoop} walk={walk} glow={glow} mood={t < 44.6 ? 'neutral' : t < 52.2 ? 'smile' : 'tired'} />
    </Svg>
  );
};

const SCerita: React.FC = () => {
  const t = useT();
  const first = k(t, 39.1, 39.6, 0, 1, EASE.pop);
  const again = k(t, 41.2, 41.7, 0, 1, EASE.pop);
  return (
    <Layer id="cerita" enter="cut" exit="fade">
      <Svg>
        <g opacity={1 - 0.6 * k(t, 41.0, 41.4, 0, 1)}>
          <Bubble x={470} y={470 + float(t, 4)} w={380} side="l" p={first} lines={[280, 220, 250]} />
        </g>
        <Bubble x={470} y={250 + float(t, 4, 4, 0.3)} w={380} side="l" p={again} lines={[280, 220, 250]} accent />
      </Svg>
      <Title a={40.4} b={42.6} top={1340} lines={[{text: 'Sudah diceritakan.', size: 80}]} />
    </Layer>
  );
};

const SDulu: React.FC = () => (
  <Layer id="dulu">
    <Title a={43.6} b={45.7} top={300} lines={[{text: 'Rasanya aneh.', size: 96}]} />
    <Title
      a={45.9}
      b={51.7}
      top={240}
      lines={[
        {text: 'Masih seperti dulu.', size: 64, color: C.dim},
        {text: 'Masih kuat.', size: 104, color: C.lamp, delay: 1.9},
        {text: 'yang kita cari', size: 64, delay: 4.1},
      ]}
    />
  </Layer>
);

const SDitanya: React.FC = () => {
  const t = useT();
  return (
    <Layer id="ditanya">
      <Svg>
        <Bubble x={500} y={540 + float(t, 4)} w={360} side="l" p={k(t, 55.8, 56.3, 0, 1, EASE.pop)} lines={[240, 170]} accent />
      </Svg>
      <Title a={53.3} b={58.2} top={250} lines={[{text: 'Sekarang mereka juga', size: 56, color: C.dim}, {text: 'butuh ditanya.', size: 96, color: C.lamp, delay: 2.0}]} />
    </Layer>
  );
};

const STelepon: React.FC = () => {
  const t = useT();
  const talking = t >= CUES.LANGSUNG;
  return (
    <Layer id="telepon" enter="up">
      <Svg>
        <Phone x={CX} y={800 + float(t)} s={0.85} screen={talking ? 'talk' : 'call'} on={1} />
      </Svg>
      <Title a={59.0} b={61.85} top={1260} lines={[{text: 'Kepikiran mau telepon?', size: 56, color: C.dim}, {text: 'Coba langsung saja.', size: 88, color: C.lamp, delay: 1.6}]} />
      <Title a={61.9} b={63.65} top={1260} lines={[{text: 'Ngobrol sebentar', size: 88}, {text: 'juga boleh.', size: 64, color: C.dim, delay: 1.0}]} />
      <Title a={63.7} b={65.35} top={1260} lines={[{text: 'Tanya tadi makan apa.', size: 80}]} />
      <Title a={65.4} b={68.45} top={1260} lines={[{text: 'Dengar cerita', size: 96, color: C.lamp}, {text: 'yang mungkin sudah pernah kita dengar.', size: 56, color: C.dim, delay: 1.3}]} />
    </Layer>
  );
};

const STua: React.FC = () => {
  const t = useT();
  return (
    <Layer id="tua" enter="zoom">
      <Svg style={{scale: `${k(t, 72.0, 75.1, 1, 1.05, EASE.inOut)}`}}>
        <Hourglass x={CX} y={760 + float(t)} fallen={k(t, 68.45, 75.0, 0.6, 0.93, lin)} />
        <Parent x={770} y={1060} s={0.42} stoop={0.9} mood="tired" />
      </Svg>
      <Title a={68.9} b={71.85} top={1180} lines={[{text: 'Kita terus menunggu', size: 60, color: C.dim}, {text: 'waktu luang.', size: 96, delay: 2.0}]} />
      <Title a={72.0} b={AUDIO_SECONDS + 1} top={1180} lines={[{text: 'Sementara mereka...', size: 60, color: C.dim}, {text: 'terus bertambah tua.', size: 92, color: C.lamp, delay: 1.5}]} />
    </Layer>
  );
};

export const Video: React.FC<z.infer<typeof kitSchema>> = ({watermark, sfxVolume, showReview}) => (
  <AbsoluteFill style={{background: C.bg, overflow: 'hidden'}}>
    <Sky />
    <SNanti />
    <SMalam />
    <HourglassTrack />
    <SWaktu />
    <STunggu />
    <SSibuk />
    <SPulang />
    <SRumah />
    <ParentTrack />
    <SCerita />
    <SDulu />
    <SDitanya />
    <STelepon />
    <STua />
    <Watermark text={watermark} color={C.text} />
    <Audio src={staticFile('videos/orang-tua/narration.wav')} />
    {/* music.wav fades itself in; this ramp finishes the fade-out at the last frame. */}
    <Audio src={staticFile('videos/orang-tua/music.wav')} volume={(f) => MUSIC_VOLUME * k(f / FPS, AUDIO_SECONDS - 2.5, AUDIO_SECONDS, 1, 0, lin)} />
    <Sfx cues={SFX} volume={sfxVolume} />
    {showReview ? <ReviewOverlay /> : null}
  </AbsoluteFill>
);
