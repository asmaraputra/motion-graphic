# Alur kerja video baru

Kerangka tetap untuk setiap video motion graphic vertikal di proyek ini. Pakai ini, jangan membangun ulang.

## Pilih kerangka dulu

Proyek ini punya dua kerangka yang wajib terpisah:

- **Kerangka A** (dokumen ini): motion graphic tipografi/diagram dengan `src/kit/` dan `templates/video/`.
- **Kerangka B** (`rules/KERANGKA-B.md`): stick figure sinematik 2D, port dari plugin aiTrends 2D Studio, dengan `src/kit2d/` dan `templates/video-2d/`.

Aturan pemilihannya ada di `rules/KERANGKA-B.md`, bagian "Kapan memakai Kerangka B". Video B mengikuti langkah di file itu. Bagian "Default preferensi pengguna" di bawah tetap berlaku untuk B, kecuali yang disebut di sana sebagai dikalahkan style bible.

## Input dari pengguna

1. Brief/naskah (`.md`), lokasi standar `bahan/brief.md` atau file brief terkait di `bahan/` (lokal, tidak ikut Git). Cari di `bahan/` terlebih dahulu, bukan mengasumsikan `brief.md` ada di root. Path lain hanya dipakai bila pengguna menunjukkannya secara eksplisit. Jika ada beberapa kandidat tanpa pilihan yang jelas, konfirmasikan brief aktif; jika belum ada, minta pengguna menyalinnya secara manual.
2. File voice-over (`.wav`, `.mp3`, atau format lain yang dibaca ffmpeg), disimpan di `bahan/`. Gunakan path yang sesuai nama file sebenarnya, misalnya `bahan/voiceover.wav`, bukan mengasumsikan audio ada di root. Beri path file itu ke `scripts/new-video.mjs`; salinan produksi yang dipakai video ada di `public/videos/<slug>/narration.wav`. Folder `bahan/` tidak ikut Git, jadi pull tidak menyediakan bahan mentah ini.
3. Rules tambahan (opsional).

## Konfirmasi awal video baru

Sebelum membuat folder video, memilih kerangka, atau membangun adegan, baca brief lalu identifikasi empat keputusan berikut. Membaca file dan mengukur metadata audio boleh dilakukan lebih dulu.

1. **Gaya visual.** Jika belum ditentukan, gunakan seluruh pilihan aktif dari `rules/visual-references.md`. Gaya lama tetap tersedia bersama tujuh tambahan Animate. Jika tool membatasi jumlah opsi, gunakan pengelompokan dua tingkat di `rules/animate-styles.md`; semua nama harus tetap terlihat, lalu tunggu gaya spesifik pengguna. Jangan memilih gaya hanya dari pilihan keluarga. Wajib merekomendasikan satu gaya berdasarkan `bahan/brief.md` atau file brief terkait di `bahan/` (atau path yang diberikan pengguna), terutama bagian naskah. Baca alur lengkap, konflik, nada, aksi karakter, kebutuhan diagram, durasi, rasio, dan aset; jangan menyimpulkan gaya hanya dari judul. Beri alasan singkat yang menghubungkan gaya dengan kebutuhan visual naskah, lalu tempatkan rekomendasi di urutan pertama pada menu yang relevan. Rekomendasi bukan pilihan otomatis: gaya lain tetap tersedia dan keputusan akhir pengguna dihormati. Jika naskah belum tersedia, cari file brief terkait dahulu; jika tetap tidak ditemukan, minta naskah, jangan mengaku telah menganalisisnya. Jika gaya sudah dipilih, jangan membuka pemilihan ulang tanpa diminta.
2. **Detail spesifik.** Jika belum diputuskan, tawarkan **“Jangan mengarang”** atau **“Boleh, wajar dan netral”**. Pilihan kedua mengizinkan detail ilustratif rekaan sesuai konteks (misalnya nama tokoh, jam, atau isi pesan), bukan mengarang statistik, kutipan, sumber, atau fakta teknis. Detail rekaan harus dilaporkan dan tidak boleh disajikan sebagai fakta nyata.
3. **Teks chat/bubble.** Jika belum diputuskan, tawarkan **“Garis abstrak”** atau **“Teks pendek boleh”**. Kebijakan ini juga mencakup teks diegetik pada kartu, papan, dokumen, atau layar; bukan perintah menambah bubble yang tidak relevan dan bukan izin subtitle penuh.

