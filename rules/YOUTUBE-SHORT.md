# Produksi YouTube Short dari paket bahan

Aturan untuk video **YouTube Short** vertikal yang bahannya sudah disiapkan pengguna: footage, still, GFX, narasi. Tugas agent adalah **mengedit**, bukan menggambar dari nol. Untuk motion graphic murni (aset dibuat dari nol atau dari kit), pakai `rules/VIDEO-WORKFLOW.md`.

Berlaku bersama `rules/RULES.md`, `rules/remotion-pro-rules.md`, dan `rules/VIDEO-WORKFLOW.md`. Aturan di `rules/RULES.md` menang jika bertentangan, terutama larangan render final otomatis.

## Bedakan dua jenis produksi

| | Motion graphic murni | YouTube Short (dokumen ini) |
|---|---|---|
| Bahan | dibuat dari nol, `src/kit/`, atau aset lama | sudah ada di folder paket, tinggal diedit |
| Sumber kebenaran | brief + skrip pengguna | `SCENE_MANIFEST.md` di folder paket |
| Kerja utama | menggambar adegan, animasi, tipografi | memilih potongan, mengatur pacing, subtitle, grading |
| Aset baru | boleh dibuat | **tidak boleh** mengganti aset yang ditetapkan |
| Kerangka | A atau B | A (editorial), bukan B |
| Contoh | `src/videos/karma-phala` | `src/videos/cold-atlas-db-cooper` |

Kalau brief tidak jelas mana yang dimaksud: ada folder paket berisi `assets/` dan `audio/` berarti YouTube Short; tidak ada berarti motion graphic murni.

## Struktur folder bahan

```
bahan/youtube-short/<judul>/
  SCENE_MANIFEST.md       <- sumber kebenaran, wajib
  skrip-voiceover.txt     <- teks narasi, wajib
  storyboard.md           <- opsional
  asset_ignore.txt        <- opsional: nama file yang TIDAK dipakai
  BUILD_HANDOFF.md        <- opsional: catatan crop, timing, batasan
  audio/
    narration_<nama>.mp3
  assets/
    <nomor>_<nama>[_STILL|_GFX|_ALT].<ext>
  output/                 <- kosong; hasil render pengguna
```

- `<judul>` huruf kecil, tanda hubung, sama dengan slug video: `cold-atlas-db-cooper`.
- Semua unduhan masuk `assets/`. Tidak ada file lepas di root paket.
- `_raw/`, `_build/`, `_render/` boleh ada sebagai kerja pengguna dan **tidak boleh dibaca atau dikirim** oleh agent.
- Paket lama di `bahan/projek1/<judul>/` tetap sah. Jangan pindahkan tanpa izin; konvensi `bahan/youtube-short/` berlaku untuk paket baru.
- Nama slug video mengikuti nama folder. Folder `bahan/` tidak ikut Git.

## Arti sufiks nama file (mengikat)

| Sufiks | Arti | Perlakuan wajib |
|---|---|---|
| `_STILL` | foto/dokumen diam | Ken Burns saja; tidak pernah dianggap footage |
| `_GFX` | grafis buatan (teks, stempel, ikon, diagram, peta, logo) | tidak pernah disajikan sebagai foto sejarah atau rekaman asli; beri label bila perlu |
| `_ALT` | cadangan | hanya dipakai bila file utama hilang atau rusak; sebutkan di laporan |
| `_REUSE` / instruksi REUSE | dipakai ulang | rujuk path yang sama dengan `trim` berbeda; **jangan** menyalin file |
| `..._overlay` | lapisan | ikuti mode blend yang ditentukan manifest |

File tanpa nomor scene tidak dipakai. `asset_ignore.txt` berisi nama yang sudah diputuskan tidak dipakai: hormati.

## Skill wajib untuk jenis produksi ini

Tujuh skill berikut **wajib dibaca sebelum mengerjakan langkah yang bersangkutan**, bukan opsional. Semuanya sudah terpasang di `~/.agents/skills/` dan muncul otomatis di daftar skill sesi. Jika salah satu tidak muncul, baca langsung `~/.agents/skills/<nama>/SKILL.md`.

| Skill | Wajib dipakai pada | Yang diambil |
|---|---|---|
| `youtube-short-assembly` | langkah 1-9 (alur penuh) | prosedur lengkap perakitan YouTube Shorts di Windows 11: audio, whisper, Remotion, QC, dan gate render |
| `short-form-video` | sebelum menyusun `SCENES` (langkah 3) dan saat memutuskan hook | kontrak retensi, hook 1 detik pertama, ritme pattern interrupt, loop, zona aman 9:16 |
| `beat-sync-editing` | langkah 6, saat memilih titik potong | cut di dalam gerakan, J-cut/L-cut, speed ramp, menerjemahkan rencana edit ke frame Remotion |
| `photo-slideshow` | langkah 6, setiap `_STILL` | Ken Burns per foto (arah, besaran zoom, durasi), penanganan rasio campur, transisi antar still |
| `caption-animation` | langkah 5, saat menulis subtitle | timing per kata dari transkrip, halaman caption vs dinding teks, tipografi dan safe area 9:16, burn-in vs sidecar |
| `remotion-best-practices` | sebelum menulis `Video.tsx` dan sebelum menambah paket | router resmi Remotion: markup, multimedia, captions, render; muat sub-dokumen yang relevan (`remotion-markup`, `remotion-captions`, `remotion-multimedia`) |
| `video-delivery-specs` | langkah 8 dan 9 | spesifikasi platform, bitrate, zona aman UI, matriks cutdown, checklist QC pra-delivery, isi handover |

