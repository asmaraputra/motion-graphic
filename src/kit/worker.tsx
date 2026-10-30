import type {ReactNode} from 'react';
import {useT} from './motion';
import {armAt, workerMotion, type WorkerArm} from './worker-motion';
export {ARM, mixArm} from './worker-motion';
export type {WorkerArm} from './worker-motion';

/** Original OMP Worker, polished for Kerangka A. Feet=(x,y), height about 480*s. */
export type WorkerMood = 'neutral' | 'happy' | 'surprised' | 'sad' | 'worried' | 'thinking';
export const WORKER_COLORS = {
  ink: '#25211C', skin: '#D9A27A', blush: '#E8857A', shirt: '#3D6FA8', shirtDark: '#2F5888',
  helmet: '#F2C230', helmetDark: '#D9A81C', pants: '#2E3440', boots: '#5A3A22', sweat: '#8FC3E8',
};
export type WorkerColors = typeof WORKER_COLORS;
const FACE: Record<WorkerMood, {brow: [number, number, number, number]; eye: number; look: [number, number]}> = {
  neutral: {brow: [0, 0, 0, 0], eye: 1, look: [0, 0]},
  happy: {brow: [-4, -4, -4, -4], eye: 1, look: [0, 0]},
  surprised: {brow: [-12, -12, -12, -12], eye: 1.35, look: [0, 0]},
  sad: {brow: [2, -8, 2, -8], eye: 0.85, look: [0, 0.5]},
  worried: {brow: [0, -10, 0, -10], eye: 1, look: [0, 0]},
  thinking: {brow: [0, 0, -12, -8], eye: 1, look: [0.6, -0.6]},
};

export type WorkerProps = {
  x: number;
  y: number;
  s?: number;
  mood?: WorkerMood;
  armL?: WorkerArm;
  armR?: WorkerArm;
  /** Step phase in cycles, not velocity. Move x separately; 0 gives standing feet. */
  walk?: number;
  /** Anticipation/squash 0..1, anchored at the soles rather than sinking below ground. */
  dip?: number;
  look?: readonly [number, number];
  /** Mirrors the rig. Held artwork remains readable instead of mirroring its text. */
  flip?: boolean;
  colors?: Partial<WorkerColors>;
  /** Local SVG artwork, origin at the chosen grip. Default hand stays right for compatibility. */
  holding?: ReactNode;
  holdingHand?: 'left' | 'right';
  /** Stable per-character timing offset in seconds for blink/breath desynchronization. */
  idleOffset?: number;
};

