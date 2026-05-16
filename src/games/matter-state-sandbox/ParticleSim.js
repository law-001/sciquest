// Particle simulation for matter states.
// Ported from the design handoff simulation.js and adapted for SciQuest substances.

const SUBSTANCES = {
  water: { id: 'water', name: 'Water',           melt: 0,    boil: 100,  range: [-30,  160]  },
  co2:   { id: 'co2',   name: 'Carbon Dioxide',   melt: -78,  boil: -78,  range: [-120, 0]    },
  iron:  { id: 'iron',  name: 'Iron',              melt: 1538, boil: 2862, range: [20,   3200] },
};

const PALETTES = {
  water: {
    solidA: '#cfe9ff', solidB: '#79bbef', solidEdge: 'rgba(50,100,160,0.45)',
    liquidA: '#dff1ff', liquidB: '#3b8cd9', liquidEdge: 'rgba(30,80,140,0.4)',
    gasTint: '#fdfaf3',
  },
  co2: {
    solidA: '#e4ecf8', solidB: '#9ab0d0', solidEdge: 'rgba(60,80,140,0.4)',
    liquidA: '#eef4ff', liquidB: '#7aa0cc', liquidEdge: 'rgba(50,80,140,0.35)',
    gasTint: '#f8faff',
  },
  iron: {
    solidA: '#7a8290', solidB: '#3d4350', solidEdge: 'rgba(20,25,35,0.5)',
    liquidA: '#ffe9b0', liquidB: '#ff7a3a', liquidEdge: 'rgba(120,30,10,0.5)',
    gasTint: '#f4dcc3',
  },
};

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function makeIceSprite(palette, size = 64) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const pad = size * 0.08;
  const w = size - pad * 2;
  const r = size * 0.16;

  const g = ctx.createLinearGradient(pad, pad, size - pad, size - pad);
  g.addColorStop(0, palette.solidA);
  g.addColorStop(1, palette.solidB);
  ctx.fillStyle = g;
  roundRect(ctx, pad, pad, w, w, r);
  ctx.fill();

  ctx.lineWidth = Math.max(1, size * 0.025);
  ctx.strokeStyle = palette.solidEdge;
  ctx.stroke();

  ctx.fillStyle = 'rgba(255,255,255,0.65)';
  roundRect(ctx, pad + size * 0.12, pad + size * 0.1, size * 0.34, size * 0.16, r * 0.5);
  ctx.fill();

  ctx.strokeStyle = 'rgba(255,255,255,0.55)';
  ctx.lineWidth = Math.max(1, size * 0.02);
  ctx.beginPath();
  ctx.moveTo(pad + size * 0.18, pad + size * 0.62);
  ctx.lineTo(pad + size * 0.42, pad + size * 0.4);
  ctx.lineTo(pad + size * 0.7, pad + size * 0.68);
  ctx.stroke();
  return c;
}

function makeWaterSprite(palette, size = 64) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 2;

  const glow = ctx.createRadialGradient(cx, cy, r * 0.6, cx, cy, r + 1);
  glow.addColorStop(0, 'rgba(40,90,150,0)');
  glow.addColorStop(1, palette.liquidEdge);
  ctx.fillStyle = glow;
  ctx.beginPath(); ctx.arc(cx, cy, r + 1, 0, Math.PI * 2); ctx.fill();

  const g = ctx.createRadialGradient(cx - r * 0.4, cy - r * 0.45, r * 0.1, cx, cy, r);
  g.addColorStop(0, palette.liquidA);
  g.addColorStop(0.45, palette.liquidB);
  g.addColorStop(1, palette.liquidB);
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = 'rgba(255,255,255,0.78)';
  ctx.beginPath();
  ctx.ellipse(cx - r * 0.4, cy - r * 0.45, r * 0.22, r * 0.14, -Math.PI / 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = 'rgba(20,60,110,0.18)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
  return c;
}

function tintSmoke(img, color, size = 128) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  ctx.drawImage(img, 0, 0, size, size);
  ctx.globalCompositeOperation = 'source-in';
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, size, size);
  return c;
}

