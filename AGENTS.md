# Instruksi agent untuk proyek ini

Berlaku untuk semua AI agent di folder proyek ini dan subfoldernya, bukan instruksi global.

Sebelum merencanakan, membuat, atau mengubah video/motion graphics, WAJIB baca lengkap (relatif terhadap root proyek):

1. `rules/RULES.md`
2. `rules/remotion-pro-rules.md`
3. `rules/VIDEO-WORKFLOW.md` (kerangka kerja tetap untuk setiap video baru; pakai, jangan membangun ulang)
4. Untuk YouTube Short dari paket bahan (`bahan/youtube-short/<judul>/` berisi `SCENE_MANIFEST.md`, `assets/`, `audio/`): `rules/YOUTUBE-SHORT.md`. Paket YouTube Short mengedit bahan yang sudah ada, bukan menggambar dari nol. Enam skill wajib untuk jenis ini tercantum di bagian "Skill wajib" dokumen tersebut (`remotion-best-practices`, `short-form-video`, `caption-animation`, `beat-sync-editing`, `photo-slideshow`, `video-delivery-specs`); baca masing-masing pada langkahnya, jangan dilewati.
5. Untuk video Kerangka B (stick figure sinematik 2D): `rules/KERANGKA-B.md` dan `rules/kerangka-b/style-bible.md`

Lakukan otomatis pada setiap sesi baru tanpa menunggu pengguna meminta. Baca ulang setelah reset/compaction jika aturan lengkap tidak lagi ada dalam konteks. Ikuti brief dan instruksi pengguna terbaru bila lebih spesifik.

## Dua kerangka kerja

Proyek ini punya dua kerangka video yang wajib terpisah. Pilih kerangka sebelum membuat video baru (`rules/VIDEO-WORKFLOW.md`, bagian "Pilih kerangka dulu"):

| | Kerangka A | Kerangka B |
|---|---|---|
| Gaya | Motion graphic tipografi/diagram (video lama) | Stick figure sinematik 2D (port plugin aiTrends 2D Studio) |
| Aturan | `rules/VIDEO-WORKFLOW.md` | `rules/KERANGKA-B.md` + `rules/kerangka-b/` |
| Kit | `src/kit/` | `src/kit2d/` |
| Template | `templates/video/` | `templates/video-2d/` |
| Mulai | `node scripts/new-video.mjs <slug> <file-voiceover>` | `node scripts/new-video.mjs <slug> <file-voiceover> --kerangka b` |
| Contoh | `src/compositions/kerja12/` | `src/videos/contoh-2d/` |

- Brief meminta stick figure tanpa referensi gaya lain, gaya aiTrends, cerita "What if", atau tampilan sinematik gelap: pakai B. Stickman Sinematik Hangat adalah pilihan A bila dipilih eksplisit. Gaya seperti video yang sudah ada: pakai A. Brief tanpa gaya: tampilkan seluruh pilihan aktif.
- Video B tidak boleh import `src/kit/`, dan video A tidak boleh import `src/kit2d/`.
- Slug yang sudah ada tetap di kerangkanya. Folder dengan `story.json` adalah video B.

## Tiga jenis produksi

Jangan campur ketiganya. Pilih berdasarkan bahan yang diberikan pengguna:

| Jenis | Bahan | Aturan | Kerangka |
|---|---|---|---|
| Motion graphic murni | dibuat dari nol atau dari `src/kit/` | `rules/VIDEO-WORKFLOW.md` | A |
| Sinematik 2D stick figure | dibuat dari nol | `rules/KERANGKA-B.md` | B |
| YouTube Short | sudah ada di `bahan/youtube-short/<judul>/` | `rules/YOUTUBE-SHORT.md` | A (editorial) |

Penanda paling cepat: folder bahan berisi `SCENE_MANIFEST.md` + `assets/` + `audio/` = YouTube Short. Tugasnya mengedit dan menyinkronkan, bukan menggambar aset baru. Pengganti aset dari web atau AI dilarang. Paket lama di `bahan/projek1/<judul>/` tetap sah.

Bagian "Mencegah macet" di `rules/RULES.md` wajib diikuti di setiap giliran: tulis ke file sejak awal dan bertahap, jangan mengakhiri giliran hanya dengan berpikir, dan lapor ke pengguna di setiap tahap.

**DILARANG RENDER FINAL OTOMATIS.** Agent tidak merender MP4 sendiri. Setelah `tsc`, `eslint`, dan `npm test` hijau, konfirmasi ke pengguna bahwa video siap, sertakan perintah render untuk slug itu, lalu berhenti. Pengguna yang merender final. Detail dan pengecualian: `rules/RULES.md`, "DILARANG RENDER FINAL OTOMATIS".

Sumber aturan tunggal ada di `rules/`. File `CLAUDE.md`, `GEMINI.md`, `.github/copilot-instructions.md`, dan `.omp/RULES.md` hanya penunjuk ke sini; ubah aturan di `rules/`, bukan di penunjuk.
