# orang-hindu, maskot SVG Kerangka A

Maskot vektor yang diadaptasi dari gambar referensi pengguna `Balinese Udeng Character Pose Sheet.png`: kepala bulat besar, badan putih sederhana, outline hitam, dan udeng putih dengan panel hitam serta ornamen emas yang disederhanakan. Ini satu desain karakter, bukan representasi pakaian semua umat Hindu. Pose duduk, laptop, dan keseluruhan 30 pose referensi belum termasuk versi ini.

## Preview

```sh
npx remotion studio src/videos/maskot-orang-hindu/entry.tsx
```

Buka URL yang dicetak terminal, pilih `maskot-orang-hindu`, lalu putar atau geser timeline. Model sheet 15 detik, 1080x1920, 30 fps, tanpa audio:

- Detik 0-5: enam ekspresi.
- Detik 5-10: menyapa, menunjuk, berpikir, tangan di pinggang, gembira, berjalan.
- Detik 10-15: berjalan, transisi tangan, pegangan kiri, dan flip.

Tidak ada ekspor MP4 otomatis. Tampilan perlu persetujuan pengguna melalui Studio sebelum ekspor.

## Pemakaian ulang

Import `OrangHindu` dari `src/kit/orang-hindu.tsx`, lalu pasang di dalam elemen `<svg>`. Titik `(x,y)` adalah posisi telapak di lantai; tinggi karakter sekitar `450*s` unit SVG.

- `pose`: `neutral`, `wave`, `point`, `think`, `hip`, `happy`, `sad`, `angry`, `surprised`, `walk`.
- `mood`: `neutral`, `happy`, `sad`, `angry`, `surprised`, `thinking`. Jika diberikan, mengalahkan ekspresi bawaan pose.
- `armL` / `armR`: `idle`, `hip`, `hold`, `point`, `raise`, `wave`, `chin`, atau tuple sudut bahu/siku dalam derajat. Mengalahkan lengan bawaan pose.
- `mixArm(a,b,u)`: interpolasi pose tangan; beri easing dari timeline pada `u`.
- `walk`: fase langkah dalam siklus. `pose="walk"` menggerakkan langkah otomatis; nilai eksplisit `walk` mengalahkannya. Pergerakan `x` tetap diatur adegan.
- `dip`: squash 0..1 dengan titik lantai tetap.
- `look`: pasangan arah mata, masing-masing -1..1.
- `idleOffset`: offset waktu tetap untuk kedip/napas antarkarakter, jangan diturunkan dari posisi `x`.
- `holding`: artwork SVG lokal, origin di genggaman tangan.
- `holdingHand`: `left` atau `right`, default `right`.
- `flip`: membalik karakter, tetapi menjaga orientasi artwork pegangan agar tulisan tetap terbaca.
- `colors`: override sebagian `ORANG_HINDU_COLORS`. Pertahankan ciri desain udeng saat hanya mengganti palet.

Contoh penggunaan nyata tersedia di `Sheet.tsx`. Aset transparan: latar krem adalah milik model sheet, bukan karakter.

## Dependensi dan batas

Untuk memindahkan ke proyek lain, sertakan:

- `src/kit/orang-hindu.tsx`: gambar dan API publik.
- `src/kit/orang-hindu-motion.ts`: resolusi pose dan proporsi rig.
- `src/kit/worker-motion.ts`: matematika rig yang dipakai ulang tanpa mengubah Worker.
- `src/kit/motion.ts`: hook waktu Remotion.

React dan Remotion diperlukan. Tidak membutuhkan gambar eksternal, audio, jaringan, atau paket tambahan. Model sheet memakai Poppins lokal dari `brand.ts`; karakter sendiri tidak membutuhkan font. Hanya Kerangka A, jangan import ke video B atau `src/kit2d/`.

## Verifikasi

```sh
npm test
npx eslint src/kit/orang-hindu.tsx src/kit/orang-hindu-motion.ts src/videos/maskot-orang-hindu
npx tsc --noEmit -p src/videos/maskot-orang-hindu/tsconfig.verify.json
```

Typecheck seluruh proyek dilaporkan terpisah jika gagal pada dependensi atau video lain. Preview teknis tidak menggantikan persetujuan kemiripan oleh pengguna.