export class ParticleSim {
  constructor(canvas, opts = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.particles = [];

    this.substance = SUBSTANCES.water;
    this.temperature = 20;
    this.pressure = 1;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.running = true;

    this.sprites = {};
    this.smokeImgs = [];

    this._state = 'liquid';
    this.onStateChange = opts.onStateChange || (() => {});
    this.onStats = opts.onStats || (() => {});

    this._lastTime = performance.now();
    this._flashAt = 0;
    this.particleCount = 96;
    this._needsLatticeReset = true;
    this._destroyed = false;
  }

  async init() {
    this.smokeImgs = await Promise.all([
      loadImage('/matter-sandbox/smoke_01.png'),
      loadImage('/matter-sandbox/smoke_05.png'),
      loadImage('/matter-sandbox/smoke_09.png'),
    ]);
    this._buildSprites();
    this.resize();
    this._seedParticles();
    this._loop = this._loop.bind(this);
    requestAnimationFrame(this._loop);
  }

  _buildSprites() {
    for (const [sid, pal] of Object.entries(PALETTES)) {
      this.sprites[sid] = {
        ice: makeIceSprite(pal, 80),
        drop: makeWaterSprite(pal, 80),
        steam: this.smokeImgs.map(im => tintSmoke(im, pal.gasTint, 128)),
      };
    }
  }

  setSize(cssWidth, cssHeight) {
    this._cssW = cssWidth;
    this._cssH = cssHeight;
    this.canvas.width = Math.round(cssWidth * this.dpr);
    this.canvas.height = Math.round(cssHeight * this.dpr);
    this.canvas.style.width = cssWidth + 'px';
    this.canvas.style.height = cssHeight + 'px';
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this._needsLatticeReset = true;
  }

  resize() {
    const r = this.canvas.parentElement.getBoundingClientRect();
    this.setSize(r.width, r.height);
  }

  _seedParticles() {
    const w = this._cssW;
    const h = this._cssH;
    this.particles = [];
    const cols = Math.ceil(Math.sqrt(this.particleCount * (w / h)));
    const rows = Math.ceil(this.particleCount / cols);
    const dx = (w - 80) / cols;
    const dy = (h - 80) / rows;
    const x0 = 40 + dx / 2;
    const y0 = h - 40 - (rows - 0.5) * dy;
    let i = 0;
    for (let row = 0; row < rows && i < this.particleCount; row++) {
      for (let col = 0; col < cols && i < this.particleCount; col++) {
        const offset = (row % 2) * (dx / 2);
        const bx = x0 + col * dx + offset;
        const by = y0 + row * dy;
        this.particles.push({
          x: bx, y: by,
          vx: 0, vy: 0,
          baseX: bx, baseY: by,
          ab: Math.random() < 0.5 ? 'a' : 'b',
          size: 16 + Math.random() * 4,
          seed: Math.random() * Math.PI * 2,
          phaseSeed: Math.random(),
          steamVariant: (Math.random() * 3) | 0,
          rot: Math.random() * Math.PI * 2,
          rotV: (Math.random() - 0.5) * 0.02,
        });
        i++;
      }
    }
    this._needsLatticeReset = false;
  }

  _recomputeLattice() {
    const w = this._cssW;
    const h = this._cssH;
    const cols = Math.ceil(Math.sqrt(this.particles.length * (w / h)));
    const rows = Math.ceil(this.particles.length / cols);
    const dx = (w - 80) / cols;
    const dy = (h - 80) / rows;
    const x0 = 40 + dx / 2;
    const y0 = h - 40 - (rows - 0.5) * dy;
    let i = 0;
    for (let row = 0; row < rows && i < this.particles.length; row++) {
      for (let col = 0; col < cols && i < this.particles.length; col++) {
        const offset = (row % 2) * (dx / 2);
        this.particles[i].baseX = x0 + col * dx + offset;
        this.particles[i].baseY = y0 + row * dy;
        i++;
      }
    }
    this._needsLatticeReset = false;
  }

  setSubstance(id) {
    const s = SUBSTANCES[id];
    if (!s) return;
    this.substance = s;
    this.temperature = -10;
    this.pressure = 1;
    this._seedParticles();
    this._syncState();
  }

  setTemperature(t) { this.temperature = t; this._syncState(); }
  setPressure(p)    { this.pressure = p;    this._syncState(); }
  setRunning(r)     { this.running = r; }

  _syncState() {
    const state = this._classify();
    if (state !== this._state) {
      const prev = this._state;
      this._state = state;
      this._triggerFlash();
      this.onStateChange(state, prev);
    }
    this._emitStats();
  }

