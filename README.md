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

### Production videos stay local

`src/videos/<slug>/`, `public/videos/<slug>/`, and `tests/<slug>-timeline.test.mjs` are ignored by Git. Only the framework is shared: kits, templates, scripts, rules, the example in `src/compositions/kerja12/`, and the kit folders `contoh-2d`, `kit-papercut`, `maskot-worker`, `maskot-orang-hindu`. A new video made with `scripts/new-video.mjs` never pushes its scenes, narration, music, or timeline test. Keep production notes and measured loudness in `bahan/` next to the brief, which is local for the same reason.

For the same reason this README no longer lists individual productions: their folders exist only on the machine that made them.

## Layout

```text
src/kerja12-entry.tsx    Default Studio entry (set in remotion.config.ts)
src/kit/, src/kit2d/     Kerangka A / B kits
src/compositions/kerja12 Kerangka A example
src/videos/<slug>/       One folder per video, with its own entry.tsx
public/                  Fonts, narration, SFX (reference with staticFile(), not public/...)
out/                     Renders and stills (ignored by Git)
scripts/                 new-video, transcribe, render, audio tools
tests/                   Kit checks; per-video timeline tests stay local and are ignored
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
npm test       # local kit and per-video timeline/story tests
npm run lint   # ESLint and TypeScript
npm run build  # bundle the default entry
```

References: [Remotion render CLI](https://www.remotion.dev/docs/cli/render), [transparent overlays](https://www.remotion.dev/docs/overlay), [Remotion licensing](https://www.remotion.dev/docs/license).
