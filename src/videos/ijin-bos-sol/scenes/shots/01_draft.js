import {registerShot, S, ease, prog, alpha, glow, rr, seg, circle, ring} from '../../../../kit2d/engine/core.js';
import {bigFace, POSES, posesAt} from '../../../../kit2d/engine/rig2d.js';
import {actor, employee} from '../cast.js';
import {phone, paper} from '../props.js';
import {room, finish, world, words, caption, enter, hold, X, Y} from '../direction.js';

registerShot('sol01', {draw(g, t, info) {
  const {M, GY, cam} = room(g, t, info, {zoom: 0.045});
  const step = t < 3.12 ? 0 : 1;
  const cue = [0.64, 3.12][step];
  world(g, cam, (g) => {
    const p = enter(t, 0.4);
    paper(g, {x: X(530), y: Y(650) + (1 - p) * 100, w: 590, h: 300, rotation: -0.04 + Math.sin(t) * 0.01, progress: p});
    seg(g, [[X(310), Y(535)], [X(310), Y(565)]], 14, M.rim);
    seg(g, [[X(750), Y(535)], [X(750), Y(565)]], 14, M.rim);
    if (step === 1) {
      const p = enter(t, 3.12);
      ring(g, X(680), Y(715), 44 * p, 5, S().ui.gold);
      seg(g, [[X(658), Y(714)], [X(676), Y(733)], [X(705), Y(695)]], 7, alpha(S().ui.gold, p));
    }
    actor(g, info.globalT, {x: X(365), y: GY, s: 2.15, pose: t < 4.8 ? 'relaxed' : 'phone', expr: 'smile', phone: t >= 4.8, M});
  });
  const labels = [['BESOK', 'JUMAT.'], ['SABTUNYA LIBUR.', 'GAJI MASUK.']];
  words(g, labels[step], {y: 290, size: 94, p: hold(t, cue, step === 0 ? 3.12 : 5.8), color: step === 1 ? S().ui.gold : S().ui.cream});
  finish(g, t, cam);
}});

registerShot('sol02', {draw(g, t, info) {
  const {M, GY, cam} = room(g, t, info, {zoom: 0.065});
  const macro = enter(t, 0.8, 1.0);
  world(g, cam, (g) => {
    actor(g, info.globalT, {x: X(315 - 105 * macro), y: GY + 100 * macro, s: 2.15 + 1.25 * macro, pose: 'phone', expr: 'nervous', phone: false, M});
    glow(g, X(560), Y(990), 450, M.practical, 0.1);
    phone(g, {x: X(386 + 124 * macro), y: Y(923 + 67 * macro), w: 34 + 416 * macro, h: 62 + 723 * macro, rotation: -0.06 * (1 - macro), progress: prog(info.globalT, 7.3, 13.8), lines: 3});
  });
  caption(g, ['KALIMAT', 'PALING SOPAN.'], t, 1.4, 5.15, {size: 78});
  caption(g, ['Selamat malam, Pak.'], t, 5.2, 8.0, {size: 64, backing: true});
  caption(g, ['Siap, Pak.'], t, 9.2, info.dur, {size: 92, color: S().ui.gold});
  finish(g, t, cam);
}});

registerShot('sol03', {draw(g, t, info) {
  const {M, GY, cam} = room(g, t, info, {zoom: 0.035, drift: -15});
  const cues = [1.05, 2.25, 4.8];
  world(g, cam, (g) => {
    for (let i = 0; i < 3; i++) {
      const p = enter(t, cues[i], 0.55);
      if (p <= 0) continue;
      paper(g, {x: X(570), y: Y(600 + i * 190) - 40 * (1 - p), w: 560 * p, h: 158 * p, rotation: (i - 1) * 0.045, progress: p});
    }
    const burden = enter(t, 4.8);
    actor(g, info.globalT, {x: X(270), y: GY, s: 2.2, pose: posesAt(t, [[0, 'phone'], [4.8, {...POSES.think, eF: POSES.phone.eF, hF: POSES.phone.hF}]]), expr: 'nervous', phone: true, M});
    seg(g, [[X(330), Y(860)], [X(365 + 15 * burden), Y(1020)]], 3, alpha(M.rim, burden * 0.5));
  });
  caption(g, ['KALI INI…', 'LENGKAP.'], t, 0, 2.1, {size: 84, color: S().ui.gold});
  caption(g, ['Permohonan maaf'], t, 1.25, 4.7, {y: 600, size: 56, backing: true});
  caption(g, ['Urusan keluarga'], t, 2.45, 5.6, {y: 790, size: 58, backing: true});
  caption(g, ['Berat meninggalkan', 'tanggung jawab.'], t, 5.0, info.dur, {y: 285, size: 67});
  finish(g, t, cam);
}});

