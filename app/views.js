// NusantaraStats — tampilan tiap rute (mengembalikan string HTML).
// Angka diambil dari DATA (app/data.js); sel tak terverifikasi tampil "—".

function kpiCard(label, value, sub, href) {
  return `<a class="kpi" href="${href}">
    <span class="kpi-label">${label}</span>
    <span class="kpi-value">${value}</span>
    <span class="kpi-sub">${sub}</span>
  </a>`;
}

function sourceNote(source) {
  return `<p class="source">Sumber: ${source}</p>`;
}

function sectionHead(title, intro) {
  return `<h2>${title}</h2><p class="intro">${intro}</p>`;
}

// ---------- Beranda ----------
function viewHome() {
  const p = DATA.penduduk.years[2025];
  const e = DATA.ekonomi;
  const i = DATA.inflasi.periods['Okt 2026'];
  const tk = DATA.tenagaKerja.periods['Nov 2025'];
  const k = DATA.kemiskinan.periods['Sep 2025'];
  const ip = DATA.ipm.years[2026];
  return `
  <section class="hero">
    <h1>Statistik Nusantara</h1>
    <p class="hero-sub">Angka resmi Indonesia dari BPS — penduduk, ekonomi, harga,
    ketenagakerjaan, kemiskinan, dan pembangunan manusia — disajikan apa adanya,
    dengan sumber dan tanggal rilis pada setiap angka.</p>
  </section>
  <div class="kpi-grid">
    ${kpiCard('Penduduk 2025', fmt(p.totalJuta, 2) + ' jt', 'SUPAS 2025 · laju tumbuh ' + fmt(p.growth, 2) + '%/thn', '#/penduduk')}
    ${kpiCard('PDB Triwulan III-2025', 'Rp' + fmt(e.pdbBerlakuTriliun, 1) + ' T', 'Tumbuh ' + fmt(e.growthYoy, 2) + '% yoy', '#/ekonomi')}
    ${kpiCard('Inflasi Okt 2026', fmt(i.yoy, 2) + '% yoy', 'IHK ' + fmt(i.ihk, 2) + ' · m-to-m ' + fmt(i.mtm, 2) + '%', '#/harga')}
    ${kpiCard('TPT Nov 2025', fmt(tk.tpt, 2) + '%', fmt(tk.penganggurJuta, 2) + ' jt penganggur', '#/ketenagakerjaan')}
    ${kpiCard('Kemiskinan Sep 2025', fmt(k.pct, 2) + '%', fmt(k.jumlahJuta, 2) + ' jt orang', '#/kemiskinan')}
    ${kpiCard('IPM 2026', fmt(ip.ipm, 2), 'Naik ' + fmt(ip.delta, 2) + ' poin dari 2025', '#/ipm')}
  </div>
  <div class="chart-grid">
    <figure class="card">
      <figcaption>Jumlah penduduk Indonesia (juta jiwa)</figcaption>
      <canvas id="ch-pop" aria-label="Grafik batang jumlah penduduk 2010, 2020, 2025"></canvas>
      <p class="chart-note">Sensus 2010, Sensus 2020, dan SUPAS 2025. Arahkan kursor ke batang untuk melihat nilainya.</p>
    </figure>
    <figure class="card">
      <figcaption>Indeks Pembangunan Manusia</figcaption>
      <canvas id="ch-ipm" aria-label="Grafik garis IPM 2024 sampai 2026"></canvas>
      <p class="chart-note">IPM naik 0,88 poin pada 2025 dan 0,69 poin pada 2026.</p>
    </figure>
  </div>
  ${sourceNote('BPS — SUPAS 2025; BRS PDB 5 Nov 2025; BRS Inflasi 2 Nov 2026; Sakernas Nov 2025; Profil Kemiskinan Sep 2025; IPM 2026.')}
  <p class="update-note">${DATA.meta.updatedNote}</p>`;
}

