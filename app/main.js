// NusantaraStats — router hash dan pengikat kontrol.
// Rute: #/ #/penduduk #/ekonomi #/harga #/ketenagakerjaan #/kemiskinan
// #/ipm #/provinsi #/metodologi. Setelah tiap render, grafik digambar ulang
// dan kontrol (pemilih tahun, sortir/cari, toggle kota-desa) diaktifkan.

const NAV = [
  ['/', 'Beranda'],
  ['/penduduk', 'Penduduk'],
  ['/ekonomi', 'Ekonomi'],
  ['/harga', 'Harga'],
  ['/ketenagakerjaan', 'Ketenagakerjaan'],
  ['/kemiskinan', 'Kemiskinan'],
  ['/ipm', 'IPM'],
  ['/provinsi', 'Provinsi'],
  ['/metodologi', 'Metodologi'],
];

const viewEl = document.getElementById('view');
const navEl = document.getElementById('nav');

function currentRoute() {
  const hash = location.hash.replace(/^#/, '') || '/';
  return VIEWS[hash] ? hash : '/';
}

function renderNav(route) {
  navEl.innerHTML = NAV.map(([path, label]) =>
    `<a href="#${path}" class="${path === route ? 'active' : ''}" ${path === route ? 'aria-current="page"' : ''}>${label}</a>`
  ).join('');
}

function drawCharts(route) {
  if (route === '/') {
    drawBarChart(document.getElementById('ch-pop'),
      ['2010', '2020', '2025'],
      [DATA.penduduk.years[2010].totalJuta, DATA.penduduk.years[2020].totalJuta, DATA.penduduk.years[2025].totalJuta],
      { decimals: 2, unit: ' jt', height: 200 });
    drawLineChart(document.getElementById('ch-ipm'),
      ['2024', '2025', '2026'],
      [DATA.ipm.years[2024].ipm, DATA.ipm.years[2025].ipm, DATA.ipm.years[2026].ipm],
      { decimals: 2, height: 200 });
  }
  if (route === '/penduduk') {
    drawBarChart(document.getElementById('ch-pop2'),
      ['2010', '2020', '2025'],
      [DATA.penduduk.years[2010].totalJuta, DATA.penduduk.years[2020].totalJuta, DATA.penduduk.years[2025].totalJuta],
      { decimals: 2, unit: ' jt' });
    drawDonut(document.getElementById('ch-jawa'),
      [{ label: 'Pulau Jawa', value: DATA.penduduk.jawaSharePct }, { label: 'Luar Jawa', value: 100 - DATA.penduduk.jawaSharePct }],
      { centerText: '~55%', centerSub: 'di Pulau Jawa' });
    bindPenduduk();
  }
  if (route === '/ekonomi') {
    const e = DATA.ekonomi;
    drawBarChart(document.getElementById('ch-gdp'),
      ['PDB', 'Konsumsi RT', 'PMTB', 'Ekspor', 'Industri'],
      [e.growthYoy, e.konsumsiRtYoy, e.pmtbYoy, e.eksporYoy, e.industri.growthYoy],
      { decimals: 2, unit: '%' });
    drawDonut(document.getElementById('ch-gdp2'),
      [{ label: 'Industri pengolahan', value: e.industri.sharePct }, { label: 'Lapangan usaha lain', value: 100 - e.industri.sharePct }],
      { centerText: '19,15%', centerSub: 'industri' });
  }
  if (route === '/harga') {
    const p = DATA.inflasi.periods;
    drawBarChart(document.getElementById('ch-inf'),
      ['Okt 2025', 'Okt 2026'],
      [p['Okt 2025'].yoy, p['Okt 2026'].yoy],
      { decimals: 2, unit: '%' });
    drawLineChart(document.getElementById('ch-ihk'),
      ['Sep 2026', 'Okt 2026'],
      [p['Okt 2026'].ihkPrev, p['Okt 2026'].ihk],
      { decimals: 2 });
    bindInflasi();
  }
  if (route === '/ketenagakerjaan') {
    const p = DATA.tenagaKerja.periods;
    drawBarChart(document.getElementById('ch-tpt'),
      ['Agu 2025', 'Nov 2025'],
      [p['Agu 2025'].tpt, p['Nov 2025'].tpt],
      { decimals: 2, unit: '%' });
    drawBarChart(document.getElementById('ch-status'),
      ['Penuh waktu', 'Paruh waktu', 'Setengah penganggur'],
      [p['Agu 2025'].penuhWaktu, p['Agu 2025'].paruhWaktu, p['Agu 2025'].setengahPenganggur],
      { decimals: 2, unit: '%' });
    bindTenagaKerja();
  }
  if (route === '/kemiskinan') {
    const p = DATA.kemiskinan.periods;
    drawBarChart(document.getElementById('ch-pov'),
      ['Mar 2025', 'Sep 2025'],
      [p['Mar 2025'].pct, p['Sep 2025'].pct],
      { decimals: 2, unit: '%' });
    drawLineChart(document.getElementById('ch-gini'),
      ['Mar 2025', 'Sep 2025'],
      [p['Mar 2025'].gini, p['Sep 2025'].gini],
      { decimals: 3 });
    bindKemiskinan();
  }
  if (route === '/ipm') {
    const y = DATA.ipm.years;
    drawLineChart(document.getElementById('ch-ipm2'),
      ['2024', '2025', '2026'],
      [y[2024].ipm, y[2025].ipm, y[2026].ipm],
      { decimals: 2 });
    drawBarChart(document.getElementById('ch-ipm-prov'),
      DATA.ipm.provinsi2025.map((p) => p.nama),
      DATA.ipm.provinsi2025.map((p) => p.ipm),
      { decimals: 2 });
    bindIpm();
  }
  if (route === '/provinsi') bindProvinsi();
}

// ---------- Penduduk: pemilih tahun ----------
function bindPenduduk() {
  const sel = document.getElementById('year-pop');
  const kpis = document.getElementById('pop-kpis');
  const paint = () => {
    const y = DATA.penduduk.years[sel.value];
    kpis.innerHTML = `
      <div class="kpi"><span class="kpi-label">Jumlah penduduk ${sel.value}</span>
        <span class="kpi-value">${fmt(y.totalJuta, 2)} jt</span>
        <span class="kpi-sub">${y.note}</span></div>
      <div class="kpi"><span class="kpi-label">Laju pertumbuhan</span>
        <span class="kpi-value">${y.growth === null ? '—' : fmt(y.growth, 2) + '%/thn'}</span>
        <span class="kpi-sub">${y.growth === null ? 'Tidak terverifikasi untuk 2010' : 'Per tahun (5 tahun terakhir)'}</span></div>
      <div class="kpi"><span class="kpi-label">Rasio ketergantungan 2025</span>
        <span class="kpi-value">${fmt(DATA.penduduk.dependencyRatio, 2)}</span>
        <span class="kpi-sub">Per 100 usia produktif</span></div>
      <div class="kpi"><span class="kpi-label">Provinsi terpadat</span>
        <span class="kpi-value">Jawa Barat</span>
        <span class="kpi-sub">${fmt(DATA.penduduk.jawaBaratJuta, 1)} juta jiwa (2025)</span></div>`;
  };
  sel.addEventListener('change', paint);
  sel.value = '2025';
  paint();
}

// ---------- Harga: pemilih periode ----------
function bindInflasi() {
  const sel = document.getElementById('year-inf');
  const kpis = document.getElementById('inf-kpis');
  const paint = () => {
    const p = DATA.inflasi.periods[sel.value];
    kpis.innerHTML = `
      <div class="kpi"><span class="kpi-label">Inflasi yoy ${sel.value}</span>
        <span class="kpi-value">${fmt(p.yoy, 2)}%</span><span class="kpi-sub">Year-on-year</span></div>
      <div class="kpi"><span class="kpi-label">Inflasi m-to-m</span>
        <span class="kpi-value">${p.mtm === null ? '—' : fmt(p.mtm, 2) + '%'}</span>
        <span class="kpi-sub">${p.mtm === null ? 'Tidak terverifikasi' : 'Bulan ke bulan'}</span></div>
      <div class="kpi"><span class="kpi-label">IHK</span>
        <span class="kpi-value">${p.ihk === null ? '—' : fmt(p.ihk, 2)}</span>
        <span class="kpi-sub">${p.ihk === null ? 'Tidak terverifikasi' : DATA.inflasi.ihkPrevLabel + ' ' + fmt(p.ihkPrev, 2)}</span></div>
      <div class="kpi"><span class="kpi-label">Inflasi inti</span>
        <span class="kpi-value">${p.core === null ? '—' : fmt(p.core, 2) + '%'}</span>
        <span class="kpi-sub">${p.core === null ? 'Tidak terverifikasi' : 'Oktober 2026'}</span></div>`;
  };
  sel.addEventListener('change', paint);
  sel.value = 'Okt 2026';
  paint();
}

// ---------- Ketenagakerjaan: pemilih periode ----------
function bindTenagaKerja() {
  const sel = document.getElementById('period-tk');
  const kpis = document.getElementById('tk-kpis');
  const paint = () => {
    const p = DATA.tenagaKerja.periods[sel.value];
    kpis.innerHTML = `
      <div class="kpi"><span class="kpi-label">TPT ${sel.value}</span>
        <span class="kpi-value">${fmt(p.tpt, 2)}%</span>
        <span class="kpi-sub">${fmt(p.penganggurJuta, 2)} jt penganggur</span></div>
      <div class="kpi"><span class="kpi-label">Angkatan kerja</span>
        <span class="kpi-value">${fmt(p.angkatanKerjaJuta, 2)} jt</span>
        <span class="kpi-sub">TPAK ${fmt(p.tpak, 2)}%</span></div>
      <div class="kpi"><span class="kpi-label">Pekerja penuh waktu</span>
        <span class="kpi-value">${fmt(p.penuhWaktu, 2)}%</span>
        <span class="kpi-sub">${p.bekerjaJuta ? 'Bekerja ' + fmt(p.bekerjaJuta, 2) + ' jt' : 'Paruh waktu ' + fmt(p.paruhWaktu, 2) + '% · setengah penganggur ' + fmt(p.setengahPenganggur, 2) + '%'}</span></div>
      <div class="kpi"><span class="kpi-label">Pekerja informal</span>
        <span class="kpi-value">${p.informal === null ? '—' : fmt(p.informal, 2) + '%'}</span>
        <span class="kpi-sub">${p.informalJuta === null ? 'Tidak terverifikasi untuk periode ini' : fmt(p.informalJuta, 2) + ' jt pekerja'}</span></div>`;
  };
  sel.addEventListener('change', paint);
  sel.value = 'Nov 2025';
  paint();
}

// ---------- Kemiskinan: pemilih periode + toggle kota/desa ----------
function bindKemiskinan() {
  const sel = document.getElementById('period-pov');
  const kpis = document.getElementById('pov-kpis');
  const hint = document.getElementById('pov-hint');
  const btnKota = document.getElementById('tg-kota');
  const btnDesa = document.getElementById('tg-desa');
  let wilayah = 'kota';
  const paint = () => {
    const p = DATA.kemiskinan.periods[sel.value];
    const split = wilayah === 'kota' ? p.kotaPct : p.desaPct;
    const splitJuta = wilayah === 'kota' ? p.kotaJuta : p.desaJuta;
    kpis.innerHTML = `
      <div class="kpi"><span class="kpi-label">Penduduk miskin ${sel.value}</span>
        <span class="kpi-value">${fmt(p.pct, 2)}%</span>
        <span class="kpi-sub">${fmt(p.jumlahJuta, 2)} jt orang</span></div>
      <div class="kpi"><span class="kpi-label">Garis kemiskinan</span>
        <span class="kpi-value">${fmtRp(p.garisRp)}</span>
        <span class="kpi-sub">Per kapita per bulan</span></div>
      <div class="kpi"><span class="kpi-label">Miskin di ${wilayah === 'kota' ? 'perkotaan' : 'perdesaan'}</span>
        <span class="kpi-value">${split === null ? '—' : fmt(split, 2) + '%'}</span>
        <span class="kpi-sub">${splitJuta === null ? (split === null ? 'Tidak terverifikasi untuk periode ini' : 'Jumlah orang tidak terverifikasi') : fmt(splitJuta, 2) + ' jt orang'}</span></div>
      <div class="kpi"><span class="kpi-label">Gini ratio</span>
        <span class="kpi-value">${fmt(p.gini, 3)}</span>
        <span class="kpi-sub">${sel.value === 'Mar 2025' ? 'Turun menjadi 0,363 pada Sep 2025' : 'Turun dari 0,375 pada Mar 2025'}</span></div>`;
    hint.textContent = sel.value === 'Sep 2025'
      ? 'Catatan: rincian kota/desa September 2025 belum terverifikasi, jadi toggle kota/desa menampilkan "—" untuk periode ini.'
      : 'Toggle kota/desa menunjukkan persentase penduduk miskin Maret 2025 per wilayah.';
  };
  const setWilayah = (w) => {
    wilayah = w;
    btnKota.classList.toggle('active', w === 'kota');
    btnDesa.classList.toggle('active', w === 'desa');
    paint();
  };
  btnKota.addEventListener('click', () => setWilayah('kota'));
  btnDesa.addEventListener('click', () => setWilayah('desa'));
  sel.addEventListener('change', paint);
  sel.value = 'Sep 2025';
  paint();
}

// ---------- IPM: pemilih tahun ----------
function bindIpm() {
  const sel = document.getElementById('year-ipm');
  const kpis = document.getElementById('ipm-kpis');
  const paint = () => {
    const y = DATA.ipm.years[sel.value];
    kpis.innerHTML = `
      <div class="kpi"><span class="kpi-label">IPM ${sel.value}</span>
        <span class="kpi-value">${fmt(y.ipm, 2)}</span>
        <span class="kpi-sub">${y.delta === null ? 'Tahun dasar tampilan' : 'Naik ' + fmt(y.delta, 2) + ' poin dari tahun sebelumnya'}</span></div>
      <div class="kpi"><span class="kpi-label">Umur harapan hidup</span>
        <span class="kpi-value">${y.uhh === null ? '—' : fmt(y.uhh, 2) + ' thn'}</span>
        <span class="kpi-sub">${y.uhh === null ? 'Komponen terverifikasi untuk 2025' : 'Saat lahir'}</span></div>
      <div class="kpi"><span class="kpi-label">Harapan lama sekolah</span>
        <span class="kpi-value">${y.hls === null ? '—' : fmt(y.hls, 2) + ' thn'}</span>
        <span class="kpi-sub">Rata-rata lama sekolah ${y.rls === null ? '—' : fmt(y.rls, 2) + ' thn'}</span></div>
      <div class="kpi"><span class="kpi-label">Pengeluaran riil/kapita</span>
        <span class="kpi-value">${y.pengeluaran === null ? '—' : fmtRp(y.pengeluaran)}</span>
        <span class="kpi-sub">${y.pengeluaranDelta ? 'Naik ' + fmtRp(y.pengeluaranDelta) + ' dari 2024' : 'Per tahun'}</span></div>`;
  };
  sel.addEventListener('change', paint);
  sel.value = '2026';
  paint();
}

// ---------- Provinsi: cari + sortir ----------
function bindProvinsi() {
  const search = document.getElementById('prov-search');
  const body = document.getElementById('prov-body');
  const count = document.getElementById('prov-count');
  let sortKey = 'nama';
  let sortDir = 1;
  const paint = () => {
    const q = search.value.trim().toLowerCase();
    const rows = DATA.provinsi
      .filter((r) => !q || r.nama.toLowerCase().includes(q))
      .sort((a, b) => {
        const av = a[sortKey];
        const bv = b[sortKey];
        if (av === null && bv === null) return a.nama.localeCompare(b.nama, 'id');
        if (av === null) return 1;
        if (bv === null) return -1;
        if (typeof av === 'string') return av.localeCompare(bv, 'id') * sortDir;
        return (av - bv) * sortDir;
      });
    body.innerHTML = rows.map((r) => `<tr>
      <td><strong>${r.nama}</strong></td>
      <td>${r.pendudukJuta === null ? '—' : fmt(r.pendudukJuta, 1)}</td>
      <td>${r.tpt === null ? '—' : fmt(r.tpt, 2)}</td>
      <td>${r.ipm === null ? '—' : fmt(r.ipm, 2)}</td>
    </tr>`).join('') || `<tr><td colspan="4">Tidak ada provinsi yang cocok dengan "${search.value}".</td></tr>`;
    count.textContent = `Menampilkan ${rows.length} dari ${DATA.provinsi.length} provinsi terverifikasi.`;
    document.querySelectorAll('.sort-btn').forEach((btn) => {
      btn.textContent = btn.textContent.replace(/ [↑↓↕]$/, '') + (btn.dataset.sort === sortKey ? (sortDir === 1 ? ' ↑' : ' ↓') : ' ↕');
    });
  };
  document.querySelectorAll('.sort-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (sortKey === btn.dataset.sort) sortDir *= -1;
      else { sortKey = btn.dataset.sort; sortDir = 1; }
      paint();
    });
  });
  search.addEventListener('input', paint);
  paint();
}

function render() {
  const route = currentRoute();
  viewEl.innerHTML = VIEWS[route]();
  renderNav(route);
  drawCharts(route);
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', render);
window.addEventListener('resize', () => { drawCharts(currentRoute()); });
render();
