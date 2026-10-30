import {Composition, registerRoot} from 'remotion';
import {kit2dDefaults, kit2dSchema} from '../../kit2d/Stage2D';
import story from './story.json';
import {Video} from './Video';

const FPS = 30;
const vertical = story.aspect !== '16:9';

registerRoot(() => (
  <Composition
    id="__SLUG__"
    component={Video}
    schema={kit2dSchema}
    width={vertical ? 1080 : 1920}
    height={vertical ? 1920 : 1080}
    fps={FPS}
    durationInFrames={Math.ceil(story.duration * FPS)}
    defaultProps={kit2dDefaults}
  />
));
