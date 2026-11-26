// NusantaraStats — grafik kanvas (tanpa pustaka, tanpa jaringan).
// Setiap grafik digambar manual di <canvas> dan punya tooltip saat kursor
// menyentuh titik/batang/irisan. Warna: teal tua, hijau, dan aksen amber.

const CHART = {
  teal: '#0b5d4e',
  green: '#1f8a6d',
  lightGreen: '#7cc4a8',
  amber: '#e8a317',
  red: '#c0392b',
  ink: '#1c2b28',
  muted: '#5f6f6a',
  grid: '#dfe7e2',
};

let tooltipEl = null;

function getTooltip() {
  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.className = 'chart-tip';
    tooltipEl.hidden = true;
    document.body.appendChild(tooltipEl);
  }
  return tooltipEl;
}

function showTip(canvas, text, x, y) {
  const tip = getTooltip();
  tip.textContent = text;
  tip.hidden = false;
  const rect = canvas.getBoundingClientRect();
  const tx = rect.left + x + 12;
  const ty = rect.top + y - 8;
  tip.style.left = Math.min(tx, window.innerWidth - 190) + 'px';
  tip.style.top = Math.max(ty, 8) + 'px';
}

function hideTip() {
  if (tooltipEl) tooltipEl.hidden = true;
}

function setupCanvas(canvas, height) {
  const dpr = window.devicePixelRatio || 1;
  const width = canvas.clientWidth || canvas.parentElement.clientWidth || 600;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.height = height + 'px';
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, width, height };
}

function niceTicks(min, max, count = 4) {
  const span = max - min || 1;
  const step = span / count;
  const mag = Math.pow(10, Math.floor(Math.log10(step)));
  const norm = step / mag;
  const nice = norm < 1.5 ? 1 : norm < 3.5 ? 2 : norm < 7.5 ? 5 : 10;
  const s = nice * mag;
  const start = Math.floor(min / s) * s;
  const ticks = [];
  for (let v = start; v <= max + 1e-9; v += s) ticks.push(v);
  return ticks;
}

// Grafik garis dengan titik dan tooltip per titik.
function drawLineChart(canvas, labels, values, opts = {}) {
  const height = opts.height || 240;
  const { ctx, width } = setupCanvas(canvas, height);
  const pad = { l: 56, r: 16, t: 14, b: 30 };
  const plotW = width - pad.l - pad.r;
  const plotH = height - pad.t - pad.b;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const lo = min - (max - min) * 0.25;
  const hi = max + (max - min) * 0.25;
  const xAt = (i) => pad.l + (values.length === 1 ? plotW / 2 : (i / (values.length - 1)) * plotW);
  const yAt = (v) => pad.t + (1 - (v - lo) / (hi - lo)) * plotH;

  ctx.font = '12px system-ui, sans-serif';
  ctx.fillStyle = CHART.muted;
  ctx.strokeStyle = CHART.grid;
  ctx.lineWidth = 1;
  for (const t of niceTicks(lo, hi)) {
    const y = yAt(t);
    ctx.beginPath();
    ctx.moveTo(pad.l, y);
    ctx.lineTo(width - pad.r, y);
    ctx.stroke();
    ctx.textAlign = 'right';
    ctx.fillText(fmt(t, opts.decimals ?? 2), pad.l - 8, y + 4);
  }

  // Garis + area.
  const grad = ctx.createLinearGradient(0, pad.t, 0, height - pad.b);
  grad.addColorStop(0, 'rgba(31,138,109,0.25)');
  grad.addColorStop(1, 'rgba(31,138,109,0)');
  ctx.beginPath();
  values.forEach((v, i) => (i === 0 ? ctx.moveTo(xAt(i), yAt(v)) : ctx.lineTo(xAt(i), yAt(v))));
  ctx.strokeStyle = CHART.green;
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.lineTo(xAt(values.length - 1), height - pad.b);
  ctx.lineTo(xAt(0), height - pad.b);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  const points = values.map((v, i) => ({ x: xAt(i), y: yAt(v), label: labels[i], value: v }));
  for (const p of points) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = CHART.teal;
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.fillStyle = CHART.ink;
    ctx.textAlign = 'center';
    ctx.fillText(fmt(p.value, opts.decimals ?? 2), p.x, p.y - 12);
  }
  ctx.fillStyle = CHART.muted;
  ctx.textAlign = 'center';
  labels.forEach((lab, i) => ctx.fillText(lab, xAt(i), height - 8));

  canvas.onmousemove = (ev) => {
    const r = canvas.getBoundingClientRect();
    const mx = ev.clientX - r.left;
    const my = ev.clientY - r.top;
    let best = null;
    let bestD = 28;
    for (const p of points) {
      const d = Math.hypot(p.x - mx, p.y - my);
      if (d < bestD) { bestD = d; best = p; }
    }
    if (best) showTip(canvas, `${best.label}: ${fmt(best.value, opts.decimals ?? 2)}${opts.unit || ''}`, best.x, best.y);
    else hideTip();
  };
  canvas.onmouseleave = hideTip;
}

