import type {SfxCue} from '../../kit/components';

export const FPS = 30;
/** eskalator.wav: 2095680 samples @ 24000 Hz, 1 ch = 87.32 s. */
export const AUDIO_SECONDS = 87.32;
export const TOTAL_FRAMES = 2620;

/**
 * Word onsets (seconds) copied from out/videos/eskalator/words.txt
 * (local whisper.cpp, about ±0.2 s; not forced alignment). Names follow the script spelling.
 */
export const CUES = {
  TENGAH: 2.62,
  BERTINGKAT: 3.35,
  SEJAJAR: 6.6,
  MENGHILANG: 7.44,
  KOK_BISA: 9.64,
  BEDAH: 11.0,
  MOTOR: 14.56,
  RANTAI: 15.77,
  MENARIK: 16.67,
  PUTARAN: 18.82,
  RODA: 21.72,
  DEPAN: 22.5,
  BELAKANG: 22.93,
  JALUR_REL: 25.54,
  DIRANCANG: 27.42,
  PEMANDU: 30.01,
  RANTAI_TARIK: 31.13,
  REL_POSISI: 32.88,
  MIRING: 36.93,
  TERSUSUN: 39.24,
  MENDATAR: 43.68,
  BERDIRI: 45.37,
  UJUNG: 47.82,
  BERUBAH: 49.37,
  SELISIH: 50.84,
  BERKURANG: 53.24,
  SEJAJAR2: 55.1,
  PELAT: 58.59,
  SISIR: 59.69,
  BERBELOK: 60.67,
  BALIK: 65.2,
  BERPUTAR: 70.1,
  MUNCUL: 71.18,
  MENGULANGI: 72.23,
  MENGECIL: 76.61,
  TERLIPAT: 77.39,
  GERAK: 79.62,
  SUSUNAN: 81.78,
  TERNYATA: 83.12,
  SEPARUH: 85.29,
} as const;