export const Worker: React.FC<WorkerProps> = ({x, y, s = 1, mood = 'neutral', armL = 'idle', armR = 'idle',
  walk = 0, dip = 0, look, flip = false, colors, holding, holdingHand = 'right', idleOffset = 0}) => {
  const t = useT();
  const c = {...WORKER_COLORS, ...colors};
  const face = FACE[mood];
  const motion = workerMotion(t, {walk, dip, look: look ?? face.look, idleOffset});
  const [lx, ly] = motion.look;
  const left = armAt(-1, armL, t + idleOffset), right = armAt(1, armR, t + idleOffset);
  const held = holdingHand === 'left' ? left : right;
  const [bo, bi, ro, ri] = face.brow;
  const eyeRy = 9 * face.eye * motion.blink;

  return (
    <g data-worker="" data-mood={mood} transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <ellipse cx={0} cy={6} rx={90 + motion.dip * 4} ry={14} fill={c.ink} opacity={0.14} />
      <g data-worker-body="" transform={`scale(${motion.scale[0]} ${motion.scale[1]})`}>
        {[-23, 23].map((hx, i) => (
          <g key={hx} transform={`translate(${hx} ${-motion.lift[i]})`}>
            <rect x={-15} y={-150} width={30} height={140} rx={14} fill={c.pants} />
            <rect data-worker-boot="" x={-22} y={-26} width={44} height={26} rx={11} fill={c.boots} />
            <path d="M-16 -7 H16" stroke={c.ink} strokeWidth={3} strokeOpacity={0.22} />
          </g>
        ))}
        <g transform={`translate(0 ${motion.upper})`}>
          <rect x={-16} y={-352} width={32} height={30} fill={c.skin} />
          <rect x={-62} y={-330} width={124} height={190} rx={40} fill={c.shirt} />
          <path d="M-26 -330 L0 -302 L26 -330 Z" fill={c.skin} />
          <rect x={-62} y={-258} width={124} height={14} fill={c.helmet} />
          <rect x={14} y={-300} width={30} height={24} rx={6} fill={c.shirtDark} />
          <rect x={-60} y={-182} width={120} height={46} rx={18} fill={c.pants} />
          <g transform="translate(0 -400)">
            <circle cx={-60} cy={6} r={13} fill={c.skin} />
            <circle cx={60} cy={6} r={13} fill={c.skin} />
            <circle cx={0} cy={0} r={62} fill={c.skin} />
            <path d="M-68 -12 A68 66 0 0 1 68 -12 Z" fill={c.helmet} />
            <path d="M0 -76 L0 -16" stroke={c.helmetDark} strokeWidth={10} strokeLinecap="round" />
            <rect x={-84} y={-20} width={168} height={14} rx={7} fill={c.helmetDark} />
            <path d="M-48 -32 Q-40 -56 -16 -66" stroke="#FFFFFF" strokeOpacity={0.45} strokeWidth={8} strokeLinecap="round" fill="none" />
            {mood === 'happy' ? (
              <g transform={`translate(0 6) scale(1 ${motion.blink}) translate(0 -6)`}>
                <path d="M-30 8 Q-22 -4 -14 8 M14 8 Q22 -4 30 8" stroke={c.ink} strokeWidth={5} strokeLinecap="round" fill="none" />
              </g>
            ) : <>
              <ellipse cx={-22 + lx * 4} cy={6 + ly * 4} rx={7} ry={eyeRy} fill={c.ink} />
              <ellipse cx={22 + lx * 4} cy={6 + ly * 4} rx={7} ry={eyeRy} fill={c.ink} />
            </>}
            <path d={`M-34 ${-10 + bo} L-12 ${-12 + bi} M12 ${-12 + ri} L34 ${-10 + ro}`} stroke={c.ink} strokeWidth={5} strokeLinecap="round" />
            {mood === 'happy' ? <>
              <circle cx={-40} cy={24} r={10} fill={c.blush} opacity={0.5} />
              <circle cx={40} cy={24} r={10} fill={c.blush} opacity={0.5} />
              <path d="M-24 18 Q0 46 24 18 Z" fill={c.ink} />
            </> : mood === 'surprised' ? <ellipse cx={0} cy={30} rx={10} ry={13} fill={c.ink} /> : (
              <path d={{neutral:'M-16 26 Q0 32 16 26',sad:'M-18 34 Q0 20 18 34',worried:'M-18 30 q9 -7 18 0 t18 0',thinking:'M-6 30 L16 25'}[mood]}
                stroke={c.ink} strokeWidth={5} strokeLinecap="round" fill="none" />
            )}
            {mood === 'worried' ? <path d="M58 -22 Q66 -6 58 2 Q50 -6 58 -22 Z" fill={c.sweat} /> : null}
          </g>
          <path d={left.d} stroke={c.shirt} strokeWidth={30} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d={right.d} stroke={c.shirt} strokeWidth={30} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {holding ? <g data-worker-held={holdingHand} transform={`translate(${held.hand[0]} ${held.hand[1]}) scale(${flip ? -1 : 1} 1)`}>{holding}</g> : null}
          <circle data-worker-hand="left" cx={left.hand[0]} cy={left.hand[1]} r={16} fill={c.skin} />
          <circle data-worker-hand="right" cx={right.hand[0]} cy={right.hand[1]} r={16} fill={c.skin} />
        </g>
      </g>
    </g>
  );
};
