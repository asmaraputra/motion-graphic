/*
Adapted from michxlai/stickman templates/film_3d.js, MIT.
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
import * as T from 'three';
import {ANK, HERO, STRANGER, Person, clamp, ease, seg, lerp, kf, disposeObject} from './lib3d.js';
import {makeCafe, table3, chair3, cup3, blob, walk3} from './world3d.js';

export * from './lib3d.js';
export * from './world3d.js';
export {DOOR, cafeOutside, cafeWall, streetSky, streetBuildings} from './painted-sets.js';
export const STICKMAN_DURATION = 9;

function blink(t, times) {
  for (const start of times) {
    if (t > start && t < start + 0.16) return Math.sin((t - start) / 0.16 * Math.PI);
  }
  return 0;
}

/** A portrait-composed cafe scene. The caller owns the camera and its aspect. */
export function createStickmanScene() {
  const scene = new T.Scene();
  scene.background = new T.Color('#120a1c');
  const set = makeCafe(scene);
  const hero = new Person(scene, HERO);
  const visitor = new Person(scene, STRANGER);
  const tx = -2, tz = 0.3;
  table3(scene, tx, tz);
  chair3(scene, tx - 0.62, tz, Math.PI / 2);
  const cup = cup3(scene, tx + 0.1, 0.785, tz + 0.12);
  const heroShadow = blob(scene, 1.2, 0.7);
  const visitorShadow = blob(scene, 1, 0.5);
  heroShadow.position.set(tx - 0.6, 0.006, tz);
  const walk = walk3({
    pts: [[set.DOORC, -3.8], [set.DOORC, -1.6], [-0.9, 0.2]],
    t0: 3.2, t1: 7, stride: 0.62,
  });
  let disposed = false;

  return {
    scene,
    update(seconds, camera) {
      if (disposed) throw new Error('Cannot update a disposed Stickman scene.');
      if (!Number.isFinite(seconds)) throw new Error('Stickman time must be finite seconds.');
      const t = clamp(seconds, 0, STICKMAN_DURATION);
      set.rain(t);
      set.door.rotation.y = ease(seg(t, 2.2, 3.1)) * 1.9;
      const walking = walk.at(t);
      visitor.pose({
        ...walking, lean: 0.02, breath: t * 2, hp: 0.04,
        face: {mouth: -0.5, brow: -0.3, sad: 0.8, blink: blink(t, [5])},
      });
      visitorShadow.position.set(walking.x, 0.006, walking.z);
      const sip = ease(seg(t, 6.6, 7.1)) * (1 - ease(seg(t, 7.9, 8.3)));
      const cx = lerp(tx + 0.1, tx - 0.2, sip);
      const cy = lerp(0.785, 1.16, sip);
      const cz = lerp(tz + 0.12, tz + 0.16, sip);
      cup.position.set(cx, cy, cz);
      cup.rotation.z = sip * 0.5;
      const px = tx - 0.6;
      hero.pose({
        pos: [px, 0.54, tz], yaw: Math.PI / 2, lean: 0.05, breath: t * 2.1,
        feet: {l: [px + 0.34, ANK, tz + 0.12], r: [px + 0.34, ANK, tz - 0.12]},
        hands: {l: [px + 0.42, 0.84, tz - 0.2], r: [cx - 0.01, cy + 0.03, cz - 0.09]},
        pole: {l: [0, -1, -0.6], r: [0, -1, 0.6]}, hand: {r: 'fist'},
        hy: kf(t, [[0, 0], [2.6, 0], [3.1, 0.45], [6.4, 0.45], [6.7, 0.25]]),
        hp: 0.04,
        face: {
          mouth: kf(t, [[0, 0.65], [2.6, 0.65], [3.2, 0.1]]),
          brow: kf(t, [[0, 0.1], [2.6, 0.1], [3.1, 0.8]]),
          look: kf(t, [[0, 0.3], [2.6, 0.3], [3, 0.8]]),
          blink: blink(t, [1.6, 4.4]),
        },
      });
      // Compose each shot for the actual portrait frustum, not a landscape crop.
      if (t < 3.2) {
        const u = ease(seg(t, 0, 3.2));
        camera.position.set(lerp(-0.9, -1.25, u), 1.45, lerp(3.4, 3.05, u));
        camera.lookAt(px + 0.12, 1.08, tz);
        camera.fov = 43;
      } else if (t < 6.2) {
        const u = ease(seg(t, 3.2, 6.2));
        camera.position.set(walking.x + lerp(0.65, 0.3, u), 1.65, walking.z + 4.7);
        camera.lookAt(walking.x, 1.05, walking.z);
        camera.fov = 43;
      } else {
        const u = ease(seg(t, 6.2, STICKMAN_DURATION));
        camera.position.set(tx + lerp(1.35, 1.15, u), 1.45, tz + lerp(2.8, 2.55, u));
        camera.lookAt(px + 0.16, 1.1, tz + 0.03);
        camera.fov = 36;
      }
      camera.near = 0.05;
      camera.far = 60;
      camera.updateProjectionMatrix();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      disposeObject(scene);
    },
  };
}
