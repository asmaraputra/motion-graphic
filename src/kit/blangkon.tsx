import type {ReactNode} from 'react';
import {useT} from './motion';
import {blangkonState, type BlangkonMotionInput} from './blangkon-motion';
import {talkFromCues, type SpeechCue} from './orang-hindu-motion';
export {mixArm} from './worker-motion';
export type {WorkerArm as BlangkonArm} from './worker-motion';
export type {BlangkonMood, BlangkonPose} from './blangkon-motion';

export const BLANGKON_COLORS = {
  ink: '#1A1714',
  skin: '#F6D5B8',
  skinShade: '#E3B996',
  jacket: '#221F1C',
  jacketShade: '#35312C',
  kain: '#5A3418',
  kainShade: '#40230E',
  gold: '#C9A54B',
  goldLight: '#EFD9A0',
  blangkon: '#6B4622',
  blangkonShade: '#3F2711',
  blangkonBand: '#9C7238',
  blangkonBandShade: '#7A5526',
  blangkonBandLight: '#C29A5C',
  blush: '#E8A08C',
};
export type BlangkonColors = typeof BLANGKON_COLORS;

export type BlangkonProps = BlangkonMotionInput & {
  x: number;
  y: number;
  s?: number;
  flip?: boolean;
  colors?: Partial<BlangkonColors>;
  holding?: ReactNode;
  holdingHand?: 'left' | 'right';
  /** Explicit mouth drive 0..1; wins over `speak`. */
  talk?: number;
  /** Narration windows that open the mouth; ignore when `talk` is given. */
  speak?: readonly SpeechCue[];
};


/**
 * Blangkon headwear, drawn around the head centre (0,0) at skull radius 76.
 * Reference: bahan/download.jpg — brown cloth wrapped so a wide tan band crosses the
 * crown and folds back into a triangle on the right; the cloth ends tuck behind the ear.
 *
 * Two layers so the ends really sit behind the head:
 *   <BlangkonHeadwear layer="back" />  {head, ears, face}  <BlangkonHeadwear />
 */
export const BlangkonHeadwear: React.FC<{
  colors?: Partial<BlangkonColors>;
  layer?: 'back' | 'front';
}> = ({colors, layer = 'front'}) => {
  const c = {...BLANGKON_COLORS, ...colors};

  return (
    <g
      data-blangkon-headdress=""
      stroke={c.ink}
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {layer === 'back' ? (
        <g>
          {/* cloth ends, hidden by the head and the ears */}
          <path
            d="M-85 -40 L-50 -44 Q-58 20 -65 36 L-57 51 Q-70 60 -84 61 Q-83 43 -77 27 Q-72 6 -85 -40 Z"
            fill={c.blangkon}
          />
          <path
            d="M85 -40 L50 -44 Q58 20 65 36 L57 51 Q70 60 84 61 Q83 43 77 27 Q72 6 85 -40 Z"
            fill={c.blangkon}
          />
          <path
            d="M-78 54 Q-71 48 -68 39 M78 54 Q71 48 68 39"
            fill="none"
            stroke={c.blangkonShade}
            strokeWidth={2.5}
          />
        </g>
      ) : (
        <g>
          {/* main silhouette and crown */}
          <path
            d="M-97 -34 C-101 -67 -92 -100 -73 -121 L-53 -122 Q-7 -146 47 -124 L70 -124 C89 -106 101 -71 97 -34 C69 -35 39 -48 8 -62 C-22 -46 -61 -38 -97 -34 Z"
            fill={c.blangkon}
          />
          <path
            d="M-53 -122 Q-7 -146 47 -124 Q5 -128 -25 -112 Z"
            fill={c.blangkonShade}
            stroke="none"
          />

          {/* rear wrap, partly covered by the front band */}
          <path
            d="M-73 -121 Q-42 -124 -5 -105 Q47 -81 98 -50 L97 -34 Q62 -43 10 -75 Q-36 -102 -89 -92 Q-84 -110 -73 -121 Z"
            fill={c.blangkonBandShade}
          />
          <path
            d="M-70 -117 Q-43 -119 -9 -102 Q43 -79 92 -49 Q50 -67 5 -88 Q-39 -110 -79 -105 Z"
            fill={c.blangkonBand}
            stroke="none"
          />

          {/* triangular fold following the right side of the cloth */}
          <path d="M55 -66 L97 -34 Q78 -39 63 -51 Z" fill={c.blangkon} stroke="none" />
          <path d="M55 -66 L95 -36" fill="none" stroke={c.blangkonShade} strokeWidth={2.5} />

          {/* shadow under the front band */}
          <path
            d="M-97 -43 Q-86 -73 -66 -87 Q-9 -120 70 -122 L87 -93 Q30 -89 -7 -68 Q-54 -41 -97 -34 Z"
            fill={c.blangkonShade}
            stroke="none"
          />

          {/* wide front band */}
          <path
            d="M-97 -45 Q-89 -73 -67 -91 Q-10 -123 70 -124 Q80 -114 85 -99 Q30 -96 -8 -74 Q-56 -46 -97 -34 Z"
            fill={c.blangkonBand}
          />
          <path
            d="M-96 -43 Q-53 -64 -7 -90 Q34 -112 73 -118 L79 -107 Q32 -100 -6 -79 Q-55 -49 -96 -36 Z"
            fill={c.blangkonBandShade}
            stroke="none"
          />
          <path
            d="M-85 -65 Q-37 -104 22 -115 Q44 -120 65 -121"
            fill="none"
            stroke={c.blangkonBandLight}
            strokeWidth={2.5}
          />
          <path d="M-97 -34 Q-56 -46 -8 -74 Q30 -96 85 -99" fill="none" />
          <path
            d="M85 -99 Q95 -76 97 -50 L97 -34"
            fill="none"
            stroke={c.blangkonShade}
            strokeWidth={3}
          />
        </g>
      )}
    </g>
  );
};

