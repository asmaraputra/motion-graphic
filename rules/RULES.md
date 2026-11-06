# Aturan proyek video ini

Berlaku untuk semua AI agent/asisten (Claude Code, Cursor, Copilot, Gemini, Codex, Kiro, omp, dan lainnya) yang bekerja di folder proyek ini. Tidak berlaku untuk proyek lain.

- Sebelum merencanakan, membuat, atau mengubah video/motion graphics, baca lengkap:
  1. `rules/remotion-pro-rules.md` (baseline kualitas, 20 aturan)
  2. `rules/VIDEO-WORKFLOW.md` (kerangka kerja tetap untuk video baru)
  3. `rules/YOUTUBE-SHORT.md` bila bahan yang diberikan adalah paket YouTube Short (`bahan/youtube-short/<judul>/` atau `bahan/projek1/<judul>/` berisi `SCENE_MANIFEST.md`, `assets/`, `audio/`)
  Lakukan otomatis pada setiap sesi baru. Baca ulang setelah reset/compaction bila isinya tidak lagi ada dalam konteks.
- Dua jenis pekerjaan yang berbeda dan tidak boleh dicampur:
  - **Motion graphic murni**: aset dibuat dari nol atau dari `src/kit/`; kerjanya menggambar, menganimasikan, menata tipografi.
  - **YouTube Short**: aset sudah disiapkan pengguna di folder paket; kerjanya mengedit, menyinkronkan ke audio, menulis subtitle Inggris, dan grading. Dilarang membuat ulang atau mengganti aset, dan dilarang menambah aset dari web/AI. Ikuti `rules/YOUTUBE-SHORT.md` dan skill alur kerja `youtube-short-assembly`. Untuk jenis ini ada enam skill pendukung yang harus dibaca pada langkah yang tepat: `remotion-best-practices` (sebelum menulis komponen), `short-form-video` (hook dan durasi scene), `caption-animation` (subtitle), `beat-sync-editing` + `photo-slideshow` (titik potong dan Ken Burns), `video-delivery-specs` (QC dan handover). Jangan melewati salah satunya; kalau skill tidak muncul di daftar, baca langsung `~/.agents/skills/<nama>/SKILL.md`.
- Terapkan aturan yang relevan sebagai baseline, dengan tetap mengikuti brief dan instruksi pengguna terbaru. Jangan mengarang klik, kemenangan, aset gambar, atau audio yang tidak relevan/tersedia.
- Video baru: pilih kerangka dulu (`rules/VIDEO-WORKFLOW.md`, bagian "Pilih kerangka dulu"). Kerangka A: buat folder dengan `scripts/new-video.mjs`, pakai `src/kit/`. Kerangka B: ikuti `rules/KERANGKA-B.md`, pakai `src/kit2d/`. Kedua kerangka wajib terpisah; jangan membangun ulang kerangka kerja.
- Video baru: ikuti **Konfirmasi awal video baru** di `rules/VIDEO-WORKFLOW.md`. Jika gaya belum dipilih, tampilkan seluruh pilihan aktif dari `rules/visual-references.md`, bukan hanya referensi terbaru. Jika tool membatasi jumlah opsi, gunakan pengelompokan dua tingkat di `rules/animate-styles.md` tanpa menghilangkan gaya lama. Tanyakan juga detail spesifik, teks bubble, dan maskot (Worker/Orang Hindu/Blangkon 3D/Tanpa maskot, hanya Kerangka A) secara terpisah bila belum diputuskan; gabungkan pertanyaan yang masih terbuka dalam satu tool `ask` dan tunggu jawaban. Jangan tanyakan ulang keputusan yang sudah jelas atau didelegasikan secara eksplisit. Tampilan default kit bukan gaya wajib. **Pengecualian:** paket YouTube Short sudah menetapkan gaya dan asetnya di `SCENE_MANIFEST.md`: jangan ajukan pertanyaan gaya, detail, bubble, atau maskot untuk paket itu.
- Slug sudah ada saat memulai: lanjutkan sesi sebelumnya dari langkah yang belum selesai, jangan mulai ulang.
- Sebelum melapor selesai, jalankan `npm test` penuh; laporkan tes video lain yang gagal, jangan diam-diam diubah.
- Jangan menginisialisasi ulang proyek atau merusak composition/video lama.
- **DILARANG RENDER FINAL OTOMATIS.** Agent tidak boleh menjalankan render MP4 (`node scripts/render.mjs <slug> video`, `npx remotion render`, atau perintah ekspor lain) atas inisiatif sendiri, termasuk setelah semua tes lulus atau setelah still/contact sheet terlihat benar. Render final adalah pekerjaan pengguna.
- Alur wajib berakhir seperti ini: selesaikan kode, jalankan `npx tsc --noEmit`, `npx eslint src/videos/<slug>`, dan `npm test`; lalu konfirmasi ke pengguna bahwa video sudah selesai dan siap dirender, sertakan perintah render yang tepat untuk slug tersebut, dan berhenti di situ. Jangan render, jangan buka Studio, jangan polling.
- Pengecualian hanya satu: pengguna menulis izin eksplisit di percakapan ini, misalnya "render", "render sekarang", atau "silakan render final". Persetujuan gaya, konsep, sampel, still, atau "sudah kelihatan bagus" bukan izin ekspor. Bila ragu, jangan render.
- Kalau render sudah terlanjur berjalan: hentikan job-nya, laporkan file yang mungkin setengah jadi, dan serahkan render ke pengguna.
- Sebelum menulis utilitas dari nol (ukur teks, animasi path, bentuk, transisi, noise), cek bagian "Paket Remotion" di `rules/VIDEO-WORKFLOW.md`. Pasang paket dengan `npx remotion add`, jangan `npm i` satu paket, supaya semua paket `@remotion/*` tetap satu versi.

