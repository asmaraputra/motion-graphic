import {Composition, registerRoot} from 'remotion';
import {Sheet} from './Sheet';

// Review-only still sheet for the blangkon headwear. No audio, no export.
registerRoot(() => (
  <Composition id="blangkon-headwear" component={Sheet} width={1080} height={1920} fps={30} durationInFrames={30} />
));
