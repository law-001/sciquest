/* ===========================================================================
   Pond art — game-ready, top-down procedural water.
   Layered shore → shallows → deep with a drifting shimmer, a bright foam rim,
   lily pads, shoreline stones and swaying reeds. The surface stays calm and
   readable; only a faint, occasional ambient ring breaks it (the snake's own
   warning ripples are drawn separately, on top, by the level).
   Geometry is generated once and cached on the prop. Footprint matches the
   old _pond so collision / drink distances and the snake rings still line up.
   =========================================================================== */
(function (global) {
  'use strict';
  const G = global.Game;
  const TAU = G.TAU || Math.PI * 2;
  const lerp = G.lerp || ((a, b, t) => a + (b - a) * t);
  const clamp = G.clamp || ((v, a, b) => (v < a ? a : v > b ? b : v));

  function mulberry(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function hashf(n, seed) { const s = Math.sin(n * 127.1 + seed * 311.7) * 43758.5453; return s - Math.floor(s); }

  function mix(c1, c2, t) {
    return [Math.round(lerp(c1[0], c2[0], t)), Math.round(lerp(c1[1], c2[1], t)), Math.round(lerp(c1[2], c2[2], t))];
  }
  const rgb = (a, al) => `rgba(${a[0]},${a[1]},${a[2]},${al == null ? 1 : al})`;

  // top-down disc seen at an angle — keeps the old pond's 25/40 aspect
  const SQUASH = 0.625;
  const RX = 40; // base water radius (×prop scale) — matches the old 40×25 ellipse

  // palette
  const SHORE   = [122, 154, 82];
  const SHALLOW = [120, 196, 196];
  const MIDW    = [79, 151, 207];
  const DEEP    = [44, 110, 162];
  const DEEPER  = [30, 80, 122];
  const FOAM    = [222, 242, 250];
  const PAD     = [74, 132, 70];
  const PAD_HI  = [122, 178, 96];
  const REED    = [86, 137, 62];

  // ---- generator (cache on the prop) ----
  function makePond(seed) {
    const r = mulberry(seed * 2654435761 + 17);
    const aspect = 0.94 + r() * 0.14;
    const wobble = [];
    for (let i = 0; i < 7; i++) wobble.push(0.88 + r() * 0.16);

    const pads = [];
    const padN = 1 + Math.floor(r() * 3);
    for (let i = 0; i < padN; i++) {
      const a = r() * TAU, rad = 0.18 + r() * 0.46;
      pads.push({
        x: Math.cos(a) * RX * rad, y: Math.sin(a) * RX * SQUASH * rad,
        s: 6 + r() * 5, notch: r() * TAU, hue: r(),
        flower: r() < 0.3, fcol: r() < 0.5 ? [243, 226, 236] : [248, 224, 130], bob: r() * TAU,
      });
    }
    const reeds = [];
    const reedN = 4 + Math.floor(r() * 4);
    for (let i = 0; i < reedN; i++) {
      const side = r() < 0.72 ? -1 : 1;
      const a = (-Math.PI / 2) + side * (0.18 + r() * 1.05);
      reeds.push({ a, lift: 0.99 + r() * 0.1, h: 18 + r() * 18, lean: (r() * 2 - 1) * 4, cat: r() < 0.45, phase: r() * TAU, ws: 0.6 + r() * 0.6 });
    }
    reeds.sort((p, q) => Math.sin(p.a) - Math.sin(q.a));

    const stones = [];
    const stoneN = 1 + Math.floor(r() * 3);
    for (let i = 0; i < stoneN; i++) stones.push({ a: (Math.PI / 2) + (r() * 2 - 1) * 1.0, lift: 1.0 + r() * 0.07, s: 3 + r() * 4 });

    return { seed, aspect, wobble, pads, reeds, stones, ambOff: r() * 9 };
  }

  function rimMul(p, a) {
    const n = p.wobble.length, f = (a / TAU) * n, i = Math.floor(f) % n, t = f - Math.floor(f);
    const tt = t * t * (3 - 2 * t);
    return lerp(p.wobble[i], p.wobble[(i + 1) % n], tt);
  }
  function rimPoint(p, a, rad, scale) {
    const m = rimMul(p, a) * rad;
    return [Math.cos(a) * RX * p.aspect * m * scale, Math.sin(a) * RX * SQUASH * m * scale];
  }
  function basinPath(ctx, cx, cy, p, rad, scale) {
    ctx.beginPath();
    const steps = 40;
    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * TAU, pt = rimPoint(p, a, rad, scale);
      if (i === 0) ctx.moveTo(cx + pt[0], cy + pt[1]); else ctx.lineTo(cx + pt[0], cy + pt[1]);
    }
    ctx.closePath();
  }

  // a soft ring drifts in occasionally — calm, never busy (stateless: derived from t)
  function ambientRing(t, p) {
    const T = 6.4, phase = t / T + p.ambOff, cycle = Math.floor(phase), local = phase - cycle;
    if (hashf(cycle * 1.3 + 0.5, p.seed) < 0.46) return null; // many cycles stay glassy
    const span = 0.72;
    if (local > span) return null;
    const k = local / span;
    return { x: (hashf(cycle * 2.1, p.seed) * 2 - 1) * RX * 0.5, y: (hashf(cycle * 3.7, p.seed) * 2 - 1) * RX * 0.32 * SQUASH, k };
  }
  // occasional eased reed gust, à la the grass
  function reedGust(t, seed) {
    const P = 6.8, idx = Math.floor(t / P), local = t / P - idx;
    const r1 = hashf(idx * 1.7 + seed, seed), r2 = hashf(idx * 2.3 + seed + 5, seed);
    if (r2 < 0.4) return 0;
    const start = 0.1 + r1 * 0.5, dur = 0.18 + r2 * 0.12;
    if (local < start || local > start + dur) return 0;
    const u = (local - start) / dur;
    return Math.sin(u * Math.PI) * (1 + 0.1 * Math.sin(u * Math.PI * 3));
  }

  // ---- draw (cx, cy are screen coords; scale = prop scale) ----
  function drawPond(ctx, p, cx, cy, t, scale) {
    const rx = RX * scale;

    // ground depression shadow
    ctx.save();
    const sg = ctx.createRadialGradient(cx, cy + 5 * scale, rx * 0.3, cx, cy + 5 * scale, rx * 1.2);
    sg.addColorStop(0, 'rgba(20,40,22,0.4)'); sg.addColorStop(1, 'rgba(20,40,22,0)');
    ctx.fillStyle = sg;
    ctx.translate(cx, cy + 5 * scale); ctx.scale(1, SQUASH); ctx.beginPath(); ctx.arc(0, 0, rx * 1.2, 0, TAU); ctx.fill();
    ctx.restore();

    // damp grassy bank + wet mud ring
    basinPath(ctx, cx, cy, p, 1.22, scale); ctx.fillStyle = rgb(SHORE); ctx.fill();
    basinPath(ctx, cx, cy, p, 1.09, scale); ctx.fillStyle = rgb(mix([120, 96, 60], SHORE, 0.18)); ctx.fill();

    // ---- water body, clipped to the rim ----
    ctx.save();
    basinPath(ctx, cx, cy, p, 1.0, scale); ctx.clip();

    const wg = ctx.createRadialGradient(cx - rx * 0.22, cy - rx * 0.2 * SQUASH, rx * 0.06, cx, cy, rx * 1.02);
    wg.addColorStop(0, rgb(mix(MIDW, [255, 255, 255], 0.16)));
    wg.addColorStop(0.45, rgb(MIDW));
    wg.addColorStop(0.78, rgb(mix(MIDW, DEEP, 0.7)));
    wg.addColorStop(1, rgb(DEEPER));
    ctx.fillStyle = wg;
    ctx.fillRect(cx - rx * 1.3, cy - rx * 1.0, rx * 2.6, rx * 2.0);

    // greenish shallows hugging the shore
    ctx.save();
    ctx.globalCompositeOperation = 'source-atop'; ctx.globalAlpha = 0.5;
    basinPath(ctx, cx, cy, p, 1.0, scale);
    const shg = ctx.createRadialGradient(cx, cy, rx * 0.62, cx, cy, rx * 1.02);
    shg.addColorStop(0, rgb(SHALLOW, 0)); shg.addColorStop(0.7, rgb(SHALLOW, 0)); shg.addColorStop(1, rgb(SHALLOW, 0.85));
    ctx.fillStyle = shg; ctx.fill();
    ctx.restore();

    // drifting shimmer / caustics
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 4; i++) {
      const ph = t * (0.22 + i * 0.05) + i * 2.1 + p.seed;
      const sx = cx + Math.cos(ph) * rx * 0.32 - rx * 0.15;
      const sy = cy + Math.sin(ph * 0.8) * rx * 0.2 * SQUASH - rx * 0.16 * SQUASH;
      const rr = rx * (0.4 + 0.12 * Math.sin(ph * 1.3));
      const a = 0.05 + 0.04 * (0.5 + 0.5 * Math.sin(ph * 1.7));
      const cg = ctx.createRadialGradient(sx, sy, 0, sx, sy, rr);
      cg.addColorStop(0, rgb([210, 240, 252], a)); cg.addColorStop(1, rgb([210, 240, 252], 0));
      ctx.fillStyle = cg;
      ctx.save(); ctx.translate(sx, sy); ctx.scale(1, SQUASH); ctx.beginPath(); ctx.arc(0, 0, rr, 0, TAU); ctx.fill(); ctx.restore();
    }
    ctx.restore();

    // soft sky-sheen streak, upper-left
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = rgb([255, 255, 255], 0.45);
    ctx.beginPath(); ctx.ellipse(cx - rx * 0.28, cy - rx * 0.26 * SQUASH, rx * 0.46, rx * 0.22, -0.5, 0, TAU); ctx.fill();
    ctx.restore();

    // lily pads
    for (const pad of p.pads) {
      const bob = Math.sin(t * 0.8 + pad.bob) * 1.0 * scale;
      const px = cx + pad.x * scale, py = cy + pad.y * scale + bob, ps = pad.s * scale;
      ctx.fillStyle = 'rgba(16,48,60,0.22)';
      ctx.save(); ctx.translate(px + 1.5 * scale, py + 2 * scale); ctx.scale(1, SQUASH); ctx.beginPath(); ctx.arc(0, 0, ps, 0, TAU); ctx.fill(); ctx.restore();
      const base = mix(PAD, [40, 92, 56], pad.hue * 0.4);
      ctx.save(); ctx.translate(px, py); ctx.scale(1, SQUASH);
      ctx.fillStyle = rgb(base);
      ctx.beginPath(); ctx.arc(0, 0, ps, pad.notch + 0.5, pad.notch - 0.5 + TAU); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = rgb(PAD_HI, 0.6); ctx.lineWidth = 1.2 * scale;
      ctx.beginPath(); ctx.arc(0, 0, ps * 0.96, pad.notch + 0.6, pad.notch - 0.6 + TAU); ctx.stroke();
      ctx.strokeStyle = rgb(mix(base, [20, 50, 30], 0.5), 0.5); ctx.lineWidth = 1 * scale;
      for (let v = 0; v < 4; v++) { const va = pad.notch + Math.PI + (v - 1.5) * 0.4; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(va) * ps * 0.85, Math.sin(va) * ps * 0.85); ctx.stroke(); }
      ctx.restore();
      if (pad.flower) {
        ctx.save(); ctx.translate(px - ps * 0.2, py - ps * 0.2);
        ctx.fillStyle = rgb(pad.fcol);
        for (let k = 0; k < 6; k++) { const fa = (k / 6) * TAU; ctx.beginPath(); ctx.ellipse(Math.cos(fa) * 2.2 * scale, Math.sin(fa) * 2.2 * scale * SQUASH, 2.4 * scale, 1.4 * scale, fa, 0, TAU); ctx.fill(); }
        ctx.fillStyle = rgb([248, 206, 92]); ctx.beginPath(); ctx.arc(0, 0, 1.6 * scale, 0, TAU); ctx.fill();
        ctx.restore();
      }
    }

    // faint ambient ring (inside the clip so it sits on the surface)
    const ring = ambientRing(t, p);
    if (ring) {
      const rad = ring.k * rx * 0.62, alpha = (1 - ring.k) * (1 - ring.k) * 0.5;
      ctx.lineWidth = lerp(1.8, 0.5, ring.k) * scale;
      ctx.strokeStyle = rgb(FOAM, alpha * 0.85);
      ctx.beginPath(); ctx.ellipse(cx + ring.x * scale, cy + ring.y * scale, rad, rad * SQUASH, 0, 0, TAU); ctx.stroke();
    }
    ctx.restore(); // end water clip

    // bright meniscus / foam rim
    basinPath(ctx, cx, cy, p, 1.0, scale); ctx.strokeStyle = rgb(FOAM, 0.7); ctx.lineWidth = 2 * scale; ctx.stroke();
    basinPath(ctx, cx, cy, p, 1.0, scale); ctx.strokeStyle = rgb(DEEPER, 0.32); ctx.lineWidth = 1 * scale; ctx.stroke();

    // shoreline stones (front)
    for (const st of p.stones) {
      const pt = rimPoint(p, st.a, st.lift, scale), sx = cx + pt[0], sy = cy + pt[1], ss = st.s * scale;
      ctx.fillStyle = 'rgba(20,40,22,0.25)';
      ctx.save(); ctx.translate(sx + 1.2 * scale, sy + 1.6 * scale); ctx.scale(1, 0.55); ctx.beginPath(); ctx.arc(0, 0, ss, 0, TAU); ctx.fill(); ctx.restore();
      const g = ctx.createLinearGradient(sx - ss, sy - ss, sx + ss, sy + ss);
      g.addColorStop(0, rgb([176, 170, 158])); g.addColorStop(1, rgb([122, 116, 104]));
      ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(sx, sy - ss * 0.3, ss, ss * 0.8, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = rgb([198, 192, 180], 0.6); ctx.beginPath(); ctx.ellipse(sx - ss * 0.25, sy - ss * 0.55, ss * 0.45, ss * 0.3, -0.4, 0, TAU); ctx.fill();
    }

    // reeds & cattails along the rim
    for (const rd of p.reeds) {
      const pt = rimPoint(p, rd.a, rd.lift, scale), bx = cx + pt[0], by = cy + pt[1];
      const sway = (Math.sin(t * 0.7 + rd.phase) * 1.0 + reedGust(t, p.seed + rd.phase) * 3.2) * rd.ws * scale;
      const h = rd.h * scale, tipX = bx + rd.lean * scale + sway, tipY = by - h;
      const midX = bx + rd.lean * 0.5 * scale + sway * 0.5, midY = by - h * 0.55;
      ctx.strokeStyle = rgb(mix(REED, [40, 80, 40], 0.2)); ctx.lineWidth = 2.2 * scale; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.quadraticCurveTo(midX, midY, tipX, tipY); ctx.stroke();
      ctx.strokeStyle = rgb(mix(REED, [180, 220, 120], 0.5), 0.7); ctx.lineWidth = 0.9 * scale;
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.quadraticCurveTo(midX, midY, tipX, tipY); ctx.stroke();
      if (rd.cat) {
        const rot = Math.atan2(tipX - midX, -(tipY - midY));
        ctx.fillStyle = rgb([122, 84, 48]); ctx.beginPath(); ctx.ellipse(tipX, tipY + 2.5 * scale, 2.1 * scale, 5 * scale, rot, 0, TAU); ctx.fill();
        ctx.fillStyle = rgb([150, 108, 64], 0.6); ctx.beginPath(); ctx.ellipse(tipX - 0.6 * scale, tipY + 1.2 * scale, 0.9 * scale, 3.4 * scale, rot, 0, TAU); ctx.fill();
      }
    }
  }

  G.PondArt = { makePond, drawPond };
})(window);
