import type {ReactNode} from 'react';
import {AbsoluteFill} from 'remotion';
import {FONT} from '../../kit/brand';
import {k, useT} from '../../kit/motion';
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
  popIn,
  type FamMood,
} from '../../kit/papercut';
import {Worker} from '../../kit/worker';

/** Each page shows for PAGE seconds; pages switch with a hard cut (review sheet, not a video). */
export const PAGE = 4;
export const PAGES = 4;

const Page: React.FC<{i: number; title: string; bg: string; children: ReactNode}> = ({i, title, bg, children}) => {
  const t = useT();
  if (t < i * PAGE || t >= (i + 1) * PAGE) return null;
  return (
    <AbsoluteFill style={{background: bg}}>
      {children}
      <div style={{position: 'absolute', left: 100, top: 90, fontFamily: FONT, fontWeight: 900, fontSize: 48, color: PC.paper, letterSpacing: '0.02em'}}>{title}</div>
    </AbsoluteFill>
  );
};

const Svg: React.FC<{children: ReactNode}> = ({children}) => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
    {children}
  </svg>
);

const Label: React.FC<{x: number; y: number; text: string}> = ({x, y, text}) => (
  <text x={x} y={y} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={30} fill={PC.paper} opacity={0.75}>
    {text}
  </text>
);

const MOODS: FamMood[] = ['neutral', 'happy', 'curious', 'concerned'];

export const Sheet: React.FC = () => {
  const t = useT();
  const p0 = 0;
  const p2 = 2 * PAGE;
  const p3 = 3 * PAGE;
  return (
    <AbsoluteFill style={{background: PC.sky1, overflow: 'hidden'}}>
      <PaperDefs />
      <Page i={0} title="Karakter & bubble" bg={PC.wall}>
        <Svg>
          {MOODS.map((m, i) => (
            <g key={m}>
              <Family x={170 + i * 250} y={820} s={0.78} mood={m} talk={m === 'neutral' && t % 2 < 1} />
              <Label x={170 + i * 250} y={880} text={m === 'neutral' ? 'neutral + talk' : m} />
            </g>
          ))}
          <Family x={170} y={1330} s={0.72} mood="happy" shirt={PC.kidShirt} walk={t * 1.8} />
          <KidDrawing x={240} y={1200} />
          <Label x={190} y={1390} text="anak (s 0.72)" />
          <Worker x={470} y={1330} s={0.8} mood="sad" colors={{boots: PC.socks}} />
          <Label x={470} y={1390} text="Worker + kaus kaki" />
          <PaperDot x={700} y={1180} r={12} />
          <PaperDot x={730} y={1120} r={20} />
          <Cloud x={850} y={1010} rx={170} ry={130} />
          <g transform="translate(850 1010)">
            <Chair />
          </g>
          <QuestionMark x={760} y={1340} rot={-10} />
          <QuestionMark x={880} y={1310} rot={8} />
          <Label x={850} y={1390} text="Cloud, Chair, ?" />
        </Svg>
        <Bubble a={p0 + 0.2} b={p0 + PAGE + 1} x={100} y={1500} maxW={520}>
          Teks pendek.
        </Bubble>
        <Bubble a={p0 + 0.4} b={p0 + PAGE + 1} x={600} y={1500} tail="right">
          <Lines n={3} w={200} />
        </Bubble>
      </Page>

      <Page i={1} title="Luar: senja & rumah" bg={PC.sky1}>
        <Svg>
          <Dusk sun={{x: 300, y: 620}} dx={-(t - PAGE) * 120} />
          <rect x={0} y={1540} width={1080} height={380} fill={PC.road} />
          <HouseFront />
          <Family x={780} y={1560} mood="curious" />
          <Worker x={330} y={1600} s={1.1} walk={t * 1.3} mood="neutral" />
          <Label x={540} y={1760} text="Dusk (parallax dx), HouseFront" />
        </Svg>
      </Page>

      <Page i={2} title="Pabrik" bg={PC.fWall2}>
        <Svg>
          <FactoryBack />
          <PressMachine rot={(t - p2) * 70} />
          <Ripples x={160} y={780} t0={p2} period={2.1} gap={0.7} r0={60} dr={260} width={6} alpha={0.35} />
          <Worker x={600} y={1430} s={1.15} mood="thinking" armL="hold" armR="hold" />
          <Conveyor y={1120} off={(t - p2) * 120}>
            {[0, 1, 2, 3].map((i) => (
              <PlySheet key={i} x={((((t - p2) * 120 + i * 360) % 1440) + 1440) % 1440 - 180} y={1120} defect={i === 0} />
            ))}
          </Conveyor>
          <FocusRing x={900} y={1500} s={popIn(t, p2 + 0.5)} />
          <g transform={`translate(900 1500) rotate(${(t - p2) * 40})`}>
            <Gear r={46} tooth={[16, 22, 4, 10]} body={PC.metal} teeth={PC.metalDark} hub={PC.paper} />
          </g>
          <Label x={540} y={1760} text="FactoryBack, PressMachine, Conveyor, PlySheet, Gear, FocusRing" />
        </Svg>
      </Page>

      <Page i={3} title="Rumah" bg={PC.wall}>
        <Svg>
          <RoomShell />
          <Rug x={700} y={1700} />
          <DuskWindow x={760} y={780} sunY={100 + k(t, p3, p3 + PAGE, 0, 160)} />
          <Door x={50} y={1560} />
          <Boots x={160} y={1550} s={popIn(t, p3 + 0.4)} />
          <HangingLamp x={300} y={770} glow={0.55 + 0.35 * k(t, p3, p3 + PAGE, 0, 1)} />
          <SofaBack x={760} y={1560} />
          <Worker x={600} y={1560 + SOFA_SEAT} s={1.1} mood="happy" colors={{boots: PC.socks}} />
          <Family x={880} y={1560 + SOFA_SEAT} mood="happy" />
          <SofaFront x={760} y={1560} />
          <SeatedLegs x={600} y={1560} who="worker" />
          <SeatedLegs x={880} y={1560} who="family" />
          <Label x={540} y={1790} text="RoomShell, DuskWindow, Door, Boots" />
          <Label x={540} y={1830} text="HangingLamp, SofaBack/Front + SeatedLegs" />
        </Svg>
      </Page>
      <PaperGrain />
    </AbsoluteFill>
  );
};
