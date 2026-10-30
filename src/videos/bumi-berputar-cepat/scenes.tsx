import {M, SERIF, TX, Arrow, Flash, Write, dash, fade, fmt, run, thereBack, track} from '../../kit/animate-math';
import {CUES as C, SUBS, scene} from './timeline';
import {ORBIT, ROOF_MOON, globeAt, moonAngle, moonAt, roofMoon, spinAt} from './world';

const W = 1080;
const H = 1920;
const TOP = 330; // first formula line
const TOP2 = 450; // second line
const HORIZON = 1180;

/** SVG path of an arc sampled from angle a0 to a1 (radians, screen coordinates). */
const arcD = (cx: number, cy: number, r: number, a0: number, a1: number) =>
  Array.from({length: 65}, (_, i) => {
    const a = a0 + ((a1 - a0) * i) / 64;
    return `${i ? 'L' : 'M'} ${cx + r * Math.cos(a)} ${cy + r * Math.sin(a)}`;
  }).join(' ');

/** Visible window of a scene, with a short fade at both ends. */
const inScene = (t: number, id: Parameters<typeof scene>[0], fin = 0.4, fout = 0.3) => {
  const s = scene(id);
  return fade(t, s.a, s.b, fin, fout);
};

const Moon: React.FC<{x: number; y: number; o: number; r?: number}> = ({x, y, o, r = 34}) =>
  o > 0 ? (
    <g opacity={o}>
      <circle cx={x} cy={y} r={r} fill={M.yellow} fillOpacity={0.3} stroke={M.yellow} strokeWidth={4} />
      <circle cx={x - r * 0.3} cy={y - r * 0.2} r={r * 0.18} fill="none" stroke={M.yellow} strokeWidth={2} opacity={0.6} />
    </g>
  ) : null;

/** Point on the side-view equator: longitude 0 faces the viewer; east is to the right. */
const surface = (t: number, lon: number) => {
  const {cx, cy, r} = globeAt(t);
  const l = spinAt(t) + lon;
  return {x: cx + r * Math.sin(l), y: cy, front: Math.cos(l) > 0};
};

// ---------- 0 - 15.2 s: hook, comment, formula ----------

const Hook: React.FC<{t: number}> = ({t}) => {
  const s = scene('hook');
  if (t > s.b) return null;
  const q = fade(t, C.MOON_Q, s.b, 0.4);
  return (
    <>
      <Write t={t} a={1.2} b={s.b} y={TOP} x={TX} size={96} segs={[{s: 'v', c: M.red, it: true}, ' > ', {s: '1.000 km/jam', c: M.red}]} />
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        <g opacity={q}>
          <Arrow x1={790} y1={590} x2={790 + 120 * run(t, 4.2, 0.8)} y2={590} c={M.yellow} p={run(t, 4.2, 0.8)} />
        </g>
      </svg>
      <Write t={t} a={C.MOON_Q} b={s.b} x={800} y={680} size={60} segs={{s: 'lewat?', c: M.yellow, it: true}} />
    </>
  );
};

const Comment: React.FC<{t: number}> = ({t}) => {
  const s = scene('comment');
  if (t < s.a || t > s.b) return null;
  const o = fade(t, 6.0, s.b, 0.45);
  const pop = 0.92 + 0.08 * run(t, 6.0, 0.5) + 0.02 * thereBack((t - 6.3) / 0.5);
  const check = run(t, C.BENAR, 0.6);
  return (
    <>
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        <g opacity={o} transform={`translate(500 470) scale(${pop}) translate(-500 -470)`}>
          <path
            d="M 170 300 H 830 Q 860 300 860 330 V 610 Q 860 640 830 640 H 560 L 500 720 L 470 640 H 170 Q 140 640 140 610 V 330 Q 140 300 170 300 Z"
            fill={M.greyD}
            fillOpacity={0.35}
            stroke={M.grey}
            strokeWidth={3}
            {...dash(run(t, 6.0, 0.7))}
          />
          <circle cx={210} cy={360} r={22} fill="none" stroke={M.greyC} strokeWidth={3} />
          <line x1={250} y1={352} x2={420} y2={352} stroke={M.greyC} strokeWidth={6} strokeLinecap="round" />
          <line x1={250} y1={372} x2={350} y2={372} stroke={M.greyD} strokeWidth={6} strokeLinecap="round" />
        </g>
        {check > 0 ? (
          <path d="M 700 1060 L 750 1110 L 850 990" fill="none" stroke={M.white} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" opacity={o} {...dash(check)} />
        ) : null}
      </svg>
      <Write t={t} a={C.QUOTE} b={s.b} x={500} y={500} size={64} maxW={640} it segs="Tapi kan Bumi berputar cepat!" />
    </>
  );
};

