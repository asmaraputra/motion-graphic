// Run from project root: node src/videos/bumi-berputar/mix-audio.mjs
// This only prepares audio for Studio. It does not export a video.
import console from 'node:console';
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import {AUDIO_SAMPLES, AUDIO_RATE, AUDIO_SECONDS, MUSIC_VOLUME, SFX} from './timeline.ts';

const dir = 'public/videos/bumi-berputar';
const scratch = 'out/videos/bumi-berputar';
fs.mkdirSync(scratch, {recursive: true});
const run = (args) => {
  const p = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-y', ...args], {encoding: 'utf8', maxBuffer: 8 * 1024 * 1024});
  if (p.status !== 0) throw new Error(p.stderr);
  return p.stderr;
};
const measure = (file) => {
  const log = run(['-i', file, '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-']);
  const begin = log.lastIndexOf('{');
  return JSON.parse(log.slice(begin, log.indexOf('}', begin) + 1));
};
const inputs = ['-i', `${dir}/narration.wav`, '-i', `${dir}/music.wav`];
const filters = ['[0:a]aresample=48000[narr]', `[1:a]volume=${MUSIC_VOLUME}[music]`];
SFX.forEach((s, i) => {
  inputs.push('-i', `public/kit/sfx/${s.type}.wav`);
  filters.push(`[${i + 2}:a]aresample=48000,volume=${0.25 * s.gain},adelay=${Math.round(s.t * 48000)}S:all=1[s${i}]`);
});
const tracks = '[narr][music]' + SFX.map((_, i) => `[s${i}]`).join('');
filters.push(`${tracks}amix=inputs=${SFX.length + 2}:duration=first:normalize=0,atrim=duration=${AUDIO_SECONDS}[mix]`);
const raw = `${scratch}/mix-raw.wav`;
run([...inputs, '-filter_complex', filters.join(';'), '-map', '[mix]', '-ar', '48000', '-ac', '2', '-c:a', 'pcm_s24le', raw]);
const before = measure(raw);
// An oversampled limiter handles brief narration peaks without reducing the whole voice to their level.
let gain = -14 - Number(before.input_i);
let measured;
for (let pass = 0; pass < 3; pass++) {
  run(['-i', raw, '-af', `volume=${gain}dB,aresample=192000,alimiter=limit=0.794328:level=false:attack=2:release=60:latency=true,aresample=${AUDIO_RATE},apad,atrim=end_sample=${AUDIO_SAMPLES}`, '-ar', String(AUDIO_RATE), '-ac', '2', '-c:a', 'pcm_s16le', `${dir}/mix.wav`]);
  measured = measure(`${dir}/mix.wav`);
  if (Math.abs(Number(measured.input_i) + 14) <= 0.15) break;
  gain += -14 - Number(measured.input_i);
}
if (Math.abs(Number(measured.input_i) + 14) > 0.2 || Number(measured.input_tp) > -1) throw new Error(`Master outside target: ${JSON.stringify(measured)}`);
const report = {narrationSamples: AUDIO_SAMPLES, sampleRate: AUDIO_RATE, seconds: AUDIO_SECONDS, musicVolume: MUSIC_VOLUME, musicRelativeDb: -19, sfxCount: SFX.length, gainDb: gain, raw: before, master: measured};
fs.writeFileSync(`${scratch}/audio-report.json`, JSON.stringify(report, null, 2) + '\n');
fs.rmSync(raw);
console.log(JSON.stringify(report, null, 2));
