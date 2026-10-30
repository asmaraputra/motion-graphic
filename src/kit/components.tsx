import {AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {FONT, INK, SAFE, SHADOW} from './brand';
import {EASE, k, life, useT} from './motion';

export type TitleLine = {text: string; size: number; color?: string; /** seconds after `a`; default staggers 0.12 s per line */ delay?: number};

/** Stacked keyword lines centered in the safe width. Visible from a to b. */
export const Title: React.FC<{a: number; b: number; lines: TitleLine[]; top: number; fout?: number; shadow?: string; font?: string}> = ({a, b, lines, top, fout = 0.35, shadow = SHADOW, font = FONT}) => {
  const t = useT();
  if (t < a - 0.05 || t > b + 0.05) return null;
  const out = k(t, b - fout, b, 0, 1, EASE.in);
  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE.left,
        width: 1080 - SAFE.left - SAFE.right,
        top,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        opacity: 1 - out,
        translate: `0px ${-30 * out}px`,
      }}
    >
      {lines.map((l, i) => {
        const s = a + (l.delay ?? i * 0.12);
        const p = k(t, s, s + 0.55, 0, 1, EASE.pop);
        return (
          <div
            key={l.text}
            style={{
              fontFamily: font,
              fontWeight: 900,
              fontSize: l.size,
              lineHeight: 1.08,
              color: l.color ?? INK.text,
              textAlign: 'center',
              textWrap: 'balance',
              overflowWrap: 'anywhere',
              letterSpacing: l.size > 80 ? '-0.02em' : '0.02em',
              textShadow: shadow,
              opacity: k(t, s, s + 0.25, 0, 1),
              translate: `0px ${(1 - p) * 44}px`,
              scale: `${0.9 + 0.1 * p}`,
            }}
          >
            {l.text}
          </div>
        );
      })}
    </div>
  );
};

/** Small outlined label, e.g. "SIMULASI". */
export const Pill: React.FC<{a: number; b: number; text: string; top: number; left?: number; color?: string}> = ({
  a,
  b,
  text,
  top,
  left = SAFE.left,
  color = INK.dim,
}) => {
  const t = useT();
  const o = life(t, a, b);
  if (o <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        opacity: o,
        translate: `${(1 - o) * -20}px 0px`,
        fontFamily: FONT,
        fontWeight: 600,
        fontSize: 26,
        letterSpacing: '0.12em',
        color,
        padding: '8px 18px',
        border: `2px solid ${color}`,
        borderRadius: 999,
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
  );
};

export const Watermark: React.FC<{text: string; color?: string}> = ({text, color = INK.text}) => {
  const t = useT();
  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE.left,
        bottom: SAFE.bottom + 10,
        fontFamily: FONT,
        fontWeight: 600,
        fontSize: 26,
        letterSpacing: '0.04em',
        color,
        opacity: 0.5 * k(t, 0, 0.6, 0, 1),
      }}
    >
      {text}
    </div>
  );
};

/** Review-only: timecode and the safe-area outline. */
export const ReviewOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          left: SAFE.left,
          top: SAFE.top,
          width: width - SAFE.left - SAFE.right,
          height: height - SAFE.top - SAFE.bottom,
          outline: '2px dashed rgba(255,224,138,0.6)',
        }}
      />
      <div style={{position: 'absolute', right: 24, top: 24, fontFamily: 'Consolas, monospace', fontSize: 28, color: '#FFE08A', background: 'rgba(0,0,0,0.6)', padding: '6px 12px'}}>
        {(frame / fps).toFixed(2)}s · f{frame}
      </div>
    </AbsoluteFill>
  );
};

export type SfxCue = {t: number; type: 'whoosh' | 'tick' | 'pop'; gain: number};

/** Plays public/kit/sfx/<type>.wav at each cue onset (seconds). */
export const Sfx: React.FC<{cues: SfxCue[]; volume: number}> = ({cues, volume}) => {
  const {fps} = useVideoConfig();
  return (
    <>
      {cues.map((s, i) => (
        <Sequence key={i} name={`sfx ${s.type}`} from={Math.round(s.t * fps)} durationInFrames={Math.round(0.6 * fps)} layout="none">
          <Audio src={staticFile(`kit/sfx/${s.type}.wav`)} volume={volume * s.gain} />
        </Sequence>
      ))}
    </>
  );
};
