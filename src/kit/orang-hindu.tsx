import type {ReactNode} from 'react';
import {useT} from './motion';
import {orangHinduState, type OrangHinduMotionInput} from './orang-hindu-motion';
export {mixArm} from './worker-motion';
export type {WorkerArm as OrangHinduArm} from './worker-motion';
export type {OrangHinduMood, OrangHinduPose} from './orang-hindu-motion';

export const ORANG_HINDU_COLORS = {
  ink:'#242323', body:'#FFFEFA', shade:'#E9E7DF', gold:'#C9A54B', goldLight:'#EED796',
  cloth:'#FDFCF8', panel:'#242323', blush:'#EDB2A1',
};
export type OrangHinduColors = typeof ORANG_HINDU_COLORS;
export type OrangHinduProps = OrangHinduMotionInput & {
  x: number;
  y: number;
  s?: number;
  flip?: boolean;
  colors?: Partial<OrangHinduColors>;
  holding?: ReactNode;
  holdingHand?: 'left' | 'right';
};

/** Reusable SVG mascot, feet=(x,y), height about 450*s. Kerangka A only.
 * Udeng motif is a simplified visual adaptation of the supplied pose sheet.
 * This is one character design, not a representation of all Hindu clothing.
 */
export const OrangHindu: React.FC<OrangHinduProps> = ({x,y,s=1,flip=false,colors,holding,
  holdingHand='right',...input}) => {
  const t=useT();
  const state=orangHinduState(t,input), c={...ORANG_HINDU_COLORS,...colors};
  const {mood,left,right}=state;
  const hand=holdingHand==='left'?left.hand:right.hand;
  const [lx,ly]=state.look;
  const brow=mood==='angry'?'M-42 -5 L-18 3 M18 3 L42 -5'
    :mood==='sad'?'M-43 -4 L-18 -13 M18 -13 L43 -4'
    :mood==='surprised'?'M-42 -19 Q-30 -27 -18 -19 M18 -19 Q30 -27 42 -19'
    :mood==='thinking'?'M-42 -10 L-18 -14 M18 -21 L42 -13'
    :'M-41 -12 Q-30 -16 -19 -12 M19 -12 Q30 -16 41 -12';
  const mouth=mood==='sad'?'M-18 47 Q0 30 18 47'
    :mood==='angry'?'M-17 42 Q0 35 17 42'
    :mood==='thinking'?'M-5 42 L17 39':'M-19 37 Q0 53 19 37';
  return <g data-orang-hindu="" data-pose={input.pose??'neutral'} data-mood={mood}
    transform={`translate(${x} ${y}) scale(${flip?-s:s} ${s})`}
    stroke={c.ink} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx={0} cy={5} rx={65} ry={10} fill={c.ink} stroke="none" opacity={0.1} />
    <g data-orang-hindu-body="" transform={`scale(${state.scale[0]} ${state.scale[1]})`}>
      {[-1,1].map((side,i)=><g key={side} transform={`translate(0 ${-state.lift[i]})`}>
        <path d={`M${side*19} -105 Q${side*30} -65 ${side*28} -14`}
          fill="none" stroke={c.ink} strokeWidth={34} />
        <path d={`M${side*19} -105 Q${side*30} -65 ${side*28} -14`}
          fill="none" stroke={c.body} strokeWidth={22} />
        <path data-orang-hindu-foot={i===0?'left':'right'}
          d={side===-1?'M-41 -24 Q-26 -28 -17 -14 L-16 -2 H-62 Q-68 -16 -41 -24Z'
            :'M41 -24 Q26 -28 17 -14 L16 -2 H62 Q68 -16 41 -24Z'} fill={c.body} />
      </g>)}
      <g transform={`translate(0 ${state.upper})`}>
        <path d="M-28 -249 Q-51 -234 -48 -190 L-44 -108 Q0 -88 44 -108 L48 -190 Q51 -234 28 -249Z" fill={c.body} />
        <path d="M-34 -130 Q0 -118 34 -130" stroke={c.shade} strokeWidth={5} fill="none" />
        {[left,right].map((arm,i)=><g key={i}>
          <path d={arm.d} stroke={c.ink} strokeWidth={24} fill="none" />
          <path d={arm.d} stroke={c.body} strokeWidth={13} fill="none" />
        </g>)}
        <g transform="translate(0 -329)">
          <path d="M-76 -32 C-93 -10 -90 36 -64 57 C-33 83 33 83 64 57 C90 36 93 -10 76 -32 C50 -70 -50 -70 -76 -32Z" fill={c.body} />
          <path d="M-65 43 Q-46 64 -21 64" fill="none" stroke={c.shade} strokeWidth={5} />
          <g data-orang-hindu-eyes="" transform={`translate(${lx*5} ${ly*5})`}>
            {mood==='happy'?<g transform={`translate(0 15) scale(1 ${state.blink})`}>
              <path d="M-43 1 Q-30 -16 -17 1 M17 1 Q30 -16 43 1" fill="none" strokeWidth={7} />
            </g>:<>
              <ellipse cx={-30} cy={14} rx={7} ry={(mood==='surprised'?15:12)*state.blink} fill={c.ink} stroke="none" />
              <ellipse cx={30} cy={14} rx={7} ry={(mood==='surprised'?15:12)*state.blink} fill={c.ink} stroke="none" />
            </>}
          </g>
          <path d={brow} fill="none" strokeWidth={5} />
          {mood==='surprised'?<ellipse cy={43} rx={10} ry={14} fill={c.ink} stroke="none" />
            :mood==='happy'?<>
              <path d="M-23 34 Q0 43 23 34 Q20 61 0 61 Q-20 61 -23 34Z" fill={c.ink} strokeWidth={3} />
              <path d="M-12 53 Q0 46 12 53" stroke={c.blush} strokeWidth={5} fill="none" />
            </>:<path d={mouth} fill="none" strokeWidth={5} />}
          {/* White folded cloth, asymmetric knot and dark gold-trimmed panel. */}
          <g data-orang-hindu-udeng="">
            <path d="M-82 -31 L-88 -66 Q-57 -82 -32 -96 L-13 -72 L17 -98 Q53 -87 82 -66 L78 -31 Q0 -12 -82 -31Z" fill={c.cloth} />
            <path d="M-88 -66 Q-43 -65 -13 -72 M-32 -96 L-35 -66 M17 -98 L31 -69 M31 -69 L79 -62" fill="none" strokeWidth={4} />
            <path d="M-79 -55 Q-36 -70 2 -57 L52 -46 L69 -29 Q-4 -8 -79 -31Z" fill={c.panel} />
            <path d="M-72 -51 Q-37 -62 -4 -52 L48 -41 M-70 -34 Q-10 -20 55 -32" stroke={c.gold} strokeWidth={3} fill="none" />
            <path d="M-20 -62 Q-15 -88 -2 -112 L17 -98 L9 -66 L28 -49 L8 -35 L-8 -53 L-29 -39 L-37 -54Z" fill={c.cloth} />
            <path d="M-2 -108 L-7 -70 L9 -51 M-7 -70 L-29 -51" fill="none" strokeWidth={3} />
            {[-58,-43,-28].map((gx,i)=><g key={gx} transform={`translate(${gx} ${-45-i*1.2})`} stroke={c.goldLight} strokeWidth={2} fill="none">
              <path d="M-4 0 Q-2 -8 2 -4 Q7 0 1 3 Q-4 6 -4 0 M0 -7 V7" />
            </g>)}
            <path d="M26 -36 q5 -11 10 -2 q-4 10 -9 0 m16 4 q5 -11 10 -2" fill="none" stroke={c.gold} strokeWidth={2.5} />
          </g>
        </g>
        {holding?<g data-orang-hindu-held={holdingHand}
          transform={`translate(${hand[0]} ${hand[1]}) scale(${flip?-1:1} 1)`}>{holding}</g>:null}
        {[left,right].map((arm,i)=><g key={i} data-orang-hindu-hand={i===0?'left':'right'}>
          <circle cx={arm.hand[0]} cy={arm.hand[1]} r={11} fill={c.body} strokeWidth={5} />
        </g>)}
      </g>
    </g>
  </g>;
};