// ---------- Penduduk ----------
function viewPenduduk() {
  const d = DATA.penduduk;
  const years = Object.keys(d.years);
  return `
  ${sectionHead('Penduduk', 'Jumlah penduduk Indonesia dari tiga pencacahan terakhir. Pilih tahun untuk melihat angka sensus/SUPAS pada tahun tersebut.')}
  <div class="controls">
    <label for="year-pop">Tahun pencacahan</label>
    <select id="year-pop">${years.map((y) => `<option value="${y}">${y}</option>`).join('')}</select>
  </div>
  <div class="kpi-grid" id="pop-kpis"></div>
  <div class="chart-grid">
    <figure class="card">
      <figcaption>Jumlah penduduk (juta jiwa)</figcaption>
      <canvas id="ch-pop2"></canvas>
      <p class="chart-note">2010: Sensus Penduduk · 2020: Sensus Penduduk · 2025: SUPAS.</p>
    </figure>
    <figure class="card">
      <figcaption>Sebaran penduduk: Jawa vs luar Jawa</figcaption>
      <canvas id="ch-jawa"></canvas>
      <p class="chart-note">Sekitar 55% penduduk Indonesia tinggal di Pulau Jawa.</p>
    </figure>
  </div>
  <div class="fact-box">
    <h3>Fakta terverifikasi</h3>
    <ul>
      <li><strong>Jawa Barat</strong> adalah provinsi terpadat: <strong>${fmt(d.jawaBaratJuta, 1)} juta jiwa</strong> (2025).</li>
      <li><strong>Rasio ketergantungan ${fmt(d.dependencyRatio, 2)}</strong> — tiap 100 penduduk usia produktif menopang sekitar 45 penduduk nonproduktif.</li>
      <li><strong>Laju pertumbuhan</strong> penduduk ${fmt(d.years[2025].growth, 2)}% per tahun, melambat dari ${fmt(d.years[2020].growth, 2)}% pada 2020.</li>
    </ul>
  </div>
  ${sourceNote(d.source)}`;
}

// ---------- Ekonomi ----------
function viewEkonomi() {
  const e = DATA.ekonomi;
  return `
  ${sectionHead('Ekonomi', 'Produk Domestik Bruto Triwulan III-2025 dan pendorong pertumbuhannya.')}
  <div class="kpi-grid">
    ${kpiCard('PDB harga berlaku', 'Rp' + fmt(e.pdbBerlakuTriliun, 1) + ' T', e.quarter, '#/ekonomi')}
    ${kpiCard('PDB harga konstan 2010', 'Rp' + fmt(e.pdbKonstanTriliun, 1) + ' T', e.quarter, '#/ekonomi')}
    ${kpiCard('Pertumbuhan yoy', fmt(e.growthYoy, 2) + '%', 'q-to-q ' + fmt(e.growthQtoQ, 2) + '% · c-to-c ' + fmt(e.growthCtoC, 2) + '%', '#/ekonomi')}
    ${kpiCard('Industri pengolahan', '+' + fmt(e.industri.growthYoy, 2) + '% yoy', 'Pangsa ' + fmt(e.industri.sharePct, 2) + '% dari PDB', '#/ekonomi')}
  </div>
  <div class="chart-grid">
    <figure class="card">
      <figcaption>Pertumbuhan komponen PDB, yoy (%) — Triwulan III-2025</figcaption>
      <canvas id="ch-gdp"></canvas>
      <p class="chart-note">Ekspor tumbuh paling cepat (+9,91%), diikuti PMTB dan industri pengolahan.</p>
    </figure>
    <figure class="card">
      <figcaption>Komposisi PDB Triwulan III-2025</figcaption>
      <canvas id="ch-gdp2"></canvas>
      <p class="chart-note">Industri pengolahan menyumbang 19,15% dari PDB — lapangan usaha terbesar.</p>
    </figure>
  </div>
  <table class="data-table">
    <caption>Komponen pengeluaran PDB — Triwulan III-2025 (yoy)</caption>
    <thead><tr><th>Komponen</th><th>Pertumbuhan yoy</th></tr></thead>
    <tbody>
      <tr><td>PDB</td><td>${fmt(e.growthYoy, 2)}%</td></tr>
      <tr><td>Konsumsi rumah tangga</td><td>+${fmt(e.konsumsiRtYoy, 2)}%</td></tr>
      <tr><td>PMTB (investasi)</td><td>+${fmt(e.pmtbYoy, 2)}%</td></tr>
      <tr><td>Ekspor barang dan jasa</td><td>+${fmt(e.eksporYoy, 2)}%</td></tr>
      <tr><td>Industri pengolahan</td><td>+${fmt(e.industri.growthYoy, 2)}%</td></tr>
    </tbody>
  </table>
  ${sourceNote(e.source)}`;
}

