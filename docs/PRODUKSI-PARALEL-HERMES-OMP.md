# Kesiapan produksi dan kerja paralel Hermes + OMP

Pemeriksaan: 29 Oktober 2026. Dokumen operasional pendamping, bukan pengganti aturan di `rules/`.

## Sumber produksi

Baca ulang `rules/RULES.md`, `rules/remotion-pro-rules.md`, dan `rules/VIDEO-WORKFLOW.md` pada sesi baru. Untuk B baca juga `rules/KERANGKA-B.md` dan `rules/kerangka-b/style-bible.md`; rujuk engine-api, story-breakdown, dan sound-design saat membangun.

- A: tipografi/diagram SVG/DOM, `src/kit/`, `templates/video/`.
- B: stick figure sinematik Canvas 2D, `src/kit2d/`, `templates/video-2d/`. Jangan campur kit A/B. Port lokal tidak mendukung shot 3D.
- Lima gaya aktif: stick figure sinematik, infografik editorial flat, diorama papercut, UNIDO-PPDP, Bedah Teknis 2.5D.
- Sebelum membuat video, selesaikan pilihan gaya, izin detail ilustratif, dan kebijakan teks bubble/diegetik yang belum diputuskan. Lima gaya harus tetap ditawarkan; jika UI pilihan terbatas, gunakan pertanyaan teks yang memuat kelimanya, jangan menghilangkan opsi.
- Brief aktif dan voiceover mentah berada di `bahan/` (lokal, tidak ikut Git; salin manual pada setiap folder proyek). Gunakan brief dengan nama khusus slug saat bekerja paralel; jangan mengasumsikan input ada di root. Buat slug melalui `node scripts/new-video.mjs <slug> "bahan/<file-voiceover>" [--kerangka b]`, dengan nama file sebenarnya.
- Transkripsi lokal: `node scripts/transcribe.mjs <slug>`. Cocokkan hasil ASR dengan naskah sebelum mengisi cue/shot.
- A: isi timeline dan adegan, gunakan kit, tambahkan tes timeline. B: isi story, cast, set, shot, import shot pada scenes/index.js, lalu buat soundtrack lokal.
- Pertahankan narasi utuh, tanpa subtitle penuh. Durasi mengikuti audio, bukan tambahan 1,5 detik dari panduan plugin asli.
- Preview dengan entry per slug. Render still/final hanya sesuai izin pengguna; Studio-only tidak boleh memicu render otomatis.
- Verifikasi akhir: seluruh `npm test`, TypeScript, dan ESLint. Laporkan kegagalan video lain, jangan mengubahnya tanpa izin.

## Kesiapan yang benar-benar diperiksa

- Node v26.12.1, npm 12.2.1; memenuhi engines Node >=22.18.0.
- Dependensi npm tersedia; paket Remotion yang tercantum menggunakan versi 4.0.539.
- FFmpeg dan ffprobe 9.0.2 dapat dijalankan.
- whisper-cli.exe dapat dijalankan; model tools/whisper/ggml-small.bin tersedia. Belum menjalankan transkripsi baru.
- Python `.venv-kelindihan/Scripts/python.exe` dapat mengimpor numpy 2.5.4 dan scipy 1.18.1. Belum menghasilkan soundtrack baru.
- Font lokal dan cache chrome-headless-shell tersedia.
- `npm test`: 20 lulus, 0 gagal.
- `npm run lint`: berhasil, termasuk TypeScript.
- `npm run build`: berhasil, menghasilkan build dari entry default kerja12.
- `npx remotion compositions src/videos/contoh-2d/entry.tsx --bundle-cache=false`: berhasil memuat composition melalui headless browser, 30 fps, 1080x1920, 1421 frame.
- Tidak ada instalasi tambahan atau perubahan source video/dependensi. Tidak melakukan ekspor MP4, review visual, atau uji dua agen produksi bersamaan.
- Folder proyek saat pemeriksaan bukan repository Git; git status gagal dan `.git` tidak tersedia. Jangan menjalankan init/commit secara otomatis.

## Kesimpulan paralel

Bisa bekerja bersamaan pada folder ini dengan batas kepemilikan yang tegas. Judul berbeda saja tidak cukup; gunakan slug berbeda dan jangan menyentuh file bersama. Ini koordinasi berbasis kesepakatan, bukan sandbox atau penguncian otomatis.

### Kepemilikan per agen

Tetapkan sebelum mulai, misalnya Hermes memiliki `video-hermes` dan OMP memiliki `video-omp`.

Masing-masing hanya boleh menulis:

