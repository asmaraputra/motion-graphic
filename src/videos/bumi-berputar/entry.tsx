import {Composition, registerRoot} from 'remotion';
import {Video, videoSchema} from './Video';
import {FPS, TOTAL_FRAMES} from './timeline';

registerRoot(() => (
  <Composition
    id="bumi-berputar"
    component={Video}
    schema={videoSchema}
    width={1080}
    height={1920}
    fps={FPS}
    durationInFrames={TOTAL_FRAMES}
    defaultProps={{watermark: '@asmara.putra', showReview: false}}
  />
));
