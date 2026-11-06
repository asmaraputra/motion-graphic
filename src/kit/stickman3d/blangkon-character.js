import * as T from 'three';
import {FA, HR, Person, mat} from './lib3d.js';

const COLORS = {
  skin: '#F4D5AE', cloth: '#232326', hood: '#171719',
  face: '#30251F', leg: '#4B280F', shoe: '#25170F',
};
const MOUTH_COLUMNS = 20;
const MOUTH_ROWS = 6;
const HAND_UP = new T.Vector3(0, 1, 0);

function makeGestureHand(parent, material, side) {
  const group = new T.Group();
  group.name = `gesture-hand-${side === 1 ? 'l' : 'r'}`;
  group.visible = false;
  parent.add(group);
  const palm = addMesh(group, new T.SphereGeometry(1, 16, 12), material, 'palm');
  palm.position.y = 0.035;
  palm.scale.set(0.038, 0.043, 0.016);
  const fingerGeometry = new T.CapsuleGeometry(0.009, 0.045, 4, 8);
  const fingers = [];
  for (let i = 0; i < 4; i++) {
    const finger = addMesh(group, fingerGeometry, material, i === 0 ? 'index-finger' : `finger-${i}`);
    finger.position.set(-side * (0.025 - i * 0.017), 0.09, 0);
    fingers.push(finger);
  }
  const thumb = addMesh(group, fingerGeometry, material, 'thumb');
  thumb.position.set(-side * 0.043, 0.034, 0.003);
  thumb.rotation.z = -side * 0.75;
  thumb.scale.set(1.1, 0.68, 1.1);
  return {group, fingers};
}

function addMesh(parent, geometry, material, name) {
  const object = new T.Mesh(geometry, material);
  object.name = name;
  parent.add(object);
  return object;
}

function trimPath(parent, material, points, name, radius = 0.0035) {
  const curve = new T.CatmullRomCurve3(points.map((point) => new T.Vector3(...point)));
  return addMesh(parent, new T.TubeGeometry(curve, points.length * 5, radius, 6, false), material, name);
}

