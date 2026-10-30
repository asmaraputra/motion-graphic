import {useId, type ReactNode} from 'react';
import {FONT} from './brand';
import {EASE, k, lerp, life, useT} from './motion';
import {WORKER_COLORS} from './worker';

/**
 * Papercut diorama kit (Kerangka A, SVG). Layered paper planes with soft drop shadows.
 * Mount <PaperDefs /> once per video; every piece below uses its shared filters/gradients.
 * Sets draw in 1080x1920 SVG units; origins are documented per component.
 * Preview: npx remotion studio src/videos/kit-papercut/entry.tsx
 */

/** Default palette: cool factory, dusk exterior, warm home. Override per video by spreading. */
export const PC = {
  ink: '#2B2230',
  paper: '#FFF4E2',
  paperDim: '#E9DCC6',
  // dusk exterior
  sky1: '#36365E',
  sky2: '#9A5F73',
  sun: '#F4A65C',
  hillA: '#6A5784',
  hillB: '#4C426B',
  hillC: '#332D4F',
  road: '#29243D',
  // factory
  fWall: '#34465A',
  fWall2: '#283749',
  fWin: '#4C6178',
  fFloor: '#1F2A38',
  metal: '#6F869C',
  metalDark: '#4E6377',
  glow: '#F2C230',
  wood: '#DDAA6B',
  woodDark: '#B98545',
  defect: '#E0563A',
  // home
  wall: '#7A4E42',
  wall2: '#5E3C35',
  floor: '#3A2826',
  lamp: '#FFD08A',
  sofa: '#3E7075',
  sofaDark: '#2E585C',
  rug: '#B8664A',
  door: '#4A302A',
  // family figures (original, not the Worker mascot)
  famDress: '#C9744E',
  famHair: '#2E2024',
  famSkin: '#C98F6A',
  famLegs: '#3A2A2E',
  kidShirt: '#E8B04B',
  /** Worker `colors={{boots: PC.socks}}` after taking shoes off. */
  socks: '#BDB4A6',
};

/** Paper drop shadow; use as `filter={PAPER}` on any SVG element or group. */
export const PAPER = 'url(#pc-paper)';
/** Dusk sky vertical gradient (sky1 → sky2 → sun). */
export const SKY = 'url(#pc-sky)';
/** Warm lamp radial glow. */
export const GLOW = 'url(#pc-glow)';

/** Shared filters and gradients; ids are document-wide. Mount once, before the scenes. */
export const PaperDefs: React.FC = () => (
  <svg width={0} height={0} style={{position: 'absolute'}}>
    <defs>
      <filter id="pc-paper" x="-20%" y="-20%" width="140%" height="150%">
        <feDropShadow dx="0" dy="9" stdDeviation="9" floodColor="#120A10" floodOpacity="0.38" />
      </filter>
      <linearGradient id="pc-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={PC.sky1} />
        <stop offset="0.75" stopColor={PC.sky2} />
        <stop offset="1" stopColor={PC.sun} />
      </linearGradient>
      <radialGradient id="pc-glow">
        <stop offset="0" stopColor={PC.lamp} stopOpacity={0.55} />
        <stop offset="1" stopColor={PC.lamp} stopOpacity={0} />
      </radialGradient>
      <filter id="pc-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" />
        <feColorMatrix values="0 0 0 0 0.5  0 0 0 0 0.45  0 0 0 0 0.4  0 0 0 0.9 0" />
      </filter>
    </defs>
  </svg>
);

/** Static paper fiber texture; mount above the scenes, below the watermark. */
export const PaperGrain: React.FC = () => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: 0.12, mixBlendMode: 'overlay', pointerEvents: 'none'}}>
    <rect width={1080} height={1920} filter="url(#pc-grain)" />
  </svg>
);

/** Slow sine float for living holds (px). */
export const float = (t: number, amp = 6, period = 4, phase = 0) => Math.sin((t / period + phase) * Math.PI * 2) * amp;

/** Pop-in scale for illustrations: EASE.pop overshoots 6.6%, inside the 8% limit. Not for text. */
export const popIn = (t: number, a: number) => k(t, a, a + 0.45, 0, 1, EASE.pop);

