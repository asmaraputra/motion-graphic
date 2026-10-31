# Katalog referensi visual motion graphic

Riset: 28 Oktober 2026. Tujuan: memperluas pilihan visual melampaui infografik flat dan stick figure sinematik, tanpa mengganti video yang sudah ada.

## Status dan cara membaca

- Ini katalog referensi, **bukan paket preset yang sudah diimplementasikan** dan bukan kerangka baru.
- Sumber di bawah berasal dari pembuat karya, studio, atau lembaga pemilik visualisasi. Deskripsi teknik mengikuti keterangan sumber.
- **[INFERENCE — usulan]**: contoh penerapan dalam arsip riset dan penilaian kebutuhan produksinya merupakan usulan, bukan klaim dari studio atau persetujuan pengguna.
- Halaman proyek dan beberapa gambar sumber diperiksa. Film referensi belum ditonton utuh; ritme, easing, atau kualitas audio belum dinilai langsung.
- Karya referensi bukan aset bebas pakai. Ambil prinsip komposisi, medium, dan penceritaannya; jangan menyalin ilustrasi, font berlisensi, footage, atau musik tanpa hak penggunaan.
- Video vertikal memerlukan komposisi ulang, bukan crop otomatis dari referensi lanskap. Teks penting tetap di area aman proyek.

## Pilihan visual disetujui untuk video berikutnya

**Status:** Daftar aktif mempertahankan lima pilihan awal dan tujuh pilihan Animate, serta menambahkan **Liquid Glass** sebagai arah visual Kerangka A. Infografik editorial flat berganti nama menjadi **Flat Vector** atas permintaan pengguna; bukan tambahan pilihan. Semua tiga belas pilihan tetap tersedia dan tidak diterapkan ulang pada video lama.

| Pilihan visual | Kerangka | Ciri utama |
|---|---|---|
| Stick figure sinematik | B | Karakter stick figure, set sinematik 2D, rim light, dan gerak kamera. |
| Flat Vector | A | Ilustrasi vektor datar terstruktur, diagram, morph terarah, dan transisi berbasis objek yang menjelaskan narasi. |
| Diorama papercut | A | Potongan ilustrasi berlapis, bayangan lembut, dan parallax dengan rasa kertas. |
| UNIDO-PPDP | A | Explainer ilustratif dengan palet adaptasi dan karakter original. |
| Bedah Teknis 2.5D | A | Penampang teknis berlapis, perspektif konsisten, anotasi, dan sorotan mekanisme. |
| Liquid Glass | A (adaptasi) | Kaca deformabel dengan pembiasan/pembesaran latar yang terlihat, transisi optik, dan informasi foreground tajam. |
| Animate Cut Paper | A (adaptasi) | Dua varian: Kolase (tekstur ekspresif dan karakter playful) dan Editorial Paper Cut-Out (diagram, mekanisme, serta informasi dari potongan kertas). |
| Animate Crosshatch | A (adaptasi) | Garis tinta, arsiran silang, kertas hangat, dan suasana keseharian. |
| Animate Riso | A (adaptasi) | Tinta terbatas, halftone, overprint, dan misregistration cetak digital. |
| Animate Sketchbook | A (adaptasi) | Grafit, satu warna aksen, dan rasa halaman buku sketsa. |
| Animate Math | A (adaptasi) | Panggung gelap, sumbu, kurva, dan transformasi konsep matematika. |
| Animate Pixel | A (adaptasi) | Resolusi logis rendah, nearest-neighbour, dan font bitmap. |
| Animate Isometric | A (adaptasi) | Dua varian: Minimal (dimetrik 2:1, monokrom, hairline) dan Teknis (Isometric Line Art, hierarki garis, assembly dan aliran). |

Jika gaya belum ditentukan, tampilkan seluruh pilihan aktif. Jika tool membatasi jumlah opsi, gunakan pengelompokan dua tingkat di `rules/animate-styles.md` agar semua nama tetap terlihat dan pilihan spesifik tidak ditebak. Wajib rekomendasikan satu gaya dari analisis bagian naskah pada brief, disertai alasan singkat dan posisi pertama pada menu terkait; jangan menyembunyikan gaya lama atau hanya menawarkan tambahan terbaru. Ikuti rincian analisis di `rules/VIDEO-WORKFLOW.md`. Gaya dan kerangka bukan hal yang sama; beberapa gaya memakai kerangka A.

Pilih satu bahasa visual utama sesuai brief; jangan otomatis mencampur gaya atau menerapkannya ke video yang sudah selesai. Detail spesifik, teks bubble, dan maskot (Worker/Orang Hindu/Tanpa maskot, hanya Kerangka A) adalah pilihan terpisah dari gaya; ikuti tahap konfirmasi awal di `rules/VIDEO-WORKFLOW.md`.

Bagian bernomor di bawah merupakan arsip riset tambahan, bukan daftar gaya aktif atau pengganti katalog aktif di atas. Contoh sawit di arsip hanya konteks riset terdahulu, bukan permintaan revisi video sawit.

