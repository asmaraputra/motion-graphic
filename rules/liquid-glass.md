# Liquid Glass

## Status dan cakupan

Pilihan visual aktif baru untuk **Kerangka A**, bukan gaya Animate upstream, bukan kerangka baru, dan bukan preset siap-render. Panduan ini mengadaptasi prompt Liquid Glass dari pengguna melalui `kinetic-typografi.md`, yang isinya dapat berubah. Panduan produksi tidak bergantung pada file sumber tersebut. Belum ada shader/adaptor Liquid Glass atau demo produksi yang diverifikasi oleh penambahan dokumen ini.

Ambil prinsip visual dan koreografi, bukan konfigurasi contoh, HTML Artifact, larangan Remotion, clock browser, Web Audio, MediaRecorder, atau instruksi langsung membuat MP4. Jangan menyalin demo/aset pihak ketiga atau menganggap lisensi MIT Animate berlaku pada referensi ini. Vendor dan video lama tidak berubah.

## Identitas wajib

- Kaca harus menghasilkan **pembiasan atau pembesaran latar yang terlihat** dan deformasi permukaan yang terarah. Garis, objek, atau jalur di belakang lensa terlihat membengkok, bergeser, membesar, atau terkompresi sesuai bentuk kaca.
- Opacity, highlight, dan `backdrop-filter: blur()` saja tidak memenuhi gaya. Jangan menyebut kartu blur sebagai Liquid Glass yang sudah berhasil.
- Jadikan material bagian penjelasan: lensa mengungkap detail, kanal membawa informasi, bentuk menyatu/terpisah untuk menjelaskan hubungan, atau permukaan membawa keadaan ke komposisi berikutnya. Bukan demo shader tanpa isi, UI mockup, atau slideshow kartu transparan.
- Gunakan satu fokus utama dan ruang kosong yang cukup. Tidak semua objek harus kaca; bentuk solid dan diagram tajam membantu efek optik terbaca. Objek serta latar berasal dari naskah, bukan dekorasi acak.

## Art direction dan keterbacaan

- Pilih palet terbatas sesuai brief. Graphite, biru gelap, porcelain, aqua, lavender, dan peach pada sumber hanya titik awal, bukan warna wajib atau alasan mengubah warna merek.
- Sediakan latar bermakna yang dapat dibiaskan: ilustrasi, garis tipis, jalur data, atau geometri terkait penjelasan. Hindari latar kosong yang menyembunyikan efek dan latar terlalu ramai yang mengganggu isi.
- Gunakan tepi melengkung/bevel, highlight terarah bergaya Fresnel, tint/absorption lembut, serta bayangan kedalaman yang konsisten. Dispersion tipis opsional di tepi, bukan rainbow fringe tebal atau sorotan putih berlebihan.
- Pisahkan **latar yang dibiaskan** dan **foreground tajam**. Kata penting, angka, diagram halus, watermark, serta logo terverifikasi tetap terbaca. Jangan mendistorsi identitas merek, menciptakan UI produk palsu, atau menampilkan skema sebagai pengukuran nyata.
- Teks mengikuti naskah dan batas kata kunci proyek. Safe zone, kontras, font minimum, hook frame 0, penutup minimal 1,5 detik, serta larangan subtitle penuh tetap berlaku. Hindari flash lebih dari batas proyek.

## Koreografi material

- Sinkronkan gerak bentuk, kelengkungan, ketebalan tampak, bias latar, highlight, tint, dan bayangan. Efek harus bergerak bersama kaca, bukan parameter yang berosilasi sendiri tanpa sebab.
- Pertahankan hubungan sumber/hasil: jika lensa memperbesar bagian tertentu, sasaran yang sama terlihat konsisten saat lensa bergerak. Pembesaran optik bukan perubahan nilai data atau ukuran fisik yang sesungguhnya.
- Merge/split harus mempunyai keadaan antara yang mulus: mendekat, bersentuhan, menyatu/terpisah, lalu settle. Jangan mengganti ellipse menjadi kotak secara mendadak atau menghilangkan lapisan pada batas waktu.
- Peregangan menjadi pita, perubahan kurva, atau pembagian lensa hanya jika menyampaikan hubungan. Perilaku volume cukup merupakan kesan visual; jangan mengklaim simulasi fluida atau optik fisik terkalibrasi.
- Gerak berbasis frame dengan easing, antisipasi, overlap, dan hold baca. Hindari stop-motion seluruh adegan, wobble acak, float tanpa fungsi, serta pantulan berulang. Batas overshoot ilustrasi 8% dan teks 3% tetap berlaku.
- Gunakan objek berlanjut sebagai transisi: lensa melintasi diagram, kanal membawa elemen, atau permukaan berubah fungsi. Kamera hanya memperjelas detail dan koneksi sesuai batas Kerangka A, bukan drift wajib B. Jumlah beat mengikuti isi/audio, bukan kuota prompt.

## Jalur implementasi dalam Remotion