/* ---------- characters and speech ---------- */

export type FamMood = 'neutral' | 'happy' | 'curious' | 'concerned';

/** Original papercut family figure; feet at (x, y), about 410 px tall at s = 1. Blink and breathing built in. */
export const Family: React.FC<{x: number; y: number; s?: number; mood?: FamMood; talk?: boolean; shirt?: string; walk?: number}> = ({x, y, s = 1, mood = 'neutral', talk = false, shirt = PC.famDress, walk = 0}) => {
  const t = useT();
  const blink = (t + x / 270) % 4.1 < 0.12 ? 0.15 : 1;
  const breathe = Math.sin(t * 2.2 + x) * 3;
  const step = Math.sin(walk * Math.PI * 2) * 10;
  const brow = {neutral: [0, 0], happy: [-4, -4], curious: [-10, -2], concerned: [2, -8]}[mood];
  const mouthOpen = talk ? 4 + 5 * Math.abs(Math.sin(t * 13)) : 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={6} rx={78} ry={13} fill={PC.ink} opacity={0.16} />
      <rect x={-24} y={-112 - Math.max(0, step)} width={18} height={112} rx={8} fill={PC.famLegs} />
      <rect x={6} y={-112 - Math.max(0, -step)} width={18} height={112} rx={8} fill={PC.famLegs} />
      <g transform={`translate(0 ${breathe})`} filter={PAPER}>
        <path d="M-44 -292 Q 0 -306 44 -292 L 76 -100 Q 0 -86 -76 -100 Z" fill={shirt} />
        <path d="M-44 -280 Q -66 -220 -70 -150 M44 -280 Q 66 -220 70 -150" stroke={PC.famSkin} strokeWidth={22} strokeLinecap="round" fill="none" />
        <rect x={-14} y={-312} width={28} height={30} fill={PC.famSkin} />
        <g transform="translate(0 -350)">
          <circle r={58} fill={PC.famSkin} />
          <path d="M-62 4 Q -66 -66 0 -66 Q 66 -66 62 4 Q 40 -34 0 -38 Q -40 -34 -62 4 Z" fill={PC.famHair} />
          <circle cx={46} cy={-50} r={22} fill={PC.famHair} />
          <ellipse cx={-20} cy={4} rx={6.5} ry={8.5 * blink} fill={PC.ink} />
          <ellipse cx={20} cy={4} rx={6.5} ry={8.5 * blink} fill={PC.ink} />
          <path d={`M-32 ${-14 + brow[0]} L -10 ${-16 + brow[1]} M10 ${-16 + brow[1]} L 32 ${-14 + brow[0]}`} stroke={PC.ink} strokeWidth={5} strokeLinecap="round" />
          {mouthOpen > 0 ? (
            <ellipse cx={0} cy={28} rx={9} ry={mouthOpen} fill={PC.ink} />
          ) : (
            <path d={{neutral: 'M-12 26 Q 0 30 12 26', happy: 'M-16 22 Q 0 38 16 22', curious: 'M-8 28 Q 0 24 8 28', concerned: 'M-14 32 Q 0 24 14 32'}[mood]} stroke={PC.ink} strokeWidth={5} strokeLinecap="round" fill="none" />
          )}
          {mood === 'happy' ? (
            <>
              <circle cx={-36} cy={22} r={9} fill={PC.defect} opacity={0.3} />
              <circle cx={36} cy={22} r={9} fill={PC.defect} opacity={0.3} />
            </>
          ) : null}
        </g>
      </g>
    </g>
  );
};

/** Abstract speech lines for a Bubble (no transcript text). */
export const Lines: React.FC<{n: number; w: number}> = ({n, w}) => (
  <div style={{display: 'flex', flexDirection: 'column', gap: 14, padding: '6px 0'}}>
    {Array.from({length: n}, (_, i) => (
      <div key={i} style={{width: w * (i === n - 1 && n > 1 ? 0.6 : 1 - i * 0.08), height: 14, borderRadius: 7, background: PC.ink, opacity: 0.55}} />
    ))}
  </div>
);

