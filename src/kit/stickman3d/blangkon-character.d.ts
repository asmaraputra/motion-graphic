import type * as T from 'three';
import {Person} from './lib3d.js';
import type {Face, LimbContact, PersonPose, Side} from './lib3d.js';

export interface BlangkonFace extends Face {
  /** Absolute speech opening, clamped to 0..1. Defaults to closed. */
  talk?: number;
}

export type BlangkonPalm = 'open' | 'point' | 'salam';

export interface BlangkonPose extends PersonPose {
  face?: BlangkonFace;
  /** Opt-in hand silhouettes. Omit to retain Person's original hand visibility and fist controls. */
  palms?: Partial<Record<Side, BlangkonPalm>>;
}

/** Neutral illustration with a simplified Solo-reference blangkon and black-and-gold attire. */
export class BlangkonCharacter extends Person {
  constructor(parent: T.Object3D);
  readonly blangkon: T.Group;
  /** Reused head-local geometry; the upper lip stays fixed while speech opens downward. */
  readonly speechMouth: T.Mesh<T.BufferGeometry, T.MeshBasicMaterial>;
  pose(pose: BlangkonPose): Record<Side, LimbContact>;
  private updateSpeechMouth(talk: number, expression: number, look: number): void;
  private readonly gestureHands: Record<Side, {group: T.Group; fingers: T.Mesh[]}>;
  private readonly handDirection: T.Vector3;
  private readonly handRotation: T.Quaternion;
  private updateGestureHands(pose: BlangkonPose, contacts: Record<Side, LimbContact>): void;
}
