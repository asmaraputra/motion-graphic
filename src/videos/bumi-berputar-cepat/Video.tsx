import {AbsoluteFill, staticFile} from 'remotion';
import {Audio} from '@remotion/media';
import {z} from 'zod';
import {M, NumberPlane} from '../../kit/animate-math';
import {kitSchema} from '../../kit/brand';
import {ReviewOverlay, Sfx, Watermark} from '../../kit/components';
import {Earth} from '../../kit/earth';
import {useT} from '../../kit/motion';
import {MUSIC_VOLUME, SFX} from './timeline';
import {globeAt, spinAt} from './world';
import {Scenes, Subtitles} from './scenes';

const W = 1080;
const H = 1920;
/** Longitude facing the viewer at t = 0 (Indonesia). */
const LON0 = 110;

/** The one Earth of this video: placement from globeAt(), west-to-east turn from spinAt(). */
const Globe: React.FC<{t: number}> = ({t}) => {
  const {cx, cy, r, polar} = globeAt(t);
  // Land and grid fade while the globe is zoomed into a horizon, so the ground reads as flat.
  const detail = Math.min(1, Math.max(0, (1400 - r) / 700));
  return <Earth cx={cx} cy={cy} r={r} lon={LON0 - (spinAt(t) * 180) / Math.PI} tilt={90 * polar} detail={detail} />;
};

export const Video: React.FC<z.infer<typeof kitSchema>> = ({watermark, sfxVolume, showReview}) => {
  const t = useT();
  return (
    <AbsoluteFill style={{background: M.bg, overflow: 'hidden'}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>
        <NumberPlane w={W} h={H} />
        <Globe t={t} />
      </svg>
      <Scenes t={t} />
      <Subtitles t={t} />
      <Watermark text={watermark} />
      <Audio src={staticFile('videos/bumi-berputar-cepat/narration.wav')} />
      <Audio src={staticFile('videos/bumi-berputar-cepat/music.wav')} volume={MUSIC_VOLUME} />
      <Sfx cues={SFX} volume={sfxVolume} />
      {showReview ? <ReviewOverlay /> : null}
    </AbsoluteFill>
  );
};