/** Paper speech bubble in screen space (HTML); (x, y) = top-left, visible from a to b. No text overshoot. */
export const Bubble: React.FC<{a: number; b: number; x: number; y: number; tail?: 'left' | 'right'; maxW?: number; children: ReactNode}> = ({a, b, x, y, tail = 'left', maxW = 700, children}) => {
  const t = useT();
  const o = life(t, a, b, 0.3, 0.25);
  if (o <= 0) return null;
  const p = k(t, a, a + 0.4, 0, 1, EASE.out);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        maxWidth: maxW,
        opacity: o,
        translate: `0px ${(1 - p) * 24 + float(t, 4, 3.4, x / 900)}px`,
        scale: `${lerp(0.86, 1, p)}`,
        transformOrigin: tail === 'left' ? '15% 100%' : '85% 100%',
        background: PC.paper,
        boxSizing: 'border-box',
        color: PC.ink,
        borderRadius: 40,
        padding: '26px 38px',
        boxShadow: '0 8px 0 rgba(0,0,0,0.16), 0 16px 32px rgba(18,10,16,0.35)',
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: 56,
        lineHeight: 1.15,
        textWrap: 'balance',
      }}
    >
      {children}
      <div style={{position: 'absolute', bottom: -14, [tail]: 64, width: 34, height: 34, background: PC.paper, rotate: '45deg', borderRadius: 6}} />
    </div>
  );
};

/** Thought-cloud body (SVG ellipse); pair with PaperDot trail circles. */
export const Cloud: React.FC<{x?: number; y?: number; rx: number; ry: number}> = ({x = 0, y = 0, rx, ry}) => <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={PC.paper} filter={PAPER} />;
export const PaperDot: React.FC<{x: number; y: number; r: number}> = ({x, y, r}) => <circle cx={x} cy={y} r={r} fill={PC.paper} filter={PAPER} />;

/** Paper question mark; (x, y) = text baseline center. */
export const QuestionMark: React.FC<{x: number; y: number; rot?: number; sx?: number}> = ({x, y, rot = 0, sx = 1}) => (
  <text x={0} y={0} transform={`translate(${x} ${y}) rotate(${rot}) scale(${sx} 1)`} fontFamily={FONT} fontWeight={900} fontSize={110} fill={PC.paper} textAnchor="middle" filter={PAPER}>
    ?
  </text>
);

/* ---------- dusk exterior ---------- */

/** Layered hill strip; dx shifts it for parallax. */
export const Hills: React.FC<{y: number; dx?: number; color: string; amp?: number; seed?: number}> = ({y, dx = 0, color, amp = 60, seed = 0}) => {
  const pts = Array.from({length: 15}, (_, i) => {
    const x = -400 + i * 150;
    return `${x} ${y - amp * (0.5 + 0.5 * Math.sin(i * 1.3 + seed))}`;
  });
  return <path d={`M-400 1920 L${pts.join(' L')} L1700 1920 Z`} fill={color} transform={`translate(${dx} 0)`} filter={PAPER} />;
};

/** Full-frame dusk: sky, paper sun at `sun`, three hill layers (dx = parallax), optional dim veil. */
export const Dusk: React.FC<{sun: {x: number; y: number}; dx?: number; dim?: number}> = ({sun, dx = 0, dim = 0}) => {
  const t = useT();
  return (
    <>
      <rect width={1080} height={1920} fill={SKY} />
      <circle cx={sun.x} cy={sun.y} r={150} fill={PC.sun} opacity={0.22} />
      <circle cx={sun.x} cy={sun.y + float(t, 3, 5)} r={80} fill={PC.sun} filter={PAPER} />
      <Hills y={1180} dx={dx * 0.25} color={PC.hillA} amp={90} seed={1} />
      <Hills y={1320} dx={dx * 0.5} color={PC.hillB} amp={70} seed={3} />
      <Hills y={1460} dx={dx} color={PC.hillC} amp={40} seed={5} />
      {dim > 0 ? <rect width={1080} height={1920} fill={PC.sky1} opacity={dim} /> : null}
    </>
  );
};