export type TitleColor = 'w' | 'y' | 'o' | 't' | 'd';
/** Keyword titles shown at the top. At most 4 words per line, one title at a time. */
export const TITLES: {a: number; b: number; lines: {text: string; size: number; c: TitleColor}[]}[] = [
  {a: 0.3, b: 2.6, lines: [{text: 'ANAK TANGGA', size: 96, c: 'w'}, {text: 'ESKALATOR', size: 96, c: 't'}]},
  {a: CUES.BERTINGKAT - 0.15, b: 4.45, lines: [{text: 'BERTINGKAT', size: 104, c: 'y'}]},
  {a: 6.35, b: 7.55, lines: [{text: 'SEJAJAR', size: 112, c: 'y'}]},
  {a: 7.6, b: 9.35, lines: [{text: 'MENGHILANG', size: 104, c: 'w'}, {text: 'ke bawah lantai', size: 60, c: 'd'}]},
  {a: CUES.KOK_BISA - 0.05, b: 10.85, lines: [{text: 'KOK BISA?', size: 128, c: 'y'}]},
  {a: CUES.BEDAH - 0.1, b: 12.8, lines: [{text: 'KITA BEDAH', size: 112, c: 'w'}]},
  {a: CUES.MOTOR - 0.15, b: 15.9, lines: [{text: 'MOTOR', size: 120, c: 'o'}]},
  {a: 15.95, b: 18.5, lines: [{text: 'RANTAI', size: 120, c: 'o'}, {text: 'menarik anak tangga', size: 60, c: 'd'}]},
  {a: 18.6, b: 20.35, lines: [{text: 'PUTARAN', size: 104, c: 'w'}, {text: 'terus berulang', size: 60, c: 'd'}]},
  {a: CUES.RODA - 0.15, b: 24.0, lines: [{text: 'RODA', size: 128, c: 'y'}, {text: 'depan + belakang', size: 60, c: 'd'}]},
  {a: 25.3, b: 28.5, lines: [{text: 'DUA JALUR', size: 104, c: 't'}, {text: 'REL', size: 128, c: 't'}]},
  {a: 29.0, b: 30.95, lines: [{text: 'REL = PEMANDU', size: 96, c: 't'}]},
  {a: 31.0, b: 32.6, lines: [{text: 'RANTAI', size: 112, c: 'o'}, {text: 'menarik', size: 60, c: 'd'}]},
  {a: 32.7, b: 36.5, lines: [{text: 'REL', size: 112, c: 't'}, {text: 'menentukan posisi', size: 60, c: 'd'}]},
  {a: 36.9, b: 39.0, lines: [{text: 'BAGIAN MIRING', size: 104, c: 'w'}]},
  {a: 39.1, b: 41.5, lines: [{text: 'BERTINGKAT', size: 112, c: 'y'}]},
  {a: 42.2, b: 45.2, lines: [{text: 'PIJAKAN', size: 112, c: 'y'}, {text: 'tetap mendatar', size: 64, c: 'd'}]},
  {a: 45.3, b: 46.85, lines: [{text: 'BISA BERDIRI', size: 104, c: 'w'}]},
  {a: 47.6, b: 50.6, lines: [{text: 'JALUR REL', size: 104, c: 't'}, {text: 'berubah bentuk', size: 60, c: 'd'}]},
  {a: 50.9, b: 54.0, lines: [{text: 'BEDA TINGGI', size: 104, c: 'y'}, {text: 'berkurang', size: 64, c: 'd'}]},
  {a: 54.3, b: 57.0, lines: [{text: 'SEJAJAR', size: 120, c: 'y'}, {text: 'seperti lantai', size: 60, c: 'd'}]},
  {a: 58.2, b: 60.4, lines: [{text: 'PELAT BERGIGI', size: 96, c: 'y'}, {text: 'seperti sisir', size: 60, c: 'd'}]},
  {a: 60.5, b: 62.65, lines: [{text: 'MASUK KE BAWAH', size: 88, c: 'w'}, {text: 'lantai', size: 64, c: 'd'}]},
  {a: 64.2, b: 66.9, lines: [{text: 'JALUR BALIK', size: 112, c: 't'}]},
  {a: 66.95, b: 68.6, lines: [{text: 'UJUNG SATUNYA', size: 96, c: 'w'}]},
  {a: 69.9, b: 71.1, lines: [{text: 'BERPUTAR LAGI', size: 104, c: 'w'}]},
  {a: 71.2, b: 72.6, lines: [{text: 'MUNCUL KEMBALI', size: 96, c: 'y'}]},
  {a: 72.7, b: 74.5, lines: [{text: 'MENGULANGI', size: 112, c: 'w'}]},
  {a: 75.1, b: 78.0, lines: [{text: 'BUKAN MENGECIL', size: 96, c: 'w'}, {text: 'atau terlipat', size: 64, c: 'd'}]},
  {a: 78.35, b: 80.4, lines: [{text: 'MOTOR + RANTAI', size: 96, c: 'o'}, {text: 'menggerakkan', size: 60, c: 'd'}]},
  {a: 80.5, b: 82.9, lines: [{text: 'BENTUK REL', size: 104, c: 't'}, {text: 'mengatur susunan', size: 60, c: 'd'}]},
  {a: 83.1, b: 85.15, lines: [{text: 'YANG KITA NAIKI', size: 88, c: 'w'}]},
  {a: CUES.SEPARUH - 0.1, b: 88, lines: [{text: 'CUMA SEPARUH', size: 120, c: 'y'}, {text: 'dari perjalanannya', size: 60, c: 'd'}]},
];

/** Sound onsets (seconds), placed in the pauses between sentences. Gain multiplies the sfxVolume prop. */
export const SFX: SfxCue[] = [
  {t: 2.1, type: 'whoosh', gain: 0.6},
  {t: 4.2, type: 'tick', gain: 0.7},
  {t: 9.25, type: 'pop', gain: 0.6},
  {t: 12.45, type: 'whoosh', gain: 0.7},
  {t: 16.28, type: 'tick', gain: 0.7},
  {t: 20.2, type: 'whoosh', gain: 0.6},
  {t: 23.65, type: 'pop', gain: 0.5},
  {t: 28.6, type: 'tick', gain: 0.7},
  {t: 30.65, type: 'pop', gain: 0.5},
  {t: 36.4, type: 'whoosh', gain: 0.6},
  {t: 46.7, type: 'tick', gain: 0.7},
  {t: 56.8, type: 'pop', gain: 0.6},
  {t: 62.5, type: 'whoosh', gain: 0.6},
  {t: 68.2, type: 'whoosh', gain: 0.6},
  {t: 74.0, type: 'pop', gain: 0.6},
  {t: 82.5, type: 'whoosh', gain: 0.5},
  {t: 85.0, type: 'pop', gain: 0.7},
];
