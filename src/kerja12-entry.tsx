import {Composition, registerRoot} from 'remotion';
import {Kerja12Jam, kerja12Schema} from './compositions/kerja12/Kerja12Jam';
import {FPS, TOTAL_FRAMES} from './compositions/kerja12/timeline';

const Root = () => (
  <Composition
    id="Kerja12Jam"
    component={Kerja12Jam}
    schema={kerja12Schema}
    width={1080}
    height={1920}
    fps={FPS}
    durationInFrames={TOTAL_FRAMES}
    defaultProps={{watermark: '@asmara.putra', sfxVolume: 0.25, showTimecode: false}}
  />
);
registerRoot(Root);
