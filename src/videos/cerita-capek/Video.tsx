import type {ReactNode} from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {Audio} from '@remotion/media';
import {z} from 'zod';
import {SAFE, kitSchema} from '../../kit/brand';
import {ReviewOverlay, Sfx, Title, Watermark} from '../../kit/components';
import {EASE, k, lerp, life, useT} from '../../kit/motion';
import {
  Boots,
  Bubble,
  Chair,
  Cloud,
  Conveyor,
  Door,
  Dusk,
  DuskWindow,
  FactoryBack,
  Family,
  FocusRing,
  Gear,
  HangingLamp,
  HouseFront,
  KidDrawing,
  Lines,
  PaperDefs,
  PaperDot,
  PaperGrain,
  PC,
  PlySheet,
  PressMachine,
  QuestionMark,
  Ripples,
  RoomShell,
  Rug,
  SOFA_SEAT,
  SeatedLegs,
  SofaBack,
  SofaFront,
  float,
  popIn,
  type FamMood,
} from '../../kit/papercut';
import {Worker, mixArm} from '../../kit/worker';
import {AUDIO_SECONDS, CUES, SFX, scene, TITLES} from './timeline';

/** Papercut diorama (src/kit/papercut.tsx): cool factory vs warm dusk home. */
const C = {...PC, text: PC.paper};
/** 10^((-21.5 - 19 - (-17.7)) / 20): measured narration and music LUFS, music 19 dB under. */
const MUSIC_VOLUME = 0.072;

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

const SceneLayer: React.FC<{id: Parameters<typeof scene>[0]; enter?: Move; exit?: Move; children: ReactNode}> = ({id, ...rest}) => {
  const {a, b} = scene(id);
  return <Layer a={a} b={b} {...rest} />;
};

const Svg: React.FC<{children: ReactNode}> = ({children}) => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
    {children}
  </svg>
);

/** Sun path for the "long day" arc: phi from left (pi) over the top to the right horizon (0). */
const sunAt = (phi: number) => ({x: 540 + 420 * Math.cos(phi), y: 1250 - 780 * Math.sin(phi)});
const PHI_HOME = Math.acos(-0.4286);

const ROAD = <rect x={0} y={1540} width={1080} height={380} fill={C.road} />;

/** House front with an open, lit door; family member in the doorway. */
const SPintu: React.FC = () => {
  const t = useT();
  const z = k(t, 5.85, 6.25, 1, 1.8, EASE.in);
  const sun = sunAt(PHI_HOME);
  const wx = k(t, 0, 1.7, -160, 330, EASE.inOut);
  const walking = t < 1.7 ? t * 1.6 : 0;
  const settle = k(t, 1.55, 1.85, 0, 1) * (1 - k(t, 1.85, 2.2, 0, 1));
  return (
    <SceneLayer id="pintu" enter="fade" exit="cut">
      <Svg>
        <g transform={`translate(${sun.x} ${sun.y}) scale(${z}) translate(${-sun.x} ${-sun.y})`}>
          <Dusk sun={sun} />
          {ROAD}
          <HouseFront />
          <Family x={780} y={1560} mood={t > 4.6 ? 'concerned' : 'curious'} talk={t > 1.85 && t < 2.95} />
          <Worker x={wx} y={1600} s={1.1} walk={walking} dip={settle} mood={t > 4.6 ? 'sad' : 'neutral'} flip={false} look={t > 1.7 ? [0.8, -0.2] : undefined} />
        </g>
      </Svg>
      <Bubble a={1.65} b={5.7} x={400} y={640} tail="right" maxW={480}>
        Tadi kerja gimana?
      </Bubble>
      <Bubble a={4.5} b={5.9} x={110} y={900}>
        Ya, biasa.
      </Bubble>
    </SceneLayer>
  );
};