// ---------- Harga / inflasi ----------
function viewHarga() {
  const periods = Object.keys(DATA.inflasi.periods);
  return `
  ${sectionHead('Harga & Inflasi', 'Inflasi year-on-year, Indeks Harga Konsumen (IHK), dan pemicunya. Pilih periode Oktober untuk membandingkan.')}
  <div class="controls">
    <label for="year-inf">Periode</label>
    <select id="year-inf">${periods.map((p) => `<option value="${p}">${p}</option>`).join('')}</select>
  </div>
  <div class="kpi-grid" id="inf-kpis"></div>
  <div class="chart-grid">
    <figure class="card">
      <figcaption>Inflasi yoy (%) — Oktober 2025 vs Oktober 2026</figcaption>
      <canvas id="ch-inf"></canvas>
      <p class="chart-note">Inflasi Oktober 2026 (3,23%) lebih tinggi dari Oktober 2025 (2,86%).</p>
    </figure>
    <figure class="card">
      <figcaption>IHK September → Oktober 2026</figcaption>
      <canvas id="ch-ihk"></canvas>
      <p class="chart-note">IHK naik dari 112,31 (Sep 2026) menjadi 112,56 (Okt 2026).</p>
    </figure>
  </div>
  <div class="fact-box">
    <h3>Pemicu inflasi Oktober 2026</h3>
    <ul>
      <li>Kelompok <strong>makanan, minuman, dan tembakau naik ${fmt(DATA.inflasi.periods['Okt 2026'].foodYoy, 2)}% yoy</strong> — pemicu utama.</li>
      <li><strong>Inflasi inti ${fmt(DATA.inflasi.periods['Okt 2026'].core, 2)}%</strong> — di bawah inflasi umum.</li>
      <li>Inflasi <strong>tahun kalender 2026 mencapai ${fmt(DATA.inflasi.periods['Okt 2026'].calendar, 2)}%</strong> hingga Oktober.</li>
    </ul>
  </div>
  ${sourceNote(DATA.inflasi.source)}`;
}

// ---------- Ketenagakerjaan ----------
function viewTenagaKerja() {
  const periods = Object.keys(DATA.tenagaKerja.periods);
  return `
  ${sectionHead('Ketenagakerjaan', 'Tingkat Pengangguran Terbuka (TPT), partisipasi angkatan kerja, dan kondisi pekerja dari Sakernas.')}
  <div class="controls">
    <label for="period-tk">Periode Sakernas</label>
    <select id="period-tk">${periods.map((p) => `<option value="${p}">${p}</option>`).join('')}</select>
  </div>
  <div class="kpi-grid" id="tk-kpis"></div>
  <div class="chart-grid">
    <figure class="card">
      <figcaption>TPT (%) — Agustus vs November 2025</figcaption>
      <canvas id="ch-tpt"></canvas>
      <p class="chart-note">TPT turun dari 4,85% (Agu 2025) menjadi 4,74% (Nov 2025).</p>
    </figure>
    <figure class="card">
      <figcaption>Status pekerjaan, Agustus 2025 (%)</figcaption>
      <canvas id="ch-status"></canvas>
      <p class="chart-note">Dua pertiga pekerja bekerja penuh waktu; 57,80% bekerja di sektor informal.</p>
    </figure>
  </div>
  <div class="fact-box">
    <h3>Per provinsi — TPT Agustus 2025</h3>
    <ul>
      <li>Tertinggi: <strong>Papua ${fmt(DATA.tenagaKerja.tptProvinsi.tertinggi.nilai, 2)}%</strong>.</li>
      <li>Terendah: <strong>Bali ${fmt(DATA.tenagaKerja.tptProvinsi.terendah.nilai, 2)}%</strong>.</li>
      <li>Upah rata-rata buruh Agustus 2025: <strong>${fmtRp(DATA.tenagaKerja.periods['Agu 2025'].upahRataJuta * 1000000)}</strong> per bulan.</li>
    </ul>
  </div>
  ${sourceNote(DATA.tenagaKerja.source)}`;
}

