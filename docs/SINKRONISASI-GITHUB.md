# Sinkronisasi proyek melalui GitHub

Repo: https://github.com/asmaraputra/motion-graphic

GitHub adalah titik pertukaran perubahan, bukan sinkronisasi folder otomatis. Kedua folder kerja memakai riwayat dan remote yang sama:

- `C:\Users\Lily-PC\Desktop\my-video-hermes`
- `C:\Users\Lily-PC\Desktop\my-video`

## Sebelum mulai bekerja

Dari folder proyek yang akan dipakai:

```sh
git status
git pull --ff-only
```

Jika ada perubahan lokal, simpan dengan commit terlebih dahulu atau koordinasikan dengan agent yang mengerjakannya. Jangan menjalankan reset hard, clean, force push, atau menimpa file untuk memaksa sinkron.

## Setelah perubahan siap

```sh
npm test
npm run lint
npm run build
git status
```

Periksa diff, pilih file yang memang ingin dikirim, lalu:

```sh
git add <file-atau-folder-yang-diubah>
git diff --cached
git commit -m "feat: jelaskan perubahan"
git push
```

Di folder proyek satunya, jalankan `git pull --ff-only` sebelum melanjutkan pekerjaan. Untuk dua agent, gunakan slug video berbeda dan koordinasikan perubahan kit, aturan, dependency, serta file konfigurasi bersama.

Jika `pull --ff-only` menolak karena kedua sisi punya commit baru, berhenti dan tinjau perbedaannya. Gabungkan atau rebase secara sadar; jangan memakai force push. Git tidak mencegah konflik ketika kedua folder mengubah file yang sama.

## File yang ikut dan tidak ikut

- Kode, aturan proyek, katalog 12 gaya, source Animate terpin beserta lisensi, template, tes, font, dan aset produksi di `public/` ikut dilacak.
- Folder `bahan/` berisi brief aktif (`bahan/brief.md` atau nama brief terkait), voiceover, dan bahan mentah lain. Folder ini tidak dilacak dan tidak diunggah, agar setiap folder proyek dapat mempertahankan bahan aktifnya. Aturan ignore `/brief.md` hanya menjaga kompatibilitas file lama di root, bukan lokasi input standar. Arsip brief bersama ada di `briefs/libur-sehari.md` dan `briefs/bumi-berputar-cepat.md`. Di clone baru, buat folder `bahan/` sendiri lalu salin brief atau voiceover ke sana. File voiceover yang dipakai video tetap ikut sebagai `public/videos/<slug>/narration.wav`.
- `node_modules/`, `build/`, `out/`, environment Python, cache, kredensial, dan `tools/` pada root tidak diunggah. `vendor/animate/tools/` tetap dilacak karena merupakan source library.
- Media produksi ikut Git biasa, bukan Git LFS. Hindari commit ulang file audio/video besar jika tidak berubah. File yang melebihi batas GitHub perlu strategi penyimpanan tersendiri sebelum diunggah.
- Repo ini publik. Jangan menaruh token, data pribadi yang tidak untuk publik, atau materi berlisensi terbatas dalam commit.

## Clone di komputer baru

```sh
git clone https://github.com/asmaraputra/motion-graphic.git
cd motion-graphic
npm ci
npm test
npm run lint
npm run build
```

Gunakan Node.js minimal 22.18.0. Untuk preview satu video:

```sh
npx remotion studio src/videos/bumi-berputar/entry.tsx
```

FFmpeg, whisper.cpp/model di `tools/`, dan environment Python audio tidak disediakan oleh Git atau `npm ci`. Siapkan sesuai `rules/VIDEO-WORKFLOW.md` bila ingin transkripsi, regenerasi audio, atau ekspor. Source Animate adalah bahan adaptasi, bukan preset Remotion siap-render. Preview pengguna dan izin ekspor tetap wajib sebelum render MP4.
