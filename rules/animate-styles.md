# Tambahan gaya Animate

## Status dan batas integrasi

Tujuh gaya dari https://github.com/cth9191/animate disetujui sebagai tambahan pilihan visual. Ini **bukan kerangka baru**, bukan pengganti Kerangka A/B, dan bukan perintah mengubah video lama. Seluruh pilihan lama di `rules/visual-references.md` tetap aktif.

Library sumber lengkap tersedia di `vendor/animate/`, dipin pada commit `7e5eb56feb2dd573f890e1b7b34748af43d58263`. `upstream.json` mencatat asal dan hash setiap file; `LICENSE` mempertahankan lisensi MIT. Source, contoh, dan styleframe di folder vendor adalah bahan implementasi, bukan skill global atau plugin Claude yang otomatis dijalankan.

**Status kesiapan:** pilihan visual dan source kit tersedia; belum menjadi preset Remotion siap-render. Build demo membuktikan komposisi HTML dapat dirakit, bukan bahwa adapter Remotion atau seluruh video produksi sudah lolos QA. Implementasi sebuah brief tetap memerlukan adegan original dan pengujian pada rasio serta audio sebenarnya.

## Tujuh pilihan tambahan

| Nama pilihan | ID sumber | Ciri dan penggunaan |
|---|---|---|
| Animate Cut Paper | `cut-paper` | Potongan kertas berwarna, tepi tidak rata, bayangan, tekstur, dan karakter ekspresif. Cocok untuk cerita ringan. Tetap berbeda dari pilihan lama Diorama papercut yang menekankan layer 2.5D dan parallax. |
| Animate Crosshatch | `crosshatch` | Garis tinta, arsiran silang, kertas hangat, dan lingkungan gelap opsional. Cocok untuk rumah, benda sehari-hari, dan cerita pengamatan. |
| Animate Riso | `riso` | Cetak risograf digital, warna tinta terbatas, halftone, overprint, dan misregistration terkendali. Tidak mengklaim cetakan fisik. |
| Animate Sketchbook | `sketchbook` | Grafit, satu aksen warna, tulisan tangan, dan tekstur buku sketsa. Cocok untuk pengamatan personal dan proses. |
| Animate Math | `math` | Panggung gelap, kurva, sumbu, variabel berwarna, serta transformasi yang menerangkan konsep. Terinspirasi bahasa explainer matematika; bukan instalasi Manim. |
| Animate Pixel | `pixel` | Gambar pada resolusi logis rendah, grid konsisten, nearest-neighbour, dan font bitmap. Teks penting tetap terbaca pada ukuran ponsel. |
| Animate Isometric | `isometric` | Keluarga proyeksi ruang dengan dua varian: Minimal (dimetrik 2:1, monokrom, hairline) dan Teknis (Isometric Line Art, hierarki garis, assembly dan aliran). Tetap Kerangka A, bukan kamera 3D bebas. |

Setiap gaya memiliki `vendor/animate/styles/<id>/STYLE.md`, `kit.js`, `sample.png`, dan `demo/`. Baca aturan gaya dan contoh yang dipilih sebelum implementasi. Sampel membuktikan tampilan pada frame tertentu, bukan kualitas seluruh film, factual correctness, atau audio.

## Pemilihan gaya tanpa kehilangan pilihan lama

Katalog aktif di `rules/visual-references.md` adalah sumber tunggal nama pilihan. Jika belum dipilih, semua nama harus terlihat; jangan menawarkan hanya tujuh tambahan ini dan jangan memaksa pilihan baru.

Sebelum menampilkan pilihan, baca bagian naskah pada brief yang sebenarnya dan rekomendasikan satu gaya dengan alasan terkait cerita atau kebutuhan penjelasannya. Pada menu dua tingkat, tempatkan keluarga yang memuat rekomendasi pada urutan pertama dan sebutkan gaya spesifik yang direkomendasikan di label pilihan itu. Pada pertanyaan berikutnya, gaya tersebut juga menjadi opsi pertama. Daftar keluarga di bawah merupakan inventaris, bukan urutan rekomendasi tetap. Jangan selalu mengutamakan Animate atau gaya terbaru; pilihan berasal dari isi naskah.

Jika tool pertanyaan membatasi empat pilihan, gunakan dua tingkat, bukan menghilangkan opsi:

1. **Stick figure sinematik**: pilihan B.
2. **Motion graphic A**: Flat Vector, Diorama papercut, UNIDO-PPDP, Bedah Teknis 2.5D.
3. **Animate ilustratif**: Animate Cut Paper, Animate Crosshatch, Animate Riso, Animate Sketchbook.
4. **Animate diagram/pixel**: Animate Math, Animate Pixel, Animate Isometric.