// Grafik batang vertikal dengan tooltip per batang.
function drawBarChart(canvas, labels, values, opts = {}) {
  const height = opts.height || 240;
  const { ctx, width } = setupCanvas(canvas, height);
  const pad = { l: 56, r: 16, t: 26, b: 30 };
  const plotW = width - pad.l - pad.r;
  const plotH = height - pad.t - pad.b;
  const max = Math.max(...values) * 1.15;
  const yAt = (v) => pad.t + (1 - v / max) * plotH;
  const colors = opts.colors || [CHART.teal, CHART.green, CHART.lightGreen, CHART.amber];

  ctx.font = '12px system-ui, sans-serif';
  ctx.fillStyle = CHART.muted;
  ctx.strokeStyle = CHART.grid;
  ctx.lineWidth = 1;
  for (const t of niceTicks(0, max)) {
    const y = yAt(t);
    ctx.beginPath();
    ctx.moveTo(pad.l, y);
    ctx.lineTo(width - pad.r, y);
    ctx.stroke();
    ctx.textAlign = 'right';
    ctx.fillText(fmt(t, opts.decimals ?? 1), pad.l - 8, y + 4);
  }

  const slot = plotW / values.length;
  const barW = Math.min(64, slot * 0.55);
  const bars = values.map((v, i) => {
    const x = pad.l + slot * i + (slot - barW) / 2;
    const y = yAt(v);
    ctx.fillStyle = colors[i % colors.length];
    ctx.fillRect(x, y, barW, height - pad.b - y);
    ctx.fillStyle = CHART.ink;
    ctx.textAlign = 'center';
    ctx.fillText(fmt(v, opts.decimals ?? 2), x + barW / 2, y - 8);
    ctx.fillStyle = CHART.muted;
    ctx.fillText(labels[i], x + barW / 2, height - 8);
    return { x, y, w: barW, h: height - pad.b - y, label: labels[i], value: v };
  });

  canvas.onmousemove = (ev) => {
    const r = canvas.getBoundingClientRect();
    const mx = ev.clientX - r.left;
    const my = ev.clientY - r.top;
    const hit = bars.find((b) => mx >= b.x && mx <= b.x + b.w && my >= b.y - 6 && my <= b.y + b.h);
    if (hit) showTip(canvas, `${hit.label}: ${fmt(hit.value, opts.decimals ?? 2)}${opts.unit || ''}`, hit.x + hit.w / 2, hit.y);
    else hideTip();
  };
  canvas.onmouseleave = hideTip;
}

// Donat dua irisan (mis. Jawa vs luar Jawa) dengan tooltip.
function drawDonut(canvas, parts, opts = {}) {
  const height = opts.height || 220;
  const { ctx, width } = setupCanvas(canvas, height);
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) / 2 - 24;
  const inner = radius * 0.62;
  const total = parts.reduce((s, p) => s + p.value, 0);
  const colors = opts.colors || [CHART.teal, CHART.amber];
  let start = -Math.PI / 2;
  const arcs = [];
  parts.forEach((p, i) => {
    const sweep = (p.value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, start, start + sweep);
    ctx.closePath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();
    arcs.push({ start, end: start + sweep, label: p.label, value: p.value });
    start += sweep;
  });
  ctx.beginPath();
  ctx.arc(cx, cy, inner, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.fillStyle = CHART.ink;
  ctx.font = 'bold 20px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(opts.centerText || '', cx, cy - 2);
  ctx.font = '12px system-ui, sans-serif';
  ctx.fillStyle = CHART.muted;
  ctx.fillText(opts.centerSub || '', cx, cy + 16);

  // Legenda di bawah donat.
  const legendY = height - 10;
  ctx.font = '12px system-ui, sans-serif';
  let lx = 16;
  parts.forEach((p, i) => {
    ctx.fillStyle = colors[i % colors.length];
    ctx.fillRect(lx, legendY - 10, 12, 12);
    ctx.fillStyle = CHART.ink;
    ctx.textAlign = 'left';
    const text = `${p.label} ${fmt(p.value, 0)}%`;
    ctx.fillText(text, lx + 18, legendY + 1);
    lx += 18 + ctx.measureText(text).width + 24;
  });

  canvas.onmousemove = (ev) => {
    const r = canvas.getBoundingClientRect();
    const mx = ev.clientX - r.left;
    const my = ev.clientY - r.top;
    const d = Math.hypot(mx - cx, my - cy);
    if (d < inner || d > radius) { hideTip(); return; }
    let ang = Math.atan2(my - cy, mx - cx);
    if (ang < -Math.PI / 2) ang += Math.PI * 2;
    const hit = arcs.find((a) => ang >= a.start && ang <= a.end);
    if (hit) showTip(canvas, `${hit.label}: ${fmt(hit.value, 0)}%`, mx, my);
    else hideTip();
  };
  canvas.onmouseleave = hideTip;
}