// ---------- Kemiskinan ----------
function viewKemiskinan() {
  const periods = Object.keys(DATA.kemiskinan.periods);
  return `
  ${sectionHead('Kemiskinan & Ketimpangan', 'Persentase penduduk miskin, garis kemiskinan, dan Gini ratio.')}
  <div class="controls">
    <label for="period-pov">Periode</label>
    <select id="period-pov">${periods.map((p) => `<option value="${p}">${p}</option>`).join('')}</select>
    <span class="toggle" role="group" aria-label="Wilayah">
      <button type="button" id="tg-kota" class="toggle-btn active">Kota</button>
      <button type="button" id="tg-desa" class="toggle-btn">Desa</button>
    </span>
  </div>
  <div class="kpi-grid" id="pov-kpis"></div>
  <div class="chart-grid">
    <figure class="card">
      <figcaption>Persentase penduduk miskin (%)</figcaption>
      <canvas id="ch-pov"></canvas>
      <p class="chart-note">Turun dari 8,47% (Mar 2025) menjadi 8,25% (Sep 2025).</p>
    </figure>
    <figure class="card">
      <figcaption>Gini ratio</figcaption>
      <canvas id="ch-gini"></canvas>
      <p class="chart-note">Ketimpangan menyempit: Gini 0,375 (Mar 2025) menjadi 0,363 (Sep 2025).</p>
    </figure>
  </div>
  <p class="hint" id="pov-hint"></p>
  ${sourceNote(DATA.kemiskinan.source)}`;
}

// ---------- IPM ----------
function viewIpm() {
  const years = Object.keys(DATA.ipm.years);
  return `
  ${sectionHead('Pembangunan Manusia', 'Indeks Pembangunan Manusia (IPM) dan komponennya: umur harapan hidup, harapan lama sekolah, rata-rata lama sekolah, dan pengeluaran riil per kapita.')}
  <div class="controls">
    <label for="year-ipm">Tahun</label>
    <select id="year-ipm">${years.map((y) => `<option value="${y}">${y}</option>`).join('')}</select>
  </div>
  <div class="kpi-grid" id="ipm-kpis"></div>
  <div class="chart-grid">
    <figure class="card">
      <figcaption>IPM Indonesia 2024–2026</figcaption>
      <canvas id="ch-ipm2"></canvas>
      <p class="chart-note">IPM naik setiap tahun: 75,02 → 75,90 → 76,59.</p>
    </figure>
    <figure class="card">
      <figcaption>IPM provinsi 2025 (terverifikasi)</figcaption>
      <canvas id="ch-ipm-prov"></canvas>
      <p class="chart-note">DKI Jakarta tertinggi (85,05); Papua Pegunungan terendah (54,91).</p>
    </figure>
  </div>
  <p class="hint">Komponen IPM (UHH, HLS, RLS, pengeluaran riil) terverifikasi untuk 2025; tahun lain menampilkan "—".</p>
  ${sourceNote(DATA.ipm.source)}`;
}

// ---------- Provinsi ----------
function viewProvinsi() {
  return `
  ${sectionHead('Provinsi', 'Provinsi dengan angka terverifikasi dari rilis BPS di atas. Kolom bertanda "—" berarti angka tersebut belum terverifikasi — kami tidak mengarangnya.')}
  <div class="controls">
    <label for="prov-search">Cari provinsi</label>
    <input id="prov-search" type="search" placeholder="Ketik nama provinsi…" autocomplete="off">
  </div>
  <table class="data-table" id="prov-table">
    <caption>Indikator provinsi terverifikasi</caption>
    <thead><tr>
      <th><button type="button" class="sort-btn" data-sort="nama">Provinsi ↕</button></th>
      <th><button type="button" class="sort-btn" data-sort="pendudukJuta">Penduduk 2025 (juta) ↕</button></th>
      <th><button type="button" class="sort-btn" data-sort="tpt">TPT Agu 2025 (%) ↕</button></th>
      <th><button type="button" class="sort-btn" data-sort="ipm">IPM 2025 ↕</button></th>
    </tr></thead>
    <tbody id="prov-body"></tbody>
  </table>
  <p class="hint" id="prov-count"></p>
  <p class="hint">Sumber per kolom: Penduduk — SUPAS 2025 (Jawa Barat 50,8 jt); TPT — Sakernas Agu 2025 (Papua 6,96%; Bali 1,49%); IPM — BPS 2025.</p>`;
}

