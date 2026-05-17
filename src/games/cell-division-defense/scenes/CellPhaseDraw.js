// Exact port of the mitosis cell drawing system from the reference game.js.
// All functions accept ctx and time as explicit parameters instead of globals.

export const MITOSIS_NAMES  = ['INTERPHASE','PROPHASE','METAPHASE','ANAPHASE','TELOPHASE','CYTOKINESIS'];
export const MITOSIS_COLORS = ['#3BAFA9','#9B59B6','#00FFCC','#FFD700','#A8C8F0','#FF6B6B'];
export const MITOSIS_DURS   = [4.0, 3.5, 3.5, 3.5, 3.5, 5.5];
export const MITOSIS_TOTAL  = MITOSIS_DURS.reduce((a, b) => a + b, 0);

function easeInOut(t) { t = Math.max(0, Math.min(1, t)); return t < 0.5 ? 2*t*t : -1+(4-2*t)*t; }

// ── State machine ─────────────────────────────────────────────────────────────

export function getPhase(seconds) {
  let s = ((seconds % MITOSIS_TOTAL) + MITOSIS_TOTAL) % MITOSIS_TOTAL;
  for (let i = 0; i < 6; i++) {
    if (s < MITOSIS_DURS[i]) return { idx: i, t: Math.max(0, Math.min(1, s / MITOSIS_DURS[i])) };
    s -= MITOSIS_DURS[i];
  }
  return { idx: 5, t: 1 };
}

export function cellShapeForPhase(phase, r) {
  if (phase.idx <= 2) return { mode: 'circle', r };
  if (phase.idx === 3) {
    const stretch = easeInOut(phase.t);
    return { mode: 'ellipse', rx: r, ry: r * (1 + 0.14 * stretch) };
  }
  if (phase.idx === 4) return { mode: 'ellipse', rx: r, ry: r * 1.14 };
  if (phase.t < 0.85) {
    const pp = phase.t / 0.85;
    const p  = easeInOut(pp);
    return { mode: 'pinch', rx: r, lobeR: r * (1 - 0.38 * p), splitY: r * (0.05 + 0.5 * p) };
  } else {
    const pp = (phase.t - 0.85) / 0.15;
    return { mode: 'split', daughterR: r * 0.6, daughterOffsetY: r * (0.6 + 0.04 * pp) };
  }
}

export function cellPointAt(angle, shape, cx, cy) {
  const c = Math.cos(angle), s = Math.sin(angle);
  if (shape.mode === 'circle') return { x: cx + c * shape.r, y: cy + s * shape.r };
  if (shape.mode === 'ellipse') return { x: cx + c * shape.rx, y: cy + s * shape.ry };
  if (shape.mode === 'pinch') {
    const { rx, lobeR, splitY } = shape;
    function dForLobe(off) {
      const A = (c*c)/(rx*rx) + (s*s)/(lobeR*lobeR);
      const B = -2*s*off/(lobeR*lobeR);
      const C = (off*off)/(lobeR*lobeR) - 1;
      const disc = B*B - 4*A*C;
      if (disc < 0) return 0;
      return Math.max(0, (-B + Math.sqrt(disc)) / (2*A));
    }
    const d = Math.max(dForLobe(-splitY), dForLobe(+splitY));
    return { x: cx + c * d, y: cy + s * d };
  }
  if (shape.mode === 'split') {
    const sgn = s < 0 ? -1 : 1;
    return { x: cx + c * shape.daughterR, y: cy + sgn * shape.daughterOffsetY + s * shape.daughterR };
  }
  return { x: cx, y: cy };
}

export function getTowerAnchor(angleDeg, shape, cellX, cellY, cellR) {
  const a = angleDeg * Math.PI / 180;
  const pt = cellPointAt(a, shape, cellX, cellY);
  let scale = 1;
  if (shape.mode === 'pinch') {
    scale = 1 - 0.22 * Math.min(shape.splitY / (cellR * 0.7), 1);
  } else if (shape.mode === 'split') {
    scale = 0.74;
  }
  return { x: pt.x, y: pt.y, scale };
}

// ── Internal chromosome/spindle constants ─────────────────────────────────────

const CHROM_SCATTER = [
  { x: -0.30, y: -0.28 }, { x:  0.32, y: -0.34 },
  { x: -0.33, y:  0.24 }, { x:  0.28, y:  0.30 },
];
const CHROM_EQUATOR_X = [-0.36, -0.12, 0.12, 0.36];

// ── Cell content helpers (all take ctx + time as first two params) ────────────

