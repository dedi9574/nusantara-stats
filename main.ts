// NusantaraStats — program penyerahan entri (Node 22, hanya stdlib).
//
// Situsnya sendiri adalah app/ di sebelah file ini: file statis yang dibuka
// browser di app/index.html (skrip biasa + CSS, tanpa build step, tanpa
// permintaan jaringan). Tugas program ini hanya menyerahkan situs itu:
// menyalin app/ dan screenshots/ ke direktori keluaran, lalu menulis
// dossier.json — ringkasan yang dibaca juri (screenshot, file first load,
// dan sumber) — memakai pustaka make.fun yang divendor di vendor/.
// File vendor itu jangan diubah: juri mengharuskan dossier.json sama persis
// dengan yang ditulis salinan pustaka miliknya sendiri.
//
// Jalankan di luar kontainer grader dengan:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const entryDir = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outDir, { recursive: true });
cpSync(join(entryDir, 'app'), join(outDir, 'app'), { recursive: true });
mkdirSync(join(outDir, 'screenshots'), { recursive: true });
if (existsSync(join(entryDir, 'screenshots'))) {
  cpSync(join(entryDir, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });
}

// Batas dari gate bounty: teks dossier paling banyak 163840 byte; paling
// banyak 4 screenshot dan masing-masing paling banyak 262144 byte; app/
// paling banyak 993 entri dan 16777216 byte. Hanya text_max_bytes yang
// mengubah isi dossier; batas lain hanya menolak entri yang melanggarnya.
writeFileSync(
  join(outDir, 'dossier.json'),
  buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
