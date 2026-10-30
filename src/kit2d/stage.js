// src/kit2d/stage.js — Kerangka B frame compositor, ported from aiTrends 2D Studio engine/player.js.
// Maps a frame to its shot, draws it, then applies the transition, colour grade, vignette, grain,
// captions, letterbox bars and global fades. 3D shots (three-kit) are not ported.
/* global document, console */
import { E, V, setStyle, getShot, clamp, ease, prog, alpha, text, FONTS } from './engine/core.js';
import { captions } from './engine/ui2d.js';

let last = {}, bufA, bufB, grainTiles = [], LUT = null, SAT = 1, DEBUG = false;
const errors = [];
const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };

export function setup(o) {
  DEBUG = !!o.debug;
  if (['story', 'words', 'style', 'outW', 'outH', 'fps'].every((k) => last[k] === o[k])) return;
  last = { ...o };
  const { story, words, style, outW, outH, fps } = o;
  const vertical = (story.aspect || '9:16') === '9:16';
  Object.assign(E, { vertical, W: vertical ? 1080 : 1920, H: vertical ? 1920 : 1080, fps, cfg: story, words, shots: story.shots, outW, outH });
  E.PX = outW / E.W;
  setStyle(style || story.style || 'dusk');
  buildLUT();
  bufA = mk(outW, outH); bufB = mk(outW, outH); grainTiles = [];
  const gw = Math.ceil(outW / 2), gh = Math.ceil(outH / 2);
  for (let k = 0; k < 4; k++) { const c = mk(gw, gh), x = c.getContext('2d'), id = x.createImageData(gw, gh); let s = 1234 + k * 999; for (let i = 0; i < id.data.length; i += 4) { s = (s * 1664525 + 1013904223) >>> 0; const v = s >>> 24; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255; } x.putImageData(id, 0, 0); grainTiles.push(c); }
}

// colour grade: per-channel lift/gamma/gain + contrast as LUTs, saturation per pixel
function buildLUT() {
  const gr = E.style.grade || {}; const lift = gr.lift || [0, 0, 0], gam = gr.gamma || [1, 1, 1], gain = gr.gain || [1, 1, 1], con = gr.contrast ?? 1; SAT = gr.sat ?? 1;
  const ident = con === 1 && lift.every(v => v === 0) && gam.every(v => v === 1) && gain.every(v => v === 1);
  if (ident && SAT === 1) { LUT = null; return; }
  LUT = [0, 1, 2].map(c => { const a = new Uint8ClampedArray(256); for (let i = 0; i < 256; i++) { let x = i / 255; x = clamp((x - 0.5) * con + 0.5); x = clamp(gain[c] * (x + lift[c] * (1 - x))); x = Math.pow(x, 1 / gam[c]); a[i] = Math.round(x * 255); } return a; });
}
function applyGrade(mg, W, H) {
  if (!LUT) return; const img = mg.getImageData(0, 0, W, H), d = img.data, [R, G, B] = LUT, s = SAT;
  for (let i = 0; i < d.length; i += 4) {
    let r = R[d[i]], g = G[d[i + 1]], b = B[d[i + 2]];
    if (s !== 1) { const l = 0.2126 * r + 0.7152 * g + 0.0722 * b; r = l + (r - l) * s; g = l + (g - l) * s; b = l + (b - l) * s; }
    d[i] = r; d[i + 1] = g; d[i + 2] = b;
  }
  mg.putImageData(img, 0, 0);
}

function shotIndexAt(t) { const S = E.shots; for (let i = 0; i < S.length; i++) if (t < S[i].end) return i; return S.length - 1; }
function note(g, title, sub) {
  g.fillStyle = '#20141c'; g.fillRect(0, 0, E.W, E.H);
  text(g, title, E.W / 2, E.H / 2 - 30, { size: 60, color: '#ff6f61' });
  text(g, (sub || '').slice(0, 80), E.W / 2, E.H / 2 + 50, { size: 30, color: '#fff', font: FONTS.ui, weight: 800 });
}
function drawShot(buf, shot, lt) {
  const g = buf.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.filter = 'none';
  g.fillStyle = '#000'; g.fillRect(0, 0, buf.width, buf.height); g.setTransform(E.PX, 0, 0, E.PX, 0, 0);
  const def = getShot(shot.id); const dur = shot.end - shot.start;
  const info = { ...(shot.params || {}), shot, dur, globalT: shot.start + lt, p: clamp(lt / dur), line: shot.line };
  if (!def) return note(g, `MISSING SHOT ${shot.id}`, shot.line);
  if (def.kind === '3d') return note(g, `3D TIDAK DIDUKUNG ${shot.id}`, 'Kerangka B hanya 2D');
  try { g.save(); def.draw(g, lt, info); g.restore(); }
  catch (e) {
    const msg = `${shot.id}@${lt.toFixed(2)}: ${e.message}`; if (!errors.includes(msg) && errors.length < 200) errors.push(msg); console.log('SHOT ERROR', msg, e.stack?.split('\n')[1]);
    g.setTransform(E.PX, 0, 0, E.PX, 0, 0); text(g, 'ERROR ' + msg.slice(0, 90), E.W / 2, E.H / 2, { size: 34, color: '#ff4040', font: FONTS.ui, weight: 900 });
  }
}
const BARS = () => ({ none: 0, wide: V(60, 0), scope: V(138, 170), thin: V(30, 60) });
const barVal = (s) => (typeof (s?.bars ?? E.cfg.bars) === 'number' ? (s.bars ?? E.cfg.bars) : BARS()[s?.bars ?? E.cfg.bars ?? V('wide', 'none')] ?? 0);

