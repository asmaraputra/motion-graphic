import type {SfxCue} from '../../kit/components';

export const FPS = 30;
/** orang-tua.mp3: 3314304 samples @ 44100 Hz, 1 ch = 75.154286 s. */
export const AUDIO_SECONDS = 75.154286;
export const TOTAL_FRAMES = 2255;

/**
 * Word onsets (seconds) copied from out/videos/orang-tua/words.txt
 * (local whisper.cpp, about ±0.2 s; not forced alignment).
 */
export const CUES = {
  TELEPON: 1.01,
  NANTI: 5.0,
  MALAM: 8.32,
  LUPA: 9.58,
  BANYAK_WAKTU: 13.46,
  PULANG: 15.05,
  LIBUR: 16.2,
  JALAN: 18.08,
  LONGGAR: 19.89,
  TUNGGU: 21.6,
  SIBUK: 23.67,
  CAPEK: 25.69,
  RUMAH: 27.03,
  BESOK: 29.18,
  PULANG2: 31.84,
  PELAN: 35.37,
  TV: 36.21,
  KERAS: 37.27,
  CERITA: 39.14,
  DICERITAKAN: 41.9,
  ANEH: 43.79,
  DULU: 47.19,
  KUAT: 48.17,
  MASALAH: 51.17,
  SADAR: 53.04,
  DITANYA: 55.32,
  CAPEK2: 56.24,
  SAKIT: 57.62,
  TELEPON2: 59.98,
  LANGSUNG: 60.84,
  NGOBROL: 61.9,
  MAKAN: 64.45,
  DENGAR: 65.4,
  WAKTU_LUANG: 70.92,
  SEMENTARA: 72.0,
  BERTAMBAH: 74.03,
} as const;

/** Contiguous scenes from 0 to AUDIO_SECONDS. */
export const SCENES = [
  {id: 'nanti', a: 0, b: 6.8},
  {id: 'malam', a: 6.8, b: 10.45},
  {id: 'waktu', a: 10.45, b: 14.7},
  {id: 'tunggu', a: 14.7, b: 22.0},
  {id: 'sibuk', a: 22.0, b: 29.5},
  {id: 'pulang', a: 29.5, b: 33.45},
  {id: 'rumah', a: 33.45, b: 38.15},
  {id: 'cerita', a: 38.15, b: 42.6},
  {id: 'dulu', a: 42.6, b: 51.7},
  {id: 'ditanya', a: 51.7, b: 58.2},
  {id: 'telepon', a: 58.2, b: 68.45},
  {id: 'tua', a: 68.45, b: AUDIO_SECONDS},
] as const;

export const scene = (id: (typeof SCENES)[number]['id']) => SCENES.find((s) => s.id === id)!;

/** Sound onsets (seconds), placed in pauses between words. Gain multiplies the sfxVolume prop. */
export const SFX: SfxCue[] = [
  {t: 4.75, type: 'tick', gain: 0.7},
  {t: 6.75, type: 'whoosh', gain: 0.7},
  {t: 10.4, type: 'whoosh', gain: 0.6},
  {t: 14.65, type: 'tick', gain: 0.6},
  {t: 21.95, type: 'whoosh', gain: 0.6},
  {t: 24.15, type: 'pop', gain: 0.6},
  {t: 29.4, type: 'whoosh', gain: 0.7},
  {t: 32.25, type: 'tick', gain: 0.6},
  {t: 35.85, type: 'pop', gain: 0.5},
  {t: 42.65, type: 'whoosh', gain: 0.5},
  {t: 51.75, type: 'whoosh', gain: 0.6},
  {t: 55.8, type: 'pop', gain: 0.6},
  {t: 58.15, type: 'whoosh', gain: 0.6},
  {t: 61.7, type: 'tick', gain: 0.8},
  {t: 68.45, type: 'whoosh', gain: 0.5},
  {t: 71.8, type: 'pop', gain: 0.6},
];
