import type {ReactNode} from 'react';
import {FONT} from '../../kit/brand';
import {k, EASE} from '../../kit/motion';

export const C = {
  bg: '#101E34', cream: '#F3EDDD', ink: '#16243B', blue: '#8FC4DD',
  teal: '#387D86', amber: '#F4BD65', muted: '#8EA1B7', panel: '#1A304A',
  roof: '#36516A', line: '#33475D', white: '#FFFFFF',
};

export const Arrow: React.FC<{x: number; y: number; angle?: number; length?: number; color?: string; opacity?: number}> =
({x, y, angle = 0, length = 120, color = C.amber, opacity = 1}) => (
  <g transform={`translate(${x} ${y}) rotate(${angle})`} opacity={opacity} fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round">
    <path d={`M0 0 H${length} m-22 -18 l22 18 -22 18`} />
  </g>
);

export const Moon: React.FC<{x: number; y: number; r?: number; ghost?: boolean}> = ({x, y, r = 68, ghost = false}) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r * 1.32} fill={C.cream} opacity={ghost ? 0 : 0.035} />
    <circle r={r} fill={ghost ? 'none' : C.cream} stroke={C.cream} strokeWidth={ghost ? 3 : 0} strokeDasharray={ghost ? '10 10' : undefined} opacity={ghost ? 0.4 : 1} />
    {!ghost && <g fill={C.muted} opacity={0.28}>
      <ellipse cx={-r * 0.3} cy={-r * 0.21} rx={r * 0.24} ry={r * 0.19} />
      <circle cx={r * 0.26} cy={r * 0.18} r={r * 0.19} />
      <circle cx={-r * 0.12} cy={r * 0.5} r={r * 0.1} />
    </g>}
  </g>
);

export const Window: React.FC<{x: number; y: number; scale?: number; opacity?: number}> = ({x, y, scale = 1, opacity = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
    <rect x={-135} y={-154} width={270} height={308} rx={8} fill={C.cream} />
    <rect x={-117} y={-136} width={234} height={272} fill={C.teal} />
    <path d="M-117 65 Q-30 4 117 62 V136 H-117Z" fill={C.roof} />
    <circle cx={67} cy={-78} r={24} fill={C.amber} />
    <path d="M0 -136 V136 M-117 0 H117" stroke={C.cream} strokeWidth={14} />
    <path d="M-150 161 H150" stroke={C.cream} strokeWidth={16} strokeLinecap="round" />
  </g>
);

export const Earth: React.FC<{x: number; y: number; r?: number; rotation?: number; observer?: boolean}> =
({x, y, r = 220, rotation = 0, observer = false}) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r + 19} fill="none" stroke={C.blue} strokeWidth={2} opacity={0.25} />
    <g transform={`rotate(${rotation})`}>
      <circle r={r} fill={C.teal} />
      <path d={`M${-r * 0.68} ${-r * 0.5} Q${-r * 0.3} ${-r * 0.95} ${r * 0.22} ${-r * 0.52} L${r * 0.13} ${-r * 0.15} ${-r * 0.18} ${r * 0.05} ${-r * 0.36} ${r * 0.6} ${-r * 0.68} ${r * 0.3}Z`} fill={C.blue} opacity={0.62} />
      <path d={`M${r * 0.38} ${r * 0.12} Q${r * 0.88} ${-r * 0.05} ${r * 0.67} ${r * 0.53} L${r * 0.35} ${r * 0.72} ${r * 0.18} ${r * 0.4}Z`} fill={C.blue} opacity={0.62} />
      <ellipse rx={r * 0.56} ry={r * 0.94} fill="none" stroke={C.cream} strokeWidth={2} opacity={0.18} />
      <ellipse rx={r * 0.94} ry={r * 0.34} fill="none" stroke={C.cream} strokeWidth={2} opacity={0.18} />
      {observer && <g transform={`translate(0 ${-r})`}>
        <path d="M0 0 L-95 -215 Q0 -250 95 -215Z" fill={C.amber} opacity={0.13} />
        <path d="M0 -25 V-196" stroke={C.amber} strokeWidth={5} strokeDasharray="8 11" />
        <circle r={15} fill={C.amber} stroke={C.bg} strokeWidth={5} />
        <circle r={30} fill="none" stroke={C.amber} strokeWidth={2} />
      </g>}
    </g>
  </g>
);

export const Roof: React.FC<{x?: number; y?: number; scale?: number}> = ({x = 255, y = 1300, scale = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path d="M-200 20 L0 -160 L220 20 V300 H-200Z" fill={C.panel} />
    <path d="M-225 35 L0 -160 L246 35" fill="none" stroke={C.roof} strokeWidth={24} strokeLinejoin="round" />
    <path d="M-125 125 H-35 V240 H-125Z M45 125 H135 V240 H45Z" fill={C.amber} opacity={0.6} />
    <path d="M10 125 V240" stroke={C.bg} strokeWidth={9} />
  </g>
);

export const Stars: React.FC<{t: number; shift?: number; opacity?: number}> = ({t, shift = 0, opacity = 1}) => (
  <g opacity={opacity}>
    {Array.from({length: 27}, (_, i) => (
      <circle key={i} cx={70 + ((i * 137 + 23 + shift) % 950)} cy={640 + (i * 83) % 690 + Math.sin(t * 0.35 + i) * 4} r={i % 4 === 0 ? 3.5 : 1.8} fill={C.cream} opacity={0.18 + 0.18 * (1 + Math.sin(t * 0.5 + i))} />
    ))}
  </g>
);

export const Label: React.FC<{x: number; y: number; children: ReactNode; color?: string; size?: number; anchor?: 'start' | 'middle' | 'end'}> =
({x, y, children, color = C.cream, size = 44, anchor = 'middle'}) => (
  <text x={x} y={y} fill={color} fontFamily={FONT} fontWeight={600} fontSize={size} textAnchor={anchor}>{children}</text>
);

export const Stage: React.FC<{t: number; a: number; b: number; children: ReactNode; mode?: 'push' | 'zoom' | 'morph'; first?: boolean}> =
({t, a, b, children, mode = 'push', first = false}) => {
  if (t < a - 0.25 || t >= b + 0.25) return null;
  // Incoming/outgoing illustrations overlap around the cut, never exposing an empty frame.
  const enter = first ? 1 : k(t, a - 0.25, a + 0.25, 0, 1);
  const leave = k(t, b - 0.25, b + 0.25, 0, 1, EASE.in);
  const x = mode === 'push' ? (1 - enter) * 180 - leave * 120 : 0;
  const scale = mode === 'zoom' ? 0.9 + 0.1 * enter + 0.06 * leave : 1;
  const float = mode === 'morph' ? 0 : Math.sin((t - a) * 1.5) * 4;
  return <g opacity={Math.min(enter, 1 - leave)} transform={`translate(${x} ${float}) translate(500 1100) scale(${scale}) translate(-500 -1100)`}>{children}</g>;
};
