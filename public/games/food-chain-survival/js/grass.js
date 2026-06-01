/* ===========================================================================
   Grass art — game-ready, top-down procedural grass.
   Tall hiding clumps + edible patches, mostly still with an occasional,
   eased breeze (no jitter). Drawn each frame; geometry is cached per prop.
   Anchored at the root (base fixed); motion lives only in the blade tips.
   =========================================================================== */
(function (global) {
  'use strict';
  const G = global.Game;
  const TAU = G.TAU || Math.PI * 2;
  const lerp = G.lerp || ((a, b, t) => a + (b - a) * t);

  function mulberry(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function hashf(n, seed) { const s = Math.sin(n * 127.1 + seed * 311.7) * 43758.5453; return s - Math.floor(s); }

  // ---- wind: per-clump gust, 0 most of the time, smooth in/out during ~16-28% of a period ----
  const PERIOD = 7.2; // seconds between potential gusts for a given clump
  function gust(t, seed) {
    const idx = Math.floor(t / PERIOD);
    const local = t / PERIOD - idx;
    const r1 = hashf(idx * 1.7 + seed, seed);
    const r2 = hashf(idx * 2.3 + seed + 5, seed);
    if (r2 < 0.34) return 0;                  // many periods stay calm
    const start = 0.08 + r1 * 0.55;
    const dur = 0.16 + r2 * 0.12;
    if (local < start || local > start + dur) return 0;
    const u = (local - start) / dur;
    return Math.sin(u * Math.PI) * (1 + 0.12 * Math.sin(u * Math.PI * 3));
  }
  function windAt(t, seed, scale) {
    const idle = Math.sin(t * 0.55 + seed * 1.3) * 0.09; // barely-there life when calm
    return gust(t, seed) * scale + idle;
  }

  // ---- color helpers ----
  function mix(c1, c2, t) {
    return [Math.round(lerp(c1[0], c2[0], t)), Math.round(lerp(c1[1], c2[1], t)), Math.round(lerp(c1[2], c2[2], t))];
  }
  const rgb = (a) => `rgb(${a[0]},${a[1]},${a[2]})`;

  const TALL_PAL = {
    back: { base: [33, 76, 41], tip: [54, 110, 60] },
    mid: { base: [44, 100, 51], tip: [96, 165, 82] },
    front: { base: [60, 132, 66], tip: [150, 205, 96] },
  };
  const EAT_FRESH = { base: [88, 150, 62], tip: [196, 224, 122] };
  const EAT_DRY = { base: [150, 132, 78], tip: [206, 192, 112] };

  // ---- primitives ----
  function blade(ctx, rx, ry, len, width, tipDX, cBase, cTip, vein) {
    const tipX = rx + tipDX, tipY = ry - len;
    const curl = -tipDX * 0.16;
    const cmx = rx + tipDX * 0.5 + curl, cmy = ry - len * 0.52;
    const hw = width / 2;
    ctx.beginPath();
    ctx.moveTo(rx - hw, ry);
    ctx.quadraticCurveTo(cmx - hw * 0.45, cmy, tipX, tipY);
    ctx.quadraticCurveTo(cmx + hw * 0.45, cmy, rx + hw, ry);
    ctx.closePath();
    const g = ctx.createLinearGradient(rx, ry, tipX, tipY);
    g.addColorStop(0, rgb(cBase)); g.addColorStop(1, rgb(cTip));
    ctx.fillStyle = g; ctx.fill();
    if (vein) {
      ctx.beginPath();
      ctx.moveTo(rx, ry); ctx.quadraticCurveTo(cmx, cmy, tipX, tipY);
      ctx.strokeStyle = 'rgba(' + mix(cTip, [255, 255, 255], 0.35).join(',') + ',0.5)';
      ctx.lineWidth = Math.max(1, width * 0.16); ctx.lineCap = 'round'; ctx.stroke();
    }
  }
  function stubble(ctx, rx, ry, len, width, tipDX, cBase, cTip) {
    const tipX = rx + tipDX, tipY = ry - len, hw = width / 2;
    ctx.beginPath();
    ctx.moveTo(rx - hw, ry);
    ctx.quadraticCurveTo(rx - hw + tipDX * 0.5, ry - len * 0.5, tipX - hw * 0.7, tipY);
    ctx.lineTo(tipX + hw * 0.7, tipY);
    ctx.quadraticCurveTo(rx + hw + tipDX * 0.5, ry - len * 0.5, rx + hw, ry);
    ctx.closePath();
    const g = ctx.createLinearGradient(rx, ry, tipX, tipY);
    g.addColorStop(0, rgb(cBase)); g.addColorStop(1, rgb(cTip));
    ctx.fillStyle = g; ctx.fill();
  }

  // ---- generators (cache on the prop) ----
  function makeTallClump(seed) {
    const r = mulberry(seed * 2654435761 + 99);
    const n = Math.round(17 * (0.78 + r() * 0.5));
    const blades = [];
    for (let i = 0; i < n; i++) {
      const depth = r();
      const rootX = (r() * 2 - 1) * (16 + r() * 8);
      const len = (44 + r() * 44) * (0.85 + depth * 0.3);
      const width = 4.5 + r() * 4.5 + depth * 1.5;
      const restDX = rootX * 0.28 + (r() * 2 - 1) * 5;
      const windScale = (0.55 + depth * 0.85) * (0.7 + r() * 0.5);
      blades.push({ depth, rootX, len, width, restDX, windScale, phase: r() * TAU, hue: r() });
    }
    blades.sort((a, b) => a.depth - b.depth);
    return { seed, blades };
  }
  function makeEdible(seed, fill) {
    const r = mulberry(seed * 40503 + 7);
    const fullN = 15, grow = Math.round(fullN * fill), blades = [];
    for (let i = 0; i < grow; i++) {
      const depth = r();
      const rootX = (r() * 2 - 1) * (20 + r() * 6);
      const len = (16 + r() * 22) * (0.8 + fill * 0.3);
      const width = 4 + r() * 3.5;
      const restDX = rootX * 0.3 + (r() * 2 - 1) * 4;
      blades.push({ depth, rootX, len, width, restDX, windScale: 0.45 + depth * 0.4, phase: r() * TAU });
    }
    blades.sort((a, b) => a.depth - b.depth);
    const stub = [], stubN = Math.round((fullN - grow) * 0.7);
    for (let i = 0; i < stubN; i++) stub.push({ rootX: (r() * 2 - 1) * 26, len: 5 + r() * 7, width: 4 + r() * 3, restDX: (r() * 2 - 1) * 2 });
    const clover = [], cN = Math.round(5 * fill);
    for (let i = 0; i < cN; i++) clover.push({ x: (r() * 2 - 1) * 22, y: -(2 + r() * 8), s: 4 + r() * 3, rot: r() * TAU });
    return { seed, fill, blades, stub, clover };
  }

  // ---- draw (cx, baseY are screen coords; scale multiplies clump size) ----
  function drawTall(ctx, clump, cx, baseY, t, scale) {
    const w = windAt(t, clump.seed, 1) * 13;
    for (const b of clump.blades) {
      const pal = b.depth < 0.34 ? TALL_PAL.back : b.depth < 0.68 ? TALL_PAL.mid : TALL_PAL.front;
      const cBase = mix(pal.base, [20, 45, 24], (1 - b.hue) * 0.18);
      const cTip = mix(pal.tip, [210, 240, 150], b.hue * 0.16);
      const idle = Math.sin(t * 0.6 + b.phase) * 1.1;
      const tipDX = (b.restDX + w * b.windScale + idle) * scale;
      blade(ctx, cx + b.rootX * scale, baseY, b.len * scale, b.width * scale, tipDX, cBase, cTip, b.depth > 0.66);
    }
  }
  function drawEdible(ctx, patch, cx, baseY, t, scale) {
    const w = windAt(t, patch.seed, 0.6) * 5;
    // bare soil shows as the patch is eaten
    const dirtA = (1 - patch.fill) * 0.5 + 0.1;
    ctx.save();
    ctx.globalAlpha = dirtA;
    const dg = ctx.createRadialGradient(cx, baseY, 0, cx, baseY, 30 * scale);
    dg.addColorStop(0, 'rgba(120,92,56,0.9)'); dg.addColorStop(1, 'rgba(120,92,56,0)');
    ctx.fillStyle = dg;
    ctx.save(); ctx.translate(cx, baseY); ctx.scale(1, 0.42); ctx.beginPath(); ctx.arc(0, 0, 30 * scale, 0, TAU); ctx.fill(); ctx.restore();
    ctx.restore();
    for (const s of patch.stub) stubble(ctx, cx + s.rootX * scale, baseY, s.len * scale, s.width * scale, (s.restDX + w * 0.3) * scale, mix(EAT_DRY.base, EAT_FRESH.base, 0.3), mix(EAT_DRY.tip, [225, 215, 150], 0.4));
    for (const c of patch.clover) {
      ctx.save(); ctx.translate(cx + c.x * scale, baseY + c.y * scale); ctx.rotate(c.rot + w * 0.02);
      ctx.fillStyle = rgb([138, 195, 86]);
      for (let k = 0; k < 3; k++) { ctx.save(); ctx.rotate((k / 3) * TAU); ctx.beginPath(); ctx.ellipse(0, -c.s * 0.7 * scale, c.s * 0.5 * scale, c.s * scale, 0, 0, TAU); ctx.fill(); ctx.restore(); }
      ctx.restore();
    }
    for (const b of patch.blades) {
      const tcol = b.depth < 0.5 ? mix(EAT_FRESH.base, EAT_FRESH.tip, 0.4) : EAT_FRESH.tip;
      const idle = Math.sin(t * 0.7 + b.phase) * 0.7;
      const tipDX = (b.restDX + w * b.windScale + idle) * scale;
      blade(ctx, cx + b.rootX * scale, baseY, b.len * scale, b.width * scale, tipDX, mix(EAT_FRESH.base, [70, 120, 50], 0.15), tcol, b.depth > 0.6);
    }
  }

  G.GrassArt = { makeTallClump, makeEdible, drawTall, drawEdible };
})(window);