4. **Maskot.** Untuk Kerangka A, jika belum diputuskan, tanyakan pilihan maskot dengan tiga opsi: **“Worker”**, **“Orang Hindu”**, dan **“Tanpa maskot”**. Worker adalah pekerja berhelm kuning dan baju kerja di `src/kit/worker.tsx`; Orang Hindu adalah karakter putih ber-outline hitam dengan udeng putih/hitam/emas di `src/kit/orang-hindu.tsx` (`OrangHindu`). Maskot yang dipilih menjadi karakter utama yang memerankan narasi; `colors` boleh menyesuaikan palet tanpa mengganti identitas helm atau udeng. Jangan memilih maskot hanya dari topik atau gaya visual, dan jangan menambahkan atribut budaya/agama yang tidak ada pada referensi. Bila perlu, berikan perintah model sheet `npx remotion studio src/videos/maskot-worker/entry.tsx` atau `npx remotion studio src/videos/maskot-orang-hindu/entry.tsx` untuk dijalankan manual oleh pengguna; jangan menjalankan server otomatis. Jika gaya sudah B, lewati pertanyaan maskot karena karakter B memakai `src/kit2d/`.

Gabungkan semua keputusan yang belum terjawab dalam satu panggilan tool `ask`, dengan pertanyaan gaya, detail, bubble, dan maskot yang terpisah. Memilih gaya tidak otomatis menjawab keputusan lain. Jika gaya belum dipilih, pertanyaan maskot boleh diajukan bersama; jawaban B + Worker atau B + Orang Hindu harus dijelaskan sebagai tidak kompatibel lalu diklarifikasi, bukan mencampur kit A dan B.

Brief tidak menyebut pilihan, mempunyai penanda `[ATAU]`, atau memuat opsi yang saling bertentangan berarti keputusan itu belum selesai. Jangan memilih diam-diam memakai default. Jika satu keputusan sudah jelas dari brief atau jawaban pengguna untuk video ini, pakai jawaban itu dan jangan tanyakan ulang. Pilihan video sebelumnya tidak otomatis berlaku pada video baru, kecuali pengguna menetapkannya sebagai preferensi lintas-video.

Jika pengguna secara eksplisit menyerahkan keputusan tertentu kepada asisten, pilih yang sesuai brief dan nyatakan pilihan tersebut tanpa menanyakannya kembali; delegasi gaya saja tidak berarti delegasi detail, bubble, dan maskot. Tunggu jawaban untuk keputusan lain yang masih membutuhkan pilihan pengguna. Gaya yang sudah ditentukan pengguna tetap dihormati meskipun di luar katalog.

Konfirmasi ini berlaku bagi kerangka A maupun B. Default preferensi di bawah melengkapi keputusan pengguna, bukan alasan melewati pertanyaan awal yang belum terjawab.

## Langkah

1. Baca `rules/RULES.md`, `rules/remotion-pro-rules.md`, brief, dan rules tambahan. Selesaikan bagian **Konfirmasi awal video baru** di atas sebelum langkah berikutnya; jangan mulai ulang keputusan yang sudah disetujui.
2. Buat folder video:
   `node scripts/new-video.mjs <slug> "bahan/<file-voiceover>"` (ganti dengan nama file sebenarnya; Kerangka A, Kerangka B memakai `--kerangka b`)
   Hasil: `src/videos/<slug>/{entry.tsx,timeline.ts,Video.tsx}` + `public/videos/<slug>/narration.wav`. WAV PCM disalin apa adanya; format lain dikonversi otomatis ke WAV 16-bit (sample rate dan kanal asli), tanpa file sisa di root. Durasi dan jumlah frame (30 fps) dihitung dari WAV dan tercetak.
   Jika skrip menolak karena slug sudah ada, sesi sebelumnya berhenti di tengah: jangan buat slug baru. Cek progres lalu lanjutkan dari langkah yang belum selesai (`out/videos/<slug>/words.txt` ada = transkripsi selesai; `CUES`/`S`/`SFX` terisi = timeline selesai; `Video.tsx` masih berisi komentar template = adegan belum dibuat).
