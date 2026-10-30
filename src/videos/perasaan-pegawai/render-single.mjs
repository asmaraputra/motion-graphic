import path from 'node:path';
import process from 'node:process';
import console from 'node:console';
import {bundle} from '@remotion/bundler';
import {getCompositions, renderMedia} from '@remotion/renderer';

// Slug-only renderer. A single worker avoids the observed page-function
// timeout on this host. All-I/P encoding makes the last packet duration
// independently adjustable without cutting or retiming the narration.
const root = process.cwd();
const serveUrl = await bundle({entryPoint:path.join(root,'src/videos/perasaan-pegawai/entry.tsx')});
const [composition] = await getCompositions(serveUrl);
let last = -5;
console.log(`Rendering ${composition.durationInFrames} frames, 1080x1920, PNG, concurrency=1`);
await renderMedia({serveUrl, composition, codec:'h264', crf:18, imageFormat:'png',
  audioCodec:'aac', audioBitrate:'192k', concurrency:1,
  outputLocation:path.join(root,'out/videos/perasaan-pegawai/render-master.mp4'),
  ffmpegOverride:({args}) => [...args.slice(0,-1),'-bf','0',...args.slice(-1)],
  onBrowserLog:log => {if(log.text.includes('SHOT ERROR')) throw new Error(log.text);},
  onProgress:({progress,renderedFrames}) => {
    const p=Math.floor(progress*100);
    if(p>=last+5) {last=p; console.log(`render ${p}% (${renderedFrames} frames)`);}
  },
});
console.log('MASTER READY: out/videos/perasaan-pegawai/render-master.mp4');