/** House facade with an open, lit door. (x, y) = door threshold center; door is 180 wide, 410 tall. */
export const HouseFront: React.FC<{x?: number; y?: number}> = ({x = 780, y = 1560}) => (
  <g transform={`translate(${x - 780} ${y - 1560})`}>
    <g filter={PAPER}>
      <path d="M540 960 L 820 760 L 1120 960 Z" fill={PC.wall2} />
      <rect x={580} y={950} width={540} height={610} fill={PC.wall} />
    </g>
    <rect x={690} y={1150} width={180} height={410} rx={10} fill={PC.lamp} opacity={0.9} />
    <circle cx={780} cy={1330} r={320} fill={GLOW} />
    <path d="M690 1150 L 620 1170 L 620 1580 L 690 1560 Z" fill={PC.door} filter={PAPER} />
    <rect x={920} y={1040} width={120} height={120} rx={10} fill={PC.lamp} opacity={0.75} />
  </g>
);

/** Paper chair icon centered near the origin (about 140 x 180). */
export const Chair: React.FC = () => (
  <g>
    <rect x={-70} y={-90} width={30} height={170} rx={8} fill={PC.sofa} />
    <rect x={-70} y={-5} width={140} height={34} rx={10} fill={PC.sofaDark} />
    <rect x={-64} y={29} width={20} height={60} rx={6} fill={PC.sofa} />
    <rect x={44} y={29} width={20} height={60} rx={6} fill={PC.sofa} />
  </g>
);

/* ---------- factory ---------- */

/** Gear at the origin; wrap in a transform to place, scale, and rotate. tooth = [width, height, corner, overhang past r]. */
export const Gear: React.FC<{r: number; tooth?: readonly [number, number, number, number]; body?: string; teeth?: string; hub?: string}> = ({r, tooth = [24, 30, 5, 14], body = PC.metalDark, teeth = PC.metalDark, hub = PC.metal}) => (
  <>
    {Array.from({length: 8}, (_, i) => (
      <rect key={i} x={-tooth[0] / 2} y={-r - tooth[3]} width={tooth[0]} height={tooth[1]} rx={tooth[2]} fill={teeth} transform={`rotate(${i * 45})`} />
    ))}
    <circle r={r} fill={body} />
    <circle r={r * 0.35} fill={hub} />
  </>
);

/** Full-frame factory backdrop: back wall, paper wall panel, three windows, top beam. */
export const FactoryBack: React.FC = () => (
  <>
    <rect width={1080} height={1920} fill={PC.fWall2} />
    <rect x={0} y={300} width={1080} height={900} fill={PC.fWall} filter={PAPER} />
    {[120, 420, 720].map((x) => (
      <rect key={x} x={x} y={420} width={240} height={300} rx={14} fill={PC.fWin} opacity={0.8} />
    ))}
    <path d="M0 300 L 1080 300 L 1080 340 L 0 340 Z" fill={PC.metalDark} />
  </>
);

/** Press machine at the left edge (x 20-300, y 760-1190) with blinking light and two meshed gears; rot in degrees. */
export const PressMachine: React.FC<{rot: number}> = ({rot}) => {
  const t = useT();
  return (
    <>
      <g filter={PAPER}>
        <rect x={20} y={760} width={280} height={430} rx={18} fill={PC.metal} />
        <rect x={50} y={800} width={220} height={90} rx={10} fill={PC.metalDark} />
        <circle cx={90} cy={845} r={14} fill={PC.glow} opacity={0.6 + 0.4 * Math.sin(t * 3)} />
      </g>
      {[
        {x: 150, y: 1010, r: 70, s: 1},
        {x: 250, y: 930, r: 45, s: -1.55},
      ].map((g) => (
        <g key={g.x} transform={`translate(${g.x} ${g.y}) rotate(${rot * g.s})`}>
          <Gear r={g.r} />
        </g>
      ))}
    </>
  );
};

