import {AbsoluteFill} from 'remotion';
import {BLANGKON_COLORS, BlangkonHeadwear} from '../../kit/blangkon';
import {FONT} from '../../kit/brand';

const INK = '#1A1714', MUTED = '#827A6C';

const Head: React.FC<{s: number}> = ({s}) => (
  <g transform={`scale(${s})`}>
    <BlangkonHeadwear layer="back" />
    <ellipse cx={-74} cy={14} rx={11} ry={15} fill={BLANGKON_COLORS.skin} stroke={INK} strokeWidth={4} />
    <ellipse cx={74} cy={14} rx={11} ry={15} fill={BLANGKON_COLORS.skin} stroke={INK} strokeWidth={4} />
    <circle cx={0} cy={0} r={76} fill={BLANGKON_COLORS.skin} stroke={INK} strokeWidth={4} />
    <path d="M-68 -40 Q-34 -52 0 -50 Q34 -48 68 -40 Q34 -42 0 -43 Q-34 -42 -68 -40 Z" fill="#2B2118" />
    <BlangkonHeadwear />
  </g>
);

/** Review sheet: headwear on the head, front and three-quarter. */
export const Sheet: React.FC = () => (
  <AbsoluteFill style={{background: '#F6F2E9'}}>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920">
      <text x={100} y={150} fontFamily={FONT} fontSize={64} fontWeight={800} fill={INK}>
        blangkon
      </text>
      <text x={104} y={210} fontFamily={FONT} fontSize={32} fill={MUTED}>
        headwear on the head / bahan/download.jpg
      </text>
      <path d="M104 246 H955" stroke={INK} strokeOpacity={0.16} strokeWidth={2} />

      <g transform="translate(540 700)">
        <Head s={3.2} />
      </g>

      <g transform="translate(300 1260)">
        <Head s={1.7} />
      </g>
      <g transform="translate(800 1260)">
        <g transform="scale(0.62 1)">
          <Head s={1.7} />
        </g>
      </g>

      <text x={300} y={1450} textAnchor="middle" fontFamily={FONT} fontSize={30} fill={MUTED}>depan</text>
      <text x={800} y={1450} textAnchor="middle" fontFamily={FONT} fontSize={30} fill={MUTED}>tiga per empat</text>

      <text x={104} y={1560} fontFamily={FONT} fontSize={26} fill={MUTED}>
        wide front band · triangle fold at the right · cloth ends behind the ear
      </text>
    </svg>
  </AbsoluteFill>
);