/** Match cut on the sun: the camera pulls out of it, then the sun crosses the sky. */
const SPanjang: React.FC = () => {
  const t = useT();
  const {a, b} = scene('panjang');
  const phi = k(t, a, b, PHI_HOME, 0.2, EASE.inOut);
  const sun = sunAt(phi);
  const z = k(t, a, a + 0.7, 1.8, 1, EASE.out);
  const start = sunAt(Math.PI);
  const trail = Array.from({length: 40}, (_, i) => sunAt(lerp(Math.PI, phi, i / 39)));
  return (
    <SceneLayer id="panjang" enter="cut" exit="push">
      <Svg>
        <g transform={`translate(${sunAt(PHI_HOME).x} ${sunAt(PHI_HOME).y}) scale(${z}) translate(${-sunAt(PHI_HOME).x} ${-sunAt(PHI_HOME).y})`}>
          <Dusk sun={sun} dim={k(t, a, b, 0, 0.25)} />
          <path d={`M${start.x} ${start.y} ${trail.map((p) => `L${p.x} ${p.y}`).join(' ')}`} stroke={C.paper} strokeOpacity={0.55} strokeWidth={6} strokeDasharray="4 22" strokeLinecap="round" fill="none" />
          {ROAD}
        </g>
      </Svg>
    </SceneLayer>
  );
};

/** Belt travel in px: steady, then eases to a stop so the defect sheet halts at center. */
const beltOff = (t: number) => 120 * Math.min(t, 17) + 36 * k(t, 17, 17.6, 0, 1, EASE.out);
const SHEET_Y = 1120;

/** Plywood factory: press machine, belt with sheets, worker inspecting; camera zooms to details. */
const SPabrik: React.FC = () => {
  const t = useT();
  const z = 1 + 0.3 * k(t, 13.0, 13.9, 0, 1, EASE.inOut) - 0.3 * k(t, 15.5, 16.2, 0, 1, EASE.inOut) + 0.45 * k(t, 17.3, 18.0, 0, 1, EASE.inOut);
  const off = beltOff(t);
  const run = t < 17.6 ? 1 : 0;
  const sheets = Array.from({length: 4}, (_, i) => ((off + i * 360 + 1374) % 1440) - 180);
  const ring = popIn(t, CUES.CACAT - 0.3);
  const gear = (t - 8.6) * 70 * (1 - k(t, 17, 17.6, 0, 1));
  const work = Math.sin(t * 5) * 0.5 + 0.5;
  return (
    <SceneLayer id="pabrik" enter="push" exit="zoom">
      <Svg>
        <g transform={`translate(540 ${SHEET_Y + 40}) scale(${z}) translate(-540 ${-SHEET_Y - 40})`}>
          <FactoryBack />
          <PressMachine rot={gear} />
          {t >= CUES.MESIN - 0.2 && t < 13 ? <Ripples x={160} y={780} t0={CUES.MESIN} period={2.1} gap={0.7} r0={60} dr={260} width={6} alpha={0.35} fade={k(t, 12.4, 12.95, 1, 0)} /> : null}
          {/* worker behind the belt */}
          <Worker
            x={600}
            y={1430}
            s={1.15}
            mood={t > CUES.CACAT - 0.3 ? 'surprised' : t > CUES.PIKIRAN ? 'thinking' : 'neutral'}
            look={t > CUES.LEMBARAN - 0.3 && t < CUES.PIKIRAN ? [-0.3, 0.9] : t > CUES.CACAT - 0.3 ? [-0.4, 0.8] : undefined}
            armL={mixArm('hold', [24, -96], work * run)}
            armR={mixArm('hold', [24, -96], (1 - work) * run)}
          />
          <Conveyor y={SHEET_Y} off={off}>
            {sheets.map((x, i) => (
              <PlySheet key={i} x={x} y={SHEET_Y} defect={i === 0} />
            ))}
          </Conveyor>
          <rect x={0} y={1640} width={1080} height={300} fill={C.fFloor} />
          <FocusRing x={540} y={SHEET_Y + 28} s={ring} />
        </g>
      </Svg>
    </SceneLayer>
  );
};

