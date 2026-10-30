import {Composition, registerRoot} from 'remotion';
import {kitDefaults, kitSchema} from '../../kit/brand';
import {Video} from './Video';
import {FPS, TOTAL_FRAMES} from './timeline';

registerRoot(() => (
  <Composition
    id="caregiver"
    component={Video}
    schema={kitSchema}
    width={1080}
    height={1920}
    fps={FPS}
    durationInFrames={TOTAL_FRAMES}
    defaultProps={kitDefaults}
  />
));
