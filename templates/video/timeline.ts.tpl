import type {SfxCue} from '../../kit/components';

export const FPS = 30;
/** __WAV__: __SAMPLES__ samples @ __RATE__ Hz, __CHANNELS__ ch = __SECONDS__ s. */
export const AUDIO_SECONDS = __SECONDS__;
export const TOTAL_FRAMES = __FRAMES__;

/**
 * Word onsets (seconds) copied from out/videos/__SLUG__/words.txt
 * (local whisper.cpp, about ±0.2 s; not forced alignment).
 */
export const CUES = {} as const;

/** Sound onsets (seconds). Gain multiplies the sfxVolume prop. */
export const SFX: SfxCue[] = [];