const Formula: React.FC<{t: number}> = ({t}) => {
  const s = scene('formula');
  if (t < s.a || t > s.b) return null;
  return (
    <>
      <Write
        t={t}
        a={C.ANGKA}
        b={s.b}
        x={TX}
        y={TOP}
        size={110}
        segs={[{s: 'v', c: M.red, it: true}, ' = ', {s: 's', c: M.teal, it: true}, ' / ', {s: 't', c: M.green, it: true}]}
      />
      <Write t={t} a={13.2} b={s.b} x={TX} y={TOP2 + 20} size={56} segs={[{s: 'kecepatan', c: M.red}, ' = ', {s: 'jarak', c: M.teal}, ' / ', {s: 'waktu', c: M.green}]} />
    </>
  );
};

// ---------- 15.2 - 42.4 s: globe, one day, equator, size ----------

const GlobeScene: React.FC<{t: number}> = ({t}) => {
  const s = scene('globe');
  if (t < s.a || t > s.b) return null;
  const o = fade(t, C.KITA, s.b, 0.4);
  const home = surface(t, -0.5);
  const dir = run(t, C.BARAT, 0.8);
  return (
    <>
      <Write t={t} a={C.GLOBE} b={s.b} x={TX} y={TOP} size={80} segs="globe yang diputar" />
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        {home.front ? (
          <g opacity={o}>
            <circle cx={home.x} cy={home.y} r={14} fill={M.white} />
            <circle cx={home.x} cy={home.y} r={26} fill="none" stroke={M.white} strokeWidth={2} opacity={0.6} />
          </g>
        ) : null}
        <Arrow x1={260} y1={1190} x2={740} y2={1190} c={M.white} p={dir} />
      </svg>
      <Write t={t} a={C.KITA} b={s.b} x={TX} y={TOP2} size={56} color={M.greyC} it segs="kita ikut bergerak" />
      <Write t={t} a={C.BARAT} b={s.b} x={200} y={1260} size={56} align="left" segs="barat" />
      <Write t={t} a={23.0} b={s.b} x={800} y={1260} size={56} align="right" segs="timur" />
    </>
  );
};

const Day: React.FC<{t: number}> = ({t}) => {
  const s = scene('day');
  if (t < s.a || t > s.b) return null;
  const hours = 24 * run(t, C.PUTARAN, 3);
  return (
    <>
      <Write t={t} a={23.8} b={s.b} x={TX} y={TOP} size={84} segs={['1 putaran ≈ ', {s: '24 jam', c: M.green}]} />
      <Write t={t} a={24.1} b={s.b} d={0.5} x={TX} y={1240} size={64} segs={[{s: 't', c: M.green, it: true}, ` = ${fmt(hours, 1)} jam`]} />
    </>
  );
};

