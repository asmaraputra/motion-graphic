import {E, V, S, registerShot, talkAmount, layer, blurLayer, veil, ease, prog, text, measure, alpha, rr, seg, FONTS} from '../../../../kit2d/engine/core.js';
import {drawFigure, POSES, posesAt, breathe, bigFace} from '../../../../kit2d/engine/rig2d.js';
import * as FX from '../../../../kit2d/engine/fx2d.js';
import * as UI from '../../../../kit2d/engine/ui2d.js';
import {factory, stack, ground} from '../sets/factory.js';
import {HERO, LEAD, PEER} from '../cast.js';

export function headline(g, lines, t, dur, {y = V(160, 330), instant = false, color = S().ui.cream, size = V(80, 96)} = {}) {
  const x = V(E.W / 2, 485), maxW = V(E.W - 250, 740);
  for (let i = 0; i < lines.length; i++) {
    const k = instant ? 1 : ease.out(prog(t, i * 0.1, i * 0.1 + 0.45));
    const exit = 1 - ease.in(prog(t, dur - 0.28, dur));
    const sz = Math.min(size, size * maxW / Math.max(1, measure(g, lines[i], size)));
    text(g, lines[i], x, y + i * size * 1.12 + (1 - k) * 35, {size: sz, color, alpha: k * exit, align: 'center', spacing: 0});
  }
}

export function worker(g, t, {x = V(E.W * 0.4, 350), y = ground(), s = V(1.5, 2.5), facing = 1, outfit = HERO, pose = POSES.stand, expr = 'neutral', M, talk = 0} = {}) {
  drawFigure(g, {x, y, s, facing, outfit, pose: breathe(pose, t, 1.3), expr, talk, blink: t % 3.1 > 3.0, rim: {color: M.rim, dir: [0, -1], w: 4.5}});
}

registerShot('pp01', {draw(g, t, info) {
  const cam = {z: 1 + 0.07 * ease.inOut(t / info.dur), x: V(-10, -15) + 20 * ease.inOut(t / info.dur)};
  const {M, GY} = factory(g, info.globalT, cam);
  layer(g, cam, 1, () => {
    worker(g, t, {M, y: GY, pose: posesAt(t, [[0, 'holdFront'], [2.8, 'stand'], [5.2, 'think']]), expr: t < 4.8 ? 'neutral' : 'worried'});
    worker(g, t + 0.8, {M, x: V(1300, 810), y: GY, s: V(1, 1.55), outfit: PEER, facing: -1, pose: POSES.holdFront});
    stack(g, V(1000, 650), GY - 38, V(500, 370), 8, t > 5.6);
  });
  headline(g, ['PALING CEPAT', 'DISEBUT'], t, info.dur, {instant: true});
  if (t > 4.9) {
    const k = ease.out(prog(t, 4.9, 5.4));
    text(g, 'PAS ADA MASALAH.', V(E.W / 2, 485), V(380, 590) - 15 * (1 - k), {size: V(48, 58), font: FONTS.ui, weight: 900, color: S().ui.accent, alpha: k});
  }
}});

registerShot('pp07', {draw(g, t, info) {
  blurLayer(g, 12, () => factory(g, info.globalT, {z: 1.2, x: -30, y: -30}, {foreground: false}));
  veil(g, S().ink, 0.3);
  const r = V(290, 300) * (1 + 0.05 * ease.inOut(t / info.dur));
  const M = factoryMood();
  bigFace(g, V(E.W / 2, 485) + Math.sin(t * 0.8) * 5, E.H * V(0.59, 0.54), r, {outfit: HERO, expr: t < 2.8 ? 'worried' : 'nervous', rimColor: M.rim, rimSide: -1, blink: t % 2.9 > 2.8, tilt: -0.025 + 0.01 * Math.sin(t)});
  const silentAt = info.silentAt ?? 3;
  const first = t < silentAt;
  headline(g, first ? ['MAU JELASIN?'] : ['DIAM SAJA?'], first ? t : t - silentAt, first ? silentAt : info.dur - silentAt, {size: V(80, 90), y: V(150, 350)});
  const sub = first ? 'CARI ALASAN?' : 'MENGAKU SALAH?';
  const a = ease.out(prog(t, first ? 1 : 4, first ? 1.4 : 4.4));
  const sy = E.H * V(0.85, 0.755);
  g.save(); g.globalAlpha = a;
  rr(g, V(E.W / 2, 485) - V(340, 350), sy - 48, V(680, 700), 96, 24);
  g.fillStyle = alpha(S().ink, 0.92); g.fill();
  text(g, sub, V(E.W / 2, 485), sy, {size: V(48, 58), color: S().ui.cream, font: FONTS.ui, weight: 900});
  g.restore();
}});

// Local mood getter keeps style switching dynamic, not frozen at import time.
import {mood as factoryMoodBase} from '../../../../kit2d/engine/core.js';
const factoryMood = () => factoryMoodBase('interiorCool');

registerShot('pp10', {draw(g, t, info) {
  const cam = {z: 1 + 0.055 * ease.inOut(t / info.dur), x: -8 + 18 * ease.inOut(t / info.dur)};
  const {M, GY} = factory(g, info.globalT, cam, {warm: true});
  layer(g, cam, 1, () => {
    worker(g, t, {M, x: V(770, 340), y: GY, expr: t < 4 ? 'surprised' : 'smile', pose: posesAt(t, [[0, 'holdFront'], [3.7, 'relaxed']])});
    worker(g, t + 0.9, {M, x: V(1180, 720), y: GY, s: V(1.6, 2.4), outfit: LEAD, facing: -1, expr: 'smile', talk: talkAmount(info.globalT, info.shot.start + (info.thanksAt ?? 4.16), info.shot.start + (info.thanksEnd ?? 5.8)), pose: posesAt(t, [[0, 'stand'], [3.7, 'talk']])});
    stack(g, V(990, 535), GY + 5, V(340, 250), 5);
  });
  const a = ease.out(prog(t, 3.8, 4.25)) * (1 - ease.in(prog(t, 7, 7.3)));
  if (a > 0) {
    g.save(); g.globalAlpha = a;
    UI.bubble(g, V(1000, 600), V(380, 660) + Math.sin(t) * 4, {w: V(460, 470), h: V(130, 140), str: 'Makasih.'});
    g.restore();
    FX.rings(g, V(1000, 600), V(380, 660), t - 3.8, {count: 2, r0: 90, r1: 190, a: 0.08, color: M.key});
  }
  headline(g, t < 7.7 ? ['KERJAAN BERES.'] : ['DIANGGAP ADA.'], t < 7.7 ? t : t - 7.7, t < 7.7 ? 7.7 : info.dur - 7.7, {size: V(80, 88)});
  if (t > 5 && t < 7.7) {
    rr(g, V(650, 180), V(790, 1480), V(650, 610), 6, 3); g.fillStyle = alpha(M.key, 0.3); g.fill();
    seg(g, [[V(650, 180), V(790, 1480)], [V(650, 180) + V(650, 610) * ease.out(prog(t, 5, 7)), V(790, 1480)]], 4, S().ui.gold);
  }
}});
