import type {SfxCue} from '../../kit/components';

export const FPS = 30;
/** produksi-plywood.wav: 1866240 samples @ 24000 Hz, 1 ch = 77.76 s. */
export const AUDIO_SECONDS = 77.76;
export const TOTAL_FRAMES = 2333;

/**
 * Word onsets (seconds) copied from out/videos/produksi-plywood/words.txt
 * (local whisper.cpp, about ±0.2 s; not forced alignment).
 * ASR spellings differ from the script ("playward", "tembukannya", "perkat"); on-screen text follows the script.
 */
export const CUES = {
  PABRIK: 0.17,
  SERIBU: 1.46,
  PRODUKSI: 2.48,
  BELUM_TENTU: 3.04,
  SERIBU2: 3.53,
  KELAS: 4.63,
  PEMBELI: 5.67,
  LHO: 6.26,
  SAMA: 7.07,
  KAYU_LAPIS: 7.72,
  SUDAH_JADI: 8.89,
  BEDA_NASIB: 10.15,
  KARENA: 11.12,
  PEMERIKSAAN: 13.36,
  MUTU: 14.14,
  PERMUKAAN: 14.52,
  RETAK: 16.58,
  LUBANG: 17.17,
  MATA_KAYU: 17.9,
  AMPLAS: 18.76,
  BATAS: 20.11,
  UKURAN: 20.64,
  KETEBALAN: 21.13,
  REKATAN: 22.65,
  PERSYARATAN: 24.27,
  KELIHATAN: 25.57,
  MULUS: 26.22,
  JAUH: 26.91,
  BELUM_TENTU2: 27.19,
  LOLOS: 28.64,
  SIMULASI: 29.64,
  DARI_SERIBU: 31.1,
  DELAPAN_RATUS: 32.4,
  SERATUS_LIMA_PULUH: 34.48,
  LEBIH_RENDAH: 35.94,
  LIMA_PULUH: 36.84,
  DIPERBAIKI: 38.05,
  DITOLAK: 38.99,
  BERARTI: 41.24,
  DELAPAN_PULUH: 44.11,
  DUA_PULUH: 45.0,
  SAMPAH: 47.37,
  PENANGANAN: 48.09,
  HARGA: 50.99,
  KERJA: 53.14,
  TADI: 55.31,
  LEGA: 55.86,
  TUMPUKAN: 56.7,
  TERNYATA: 57.89,
  SORTIR: 59.5,
  MENGHITUNG: 60.55,
  KELUAR: 63.64,
  JUMLAH: 64.51,
  MUTUNYA: 65.77,
  BAHAN: 67.8,
  MESIN: 68.24,
  PEREKAT: 68.99,
  PROSES: 69.9,
  BERMASALAH: 72.17,
  PENYEBAB: 72.83,
  DITELUSURI: 73.73,
  BUKAN: 74.36,
  MENUNJUK: 75.17,
  LEMBARAN: 76.87,
} as const;

/** Contiguous scenes from 0 to AUDIO_SECONDS, cut in pauses between sentences. */
export const SCENES = [
  {id: 'tumpuk', a: 0, b: 6.1},
  {id: 'nasib', a: 6.1, b: 10.95},
  {id: 'periksa', a: 10.95, b: 14.4},
  {id: 'permukaan', a: 14.4, b: 20.5},
  {id: 'ukuran', a: 20.5, b: 24.95},
  {id: 'jauh', a: 24.95, b: 29.0},
  {id: 'simulasi', a: 29.0, b: 41.0},
  {id: 'persen', a: 41.0, b: 51.9},
  {id: 'pekerja', a: 51.9, b: 60.0},
  {id: 'hitung', a: 60.0, b: 64.1},
  {id: 'faktor', a: 64.1, b: 70.85},
  {id: 'telusur', a: 70.85, b: AUDIO_SECONDS},
] as const;

export type SceneId = (typeof SCENES)[number]['id'];
export const scene = (id: SceneId) => SCENES.find((s) => s.id === id)!;

/** Sound onsets (seconds), placed in pauses between words. Gain multiplies the sfxVolume prop. */
export const SFX: SfxCue[] = [
  {t: 0.05, type: 'whoosh', gain: 0.5},
  {t: 6.15, type: 'pop', gain: 0.6},
  {t: 10.95, type: 'whoosh', gain: 0.5},
  {t: 14.42, type: 'whoosh', gain: 0.6},
  {t: 20.55, type: 'whoosh', gain: 0.5},
  {t: 24.98, type: 'whoosh', gain: 0.5},
  {t: 29.0, type: 'whoosh', gain: 0.6},
  {t: 32.2, type: 'tick', gain: 0.5},
  {t: 34.3, type: 'tick', gain: 0.5},
  {t: 36.7, type: 'tick', gain: 0.5},
  {t: 41.1, type: 'whoosh', gain: 0.5},
  {t: 43.75, type: 'pop', gain: 0.5},
  {t: 47.75, type: 'tick', gain: 0.5},
  {t: 51.9, type: 'whoosh', gain: 0.6},
  {t: 55.05, type: 'pop', gain: 0.5},
  {t: 57.7, type: 'pop', gain: 0.5},
  {t: 59.95, type: 'whoosh', gain: 0.5},
  {t: 64.05, type: 'whoosh', gain: 0.5},
  {t: 67.5, type: 'tick', gain: 0.5},
  {t: 70.85, type: 'whoosh', gain: 0.5},
  {t: 74.2, type: 'pop', gain: 0.6},
];