const Equator: React.FC<{t: number}> = ({t}) => {
  const s = scene('equator');
  if (t < s.a || t > s.b) return null;
  const {cx, cy, r} = globeAt(t);
  const line = run(t, C.KHATULISTIWA, 0.9);
  const o = fade(t, s.a, s.b);
  const ping = 1 + 0.03 * thereBack((t - C.NGEBUT) / 0.6);
  return (
    <>
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke={M.white} strokeWidth={6} opacity={o} {...dash(line)} />
        <g opacity={o}>
          <Arrow x1={cx - 140} y1={cy + 44} x2={cx + 140} y2={cy + 44} c={M.red} p={run(t, C.V1670, 0.8)} w={6} />
        </g>
      </svg>
      <Write t={t} a={C.KHATULISTIWA} b={s.b} x={TX} y={1200} size={58} color={M.greyC} it segs="khatulistiwa" />
      <Write t={t} a={C.V1670} b={s.b} x={TX} y={TOP} size={92} scale={ping} segs={[{s: 'v', c: M.red, it: true}, ' ≈ ', {s: '1.670 km/jam', c: M.red}]} />
      <Write t={t} a={C.NGEBUT} b={s.b} x={TX} y={TOP2 + 10} size={60} color={M.greyC} it segs="ngebut?" />
    </>
  );
};

const Big: React.FC<{t: number}> = ({t}) => {
  const s = scene('big');
  if (t < s.a || t > s.b) return null;
  const {cx, cy, r} = globeAt(t);
  const o = fade(t, s.a, s.b);
  const radius = run(t, C.BESAR, 0.8);
  const ring = run(t, C.LINTASAN, 1);
  const a = -spinAt(t) - Math.PI / 2;
  return (
    <>
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        <g opacity={o}>
          <line x1={cx} y1={cy} x2={cx + r * radius} y2={cy} stroke={M.white} strokeWidth={4} />
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={M.teal} strokeWidth={8} {...dash(ring)} />
          <circle cx={cx + r * Math.cos(a)} cy={cy + r * Math.sin(a)} r={14} fill={M.white} opacity={run(t, 37.4, 0.4)} />
        </g>
      </svg>
      <Write t={t} a={36.4} b={s.b} x={cx + r / 2} y={cy - 40} size={60} it segs="r" />
      <Write t={t} a={C.BESAR} b={s.b} x={TX} y={TOP} size={84} segs="Bumi besar sekali" />
      <Write t={t} a={C.LINTASAN} b={s.b} x={TX} y={TOP2} size={60} segs={[{s: 'lintasan', c: M.teal}, ' sangat panjang']} />
    </>
  );
};

// ---------- 42.4 - 64.55 s: wheels, back to Earth, one minute ----------

/** Small wheel beside the polar Earth, which plays the big wheel. */
const SmallWheel: React.FC<{cx: number; cy: number; r: number; spin: number; o: number}> = ({cx, cy, r, spin, o}) => (
  <g opacity={o} stroke={M.grey} fill="none">
    <circle cx={cx} cy={cy} r={r} fill={M.pi} fillOpacity={0.3} strokeWidth={3} />
    {Array.from({length: 8}, (_, k) => {
      const a = -spin + (k * Math.PI) / 4;
      return <line key={k} x1={cx} y1={cy} x2={cx + r * Math.cos(a)} y2={cy + r * Math.sin(a)} strokeWidth={2} opacity={0.55} />;
    })}
  </g>
);

/** Rim point plus the teal distance it has covered since the shared turn began. */
const RimTrace: React.FC<{t: number; cx: number; cy: number; r: number; o: number}> = ({t, cx, cy, r, o}) => {
  const a0 = -spinAt(C.BERPUTAR) - Math.PI / 2;
  const a = -spinAt(t) - Math.PI / 2;
  const swept = t > C.BERPUTAR ? Math.min(a0 - a, 2 * Math.PI) : 0;
  return (
    <g opacity={o}>
      {swept > 0.01 ? <path d={arcD(cx, cy, r, a0, a0 - swept)} fill="none" stroke={M.teal} strokeWidth={9} strokeLinecap="round" /> : null}
      <circle cx={cx + r * Math.cos(a)} cy={cy + r * Math.sin(a)} r={13} fill={M.white} />
    </g>
  );
};