/** Conveyor belt whose top runs at y + 50; off = travel in px (moves rollers). Children (sheets) draw between belt and base. */
export const Conveyor: React.FC<{y: number; off: number; children?: ReactNode}> = ({y, off, children}) => (
  <>
    <rect x={-20} y={y + 50} width={1120} height={46} rx={20} fill={PC.ink} />
    {Array.from({length: 14}, (_, i) => (
      <circle key={i} cx={((i * 90 + off) % 1260) - 90} cy={y + 73} r={12} fill={PC.metal} />
    ))}
    {children}
    <rect x={-20} y={y + 96} width={1120} height={420} fill={PC.metalDark} filter={PAPER} />
    <rect x={-20} y={y + 96} width={1120} height={16} fill={PC.metal} />
  </>
);

/** Plywood sheet (300 x 50) with its top-left at (x, y); defect = red knot at the center (x + 170). */
export const PlySheet: React.FC<{x: number; y: number; defect?: boolean}> = ({x, y, defect = false}) => (
  <g transform={`translate(${x} ${y})`} filter={PAPER}>
    <path d="M30 0 L 300 0 L 270 50 L 0 50 Z" fill={PC.wood} />
    <path d="M30 0 L 300 0 L 296 8 L 26 8 Z" fill={PC.woodDark} opacity={0.6} />
    <path d="M60 22 Q 140 14 230 26 M50 36 Q 150 30 240 40" stroke={PC.woodDark} strokeWidth={3} fill="none" />
    {defect ? <ellipse cx={170} cy={28} rx={14} ry={7} fill={PC.defect} /> : null}
  </g>
);

/** Highlight ring around a detail; s = 0..1 pop scale. */
export const FocusRing: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => {
  const t = useT();
  if (s <= 0) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle r={52} stroke={PC.glow} strokeWidth={8} fill="none" />
      <circle r={70 + float(t, 4, 1.2)} stroke={PC.glow} strokeWidth={3} fill="none" opacity={0.5} />
    </g>
  );
};

/** Three looping sound/calm rings from (x, y) starting at t0; fade (0..1) multiplies opacity. */
export const Ripples: React.FC<{x: number; y: number; t0: number; period: number; gap: number; r0: number; dr: number; width: number; alpha: number; fade?: number}> = ({x, y, t0, period, gap, r0, dr, width, alpha, fade = 1}) => {
  const t = useT();
  return (
    <>
      {[0, 1, 2].map((i) => {
        const u = ((t - t0 + i * gap) % period) / period;
        return <circle key={i} cx={x} cy={y} r={r0 + u * dr} stroke={PC.paper} strokeWidth={width} fill="none" opacity={alpha * (1 - u) * fade} />;
      })}
    </>
  );
};

/* ---------- home ---------- */

/** Room walls and floor in world units; extends past the frame for camera moves. Floor starts at floorY. */
export const RoomShell: React.FC<{floorY?: number}> = ({floorY = 1560}) => (
  <>
    <rect x={-500} y={-200} width={2100} height={2700} fill={PC.wall} />
    <rect x={-500} y={floorY - 310} width={2100} height={310} fill={PC.wall2} />
    <rect x={-500} y={floorY} width={2100} height={900} fill={PC.floor} />
  </>
);

export const Rug: React.FC<{x: number; y: number; rx?: number; ry?: number}> = ({x, y, rx = 420, ry = 70}) => <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={PC.rug} filter={PAPER} />;

/** Window (260 x 300) showing dusk; (x, y) = top-left of the glass, sunY = sun center from the glass top. */
export const DuskWindow: React.FC<{x: number; y: number; sunY: number}> = ({x, y, sunY}) => {
  const clip = `pc-win-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  return (
    <g transform={`translate(${x} ${y})`}>
      <defs>
        <clipPath id={clip}>
          <rect width={260} height={300} rx={12} />
        </clipPath>
      </defs>
      <g filter={PAPER}>
        <rect x={-12} y={-12} width={284} height={324} rx={16} fill={PC.door} />
      </g>
      <g clipPath={`url(#${clip})`}>
        <rect width={260} height={300} fill={SKY} />
        <circle cx={180} cy={sunY} r={48} fill={PC.sun} />
        <path d="M0 260 Q 80 220 160 250 T 260 240 L 260 300 L 0 300 Z" fill={PC.hillC} />
      </g>
      <rect x={126} width={8} height={300} fill={PC.door} />
    </g>
  );
};