// Vertical cloth strips follow the cap instead of floating on a flat front plane.
function ribbon(parent, material, sample, width, name) {
  const positions = [], indices = [];
  for (let i = 0; i <= 48; i++) {
    const [x, y, z] = sample(i / 48);
    positions.push(x, y - width / 2, z, x, y + width / 2, z);
    if (i < 48) {
      const a = i * 2;
      indices.push(a, a + 1, a + 2, a + 2, a + 1, a + 3);
    }
  }
  const geometry = new T.BufferGeometry();
  geometry.setAttribute('position', new T.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return addMesh(parent, geometry, material, name);
}

function makeBlangkon(head) {
  const group = new T.Group();
  group.name = 'blangkon-solo-simplified';
  head.add(group);
  const brown = mat('#67401F', {side: T.DoubleSide});
  const dark = mat('#392A20', {side: T.DoubleSide});
  const gold = mat('#B58332', {side: T.DoubleSide});
  const light = mat('#D4AC61', {side: T.DoubleSide});
  const crown = addMesh(group,
    new T.SphereGeometry(0.25, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2),
    brown, 'rounded-crown');
  crown.position.y = 0.13;
  crown.scale.y = 0.78;

  const wrap = (u, offset = 0, radius = 0.251) => {
    const angle = u * Math.PI * 2;
    return [Math.sin(angle) * radius,
      0.159 + 0.018 * Math.abs(Math.sin(angle)) - 0.045 * Math.max(0, -Math.cos(angle)) + offset,
      Math.cos(angle) * radius];
  };
  ribbon(group, dark, (u) => wrap(u), 0.055, 'lower-wrap');
  ribbon(group, gold, (u) => wrap(u, 0.018, 0.253), 0.009, 'wrap-gold-edge');
  ribbon(group, brown, (u) => wrap(u, -0.015, 0.253), 0.008, 'wrap-fold');

  for (const side of [-1, 1]) {
    const cross = (u, offset = 0, radius = 0.255) => {
      const angle = (u - 0.5) * 2.6;
      const x = Math.sin(angle) * 0.195;
      const y = 0.195 + side * x * 0.32 + offset;
      const height = (y - 0.13) / 0.78;
      const z = Math.sqrt(Math.max(0, 0.25 ** 2 - x ** 2 - height ** 2));
      return [x, y, z + radius - 0.25 + (side === 1 ? 0.002 : 0)];
    };
    ribbon(group, dark, (u) => cross(u), 0.045, `cross-fold-outline-${side}`);
    ribbon(group, gold, (u) => cross(u, 0, 0.257), 0.034, `cross-fold-${side}`);
    ribbon(group, light, (u) => cross(u, 0.012, 0.259), 0.004, `cross-fold-edge-${side}`);
  }

  // The reference has a compact rear fold, not a large spherical ceremonial knot.
  const rear = addMesh(group, new T.SphereGeometry(0.073, 24, 16), dark, 'compact-rear-fold');
  rear.position.set(0, 0.113, -0.247);
  rear.scale.set(0.84, 1, 0.53);
  for (const side of [-1, 1]) {
    const tip = addMesh(group, new T.ConeGeometry(0.031, 0.074, 3), brown, `rear-tuck-${side}`);
    tip.position.set(side * 0.159, 0.065, -0.192);
    tip.rotation.set(0, side * 0.35, Math.PI + side * 0.14);
    tip.scale.z = 0.38;
  }
  return group;
}

function makeSpeechMouth(material) {
  const geometry = new T.BufferGeometry();
  geometry.setAttribute('position', new T.BufferAttribute(
    new Float32Array((MOUTH_COLUMNS + 1) * (MOUTH_ROWS + 1) * 3), 3,
  ).setUsage(T.DynamicDrawUsage));
  const indices = [];
  for (let i = 0; i < MOUTH_COLUMNS; i++) {
    for (let row = 0; row < MOUTH_ROWS; row++) {
      const a = i * (MOUTH_ROWS + 1) + row;
      const b = a + MOUTH_ROWS + 1;
      indices.push(a, a + 1, b, b, a + 1, b + 1);
    }
  }
  geometry.setIndex(indices);
  const mouth = new T.Mesh(geometry, material);
  mouth.name = 'speech-mouth';
  return mouth;
}

/** A neutral reusable illustration; the clothes are not a universal ceremonial dress specification. */
export class BlangkonCharacter extends Person {
  constructor(scene) {
    super(scene, {...COLORS});
    this.g.name = 'blangkon-character';
    // Keep hidden base resources in the actor tree so Person.dispose owns their lifetime.
    this.hoodM.visible = false;
    this.back.visible = false;
    this.mouth.visible = false;
    this.blangkon = makeBlangkon(this.head);

    const skin = this.head.children[0].material;
    this.gestureHands = {
      l: makeGestureHand(this.g, skin, 1),
      r: makeGestureHand(this.g, skin, -1),
    };
    this.handDirection = new T.Vector3();
    this.handRotation = new T.Quaternion();
    for (const side of [-1, 1]) {
      const ear = addMesh(this.head, new T.SphereGeometry(0.038, 16, 12), skin, `ear-${side}`);
      ear.position.set(side * 0.222, -0.015, 0);
      ear.scale.set(0.52, 1, 0.7);
    }

    const cloth = mat('#4B280F', {side: T.DoubleSide});
    const gold = mat('#C59A44', {side: T.DoubleSide});
    const kain = addMesh(this.torso,
      new T.CylinderGeometry(0.183, 0.217, 0.64, 32), cloth, 'wrapped-brown-kain');
    kain.position.y = -0.45;
    kain.scale.z = 0.81;
    this.kain = kain;
    this.hemPoint = new T.Vector3();
    this.hemNormal = new T.Vector3();
    this.hemNormalMatrix = new T.Matrix3();
    this.hemPlane = new T.Vector4(0, -1, 0, 0);
    // The ankle-length kain occludes the legs above its moving hem.
    const legMaterial = this.limbs.l.th.material;
    legMaterial.uniforms.kainHemPlane = {value: this.hemPlane};
    legMaterial.fragmentShader = legMaterial.fragmentShader.replace(
      'void main(){',
      'uniform vec4 kainHemPlane;\nvoid main(){if(dot(vec4(vP,1.0),kainHemPlane)<0.0)discard;',
    );
    const overlap = addMesh(this.torso,
      new T.BoxGeometry(0.069, 0.57, 0.008), cloth, 'kain-overlap');
    overlap.position.set(0.029, -0.46, 0.169);
    overlap.rotation.z = -0.045;
    const belt = addMesh(this.torso,
      new T.CylinderGeometry(0.218, 0.218, 0.018, 32), gold, 'jacket-hem');
    belt.position.y = -0.147;
    belt.scale.z = 0.91;
    const collar = addMesh(this.torso,
      new T.TorusGeometry(0.11, 0.014, 8, 32), gold, 'gold-collar');
    collar.position.y = 0.322;
    collar.rotation.x = Math.PI / 2;

    const onJacket = ([x, y]) => {
      const cap = Math.max(0, Math.abs(y) - 0.15);
      const z = Math.sqrt(Math.max(0.0001, 0.215 ** 2 - x ** 2 - cap ** 2)) + 0.006;
      return [x, y, z];
    };
    for (const side of [-1, 1]) {
      const line = (points, name, radius) => trimPath(this.torso, gold,
        points.map(([x, y]) => onJacket([side * x, y])), name, radius);
      line([[0.018, 0.26], [0.018, 0.05], [0.018, -0.19], [0.13, -0.24]], `jacket-edge-${side}`, 0.004);
      line([[0.13, -0.24], [0.105, -0.255], [0.045, -0.255], [0.018, -0.19]], `jacket-hem-${side}`);
      for (let i = 0; i < 4; i++) {
        const y = 0.19 - i * 0.085;
        line([[0.035, y], [0.06, y + 0.018], [0.078, y + 0.01],
          [0.065, y - 0.005], [0.09, y - 0.021], [0.115, y - 0.012]],
        `jacket-motif-${side}-${i}`, 0.003);
      }
      const cuff = addMesh(this.limbs[side === -1 ? 'l' : 'r'].fa,
        new T.CylinderGeometry(0.064, 0.064, 0.026, 20), gold, `gold-cuff-${side}`);
      cuff.position.y = FA / 2;
    }
    const edging = Array.from({length: 13}, (_, i) => [
      i % 2 === 0 ? 0.008 : 0.018, -0.2 - i * 0.043, 0.185,
    ]);
    trimPath(this.torso, gold, edging, 'kain-gold-edge', 0.004);

    this.speechMouth = makeSpeechMouth(new T.MeshBasicMaterial({
      color: COLORS.face, side: T.DoubleSide,
    }));
    this.head.add(this.speechMouth);
    this.updateSpeechMouth(0, 0, 0);
  }

  updateSpeechMouth(talk, expression, look) {
    const positions = this.speechMouth.geometry.attributes.position;
    for (let i = 0; i <= MOUTH_COLUMNS; i++) {
      const u = i / MOUTH_COLUMNS * 2 - 1;
      const x = u * 0.064 + look;
      // Speech never raises this upper contour; only the lower contour opens.
      const upper = -0.088 + expression * 0.014 * (2 * u * u - 1);
      const lower = upper - (0.006 + talk * 0.055) * Math.sqrt(Math.max(0, 1 - u * u));
      for (let row = 0; row <= MOUTH_ROWS; row++) {
        const y = upper + (lower - upper) * row / MOUTH_ROWS;
        const z = Math.sqrt(Math.max(0, HR * HR - x * x - y * y)) + 0.002;
        positions.setXYZ(i * (MOUTH_ROWS + 1) + row, x, y, z);
      }
    }
    positions.needsUpdate = true;
    this.speechMouth.geometry.computeBoundingBox();
    this.speechMouth.geometry.computeBoundingSphere();
  }

  updateGestureHands(pose, contacts) {
    for (const side of ['l', 'r']) {
      const {group, fingers} = this.gestureHands[side];
      const style = pose.palms?.[side];
      const sign = side === 'l' ? 1 : -1;
      group.visible = Boolean(style);
      group.position.copy(contacts[side].hand);
      // Keep opt-in meshes inside the old silhouette even during bounds-only model-sheet queries.
      this.handDirection.subVectors(contacts[side].hand, contacts[side].elbow).normalize();
      this.handRotation.copy(this.torso.quaternion).invert();
      this.handDirection.applyQuaternion(this.handRotation);
      if (style === 'point') this.handDirection.set(sign * 0.94, 0.1, 0.32).normalize();
      this.handRotation.setFromUnitVectors(HAND_UP, this.handDirection);
      group.quaternion.copy(this.torso.quaternion).multiply(this.handRotation);
      if (style === 'salam') {
        group.quaternion.copy(this.torso.quaternion);
        group.rotateY(sign * Math.PI / 2);
      }
      if (style) this.limbs[side].fist.visible = false;
      for (let i = 0; i < fingers.length; i++) {
        const curled = style === 'point' && i !== 0;
        fingers[i].position.y = curled ? 0.063 : 0.09 + (i === 1 ? 0.008 : i === 3 ? -0.01 : 0);
        fingers[i].position.z = curled ? 0.024 : 0;
        fingers[i].rotation.x = curled ? -1.25 : 0;
        fingers[i].scale.y = curled ? 0.48 : 1;
      }
    }
  }

  pose(pose) {
    const contacts = super.pose(pose);
    this.torso.updateWorldMatrix(true, false);
    this.hemPoint.set(0, this.kain.position.y - 0.32, 0).applyMatrix4(this.torso.matrixWorld);
    this.hemNormalMatrix.getNormalMatrix(this.torso.matrixWorld);
    this.hemNormal.set(0, -1, 0).applyMatrix3(this.hemNormalMatrix).normalize();
    this.hemPlane.set(this.hemNormal.x, this.hemNormal.y, this.hemNormal.z, -this.hemNormal.dot(this.hemPoint));
    this.updateGestureHands(pose, contacts);
    const face = pose.face || {};
    const requested = face.talk ?? 0;
    const talk = Number.isNaN(requested) ? 0 : Math.max(0, Math.min(1, requested));
    this.updateSpeechMouth(talk,
      Math.max(-1, Math.min(1, face.mouth || 0)),
      Math.max(-1, Math.min(1, face.look || 0)) * 0.03);
    return contacts;
  }
}