const Wheels: React.FC<{t: number}> = ({t}) => {
  const s = scene('wheels');
  if (t < s.a || t > s.b) return null;
  const {cx, cy, r} = globeAt(t);
  const o = inScene(t, 'wheels', 0.6);
  const small = {cx: 210, cy: cy + r - 90, r: 90};
  const far = 1 + 0.03 * thereBack((t - C.JAUH) / 0.6);
  return (
    <>
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        <SmallWheel {...small} spin={spinAt(t)} o={run(t, C.RODA_KECIL - 0.2, 0.5) * o} />
        <line x1={100} y1={cy + r} x2={900} y2={cy + r} stroke={M.greyD} strokeWidth={3} opacity={o} />
        <RimTrace t={t} {...small} o={run(t, C.RODA_KECIL, 0.4) * o} />
        <RimTrace t={t} cx={cx} cy={cy} r={r} o={run(t, C.RODA_BESAR, 0.4) * o} />
      </svg>
      <Write t={t} a={C.RODA_KECIL} b={s.b} x={small.cx} y={cy + r + 60} size={46} color={M.greyC} it segs="roda kecil" />
      <Write t={t} a={C.RODA_BESAR} b={s.b} x={cx} y={cy + r + 60} size={46} color={M.greyC} it segs="roda besar" />
      <Write t={t} a={C.BERPUTAR} b={s.b} x={TX} y={TOP} size={84} segs={['1 putaran, ', {s: 'waktu sama', c: M.green}]} />
      <Write t={t} a={C.TITIK} b={s.b} x={TX} y={TOP2} size={64} scale={far} segs={[{s: 's', c: M.teal, it: true}, ' = 2π', {s: 'r', it: true}, ': ', {s: 'lebih jauh', c: M.teal}]} />
    </>
  );
};

const EarthAgain: React.FC<{t: number}> = ({t}) => {
  const s = scene('earth');
  if (t < s.a || t > s.b) return null;
  const {cx, cy, r} = globeAt(t);
  const o = inScene(t, 'earth', 0.6);
  return (
    <>
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={M.teal} strokeWidth={8} opacity={o} {...dash(run(t, 51.3, 1))} />
      </svg>
      <Write
        t={t}
        a={51.3}
        b={s.b}
        x={TX}
        y={TOP}
        size={100}
        segs={[{s: 'v', c: M.red, it: true}, ' = ', {s: 's', c: M.teal, it: true}, ' / ', {s: 't', c: M.green, it: true}]}
      />
      <Write t={t} a={C.ANGKA_KMJ} b={s.b} x={TX} y={TOP2} size={60} segs={[{s: 'km/jam', c: M.red}, ' besar']} />
      <Write t={t} a={C.SEHARI} b={s.b} x={TX} y={1250} size={60} segs={['1 putaran ≈ ', {s: 'sehari', c: M.green}]} />
    </>
  );
};

const Degree: React.FC<{t: number}> = ({t}) => {
  const s = scene('degree');
  if (t < s.a || t > s.b) return null;
  const {cx, cy, r} = globeAt(t);
  const o = inScene(t, 'degree', 0.6);
  const view = (u: number) => -spinAt(u) - Math.PI / 2;
  const a = view(t);
  const a0 = view(C.ARAH);
  const ray = run(t, C.ARAH, 0.7);
  const deg = track(t, C.MENIT, C.SEPEREMPAT + 0.8, 0, 0.25);
  const ox = cx + r * Math.cos(a);
  const oy = cy + r * Math.sin(a);
  return (
    <>
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        <g opacity={o}>
          <circle cx={ox} cy={oy} r={11} fill={M.white} opacity={run(t, 58.7, 0.4)} />
          {t > C.ARAH ? <line x1={cx + r * Math.cos(a0)} y1={cy + r * Math.sin(a0)} x2={cx + (r + 260) * Math.cos(a0)} y2={cy + (r + 260) * Math.sin(a0)} stroke={M.greyD} strokeWidth={3} strokeDasharray="10 10" /> : null}
          <Arrow x1={ox} y1={oy} x2={cx + (r + 260) * Math.cos(a)} y2={cy + (r + 260) * Math.sin(a)} c={M.blue} p={ray} />
          {t > C.SEDIKIT ? <path d={arcD(cx, cy, r + 200, a0, a)} fill="none" stroke={M.blue} strokeWidth={5} opacity={run(t, C.SEDIKIT, 0.5)} /> : null}
        </g>
      </svg>
      <Write t={t} a={57.8} b={s.b} x={TX} y={TOP} size={84} segs={[{s: '1 menit', c: M.green}, ' → ', {s: `${fmt(deg, 2)}°`, c: M.blue}]} />
      <Write t={t} a={C.SEPEREMPAT} b={s.b} x={TX} y={TOP2} size={56} color={M.greyC} segs={['360° / 1.440 menit ≈ ', {s: '0,25°', c: M.blue}]} />
      <Write t={t} a={C.ARAH} b={s.b} x={TX} y={920} size={50} color={M.blue} it segs="arah pandang" />
      <Write t={t} a={62.2} b={s.b} x={860} y={560} size={32} align="right" color={M.greyC} it segs="(sudut diperbesar)" />
    </>
  );
};

