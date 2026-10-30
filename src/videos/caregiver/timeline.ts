import type {SfxCue} from '../../kit/components';

export const FPS = 30;
/** caregiver.wav + 0.5 s silence spliced at 71.40 s (user request): 2167200 samples @ 24000 Hz, 1 ch = 90.3 s. */
export const AUDIO_SECONDS = 90.3;
export const TOTAL_FRAMES = 2709;

/**
 * Word onsets (seconds) from out/videos/caregiver/words.txt (local whisper.cpp, about ±0.2 s),
 * corrected against the silence map of narration.wav. ASR heard "disuruhnya ambi", "Lah", "air telah",
 * "menamping", "macem-macem"; screen text follows the script.
 */
export const CUES = {
  GAJI: 0.3,
  MENJAGA: 2.2,
  SIAP: 4.25,
  NYAMBI: 6.3,
  MENGHITUNG: 9.15,
  LHA: 12.04,
  CAREGIVER: 14.96,
  JAM_KERJA: 18.7,
  DI_SELA: 23.08,
  PADAHAL: 27.32,
  KALAU: 30.82,
  LAGI: 34.62,
  TERUS: 38.51,
  KADANG: 42.71,
  SEKALIAN: 44.89,
  TERDENGARNYA: 46.68,
  TAPI: 49.11,
  ISTIRAHAT: 54.49,
  MENJAGA_2: 56.01,
  HARUS: 58.98,
  SEMENTARA: 61.26,
  GAJINYA: 65.13,
  TETAPI: 68.27,
  INI: 72.1,
  DARI: 75.83,
  KALIAN: 82.66,
  LAMA_LAMA: 86.73,
  SEMENTARA_2: 88.77,
} as const;

/** Contiguous scenes from 0 to AUDIO_SECONDS. `world` = the house with a camera; others are full-frame inserts. */
export const SCENES = [
  {id: 'gaji', a: 0, b: 9.15, kind: 'world'},
  {id: 'jam', a: 9.15, b: 14.9, kind: 'insert'},
  {id: 'siaga', a: 14.9, b: 22.6, kind: 'world'},
  {id: 'bos', a: 22.6, b: 30.4, kind: 'world'},
  {id: 'senggang', a: 30.4, b: 38.3, kind: 'world'},
  {id: 'kapan', a: 38.3, b: 42.3, kind: 'insert'},
  {id: 'sekalian', a: 42.3, b: 49.0, kind: 'world'},
  {id: 'tumpuk', a: 49.0, b: 55.6, kind: 'world'},
  {id: 'giliran', a: 55.6, b: 64.6, kind: 'world'},
  {id: 'ringkas', a: 64.6, b: 71.7, kind: 'insert'},
  {id: 'video', a: 71.7, b: 75.7, kind: 'insert'},
  {id: 'sendiri', a: 75.7, b: 82.4, kind: 'world'},
  {id: 'cta', a: 82.4, b: AUDIO_SECONDS, kind: 'insert'},
] as const;

export type SceneId = (typeof SCENES)[number]['id'];
export const scene = (id: SceneId) => SCENES.find((s) => s.id === id)!;

/** Keyword titles (screen space, top of the safe area). Windows must not overlap. */
export const TITLES = [
  {a: 0.3, b: 2.1, lines: ['GAJI', '2 JUTA']},
  {a: 2.2, b: 4.2, lines: ['MENJAGA', 'PASIEN']},
  {a: 4.25, b: 6.2, lines: ['SIAP', 'SETIAP SAAT']},
  {a: 6.3, b: 8.9, lines: ['NYAMBI', 'URUSAN RUMAH']},
  {a: 9.25, b: 11.9, lines: ['SISA WAKTU?']},
  {a: 12.05, b: 14.8, lines: ['JAM SELESAI', 'NGGAK JELAS']},
  {a: 15.0, b: 18.1, lines: ['SELALU SIAP']},
  {a: 18.7, b: 22.4, lines: ['JAM KERJA', 'BERANTAKAN']},
  {a: 23.1, b: 26.9, lines: ['PEKERJAAN', 'RUMAH']},
  {a: 27.35, b: 30.3, lines: ['SUDAH ADA', 'ART LAIN']},
  {a: 30.85, b: 33.9, lines: ['WAKTU', 'SENGGANG?']},
  {a: 34.6, b: 38.2, lines: ['PEKERJAAN', 'MENUNGGU']},
  {a: 38.5, b: 42.2, lines: ['KAPAN', 'BERHENTI?']},
  {a: 46.7, b: 48.9, lines: ['CUMA', 'SEBENTAR?']},
  {a: 49.15, b: 52.1, lines: ['TAMBAHAN', 'TUGAS']},
  {a: 52.2, b: 55.5, lines: ['WAKTU', 'ISTIRAHAT']},
  {a: 56.05, b: 58.7, lines: ['TANGGUNG', 'JAWAB']},
  {a: 61.3, b: 64.5, lines: ['KEBUTUHAN DIRI', 'MENUNGGU']},
  {a: 65.15, b: 68.1, lines: ['2 JUTA', 'TUGAS BERTAMBAH']},
  {a: 68.3, b: 71.6, lines: ['SELESAINYA?', 'MAKIN NGGAK JELAS']},
  {a: 72.1, b: 75.6, lines: ['PENGALAMAN', 'SEORANG CAREGIVER']},
  {a: 77.2, b: 82.2, lines: ['WAKTU', 'SENDIRI']},
  {a: 82.7, b: 85.9, lines: ['KALIAN', 'PERNAH JUGA?']},
  {a: 86.1, b: 88.45, lines: ['DISURUH', 'MACAM-MACAM']},
  {a: 88.55, b: AUDIO_SECONDS, lines: ['GAJINYA', 'TETAP SEGITU?']},
] as const;

/** Sound onsets (seconds), placed in pauses next to keywords. Gain multiplies the sfxVolume prop. */
export const SFX: SfxCue[] = [
  {t: 0.2, type: 'pop', gain: 0.5},
  {t: 6.35, type: 'whoosh', gain: 0.6},
  {t: 9.1, type: 'whoosh', gain: 0.6},
  {t: 12.05, type: 'tick', gain: 0.6},
  {t: 14.9, type: 'whoosh', gain: 0.5},
  {t: 18.7, type: 'tick', gain: 0.5},
  {t: 23.05, type: 'pop', gain: 0.5},
  {t: 27.35, type: 'whoosh', gain: 0.5},
  {t: 30.8, type: 'pop', gain: 0.5},
  {t: 34.6, type: 'pop', gain: 0.5},
  {t: 38.3, type: 'whoosh', gain: 0.5},
  {t: 42.3, type: 'whoosh', gain: 0.5},
  {t: 44.6, type: 'pop', gain: 0.6},
  {t: 46.65, type: 'tick', gain: 0.5},
  {t: 49.05, type: 'pop', gain: 0.5},
  {t: 55.6, type: 'whoosh', gain: 0.5},
  {t: 58.95, type: 'pop', gain: 0.5},
  {t: 61.25, type: 'tick', gain: 0.5},
  {t: 64.6, type: 'whoosh', gain: 0.5},
  {t: 67.7, type: 'pop', gain: 0.5},
  {t: 71.7, type: 'whoosh', gain: 0.5},
  {t: 75.75, type: 'whoosh', gain: 0.5},
  {t: 82.3, type: 'whoosh', gain: 0.5},
  {t: 86.5, type: 'pop', gain: 0.5},
  {t: 88.55, type: 'pop', gain: 0.6},
];