Sesudah keluarga dipilih, tanyakan gaya spesifik dalam keluarga itu bila lebih dari satu. Pemilihan keluarga belum berarti pemilihan gaya. Keputusan detail spesifik, bubble, dan maskot (Worker/Orang Hindu/Tanpa maskot, hanya Kerangka A) tetap terpisah dan tidak ditanyakan ulang jika sudah jelas. Jika pengguna menyebut gaya tertentu atau mendelegasikan desain secara eksplisit, ikuti keputusan tersebut tanpa menu ulang.

## Animate Isometric: dua varian

Animate Isometric tetap satu pilihan keluarga dalam katalog aktif, dengan varian **Minimal** dan **Teknis (Isometric Line Art)**. Keduanya memakai Kerangka A. Ini perluasan panduan, bukan kerangka baru, perubahan video lama, atau preset Remotion siap-render.

### Pemilihan varian

- Jika pengguna hanya memilih Animate Isometric, tampilkan kedua varian dan rekomendasikan salah satu berdasarkan naskah, lalu tunggu pilihan. Jangan menentukan varian diam-diam atau mencampur keduanya otomatis.
- Jika pengguna menyebut Isometric Line Art, itu berarti varian Teknis. Jika menyebut Minimal atau mendelegasikan keputusan varian secara eksplisit, jangan bertanya ulang; nyatakan pilihan yang dipakai.
- Catat varian di catatan produksi video. Pilihan detail, bubble/diegetik, dan maskot tetap terpisah sesuai workflow. Hero cube-bot upstream bukan maskot otomatis.

### Minimal

- Pertahankan arah `vendor/animate/styles/isometric/STYLE.md`: proyeksi **dimetrik 2:1**, bidang putih atau varian gelap monokrom, slab berketebalan, sudut membulat, detail melalui pengulangan, dan ruang kosong yang lapang.
- Gunakan hairline konstan di layar saat zoom. Siluet dan detail memakai ketebalan sama, dibedakan lewat terang-gelap; satu aksen utama memandu fokus. Tanpa warna tambahan, shadow, gradien, grain, atau glow.
- Gerak presisi: stagger diagonal, drop/slide, engsel, dan spring settle terukur; kamera tenang atau push kecil. Hold tetap punya kehidupan halus sesuai aturan proyek, bukan frame beku total.
- Bidang terdekat menutup garis belakang melalui urutan gambar dan fill. Teks pada benda mengikuti bidang; kata kunci editorial tetap mudah dibaca di layar HP.
- Baca source upstream sebelum adaptasi. Koordinat label, font, overshoot spring, dan timing demo tidak otomatis memenuhi standar proyek; sesuaikan di adapter/video, bukan di vendor.

### Teknis (Isometric Line Art)

**Identitas:** garis membangun struktur yang dikenali, komponen dirakit, mekanisme bekerja, dan aliran menghubungkan sumber ke hasil. Bukan kumpulan kubus wireframe, screenshot CAD, atau ilustrasi yang selesai digambar lalu diam.

