import {registerShot, S, mood, backdrop, ease, prog, alpha, seg, rr, poly, glow, talkAmount} from '../../../../kit2d/engine/core.js';
import * as FX from '../../../../kit2d/engine/fx2d.js';
import {posesAt} from '../../../../kit2d/engine/rig2d.js';
import {actor} from '../cast.js';
import {phone, paper} from '../props.js';
import {room, finish, world, caption, enter, hold, check, X, Y} from '../direction.js';

registerShot('sol07', {draw(g, t, info) {
  const {M, GY, cam} = room(g, t, info, {zoom: 0.035, drift: -12});
  const reply = enter(info.globalT, 50.36, 0.6);
  const talking = talkAmount(info.globalT, 52.08, 57);
  world(g, cam, (g) => {
    actor(g, info.globalT, {x: X(300), y: GY, s: 2.1, pose: 'phone', expr: 'nervous', phone: true, M, talk: talkAmount(info.globalT, 47.07, 49.96)});
    seg(g, [[X(530), Y(650)], [X(530), Y(1380)]], 2, alpha(M.rim, 0.15 * reply));
    actor(g, info.globalT, {x: X(748 + 270 * (1 - reply)), y: GY, s: 2.1, boss: true, facing: -1, pose: t < 6 ? 'phone' : 'talk', expr: 'smirk', phone: true, M, alpha: reply, talk: talking});
    if (talking > 0) FX.rings(g, X(735), Y(875), t, {count: 2, r0: 75, r1: 112, color: M.rim, a: talking * 0.12});
    const draft = enter(info.globalT, 53.63);
    g.save(); g.globalAlpha *= draft;
    paper(g, {x: X(590), y: Y(700) + Math.sin(t * 0.9) * 5, w: 360, h: 170, rotation: -0.035});
    g.restore();
  });
  caption(g, ['Bukan begitu, Pak.'], t, 0.15, 3.4, {size: 70, backing: true});
  caption(g, ['SAYA DULU', 'JUGA KARYAWAN.'], t, 5.29, 7.1, {size: 76, color: S().ui.gold});
  caption(g, ['SUDAH SAYA PAKAI.'], t, 7.1, info.dur, {size: 66});
  finish(g, t, cam);
}});

registerShot('sol08', {draw(g, t, info) {
  const M = mood('void');
  backdrop(g, M.sky);
  const p = enter(t, 0.2, 0.7);
  g.save(); g.globalAlpha *= 0.15;
  for (let x = 0; x <= 1080; x += 90) seg(g, [[X(x + t * 3), 0], [X(x + t * 3), Y(1920)]], 1, S().ui.blueprint);
  for (let y = 0; y <= 1920; y += 90) seg(g, [[0, Y(y)], [X(1080), Y(y)]], 1, S().ui.blueprint);
  g.restore();
  const cam = {z: 1 + 0.045 * info.p, x: -10 * info.p};
  world(g, cam, (g) => {
    FX.pool(g, X(300), Y(1305), 200, 35, S().ui.blueprint, 0.15);
    FX.pool(g, X(750), Y(1305), 200, 35, S().ui.gold, 0.15);
    actor(g, info.globalT, {x: X(300), y: Y(1305), s: 2.2, pose: 'think', expr: 'nervous', M});
    actor(g, info.globalT, {x: X(750), y: Y(1305), s: 2.2, boss: true, facing: -1, pose: 'crossArms', expr: 'smirk', M});
    g.save(); g.globalAlpha *= p;
    g.strokeStyle = S().ui.blueprint; g.lineWidth = 5;
    g.beginPath(); g.moveTo(X(685), Y(800)); g.bezierCurveTo(X(670), Y(550), X(365), Y(540), X(340), Y(800)); g.stroke();
    poly(g, [[X(340), Y(800)], [X(319), Y(770)], [X(365), Y(775)]], S().ui.blueprint);
    g.restore();
    const q = ease.inOut(prog(t, 0.5, 3.5));
    paper(g, {x: X(700 - 360 * q), y: Y(790 - Math.sin(q * Math.PI) * 200), w: 170, h: 95, rotation: -0.1 + 0.2 * q, progress: p});
  });
  caption(g, ['TAKTIK LAMA.'], t, 0.15, info.dur, {size: 92, color: S().ui.gold});
  caption(g, ['Pernah', 'mempraktikkannya.'], t, 2.8, info.dur, {y: 1390, size: 60});
  FX.dust(g, info.globalT, {count: 18, color: M.rim, a: 0.12});
}});