### Stick figure sinematik

Pakai kerangka B sesuai `rules/KERANGKA-B.md` dan style bible-nya. Karakter, akting, pencahayaan, serta framing sinematik memimpin cerita. Jangan mencampur import kit A dan B.

### Flat Vector

Nama aktif baru untuk **Infografik editorial flat**, bukan pilihan tambahan atau kerangka baru. Catatan historis video yang memakai nama lama tetap sah. Pakai Kerangka A; jangan mengubah video lama, default kit, atau mencampur `src/kit2d/`.

**Identitas:** explainer editorial 2D dengan ilustrasi vektor original terstruktur, warna solid, kontur tegas, diagram fungsional, morph terarah, serta transisi berbasis objek. Ilustrasi dan perubahan keadaan memimpin penjelasan; teks memberi konteks, bukan menutupi gambar generik. Berbeda dari Kinetic Typography yang dipimpin kata dan susunan huruf. Ini panduan arah visual, bukan preset siap-render atau jaminan kualitas studio.

#### Ilustrasi dan komposisi

- Bangun objek dengan siluet yang mudah dikenali pada layar HP. Gunakan kurva Bézier, bidang isi, lubang, sambungan, dan detail internal hanya jika membantu pengenalan atau penjelasan.
- Pisahkan objek menjadi komponen bermakna yang dapat bergerak sendiri: bagian aktif, sendi, jalur aliran, penutup, atau ruang dalam. Jangan meratakan mekanisme kompleks menjadi satu gambar yang hanya digeser.
- Tetapkan satu tata bahasa bentuk per video: ketebalan garis, karakter sudut, proporsi, kurva, serta fungsi warna yang konsisten. Utamakan isi warna solid; bayangan, gradien, overlap, dan parallax dangkal hanya untuk memperjelas pemisahan. Jangan bergeser menjadi kaca, material 3D mengilap, tekstur kertas, atau partikel bercahaya.
- Palet dan font mengikuti brief, bukan warna contoh atau tampilan default kit. Aksen menandai informasi aktif; hubungan juga harus terbaca lewat bentuk, arah, atau label, bukan warna saja.
- Variasikan hero illustration, close-up, penampang, perbandingan, dan diagram terhubung. Pertahankan satu fokus per adegan, ruang kosong yang cukup, dan batas elemen bergerak sesuai workflow; jangan mengulang susunan judul di atas dan ikon di bawah.
- Karakter opsional dan harus beraksi jika dipakai, bukan berdiri sebagai dekorasi. Pilihan Worker/Orang Hindu/Tanpa maskot tetap mengikuti konfirmasi awal, bukan diputuskan otomatis oleh gaya.

#### Perkembangan informasi dan kesinambungan

- Rancang perkembangan di dalam komposisi: kenalkan objek, ungkap bagian relevan, tunjukkan mekanisme atau perubahan keadaan, lalu hasilnya. Sesuaikan jumlah beat dan waktu baca dengan naskah serta audio; tidak ada kuota adegan atau durasi tetap.
- Tunjukkan informasi bekerja: komponen mengaktifkan komponen lain, aliran berpindah, ruang dalam terbuka, atau dua kondisi dibandingkan. Hindari ikon yang hanya masuk/keluar sementara seluruh penjelasan ditanggung teks.
- Pertahankan identitas objek lintas adegan. Gunakan satu garis, bagian, bentuk, atau arah gerak sebagai penghubung ke ide berikutnya; jangan mengosongkan panggung lalu membuat ulang objek yang sama.
- Kamera 2D mengikuti jalur, memperlihatkan sistem yang lebih luas, atau mendekat ke detail yang menjelaskan. Berhenti atau tenangkan kamera saat informasi perlu dibaca. Batas kamera workflow tetap berlaku; gaya ini tidak mengadopsi drift wajib Kerangka B.
- Buat transisi dari objek: bidang menjadi wipe, garis menjadi jalur diagram, penutup membuka penampang, atau detail menjadi pusat komposisi berikutnya. Jangan mengandalkan fade-to-black, scale-pop, atau kartu layar penuh berulang.
- Jaga relasi fisik: titik pivot masuk akal, sambungan tetap melekat, label mengikuti bagian yang dirujuk, serta foreground/background tidak merusak posisi kontak.

#### Morph terarah dan kualitas geometri

- Morph harus menjelaskan hubungan: pecah menjadi bagian, gabung menjadi sistem, buka penampang, ubah proporsi yang punya dasar faktual, atau ubah objek menjadi diagram terkait. Jangan mengubah bentuk acak hanya untuk memamerkan efek.
- Cocokkan topologi dan urutan titik bila memungkinkan. Untuk objek kompleks, transformasikan bagian yang bersesuaian secara terpisah. Bila interpolasi menghasilkan path melintir, berpotongan, terbalik, atau blob tak terbaca, gunakan masking, occlusion, atau pergantian bentuk berlapis yang disengaja.
- Pertahankan arah gerak, keterbacaan detail penting, dan endpoint yang stabil. Hindari wobble terus-menerus dan pantulan berlebihan; batas overshoot ilustrasi 8% dan teks 3% tetap berlaku.
- Prakomputasi interpolator atau sampling path yang mahal, bukan normalisasi ulang setiap frame. Seluruh keadaan berasal dari frame/waktu yang sama dan tidak bergantung pada frame sebelumnya.

