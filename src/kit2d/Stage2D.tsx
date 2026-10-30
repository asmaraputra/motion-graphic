import {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {cancelRender, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {z} from 'zod';
import {renderFrame, setup, type Story, type Word} from './stage.js';

// Fredoka / Nunito / Playfair Display Italic (OFL, variable woff2) live in public/kit2d/fonts;
// the engine's FONTS refer to these family names. Rendering waits until all three are loaded.
const FACES: [string, string, FontFaceDescriptors][] = [
  ['Fredoka', 'Fredoka.woff2', {weight: '300 700'}],
  ['Nunito', 'Nunito.woff2', {weight: '200 1000'}],
  ['Playfair Display', 'PlayfairDisplay-Italic.woff2', {weight: '400 900', style: 'italic'}],
];
const fontHandle = delayRender('Loading Kerangka B fonts');
const fontsLoaded = Promise.all(
  FACES.map(([family, file, desc]) =>
    new FontFace(family, `url(${staticFile(`kit2d/fonts/${file}`)})`, desc).load().then((face) => document.fonts.add(face)),
  ),
)
  .then(() => continueRender(fontHandle))
  .catch(cancelRender);

/** Draws the whole Kerangka B picture (shots, transitions, grade, bars) for the current frame. */
export const Stage2D: React.FC<{story: Story; words: Word[]; style?: string; debug?: boolean}> = ({story, words, style, debug}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const frame = useCurrentFrame();
  const {width, height, fps} = useVideoConfig();
  const [fontsReady, setFontsReady] = useState(false);
  useEffect(() => {
    fontsLoaded.then(() => setFontsReady(true));
  }, []);
  useLayoutEffect(() => {
    if (!ref.current) return;
    setup({story, words, style, outW: width, outH: height, fps, debug});
    renderFrame(ref.current, frame);
  }, [story, words, style, width, height, fps, debug, frame, fontsReady]);
  return <canvas ref={ref} width={width} height={height} style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}} />;
};

/** Small handle, same placement as Kerangka A (inside the vertical safe area). */
export const Watermark: React.FC<{text: string}> = ({text}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const vertical = height > width;
  return (
    <div
      style={{
        position: 'absolute',
        left: vertical ? 100 : 80,
        bottom: vertical ? 330 : 80,
        fontFamily: '"Nunito", sans-serif',
        fontWeight: 800,
        fontSize: 26,
        letterSpacing: '0.04em',
        color: '#F4F0E8',
        opacity: 0.5 * Math.min(1, frame / (0.6 * fps)),
      }}
    >
      {text}
    </div>
  );
};

export const kit2dSchema = z.object({
  watermark: z.string(),
  /** Shot id + time strip at the bottom, for review only. */
  debug: z.boolean(),
});

export const kit2dDefaults: z.infer<typeof kit2dSchema> = {watermark: '@asmara.putra', debug: false};
