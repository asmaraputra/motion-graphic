import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync, mkdtempSync, cpSync, rmSync} from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';

const read = (file) => readFileSync(file, 'utf8');
const oldRows = [
  '| Stick figure sinematik | B | Karakter stick figure, set sinematik 2D, rim light, dan gerak kamera. |',
  '| Flat Vector | A | Ilustrasi vektor datar terstruktur, diagram, morph terarah, dan transisi berbasis objek yang menjelaskan narasi. |',
  '| Diorama papercut | A | Potongan ilustrasi berlapis, bayangan lembut, dan parallax dengan rasa kertas. |',
  '| UNIDO-PPDP | A | Explainer ilustratif dengan palet adaptasi dan karakter original. |',
  '| Bedah Teknis 2.5D | A | Penampang teknis berlapis, perspektif konsisten, anotasi, dan sorotan mekanisme. |',
];
const styles = ['cut-paper', 'crosshatch', 'riso', 'sketchbook', 'math', 'pixel', 'isometric'];
const labels = ['Animate Cut Paper', 'Animate Crosshatch', 'Animate Riso', 'Animate Sketchbook', 'Animate Math', 'Animate Pixel', 'Animate Isometric'];

test('style recommendation is required and grounded in the brief narration', () => {
  const workflow = read('rules/VIDEO-WORKFLOW.md');
  assert.ok(workflow.includes('Wajib merekomendasikan satu gaya'), 'recommendation must be required');
  assert.ok(workflow.includes('brief.md') && workflow.includes('bagian naskah'), 'read the actual narration before recommending');
  assert.ok(workflow.includes('alasan singkat') && workflow.includes('bukan pilihan otomatis'), 'explain suitability without choosing for the user');
  for (const file of ['rules/visual-references.md', 'rules/remotion-pro-rules.md', 'rules/VIDEO-WORKFLOW.md']) {
    assert.ok(!/[Bb]oleh merekomendasikan satu|boleh tandai rekomendasi/.test(read(file)), `${file}: stale optional recommendation`);
  }
  const guide = read('rules/animate-styles.md');
  assert.ok(guide.includes('keluarga yang memuat rekomendasi') && guide.includes('urutan pertama'), 'grouped menus must preserve the actual recommendation');
});

test('catalog retains the five original style choices with the approved Flat Vector rename', () => {
  const catalog = read('rules/visual-references.md');
  for (const row of oldRows) assert.ok(catalog.includes(row), row);
});

test('Flat Vector has one active name and an adapted production guide', () => {
  const catalog = read('rules/visual-references.md');
  const table = catalog.split('## Pilihan visual disetujui untuk video berikutnya')[1].split('Jika gaya belum ditentukan')[0];
  assert.equal(table.split('\n').filter((line) => line.startsWith('| Flat Vector |')).length, 1);
  assert.ok(!table.includes('| Infografik editorial flat |'));
  const guide = catalog.split('### Flat Vector\n')[1].split('### Diorama papercut')[0];
  for (const required of ['Kerangka A', 'komponen bermakna', 'Morph harus menjelaskan hubungan', 'topologi', 'masking', 'transisi', 'frame sebelumnya', 'Studio', 'izin ekspor eksplisit', 'bukan preset siap-render']) {
    assert.ok(guide.includes(required), required);
  }
  assert.ok(read('rules/animate-styles.md').includes('**Motion graphic A**: Flat Vector,'));
});

test('active catalog adds all seven Animate options without duplicates', () => {
  const table = read('rules/visual-references.md').split('## Pilihan visual disetujui untuk video berikutnya')[1].split('Jika gaya belum ditentukan')[0];
  const rows = table.split('\n').filter((line) => line.startsWith('| ') && !line.startsWith('| Pilihan visual'));
  assert.equal(rows.length, 13);
  for (const label of labels) assert.equal(rows.filter((line) => line.startsWith(`| ${label} |`)).length, 1, label);
});

test('Liquid Glass is one additional A style with an honest optical readiness boundary', () => {
  const catalog = read('rules/visual-references.md');
  const table = catalog.split('## Pilihan visual disetujui untuk video berikutnya')[1].split('Jika gaya belum ditentukan')[0];
  assert.equal(table.split('\n').filter((line) => line.startsWith('| Liquid Glass | A (adaptasi) |')).length, 1);
  const guide = read('rules/liquid-glass.md');
  for (const required of ['Kerangka A', 'bukan preset siap-render', 'pembiasan atau pembesaran latar yang terlihat', 'backdrop-filter: blur()', 'foreground tajam', 'koordinat UV', 'frame sebelumnya', 'overscan', 'izin ekspor eksplisit', 'Liquid Glass belum terpenuhi']) assert.ok(guide.includes(required), required);
  assert.ok(catalog.includes('rules/liquid-glass.md'));
  const menu = read('rules/animate-styles.md');
  assert.match(menu, /\*\*Motion graphic A\*\*:.*Liquid Glass/);
  assert.ok(menu.includes('lima pilihan melebihi batas empat'));
});

