# Kerangka B: stick figure sinematik 2D

Kerangka kedua di proyek ini, di-port dari plugin aiTrends 2D Studio. Gayanya: stick figure hitam dengan rim light, set 2.5D yang gelap, close-up wajah besar, freeze-frame, kartu data, dan diagram blueprint. Semua gambar dibuat oleh kode Canvas 2D di dalam Remotion.

Kerangka A (`src/kit/`, `templates/video/`) dan Kerangka B (`src/kit2d/`, `templates/video-2d/`) wajib terpisah. Video B tidak boleh import `src/kit/`, dan video A tidak boleh import `src/kit2d/`.

## Kapan memakai Kerangka B

- Brief meminta stick figure, gaya aiTrends, cerita "What if", tampilan sinematik gelap, atau karakter yang memerankan narasi tanpa referensi gaya lain: pakai B. Jika pengguna secara eksplisit memilih gaya Animate atau gaya A lain, keberadaan karakter tidak otomatis berarti B; ikuti pilihan gaya dan aturan adaptasinya.
- Brief meminta gaya motion graphic tipografi/diagram seperti video yang sudah ada: pakai A.
- Brief tidak menyebut gaya: ikuti konfirmasi awal di `rules/VIDEO-WORKFLOW.md`, tampilkan seluruh pilihan aktif dari `rules/visual-references.md` (termasuk stick figure sinematik/B dan tambahan Animate; pengelompokan di `rules/animate-styles.md` bila opsi tool terbatas), lalu tunggu pilihan. Jangan membatasi menu ke 2-3 opsi atau memakai preset warna B sebagai pengganti pilihan gaya.
- Kerangka yang sudah dipakai sebuah slug tidak berubah. Slug dengan `story.json` adalah video B.

## Aturan yang berlaku

Gaya visual mengikuti `rules/kerangka-b/style-bible.md` (wajib dibaca lengkap sebelum membuat shot). Jika bertentangan dengan target kualitas animasi di `rules/VIDEO-WORKFLOW.md`, style bible yang menang:

- Kamera bergerak di setiap shot (drift pelan, push-in), bukan maksimal 1 per 10 s.
- Tiga font: Fredoka (judul), Nunito (label/angka), Playfair Display Italic (pertanyaan penutup).
- Letterbox (`bars`), transisi `flash`/`dip`/`whip`/`zoom`, grade, vignette, dan grain sesuai gaya.
- Overshoot, stagger, dan durasi masuk/keluar mengikuti contoh dan API engine.

Tetap berlaku dari Kerangka A:

- `rules/RULES.md` seluruhnya, termasuk bagian "Mencegah macet".
- Narasi utuh; durasi video = durasi `narration.wav` (bukan +1,5 s seperti plugin).
- Tanpa subtitle penuh: `captions` tetap `false`. Teks di layar hanya kata kunci atau angka.
- Ikuti keputusan detail spesifik pada konfirmasi awal di `rules/VIDEO-WORKFLOW.md`: default jangan mengarang; detail ilustratif rekaan hanya jika diizinkan pengguna, wajar, netral, dan dilaporkan. Statistik, sumber, kutipan, dan fakta teknis tidak boleh dikarang.
- Watermark `@asmara.putra`, loudness akhir -14 LUFS / -1 dBTP lewat `scripts/render.mjs`.
- Tawarkan gaya dulu sebelum polishing (aturan 18). Render final hanya jika diminta.

## File

| Path | Isi | Boleh diubah? |
|---|---|---|
| `src/kit2d/engine/` | `core.js`, `styles.js`, `rig2d.js`, `fx2d.js`, `ui2d.js` dari plugin. Satu perbaikan: arah alis `worried`/`angry` di `rig2d.js` (aslinya tertukar) | Jangan. Gaya kustom boleh ditambah di `STYLES` (`styles.js`) |
| `src/kit2d/stage.js` | Port `player.js`: pemilih shot, transisi, grade, grain, bars, fade | Hanya untuk perbaikan kerangka |
| `src/kit2d/Stage2D.tsx` | `<Stage2D>` (canvas per frame), font, `Watermark`, `kit2dSchema` | Hanya untuk perbaikan kerangka |
| `templates/video-2d/` | Template video B | Hanya untuk perbaikan kerangka |
| `scripts/kit2d-audio/` | `sfx.py`, `music.py`, `dsp.py` dari plugin + `mix.py` hasil port | `mix.py` hanya untuk perbaikan kerangka |
| `rules/kerangka-b/` | Referensi plugin: style bible, engine API, story breakdown, sound design | Jangan |
| `src/videos/contoh-2d/` | Contoh "reaction-time" dari plugin (2D saja, 9:16, tanpa voice-over) | Jangan. Jadikan referensi pola |

Referensi plugin menyebut path dan perintah aslinya. Padanannya di proyek ini:

| Plugin | Kerangka B |
|---|---|
| `projects/<slug>/story/shots.json` + `config.json` | `src/videos/<slug>/story.json` (satu file) |
| `timeline/words.json` | `src/videos/<slug>/words.json` |
| `scenes/` dimuat otomatis | `src/videos/<slug>/scenes/`, setiap file shot didaftarkan di `scenes/index.js` |
| `import ... from '/engine/core.js'` | `import ... from '../../../../kit2d/engine/core.js'` (dari `scenes/shots/` atau `scenes/sets/`) |
| `node render.mjs --sheet` / `--stills` | `node scripts/render.mjs <slug> stills <detik...>` |
| `node render.mjs --styles ...` | Ganti `style` di `story.json`, render stills, ulangi per gaya |
| `python audio/mix.py` | `scripts/kit2d-audio/mix.py <slug>` (lihat langkah 7) |
| 24 fps | 30 fps (engine berbasis detik, timing tidak berubah) |