export function renderFrame(main, f) {
  const mg = main.getContext('2d', { willReadFrequently: true });
  const W = main.width, H = main.height;
  mg.setTransform(1, 0, 0, 1, 0, 0); mg.globalAlpha = 1; mg.globalCompositeOperation = 'source-over'; mg.filter = 'none';
  if (!E.shots.length) { mg.setTransform(E.PX, 0, 0, E.PX, 0, 0); note(mg, 'BELUM ADA SHOT', 'isi "shots" di story.json'); mg.setTransform(1, 0, 0, 1, 0, 0); return; }
  const t = f / E.fps, i = shotIndexAt(t), shot = E.shots[i], lt = t - shot.start;
  drawShot(bufA, shot, lt);
  const tr = shot.in || { type: 'cut' }, tdur = tr.dur ?? (tr.type === 'whip' ? 0.35 : 0.5);
  const grade = E.style.grade; mg.filter = grade.filter && grade.filter !== 'none' ? grade.filter : 'none';
  if (tr.type !== 'cut' && i > 0 && lt < tdur) {
    const prev = E.shots[i - 1], k = ease.inOut(lt / tdur); drawShot(bufB, prev, t - prev.start);
    if (tr.type === 'fade') { mg.drawImage(bufB, 0, 0); mg.globalAlpha = k; mg.drawImage(bufA, 0, 0); }
    else if (tr.type === 'dip' || tr.type === 'dipWhite') { const c = tr.type === 'dip' ? '#000' : '#fff'; mg.drawImage(k < 0.5 ? bufB : bufA, 0, 0); mg.filter = 'none'; mg.globalAlpha = k < 0.5 ? k * 2 : (1 - k) * 2; mg.fillStyle = c; mg.fillRect(0, 0, W, H); }
    else if (tr.type === 'flash') { mg.drawImage(bufA, 0, 0); mg.filter = 'none'; mg.globalAlpha = (1 - lt / tdur) ** 2; mg.fillStyle = '#fff'; mg.fillRect(0, 0, W, H); }
    else if (tr.type === 'whip') { const dir = tr.dir || 1; for (let s = 0; s < 4; s++) { mg.globalAlpha = 0.3; mg.drawImage(bufB, -dir * k * W * 1.1 - dir * s * W * 0.02, 0); mg.drawImage(bufA, dir * (1 - k) * W * 1.1 + dir * s * W * 0.02, 0); } }
    else if (tr.type === 'zoom') { mg.drawImage(bufB, 0, 0); const s = 1.15 - 0.15 * k; mg.globalAlpha = k; mg.translate(W / 2, H / 2); mg.scale(s, s); mg.drawImage(bufA, -W / 2, -H / 2); mg.setTransform(1, 0, 0, 1, 0, 0); }
    else mg.drawImage(bufA, 0, 0);
  } else mg.drawImage(bufA, 0, 0);
  mg.globalAlpha = 1; mg.filter = 'none'; mg.setTransform(1, 0, 0, 1, 0, 0);
  applyGrade(mg, W, H);
  if (grade.tint) { mg.globalCompositeOperation = grade.tint[1]; mg.fillStyle = alpha(grade.tint[0], grade.tint[2]); mg.fillRect(0, 0, W, H); mg.globalCompositeOperation = 'source-over'; }
  if (shot.vignette !== false && grade.vignette > 0) { const v = mg.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.62); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, `rgba(0,0,0,${grade.vignette})`); mg.fillStyle = v; mg.fillRect(0, 0, W, H); }
  if (grade.grain > 0) { mg.save(); mg.globalAlpha = grade.grain; mg.globalCompositeOperation = 'overlay'; mg.drawImage(grainTiles[f % 4], 0, 0, W, H); mg.restore(); }
  mg.setTransform(E.PX, 0, 0, E.PX, 0, 0);
  if (E.cfg.captions && shot.captions !== false) captions(mg, t, E.cfg.captionStyle || {});
  const cur = barVal(shot), prevB = i > 0 ? barVal(E.shots[i - 1]) : cur, bar = prevB + (cur - prevB) * ease.inOut(prog(lt, 0, 0.6));
  if (bar > 0) { mg.fillStyle = '#000'; mg.fillRect(0, 0, E.W, bar); mg.fillRect(0, E.H - bar, E.W, bar); }
  const fi = E.cfg.fadeIn ?? 0.5, fo = E.cfg.fadeOut ?? 0.8, dur = E.cfg.duration, fade = Math.max(fi > 0 ? 1 - t / fi : 0, fo > 0 ? 1 - (dur - t) / fo : 0);
  if (fade > 0) { mg.fillStyle = `rgba(0,0,0,${clamp(fade)})`; mg.fillRect(0, 0, E.W, E.H); }
  if (DEBUG) { mg.fillStyle = 'rgba(0,0,0,.6)'; mg.fillRect(0, E.H - 54, E.W, 54); text(mg, `${shot.id}  ${t.toFixed(2)}s  (${lt.toFixed(2)}/${(shot.end - shot.start).toFixed(2)})  ${(shot.line || '').slice(0, 70)}`, 20, E.H - 27, { size: 26, color: '#fff', font: FONTS.ui, weight: 800, align: 'left' }); }
  mg.setTransform(1, 0, 0, 1, 0, 0);
}