3. Transkripsi lokal (audio tidak di-upload):
   `node scripts/transcribe.mjs <slug>`
   Hasil: `out/videos/<slug>/words.txt` (detik + kata). Isi `CUES` di `timeline.ts` dari file ini. Estimasi ±0,2 s, bukan forced alignment.
   Whisper sering salah dengar istilah teknis (eskalator: "rel" jadi "real", "roda" jadi "rodah", "kerangkaian" jadi "kerangkayan"). Cocokkan `words.txt` dengan naskah sebelum mengisi `CUES`; ejaan di layar selalu dari naskah.
4. Terapkan gaya visual yang sudah dipilih pada konfirmasi awal (aturan 18 di `rules/remotion-pro-rules.md`). Daftar lengkap pilihan aktif ada di `rules/visual-references.md`; penambahan gaya tidak menghapus pilihan lama. Untuk gaya Animate, baca juga `rules/animate-styles.md` dan aturan gaya di `vendor/animate/styles/<id>/STYLE.md`; source upstream bukan preset Remotion atau kerangka baru. Pilihan visual berdiri sendiri, bukan kerangka baru atau gaya yang otomatis dicampur. Arsip riset lainnya belum menjadi pilihan aktif. Jangan ubah video yang sudah selesai.
   Latar `INK.bg`, Poppins, dan tampilan `src/compositions/kerja12/` adalah default kerangka, bukan gaya wajib; ganti per video di `Video.tsx`, jangan ubah `src/kit/brand.ts`.
