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
import type {PersonPose} from './lib3d.js';

export interface StickmanWorld {
  readonly group: T.Group;
  /** Absolute seconds, not a delta. Safe to seek backwards. */
  rain(seconds: number): void;
  /** Release this world's resources only; actors and sibling worlds are untouched. */
  dispose(): void;
}
export interface CafeWorld extends StickmanWorld {
  readonly door: T.Group;
  readonly HINGE: number;
  readonly DOORC: number;
}
export interface WalkOptions {
  pts: readonly (readonly [number, number])[];
  t0: number; t1: number; stride?: number;
}
export interface WalkPose extends PersonPose {x: number; z: number; walking: number}
export interface Walk {at(seconds: number, hipHeight?: number): WalkPose}
export function makeCafe(parent: T.Object3D): CafeWorld;
export function makeStreet(parent: T.Object3D): StickmanWorld;
export function walk3(options: WalkOptions): Walk;
/** Props own their allocations; disposeObject(prop) releases them independently. */
export function blob(parent: T.Object3D, width?: number, depth?: number): T.Mesh;
export function pendant3(parent: T.Object3D, x: number, z: number, length?: number): T.Group;
export function table3(parent: T.Object3D, x: number, z: number, radius?: number, height?: number): T.Group;
export function chair3(parent: T.Object3D, x: number, z: number, yaw: number): T.Group;
export function cup3(parent: T.Object3D, x: number, y: number, z: number): T.Group;
/** Rain resources belong to parent; release them with disposeObject(parent). */
export function rain3(parent: T.Object3D, x0: number, x1: number, z0: number, z1: number, height: number, count?: number): (seconds: number) => void;
