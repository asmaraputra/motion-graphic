/*
Adapted from michxlai/stickman (vendor/stickman), MIT.
MIT License

Copyright (c) 2026 michxlai

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
import type * as T from 'three';

export type Point3 = readonly [number, number, number];
export type Side = 'l' | 'r';
export type Keyframes = readonly (readonly [number, number])[];
export interface PersonColors {
  skin: string; cloth: string; hood: string; face: string; leg: string; shoe: string;
  coat?: boolean; hat?: boolean; bun?: string;
}
export interface Face {
  mouth?: number; brow?: number; sad?: number; blink?: number; look?: number; lookY?: number;
}
export interface PersonPose {
  pos: Point3; yaw: number; feet: Record<Side, Point3>;
  hands?: Partial<Record<Side, Point3>>;
  pole?: Partial<Record<Side, Point3>>;
  hand?: Partial<Record<Side, 'fist'>>;
  lean?: number; breath?: number; hy?: number; hp?: number; hr?: number; face?: Face;
}
export interface LimbContact {hand: T.Vector3; elbow: T.Vector3; over: number; foot: T.Vector3}
export class Person {
  constructor(parent: T.Object3D, colors: PersonColors);
  readonly c: PersonColors;
  readonly g: T.Group;
  readonly head: T.Group;
  readonly torso: T.Mesh;
  readonly eyes: T.Mesh[];
  readonly brows: T.Mesh[];
  readonly mouth: T.Mesh;
  readonly limbs: Record<Side, {th: T.Mesh; sh: T.Mesh; ua: T.Mesh; fa: T.Mesh; shoe: T.Mesh; fist: T.Mesh}>;
  pose(pose: PersonPose): Record<Side, LimbContact>;
  /** Detach and release this actor only. Do not reuse it after disposal. */
  dispose(): void;
}
export const HERO: PersonColors;
export const FRIEND: PersonColors;
export const STRANGER: PersonColors;
export const WOMAN: PersonColors;
export const THIGH: number, SHIN: number, SPINE: number, UA: number, FA: number, HR: number, STAND: number, ANK: number;
export function V(x?: number, y?: number, z?: number): T.Vector3;
export function clamp(value: number, min?: number, max?: number): number;
export function lerp(from: number, to: number, progress: number): number;
export function ease(progress: number): number;
export function seg(time: number, start: number, end: number): number;
export function kf(time: number, keys: Keyframes): number;
export function rng(seed: number): () => number;
export function mat(color?: T.ColorRepresentation | null, options?: {form?: number; map?: T.Texture; side?: T.Side}): T.ShaderMaterial;
export function mesh<G extends T.BufferGeometry, M extends T.Material | T.Material[]>(geometry: G, material: M): T.Mesh<G, M>;
export function ik3(origin: T.Vector3, target: T.Vector3, upperLength: number, lowerLength: number, pole: T.Vector3): {e: T.Vector3; h: T.Vector3; over: number};
export function gait(distance: number, stride: number): {l: [number, number]; r: [number, number]; bob: number; n: number};
/** Allocate at scene creation, in the browser. No network access is used. */
export function texture(width: number, height: number, paint: (context: CanvasRenderingContext2D, width: number, height: number) => void): T.CanvasTexture;
/** Release owned resources, detach, and clear root. Never pass externally shared resources. */
export function disposeObject(root: T.Object3D): void;