5. Bangun adegan di `Video.tsx`. Pakai kit, jangan menulis ulang:
   - `src/kit/motion.ts`: `k`, `life`, `lerp`, `EASE`, `useT` (waktu dalam detik).
   - `src/kit/components.tsx`: `Title` (kata kunci bertingkat), `Pill`, `Watermark`, `Sfx`, `ReviewOverlay`.
   - `src/kit/worker.tsx`: maskot `Worker`, hanya jika dipilih dan hanya Kerangka A. Pertahankan 6 ekspresi dan 7 pose; jangan menggambar ulang Worker di komposisi. `armL`/`armR` menerima nama pose atau `[bahu, siku]` derajat; `mixArm(a,b,u)` membatasi u ke 0..1. `walk` adalah fase langkah (geser x sendiri), `dip` adalah squash di titik kaki, `look` dibatasi -1..1, `flip` membalik karakter tetapi tidak membalik teks benda. `holding` menerima SVG lokal, `holdingHand` memilih `left`/`right` (default `right`). `idleOffset` adalah offset waktu tetap per karakter, jangan dihitung dari x yang bergerak. `colors` mengganti palet. Rig murni dan perhitungan sendi berada di `src/kit/worker-motion.ts`. Model sheet: `npx remotion studio src/videos/maskot-worker/entry.tsx`; gunakan Studio untuk review, bukan render otomatis.
   - `src/kit/orang-hindu.tsx`: maskot SVG `OrangHindu` dari referensi pengguna, badan putih ber-outline hitam dan udeng putih/hitam/emas. Opsional, hanya Kerangka A dan hanya bila sesuai brief atau dipilih pengguna; tidak mengganti `Worker` atau pilihan maskot secara otomatis. Sepuluh pose semantik, enam ekspresi, kontrol tangan/berjalan/kedip/pegangan; matematika di `orang-hindu-motion.ts` memakai ulang `worker-motion.ts`. Preview: `npx remotion studio src/videos/maskot-orang-hindu/entry.tsx`. API dan file yang perlu dibawa: `src/videos/maskot-orang-hindu/README.md`.
   - `src/kit/papercut.tsx`: aset gaya Diorama papercut, dipakai ulang supaya tidak menggambar dari nol. Pasang `<PaperDefs />` sekali sebelum adegan dan `<PaperGrain />` di atasnya; elemen memakai `filter={PAPER}`, `SKY`, `GLOW`, dan palet `PC` (timpa per video lewat `{...PC, ...}`). Isi: karakter `Family` (`neutral`, `happy`, `curious`, `concerned`, `talk`, `walk`, `shirt`, `s` 0,72 untuk anak), `Bubble` + `Lines`, `Cloud`/`PaperDot`, `QuestionMark`; luar `Dusk` (parallax `dx`), `Hills`, `HouseFront`, `Chair`; pabrik `FactoryBack`, `PressMachine`, `Conveyor`, `PlySheet`, `Gear`, `FocusRing`, `Ripples`; rumah `RoomShell`, `Rug`, `DuskWindow`, `Door`, `Boots`, `HangingLamp`, `SofaBack`/`SofaFront` + `SeatedLegs` (duduk di `y + SOFA_SEAT`), `KidDrawing`; helper `float`, `popIn` (overshoot 6,6%, hanya ilustrasi). Contoh pakai: `src/videos/cerita-capek/`. Pratinjau semua aset: `npx remotion studio src/videos/kit-papercut/entry.tsx`. Aset baru untuk gaya ini ditambahkan ke file ini lalu ke lembar pratinjau, bukan digambar di `Video.tsx`.
   - `src/kit/animate-math.tsx`: adaptor gaya Animate Math untuk Remotion. Palet `M`, font `SERIF`, kolom teks `TX`, easing `smooth`/`run`/`fade`/`keys`/`track`/`thereBack`, `Write` (teks ditulis: outline lalu isi), `dash` (ShowCreation untuk path SVG), `Flash`, `Arrow`, `NumberPlane`, `fmt` (angka format Indonesia). Contoh pakai: `src/videos/bumi-berputar-cepat/`.
   - `src/kit/earth.tsx`: `Earth`, globe SVG dengan garis pantai asli Natural Earth 1:110m (domain publik, data di `src/kit/land-110m.json`). Prop `lon` (bujur yang menghadap kamera; turunkan seiring waktu untuk putaran barat ke timur), `tilt` (0 samping, 90 dari atas Kutub Utara), `detail` (memudarkan benua saat zoom jadi cakrawala), `colors` (default `EARTH_MATH`). Bisa dipakai gaya A apa pun lewat `colors`. Butuh `d3-geo` (sudah terpasang, versi dipin).
   - Aset kit bersifat **opsional**. Pakai bila cocok supaya tidak membangun dari nol, tetapi video boleh menggambar sendiri dan berkreasi bebas tanpa aset ini. Jangan mengubah aset kit hanya demi satu video; timpa lewat prop atau buat komponen di folder video. Perbaikan aset kit tidak boleh mengubah tampilan video lama.
   - `src/kit/brand.ts`: font Poppins lokal, `SAFE` (100/180/180/320 px), `INK`, `kitSchema` (watermark, sfxVolume, showReview).
   Warna aksen per video ditaruh di `C` dalam `Video.tsx`. Isi `SFX` di `timeline.ts` (whoosh/tick/pop). Font lain: `@remotion/google-fonts` (sudah terpasang).
   Tambahkan `tests/<slug>-timeline.test.mjs` (adegan menutup seluruh audio tanpa celah, cue dan SFX di dalam audio).
6. Preview: `npx remotion studio src/videos/<slug>/entry.tsx`. Prop `showReview` menampilkan timecode + garis area aman.
7. Cek frame kunci: `node scripts/render.mjs <slug> stills 1.5 10 20 ...` lalu lihat `out/videos/<slug>/contact.png`.
8. Render final (hanya jika diminta): `node scripts/render.mjs <slug> video` menghasilkan `out/videos/<slug>/<slug>.mp4` (H.264 CRF 18, AAC, loudness -14 LUFS / true peak -1 dBTP) dan mencocokkan jumlah frame.
   Pengguna minta review sendiri atau melarang render: lewati langkah 7 dan 8. Cukup `tsc`, `eslint`, dan `npm test`, lalu serahkan ke Studio.
