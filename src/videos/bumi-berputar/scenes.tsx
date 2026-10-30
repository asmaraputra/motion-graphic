import {k, EASE, life} from '../../kit/motion';
import {Arrow, C, Earth, Label, Moon, Roof, Stage, Stars, Window} from './art';
import {AUDIO_SECONDS, CUES as Q} from './timeline';
import {recapLayers} from './recap-motion';

export const Yard: React.FC<{t: number}> = ({t}) => {
  const move = k(t, Q.MOON_SHIFT, 10, 0, 1, EASE.inOut);
  return <Stage t={t} a={0} b={Q.WINDOW} first>
    <Stars t={t} shift={-move * 35} />
    <circle cx={780} cy={900} r={245} fill={C.panel} opacity={0.4} />
    <Moon x={765 - move * 170} y={865 - move * 50} r={95} />
    <Roof x={330} y={1390} scale={1.3} />
    <path d="M0 1560 Q480 1470 1080 1520 V1920 H0Z" fill={C.panel} />
    <path d="M100 1560 Q490 1500 960 1545" stroke={C.roof} strokeWidth={2} fill="none" />
    <g opacity={k(t, Q.CONFIRM, 2.7, 0, 1)}>
      <path d="M405 1220 L765 865" stroke={C.blue} strokeWidth={3} strokeDasharray="9 13" opacity={0.5} />
      <circle cx={405} cy={1220} r={13} fill={C.amber} />
      <Label x={470} y={1438} size={46}>Halaman yang sama</Label>
    </g>
    <g opacity={life(t, Q.WHY, Q.WINDOW, 0.15, 0.1)}>
      <rect x={240} y={1000} width={500} height={150} rx={75} fill={C.amber} />
      <Label x={490} y={1096} color={C.ink} size={68}>Kok bisa?</Label>
    </g>
  </Stage>;
};

export const WindowDemo: React.FC<{t: number}> = ({t}) => {
  const turn = k(t, Q.TURN, 16.45, 0, 42, EASE.inOut);
  const view = k(t, Q.VIEW, Q.LEFT + 0.7, 0, 1, EASE.inOut);
  const focus = k(t, Q.FIXED, 21.2, 0, 1);
  return <Stage t={t} a={Q.WINDOW} b={Q.EARTH} mode="zoom">
    <circle cx={500} cy={1050} r={330} fill={C.panel} />
    <ellipse cx={500} cy={1240} rx={315} ry={70} fill={C.roof} opacity={0.3} />
    <path d="M250 1080 H750" stroke={C.roof} strokeWidth={3} />
    <Window x={500} y={886} scale={0.63 + focus * 0.04} />
    <g opacity={k(t, Q.FIXED, 20.65, 0, 1)}>
      <path d="M375 786 H316 V945 H375" fill="none" stroke={C.amber} strokeWidth={5} />
      <Label x={278} y={865} size={38} color={C.amber}>tetap</Label>
    </g>
    <g transform={`translate(500 1195) rotate(${turn})`}>
      <path d="M0 0 L-100 -220 Q0 -270 100 -220Z" fill={C.blue} opacity={0.17} />
      <path d="M0 -30 V-240" stroke={C.blue} strokeWidth={5} strokeDasharray="10 12" />
      <path d="M-32 12 Q-43 -28 0 -41 Q43 -28 32 12Z" fill={C.amber} />
      <circle r={21} fill={C.cream} />
    </g>
    <g opacity={k(t, Q.TURN, 14.75, 0, 1)}>
      <path d="M565 1130 Q655 1185 600 1250" stroke={C.amber} strokeWidth={6} fill="none" />
      <Arrow x={607} y={1244} angle={135} length={27} />
      <Label x={727} y={1220} color={C.amber} size={42}>kanan</Label>
    </g>
    <Label x={500} y={1290} size={38}>Pengamat dari atas</Label>
    <g opacity={k(t, Q.VIEW, 17.05, 0, 1)}>
      <rect x={180} y={1320} width={640} height={126} rx={22} fill={C.cream} />
      <Window x={500 - view * 140} y={1383} scale={0.33} />
      <Arrow x={718} y={1383} angle={180} length={100} color={C.teal} opacity={view} />
      <Label x={500} y={1492} size={36} color={C.muted}>Yang terlihat di pandanganmu</Label>
    </g>
  </Stage>;
};