  _emitStats() {
    let ke = 0;
    for (const p of this.particles) ke += p.vx * p.vx + p.vy * p.vy;
    ke = ke / Math.max(1, this.particles.length);
    this.onStats({ state: this._state, count: this.particles.length, ke });
  }

  reset() { this._seedParticles(); this._emitStats(); }

  _classify() {
    const t = this.temperature;
    const s = this.substance;
    const pf = (this.pressure - 1);
    const melt = s.melt + pf * 0.4;
    const boilShift = s.boil * 0.06;
    const boil = s.boil + pf * boilShift;
    const meltBand = Math.max(2, Math.abs(s.boil - s.melt) * 0.04);
    const boilBand = Math.max(3, Math.abs(s.boil - s.melt) * 0.06);
    if (t < melt - meltBand)  return 'solid';
    if (t < melt + meltBand)  return 'melting';
    if (t < boil - boilBand)  return 'liquid';
    if (t < boil + boilBand)  return 'evaporating';
    return 'gas';
  }

  _phaseMix() {
    const t = this.temperature;
    const s = this.substance;
    const pf = (this.pressure - 1);
    const melt = s.melt + pf * 0.4;
    const boil = s.boil + pf * (s.boil * 0.06);
    const meltBand = Math.max(2, Math.abs(s.boil - s.melt) * 0.04);
    const boilBand = Math.max(3, Math.abs(s.boil - s.melt) * 0.06);
    if (t <= melt - meltBand) return { ice: 1, water: 0, steam: 0 };
    if (t < melt + meltBand) {
      const f = (t - (melt - meltBand)) / (2 * meltBand);
      return { ice: 1 - f, water: f, steam: 0 };
    }
    if (t <= boil - boilBand) return { ice: 0, water: 1, steam: 0 };
    if (t < boil + boilBand) {
      const f = (t - (boil - boilBand)) / (2 * boilBand);
      return { ice: 0, water: 1 - f, steam: f };
    }
    return { ice: 0, water: 0, steam: 1 };
  }

  _triggerFlash() {
    if (this.reducedMotion) return;
    this._flashAt = performance.now();
  }

  _physics() {
    const state = this._classify();
    if (state !== this._state) {
      const prev = this._state;
      this._state = state;
      this._triggerFlash();
      this.onStateChange(state, prev);
    }

    if (this._needsLatticeReset) this._recomputeLattice();

    const energy = (() => {
      const r = this.substance.range;
      return Math.max(0, Math.min(1, (this.temperature - r[0]) / (r[1] - r[0])));
    })();

    const pressSqueeze = (state === 'gas' || state === 'evaporating')
      ? Math.max(0, (this.pressure - 1)) * 60
      : 0;
    const w = this._cssW;
    const h = this._cssH;
    const padX = 8 + pressSqueeze;
    const padY = 8;

    const t = performance.now() * 0.001;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      let vibrate = 0;

      switch (state) {
        case 'solid': {
          const dx = p.baseX - p.x;
          const dy = p.baseY - p.y;
          p.vx += dx * 0.08;
          p.vy += dy * 0.08;
          p.vx *= 0.78;
          p.vy *= 0.78;
          vibrate = 0.2 + energy * 0.6;
          break;
        }
        case 'melting': {
          const dx = p.baseX - p.x;
          const dy = p.baseY - p.y;
          p.vx += dx * 0.012;
          p.vy += dy * 0.012 + 0.04;
          p.vx *= 0.93;
          p.vy *= 0.93;
          vibrate = 1.2;
          break;
        }
        case 'liquid': {
          p.vy += 0.18;
          p.vx *= 0.96;
          p.vy *= 0.97;
          vibrate = 0.35 + energy * 0.5;
          p.vx += Math.sin(t * 1.5 + p.seed) * 0.05;
          break;
        }
        case 'evaporating': {
          p.vy += 0.04;
          p.vx *= 0.985;
          p.vy *= 0.985;
          vibrate = 1.6;
          const mix = this._phaseMix();
          if (p.phaseSeed < mix.steam) p.vy -= 0.18;
          break;
        }
        case 'gas': {
          p.vx *= 0.995;
          p.vy *= 0.995;
          p.vy -= 0.02;
          vibrate = 1.2 + energy * 1.4 + this.pressure * 0.18;
          p.vx += Math.sin(t * 0.7 + p.seed) * 0.02;
          p.vy += Math.cos(t * 0.6 + p.seed * 1.3) * 0.02;
          break;
        }
      }

      p.vx += (Math.random() - 0.5) * vibrate;
      p.vy += (Math.random() - 0.5) * vibrate;

      const maxV = state === 'gas' ? 5.5 : 4.5;
      const sp = Math.hypot(p.vx, p.vy);
      if (sp > maxV) { p.vx = (p.vx / sp) * maxV; p.vy = (p.vy / sp) * maxV; }

      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.rotV;

      const pr = p.size * 0.4;
      if (p.x < padX + pr) { p.x = padX + pr; p.vx = Math.abs(p.vx) * 0.7; }
      if (p.x > w - padX - pr) { p.x = w - padX - pr; p.vx = -Math.abs(p.vx) * 0.7; }
      if (p.y < padY + pr) { p.y = padY + pr; p.vy = Math.abs(p.vy) * 0.7; }
      if (p.y > h - padY - pr) { p.y = h - padY - pr; p.vy = -Math.abs(p.vy) * 0.7; }
    }