// ---------- 64.55 - 89.55 s: sky, satellite, orbit ----------

const Sky: React.FC<{t: number}> = ({t}) => {
  const s = scene('sky');
  if (t < s.a || t > s.b) return null;
  const o = inScene(t, 'sky', 0.8);
  const trail = Array.from({length: 8}, (_, i) => 65.5 + i).filter((u) => u < t - 0.4);
  const sun = {x: track(t, C.MATAHARI, s.b, 780, 830), y: track(t, C.MATAHARI, s.b, 1010, 930)};
  return (
    <>
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        <g opacity={o}>
          {trail.map((u) => {
            const p = moonAt(u);
            return <circle key={u} cx={p.x} cy={p.y} r={6} fill={M.yellow} opacity={0.35} />;
          })}
          <g opacity={run(t, C.MATAHARI, 0.6)}>
            <circle cx={sun.x} cy={sun.y} r={46} fill={M.orange} fillOpacity={0.3} stroke={M.orange} strokeWidth={4} />
          </g>
        </g>
      </svg>
      <Write t={t} a={C.BULAN_GESER} b={s.b} x={TX} y={TOP} size={80} segs={[{s: 'Bulan', c: M.yellow}, ' bergeser bertahap']} />
      <Write t={t} a={C.MATAHARI} b={s.b} x={TX} y={TOP2} size={60} segs={['mirip ', {s: 'Matahari', c: M.orange}, ': ', {s: 'berjam-jam', c: M.green}]} />
    </>
  );
};

const Satellite: React.FC<{t: number}> = ({t}) => {
  const s = scene('satellite');
  if (t < s.a || t > s.b) return null;
  const m = moonAt(t);
  const pull = run(t, C.GRAVITASI, 0.7);
  const k = 1 - (ORBIT.r * 0.45) / Math.hypot(m.x - ORBIT.cx, m.y - ORBIT.cy);
  return (
    <>
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        <circle cx={ORBIT.cx} cy={ORBIT.cy} r={ORBIT.r} fill="none" stroke={M.greyC} strokeWidth={3} strokeDasharray="12 12" {...{opacity: inScene(t, 'satellite')}} />
        <g opacity={inScene(t, 'satellite')}>
          <Arrow x1={m.x} y1={m.y} x2={m.x + (ORBIT.cx - m.x) * k} y2={m.y + (ORBIT.cy - m.y) * k} c={M.white} p={pull} />
        </g>
      </svg>
      <Write t={t} a={74.1} b={s.b} x={TX} y={TOP} size={80} segs={[{s: 'Bulan', c: M.yellow}, ' = satelit Bumi?']} />
      <Write t={t} a={C.GRAVITASI} b={s.b} x={TX} y={TOP2} size={56} color={M.greyC} it segs="tarikan gravitasi" />
    </>
  );
};