export const Rotation: React.FC<{t: number}> = ({t}) => {
  const firstTurn = k(t, Q.OBSERVER, Q.DAY, -12, -82, EASE.inOut);
  const dayTurn = k(t, Q.DAY, 38.6, 0, -360, EASE.inOut);
  const rotation = firstTurn + dayTurn;
  return <Stage t={t} a={Q.EARTH} b={Q.MATCH} mode="zoom">
    <Stars t={t} />
    <circle cx={505} cy={1110} r={328} stroke={C.line} strokeWidth={2} fill="none" />
    <circle cx={505} cy={1110} r={294} stroke={C.line} strokeWidth={2} strokeDasharray="4 14" fill="none" />
    <Earth x={505} y={1110} r={235} rotation={rotation} observer />
    <Moon x={810} y={744} r={54} />
    <g opacity={k(t, Q.LOOK, 29.45, 0, 1)}>
      <path d="M195 1020 Q142 1110 195 1200" stroke={C.amber} strokeWidth={6} fill="none" />
      <Arrow x={194} y={1198} angle={37} length={35} />
    </g>
    <Label x={500} y={1435} color={C.blue} size={48}>Titik pengamat ikut Bumi</Label>
    <Label x={500} y={1490} color={C.muted} size={34}>Skema gerak, bukan skala sebenarnya</Label>
  </Stage>;
};

export const Match: React.FC<{t: number}> = ({t}) => {
  const p = k(t, 40.8, Q.MOON + 0.25, 0, 1, EASE.inOut);
  return <Stage t={t} a={Q.MATCH} b={Q.HORIZON} mode="morph">
    <Stars t={t} />
    <path d="M100 1320 Q500 1160 970 1320" fill="none" stroke={C.roof} strokeWidth={4} />
    <g transform={`translate(${620 - p * 150} ${1035 - p * 80})`}>
      <Window x={0} y={0} scale={1 - p * 0.3} opacity={1 - p} />
      <g opacity={p}><Moon x={0} y={0} r={110} /></g>
    </g>
    <circle cx={500} cy={1330} r={22} fill={C.amber} />
    <path d="M500 1305 L610 1040" stroke={C.blue} strokeWidth={5} strokeDasharray="9 12" opacity={1 - p} />
    <path d="M500 1305 L470 960" stroke={C.blue} strokeWidth={5} strokeDasharray="9 12" opacity={p} />
    <Arrow x={720} y={1200} angle={180} length={200} color={C.amber} />
    <Label x={500} y={1490} color={C.muted} size={44}>Yang berubah: arah pandang</Label>
  </Stage>;
};

export const Horizon: React.FC<{t: number}> = ({t}) => {
  const p = k(t, 44, 46.55, 0, 1, EASE.inOut);
  const x = 170 + p * 660;
  const y = 1220 - 4 * p * (1 - p) * 310;
  return <Stage t={t} a={Q.HORIZON} b={Q.ORBIT} mode="push">
    <Stars t={t} />
    <path d="M170 1220 Q500 600 830 1220" stroke={C.blue} strokeWidth={4} fill="none" strokeDasharray="8 14" />
    <path d="M90 1240 H960" stroke={C.roof} strokeWidth={5} />
    <Moon x={x} y={y} r={59} />
    <Arrow x={460} y={870} length={110} color={C.blue} />
    <Label x={220} y={1340} size={56} color={C.amber}>timur</Label>
    <Label x={780} y={1340} size={56} color={C.amber}>barat</Label>
    <Roof x={480} y={1530} scale={0.63} />
    <Label x={500} y={1465} size={36} color={C.muted}>Lintasan tampak, dipercepat</Label>
  </Stage>;
};

export const Orbit: React.FC<{t: number}> = ({t}) => {
  const a = k(t, Q.ORBIT_MOVE, 51.7, -1.15, 0.18, EASE.inOut);
  return <Stage t={t} a={Q.ORBIT} b={Q.TEST} mode="zoom">
    <Stars t={t} />
    <ellipse cx={500} cy={1110} rx={315} ry={220} fill="none" stroke={C.blue} strokeWidth={4} strokeDasharray="8 14" />
    <Earth x={500} y={1110} r={140} rotation={-(t - Q.ORBIT) * 10} />
    <Moon x={500 + Math.cos(a) * 315} y={1110 + Math.sin(a) * 220} r={58} />
    <Arrow x={795} y={1090} angle={84} length={75} />
    <Label x={500} y={1420} size={48}>Mengelilingi Bumi</Label>
    <Label x={500} y={1485} size={34} color={C.muted}>Ukuran dan laju disederhanakan</Label>
  </Stage>;
};

