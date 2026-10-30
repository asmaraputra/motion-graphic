import {E, V, S, mood, layer, backdrop, linGrad, shade, alpha, seg, poly, glow} from '../../../../kit2d/engine/core.js';
import * as FX from '../../../../kit2d/engine/fx2d.js';

export const ground = () => E.H * V(0.8, 0.715);

export function plywood(g, x, y, w = 320, h = 34, bad = false, angle = 0) {
  const M = mood('interiorWarm');
  g.save(); g.translate(x, y); g.rotate(angle);
  poly(g, [[-w / 2, -h], [w / 2 - 30, -h - 20], [w / 2, -h - 6], [-w / 2 + 30, 14 - h]], shade(M.key, -0.18));
  poly(g, [[-w / 2 + 30, 14 - h], [w / 2, -h - 6], [w / 2, 0], [-w / 2 + 30, 20]], shade(M.key, -0.48));
  for (let i = 0; i < 3; i++) seg(g, [[-w / 2 + 36, 2 + i * 5], [w / 2 - 3, -16 + i * 5]], 1.5, alpha(M.dark, 0.35));
  if (bad) seg(g, [[25, -h + 1], [2, -h + 11], [33, -h + 12], [8, -h + 22]], 5, S().ui.accent);
  g.restore();
}

export function stack(g, x, y, w = 360, count = 7, bad = false) {
  for (let i = 0; i < count; i++) plywood(g, x, y - i * 22, w, 25, bad && i === count - 1);
  const M = mood('interiorWarm');
  for (const dx of [-w * 0.3, w * 0.3]) {
    g.fillStyle = shade(M.floor, -0.4); g.fillRect(x + dx - 22, y + 18, 44, 34);
  }
}

export function factory(g, t, cam, {warm = false, foreground = true} = {}) {
  const M = mood(warm ? 'interiorWarm' : 'interiorCool'), GY = ground();
  layer(g, cam, 0.15, () => backdrop(g, M.sky));
  layer(g, cam, 0.5, () => {
    g.fillStyle = shade(M.wall, -0.23); g.fillRect(-E.W, -E.H, E.W * 3, GY + E.H);
    const wx = V(450, 180), wy = V(130, 570), ww = V(850, 740), wh = V(420, 650);
    FX.windowFrame(g, {x: wx, y: wy, w: ww, h: wh, cols: 4, rows: 2, frame: shade(M.wall, -0.6), bar: 14}, (ctx, x, y, w, h) => {
      ctx.fillStyle = linGrad(ctx, 0, y, 0, y + h, [shade(M.key, -0.12), shade(M.key, -0.45), M.ambient]);
      ctx.fillRect(x, y, w, h);
    });
    glow(g, wx + ww / 2, wy + wh / 2, ww * 0.7, M.key, 0.14);
    for (let i = -1; i < 5; i++) {
      const x = i * V(560, 400);
      seg(g, [[x, -150], [x, GY + 50]], V(24, 26), shade(M.wall, -0.45), 'butt');
      seg(g, [[x, V(120, 300)], [x + V(550, 390), V(190, 390)]], 20, shade(M.wall, -0.5));
    }
    seg(g, [[-300, GY - 80], [E.W + 300, GY - 80]], 8, alpha(M.key, 0.14));
  });
  layer(g, cam, 0.85, () => {
    g.fillStyle = linGrad(g, 0, GY, 0, E.H + 300, [M.floor, shade(M.dark, -0.3)]);
    g.fillRect(-E.W, GY, E.W * 3, E.H * 2);
    FX.floorLines(g, GY, E.H + 600, alpha(M.key, 0.09), 0.05);
    FX.pool(g, E.W * 0.5, GY + 25, V(480, 400), 70, M.key, 0.15);
    stack(g, V(1450, 840), GY - 55, V(440, 280), 7);
    stack(g, V(190, -110), GY - 10, V(390, 320), 5);
  });
  if (foreground) layer(g, cam, 1.65, () => {
    g.fillStyle = alpha(shade(M.dark, -0.45), 0.8);
    g.fillRect(-100, GY + 185, E.W + 200, 32);
    g.fillRect(E.W - 32, 0, 80, E.H + 400);
  });
  FX.dust(g, t, {count: 24, color: M.key, a: 0.17});
  return {M, GY};
}
