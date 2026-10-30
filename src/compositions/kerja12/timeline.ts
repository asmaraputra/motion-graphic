import {Easing, interpolate} from 'remotion';

export const FPS = 30;
/** kerja-12jam.wav: 2,280,000 samples @ 24 kHz mono = 95.000 s. */
export const AUDIO_SECONDS = 95;
export const TOTAL_FRAMES = AUDIO_SECONDS * FPS; // 2850

/**
 * Word onsets (seconds) from local whisper.cpp b5454 (ggml-small, -l id, -ml 1 -sow)
 * on kerja-12jam.wav. Model estimates (about ±0.2 s), not forced alignment.
 */
export const CUES = {
  HOOK_8H: 1.69, // "kerja delapan jam"
  NOW: 4.68, // "Sekarang bayangin"
  FACTORY: 7.37, // "di pabrik"
  HOOK_12H: 8.7, // "jam kerja 12 jam"
  QUESTION: 10.18, // "Sisa hidupnya kebagian berapa jam?"
  COUNT: 12.68, // "Coba kita hitung"
  WORK_12H: 14.46, // "12 jam di tempat kerja"
  BREAK_INCLUDED: 16.0, // "termasuk istirahat"
  COMMUTE: 17.2, // "Perjalanan pulang pergi"
  COMMUTE_1H: 19.0, // "1 jam"
  PREP: 19.71, // "persiapan mandi ganti baju"
  PREP_1H: 22.35, // "1 jam"
  TOTAL_14H: 23.88, // "Sudah 14 jam"
  DAY: 25.9, // "Sehari cuma"
  DAY_24H: 26.78, // "24 jam"
  SLEEP_8H: 28.57, // "kalau tidur 8 jam"
  REMAINING_2H: 31.51, // "sisanya tinggal 2 jam"
  EXTRA_DEMANDS: 32.56, // "Dua jam buat makan"
  NEED_MAKAN: 33.6,
  NEED_NYUCI: 34.34,
  NEED_RUMAH: 35.07,
  NEED_KELUARGA: 36.6, // "ngobrol sama keluarga"
  NEED_BESOK: 38.53, // "ngurus kebutuhan besok"
  ADVICE: 40.04, // "Terus ada yang bilang"
  ADVICE_OLAHRAGA: 43.05,
  ADVICE_SKILL: 43.98,
  ADVICE_USAHA: 45.98,
  JUST_HOME: 47.32, // "Hmm, ini orang baru sampai rumah"
  SHOES: 50.24, // "sepatunya aja"
  STILL_ON: 51.4, // "belum dilepas"
  EMERGENCY: 52.91, // "Belum kalau anak sakit"
  EMG_ANAK: 53.45,
  EMG_MOTOR: 54.29,
  EMG_KELUARGA: 55.99,
  SLEEP_REDUCED: 58.73, // "jam tidur dikurangi"
  LATE_SLEEP: 61.68, // "Malam ini tidur belakangan"
  LATE_STEP: 62.32,
  FIXED_DEPARTURE: 63.69, // "besok tetap harus berangkat"
  SAME_TIME: 65.62, // "jam yang sama"
  DELAY_SLEEP: 66.88, // "Makanya ada orang yang sengaja menunda tidur"
  WORK_CONTROL: 73.44, // "waktunya sudah diatur pekerjaan"
  ONLY_CHANCE: 75.56, // "Dan malam itu satu-satunya kesempatan"
  MY_TIME: 78.63, // "sekarang"
  MY_TIME_2: 79.56, // "giliran waktuku"
  CAPE: 81.45, // "Cape ya?"
  SABAR: 82.12, // "Sabar..."
  NIKMATI: 85.07, // "nikmati aja"
  PERANMU: 86.34, // "peranmu"
  ORANG_LAIN: 87.28, // "Orang lain belum tentu mampu"
  POSISIMU: 89.31, // "ada di posisimu"
  LELAH: 90.08, // "Lelah boleh"
  NYERAH: 91.71, // "nyerah?"
  JANGAN: 92.6, // "jangan."
  SEMANGAT: 93.48, // "Semangat ya!"
} as const;

/** Visual-only beats derived from the cues above. */
export const BEATS = {
  ZOOM_IN: 12.2, // camera enters the day diagram
  UNROLL: 32.75, // ring opens into a timeline
  ROOM_OPEN: 40.1, // the 2-hour box becomes the stage
  SHOE_ZOOM: 49.9,
  ROOM_CLOSE: 52.3, // stage collapses back into the 2-hour slot
  REROLL: 52.85, // timeline closes back into the ring
  NIGHT: 66.9,
} as const;

/** Emergency chips fly into the sleep block this long after being spoken. */
export const LAND = 1.5;
export const LATE_STEPS = 6;
export const LATE_STEP_GAP = 0.45;