## Langkah

1. Baca `rules/RULES.md`, `rules/remotion-pro-rules.md`, `rules/VIDEO-WORKFLOW.md`, file ini, dan `rules/kerangka-b/style-bible.md`.
2. Baca brief aktif di `bahan/brief.md` atau file brief terkait di `bahan/`, lalu buat folder: `node scripts/new-video.mjs <slug> "bahan/<file-voiceover>" --kerangka b` (ganti dengan nama file sebenarnya; WAV, MP3, atau format lain dikonversi otomatis). Bahan mentah lokal tidak ikut Git; jangan mengasumsikan brief atau voiceover ada di root. Ikuti penemuan input dan konfirmasi awal di `rules/VIDEO-WORKFLOW.md`. Hasilnya `entry.tsx`, `Video.tsx`, `story.json`, `words.json`, `scenes/{index.js,cast.js,sets/,shots/}`, dan `public/videos/<slug>/narration.wav`.
3. Transkripsi: `node scripts/transcribe.mjs <slug>`. Selain `words.txt`, skrip ini menulis `src/videos/<slug>/words.json` untuk `wordTime()` dan `talkAmount()`. Bandingkan `words.txt` dengan naskah: ASR sering salah dengar ("Alice" untuk "Alis", "Kura-kura" untuk "Pura-pura"). `wordTime()` mencocokkan awalan kata yang ditranskripsi dan mengembalikan `null` tanpa peringatan jika tidak ketemu; untuk kata yang salah dengar, pakai detiknya langsung dari `words.txt`. Ejaan teks di layar tetap mengikuti naskah.
4. Story breakdown sesuai `rules/kerangka-b/story-breakdown.md`. Isi `story.json` → `shots` (skema di `rules/kerangka-b/engine-api.md`, bagian story/shots.json). Shot bersambung tanpa celah, mulai dari 0, berakhir tepat di `duration`. Isi `scenes/cast.js`. Kirim ringkasan 5-10 baris ke pengguna.
5. Pilih gaya: `dusk`, `midnight`, `golden`, `neon`, atau `storybook` (deskripsi di `styles.js`). Bangun 1-2 set dan 3 shot representatif, lalu render stills untuk 2-3 gaya dan tunggu pilihan pengguna. Simpan di `story.json` → `style`.
6. Bangun shot per batch 8-12: `scenes/sets/<lokasi>.js`, `scenes/shots/NN_<nama>.js` dengan `registerShot('<id>', { draw(g, t, info) {...} })`, lalu tambahkan import-nya di `scenes/index.js`. Pelajari pola dari `src/videos/contoh-2d/scenes/`. Wajib: rim light, warna dari `mood()`/`S()`, `V()` untuk nilai yang bergantung rasio, tanpa `Math.random`/`Date.now`. Shot 3D (`kind: '3d'`) tidak didukung dan tampil sebagai placeholder.
   Jangan memakai `E.W`, `E.H`, `E.vertical`, atau `V()` di top-level modul (`const SAFE = { r: E.W - 180 }`). Saat modul di-import, `E` masih default 1920×1080; ukuran 9:16 baru diset sesudahnya. Bungkus dalam fungsi (`const SAFE = () => ({ r: E.W - 180 })`) supaya dibaca per frame.
7. Suara: isi `music`, `shots[].sfx`, dan `shots[].amb` sesuai `rules/kerangka-b/sound-design.md`. Jalankan `.venv-kelindihan/Scripts/python.exe scripts/kit2d-audio/mix.py <slug>`. Skrip ini menulis `public/videos/<slug>/soundtrack.wav` (musik + SFX + ambience, di-duck di bawah narasi, tanpa suara narasi) dan menyetel `"soundtrack": true`. `Video.tsx` memutar narasi dan soundtrack bersamaan. Atur level dengan `musicMix.gainDb` (default -19, relatif terhadap narasi) dan `sfxMix.gainDb`.
8. Preview: `npx remotion studio src/videos/<slug>/entry.tsx`. Prop `debug` menampilkan id shot + waktu.
9. Cek frame kunci: `node scripts/render.mjs <slug> stills ...`, lalu periksa `contact.png` dengan checklist QC di bawah.
10. Render final hanya setelah pengguna mengecek preview dan secara eksplisit menyetujui ekspor, sesuai gerbang review di `rules/VIDEO-WORKFLOW.md`: `node scripts/render.mjs <slug> video`. Selalu berikan dulu perintah Studio dengan slug yang benar; memilih gaya bukan izin ekspor. Video B otomatis memakai frame PNG supaya gradien gelap dan grain tidak banding.
11. Sebelum melapor selesai: `npm test` (termasuk `tests/kerangka-b-story.test.mjs`, yang otomatis mengecek setiap video B), `npx tsc --noEmit`, dan `npx eslint src/videos/<slug>`.

## QC stills

- Tidak ada frame `MISSING SHOT`, `ERROR`, atau `3D TIDAK DIDUKUNG`.
- Gambar sesuai `line`, dan aksi kunci jatuh di kata kunci.
- Karakter terbaca: ada rim light, berdiri di depan area terang, tidak terpotong tepi, tidak menimpa teks.
- Outfit dan arah layar konsisten dalam satu adegan; setiap karakter punya bayangan kontak.
- Nilai warna gelap dengan 1-3 aksen terang, tidak pucat.
- Setiap shot punya gerak kamera dan atmosfer (debu, hujan, glow).
- Teks pendek, di dalam area aman, terbaca di ukuran HP, dan angka sesuai narasi.
- Variasi: maksimal 3 shot berturut-turut dengan framing yang sama.
- 9:16: subjek di tengah, tidak ada yang penting di 320 px bawah.
