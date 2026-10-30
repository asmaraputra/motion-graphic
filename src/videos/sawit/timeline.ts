import type {SfxCue} from '../../kit/components';

export const FPS = 30;
/** sawit.wav: 2199360 samples @ 24000 Hz, 1 ch = 91.64 s. */
export const AUDIO_SECONDS = 91.64;
export const TOTAL_FRAMES = 2750;

/**
 * Word onsets (seconds) copied from out/videos/sawit/words.txt
 * (local whisper.cpp, about ±0.2 s; not forced alignment).
 */
export const CUES = {
  HUTAN: 0.97,
  DIGANTI: 2.12,
  KAYA: 4.48,
  RUGI: 5.77,
  SAWIT: 7.42,
  MINYAK: 8.92,
  BAHAN_BAKAR: 9.69,
  PENGHIDUPAN: 11.0,
  FUNGSI: 13.16,
  SATU_JENIS: 16.33,
  AKAR: 17.54,
  AIR_HUJAN: 19.99,
  MERESAP: 20.72,
  TUTUPAN: 21.82,
  EROSI: 24.07,
  ALIRAN: 25.4,
  POHON: 26.86,
  KARBON: 28.78,
  DIBUKA: 30.17,
  TERBAKAR: 30.87,
  LEPAS: 32.98,
  ATMOSFER: 33.43,
  PEMANASAN: 34.9,
  HABITAT: 37.69,
  ORANGUTAN: 38.34,
  MAKAN: 42.02,
  BERLINDUNG: 42.46,
  BERTAHAN: 43.73,
  KARHUTLA: 44.93,
  KALIMANTAN: 45.71,
  WARGA: 48.97,
  SATWA: 49.96,
  PADAM: 52.49,
  BELUM_SELESAI: 53.67,
  DIPULIHKAN: 56.06,
  TANAH: 58.01,
  AIR: 58.43,
  KEHIDUPAN: 58.98,
  SUDAH_RUSAK: 62.07,
  MEMULIHKAN: 64.11,
  DICORET: 65.66,
  KEBUN: 68.11,
  UANG: 70.82,
  FUNGSI2: 71.62,
  OTOMATIS: 73.02,
  HAMPARAN: 74.22,
  HIJAU: 75.16,
  KERAGAMAN: 76.4,
  BERKURANG: 78.15,
  PANEN: 80.62,
  MENJAGA: 82.6,
  AIR2: 83.19,
  TANAH2: 83.93,
  IKLIM: 84.4,
  SATWA2: 86.02,
  SEMUANYA: 87.17,
  BELUM_TENTU: 89.59,
  HILANG: 91.06,
} as const;

/** Contiguous scenes from 0 to AUDIO_SECONDS, cut in pauses between sentences. */
export const SCENES = [
  {id: 'tanya', a: 0, b: 6.9},
  {id: 'hasil', a: 6.9, b: 12.1},
  {id: 'fungsi', a: 12.1, b: 17.3},
  {id: 'air', a: 17.3, b: 21.6},
  {id: 'erosi', a: 21.6, b: 26.6},
  {id: 'karbon', a: 26.6, b: 35.9},
  {id: 'habitat', a: 35.9, b: 44.4},
  {id: 'karhutla', a: 44.4, b: 51.7},
  {id: 'padam', a: 51.7, b: 60.3},
  {id: 'rusak', a: 60.3, b: 65.95},
  {id: 'kebun', a: 65.95, b: 78.8},
  {id: 'timbang', a: 78.8, b: AUDIO_SECONDS},
] as const;

export type SceneId = (typeof SCENES)[number]['id'];
export const scene = (id: SceneId) => SCENES.find((s) => s.id === id)!;

/** Sound onsets (seconds), placed in pauses between words. Gain multiplies the sfxVolume prop. */
export const SFX: SfxCue[] = [
  {t: 0.05, type: 'whoosh', gain: 0.5},
  {t: 6.6, type: 'pop', gain: 0.6},
  {t: 9.5, type: 'tick', gain: 0.5},
  {t: 12.05, type: 'whoosh', gain: 0.6},
  {t: 17.25, type: 'whoosh', gain: 0.6},
  {t: 21.55, type: 'whoosh', gain: 0.5},
  {t: 26.55, type: 'whoosh', gain: 0.6},
  {t: 29.3, type: 'tick', gain: 0.6},
  {t: 35.85, type: 'whoosh', gain: 0.6},
  {t: 44.35, type: 'whoosh', gain: 0.7},
  {t: 47.6, type: 'tick', gain: 0.5},
  {t: 51.65, type: 'whoosh', gain: 0.5},
  {t: 54.35, type: 'tick', gain: 0.5},
  {t: 60.3, type: 'whoosh', gain: 0.6},
  {t: 62.85, type: 'pop', gain: 0.6},
  {t: 65.9, type: 'whoosh', gain: 0.6},
  {t: 71.15, type: 'pop', gain: 0.5},
  {t: 73.85, type: 'tick', gain: 0.5},
  {t: 78.7, type: 'whoosh', gain: 0.6},
  {t: 86.5, type: 'tick', gain: 0.6},
];
