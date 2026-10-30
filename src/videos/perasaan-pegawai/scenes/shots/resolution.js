import {S, registerShot, layer, veil, ease, prog, lerp, text, alpha, rr, seg, circle, poly, talkAmount, FONTS} from '../../../../kit2d/engine/core.js';
import {POSES, posesAt, breathe, drawFigure, bigFace} from '../../../../kit2d/engine/rig2d.js';
import * as UI from '../../../../kit2d/engine/ui2d.js';
import {factory, stack, plywood} from '../sets/factory.js';
import {headline, worker} from './preview.js';
import {carry, tag} from './work.js';
import {HERO, LEAD} from '../cast.js';

registerShot('pp08', {draw(g, t, info) {
  const cam = {z: 1.08 + 0.04 * ease.inOut(t / info.dur), x: -20 + 25 * ease.inOut(t / info.dur)};
  const {M, GY} = factory(g, info.globalT, cam, {warm: true});
  const p = ease.inOut(prog(t, info.repairAt, info.repairAt + 1.25));
  layer(g, cam, 1, () => {
    carry(g, info.globalT, {M, x: 300, y: GY, bad: p < 0.9, expr: 'determined', lower: 8 * p});
    stack(g, 700, GY, 400, 6);
    plywood(g, 700, GY - 180 - Math.sin(t * 0.7) * 4, 400, 30, p < 0.9);
    if (p > 0.7) {
      const a = ease.out(prog(p, 0.7, 1));
      seg(g, [[650,GY-266],[682,GY-235],[742,GY-310]], 10 * a, S().ui.good);
    }
  });
  headline(g, t < info.repairAt ? ['KALAU MEMANG', 'SALAH.'] : ['PERLU DIPERBAIKI.'], t < info.repairAt ? t : t - info.repairAt, t < info.repairAt ? info.repairAt : info.dur - info.repairAt, {size: 89});
}});

registerShot('pp09', {draw(g, t, info) {
  const cam = {z: 1 + 0.035 * ease.inOut(t / info.dur), y: -8 * Math.sin(t * 0.4)};
  const ui = S().ui;
  UI.blueprint(g, {grid: 72, a: 0.06});
  layer(g, cam, 0.7, () => {
    for (let i = 0; i < 3; i++) {
      const y = 760 + i * 250, active = Math.floor(ease.inOut(prog(t, info.traceAt - 1.6, info.traceAt + 1.3)) * 2.99) === i;
      const a = ease.out(prog(t, 0.15 + i * 0.18, 0.6 + i * 0.18));
      g.save(); g.globalAlpha = a;
      rr(g, 190, y - 85, 600, 170, 24); g.fillStyle = alpha(active ? ui.gold : ui.blueprint, active ? 0.17 : 0.07); g.fill();
      g.strokeStyle = alpha(active ? ui.gold : ui.blueprint, active ? 0.9 : 0.35); g.lineWidth = active ? 4 : 2; g.stroke();
      text(g, ['NYUSUN', 'NGECEK', 'MINDAHIN'][i], 490, y, {size: 66, font: FONTS.ui, weight: 900, color: active ? ui.gold : ui.cream});
      if (i < 2) {
        const p = ease.out(prog(t, 0.5 + i * 0.3, 1.1 + i * 0.3));
        seg(g, [[490,y+92],[490,y+92+62*p]], 4, alpha(ui.blueprint,0.7));
        if (p > 0.9) poly(g, [[478,y+146],[502,y+146],[490,y+161]], ui.blueprint);
      }
      g.restore();
    }
    const p = ease.inOut(prog(t, info.traceAt - 1.6, info.traceAt + 1.3));
    circle(g, 830, lerp(760,1260,p), 14 + Math.sin(t * 1.5) * 2, ui.gold);
  });
  headline(g, ['DIPERIKSA DULU.'], t, info.dur, {color: ui.gold, size: 88});
  if (t >= info.traceAt) tag(g, 'DI BAGIAN MANA?', 490, 1470, ease.out(prog(t,info.traceAt,info.traceAt+0.35)), ui.cream, 720);
}});

