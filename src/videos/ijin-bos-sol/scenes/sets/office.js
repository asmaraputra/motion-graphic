import {
  E, V, S, mood, alpha, shade, mix, layer, blurLayer, backdrop,
  linGrad, glow, rr, seg, poly, circle,
} from '../../../../kit2d/engine/core.js';
import * as FX from '../../../../kit2d/engine/fx2d.js';

export function office(g, t, cam, { warm = false, desk = true } = {}) {
  const M = mood(warm ? 'interiorWarm' : 'night');
  const GY = E.H * V(0.8, 0.68);
  const wx = E.W * V(0.18, 0.08), wy = E.H * V(0.12, 0.16);
  const ww = E.W * V(0.65, 0.84), wh = GY - wy - V(58, 75);
  const lx = E.W * 0.76, ly = E.H * V(0.25, 0.25);

  layer(g, cam, 0.15, () => {
    backdrop(g, M.sky);
    if (warm) FX.sun(g, lx, ly, V(32, 38), M.key, M.key, 5);
    else {
      FX.stars(g, t, { seed: 43, count: 34, area: [wx, wy, ww, wh * 0.5], color: M.key });
      FX.moon(g, lx, ly, V(27, 34), M.key);
    }
    FX.fog(g, GY - V(260, 360), V(200, 320), M.fog, 0.18);
  });
  blurLayer(g, 1.4, () => {
    FX.skyline(g, {
      seed: 37, x: -E.W * 0.3, y: GY - V(30, 70), w: E.W * 1.6,
      minH: V(80, 95), maxH: V(220, 310), minW: V(62, 68), maxW: V(125, 132),
      color: shade(M.ambient, -0.28), windowColor: alpha(M.practical, 0.34), lit: 0.29,
    });
    FX.skyline(g, {
      seed: 71, x: -E.W * 0.3, y: GY + V(14, 20), w: E.W * 1.6,
      minH: V(35, 40), maxH: V(125, 160), minW: V(80, 85), maxW: V(160, 175),
      color: shade(M.dark, 0.08), windowColor: alpha(M.practical, 0.28), lit: 0.23,
    });
  }, cam, 0.32);

  layer(g, cam, 0.56, () => {
    // Wall masks retain a real opening while sky, skyline, and frame move at different depths.
    g.fillStyle = shade(M.wall, -0.25);
    g.fillRect(-E.W, -E.H, E.W * 3, E.H + wy);
    g.fillRect(-E.W, wy, E.W + wx, E.H * 3);
    g.fillRect(wx + ww, wy, E.W * 2, E.H * 3);
    g.fillRect(wx, wy + wh, ww, E.H * 2);
    FX.windowFrame(g, {
      x: wx, y: wy, w: ww, h: wh, cols: V(4, 3), rows: 1,
      frame: M.dark, bar: V(12, 14), blinds: V(11, 15),
    }, () => {});
    rr(g, wx - 20, wy + wh, ww + 40, V(15, 22), 4);
    g.fillStyle = mix(M.wall, M.rim, 0.12); g.fill();
    seg(g, [[wx - 18, wy + wh], [wx + ww + 18, wy + wh]], 3, alpha(M.rim, 0.25));
    // Tilted blind slats echo the diagonal paper ribbons used by the story.
    for (let i = 0; i < 5; i++) {
      const yy = wy + 30 + i * V(23, 28);
      poly(g, [[wx, yy], [wx + ww, yy - 5], [wx + ww, yy + 8], [wx, yy + 13]], alpha(M.dark, 0.46));
    }
    seg(g, [[wx + ww - 26, wy + 10], [wx + ww - 26, wy + V(140, 220)]], 2, alpha(M.rim, 0.3));
    circle(g, wx + ww - 26, wy + V(140, 220), 4, M.dark);
  });

  layer(g, cam, 0.84, () => {
    g.fillStyle = linGrad(g, 0, GY, 0, E.H * 1.25, [M.floor, shade(M.floor, -0.55)]);
    g.fillRect(-E.W, GY, E.W * 3, E.H * 2);
    seg(g, [[-E.W, GY], [E.W * 2, GY]], V(9, 12), shade(M.dark, 0.05));
    FX.floorLines(g, GY + 30, E.H * 1.5, alpha(M.rim, 0.035), 0.18);
    FX.pool(g, E.W * 0.52, GY + V(18, 32), E.W * 0.55, V(80, 115), M.key, 0.17);
    const slant = V(160, 210);
    for (let i = 0; i < 3; i++) {
      const xx = wx + i * ww / 3;
      poly(g, [[xx, GY + 8], [xx + ww / 3 - 18, GY + 8], [xx + ww / 3 + slant, GY + V(155, 220)], [xx + slant, GY + V(155, 220)]], alpha(M.key, 0.025));
    }
    if (desk) {
      // Keep furniture below the acting plane and right of the watermark reserve.
      const dx = E.W * V(0.68, 0.57), dy = GY + V(54, 85);
      const dw = E.W * V(0.35, 0.51), dh = V(100, 150);
      rr(g, dx, dy, dw, dh, 7); g.fillStyle = shade(M.wall, -0.38); g.fill();
      rr(g, dx - 14, dy - 13, dw + 28, V(17, 23), 5); g.fillStyle = mix(M.wall, M.key, 0.13); g.fill();
      seg(g, [[dx - 8, dy - 12], [dx + dw + 8, dy - 12]], 2, alpha(M.rim, 0.25));
      seg(g, [[dx + dw * 0.65, dy + 20], [dx + dw * 0.65, dy + dh - 12]], 2, alpha(M.dark, 0.5));
      seg(g, [[dx + dw * 0.73, dy + 28], [dx + dw * 0.85, dy + 28]], 4, alpha(M.rim, 0.18));
      // Unlit, angled monitor: dressing only; the window remains the single key light.
      const mx = dx + dw * 0.49, my = dy - V(88, 110);
      poly(g, [[mx - 60, my - 15], [mx + 66, my - 4], [mx + 57, my + 62], [mx - 67, my + 50]], M.dark);
      poly(g, [[mx - 50, my - 7], [mx + 56, my + 2], [mx + 49, my + 51], [mx - 57, my + 42]], mix(M.dark, M.ambient, 0.3));
      seg(g, [[mx, my + 51], [mx - 2, dy - 18]], 8, M.dark);
      seg(g, [[mx - 29, dy - 17], [mx + 29, dy - 17]], 7, M.dark);
      rr(g, dx + 25, dy - 26, 65, 9, 2); g.fillStyle = mix(M.wall, M.key, 0.22); g.fill();
      rr(g, dx + 21, dy - 32, 65, 7, 2); g.fillStyle = mix(M.wall, M.key, 0.3); g.fill();
    }
  });

  layer(g, cam, 0.92, () => {
    FX.godRays(g, lx, ly, {
      t, count: 3, angle: 1.95, spread: 0.42, len: E.H * 0.65,
      width: 0.035, color: M.key, a: 0.032,
    });
    FX.dust(g, t, {
      seed: 108, count: 26, area: [wx, wy + 40, ww, GY - wy - 40],
      color: M.rim, size: V(1.4, 2.1), speed: 9, a: 0.2,
    });
    glow(g, lx, ly, V(95, 140), M.key, 0.04);
  });
  return { GY, M };
}

