import {armAt, workerMotion, type WorkerArm, type WorkerMotionInput} from './worker-motion';

export type OrangHinduMood = 'neutral' | 'happy' | 'sad' | 'angry' | 'surprised' | 'thinking';
export type OrangHinduPose = 'neutral' | 'wave' | 'point' | 'think' | 'hip' | 'happy' | 'sad' | 'angry' | 'surprised' | 'walk';
export type OrangHinduMotionInput = WorkerMotionInput & {
  pose?: OrangHinduPose;
  mood?: OrangHinduMood;
  armL?: WorkerArm;
  armR?: WorkerArm;
};
const POSES: Record<OrangHinduPose, {mood: OrangHinduMood; l: WorkerArm; r: WorkerArm}> = {
  neutral: {mood:'neutral',l:'idle',r:'idle'},
  wave: {mood:'happy',l:'idle',r:'wave'},
  point: {mood:'neutral',l:'hip',r:'point'},
  think: {mood:'thinking',l:'hip',r:'chin'},
  hip: {mood:'neutral',l:'hip',r:'hip'},
  happy: {mood:'happy',l:[130,0],r:[130,0]},
  sad: {mood:'sad',l:'idle',r:'idle'},
  angry: {mood:'angry',l:'hip',r:'hip'},
  surprised: {mood:'surprised',l:'hold',r:'hold'},
  walk: {mood:'neutral',l:[-18,12],r:[18,-12]},
};
const compactArm = (side: -1 | 1, pose: WorkerArm, time: number) => {
  const arm = armAt(side, pose, time);
  const map = ([x,y]: readonly number[]): readonly [number,number] => [x*0.65,y*0.65-15];
  const shoulder=map(arm.shoulder), elbow=map(arm.elbow), hand=map(arm.hand);
  return {shoulder,elbow,hand,d:`M${shoulder.join(' ')} Q${elbow.join(' ')} ${hand.join(' ')}`};
};

/** Same deterministic skeleton as Worker, rescaled for the reference's compact body. */
export const orangHinduState = (time: number, input: OrangHinduMotionInput = {}) => {
  const t=Number.isFinite(time)?time:0;
  const {pose='neutral',mood,armL,armR,idleOffset=0,...motionInput}=input;
  const preset=POSES[pose];
  const walk=motionInput.walk ?? (pose==='walk'?t*1.5:0);
  const motion=workerMotion(t,{...motionInput,walk,idleOffset});
  const clock=t+(Number.isFinite(idleOffset)?idleOffset:0);
  const swing=Math.sin(walk*Math.PI*2)*24;
  return {...motion,mood:mood??preset.mood,
    left:compactArm(-1,armL??(pose==='walk'?[-swing,12]:preset.l),clock),
    right:compactArm(1,armR??(pose==='walk'?[swing,-12]:preset.r),clock)};
};
