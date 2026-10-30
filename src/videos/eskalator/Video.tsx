import {AbsoluteFill, interpolate, staticFile} from 'remotion';
import {Audio} from '@remotion/media';
import {z} from 'zod';
import {FONT, kitSchema} from '../../kit/brand';
import {ReviewOverlay, Sfx, Title, Watermark} from '../../kit/components';
import {EASE, k, life, lerp, useT} from '../../kit/motion';
import {REAR, S_C, pt, stepAt, stepS} from './geometry';
import {AUDIO_SECONDS, SFX, TITLES, type TitleColor} from './timeline';
import {C, World, type Look} from './world';

const MUSIC_VOLUME = 0.1; // lo-fi bed measures -17.5 LUFS; narration -18.2 LUFS; -20 dB puts it about 19 dB under
const CX = 540; // screen point the camera looks at
const CY = 1050;
const COLOR: Record<TitleColor, string> = {w: C.text, y: C.yellow, o: C.orange, t: C.teal, d: C.dim};

/** Camera keys: [seconds, world x, world y, zoom]. Moves ease in/out between keys. */
const KEYS: [number, number, number, number][] = [
  [0, 1150, 520, 0.62], [2.4, 1150, 520, 0.62], [4.4, 1160, 440, 0.85], [6.0, 1160, 440, 0.85],
  [6.9, 1590, 390, 0.85], [9.4, 1620, 420, 0.9], [10.6, 1620, 420, 0.9], [12.8, 920, 720, 0.42],
  [14.3, 920, 720, 0.42], [15.2, 1750, 560, 0.75], [18.0, 1750, 560, 0.75], [19.2, 920, 720, 0.42],
  [20.3, 920, 720, 0.42], [21.4, 1000, 600, 0.9], [27.8, 1000, 600, 0.9], [28.9, 920, 720, 0.42],
  [36.5, 920, 720, 0.42], [37.6, 1150, 520, 0.7], [46.6, 1150, 520, 0.7], [47.9, 1450, 400, 0.75],
  [57.2, 1450, 400, 0.75], [58.6, 1590, 380, 1.0], [62.4, 1590, 380, 1.0], [63.6, 920, 720, 0.42],
  [68.5, 920, 720, 0.42], [69.7, 80, 1000, 0.7], [74.3, 80, 1000, 0.7], [75.8, 920, 720, 0.42],
  [85.0, 920, 720, 0.42], [AUDIO_SECONDS, 920, 700, 0.46],
];
const KT = KEYS.map((q) => q[0]);
const HL = stepAt(S_C + 300, 21.7); // the step the camera rides while the wheels are explained

type Cam = {x: number; y: number; z: number};

const camAt = (t: number): Cam => {
  const at = (i: 1 | 2 | 3) => interpolate(t, KT, KEYS.map((q) => q[i]), {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE.inOut});
  const follow = Math.min(k(t, 20.6, 21.6, 0, 1, EASE.inOut), k(t, 27.6, 28.8, 1, 0, EASE.inOut));
  const p = pt(stepS(HL, t));
  return {x: lerp(at(1), p.x, follow), y: lerp(at(2), p.y, follow), z: at(3)};
};

const lookAt = (t: number): Look => {
  const half = k(t, 85.29, 85.9, 0, 1); // punchline: the half we never see
  const ride = k(t, 83.3, 83.9, 0, 1) * (1 - half);
  return {
    wipeX: k(t, 11.0, 12.6, -300, 2100, EASE.inOut),
    chain: Math.max(life(t, 15.5, 20.4, 0.4, 0.5), life(t, 31.0, 32.8), life(t, 78.3, 80.5)),
    motor: Math.max(life(t, 14.4, 20.4, 0.5, 0.5), life(t, 78.3, 80.5)),
    rail: Math.max(life(t, 25.3, 36.6), life(t, 47.5, 57.6), life(t, 64.0, 68.6), life(t, 80.4, 83.0), half),
    carry: ride,
    dimCarry: Math.max(0.7 * life(t, 62.8, 68.6), 0.6 * half),
    dimRet: 0.6 * ride,
    comb: life(t, 58.2, 60.6),
    wheelF: life(t, 22.4, 24.6),
    wheelR: life(t, 22.9, 24.6),
    hlI: HL,
    hlIA: life(t, 20.8, 28.4),
    hlRA: Math.max(life(t, 2.8, 4.5), life(t, 38.6, 46.6)),
  };
};

/** Label with a leader line, in screen space. The anchor follows a world point through the camera. */
const Tag: React.FC<{t: number; a: number; b: number; text: string; wx: number; wy: number; left: number; dy: number; cam: Cam}> = ({t, a, b, text, wx, wy, left, dy, cam}) => {
  const o = life(t, a, b);
  if (o <= 0) return null;
  const sx = CX + (wx - cam.x) * cam.z;
  const sy = CY + (wy - cam.y) * cam.z;
  const w = text.length * 33 + 44;
  const top = sy + dy;
  const ex = Math.min(Math.max(sx, left), left + w);
  return (
    <g opacity={o}>
      <line x1={ex} y1={dy < 0 ? top + 36 : top - 36} x2={sx} y2={sy} stroke={C.yellow} strokeWidth={4} />
      <circle cx={sx} cy={sy} r={9} fill={C.yellow} />
      <rect x={left} y={top - 36} width={w} height={72} rx={36} fill="rgba(20,24,31,0.88)" stroke={C.yellow} strokeWidth={3} />
      <text x={left + w / 2} y={top + 19} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={56} fill={C.text}>
        {text}
      </text>
    </g>
  );
};

export const Video: React.FC<z.infer<typeof kitSchema>> = ({watermark, sfxVolume, showReview}) => {
  const t = useT();
  const cam = camAt(t);
  const tx = CX - cam.x * cam.z + Math.sin(t * 0.9) * 4;
  const ty = CY - cam.y * cam.z + Math.cos(t * 0.7) * 4;
  const front = pt(stepS(HL, t));
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 55%, #1E2530 0%, ${C.bg} 70%)`, overflow: 'hidden'}}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <g transform={`translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${cam.z.toFixed(4)})`}>
          <World t={t} look={lookAt(t)} />
        </g>
      </svg>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(20,24,31,0.92) 0%, rgba(20,24,31,0.7) 18%, rgba(20,24,31,0) 32%)'}} />
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <Tag t={t} a={22.4} b={24.6} text="roda depan" wx={front.x} wy={front.y} left={500} dy={-190} cam={cam} />
        <Tag t={t} a={22.9} b={24.6} text="roda belakang" wx={front.x + REAR.x} wy={front.y + REAR.y} left={100} dy={190} cam={cam} />
      </svg>
      {TITLES.map((q) => (
        <Title
          key={q.a}
          a={q.a}
          b={q.b}
          top={210}
          lines={q.lines.map((l) => ({text: l.text, size: Math.max(56, Math.min(l.size, 800 / (0.7 * l.text.length))), color: COLOR[l.c]}))}
        />
      ))}
      <Watermark text={watermark} />
      <Audio src={staticFile('videos/eskalator/narration.wav')} />
      <Audio src={staticFile('videos/eskalator/music.wav')} volume={MUSIC_VOLUME} />
      <Sfx cues={SFX} volume={sfxVolume} />
      {showReview ? <ReviewOverlay /> : null}
    </AbsoluteFill>
  );
};
