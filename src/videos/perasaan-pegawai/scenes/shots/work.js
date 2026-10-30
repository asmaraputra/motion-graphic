import {V, S, layer, blurLayer, veil, registerShot, ease, prog, key, lerp, text, rr, alpha, seg, circle, ring, poly, FONTS} from '../../../../kit2d/engine/core.js';
import {drawFigure, POSES, posesAt, breathe} from '../../../../kit2d/engine/rig2d.js';
import * as UI from '../../../../kit2d/engine/ui2d.js';
import {factory, ground, stack, plywood} from '../sets/factory.js';
import {headline, worker} from './preview.js';
import {HERO, LEAD, PEER} from '../cast.js';

export function tag(g, str, x, y, a = 1, color = S().ui.cream, width = 650) {
  g.save(); g.globalAlpha = a;
  rr(g, x - width / 2, y - 46, width, 92, 22); g.fillStyle = alpha(S().ink, 0.94); g.fill();
  text(g, str, x, y, {size: 56, color, font: FONTS.ui, weight: 900}); g.restore();
}

export function carry(g, t, {x = 330, y = ground(), M, bad = false, s = 2.35, expr = 'neutral', facing = 1, lower = 0} = {}) {
  const base = {...POSES.holdFront, eF: [32, -146], hF: [50, -138 + lower], eB: [-25, -143], hB: [-40, -131 + lower]};
  const pose = breathe(base, t, 1.3);
  drawFigure(g, {x, y, s, facing, outfit: HERO, pose, expr, blink: t % 3.1 > 3, rim: {color: M.rim, dir: [0, -1], w: 4.5}});
  g.save(); g.translate(x, y); g.scale(s * facing, s);
  const dy = pose.hF[1] + 138;
  poly(g, [[-58, -148 + dy], [66, -156 + dy], [78, -144 + dy], [-46, -136 + dy]], M.key);
  poly(g, [[-46, -136 + dy], [78, -144 + dy], [78, -136 + dy], [-46, -128 + dy]], S().ui.gold);
  seg(g, [[-44, -132 + dy], [76, -140 + dy]], 1.5, alpha(M.dark, 0.55));
  if (bad) seg(g, [[0, -149 + dy], [18, -143 + dy], [4, -140 + dy]], 3, S().ui.accent);
  circle(g, pose.hF[0], pose.hF[1], 6, S().ink); circle(g, pose.hB[0], pose.hB[1], 5, S().ink);
  g.restore();
}

registerShot('pp02', {draw(g, t, info) {
  const p = ease.inOut(t / info.dur), cam = {z: 1.04 + 0.05 * p, x: -20 + 30 * p};
  const {M, GY} = factory(g, info.globalT, cam);
  layer(g, cam, 1, () => {
    worker(g, info.globalT, {M, x: 720, y: GY, outfit: PEER, facing: -1, s: 2.2, pose: POSES.relaxed});
    stack(g, 450, GY - 30, 600, 9);
    const q = ease.inOut(prog(t, 0.2, 1.6));
    plywood(g, lerp(110, 450, q), GY - 260 - Math.sin(q * Math.PI) * 70, 600, 28);
  });
  const second = t >= info.stackAt;
  headline(g, second ? ['TUMPUKAN RAPI?'] : ['PRODUKSI LANCAR?'], second ? t - info.stackAt : t, second ? info.dur - info.stackAt : info.stackAt, {size: 84});
  const at = second ? info.stackAt + 1.4 : 1.85;
  tag(g, second ? 'Biasa.' : 'Sepi.', 485, 650, ease.out(prog(t, at, at + 0.3)), S().ui.gold, 340);
}});

registerShot('pp03', {draw(g, t, info) {
  const macro = t < info.questionAt - 0.2;
  const cam = {z: 1.03 + 0.055 * ease.inOut(t / info.dur), x: -10 + Math.sin(t * 0.3) * 15};
  const {M, GY} = factory(g, info.globalT, cam);
  if (macro) {
    veil(g, S().ink, 0.25);
    layer(g, cam, 1, () => {
      plywood(g, 490, 1110, 760, 84, t >= info.defectAt, -0.06);
      if (t >= info.defectAt) {
        const p = ease.out(prog(t, info.defectAt, info.defectAt + 0.35));
        ring(g, 500, 1040, 72 + Math.sin(t * 2) * 4, 5 * p, S().ui.accent);
      }
    });
    headline(g, ['SATU LEMBAR', 'BERMASALAH.'], t, info.questionAt - 0.2, {color: S().ui.accent, size: 88});
  } else {
    layer(g, cam, 1, () => {
      carry(g, info.globalT, {M, x: 300, y: GY, bad: true, expr: 'worried'});
      worker(g, info.globalT + 0.9, {M, x: 720, y: GY, outfit: LEAD, facing: -1, pose: posesAt(t, [[0, 'stand'], [info.questionAt, 'point'], [info.attentionAt, 'think']]), expr: 'thinking', s: 2.5});
      stack(g, 870, GY - 25, 260, 4);
    });
    const a = ease.out(prog(t, info.questionAt - 0.2, info.questionAt + 0.15)) * (1 - ease.in(prog(t, info.questionEnd, info.questionEnd + 0.25)));
    g.save(); g.globalAlpha = a;
    UI.bubble(g, 550, 650 + Math.sin(t) * 5, {w: 620, h: 140, str: 'Siapa yang pegang?'}); g.restore();
    if (t >= info.attentionAt) headline(g, ['MENDADAK', 'PENGIN KENAL.'], t - info.attentionAt, info.dur - info.attentionAt, {size: 90});
  }
}});

