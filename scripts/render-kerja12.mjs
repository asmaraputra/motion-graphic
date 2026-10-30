// Usage: node scripts/render-kerja12.mjs stills [sec...] | video
import path from 'node:path';
import {bundle} from '@remotion/bundler';
import {renderMedia, renderStill, selectComposition} from '@remotion/renderer';

const root = process.cwd();
const out = path.join(root, 'out/kerja12');
const serveUrl = await bundle({entryPoint: path.join(root, 'src/kerja12-entry.tsx')});
const composition = await selectComposition({serveUrl, id: 'Kerja12Jam'});
const [mode, ...secs] = process.argv.slice(2);

if (mode === 'video') {
  let last = -1;
  await renderMedia({
    serveUrl,
    composition,
    codec: 'h264',
    crf: 18,
    audioCodec: 'aac',
    audioBitrate: '192k',
    outputLocation: path.join(out, 'Kerja-12-Jam-1080x1920.mp4'),
    onProgress: ({progress}) => {
      const pct = Math.floor(progress * 100);
      if (pct >= last + 10) console.log(`render ${(last = pct)}%`);
    },
  });
} else {
  for (const s of secs.map(Number)) {
    const frame = Math.min(composition.durationInFrames - 1, Math.round(s * composition.fps));
    await renderStill({serveUrl, composition, frame, output: path.join(out, `still-${String(frame).padStart(4, '0')}.png`)});
    console.log('still', s, frame);
  }
}
