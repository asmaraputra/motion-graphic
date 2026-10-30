import {Composition, registerRoot} from 'remotion';
import {PAGE, PAGES, Sheet} from './Sheet';

// Asset sheet for the papercut kit (src/kit/papercut.tsx). Review only; no audio.
registerRoot(() => <Composition id="kit-papercut" component={Sheet} width={1080} height={1920} fps={30} durationInFrames={PAGE * PAGES * 30} />);
