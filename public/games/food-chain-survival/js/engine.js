/* ===========================================================================
   Food Chain Survival — Core Engine
   Vanilla canvas. Shared systems: assets, sprites, input, camera, audio,
   particles, floating text, math utils, vision/LOS.
   =========================================================================== */
(function (global) {
  'use strict';

  /* ---------- math utils ---------- */
  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;
  const dist2 = (ax, ay, bx, by) => { const dx = bx - ax, dy = by - ay; return dx * dx + dy * dy; };
  const dist = (ax, ay, bx, by) => Math.sqrt(dist2(ax, ay, bx, by));
  const rand = (a, b) => a + Math.random() * (b - a);
  const randi = (a, b) => Math.floor(rand(a, b + 1));
  const pick = (arr) => arr[(Math.random() * arr.length) | 0];
  function angleDiff(a, b) { let d = (b - a) % TAU; if (d < -Math.PI) d += TAU; if (d > Math.PI) d -= TAU; return d; }
  function approach(cur, target, step) { if (cur < target) return Math.min(cur + step, target); if (cur > target) return Math.max(cur - step, target); return cur; }

  /* ---------- asset loader ---------- */
  function loadImage(src) {
    return new Promise((res, rej) => {
      const img = new Image();
      img.onload = () => res(img);
      img.onerror = () => rej(new Error('Failed to load ' + src));
      img.src = src;
    });
  }

  const Assets = {
    anims: {}, // key "species" -> { animName: {img,cw,ch,n} }
    async load(manifest) {
      const tasks = [];
      for (const species of Object.keys(manifest)) {
        this.anims[species] = {};
        for (const a of manifest[species]) {
          tasks.push(
            loadImage(a.file).then((img) => {
              this.anims[species][a.anim] = { img, cw: a.cw, ch: a.ch, n: a.n, cols: a.cols };
            })
          );
        }
      }
      await Promise.all(tasks);
    },
    get(species, anim) { return this.anims[species] && this.anims[species][anim]; },
  };

  /* ---------- animated sprite ----------
     Anchored at bottom-center (feet) so it sits on the ground plane. */
  class Sprite {
    constructor(species, opts = {}) {
      this.species = species;
      this.x = opts.x || 0;
      this.y = opts.y || 0;
      this.scale = opts.scale || 1;
      this.flipX = !!opts.flipX;
      this.anim = null;
      this.frame = 0;
      this.t = 0;
      this.fps = opts.fps || 10;
      this.loop = true;
      this.done = false;
      this.onEnd = null;
      this.anchorY = opts.anchorY != null ? opts.anchorY : 0.92; // fraction of height = feet line
      this.setAnim(opts.anim || 'idle');
    }
    setAnim(name, { fps, loop = true, onEnd = null, reset = true } = {}) {
      if (this.anim === name && !reset) return;
      const data = Assets.get(this.species, name);
      if (!data) return;
      if (this.anim !== name) { this.frame = 0; this.t = 0; this.done = false; }
      this.anim = name;
      this.loop = loop;
      this.onEnd = onEnd;
      if (fps != null) this.fps = fps;
    }
    update(dt) {
      const data = Assets.get(this.species, this.anim);
      if (!data) return;
      this.t += dt;
      const spf = 1 / this.fps;
      while (this.t >= spf) {
        this.t -= spf;
        if (this.frame + 1 >= data.n) {
          if (this.loop) this.frame = 0;
          else { this.done = true; if (this.onEnd) { const cb = this.onEnd; this.onEnd = null; cb(); } break; }
        } else this.frame++;
      }
    }
    draw(ctx, cam) {
      const data = Assets.get(this.species, this.anim);
      if (!data) return;
      // guard against an image that isn't decoded yet or failed to load
      // (avoids drawImage throwing on a 'broken' HTMLImageElement, e.g. during reload)
      if (!data.img || !data.img.complete || data.img.naturalWidth === 0) return;
      const w = data.cw * this.scale, h = data.ch * this.scale;
      const sx = this.x - cam.x, sy = this.y - cam.y;
      ctx.save();
      ctx.translate(sx, sy);
      if (this.flipX) ctx.scale(-1, 1);
      // soft contact shadow
      ctx.save();
      ctx.globalAlpha = 0.22;
      ctx.fillStyle = '#1c2a12';
      ctx.beginPath();
      ctx.ellipse(0, 0, w * 0.30, w * 0.12, 0, 0, TAU);
      ctx.fill();
      ctx.restore();
      ctx.drawImage(data.img, this.frame * data.cw, 0, data.cw, data.ch,
        -w / 2, -h * this.anchorY, w, h);
      ctx.restore();
    }
  }

  /* ---------- input ---------- */
  const Input = {
    keys: {},
    pointer: { x: 0, y: 0, down: false, justDown: false },
    _justKeys: {},
    bind(canvas) {
      window.addEventListener('keydown', (e) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
        const k = norm(e.key);
        if (!this.keys[k]) this._justKeys[k] = true;
        this.keys[k] = true;
      }, { passive: false });
      window.addEventListener('keyup', (e) => { this.keys[norm(e.key)] = false; });
      const rect = () => canvas.getBoundingClientRect();
      const move = (cx, cy) => {
        const r = rect();
        this.pointer.x = (cx - r.left) * (canvas.width / r.width);
        this.pointer.y = (cy - r.top) * (canvas.height / r.height);
      };
      canvas.addEventListener('mousemove', (e) => move(e.clientX, e.clientY));
      canvas.addEventListener('mousedown', (e) => { move(e.clientX, e.clientY); this.pointer.down = true; this.pointer.justDown = true; });
      window.addEventListener('mouseup', () => { this.pointer.down = false; });
      canvas.addEventListener('touchstart', (e) => { const t = e.touches[0]; move(t.clientX, t.clientY); this.pointer.down = true; this.pointer.justDown = true; }, { passive: true });
      canvas.addEventListener('touchmove', (e) => { const t = e.touches[0]; move(t.clientX, t.clientY); }, { passive: true });
      window.addEventListener('touchend', () => { this.pointer.down = false; });
      function norm(k) {
        if (k === 'ArrowUp') return 'up'; if (k === 'ArrowDown') return 'down';
        if (k === 'ArrowLeft') return 'left'; if (k === 'ArrowRight') return 'right';
        if (k === ' ') return 'space';
        return k.toLowerCase();
      }
    },
    down(k) { return !!this.keys[k]; },
    pressed(k) { return !!this._justKeys[k]; },
    axis() {
      let x = 0, y = 0;
      if (this.keys['a'] || this.keys['left']) x -= 1;
      if (this.keys['d'] || this.keys['right']) x += 1;
      if (this.keys['w'] || this.keys['up']) y -= 1;
      if (this.keys['s'] || this.keys['down']) y += 1;
      if (x && y) { const inv = 1 / Math.sqrt(2); x *= inv; y *= inv; }
      return { x, y };
    },
    endFrame() { this._justKeys = {}; this.pointer.justDown = false; },
  };

  /* ---------- camera ---------- */
  class Camera {
    constructor(vw, vh) { this.x = 0; this.y = 0; this.vw = vw; this.vh = vh; this.bottomInset = 0; this.offsetY = 0; }
    follow(tx, ty, worldW, worldH, k = 0.12) {
      // The target sits at screen-Y `vh/2 - offsetY`. offsetY = 0 puts the player
      // dead-centre; a positive value lifts it up the frame. Tune offsetY to set
      // the vertical framing (e.g. to balance a HUD that eats the bottom edge).
      const dx = tx - this.vw / 2, dy = ty - this.vh / 2 + this.offsetY;
      this.x = lerp(this.x, dx, k);
      this.y = lerp(this.y, dy, k);
      // Hard stop so the target can never outrun the smoothed camera and slide off
      // the visible area (e.g. during a fast dash): keep it within `pad` of every
      // screen edge. The lerp already holds it near centre in the interior, so this
      // only bites on very fast moves and at the world edges.
      const pad = Math.min(48, this.vw * 0.25, this.vh * 0.25);
      this.x = clamp(this.x, tx - (this.vw - pad), tx - pad);
      this.y = clamp(this.y, ty - (this.vh - pad), ty - pad);
      // Then keep the camera inside the world. Top, left and right stop exactly at
      // the world edge; the bottom stops early by `bottomInset` world-px, so the
      // camera never reveals/scrolls the world all the way to its bottom edge.
      this.x = clamp(this.x, 0, Math.max(0, worldW - this.vw));
      this.y = clamp(this.y, 0, Math.max(0, worldH - this.vh - this.bottomInset));
    }
  }

  /* ---------- audio (WebAudio synth) ---------- */
  const Audio = {
    ctx: null, muted: false,
    ensure() { if (!this.ctx) { try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} } if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume(); },
    blip(freq = 440, dur = 0.1, type = 'sine', vol = 0.18, slideTo = null) {
      if (this.muted) return; this.ensure(); if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const o = this.ctx.createOscillator(), g = this.ctx.createGain();
      o.type = type; o.frequency.setValueAtTime(freq, t);
      if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
      o.connect(g); g.connect(this.ctx.destination);
      o.start(t); o.stop(t + dur + 0.02);
    },
    chord(freqs, dur = 0.3, type = 'triangle', vol = 0.12) { freqs.forEach((f, i) => setTimeout(() => this.blip(f, dur, type, vol), i * 55)); },
    noise(dur = 0.18, vol = 0.16) {
      if (this.muted) return; this.ensure(); if (!this.ctx) return;
      const t = this.ctx.currentTime, n = this.ctx.sampleRate * dur;
      const buf = this.ctx.createBuffer(1, n, this.ctx.sampleRate), data = buf.getChannelData(0);
      for (let i = 0; i < n; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / n);
      const src = this.ctx.createBufferSource(); src.buffer = buf;
      const g = this.ctx.createGain(); g.gain.value = vol;
      const f = this.ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1200;
      src.connect(f); f.connect(g); g.connect(this.ctx.destination); src.start(t);
    },
    // semantic cues
    eat() { this.blip(520, 0.08, 'triangle', 0.16, 660); },
    pickup() { this.chord([523, 659, 784], 0.22, 'triangle', 0.13); },
    alert() { this.blip(300, 0.14, 'sawtooth', 0.14, 180); },
    pounce() { this.blip(180, 0.22, 'sawtooth', 0.2, 90); this.noise(0.18, 0.12); },
    spore() { this.blip(700, 0.12, 'sine', 0.12, 1100); },
    win() { this.chord([523, 659, 784, 1046], 0.4, 'triangle', 0.16); },
    lose() { this.chord([392, 311, 233], 0.45, 'sawtooth', 0.15); },
    step() { this.blip(rand(140, 180), 0.05, 'sine', 0.05); },
  };

  /* ---------- particles + floating text ---------- */
  class FX {
    constructor() { this.parts = []; this.texts = []; }
    burst(x, y, color, n = 10, opts = {}) {
      const spd = opts.spd || 90, life = opts.life || 0.6, size = opts.size || 4;
      for (let i = 0; i < n; i++) {
        const a = rand(0, TAU), s = rand(spd * 0.3, spd);
        this.parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - (opts.up || 0), life, max: life, color, size: rand(size * 0.5, size), g: opts.g != null ? opts.g : 120 });
      }
    }
    ring(x, y, color, r0 = 6, r1 = 60, life = 0.5) { this.parts.push({ ring: true, x, y, r0, r1, life, max: life, color }); }
    text(x, y, str, color = '#fff', opts = {}) { this.texts.push({ x, y, str, color, life: opts.life || 1.0, max: opts.life || 1.0, vy: opts.vy || -34, size: opts.size || 18, bold: opts.bold !== false }); }
    update(dt) {
      for (let i = this.parts.length - 1; i >= 0; i--) {
        const p = this.parts[i]; p.life -= dt;
        if (p.life <= 0) { this.parts.splice(i, 1); continue; }
        if (!p.ring) { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += p.g * dt; p.vx *= 0.98; }
      }
      for (let i = this.texts.length - 1; i >= 0; i--) {
        const t = this.texts[i]; t.life -= dt; t.y += t.vy * dt; if (t.life <= 0) this.texts.splice(i, 1);
      }
    }
    draw(ctx, cam) {
      for (const p of this.parts) {
        const a = clamp(p.life / p.max, 0, 1);
        ctx.globalAlpha = a;
        if (p.ring) {
          const r = lerp(p.r0, p.r1, 1 - a);
          ctx.strokeStyle = p.color; ctx.lineWidth = 3 * a;
          ctx.beginPath(); ctx.arc(p.x - cam.x, p.y - cam.y, r, 0, TAU); ctx.stroke();
        } else {
          ctx.fillStyle = p.color;
          ctx.beginPath(); ctx.arc(p.x - cam.x, p.y - cam.y, p.size, 0, TAU); ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      for (const t of this.texts) {
        const a = clamp(t.life / t.max, 0, 1);
        ctx.globalAlpha = a;
        ctx.font = (t.bold ? '800 ' : '600 ') + t.size + 'px Nunito, sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(20,30,12,0.55)';
        ctx.strokeText(t.str, t.x - cam.x, t.y - cam.y);
        ctx.fillStyle = t.color; ctx.fillText(t.str, t.x - cam.x, t.y - cam.y);
      }
      ctx.globalAlpha = 1;
    }
  }

  /* ---------- vision cone + line of sight ---------- */
  // Returns true if (tx,ty) is within cone from (ox,oy) facing `face` (rad),
  // half-fov `half` (rad), and `range`, with no blocker circle on the segment.
  function inCone(ox, oy, face, half, range, tx, ty, blockers) {
    const d = dist(ox, oy, tx, ty);
    if (d > range || d < 1) return d < 1;
    const ang = Math.atan2(ty - oy, tx - ox);
    if (Math.abs(angleDiff(face, ang)) > half) return false;
    if (blockers) for (const b of blockers) {
      if (segCircle(ox, oy, tx, ty, b.x, b.y, b.r)) return false;
    }
    return true;
  }
  function segCircle(x1, y1, x2, y2, cx, cy, r) {
    const dx = x2 - x1, dy = y2 - y1; const l2 = dx * dx + dy * dy || 1;
    let t = ((cx - x1) * dx + (cy - y1) * dy) / l2; t = clamp(t, 0, 1);
    const px = x1 + t * dx, py = y1 + t * dy;
    return dist2(px, py, cx, cy) < r * r;
  }

  function drawCone(ctx, cam, ox, oy, face, half, range, color, alpha) {
    ctx.save();
    ctx.translate(ox - cam.x, oy - cam.y);
    ctx.rotate(face);
    const grad = ctx.createRadialGradient(0, 0, 8, 0, 0, range);
    grad.addColorStop(0, color.replace('A', (alpha * 0.9).toFixed(2)));
    grad.addColorStop(1, color.replace('A', '0'));
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.moveTo(0, 0);
    ctx.arc(0, 0, range, -half, half); ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  global.Game = {
    TAU, clamp, lerp, dist, dist2, rand, randi, pick, angleDiff, approach,
    loadImage, Assets, Sprite, Input, Camera, Audio, FX, inCone, drawCone, segCircle,
  };
})(window);