test('paper variants preserve the diorama choice and separate editorial material rules', () => {
  const catalog = read('rules/visual-references.md');
  const table = catalog.split('## Pilihan visual disetujui untuk video berikutnya')[1].split('Jika gaya belum ditentukan')[0];
  const row = table.split('\n').filter((line) => line.startsWith('| Animate Cut Paper |'));
  assert.equal(row.length, 1);
  for (const label of ['Kolase', 'Editorial Paper Cut-Out']) assert.ok(row[0].includes(label), label);
  assert.equal(table.split('\n').filter((line) => line.startsWith('| Diorama papercut |')).length, 1);
  assert.ok(!table.includes('| Editorial Paper Cut-Out |'), 'variant must not duplicate the family');
  const guide = read('rules/animate-styles.md').split('## Animate Cut Paper: dua varian')[1].split('## Animate Isometric: dua varian')[0];
  for (const required of ['### Kolase', '### Editorial Paper Cut-Out', 'lalu tunggu pilihan', 'Kerangka A', 'koordinat lokal objek', 'jangan regenerasi setiap frame', 'Stepped stop-motion hanya aksen selektif', 'Vendor tetap utuh', 'izin ekspor eksplisit', 'bukan preset siap-render']) {
    assert.ok(guide.includes(required), required);
  }
});

test('isometric variants preserve one catalog family and separate visual contracts', () => {
  const catalog = read('rules/visual-references.md');
  const table = catalog.split('## Pilihan visual disetujui untuk video berikutnya')[1].split('Jika gaya belum ditentukan')[0];
  const row = table.split('\n').filter((line) => line.startsWith('| Animate Isometric |'));
  assert.equal(row.length, 1);
  for (const label of ['Minimal', 'Teknis', 'Isometric Line Art']) assert.ok(row[0].includes(label), label);
  assert.ok(!table.includes('| Isometric Line Art |'), 'variant must not duplicate the family');
  const guide = read('rules/animate-styles.md').split('## Animate Isometric: dua varian')[1].split('## Produksi dalam proyek ini')[0];
  for (const required of ['### Minimal', '### Teknis (Isometric Line Art)', 'dimetrik 2:1', 'hairline konstan', 'arc length', 'hidden line', 'sumber, jalur, tujuan, dan konsekuensi', 'Three.js tidak wajib', 'lalu tunggu pilihan', 'Izin gaya bukan izin ekspor MP4']) {
    assert.ok(guide.includes(required), required);
  }
});

test('workflow references the full catalog rather than a stale five-option menu', () => {
  for (const file of ['rules/RULES.md', 'rules/VIDEO-WORKFLOW.md', 'rules/remotion-pro-rules.md', 'rules/KERANGKA-B.md', 'rules/visual-references.md']) {
    assert.doesNotMatch(read(file), /seluruh (?:\*\*)?lima pilihan|kelima pilihan tersebut|saat ini lima|Daftar lima pilihan aktif/);
  }
});

test('integration guide preserves engine, audio and export boundaries', () => {
  assert.ok(existsSync('rules/animate-styles.md'), 'missing Animate integration guide');
  const guide = read('rules/animate-styles.md');
  for (const required of ['bukan kerangka baru', 'audio master', 'Studio', 'izin ekspor', 'small.en', '1440', 'true peak']) assert.ok(guide.includes(required), required);
  assert.ok(read('rules/visual-references.md').includes('rules/animate-styles.md'));
});

test('vendored library is pinned and all upstream files retain verified hashes', () => {
  assert.ok(existsSync('vendor/animate/upstream.json'), 'missing pinned library');
  const manifest = JSON.parse(read('vendor/animate/upstream.json'));
  assert.equal(manifest.commit, '7e5eb56feb2dd573f890e1b7b34748af43d58263');
  assert.equal(manifest.license, 'MIT');
  assert.match(read('vendor/animate/LICENSE'), /Copyright \(c\) 2026 cth9191/);
  for (const [relative, expected] of Object.entries(manifest.files)) {
    const actual = createHash('sha256').update(readFileSync(path.join('vendor/animate', relative))).digest('hex');
    assert.equal(actual, expected, relative);
  }
  for (const style of styles) for (const file of ['STYLE.md', 'kit.js', 'sample.png', 'demo/piece.json']) assert.ok(existsSync(`vendor/animate/styles/${style}/${file}`), `${style}/${file}`);
});

test('all seven imported style demos compile without changing the vendor tree', () => {
  assert.ok(existsSync('vendor/animate/tools/build.mjs'), 'missing builder');
  const temp = mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'animate-style-test-'));
  try {
    for (const style of styles) {
      const piece = path.join(temp, style);
      cpSync(`vendor/animate/styles/${style}/demo`, piece, {recursive: true});
      const result = spawnSync(process.execPath, [path.resolve('vendor/animate/tools/build.mjs'), piece], {encoding: 'utf8'});
      assert.equal(result.status, 0, `${style}: ${result.stderr}`);
      assert.ok(existsSync(path.join(piece, 'index.html')));
    }
  } finally {rmSync(temp, {recursive: true, force: true});}
});
