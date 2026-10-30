import type {SfxCue} from '../../kit/components';

export const FPS = 30;
/** bumi-berputar-cepat.mp3: 5137920 samples @ 44100 Hz, 1 ch = 116.506122 s. */
export const AUDIO_SECONDS = 116.506122;
export const TOTAL_FRAMES = 3496;

/**
 * Scene boundaries sit in measured pauses (silencedetect -35 dB, 0.15 s) between phrases.
 * Word onsets come from out/videos/bumi-berputar-cepat/words.txt (whisper.cpp, about ±0.2 s).
 */
export const SCENES = [
  {id: 'hook', a: 0, b: 5.8},
  {id: 'comment', a: 5.8, b: 12.12},
  {id: 'formula', a: 12.12, b: 15.2},
  {id: 'globe', a: 15.2, b: 23.56},
  {id: 'day', a: 23.56, b: 27.5},
  {id: 'equator', a: 27.5, b: 35},
  {id: 'big', a: 35, b: 42.4},
  {id: 'wheels', a: 42.4, b: 50.95},
  {id: 'earth', a: 50.95, b: 57.4},
  {id: 'degree', a: 57.4, b: 64.55},
  {id: 'sky', a: 64.55, b: 73.1},
  {id: 'satellite', a: 73.1, b: 80.27},
  {id: 'orbit', a: 80.27, b: 89.55},
  {id: 'glance', a: 89.55, b: 95.72},
  {id: 'roof', a: 95.72, b: 107},
  {id: 'closing', a: 107, b: AUDIO_SECONDS},
] as const;

export type SceneId = (typeof SCENES)[number]['id'];
export const scene = (id: SceneId) => SCENES.find((s) => s.id === id)!;

/** Key word onsets used by the animation (seconds). */
export const CUES = {
  MOON_Q: 3.35, KOMENTAR: 6.62, QUOTE: 8.34, BENAR: 10.94,
  ANGKA: 12.55, GLOBE: 16.75, KITA: 18.08, BARAT: 22.69,
  PUTARAN: 24.12, JAM24: 26.7, KHATULISTIWA: 27.86, V1670: 31.22, NGEBUT: 34.13,
  BESAR: 36.2, LINTASAN: 40.74, RODA_KECIL: 43.42, RODA_BESAR: 44.24, BERPUTAR: 45.84,
  TITIK: 47.9, JAUH: 50.33, ANGKA_KMJ: 52.66, SEHARI: 56.63,
  MENIT: 58.26, SEPEREMPAT: 60.11, ARAH: 61.5, SEDIKIT: 63.55,
  BULAN_GESER: 65.54, MATAHARI: 68.45, BERJAM: 70.65,
  SATELIT: 75.99, MENGELILINGI: 77.82, GRAVITASI: 79.57, HARI27: 83.92,
  ARTINYA: 85, SEKALI: 88.98, BERGESER: 90.88, SEKILAS: 95.05,
  ATAP: 97.94, SETELAH: 98.48, PINDAH: 103.09, PENGARUH: 105.31,
  NAH: 107.18, KOMENTAR_CTA: 114.22, NEXT: 114.97,
} as const;

/**
 * Full Indonesian subtitles. Text follows the script (not the recording); each line starts
 * at its first word onset and holds until the next line starts.
 */
