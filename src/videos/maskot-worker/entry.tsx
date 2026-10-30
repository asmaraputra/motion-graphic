import {Composition, registerRoot} from 'remotion';
import {Sheet} from './Sheet';

// Review-only model sheet. No audio, no automatic export.
registerRoot(() => <Composition id="maskot-worker" component={Sheet} width={1080} height={1920} fps={30} durationInFrames={360} />);
