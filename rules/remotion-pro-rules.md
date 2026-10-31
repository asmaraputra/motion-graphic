# Remotion Pro Rules

Panduan wajib untuk merencanakan, membuat, memperbaiki, atau mengembangkan video Remotion dan motion graphics dalam proyek ini saja. Baca seluruh panduan ini sebelum memulai pekerjaan pada setiap sesi baru di proyek ini, tanpa menunggu pengguna mengingatkan. Jangan memuatnya sebagai aturan global untuk proyek lain.

## Sumber dan cakupan

Diadaptasi menjadi aturan operasional dari **The Motion-Graphics Starter Kit**, Pouya Eti / Rangy AI, **Part 2: Pro Prompts (level up any graphic), halaman 3-4**.

Sumber: https://storage.googleapis.com/mailerlite-uploads-prod/11173854/ycHRm5eSj1eHuNo015KVe2AQQhmv7ZGT27EuopZv.pdf

Ini adalah baseline kualitas, bukan kewajiban menambahkan semua efek ke setiap video. Aturan yang bergantung pada isi, seperti klik, kemenangan, hitungan, gambar, dan audio, diterapkan hanya ketika relevan. Ikuti brief dan instruksi pengguna terbaru jika lebih spesifik; aturan sistem, keamanan, lisensi, dan akurasi konten tetap berlaku. Jangan mengubah video yang sudah selesai hanya karena panduan ini baru dipasang.

## Animation and motion

1. **Lifecycle lengkap.** Setiap elemen/kelompok visual bermakna masuk dari luar layar atau opacity 0, memiliki waktu hold, lalu keluar sepenuhnya sebelum sequence/clip berakhir. Tidak boleh muncul mendadak atau terpotong saat masih terlihat bergerak. Sisakan handle akhir yang cukup; latar dasar boleh berlanjut untuk menjaga kontinuitas.

2. **Gerak organik.** Hindari pergerakan linear yang kaku. Gunakan antisipasi kecil, overshoot secukupnya, lalu settle melalui spring atau kurva easing. Besar gerak mengikuti karakter konten; jangan menjadikan teks yang perlu dibaca memantul berlebihan. Semua gerakan Remotion harus deterministik berdasarkan frame dan fps, bukan timer atau CSS animation.

3. **Stagger.** Atur jeda beberapa frame antarjudul, teks pendamping, ilustrasi, dan aksen supaya mata dapat mengikuti urutan informasi. Jangan membuat semuanya masuk serentak. Pastikan penundaan masuk tidak memotong waktu hold atau membuat keluarnya melewati batas clip.

4. **Hold yang hidup.** Saat hold, gunakan salah satu gerak halus yang sesuai: float lembut, glow pulse rendah, atau shine sweep lambat. Gerakan tidak boleh mengganggu keterbacaan atau terasa seperti kedipan. Gerak hold juga harus selesai atau tidak terlihat sebelum elemen dilepas.

5. **Klik/tap yang terbaca.** Jika konten memang memperagakan klik atau tap, animasikan cursor/pointer masuk dan bergerak menuju target, menekan dengan ripple kecil atau feedback tekan, lalu keluar. Jangan menambahkan cursor pada video yang tidak mendemonstrasikan interaksi.

## Effects and style

6. **Efek bersih dan modern.** Utamakan cahaya geometris, expanding ring, thin light streak, glint, glow atau bloom yang terkendali. Hindari emoji dan partikel clip-art sebagai pengganti desain. Efek tidak boleh mengaburkan informasi atau mengubah makna budaya/agama.

7. **Satu aksen utama.** Pilih satu aksen animasi premium, misalnya cahaya yang mengikuti garis/border atau pergeseran gradien lambat. Hindari tumpukan aksen bersaing. Aksen wajib memiliki lifecycle masuk dan keluar yang tuntas.

8. **Payoff yang relevan.** Jika terdapat hasil, pemenang, keberhasilan, atau angka kunci, beri penekanan singkat melalui scale pop kecil, glow, sedikit partikel yang sesuai, atau suara. Jangan mengarang kemenangan atau mengubah video edukasi menjadi perayaan yang tidak relevan.

## Readability and layout

9. **Title-safe dan kontras.** Tempatkan teks penting sekitar 10% dari tepi. Pastikan terbaca di atas visual ramai menggunakan scrim, shadow tipis, atau backing shape jika dibutuhkan. Jangan mengandalkan warna saja untuk menjelaskan makna.

10. **Auto-fit tanpa kehilangan isi.** Ukur teks dengan font yang benar setelah selesai dimuat. Jika panjang, kecilkan font dan wrap secara bersih agar seluruh isi muat dalam batas lebar dan tinggi. Tangani kata panjang yang tidak memiliki spasi. Jangan menyembunyikan overflow dengan clipping mask, memotong isi, atau menggunakan ellipsis sebagai solusi diam-diam. Sesuaikan tracking ketika font mengecil. Ingatkan jika teks ekstrem menjadi terlalu kecil untuk dibaca.

11. **Hierarki jelas.** Tetapkan satu fokus utama yang kuat dalam setiap adegan. Teks pendamping lebih kecil dan kontrasnya lebih rendah, tetapi tetap terbaca. Tata letak, ilustrasi, dan tipografi harus melayani cerita, bukan meniru slide presentasi atau grid kartu secara otomatis.

## Sound design