registerShot('sol09', {draw(g, t, info) {
  const {M, GY, cam} = room(g, t, info, {desk: false, zoom: 0.035});
  const note = enter(info.globalT, 68.79, 0.7);
  const match = enter(info.globalT, 71.0, 0.5);
  const close = enter(info.globalT, 71.8, 0.6);
  world(g, cam, (g) => {
    g.save(); g.globalAlpha *= 1 - note;
    actor(g, info.globalT, {x: X(745), y: GY, s: 2.4, boss: true, facing: -1, pose: 'talk', expr: 'smirk', phone: true, M, talk: talkAmount(info.globalT, 65.18, 68)});
    g.restore();
    phone(g, {x: X(390 + 110 * note), y: Y(1065), w: 370 + 60 * note, h: 640 + 90 * note});
    g.save(); g.globalAlpha *= enter(t, 0.8) * (1 - close);
    paper(g, {x: X(500), y: Y(650 + 170 * match), w: 605, h: 185, rotation: -0.025 * (1 - match), lines: 3});
    g.globalAlpha *= note;
    paper(g, {x: X(500), y: Y(1010 - 190 * match), w: 605, h: 185, rotation: 0.025 * (1 - match), lines: 3});
    g.restore();
    if (match > 0) {
      g.save(); g.globalAlpha *= match * (1 - close);
      rr(g, X(190), Y(720), 620, 200, 25); g.strokeStyle = S().ui.gold; g.lineWidth = 5; g.stroke();
      check(g, 800, 815, match, S().ui.gold); g.restore();
    }
  });
  caption(g, ['BOS HAFAL', 'PENUTUPNYA.'], t, 0, 2.1, {size: 78});
  caption(g, ['Besar harapan saya…', '…memberikan izin.'], t, 2.34, 6.1, {size: 64});
  caption(g, ['DRAF DI CATATAN.'], t, 6.15, 8.1, {size: 72});
  caption(g, ['PERSIS.'], t, 8.36, info.dur, {size: 112, color: S().ui.gold});
  caption(g, ['Untung belum dikirim.'], t, 9.15, info.dur, {y: 1380, size: 60});
  finish(g, t, cam);
}});

registerShot('sol10', {draw(g, t, info) {
  const {M, GY, cam} = room(g, t, info, {warm: true, zoom: 0.025, drift: 8});
  const simple = enter(t, 0.2, 1.4);
  world(g, cam, (g) => {
    paper(g, {x: X(520), y: Y(790), w: 540 - 140 * simple, h: 430 - 285 * simple, progress: 1, lines: Math.max(1, 3 - Math.floor(simple * 2))});
    actor(g, info.globalT, {x: X(285), y: GY, s: 2.2, pose: posesAt(t, [[0, 'phone'], [6.2, 'relaxed']]), expr: t < 6 ? 'neutral' : 'smile', phone: true, M, talk: talkAmount(info.globalT, 75, 79)});
    actor(g, info.globalT, {x: X(740), y: GY, s: 2.2, boss: true, facing: -1, pose: posesAt(t, [[0, 'crossArms'], [7.55, 'talk'], [9.2, 'point']]), expr: 'smile', M, talk: talkAmount(info.globalT, 80.98, 85)});
    const p = hold(t, 9.0, info.dur);
    g.save(); g.globalAlpha *= p;
    paper(g, {x: X(375), y: Y(630), w: 150, h: 140});
    paper(g, {x: X(660), y: Y(630), w: 150, h: 140});
    seg(g, [[X(475), Y(630)], [X(550), Y(630)]], 7, S().ui.gold);
    poly(g, [[X(575), Y(630)], [X(545), Y(613)], [X(545), Y(647)]], S().ui.gold);
    check(g, 675, 635, enter(t, 10.4)); g.restore();
  });
  caption(g, ['Mau pulang', 'lebih awal.'], t, 1.4, 3.8, {size: 84, color: S().ui.gold});
  caption(g, ['Lebih lama', 'sama keluarga.'], t, 3.9, 6.2, {size: 80});
  caption(g, ['Nah, begitu saja.'], t, 7.55, 9.4, {size: 76});
  caption(g, ['SERAH TERIMA.', 'AJUKAN CUTI.'], t, 9.4, info.dur, {size: 78, color: S().ui.gold});
  finish(g, t, cam, true);
}});

