import {cancelRender, continueRender, delayRender, staticFile} from 'remotion';
import {z} from 'zod';

// Poppins (OFL) is bundled in public/kit/fonts; render waits until every weight is loaded.
const WEIGHTS = {400: 'Regular', 600: 'SemiBold', 700: 'Bold', 900: 'Black'};
const fontHandle = delayRender('Loading Poppins');
Promise.all(
  Object.entries(WEIGHTS).map(([weight, name]) =>
    new FontFace('Poppins', `url(${staticFile(`kit/fonts/Poppins-${name}.ttf`)})`, {weight})
      .load()
      .then((face) => document.fonts.add(face)),
  ),
)
  .then(() => continueRender(fontHandle))
  .catch(cancelRender);

export const FONT = '"Poppins", "Segoe UI", sans-serif';

/** Vertical-video safe margins (px) for platform UI. */
export const SAFE = {left: 100, right: 180, top: 180, bottom: 320} as const;

/** Neutral base colors; each video defines its own accents. */
export const INK = {
  bg: '#171C24',
  text: '#F4F0E8',
  dim: 'rgba(244,240,232,0.66)',
};
export const SHADOW = '0 8px 28px rgba(0,0,0,0.5)';

export const kitSchema = z.object({
  watermark: z.string(),
  /** SFX level under narration; per-cue gain multiplies this. */
  sfxVolume: z.number().min(0).max(1),
  /** Timecode + safe-area guide, for review only. */
  showReview: z.boolean(),
});

export const kitDefaults: z.infer<typeof kitSchema> = {watermark: '@asmara.putra', sfxVolume: 0.25, showReview: false};