/** Each step moves hours from sleep into the red "urusan mendadak" block. Illustrative, never labelled. */
export const EMERGENCY_STEPS = [
  {t: CUES.EMG_ANAK + LAND, h: 0.8, d: 0.5},
  {t: CUES.EMG_MOTOR + LAND, h: 0.8, d: 0.5},
  {t: CUES.EMG_KELUARGA + LAND, h: 0.8, d: 0.5},
  ...Array.from({length: LATE_STEPS}, (_, k) => ({t: CUES.LATE_STEP + k * LATE_STEP_GAP, h: 0.3, d: 0.16})),
];

/** Ring order clockwise from the top; prep sits before work so the 14 h block stays contiguous. */
export const SEGMENT_ORDER = ['prep', 'work', 'commute', 'free', 'emergency', 'sleep'] as const;
export type Seg = (typeof SEGMENT_ORDER)[number];

const CL = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const EASE = Easing.bezier(0.22, 1, 0.36, 1);
const ramp = (t: number, start: number, dur: number, from: number, to: number) =>
  interpolate(t, [start, start + dur], [from, to], {...CL, easing: EASE});

/** Hours per block at time t (seconds). Always sums to 24. */
export const dayHours = (t: number): Record<Seg, number> => {
  const work = t < CUES.HOOK_12H ? ramp(t, CUES.HOOK_8H, 0.8, 0, 8) : ramp(t, CUES.HOOK_12H, 0.9, 8, 12);
  const commute = ramp(t, CUES.COMMUTE, 0.7, 0, 1);
  const prep = ramp(t, CUES.PREP, 0.7, 0, 1);
  const emergency = EMERGENCY_STEPS.reduce((sum, s) => sum + ramp(t, s.t, s.d, 0, s.h), 0);
  const sleep = ramp(t, CUES.SLEEP_8H, 0.9, 0, 8) - emergency;
  const free = 24 - prep - work - commute - emergency - sleep;
  return {prep, work, commute, free, emergency, sleep};
};

export type SfxType = 'whoosh' | 'tick' | 'pop';
type Sfx = {t: number; type: SfxType; gain: number};
const ticks = (times: number[], gain: number, offset = 0): Sfx[] => times.map((t) => ({t: t + offset, type: 'tick', gain}));

/** Pill/card entrance delay after the spoken word. */
export const NEED_DELAY = 0.25;
export const NEEDS = [
  {t: CUES.NEED_MAKAN, label: 'MAKAN'},
  {t: CUES.NEED_NYUCI, label: 'NYUCI'},
  {t: CUES.NEED_RUMAH, label: 'BERESIN RUMAH'},
  {t: CUES.NEED_KELUARGA, label: 'KELUARGA'},
  {t: CUES.NEED_BESOK, label: 'KEBUTUHAN BESOK'},
];

/** Sound onsets (seconds). Gain multiplies the composition's sfxVolume. */
export const SFX: Sfx[] = [
  {t: CUES.HOOK_8H, type: 'pop', gain: 0.7},
  {t: CUES.HOOK_12H - 0.15, type: 'whoosh', gain: 0.6},
  {t: BEATS.ZOOM_IN, type: 'whoosh', gain: 0.5},
  {t: CUES.WORK_12H, type: 'pop', gain: 0.7},
  ...ticks([CUES.COMMUTE, CUES.PREP], 0.5),
  {t: CUES.TOTAL_14H, type: 'pop', gain: 0.8},
  ...ticks([CUES.DAY_24H, CUES.SLEEP_8H], 0.5),
  {t: CUES.REMAINING_2H, type: 'pop', gain: 0.8},
  {t: BEATS.UNROLL, type: 'whoosh', gain: 0.6},
  ...ticks(NEEDS.map((n) => n.t), 0.45, NEED_DELAY),
  {t: BEATS.ROOM_OPEN, type: 'whoosh', gain: 0.55},
  {t: CUES.ADVICE_OLAHRAGA, type: 'pop', gain: 0.65},
  {t: CUES.ADVICE_SKILL, type: 'pop', gain: 0.65},
  {t: CUES.ADVICE_USAHA, type: 'pop', gain: 0.65},
  {t: BEATS.SHOE_ZOOM, type: 'whoosh', gain: 0.5},
  {t: BEATS.ROOM_CLOSE, type: 'whoosh', gain: 0.55},
  ...ticks([CUES.EMG_ANAK, CUES.EMG_MOTOR, CUES.EMG_KELUARGA], 0.5),
  ...ticks([CUES.EMG_ANAK, CUES.EMG_MOTOR, CUES.EMG_KELUARGA], 0.35, LAND),
  {t: CUES.SLEEP_REDUCED, type: 'pop', gain: 0.7},
  ...ticks(Array.from({length: LATE_STEPS}, (_, k) => CUES.LATE_STEP + k * LATE_STEP_GAP), 0.45),
  {t: BEATS.NIGHT, type: 'whoosh', gain: 0.35},
];