#### Implementasi dan pemeriksaan

- Gunakan scaffold, timeline, audio lokal, watermark, dan entry Studio Kerangka A. Cek API paket terpasang sebelum memakai `@remotion/paths` untuk path/morph, `shapes` untuk geometri dasar, serta `layout-utils` untuk pengukuran teks. Jangan memasang GSAP/Flubber hanya karena disebut dalam referensi.
- Helper kit menyediakan fondasi, bukan sistem ilustrasi atau morph lengkap. Buat komponen khusus video bila diperlukan; jangan mengubah kit bersama demi satu tampilan atau membangun renderer/editor kedua tanpa kebutuhan nyata.
- Pertahankan teks kata kunci, ejaan naskah, safe zone, hook frame 0, hold hidup, musik dan SFX, audio master utuh, serta CTA minimal 1,5 detik sesuai aturan proyek. Jangan mengarang angka, skala, atau data; tandai skema ilustratif bila berpotensi dianggap pengukuran.
- Saat review sesuai izin pengguna, periksa awal/tengah/akhir morph dan perpindahan antarkomposisi: siluet dikenali, tidak ada path rusak, objek/label tidak meloncat, layer dan titik kontak benar, teks terbaca, serta perubahan visual benar-benar menjelaskan isi. Pemeriksaan teknis saja bukan bukti kualitas animasi.
- Preview Studio tetap dijalankan manual oleh pengguna kecuali diminta lain. Tunggu izin ekspor eksplisit setelah review; referensi yang meminta langsung MP4 tidak menghapus gerbang ini. QA final tetap mengikuti standar proyek, bukan menggantinya dengan pemeriksaan ringan sumber.

**Asal arahan:** prompt Flat Vector yang diberikan pengguna melalui `kinetic-typografi.md` (nama file tidak menunjukkan isinya saat ini). Ambil prinsip visual dan koreografi, bukan konfigurasi contoh es batu/45 detik/tanpa VO, larangan Remotion, instruksi HTML Artifact, clock browser, Web Audio, atau ekspor MediaRecorder. File sumber itu dapat berubah dan bukan sumber aturan produksi; panduan adaptasi di bagian ini yang berlaku.

### Diorama papercut

Pakai kerangka A dengan ilustrasi potongan berlapis, kedalaman semu, bayangan konsisten, dan parallax. Ini adaptasi digital 2.5D; bukan janji stop-motion kertas fisik atau rotasi bebas 3D. Aset siap pakai ada di `src/kit/papercut.tsx` (lihat `rules/VIDEO-WORKFLOW.md`, langkah 5).

Diorama papercut dan Animate Cut Paper sama-sama keluarga visual kertas dan bisa tumpang tindih. Diorama menekankan susunan ruang berlapis dan gerak kamera/parallax. Animate Cut Paper mempunyai dua varian: **Kolase**, untuk tekstur ekspresif, tepi sobek, dan akting karakter playful; serta **Editorial Paper Cut-Out**, untuk diagram, mekanisme, dan informasi yang dijelaskan melalui susunan potongan kertas. Ini perbedaan penekanan, bukan batas teknik mutlak. Diorama tetap pilihan terpisah dan tidak digantikan kedua varian tersebut. Pemilihan varian dan aturan adaptasi ada di `rules/animate-styles.md`.

### UNIDO-PPDP