Aturan main:

- Baca skill pada langkah terkait, **jangan sekaligus di awal**, kecuali `youtube-short-assembly` (alur kerja) dan `remotion-best-practices` (komponen).
- Skill adalah rujukan teknis. `SCENE_MANIFEST.md` dan dokumen ini menang bila bertentangan, terutama soal kejujuran visual dan larangan mengganti aset.
- Skill boleh menyarankan musik, SFX, atau animasi caption yang lebih ramai. Untuk dokumenter dingin ini, tetap tunduk pada manifest: tanpa SFX/musik kecuali disebutkan, subtitle potong tanpa animasi masuk.
- Jangan memasang skill baru untuk pekerjaan ini tanpa persetujuan pengguna.

## Langkah wajib

### 0. Baca `remotion-best-practices` dan `youtube-short-assembly`

Sebelum menulis komponen apa pun, muat `remotion-best-practices` dan sub-dokumen yang relevan (`remotion-markup`, `remotion-captions`, `remotion-multimedia`) serta `youtube-short-assembly` untuk panduan urutan kerja Windows 11. Skill ini yang menentukan API Remotion versi terpasang; jangan mengandalkan hafalan.

### 1. Audit sebelum menyentuh apa pun

Daftar `assets/` dan `audio/` dengan nama persis, bandingkan dengan tabel unduhan dan tabel "file to make" di manifest. Laporkan nama yang hilang dan **berhenti** untuk scene itu.

- Dilarang mengganti dengan klip stok mirip, foto FBI lain, atau gambar AI.
- Dilarang memakai `_ALT` selama file utamanya ada.
- Manifest boleh mengizinkan dua layer untuk satu efek (mis. blueprint + stairs); cek bagian "file to make" dan `asset_ignore.txt` sebelum menyatakan morf hilang.
- Kalau paket punya skrip audit sendiri, jalankan itu dulu.

### 2. Ukur audio, jangan menebak

```powershell
ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 audio/<narration>.mp3
node scripts/new-video.mjs <slug> <path-ke-audio>
```

Angka durasi di manifest adalah perkiraan. **Durasi video = durasi audio nyata**, tanpa memotong, mempercepat, atau menambah jeda di luar permintaan.

### 3. Batas scene dari jeda terukur

Baca `short-form-video` (hook, retensi, loop, zona aman) sebelum menetapkan urutan dan durasi scene.

```powershell
ffmpeg -hide_banner -nostats -i <audio> -af "silencedetect=noise=-32dB:d=0.25" -f null -
```

Potong di tengah jeda, bukan membagi rata. Simpan hasilnya di `timeline.ts` sebagai `SCENES` dengan komentar bahwa angkanya terukur.

### 4. Transkripsi untuk timing, ejaan dari skrip

```powershell
node scripts/transcribe.mjs <slug> en
```

- **Selalu sebutkan bahasa.** Default skrip ini `id`; narasi Inggris tanpa `en` menghasilkan transkrip ngawur yang tampak masuk akal.
- Whisper sering salah dengar fakta dan angka ("No body" -> "Nobody"). Ejaan di layar **selalu** dari `skrip-voiceover.txt` atau `narasi.txt`.
- Untuk subtitle, ambil onset kata pertama tiap klausa dari daftar kata, bukan dari transkrip kalimat penuh.

### 5. Subtitle bahasa Inggris

Baca `caption-animation` (timing per kata, halaman caption, tipografi 9:16) sebelum menulis cue.

- Satu baris per klausa napas, maksimal ~48 karakter, boleh dua baris.
- Split baris proporsional ke jumlah karakter; jangan menggeser timing klausa.
- Letak: dalam area aman tengah (Y: 1450-1550); jangan menabrak tombol Shorts di bawah atau judul di atas.
- Gaya: potong (fade ~0.08 s), tanpa animasi masuk. Backing gelap tipis untuk kontras.
- Hapus teks layar lain yang **mengulang** subtitle kata per kata. Teks kunci yang menambah informasi (tanggal, angka, label diagram) tetap.
- Fact note (jika manifest meminta) diletakkan di atas subtitle, dengan opasitas cukup dan scrim bila latarnya terang.

### 6. Edit supaya dramatis

Baca `beat-sync-editing` untuk titik potong dan `photo-slideshow` untuk setiap `_STILL`. Ini inti pekerjaan, bukan hiasan:

