import {FA, SPINE, UA} from './lib3d.js';

/** Pure, body-local gestures; walk3 remains the sole owner of walking contacts. */
export function gesturePose(basePose, gesture, seconds) {
  if (!Number.isFinite(seconds)) throw new TypeError('Gesture time must be finite seconds.');
  const sin = Math.sin(basePose.yaw), cos = Math.cos(basePose.yaw);
  const tilt = Math.sin(basePose.lean || 0), up = Math.cos(basePose.lean || 0);
  const local = (x, y, z, origin = basePose.pos) => [
    origin[0] + cos * x + sin * (tilt * y + up * z),
    origin[1] + up * y - tilt * z,
    origin[2] - sin * x + cos * (tilt * y + up * z),
  ];
  const sway = Math.sin(seconds * 2.2) * 0.012;
  let left = [0.31, -0.01 + sway, 0.08];
  let right = [-0.31, -0.01 - sway, 0.08];
  let leftPole = [0.65, -0.55, -0.6];
  let rightPole = [-0.65, -0.55, -0.6];
  let palms = {l: 'open', r: 'open'};
  switch (gesture) {
    case 'idle':
      break;
    case 'walk':
      leftPole = [0.5, -0.25, -1];
      rightPole = [-0.5, -0.25, -1];
      palms = {...palms, ...basePose.palms};
      break;
    case 'wave':
      right = [-0.4 + Math.sin(seconds * Math.PI * 5) * 0.075,
        0.82 + Math.cos(seconds * Math.PI * 5) * 0.018, 0.15];
      rightPole = [-1, -0.25, 0];
      break;
    case 'point':
      right = [-0.69, 0.48 + sway * 0.3, 0.12];
      rightPole = [-0.2, -1, -0.3];
      palms = {l: 'open', r: 'point'};
      break;
    case 'explain': {
      const beat = Math.sin(seconds * 3.2);
      left = [0.36, 0.34 + beat * 0.035, 0.32];
      right = [-0.39, 0.36 - beat * 0.035, 0.33];
      leftPole = [0.8, -0.8, -0.2];
      rightPole = [-0.8, -0.8, -0.2];
      break;
    }
    case 'salam':
      left = [0.018, 0.46 + sway * 0.2, 0.29];
      right = [-0.018, 0.46 + sway * 0.2, 0.29];
      leftPole = [0.75, -0.8, 0.1];
      rightPole = [-0.75, -0.8, 0.1];
      palms = {l: 'salam', r: 'salam'};
      break;
    default:
      throw new RangeError(`Unknown Blangkon gesture: ${gesture}`);
  }
  // Match Person's shoulder and leave flexion room instead of stretching the elbow straight.
  const reachable = (target, side) => {
    const shoulder = [side * 0.255, SPINE - 0.07, 0];
    const dx = target[0] - shoulder[0], dy = target[1] - shoulder[1], dz = target[2];
    const scale = Math.min(1, (UA + FA - 0.015) / Math.hypot(dx, dy, dz));
    return local(shoulder[0] + dx * scale, shoulder[1] + dy * scale, dz * scale);
  };
  return {
    ...basePose,
    hands: {
      l: gesture === 'walk' && basePose.hands?.l ? basePose.hands.l : reachable(left, 1),
      r: gesture === 'walk' && basePose.hands?.r ? basePose.hands.r : reachable(right, -1),
    },
    pole: {
      l: gesture === 'walk' && basePose.pole?.l ? basePose.pole.l : local(...leftPole, [0, 0, 0]),
      r: gesture === 'walk' && basePose.pole?.r ? basePose.pole.r : local(...rightPole, [0, 0, 0]),
    },
    palms,
  };
}