const SUB_ONSETS: [number, string][] = [
  [0.05, 'Bumi berputar lebih dari'],
  [1.47, 'seribu kilometer per jam.'],
  [3.18, 'Kok bulan nggak langsung lewat'],
  [4.48, 'dan hilang dari pandangan?'],
  [6.02, 'Ada yang komentar di video kemarin,'],
  [8.34, '“Tapi kan Bumi berputar cepat!”'],
  [10.94, 'Iya, benar.'],
  [12.26, 'Tapi angka kecepatannya'],
  [13.78, 'perlu kita pahami dulu.'],
  [15.42, 'Bayangkan Bumi seperti globe yang diputar.'],
  [18.08, 'Kita, rumah, dan tanah yang kita pijak'],
  [20.84, 'ikut bergerak bersamanya,'],
  [22.4, 'dari barat ke timur.'],
  [23.82, 'Satu putaran penuh membutuhkan'],
  [25.87, 'waktu hampir dua puluh empat jam.'],
  [27.75, 'Di khatulistiwa, permukaan Bumi bergerak'],
  [30.89, 'sekitar seribu enam ratus tujuh puluh kilometer per jam.'],
  [33.34, 'Kedengarannya ngebut banget, ya?'],
  [35.22, 'Tapi Bumi juga besar sekali.'],
  [37.38, 'Untuk kembali ke posisi semula,'],
  [39.14, 'permukaannya harus menempuh'],
  [40.74, 'lintasan yang sangat panjang.'],
  [42.56, 'Coba bayangkan roda kecil dan roda besar.'],
  [45.06, 'Kalau keduanya berputar sekali'],
  [46.67, 'dalam waktu yang sama,'],
  [47.9, 'titik di pinggir roda besar'],
  [49.24, 'harus menempuh jarak lebih jauh.'],
  [51.18, 'Begitu juga dengan Bumi.'],
  [52.66, 'Angka kilometer per jamnya besar,'],
  [54.83, 'sementara satu putarannya'],
  [56.31, 'tetap hampir sehari.'],
  [57.72, 'Dalam satu menit, Bumi baru berputar'],
  [59.67, 'sekitar seperempat derajat.'],
  [61.5, 'Arah kita menghadap langit pun'],
  [63.11, 'berubah sedikit demi sedikit.'],
  [64.78, 'Karena itu, bulan terlihat'],
  [66.38, 'bergeser secara bertahap.'],
  [68.14, 'Mirip Matahari yang masih bisa terlihat'],
  [70.27, 'selama berjam-jam'],
  [71.45, 'meskipun Bumi terus berputar.'],
  [73.34, 'Lalu, apakah bulan tetap kelihatan'],
  [75.38, 'karena dia satelit Bumi?'],
  [77.06, 'Bulan memang mengelilingi Bumi'],
  [78.75, 'karena tarikan gravitasi.'],
  [80.42, 'Tetapi satu kali mengelilinginya'],
  [82.68, 'membutuhkan sekitar dua puluh tujuh hari.'],
  [85, 'Artinya, bulan nggak ikut mengitari kita'],
  [87.39, 'setiap kali Bumi berputar sekali.'],
  [89.74, 'Jadi, bulan memang bergeser di langit.'],
  [92.22, 'Kita hanya mudah melewatkan gerakannya'],
  [94.35, 'kalau melihat sekilas.'],
  [95.86, 'Coba bandingkan posisinya'],
  [97.27, 'dengan ujung atap rumah'],
  [98.48, 'setelah beberapa waktu,'],
  [99.93, 'dari tempat yang sama.'],
  [101.1, 'Bulan yang tadi dekat ujung atap sudah pindah.'],
  [103.74, 'Bumi terus berputar,'],
  [105.07, 'dan pengaruhnya kelihatan.'],
  [107.18, 'Nahh.. begitulah kira-kira penjelasan'],
  [109.6, 'dari "Bumi berputar cepat",'],
  [111.42, 'jika masih ada yang ditanyakan,'],
  [112.94, 'jangan ragu tinggalkan komentar.'],
  [114.97, 'Next kita bahas apalagi?'],
];

export const SUBS = SUB_ONSETS.map(([a, text], i) => ({
  a,
  b: i + 1 < SUB_ONSETS.length ? SUB_ONSETS[i + 1][0] : AUDIO_SECONDS,
  text,
}));

/** Measured pauses (silencedetect -35 dB) that host the accents below. */
export const SFX_WINDOWS = [
  [2.89, 3.32], [5.72, 6.26], [12.06, 12.38], [15.14, 15.56], [23.51, 23.96],
  [27.44, 27.87], [33.12, 33.48], [42.34, 42.71], [44.76, 45.19], [50.92, 51.32],
  [57.37, 57.8], [61.28, 61.66], [64.51, 64.9], [73.07, 73.52], [76.81, 77.2],
  [80.24, 80.57], [84.72, 85.08], [89.51, 89.88], [95.69, 96.01], [100.88, 101.25],
  [106.97, 107.31], [114.68, 115.06],
] as const;

/** Scene entrances, the comment bubble, key readouts and the reveal; never under a key word. */
export const SFX: SfxCue[] = [
  {t: 2.95, type: 'tick', gain: 0.16},
  {t: 5.8, type: 'pop', gain: 0.18},
  {t: 12.12, type: 'whoosh', gain: 0.2},
  {t: 15.2, type: 'whoosh', gain: 0.2},
  {t: 23.56, type: 'tick', gain: 0.16},
  {t: 27.5, type: 'whoosh', gain: 0.2},
  {t: 33.15, type: 'pop', gain: 0.16},
  {t: 42.4, type: 'whoosh', gain: 0.2},
  {t: 44.8, type: 'tick', gain: 0.16},
  {t: 50.95, type: 'whoosh', gain: 0.2},
  {t: 57.4, type: 'whoosh', gain: 0.2},
  {t: 61.3, type: 'tick', gain: 0.16},
  {t: 64.55, type: 'whoosh', gain: 0.2},
  {t: 73.1, type: 'whoosh', gain: 0.2},
  {t: 76.85, type: 'tick', gain: 0.16},
  {t: 80.27, type: 'tick', gain: 0.16},
  {t: 84.75, type: 'pop', gain: 0.16},
  {t: 89.55, type: 'whoosh', gain: 0.2},
  {t: 95.72, type: 'whoosh', gain: 0.2},
  {t: 100.9, type: 'pop', gain: 0.18},
  {t: 107, type: 'whoosh', gain: 0.2},
  {t: 114.7, type: 'pop', gain: 0.18},
];

// Measured: narration -21.1 LUFS, music.wav -17.5 LUFS. Music sits 19 dB under narration.
export const MUSIC_VOLUME = 10 ** ((-21.1 - 19 + 17.5) / 20);