12. **Audio sinkron dan nyata.** Jika brief memakai audio dan aset nyata yang tersedia/berlisensi memungkinkan, selaraskan whoosh lembut pada entrance, click/pop pada aksi, chime pada keberhasilan, dan swish pada exit. Trim leading silence agar attack tepat pada frame. Seimbangkan level tanpa clipping. Jangan merujuk file yang belum ada, mengarang lisensi, atau mengklaim audio telah didengar jika belum. Jika brief meminta silent atau suara belum tersedia, tetap buat video berfungsi tanpa audio dan laporkan batasannya.

13. **Typing/counting yang nyaman.** Untuk mengetik atau menghitung, gunakan satu suara lembut berkesinambungan sepanjang aksi, bukan efek keras yang diulang pada setiap karakter atau angka. Hentikan atau fade sebelum sequence berakhir.

## Reusable and on-brand

14. **Props dan schema.** Buat graphic baru yang dapat digunakan ulang berbasis data. Ekspos teks, warna, angka, dan gambar yang relevan sebagai props dengan schema serta defaultProps yang sesuai agar dapat diubah tanpa mengedit logika animasi. Jangan menambahkan properti atau panel untuk fitur yang tidak digunakan.

15. **Brand sekali, konsisten.** Definisikan warna aksen, keluarga/bobot font, dan radius yang relevan dalam satu sumber untuk brand/proyek itu. Terapkan konsisten pada graphic terkait, tetapi jangan mengubah brand atau pengaturan bersama sehingga composition lama berubah tanpa permintaan.

16. **Gambar nyata dan placeholder jujur.** Jika graphic memakai gambar, dukung aset nyata melalui prop. Saat prop belum diisi, tampilkan placeholder yang rapi dan jelas disengaja, bukan gambar acak yang diklaim sebagai aset pengguna. Pastikan tata letak tetap baik ketika gambar asli diberikan; jangan menutupi error aset yang seharusnya dilaporkan.

## Workflow and iteration

17. **Frame kunci sebelum full render.** Tampilkan frame representatif untuk keputusan tampilan sebelum merender seluruh clip. Jika pengguna mengizinkan render, still dapat dipakai. Jika pengguna meminta Studio-only atau ingin review sendiri, cukup buka/pause pada frame kunci di Studio dan jangan menjalankan render otomatis. Tidak ada ekspor final tanpa permintaan pengguna.

18. **Pilihan gaya sebelum polishing.** Untuk arahan visual baru yang belum ditentukan, tampilkan seluruh pilihan visual aktif di `rules/visual-references.md`, bukan ringkasan yang menghapus gaya lama atau hanya referensi terbaru. Gunakan pengelompokan di `rules/animate-styles.md` bila tool membatasi opsi. Wajib rekomendasikan satu gaya berdasarkan bagian naskah pada brief, beri alasan singkat, dan tempatkan sebagai pilihan pertama pada menu terkait; jangan menghapus pilihan lain. Ikuti prosedur analisis di `rules/VIDEO-WORKFLOW.md`. Ikuti konfirmasi awal di `rules/VIDEO-WORKFLOW.md` untuk pertanyaan detail spesifik, bubble, dan maskot yang terpisah (Worker/Orang Hindu/Tanpa maskot, hanya Kerangka A). Jangan mengulang pemilihan jika pengguna sudah memberi referensi, memilih gaya, atau secara eksplisit menyerahkan keputusan desain.

19. **Timing mengikuti isi.** Alokasikan sekitar satu detik per baris pendek sebagai titik awal, lalu sesuaikan dengan panjang kata, gerakan, dan audio. Pertahankan durasi keseluruhan yang diminta. Jangan mempercepat suara otomatis atau memotong kata untuk memaksa timeline. Hitung timing menggunakan fps, termasuk entrance, stagger, hold, dan exit.

## Export for editors

20. **Format sesuai tujuan.** Untuk overlay transparan, gunakan ProRes 4444 MOV dengan alpha, PNG intermediate frames dan pixel format alpha yang sesuai, misalnya yuva444p10le. PNG sequence adalah alternatif jika editor mendukungnya. Untuk adegan penuh, gunakan MP4 H.264 dengan CRF 18 sebagai baseline. MP4 H.264 tidak menyimpan alpha. Cek flag Remotion versi terpasang; PNG sequence memakai --sequence dan direktori output, bukan menganggap pola FFmpeg frame-%04d.png sebagai sintaks Remotion. Jangan mengklaim kompatibilitas universal semua editor.

## Preferensi pengguna dan batas pekerjaan

- Hasil akhir harus menarik dan dipikirkan secara visual. Arahan "simple/neutral" untuk starter bukan aturan estetika permanen untuk semua video. Jangan menerapkannya pada video baru kecuali diminta.
- Gunakan proyek Remotion yang sudah ada jika sesuai. Tambahkan composition baru tanpa menginisialisasi ulang atau merusak composition lama. Pertahankan naskah, fakta, durasi, dan rasio dari brief kecuali pengguna meminta perubahan.
- Pengguna menangani review visual sendiri bila menyatakannya. Jangan melakukan loop screenshot, full playback, atau render/review berulang tanpa permintaan. Verifikasi teknis tetap proporsional terhadap perubahan dan ikuti kewajiban lingkungan kerja; bedakan hasil teknis yang benar-benar diamati dari penilaian visual yang belum dilakukan.
- Terapkan butir yang relevan secara proaktif, tanpa meminta pengguna menempel ulang daftar ini. Jangan menambah SFX, cursor, perayaan, atau elemen lain yang bertentangan dengan isi/brief hanya untuk memenuhi checklist.
