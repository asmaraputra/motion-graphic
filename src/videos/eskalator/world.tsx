import {L, LC, N, REAR, RT, S_C, S_D, V, pathD, pt, rear, rot, stepS} from './geometry';

/** Neutral steel base; each accent has one job: orange = chain/drive, teal = rail/guide, yellow = focus. */
export const C = {
  bg: '#14181F',
  interior: '#1B212B',
  steel: '#66748A',
  steelLt: '#97A5BA',
  steelDk: '#3A4452',
  ink: '#222A35',
  line: '#D5DCE6',
  text: '#F4F0E8',
  dim: 'rgba(244,240,232,0.66)',
  orange: '#FF8A3D',
  teal: '#2AD4C4',
  yellow: '#FFD25A',
};

export type Look = {
  wipeX: number; // casing is drawn only right of this world x
  chain: number; // orange chain emphasis 0..1
  rail: number; // teal rail emphasis 0..1
  motor: number; // motor + drive opacity
  carry: number; // yellow glow under the carrying half
  dimCarry: number; // fade of the carrying half
  dimRet: number; // fade of the returning half
  comb: number; // yellow comb emphasis
  wheelF: number; // yellow front wheel ring
  wheelR: number; // yellow rear wheel ring
  hlI: number; // highlighted step index (-1 none)
  hlIA: number; // its amount 0..1
  hlRA: number; // amount for every step on the incline
};

const TD = 76; // tread depth
const EX = 16; // 2.5D extrusion offset of the depth side
const EY = -10;
const TURN = Math.PI * RT;
export const COMB_TOP = 1572;
export const COMB_BOT = 20;
export const Y_TOP = pt(LC).y - 30; // tread top at the upper landing
export const Y_BOT = pt(0).y - 30; // tread top at the lower landing

const LOOP = `${pathD(0, L, 0, 0, 8)}Z`;
const CARRY = pathD(0, LC, 0, 0, 8);
const RAIL_R = (() => {
  let d = '';
  for (let s = 0; s <= L; s += 8) {
    const p = rear(s);
    d += `${d ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
  }
  return `${d}Z`;
})();

const XL = -235;
const XR = 1965;
const HOUSING = (() => {
  const f = (x: number, y: number) => `${x.toFixed(1)} ${y.toFixed(1)}`;
  const top: string[] = [];
  for (let s = 0; s <= LC; s += 20) top.push(f(pt(s).x, pt(s).y + 20));
  const bot: string[] = [];
  for (let s = LC + TURN; s <= L - TURN; s += 20) bot.push(f(pt(s).x, pt(s).y + 58));
  const yb1 = pt(L - TURN).y + 58;
  return `M${f(XL, pt(0).y + 20)}L${top.join('L')}L${f(XR, pt(LC).y + 20)}L${f(XR, 760)}L${f(pt(LC + TURN).x, 760)}L${bot.join('L')}L${f(XL, yb1)}Z`;
})();

const Tread: React.FC<{top: string; front: string; side: string}> = ({top, front, side}) => (
  <g stroke={C.line} strokeWidth={2} strokeLinejoin="round">
    <rect x={-TD} y={-30} width={9} height={46} fill={front} />
    <polygon points={`${-TD},-30 ${-TD + EX},${-30 + EY} ${10 + EX},${-30 + EY} 10,-30`} fill={top} />
    <polygon points={`10,-30 ${10 + EX},${-30 + EY} ${10 + EX},${-16 + EY} 10,-16`} fill={side} />
    <rect x={-TD} y={-30} width={TD + 10} height={14} fill={front} />
  </g>
);

const Step: React.FC<{s: number; hl: number; wF: number; wR: number; dim: number}> = ({s, hl, wF, wR, dim}) => {
  const p = pt(s);
  const deg = (rot(s) * 180) / Math.PI;
  return (
    <g transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${deg.toFixed(2)})`} opacity={1 - dim}>
      <path d={`M-18 -16L0 0L${REAR.x} ${REAR.y}`} fill="none" stroke={C.steelDk} strokeWidth={7} strokeLinejoin="round" />
      <circle r={15} fill={C.ink} stroke={C.line} strokeWidth={4} />
      <circle cx={REAR.x} cy={REAR.y} r={15} fill={C.ink} stroke={C.line} strokeWidth={4} />
      {wF > 0 ? <circle r={19} fill="none" stroke={C.yellow} strokeWidth={7} opacity={wF} /> : null}
      {wR > 0 ? <circle cx={REAR.x} cy={REAR.y} r={19} fill="none" stroke={C.yellow} strokeWidth={7} opacity={wR} /> : null}
      <Tread top={C.steelLt} front={C.steel} side={C.steelDk} />
      {hl > 0 ? (
        <g opacity={hl}>
          <Tread top={C.yellow} front="#C79F3A" side="#8E7326" />
        </g>
      ) : null}
    </g>
  );
};

