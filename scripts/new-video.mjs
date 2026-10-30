// Usage: node scripts/new-video.mjs <slug> <voiceover.wav|mp3|m4a|...> [--kerangka a|b]
// Creates src/videos/<slug>/ from templates/video (Kerangka A, default) or templates/video-2d (Kerangka B,
// rules/KERANGKA-B.md) and writes the narration to public/videos/<slug>/narration.wav. PCM WAV is copied as-is;
// any other format is converted with ffmpeg to 16-bit PCM WAV (same sample rate and channels), nothing left in the root.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {spawnSync} from 'node:child_process';
import {readWavInfo} from './lib/wav.mjs';

const args = process.argv.slice(2);
const flag = args.indexOf('--kerangka');
const kerangka = flag >= 0 ? args.splice(flag, 2)[1] : 'a';
const [slug, wav] = args;
if (!slug || !wav || !['a', 'b'].includes(kerangka)) throw new Error('Usage: node scripts/new-video.mjs <slug> <voiceover> [--kerangka a|b]');
if (!fs.existsSync(wav)) throw new Error(`${wav} not found`);
const tplDir = kerangka === 'b' ? 'templates/video-2d' : 'templates/video';
if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) throw new Error(`Slug must be lowercase letters, digits and hyphens: ${slug}`);

const srcDir = path.join('src/videos', slug);
const pubDir = path.join('public/videos', slug);
if (fs.existsSync(srcDir) || fs.existsSync(pubDir)) throw new Error(`${slug} already exists; pick a new slug or edit it directly`);

// Convert first (to a temp file), so a failed conversion leaves no half-made slug behind.
const isPcmWav = (file) => {
  try { readWavInfo(file); return fs.readFileSync(file).readUInt16LE(20) === 1; } catch { return false; }
};
let narration = wav;
if (!isPcmWav(wav)) {
  narration = path.join(os.tmpdir(), `${slug}-narration.wav`);
  const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', wav, '-vn', '-c:a', 'pcm_s16le', narration], {stdio: 'inherit'});
  if (r.status !== 0) throw new Error(`ffmpeg could not convert ${wav} to WAV`);
}
const info = readWavInfo(narration);
const frames = Math.ceil(info.seconds * 30);
const tokens = {
  __SLUG__: slug,
  __WAV__: path.basename(wav),
  __SAMPLES__: info.samples,
  __RATE__: info.sampleRate,
  __CHANNELS__: info.channels,
  __SECONDS__: +info.seconds.toFixed(6),
  __FRAMES__: frames,
};

fs.mkdirSync(srcDir, {recursive: true});
fs.mkdirSync(pubDir, {recursive: true});
for (const rel of fs.readdirSync(tplDir, {recursive: true})) {
  const from = path.join(tplDir, rel);
  const to = path.join(srcDir, rel.replace(/\.tpl$/, ''));
  if (fs.statSync(from).isDirectory()) {
    fs.mkdirSync(to, {recursive: true});
    continue;
  }
  const text = fs.readFileSync(from, 'utf8').replace(/__[A-Z]+__/g, (m) => {
    if (!(m in tokens)) throw new Error(`Unknown template token ${m} in ${rel}`);
    return String(tokens[m]);
  });
  fs.mkdirSync(path.dirname(to), {recursive: true});
  fs.writeFileSync(to, text);
}
fs.copyFileSync(narration, path.join(pubDir, 'narration.wav'));
if (narration !== wav) fs.rmSync(narration);

console.log(JSON.stringify({slug, kerangka, ...info, frames, entry: path.join(srcDir, 'entry.tsx')}, null, 2));
