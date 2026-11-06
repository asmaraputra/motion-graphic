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
// Adapted from engine3d/lib3d.js; rendering belongs to ThreeCanvas.
import * as T from 'three';
export const V=(x=0,y=0,z=0)=>new T.Vector3(x,y,z);
export const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
export const lerp=(a,b,t)=>a+(b-a)*t;
export const ease=t=>{t=clamp(t);return t*t*(3-2*t)};
export const seg=(t,a,b)=>clamp((t-a)/(b-a));
export function kf(t,k){if(t<=k[0][0])return k[0][1];for(let i=1;i<k.length;i++)if(t<k[i][0])return lerp(k[i-1][1],k[i][1],ease((t-k[i-1][0])/(k[i][0]-k[i-1][0])));return k[k.length-1][1]}
export function rng(seed){let s=seed>>>0;return()=>{s=(s+0x6D2B79F5)>>>0;let t=s;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
const createLook=()=>({L:{value:V(.45,.72,.53).normalize()},R:{value:V(.82,.25,.5).normalize()},rimC:{value:new T.Color('#ffc496')},rimK:{value:1},shade:{value:new T.Color('#c9b4d6')}});
const VS='varying vec3 vN,vP;varying vec2 vU;void main(){vU=uv;vec4 w=modelMatrix*vec4(position,1.);vP=w.xyz;vN=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*viewMatrix*w;}';
const FS=`uniform vec3 col,L,R,rimC,shade;uniform float rimK,form;uniform sampler2D map;uniform bool hasMap;varying vec3 vN,vP;varying vec2 vU;
void main(){vec3 c=col;if(hasMap){vec4 t=texture2D(map,vU);if(t.a<.5)discard;c=t.rgb;}vec3 N=normalize(vN),Vw=normalize(cameraPosition-vP);
float s=smoothstep(-.12,.2,dot(N,L));c=mix(c,c*mix(shade,vec3(1.),s),form);
float f=1.-max(dot(N,Vw),0.);float r=smoothstep(.70,.74,f)*smoothstep(-.1,.35,dot(N,R));c=mix(c,rimC,r*rimK*form);gl_FragColor=vec4(c,1.);
#include <colorspace_fragment>
}`;
// flat material. o.form 0 turns off shadow tone and rim (walls, floors). o.map is a painted texture.
export function mat(c,o={}){const LOOK=createLook();return new T.ShaderMaterial({toneMapped:false,vertexShader:VS,fragmentShader:FS,side:o.side??T.FrontSide,uniforms:{col:{value:new T.Color(c||'#ffffff')},map:{value:o.map||null},hasMap:{value:!!o.map},form:{value:o.form??1},L:LOOK.L,R:LOOK.R,rimC:LOOK.rimC,rimK:LOOK.rimK,shade:LOOK.shade}})}
export function mesh(g,m){return new T.Mesh(g,m)}
const UP=V(0,1,0);
function setLimb(o,a,b,L){o.position.copy(a).add(b).multiplyScalar(.5);const d=b.clone().sub(a),l=d.length()||1e-4;o.quaternion.setFromUnitVectors(UP,d.divideScalar(l));o.scale.y=l/L}
export function ik3(a,t,l1,l2,pole){let dv=t.clone().sub(a),d=dv.length();const over=Math.max(0,d-(l1+l2-.002));d=clamp(d,Math.abs(l1-l2)+.01,l1+l2-.002);const dir=dv.lengthSq()>1e-12?dv.normalize():V(0,-1,0),x=(l1*l1-l2*l2+d*d)/(2*d),h=Math.sqrt(Math.max(0,l1*l1-x*x)),pp=pole.clone().sub(dir.clone().multiplyScalar(pole.dot(dir)));if(pp.lengthSq()<1e-12)pp.copy(Math.abs(dir.x)<.9?V(1,0,0):V(0,0,1)).addScaledVector(dir,-(Math.abs(dir.x)<.9?dir.x:dir.z));pp.normalize();return {e:a.clone().add(dir.clone().multiplyScalar(x)).add(pp.multiplyScalar(h)),h:a.clone().add(dir.clone().multiplyScalar(d)),over}}
export const THIGH=.33,SHIN=.33,SPINE=.52,UA=.27,FA=.26,HR=.23,STAND=.72,ANK=.07;
export const HERO={skin:'#F8E9CC',cloth:'#FF6B5E',hood:'#E4493F',face:'#1c1a2b',leg:'#2C2A49',shoe:'#17141F'};
export const FRIEND={skin:'#17141F',cloth:'#F6B73C',hood:'#D9962A',face:'#FFFFFF',leg:'#3A2F55',shoe:'#17141F'};
export const STRANGER={skin:'#C9C3CF',cloth:'#2A2536',hood:'#191622',face:'#17141F',leg:'#17141F',shoe:'#0f0d15',coat:true,hat:true};
export const WOMAN={skin:'#E9C6A0',cloth:'#2DB2AE',hood:'#187E86',face:'#1c1a2b',leg:'#2C2A49',shoe:'#17141F',bun:'#3A2030'};
export class Person{
 constructor(sc,c){this.c=c;const g=this.g=new T.Group();sc.add(g);const cl=mat(c.cloth),hd=mat(c.hood),lg=mat(c.leg),sk=mat(c.skin),sh=mat(c.shoe),ink=new T.MeshBasicMaterial({color:c.face});
  const cap=(r,L,m)=>{const o=mesh(new T.CapsuleGeometry(r,L,6,14),m);g.add(o);return o};this.torso=mesh(new T.CapsuleGeometry(.215,.3,8,20),cl);g.add(this.torso);this.hoodM=mesh(new T.TorusGeometry(.13,.062,10,24),hd);g.add(this.hoodM);this.back=mesh(new T.SphereGeometry(.16,16,12),hd);g.add(this.back);
  this.limbs={};for(const k of ['l','r']){const L=this.limbs[k]={th:cap(.088,THIGH,lg),sh:cap(.07,SHIN,lg),ua:cap(.07,UA,cl),fa:cap(.058,FA,cl),shoe:mesh(new T.CapsuleGeometry(.058,.16,4,10),sh),fist:mesh(new T.SphereGeometry(.066,14,12),sk)};g.add(L.shoe,L.fist)}
  const H=this.head=new T.Group();g.add(H);H.add(mesh(new T.SphereGeometry(HR,32,24),sk));this.eyes=[];this.brows=[];const eG=new T.SphereGeometry(1,12,10),bG=new T.CapsuleGeometry(.011,.062,3,6);
  for(const s of [-1,1]){const e=new T.Mesh(eG,ink);e.rotation.y=s*.38;H.add(e);this.eyes.push(e);const b=new T.Mesh(bG,ink);b.position.z=.2;b.rotation.y=s*.4;H.add(b);this.brows.push(b)}
  this.mouth=new T.Mesh(makeMouthGeometry(),ink);H.add(this.mouth);
  if(c.hat){const dk=mat('#14111B'),band=mat('#8E2F2C'),b=mesh(new T.CylinderGeometry(.36,.38,.02,40),dk);b.position.y=.16;const cr=mesh(new T.CylinderGeometry(.19,.235,.21,32),dk);cr.position.y=.27;const bd=mesh(new T.CylinderGeometry(.228,.236,.05,32),band);bd.position.y=.195;H.add(b,cr,bd);
   const gm=new T.MeshBasicMaterial({color:'#0d0b14'});for(const s of [-1,1]){const l=new T.Mesh(new T.CapsuleGeometry(.05,.05,6,14),gm);l.rotation.z=Math.PI/2;l.scale.set(.95,1,.22);l.position.set(s*.087,.035,.228);l.rotation.y=s*.36;H.add(l)}}
  if(c.coat){this.coat=mesh(new T.CylinderGeometry(.26,.37,.82,28,1,true),mat(c.cloth,{side:T.DoubleSide}));g.add(this.coat)}if(c.bun){const b=mesh(new T.SphereGeometry(.1,14,12),mat(c.bun));b.position.set(0,.2,-.13);H.add(b)}}
 // p: pos yaw lean breath feet{l,r} hands{l,r} pole{l,r} hand{l:'fist'} hy hp hr face{mouth,brow,sad,blink,look,lookY}
 pose(p){const yaw=p.yaw,lean=p.lean||0,F=V(Math.sin(yaw),0,Math.cos(yaw)),P=V(...p.pos),U=UP.clone().multiplyScalar(Math.cos(lean)).add(F.clone().multiplyScalar(Math.sin(lean))).normalize(),Fd=F.clone().sub(U.clone().multiplyScalar(F.dot(U))).normalize(),Sd=U.clone().cross(Fd).normalize(),C=P.clone().add(U.clone().multiplyScalar(SPINE)),q=new T.Quaternion().setFromRotationMatrix(new T.Matrix4().makeBasis(Sd,U,Fd)),br=Math.sin(p.breath||0)*.006;
  this.torso.position.copy(P).add(U.clone().multiplyScalar(.24));this.torso.quaternion.copy(q);this.torso.scale.set(1.24,1+br,.9);const nk=C.clone().add(U.clone().multiplyScalar(.05));this.hoodM.position.copy(nk).add(Fd.clone().multiplyScalar(-.01));this.hoodM.quaternion.copy(q).multiply(new T.Quaternion().setFromEuler(new T.Euler(Math.PI/2-.2,0,0)));this.back.position.copy(nk).add(Fd.clone().multiplyScalar(-.1)).add(U.clone().multiplyScalar(-.03));this.back.scale.set(1.15,.8,.7);this.back.quaternion.copy(q);if(this.coat){this.coat.position.copy(P).add(U.clone().multiplyScalar(-.09));this.coat.quaternion.copy(q)}
  const out={};for(const k of ['l','r']){const s=k=='l'?1:-1,L=this.limbs[k],hip=P.clone().add(Sd.clone().multiplyScalar(s*.115)),ft=V(...p.feet[k]),ki=ik3(hip,ft,THIGH,SHIN,F.clone().add(V(0,.1,0)));setLimb(L.th,hip,ki.e,THIGH);setLimb(L.sh,ki.e,ki.h,SHIN);L.shoe.position.copy(ft).add(V(Math.sin(yaw)*.06,-.012,Math.cos(yaw)*.06));L.shoe.quaternion.setFromUnitVectors(UP,V(Math.sin(yaw),0,Math.cos(yaw)));
   const sh=C.clone().add(U.clone().multiplyScalar(-.07)).add(Sd.clone().multiplyScalar(s*.255)),ht=p.hands?.[k]?V(...p.hands[k]):sh.clone().add(U.clone().multiplyScalar(-.5)).add(Sd.clone().multiplyScalar(s*.05)).add(Fd.clone().multiplyScalar(.03)),pole=p.pole?.[k]?V(...p.pole[k]):Fd.clone().multiplyScalar(-1).add(Sd.clone().multiplyScalar(s*.5)).add(U.clone().multiplyScalar(-.25)),ar=ik3(sh,ht,UA,FA,pole);setLimb(L.ua,sh,ar.e,UA);setLimb(L.fa,ar.e,ar.h,FA);L.fist.visible=p.hand?.[k]=='fist';L.fist.position.copy(ar.h).add(ar.h.clone().sub(ar.e).normalize().multiplyScalar(.035));out[k]={hand:ar.h,elbow:ar.e,over:ar.over,foot:ft}}
  this.head.position.copy(C).add(U.clone().multiplyScalar(.07+HR-.02));this.head.quaternion.copy(q).multiply(new T.Quaternion().setFromEuler(new T.Euler(p.hp||0,p.hy||0,p.hr||0,'YXZ')));const f=p.face||{},bl=f.blink||0,lx=(f.look||0)*.03,ly=(f.lookY||0)*.018;
  this.eyes.forEach((e,i)=>{const s=i?1:-1;e.position.set(s*.085+lx,.035+ly,.214);e.scale.set(.019,lerp(.034,.004,bl),.008)});this.brows.forEach((b,i)=>{const s=i?1:-1;b.position.y=.115+(f.brow||0)*.022+ly;b.position.x=s*.085+lx;b.rotation.z=Math.PI/2+s*(f.sad||0)*.3});
  updateMouth(this.mouth.geometry,f.mouth||0,lx);return out}
 dispose(){disposeObject(this.g)}
}
// foot-locked gait along a line. s = distance walked, L = stride.
export function gait(s,L){const p=s/L,n=Math.floor(p),u=p-n,st=(n+.5)*L,a=(n-.5)*L,b=(n+1.5)*L,sx=lerp(a,b,ease(u)),lift=Math.sin(u*Math.PI)*.1,even=n%2==0,pl=[st,0],pr=[sx,lift];return{l:even?pl:pr,r:even?pr:pl,bob:Math.abs(Math.sin(u*Math.PI))*.018,n}}
export function texture(w,h,paint){
 if(typeof globalThis.document==='undefined')throw new Error('Stickman textures require a browser canvas. Create the world inside ThreeCanvas, not at module scope.');
 const canvas=globalThis.document.createElement('canvas');canvas.width=w;canvas.height=h;
 const context=canvas.getContext('2d');if(!context)throw new Error('Could not create the Stickman texture 2D context.');
 paint(context,w,h);const result=new T.CanvasTexture(canvas);result.colorSpace=T.SRGBColorSpace;return result;
}

// Every factory owns its resources; resources are never shared between worlds.
export function disposeObject(root){
 const geometries=new Set(),materials=new Set(),textures=new Set();
 root.traverse(object=>{
  if(object.geometry)geometries.add(object.geometry);
  if(object.material)for(const material of Array.isArray(object.material)?object.material:[object.material])materials.add(material);
  if(object.isLight&&object.shadow)object.shadow.dispose();
 });
 for(const material of materials){
  for(const value of Object.values(material))if(value?.isTexture)textures.add(value);
  for(const uniform of Object.values(material.uniforms||{})){
   if(uniform.value?.isTexture)textures.add(uniform.value);
  }
 }
 for(const geometry of geometries)geometry.dispose();
 for(const material of materials)material.dispose();
 for(const texture of textures)texture.dispose();
 root.removeFromParent();root.clear();
}

function makeMouthGeometry(){
 const geometry=new T.BufferGeometry(),indices=[];
 geometry.setAttribute('position',new T.BufferAttribute(new Float32Array(9*7*3),3).setUsage(T.DynamicDrawUsage));
 for(let i=0;i<8;i++)for(let j=0;j<6;j++){
  const a=i*7+j,b=(i+1)*7+j;indices.push(a,a+1,b,b,a+1,b+1);
 }
 geometry.setIndex(indices);return geometry;
}
function updateMouth(geometry,mouth,look){
 const positions=geometry.attributes.position;
 for(let i=0;i<=8;i++){
  const u=i/8,x=-.07+.14*u;
  const edge=-.095+mouth*.022,mid=-.095-mouth*.055;
  const y=(1-u)*(1-u)*edge+2*(1-u)*u*mid+u*u*edge;
  const dy=2*(1-u)*(mid-edge)+2*u*(edge-mid),length=Math.hypot(.14,dy);
  const nx=-dy/length,ny=.14/length,z=Math.sqrt(Math.max(.001,.0545-x*x-y*y));
  for(let j=0;j<=6;j++){
   const angle=j/6*Math.PI*2,r=.0085*Math.cos(angle);
   positions.setXYZ(i*7+j,x+look+nx*r,y+ny*r,z+.0085*Math.sin(angle));
  }
 }
 positions.needsUpdate=true;geometry.computeBoundingSphere();
}