const Comb: React.FC<{x0: number; d: 1 | -1; y: number; amt: number}> = ({x0, d, y, amt}) => {
  const x1 = x0 + 32 * d;
  return (
    <g strokeLinejoin="round">
      <polygon points={`${x1},${y} ${x0},${y} ${x0 + EX},${y + EY} ${x1 + EX},${y + EY}`} fill={C.steelLt} stroke={C.line} strokeWidth={2} />
      {[1, 2, 3, 4, 5, 6].map((n) => (
        <line key={n} x1={x1 + (EX * n) / 7} y1={y + (EY * n) / 7} x2={x0 + (EX * n) / 7} y2={y + (EY * n) / 7} stroke={C.ink} strokeWidth={3} />
      ))}
      <polygon points={`${x0},${y} ${x1},${y} ${x1},${y + 6} ${x0},${y + 16}`} fill={C.steel} stroke={C.line} strokeWidth={2} />
      {amt > 0 ? (
        <g opacity={amt}>
          <polygon points={`${x1},${y} ${x0},${y} ${x0 + EX},${y + EY} ${x1 + EX},${y + EY}`} fill={C.yellow} stroke={C.line} strokeWidth={2} />
          <polygon points={`${x0},${y} ${x1},${y} ${x1},${y + 6} ${x0},${y + 16}`} fill="#C79F3A" stroke={C.line} strokeWidth={2} />
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <line key={n} x1={x1 + (EX * n) / 7} y1={y + (EY * n) / 7} x2={x0 + (EX * n) / 7} y2={y + (EY * n) / 7} stroke={C.ink} strokeWidth={3} />
          ))}
        </g>
      ) : null}
    </g>
  );
};

/** Channel rail: dark groove with a lit edge. glow fades the edge to teal. */
const Rail: React.FC<{d: string; glow: number; w: number}> = ({d, glow, w}) => (
  <g fill="none" strokeLinejoin="round">
    {glow > 0 ? <path d={d} stroke={C.teal} strokeWidth={w + 30} opacity={0.22 * glow} /> : null}
    <path d={d} stroke={C.steelDk} strokeWidth={w} />
    {glow > 0 ? <path d={d} stroke={C.teal} strokeWidth={w} opacity={glow} /> : null}
    <path d={d} stroke={C.interior} strokeWidth={w - 8} />
  </g>
);