1. Gunakan scaffold, timeline, audio lokal, dan entry Studio Kerangka A. Seluruh keadaan di timestamp tertentu harus dapat dihitung dari frame tanpa ketergantungan frame sebelumnya, timer, `requestAnimationFrame`, atau randomness baru per frame.
2. Mulai dari optik screen-space bila sesuai: gambar latar ke texture/framebuffer/offscreen surface, bentuk mask lensa, hitung normal/kelengkungan, lalu sampling ulang latar dengan displacement koordinat UV. Komposit tepi/tint dan foreground tajam setelah efek optik. Ini pendekatan visual, bukan ray tracing atau simulasi Snell lengkap.
3. SVG/Canvas/WebGL dapat dipilih menurut kebutuhan dan kemampuan aktual renderer. Periksa API paket terpasang sebelum memilih teknik. Tidak ada asumsi bahwa paket efek Remotion otomatis menyediakan refraksi. Untuk WebGL/GLSL, shader dan adapter harus diuji seek deterministik serta still pada browser render proyek.
4. SDF, bentuk analitik, atau metaball boleh untuk merge/split jika geometri dan normalnya stabil. Reuse render target, cache mask/geometri/tekstur statis, serta buang resource saat tidak dipakai. Jangan membaca/menulis seluruh piksel via CPU setiap frame tanpa kebutuhan terukur.
5. Tiga dimensi penuh tidak wajib. Three.js/transmission hanya dibahas bila bentuk ruang benar-benar memerlukannya; cek dependency dan dukungan renderer, jelaskan biaya, lalu sepakati kebutuhan sebelum memasang atau mengubah workflow. Jangan menjanjikan refraksi antarsemua objek transparan tanpa pengujian.
6. Tentukan sumber sampling dan urutan komposit secara eksplisit, terutama lensa tumpang tindih, agar tidak menyampling diri sendiri atau menghasilkan feedback. Sediakan overscan/padding atau penanganan batas UV yang tidak membuat area hitam/kosong saat kamera/lensa bergerak.
7. Kelola antialiasing, warna, dan premultiplied alpha secara konsisten. Hindari seam, halo hitam, z-fighting, tepi bergerigi, clipping refraksi, dan highlight pudar karena konversi warna ganda.
8. Optimalkan jumlah lensa, pass, resolusi preview, serta efek kosmetik terlebih dahulu. Resolusi ekspor tetap sesuai brief. Jangan mengatasi performa dengan diam-diam mengganti displacement menjadi blur-only.

## Gerbang pembuktian tampilan dan fallback

- Sebelum menjanjikan kesiapan gaya untuk video tertentu, buktikan satu momen representatif sesuai izin review: latar berpola/bergambar yang relevan terlihat berubah melalui lensa saat posisi atau kurvanya berubah, sementara label foreground tetap tajam. Stills yang membandingkan keadaan, atau seek di Studio manual, dapat dipakai; tidak perlu MP4 untuk membuktikan awal teknik.
- Jika teknik utama tidak didukung, pilih penyederhanaan yang tetap menghasilkan displacement optik dan laporkan batasnya. Jika hanya blur/transparansi yang berhasil, nyatakan Liquid Glass belum terpenuhi, jangan mengklaim selesai; bahas alternatif dengan pengguna.
- Pilihan gaya bukan persetujuan otomatis menambah dependency, membuat kerangka C, mengganti renderer ekspor, atau mencampur `src/kit2d/`. Isolasi helper/shader pada video atau adapter yang benar-benar diperlukan; jangan mengubah default bersama atau video lama.
- Studio tetap dijalankan manual oleh pengguna kecuali diminta lain. Setelah kode, timing, dan audio siap, berikan perintah Studio nyata untuk slug terkait dan tunggu izin ekspor eksplisit setelah review. Jangan mengadopsi perintah ekspor otomatis dari sumber.

## Audio dan QA

- Narasi utuh dan cue bersama visual/audio tetap sumber timing. Musik dan SFX lokal wajib sesuai aturan proyek: sweep halus, resonansi kaca lembut, aksen merge/split, dan perubahan keadaan tanpa menutupi narasi. Jangan menyintesis bunyi dari render loop.
- Untuk review yang diizinkan, periksa sebelum/saat/sesudah deformasi dan transisi: pembiasan terlihat, posisi target konsisten, foreground tajam, tidak ada seam/area kosong, urutan transparansi benar, safe zone, overlap, dan keterbacaan pada HP.
- Uji seek acak dan frame awal: keadaan sama tidak bergantung pada urutan render. Pastikan still/hasil render memuat shader, latar, teks, watermark, dan seluruh layer, bukan hanya preview browser.
- QA MP4 final tetap mengikuti proyek: contact sheet dan frame dari final, decode utuh, H.264/AAC, resolusi/fps/durasi, loudness -14 LUFS dan true peak maksimal -1 dBTP. Bedakan metrik teknis dari audio yang benar-benar didengar.
- Tes dokumen, build, dan keberadaan shader bukan bukti kualitas refraksi, performa, atau audio. Laporkan secara eksplisit jika pembuktian visual atau ekspor belum dilakukan.
