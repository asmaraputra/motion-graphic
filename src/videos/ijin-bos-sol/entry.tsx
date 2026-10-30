import {Composition, registerRoot} from 'remotion';
import {kit2dSchema} from '../../kit2d/Stage2D';
import story from './story.json';
import {Video} from './Video';

const FPS = 30;
const vertical = story.aspect !== '16:9';

registerRoot(() => (
  <Composition
    id="ijin-bos-sol"
    component={Video}
    schema={kit2dSchema}
    width={vertical ? 1080 : 1920}
    height={vertical ? 1920 : 1080}
    fps={FPS}
    durationInFrames={Math.ceil(story.duration * FPS)}
    defaultProps={{watermark: '@asmara.putra', debug: false}}
  />
));