## Mencegah macet

Sesi `keluhan-ijin-sakit` (27-10-2026) habis sekitar 2 jam karena agent merancang `Video.tsx` di kepala: 7 giliran berturut-turut berakhir hanya dengan *thinking* (43-60 ribu karakter, sekitar 10 menit per giliran) tanpa menulis file. Aturan ini mencegah pola itu terulang.

- Setiap giliran wajib berakhir dengan perubahan nyata (tulis/edit file, jalankan perintah) atau laporan ke pengguna. Jangan mengakhiri giliran hanya dengan berpikir.
- Rencana cukup garis besar. Detail koordinat, warna, dan timing diputuskan saat menulis kode, bukan dirancang lengkap lebih dulu. Rencana adegan yang sudah disetujui pengguna dan `timeline.ts` adalah sumbernya; jangan menurunkan ulang.
- File besar (`Video.tsx`, lebih dari sekitar 150 baris) ditulis bertahap, maksimal sekitar 300 baris per tulis/edit. Urutan: palet + helper + karakter, lalu properti, lalu adegan + root. Setelah semua bagian ada, jalankan `npx tsc --noEmit` dan `npx eslint src/videos/<slug>`.
- Jika sadar sedang merancang ulang hal yang sama, atau berpikir lebih dari sekitar 3 menit tanpa menulis, berhenti dan tulis versi yang ada sekarang. Perbaiki setelah tes atau still menunjukkan masalah.
- Karakter atau adegan dengan banyak varian (lebih dari 4 ekspresi atau 5 pose, lebih dari 12 adegan): tawarkan versi ringkas ke pengguna sebelum membangun, bukan setelah macet.
- Catat waktu dengan `date` di awal setiap tahap. Kabari pengguna di setiap tahap yang selesai. Jika satu tahap lebih dari 20 menit tanpa file berubah, lapor ke pengguna sebelum melanjutkan.
- Pengguna menulis "stuck", "macet", atau "continue": aksi pertama di giliran itu adalah menulis bagian berikutnya ke file. Jangan merencanakan ulang dan jangan merangkum.
- Edit berbasis nomor baris: baca ulang rentang yang diedit tepat sebelumnya. Jika edit merusak sintaks, baca ulang lalu perbaiki rentang itu saja; tulis ulang seluruh file hanya jika file itu milik video yang sedang dikerjakan dan lebih pendek dari sekitar 200 baris.
- Konteks percakapan sudah sangat panjang (misalnya lebih dari 150 ribu token): sarankan sesi baru ke pengguna. Sesi baru melanjutkan dari kondisi file sesuai aturan lanjut slug di `rules/VIDEO-WORKFLOW.md`.
