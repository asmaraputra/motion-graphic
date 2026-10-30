import {Composition, registerRoot} from 'remotion';
import {kit2dDefaults, kit2dSchema} from '../../kit2d/Stage2D';
import story from './story.json';
import {Video} from './Video';

const FPS = 30;

registerRoot(() => (
  <Composition
    id="contoh-2d"
    component={Video}
    schema={kit2dSchema}
    width={1080}
    height={1920}
    fps={FPS}
    durationInFrames={Math.ceil(story.duration * FPS)}
    defaultProps={kit2dDefaults}
  />
));