export function foreground(g, t, cam, { warm = false } = {}) {
  const M = mood(warm ? 'interiorWarm' : 'night');
  blurLayer(g, V(9, 12), () => {
    // Edge-only shapes leave x100..400 / y1550..1600 clear for the watermark.
    g.fillStyle = alpha(M.dark, 0.92);
    g.fillRect(-E.W, -E.H, E.W + V(30, 26), E.H * 3);
    const px = E.W * 1.045, py = E.H * V(1.08, 0.96);
    const sway = Math.sin(t * 0.55) * 3;
    poly(g, [[px - 48, py - 108], [px + 48, py - 108], [px + 30, py], [px - 29, py]], shade(M.wall, -0.55));
    for (let i = 0; i < 5; i++) {
      const top = py - V(250, 340) - i * 32;
      const tip = px - 22 - (i % 2 ? -23 : 33) + sway;
      seg(g, [[px, py - 100], [tip, top]], 6, M.dark);
      g.fillStyle = M.dark; g.beginPath();
      g.ellipse(tip - 13, top + 14, V(25, 35), V(60, 78), -0.45 + i * 0.18, 0, Math.PI * 2); g.fill();
    }
    poly(g, [[-E.W, E.H * 1.02], [E.W * 2, E.H * 0.98], [E.W * 2, E.H * 2], [-E.W, E.H * 2]], alpha(S().ink, 0.6));
  }, cam, 1.65);
}
