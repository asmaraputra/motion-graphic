/*
 * Stickman Sinematik Hangat integration, upstream vendor/stickman.
 * MIT License
 * Copyright (c) 2026 michxlai
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import {useThree} from '@react-three/fiber';
import {ThreeCanvas} from '@remotion/three';
import {useLayoutEffect, useRef} from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {NoToneMapping, PerspectiveCamera, SRGBColorSpace} from 'three';
import {createStickmanScene} from './scene.js';
import type {StickmanScene} from './scene.js';

export type Stage3DProps = {
  /** Keep this factory stable; changing it replaces and disposes the scene. */
  createScene?: () => StickmanScene;
};

type MountedScene = {
  engine: StickmanScene;
  camera: PerspectiveCamera;
};

const SceneContent = ({createScene}: Required<Stage3DProps>) => {
  const frame = useCurrentFrame();
  const {width, height, fps} = useVideoConfig();
  const get = useThree((state) => state.get);
  const set = useThree((state) => state.set);
  const gl = useThree((state) => state.gl);
  const mounted = useRef<MountedScene | null>(null);

  useLayoutEffect(() => {
    const previous = get();
    const engine = createScene();
    const camera = new PerspectiveCamera(40, 1, 0.1, 1000);
    mounted.current = {engine, camera};
    // Use the actual scene as the root so its background and fog also render.
    set({scene: engine.scene, camera});
    return () => {
      mounted.current = null;
      set({scene: previous.scene, camera: previous.camera});
      engine.dispose();
    };
  }, [createScene, get, set]);

  useLayoutEffect(() => {
    const stage = mounted.current;
    if (stage === null) {
      throw new Error('Stage3D must mount its scene before updating a frame.');
    }
    stage.camera.aspect = width / height;
    stage.engine.update(frame / fps, stage.camera);
    stage.camera.updateProjectionMatrix();
    // Layout effects precede ThreeCanvas's capture release; no stale seek frame.
    gl.render(stage.engine.scene, stage.camera);
  }, [createScene, frame, fps, width, height, gl]);

  return null;
};

export const Stage3D = ({createScene = createStickmanScene}: Stage3DProps) => {
  const {width, height} = useVideoConfig();
  return (
    <ThreeCanvas
      width={width}
      height={height}
      dpr={1}
      frameloop="never"
      shadows="soft"
      gl={{
        antialias: true,
        alpha: false,
        preserveDrawingBuffer: true,
        toneMapping: NoToneMapping,
        outputColorSpace: SRGBColorSpace,
      }}
    >
      <SceneContent createScene={createScene} />
    </ThreeCanvas>
  );
};
