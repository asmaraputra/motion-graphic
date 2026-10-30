// Usage:
//   node scripts/render.mjs <slug> stills <sec> [sec...]   → out/videos/<slug>/still-NNNN.png + contact.png
//   node scripts/render.mjs <slug> video                   → out/videos/<slug>/<slug>.mp4 (H.264 CRF 18, AAC, -14 LUFS / -1 dBTP)
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {bundle} from '@remotion/bundler';
import {getCompositions, renderMedia, renderStill} from '@remotion/renderer';

const [slug, mode, ...secs] = process.argv.slice(2);
const entry = path.join(process.cwd(), 'src/videos', slug ?? '', 'entry.tsx');
if (!slug || !['stills', 'video'].includes(mode) || !fs.existsSync(entry)) throw new Error('Usage: node scripts/render.mjs <slug> stills <sec...> | video');

const out = path.join(process.cwd(), 'out/videos', slug);
fs.mkdirSync(out, {recursive: true});
const serveUrl = await bundle({entryPoint: entry});
const [composition] = await getCompositions(serveUrl);

if (mode === 'video') {
  const file = path.join(out, `${slug}.mp4`);
  const raw = path.join(out, `${slug}.raw.mp4`);
  // Kerangka B (dark gradients + film grain) bands with the default JPEG frames.
  const kerangkaB = fs.existsSync(path.join(path.dirname(entry), 'story.json'));
  let last = -10;
  await renderMedia({
    serveUrl,
    composition,
    codec: 'h264',
    crf: 18,
    ...(kerangkaB ? {imageFormat: 'png'} : {}),
    audioCodec: 'aac',
    audioBitrate: '192k',
    outputLocation: raw,
    onProgress: ({progress}) => {
      const pct = Math.floor(progress * 100);
      if (pct >= last + 10) console.log(`render ${(last = pct)}%`);
    },
  });
  // Platform loudness target (TikTok/Reels practice, not an official spec); video stream is copied untouched.
  // Gain to -14 LUFS, then a 4x-oversampled limiter at -2 dBFS keeps true peak under -1 dBTP after AAC.
  // One-pass dynamic loudnorm missed the target (-14.7 LUFS, -0.6 dBTP on `sawit`); the limiter costs a little
  // loudness, so the gain is corrected from the measured output (at most two retries).
  const measure = (f) => {
    const r = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', f, '-af', 'ebur128=peak=true', '-f', 'null', '-'], {encoding: 'utf8'});
    const summary = r.stderr.slice(r.stderr.lastIndexOf('Summary:'));
    const i = Number(summary.match(/I:\s+(-?[\d.]+) LUFS/)?.[1]);
    const tp = Number(summary.match(/Peak:\s+(-?[\d.]+) dBFS/)?.[1]);
    if (r.status !== 0 || !Number.isFinite(i) || !Number.isFinite(tp)) throw new Error(`loudness scan failed for ${f}; unnormalized render kept at ${raw}`);
    return {i, tp};
  };
  let gain = -14 - measure(raw).i;
  let level;
  for (let pass = 0; pass < 3; pass++) {
    const af = `volume=${gain.toFixed(2)}dB,aresample=192000,alimiter=limit=0.7943:level=false:attack=2:release=60,aresample=48000`;
    const norm = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', raw, '-c:v', 'copy', '-af', af, '-c:a', 'aac', '-b:a', '192k', file], {stdio: 'inherit'});
    if (norm.status !== 0) throw new Error(`loudness normalize failed; unnormalized render kept at ${raw}`);
    level = measure(file);
    if (Math.abs(level.i + 14) <= 0.2) break;
    gain += -14 - level.i;
  }
  if (level.tp > -1) console.warn(`true peak ${level.tp} dBTP is above -1`);
  console.log(`loudness ${level.i} LUFS integrated, true peak ${level.tp} dBTP`);
  fs.rmSync(raw);
  const probe = spawnSync('ffprobe', ['-v', 'error', '-count_frames', '-select_streams', 'v', '-show_entries', 'stream=nb_read_frames,duration', '-of', 'csv=p=0', file], {encoding: 'utf8'});
  console.log(`${file}\nexpected ${composition.durationInFrames} frames; ffprobe duration,frames = ${probe.stdout.trim()}`);
} else {
  const stills = [];
  for (const s of secs.map(Number)) {
    const frame = Math.min(composition.durationInFrames - 1, Math.round(s * composition.fps));
    const file = path.join(out, `still-${String(frame).padStart(4, '0')}.png`);
    await renderStill({serveUrl, composition, frame, output: file});
    stills.push(file);
  }
  // One contact sheet (6 per row) for quick review.
  const list = path.join(out, 'stills.txt');
  fs.writeFileSync(list, stills.map((f) => `file '${f.replaceAll('\\', '/')}'\n`).join(''));
  const cols = Math.min(6, stills.length);
  const rows = Math.ceil(stills.length / cols);
  spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-vf', `scale=320:-1,tile=${cols}x${rows}:padding=6:color=white`, '-frames:v', '1', path.join(out, 'contact.png')], {stdio: 'inherit'});
  fs.rmSync(list);
  console.log(`${stills.length} stills + contact.png → ${out}`);
}