- Gunakan proyeksi ortografis isometrik atau aksonometrik yang konsisten. Skala objek tidak mengecil hanya karena lebih jauh. Sumbu, proporsi, pivot, dan titik sambungan tetap stabil saat pan/zoom, exploded view, dan perakitan kembali.
- Bedakan tingkat garis: siluet utama paling jelas, struktur menengah, detail lebih halus, jalur aktif dengan aksen. Sesuaikan bobot garis saat zoom agar tidak menghilang atau mendominasi. Hindari detail halus yang tidak bertahan pada tampilan HP dan kompresi.
- Pilih latar terang atau gelap secara sengaja. Struktur pasif netral; aksen warna terbatas menunjukkan komponen atau jalur aktif. Warna didukung arah, bentuk, dan label. Fill tipis hanya untuk pemisahan/occlusion; jangan berubah menjadi solid-shaded 3D, kaca, atau glow berlebihan.
- Gambar bertahap menurut fungsi: siluet/sumbu utama, struktur, bagian internal, koneksi, lalu aksi. Gunakan panjang jalur (arc length) untuk mengatur reveal dan kecepatan, bukan mask seragam untuk semua path. Stagger dan kelompokkan detail agar tidak semua garis bergerak bersamaan.
- Rakit bagian pada sumbu dan jalur yang masuk akal. Exploded view memakai garis pandu atau acuan yang menunjukkan tempat asal setiap komponen. Sambungan tidak lepas, bagian tidak saling menembus, dan endpoint harus tepat saat dirakit kembali.
- Setiap aliran mempunyai sumber, jalur, tujuan, dan konsekuensi: misalnya komponen tujuan berubah keadaan setelah menerima sinyal. Jalur yang berpotongan di layar bukan otomatis sambungan; tunjukkan pemisahan atau titik koneksi dengan jelas. Jangan menambahkan angka, ukuran, atau mekanisme tanpa dasar faktual.
- Tutup hidden line dan permukaan belakang secara benar. Gunakan painter order, masking, atau bidang penutup untuk proyeksi 2D. Cutaway/X-ray harus ditandai sebagai perubahan representasi, bukan membiarkan seluruh garis menembus benda padat. Hindari garis triangulasi yang bukan struktur nyata.
- Utamakan satu dunia atau ruang-ruang terhubung. Kamera mengikuti jalur, mendekat ke mekanisme, atau melebar mengungkap sistem; orientasi relatif stabil. Gunakan handoff objek atau garis berlanjut untuk transisi, bukan reset/fade berulang atau orbit dekoratif. Batas kamera Kerangka A tetap berlaku, bukan drift wajib B.
- Kembangkan informasi sepanjang adegan: assembly diikuti aksi, perubahan keadaan, detail, atau hasil. Maksimal gerak simultan, overshoot, waktu baca, dan CTA tetap mengikuti workflow. Kartu judul kosong dan detail dekoratif bukan pengganti penjelasan.

### Batas adaptasi dan implementasi

- Untuk Minimal, aturan visual upstream tetap rujukan. Untuk Teknis, bagian Teknis di atas adalah adaptasi yang sengaja mengganti batas monokrom, bobot garis seragam, dan kamera tenang upstream. Jangan memaksakan kedua aturan yang bertentangan sekaligus. Ketentuan produksi proyek selalu berlaku pada keduanya.
- Source `isometric/kit.js` tersedia sebagai bahan geometri, bukan modul Remotion siap impor. Buat adapter terisolasi atau komponen video dengan waktu dari frame, tanpa `requestAnimationFrame`, timer, state akumulatif, atau random baru per frame. Cache geometri dan sampling path yang tidak berubah.
- SVG/Canvas dengan proyeksi tetap cukup untuk banyak adegan. Pakai paket path/geometri terpasang setelah memeriksa API sebelum menulis ulang helper. Three.js tidak wajib dan bukan janji kamera 3D bebas; bila adegan memerlukan rotasi ruang/occlusion kompleks yang tidak ditangani proyeksi 2D, jelaskan kebutuhan dan sepakati pendekatan tambahan sebelum mengubah dependency/workflow.
- Jangan mengimpor `src/kit2d/`, mengubah vendor, atau membuat renderer/editor ekspor kedua. Audio master, naskah, watermark, safe zone, hook frame 0, musik/SFX, loudness, dan preview Studio manual tetap mengikuti proyek. Izin gaya bukan izin ekspor MP4.
- Saat review yang diizinkan, periksa tahap awal/tengah/akhir line-draw, assembly, aliran, dan transisi. Cek garis tersembunyi, perpotongan jalur, koneksi, pivot, endpoint, layer, bobot garis saat zoom, keterbacaan label, serta sebab-akibat. Build demo dan tes dokumen tidak membuktikan kualitas seluruh animasi atau audio.
- Asal varian Teknis: prompt Isometric Line Art dari pengguna melalui `kinetic-typografi.md`, yang isinya dapat berubah. Panduan adaptasi ini tidak bergantung pada keberadaan file sumber. Konfigurasi contoh, HTML Artifact, larangan Remotion, ekspor browser, dan instruksi langsung membuat video tidak diadopsi. Ini arahan desain, bukan source implementasi atau bukti lisensi aset pihak ketiga.

## Produksi dalam proyek ini

