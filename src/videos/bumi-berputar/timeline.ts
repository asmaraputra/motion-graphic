import type {SfxCue} from '../../kit/components';

export const FPS = 30;
/** bumi-berputar.mp3: 3892608 samples @ 44100 Hz, 1 ch = 88.267755 s. */
export const AUDIO_SECONDS = 88.267755;
export const TOTAL_FRAMES = 2649;

/**
 * Word onsets (seconds) copied from out/videos/bumi-berputar/words.txt
 * (local whisper.cpp, about ±0.2 s; not forced alignment).
 */
export const CUES = {
  CONFIRM: 2.24, MOON_SHIFT: 6.43, WHY: 10.44,
  WINDOW: 11.4, TURN: 14.32, RIGHT: 16.16, VIEW: 16.65, LEFT: 18.92,
  FIXED: 20.3, YOU_TURN: 23.51, EARTH: 24.2, OBSERVER: 26.44,
  LOOK: 29.07, DAY: 31.68, HOURS: 34.16, NIGHT: 35.2,
  MATCH: 39, MOON: 42.18, HORIZON: 42.7, EAST: 44.75, WEST: 46.38,
  ORBIT: 46.75, ORBIT_MOVE: 48.29, TEST: 51.95, MARK: 56.21,
  ROOF: 58.28, HOUR: 61.08, SAME: 62.51, REVEAL: 63.85,
  CHANGED: 65.02, TRY: 68.92, RECAP: 71.65, ROTATION: 73.97,
  FOLLOW: 78.04, SLOW: 81.68, CTA: 84.45,
} as const;

export const SCENES = [
  {id: 'yard', a: 0, b: CUES.WINDOW},
  {id: 'window', a: CUES.WINDOW, b: CUES.EARTH},
  {id: 'rotation', a: CUES.EARTH, b: CUES.MATCH},
  {id: 'match', a: CUES.MATCH, b: CUES.HORIZON},
  {id: 'horizon', a: CUES.HORIZON, b: CUES.ORBIT},
  {id: 'orbit', a: CUES.ORBIT, b: CUES.TEST},
  {id: 'experiment', a: CUES.TEST, b: CUES.RECAP},
  {id: 'recap', a: CUES.RECAP, b: CUES.CTA},
  {id: 'closing', a: CUES.CTA, b: AUDIO_SECONDS},
] as const;

export const TITLES = [
  {a: 0, b: 3.3, lines: ['Bumi', 'berputar?'], kicker: 'TAPI KAN', size: 112},
  {a: 3.48, b: 10.15, lines: ['Bulan tampak', 'bergeser.'], kicker: 'BETUL!', size: 94},
  {a: CUES.WINDOW, b: 14.1, lines: ['Bayangkan', 'jendela.'], kicker: 'MULAI DARI SINI', size: 94},
  {a: CUES.TURN, b: 20.1, lines: ['Putar ke kanan.', 'Tampak ke kiri.'], kicker: 'ARAH PANDANG', size: 76},
  {a: CUES.FIXED, b: 24.05, lines: ['Jendela tetap.', 'Kamu berputar.'], kicker: 'BUKAN JENDELANYA', size: 78},
  {a: CUES.EARTH, b: 31.4, lines: ['Kita ikut', 'berputar.'], kicker: 'BUMI JUGA BEGITU', size: 98},
  {a: CUES.DAY, b: 38.8, lines: ['Sekitar', '24 jam'], kicker: 'SATU PUTARAN BUMI', size: 126},
  {a: CUES.MATCH, b: 42.55, lines: ['Jendela tadi.', 'Sekarang bulan.'], kicker: 'PRINSIP YANG SAMA', size: 77},
  {a: CUES.HORIZON, b: 46.6, lines: ['Timur', 'ke barat.'], kicker: 'GERAK TAMPAK', size: 110},
  {a: CUES.ORBIT, b: 51.75, lines: ['Bulan juga', 'mengorbit.'], kicker: 'ADA GERAK LAIN', size: 92},
  {a: CUES.TEST, b: 55.75, lines: ['Coba', 'buktikan.'], kicker: 'AMATI DARI HALAMAN', size: 110},
  {a: 55.98, b: 60.65, lines: ['Tandai', 'posisi bulan.'], kicker: 'ACUAN: UJUNG ATAP', size: 94},
  {a: CUES.HOUR, b: 63.7, lines: ['Satu jam', 'kemudian.'], kicker: 'TEMPAT BERDIRI SAMA', size: 90},
  {a: CUES.REVEAL, b: 68.65, lines: ['Posisinya', 'berubah!'], kicker: 'BANDINGKAN PENANDANYA', size: 100},
  {a: CUES.TRY, b: 71.45, lines: ['Coba', 'malam ini.'], kicker: 'KALAU LANGIT CERAH', size: 100},
  {a: CUES.RECAP, b: 77.8, lines: ['Bumi berputar.', 'Bulan bergeser.'], kicker: 'KOMENTARNYA BENAR', size: 79},
  {a: CUES.FOLLOW, b: 84.3, lines: ['Tampak ikut.', 'Tetap bergeser.'], kicker: 'DUA KESAN BISA MUNCUL', size: 80},
  {a: CUES.CTA, b: AUDIO_SECONDS, lines: ['Bulan ikut kita?'], kicker: 'DIBAHAS DI VIDEO LAIN', size: 82},
] as const;

// Measured -35 dBFS silence windows; short attacks live between spoken phrases.
export const SFX_WINDOWS = [
  [1.9, 2.1], [11.36, 11.48], [16.5, 16.7], [20.12, 20.3],
  [24, 24.22], [31.4, 31.55], [38.82, 39], [42.55, 42.7],
  [46.56, 46.75], [51.85, 52], [55.62, 55.8], [59.76, 59.95],
  [63.78, 63.95], [68.65, 68.8], [71.47, 71.65], [77.75, 77.92], [84.42, 84.55],
] as const;

/** Each accent is a quiet action or transition, not a constant beat under speech. */
export const SFX: SfxCue[] = SFX_WINDOWS.map(([t], i) => ({
  t, type: i === 1 ? 'whoosh' : i % 3 === 0 ? 'pop' : 'tick', gain: i === 1 ? 0.23 : 0.16,
}));

// Raw measurements: narration -21.04 LUFS, music -17.64 LUFS. Relative target -19 dB.
export const MUSIC_VOLUME = 0.0758577575029184;
export const AUDIO_SAMPLES = 3892608;
export const AUDIO_RATE = 44100;
