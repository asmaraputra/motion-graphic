# Stickman Sinematik Hangat

Pilihan visual Kerangka A, terpisah dari **Stick figure sinematik** Kerangka B. Source lengkap skill upstream tersedia di `vendor/stickman/`, dipin pada commit `336608251fb16081b112e0742616baf46d0ca518`; daftar SHA-256 ada di `vendor/stickman/upstream.json`. Adaptasi Remotion 3D tersedia di `src/kit/stickman3d/`. Source upstream bukan skill global yang otomatis dipanggil.

## Identitas visual

- Karakter sederhana dengan kepala bulat, pakaian berwarna, ekspresi jelas, dan gerak akting. Set flat menggunakan cahaya hangat, bayangan, lapisan kedalaman, grain halus, dan kamera yang melayani cerita.
- Palet upstream memakai ungu, coral, amber, dan teal; sesuaikan dengan brief. Pertahankan identitas karakter, proporsi, posisi, dan arah layar antarshot.
- Aksi dibangun dalam satu ruang yang konsisten. Perhatikan pijakan kaki, jangkauan tangan, kontak dengan properti, dan urutan gerak yang masuk akal. Gunakan referensi `vendor/stickman/references/style-bible.md`, `engine.md`, dan `production.md`.
- Karakter upstream tidak otomatis menggantikan maskot proyek. Konfirmasi Worker, Orang Hindu, Blangkon 2D, Blangkon 3D, atau tanpa maskot tetap berlaku untuk Kerangka A. Terapkan desain karakter sesuai pilihan dan brief.

## Integrasi dan batas

- Gunakan scaffold, audio, timeline, watermark, area aman, dan review Kerangka A. Jangan mengimpor `src/kit2d/`, mengubah engine Kerangka B, atau menerapkan ulang gaya pada video lama.
- Engine 2D upstream memakai Canvas, variabel global, dan ukuran tetap 1920×1080; butuh adapter terisolasi per video. Gambar ulang komposisi sesuai rasio aktual, khususnya 1080×1920; jangan mengandalkan crop otomatis.
- Semua keadaan dan gerak diturunkan dari frame dan fps Remotion, deterministik, termasuk saat seek mundur. Uji pijakan, kontak properti, urutan layer, dan batas frame pada video terkait. Source upstream saja bukan bukti adaptasi telah bekerja.
- Kit 3D memakai Three.js dan `@remotion/three` dalam Kerangka A; ini bukan kemampuan Kerangka B. Contoh kafe disusun untuk 9:16, bukan template cerita yang otomatis cocok untuk brief lain. Finishing depth of field dan grain upstream tidak termasuk dalam port; tentukan finishing sesuai video.
- `scripts/doctor.py`, `new_film.py --3d`, dan `build.py` upstream dapat memasang dependency atau mengekspor video; jangan jalankan sebagai alur produksi proyek. Izin gaya bukan izin ekspor. Preview Studio dan render final mengikuti `rules/VIDEO-WORKFLOW.md` dan `rules/RULES.md`.
- Narasi master tetap utuh. Musik, SFX, teks, dan durasi mengikuti brief dan aturan proyek, bukan default upstream.

## Memakai kit 3D

Jalankan preview contoh secara manual:

```sh
npx remotion studio src/compositions/stickman3d-demo/entry.tsx
```

Pilih `Stickman3DDemo`. Contoh berdurasi sembilan detik dan tanpa audio; bukan video produksi atau izin ekspor. Dalam komposisi Kerangka A, impor `Stage3D` dari `src/kit/stickman3d/Stage3D` dan gunakan `<Stage3D />` untuk contoh. Untuk adegan sendiri, berikan factory stabil `<Stage3D createScene={createScene} />`.

Untuk video Kerangka A di `src/videos/<slug>/Video.tsx`, contoh berikut membuat adegan sendiri. Sesuaikan posisi, kamera, gerak, dan durasi dengan naskah; ini bukan pengganti narasi atau soundtrack:

