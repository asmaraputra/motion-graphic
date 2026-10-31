# Motion graphics videos (Remotion)

Vertical 1080×1920 narrated videos built in Remotion with React + TypeScript. Agent rules live in `rules/` (start at `AGENTS.md`).

## GitHub dan sinkronisasi

Repo bersama: https://github.com/asmaraputra/motion-graphic. Ikuti [panduan sinkronisasi](docs/SINKRONISASI-GITHUB.md) untuk pull, commit, dan push dari kedua folder proyek. Brief aktif berada di `bahan/brief.md` atau file brief terkait di `bahan/`, bersama voiceover mentah. Folder ini tetap lokal dan perlu disalin manual, tidak ikut pull GitHub; arsip brief bersama ada di `briefs/`. Katalog mempertahankan lima gaya lama dan tujuh tambahan Animate, lihat `rules/visual-references.md`.

## Install and preview

Use Node.js **22.18+** (tests run TypeScript directly).

```sh
npm ci
npm run studio                                   # default entry: Kerja 12 Jam (remotion.config.ts → src/kerja12-entry.tsx)
npx remotion studio src/videos/<slug>/entry.tsx  # any video made with new-video.mjs
```

Select the composition, press Space to play/pause, and edit **Inspector → Default Props → Schema** to change its Zod-backed props live.

## Two frameworks

| | Kerangka A: typography / diagram | Kerangka B: cinematic stick figures |
|---|---|---|
| Kit | `src/kit/` | `src/kit2d/` (engine ported from aiTrends 2D Studio) |
| Template | `templates/video/` | `templates/video-2d/` |
| Example | `src/compositions/kerja12/` | `src/videos/contoh-2d/` |
| Rules | `rules/VIDEO-WORKFLOW.md` | `rules/KERANGKA-B.md` + `rules/kerangka-b/` |

Start a video from a brief and a voice-over (WAV, MP3 or any ffmpeg-readable format; converted automatically):

```sh
node scripts/new-video.mjs <slug> "bahan/<file-voiceover>" [--kerangka b]
node scripts/transcribe.mjs <slug>               # local whisper.cpp, see rules/VIDEO-WORKFLOW.md
node scripts/render.mjs <slug> stills 1.5 10 20  # key frames + out/videos/<slug>/contact.png
node scripts/render.mjs <slug> video             # out/videos/<slug>/<slug>.mp4, H.264 CRF 18, -14 LUFS / -1 dBTP
```

Kerangka B builds its soundtrack (music + SFX + ambience) with `.venv-kelindihan/Scripts/python.exe scripts/kit2d-audio/mix.py <slug>`. Kerangka A sound effects are regenerated with `scripts/make-sfx.py`. The Kerja 12 Jam example renders with `node scripts/render-kerja12.mjs stills <sec...> | video`.

### Izin Bos: independent Sol remake

`src/videos/ijin-bos-sol/` is the retained Kerangka B remake based on the working brief (historically `brief.md` at the project root; current input location: `bahan/`): twelve cinematic shots, original Canvas office/phone/paper assets, and new acting and transitions. It reuses the kit's character rig. The old `ijin-bos` source, production assets, output, and timeline test were removed after comparison; the remake keeps its own narration, music, soundtrack, and word timings. This production note records the original inputs; consult the current files in `bahan/` for available working briefs and raw audio. Production narration remains in `public/videos/ijin-bos-sol/`.

The narration and lo-fi instrumental are byte-identical copies of the approved old masters. The 99.265624-second narration includes the earlier voice replacement. Word timings reuse that master's existing local ASR result (approximately ±0.2 seconds, not forced alignment); only quoted dialogue drives mouth animation. Eleven sparse SFX are generated separately. The office, clothing, skyline, and house symbol are neutral illustrative choices, not new story facts.

```sh
npx remotion studio src/videos/ijin-bos-sol/entry.tsx --port=3117
.venv-kelindihan/Scripts/python.exe scripts/kit2d-audio/mix.py ijin-bos-sol --no-music
node scripts/render.mjs ijin-bos-sol stills 3.8 12 23 30 45.5 71.3 78 96
```

Studio plays the unnormalized mix. Final MP4 export is a separate, explicit step. `scripts/render.mjs` applies measured gain plus a 4x-oversampled limiter, re-measures the encoded MP4 (adjusting gain up to two more times), and prints the measured integrated loudness and true peak; check that line against -14 LUFS / -1 dBTP before publishing.

## Layout

```text
src/kerja12-entry.tsx    Default Studio entry (set in remotion.config.ts)
src/kit/, src/kit2d/     Kerangka A / B kits
src/compositions/kerja12 Kerangka A example
src/videos/<slug>/       One folder per video, with its own entry.tsx
public/                  Fonts, narration, SFX (reference with staticFile(), not public/...)
out/                     Renders and stills (ignored by Git)
scripts/                 new-video, transcribe, render, audio tools
tests/                   Timeline/story checks for every video (npm test)
```

## Export for editors

Videos with their own entry render through `scripts/render.mjs`. For a transparent overlay instead of a full scene, render the entry directly:

```sh
npx remotion render src/videos/<slug>/entry.tsx <id> out/<id>.mov --codec=prores --prores-profile=4444 --pixel-format=yuva444p10le --image-format=png
npx remotion render src/videos/<slug>/entry.tsx <id> out/<id> --sequence --image-format=png
```

H.264 does **not** preserve transparency; use ProRes 4444 or a PNG sequence for alpha. Remotion's PNG sequence takes an output directory with `--sequence`, not an FFmpeg-style `frame-%04d.png` pattern.

On this machine the bundled Chrome Headless Shell was blocked from Google Fonts (`ERR_NETWORK_ACCESS_DENIED`). If a render needs Google Fonts, add `--browser-executable="C:/Program Files/Google/Chrome/Application/chrome.exe"`. The kits load their fonts locally from `public/kit/fonts` and `public/kit2d/fonts`.

## Checks

```sh
npm test       # every video's timeline/story tests
npm run lint   # ESLint and TypeScript
npm run build  # bundle the default entry
```

References: [Remotion render CLI](https://www.remotion.dev/docs/cli/render), [transparent overlays](https://www.remotion.dev/docs/overlay), [Remotion licensing](https://www.remotion.dev/docs/license).