// ---------- Metodologi ----------
function viewMetodologi() {
  const rows = [
    ['Penduduk', 'BPS — Hasil SUPAS 2025', 'BRS No. 51/05/Th. XXIX, 5 Mei 2026', 'Jumlah penduduk, laju tumbuh, rasio ketergantungan, Jawa Barat 50,8 jt, ~55% di Jawa'],
    ['Ekonomi', 'BPS — Berita Resmi Statistik', 'BRS No. 102/11/Th. XXVIII, 5 Nov 2025', 'PDB Triwulan III-2025, pertumbuhan yoy/q-to-q/c-to-c, industri, konsumsi, ekspor, PMTB'],
    ['Harga', 'BPS — Berita Resmi Statistik Inflasi', '2 November 2026', 'Inflasi Okt 2026 (yoy, m-to-m, IHK, tahun kalender), Okt 2025, pemicu, inflasi inti'],
    ['Ketenagakerjaan', 'BPS — Sakernas', 'Rilis 5 Nov 2025 & rilis triwulanan Nov 2025', 'TPT, TPAK, status pekerjaan, informal, upah (Agu 2025); TPT & bekerja (Nov 2025)'],
    ['Kemiskinan', 'BPS — Profil Kemiskinan', 'Maret & September 2025', 'Persentase miskin, garis kemiskinan, kota/desa (Mar 2025), Gini ratio'],
    ['Pembangunan manusia', 'BPS — Indeks Pembangunan Manusia', 'Rilis 5 Nov 2025 & 5 Nov 2026', 'IPM 2024–2026, komponen 2025, IPM provinsi 2025'],
  ];
  return `
  ${sectionHead('Metodologi & Sumber', 'Setiap angka di situs ini berasal dari rilis resmi BPS dan dicantumkan sumber beserta tanggal rilisnya. Prinsip kami: yang tidak terverifikasi ditulis "—", bukan dikarang.')}
  <table class="data-table">
    <caption>Sumber data per topik</caption>
    <thead><tr><th>Topik</th><th>Sumber</th><th>Tanggal rilis</th><th>Angka yang dipakai</th></tr></thead>
    <tbody>
      ${rows.map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join('')}
    </tbody>
  </table>
  <div class="fact-box">
    <h3>Cara kami menyajikan data</h3>
    <ul>
      <li><strong>Tanpa angka karangan.</strong> Tabel provinsi hanya memuat provinsi yang angkanya terverifikasi; sel lain berisi "—".</li>
      <li><strong>Pemilih tahun jujur.</strong> Setiap pemilih tahun hanya menawarkan tahun yang punya data terverifikasi untuk dataset tersebut.</li>
      <li><strong>Tanpa jaringan.</strong> Semua grafik digambar di kode (canvas); situs ini tidak memuat apa pun dari internet.</li>
      <li><strong>Bukan situs resmi.</strong> NusantaraStats adalah situs demonstrasi independen dan bukan Badan Pusat Statistik (BPS).</li>
    </ul>
  </div>`;
}

const VIEWS = {
  '/': viewHome,
  '/penduduk': viewPenduduk,
  '/ekonomi': viewEkonomi,
  '/harga': viewHarga,
  '/ketenagakerjaan': viewTenagaKerja,
  '/kemiskinan': viewKemiskinan,
  '/ipm': viewIpm,
  '/provinsi': viewProvinsi,
  '/metodologi': viewMetodologi,
};