- **Potong di dalam gerakan**, bukan saat gambar diam. Masuk 3-5 frame sebelum aksi memuncak.
- **Hook di frame 1** (`short-form-video`): teks pembuka sudah terbaca sejak frame pertama, dan visual paling kuat ada di frame pertama; jangan fade dari hitam, jangan ramp-in lambat. 85% penonton menonton tanpa suara.
- **Pattern interrupt tiap beberapa detik** (`short-form-video`): ganti shot, skala, atau arah gerak sebelum perhatian turun. Jangan menyeragamkan durasi shot; variasikan panjang-pendek.
- **Batas scene mengikuti jeda napas narasi.** Kalimat yang butuh henti mendapat hold; jangan menutup scene saat kata terakhir masih berbunyi.
- **Satu ide per shot.** Kalau satu klip harus menanggung dua kalimat, potong jadi dua trim berbeda.
- **Gerak kamera pelan dan konsisten arah.** Push-in untuk membangun, pull-out untuk menutup. Zoom statis 1.0-1.08 sudah cukup; hindari zoom yang membuat detail hilang.
- **Still = Ken Burns.** Fokus ke detail yang disebut narasi (nama di tiket, serial uang, simpul dasi), zoom pelan searah.
  - Aturan keras dari `photo-slideshow`: **tidak ada dua still yang bergerak dengan cara sama.** Variasikan arah (in/out, kiri/kanan), skala awal, dan titik fokus. Variasi harus deterministik per indeks still, bukan `Math.random`, supaya render ulang identik.
- **Grading dingin untuk dokumenter:** turunkan saturasi, dinginkan hue, gelapkan tepi (vignette) dan bagian bawah (scrim teks). Aksen warna hanya untuk objek yang disebut manifest (mis. amber untuk uang, panas, atau dasi).
- **Jeda sebagai alat.** Scene penutup/pertanyaan boleh lebih lambat; jangan mengisi setiap detik dengan potongan baru.
- **Jangan menambah SFX atau musik** kecuali manifest/izin pengguna menyebutkannya dengan nama file.

### 7. Kejujuran visual

- `_GFX` adalah grafis. Diagram diberi label diagram bila manifest memintanya.
- Klip stok yang hanya atmosfer tidak boleh diberi caption seolah-olah itu lokasi/kejadian nyata.
- Wajah: hanya gambar wajah yang diizinkan manifest (mis. sketsa FBI). Selain itu siluet dari belakang atau tanpa orang.
- Angka dan waktu yang tidak pasti ditulis sebagai perkiraan ("around 8:13 PM"), dengan fact note bila manifest memintanya.
- Interpretasi yang belum terbukti diberi label hipotesis atau keyakinan.

### 8. Verifikasi lalu berhenti

Baca `video-delivery-specs` untuk zona aman UI, spesifikasi ekspor, dan checklist QC sebelum menyatakan selesai. Skill itu boleh menyebut perintah ekspor; render final tetap milik pengguna.

```powershell
npx tsc --noEmit
npx eslint src/videos/<slug>
npm test
node scripts/render.mjs <slug> stills <detik...>
```

Lihat `out/videos/<slug>/contact.png` dan periksa: subtitle terbaca di setiap beat, tidak ada teks ganda, fact note tidak bertumpuk, tidak ada subjek yang terpotong jadi smear, kartu penutup sempat diam.

Tambahkan `tests/<slug>-timeline.test.mjs`: scene menutup audio tanpa celah, subtitle urut tanpa tumpang tindih dan di dalam durasi, tidak ada audio tambahan yang tidak sah.

**DILARANG merender MP4.** Serahkan perintahnya:

```powershell
node scripts/render.mjs <slug> video
```

### 9. Laporan

Pakai kerangka handover dari `video-delivery-specs` (spesifikasi, QC, apa yang belum diperiksa). Sebutkan: durasi final, durasi audio yang dipakai untuk sinkron, dan setiap scene yang asetnya **dipotong atau digelapkan**. Sebutkan juga `_ALT` yang terpaksa dipakai (kalau ada), teks yang dihapus karena menduplikasi subtitle, dan bagian yang belum ditonton.

## Checklist

- [ ] Tujuh skill wajib sudah dibaca pada langkahnya: `youtube-short-assembly`, `remotion-best-practices`, `short-form-video`, `caption-animation`, `beat-sync-editing`, `photo-slideshow`, `video-delivery-specs`.
- [ ] Semua file manifest ada atau dilaporkan hilang, tanpa substitusi.
- [ ] Tidak ada `_ALT` dipakai selama file utama ada.
- [ ] Durasi dari ffprobe; batas scene dari jeda terukur.
- [ ] Whisper dijalankan dengan bahasa yang benar; ejaan dari skrip.
- [ ] Setiap `_GFX` dibaca lebih dulu; caption tidak mengulang teks yang sudah tercetak.
- [ ] Subtitle, caption, dan fact note berbagi area aman tanpa tumpang tindih.
- [ ] Scene 5/6/8 dan label diagram/hipotesis sesuai manifest.
- [ ] `tsc`, `eslint`, `npm test` hijau; tes timeline ada.
- [ ] File kerja sementara dihapus; still di `out/` dibersihkan.
- [ ] MP4 **tidak** dirender agent; perintah render diserahkan.
