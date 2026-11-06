import {AbsoluteFill} from 'remotion';
import {FONT} from '../../kit/brand';
import {Blangkon, mixArm, type BlangkonMood, type BlangkonPose} from '../../kit/blangkon';
import {k, useT} from '../../kit/motion';

const INK = '#1A1714', MUTED = '#827A6C';
const MOODS: {mood: BlangkonMood; label: string}[] = [
  {mood: 'neutral', label: 'Netral'},
  {mood: 'happy', label: 'Gembira'},
  {mood: 'sad', label: 'Sedih'},
  {mood: 'angry', label: 'Marah'},
  {mood: 'surprised', label: 'Terkejut'},
  {mood: 'thinking', label: 'Berpikir'},
];
const POSES: {pose: BlangkonPose; label: string}[] = [
  {pose: 'wave', label: 'Menyapa'},
  {pose: 'sembah', label: 'Sembah'},
  {pose: 'explain', label: 'Menjelaskan'},
  {pose: 'point', label: 'Menunjuk'},
  {pose: 'bow', label: 'Membungkuk'},
  {pose: 'walk', label: 'Berjalan'},
];

const Card: React.FC = () => (
  <g stroke={INK} strokeWidth={3}>
    <rect x={-34} y={-24} width={68} height={48} rx={6} fill="#F0D58F" />
    <path d="M-20 -6 H20 M-20 6 H8" fill="none" />
  </g>
);

const Label: React.FC<{x: number; y: number; children: React.ReactNode}> = ({x, y, children}) => (
  <text x={x} y={y} textAnchor="middle" fontFamily={FONT} fontSize={38} fontWeight={600} fill={MUTED}>
    {children}
  </text>
);

/** Silent model sheet; isolated from every other composition. */
export const Sheet: React.FC = () => {
  const t = useT();
  const page = Math.min(2, Math.floor(t / 5));
  return (
    <AbsoluteFill style={{background: '#F6F2E9', overflow: 'hidden'}}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <text x={100} y={195} fontFamily={FONT} fontSize={72} fontWeight={800} fill={INK}>
          blangkon
        </text>
        <text x={104} y={263} fontFamily={FONT} fontSize={35} fill={MUTED}>
          {['01 / Ekspresi', '02 / Bahasa tubuh', '03 / Gerak dan pegangan'][page]}
        </text>
        <path d="M104 310 H955" stroke={INK} strokeOpacity={0.16} strokeWidth={2} />

        {page === 0
          ? MOODS.map(({mood, label}, i) => {
              const x = [240, 540, 840][i % 3];
              const y = i < 3 ? 940 : 1520;
              return (
                <g key={mood}>
                  <Blangkon x={x} y={y} s={0.72} mood={mood} idleOffset={i * 0.36} />
                  <Label x={x} y={y + 80}>{label}</Label>
                </g>
              );
            })
          : null}

        {page === 1
          ? POSES.map(({pose, label}, i) => {
              const x = [240, 540, 840][i % 3];
              const y = i < 3 ? 940 : 1520;
              return (
                <g key={pose}>
                  <Blangkon x={x} y={y} s={0.68} pose={pose} idleOffset={i * 0.36} />
                  <Label x={x} y={y + 80}>{label}</Label>
                </g>
              );
            })
          : null}

        {page === 2 ? (
          <>
            <path d="M105 1360 H955" stroke={INK} strokeWidth={2} strokeOpacity={0.18} />
            <Blangkon
              x={265 + k(t, 10, 12, 0, 100)}
              y={1360}
              s={1.15}
              mood="happy"
              walk={t < 12 ? (t - 10) * 1.5 : 0}
              armL="point"
              holdingHand="left"
              holding={<g transform="translate(16 4) scale(0.72)"><Card /></g>}
              armR={mixArm('idle', 'point', k(t, 12.4, 13.4, 0, 1))}
            />
            <Blangkon x={805} y={1360} s={0.78} flip pose="wave" idleOffset={0.7} />
            <Label x={355} y={1470}>Pegangan kiri</Label>
            <Label x={805} y={1470}>Flip + sapa</Label>
            <text x={105} y={1600} fontFamily={FONT} fontSize={32} fill={MUTED}>
              walk · mixArm · holding · flip · look · dip
            </text>
          </>
        ) : null}

        <text x={105} y={1740} fontFamily={FONT} fontSize={29} fill={MUTED}>
          SVG vektor / 15 pose / tanpa audio
        </text>
      </svg>
    </AbsoluteFill>
  );
};
