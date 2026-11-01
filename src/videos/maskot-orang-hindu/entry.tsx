import {Composition, registerRoot} from 'remotion';
import {Sheet} from './Sheet';

// Review-only model sheet. No audio or automatic export.
registerRoot(() => <Composition id="maskot-orang-hindu" component={Sheet}
  width={1080} height={1920} fps={30} durationInFrames={600} />);