- `src/videos/<slug-miliknya>/`
- `public/videos/<slug-miliknya>/`
- `out/videos/<slug-miliknya>/`
- `tests/<slug-miliknya>-*.test.mjs`
- Brief/catatan dengan nama khusus slug miliknya.

Jangan memakai slug contoh tersebut bila sudah ada. Jika slug pekerjaan yang dituju sudah ada, periksa progres dan lanjutkan, jangan menimpa atau membuat ulang.

### Area bersama: hanya satu penanggung jawab, saat agen lain berhenti

- `package.json`, lockfile, `node_modules/`, instalasi atau upgrade dependensi.
- `remotion.config.ts`, tsconfig, ESLint config, entry/root composition bersama.
- `src/kit/`, `src/kit2d/`, `templates/`, `scripts/`, `rules/`, AGENTS.md.
- Font/SFX bersama di `public/kit/`, tools dan virtual environment.
- `build/` default, pembersihan output global, proses browser/node milik agen lain.

Jangan menjalankan `npm install`, `npm ci`, upgrade Remotion, menghapus cache/node_modules, atau memperbaiki kit bersama saat produksi paralel berlangsung. Jangan menghentikan seluruh proses node/browser. Jangan melakukan rollback proyek bersama karena dapat membatalkan hasil agen lain.

### Preview terpisah

Gunakan entry per slug dan port berbeda, tanpa mengubah default entry di remotion.config.ts:

- Hermes: `npx remotion studio src/videos/<slug-hermes>/entry.tsx --port=3101 --force-new --no-open`
- OMP: `npx remotion studio src/videos/<slug-omp>/entry.tsx --port=3102 --force-new --no-open`

Flag tersebut diverifikasi tersedia melalui CLI lokal. Port 3101/3102 kosong saat pemeriksaan, tetapi wajib diperiksa lagi saat menjalankan. Buka URL aktual yang dicetak Studio. `--force-new` memastikan meminta instance baru, bukan mengandalkan pemakaian ulang Studio lain.

`npm run studio` tanpa entry akan membuka kerja12 sesuai config proyek, bukan otomatis video yang sedang dikerjakan.

### Build, tes, dan beban mesin

- Jangan menjalankan dua `npm run build` bersamaan karena keduanya menulis `build/` yang sama. Antrekan, atau gunakan output bundle terpisah setelah memeriksa sintaks CLI.
- `npm test` dan lint seluruh proyek dapat membaca pekerjaan agen lain yang belum selesai. Ini bisa menimbulkan kegagalan sementara. Ulangi setelah kedua agen mencapai checkpoint; jangan langsung memperbaiki source milik agen lain.
- Transkripsi menulis output per slug dan membaca model bersama, tetapi setiap proses meminta 8 thread. Render juga memakai CPU/RAM intensif. Awali dengan satu pekerjaan berat per waktu, sambil agen lain menulis kode atau preview. Ini mengurangi perebutan sumber daya, bukan syarat pemisahan file.
- `scripts/render.mjs` menulis final dan file antara per slug. `new-video.mjs` memakai nama sementara yang mencakup slug. Keduanya mendukung pemisahan output antar-slug, tetapi tidak menyediakan lock untuk dua proses pada slug yang sama.
- `scripts/kit2d-audio/mix.py` juga menulis ulang `story.json` milik slug. Jangan mengedit story slug yang sama saat mixer sedang bekerja.

## Isolasi yang lebih kuat

Untuk produksi yang memerlukan perubahan dependensi/kit/config, gunakan dua salinan proyek terpisah, atau Git worktree setelah Git disiapkan dengan persetujuan pengguna. Worktree mengisolasi file yang dilacak, tetapi aset/tools yang tidak dilacak dan dependensi harus disediakan tersendiri. Jangan menganggap file lokal yang diabaikan Git otomatis ikut checkout.

Rujukan Hermes: https://hermes-agent.nousresearch.com/docs/user-guide/git-worktrees

## Instruksi singkat untuk ditempel pada kedua agen

> Kamu bekerja paralel dengan agen lain di folder my-video. Kamu hanya memiliki slug <SLUG>. Ubah hanya src/videos/<SLUG>, public/videos/<SLUG>, out/videos/<SLUG>, tes dan brief khusus slug itu. Baca aturan proyek. Jangan ubah kit, scripts, config, dependensi, lockfile, aturan, video lain, atau bersihkan folder global. Gunakan entry khusus slug dan port <PORT>. Jika perlu perubahan bersama, berhenti dan minta koordinasi. Antrekan transkripsi/render berat. Jangan render tanpa izin pengguna.
