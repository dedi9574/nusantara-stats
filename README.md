# NusantaraStats — Statistik Nusantara

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/dedi9574/nusantara-stats/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/dedi9574/nusantara-stats/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

<sub>Entered on make.fun</sub>

**NusantaraStats** adalah situs statistik nasional Indonesia berbahasa Indonesia:
beranda dashboard dengan kartu KPI dan grafik tren, plus delapan bagian —
Penduduk, Ekonomi, Harga, Ketenagakerjaan, Kemiskinan, IPM, Provinsi, dan
Metodologi & Sumber.

Semua angka dikutip dari rilis resmi BPS dan dicantumkan sumber beserta tanggal
rilisnya pada setiap angka. Prinsip situs ini: yang tidak terverifikasi ditulis
"—", bukan dikarang. Contohnya: penduduk 2025 sebesar 284,67 juta jiwa (SUPAS
2025), PDB Triwulan III-2025 Rp6.060,0 triliun (tumbuh 5,04% yoy), inflasi
Oktober 2026 3,23% yoy, TPT November 2025 4,74%, kemiskinan September 2025
8,25%, dan IPM 2026 76,59.

## Fitur

- **9 bagian lewat nav hash** (`#/`, `#/penduduk`, `#/ekonomi`, `#/harga`,
  `#/ketenagakerjaan`, `#/kemiskinan`, `#/ipm`, `#/provinsi`, `#/metodologi`).
- **Kontrol yang benar-benar berfungsi**: pemilih tahun/periode (hanya tahun
  dengan data terverifikasi), tabel provinsi yang bisa diurutkan dan dicari,
  toggle kota/desa pada data kemiskinan, dan tooltip saat kursor menyentuh
  grafik.
- **Grafik digambar di kode** (canvas, tanpa pustaka dan tanpa jaringan):
  batang, garis, dan donat.
- **Tanpa build step, tanpa network request** — file statis yang jalan di
  desktop Chrome maupun HP.

## Cara menjalankan

```sh
# Sajikan app/ lewat HTTP lokal, lalu buka di browser:
python3 -m http.server 8123 --directory app
# buka http://localhost:8123/index.html
```

Atau cukup buka `app/index.html` langsung di browser.

## Struktur

```
app/
  index.html   — kerangka halaman, header, nav, footer
  style.css    — seluruh gaya situs
  data.js      — paket data terverifikasi (BPS) + format angka
  charts.js    — grafik kanvas (batang, garis, donat) + tooltip
  views.js     — tampilan sembilan rute
  main.js      — router hash + pengikat semua kontrol
main.ts        — program penyerahan: menyalin app/ + screenshots/ dan menulis dossier.json
vendor/
  makefun-frontend.ts — pustaka make.fun (tanpa diubah)
screenshots/  — tangkapan layar situs yang sedang berjalan
shots.json     — dokumentasi view tiap screenshot
```

## Penyerahan

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Program ini deterministik: dua kali jalan menghasilkan byte yang sama.

## Lisensi

MIT — lihat `LICENSE`.