/** Walking home at dusk; hills scroll for parallax; a thought bubble wishes for a chair. */
const SPulang: React.FC = () => {
  const t = useT();
  const {a} = scene('pulang');
  const sun = sunAt(0.2);
  const dx = -(t - a) * 120;
  const th = popIn(t, CUES.DUDUK - 0.35);
  const thOut = k(t, 23.9, 24.25, 1, 0, EASE.in);
  return (
    <SceneLayer id="pulang" enter="fade" exit="push">
      <Svg>
        <Dusk sun={sun} dx={dx} dim={0.2} />
        <rect x={0} y={1520} width={1080} height={400} fill={C.road} />
        {Array.from({length: 8}, (_, i) => (
          <rect key={i} x={((i * 220 + dx * 1.6) % 1760) + 1080 * (dx < 0 ? 1 : 0) - 200} y={1700} width={110} height={14} rx={7} fill={C.paperDim} opacity={0.4} />
        ))}
        <Worker x={540} y={1600} s={1.1} walk={(t - a) * 1.3} mood={t > CUES.DUDUK ? 'worried' : 'sad'} />
        {th > 0 ? (
          <g opacity={thOut} transform={`translate(${640 + float(t, 4, 3)} ${880}) scale(${th})`}>
            <PaperDot x={-110} y={180} r={14} />
            <PaperDot x={-70} y={120} r={24} />
            <Cloud x={60} y={-30} rx={190} ry={150} />
            <g transform="translate(60 -30)">
              <Chair />
            </g>
          </g>
        ) : null}
      </Svg>
    </SceneLayer>
  );
};

/** Home camera [seconds, center x, center y, zoom] in room coordinates; eased between keys. */
const KEYS: [number, number, number, number][] = [
  [24.4, 560, 1150, 1.0],
  [25.8, 560, 1150, 1.0],
  [26.4, 300, 1420, 1.6],
  [27.2, 300, 1420, 1.6],
  [27.9, 600, 1150, 1.0],
  [30.3, 600, 1150, 1.0],
  [30.9, 580, 1150, 1.15],
  [33.25, 580, 1150, 1.15],
  [33.55, 580, 1130, 1.3],
  [35.45, 580, 1130, 1.3],
  [36.2, 340, 1080, 1.6],
  [37.7, 340, 1080, 1.6],
  [39.4, 620, 880, 1.35],
  [45.6, 620, 880, 1.35],
  [46.6, 800, 1120, 1.2],
  [51.0, 800, 1120, 1.2],
  [51.8, 720, 1100, 1.1],
  [62.75, 720, 1100, 1.1],
  [64.0, 660, 1140, 1.0],
  [AUDIO_SECONDS, 620, 1180, 0.94],
];
const camAt = (t: number) => {
  const i = Math.max(0, KEYS.findIndex((key) => key[0] > t) - 1);
  const [a, x0, y0, z0] = KEYS[i];
  const [b, x1, y1, z1] = KEYS[Math.min(i + 1, KEYS.length - 1)];
  const u = b > a ? k(t, a, b, 0, 1, EASE.inOut) : 1;
  return {x: lerp(x0, x1, u) + float(t, 5, 6), y: lerp(y0, y1, u) + float(t, 4, 7, 0.3), z: lerp(z0, z1, u)};
};

const FLOOR = 1560;
const SEAT_Y = FLOOR + SOFA_SEAT;
const SOFA_X = 760;
const W_SEAT_X = 600;

