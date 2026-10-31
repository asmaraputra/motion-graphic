# Bumi berputar

Video baru Kerangka A, infografik editorial flat tanpa maskot. Input awal saat produksi adalah `brief.md` dan `bumi-berputar.mp3` di root proyek. Lokasi standar bahan mentah kini `bahan/` (lokal, disalin manual); catatan historis ini bukan instruksi mencari input di root. Narasi produksi tetap berada di `public/videos/bumi-berputar/narration.wav`. Detail ilustratif netral: bentuk atap, jendela, titik pengamat, dan permukaan Bumi skematis. Tidak ada nama, lokasi, statistik atau fakta teknis tambahan.

## Preview

Dari root proyek:

```sh
npx remotion studio src/videos/bumi-berputar/entry.tsx
```

Studio yang disiapkan sesi ini: http://localhost:3000/bumi-berputar
Pilih komposisi `bumi-berputar`, putar atau seek. Prop `showReview` menampilkan batas area aman dan timecode. Dengarkan keseimbangan narasi, musik, dan aksen. Ekspor MP4 belum dijalankan, menunggu review dan izin eksplisit pengguna.

## Struktur

- `timeline.ts`: satu sumber cue editorial, adegan, judul, SFX, durasi dan gain musik.
- `art.tsx`: palet dan ilustrasi lokal.
- `scenes.tsx`: sembilan bagian cerita, dunia dan arah pandang.
- `Video.tsx`: komposisi visual dan audio master lokal.
- `mix-audio.mjs`: mixer deterministik yang membaca timeline, bukan sumber timing kedua.

Transkripsi Whisper lokal: `out/videos/bumi-berputar/words.txt`. Timestamp bersifat perkiraan sekitar ±0,2 detik, bukan forced alignment. Ejaan layar mengikuti naskah.

## Audio

Narasi utuh: 3.892.608 sampel mono pada 44.100 Hz, 88,267755102 detik. Master stereo `public/videos/bumi-berputar/mix.wav` memiliki jumlah sampel dan sample rate sama. Tidak ada trim narasi, perubahan kecepatan, atau jeda baru. Pemeriksaan korelasi pada detik 4, 30, 64 dan 85 menemukan lag 0 sampel; ini verifikasi teknis, bukan review pendengaran.

Musik lo-fi sintetis lokal 72 BPM, fade in 2 detik dan fade out 3 detik. Sebelum mastering: narasi -21,04 LUFS, musik -17,64 LUFS. Gain musik 0,0758577575 menargetkan -19 dB relatif narasi. Ada 17 aksen SFX pelan dengan jarak antaronset minimal 2 detik; onset dipilih pada jeda -35 dBFS. Master terukur -14,02 LUFS dan -2,00 dBTP. Laporan: `out/videos/bumi-berputar/audio-report.json`. AAC final belum diukur karena belum diekspor.

Regenerasi setelah revisi timing:

```sh
node src/videos/bumi-berputar/mix-audio.mjs
```

## Pemeriksaan

- `npm test`: 44 tes lulus, termasuk tiga tes timeline dan dua tes regresi transisi recap video ini.
- `npx eslint src/videos/bumi-berputar`: pemeriksaan khusus video.
- Typecheck dengan opsi proyek dan root khusus video: 0 error.
- `npx tsc --noEmit` seluruh proyek saat sesi ini masih menemukan error pada `src/videos/produksi-plywood/`; tidak diubah karena di luar lingkup.
- Dua belas frame representatif diperiksa, lalu empat frame koreksi label/watermark diperiksa. Bukan penilaian seluruh gerak atau pendengaran manusia.

Studio memakai 2.649 frame pada 30 fps untuk mencakup seluruh narasi. Saat ekspor disetujui, perhatikan sisa durasi frame terakhir: video nominal 88,3 detik sedangkan audio 88,267755102 detik. Jika durasi kontainer harus persis sama, pendekkan presentation duration frame terakhir saat mux, jangan memotong atau mempercepat narasi.
