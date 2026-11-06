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
import type {Scene, PerspectiveCamera} from 'three';
export * from './lib3d.js';
export * from './world3d.js';
export {DOOR, cafeOutside, cafeWall, streetSky, streetBuildings} from './painted-sets.js';
export const STICKMAN_DURATION: 9;
export interface StickmanScene {
  readonly scene: Scene;
  /** Absolute seconds. Does not change camera.aspect. */
  update(seconds: number, camera: PerspectiveCamera): void;
  /** Idempotent. Releases only this scene's resources. */
  dispose(): void;
}
export function createStickmanScene(): StickmanScene;
