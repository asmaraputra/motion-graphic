import {AbsoluteFill} from 'remotion';
import {FONT} from '../../kit/brand';
import {k, useT} from '../../kit/motion';
import {OrangHindu, mixArm, type OrangHinduMood, type OrangHinduPose} from '../../kit/orang-hindu';

const INK='#242323', MUTED='#827A6C';
const MOODS: {mood:OrangHinduMood;label:string}[] = [
  {mood:'neutral',label:'Netral'}, {mood:'happy',label:'Gembira'},
  {mood:'sad',label:'Sedih'}, {mood:'angry',label:'Marah'},
  {mood:'surprised',label:'Terkejut'}, {mood:'thinking',label:'Berpikir'},
];
const POSES: {pose:OrangHinduPose;label:string}[] = [
  {pose:'wave',label:'Menyapa'}, {pose:'point',label:'Menunjuk'},
  {pose:'think',label:'Berpikir'}, {pose:'hip',label:'Pinggang'},
  {pose:'happy',label:'Gembira'}, {pose:'walk',label:'Berjalan'},
];
const Card: React.FC = () => <g stroke={INK} strokeWidth={3}>
  <rect x={-30} y={-65} width={60} height={78} rx={7} fill="#F0D58F" />
  <path d="M-17 -46 H17 M-17 -33 H17 M-17 -20 H7" fill="none" />
</g>;
/** Silent speech windows that mimic narration phrasing, so the sheet needs no audio. */
const LINES: readonly (readonly [number, number])[] = [
  [16.1, 17.5], [17.7, 19.2], [19.4, 20.4],
];
const Label: React.FC<{x:number;y:number;children:React.ReactNode}> = ({x,y,children}) =>
  <text x={x} y={y} textAnchor="middle" fontFamily={FONT} fontSize={38} fontWeight={600} fill={MUTED}>{children}</text>;

/** Silent model sheet; isolated from every existing composition. */
export const Sheet: React.FC = () => {
  const t=useT(), page=Math.min(3,Math.floor(t/5));
  return <AbsoluteFill style={{background:'#F6F2E9',overflow:'hidden'}}>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920">
      <text x={100} y={195} fontFamily={FONT} fontSize={72} fontWeight={800} fill={INK}>orang-hindu</text>
      <text x={104} y={263} fontFamily={FONT} fontSize={35} fill={MUTED}>
        {['01 / Ekspresi','02 / Bahasa tubuh','03 / Gerak dan pegangan','04 / Bicara'][page]}
      </text>
      <path d="M104 310 H955" stroke={INK} strokeOpacity={0.16} strokeWidth={2} />
      {page===0?MOODS.map(({mood,label},i)=>{
        const x=[240,540,840][i%3],y=i<3?910:1460;
        return <g key={mood}>
          <OrangHindu x={x} y={y} s={0.83} mood={mood} idleOffset={i*0.36} />
          <Label x={x} y={y+80}>{label}</Label>
        </g>;
      }):null}
      {page===1?POSES.map(({pose,label},i)=>{
        const x=[240,540,840][i%3],y=i<3?910:1460;
        return <g key={pose}>
          <OrangHindu x={x} y={y} s={0.78} pose={pose} idleOffset={i*0.36} />
          <Label x={x} y={y+80}>{label}</Label>
        </g>;
      }):null}
      {page===2?<>
        <path d="M105 1320 H955" stroke={INK} strokeWidth={2} strokeOpacity={0.18} />
        <OrangHindu x={265+k(t,10,12,0,100)} y={1320} s={1.35} mood="happy"
          walk={t<12?(t-10)*1.5:0} armL="hold" holdingHand="left" holding={<Card />}
          armR={mixArm('idle','point',k(t,12.4,13.4,0,1))} />
        <OrangHindu x={805} y={1320} s={0.85} flip pose="wave" idleOffset={0.7} />
        <Label x={355} y={1440}>Pegangan kiri</Label>
        <Label x={805} y={1440}>Flip + sapa</Label>
        <text x={105} y={1580} fontFamily={FONT} fontSize={32} fill={MUTED}>walk · mixArm · holding · flip · look · dip</text>
      </>:null}
      {page===3?<>
        <path d="M105 1000 H955" stroke={INK} strokeWidth={2} strokeOpacity={0.18} />
        <OrangHindu x={330} y={960} s={1.5} mood="neutral" speak={LINES} />
        <OrangHindu x={700} y={1560} s={1.2} pose="point" talk={k(t,16.2,18.4,0,1)} />
        <Label x={330} y={1055}>speak: cue 16,1-17,5 s</Label>
        <Label x={700} y={1655}>talk: 0..1 manual</Label>
        <text x={105} y={1795} fontFamily={FONT} fontSize={32} fill={MUTED}>speak = jendela narasi · talk = angka langsung · tanpa audio</text>
      </>:null}
      <text x={105} y={1880} fontFamily={FONT} fontSize={29} fill={MUTED}>SVG vektor / 10 pose / mulut bisa bicara</text>
    </svg>
  </AbsoluteFill>;
};