export const Experiment: React.FC<{t: number}> = ({t}) => {
  const p = k(t, Q.REVEAL, 65.4, 0, 1, EASE.inOut);
  const mark = k(t, Q.MARK, 56.7, 0, 1);
  const mx = 730 - p * 265, my = 870 - p * 95;
  return <Stage t={t} a={Q.TEST} b={Q.RECAP} mode="morph">
    {/* Fixed viewpoint: neither the roof nor the camera drifts during comparison. */}
    <Stars t={t} />
    <Moon x={mx} y={my} r={73} />
    <Roof x={290} y={1390} scale={1.24} />
    <path d="M0 1590 Q450 1500 1080 1560 V1920 H0Z" fill={C.panel} />
    <g opacity={mark}>
      <path d="M290 1192 L730 870" fill="none" stroke={C.amber} strokeWidth={3} strokeDasharray="9 12" />
      <circle cx={290} cy={1192} r={10} fill={C.amber} />
      <circle cx={730} cy={870} r={94} fill="none" stroke={C.amber} strokeWidth={3} strokeDasharray="10 12" />
      <Label x={738} y={1035} size={40} color={C.amber}>posisi awal</Label>
    </g>
    <g opacity={p}>
      <path d="M625 793 Q560 751 514 773" stroke={C.blue} strokeWidth={5} fill="none" />
      <Arrow x={523} y={766} angle={160} length={35} color={C.blue} />
      <Label x={452} y={958} size={40} color={C.blue}>posisi baru</Label>
    </g>
    <g opacity={k(t, Q.SAME, 63.1, 0, 1)}>
      <ellipse cx={724} cy={1445} rx={65} ry={20} fill="none" stroke={C.cream} strokeWidth={3} />
      <circle cx={724} cy={1444} r={8} fill={C.cream} />
      <Label x={670} y={1525} size={36}>Titik berdiri tetap</Label>
    </g>
  </Stage>;
};

export const Recap: React.FC<{t: number}> = ({t}) => {
  const follow = k(t, Q.FOLLOW, 79.8, 0, 1);
  const layers = recapLayers(follow);
  const drift = k(t, Q.SLOW, 84.2, 0, 1, EASE.inOut);
  return <Stage t={t} a={Q.RECAP} b={Q.CTA} mode="zoom">
    <Stars t={t} />
    <g opacity={layers.earthOpacity}>
      <Earth x={500} y={layers.earthY} r={230} rotation={-(t - Q.RECAP) * 13} observer />
      <Label x={500} y={1480} color={C.blue} size={48}>Rotasi mengubah arah hadap</Label>
    </g>
    <Moon x={757 - drift * 75} y={835 - drift * 20} r={77} />
    {/* The moon bridges two viewpoints; do not slide the globe behind the house. */}
    <g transform={`translate(${layers.roofX} ${layers.roofY})`} opacity={layers.roofOpacity}>
      <Roof x={310} y={1420} scale={1.1} />
      <path d="M100 1550 H1000" stroke={C.roof} strokeWidth={4} />
    </g>
    <g opacity={layers.roofOpacity}>
      <Label x={500} y={1060} size={40} color={C.muted}>Kesan mengikuti</Label>
      <Label x={500} y={1120} size={40} color={C.muted}>bukan berarti diam</Label>
    </g>
  </Stage>;
};

export const Closing: React.FC<{t: number}> = ({t}) => <Stage t={t} a={Q.CTA} b={AUDIO_SECONDS} mode="morph">
  <Stars t={t} />
  <Moon x={500} y={965 + Math.sin(t * 1.1) * 5} r={154} />
  <circle cx={500} cy={965} r={235} fill="none" stroke={C.line} strokeWidth={2} />
  <circle cx={500} cy={965} r={270} fill="none" stroke={C.line} strokeWidth={2} strokeDasharray="5 17" />
  <g opacity={k(t, Q.CTA + 0.25, Q.CTA + 0.7, 0, 1)}>
    <rect x={200} y={1300} width={600} height={125} rx={62} fill={C.amber} />
    <Label x={460} y={1380} color={C.ink} size={53}>Lihat video lain</Label>
    <Arrow x={708} y={1363} length={40} color={C.ink} />
  </g>
</Stage>;
