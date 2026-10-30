import process from 'node:process';
import console from 'node:console';
import path from 'node:path';
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import {bundle} from '@remotion/bundler';
import {getCompositions, renderStill} from '@remotion/renderer';

const root = process.cwd();
const out = path.join(root, 'out/videos/perasaan-pegawai');
fs.mkdirSync(out, {recursive: true});
const serveUrl = await bundle({entryPoint: path.join(root, 'src/videos/perasaan-pegawai/preview-entry.tsx')});
const compositions = await getCompositions(serveUrl);
const times = [2, 8.6, 18.7];
const files = [];
for (let row = 0; row < times.length; row++) {
  for (const composition of compositions) {
    const file = path.join(out, `sample-${composition.id}-${row}.png`);
    if (!process.argv.includes('--sheet-only')) await renderStill({serveUrl, composition, frame: Math.round(times[row] * 30), scale: 0.5, output: file,
      onBrowserLog: (log) => {if (log.text.includes('SHOT ERROR')) throw new Error(log.text);}});
    files.push(file);
    console.log(path.basename(file));
  }
}
const list = path.join(out, 'preview-list.txt');
fs.writeFileSync(list, files.map(f => `file '${f.replaceAll('\\', '/')}'`).join('\n'));
const filter = "scale=270:480,tile=3x3:padding=8:margin=8:color=0x111827,pad=iw:ih+62:0:62:color=0x111827,drawtext=fontfile=out/videos/perasaan-pegawai/preview-font.ttf:text='A. DUSK':x=70:y=20:fontsize=22:fontcolor=white,drawtext=fontfile=out/videos/perasaan-pegawai/preview-font.ttf:text='B. MIDNIGHT':x=330:y=20:fontsize=22:fontcolor=white,drawtext=fontfile=out/videos/perasaan-pegawai/preview-font.ttf:text='C. GOLDEN':x=620:y=20:fontsize=22:fontcolor=white";
const sheet = path.join(out, 'pilihan-gaya.png');
fs.copyFileSync('C:/Windows/Fonts/arial.ttf', path.join(out, 'preview-font.ttf'));
const result = spawnSync('ffmpeg', ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-vf', filter, '-frames:v', '1', sheet], {encoding: 'utf8'});
if (result.status !== 0) throw new Error(result.stderr);
fs.unlinkSync(list);
console.log(sheet);
