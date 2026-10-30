import {AbsoluteFill} from 'remotion';
import {FONT} from '../../kit/brand';
import {EASE, k, lerp, useT} from '../../kit/motion';
import {Worker, mixArm, type WorkerArm, type WorkerMood} from '../../kit/worker';

const BG = '#F2ECE0', INK = '#25211C', DIM = '#756C60';
const MOODS: WorkerMood[] = ['neutral','happy','surprised','sad','worried','thinking'];
const POSES: {label: string; l: WorkerArm; r: WorkerArm}[] = [
  {label:'idle',l:'idle',r:'idle'}, {label:'hip',l:'hip',r:'hip'},
  {label:'point',l:'idle',r:'point'}, {label:'raise',l:'idle',r:'raise'},
  {label:'wave',l:'idle',r:'wave'}, {label:'chin',l:'hip',r:'chin'},
  {label:'hold',l:'hold',r:'hold'},
];

const Clipboard: React.FC = () => <g>
  <rect x={-34} y={-50} width={68} height={88} rx={8} fill="#B98149" />
  <rect x={-26} y={-40} width={52} height={70} rx={4} fill="#FFFCF6" />
  <rect x={-14} y={-56} width={28} height={14} rx={4} fill="#7D8790" />
  <path d="M-16 -22 H16 M-16 -8 H16" stroke={INK} strokeOpacity={0.4} strokeWidth={5} strokeLinecap="round" />
  <text y={18} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={21} fill={INK}>OK</text>
</g>;

const Page: React.FC<{a: number; b: number; title: string; children: React.ReactNode}> = ({a,b,title,children}) => {
  const t = useT();
  if (t < a - 0.35 || t > b + 0.25) return null;
  const enter = a === 0 ? 0 : lerp(1080,0,k(t,a-0.35,a+0.2,0,1));
  const exit = b >= 12 ? 0 : lerp(0,-1080,k(t,b-0.35,b+0.2,0,1,EASE.in));
  return <svg data-worker-page={title} viewBox="0 0 1080 1920" width={1080} height={1920}
    style={{position:'absolute',inset:0,transform:`translateX(${enter+exit}px)`}}>
    <text x={112} y={300} fontFamily={FONT} fontWeight={900} fontSize={108} fill={INK}>Worker</text>
    <text x={112} y={390} fontFamily={FONT} fontWeight={600} fontSize={54} fill={DIM}>{title}</text>
    <path d="M112 440 H878" stroke={INK} strokeWidth={2} strokeOpacity={0.16} />
    {children}
  </svg>;
};

const Label: React.FC<{x:number;y:number;text:string}> = ({x,y,text}) =>
  <text data-worker-label="" x={x} y={y} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={54} fill={DIM}>{text}</text>;

/** Twelve-second silent review sheet. Every pose remains the original OMP pose. */
export const Sheet: React.FC = () => {
  const t = useT();
  const walkU = k(t,8.25,9.8,0,1,EASE.inOut);
  const walking = t > 8.25 && t < 9.8;
  const dip = Math.sin(Math.PI*k(t,10.3,10.7,0,1));
  const demoMood: WorkerMood = t < 10.45 ? 'neutral' : t < 11 ? 'surprised' : 'happy';
  return <AbsoluteFill style={{background:BG,overflow:'hidden'}}>
    <Page a={0} b={4} title="6 ekspresi, satu identitas">
      {MOODS.map((m,i) => {
        const x=[235,500,765][i%3],y=i<3?940:1460;
        return <g key={m}>
          <Worker x={x} y={y} s={0.78} mood={m} idleOffset={i*0.39} />
          <Label x={x} y={y+82} text={m} />
        </g>;
      })}
    </Page>
    <Page a={4} b={8} title="7 pose, siku independen">
      {POSES.map((p,i) => {
        const x=[235,500,765][i%3],y=790+Math.floor(i/3)*345;
        return <g key={p.label}>
          <Worker x={x} y={y} s={0.48} armL={p.l} armR={p.r} idleOffset={i*0.32}
            mood={p.label==='chin'?'thinking':p.label==='wave'?'happy':'neutral'}
            holding={p.label==='hold'?<Clipboard />:undefined} />
          <Label x={x} y={y+75} text={p.label} />
        </g>;
      })}
      <Worker x={500} y={1480} s={0.48} walk={t*1.6} idleOffset={0.7} />
      <Label x={500} y={1555} text="walk" />
      <Worker x={765} y={1480} s={0.48} flip armL="hold" armR="hold" holdingHand="left" holding={<Clipboard />} />
      <Label x={765} y={1555} text="flip" />
    </Page>
    <Page a={8} b={12} title="Gerak dan pegangan">
      <path d="M112 1340 H878" stroke={INK} strokeWidth={3} strokeOpacity={0.18} />
      <Worker x={lerp(235,380,walkU)} y={1340} s={1.04} mood={demoMood} idleOffset={0.25}
        walk={walking?(t-8.25)*1.6:0} dip={dip} armL="hold"
        armR={mixArm('idle','point',k(t,10.9,11.4,0,1,EASE.inOut))}
        holdingHand="left" holding={<Clipboard />} />
      <Worker x={740} y={1340} s={0.64} flip mood="happy" armR="hold" idleOffset={1.2}
        holding={<Clipboard />} colors={{shirt:'#166B73',shirtDark:'#105158'}} />
      <Label x={350} y={1460} text="tangan kiri" />
      <Label x={740} y={1460} text="kanan" />
      <text x={112} y={1580} fontFamily={FONT} fontWeight={600} fontSize={46} fill={DIM}>walk · dip · mixArm · flip</text>
    </Page>
  </AbsoluteFill>;
};