const Orbit: React.FC<{t: number}> = ({t}) => {
  const s = scene('orbit');
  if (t < s.a || t > s.b) return null;
  const {cx, cy, r} = globeAt(t);
  const o = inScene(t, 'orbit', 0.3);
  const a0 = moonAngle(85.4);
  const a = moonAngle(t);
  const home = -spinAt(t) - Math.PI / 2;
  return (
    <>
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        <g opacity={o}>
          <circle cx={ORBIT.cx} cy={ORBIT.cy} r={ORBIT.r} fill="none" stroke={M.greyC} strokeWidth={3} strokeDasharray="12 12" />
          <circle cx={cx + r * Math.cos(home)} cy={cy + r * Math.sin(home)} r={10} fill={M.white} opacity={run(t, C.ARTINYA, 0.4)} />
          {t > 85.4 ? <path d={arcD(ORBIT.cx, ORBIT.cy, ORBIT.r, a0, a)} fill="none" stroke={M.gold} strokeWidth={9} strokeLinecap="round" /> : null}
        </g>
      </svg>
      <Write t={t} a={C.HARI27 - 0.2} b={s.b} x={TX} y={TOP} size={84} segs={['1 orbit ≈ ', {s: '27 hari', c: M.gold}]} />
      <Write t={t} a={C.ARTINYA} b={s.b} x={TX} y={TOP2} size={56} segs={['Bumi 1 putaran → Bulan ', {s: '1/27', c: M.gold}, ' orbit']} />
    </>
  );
};

// ---------- 89.55 - 116.5 s: glance, roof test, closing ----------

const House: React.FC<{o: number}> = ({o}) => (
  <g opacity={o} stroke={M.grey} strokeWidth={4} strokeLinejoin="round" fill={M.greyD} fillOpacity={0.3}>
    <path d={`M 360 ${HORIZON} V 1030 L 470 930 L 580 1030 V ${HORIZON} Z`} />
    <rect x={440} y={1090} width={60} height={90} fill="none" />
  </g>
);
export const ROOF_TIP = {x: 470, y: 930};

const Glance: React.FC<{t: number}> = ({t}) => {
  const s = scene('glance');
  if (t < s.a || t > s.b) return null;
  return (
    <>
      <Write t={t} a={C.BERGESER} b={s.b} x={TX} y={TOP} size={80} segs={[{s: 'Bulan', c: M.yellow}, ' memang bergeser']} />
      <Write t={t} a={93} b={s.b} x={TX} y={TOP2} size={56} color={M.greyC} it segs="sekilas: tampak diam" />
    </>
  );
};

const Roof: React.FC<{t: number}> = ({t}) => {
  const s = scene('roof');
  if (t < s.a || t > s.b) return null;
  const o = inScene(t, 'roof', 0.5);
  const m = roofMoon(t);
  const ghost = run(t, C.SETELAH, 0.5);
  const moved = run(t, C.PINDAH - 0.25, 0.8);
  return (
    <>
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        <House o={run(t, 96, 0.8) * o} />
        <g opacity={o}>
          <line x1={ROOF_TIP.x} y1={ROOF_TIP.y} x2={ROOF_MOON.x} y2={ROOF_MOON.y} stroke={M.greyC} strokeWidth={3} strokeDasharray="8 10" opacity={run(t, C.ATAP, 0.6)} />
          <circle cx={ROOF_MOON.x} cy={ROOF_MOON.y} r={34} fill="none" stroke={M.yellow} strokeWidth={3} strokeDasharray="8 8" opacity={ghost * 0.7} />
          <Arrow x1={ROOF_MOON.x + 30} y1={ROOF_MOON.y - 24} x2={m.x - 34} y2={m.y + 26} c={M.yellow} p={moved} />
          <Flash x={m.x} y={m.y} u={(t - C.PINDAH - 0.2) / 0.45} r={60} />
        </g>
      </svg>
      <Write t={t} a={C.ATAP - 0.3} b={102.9} x={TX} y={TOP} size={80} segs={['patokan: ujung atap']} />
      <Write t={t} a={C.SETELAH} b={104.9} x={TX} y={TOP2} size={56} color={M.greyC} it segs="tempat sama, beberapa waktu kemudian" maxW={800} />
      <Write t={t} a={C.PINDAH - 0.1} b={s.b} x={TX} y={TOP} size={84} segs={[{s: 'Bulan', c: M.yellow}, ' sudah pindah']} />
      <Write t={t} a={C.PENGARUH} b={s.b} x={TX} y={TOP2} size={56} segs="pengaruhnya kelihatan" />
    </>
  );
};

