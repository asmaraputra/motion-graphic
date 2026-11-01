import {useAudioData} from '@remotion/media-utils';
import {useMemo} from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {loudestLevel, mouthLevel, SPEECH_WINDOW} from './orang-hindu-motion';

/** Mouth drive for a narration file at the current frame; 0 until the audio decodes.
 * Pass the result to `<OrangHindu talk={...} />`. */
export const useSpeechDrive = (src: string) => {
  const audio = useAudioData(src);
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const samples = audio?.channelWaveforms[0];
  const reference = useMemo(() => (samples && audio
    ? loudestLevel(samples, Math.round(audio.sampleRate * SPEECH_WINDOW)) : 0), [samples, audio]);
  return audio && samples ? mouthLevel(samples, audio.sampleRate, frame / fps, reference) : 0;
};
