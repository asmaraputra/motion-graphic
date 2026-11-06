import type {BlangkonPalm, BlangkonPose} from './blangkon-character.js';
import type {Point3, Side} from './lib3d.js';

export type BlangkonGesture = 'idle' | 'wave' | 'point' | 'explain' | 'salam' | 'walk';

export interface BlangkonGesturePose extends BlangkonPose {
  hands: Record<Side, Point3>;
  pole: Record<Side, Point3>;
  palms: Record<Side, BlangkonPalm>;
}

/** Deterministic seconds; returns a new pose without mutating the base. Walk preserves base contacts. */
export function gesturePose(basePose: BlangkonPose, gesture: BlangkonGesture, seconds: number): BlangkonGesturePose;