const Closing: React.FC<{t: number}> = ({t}) => {
  const s = scene('closing');
  if (t < s.a) return null;
  const o = fade(t, 111.2, s.b + 1, 0.5);
  const ask = 1 + 0.03 * thereBack((t - C.NEXT - 0.3) / 0.6);
  return (
    <>
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        <path
          d="M 150 1150 H 850 Q 880 1150 880 1180 V 1290 Q 880 1320 850 1320 H 560 L 500 1380 L 470 1320 H 150 Q 120 1320 120 1290 V 1180 Q 120 1150 150 1150 Z"
          fill={M.greyD}
          fillOpacity={0.3}
          stroke={M.grey}
          strokeWidth={3}
          opacity={o}
          {...dash(run(t, 111.6, 0.8))}
        />
      </svg>
      <Write t={t} a={107.5} b={s.b + 1} x={TX} y={TOP} size={76} it segs='"Bumi berputar cepat"' />
      <Write t={t} a={109.8} b={s.b + 1} x={TX} y={TOP2} size={60} segs={[{s: 'cepat', c: M.red}, ', tapi ', {s: 'bertahap', c: M.green}]} />
      <Write t={t} a={C.KOMENTAR_CTA - 0.6} b={s.b + 1} x={TX} y={1235} size={58} segs="tinggalkan komentar" />
      <Write t={t} a={C.NEXT} b={s.b + 1} x={TX} y={990} size={60} scale={ask} color={M.yellow} it segs="Next kita bahas apalagi?" />
    </>
  );
};

/** The one Moon, drawn above the scenes that frame it. */
const MoonLayer: React.FC<{t: number}> = ({t}) => {
  const m = moonAt(t);
  return (
    <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
      <Moon x={m.x} y={m.y} o={m.o} />
    </svg>
  );
};

export const Scenes: React.FC<{t: number}> = ({t}) => (
  <>
    <Hook t={t} />
    <Comment t={t} />
    <Formula t={t} />
    <GlobeScene t={t} />
    <Day t={t} />
    <Equator t={t} />
    <Big t={t} />
    <Wheels t={t} />
    <EarthAgain t={t} />
    <Degree t={t} />
    <Sky t={t} />
    <Satellite t={t} />
    <Orbit t={t} />
    <Glance t={t} />
    <Roof t={t} />
    <MoonLayer t={t} />
    <Closing t={t} />
  </>
);

/** Full Indonesian subtitles on a 75% black BackgroundRectangle, above the 320 px bottom zone. */
export const Subtitles: React.FC<{t: number}> = ({t}) => {
  const sub = SUBS.find((s) => t >= s.a && t < s.b);
  if (!sub) return null;
  const o = Math.min(run(t, sub.a, 0.15), 1 - run(t, sub.b - 0.08, 0.08));
  return (
    <div
      style={{
        position: 'absolute',
        left: TX,
        top: 1440,
        transform: 'translate(-50%, -50%)',
        maxWidth: 800,
        width: 'max-content',
        padding: '10px 26px',
        background: 'rgba(0,0,0,0.75)',
        borderRadius: 6,
        fontFamily: SERIF,
        fontSize: 50,
        lineHeight: 1.22,
        color: M.white,
        textAlign: 'center',
        opacity: o,
      }}
    >
      {sub.text}
    </div>
  );
};
