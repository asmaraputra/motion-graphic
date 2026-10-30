import type {SfxCue} from '../../kit/components';

export const FPS = 30;
/** cerita-capek.wav: 1753920 samples @ 24000 Hz, 1 ch = 73.08 s. */
export const AUDIO_SECONDS = 73.08;
export const TOTAL_FRAMES = 2193;

/**
 * Word onsets (seconds) copied from out/videos/cerita-capek/words.txt
 * (local whisper.cpp, about ±0.2 s; not forced alignment).
 * ASR heard "Biah, biasa", "Menjolang", "penek-pendek", "Enggak"; screen text follows the script.
 */
export const CUES = {
  TADI: 1.82,
  JAWABNYA: 3.26,
  BIASA: 4.77,
  PADAHAL: 6.34,
  PANJANG: 8.22,
  PABRIK: 8.86,
  MESIN: 10.59,
  LEMBARAN: 13.22,
  PIKIRAN: 16.08,
  CACAT: 17.97,
  MENJELANG: 19.26,
  DUDUK: 21.42,
  BEGITU: 24.48,
  SEPATU: 26.08,
  MENGAJAK: 27.65,
  PENDEK: 29.48,
  KOK: 30.5,
  MASALAH: 32.06,
  NGGAK: 33.46,
  CAPEK: 34.27,
  KADANG: 35.54,
  MAU_CERITA: 37.7,
  ISTIRAHAT: 39.59,
  MENANGGAPI: 40.82,
  KEPALA: 42.71,
  SEMENTARA: 45.74,
  MEREKA: 48.45,
  MUNGKIN: 51.14,
  SEDIKIT: 52.78,
  CUMA_CAPEK: 54.13,
  AKU_MANDI: 55.92,
  HABIS: 57.7,
  MAU_DENGAR: 58.7,
  SUPAYA: 59.78,
  MENEBAK: 61.34,
  DIAM_KITA: 62.12,
  SEHARIAN: 62.86,
  TENANG: 65.53,
  DUDUK_DEKAT: 66.3,
  CUKUP: 70.08,
  SEBELUM: 70.46,
  MULAI: 72.28,
} as const;

/** Contiguous scenes from 0 to AUDIO_SECONDS. From `sepatu` on, one room world with a camera. */
export const SCENES = [
  {id: 'pintu', a: 0, b: 6.25},
  {id: 'panjang', a: 6.25, b: 8.6},
  {id: 'pabrik', a: 8.6, b: 19.1},
  {id: 'pulang', a: 19.1, b: 24.4},
  {id: 'sepatu', a: 24.4, b: 30.35},
  {id: 'diam', a: 30.35, b: 35.45},
  {id: 'kepala', a: 35.45, b: 45.6},
  {id: 'menunggu', a: 45.6, b: 51.0},
  {id: 'ucap', a: 51.0, b: 59.7},
  {id: 'tebak', a: 59.7, b: 62.75},
  {id: 'tenang', a: 62.75, b: AUDIO_SECONDS},
] as const;

export const scene = (id: (typeof SCENES)[number]['id']) => SCENES.find((s) => s.id === id)!;

/** Keyword titles (screen space, top of the safe area). Windows must not overlap. */
export const TITLES = [
  {a: 6.45, b: 8.55, lines: ['HARI ITU', 'PANJANG']},
  {a: 10.5, b: 12.9, lines: ['SUARA MESIN']},
  {a: 13.1, b: 15.8, lines: ['LEMBARAN KAYU']},
  {a: 17.2, b: 19.0, lines: ['JANGAN ADA', 'CACAT']},
  {a: 21.3, b: 24.2, lines: ['DUDUK', 'SEBENTAR']},
  {a: 28.9, b: 30.25, lines: ['PENDEK-PENDEK']},
  {a: 39.4, b: 42.4, lines: ['ISTIRAHAT', 'DULU']},
  {a: 42.6, b: 45.4, lines: ['KEPALA', 'MASIH PENUH']},
  {a: 48.3, b: 50.9, lines: ['MEREKA JUGA', 'PUNYA CERITA']},
  {a: 52.6, b: 54.0, lines: ['SEDIKIT', 'LEBIH PANJANG']},
  {a: 60.3, b: 62.6, lines: ['NGGAK HARUS', 'MENEBAK-NEBAK']},
  {a: 65.3, b: 68.4, lines: ['INGIN TENANG']},
  {a: 70.4, b: AUDIO_SECONDS, lines: ['PELAN-PELAN', 'MULAI CERITA']},
] as const;

/** Sound onsets (seconds), placed in pauses next to keywords. Gain multiplies the sfxVolume prop. */
export const SFX: SfxCue[] = [
  {t: 1.6, type: 'pop', gain: 0.5},
  {t: 4.5, type: 'pop', gain: 0.5},
  {t: 6.6, type: 'whoosh', gain: 0.6},
  {t: 8.6, type: 'whoosh', gain: 0.6},
  {t: 15.85, type: 'tick', gain: 0.6},
  {t: 19.05, type: 'whoosh', gain: 0.6},
  {t: 21.05, type: 'pop', gain: 0.5},
  {t: 24.25, type: 'whoosh', gain: 0.6},
  {t: 26.75, type: 'tick', gain: 0.6},
  {t: 30.3, type: 'pop', gain: 0.5},
  {t: 33.25, type: 'pop', gain: 0.6},
  {t: 35.35, type: 'whoosh', gain: 0.5},
  {t: 42.45, type: 'tick', gain: 0.6},
  {t: 45.55, type: 'whoosh', gain: 0.5},
  {t: 50.95, type: 'whoosh', gain: 0.5},
  {t: 55.55, type: 'pop', gain: 0.5},
  {t: 58.45, type: 'pop', gain: 0.6},
  {t: 60.55, type: 'tick', gain: 0.5},
  {t: 62.7, type: 'whoosh', gain: 0.5},
  {t: 66.05, type: 'pop', gain: 0.5},
  {t: 70.3, type: 'pop', gain: 0.6},
];