/** Inside door (210 x 500) with knob and shoe mat; (x, y) = bottom-left on the floor line. */
export const Door: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x} ${y})`}>
    <rect y={-500} width={210} height={500} rx={8} fill={PC.door} filter={PAPER} />
    <circle cx={180} cy={-240} r={10} fill={PC.lamp} />
    <rect x={10} y={-12} width={220} height={20} rx={8} fill={PC.rug} />
  </g>
);

/** Pair of work boots standing on (x, y); s = pop scale. */
export const Boots: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) =>
  s > 0 ? (
    <g transform={`translate(${x} ${y}) scale(${s})`} filter={PAPER}>
      <rect x={-60} y={-30} width={50} height={30} rx={12} fill={WORKER_COLORS.boots} />
      <rect x={4} y={-30} width={50} height={30} rx={12} fill={WORKER_COLORS.boots} />
    </g>
  ) : null;

/** Hanging lamp; (x, y) = shade rim center. glow = 0..1 warm light. */
export const HangingLamp: React.FC<{x: number; y: number; glow?: number}> = ({x, y, glow = 0.55}) => (
  <>
    <path d={`M${x} ${y - 970} L ${x} ${y - 70}`} stroke={PC.ink} strokeWidth={4} />
    <circle cx={x} cy={y + 20} r={460} fill={GLOW} opacity={glow} />
    <path d={`M${x - 80} ${y} Q ${x} ${y - 90} ${x + 80} ${y} Z`} fill={PC.lamp} filter={PAPER} />
  </>
);

/**
 * Sofa in two layers so characters sit between them: <SofaBack/>, seated figures at y + SOFA_SEAT, <SofaFront/>,
 * then <SeatedLegs/> for each sitter. (x, y) = front center on the floor; 560 wide.
 */
export const SOFA_SEAT = -20;
export const SofaBack: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g filter={PAPER}>
    <rect x={x - 260} y={y - 330} width={520} height={190} rx={40} fill={PC.sofa} />
    <rect x={x - 270} y={y - 190} width={540} height={70} rx={24} fill={PC.sofaDark} />
  </g>
);
export const SofaFront: React.FC<{x: number; y: number}> = ({x, y}) => <rect x={x - 280} y={y - 140} width={560} height={140} rx={24} fill={PC.sofa} filter={PAPER} />;

/** Lap and feet over SofaFront for a seated Worker (w) or Family figure (f); x = sitter center, y = sofa floor y. */
export const SeatedLegs: React.FC<{x: number; y: number; who: 'worker' | 'family'; feet?: string}> = ({x, y, who, feet}) =>
  who === 'worker' ? (
    <>
      <rect x={x - 66} y={y - 172} width={132} height={44} rx={18} fill={WORKER_COLORS.pants} />
      <ellipse cx={x - 26} cy={y + 12} rx={26} ry={12} fill={feet ?? PC.socks} />
      <ellipse cx={x + 26} cy={y + 12} rx={26} ry={12} fill={feet ?? PC.socks} />
    </>
  ) : (
    <>
      <rect x={x - 62} y={y - 160} width={124} height={40} rx={18} fill={PC.famLegs} />
      <ellipse cx={x - 18} cy={y + 12} rx={20} ry={10} fill={feet ?? PC.famLegs} />
      <ellipse cx={x + 18} cy={y + 12} rx={20} ry={10} fill={feet ?? PC.famLegs} />
    </>
  );

/** Child's paper drawing (sun over a hill), centered at (x, y). */
export const KidDrawing: React.FC<{x: number; y: number; rot?: number}> = ({x, y, rot = -8}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`} filter={PAPER}>
    <rect x={-50} y={-40} width={100} height={80} rx={6} fill={PC.paper} />
    <circle cx={-14} cy={-6} r={16} fill={PC.sun} />
    <path d="M-40 24 Q 0 4 40 24" stroke={PC.sofa} strokeWidth={6} fill="none" />
  </g>
);