9. Sebelum melapor selesai: jalankan `npm test` (semua tes, bukan hanya tes video baru), `npx tsc --noEmit`, dan `npx eslint src/videos/<slug>`. Tes gagal milik video lain: laporkan ke pengguna, jangan ubah tanpa izin. Hapus `out/videos/<slug>/still-*.png` setelah review.

## Default preferensi pengguna

Berlaku untuk setiap video. Brief yang lebih spesifik menang.

### Brief dan audio

- Beberapa file voice-over: gabungkan ke satu file sesuai urutan brief sebelum `new-video.mjs`. Urutan atau jeda antar-file tidak disebut: tanyakan dulu. Satu file bukan WAV tidak perlu dikonversi manual.
- Isian kosong di brief (mis. "File voice-over:" tanpa nama): pakai file yang dilampirkan pengguna dan sebutkan di laporan.
- Audio master dipakai utuh: tidak dipotong, dipercepat, atau diberi jeda selain yang diminta. Durasi video = durasi audio gabungan.
- Loudness akhir -14 LUFS integrated, true peak maksimal -1 dBTP (sudah otomatis di `render.mjs`). Ini patokan praktis TikTok/Reels, bukan spesifikasi resmi platform.
- SFX pelan di bawah narasi: `sfxVolume` 0,25. Hanya di aksi bermakna (masuk adegan, muncul elemen, notifikasi, punchline), sekitar 1 per 2 detik, tidak menimpa kata kunci narasi.
- Suara latar: instrumental lembut buatan sendiri (sintetis, bebas lisensi), sekitar 18-20 dB di bawah narasi, fade in/out. Brief tidak menyebut musik atau ambience: pakai musik.
  - Lo-fi: `.venv-kelindihan/Scripts/python.exe scripts/make-lofi.py <slug> <detik> [bpm]` menulis `public/videos/<slug>/music.wav` (48 kHz stereo, bpm default 72). Fade in 2 s dan fade out 3 s sudah ada di file, jadi `Video.tsx` tidak perlu ramp volume.
  - Pasang: `<Audio src={staticFile('videos/<slug>/music.wav')} volume={MUSIC_VOLUME} />`. Ukur narasi dan musik: `ffmpeg -hide_banner -nostats -i <file> -af ebur128=peak=true -f null - 2>&1 | tail -n 14` (tanpa `tail`, keluarannya ratusan baris). `MUSIC_VOLUME = 10 ** ((LUFS_narasi - 19 - LUFS_musik) / 20)`. Eskalator: -18,2 dan -17,5 LUFS menghasilkan 0,1.

### Teks di layar

- Tanpa subtitle penuh. Kata kunci atau angka saja, 1-4 kata per baris, terbaca penuh minimal 1 s, ukuran minimal 56 px.
- Teks diegetik (chat, poster, layar HP) tidak boleh menyalin kalimat narasi utuh kecuali brief mengizinkan. Tampilkan sebagian, sorot kata kunci, atau pakai garis abstrak.
- Ejaan mengikuti naskah, bukan ucapan di rekaman.
- Jangan mengarang detail spesifik (angka, jam, nama, merek, isi dokumen) kecuali brief mengizinkan. Detail ilustratif yang terpaksa dipakai harus netral dan dilaporkan.
- Watermark kecil `@asmara.putra` (default `kitDefaults`), tidak tertutup elemen lain.

### Target kualitas animasi

Patokan praktis motion design, bukan standar resmi. Melengkapi `rules/remotion-pro-rules.md`.

