import { S, alpha, clamp, ease, lerp, mix, rr, seg, circle, poly } from '../../../kit2d/engine/core.js';

// Coordinates are centres; progress changes draft length, not the persistent device shell.
export function phone(g, {
  x, y, w = 380, h = 660, rotation = 0, progress = 1, urgent = 0, sent = 0, lines = 3,
} = {}) {
  const st = S(), ui = st.ui, p = clamp(progress), send = ease.inOut(clamp(sent));
  g.save();
  g.translate(x, y); g.rotate(rotation); g.scale(w / 380, h / 660);
  rr(g, -184, -318, 380, 660, 47); g.fillStyle = alpha(st.ink, 0.45); g.fill();
  rr(g, -190, -330, 380, 660, 47); g.fillStyle = mix(st.inkFar, ui.blueprint, 0.16); g.fill();
  rr(g, -183, -323, 366, 646, 42); g.fillStyle = st.ink; g.fill();
  rr(g, -170, -308, 340, 616, 31); g.fillStyle = mix(ui.bpBg, ui.blueprint, 0.12); g.fill();
  seg(g, [[-179, -271], [-179, 257]], 3, alpha(ui.blueprint, 0.48));
  rr(g, -49, -301, 98, 13, 7); g.fillStyle = st.ink; g.fill();
  circle(g, 35, -295, 3, alpha(ui.blueprint, 0.38));
  seg(g, [[-195, -202], [-195, -150]], 5, st.inkFar);
  seg(g, [[195, -182], [195, -117]], 5, st.inkFar);

  // Anonymous header: no invented sender, timestamp, or message text.
  circle(g, -126, -249, 18, alpha(ui.blueprint, 0.28));
  rr(g, -91, -258, 125, 11, 5); g.fillStyle = alpha(ui.cream, 0.72); g.fill();
  rr(g, -91, -237, 79, 6, 3); g.fillStyle = alpha(ui.blueprint, 0.32); g.fill();
  seg(g, [[-147, -209], [147, -209]], 2, alpha(ui.blueprint, 0.13));

  rr(g, -145, -173, 202, 68, 18); g.fillStyle = alpha(ui.blueprint, 0.12); g.fill();
  seg(g, [[-124, -150], [18, -150]], 8, alpha(ui.cream, 0.43));
  seg(g, [[-124, -129], [-27, -129]], 7, alpha(ui.cream, 0.25));

  const n = Math.max(0, Math.min(9, Math.floor(lines)));
  const rowH = Math.min(25, 142 / Math.max(1, n));
  const draftH = Math.max(60, n * rowH + 35);
  const draftY = lerp(65, -65, send);
  if (p > 0) {
    rr(g, -115, draftY, 257, draftH, 18);
    g.fillStyle = mix(alpha(ui.blueprint, 0.23), alpha(ui.good, 0.28), send); g.fill();
    for (let i = 0; i < n; i++) {
      const k = clamp(p * n - i);
      if (k <= 0) continue;
      const length = [204, 172, 127][i % 3] * k;
      seg(g, [[-94, draftY + 23 + i * rowH], [-94 + length, draftY + 23 + i * rowH]], 8, alpha(ui.cream, 0.7));
    }
  }
  if (urgent > 0) {
    g.save(); g.globalAlpha *= clamp(urgent) * (1 - send);
    rr(g, -122, 23, 131, 37, 15); g.fillStyle = ui.accent; g.fill();
    seg(g, [[-102, 41], [-21, 41]], 8, alpha(ui.cream, 0.9));
    g.restore();
  }
  rr(g, -147, 258, 294, 32, 16); g.fillStyle = alpha(ui.blueprint, 0.12); g.fill();
  seg(g, [[-127, 274], [76, 274]], 6, alpha(ui.blueprint, 0.23));
  circle(g, 123, 274, 17, mix(ui.blueprint, ui.good, send));
  if (send > 0.5) seg(g, [[116, 274], [121, 279], [131, 268]], 3, st.ink);
  else poly(g, [[117, 267], [131, 274], [117, 281], [120, 274]], st.ink);
  seg(g, [[-42, 301], [42, 301]], 5, alpha(ui.cream, 0.38));
  g.restore();
}

export function paper(g, {
  x, y, w = 500, h = 200, rotation = 0, progress = 1, lines = 3,
} = {}) {
  const st = S(), ui = st.ui, p = clamp(progress);
  const n = Math.max(0, Math.min(12, Math.floor(lines)));
  g.save(); g.translate(x, y); g.rotate(rotation);
  rr(g, -w / 2 + 8, -h / 2 + 12, w, h, Math.min(14, h * 0.08));
  g.fillStyle = alpha(st.ink, 0.34); g.fill();
  rr(g, -w / 2, -h / 2, w, h, Math.min(14, h * 0.08));
  g.fillStyle = mix(ui.cream, ui.gold, 0.06); g.fill();
  const fold = Math.min(w * 0.08, h * 0.2);
  poly(g, [[w / 2 - fold, -h / 2], [w / 2 - fold, -h / 2 + fold], [w / 2, -h / 2 + fold]], mix(ui.cream, st.inkFar, 0.2));
  seg(g, [[-w * 0.42, -h * 0.28], [-w * 0.42, h * 0.28]], Math.max(2, w * 0.005), alpha(ui.gold, 0.65));
  for (let i = 0; i < n; i++) {
    const k = clamp(p * n - i);
    if (k <= 0) continue;
    const yy = -h * 0.28 + (i + 0.5) * h * 0.56 / Math.max(1, n);
    const length = w * [0.65, 0.55, 0.7][i % 3] * k;
    seg(g, [[-w * 0.35, yy], [-w * 0.35 + length, yy]], Math.min(9, h * 0.3 / Math.max(1, n)), alpha(st.inkFar, 0.58));
  }
  g.restore();
}
