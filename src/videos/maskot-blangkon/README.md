# blangkon, maskot SVG 2D Kerangka A

Maskot vektor 2D dengan blangkon Jawa dan beskap hitam berornamen emas. Blangkon mengikuti referensi pengguna `bahan/download.jpg`: kain coklat yang dilipat membelit, pita depan lebar melengkung, lipatan segitiga di kanan, dan ujung kain tersembunyi di belakang telinga. Ini satu desain karakter, bukan representasi pakaian semua orang Jawa.

Ini karakter **2D (SVG)**, berbeda dari `BlangkonCharacter` 3D di `src/kit/stickman3d/`. Keduanya terpisah dan tidak boleh dicampur dalam satu adegan.

## Preview

```sh
npx remotion studio src/videos/maskot-blangkon/entry.tsx
```

Model sheet 15 detik, 1080x1920, 30 fps, tanpa audio:

- Detik 0-5: enam ekspresi.
- Detik 5-10: menyapa, sembah, menjelaskan, menunjuk, membungkuk, berjalan.
- Detik 10-15: berjalan, pegangan kiri, flip.

Blangkon saja (tanpa badan), untuk menilai bentuk kepala:

```sh
npx remotion studio src/videos/blangkon-headwear/entry.tsx
```


Tidak ada ekspor MP4 otomatis. Tampilan perlu persetujuan pengguna melalui Studio sebelum ekspor.

## Pemakaian ulang

Import `Blangkon` dari `src/kit/blangkon.tsx`, lalu pasang di dalam elemen `<svg>`. Titik `(x,y)` adalah posisi telapak di lantai; tinggi karakter sekitar `500*s` unit SVG.

- `pose`: `neutral`, `wave`, `point`, `think`, `hip`, `happy`, `sad`, `angry`, `surprised`, `walk`, `sembah`, `explain`, `bow`, `lift`, `alert`.
- `mood`: `neutral`, `happy`, `sad`, `angry`, `surprised`, `thinking`. Jika diberikan, mengalahkan ekspresi bawaan pose.
- `talk`: bukaan mulut 0..1. Bukaan turun dari garis bibir, jadi tidak pernah menutupi hidung.
- `speak`: jendela cue narasi `[[mulai, selesai], ...]` dalam detik; dipakai bila `talk` tidak diberikan.
- `armL` / `armR`: `idle`, `hip`, `hold`, `point`, `raise`, `wave`, `chin`, atau tuple sudut bahu/siku dalam derajat. Mengalahkan lengan bawaan pose.
- `mixArm(a,b,u)`: interpolasi pose tangan; beri easing dari timeline pada `u`.
- `walk`: fase langkah dalam siklus. `pose="walk"` menggerakkan langkah otomatis.
- `dip`: squash 0..1 dengan titik lantai tetap.
- `look`: pasangan arah mata, masing-masing -1..1.
- `idleOffset`: offset waktu tetap untuk kedip/napas antarkarakter, jangan diturunkan dari posisi `x`.
- `holding`: artwork SVG lokal, origin di genggaman tangan.
- `holdingHand`: `left` atau `right`, default `right`.
- `flip`: membalik karakter; artwork pegangan ikut dicerminkan.
- `colors`: override sebagian `BLANGKON_COLORS`. Pertahankan ciri blangkon saat hanya mengganti palet.

### Mulut dari narasi

```tsx
import {useSpeechDrive} from '../../kit/speech';

const drive = useSpeechDrive(staticFile('videos/<slug>/narration.wav'), {floor: 0.03, span: 0.65});
<Blangkon x={540} y={1400} s={1.7} pose="explain" talk={drive} />;
```

`useSpeechDrive` memetakan amplitudo jendela 80 ms ke 0..1. Default `floor`/`span` (0.1/0.3) cocok untuk narasi pelan; narasi yang direkam keras membuat mulut selalu menganga, jadi lebarkan ke `0.03/0.65`. Ini perkiraan, bukan viseme: konsonan bilabial tidak menutup mulut.

### Blangkon saja

`BlangkonHeadwear` diekspor terpisah dan punya dua lapis, supaya ujung kain benar-benar berada di belakang kepala:

```tsx
<BlangkonHeadwear layer="back" />
{/* kepala, telinga, wajah */}
<BlangkonHeadwear />
```

Koordinat: origin di tengah wajah, tengkorak `r=76`, sumbu Y negatif ke atas, tepi bawah kain di atas alis (`y ≈ -32`), lebar maksimal `x = ±102`.

## Dependensi dan batas

Untuk memindahkan ke proyek lain, sertakan:

- `src/kit/blangkon.tsx`: gambar dan API publik.
- `src/kit/blangkon-motion.ts`: resolusi pose dan proporsi rig.
- `src/kit/worker-motion.ts`: matematika rig yang dipakai ulang tanpa mengubah Worker.
- `src/kit/orang-hindu-motion.ts`: `talkFromCues` untuk mulut berbasis cue.
- `src/kit/motion.ts`: hook waktu Remotion.

Hanya Kerangka A, jangan import ke video B atau `src/kit2d/`. Karakter tidak membutuhkan gambar eksternal, font, audio, jaringan, atau paket tambahan.

## Verifikasi

```sh
npm test
npx eslint src/kit/blangkon.tsx src/kit/blangkon-motion.ts src/videos/maskot-blangkon
npx tsc --noEmit
```

Preview teknis tidak menggantikan persetujuan kemiripan oleh pengguna.
