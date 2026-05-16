// Standalone canvas-2D object-view renderer.
// Ported from the design handoff's object-renderer.js.
// Same external interface as ParticleSim so ObjectView.jsx mirrors ParticleView.jsx.

import { SUBSTANCES } from '../data/substances';

// ─── Palette ─────────────────────────────────────────────────────────────────

const OBJ_PALETTES = {
  water: {
    iceTop: '#e3f7ff', iceBottom: '#9ad2f5',
    iceCrack: 'rgba(255,255,255,0.45)', iceEdge: 'rgba(60,110,160,0.55)',
    liquidTop: '#7fbfe8', liquidBot: '#1f5d8c', liquidAlpha: 0.78,
    molecule: 'rgba(255,255,255,0.42)', drip: '#a0d4f5',
    ripple: 'rgba(122,209,255,1)',
    vapor: '#6e7d8c', vaporGlow: '#c8d4e0', vaporEdge: 'rgba(70,90,115,0.7)',
    bubble: 'rgba(255,255,255,0.65)',
  },
  co2: {
    iceTop: '#fbfdff', iceBottom: '#c7ced6',
    iceCrack: 'rgba(180,190,200,0.55)', iceEdge: 'rgba(120,130,145,0.7)',
    liquidTop: '#dfe7ee', liquidBot: '#7e8a96', liquidAlpha: 0.55,
    molecule: 'rgba(255,255,255,0.45)', drip: '#cfd6dd',
    ripple: 'rgba(200,210,220,1)',
    vapor: '#7a838c', vaporGlow: '#dde2e8', vaporEdge: 'rgba(90,100,110,0.6)',
    bubble: 'rgba(255,255,255,0.6)',
  },
  iron: {
    iceTop: '#9aa1ad', iceBottom: '#444a55',
    iceCrack: 'rgba(20,25,35,0.45)', iceEdge: 'rgba(15,20,30,0.7)',
    liquidTop: '#ffd07a', liquidBot: '#c8351a', liquidAlpha: 0.95,
    molecule: 'rgba(255,220,150,0.7)', drip: '#ff8a3a',
    ripple: 'rgba(255,200,120,1)',
    vapor: '#8a6850', vaporGlow: '#e8c098', vaporEdge: 'rgba(80,50,30,0.7)',
    bubble: 'rgba(255,210,130,0.85)',
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function lerp(a, b, t) { return (1 - t) * a + t * b; }
function smoothstep(t) { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

function parseColor(c) {
  if (c.startsWith('rgba') || c.startsWith('rgb')) {
    const m = c.match(/-?\d+(\.\d+)?/g);
    return { r: +m[0], g: +m[1], b: +m[2], a: m[3] != null ? +m[3] : 1 };
  }
  const h = c.replace('#', '');
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16), a: 1 };
}
function rgba(c, alpha) {
  const p = parseColor(c);
  return `rgba(${p.r},${p.g},${p.b},${alpha != null ? alpha : p.a})`;
}
function lerpColor(c1, c2, t) {
  const a = parseColor(c1), b = parseColor(c2);
  return `rgba(${Math.round(lerp(a.r,b.r,t))},${Math.round(lerp(a.g,b.g,t))},${Math.round(lerp(a.b,b.b,t))},${lerp(a.a,b.a,t).toFixed(3)})`;
}

function makeIceOffsets(seedStr) {
  let s = 0;
  for (let i = 0; i < seedStr.length; i++) s = (s * 31 + seedStr.charCodeAt(i)) | 0;
  const rng = () => {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const cracks = [];
  for (let i = 0; i < 3; i++) {
    const seg = 2 + ((rng() * 3) | 0);
    const line = [{ x: rng() * 0.6 + 0.15, y: rng() * 0.6 + 0.15 }];
    let last = line[0];
    for (let j = 0; j < seg; j++) {
      last = { x: clamp(last.x + (rng() - 0.5) * 0.4, 0.05, 0.95), y: clamp(last.y + (rng() - 0.5) * 0.4, 0.05, 0.95) };
      line.push(last);
    }
    cracks.push(line);
  }
  const bubbles = [];
  for (let i = 0; i < 7; i++) {
    bubbles.push({ x: rng() * 0.8 + 0.1, y: rng() * 0.8 + 0.1, r: rng() * 0.04 + 0.015 });
  }
  return { cracks, bubbles };
}

// ─── ObjectRenderer ───────────────────────────────────────────────────────────

export class ObjectRenderer {
  constructor(canvas, opts = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.substanceId = 'water';
    this.temperature = 20;
    this.pressure = 1;
    this.running = true;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this._destroyed = false;
    this._lastTime = performance.now();
    this._time = 0;
    this._cssW = 0;
    this._cssH = 0;

    this._vapor = [];
    this._drips = [];
    this._evapHints = [];
    this._bubbles = [];
    this._ripples = [];

    this._liquidMolecules = [];
    for (let i = 0; i < 10; i++) {
      this._liquidMolecules.push({
        relX: 0.08 + Math.random() * 0.84,
        relY: 0.2 + Math.random() * 0.7,
        radius: 3 + Math.random() * 4,
        phase: Math.random() * Math.PI * 2,
      });
    }

    this._iceShapes = {
      water: makeIceOffsets('water_ice'),
      co2:   makeIceOffsets('dry_ice'),
      iron:  makeIceOffsets('iron_solid'),
    };

    this._layout = null;
    this._mouse = { x: -9999, y: -9999, inside: false };
    this._iceHover = false;

    // Transition blending
    this._transFrom = null;
    this._transTo = null;
    this._transProgress = 1;
    this._transStart = 0;
    this._transDuration = 1200;

    this.onStateChange = opts.onStateChange || (() => {});
    this._currentState = null;

    this._setupMouse();
  }

  init() {
    this.resize();
    this._loop = this._loop.bind(this);
    requestAnimationFrame(this._loop);
  }

  setSize(cssWidth, cssHeight) {
    this._cssW = cssWidth;
    this._cssH = cssHeight;
    this.canvas.width = Math.round(cssWidth * this.dpr);
    this.canvas.height = Math.round(cssHeight * this.dpr);
    this.canvas.style.width = cssWidth + 'px';
    this.canvas.style.height = cssHeight + 'px';
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  resize() {
    const r = this.canvas.parentElement.getBoundingClientRect();
    this.setSize(r.width, r.height);
  }

  setSubstance(id) {
    if (!SUBSTANCES[id]) return;
    this.substanceId = id;
    this._vapor = []; this._drips = []; this._evapHints = []; this._bubbles = []; this._ripples = [];
    this._syncState(true);
  }

  setTemperature(t) { this.temperature = t; this._syncState(); }
  setPressure(p)    { this.pressure = p;    this._syncState(); }
  setRunning(r)     { this.running = r; }

  reset() {
    this._vapor = []; this._drips = []; this._evapHints = []; this._bubbles = []; this._ripples = [];
    this._syncState(true);
  }

  destroy() {
    this._destroyed = true;
    this._removeMouseListeners?.();
  }

  // ── Internals ─────────────────────────────────────────────────────────────

  _syncState(instant = false) {
    const sub = SUBSTANCES[this.substanceId] || SUBSTANCES.water;
    const phases = this._computePhases(sub, this.temperature, this.pressure);
    const state = phases.ice > 0.5 ? 'solid' : phases.water > 0.5 ? 'liquid' : 'gas';
    if (state !== this._currentState) {
      const prev = this._currentState;
      if (prev !== null && !instant) {
        this._transFrom = prev;
        this._transTo = state;
        this._transProgress = 0;
        this._transStart = performance.now();
      }
      this._currentState = state;
      this.onStateChange(state, prev);
    }
  }

  _loop(now) {
    if (this._destroyed) return;
    if (!this.canvas.isConnected) { requestAnimationFrame(this._loop); return; }

    const dt = Math.min(0.05, (now - this._lastTime) / 1000);
    this._lastTime = now;

    if (this.running && this._cssW > 4 && this._cssH > 4) {
      this._time += dt;

      if (this._transFrom !== null) {
        this._transProgress = Math.min(1, (now - this._transStart) / this._transDuration);
        if (this._transProgress >= 1) { this._transFrom = null; this._transTo = null; }
      }

      const sub = SUBSTANCES[this.substanceId] || SUBSTANCES.water;
      const phases = this._computePhases(sub, this.temperature, this.pressure);
      const palette = OBJ_PALETTES[this.substanceId] || OBJ_PALETTES.water;

      let renderPhases = phases;
      if (this._transFrom !== null) {
        const fp = this._stateToPhases(this._transFrom);
        const tp = this._stateToPhases(this._transTo);
        const t = smoothstep(this._transProgress);
        renderPhases = {
          ice:   lerp(fp.ice,   tp.ice,   t),
          water: lerp(fp.water, tp.water, t),
          gas:   lerp(fp.gas,   tp.gas,   t),
          melt: phases.melt,
          boil: phases.boil,
        };
      }

      const shiver = this._computeShiver(sub, this.temperature, renderPhases);
      this._updateLayout(renderPhases, sub);
      if (!this.reducedMotion) {
        this._updateVapor(dt, renderPhases, sub, palette);
        this._updateDrips(dt, renderPhases);
        this._updateEvapHints(dt, renderPhases, sub);
        this._updateBubbles(dt, renderPhases);
        this._updateRipples(dt);
      }
      this._draw(renderPhases, palette, shiver, sub);
    }

    requestAnimationFrame(this._loop);
  }

  // ── Phase helpers ─────────────────────────────────────────────────────────

  _computePhases(sub, temperature, pressure) {
    const pf = pressure - 1;
    const melt = sub.meltingPoint + pf * 0.4;
    const boil  = sub.boilingPoint + pf * (sub.boilingPoint * 0.06);
    const liquidExists = (boil - melt) > 5;

    if (!liquidExists) {
      const band = 8;
      if (temperature <= melt - band) return { ice: 1, water: 0, gas: 0, melt, boil };
      if (temperature >= melt + band) return { ice: 0, water: 0, gas: 1, melt, boil };
      const f = smoothstep((temperature - (melt - band)) / (2 * band));
      return { ice: 1 - f, water: 0, gas: f, melt, boil };
    }

    const meltSpan = clamp(Math.abs(boil - melt) * 0.15, 6, 40);
    const boilSpan = clamp(Math.abs(boil - melt) * 0.20, 8, 50);

    if (temperature <= melt)                    return { ice: 1, water: 0, gas: 0, melt, boil };
    if (temperature < melt + meltSpan) {
      const f = smoothstep((temperature - melt) / meltSpan);
      return { ice: 1 - f, water: f, gas: 0, melt, boil };
    }
    if (temperature <= boil - boilSpan)         return { ice: 0, water: 1, gas: 0, melt, boil };
    if (temperature < boil + boilSpan) {
      const f = smoothstep((temperature - (boil - boilSpan)) / (2 * boilSpan));
      return { ice: 0, water: 1 - f, gas: f, melt, boil };
    }
    return { ice: 0, water: 0, gas: 1, melt, boil };
  }

  _stateToPhases(state) {
    if (state === 'solid')  return { ice: 1, water: 0, gas: 0 };
    if (state === 'liquid') return { ice: 0, water: 1, gas: 0 };
    return { ice: 0, water: 0, gas: 1 };
  }

  _computeShiver(sub, temperature, phases) {
    if (phases.ice <= 0) return 0;
    const meltPoint = phases.melt ?? sub.meltingPoint;
    const below = meltPoint - temperature;
    if (below < 5) return 0;
    return smoothstep(clamp((below - 5) / 30, 0, 1)) * phases.ice;
  }

  // ── Layout ────────────────────────────────────────────────────────────────

  _updateLayout(phases, sub) {
    const w = this._cssW, h = this._cssH;
    const padX = 0, padTop = 0, padBot = 0;
    const floorY = h - padBot;
    const ceilY  = padTop;
    const innerW = Math.max(1, w - padX * 2);
    const innerH = Math.max(1, floorY - ceilY);

    const bodyW = innerW;
    const bodyX = (w - bodyW) / 2;
    const maxBodyH = innerH * 0.65;
    const bodyMassFrac = clamp(phases.ice + phases.water, 0, 1);
    const bodyH = maxBodyH * bodyMassFrac;
    const surfaceY = floorY - bodyH;
    const iciness = bodyMassFrac > 0 ? phases.ice / bodyMassFrac : 0;

    this._layout = { floorY, ceilY, innerW, innerH, padX, bodyX, bodyW, bodyH, surfaceY, maxBodyH, bodyMassFrac, iciness };
  }

  // ── Particle system updates ───────────────────────────────────────────────

  _updateVapor(dt, phases, sub, palette) {
    const L = this._layout;
    if (!L) return;
    const target = phases.gas > 0 ? Math.floor(lerp(40, 160, phases.gas)) : 0;

    if (this._vapor.length < target && Math.random() < 0.5) {
      const above = clamp((this.temperature - phases.boil) / Math.max(20, (sub.boilingPoint + 100 - phases.boil) * 0.3), 0, 1);
      this._vapor.push({
        x: L.bodyX + Math.random() * L.bodyW,
        y: L.surfaceY - 6 + Math.random() * 12,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -lerp(0.4, 2.4, 0.3 + above * 0.7) - Math.random() * 0.8,
        r: lerp(8, 22, Math.random()),
        rotSeed: Math.random() * 1000,
        wobbleFreq: 0.4 + Math.random() * 0.8,
        wobbleAmp: 0.3 + Math.random() * 1.4,
        hovered: false,
      });
    }

    for (let i = this._vapor.length - 1; i >= 0; i--) {
      const p = this._vapor[i];
      p.x += p.vx + Math.sin(this._time * p.wobbleFreq + p.rotSeed) * p.wobbleAmp * dt * 60;
      p.y += p.vy;
      p.r += 0.05;

      if (this._mouse.inside) {
        const dx = p.x - this._mouse.x, dy = p.y - this._mouse.y;
        const d = Math.hypot(dx, dy);
        if (d < 60 && d > 0.1) {
          const force = (60 - d) / 60;
          p.x += (dx / d) * force * 4;
          p.y += (dy / d) * force * 3;
          p.hovered = d < p.r * 1.8;
        } else { p.hovered = false; }
      } else { p.hovered = false; }

      if (p.y < L.ceilY - 30 || phases.gas <= 0) this._vapor.splice(i, 1);
    }
    while (this._vapor.length > target + 30) this._vapor.shift();
  }

  _updateDrips(dt, phases) {
    const L = this._layout;
    if (!L) return;
    const meltActive = phases.ice > 0.05 && phases.water > 0.05;
    if (meltActive && Math.random() < 0.22) {
      this._drips.push({
        x: L.bodyX + 10 + Math.random() * Math.max(1, L.bodyW - 20),
        y: L.surfaceY - 6 - Math.random() * 14,
        vy: 0.1 + Math.random() * 0.2,
        stretch: 0, opacity: 0.95,
      });
    }
    for (let i = this._drips.length - 1; i >= 0; i--) {
      const d = this._drips[i];
      d.vy += 0.28; d.y += d.vy;
      d.stretch = Math.min(12, d.vy * 1.4);
      if (d.y >= L.surfaceY) {
        this._ripples.push({ x: d.x, y: L.surfaceY, radius: 0, maxRadius: 10 + Math.random() * 10, life: 1.0 });
        this._drips.splice(i, 1);
      }
    }
  }

  _updateEvapHints(dt, phases, sub) {
    const L = this._layout;
    if (!L) return;
    const span = Math.max(1, sub.boilingPoint - sub.meltingPoint);
    const tNorm = (this.temperature - sub.meltingPoint) / span;
    const active = phases.water > 0.1 && phases.gas < 0.05 && tNorm > 0.3;
    if (active && Math.random() < 0.08) {
      this._evapHints.push({
        x: L.bodyX + Math.random() * L.bodyW,
        y: L.surfaceY - 1,
        vy: -lerp(0.25, 1.1, clamp((tNorm - 0.3) / 0.7, 0, 1)),
        opacity: 0.7,
      });
    }
    for (let i = this._evapHints.length - 1; i >= 0; i--) {
      const e = this._evapHints[i];
      e.y += e.vy; e.opacity -= 0.009;
      if (e.opacity <= 0 || e.y < L.ceilY) this._evapHints.splice(i, 1);
    }
  }

  _updateBubbles(dt, phases) {
    const L = this._layout;
    if (!L) return;
    if (phases.water > 0.05 && phases.gas > 0.05 && Math.random() < 0.35) {
      this._bubbles.push({
        x: L.bodyX + Math.random() * L.bodyW,
        y: L.floorY - 6 - Math.random() * Math.min(12, L.bodyH * 0.15),
        vy: -0.4 - Math.random() * 0.7,
        r: 2 + Math.random() * 5,
        phase: Math.random() * Math.PI * 2,
      });
    }
    for (let i = this._bubbles.length - 1; i >= 0; i--) {
      const b = this._bubbles[i];
      b.y += b.vy;
      b.x += Math.sin(this._time * 4 + b.phase) * 0.3;
      b.r += 0.04;
      if (b.y <= L.surfaceY + 2) {
        this._ripples.push({ x: b.x, y: L.surfaceY, radius: 0, maxRadius: 8 + b.r * 1.5, life: 1.0 });
        this._bubbles.splice(i, 1);
      }
    }
  }

  _updateRipples(dt) {
    for (let i = this._ripples.length - 1; i >= 0; i--) {
      const r = this._ripples[i];
      r.life -= dt / 0.9;
      r.radius = lerp(0, r.maxRadius, 1 - r.life);
      if (r.life <= 0) this._ripples.splice(i, 1);
    }
  }

  // ── Drawing ───────────────────────────────────────────────────────────────

  _draw(phases, palette, shiver, sub) {
    const ctx = this.ctx;
    const w = this._cssW, h = this._cssH;
    const L = this._layout;
    if (!L || w < 4 || h < 4) return;

    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = 'rgba(43,36,23,0.08)';
    ctx.fillRect(0, L.floorY, w, 1.5);

    this._drawVapor(ctx, palette);
    if (L.bodyMassFrac > 0.005) this._drawBody(ctx, palette, phases, sub, shiver);
    this._drawBubbles(ctx, palette);
    this._drawEvapHints(ctx, palette);
    this._drawDrips(ctx, palette);
    this._drawRipples(ctx, palette);
    if (sub.id === 'co2' && phases.ice > 0.05) this._drawSublimationFog(ctx, palette, phases);
  }

  _drawBody(ctx, palette, phases, sub, shiver) {
    const L = this._layout;
    const t = this._time;
    const iciness = L.iciness;

    let dx = 0;
    if (shiver > 0.01) dx = (Math.random() - 0.5) * shiver * 2.4;

    const span = Math.max(1, sub.boilingPoint - sub.meltingPoint);
    const heat = clamp((this.temperature - sub.meltingPoint) / span, 0, 1);
    const topC = lerpColor(palette.liquidTop, palette.iceTop, iciness);
    const botC = lerpColor(palette.liquidBot, palette.iceBottom, iciness);

    const waveSpeed = lerp(0.35, 2.2, heat) * (1 - iciness);
    const waveAmp1  = lerp(2, 6, heat) + (phases.gas > 0.05 ? 3 : 0);
    const waveAmp2  = lerp(1, 3, heat);

    const steps = Math.max(40, (L.bodyW / 6) | 0);
    const pts = [];

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(L.bodyX + dx, L.floorY);
    for (let i = 0; i <= steps; i++) {
      const x = L.bodyX + (i / steps) * L.bodyW + dx;
      const y = L.surfaceY
        + Math.sin(x * 0.03 + t * waveSpeed) * waveAmp1
        + Math.sin(x * 0.07 - t * waveSpeed * 1.4 + 1.3) * waveAmp2;
      ctx.lineTo(x, y);
      pts.push({ x, y });
    }
    ctx.lineTo(L.bodyX + L.bodyW + dx, L.floorY);
    ctx.closePath();

    const fillAlpha = lerp(palette.liquidAlpha, 0.95, iciness);
    const grad = ctx.createLinearGradient(0, L.surfaceY, 0, L.floorY);
    grad.addColorStop(0, rgba(topC, fillAlpha));
    grad.addColorStop(1, rgba(botC, fillAlpha * 0.95));
    ctx.fillStyle = grad;
    ctx.fill();

    // hover glow
    const overBody = this._mouse.inside && ctx.isPointInPath(this._mouse.x, this._mouse.y);
    this._iceHover = overBody && iciness > 0.5;
    if (overBody) {
      ctx.save();
      ctx.clip();
      ctx.fillStyle = iciness > 0.5 ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.10)';
      ctx.fillRect(L.bodyX - 4, L.surfaceY - 8, L.bodyW + 8, L.bodyH + 12);
      ctx.restore();
    }

    // surface highlight
    ctx.strokeStyle = iciness > 0.5
      ? `rgba(255,255,255,${0.55 + iciness * 0.25})`
      : 'rgba(255,255,255,0.5)';
    ctx.lineWidth = iciness > 0.5 ? 1.6 : 1.2;
    ctx.beginPath();
    pts.forEach((p, i) => { if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y); });
    ctx.stroke();

    // liquid molecules
    if (iciness < 0.95) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(L.bodyX + dx, L.floorY);
      pts.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.lineTo(L.bodyX + L.bodyW + dx, L.floorY);
      ctx.closePath();
      ctx.clip();
      const bobSpeed = lerp(0.6, 3.5, heat) * (1 - iciness);
      const molAlpha = clamp(1 - iciness, 0, 1) * 0.9;
      this._liquidMolecules.forEach(m => {
        const mx = L.bodyX + m.relX * L.bodyW + dx;
        const my = L.surfaceY + 8 + m.relY * Math.max(0, L.bodyH - 16)
          + Math.sin(t * bobSpeed + m.phase) * 4 * (1 - iciness);
        ctx.fillStyle = rgba(palette.molecule, molAlpha * 0.42);
        ctx.beginPath(); ctx.arc(mx, my, m.radius, 0, Math.PI * 2); ctx.fill();
      });
      ctx.restore();
    }

    // ice details
    if (iciness > 0.05) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(L.bodyX + dx, L.floorY);
      pts.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.lineTo(L.bodyX + L.bodyW + dx, L.floorY);
      ctx.closePath();
      ctx.clip();

      const shape = this._iceShapes[sub.id] || this._iceShapes.water;

      // frost wash
      const frostH = Math.min(L.bodyH * 0.45, 100);
      const fg = ctx.createLinearGradient(0, L.surfaceY, 0, L.surfaceY + frostH);
      fg.addColorStop(0, `rgba(255,255,255,${0.5 * iciness})`);
      fg.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = fg;
      ctx.fillRect(L.bodyX - 4, L.surfaceY - 2, L.bodyW + 8, frostH);

      // cracks
      ctx.strokeStyle = `rgba(255,255,255,${0.5 * iciness})`;
      ctx.lineWidth = 1.3; ctx.lineCap = 'round';
      shape.cracks.forEach(line => {
        ctx.beginPath();
        ctx.moveTo(L.bodyX + line[0].x * L.bodyW + dx, L.surfaceY + line[0].y * L.bodyH);
        for (let i = 1; i < line.length; i++)
          ctx.lineTo(L.bodyX + line[i].x * L.bodyW + dx, L.surfaceY + line[i].y * L.bodyH);
        ctx.stroke();
      });

      ctx.strokeStyle = rgba(palette.iceCrack, iciness);
      ctx.lineWidth = 1;
      shape.cracks.forEach(c => {
        ctx.beginPath();
        ctx.moveTo(L.bodyX + c[0].x * L.bodyW * 0.8 + 40 + dx, L.surfaceY + c[0].y * L.bodyH * 0.8);
        for (let j = 1; j < c.length; j++)
          ctx.lineTo(L.bodyX + c[j].x * L.bodyW * 0.8 + 40 + dx, L.surfaceY + c[j].y * L.bodyH * 0.8);
        ctx.stroke();
      });

      // air bubbles
      const bubScale = Math.min(L.bodyW, L.bodyH) * 0.35;
      shape.bubbles.forEach(b => {
        const bx = L.bodyX + b.x * L.bodyW + dx;
        const by = L.surfaceY + 6 + b.y * Math.max(0, L.bodyH - 12);
        const br = Math.max(1.5, b.r * bubScale);
        ctx.fillStyle = `rgba(255,255,255,${0.35 * iciness})`;
        ctx.beginPath(); ctx.arc(bx, by, br, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `rgba(255,255,255,${0.85 * iciness})`;
        ctx.beginPath(); ctx.arc(bx - br * 0.3, by - br * 0.3, br * 0.4, 0, Math.PI * 2); ctx.fill();
      });

      ctx.restore();

      // icy edge outline
      ctx.save();
      ctx.strokeStyle = rgba(palette.iceEdge, iciness * 0.9);
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(L.bodyX + dx, L.floorY);
      pts.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.lineTo(L.bodyX + L.bodyW + dx, L.floorY);
      ctx.stroke();
      ctx.restore();
    }

    // hover ring
    if (this._iceHover) {
      ctx.save();
      ctx.shadowBlur = 22;
      ctx.shadowColor = 'rgba(255,255,255,0.7)';
      ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(L.bodyX + dx, L.floorY);
      pts.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.lineTo(L.bodyX + L.bodyW + dx, L.floorY);
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();
  }

  _drawVapor(ctx, palette) {
    this._vapor.forEach(p => {
      const r = p.hovered ? p.r * 1.45 : p.r;
      const baseAlpha = p.hovered ? 0.85 : 0.65;
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
      g.addColorStop(0,    rgba(palette.vaporGlow, baseAlpha * 0.95));
      g.addColorStop(0.45, rgba(palette.vapor,     baseAlpha * 0.85));
      g.addColorStop(1,    rgba(palette.vapor, 0));
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.fill();
      if (palette.vaporEdge) {
        ctx.strokeStyle = rgba(palette.vaporEdge, p.hovered ? 0.55 : 0.35);
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(p.x, p.y, r * 0.78, 0, Math.PI * 2); ctx.stroke();
      }
    });
  }

  _drawDrips(ctx, palette) {
    ctx.save();
    this._drips.forEach(d => {
      const r = 3.2, tail = d.stretch;
      ctx.fillStyle = rgba(palette.drip, d.opacity);
      ctx.beginPath();
      ctx.moveTo(d.x, d.y - tail);
      ctx.quadraticCurveTo(d.x - r, d.y - tail / 2, d.x - r, d.y + 1);
      ctx.arc(d.x, d.y + 1, r, Math.PI, 0, true);
      ctx.quadraticCurveTo(d.x + r, d.y - tail / 2, d.x, d.y - tail);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.beginPath(); ctx.ellipse(d.x - 1, d.y - 1, 0.9, 1.5, 0, 0, Math.PI * 2); ctx.fill();
    });
    ctx.restore();
  }

  _drawBubbles(ctx, palette) {
    this._bubbles.forEach(b => {
      ctx.strokeStyle = palette.bubble; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.beginPath(); ctx.arc(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.4, 0, Math.PI * 2); ctx.fill();
    });
  }

  _drawEvapHints(ctx, palette) {
    this._evapHints.forEach(e => {
      ctx.fillStyle = rgba(palette.vapor, e.opacity * 0.7);
      ctx.beginPath(); ctx.arc(e.x, e.y, 1.8, 0, Math.PI * 2); ctx.fill();
    });
  }

  _drawRipples(ctx, palette) {
    this._ripples.forEach(r => {
      ctx.strokeStyle = rgba(palette.ripple, clamp(r.life, 0, 1) * 0.85);
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.ellipse(r.x, r.y, r.radius, r.radius * 0.4, 0, 0, Math.PI * 2); ctx.stroke();
    });
  }

  _drawSublimationFog(ctx, palette, phases) {
    const L = this._layout;
    if (L.bodyMassFrac <= 0.02) return;
    const cx = L.bodyX + L.bodyW / 2, cy = L.surfaceY;
    const rx = L.bodyW * 0.55, ry = Math.max(20, L.bodyH * 0.4);
    const g = ctx.createRadialGradient(cx, cy, Math.max(1, L.bodyW * 0.08), cx, cy, Math.max(rx, ry));
    g.addColorStop(0,    rgba(palette.vaporGlow, 0.45 * phases.ice));
    g.addColorStop(0.55, rgba(palette.vapor,     0.18 * phases.ice));
    g.addColorStop(1,    rgba(palette.vapor, 0));
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
  }

  // ── Mouse ─────────────────────────────────────────────────────────────────

  _setupMouse() {
    const canvas = this.canvas;
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      this._mouse.x = (e.clientX - r.left) * (this._cssW / r.width);
      this._mouse.y = (e.clientY - r.top)  * (this._cssH / r.height);
      this._mouse.inside = true;
    };
    const onLeave = () => {
      this._mouse.x = -9999; this._mouse.y = -9999;
      this._mouse.inside = false; this._iceHover = false;
    };
    const onClick = (e) => {
      if (!this._layout) return;
      const r = canvas.getBoundingClientRect();
      const cx = (e.clientX - r.left) * (this._cssW / r.width);
      const cy = (e.clientY - r.top)  * (this._cssH / r.height);
      if (cy > this._layout.surfaceY - 4)
        this._ripples.push({ x: cx, y: cy, radius: 0, maxRadius: 38 + Math.random() * 32, life: 1.0 });
    };
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);
    canvas.addEventListener('click', onClick);
    this._removeMouseListeners = () => {
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
      canvas.removeEventListener('click', onClick);
    };
  }
}
