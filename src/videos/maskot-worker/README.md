# Worker, maskot Kerangka A

Adaptasi dan penyempurnaan Worker buatan pengguna dari proyek OMP `C:/Users/Lily-PC/Desktop/my-video`. Proyek sumber tidak diubah. Identitas, palet default, enam ekspresi dan tujuh pose asal dipertahankan.

## Cek di Studio, tanpa render

Dari root `C:/Users/Lily-PC/Desktop/my-video-hermes`:

```bash
npx remotion studio src/videos/maskot-worker/entry.tsx
```

Buka URL yang dicetak terminal, pilih `maskot-worker`, lalu tekan Play atau geser timeline. Model sheet berdurasi 12 detik, 1080x1920, 30 fps, tanpa audio:
- Detik 0-4: enam ekspresi.
- Detik 4-8: tujuh pose, berjalan, dan flip.
- Detik 8-12: berjalan, antisipasi dip, transisi mixArm, benda di tangan kiri/kanan, variasi warna dan flip.

Studio pemeriksaan sesi ini memakai `http://localhost:3002/maskot-worker`. Jika server sudah ditutup, jalankan perintah di atas dan gunakan URL baru yang dicetak, jangan mengasumsikan port tetap.

Tidak ada ekspor MP4 otomatis. Periksa Studio terlebih dahulu; render hanya setelah persetujuan ekspor yang eksplisit.

## File yang diperlukan

- `src/kit/worker.tsx`: komponen SVG Worker, ekspresi, palet dan pegangan.
- `src/kit/worker-motion.ts`: matematika rig murni, clamp, sendi, kedip dan gerak. Wajib ikut jika Worker dipindah ke proyek lain.
- `src/videos/maskot-worker/Sheet.tsx`: model sheet yang diperbarui.
- `src/videos/maskot-worker/entry.tsx`: komposisi preview terisolasi.

Dependensi yang sudah tersedia: `src/kit/motion.ts`, `src/kit/brand.ts`, font Poppins di `public/kit/fonts`, React dan Remotion proyek. Tidak ada dependency baru, aset audio, atau aset OMP lain yang perlu disalin.

## API dan kompatibilitas

Import `Worker`, `mixArm`, `ARM`, `WorkerMood`, dan `WorkerArm` tetap dari `src/kit/worker.tsx`. API lama tetap didukung.

- `mood`: neutral, happy, surprised, sad, worried, thinking.
- `armL` / `armR`: idle, hip, hold, point, raise, wave, chin, atau tuple sudut bahu/siku dalam derajat.
- `mixArm(a,b,u)`: interpolasi dengan u dibatasi 0..1. Terapkan easing dari timeline pada u jika dibutuhkan.
- `walk`: fase langkah dalam siklus, bukan kecepatan. Posisi x digerakkan terpisah oleh adegan.
- `dip`: 0..1, squash di titik telapak kaki. Tidak lagi menambahkan translasi ke bawah.
- `look`: arah mata masing-masing sumbu -1..1.
- `holding`: elemen SVG lokal dengan origin di titik genggaman.
- `holdingHand`: left atau right, default right agar penggunaan lama tetap sama.
- `flip`: membalik karakter. Orientasi tulisan pada benda dipertahankan agar tetap terbaca.
- `idleOffset`: offset waktu tetap per karakter untuk kedip dan napas. Jangan diturunkan dari x yang bergerak.
- `colors`: override palet seperti sebelumnya. Pertahankan bentuk dan identitas helm.

Worker hanya untuk Kerangka A. Jangan import ke `src/kit2d/` atau video B. Memilih maskot tidak mengubah video lama secara otomatis.

## Verifikasi

```bash
npm test
npx eslint src/kit/worker.tsx src/kit/worker-motion.ts src/videos/maskot-worker
npx tsc --noEmit -p src/videos/maskot-worker/tsconfig.verify.json
```

Typecheck global tetap harus dilaporkan terpisah jika gagal pada komposisi lain. Pemeriksaan DOM Studio menguji font, safe area label, kontak telapak, serta attachment tangan dan orientasi benda. Pemeriksaan tersebut bukan pengganti review estetika oleh pengguna.