- Ketujuh gaya ditawarkan sebagai arah visual Kerangka A dengan adaptasi. Pakai scaffold, timeline, audio, watermark, dan entry Studio proyek. Jangan membuat Kerangka C, mengganti default scaffold, atau mengubah slug yang sudah ada.
- Gunakan bentuk SVG/DOM dan paket yang sudah tersedia jika hasilnya sesuai. Untuk Animate Math, adaptor siap pakai ada di `src/kit/animate-math.tsx` (opsional; video boleh membangun sendiri). Bila menggunakan painter Canvas, buat adapter terisolasi per video yang menerima waktu dari frame Remotion; jangan mengimpor skrip browser ber-global secara mentah sebagai modul TypeScript.
- Jangan mengambil renderer, karakter, font, atau import `src/kit2d/` untuk video A. Kit B tetap khusus stick figure sinematik dan tidak berubah.
- Source upstream menggabungkan head, kit, dan scene dalam satu scope. Jika memindahkan helper, beri namespace dan periksa semua dependensi. Jangan mendefinisikan `NOTE` atau nama global kit lain secara sembarang; bentrok dapat menggagalkan build.
- Baca `vendor/animate/styles/<id>/STYLE.md` serta `kit.js`, lalu buat scene yang sesuai narasi, bukan sekadar mengganti label demo. Untuk Animate Isometric, baca juga bagian dua varian di atas; adaptasi Teknis mengikuti aturan visualnya sendiri, bukan batas Minimal upstream. Semua koordinat dan tekstur harus deterministik serta mengikuti ukuran canvas yang sebenarnya.
- Gerak on-2s merupakan pilihan rasa gambar; jam narasi dan durasi output tetap mengikuti audio. Kuantisasi detail gambar tidak boleh menggeser cue atau memotong kata.
- Utamakan satu bahasa visual. Jangan mencampur tujuh gaya sekaligus atau menambahkan hero bintang bawaan sebagai pengganti Worker tanpa keputusan pengguna.
- Pipeline HTML standalone upstream tetap referensi/eksperimen terpisah, bukan jalur produksi default. Jika pengguna secara khusus menginginkannya, jelaskan batas adapter dan minta keputusan sebelum mengubah workflow.

## Audio master dan review

- **audio master dipakai utuh**: jangan trim, pecah menjadi take, mempercepat, atau menambahkan lead/tail/jeda tanpa permintaan pengguna. Naskah mengikuti `voiceover-studio`; gaya gambar tidak mengubah ending atau format TTS.
- `tools/voice_words.py` upstream memakai `small.en` dan `language='en'`. Jangan mengandalkannya untuk timing bahasa Indonesia. Gunakan transkripsi lokal proyek yang sudah tersedia dan cocokkan dengan naskah. Mengganti model tanpa mengganti bahasa paksa tidak menyelesaikan masalah.
- Helper crosshatch `inkCaption` memakai y=1440 dan `inkTag` memakai y=330. Jangan menyalinnya sebagai koordinat universal: adaptasikan terhadap tinggi, SAFE, dan rasio aktual, lalu periksa frame landscape/square jika diminta.
- Musik/SFX tetap mengikuti brief, cue, dan batas proyek. Limiter upstream membatasi sample peak; itu bukan jaminan **true peak** setelah AAC. Gunakan proses mastering proyek dan ukur file final setelah ekspor berizin.
- `tools/review.mjs` upstream mencetak sejumlah `FAIL` tanpa mengagregasikan semuanya menjadi exit code gagal. Keberhasilan proses bukan bukti semua pemeriksaan lolos. Review multi-format juga perlu memastikan frame dan file yang diperiksa benar-benar format yang dimaksud.
- Preview upstream dengan musik eksternal tidak memutar track ekspor yang sama. Jangan menyamakan preview itu dengan hasil audio final.
- **Studio dahulu**, kemudian tunggu **izin ekspor** eksplisit setelah pengguna meninjau. Menambahkan gaya atau menyetujui storyboard bukan izin membuat MP4. Tidak ada render otomatis sebagai bagian penambahan katalog ini.

## Pemeriksaan dan pemeliharaan

- Jalankan `node --test tests/animate-styles.test.mjs` untuk memeriksa kelengkapan katalog, hash vendor, dan build ketujuh demo pada folder sementara. Jalankan `npm test` penuh sebelum melaporkan perubahan selesai.
- Vendor dipertahankan utuh dan tidak menjadi tempat patch diam-diam. Perbaikan/adaptasi produksi dibuat di adapter atau file video sendiri, bukan mengubah kit bersama sehingga video lama berubah.
- Penambahan katalog tidak membuktikan runtime ekspor upstream terpasang. Jangan memasang Playwright global, Chromium baru, Python package, atau mengganti dependency Remotion tanpa kebutuhan dan izin yang jelas.
- Saat ada pembaruan upstream, baca perubahan, verifikasi lisensi dan hash, lalu perbarui pin serta uji secara terarah. Jangan melakukan pembaruan otomatis dari `main`.
