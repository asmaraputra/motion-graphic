// Usage: node scripts/transcribe.mjs <slug> [language=id]
// Local whisper.cpp word timestamps for public/videos/<slug>/narration.wav. Audio never leaves the machine.
// Writes out/videos/<slug>/asr.json (raw) and words.txt ("seconds  word" per line) for filling CUES.
// Kerangka B video (src/videos/<slug>/story.json exists): also writes src/videos/<slug>/words.json for wordTime()/captions.
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

const [slug, lang = 'id'] = process.argv.slice(2);
if (!slug) throw new Error('Usage: node scripts/transcribe.mjs <slug> [language]');

const root = process.cwd();
const bin = path.join(root, 'tools/whisper/Release/whisper-cli.exe');
const model = path.join(root, 'tools/whisper/ggml-small.bin');
for (const f of [bin, model]) if (!fs.existsSync(f)) throw new Error(`Missing ${f}; see rules/VIDEO-WORKFLOW.md "Alat"`);
const wav = path.join(root, 'public/videos', slug, 'narration.wav');
const outDir = path.join(root, 'out/videos', slug);
fs.mkdirSync(outDir, {recursive: true});

// cwd = Release so whisper-cli finds its DLLs.
const r = spawnSync(bin, ['-m', model, '-f', wav, '-l', lang, '-ml', '1', '-sow', '-t', '8', '-ojf', '-of', path.join(outDir, 'asr')], {
  cwd: path.dirname(bin),
  encoding: 'utf8',
});
if (r.status !== 0) throw new Error(`whisper-cli failed (${r.status}):\n${r.stderr?.slice(-2000)}`);

const segs = JSON.parse(fs.readFileSync(path.join(outDir, 'asr.json'), 'utf8')).transcription;
const words = segs.map((s) => ({t: s.offsets.from / 1000, w: s.text.trim()})).filter((s) => s.w);
fs.writeFileSync(path.join(outDir, 'words.txt'), words.map((s) => `${s.t.toFixed(2).padStart(6)}  ${s.w}`).join('\n') + '\n');
console.log(`${words.length} words → ${path.join(outDir, 'words.txt')}`);

const srcDir = path.join(root, 'src/videos', slug);
if (fs.existsSync(path.join(srcDir, 'story.json'))) {
  const json = segs
    .map((s) => ({word: s.text.trim(), start: s.offsets.from / 1000, end: s.offsets.to / 1000}))
    .filter((s) => s.word);
  fs.writeFileSync(path.join(srcDir, 'words.json'), JSON.stringify(json, null, 1) + '\n');
  console.log(`Kerangka B: ${json.length} words → ${path.join(srcDir, 'words.json')}`);
}