const Sprocket: React.FC<{cx: number; cy: number; t: number; glow: number}> = ({cx, cy, t, glow}) => {
  const r = RT - 22;
  const a = ((V * t) / RT) * (180 / Math.PI);
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${a.toFixed(2)})`}>
      <circle r={r + 8} fill="none" stroke={C.steelLt} strokeWidth={10} strokeDasharray="9 9" />
      <circle r={r} fill={C.ink} stroke={C.steelLt} strokeWidth={5} />
      <line x1={-r} y1={0} x2={r} y2={0} stroke={C.steelLt} strokeWidth={4} />
      <line x1={0} y1={-r} x2={0} y2={r} stroke={C.steelLt} strokeWidth={4} />
      {glow > 0 ? (
        <g opacity={glow}>
          <circle r={r + 8} fill="none" stroke={C.orange} strokeWidth={10} strokeDasharray="9 9" />
          <circle r={r} fill="none" stroke={C.orange} strokeWidth={5} />
        </g>
      ) : null}
    </g>
  );
};

const HUB = {x: 1705, y: pt(LC).y + RT};
const SHAFT = {x: 1840, y: 640};

const Motor: React.FC<{t: number; amt: number}> = ({t, amt}) => {
  if (amt <= 0) return null;
  const a = ((V * t * 3) / RT) * (180 / Math.PI);
  return (
    <g opacity={amt}>
      <path d={`M${HUB.x} ${HUB.y - 22}L${SHAFT.x} ${SHAFT.y - 22}M${HUB.x} ${HUB.y + 22}L${SHAFT.x} ${SHAFT.y + 22}`} stroke={C.orange} strokeWidth={6} opacity={0.8} />
      <rect x={1790} y={560} width={150} height={160} rx={18} fill={C.steel} stroke={C.line} strokeWidth={3} />
      <polygon points="1790,560 1806,550 1956,550 1940,560" fill={C.orange} stroke={C.line} strokeWidth={3} strokeLinejoin="round" />
      <g transform={`translate(${SHAFT.x} ${SHAFT.y}) rotate(${a.toFixed(1)})`}>
        <circle r={30} fill={C.ink} stroke={C.orange} strokeWidth={6} />
        <line x1={-30} y1={0} x2={30} y2={0} stroke={C.orange} strokeWidth={5} />
      </g>
    </g>
  );
};

export const World: React.FC<{t: number; look: Look}> = ({t, look}) => {
  const order = Array.from({length: N}, (_, i) => ({i, s: stepS(i, t)})).sort((a, b) => a.s - b.s);
  const draw = ({i, s}: {i: number; s: number}) => {
    const inc = s >= S_C && s <= S_D ? look.hlRA : 0;
    const hl = Math.max(inc, i === look.hlI ? look.hlIA : 0);
    return <Step key={i} s={s} hl={hl} wF={i === look.hlI ? look.wheelF : 0} wR={i === look.hlI ? look.wheelR : 0} dim={s < LC ? look.dimCarry : look.dimRet} />;
  };
  return (
    <g>
      <path d={HOUSING} fill={C.interior} />
      {order.filter((o) => o.s >= LC).map(draw)}
      <Rail d={LOOP} glow={look.rail} w={38} />
      <Rail d={RAIL_R} glow={look.rail} w={30} />
      <path d={LOOP} fill="none" stroke={C.steelLt} strokeWidth={4} strokeDasharray="18 10" strokeDashoffset={-V * t} opacity={0.8} />
      {look.chain > 0 ? (
        <g fill="none">
          <path d={LOOP} stroke={C.orange} strokeWidth={22} opacity={0.2 * look.chain} />
          <path d={LOOP} stroke={C.orange} strokeWidth={9} strokeDasharray="18 10" strokeDashoffset={-V * t} opacity={look.chain} />
        </g>
      ) : null}
      <Sprocket cx={HUB.x} cy={HUB.y} t={t} glow={look.chain} />
      <Sprocket cx={pt(0).x} cy={pt(0).y + RT} t={t} glow={look.chain} />
      <Motor t={t} amt={look.motor} />
      {look.carry > 0 ? <path d={CARRY} fill="none" stroke={C.yellow} strokeWidth={90} strokeLinecap="round" opacity={0.18 * look.carry} /> : null}
      {order.filter((o) => o.s < LC).map(draw)}
      <clipPath id="casing">
        <rect x={look.wipeX} y={0} width={4000} height={2000} />
      </clipPath>
      <g clipPath="url(#casing)">
        <path d={HOUSING} fill={C.steelDk} stroke={C.line} strokeWidth={3} />
        <path d={HOUSING} fill="none" stroke={C.steel} strokeWidth={14} opacity={0.35} />
      </g>
      <path d={HOUSING} fill="none" stroke={C.line} strokeWidth={2} opacity={0.3} />
      <rect x={COMB_TOP} y={Y_TOP - 10} width={1200} height={80} fill="#2C3542" stroke={C.line} strokeWidth={2} />
      <rect x={-1500} y={Y_BOT - 10} width={COMB_BOT + 1500} height={80} fill="#2C3542" stroke={C.line} strokeWidth={2} />
      <Comb x0={COMB_TOP} d={-1} y={Y_TOP} amt={look.comb} />
      <Comb x0={COMB_BOT} d={1} y={Y_BOT} amt={look.comb} />
      <line x1={-1500} y1={Y_BOT - 10} x2={COMB_BOT} y2={Y_BOT - 10} stroke={C.line} strokeWidth={4} />
      <line x1={COMB_TOP} y1={Y_TOP - 10} x2={2700} y2={Y_TOP - 10} stroke={C.line} strokeWidth={4} />
    </g>
  );
};
