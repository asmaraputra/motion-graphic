import {AbsoluteFill, staticFile} from 'remotion';
import {Audio} from '@remotion/media';
import {z} from 'zod';
import {INK, kitSchema} from '../../kit/brand';
import {ReviewOverlay, Sfx, Watermark} from '../../kit/components';
import {SFX} from './timeline';

/** Palette for this video: add the accents from the brief here. */
const C = {...INK};

export const Video: React.FC<z.infer<typeof kitSchema>> = ({watermark, sfxVolume, showReview}) => (
  <AbsoluteFill style={{background: C.bg, overflow: 'hidden'}}>
    {/* Scenes: one component per visual idea, timed from CUES in timeline.ts. */}
    <Watermark text={watermark} />
    <Audio src={staticFile('videos/__SLUG__/narration.wav')} />
    <Sfx cues={SFX} volume={sfxVolume} />
    {showReview ? <ReviewOverlay /> : null}
  </AbsoluteFill>
);
