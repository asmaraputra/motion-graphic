import {AbsoluteFill, staticFile} from 'remotion';
import {Audio} from '@remotion/media';
import {fitText} from '@remotion/layout-utils';
import {z} from 'zod';
import {FONT, kitSchema} from '../../kit/brand';
import {ReviewOverlay, Watermark} from '../../kit/components';
import {EASE, k, useT} from '../../kit/motion';
import {C} from './art';
import {AUDIO_SECONDS, CUES, TITLES} from './timeline';
import {Closing, Experiment, Horizon, Match, Orbit, Recap, Rotation, WindowDemo, Yard} from './scenes';

// SFX and music are mixed locally from timeline.ts before preview, so there is no inactive SFX slider.
export const videoSchema = kitSchema.omit({sfxVolume: true});

const Headlines: React.FC<{t: number}> = ({t}) => <>
  {TITLES.map((q, index) => {
    if (t < q.a || t >= q.b) return null;
    const out = k(t, q.b - 0.3, q.b, 0, 1, EASE.in);
    const entry = index === 0 ? 1 : k(t, q.a, q.a + 0.35, 0, 1);
    return <div key={q.a} data-keyword="true" style={{position: 'absolute', top: 232, left: 110, width: 780, opacity: Math.min(entry, 1 - out), translate: `0px ${-24 * out}px`, color: C.cream}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 26}}>
        <div style={{width: 34, height: 5, background: C.amber}} />
        <div style={{fontSize: 25, fontWeight: 600, color: C.amber, letterSpacing: '0.1em'}}>{q.kicker}</div>
      </div>
      {q.lines.map((line, i) => {
        // The day number is revealed when "24" is spoken, not on the preceding phrase.
        const start = q.a === CUES.DAY && i === 1 ? CUES.HOURS : q.a + i * 0.12;
        const p = index === 0 ? 1 : k(t, start, start + 0.45, 0, 1);
        const maxSize = fitText({text: line, withinWidth: 770, fontFamily: 'Poppins', fontWeight: 700}).fontSize;
        return <div key={line} data-text-line="true" style={{fontSize: Math.min(q.size, maxSize), fontWeight: 700, lineHeight: 1.11, letterSpacing: '-0.035em', paddingBottom: 8, opacity: t < start && index !== 0 ? 0 : p, translate: `0px ${(1 - p) * 45}px`, color: i === q.lines.length - 1 ? C.amber : C.cream}}>{line}</div>;
      })}
    </div>;
  })}
</>;

export const Video: React.FC<z.infer<typeof videoSchema>> = ({watermark, showReview}) => {
  const t = useT();
  return <AbsoluteFill style={{background: C.bg, overflow: 'hidden', fontFamily: FONT}}>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute'}}>
      <rect width={1080} height={1920} fill={C.bg} />
      <path d="M0 1670 Q520 1590 1080 1705 V1920 H0Z" fill={C.panel} opacity={0.22} />
      <Yard t={t} />
      <WindowDemo t={t} />
      <Rotation t={t} />
      <Match t={t} />
      <Horizon t={t} />
      <Orbit t={t} />
      <Experiment t={t} />
      <Recap t={t} />
      <Closing t={t} />
    </svg>
    <Headlines t={t} />
    <div style={{position: 'absolute', left: 100, top: 1504, width: 280, height: 62, background: C.bg, borderRadius: 12, opacity: k(t, 0, 0.6, 0, 0.9)}} />
    <Watermark text={watermark} color={C.cream} />
    <Audio src={staticFile('videos/bumi-berputar/mix.wav')} />
    <AbsoluteFill style={{background: C.bg, opacity: k(t, AUDIO_SECONDS - 0.2, AUDIO_SECONDS, 0, 1), pointerEvents: 'none'}} />
    {showReview ? <ReviewOverlay /> : null}
  </AbsoluteFill>;
};

