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

- Kode kerangka, aturan proyek, katalog gaya aktif, source Animate terpin beserta lisensi, template, font kit, dan contoh di `src/compositions/kerja12/` ikut dilacak.
- **Video produksi tidak ikut Git.** `src/videos/<slug>/`, `public/videos/<slug>/`, dan `tests/<slug>-timeline.test.mjs` diabaikan, kecuali folder aset kerangka `contoh-2d`, `kit-papercut`, `maskot-worker`, `maskot-orang-hindu`, dan tes kit. Video baru dari `scripts/new-video.mjs` beserta narasi/musiknya tetap lokal di mesin ini; kalau perlu dipindah ke mesin lain, salin foldernya manual. Alasannya: ukuran (dua video saja sudah ~50 MB) dan tujuannya hanya berbagi kerangka.
- Folder `bahan/` berisi brief aktif (`bahan/brief.md` atau nama brief terkait), voiceover, dan bahan mentah lain. Folder ini tidak dilacak dan tidak diunggah, agar setiap folder proyek dapat mempertahankan bahan aktifnya. Aturan ignore `/brief.md` hanya menjaga kompatibilitas file lama di root, bukan lokasi input standar. Arsip brief bersama ada di `briefs/libur-sehari.md` dan `briefs/bumi-berputar-cepat.md`. Di clone baru, buat folder `bahan/` sendiri lalu salin brief atau voiceover ke sana. Voiceover mentah tetap di `bahan/`, dan salinan produksinya di `public/videos/<slug>/` juga tidak ikut Git.
- `node_modules/`, `build/`, `out/`, environment Python, cache, kredensial, dan `tools/` pada root tidak diunggah. `vendor/animate/tools/` tetap dilacak karena merupakan source library.
- Media kit di `public/kit/` dan `public/kit2d/` ikut Git biasa, bukan Git LFS. Media produksi tidak ikut, jadi tidak perlu LFS untuk proyek ini.
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

Gunakan Node.js minimal 22.18.0. Clone baru hanya berisi kerangka, jadi yang bisa langsung dijalankan adalah contoh kerangka:

```sh
npm run studio                                              # Kerangka A: kerja12
npx remotion studio src/videos/contoh-2d/entry.tsx          # Kerangka B
npx remotion studio src/videos/maskot-orang-hindu/entry.tsx # model sheet maskot
```

FFmpeg, whisper.cpp/model di `tools/`, dan environment Python audio tidak disediakan oleh Git atau `npm ci`. Siapkan sesuai `rules/VIDEO-WORKFLOW.md` bila ingin transkripsi, regenerasi audio, atau ekspor. Source Animate adalah bahan adaptasi, bukan preset Remotion siap-render. Preview pengguna dan izin ekspor tetap wajib sebelum render MP4.