registerShot('pp11', {draw(g, t, info) {
  const close = ease.inOut(prog(t, info.replyAt + 0.5, info.worryAt + 0.15));
  const cam = {z: 1.04 + close * 0.06, x: -20 + 18 * Math.sin(t * 0.3)};
  const {M, GY} = factory(g, info.globalT, cam);
  if (close < 0.99) {
    layer(g, cam, 1, () => {
      worker(g, info.globalT, {M, x: 330, y: GY, pose: posesAt(t,[[0,'holdFront'],[info.callAt,'stand'],[info.replyAt,'talk']]), expr: t < info.callAt ? 'neutral' : 'worried', talk: talkAmount(info.globalT,84.97,85.65)});
      worker(g, info.globalT+0.5, {M, x: 760, y: GY, s: 2.2, outfit: LEAD, facing: -1, pose: posesAt(t, [[0,'stand'],[info.callAt,'wave']])});
      stack(g, 560, GY+2, 270, 4);
    });
    headline(g, ['DIPANGGIL ATASAN.'], t, info.worryAt, {size: 86});
    if (t >= info.replyAt && t < info.replyAt + 0.9) {
      UI.bubble(g, 420, 670, {w: 420, h: 140, str: 'Iya, Pak?'});
    }
  }
  if (close > 0) {
    g.save(); g.globalAlpha = close;
    veil(g, S().ink, 0.48);
    bigFace(g, 485 + Math.sin(t) * 4, 1040, 296 + close * 10, {outfit: HERO, expr: 'nervous', rimColor: M.rim, rimSide: -1, blink: info.globalT % 3.1 > 3, tilt: -0.02});
    g.restore();
    if (t >= info.worryAt - 0.2) headline(g, ['WADUH…', 'SALAH APA LAGI?'], t - info.worryAt + 0.2, info.dur - info.worryAt + 0.2, {size: 90});
  }
}});

registerShot('pp12', {draw(g, t, info) {
  const cam = {z: 1.07 - 0.04 * ease.inOut(t / info.dur), x: -8 + 12 * ease.inOut(t / info.dur)};
  const {M, GY} = factory(g, info.globalT, cam, {warm: true});
  const revealed = t >= info.penAt;
  layer(g, cam, 1, () => {
    const x = 360, s = 2.6;
    const p = breathe(posesAt(t, [[0,'think'],[info.penAt - 0.3,'point']]), info.globalT, 1.3);
    drawFigure(g, {x, y: GY, s, facing: 1, outfit: HERO, pose: p, expr: revealed ? 'smile' : 'confused', blink: info.globalT % 3.1 > 3, rim:{color:M.rim,dir:[0,-1],w:4.5}});
    worker(g, info.globalT + 1, {M, x: 770, y: GY, s: 2.2, outfit: LEAD, facing:-1, pose:POSES.relaxed, expr:'smile'});
    if (revealed) {
      const hx = x + p.hF[0] * s, hy = GY + p.hF[1] * s;
      const q = ease.out(prog(t, info.penAt, info.penAt + 0.18));
      g.save(); g.translate(hx,hy); g.rotate(-0.38 + (1-q)*0.08);
      seg(g, [[0,32],[0,-84]], 17, S().ui.blueprint);
      seg(g, [[0,-84],[0,-110]], 17, S().ui.cream);
      poly(g, [[-8,32],[8,32],[0,52]], S().ui.cream);
      seg(g, [[9,-70],[9,-35]], 5, S().ui.gold);
      circle(g,0,0,9,S().ink); g.restore();
    }
  });
  const a = ease.out(prog(t, info.questionAt, info.questionAt + 0.35));
  text(g, 'Pernah?', 485, 355 + Math.sin(t * 0.7) * 4, {size:112,font:FONTS.serif,italic:true,weight:900,color:S().ui.cream,alpha:a});
  g.save(); g.globalAlpha = a;
  rr(g, 100, 470, 770, 190, 24); g.fillStyle = alpha(S().ink,0.94); g.fill();
  g.restore();
  text(g, 'MENGINGAT-INGAT',485,530,{size:62,font:FONTS.ui,weight:900,color:S().ui.gold,alpha:a});
  text(g, 'KESALAHAN?',485,610,{size:76,font:FONTS.ui,weight:900,color:S().ui.gold,alpha:a});
  if (revealed) {
    const a2 = ease.out(prog(t,info.penAt,info.penAt+0.12));
    seg(g,[[565,920],[625,862],[610,858]],4,alpha(S().ui.gold,a2));
  }
}});