    if (state === 'liquid' || state === 'melting' || state === 'evaporating') {
      const n = this.particles.length;
      for (let k = 0; k < n; k++) {
        const i = (Math.random() * n) | 0;
        const j = (Math.random() * n) | 0;
        if (i === j) continue;
        const a = this.particles[i];
        const b = this.particles[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const d2 = dx * dx + dy * dy;
        const min = 18;
        if (d2 < min * min && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const push = (min - d) * 0.06;
          a.vx -= (dx / d) * push;
          a.vy -= (dy / d) * push;
          b.vx += (dx / d) * push;
          b.vy += (dy / d) * push;
        }
      }
    }
  }

  _renderParticle(p, kind, sprites) {
    const ctx = this.ctx;
    if (kind === 'ice') {
      const s = p.size;
      ctx.drawImage(sprites.ice, p.x - s / 2, p.y - s / 2, s, s);
    } else if (kind === 'water') {
      const s = p.size * 0.95;
      ctx.drawImage(sprites.drop, p.x - s / 2, p.y - s / 2, s, s);
    } else {
      const s = p.size * 2.4;
      ctx.save();
      ctx.globalAlpha = 0.55;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.drawImage(sprites.steam[p.steamVariant], -s / 2, -s / 2, s, s);
      ctx.restore();
    }
  }

  _render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this._cssW, this._cssH);

    const sprites = this.sprites[this.substance.id] || this.sprites.water;
    const state = this._state;

    if ((state === 'gas' || state === 'evaporating') && this.pressure > 1) {
      const sq = (this.pressure - 1) * 60;
      ctx.fillStyle = 'rgba(232,93,93,0.06)';
      ctx.fillRect(0, 0, sq, this._cssH);
      ctx.fillRect(this._cssW - sq, 0, sq, this._cssH);
    }

    const mix = this._phaseMix();
    const steamList = [];
    const waterList = [];
    const iceList = [];
    for (const p of this.particles) {
      const r = p.phaseSeed;
      if (r < mix.ice) iceList.push(p);
      else if (r < mix.ice + mix.water) waterList.push(p);
      else steamList.push(p);
    }
    for (const p of steamList) this._renderParticle(p, 'steam', sprites);
    for (const p of waterList) this._renderParticle(p, 'water', sprites);
    for (const p of iceList)   this._renderParticle(p, 'ice',   sprites);
  }

  _loop(now) {
    if (this._destroyed) return;
    if (!this.canvas.isConnected) { requestAnimationFrame(this._loop); return; }

    if (this.particles.length === 0 && this._cssW > 4 && this._cssH > 4) {
      this._seedParticles();
      this._syncState();
    }

    if (this.running) this._physics();
    this._render();

    this._statTick = (this._statTick || 0) + Math.min(0.05, (now - this._lastTime) / 1000);
    this._lastTime = now;
    if (this._statTick > 0.2) {
      this._statTick = 0;
      this._emitStats();
    }

    requestAnimationFrame(this._loop);
  }

  destroy() { this._destroyed = true; this.running = false; }
}