- Easing: semua masuk/keluar pakai spring atau kurva `EASE`. Linear hanya untuk ketik, hitung, atau progres.
- Durasi: masuk 0,3-0,6 s, keluar 0,2-0,35 s, stagger 3-6 frame antarelemen.
- Overshoot: ilustrasi maksimal 8%, teks kata kunci maksimal 3%.
- Hold hidup: tidak ada frame diam total lebih dari 1 s (float 4-8 px, kedip, napas).
- Transisi bervariasi (match cut, push, zoom ke detail, morph), jangan semua fade. Elemen yang berlanjut antaradegan (karakter, perangkat, objek utama) tetap di layar dan berubah, bukan muncul ulang.
- Karakter (jika ada): minimal 3 ekspresi, mata berkedip, antisipasi sebelum aksi besar, squash and stretch ringan.
- Punchline: jeda 0,2-0,3 s sebelum reveal, lalu pop + SFX.
- Kamera: push-in atau shake kecil hanya di momen puncak, maksimal 1 per 10 s.
- Fokus: satu fokus per adegan, maksimal 3 elemen bergerak bersamaan.
- Konsistensi: satu palet, satu ketebalan outline, satu keluarga font per video.
- Larangan: emoji, clip-art, flash/kedip lebih dari 3 kali per detik, teks yang terus memantul.
- Area aman: teks penting di dalam `SAFE` (bukan 320 px bawah dan 180 px kanan). Adegan penutup/CTA tampil minimal 1,5 s.

### Video mekanisme (Bedah Teknis 2.5D)

Contoh: `src/videos/eskalator/`. Objek utama harus tetap di layar dan berubah, jadi pakai satu dunia dengan satu kamera, bukan `Layer` per adegan.

- `geometry.ts`: jalur tertutup parametrik (`pt(s)` mengembalikan x, y, sudut) dan posisi tiap bagian dari waktu (`stepS`). Dunia memakai unit sendiri; kamera yang menskalanya ke 1080x1920. Cek jalur menutup: titik dan sudut akhir sama dengan awal.
- `world.tsx`: menggambar dunia dari `t` dan prop `Look` (sorotan 0..1 per bagian). Satu warna per fungsi: oranye penggerak, teal pemandu, kuning fokus.
- `Video.tsx`: `KEYS` kamera `[detik, x, y, zoom]`, `lookAt(t)` dengan `life()` per sorotan, `Title` dari `TITLES`, label bergaris penunjuk (`Tag`), dan audio.
- `timeline.ts`: `CUES`, `TITLES` (jendela teks kata kunci), `SFX`. Tanpa `SCENES`.
- `tests/<slug>-timeline.test.mjs`: frame = audio, teks tidak tumpang tindih dan minimal 1 s, penutup minimal 1,5 s setelah punchline, SFX berjarak minimal 2 s.
- Penampang disederhanakan: jangan menampilkan angka, ukuran, atau skala tanpa dasar faktual. Laporkan bagian yang diilustrasikan (mis. posisi motor).

### Review dan laporan

- **Studio dijalankan manual oleh pengguna.** Jangan menjalankan server Remotion Studio, membuka preview, atau menjalankan pemeriksaan browser Studio secara otomatis. Cukup berikan perintah untuk entry/slug yang tepat agar pengguna menjalankannya sendiri. Pengecualian hanya bila pengguna secara eksplisit meminta asisten menjalankan Studio. Verifikasi tes, lint, dan typecheck tetap boleh dijalankan tanpa server; laporkan bahwa preview visual belum diperiksa bila tidak dilakukan.
- **Gerbang review sebelum render, untuk semua video berikutnya:** setelah kode, timing, dan audio siap, berhenti di preview Studio. Beri tahu pengguna bahwa video siap dicek dan selalu sertakan perintah nyata `npx remotion studio src/videos/<slug>/entry.tsx` dengan `<slug>` diganti slug video tersebut. Jelaskan agar membuka URL yang dicetak terminal, memilih komposisi video, lalu memutar/seek untuk menilai visual dan audio.
- **Tunggu izin ekspor setelah review.** Jangan render MP4 sampai pengguna secara eksplisit menyetujui render, misalnya “sudah cocok, render”. Permintaan awal membuat video atau persetujuan gaya/konsep/sampel tidak otomatis menjadi izin ekspor. Jika meminta revisi, perbaiki lalu kembalikan ke gerbang review yang sama.
- Jika frame kunci diperlukan untuk memilih tampilan, tunjukkan sampel proporsional atau preview di Studio. Jangan melakukan full render sebagai pengganti preview pengguna.
- Laporan akhir: timecode sinkron yang belum yakin, detail yang dikarang, loudness terukur, dan bagian yang belum ditonton/didengar.

