import {armAt, workerMotion, type WorkerArm, type WorkerMotionInput} from './worker-motion';

export type OrangHinduMood = 'neutral' | 'happy' | 'sad' | 'angry' | 'surprised' | 'thinking';
export type OrangHinduPose = 'neutral' | 'wave' | 'point' | 'think' | 'hip' | 'happy' | 'sad' | 'angry' | 'surprised' | 'walk';
/** Inclusive start, exclusive end, in composition seconds. */
export type SpeechCue = readonly [start: number, end: number];
/** Analysis window for the audio-driven mouth; a syllable is roughly 80 ms. */
export const SPEECH_WINDOW = 0.08;
export type OrangHinduMotionInput = WorkerMotionInput & {
  pose?: OrangHinduPose;
  mood?: OrangHinduMood;
  armL?: WorkerArm;
  armR?: WorkerArm;
  /** Explicit mouth drive 0..1; wins over `speak`. */
  talk?: number;
};

/** Mean absolute amplitude of one window. Same measure `getWaveformSamples` uses. */
export const blockLevel = (samples: Float32Array, start: number, end: number) => {
  const a = Math.max(0, Math.min(samples.length, start));
  const b = Math.max(a, Math.min(samples.length, end));
  if (b === a) return 0;
  let sum = 0;
  for (let i = a; i < b; i++) sum += Math.abs(samples[i]);
  return sum / (b - a);
};

/** Loudest window in the recording, so any voice-over level maps the same way. */
export const loudestLevel = (samples: Float32Array, windowSamples: number) => {
  let max = 0;
  if (windowSamples < 1) return 0;
  for (let i = 0; i + windowSamples <= samples.length; i += windowSamples) {
    max = Math.max(max, blockLevel(samples, i, i + windowSamples));
  }
  return max;
};

/** 0..1 mouth drive from a window centred on `time`. Smoothstep between 10% and 40% of the
 * loudest window: pauses close the mouth, vowels open it, no hard gate popping. */
export const mouthLevel = (samples: Float32Array, sampleRate: number, time: number, loudest: number, windowSeconds = SPEECH_WINDOW) => {
  if (!(loudest > 0)) return 0;
  const centre = (Number.isFinite(time) ? time : 0) * sampleRate;
  const half = (windowSeconds * sampleRate) / 2;
  const ratio = blockLevel(samples, Math.round(centre - half), Math.round(centre + half)) / loudest;
  const u = Math.min(1, Math.max(0, (ratio - 0.1) / 0.3));
  return u * u * (3 - 2 * u);
};

/** Deterministic mouth drive from narration cue windows: short ramps, syllabic flap, phase per cue. */
export const talkFromCues = (time: number, cues: readonly SpeechCue[]): number => {
  const t = Number.isFinite(time) ? time : 0;
  let level = 0;
  for (const [start, end] of cues) {
    if (t < start || t >= end) continue;
    const ramp = Math.max(0, Math.min(1, (t - start) / 0.1, (end - t) / 0.08));
    // Later cues run at a different phase so long videos do not look looped.
    const flap = 0.4 + 0.6 * Math.abs(Math.sin((t - start) * 11 + start * 5.3));
    level = Math.max(level, ramp * flap);
  }
  return level;
};
const POSES: Record<OrangHinduPose, {mood: OrangHinduMood; l: WorkerArm; r: WorkerArm}> = {
  neutral: {mood:'neutral',l:'idle',r:'idle'},
  wave: {mood:'happy',l:'idle',r:'wave'},
  point: {mood:'neutral',l:'hip',r:'point'},
  think: {mood:'thinking',l:'hip',r:'chin'},
  hip: {mood:'neutral',l:'hip',r:'hip'},
  happy: {mood:'happy',l:[130,0],r:[130,0]},
  sad: {mood:'sad',l:'idle',r:'idle'},
  angry: {mood:'angry',l:'hip',r:'hip'},
  surprised: {mood:'surprised',l:'hold',r:'hold'},
  walk: {mood:'neutral',l:[-18,12],r:[18,-12]},
};
const compactArm = (side: -1 | 1, pose: WorkerArm, time: number) => {
  const arm = armAt(side, pose, time);
  const map = ([x,y]: readonly number[]): readonly [number,number] => [x*0.65,y*0.65-15];
  const shoulder=map(arm.shoulder), elbow=map(arm.elbow), hand=map(arm.hand);
  return {shoulder,elbow,hand,d:`M${shoulder.join(' ')} Q${elbow.join(' ')} ${hand.join(' ')}`};
};

/** Same deterministic skeleton as Worker, rescaled for the reference's compact body. */
export const orangHinduState = (time: number, input: OrangHinduMotionInput = {}) => {
  const t=Number.isFinite(time)?time:0;
  const {pose='neutral',mood,armL,armR,idleOffset=0,...motionInput}=input;
  const preset=POSES[pose];
  const walk=motionInput.walk ?? (pose==='walk'?t*1.5:0);
  const motion=workerMotion(t,{...motionInput,walk,idleOffset});
  const clock=t+(Number.isFinite(idleOffset)?idleOffset:0);
  const swing=Math.sin(walk*Math.PI*2)*24;
  return {...motion,mood:mood??preset.mood,
    left:compactArm(-1,armL??(pose==='walk'?[-swing,12]:preset.l),clock),
    right:compactArm(1,armR??(pose==='walk'?[swing,-12]:preset.r),clock)};
};
