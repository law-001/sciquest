/* ===========================================================================
   Level 1 — Fault Lab (earthquake & tsunami simulator)
   Side-view cross-section: sky, ocean + coastal town on the surface, crust
   with two faults underneath, mantle at the bottom. The player places the
   focus on a fault, sets magnitude + depth, and runs the quake. Four guided
   "discoveries" turn free experimenting into the win condition.
   =========================================================================== */
(function (global) {
  'use strict';
  const G = global.Game;
  const { clamp, lerp, dist, rand, TAU } = G;

  const SEA = 230;          // sea level / land surface y
  const COAST = 420;        // shoreline x
  const MOHO = 480;         // crust/mantle boundary y
  const SKY_DARKEN = 0.2;  // black overlay opacity on the sky backdrop (0 = off, 1 = pitch black)
  const P_SPD = 260, S_SPD = 140;

  // Tsunami = a 1D shallow-water field over the cross-section (staggered grid,
  // surface-gradient pressure, upwind mass flux, friction, left sponge). Tunables:
  const W_N = 200;          // sim cells across the world width
  const W_G = 340;          // gravity → wave speed sqrt(g·depth): fast+small in deep water
  const W_DRY = 0.6;        // depth (px) below which a cell is dry
  const W_DRAG = 0.006;     // open-water drag (low → waves travel)
  const W_DRAG_SH = 0.5;    // extra drag in shallow water (÷depth)
  const W_LAND_DRAG = 0.85; // extra drag on land → run-up piles up and stops, then recedes
  const W_SPONGE = 16;      // left cells that absorb the seaward-going wave
  const W_UMAX = 160;       // velocity clamp (stability)

  const seabedY = (x) => x >= COAST ? SEA : SEA + (1 - x / COAST) * 105; // slopes down to 335 at x=0
  const DEPTH_BANDS = {
    shallow: { y0: 252, y1: 310, mid: 280, km: [10, 65], factor: 1.0, label: 'Shallow' },
    medium:  { y0: 310, y1: 390, mid: 350, km: [70, 290], factor: 0.55, label: 'Medium' },
    deep:    { y0: 390, y1: 468, mid: 430, km: [300, 600], factor: 0.28, label: 'Deep' },
  };
  const bandOf = (y) => y < DEPTH_BANDS.shallow.y1 ? 'shallow' : y < DEPTH_BANDS.medium.y1 ? 'medium' : 'deep';

  // Two near-vertical faults: one offshore (tsunami maker), one under town.
  const FAULTS = [
    { key: 'offshore', name: 'Offshore fault', pts: [[230, 290], [236, 320], [252, 360], [240, 400], [256, 440], [246, 468]] },
    { key: 'inland', name: 'Inland fault', pts: [[648, 232], [632, 280], [650, 330], [636, 385], [652, 440], [642, 468]] },
  ];

  const DISCOVERIES = [
    { id: 'd1', label: 'Run your first earthquake' },
    { id: 'd2', label: 'Shake the town — M7+, shallow, on the inland fault' },
    { id: 'd3', label: 'Trigger a tsunami — big shallow quake offshore' },
    { id: 'd4', label: 'Go deep — M7+ from the deep zone, and compare the shaking' },
  ];

  const INTENSITY_WORDS = [[0.12, 'Weak'], [0.35, 'Light'], [0.7, 'Moderate'], [1.1, 'Strong'], [1.8, 'Severe'], [99, 'Violent']];
  const intensityWord = (v) => (INTENSITY_WORDS.find((w) => v < w[0]) || INTENSITY_WORDS[5])[1];

  class Level1 extends G.LevelBase {
    init() {
      // Fixed world coordinate space; the canvas backing buffer is resized to
      // the viewport and the world is cover-scaled to fill it (see draw/resize).
      this.W = 960; this.H = 600;
      this.hud.config({
        role: 'SEISMOLOGIST', goal: this.meta.hudGoal, shell: true, touch: null,
      });
      this.found = {};                     // discovery id -> true
      this.runs = 0; this.maxM = 0; this.tsunamis = 0;
      this.M = 6.0; this.depthKey = 'shallow'; this.speed = 1;
      this.fault = FAULTS[1];              // start on the inland fault
      this.focus = this.faultPointAt(this.fault, DEPTH_BANDS.shallow.mid);
      this.run = null;                     // active simulation state
      this.buildTown();
      // sky backdrop + drifting cloud sprites (fall back to the painted sky /
      // no clouds until the PNGs load).
      this.skyImg = new Image();
      this.skyImg.src = 'Building%20Assets/SKY.png';
      this.cloudImgs = [1, 2, 3, 4].map((n) => {
        const im = new Image(); im.src = 'Building%20Assets/CLOUDS/CLOUDS_' + n + '.png'; return im;
      });
      this.clouds = Array.from({ length: 5 }, () => this.spawnCloud(true));
      // optional rock/magma textures, each clipped to its band's shape when
      // present (drop CRUST.png / MANTLE.png in Building Assets); until then the
      // painted gradients below stand in.
      this.crustImg = new Image(); this.crustImg.src = 'Building%20Assets/NEWER_CRUST.png';
      this.mantleImg = new Image(); this.mantleImg.src = 'Building%20Assets/NEW_MANTLE.png';
      this._view = { s: 1, offX: 0, offY: 0 };
      this.wireDom();
      this.renderDiscoveries();
      this.syncReadouts();
      this.updateProgress();
      this.resize();
      this.ro = new ResizeObserver(() => this.resize());
      this.ro.observe(this.canvas);
      this.hud.hint('Click a fault to place the focus, set magnitude and depth, then press Start!', 6.5);
    }

    /* size the canvas backing buffer to the viewport it now fills */
    resize() {
      const cv = this.canvas;
      const w = cv.clientWidth, h = cv.clientHeight;
      if (!w || !h) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      const s = Math.max(cv.width / this.W, cv.height / this.H);   // cover
      this._view = { s, offX: (cv.width - this.W * s) / 2, offY: (cv.height - this.H * s) / 2 };
    }
    // viewport (device px, from Input.pointer) → world coords
    toWorld(px, py) {
      const v = this._view;
      return { x: (px - v.offX) / v.s, y: (py - v.offY) / v.s };
    }

    // one drifting cloud: a random sprite, height, scale and speed. `onscreen`
    // scatters it across the sky at start; otherwise it enters just off the left.
    spawnCloud(onscreen) {
      const img = this.cloudImgs[(Math.random() * this.cloudImgs.length) | 0];
      const s = rand(0.5, 1.05);
      const w = (img.naturalWidth || 150) * s;
      return { img, s, y: rand(14, 122), spd: rand(4.5, 13), x: onscreen ? rand(0, this.W) : -w - rand(20, 200) };
    }

    /* ---------------- town + props ---------------- */
    buildTown() {
      // cx = base-center in world x · type = building sprite sheet · sh = on-screen
      // height (px) · strength divides damage (how well-built it is).
      this.buildings = [
        { cx: 470, type: 'shack',     sh: 56,  strength: 0.55 },
        { cx: 556, type: 'small',     sh: 60,  strength: 1.0 },
        { cx: 646, type: 'house',     sh: 68,  strength: 1.0 },
        { cx: 740, type: 'school',    sh: 74,  strength: 1.1 },
        { cx: 832, type: 'apartment', sh: 106, strength: 1.55 },
        { cx: 918, type: 'office',    sh: 120, strength: 1.5 },
      ];
      for (const b of this.buildings) { b.integrity = 1; b.swayT = rand(0, TAU); b.washed = false; }
      this.trees = [508, 690, 878].map((x) => ({ x, sway: 0, t: rand(0, TAU) }));
      this.poles = [600, 785, 950].map((x) => ({ x, sway: 0, t: rand(0, TAU) }));
      // road as tiled sections (each takes damage 1 intact … 4 buckled)
      this.road = [];
      const RX0 = COAST + 16, RN = 10, rw = (this.W - 2 - RX0) / RN;
      for (let i = 0; i < RN; i++) this.road.push({ x: RX0 + i * rw, w: rw, integrity: 1 });
      // sand beach — also the shoreline "hitbox" the water laps against. Its left
      // (ocean-facing) edge is the diagonal from (edgeTop, y) down to (edgeBot,
      // y + h - drop). Tweak x/y/w/h + edgeTop/edgeBot/drop to move the shore.
      this.sand = { x: COAST - 45, y: SEA - 3, w: 95, h: 23, edgeTop: 20, edgeBot: 0, drop: 7 };
      this.boat = { x: 150, bob: 0 };
      this.initWater();
    }
    resetTown() { this.buildTown(); }

    /* ---------------- tsunami: 1D shallow-water sim ---------------- */
    initWater() {
      const N = W_N, dx = this.W / N;
      this.wN = N; this.wdx = dx;
      this.zb = new Float32Array(N);   // bed elevation above sea datum (px): seabed offshore, ~0 on land
      this.h = new Float32Array(N);    // water depth (px)
      this.u = new Float32Array(N);    // velocity at face i (between cell i and i+1)
      this._wf = new Float32Array(N);  // scratch mass flux
      for (let i = 0; i < N; i++) {
        const x = (i + 0.5) * dx;
        this.zb[i] = x < COAST ? -(seabedY(x) - SEA) : 0;
        this.h[i] = Math.max(0, -this.zb[i]);           // calm sea: eta (surface) = 0
      }
      this.waterTime = 0; this.tsuPulses = []; this.tsuSettled = false; this._tsuWarned = false;
    }
    // co-seismic displacement: raise the sea seaward of x0 and dip it shoreward,
    // so the shore-bound wave leads with a drawdown (an N-wave), then surges.
    injectPulse(x0, amp) {
      const N = this.wN, dx = this.wdx, h = this.h, wlen = 95;
      for (let i = 0; i < N; i++) {
        if (h[i] <= W_DRY) continue;                    // only displace the ocean
        const x = (i + 0.5) * dx;
        const up = amp * Math.exp(-((x - (x0 - 30)) ** 2) / (2 * wlen * wlen));
        const dn = amp * 0.55 * Math.exp(-((x - (x0 + 50)) ** 2) / (2 * wlen * wlen));
        h[i] = Math.max(0.1, h[i] + up - dn);
      }
    }
    substep(dt) {
      const N = this.wN, dx = this.wdx, zb = this.zb, h = this.h, u = this.u, F = this._wf;
      for (let i = 0; i < N - 1; i++) {                 // velocity at faces
        const etaL = h[i] + zb[i], etaR = h[i + 1] + zb[i + 1], hf = 0.5 * (h[i] + h[i + 1]);
        if (hf <= W_DRY && !(h[i] > W_DRY && etaL > zb[i + 1]) && !(h[i + 1] > W_DRY && etaR > zb[i])) { u[i] = 0; continue; }
        u[i] += (-W_G * (etaR - etaL) / dx) * dt;        // pressure = surface slope (well-balanced)
        const drag = W_DRAG + W_DRAG_SH / Math.max(hf, 1) + ((i + 1) * dx > COAST ? W_LAND_DRAG : 0);
        u[i] /= (1 + drag * dt);
        if (u[i] > W_UMAX) u[i] = W_UMAX; else if (u[i] < -W_UMAX) u[i] = -W_UMAX;
      }
      for (let i = 0; i < N - 1; i++) F[i] = u[i] >= 0 ? u[i] * h[i] : u[i] * h[i + 1];   // upwind mass flux
      for (let i = 0; i < N; i++) {
        const fL = i > 0 ? F[i - 1] : 0, fR = i < N - 1 ? F[i] : 0;
        h[i] -= dt / dx * (fR - fL);
        if (h[i] < 0) h[i] = 0;
      }
      for (let i = 0; i < W_SPONGE; i++) { const k = (W_SPONGE - i) / W_SPONGE * 0.06; h[i] += (Math.max(0, -zb[i]) - h[i]) * k; u[i] *= (1 - k); }
    }
    stepWater(frameDt) {
      let cmax = 1; for (let i = 0; i < this.wN; i++) { const c = Math.sqrt(W_G * Math.max(this.h[i], 0)); if (c > cmax) cmax = c; }
      const nsub = Math.min(12, Math.max(1, Math.ceil(frameDt / (0.4 * this.wdx / (cmax + 30)))));   // CFL substeps
      for (let s = 0; s < nsub; s++) this.substep(frameDt / nsub);
    }
    waterCell(x) { return clamp(Math.floor(x / this.wdx), 0, this.wN - 1); }
    waterDepthAt(x) { return this.h[this.waterCell(x)]; }
    etaAt(x) { const i = this.waterCell(x); return this.h[i] + this.zb[i]; }
    maxEta() { let m = 0; for (let i = 0; i < this.wN; i++) { const e = Math.abs(this.h[i] + this.zb[i]); if (e > m) m = e; } return m; }

    /* ---------------- fault helpers ---------------- */
    faultPointAt(fault, y) {
      const pts = fault.pts;
      for (let i = 0; i < pts.length - 1; i++) {
        const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
        if (y >= y0 && y <= y1) return { x: lerp(x0, x1, (y - y0) / (y1 - y0)), y };
      }
      const top = pts[0], bot = pts[pts.length - 1];
      return y < top[1] ? { x: top[0], y: Math.max(top[1], DEPTH_BANDS.shallow.y0) } : { x: bot[0], y: bot[1] };
    }
    nearestOnFault(fault, px, py) {
      let best = null, bestD = 1e9;
      const pts = fault.pts;
      for (let i = 0; i < pts.length - 1; i++) {
        const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
        const dx = x1 - x0, dy = y1 - y0, l2 = dx * dx + dy * dy || 1;
        const t = clamp(((px - x0) * dx + (py - y0) * dy) / l2, 0, 1);
        const qx = x0 + t * dx, qy = y0 + t * dy;
        const d = dist(px, py, qx, qy);
        if (d < bestD) { bestD = d; best = { x: qx, y: qy }; }
      }
      return { pt: best, d: bestD };
    }

    /* ---------------- dashboard DOM (sidebar + console) ---------------- */
    wireDom() {
      const $ = (s) => document.querySelector(s);
      this.dom = {
        slider: $('#magSlider'), magValue: $('#magValue'),
        start: $('#startSimBtn'), reset: $('#resetSimBtn'),
        depthBtns: [...document.querySelectorAll('#depthSeg .seg-btn')],
        speedBtns: [...document.querySelectorAll('#speedSeg .seg-btn')],
        conEpi: $('#conEpi'), tip: $('#simTip'),
        statMag: $('#statMag'), statDepth: $('#statDepth'), statEpi: $('#statEpi'), statFault: $('#statFault'),
        lightShake: $('#lightShake'), lightTsu: $('#lightTsu'),
        discList: $('#simDiscList'), progFill: $('#simProgFill'), progTxt: $('#simProgTxt'),
        missionTitle: $('#simMissionTitle'), missionGoal: $('#simMissionGoal'),
      };
      this.dom.missionTitle.textContent = this.meta.title;

      this._onSlider = () => {
        this.M = parseFloat(this.dom.slider.value);
        this.dom.magValue.textContent = 'M ' + this.M.toFixed(1);
        this.syncReadouts();
      };
      this._onDepth = (e) => {
        this.depthKey = e.currentTarget.dataset.depth;
        if (!this.run) this.focus = this.faultPointAt(this.fault, DEPTH_BANDS[this.depthKey].mid);
        this.syncReadouts();
        G.Audio.blip(500, 0.06, 'triangle', 0.1);
      };
      this._onSpeed = (e) => {
        this.speed = parseFloat(e.currentTarget.dataset.speed);
        this.dom.speedBtns.forEach((b) => b.classList.toggle('on', b === e.currentTarget));
        G.Audio.blip(560, 0.05, 'triangle', 0.09);
      };
      this._onStart = () => this.startRun();
      this._onReset = () => this.resetSim();

      this.dom.slider.value = this.M;
      this.dom.slider.addEventListener('input', this._onSlider);
      this.dom.depthBtns.forEach((b) => b.addEventListener('click', this._onDepth));
      this.dom.speedBtns.forEach((b) => b.addEventListener('click', this._onSpeed));
      this.dom.start.addEventListener('click', this._onStart);
      this.dom.reset.addEventListener('click', this._onReset);
      this.dom.speedBtns.forEach((b) => b.classList.toggle('on', parseFloat(b.dataset.speed) === this.speed));
      this._onSlider();
    }
    cleanup() {
      if (this.ro) this.ro.disconnect();
      this.canvas.width = 960; this.canvas.height = 600;   // restore for Levels 2 & 3
      if (!this.dom) return;
      this.dom.slider.removeEventListener('input', this._onSlider);
      this.dom.depthBtns.forEach((b) => b.removeEventListener('click', this._onDepth));
      this.dom.speedBtns.forEach((b) => b.removeEventListener('click', this._onSpeed));
      this.dom.start.removeEventListener('click', this._onStart);
      this.dom.reset.removeEventListener('click', this._onReset);
    }

    renderDiscoveries() {
      this.dom.discList.innerHTML = '';
      for (const d of DISCOVERIES) {
        const li = document.createElement('li');
        li.dataset.disc = d.id;
        li.innerHTML = '<span class="tick"></span><span>' + d.label + '</span>';
        this.dom.discList.appendChild(li);
      }
    }
    updateProgress() {
      const total = Object.keys(this.found).length;
      this.dom.progFill.style.width = (total / DISCOVERIES.length * 100) + '%';
      this.dom.progTxt.textContent = total + ' / ' + DISCOVERIES.length;
    }
    resetSim() {
      this.run = null;
      this.resetTown();
      this.fx.parts.length = 0; this.fx.texts.length = 0;
      this.dom.start.disabled = false;
      this.syncReadouts();
      this.hud.hint('Simulation reset — adjust the controls and run again.', 3.5);
      G.Audio.blip(360, 0.09, 'triangle', 0.1, 300);
    }

    syncReadouts() {
      const band = DEPTH_BANDS[this.depthKey];
      const frac = clamp((this.focus.y - band.y0) / (band.y1 - band.y0), 0, 1);
      const km = Math.round(lerp(band.km[0], band.km[1], frac));
      const offshore = this.focus.x < COAST;
      this.dom.depthBtns.forEach((b) => b.classList.toggle('on', b.dataset.depth === this.depthKey));
      // sidebar seismograph
      this.dom.statMag.textContent = 'M ' + this.M.toFixed(1);
      this.dom.statMag.classList.toggle('hot', this.M >= 7);
      this.dom.statDepth.textContent = km + ' km · ' + band.label;
      this.dom.statEpi.textContent = offshore ? 'Open ocean' : 'Bayside Town';
      this.dom.statFault.textContent = this.fault.name;
      // console epicenter readout
      this.dom.conEpi.textContent = this.fault.name;
      if (!this.run) {
        this.dom.lightShake.lastChild.textContent = 'Shaking: —';
        this.dom.lightShake.classList.remove('live');
        this.dom.lightTsu.lastChild.textContent = 'Tsunami: none';
        this.dom.lightTsu.classList.remove('warn');
        this.dom.tip.textContent = offshore
          ? 'Focus is offshore — a big shallow slip here can shove the whole water column into a tsunami.'
          : 'Focus is inland, right under Bayside Town — shallow M7+ quakes will wreck it.';
      }
    }

    /* ---------------- simulation ---------------- */
    startRun() {
      if (this.run) return;
      this.resetTown();
      this.runs++;
      this.maxM = Math.max(this.maxM, this.M);
      const depthF = DEPTH_BANDS[this.depthKey].factor;
      const amp = Math.pow((this.M - 3) / 6, 2) * 3.2;         // 0 → 3.2 across M3..M9
      const epiX = this.focus.x;
      const sArrive = (this.focus.y - SEA) / S_SPD;
      const shakeDur = 2.6 + (this.M - 3) * 0.85;
      const makesTsunami = this.fault.key === 'offshore' && this.M >= 6.5 && this.depthKey !== 'deep';
      this.run = {
        t: 0, M: this.M, depthKey: this.depthKey, fault: this.fault, amp, depthF, epiX,
        ocean: epiX < COAST, sArrive, shakeDur, peak: 0, saidS: false, saidDraw: false,
        endAt: sArrive + shakeDur + 1.6,
        tsunami: makesTsunami ? { hit: false } : null,
      };
      if (makesTsunami) {
        // wave-train amplitude scales with magnitude; later pulses are weaker
        const A = clamp((this.M - 6.5) * 14 + 8, 8, 46) * 1.2;   // wave amplitude
        this.tsuX0 = this.focus.x;
        this.tsuPulses = [{ t: 0.8, amp: A }, { t: 6, amp: A * 0.58 }, { t: 11, amp: A * 0.35 }];
        this.run.endAt = Math.max(this.run.endAt, 24);
      }
      this.dom.start.disabled = true;
      this.dom.tip.textContent = 'Rocks along the fault suddenly slip — seismic waves race outward from the focus.';
      // fault slip burst
      this.fx.burst(this.focus.x, this.focus.y, '#ffbb55', 18, { spd: 130, size: 5 });
      this.fx.ring(this.focus.x, this.focus.y, '#ffdd88', 4, 60, 0.7);
      G.Audio.noise(0.5, 0.3); G.Audio.blip(70, 0.7, 'sawtooth', 0.25, 45);
    }

    intensityAt(x) {
      const r = this.run; if (!r) return 0;
      const fall = 1 / (1 + Math.pow(Math.abs(x - r.epiX) / 260, 1.5));
      return r.amp * r.depthF * fall;
    }

    update(dt) {
      dt *= this.speed;                    // simulation-speed control (0.5× / 1× / 2×)
      this.time += dt;
      // clouds drift right; re-randomise each one as it leaves the right edge
      for (let i = 0; i < this.clouds.length; i++) {
        const cl = this.clouds[i];
        cl.x += dt * cl.spd;
        if (cl.x > this.W + 20) this.clouds[i] = this.spawnCloud(false);
      }
      this.boat.bob = Math.sin(this.time * 1.7) * 3;

      // ----- idle: pick focus on a fault (pointer is in viewport px → world) -----
      const p = G.Input.pointer;
      if (!this.run && p.justDown) {
        const w = this.toWorld(p.x, p.y);
        let best = null;
        if (w.y > SEA - 6) for (const f of FAULTS) {
          const { pt, d } = this.nearestOnFault(f, w.x, w.y);
          if (d < 46 && (!best || d < best.d)) best = { pt, d, f };
        }
        if (best) {
          this.fault = best.f;
          this.focus = { x: best.pt.x, y: clamp(best.pt.y, DEPTH_BANDS.shallow.y0, DEPTH_BANDS.deep.y1) };
          this.depthKey = bandOf(this.focus.y);
          G.Audio.blip(620, 0.07, 'triangle', 0.12);
          this.fx.ring(this.focus.x, this.focus.y, '#EE6A1F', 4, 34, 0.4);
          this.syncReadouts();
        }
      }

      const r = this.run;
      if (!r) return;
      r.t += dt;

      // ----- teaching beats -----
      if (!r.saidS && r.t >= r.sArrive) {
        r.saidS = true;
        this.hud.hint('S-waves reached the epicenter — the strongest shaking starts there and spreads out.', 4.5);
        G.Audio.alert();
      }

      // ----- shaking + damage -----
      const shaking = r.t >= r.sArrive && r.t <= r.sArrive + r.shakeDur;
      let townPeak = 0;
      for (const b of this.buildings) {
        const cx = b.cx;
        const d = dist(this.focus.x, this.focus.y, cx, SEA);
        const start = d / S_SPD, end = start + r.shakeDur * 0.9;
        const I = this.intensityAt(cx);
        townPeak = Math.max(townPeak, I);
        if (r.t >= start && r.t <= end && b.integrity > 0) {
          b.swayT += dt * (6 + I * 6);
          const before = b.integrity;
          b.integrity = clamp(b.integrity - I * dt * 0.085 / b.strength, 0, 1);
          if (before > 0.15 && b.integrity <= 0.15) {          // collapse moment
            b.integrity = 0;
            this.fx.burst(cx, SEA - 6, '#b9a58a', 22, { spd: 110, size: 5, up: 60 });
            G.Audio.noise(0.4, 0.3);
          } else if (before > 0.66 && b.integrity <= 0.66) {
            this.fx.text(cx, SEA - b.sh - 10, 'crack!', '#f5d9c2', { size: 14 });
          }
        }
      }
      r.peak = Math.max(r.peak, townPeak);
      // trees, poles, road react to local intensity
      if (shaking) {
        for (const tr of this.trees) { tr.t += dt * 7; tr.sway = Math.sin(tr.t) * clamp(this.intensityAt(tr.x), 0, 1.6) * 9; }
        for (const po of this.poles) { po.t += dt * 8; po.sway = Math.sin(po.t) * clamp(this.intensityAt(po.x), 0, 1.6) * 7; }
        for (const seg of this.road) {                       // road cracks/buckles under shaking
          const I = this.intensityAt(seg.x + seg.w / 2);
          if (I > 0.4 && seg.integrity > 0) seg.integrity = clamp(seg.integrity - I * dt * 0.1, 0, 1);
        }
      } else {
        for (const tr of this.trees) tr.sway *= 0.9;
        for (const po of this.poles) po.sway *= 0.9;
      }

      // live shaking readout (console status light + is it shaking now)
      this.dom.lightShake.lastChild.textContent = 'Shaking: ' + (r.t < r.sArrive ? 'waves travelling…' : intensityWord(townPeak));
      this.dom.lightShake.classList.toggle('live', shaking);

      // ----- tsunami: advance the shallow-water field; it shoals, floods the
      // town and recedes on its own, and a wave train arrives over time. -----
      const ts = r.tsunami;
      if (ts) {
        this.waterTime += dt;
        for (const p of this.tsuPulses) if (!p.fired && this.waterTime >= p.t) {
          p.fired = true; this.injectPulse(this.tsuX0, p.amp);
          if (!this._tsuWarned) {
            this._tsuWarned = true; this.tsunamis++;
            this.dom.lightTsu.lastChild.textContent = 'Tsunami: WARNING'; this.dom.lightTsu.classList.add('warn');
            this.hud.banner('TSUNAMI WARNING', '#ff6b4a', 1.6);
            this.hud.hint('The seafloor shoved the whole water column — a long, low wave is spreading toward the coast.', 4.5);
            G.Audio.chord([392, 370, 349], 0.5, 'sawtooth', 0.12);
          }
        }
        this.stepWater(dt);
        if (!r.saidDraw && this.tsuPulses[0] && this.tsuPulses[0].fired && this.etaAt(COAST - 24) < -3) {
          r.saidDraw = true;
          this.hud.hint('The sea pulls back from the beach first — bare seabed is the warning before the surge.', 4.5);
        }
        if (!ts.hit && this.waterDepthAt(COAST + 22) > 3) {
          ts.hit = true; this.dom.lightTsu.lastChild.textContent = 'Tsunami: IMPACT!'; G.Audio.noise(0.8, 0.35);
        }
        for (const b of this.buildings) {                      // washed by standing floodwater
          if (b.integrity > 0 && this.waterDepthAt(b.cx) > 5) {
            b.integrity = clamp(b.integrity - dt * 0.4 / b.strength, 0, 1);
            if (b.integrity === 0 && !b.washed) { b.washed = true; this.fx.burst(b.cx, SEA - 8, '#7BC9CF', 16, { spd: 90 }); }
          }
        }
        const lastP = this.tsuPulses[this.tsuPulses.length - 1];
        if (lastP && this.waterTime > lastP.t + 8 && this.maxEta() < 3) {
          this.tsuSettled = true;
          this.dom.lightTsu.lastChild.textContent = 'Tsunami: passed'; this.dom.lightTsu.classList.remove('warn');
        }
      }

      // ----- end of run -----
      if (r.t >= r.endAt && (!ts || this.tsuSettled)) this.endRun();
    }

    endRun() {
      const r = this.run;
      const newly = [];
      const grant = (id) => { if (!this.found[id]) { this.found[id] = true; newly.push(id); } };
      grant('d1');
      if (r.fault.key === 'inland' && r.M >= 7 && r.depthKey === 'shallow' && this.buildings.some((b) => b.integrity < 0.5)) grant('d2');
      if (r.tsunami && r.tsunami.hit) grant('d3');
      if (r.depthKey === 'deep' && r.M >= 7 && r.peak < 1.1) grant('d4');

      for (const id of newly) {
        const li = this.dom.discList.querySelector('li[data-disc="' + id + '"]');
        if (li) li.classList.add('done');
      }
      this.updateProgress();
      const total = Object.keys(this.found).length;
      if (newly.length) {
        G.Audio.pickup();
        const last = DISCOVERIES.find((d) => d.id === newly[newly.length - 1]);
        this.hud.banner('Discovery!', '#ffd24a', 1.3);
        this.hud.hint('Discovery: ' + last.label, 4);
      } else if (r.depthKey === 'deep' && r.M >= 7) {
        this.hud.hint('Notice how gentle that was? Deep-focus waves lose energy on the long trip up.', 4.5);
      }

      this.run = null;
      this.dom.start.disabled = false;
      this.syncReadouts();

      if (total >= DISCOVERIES.length) {
        const stars = this.runs <= 5 ? 3 : this.runs <= 8 ? 2 : 1;
        const fb = [];
        fb.push('You proved the big three: shaking fades with distance, deep quakes reach the surface weaker, and only large shallow undersea quakes make tsunamis.');
        fb.push(this.runs <= 5
          ? `Four discoveries in ${this.runs} runs — efficient experimenting, a real scientist plans before pressing the button.`
          : `It took ${this.runs} runs — next time, predict what will happen before you press Start and test your guess.`);
        setTimeout(() => this.finish(true, {
          stars,
          resultKicker: 'LAB REPORT', resultTitle: 'All discoveries complete!',
          stats: [
            ['⭐ Knowledge score', `${DISCOVERIES.length} / ${DISCOVERIES.length} discoveries`],
            ['🔬 Simulations run', String(this.runs)],
            ['📈 Strongest quake', 'M ' + this.maxM.toFixed(1)],
            ['🌊 Tsunamis triggered', String(this.tsunamis)],
          ],
          feedback: fb,
        }), 600);
      }
    }

    /* ================= drawing ================= */
    draw() {
      const c = this.ctx;
      const r = this.run;
      const v = this._view;
      // camera shake while the town is shaking
      let shx = 0, shy = 0;
      if (r && r.t >= r.sArrive && r.t <= r.sArrive + r.shakeDur) {
        const prog = (r.t - r.sArrive) / r.shakeDur;
        let a = clamp(this.intensityAt(r.epiX), 0, 1.8) * 7 * (1 - prog * 0.7);
        if (G.REDUCED) a *= 0.25;
        shx = rand(-a, a); shy = rand(-a, a);
      }
      // clear the full backing buffer, then cover-scale the fixed 960×600 world
      // to fill the viewport (crops the sky/mantle margins on wide screens).
      c.setTransform(1, 0, 0, 1, 0, 0);
      c.clearRect(0, 0, this.canvas.width, this.canvas.height);
      c.save();
      c.translate(v.offX, v.offY);
      c.scale(v.s, v.s);
      c.translate(shx, shy);

      this.drawSky(c);
      this.drawUnderground(c);
      this.drawLand(c);
      this.drawTown(c);
      this.drawSea(c);            // one water body — the ocean itself floods in, in front of the town
      this.drawWaves(c);
      this.drawMarkers(c);
      this.fx.draw(c, this.cam);
      c.restore();
    }

    drawSky(c) {
      if (this.skyImg.complete && this.skyImg.naturalWidth) {
        c.drawImage(this.skyImg, -20, -20, this.W + 40, SEA + 20);
      } else {
        const g = c.createLinearGradient(0, 0, 0, SEA);
        g.addColorStop(0, '#8ECDE8'); g.addColorStop(1, '#DFF2F8');
        c.fillStyle = g; c.fillRect(-20, -20, this.W + 40, SEA + 20);
      }
      if (SKY_DARKEN) {
        c.fillStyle = 'rgba(0,0,0,' + SKY_DARKEN + ')';
        c.fillRect(-20, -20, this.W + 40, SEA + 20);
      }
      c.fillStyle = '#FFD95C';
      c.beginPath(); c.arc(884, 54, 26, 0, TAU); c.fill();
      for (const cl of this.clouds) {
        const img = cl.img;
        if (img.complete && img.naturalWidth) c.drawImage(img, cl.x, cl.y, img.naturalWidth * cl.s, img.naturalHeight * cl.s);
      }
    }

    undergroundPath(c) {
      c.beginPath();
      c.moveTo(0, seabedY(0));
      for (let x = 0; x <= COAST; x += 30) c.lineTo(x, seabedY(x));
      c.lineTo(this.W, SEA); c.lineTo(this.W, this.H); c.lineTo(0, this.H);
      c.closePath();
    }

    // wavy top edge of the mantle (animated magma surface) → bottom of the
    // world; shared by the mantle fill and its image clip.
    mantlePath(c) {
      c.beginPath();
      c.moveTo(0, MOHO);
      for (let x = 0; x <= this.W; x += 30) c.lineTo(x, MOHO + Math.sin(x * 0.018 + this.time * 0.7) * 5);
      c.lineTo(this.W, this.H); c.lineTo(0, this.H); c.closePath();
    }

    drawUnderground(c) {
      // crust — CRUST.png clipped to the ground shape if present, else the
      // painted gradient with strata hint lines.
      if (this.crustImg.complete && this.crustImg.naturalWidth) {
        c.save(); this.undergroundPath(c); c.clip();
        c.drawImage(this.crustImg, 0, SEA - 2, this.W, MOHO - SEA + 12);
        c.restore();
      } else {
        const g = c.createLinearGradient(0, SEA, 0, MOHO);
        g.addColorStop(0, '#A87B52'); g.addColorStop(1, '#7A563B');
        c.fillStyle = g;
        this.undergroundPath(c); c.fill();
        c.strokeStyle = 'rgba(255,235,205,.12)'; c.lineWidth = 2;
        for (const y of [290, 350, 415]) {
          c.beginPath();
          for (let x = 0; x <= this.W; x += 24) {
            const yy = Math.max(y, seabedY(Math.min(x, COAST)) + 12) + Math.sin(x * 0.02 + y) * 4;
            x === 0 ? c.moveTo(x, yy) : c.lineTo(x, yy);
          }
          c.stroke();
        }
      }
      // mantle — MANTLE.png clipped to the wavy magma band if present, else gradient.
      if (this.mantleImg.complete && this.mantleImg.naturalWidth) {
        c.save(); this.mantlePath(c); c.clip();
        c.drawImage(this.mantleImg, 0, MOHO - 8, this.W, this.H - MOHO + 8);
        c.restore();
      } else {
        const m = c.createLinearGradient(0, MOHO, 0, this.H);
        m.addColorStop(0, '#D2622A'); m.addColorStop(1, '#F0A03C');
        c.fillStyle = m;
        this.mantlePath(c); c.fill();
      }
      // Moho dashes
      c.setLineDash([7, 6]); c.strokeStyle = 'rgba(255,220,170,.5)'; c.lineWidth = 1.5;
      c.beginPath(); c.moveTo(0, MOHO); c.lineTo(this.W, MOHO); c.stroke(); c.setLineDash([]);
      // faults
      for (const f of FAULTS) {
        const sel = f === this.fault;
        // slip offset flash right after Start
        let off = 0;
        if (this.run && this.run.fault === f && this.run.t < 0.45) off = Math.sin(this.run.t * 40) * 3;
        c.strokeStyle = sel ? '#3E2B1C' : 'rgba(62,43,28,.55)';
        c.lineWidth = sel ? 4 : 3;
        c.beginPath();
        f.pts.forEach(([x, y], i) => { const xx = x + (i % 2 ? off : -off); i === 0 ? c.moveTo(xx, y) : c.lineTo(xx, y); });
        c.stroke();
        c.strokeStyle = sel ? 'rgba(255,214,140,.65)' : 'rgba(255,214,140,.25)';
        c.lineWidth = 1.5;
        c.beginPath();
        f.pts.forEach(([x, y], i) => { i === 0 ? c.moveTo(x + 3, y) : c.lineTo(x + 3, y); });
        c.stroke();
      }
      // labels
      this.label(c, 'CRUST', 34, 268, 'rgba(255,240,220,.75)');
      this.label(c, 'MANTLE', 34, 520, 'rgba(90,40,10,.75)');
      this.label(c, 'Offshore fault', 178, 452, 'rgba(255,240,220,.8)');
      this.label(c, 'Inland fault', 690, 452, 'rgba(255,240,220,.8)');
      this.label(c, 'fault line', 690, 464, 'rgba(255,240,220,.45)', 9);
    }

    // The sea — rendered straight from the shallow-water field. Surface = SEA − eta
    // (eta = h + zb), bottom = seabed offshore / ground on land. Mostly horizontal
    // with subtle ripples; during a tsunami the same body shoals and floods the
    // town. Drawn in front of the town so it wraps the submerged houses.
    drawSea(c) {
      const N = this.wN, dx = this.wdx, zb = this.zb, h = this.h;
      let last = 0; for (let i = 0; i < N; i++) if (h[i] > W_DRY) last = i;   // water's edge
      const rip = G.REDUCED ? 0.4 : 1.0;
      const surfY = (i) => {
        const x = (i + 0.5) * dx, near = clamp(h[i] / 12, 0, 1);     // fade ripples out at the shallow front
        return SEA - (h[i] + zb[i]) + (Math.sin(x * 0.09 + this.time * 2.3) + Math.sin(x * 0.23 - this.time * 3.1) * 0.5) * rip * near;
      };
      const bedY = (i) => SEA - zb[i];

      c.beginPath();
      c.moveTo(0, surfY(0));
      for (let i = 1; i <= last; i++) c.lineTo((i + 0.5) * dx, surfY(i));
      c.lineTo((last + 0.5) * dx, bedY(last));
      for (let i = last; i >= 0; i--) c.lineTo((i + 0.5) * dx, bedY(i));
      c.closePath();
      const g = c.createLinearGradient(0, SEA - 30, 0, 342);
      g.addColorStop(0, 'rgba(123,201,207,.82)'); g.addColorStop(1, 'rgba(46,143,148,.85)');
      c.fillStyle = g; c.fill();

      // foam only where the surface is steep (surge face) or shallow (shore / run-up)
      c.strokeStyle = 'rgba(255,255,255,.6)'; c.lineWidth = 2; c.beginPath();
      let pen = false;
      for (let i = 1; i <= last; i++) {
        const steep = Math.abs((h[i] + zb[i]) - (h[i - 1] + zb[i - 1])) > 1.3;
        const shore = h[i] > W_DRY && h[i] < 6;
        if (steep || shore) { const x = (i + 0.5) * dx; pen ? c.lineTo(x, surfY(i)) : c.moveTo(x, surfY(i)); pen = true; }
        else pen = false;
      }
      c.stroke();

      // fishing boat rides the surface (sprite; hull sits a few px into the water)
      const bi = this.waterCell(this.boat.x), bx = this.boat.x, by = surfY(bi) + this.boat.bob * 0.4;
      const bw = 40, bh = 40;
      c.save(); c.translate(bx, by);
      c.rotate(Math.sin(this.time * 1.7) * 0.05 + clamp(this.u[bi] * 0.02, -0.28, 0.28));
      G.Buildings.drawTile(c, 'boat', 0, -bw / 2, 5 - bh, bw, bh);
      c.restore();
    }

    drawLand(c) {
      // grass strip
      c.fillStyle = '#9CCB63'; c.fillRect(COAST + 20, SEA - 4, this.W - COAST - 20, 10);
      // road — tiled sections; frame = local damage (1 intact … 4 buckled). Drawn
      // before the town in drawLand order, so it never blocks the houses.
      const RH = 22, RTOP = SEA - 4;
      for (const seg of this.road) {
        const g = seg.integrity;
        const f = g > 0.75 ? 0 : g > 0.5 ? 1 : g > 0.25 ? 2 : 3;
        if (!G.Buildings.drawTile(c, 'road', f, seg.x, RTOP, seg.w + 1, RH)) {
          c.fillStyle = '#8E8B84'; c.fillRect(seg.x, SEA + 4, seg.w + 1, 9);   // fallback while loading
        }
      }
      // sand beach (this.sand = the shoreline hitbox). Canvas has no CSS clip-path,
      // so we mask with a ctx.clip() polygon — same idea. The left (ocean-facing)
      // edge is a diagonal so it follows the shoreline, not a straight rect edge.
      const s = this.sand;
      c.save();
      c.beginPath();
      c.moveTo(s.x + s.edgeTop, s.y);              // ┐ top of the diagonal
      c.lineTo(s.x + s.w,       s.y);              // │ top-right
      c.lineTo(s.x + s.w,       s.y + s.h);        // │ bottom-right
      c.lineTo(s.x + s.edgeBot, s.y + s.h - s.drop); // ┘ bottom of the diagonal
      c.closePath();                               // closing edge = the diagonal shore
      c.clip();
      G.Buildings.drawTile(c, 'sand', 0, s.x, s.y, s.w, s.h);
      c.restore();
      // trees + poles
      for (const t of this.trees) this.drawTree(c, t);
      for (const po of this.poles) this.drawPole(c, po);
    }

    drawTree(c, t) {
      c.save(); c.translate(t.x, SEA - 2); c.rotate(t.sway * 0.02);
      c.fillStyle = '#8A6647'; c.fillRect(-2.5, -16, 5, 16);
      c.fillStyle = '#5FA653';
      c.beginPath(); c.arc(0, -24, 12, 0, TAU); c.arc(-8, -17, 8, 0, TAU); c.arc(8, -17, 8, 0, TAU); c.fill();
      c.restore();
    }
    drawPole(c, po) {
      c.save(); c.translate(po.x, SEA - 2); c.rotate(po.sway * 0.018);
      c.strokeStyle = '#6B5B49'; c.lineWidth = 3;
      c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -34); c.stroke();
      c.lineWidth = 2; c.beginPath(); c.moveTo(-8, -30); c.lineTo(8, -30); c.stroke();
      c.restore();
    }

    drawTown(c) {
      // back-to-front (left→right) so nearer buildings overlap cleanly
      for (const b of this.buildings) this.drawBuilding(c, b);
    }
    // integrity + whether shaking has reached this building → which of the 6
    // frames to show (0 normal · 1 shaking · 2-4 light/medium/heavy · 5 collapsed).
    frameFor(g, shaking) {
      if (g <= 0) return 5;
      if (g >= 0.999) return shaking ? 1 : 0;
      if (g > 0.80) return 1;
      if (g > 0.58) return 2;
      if (g > 0.34) return 3;
      return 4;
    }
    drawBuilding(c, b) {
      const r = this.run;
      let shaking = false, sway = 0;
      if (r && b.integrity > 0) {
        const start = dist(this.focus.x, this.focus.y, b.cx, SEA) / S_SPD;
        shaking = r.t >= start && r.t <= start + r.shakeDur * 0.9;
        if (shaking) sway = Math.sin(b.swayT) * clamp(this.intensityAt(b.cx), 0, 1.8) * (G.REDUCED ? 1 : 2.4);
      }
      const frame = this.frameFor(b.integrity, shaking);
      if (!G.Buildings.draw(c, b.type, frame, b.cx, SEA, b.sh, sway)) {
        c.fillStyle = '#cdbfa4'; c.fillRect(b.cx - 16, SEA - b.sh, 32, b.sh);   // fallback while sheets load
      }
    }

    drawWaves(c) {
      const r = this.run; if (!r) return;
      c.save();
      this.undergroundPath(c); c.clip();
      const rings = (spd, color, lw, n) => {
        for (let i = 0; i < n; i++) {
          const rad = spd * r.t - i * 46;
          if (rad <= 4) continue;
          c.globalAlpha = clamp(1 - rad / 620, 0, 1) * (1 - i * 0.28);
          c.strokeStyle = color; c.lineWidth = lw;
          c.beginPath(); c.arc(this.focus.x, this.focus.y, rad, 0, TAU); c.stroke();
        }
        c.globalAlpha = 1;
      };
      rings(P_SPD, '#FFE28A', 2, 3);       // P-waves: fast, thin
      rings(S_SPD, '#FF8A50', 3.5, 3);     // S-waves: slower, stronger
      // wave labels riding the fronts
      const pR = P_SPD * r.t, sR = S_SPD * r.t;
      if (pR < 400) this.label(c, 'P-wave', this.focus.x + pR * 0.72, this.focus.y - pR * 0.72, '#FFE28A', 11);
      if (sR < 400) this.label(c, 'S-wave', this.focus.x - sR * 0.75, this.focus.y - sR * 0.7, '#FF8A50', 11);
      c.restore();
    }

    drawMarkers(c) {
      const fx = this.focus.x, fy = this.focus.y;
      // dashed focus→epicenter link
      c.setLineDash([5, 5]); c.strokeStyle = 'rgba(255,255,255,.75)'; c.lineWidth = 1.5;
      c.beginPath(); c.moveTo(fx, fy - 10); c.lineTo(fx, SEA + 4); c.stroke(); c.setLineDash([]);
      // focus target
      const pulse = 1 + Math.sin(this.time * 4) * 0.15;
      c.strokeStyle = '#FFD24A'; c.lineWidth = 2.5;
      c.beginPath(); c.arc(fx, fy, 9 * pulse, 0, TAU); c.stroke();
      c.fillStyle = '#EE6A1F';
      c.beginPath(); c.arc(fx, fy, 3.6, 0, TAU); c.fill();
      this.labelBox(c, 'FOCUS (hypocenter)', fx + 14, fy + 4, '#FFD24A');
      // epicenter triangle
      c.fillStyle = '#E05A4E';
      c.beginPath(); c.moveTo(fx - 7, SEA - 12); c.lineTo(fx + 7, SEA - 12); c.lineTo(fx, SEA - 2); c.closePath(); c.fill();
      this.labelBox(c, 'EPICENTER', fx + 12, SEA - 14, '#FFE0DB');
    }

    /* ---- text helpers ---- */
    label(c, str, x, y, color, size) {
      c.font = '800 ' + (size || 12) + 'px Nunito, sans-serif';
      c.textAlign = 'left'; c.textBaseline = 'middle';
      c.fillStyle = color; c.fillText(str, x, y);
    }
    labelBox(c, str, x, y, color) {
      c.font = '900 11px Nunito, sans-serif';
      const w = c.measureText(str).width + 10;
      const xx = Math.min(x, this.W - w - 6);
      c.fillStyle = 'rgba(20,24,32,.68)';
      this.rr(c, xx - 5, y - 9, w, 18, 6); c.fill();
      c.textAlign = 'left'; c.textBaseline = 'middle';
      c.fillStyle = color; c.fillText(str, xx, y);
    }
    rr(c, x, y, w, h, r) {
      c.beginPath();
      c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r);
      c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
    }
  }

  G.LevelClasses.Level1 = Level1;
})(window);
