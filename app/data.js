// NusantaraStats — paket data terverifikasi (BPS).
// Setiap angka di bawah ini dikutip dari rilis resmi BPS yang tercantum di
// bagian Metodologi & Sumber. Sel yang tidak terverifikasi ditulis null dan
// ditampilkan sebagai "—" di antarmuka; tidak ada angka yang dikarang.

const DATA = {
  meta: {
    brand: 'NusantaraStats',
    tagline: 'Statistik Nusantara — angka resmi Indonesia, disajikan apa adanya.',
    updatedNote: 'Terakhir diperbarui dengan rilis BPS per 26 November 2026.',
  },

  // Penduduk — SUPAS 2025, BRS No. 51/05/Th. XXIX, 5 Mei 2026.
  penduduk: {
    source: 'BPS — Hasil Survei Penduduk Antar Sensus (SUPAS) 2025, BRS 5 Mei 2026',
    years: {
      2010: { totalJuta: 237.64, growth: null, note: 'Sensus Penduduk 2010' },
      2020: { totalJuta: 270.20, growth: 1.10, note: 'Sensus Penduduk 2020' },
      2025: { totalJuta: 284.67, growth: 1.08, note: 'SUPAS 2025' },
    },
    dependencyRatio: 45.05, // tiap 100 penduduk usia produktif menopang ~45 nonproduktif
    jawaSharePct: 55, // sekitar 55% penduduk tinggal di Pulau Jawa
    jawaBaratJuta: 50.8, // Jawa Barat 2025 — provinsi terpadat
  },

  // Ekonomi — BPS BRS No. 102/11/Th. XXVIII, 5 Nov 2025 (Triwulan III-2025).
  ekonomi: {
    source: 'BPS — Berita Resmi Statistik, 5 November 2025 (Triwulan III-2025)',
    quarter: 'Triwulan III-2025',
    pdbBerlakuTriliun: 6060.0,
    pdbKonstanTriliun: 3444.8,
    growthYoy: 5.04,
    growthQtoQ: 1.43,
    growthCtoC: 5.01, // Jan–Sep 2025 terhadap Jan–Sep 2024
    industri: { growthYoy: 5.54, sharePct: 19.15 },
    konsumsiRtYoy: 4.89,
    eksporYoy: 9.91,
    pmtbYoy: 5.04,
  },

  // Harga / inflasi — BPS, 2 Nov 2026.
  inflasi: {
    source: 'BPS — Berita Resmi Statistik Inflasi, 2 November 2026',
    periods: {
      'Okt 2025': { yoy: 2.86, mtm: null, ihk: null, calendar: null, foodYoy: null, core: null },
      'Okt 2026': { yoy: 3.23, mtm: 0.22, ihk: 112.56, ihkPrev: 112.31, calendar: 2.40, foodYoy: 4.82, core: 2.56 },
    },
    ihkPrevLabel: 'Sep 2026',
  },

  // Ketenagakerjaan — BPS Sakernas (rilis 5 Nov 2025 + rilis triwulanan Nov 2025).
  tenagaKerja: {
    source: 'BPS — Survei Angkatan Kerja Nasional (Sakernas), Agustus & November 2025',
    periods: {
      'Agu 2025': {
        tpt: 4.85, penganggurJuta: 7.46, angkatanKerjaJuta: 154.0, tpak: 70.59,
        penuhWaktu: 67.32, paruhWaktu: 24.77, setengahPenganggur: 7.91,
        setengahPenganggurJuta: 11.6, informal: 57.8, informalJuta: 84.58,
        upahRataJuta: 3.33,
      },
      'Nov 2025': {
        tpt: 4.74, penganggurJuta: 7.35, angkatanKerjaJuta: 155.27, tpak: 70.95,
        penuhWaktu: 67.94, paruhWaktu: null, setengahPenganggur: null,
        setengahPenganggurJuta: null, informal: null, informalJuta: null,
        upahRataJuta: null, bekerjaJuta: 147.91,
      },
    },
    tptProvinsi: { tertinggi: { nama: 'Papua', nilai: 6.96 }, terendah: { nama: 'Bali', nilai: 1.49 } },
  },

  // Kemiskinan & ketimpangan — BPS, Maret & September 2025.
  kemiskinan: {
    source: 'BPS — Profil Kemiskinan di Indonesia, Maret & September 2025',
    periods: {
      'Mar 2025': {
        pct: 8.47, jumlahJuta: 23.85, garisRp: 609160,
        kotaPct: 6.73, kotaJuta: 11.27, desaPct: 11.03, desaJuta: null, gini: 0.375,
      },
      'Sep 2025': {
        pct: 8.25, jumlahJuta: 23.36, garisRp: 641443,
        kotaPct: null, kotaJuta: null, desaPct: null, desaJuta: null, gini: 0.363,
        rumahTanggaJuta: 4.91,
      },
    },
  },

  // Pembangunan manusia — BPS, rilis 5 Nov 2025 & 5 Nov 2026.
  ipm: {
    source: 'BPS — Indeks Pembangunan Manusia, rilis 5 November 2025 & 5 November 2026',
    years: {
      2024: { ipm: 75.02, delta: null, uhh: null, hls: null, rls: null, pengeluaran: null },
      2025: { ipm: 75.90, delta: 0.88, uhh: 74.47, hls: 13.30, rls: 9.07, pengeluaran: 12802000, pengeluaranDelta: 461000 },
      2026: { ipm: 76.59, delta: 0.69, uhh: null, hls: null, rls: null, pengeluaran: null },
    },
    provinsi2025: [
      { nama: 'DKI Jakarta', ipm: 85.05 },
      { nama: 'DI Yogyakarta', ipm: 82.48 },
      { nama: 'Kep. Riau', ipm: 80.53 },
      { nama: 'Papua Pegunungan', ipm: 54.91 },
    ],
  },

  // Tabel provinsi — HANYA provinsi dengan angka terverifikasi di atas.
  // Kolom yang tidak terverifikasi bernilai null dan tampil sebagai "—".
  provinsi: [
    { nama: 'DKI Jakarta', pendudukJuta: null, tpt: null, ipm: 85.05 },
    { nama: 'DI Yogyakarta', pendudukJuta: null, tpt: null, ipm: 82.48 },
    { nama: 'Kep. Riau', pendudukJuta: null, tpt: null, ipm: 80.53 },
    { nama: 'Jawa Barat', pendudukJuta: 50.8, tpt: null, ipm: null },
    { nama: 'Papua', pendudukJuta: null, tpt: 6.96, ipm: null },
    { nama: 'Bali', pendudukJuta: null, tpt: 1.49, ipm: null },
    { nama: 'Papua Pegunungan', pendudukJuta: null, tpt: null, ipm: 54.91 },
  ],
};

// Format angka Indonesia: koma desimal, titik ribuan.
function fmt(value, decimals = 2) {
  if (value === null || value === undefined) return '—';
  return Number(value).toLocaleString('id-ID', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function fmtInt(value) {
  if (value === null || value === undefined) return '—';
  return Number(value).toLocaleString('id-ID');
}

function fmtRp(value) {
  if (value === null || value === undefined) return '—';
  return 'Rp' + Number(value).toLocaleString('id-ID');
}