registerShot('sol11', {draw(g, t, info) {
  const {M, GY, cam} = room(g, t, info, {warm: true, zoom: -0.035});
  const fold = enter(info.globalT, 90.62, 0.8);
  world(g, cam, (g) => {
    actor(g, info.globalT, {x: X(300), y: GY, s: 2.2, pose: posesAt(t, [[0, 'phone'], [5.7, 'relaxed']]), expr: 'smile', phone: t < 5.7, M});
    for (let i = 0; i < 3; i++) {
      g.save(); g.globalAlpha *= (1 - fold) * enter(t, 1.1 + i * 0.24);
      paper(g, {x: X(575), y: Y(600 + i * 180 - i * 180 * fold), w: 500 * (1 - fold * 0.6), h: 150 * (1 - fold * 0.5), rotation: (i - 1) * 0.035 * (1 - fold)});
      g.restore();
    }
    g.save(); g.globalAlpha *= fold;
    g.translate(X(610), Y(840)); g.scale(fold, fold);
    glow(g, 0, 0, 270, M.rim, 0.08);
    poly(g, [[-165, -20], [0, -160], [165, -20]], S().ui.gold);
    rr(g, -125, -20, 250, 210, 12); g.fillStyle = M.practical; g.fill();
    rr(g, -30, 70, 60, 120, 8); g.fillStyle = M.dark; g.fill();
    g.restore();
  });
  caption(g, ['IZIN BERES.'], t, 0.2, 2.65, {size: 92, color: S().ui.gold});
  caption(g, ['3 PARAGRAF', 'PEMBUKAAN.'], t, 3.2, 5.1, {size: 83});
  caption(g, ['INTINYA…', 'MAU PULANG.'], t, 5.1, info.dur, {size: 84, color: S().ui.gold});
  finish(g, t, cam, true);
}});

registerShot('sol12', {draw(g, t, info) {
  const {M, GY, cam} = room(g, t, info, {warm: true, zoom: 0.025, desk: false});
  const out = 1 - ease.in(prog(t, info.dur - 0.4, info.dur));
  world(g, cam, (g) => {
    actor(g, info.globalT, {x: X(300), y: GY, s: 2.05, pose: t < 3 ? 'phone' : 'relaxed', expr: t < 3 ? 'nervous' : 'smile', facing: 1, phone: t < 3, M, alpha: out});
    actor(g, info.globalT, {x: X(730), y: GY, s: 2.05, boss: true, pose: 'crossArms', expr: 'smirk', facing: -1, M, alpha: out});
    g.save(); g.globalAlpha *= hold(t, 0.3, info.dur);
    paper(g, {x: X(515), y: Y(1100) + Math.sin(t * 1.4) * 5, w: 150, h: 95, rotation: 0.05});
    g.restore();
  });
  caption(g, ['Chat izin panjang,', 'bos sudah nebak?'], t, 0.25, info.dur, {y: 380, size: 77, serif: true});
  const p = hold(t, 2.2, info.dur);
  g.save(); g.globalAlpha *= p;
  rr(g, X(385), Y(675), 230, 110, 30); g.strokeStyle = S().ui.gold; g.lineWidth = 5; g.stroke();
  seg(g, [[X(435), Y(785)], [X(425), Y(810)], [X(470), Y(785)]], 5, S().ui.gold);
  for (let i = 0; i < 3; i++) {
    rr(g, X(435 + i * 45), Y(722), 12, 12, 6); g.fillStyle = S().ui.gold; g.fill();
  }
  g.restore();
  caption(g, ['Pernah juga?'], t, 3.1, info.dur, {y: 1440, size: 64, color: S().ui.gold});
  finish(g, t, cam, true);
}});