registerShot('sol04', {draw(g, t, info) {
  const {cam} = room(g, t, info, {desk: false, zoom: 0.055});
  const global = info.globalT;
  const draft = global < 26.98 ? prog(global, 26.07, 26.8) : global < 28.18 ? 1 - prog(global, 26.98, 27.5) : prog(global, 28.18, 28.8);
  const urgent = enter(global, 29.59) * (1 - enter(global, 30.89));
  world(g, cam, (g) => {
    phone(g, {x: X(505), y: Y(1010) + Math.sin(t * 1.1) * 4, w: 490, h: 850, progress: draft, urgent, lines: 3});
    const finger = enter(t, 0.2) * (1 - enter(t, 7.0));
    g.save(); g.globalAlpha *= finger;
    seg(g, [[X(915), Y(1430)], [X(751), Y(1260)], [X(669), Y(1180 + Math.sin(t * 3) * 4)]], 64, S().inkFar);
    seg(g, [[X(909), Y(1420)], [X(745), Y(1250)], [X(663), Y(1170 + Math.sin(t * 3) * 4)]], 50, S().ink);
    g.restore();
  });
  caption(g, ['Diketik.', 'Dihapus. Diganti.'], t, 0.47, 3.95, {size: 80});
  caption(g, ['“mendesak”'], t, 3.99, 6.3, {size: 96, color: S().ui.accent});
  caption(g, ['Mendesak kenapa?'], t, 7.0, info.dur, {size: 68, color: S().ui.blueprint});
  finish(g, t, cam);
}});

registerShot('sol05', {draw(g, t, info) {
  const {M, cam} = room(g, t, info, {desk: false, zoom: 0.035});
  const send = enter(info.globalT, 36.34, 0.6);
  const reply = enter(info.globalT, 39.79, 0.42);
  world(g, cam, (g) => {
    phone(g, {x: X(505), y: Y(1010), w: 490, h: 850, sent: send});
    const a = hold(t, 0.1, 1.65);
    ring(g, X(500), Y(800), 95, 7, alpha(S().ui.gold, a));
    g.save(); g.globalAlpha *= a;
    const ang = t * 2.4;
    seg(g, [[X(500), Y(800)], [X(500) + Math.sin(ang) * 58, Y(800) - Math.cos(ang) * 58]], 8, S().ui.gold);
    g.restore();
    if (send > 0 && reply < 1) {
      g.save(); g.globalAlpha *= 1 - prog(t, 3.4, 4.0);
      paper(g, {x: X(500 + send * 90), y: Y(1020 - 370 * send), w: 250 * (1 - send * 0.35), h: 110, rotation: -send * 0.15});
      g.restore();
    }
    if (reply > 0) {
      const y = Y(670) - (1 - reply) * 60;
      rr(g, X(160), y, 675, 220, 34); g.fillStyle = S().ui.card; g.fill();
      seg(g, [[X(184), y + 48], [X(184), y + 172]], 7, alpha(S().ui.gold, reply));
      glow(g, X(500), y + 100, 330, M.rim, 0.07 * reply);
    }
  });
  caption(g, ['15 MENIT'], t, 0.15, 2.0, {y: 300, size: 100, color: S().ui.gold});
  caption(g, ['TERKIRIM.'], t, 2.0, 4.5, {size: 90});
  caption(g, ['Mau nyambung', 'libur, ya?'], t, 5.14, info.dur, {y: 705, size: 72, color: S().ui.gold});
  finish(g, t, cam);
}});

registerShot('sol06', {draw(g, t, info) {
  const {M, cam} = room(g, t, info, {desk: false, zoom: 0.075});
  const snap = ease.out(prog(t, 0.08, 0.36));
  world(g, cam, (g) => {
    bigFace(g, X(500), Y(990) - snap * 55 + Math.sin(t * 2) * 4, 300, {outfit: employee, expr: 'shocked', blink: (info.globalT % 3.1) > 3.0, rimColor: M.rim, tilt: 0.025 * (1 - snap)});
    const p = enter(t, 2.1, 0.7);
    g.save(); g.globalAlpha *= p * 0.55;
    g.strokeStyle = S().ui.blueprint; g.lineWidth = 3; g.setLineDash([10, 14]);
    g.beginPath(); g.moveTo(X(805), Y(1200)); g.bezierCurveTo(X(860), Y(700), X(760), Y(580), X(585), Y(750)); g.stroke();
    g.restore();
    circle(g, X(585), Y(750), 9 * p, S().ui.gold);
  });
  caption(g, ['BACA CHAT', 'ATAU BACA PIKIRAN?'], t, 2.0, info.dur, {size: 76, color: S().ui.gold});
  finish(g, t, cam);
}});