/**
 * 2D vector blangkon mascot, feet=(x,y), height about 500*s. Kerangka A only.
 * Attire and headwear are a simplified illustration, not a universal ceremonial reference.
 */
export const Blangkon: React.FC<BlangkonProps> = ({
  x,
  y,
  s = 1,
  flip = false,
  colors,
  holding,
  holdingHand = 'right',
  talk,
  speak,
  ...input
}) => {
  const t = useT();
  const state = blangkonState(t, input);
  const c = {...BLANGKON_COLORS, ...colors};
  const {mood, left, right} = state;
  const hand = holdingHand === 'left' ? left.hand : right.hand;
  const [lx, ly] = state.look;
  const drive = Math.max(0, Math.min(1, talk ?? talkFromCues(t, speak ?? [])));
  const speaking = drive > 0;

  // Head-local coordinates: the head group is translated to (0, -372).
  const brow =
    mood === 'angry'
      ? 'M-46 -32 L-16 -24 M16 -24 L46 -32'
      : mood === 'sad'
        ? 'M-46 -26 L-16 -38 M16 -38 L46 -26'
        : mood === 'surprised'
          ? 'M-46 -44 Q-31 -54 -16 -44 M16 -44 Q31 -54 46 -44'
          : mood === 'thinking'
            ? 'M-46 -34 L-16 -40 M16 -48 L46 -38'
            : 'M-45 -36 Q-31 -42 -17 -36 M17 -36 Q31 -42 45 -36';

  // Lower lip is the resting smile; the upper lip lifts with `drive`.
  // Opening drops below the resting lip line: height grows with the drive,
  // width grows more slowly, so the shape reads as an open mouth, not a blob.
  const mouthW = 17 + 6 * drive;
  const mouthH = 4 + 26 * drive;
  const lipY = 22;

  return (
    <g
      data-blangkon=""
      data-pose={input.pose ?? 'neutral'}
      data-mood={mood}
      transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}
      stroke={c.ink}
      strokeWidth={6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx={0} cy={6} rx={72} ry={11} fill={c.ink} stroke="none" opacity={0.12} />

      <g data-blangkon-body="" transform={`scale(${state.scale[0]} ${state.scale[1]})`}>
        {/* Wrapped kain from waist to ankle */}
        <path d="M-48 -238 Q-62 -120 -60 -14 Q0 -4 60 -14 Q62 -120 48 -238 Z" fill={c.kain} />
        <path d="M-40 -150 Q0 -140 40 -150 M-46 -96 Q0 -86 46 -96" fill="none" stroke={c.kainShade} strokeWidth={4} />
        <path d="M-12 -236 Q-16 -120 -18 -12" fill="none" stroke={c.kainShade} strokeWidth={4} opacity={0.8} />
        <path d="M-58 -18 Q0 -8 58 -18" fill="none" stroke={c.gold} strokeWidth={5} />

        {/* Feet, stepping with the walk lift and drawn in front of the hem */}
        {[-1, 1].map((side, i) => (
          <g key={side} transform={`translate(${state.footX[i]} ${-state.lift[i]})`}>
            <path
              data-blangkon-foot={i === 0 ? 'left' : 'right'}
              d={
                side === -1
                  ? 'M-26 -22 Q-10 -30 -4 -10 L-2 4 H-64 Q-68 -14 -26 -22Z'
                  : 'M26 -22 Q10 -30 4 -10 L2 4 H64 Q68 -14 26 -22Z'
              }
              fill={c.ink}
            />
          </g>
        ))}

        {/* Torso: leaning group so a bow reads from the shoulders up */}
        <g transform={`rotate(${state.lean} 0 -238) translate(0 ${state.upper})`}>
          {/* Beskap jacket */}
          <path d="M-52 -300 Q-58 -240 -50 -152 Q0 -138 50 -152 Q58 -240 52 -300 Q0 -314 -52 -300 Z" fill={c.jacket} />
          <path d="M-44 -296 Q-48 -240 -42 -158 M44 -296 Q48 -240 42 -158" fill="none" stroke={c.gold} strokeWidth={4} />
          <path d="M-50 -152 Q0 -138 50 -152" fill="none" stroke={c.gold} strokeWidth={6} />
          {/* gold vine along both front edges */}
          {[-1, 1].map((sd) => (
            <g key={sd} fill="none" stroke={c.gold} strokeWidth={2.6} opacity={0.95}>
              <path d={`M${sd * 30} -288 Q${sd * 20} -252 ${sd * 34} -216 Q${sd * 46} -186 ${sd * 32} -158`} />
              <path d={`M${sd * 34} -216 q${sd * -14} -8 ${sd * -4} -18 q${sd * 10} -6 ${sd * 12} 6`} />
              <path d={`M${sd * 32} -190 q${sd * 16} 6 ${sd * 8} 18`} />
              <path d={`M${sd * 34} -244 q${sd * 14} -4 ${sd * 10} 10`} />
            </g>
          ))}
          {/* Collar */}
          <path d="M-30 -302 L0 -272 L30 -302" fill={c.jacketShade} stroke={c.gold} strokeWidth={4} />
          {/* Button pairs */}
          {[-268, -232, -196].map((by) => (
            <g key={by} fill={c.goldLight} stroke="none">
              <circle cx={-15} cy={by} r={4.5} />
              <circle cx={15} cy={by} r={4.5} />
            </g>
          ))}

          {/* Arms */}
          {[left, right].map((arm, i) => (
            <g key={i} data-blangkon-arm={i === 0 ? 'left' : 'right'}>
              <path d={arm.d} stroke={c.ink} strokeWidth={28} fill="none" />
              <path d={arm.d} stroke={c.jacketShade} strokeWidth={18} fill="none" />
              <path d={arm.d} stroke={c.jacket} strokeWidth={9} fill="none" />
            </g>
          ))}

          {/* Head */}
          <g data-blangkon-head="" transform="translate(0 -372)">
            {/* cloth ends must sit behind the head, so the back layer comes first */}
            <BlangkonHeadwear colors={colors} layer="back" />
            <ellipse cx={-74} cy={14} rx={11} ry={15} fill={c.skin} />
            <ellipse cx={74} cy={14} rx={11} ry={15} fill={c.skin} />
            <ellipse cx={-74} cy={14} rx={5} ry={8} fill="none" stroke={c.skinShade} strokeWidth={3} />
            <ellipse cx={74} cy={14} rx={5} ry={8} fill="none" stroke={c.skinShade} strokeWidth={3} />
            <circle cx={0} cy={0} r={76} fill={c.skin} />

            <BlangkonHeadwear colors={colors} />

            <g data-blangkon-eyes="" transform={`translate(${lx * 6} ${ly * 6})`}>
              {mood === 'happy' ? (
                <g transform={`translate(0 -8) scale(1 ${state.blink})`}>
                  <path d="M-44 -6 Q-26 -26 -8 -6 M8 -6 Q26 -26 44 -6" fill="none" strokeWidth={7} />
                </g>
              ) : (
                <>
                  <ellipse cx={-27} cy={-8} rx={7.5} ry={(mood === 'surprised' ? 16 : 13) * state.blink} fill={c.ink} stroke="none" />
                  <ellipse cx={27} cy={-8} rx={7.5} ry={(mood === 'surprised' ? 16 : 13) * state.blink} fill={c.ink} stroke="none" />
                </>
              )}
            </g>
            <path d={brow} fill="none" strokeWidth={5} />

            {speaking ? (
              <g data-blangkon-mouth="talk">
                <path
                  d={`M${-mouthW} ${lipY} Q0 ${lipY - 3} ${mouthW} ${lipY} Q${mouthW} ${lipY + mouthH} 0 ${lipY + mouthH} Q${-mouthW} ${lipY + mouthH} ${-mouthW} ${lipY} Z`}
                  fill={c.ink}
                  strokeWidth={5}
                />
                {drive > 0.35 ? (
                  <path
                    d={`M${-mouthW * 0.55} ${lipY + mouthH - 3} Q0 ${lipY + mouthH - 13} ${mouthW * 0.55} ${lipY + mouthH - 3} Q0 ${lipY + mouthH + 1} ${-mouthW * 0.55} ${lipY + mouthH - 3} Z`}
                    fill={c.blush}
                    stroke="none"
                  />
                ) : null}
              </g>
            ) : mood === 'surprised' ? (
              <ellipse cx={0} cy={32} rx={10} ry={14} fill={c.ink} stroke="none" />
            ) : mood === 'happy' ? (
              <>
                <path d="M-25 20 Q0 30 25 20 Q21 50 0 50 Q-21 50 -25 20Z" fill={c.ink} strokeWidth={3} />
                <path d="M-13 38 Q0 30 13 38" stroke={c.blush} strokeWidth={5} fill="none" />
              </>
            ) : (
              <path
                d={mood === 'sad' ? 'M-20 24 Q0 10 20 24' : mood === 'angry' ? 'M-19 22 Q0 14 19 22' : 'M-21 22 Q0 40 21 22'}
                fill="none"
                strokeWidth={5}
              />
            )}

          </g>

          {holding ? (
            <g data-blangkon-held={holdingHand} transform={`translate(${hand[0]} ${hand[1]}) scale(${flip ? -1 : 1} 1)`}>
              {holding}
            </g>
          ) : null}

          {input.pose === 'sembah' ? (
            <g data-blangkon-palms="">
              {/* Open palms cupping upward: wrists at the bottom, fingertips along the top rim. */}
              {[-1, 1].map((sd) => (
                <g key={sd} transform={`translate(${sd * 22} -250) rotate(${sd * -10})`}>
                  <path
                    d="M0 4 C-14 -2 -22 -26 -19 -52 C-17 -70 -6 -76 4 -66 C12 -57 12 -24 9 2 Z"
                    fill={c.skin}
                    strokeWidth={5}
                  />
                  {[-38, -24, -10].map((fy) => (
                    <path key={fy} d={`M${-14} ${fy} L0 ${fy - 4}`} stroke={c.skinShade} strokeWidth={3} fill="none" />
                  ))}
                </g>
              ))}
              {/* inner palm hollow so the cup reads as open */}
              <path d="M-18 -276 Q0 -266 18 -276" fill="none" stroke={c.skinShade} strokeWidth={3.5} opacity={0.8} />
            </g>
          ) : null}
          {input.pose === 'sembah' ? null : (
            [left, right].map((arm, i) => (
              <g key={i} data-blangkon-hand={i === 0 ? 'left' : 'right'}>
                <circle cx={arm.hand[0]} cy={arm.hand[1]} r={12} fill={c.skin} strokeWidth={5} />
              </g>
            ))
          )}
        </g>
      </g>
    </g>
  );
};
