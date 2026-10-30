import {AbsoluteFill, staticFile} from 'remotion';
import {Audio} from '@remotion/media';
import {z} from 'zod';
import {Stage2D, Watermark, kit2dSchema} from '../../kit2d/Stage2D';
import type {Story} from '../../kit2d/stage.js';
import storyJson from './story.json';
import words from './words.json';
import './scenes/index.js';

const story = storyJson as Story;

/**
 * Kerangka B reference (aiTrends "reaction-time" example, 2D shots only, 9:16).
 * The plugin ships no voiceover, so this video has no narration; only the generated soundtrack plays.
 */
export const Video: React.FC<z.infer<typeof kit2dSchema>> = ({watermark, debug}) => (
  <AbsoluteFill style={{background: '#000'}}>
    <Stage2D story={story} words={words} debug={debug} />
    <Watermark text={watermark} />
    {story.soundtrack ? <Audio src={staticFile('videos/contoh-2d/soundtrack.wav')} /> : null}
  </AbsoluteFill>
);