function drawNucleusInner(ctx, time, cx, cy, nr, alpha, dashedEnvelope) {
  if (alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  const aura = ctx.createRadialGradient(cx, cy, 0, cx, cy, nr * 2.2);
  aura.addColorStop(0, 'rgba(168,200,240,0.30)');
  aura.addColorStop(1, 'rgba(168,200,240,0)');
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(cx, cy, nr * 2.2, 0, Math.PI * 2);
  ctx.fill();
  const ng = ctx.createRadialGradient(cx - nr*0.3, cy - nr*0.3, 0, cx, cy, nr);
  ng.addColorStop(0, '#D6E5F8');
  ng.addColorStop(0.55, '#A8C8F0');
  ng.addColorStop(1, '#5B8FD4');
  ctx.beginPath();
  ctx.arc(cx, cy, nr, 0, Math.PI * 2);
  ctx.fillStyle = ng;
  ctx.shadowBlur = 24;
  ctx.shadowColor = '#A8C8F0';
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.ellipse(cx - nr*0.35, cy - nr*0.4, nr*0.35, nr*0.18, -0.5, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + nr*0.15, cy + nr*0.18, nr*0.22, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(91,143,212,0.55)';
  ctx.fill();
  if (dashedEnvelope) {
    ctx.beginPath();
    ctx.arc(cx, cy, nr * 1.18, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(168,200,240,${0.5 * alpha})`;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 4]);
    ctx.lineDashOffset = -time * 0.3;
    ctx.stroke();
    ctx.setLineDash([]);
  }
  ctx.restore();
}

function drawXChromosomeInner(ctx, x, y, alpha, glow) {
  if (alpha <= 0) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = alpha;
  ctx.shadowBlur = glow ? 16 : 8;
  ctx.shadowColor = glow || '#9B59B6';
  const lg = ctx.createLinearGradient(0, -10, 0, 10);
  lg.addColorStop(0, '#B469C9');
  lg.addColorStop(1, '#6C3483');
  [Math.PI/4, -Math.PI/4].forEach(rot => {
    ctx.save();
    ctx.rotate(rot);
    ctx.beginPath();
    ctx.roundRect(-12, -4, 24, 8, 4);
    ctx.fillStyle = lg;
    ctx.fill();
    ctx.restore();
  });
  ctx.beginPath();
  ctx.ellipse(0, 0, 5, 3, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.fill();
  ctx.restore();
}

function drawChromatinStrandInner(ctx, time, ox, oy, phaseOff, ampX, ampY, alpha) {
  if (alpha <= 0) return;
  const t0 = time * 0.007 + phaseOff, t1 = time * 0.009 + phaseOff + 1;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = '#B07AD0';
  ctx.lineWidth = 2.4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(ox + Math.sin(t0)*ampX,       oy + Math.cos(t1)*ampY);
  ctx.bezierCurveTo(
    ox + Math.sin(t0+1)*ampX,              oy + Math.cos(t1+0.5)*ampY,
    ox + Math.sin(t0+2)*ampX*0.7,          oy + Math.cos(t1+1)*ampY,
    ox + Math.sin(t0+3)*ampX*0.5,          oy + Math.cos(t1+2)*ampY*0.7,
  );
  ctx.stroke();
  ctx.restore();
}

function drawSpindleFiberInner(ctx, time, pole, x, y, alpha, idx) {
  if (alpha <= 0) return;
  const osc = 0.25 + 0.15 * Math.sin(time * 0.03 + idx);
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(pole.x, pole.y);
  const cpx = (pole.x + x) / 2 + (pole.y < y ? -15 : 15);
  ctx.quadraticCurveTo(cpx, (pole.y + y) / 2, x, y);
  ctx.strokeStyle = `rgba(100,200,255,${osc * alpha})`;
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.restore();
}

function drawOrganellesInner(ctx, time, cx, cy, r) {
  for (let i = 0; i < 8; i++) {
    const a  = (i / 8) * Math.PI * 2 + time * 0.003;
    const rr = r * (0.55 + 0.08 * Math.sin(time * 0.01 + i));
    const ox = cx + Math.cos(a) * rr;
    const oy = cy + Math.sin(a) * rr;
    ctx.save();
    ctx.translate(ox, oy);
    ctx.rotate(a + time * 0.002);
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.06, r * 0.035, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(180,150,90,0.28)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,210,140,0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }
}

function drawSimpleMembrane(ctx, time, cx, cy, r) {
  const pulse = Math.sin(time * 0.018);
  ctx.save();
  ctx.beginPath();
  const N = 64;
  for (let i = 0; i <= N; i++) {
    const a    = (i / N) * Math.PI * 2;
    const bump = Math.sin(a * 7 + time * 0.012) * (r * 0.014);
    const rr   = r + bump;
    const px = cx + Math.cos(a) * rr;
    const py = cy + Math.sin(a) * rr;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath();
  const fill = ctx.createRadialGradient(cx - r*0.25, cy - r*0.25, 0, cx, cy, r*1.2);
  fill.addColorStop(0,    'rgba(80,200,200,0.22)');
  fill.addColorStop(0.55, 'rgba(59,175,169,0.18)');
  fill.addColorStop(1,    'rgba(15,60,70,0.5)');
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.shadowBlur  = 22 + pulse * 5;
  ctx.shadowColor = '#3BAFA9';
  ctx.strokeStyle = '#3BAFA9';
  ctx.lineWidth   = 3 + pulse * 1;
  ctx.stroke();
  ctx.restore();
}

function drawMitosisMembrane(ctx, time, cx, cy, shape) {
  const pulse = Math.sin(time * 0.018);
  const maxR  = shape.r || shape.rx ||
                (shape.daughterR != null ? shape.daughterR + Math.abs(shape.daughterOffsetY) : 100);

  ctx.save();
  const aura = ctx.createRadialGradient(cx, cy, maxR * 0.45, cx, cy, maxR * 1.45);
  aura.addColorStop(0, 'rgba(59,175,169,0.10)');
  aura.addColorStop(1, 'rgba(59,175,169,0)');
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(cx, cy, maxR * 1.45, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  if (shape.mode === 'split') {
    drawSimpleMembrane(ctx, time, cx, cy - shape.daughterOffsetY, shape.daughterR);
    drawSimpleMembrane(ctx, time, cx, cy + shape.daughterOffsetY, shape.daughterR);
    return;
  }

  ctx.save();
  ctx.beginPath();
  const N = 110;
  for (let i = 0; i <= N; i++) {
    const a  = (i / N) * Math.PI * 2;
    const pt = cellPointAt(a, shape, cx, cy);
    const dist = Math.hypot(pt.x - cx, pt.y - cy);
    const bump = Math.sin(a * 7  + time * 0.012) * (dist * 0.012)
               + Math.sin(a * 13 - time * 0.018) * (dist * 0.008);
    const px = pt.x + Math.cos(a) * bump;
    const py = pt.y + Math.sin(a) * bump;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath();
  const rxF  = shape.r || shape.rx || 100;
  const fill = ctx.createRadialGradient(cx - rxF*0.25, cy - rxF*0.25, 0, cx, cy, rxF*1.2);
  fill.addColorStop(0,    'rgba(80,200,200,0.20)');
  fill.addColorStop(0.55, 'rgba(59,175,169,0.16)');
  fill.addColorStop(1,    'rgba(15,60,70,0.45)');
  ctx.fillStyle   = fill;
  ctx.fill();
  ctx.shadowBlur  = 28 + pulse * 6;
  ctx.shadowColor = '#3BAFA9';
  ctx.strokeStyle = '#3BAFA9';
  ctx.lineWidth   = 3.5 + pulse * 1;
  ctx.stroke();
  ctx.restore();
}

function drawCellContents(ctx, time, cx, cy, r, phase, shape) {
  const ph = phase.idx;

  if (ph === 0) {
    const nr = r * 0.25 + Math.sin(time * 0.022) * 3;
    drawNucleusInner(ctx, time, cx, cy, nr, 1);
    for (let i = 0; i < 5; i++) {
      const a  = (i / 5) * Math.PI * 2 + time * 0.005;
      const sx = cx + Math.cos(a) * nr * 0.5;
      const sy = cy + Math.sin(a) * nr * 0.5;
      drawChromatinStrandInner(ctx, time, sx, sy, i * 1.3, nr * 0.35, nr * 0.28, 0.55);
    }
    drawOrganellesInner(ctx, time, cx, cy, r);
  }
  else if (ph === 1) {
    const t    = easeInOut(phase.t);
    const nucA = 1 - t;
    if (nucA > 0) drawNucleusInner(ctx, time, cx, cy, r * 0.25, nucA, true);
    CHROM_SCATTER.forEach((p, i) => {
      const px    = cx + p.x * r;
      const py    = cy + p.y * r;
      const delay = i * 0.12;
      const lp    = Math.max(0, Math.min(1, (t - delay) / (1 - delay)));
      drawChromatinStrandInner(ctx, time, px, py, i * 1.5, r * 0.11, r * 0.09, 1 - lp);
      drawXChromosomeInner(ctx, px, py, lp);
    });
  }
  else if (ph === 2) {
    const t = easeInOut(phase.t);
    ctx.save();
    ctx.strokeStyle = `rgba(255,255,255,${0.05 + 0.18 * t})`;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.92, cy);
    ctx.lineTo(cx + r * 0.92, cy);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    const poles = [{ x: cx, y: cy - r * 0.95 }, { x: cx, y: cy + r * 0.95 }];
    CHROM_SCATTER.forEach((p, i) => {
      const x0 = cx + p.x * r;
      const y0 = cy + p.y * r;
      const xT = cx + CHROM_EQUATOR_X[i] * r;
      const ax = x0 + (xT - x0) * t;
      const ay = y0 + (cy - y0) * t;
      if (t > 0.3) {
        poles.forEach((pole, pi) =>
          drawSpindleFiberInner(ctx, time, pole, ax, ay, t, i + pi * 4));
      }
      drawXChromosomeInner(ctx, ax, ay, 1, t > 0.85 ? '#00FFCC' : null);
    });
  }
  else if (ph === 3) {
    const t  = easeInOut(phase.t);
    const ry = r * (1 + 0.14 * t);
    const poles = [{ x: cx, y: cy - ry * 0.95 }, { x: cx, y: cy + ry * 0.95 }];

    if (phase.t < 0.18) {
      const la = 1 - phase.t / 0.18;
      ctx.save();
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        ctx.globalAlpha = la;
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        let px = cx, py = cy;
        for (let step = 0; step < 4; step++) {
          px += Math.cos(angle + Math.sin(step * 47 + i * 13) * 0.7) * 22;
          py += Math.sin(angle + Math.sin(step * 47 + i * 13) * 0.7) * 22;
          ctx.lineTo(px, py);
        }
        ctx.stroke();
      }
      ctx.restore();
    }

    CHROM_EQUATOR_X.forEach((ox, i) => {
      const topY = cy + (cy - ry * 0.78 - cy) * t;
      const botY = cy + (cy + ry * 0.78 - cy) * t;
      poles.forEach((pole, pi) => {
        drawSpindleFiberInner(ctx, time, pole, cx + ox * r,
          pi === 0 ? topY : botY, 1 - t * 0.5, i + pi * 4);
      });
      for (let tr = 1; tr <= 3; tr++) {
        const gy1 = cy + (topY - cy) * (1 - tr * 0.22);
        const gy2 = cy + (botY - cy) * (1 - tr * 0.22);
        const ga  = Math.max(0, (0.16 - tr * 0.04) * t);
        drawXChromosomeInner(ctx, cx + ox * r, gy1, ga);
        drawXChromosomeInner(ctx, cx + ox * r, gy2, ga);
      }
      drawXChromosomeInner(ctx, cx + ox * r, topY, 1);
      drawXChromosomeInner(ctx, cx + ox * r, botY, 1);
    });
  }
  else if (ph === 4) {
    const t    = easeInOut(phase.t);
    const ry   = r * 1.14;
    const topCY = cy - ry * 0.5;
    const botCY = cy + ry * 0.5;
    const nucR  = r * (0.08 + 0.16 * t);

    drawNucleusInner(ctx, time, cx, topCY, nucR, t, t < 0.85);
    drawNucleusInner(ctx, time, cx, botCY, nucR, t, t < 0.85);

    if (t < 0.7) {
      const poleTelo = [{ x: cx, y: cy - ry * 0.95 }, { x: cx, y: cy + ry * 0.95 }];
      CHROM_EQUATOR_X.forEach((ox, i) => {
        poleTelo.forEach((pole, pi) => {
          drawSpindleFiberInner(ctx, time, pole, cx + ox * r,
            pi === 0 ? topCY : botCY, 0.45 * (1 - t / 0.7), i + pi * 4);
        });
      });
    }

    CHROM_EQUATOR_X.forEach((ox, i) => {
      const ca = 1 - t;
      const sa = t * 0.7;
      if (ca > 0) {
        drawXChromosomeInner(ctx, cx + ox * r * 0.6, topCY, ca);
        drawXChromosomeInner(ctx, cx + ox * r * 0.6, botCY, ca);
      }
      if (sa > 0) {
        drawChromatinStrandInner(ctx, time, cx + ox*r*0.5, topCY, i*1.2,   r*0.08, r*0.06, sa);
        drawChromatinStrandInner(ctx, time, cx + ox*r*0.5, botCY, i*1.2+2, r*0.08, r*0.06, sa);
      }
    });
  }
  else if (ph === 5) {
    if (shape.mode === 'pinch') {
      const topCY = cy - shape.splitY * 0.62;
      const botCY = cy + shape.splitY * 0.62;
      const nucR  = r * 0.22;
      drawNucleusInner(ctx, time, cx, topCY, nucR, 1);
      drawNucleusInner(ctx, time, cx, botCY, nucR, 1);
      for (let i = 0; i < 4; i++) {
        const a   = (i / 4) * Math.PI * 2;
        const sx  = cx + Math.cos(a) * nucR * 0.5;
        const dyT = topCY + Math.sin(a) * nucR * 0.5;
        const dyB = botCY + Math.sin(a) * nucR * 0.5;
        drawChromatinStrandInner(ctx, time, sx, dyT, i*1.2,   nucR*0.35, nucR*0.28, 0.5);
        drawChromatinStrandInner(ctx, time, sx, dyB, i*1.2+1, nucR*0.35, nucR*0.28, 0.5);
      }
      ctx.save();
      const pinchProg = Math.min(shape.splitY / (r * 0.7), 1);
      ctx.strokeStyle = `rgba(0,255,200,${0.35 + 0.3 * Math.sin(time * 0.08)})`;
      ctx.lineWidth = 1.8;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.moveTo(cx - r * (0.7 - pinchProg * 0.5), cy);
      ctx.lineTo(cx + r * (0.7 - pinchProg * 0.5), cy);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    } else if (shape.mode === 'split') {
      const topCY = cy - shape.daughterOffsetY;
      const botCY = cy + shape.daughterOffsetY;
      const nucR  = shape.daughterR * 0.32;
      drawNucleusInner(ctx, time, cx, topCY, nucR, 1);
      drawNucleusInner(ctx, time, cx, botCY, nucR, 1);
      drawOrganellesInner(ctx, time, cx, topCY, shape.daughterR);
      drawOrganellesInner(ctx, time, cx, botCY, shape.daughterR);
      const ct = (phase.t - 0.85) / 0.15;
      if (ct > 0 && ct < 1) {
        for (let i = 0; i < 22; i++) {
          const a   = (i / 22) * Math.PI * 2 + i * 0.28;
          const rad = (40 + i * 6) * ct;
          const px  = cx + Math.cos(a) * rad;
          const py  = cy + Math.sin(a) * rad * 0.85;
          const pa  = Math.max(0, 1 - rad / (r * 1.1)) * ct;
          if (pa <= 0) continue;
          ctx.save();
          ctx.globalAlpha = pa;
          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fillStyle   = i % 2 === 0 ? '#3BAFA9' : '#FFD700';
          ctx.shadowBlur  = 6;
          ctx.shadowColor = i % 2 === 0 ? '#3BAFA9' : '#FFD700';
          ctx.fill();
          ctx.restore();
        }
      }
    }
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export function drawCell(ctx, cx, cy, r, phaseState, shape, time) {
  drawMitosisMembrane(ctx, time, cx, cy, shape);

  if (shape.mode !== 'split') {
    ctx.save();
    for (let i = 0; i < 56; i++) {
      const a  = (i / 56) * Math.PI * 2 + time * 0.001;
      const pt = cellPointAt(a, shape, cx, cy);
      ctx.beginPath();
      ctx.arc(pt.x + Math.cos(a) * 3, pt.y + Math.sin(a) * 3, 1.3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(120,220,210,0.45)';
      ctx.fill();
    }
    ctx.restore();
  } else {
    [-1, 1].forEach(sgn => {
      const ccy = cy + sgn * shape.daughterOffsetY;
      const dr  = shape.daughterR;
      ctx.save();
      for (let i = 0; i < 36; i++) {
        const a = (i / 36) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(a) * (dr + 3), ccy + Math.sin(a) * (dr + 3), 1.3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(120,220,210,0.45)';
        ctx.fill();
      }
      ctx.restore();
    });
  }

  drawCellContents(ctx, time, cx, cy, r, phaseState, shape);
}

// Legacy shim so existing callsites still work during transition
export function drawCellPhase(ctx, cx, cy, r, _phaseName, _progress, time) {
  const t = (time / 60) % MITOSIS_TOTAL;
  const phase = getPhase(t);
  const shape = cellShapeForPhase(phase, r);
  drawCell(ctx, cx, cy, r, phase, shape, time);
}