registerShot('pp04', {draw(g, t, info) {
  const cam = {z: key(t, [[0,1.02],[info.checkAt,1.07],[info.fixAt,1.13],[info.dur,1.08]]), x: key(t, [[0,-30],[info.moveAt,0],[info.nextAt,30],[info.dur,35]])};
  const {M, GY} = factory(g, info.globalT, cam);
  const move = ease.inOut(prog(t, info.moveAt, info.moveAt + 1.6));
  const fix = ease.inOut(prog(t, info.fixAt, info.nextAt + 0.5));
  layer(g, cam, 1, () => {
    stack(g, 140, GY - 10, 300, 7);
    carry(g, info.globalT, {M, x: 300 + move * 140, y: GY, bad: t >= info.checkAt && fix < 0.95, expr: fix > 0.7 ? 'smile' : 'determined', lower: fix * 9});
    stack(g, 750, GY, 330, 6);
    if (fix > 0) {
      plywood(g, lerp(560, 760, fix), lerp(GY - 310, GY - 165, fix) - Math.sin(fix * Math.PI) * 45, 270, 23);
      ring(g, 530, GY - 345, 50 + Math.sin(t * 2) * 3, 3 * (1 - fix), S().ui.accent);
    }
  });
  const beats = t < info.checkAt ? ['NYUSUN.'] : t < info.moveAt + 1 ? ['NGECEK.'] : t < info.fixAt ? ['JAGA RITME KERJA.'] : ['DIBENERIN', 'SEBELUM LANJUT.'];
  const at = t < info.checkAt ? 0 : t < info.moveAt + 1 ? info.checkAt : t < info.fixAt ? info.moveAt : info.fixAt;
  headline(g, beats, t - at, info.dur - at, {size: 85});
}});

registerShot('pp05', {draw(g, t, info) {
  const reveal = ease.inOut(prog(t, info.smoothAt, info.guardAt + 1.4));
  const cam = {z: 1.14 - reveal * 0.12, x: 40 - reveal * 65};
  const {M, GY} = factory(g, info.globalT, cam);
  layer(g, cam, 1, () => {
    carry(g, info.globalT, {M, x: 300, y: GY, bad: t < info.doneAt, expr: 'neutral'});
    stack(g, 670, GY - 5, 450, 9);
  });
  // A shelf occludes the work, then slides away with the camera reveal.
  layer(g, {...cam, x: cam.x + reveal * 380}, 1.6, () => {
    g.fillStyle = alpha(M.dark, 0.94); g.fillRect(-180, 700, 430, 760);
    seg(g, [[-180,1000],[255,1000]], 18, alpha(M.key,0.14));
  });
  const at = t >= info.guardAt ? info.guardAt : t >= info.smoothAt ? info.smoothAt : 0;
  const lines = t >= info.guardAt ? ['ADA YANG', 'JAGAIN.'] : t >= info.smoothAt ? ['KERJAAN LANCAR.'] : ['NGGAK SEMPAT', 'LIHAT.'];
  headline(g, lines, t - at, info.dur - at, {size: 92, color: t >= info.guardAt ? S().ui.gold : S().ui.cream});
}});

registerShot('pp06', {draw(g, t, info) {
  const cam = {z: 1.06 + 0.035 * ease.inOut(t / info.dur), x: -15 + 15 * Math.sin(t * 0.22)};
  const {M, GY} = factory(g, info.globalT, cam);
  layer(g, cam, 1, () => {
    worker(g, info.globalT, {M, x: 430, y: GY, pose: posesAt(t, [[0, 'stand'],[info.askAt,'think']]), expr: 'nervous'});
    worker(g, info.globalT + 1, {M, x: 760, y: GY, s: 1.7, outfit: PEER, facing: -1, pose: POSES.crossArms, expr: 'thinking'});
    stack(g, 760, GY - 15, 320, 7);
  });
  blurLayer(g, 7, () => worker(g, info.globalT + 0.6, {M, x: V(150, -35), y: GY + 260, s: V(3,4.1), outfit: LEAD, pose: POSES.point, expr: 'neutral'}), cam, 1.6);
  const at = t >= info.waitAt ? info.waitAt : t >= info.askAt ? info.askAt : 0;
  headline(g, t >= info.waitAt ? ['KERJAAN BERIKUTNYA', 'MASIH NUNGGU.'] : t >= info.askAt ? ['INGAT URUTANNYA.'] : ['BARU RAMAI.'], t - at, info.dur - at, {size: 82});
  if (t >= info.waitAt) tag(g, 'MASIH NUNGGU.', 490, 1510, ease.out(prog(t, info.waitAt, info.waitAt + 0.35)), S().ui.gold, 680);
}});
