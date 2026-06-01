/* ===========================================================================
   World — procedural terrain + props, drawn to an offscreen canvas once,
   then blitted each frame with camera offset. Props (bushes, burrows, logs)
   double as gameplay blockers / hiding spots.
   =========================================================================== */
(function (global) {
  'use strict';
  const G = global.Game;
  const { rand, randi, TAU, clamp } = G;

  // seeded RNG so a level looks the same each run
  function mulberry(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  // interpolate between two [r,g,b] colours → css rgb() string (t: 0..1)
  const mixc = (a, b, t) => `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)},${Math.round(a[1] + (b[1] - a[1]) * t)},${Math.round(a[2] + (b[2] - a[2]) * t)})`;

  const PALETTES = {
    meadow: { base: '#9ccb63', base2: '#8cbf57', dirt: '#c8a878', patch: '#b7d878' },
    forest: { base: '#7eb45a', base2: '#6fa84e', dirt: '#b39468', patch: '#9ec96a' },
    floor: { base: '#6f9a52', base2: '#638c49', dirt: '#7a5e3e', patch: '#85a85c' },
  };

  class World {
    constructor(w, h, opts = {}) {
      this.w = w; this.h = h;
      // impassable boundary band hugging the world edge (px). The player is kept
      // this far inside so the sprite never pokes past the terrain into the void.
      this.border = opts.border != null ? opts.border : 30;
      this.pal = PALETTES[opts.palette || 'meadow'];
      this.seed = opts.seed || 12345;
      this.rng = mulberry(this.seed);
      this.props = [];      // {type,x,y,r,...} decorative + blockers
      this.blockers = [];   // {x,y,r} for LOS / collision (subset of props)
      this.bg = null;
      this._buildGround();
    }
    rrand(a, b) { return a + this.rng() * (b - a); }

    _buildGround() {
      const c = document.createElement('canvas');
      c.width = this.w; c.height = this.h;
      const ctx = c.getContext('2d');
      const p = this.pal;
      // base fill
      ctx.fillStyle = p.base; ctx.fillRect(0, 0, this.w, this.h);
      // mottled blotches for depth
      for (let i = 0; i < (this.w * this.h) / 9000; i++) {
        const x = this.rng() * this.w, y = this.rng() * this.h, r = this.rrand(30, 90);
        ctx.fillStyle = this.rng() < 0.5 ? p.base2 : p.patch;
        ctx.globalAlpha = this.rrand(0.05, 0.16);
        ctx.beginPath(); ctx.ellipse(x, y, r, r * 0.7, 0, 0, TAU); ctx.fill();
      }
      ctx.globalAlpha = 1;
      // scattered grass blade tufts (decorative, not blockers)
      for (let i = 0; i < (this.w * this.h) / 2600; i++) {
        const x = this.rng() * this.w, y = this.rng() * this.h;
        this._grassTuft(ctx, x, y, this.rrand(0.7, 1.3));
      }
      // subtle vignette edges
      const g = ctx.createRadialGradient(this.w / 2, this.h / 2, Math.min(this.w, this.h) * 0.35, this.w / 2, this.h / 2, Math.max(this.w, this.h) * 0.62);
      g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(30,46,18,0.20)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, this.w, this.h);
      this._drawBorder(ctx);
      this.bg = c;
    }
    // dense dark hedge ring marking the impassable world edge
    _drawBorder(ctx) {
      const W = this.w, H = this.h, depth = this.border + 40;
      ctx.save();
      // shaded band fading inward from each edge
      const band = (x, y, w, h, x0, y0, x1, y1) => {
        const g = ctx.createLinearGradient(x0, y0, x1, y1);
        g.addColorStop(0, 'rgba(18,30,10,0.62)');
        g.addColorStop(0.5, 'rgba(18,30,10,0.28)');
        g.addColorStop(1, 'rgba(18,30,10,0)');
        ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
      };
      band(0, 0, W, depth, 0, 0, 0, depth);                 // top
      band(0, H - depth, W, depth, 0, H, 0, H - depth);     // bottom
      band(0, 0, depth, H, 0, 0, depth, 0);                 // left
      band(W - depth, 0, depth, H, W, 0, W - depth, 0);     // right
      // dense dark tufts crowding the very edge into a thicket
      const step = 18;
      for (let x = 6; x < W; x += step) {
        this._darkTuft(ctx, x + this.rrand(-4, 4), this.rrand(4, this.border), this.rrand(0.9, 1.5));
        this._darkTuft(ctx, x + this.rrand(-4, 4), H - this.rrand(4, this.border), this.rrand(0.9, 1.5));
      }
      for (let y = 6; y < H; y += step) {
        this._darkTuft(ctx, this.rrand(4, this.border), y + this.rrand(-4, 4), this.rrand(0.9, 1.5));
        this._darkTuft(ctx, W - this.rrand(4, this.border), y + this.rrand(-4, 4), this.rrand(0.9, 1.5));
      }
      ctx.restore();
    }
    _darkTuft(ctx, x, y, s) {
      ctx.strokeStyle = this.rng() < 0.5 ? '#2f5024' : '#26421d';
      ctx.lineWidth = 2.4 * s; ctx.lineCap = 'round';
      for (let b = 0; b < 4; b++) {
        const ox = (b - 1.5) * 3.2 * s, lean = this.rrand(-3.5, 3.5);
        ctx.beginPath(); ctx.moveTo(x + ox, y);
        ctx.quadraticCurveTo(x + ox + lean, y - 11 * s, x + ox + lean * 1.6, y - 18 * s);
        ctx.stroke();
      }
    }
    _grassTuft(ctx, x, y, s) {
      ctx.strokeStyle = this.rng() < 0.5 ? '#7fb24e' : '#a7d063';
      ctx.lineWidth = 2 * s; ctx.lineCap = 'round';
      for (let b = 0; b < 3; b++) {
        const ox = (b - 1) * 3 * s, lean = this.rrand(-3, 3);
        ctx.beginPath(); ctx.moveTo(x + ox, y); ctx.quadraticCurveTo(x + ox + lean, y - 7 * s, x + ox + lean * 1.5, y - 12 * s); ctx.stroke();
      }
    }

    addProp(prop) { this.props.push(prop); if (prop.block) this.blockers.push({ x: prop.x, y: prop.y - (prop.by || 0), r: prop.br || prop.r }); }

    // scatter helpers used by levels
    scatter(type, count, opts = {}) {
      const margin = opts.margin || 80;
      for (let i = 0; i < count; i++) {
        let x, y, ok, tries = 0;
        do {
          x = this.rrand(margin, this.w - margin); y = this.rrand(margin, this.h - margin); ok = true;
          for (const pr of this.props) if (G.dist(x, y, pr.x, pr.y) < (opts.spacing || 70)) { ok = false; break; }
          if (opts.avoid) for (const a of opts.avoid) if (G.dist(x, y, a.x, a.y) < (a.r || 120)) { ok = false; break; }
        } while (!ok && ++tries < 30);
        this.addProp(Object.assign({ type, x, y, s: this.rrand(opts.sMin || 0.85, opts.sMax || 1.2) }, opts.props ? opts.props(this) : {}));
      }
    }

    draw(ctx, cam) {
      ctx.drawImage(this.bg, cam.x, cam.y, cam.vw, cam.vh, 0, 0, cam.vw, cam.vh);
    }

    // draw props that are behind / around player; we sort all dynamic draws by y in the scene
    drawProp(ctx, cam, pr) {
      const x = pr.x - cam.x, y = pr.y - cam.y, s = pr.s || 1;
      switch (pr.type) {
        case 'bush': this._bush(ctx, x, y, s, pr); break;
        case 'tallgrass': this._tallGrass(ctx, x, y, s, pr); break;
        case 'tree': this._tree(ctx, x, y, s); break;
        case 'rock': this._rock(ctx, x, y, s); break;
        case 'burrow': this._burrow(ctx, x, y, s, pr); break;
        case 'flower': this._flower(ctx, x, y, s, pr); break;
        case 'grasspatch': this._grassPatch(ctx, x, y, s, pr); break;
        case 'pond': this._pond(ctx, x, y, s, pr); break;
        case 'log': this._log(ctx, x, y, s, pr); break;
        case 'worldtree': this._worldTree(ctx, x, y, s, pr); break;
        case 'leaflitter': this._leaf(ctx, x, y, s, pr); break;
        case 'carcass': this._carcass(ctx, x, y, s, pr); break;
        case 'deadpatch': this._deadPatch(ctx, x, y, s, pr); break;
      }
    }
    _shadow(ctx, x, y, rx, ry) { ctx.globalAlpha = 0.18; ctx.fillStyle = '#1c2a12'; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, TAU); ctx.fill(); ctx.globalAlpha = 1; }

    _bush(ctx, x, y, s, pr) {
      this._shadow(ctx, x, y, 26 * s, 9 * s);
      const lobes = [[-14, -10, 16], [12, -8, 15], [0, -20, 18], [-6, -6, 14], [8, -4, 13]];
      ctx.fillStyle = '#5d9440';
      for (const [dx, dy, r] of lobes) { ctx.beginPath(); ctx.arc(x + dx * s, y + dy * s, r * s, 0, TAU); ctx.fill(); }
      ctx.fillStyle = '#6fab4d';
      for (const [dx, dy, r] of lobes) { ctx.beginPath(); ctx.arc(x + dx * s - 2 * s, y + dy * s - 3 * s, r * 0.8 * s, 0, TAU); ctx.fill(); }
      ctx.fillStyle = '#84c25e';
      ctx.beginPath(); ctx.arc(x - 3 * s, y - 22 * s, 9 * s, 0, TAU); ctx.fill();
    }
    _tallGrass(ctx, x, y, s, pr) {
      this._shadow(ctx, x, y, 22 * s, 7 * s);
      const GA = G.GrassArt;
      if (GA) {
        if (!pr._tg) pr._tg = GA.makeTallClump((pr.x * 131 + pr.y * 17) | 0);
        GA.drawTall(ctx, pr._tg, x, y, performance.now() / 1000, s * 0.85);
        return;
      }
      const r = pr._r || (pr._r = mulberry((x * 131 + y * 17) | 0));
      ctx.lineCap = 'round';
      for (let i = 0; i < 16; i++) {
        const ox = (r() - 0.5) * 44 * s, h = (22 + r() * 20) * s, lean = (r() - 0.5) * 14 * s;
        ctx.strokeStyle = i % 2 ? '#6fa544' : '#8cc056'; ctx.lineWidth = 3 * s;
        ctx.beginPath(); ctx.moveTo(x + ox, y); ctx.quadraticCurveTo(x + ox + lean * 0.5, y - h * 0.6, x + ox + lean, y - h); ctx.stroke();
      }
    }
    _tree(ctx, x, y, s) {
      this._shadow(ctx, x, y, 40 * s, 12 * s);
      ctx.fillStyle = '#7a5a36'; ctx.fillRect(x - 6 * s, y - 46 * s, 12 * s, 46 * s);
      ctx.fillStyle = '#3f6b2e'; ctx.beginPath(); ctx.arc(x, y - 70 * s, 42 * s, 0, TAU); ctx.fill();
      ctx.fillStyle = '#4e8038'; ctx.beginPath(); ctx.arc(x - 16 * s, y - 78 * s, 28 * s, 0, TAU); ctx.arc(x + 18 * s, y - 72 * s, 30 * s, 0, TAU); ctx.fill();
      ctx.fillStyle = '#5f9a45'; ctx.beginPath(); ctx.arc(x - 6 * s, y - 88 * s, 22 * s, 0, TAU); ctx.fill();
    }
    _rock(ctx, x, y, s) {
      this._shadow(ctx, x, y, 24 * s, 8 * s);
      ctx.fillStyle = '#9a9488'; ctx.beginPath();
      ctx.moveTo(x - 22 * s, y); ctx.lineTo(x - 14 * s, y - 18 * s); ctx.lineTo(x + 6 * s, y - 22 * s); ctx.lineTo(x + 22 * s, y - 6 * s); ctx.lineTo(x + 16 * s, y); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#b4 aeA2'.replace(' ', ''); ctx.fillStyle = '#b6b0a2';
      ctx.beginPath(); ctx.moveTo(x - 14 * s, y - 18 * s); ctx.lineTo(x + 6 * s, y - 22 * s); ctx.lineTo(x + 2 * s, y - 12 * s); ctx.lineTo(x - 10 * s, y - 10 * s); ctx.closePath(); ctx.fill();
    }
    _burrow(ctx, x, y, s, pr) {
      this._shadow(ctx, x, y, 30 * s, 12 * s);
      ctx.fillStyle = '#8a6b46'; ctx.beginPath(); ctx.ellipse(x, y - 4 * s, 28 * s, 18 * s, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = '#2b1d10'; ctx.beginPath(); ctx.ellipse(x, y - 6 * s, 17 * s, 12 * s, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = '#5d9440';
      for (let i = 0; i < 7; i++) { const a = Math.PI + i / 6 * Math.PI; ctx.beginPath(); ctx.arc(x + Math.cos(a) * 26 * s, y - 4 * s + Math.sin(a) * 15 * s, 6 * s, 0, TAU); ctx.fill(); }
    }
    _flower(ctx, x, y, s, pr) {
      const col = pr.color || '#f2d24b';
      ctx.strokeStyle = '#5d9440'; ctx.lineWidth = 2 * s; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - 12 * s); ctx.stroke();
      ctx.fillStyle = col; for (let i = 0; i < 5; i++) { const a = i / 5 * TAU; ctx.beginPath(); ctx.arc(x + Math.cos(a) * 5 * s, y - 12 * s + Math.sin(a) * 5 * s, 4 * s, 0, TAU); ctx.fill(); }
      ctx.fillStyle = '#f7a83a'; ctx.beginPath(); ctx.arc(x, y - 12 * s, 3.5 * s, 0, TAU); ctx.fill();
    }
    _grassPatch(ctx, x, y, s, pr) {
      // edible clover/grass patch; depletes when eaten (pr.eaten)
      const GA = G.GrassArt;
      if (GA) {
        const fill = pr.eaten ? 0.12 : 1;
        if (!pr._ep || pr._epFill !== fill) { pr._ep = GA.makeEdible((pr.x * 71 + pr.y * 29) | 0, fill); pr._epFill = fill; }
        GA.drawEdible(ctx, pr._ep, x, y, performance.now() / 1000, s * 0.72);
        return;
      }
      const a = pr.eaten ? 0.25 : 1;
      ctx.globalAlpha = a;
      ctx.fillStyle = '#d8e9a0'; ctx.beginPath(); ctx.ellipse(x, y, 22 * s, 14 * s, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = pr.eaten ? '#9bbf63' : '#7fb24e'; ctx.lineWidth = 2.4 * s; ctx.lineCap = 'round';
      const r = pr._r || (pr._r = mulberry((x * 71 + y * 29) | 0));
      for (let i = 0; i < 9; i++) { const ox = (r() - 0.5) * 34 * s, h = (8 + r() * 8) * s; ctx.beginPath(); ctx.moveTo(x + ox, y + 4 * s); ctx.lineTo(x + ox + (r() - 0.5) * 6 * s, y + 4 * s - h); ctx.stroke(); }
      if (!pr.eaten) { ctx.fillStyle = '#c0e25a'; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(x + (r() - 0.5) * 26 * s, y + (r() - 0.5) * 12 * s, 3 * s, 0, TAU); ctx.fill(); } }
      ctx.globalAlpha = 1;
    }
    _pond(ctx, x, y, s, pr) {
      const PA = G.PondArt;
      if (PA) {
        if (!pr._pond) pr._pond = PA.makePond((pr.x * 41 + pr.y * 67) | 0);
        PA.drawPond(ctx, pr._pond, x, y, performance.now() / 1000, s);
        return;
      }
      // damp shore ring
      ctx.fillStyle = '#7a9a52'; ctx.beginPath(); ctx.ellipse(x, y, 50 * s, 33 * s, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = '#6f5e3e'; ctx.globalAlpha = 0.35; ctx.beginPath(); ctx.ellipse(x, y, 44 * s, 28 * s, 0, 0, TAU); ctx.fill(); ctx.globalAlpha = 1;
      // water body
      const g = ctx.createRadialGradient(x - 10 * s, y - 8 * s, 4, x, y, 42 * s);
      g.addColorStop(0, '#86c8e8'); g.addColorStop(0.6, '#4f97cf'); g.addColorStop(1, '#3877b4');
      ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y, 40 * s, 25 * s, 0, 0, TAU); ctx.fill();
      // ripples
      const r = pr._r || (pr._r = mulberry((x * 41 + y * 67) | 0));
      ctx.strokeStyle = 'rgba(255,255,255,.30)'; ctx.lineCap = 'round';
      const ph = (pr._ph = (pr._ph || 0) + 0.012);
      for (let i = 0; i < 3; i++) {
        const rr = (8 + i * 9 + Math.sin(ph + i) * 2) * s;
        ctx.lineWidth = (2 - i * 0.4) * s; ctx.globalAlpha = 0.4 - i * 0.1;
        ctx.beginPath(); ctx.ellipse(x + (r() - 0.5) * 10 * s, y - 2 * s, rr, rr * 0.55, 0, 0, TAU); ctx.stroke();
      }
      ctx.globalAlpha = 1;
      // a couple of reeds at the edge
      ctx.strokeStyle = '#5f8f3e'; ctx.lineWidth = 2.4 * s;
      for (let i = 0; i < 4; i++) { const a = Math.PI * 0.15 + i * 0.5; const ex = x + Math.cos(a) * 42 * s, ey = y + Math.sin(a) * 25 * s; ctx.beginPath(); ctx.moveTo(ex, ey); ctx.quadraticCurveTo(ex + 2 * s, ey - 16 * s, ex - 2 * s, ey - 24 * s); ctx.stroke(); }
    }
    // The central restoration tree. Stage 1 (dying) → 7 (blooming). A short
    // crossfade smooths each stage swap; sprites share a baseline so the trunk
    // stays put. Bottom-anchored so it sits on the ground and depth-sorts by base.
    _worldTree(ctx, x, y, s, pr) {
      const TA = G.TreeArt;
      const sc = (s || 1);
      const drawStage = (stage, alpha) => {
        const img = TA && TA.img(stage);
        if (!img || !img.complete || !img.naturalWidth) return false;
        const w = img.naturalWidth * sc, h = img.naturalHeight * sc;
        ctx.save(); ctx.globalAlpha = alpha;
        ctx.drawImage(img, x - w / 2, y - h + 4 * sc, w, h);
        ctx.restore();
        return true;
      };
      // current stage (no ground shadow — the sprite carries its own base)
      const cur = pr.stage || 1;
      // crossfade from the previous stage while pr._fade ramps 0→1
      if (pr._prevStage && pr._prevStage !== cur && (pr._fade || 0) < 1) {
        drawStage(pr._prevStage, 1 - pr._fade);
        if (!drawStage(cur, pr._fade)) drawStage(pr._prevStage, 1);
      } else if (!drawStage(cur, 1)) {
        // procedural fallback if the sprite hasn't loaded yet
        ctx.fillStyle = '#6f5436'; ctx.fillRect(x - 8 * sc, y - 70 * sc, 16 * sc, 70 * sc);
        ctx.fillStyle = cur >= 5 ? '#4d8f43' : cur >= 3 ? '#6fa84e' : '#8a9a5b';
        ctx.beginPath(); ctx.arc(x, y - 80 * sc, 42 * sc, 0, TAU); ctx.fill();
      }
    }
    _log(ctx, x, y, s, pr) {
      // Sliced decomposition sprites (see js/logdecomp.js):
      //   • spawn   → ONE fixed random log/fungus state, kept for the prop's life
      //   • eaten   → swapped to a random dirt patch (pr._dirtSprite) on completion
      // No stage scrubbing while being eaten — the worm pops it straight to dirt.
      const LD = G.LogDecomp;
      if (LD && !pr._logSprite) pr._logSprite = LD.pickLog(); // lazy fallback if spawn didn't set it
      const name = (pr.decomposed && pr._dirtSprite) ? pr._dirtSprite : pr._logSprite;
      const img = (LD && name) ? LD.img(name) : null;
      if (img && img.complete && img.naturalWidth) {
        const sc = (s || 1) * 0.62;
        const w = img.naturalWidth * sc, h = img.naturalHeight * sc;
        // ground-contact shadow + bottom-anchored sprite (foot sits ~6px below the prop point)
        this._shadow(ctx, x, y + 2 * s, w * 0.40, h * 0.18);
        ctx.drawImage(img, x - w / 2, y - h + 6 * s, w, h);
        return;
      }
      // ---- procedural fallback (if a sprite hasn't loaded) ----
      const d = clamp(pr.decomposed ? 1 : (pr.decomp || 0), 0, 1);
      const len = 40 * s, hgt = (16 - d * 5) * s, sink = d * 5 * s, yb = y + sink;
      this._shadow(ctx, x, yb + 4 * s, len * 0.92, hgt * 0.7 + 3 * s);
      const bark = mixc([138, 106, 68], [96, 84, 64], d);
      ctx.fillStyle = bark;
      ctx.beginPath(); ctx.roundRect(x - len, yb - hgt, len * 2, hgt + 6 * s, hgt * 0.55); ctx.fill();
      ctx.fillStyle = mixc([170, 134, 91], [124, 110, 84], d);
      ctx.beginPath(); ctx.ellipse(x - len, yb - hgt * 0.42, 6.5 * s, hgt * 0.6, 0, 0, TAU); ctx.fill();
    }
    _leaf(ctx, x, y, s, pr) {
      // d: decomposition 0 (crisp pile) → 1 (rotted into humus). Drives the eat decay.
      const d = clamp(pr.decomposed ? 1 : (pr.decomp || 0), 0, 1);
      const r = pr._r || (pr._r = mulberry((x * 53 + y * 91) | 0));
      this._shadow(ctx, x, y + 3 * s, 24 * s, 8 * s);
      // dark humus showing through more as the pile rots down
      if (d > 0.25) {
        ctx.fillStyle = `rgba(70,54,34,${(d - 0.25) * 0.5})`;
        ctx.beginPath(); ctx.ellipse(x, y + 2 * s, 18 * s, 9 * s, 0, 0, TAU); ctx.fill();
      }
      const fresh = [[201, 138, 58], [216, 166, 74], [185, 112, 47], [170, 96, 40]];
      const rot = [[112, 92, 60], [96, 78, 50], [84, 68, 44]];
      const n = 12;
      const rs = mulberry((x * 17 + y * 43) | 0); // stable per-leaf placement
      for (let i = 0; i < n; i++) {
        const t = i / n;
        // outer leaves break down first — they vanish as decomposition climbs
        if (d > 0.2 + t * 0.7) continue;
        const lx = x + (rs() - 0.5) * 46 * s, ly = y + (rs() - 0.5) * 22 * s;
        const cF = fresh[i % fresh.length], cR = rot[i % rot.length];
        ctx.fillStyle = mixc(cF, cR, Math.min(1, d * 1.4));
        ctx.globalAlpha = 0.92 - d * 0.2;
        ctx.save(); ctx.translate(lx, ly); ctx.rotate(rs() * TAU);
        const lw = (7 - d * 2.2) * s, lh = (4.4 - d * 1.1) * s;
        // pointed leaf silhouette
        ctx.beginPath(); ctx.moveTo(-lw, 0); ctx.quadraticCurveTo(0, -lh, lw, 0); ctx.quadraticCurveTo(0, lh, -lw, 0); ctx.fill();
        // midrib
        ctx.strokeStyle = 'rgba(60,46,28,0.35)'; ctx.lineWidth = 0.8 * s;
        ctx.beginPath(); ctx.moveTo(-lw, 0); ctx.lineTo(lw, 0); ctx.stroke();
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    }
    _carcass(ctx, x, y, s, pr) {
      // dead rabbit with a 5-stage decay strip driven by decomposition progress
      const data = G.Assets.get('deadbunny', 'decay');
      if (data && data.img && data.img.complete && data.img.naturalWidth) {
        const prog = pr.decomposed ? 1 : clamp(pr.decomp || 0, 0, 1);
        const frame = clamp(Math.floor(prog * data.n), 0, data.n - 1);
        const sc = (s || 1) * 0.26;
        const w = data.cw * sc, h = data.ch * sc;
        this._shadow(ctx, x, y, w * 0.32, h * 0.22);
        ctx.drawImage(data.img, frame * data.cw, 0, data.cw, data.ch, x - w / 2, y - h * 0.80, w, h);
        return;
      }
      this._shadow(ctx, x, y, 30 * s, 10 * s);
      const dead = pr.decomposed;
      // simple bone pile / dead matter (fallback)
      ctx.fillStyle = dead ? '#9a9078' : '#d9d2bd'; ctx.strokeStyle = '#b3a988'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(x, y - 6 * s, 22 * s, 13 * s, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = '#a59a7a'; ctx.lineWidth = 2.4 * s;
      for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(x - 16 * s + i * 10 * s, y - 14 * s); ctx.lineTo(x - 12 * s + i * 10 * s, y + 2 * s); ctx.stroke(); }
      ctx.fillStyle = '#efe9d6'; ctx.beginPath(); ctx.arc(x + 16 * s, y - 12 * s, 7 * s, 0, TAU); ctx.fill();
    }
  }

  // dead/barren soil that the earthworm restores. pr.heal 0..1 drives the
  // transformation from dull grey cracked dirt → lush green grass + flowers.
  World.prototype._deadPatch = function (ctx, x, y, s, pr) {
    const h = clamp(pr.heal || 0, 0, 1);
    const seed = ((pr.x * 17 + pr.y * 7) | 0);
    const rg = mulberry(seed + 99), rc = mulberry(seed);
    const RX = 36 * s, RY = 22 * s;

    // wobbly outline cached once so the patch never looks like a stamped ellipse
    const segs = 16;
    if (!pr._wob) { const rw = mulberry(seed + 3); pr._wob = Array.from({ length: segs + 1 }, () => 0.78 + rw() * 0.34); }

    // ---- bare soil that FADES into the surrounding grass (no hard rim) ----
    const soil = mixc([166, 152, 122], [120, 94, 58], h);     // dead dusty tan → rich earth
    const soilEdge = mixc([150, 140, 116], [120, 94, 58], h);
    const g = ctx.createRadialGradient(x, y, RX * 0.18, x, y, RX);
    g.addColorStop(0, soil);
    g.addColorStop(0.6, soilEdge);
    g.addColorStop(1, 'rgba(0,0,0,0)');                        // dissolve into the floor
    ctx.fillStyle = g;
    ctx.beginPath();
    for (let i = 0; i <= segs; i++) {
      const a = i / segs * TAU, w = pr._wob[i];
      const px = x + Math.cos(a) * RX * w, py = y + Math.sin(a) * RY * w;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath(); ctx.fill();

    // mottled darker soil specks for texture
    ctx.globalAlpha = 0.5 * (1 - h * 0.6);
    for (let i = 0; i < 10; i++) {
      const a = rc() * TAU, rr = rc() * RX * 0.78;
      ctx.fillStyle = mixc([120, 108, 84], [92, 70, 44], h);
      ctx.beginPath(); ctx.ellipse(x + Math.cos(a) * rr, y + Math.sin(a) * rr * 0.6, (3 + rc() * 4) * s, (2 + rc() * 2) * s, 0, 0, TAU); ctx.fill();
    }
    ctx.globalAlpha = 1;

    // thin dry brown cracks (fade out as it heals)
    if (h < 0.9) {
      ctx.globalAlpha = (1 - h) * 0.4; ctx.strokeStyle = '#5e4a30'; ctx.lineWidth = 1.3 * s; ctx.lineCap = 'round';
      for (let i = 0; i < 4; i++) {
        const a = rc() * TAU, ln = (12 + rc() * 16) * s;
        ctx.beginPath(); ctx.moveTo(x, y);
        ctx.quadraticCurveTo(x + Math.cos(a) * ln * 0.5, y + Math.sin(a) * ln * 0.3, x + Math.cos(a) * ln, y + Math.sin(a) * ln * 0.6); ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    // withered pale dead-grass tufts around the rim — softens the boundary into the world
    const dn = Math.round((1 - h) * 7);
    ctx.lineCap = 'round';
    for (let i = 0; i < dn; i++) {
      const a = rg() * TAU, rr = RX * 0.55 + rg() * RX * 0.5;
      const bx = x + Math.cos(a) * rr, by = y + Math.sin(a) * rr * 0.62, bh = (5 + rg() * 6) * s;
      ctx.strokeStyle = rg() < 0.5 ? '#b6a877' : '#c7b98a'; ctx.lineWidth = 1.6 * s; ctx.globalAlpha = 0.8;
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.quadraticCurveTo(bx + (rg() - 0.5) * 4 * s, by - bh * 0.7, bx + (rg() - 0.5) * 6 * s, by - bh); ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // ---- regrowing grass — count + height scale with heal ----
    const blades = Math.round(h * 20);
    for (let i = 0; i < blades; i++) {
      const ox = (rg() - 0.5) * 58 * s, oy = (rg() - 0.5) * 26 * s, bh = (6 + rg() * 12) * s * (0.5 + h * 0.5);
      ctx.strokeStyle = rg() < 0.5 ? '#6fa544' : '#8cc056'; ctx.lineWidth = 2 * s;
      ctx.beginPath(); ctx.moveTo(x + ox, y + oy); ctx.quadraticCurveTo(x + ox + 2 * s, y + oy - bh * 0.6, x + ox + (rg() - 0.5) * 5 * s, y + oy - bh); ctx.stroke();
    }
    // flowers once nearly restored
    if (h > 0.6) {
      const n = Math.round((h - 0.6) / 0.4 * 3);
      const cols = ['#f2d24b', '#e87fb0', '#f0f0f0'];
      for (let i = 0; i < n; i++) {
        const ox = (rg() - 0.5) * 36 * s, oy = (rg() - 0.5) * 16 * s;
        ctx.fillStyle = cols[i % cols.length];
        for (let k = 0; k < 5; k++) { const a = k / 5 * TAU; ctx.beginPath(); ctx.arc(x + ox + Math.cos(a) * 3.4 * s, y + oy - 6 * s + Math.sin(a) * 3.4 * s, 2.4 * s, 0, TAU); ctx.fill(); }
        ctx.fillStyle = '#f7a83a'; ctx.beginPath(); ctx.arc(x + ox, y + oy - 6 * s, 2 * s, 0, TAU); ctx.fill();
      }
    }
  };

  G.World = World;
  G.mulberry = mulberry;
})(window);