## Paket Remotion

Semua paket `@remotion/*` di `package.json` harus satu versi (sekarang 4.0.539). Pasang dengan `npx remotion add <paket>`, naikkan versi dengan `npx remotion upgrade`. Jangan `npm i` satu paket saja: versi campur pernah merusak `node_modules` (webpack dan `remotion` setengah jadi setelah upgrade). Rusak lagi: hapus folder paket yang bermasalah, lalu `npm install`.

Aturan pakai:

- Cek tabel ini sebelum menulis utilitas sendiri. Pakai paket jika hasilnya lebih pendek dan lebih benar daripada kode manual.
- Daftar ekspor di tabel dibaca dari file `.d.ts` terpasang, belum dicoba satu per satu. Baca tipe paketnya dulu sebelum memakai.
- Render tidak boleh bergantung pada jaringan. Aset dan suara tetap lokal.
- Lisensi di `package.json` yang bukan MIT: "Remotion License" (`light-leaks`, `media-parser`), "UNLICENSED" (`effects`, `transitions`), "SEE LICENSE" (`gif`, `google-fonts`), dan kosong (`media`, `animation-utils`). Remotion punya syarat lisensi komersial untuk perusahaan; pengguna perlu mengecek remotion.dev/license sebelum video dipublikasikan. Saya belum membaca isi file lisensinya.
- Tabel ini untuk Kerangka A (SVG/DOM). Kerangka B menggambar di Canvas 2D lewat `src/kit2d/`; sebagian besar paket SVG di bawah tidak berlaku di sana.

| Paket | Pakai untuk | Status |
|---|---|---|
| `layout-utils` | `fitText`, `fitTextOnNLines`, `fillTextBox`, `measureText`: auto-fit teks (aturan 10). `Title` di `src/kit/` memakai ukuran tetap, jadi ukur baris panjang dengan ini. | Pakai |
| `paths` | `evolvePath` (garis tergambar bertahap), `interpolatePath`/`interpolatePaths` (morph elemen yang sama, sesuai target transisi), `getLength`, `getPointAtLength`. | Pakai |
| `shapes` | `Circle`, `Rect`, `Star`, `Arrow`, `Callout`, `makeCallout`: bentuk dasar dan bubble tanpa menulis path manual. | Pakai |
| `rounded-text-box` | `createRoundedTextBox`: latar bubble teks multi-baris ala TikTok untuk kata kunci. | Pakai bila perlu |
| `noise` | `noise2D`/`noise3D`: float dan napas yang lebih organik daripada sine (hold hidup). Deterministik berdasarkan seed. | Pakai bila perlu |
| `animation-utils` | `makeTransform`, `interpolateStyles`: transform CSS bertipe. | Pakai bila perlu |
| `media-utils` | `getAudioData`, `visualizeAudio`, `visualizeAudioWaveform`: visual yang bereaksi ke narasi (waveform). `createSmoothSvgPath`. | Pakai bila perlu |
| `transitions` | `TransitionSeries` dengan `slide`, `wipe`, `flip`, `blurSlide`, `crossZoom`. `TransitionSeries` memotong adegan berurutan, padahal elemen yang berlanjut (HP, karakter) harus tetap di layar. Cocok untuk video tanpa elemen lintas adegan. Video yang punya elemen lintas adegan memakai `Layer` di `Video.tsx` (contoh: `src/videos/orang-tua/`). | Pakai bila cocok |
| `motion-blur` | `CameraMotionBlur`, `Trail`: blur pada push/zoom cepat. Render lebih lambat. | Pakai bila perlu |
| `fonts` | `loadFont` untuk font lokal. `src/kit/brand.ts` sudah memuat Poppins sendiri dan tidak diubah. Pakai untuk font tambahan per video. | Pakai bila perlu |
| `google-fonts` | Font Google per video. Satu keluarga font per video. | Pakai |
| `media` | `Audio` dan `Video` (sudah dipakai kit). | Sudah dipakai |
| `preload` | `preloadFont`, `preloadImage`, `preloadAudio`. Manfaat kecil untuk render lokal. | Opsional |
| `media-parser` | `parseMedia`: baca metadata file. `new-video.mjs` sudah menghitung durasi audio. | Tidak perlu |
| `captions` | `createTikTokStyleCaptions`, `parseSrt`: subtitle. Aturan proyek: tanpa subtitle penuh. | Tidak dipakai |
| `sfx` | Suara dimuat dari URL `remotion.media` (butuh jaringan) dan berisi suara meme (`bruh`, `vineBoom`, dan sejenisnya). SFX proyek dibuat lokal (`scripts/make-sfx.py`, `public/kit/sfx/`). | Tidak dipakai |
| `animated-emoji` | Emoji dilarang brief dan aturan proyek. | Dilarang |
| `effects` | Diizinkan pengguna. Efek GPU per-komponen lewat prop `effects` pada `Solid`, `Img`, `CanvasImage`, `AnimatedImage`, dan `HtmlInCanvas` (dari `remotion`). Tiap efek diimpor dari subpath, mis. `@remotion/effects/glow`, `/blur`, `/vignette`, `/drop-shadow`, `/duotone`, `/noise`, `/scanlines`. Cocok untuk glow lampu, vignette, dan grain. Tidak berlaku untuk elemen SVG biasa: SVG harus dibungkus `HtmlInCanvas`. Batas kedip/flash 3 per detik tetap berlaku (hati-hati dengan `light-leak`, `shine`, `tv-signal-off`). Belum diuji di proyek ini. | Pakai bila perlu |
| `gif`, `light-leaks` | Berisiko clip-art atau kedip/flash (batas 3 per detik). Pakai hanya jika brief memintanya. | Hindari |
| `tailwind-v4` | Butuh `enableTailwind` di `remotion.config.ts`. Kit memakai style inline. | Tidak perlu |
| `whisper-webgpu`, `video-matting`, `@huggingface/transformers` | Berjalan di browser dan mengunduh model besar. Transkripsi proyek memakai whisper.cpp lokal (`scripts/transcribe.mjs`). | Tidak dipakai |

