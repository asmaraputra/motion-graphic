import {AbsoluteFill, interpolate, staticFile, useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {z} from 'zod';
import {Stage2D, Watermark, kit2dSchema} from '../../kit2d/Stage2D';
import type {Story} from '../../kit2d/stage.js';
import storyJson from './story.json';
import words from './words.json';
import './scenes/index.js';

const story = storyJson as Story;

/** Kerangka B (rules/KERANGKA-B.md): every picture comes from story.json shots + scenes/. */
export const Video: React.FC<z.infer<typeof kit2dSchema>> = ({watermark, debug}) => {
  const {fps, durationInFrames} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Stage2D story={story} words={words} debug={debug} />
      <Watermark text={watermark} />
      <Audio src={staticFile('videos/ijin-bos-sol/narration.wav')} />
      <Audio
        src={staticFile('videos/ijin-bos-sol/music.wav')}
        volume={(frame) => interpolate(
          frame,
          [0, 1.2 * fps, durationInFrames - 1 - 2 * fps, durationInFrames - 1],
          [0, 0.065, 0.065, 0],
          {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
        )}
      />
      {story.soundtrack ? <Audio src={staticFile('videos/ijin-bos-sol/soundtrack.wav')} /> : null}
    </AbsoluteFill>
  );
};