/** Worker in the room: walks in, shoes off, walks to the sofa, sits. */
const workerAt = (t: number) => {
  const x = t < 37.7 ? k(t, 24.4, 25.4, 200, 330, EASE.inOut) : t < 66.3 ? k(t, 37.7, 39.1, 330, W_SEAT_X, EASE.inOut) : W_SEAT_X;
  const walk = (t > 24.4 && t < 25.4) || (t > 37.7 && t < 39.1) ? t * 1.5 : 0;
  const shoeDip = k(t, 25.9, 26.2, 0, 1) * (1 - k(t, 26.6, 26.9, 0, 1));
  const sitDip = k(t, 39.1, 39.3, 0, 1) * (1 - k(t, 39.3, 39.7, 0, 1));
  return {x, walk, dip: Math.max(shoeDip, sitDip), seated: t >= 39.3};
};
const familyAt = (t: number) => {
  const x = t < 66.3 ? k(t, 37.9, 39.0, 840, 870, EASE.inOut) : k(t, 66.3, 67.3, 870, 800, EASE.inOut);
  return {x, walk: t > 37.9 && t < 39.0 ? t * 1.5 : 0, seated: t >= 39.1};
};

const workerMood = (t: number) =>
  t < 30.35 ? 'sad' : t < 37.7 ? 'sad' : t < 45.6 ? 'thinking' : t < CUES.MAU_DENGAR ? 'neutral' : t < CUES.SUPAYA ? 'happy' : t < CUES.DUDUK_DEKAT ? 'neutral' : 'happy';
const familyMood = (t: number): FamMood =>
  t < 29.4 ? 'happy' : t < 30.35 ? 'curious' : t < 35.45 ? 'concerned' : t < CUES.HABIS ? 'neutral' : t < CUES.SUPAYA ? 'happy' : t < CUES.DIAM_KITA ? 'curious' : 'happy';
const familyTalk = (t: number) => (t > 27.6 && t < 28.9) || (t > 30.5 && t < 31.3) || (t > 32.06 && t < 33.1) || (t > 48.5 && t < 49.6);

/** Thought cloud above the seated worker: rest vs. talk balance, then fills with work. */
const Thought: React.FC = () => {
  const t = useT();
  const o = life(t, 37.9, 45.7, 0.4, 0.35);
  if (o <= 0) return null;
  const s = popIn(t, 37.9) * lerp(1, 1.12, k(t, CUES.KEPALA, CUES.KEPALA + 0.8, 0, 1, EASE.out));
  const tilt = k(t, CUES.ISTIRAHAT - 0.1, CUES.ISTIRAHAT + 0.6, 0, 13, EASE.pop) + float(t, 1.5, 3);
  const phase1 = 1 - k(t, 42.35, 42.7, 0, 1, EASE.in);
  const items = [
    {x: -150, y: -30, gear: true, r: 46},
    {x: 20, y: -80, gear: false, r: 0},
    {x: 140, y: 10, gear: true, r: 36},
    {x: -40, y: 60, gear: false, r: 0},
    {x: 70, y: 90, gear: true, r: 28},
  ];
  return (
    <g opacity={o}>
      <PaperDot x={590} y={985} r={11} />
      <PaperDot x={605} y={915} r={19} />
      <g transform={`translate(600 ${700 + float(t, 5, 4)}) scale(${s})`}>
        <Cloud rx={260} ry={170} />
        {phase1 > 0 ? (
          <g transform={`scale(${phase1})`}>
            <path d="M-20 70 L 0 30 L 20 70 Z" fill={C.paperDim} />
            <g transform={`rotate(${tilt})`}>
              <rect x={-170} y={20} width={340} height={12} rx={6} fill={C.wall2} />
              {/* talk icon (left) and pillow (right) */}
              <g transform="translate(-120 -40)">
                <rect x={-58} y={-42} width={116} height={84} rx={22} fill={C.sofa} />
                <rect x={-34} y={-14} width={68} height={10} rx={5} fill={C.paper} />
                <rect x={-34} y={6} width={44} height={10} rx={5} fill={C.paper} />
              </g>
              <rect x={60} y={-40} width={130} height={60} rx={28} fill={C.rug} />
            </g>
          </g>
        ) : null}
        {items.map((it, i) => {
          const p = popIn(t, CUES.KEPALA + 0.05 + i * 0.13);
          if (p <= 0) return null;
          return (
            <g key={i} transform={`translate(${it.x} ${it.y}) scale(${p}) rotate(${it.gear ? (t - 42) * 60 * (i % 2 ? -1 : 1) : -8 + i * 6})`}>
              {it.gear ? <Gear r={it.r} tooth={[16, 22, 4, 10]} body={C.metal} teeth={C.metalDark} hub={C.paper} /> : <path d="M-80 -18 L 90 -18 L 80 18 L -90 18 Z" fill={C.wood} />}
            </g>
          );
        })}
      </g>
    </g>
  );
};

