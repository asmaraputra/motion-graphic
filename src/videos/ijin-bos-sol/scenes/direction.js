import {E, V, S, FONTS, ease, prog, text, measure, rr, alpha, layer} from '../../../kit2d/engine/core.js';
import {office, foreground} from './sets/office.js';

export const enter = (t, a, d = 0.45) => ease.out(prog(t, a, a + d));
export const hold = (t, a, b) => enter(t, a) * (1 - ease.in(prog(t, b - 0.3, b)));
export const X = (n) => E.W * V(n / 1920, n / 1080);
export const Y = (n) => E.H * V(n / 1080, n / 1920);

export function room(g, t, info, {warm = false, desk = true, zoom = 0.04, drift = 12} = {}) {
  const p = ease.inOut(prog(t, 0, info.dur));
  const cam = {z: 1 + zoom * p, x: drift * p, y: -4 * p};
  return {...office(g, info.globalT, cam, {warm, desk}), cam};
}

export function finish(g, t, cam, warm = false) {
  foreground(g, t, cam, {warm});
}

/** Short text is measured in the actual loaded font, never clipped or ellipsized. */
export function words(g, rows, {x = 500, y = 300, size = 76, width = 750, color, p = 1, serif = false, backing = false} = {}) {
  if (p <= 0) return;
  const font = serif ? FONTS.serif : FONTS.title;
  const weight = serif ? 800 : 700;
  const fitted = Math.min(size, ...rows.map((row) => size * width / Math.max(1, measure(g, row, size, font, weight))));
  const gap = fitted * 1.14;
  g.save();
  g.globalAlpha *= p;
  g.translate(X(x), Y(y) + (1 - p) * 24);
  if (backing) {
    rr(g, -width / 2 - 12, -fitted * 0.7, width + 24, gap * rows.length + 12, 24);
    g.fillStyle = alpha(S().ink, 0.9); g.fill();
  }
  rows.forEach((row, i) => text(g, row, 0, i * gap, {size: fitted, font, weight, italic: serif, color: color || S().ui.cream, stroke: 4, strokeColor: S().ink}));
  g.restore();
}

export function caption(g, rows, t, a, b, options = {}) {
  words(g, rows, {...options, p: hold(t, a, b)});
}

export function check(g, x, y, p, color = S().ui.good) {
  g.save(); g.translate(X(x), Y(y));
  g.strokeStyle = color; g.lineWidth = 12; g.lineCap = 'round'; g.lineJoin = 'round';
  g.beginPath(); g.moveTo(-32, 0);
  g.lineTo(-32 + 25 * Math.min(1, p * 3), 24 * Math.min(1, p * 3));
  if (p > 1 / 3) g.lineTo(-7 + 55 * (p - 1 / 3) * 1.5, 24 - 65 * (p - 1 / 3) * 1.5);
  g.stroke(); g.restore();
}

export function world(g, cam, draw) {
  layer(g, cam, 1, draw);
}
