import {AbsoluteFill, Composition, registerRoot} from 'remotion';
import {Stage2D, Watermark} from '../../kit2d/Stage2D';
import type {Story} from '../../kit2d/stage.js';
import preview from './preview-story.json';
import './scenes/index.js';

const styles = ['dusk', 'midnight', 'golden'] as const;
const Sample: React.FC<{look: string}> = ({look}) => (
  <AbsoluteFill style={{background: '#000'}}>
    <Stage2D story={preview as Story} words={[]} style={look} />
    <Watermark text="@asmara.putra" />
  </AbsoluteFill>
);
const Root: React.FC = () => <>{styles.map((look) => (
  <Composition key={look} id={`Preview-${look}`} component={Sample} defaultProps={{look}}
    width={1080} height={1920} fps={30} durationInFrames={741} />
))}</>;
registerRoot(Root);