```tsx
import {Color, Scene} from 'three';
import {Stage3D} from '../../kit/stickman3d/Stage3D';
import {HERO, Person, disposeObject, makeCafe, walk3} from '../../kit/stickman3d/scene.js';
import type {StickmanScene} from '../../kit/stickman3d/scene.js';

const createScene = (): StickmanScene => {
  const scene = new Scene();
  scene.background = new Color('#120a1c');
  const cafe = makeCafe(scene);
  const actor = new Person(scene, HERO);
  const walk = walk3({pts: [[-1, 0], [1, 0]], t0: 0, t1: 5});

  return {
    scene,
    update(seconds, camera) {
      cafe.rain(seconds);
      actor.pose({...walk.at(seconds), breath: seconds * 2});
      camera.position.set(0, 1.5, 5);
      camera.lookAt(0, 1, 0);
    },
    dispose() {
      disposeObject(scene);
    },
  };
};

export const Video = () => <Stage3D createScene={createScene} />;
```

Tambahkan audio, watermark, dan elemen lain pada komposisi video sesuai workflow. Factory harus didefinisikan di luar komponen atau dipertahankan stabil; factory baru pada setiap frame akan membuat ulang dan melepas scene.

Factory mengembalikan `{scene, update(seconds, camera), dispose()}`; tipenya `StickmanScene` dari `scene.js`. Buat geometri dan material sekali dalam factory, perbarui posisi, pose, properti dan kamera dari waktu absolut pada `update`, dan lepaskan resource yang dimiliki factory pada `dispose`. Adapter menetapkan rasio kamera berdasarkan ukuran komposisi dan mengonversi frame menjadi detik. Jangan membuat timer atau menyimpan progres antarframe.

`scene.js` mengekspor `Person`, `HERO`, `FRIEND`, `STRANGER`, `WOMAN`, `makeCafe`, `makeStreet`, `walk3`, `table3`, `chair3`, `cup3`, `blob`, dan `disposeObject`; tipe lengkap tersedia di file `.d.ts` terkait. `Person.pose` menerima posisi, sudut, kaki, tangan, dan ekspresi; lihat `scene.js` untuk contoh animasi. Resource tidak boleh dibagi antaradegan yang dilepas secara terpisah. Setiap video harus memiliki narasi, adegan, framing, dan pengujian sesuai brief-nya sendiri.

### Karakter blangkon 3D

`BlangkonCharacter` di `src/kit/stickman3d/blangkon-character.js` adalah karakter terpisah dari maskot `OrangHindu` 2D. Bentuk blangkon merujuk `bahan/blangkon-solo.jpg`; lipatan dan palet cokelat-emas disederhanakan mengikuti `bahan/download.jpg`. Busana mengikuti ilustrasi yang sama: atasan hitam berornamen emas dan kain cokelat, sebagai interpretasi visual, bukan klaim busana adat universal. File di `bahan/` bersifat lokal dan tidak ikut Git; model tidak bergantung pada file gambar saat render.

Buat karakter dengan `new BlangkonCharacter(scene)`, lalu panggil `pose()` seperti `Person`. Untuk berbicara, isi `face.talk` dari 0 sampai 1; bibir atas tetap dan bukaan bergerak ke bawah. Nilai ini adalah kontrol bukaan, bukan sinkronisasi fonem atau audio otomatis. Gunakan data suara nyata atau cue yang sesuai saat membuat video.

#### Pose tangan dan berjalan

Impor `gesturePose` dari `src/kit/stickman3d/blangkon-motion.js`. Panggil `actor.pose(gesturePose(basePose, gesture, seconds))`; `basePose` memakai posisi, arah, kaki, dan ekspresi seperti `BlangkonPose`. Pilih `idle`, `wave`, `point`, `explain`, `salam`, atau `walk`. Waktu `seconds` deterministik; transisi antarpose tetap harus diatur pada adegan.

Untuk berjalan, buat lintasan dengan `walk3(...)`, lalu gunakan `gesturePose(walk.at(seconds), 'walk', seconds)`. Langkah, target kaki, dan ayunan tangan berasal dari `walk3`; atur lintasan dan panjang langkah sesuai adegan. Kain panjang menutupi kaki di atas batas bawah kain; ini oklusi sederhana, bukan simulasi kain.

Pilihan gestur mengikuti konteks naskah; jangan menafsirkan salam tertentu sebagai kewajiban universal.

## Lisensi dan sumber

Kode dan dokumen upstream berlisensi MIT; pertahankan pemberitahuan hak cipta dan izin di `vendor/stickman/LICENSE` saat menyalin bagian substansial. SFX bawaan dikreditkan kepada Kenney dengan lisensi CC0 dalam `vendor/stickman/sfx/CREDITS.txt`; penggunaannya tetap mengikuti brief. Jangan mengklaim lisensi aset lain tanpa memeriksanya.