/** Question marks around the family head; they fold flat on "diam kita". */
const Guess: React.FC = () => {
  const t = useT();
  const fold = 1 - k(t, CUES.DIAM_KITA - 0.05, CUES.DIAM_KITA + 0.3, 0, 1, EASE.in);
  return (
    <>
      {[
        {x: 780, y: 1010, a: 59.9, r: -12},
        {x: 950, y: 980, a: 60.1, r: 10},
        {x: 870, y: 900, a: 60.3, r: -4},
      ].map((q) => {
        const p = popIn(t, q.a) * fold;
        if (p <= 0 || t < q.a) return null;
        return <QuestionMark key={q.x} x={q.x} y={q.y + float(t, 6, 2.6, q.x / 500)} rot={q.r} sx={p} />;
      })}
    </>
  );
};

/** The one home world: room set, sofa, family, kid, and the Worker. */
const Home: React.FC = () => {
  const t = useT();
  const cam = camAt(t);
  const w = workerAt(t);
  const f = familyAt(t);
  const shoesOff = t >= 26.45;
  const boots = popIn(t, 26.45);
  const kidX = k(t, 45.8, 47.0, 1250, 760, EASE.inOut);
  const lampGlow = lerp(0.55, 0.9, k(t, 62.8, 66, 0, 1, EASE.inOut));
  const sunY = k(t, 24.4, AUDIO_SECONDS, 880, 1100, (u) => u);
  const rings = t > CUES.SEHARIAN - 0.1 && t < 65.6;
  const worker = (
    <Worker
      x={w.x}
      y={w.seated ? SEAT_Y : FLOOR}
      s={1.1}
      walk={w.walk}
      dip={w.dip}
      mood={workerMood(t)}
      look={t > 30.4 && t < 35.45 ? [0.7, 0] : t > 62.75 ? [0.6, 0.1] : undefined}
      armR={t > CUES.AKU_MANDI - 0.2 && t < CUES.SUPAYA ? mixArm('idle', [55, -70], k(t, CUES.AKU_MANDI - 0.2, CUES.AKU_MANDI + 0.3, 0, 1)) : 'idle'}
      colors={shoesOff ? {boots: C.socks} : undefined}
    />
  );
  const family = <Family x={f.x} y={f.seated ? SEAT_Y : FLOOR} mood={familyMood(t)} talk={familyTalk(t)} walk={f.walk} />;
  return (
    <Layer a={scene('sepatu').a} b={AUDIO_SECONDS} enter="push">
      <Svg>
        <g transform={`translate(540 960) scale(${cam.z}) translate(${-cam.x} ${-cam.y})`}>
          <RoomShell floorY={FLOOR} />
          <Rug x={700} y={1700} />
          {/* window keeps the dusk sun from the walk home */}
          <DuskWindow x={760} y={780} sunY={sunY - 780} />
          <Door x={50} y={FLOOR} />
          <Boots x={160} y={1550} s={boots} />
          <HangingLamp x={300} y={770} glow={lampGlow} />
          <SofaBack x={SOFA_X} y={FLOOR} />
          <Thought />
          {w.seated ? worker : null}
          {f.seated ? family : null}
          {/* sofa front covers seated legs; laps and feet read as sitting */}
          <SofaFront x={SOFA_X} y={FLOOR} />
          {w.seated ? <SeatedLegs x={w.x} y={FLOOR} who="worker" /> : null}
          {f.seated ? <SeatedLegs x={f.x} y={FLOOR} who="family" /> : null}
          {f.seated ? null : family}
          {w.seated ? null : worker}
          {rings ? <Ripples x={w.x} y={1100} t0={CUES.SEHARIAN} period={2.4} gap={0.8} r0={90} dr={200} width={5} alpha={0.3} fade={k(t, 64.2, 65.5, 1, 0)} /> : null}
          {kidX < 1240 ? (
            <g>
              <Family x={kidX} y={1700} s={0.72} mood="happy" shirt={C.kidShirt} walk={t > 45.8 && t < 47 ? t * 1.8 : 0} talk={t > 49.0 && t < 50.2} />
              <KidDrawing x={kidX + 60} y={1560 + float(t, 4, 3)} />
            </g>
          ) : null}
          {t > 59.5 && t < 62.8 ? <Guess /> : null}
        </g>
      </Svg>
      {/* sepatu */}
      <Bubble a={27.6} b={29.9} x={560} y={700} tail="right">
        <Lines n={3} w={220} />
      </Bubble>
      <Bubble a={29.0} b={30.25} x={130} y={700}>
        <Lines n={1} w={60} />
      </Bubble>
      {/* diam: question, then the short answer as punchline */}
      <Bubble a={30.5} b={32.0} x={360} y={400} tail="right" maxW={520}>
        Kok diam saja?
      </Bubble>
      <Bubble a={32.0} b={35.3} x={380} y={400} tail="right" maxW={500}>
        Lagi ada masalah?
      </Bubble>
      <Bubble a={33.4} b={35.35} x={110} y={660} maxW={720}>
        Nggak. <span style={{color: C.defect}}>Cuma capek.</span>
      </Bubble>
      {/* menunggu: they have stories too */}
      <Bubble a={48.5} b={50.9} x={420} y={700} tail="right">
        <Lines n={3} w={220} />
      </Bubble>
      {/* ucap: a slightly longer answer */}
      <Bubble a={52.4} b={55.75} x={130} y={640}>
        <span style={{position: 'relative'}}>
          Cuma capek.
          <span style={{position: 'absolute', left: 0, top: '52%', height: 8, borderRadius: 4, background: C.defect, width: `${k(t, 54.75, 55.2, 0, 100)}%`}} />
        </span>
      </Bubble>
      <Bubble a={55.75} b={59.6} x={130} y={430} maxW={640}>
        Aku mandi dan duduk sebentar, ya.
      </Bubble>
      <Bubble a={57.6} b={59.6} x={130} y={640} maxW={640}>
        Habis itu cerita. <span style={{color: C.sofa}}>Aku mau dengar.</span>
      </Bubble>
      {/* penutup: slowly starting to talk */}
      <Bubble a={70.6} b={AUDIO_SECONDS + 1} x={250} y={600} tail="right">
        <Lines n={2} w={170} />
      </Bubble>
    </Layer>
  );
};

const titleSize = (s: string) => (s.length <= 9 ? 96 : s.length <= 12 ? 80 : 70);

export const Video: React.FC<z.infer<typeof kitSchema>> = ({watermark, sfxVolume, showReview}) => (
  <AbsoluteFill style={{background: C.sky1, overflow: 'hidden'}}>
    <PaperDefs />
    <SPintu />
    <SPanjang />
    <SPabrik />
    <SPulang />
    <Home />
    {TITLES.map((w) => (
      <Title key={w.a} a={w.a} b={w.b} top={SAFE.top + 40} lines={w.lines.map((text, i) => ({text, size: titleSize(text), color: i === w.lines.length - 1 && w.lines.length > 1 ? C.glow : C.text}))} />
    ))}
    <PaperGrain />
    <Watermark text={watermark} color={C.text} />
    <Audio src={staticFile('videos/cerita-capek/narration.wav')} />
    <Audio src={staticFile('videos/cerita-capek/music.wav')} volume={MUSIC_VOLUME} />
    <Sfx cues={SFX} volume={sfxVolume} />
    {showReview ? <ReviewOverlay /> : null}
  </AbsoluteFill>
);