Dua paket yang paling sering menghemat kerja: `layout-utils` untuk memastikan teks muat, dan `paths` untuk gambar yang tergambar atau berubah bentuk, bukan hanya fade.

## Alat

- Remotion 4.0.539 + `@remotion/media` (sudah di `package.json`). Paket lain: lihat "Paket Remotion".
- whisper.cpp b5454 + `ggml-small.bin` di `tools/whisper/` (diabaikan git). Jika hilang, unduh lagi:
  `https://github.com/ggml-org/whisper.cpp/releases/download/b5454/whisper-bin-x64.zip` (ekstrak di `tools/whisper/`) dan
  `https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small.bin`.
- Python audio: `.venv-kelindihan/Scripts/python.exe` (numpy, scipy). SFX dibuat ulang dengan `scripts/make-sfx.py`; musik lo-fi dengan `scripts/make-lofi.py`.
- Poppins (OFL) di `public/kit/fonts/`.
- Render MP4 memakan waktu sekitar 1,5x durasi video (91,6 s → 137 s di mesin ini). Beri timeout panjang dan tunggu progres `render N%`; jangan anggap macet atau mengulang render selama persentase masih naik.
- Windows: perintah PowerShell yang dipanggil dari bash dengan `-Command "..."` merusak `$_`. Tulis ke file `.ps1` sementara, jalankan dengan `powershell -NoProfile -ExecutionPolicy Bypass -File`, lalu hapus.
- Menghapus atau memindah video: hapus/perbarui juga tesnya di `tests/`, supaya `npm test` tidak gagal karena file yang hilang.

## Contoh lengkap

`src/compositions/kerja12/` (Kerja 12 Jam) adalah contoh video selesai: cue dari ASR, diagram yang berubah, adegan, SFX. Jangan diubah. Jadikan referensi pola saja.

`src/videos/eskalator/` adalah contoh video mekanisme (Bedah Teknis 2.5D, satu dunia + kamera). Frame kunci dan suaranya belum ditinjau pengguna; pakai sebagai pola struktur, bukan patokan tampilan.