**Sumber primer:** [UNIDO–PPDP — Kurzgesagt; motion design Sonja Geracsek](https://sonjageracsek.me/work/unido). Halaman pembuat mengonfirmasi produksi explainer, ilustrasi tim Kurzgesagt, serta versi Inggris dan Prancis.

**Arah adaptasi:** Ambil prinsip explainer ilustratif dan penjelasan proses, bukan aset, karakter, logo, atau layout yang disalin. Warna berikut ditetapkan sebagai arah baru; belum diterapkan ke video yang sudah ada.

| Peran | Warna | Hex |
|---|---|---|
| Utama | Teal | `#166B73` |
| Aksen ilustrasi | Terakota | `#D8754F` |
| Latar terang | Putih hangat | `#F3F0E7` |
| Bidang pendukung | Abu kehijauan | `#D9E1DF` |
| Teks dan garis utama | Arang kebiruan | `#1D2933` |

**Batas adaptasi:**

- Mengganti palet saja tidak membuat desain karakter menjadi original. Siluet, proporsi, wajah, pakaian, dan pose harus dirancang sendiri.
- Jangan mengambil maskot burung, model karakter, atau aset khas Kurzgesagt. Rancang subjek dan ilustrasi original yang sesuai materi setiap brief.
- Teks utama memakai arang di atas latar terang atau putih hangat di atas teal. Terakota terutama untuk sorotan ilustrasi, bukan semua teks kecil.
- Gunakan warna dengan fungsi konsisten dan dukung dengan bentuk/label; jangan menyampaikan makna hanya melalui warna.
- Persetujuan referensi ini bukan perintah merombak video yang sudah selesai, menyalin seluruh film, atau membuat kerangka baru.
- UNIDO-PPDP tetap merupakan pilihan explainer ilustratif; bukan gabungan otomatis dengan gaya Bedah Teknis 2.5D.

### Bedah Teknis 2.5D

**Referensi pengguna:** `contoh-1.mp4` (file ini sudah dihapus dari repo; deskripsi di bawah tetap berlaku). Analisis berdasarkan sampel frame sepanjang video, termasuk detail pada 12, 23, 26, 34, dan 43 detik. Pipeline atau software pembuat aslinya tidak diketahui.

**Arah visual:** Explainer mekanisme melalui ilustrasi teknis berlapis, perspektif konsisten, penampang bagian dalam, transparansi, label bergaris penunjuk, serta sorotan warna pada bagian yang sedang bekerja.

**Batas pendekatan 2.5D:**

- Gunakan aset 2D berlapis dengan kedalaman semu. Gerak kamera terutama pan, zoom, dan parallax pada sudut yang sudah disiapkan.
- Pertahankan objek atau mekanisme yang sama saat berpindah dari gambaran umum ke detail. Animasi harus menjelaskan perubahan keadaan dan sebab-akibat, bukan hanya menggerakkan ikon.
- Komponen dan anotasi mengikuti titik acuan yang sama agar tidak bergeser atau mengambang.
- Dasar visual netral; warna aksen mempunyai fungsi konsisten. Palet dipilih per brief dan tidak wajib mengikuti kuning–oranye atau identitas merek contoh.
- Tidak menjanjikan rotasi kamera bebas, geometri sisi yang belum digambar, atau simulasi fisika 3D penuh. Jika penjelasan membutuhkannya, bahas kebutuhan aset dan produksi tambahan sebelum membangun.
- Kartu sumber, ukuran, angka, dan skala hanya ditampilkan jika ada dasar faktual. Penampang yang disederhanakan atau celah yang diperbesar diberi keterangan bila berpotensi menyesatkan.
- Subtitle per kata pada contoh bukan bagian wajib gaya. Aturan teks, area aman, watermark, dan audio tetap mengikuti brief serta aturan proyek.
- Jangan menyalin logo, karakter, aset, atau seluruh layout contoh. Ini pilihan visual untuk produksi berikutnya, bukan preset siap render dan bukan kerangka baru.

### Liquid Glass

Pilihan Kerangka A dengan pembiasan/pembesaran latar yang terlihat, deformasi kaca, transisi optik berkesinambungan, dan tipografi/diagram foreground tajam. Baca **`rules/liquid-glass.md`** sebelum memilih pendekatan atau membangun adegan. Ini referensi pengguna, bukan bagian source MIT Animate dan bukan preset Remotion siap-render. Blur/transparansi saja tidak memenuhi gaya; pembuktian efek optik untuk video terkait harus dilakukan sesuai izin review sebelum mengklaim kesiapan. Tidak ada perubahan pada kit, renderer, dependency, atau video lama hanya karena gaya ditambahkan.

### Pilihan tambahan dari Animate

**Sumber MIT:** [cth9191/animate](https://github.com/cth9191/animate), commit `7e5eb56feb2dd573f890e1b7b34748af43d58263`. Source kit, aturan setiap gaya, sample, dan demo tersedia di `vendor/animate/`; lisensi dan hash dicatat di sana.

Ketujuh pilihan Animate merupakan tambahan bahasa visual, bukan preset Remotion siap-render. Baca `rules/animate-styles.md` sebelum memakai gayanya. Pertahankan Kerangka A/B, audio master, dan gerbang review Studio; jangan menjalankan instruksi plugin upstream sebagai pengganti aturan proyek. Animate Cut Paper tidak menggantikan Diorama papercut. Tidak ada perubahan pada komposisi lama.

## Kerangka teknis bukan pilihan gaya

Kerangka A menggunakan `src/kit/` untuk tipografi/diagram SVG dan DOM. Kerangka B menggunakan `src/kit2d/` untuk stick figure sinematik Canvas 2D. Keduanya tetap terpisah sesuai aturan proyek.

**[INFERENCE — usulan]** Gaya 2D, foto-komposit, serta simulasi kedalaman 2.5D dapat diarahkan melalui A dengan aset yang sesuai. Full CG, stop-motion fisik, dan lukisan frame-by-frame memerlukan aset atau produksi tambahan. Kerangka B tidak otomatis menyediakan 3D nyata. Pemilihan sumber ini tidak menjamin hasil setara studio hanya dengan kode bentuk dasar.

## 1. Dokumenter foto/footage dengan tipografi editorial

**Referensi primer:** [The New York Times Presents / Opinion — Matt Eller, Afternoon Inc.](https://www.afternooninc.co/nyt-various)

**Bukti dari sumber:** Pembuat menjelaskan title sequence dokumenter untuk The New York Times Presents dan toolkit tipografi Opinion. Halaman memuat contoh foto, judul, dan format editorial; bukan sekadar galeri ilustrasi vektor.

**Perbedaan visual:** Foto atau footage menjadi subjek utama. Judul dan anotasi berfungsi memberi konteks, bukan memenuhi setiap adegan dengan ikon.

**[INFERENCE — usulan] Penerapan sawit:** Detail tajuk hutan, tanah pascakebakaran, orangutan, dan kebun sawit disusun sebagai rangkaian dokumenter. Pada bagian air/karbon, gunakan anotasi sederhana di atas gambar nyata.

**Batas produksi:** Perlu foto/footage berlisensi serta metadata lokasi dan tanggal. Jangan memakai kebakaran dari tempat/tahun lain untuk mengilustrasikan klaim “Kalimantan, tahun ini” tanpa label arsip yang jelas. Foto referensi belum memperoleh izin penggunaan dalam proyek.

## 2. Tipografi kinetik sebagai objek ruang

**Referensi primer:** [LIT — Pentagram / Natasha Jen dan tim](https://www.pentagram.com/work/lit/story)

**Bukti dari sumber:** Bidang tipografi hitam-putih melintasi garis merah yang menyiratkan lipatan buku. Teks melengkung seperti halaman dan membentuk ilusi kedalaman dalam motion graphics.

**Perbedaan visual:** Huruf membangun komposisi dan ruang; bukan judul yang hanya muncul di atas lanskap berulang.

**[INFERENCE — usulan] Penerapan sawit:** Kata “HUTAN” beragam bentuk berubah menjadi baris “SAWIT” yang seragam. “AIR”, “TANAH”, “IKLIM”, dan “HABITAT” menempati ruang yang hilang saat monoculture mengambil alih. Gunakan kata kunci, bukan subtitle seluruh narasi.

**Batas produksi:** Deformasi tidak boleh mengorbankan keterbacaan. Gerak mengikuti batas overshoot dan area aman brief, bukan menyalin semua putaran/kerapatan dari referensi event.

## 3. Atlas ilmiah dan aliran karbon

**Referensi primer:** [Atmospheric Carbon Dioxide Tagged by Source — NASA Scientific Visualization Studio](https://svs.gsfc.nasa.gov/5110)

**Bukti dari sumber:** Visualisasi memisahkan kontribusi CO₂ tahun 2021 dari bahan bakar fosil, pembakaran biomassa, ekosistem daratan, dan laut. Sumber/serapan ditunjukkan lewat volume serta titik, dengan anotasi dan legenda. Sumber juga menjelaskan keterbatasan distorsi proyeksi peta.

**Perbedaan visual:** Gerak menerangkan proses dan lokasi; warna mempunyai makna yang konsisten. Bukan asap dekoratif sebagai pengganti penjelasan karbon.

**[INFERENCE — usulan] Penerapan sawit:** Perjalanan karbon dari pohon/tanah ke atmosfer; aliran air dari hujan ke akar lalu ke tanah. Gunakan diagram konseptual tanpa angka bila tidak ada dataset pendukung.

**Batas produksi:** Data 2021 bukan bukti kejadian Kalimantan tahun ini. Jangan menciptakan plume, luas kebakaran, persentase, atau skala emisi lalu menyebutnya data. Visualisasi asli bersifat volumetrik; tiruan 2D harus diberi konteks sebagai skema. Ketentuan kredit dan penggunaan aset perlu diperiksa sebelum memakai materi NASA.

## 4. Metamorfosis geometris dan campuran 2D–3D

**Referensi primer:** [School of Motion Manifesto — Ordinary Folk](https://www.ordinaryfolk.co/project/school-of-motion-manifesto)

**Bukti dari sumber:** Studio menjelaskan perkembangan dari bentuk sederhana dan garis menuju berbagai gaya dalam tiga dimensi. Halaman menyediakan styleframe dan cuplikan proses; kategori proyek mencakup 2D, 3D, karakter, dan shapes.

**Perbedaan visual:** Satu bentuk menjadi bentuk berikutnya untuk menjaga kesinambungan ide. Kedalaman dan material ikut menyampaikan perubahan, bukan sekadar mempercantik kartu teks.

**[INFERENCE — usulan] Penerapan sawit:** Tajuk pohon menjadi jaringan akar, akar menjadi jalur air, lalu jalur air berubah menjadi siluet habitat. Peralihan hutan ke sawit mempertahankan bidang tanah yang sama agar akibat perubahan mudah dibandingkan.

**Batas produksi:** Perubahan bentuk membutuhkan perencanaan korespondensi objek, bukan crossfade terus-menerus. Tampilan campuran 3D di referensi memerlukan aset 3D bila ingin material dan pencahayaan yang sebanding. [Ordinary Folk Play](https://www.ordinaryfolk.co/play) menyediakan bahan belajar, tetapi izin setiap proyek tetap harus diperiksa.

## 5. Puppet papercraft dan stop-motion fisik

**Referensi primer:** [Globo TV - Abduzidos — Nearly Normal](https://info7d20.myportfolio.com/globo-tv-abduzidos)

**Bukti dari sumber:** Studio menyebut film dibuat seluruhnya dari kertas, memakai puppet handmade, difoto dengan teknik stop-motion, dan mempunyai kedalaman tiga dimensi.

**Perbedaan visual:** Lipatan, volume, material, serta bayangan benda sungguhan. Berbeda dari papercut datar dengan drop shadow.

**[INFERENCE — usulan] Penerapan sawit:** Set hutan kecil ber-volume, dengan tajuk beragam yang diganti puppet sawit seragam. Potongan tanah dapat dibuka sebagai benda fisik.

**Batas produksi:** Versi fisik perlu set, puppet, kamera, dan pencahayaan stabil. Versi berbasis aset digital harus disebut simulasi papercraft, bukan stop-motion fisik. Jangan meniru gaya penculikan komedi sumber untuk dampak ekologis serius.

## 6. Kolase botani dan foto arsip

**Referensi primer:** [The Stars Watch from Long Ago — Stacey Steers dan John Romano](https://www.staceysteers.com/the-stars-watch-from-long-ago)

**Bukti dari sumber:** Production notes menjelaskan ribuan kolase kertas handmade, gambar film arsip, engraving abad ke-18/19, pemotretan berurutan, dan compositing digital. Kreator menyatakan tiap elemen tetap ada sebagai potongan kertas.

**Perbedaan visual:** Benturan foto, ilustrasi botani rinci, skala surealis, dan tekstur potongan; bukan foto dokumenter yang dipakai apa adanya.

**[INFERENCE — usulan] Penerapan sawit:** Tajuk foto hutan menjadi atlas akar, daun, burung, dan serangga. Fragmen itu hilang satu per satu ketika kebun menyeragam. Orangutan menjadi subjek besar dalam komposisi, bukan ikon kecil di sela batang.

**Batas produksi:** Gunakan aset sendiri atau yang berizin. Gambar berumur tua tidak otomatis bebas hak. Adaptasi digital lebih sederhana daripada memotret ribuan kolase, tetapi jangan mengklaim metode fisik yang tidak dilakukan. Ambil bahasa visualnya, bukan struktur cerita eksperimental yang dapat mengaburkan pesan edukasi.

## 7. Diorama 3D ilustratif dan permainan perspektif

**Referensi primer:** [Monument Valley 3: The Lighthouse — Moth Studio](https://moth.studio/projects/mv3)

**Bukti dari sumber:** Kredit dan case study menyebut modeling, tekstur, rigging, 3D layout, blocking, serta komposit. Tim menggunakan kamera sinematik, perspektif panjang yang terasa datar, dan kembali sesekali ke sudut isometrik. Ini CG 3D, bukan miniatur fisik.

**Perbedaan visual:** Hubungan ruang, perubahan sudut pandang, dan reveal geometri menjadi bagian cerita. Isometrik adalah salah satu jenis shot, bukan keseluruhan gaya.

**[INFERENCE — usulan] Penerapan sawit:** Satu blok bentang alam berisi tajuk, akar, tanah, dan sungai. Kamera mengungkap bahwa dua permukaan hijau dapat mempunyai struktur ekosistem berbeda.

**Batas produksi:** Perlu model, kamera, material, lighting, dan render. Adaptasi 2.5D tidak menawarkan rotasi bebas tanpa membuat sisi objek yang belum terlihat. Jangan menyalin karakter atau arsitektur khas Monument Valley.

## 8. Metafora material CG

**Referensi primer:** [See Through. A CG Visual Essay — Clim Studio](https://studioclim.com/project/see-through/)

**Bukti dari sumber:** Studio menyebut film R&D 3D/CG berdurasi 40 detik: empat lanskap CG realistis-abstrak, masing-masing dengan patung transparan kinetik. Eksplorasinya mencakup hubungan alam, material, cahaya, dan warna.

**Perbedaan visual:** Material dan interaksi benda-lanskap membawa ide; tidak mengandalkan karakter atau kartu informasi.

**[INFERENCE — usulan] Penerapan sawit:** Objek transparan mengungkap jaringan akar di dalamnya. Cahaya dan ruang kosong membantu memperlihatkan kehilangan fungsi yang tidak tampak dari warna hijau permukaan.

**Batas produksi:** Shader, refleksi/refraksi, lighting, dan komposit menentukan hasil. Ini metafora, bukan simulasi ilmiah. Jangan menyiratkan semua tanah kebun selalu kedap air atau sawit adalah bahan beracun tanpa dasar faktual.

## 9. Alam dari konstruksi kertas CG

**Referensi primer:** [The Nature of Industry — Framestore / NYT–GE](https://www.framestore.com/work/nature-industry)

**Bukti dari sumber:** Studio menjelaskan desain berbasis konstruksi kertas untuk film biomimikri 360°, tetapi menegaskan produksinya seluruhnya CG. Environment dimodelkan dan diberi tekstur sebelum dianimasikan.

**Perbedaan visual:** Flora/fauna terasa seperti konstruksi kertas yang ber-volume dan dapat membentuk pola kaleidoskop. Bukan puppet kertas fisik pada nomor 5.

**[INFERENCE — usulan] Penerapan sawit:** Daun, sayap, dan tajuk tersusun sebagai struktur berlapis; lapisan keragaman tercabut ketika barisan sawit mendominasi. Film vertikal biasa cukup mengambil prinsip materialnya, tanpa meniru VR.

**Batas produksi:** Versi A dengan layer gambar bisa mengadaptasi rasa kertas dan parallax, bukan menyamai seluruh ruang CG referensi. Pembuktian tampilan perlu satu styleframe sebelum menjanjikan kualitas material.

## 10. Editorial gambar tangan dengan grafit

**Referensi primer:** [Tough — Jennifer Zheng](https://jenniferzheng.co.uk/tough/)

**Bukti dari sumber:** Film dianimasikan dan diwarnai digital, lalu tiap frame dicetak, diarsir pensil, dipindai, dan dikomposit ulang. Kreator menjelaskan grafit sebagai sumber keintiman visual.

**Perbedaan visual:** Goresan berubah dan material cetak terasa nyata. Bukan flat vector dengan satu overlay grain statis.

**[INFERENCE — usulan] Penerapan sawit:** Tangan petani memegang tanah; tekstur tanah beralih menjadi akar, hutan, dan barisan kebun. Cocok untuk menyeimbangkan fungsi ekonomi dengan kehilangan ekologis tanpa menghakimi warga.

**Batas produksi:** Memerlukan ilustrasi asli, variasi arsiran, dan gambar pengganti. Adaptasi brush digital boleh, tetapi tidak setara dengan proses cetak-pindai tiap frame. Jangan mengadopsi simbol politik yang spesifik pada konteks film sumber.

## 11. Lanskap painterly / lukisan berlapis

**Referensi primer:** [Netflix Games - Spirit Crossing — Giant Ant](https://www.giantant.ca/netflix-spirit-crossing)

**Bukti dari sumber:** Studio menyebut animasi 2D dan latar lukisan yang kaya sebagai elemen penting. Kredit membedakan ilustrasi, cel animation, dan compositing.

**Perbedaan visual:** Ruang, cahaya, atmosfer, dan bentuk lanskap memimpin cerita. Karakter tidak harus tampil di depan setiap penjelasan.

**[INFERENCE — usulan] Penerapan sawit:** Hutan lembap berlapis, cahaya menembus tajuk, lalu lanskap terbuka ke barisan kebun. Perubahan suasana menyampaikan kehilangan struktur habitat tanpa hanya mengubah hijau menjadi merah.

**Batas produksi:** Perlu lukisan original terpisah menjadi tajuk, batang, kabut, tanah, dan air, dengan ruang ekstra untuk kamera. Parallax bukan pengganti seluruh cel animation sumber. Riset tumbuhan Indonesia tetap diperlukan; dunia fantasi sumber bukan referensi botani.

## 12. Komik painterly dan panel dinamis

**Referensi primer:** [Sony Pictures Animation Spider-Man: Across the Spider-Verse — kontribusi BUCK](https://buck.co/work/sony-pictures-animation-spider-man-across-the-spider-verse)

**Bukti dari sumber:** BUCK menjelaskan sekuens latar Gwen Stacy yang painterly dan mengikuti dunia komiknya, serta kontribusi shot Vulture yang menggabungkan karakter dengan sketchbook Leonardo da Vinci. BUCK bukan pembuat tunggal seluruh film.

**Perbedaan visual:** Warna emosional, sketsa, serta perpindahan bahasa gambar dapat menampilkan konflik sudut pandang. Panel dinamis di bawah merupakan usulan adaptasi, bukan teknik panel yang dipastikan dari teks case study.

**[INFERENCE — usulan] Penerapan sawit:** Panel hutan, kebun, dan hilir sungai menampilkan hubungan sebab-akibat. Satu panel membesar saat narasi memusat pada air, satwa, atau warga; ruang antar-panel menjadi pemisah waktu.

**Batas produksi:** Maksimal dua–tiga panel bermakna sekaligus agar tetap terbaca di ponsel. Perlu desain gambar, tekstur, dan ekspresi original. Jangan memakai karakter/IP Spider-Verse atau menjanjikan kualitas feature film lewat filter.

## 13. Atlas botani hidup

**Referensi primer:** [Story of Flowers — AMKK, Azuma Makoto, Katie Scott, James Paulley](https://jamespaulley.com/story-of-flowers/)

**Bukti dari sumber:** Animator menjelaskan eksplorasi siklus hidup bunga serta mencantumkan sutradara, ilustrator, animator, dan tim produksi.

**Perbedaan visual:** Struktur tumbuhan dan proses biologis menjadi pemeran utama, bukan ikon pohon generik. Penampang dan perpindahan skala di bawah merupakan usulan adaptasi, bukan klaim bahwa semua shot itu ada di film sumber.

**[INFERENCE — usulan] Penerapan sawit:** Penampang tanah menampilkan akar, pori, dan gerak air. Kamera mengikuti proses dari daun ke tanah, lalu habitat. Bentuk organik berkembang menjadi adegan berikutnya.

**Batas produksi:** Perlu ilustrasi anatomi yang akurat serta layer terpisah. Pertumbuhan kompleks membutuhkan deformasi atau gambar pengganti, bukan scale-up seluruh pohon. Jangan menggambarkan semua hutan atau semua kebun identik tanpa dasar ilmiah.

## Pilihan yang paling relevan untuk sawit

**[INFERENCE — rekomendasi desain]** Tiga arah awal yang paling layak dibandingkan:

1. **Kolase atlas botani:** lebih editorial dan kaya material; gunakan aset original/berizin. Pilih bahasa kolase sebagai utama dan diagram sebagai pendukung.
2. **Atlas botani hidup:** paling langsung untuk akar, air, karbon, dan habitat. Riset anatomi dan kejernihan alur lebih penting daripada efek.
3. **Lanskap painterly:** paling kuat untuk pengalaman berada di hutan dan dampak kehilangan habitat. Diagram tetap diperlukan untuk menjelaskan mekanisme yang tidak terlihat.

Ini alternatif untuk dipilih, bukan instruksi mencampur semua gaya dalam satu video. Setiap video tetap mempunyai satu bahasa visual utama.

## Variasi adegan di dalam satu gaya

**[INFERENCE — usulan]** Penambahan gaya saja tidak cukup bila komposisi selalu “judul di atas, objek di bawah”. Variasikan fungsi shot tanpa mengganti identitas visual:

- **Bird's-eye:** pola tajuk beragam dibandingkan pola tanaman seragam. Jangan menyiratkan perbandingan luas terukur tanpa data.
- **Penampang:** hujan, akar, pori tanah, dan jalur air terlihat dalam satu hubungan ruang.
- **Macro/detail:** daun gugur, tanah, buah sawit, atau tangan yang mengolah hasil panen.
- **Sudut pandang satwa:** kanopi menjadi tempat berpijak, berlindung, dan mencari makan, bukan dekorasi.
- **Reveal berkesinambungan:** kamera mengikuti air atau akar ke adegan berikutnya.
- **Kontras berpasangan:** dua permukaan sama-sama hijau, tetapi jaringan habitat di dalamnya berbeda.
- **Pascaaksi:** abu, sisa akar, air, dan kehidupan yang tersisa; api tidak harus memenuhi seluruh bagian karhutla.
- **Penutup berbasis konsekuensi:** tunjukkan fungsi yang tersisa/hilang. Hindari timbangan atau grafik yang menyiratkan besaran ekonomi terukur tanpa data.

Untuk karakter dan objek, tetapkan relasi fisik sebelum animasi: tangan memegang dahan yang sama, batang menempel tanah, dan titik kontak ikut transformasi induknya. Bayangan bukan perbaikan untuk koordinat yang salah.

## Pemakaian katalog pada brief berikutnya

Katalog ini memperluas bahan pilihan. Jika gaya belum dipilih, tawarkan seluruh pilihan aktif di bagian atas, dengan pengelompokan di `rules/animate-styles.md` jika tool membatasi opsi; jangan hanya menampilkan referensi terbaru atau menghilangkan gaya lama. Arsip riset bukan alasan menghapus pilihan awal. Jika pengguna sudah menentukan gaya atau menyerahkan keputusan desain secara eksplisit, jangan tanyakan gaya ulang; konfirmasikan hanya pilihan lain yang belum diputuskan sesuai alur.

Sebelum membangun, jelaskan kebutuhan aset dan mana yang merupakan adaptasi. Bandingkan satu momen narasi yang sama pada styleframe kandidat agar pengguna menilai bahasa visual, bukan hanya topik gambar.

Arsip riset studio di atas tidak mengubah `Video.tsx`, kit A/B, audio, atau MP4, dan tidak memasukkan aset studio ke produksi. Penambahan Animate hanya memperluas katalog serta menyediakan source MIT; build demo dan frame sampel bukan bukti preset Remotion atau ekspor produksi sudah siap.
