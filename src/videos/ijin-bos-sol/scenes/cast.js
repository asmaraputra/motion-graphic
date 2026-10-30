import { E, S, mood } from '../../../kit2d/engine/core.js';
import { POSES, breathe, drawFigure } from '../../../kit2d/engine/rig2d.js';
import { phone as drawPhone } from './props.js';

export const employee = { top: 'tshirt', color: '#3a6ea5', head: 'none' };
export const boss = { top: 'suit', color: '#0e0b12', color2: '#f2c21a', head: 'none' };

export function actor(g, t, {
  x, y, s = 2.4, boss: isBoss = false, pose = 'stand', expr = 'neutral',
  phone = false, facing = 1, talk = 0, alpha = 1, M = mood('night'),
}) {
  const p = breathe(typeof pose === 'string' ? POSES[pose] || POSES.stand : pose, t, 1, isBoss ? 2.7 : 0.4);
  const blinkPeriod = isBoss ? 3.73 : 3.17;
  drawFigure(g, {
    x, y, s, facing, pose: p, outfit: isBoss ? { ...boss, color: S().ink } : employee,
    expr, talk, alpha, blink: ((t + (isBoss ? 0.8 : 0)) % blinkPeriod) > blinkPeriod - 0.12,
    rim: { color: M.rim, dir: [x < E.W * 0.76 ? 0.65 : -0.65, -0.75], w: S().rimWidth },
  });
  if (phone) {
    g.save();
    g.globalAlpha *= alpha;
    drawPhone(g, {
      x: x + (p.hF[0] + 5) * facing * s,
      y: y + (p.hF[1] - 12) * s,
      w: 16 * s, h: 29 * s, rotation: facing * -0.06,
    });
    g.restore();
  }
}
