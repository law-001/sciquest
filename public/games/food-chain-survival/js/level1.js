/* ===========================================================================
   Level 1 — RABBIT (primary consumer / prey)  ·  SURVIVAL MODE
   Live through a full day→night cycle. Manage three needs — hunger, thirst,
   stamina — by grazing clover and drinking from ponds, while a fox that grows
   bolder after dark hunts you. Stay fed, stay watered, stay hidden until dawn.
   =========================================================================== */
(function (global) {
  'use strict';
  const G = global.Game;
  const { clamp, lerp, dist, rand, TAU, angleDiff, inCone, drawCone, Input, Audio } = G;

  // day/night cycle (seconds)
  const EVENING_T = 95, NIGHT_T = 175, WIN_T = 250;

  // lighting keyframes: {t, col:[r,g,b], a (tint alpha), vig (vignette strength)}
  const LIGHT_STOPS = [
    { t: 0,   col: [255, 226, 168], a: 0.04, vig: 0.00 },
    { t: 80,  col: [255, 226, 168], a: 0.05, vig: 0.00 },
    { t: 118, col: [255, 162, 82],  a: 0.20, vig: 0.06 },
    { t: 162, col: [122, 90, 128],  a: 0.31, vig: 0.16 },
    { t: 185, col: [30, 40, 90],    a: 0.47, vig: 0.34 },
    { t: 232, col: [22, 30, 78],    a: 0.55, vig: 0.48 },
    { t: 245, col: [255, 174, 114], a: 0.16, vig: 0.05 },
    { t: 256, col: [255, 226, 168], a: 0.04, vig: 0.00 },
  ];

  class Level1 extends G.LevelBase {
    init(opts) {
      const T = opts.tweaks;
      this.diff = T.difficulty;             // 0 easy .. 2 hard
      this.showCones = T.showCones;
      this.playerSpeedMul = T.playerSpeed;
      this.es = T.enemySpeed || 1;

      this.world = new G.World(1720, 1200, { palette: 'meadow', seed: 71 });
      const w = this.world;
      const spawn = { x: w.w * 0.5, y: w.h * 0.6, r: 150 };
      // props
      w.scatter('tree', 8, { spacing: 200, margin: 120, avoid: [spawn], props: () => ({ block: true, br: 26, by: 8, s: rand(0.9, 1.25) }) });
      w.scatter('bush', 15, { spacing: 130, avoid: [spawn], props: () => ({ block: true, br: 22, coverR: 32, s: rand(0.85, 1.2) }) });
      w.scatter('tallgrass', 20, { spacing: 105, props: () => ({ coverR: 34, s: rand(0.9, 1.3) }) });
      w.scatter('rock', 6, { spacing: 150, props: () => ({ block: true, br: 18, s: rand(0.8, 1.1) }) });
      w.scatter('flower', 24, { spacing: 50, props: () => ({ color: G.pick(['#f2d24b', '#f0f0f0', '#e87fb0', '#c79bf0']), s: rand(0.8, 1.2) }) });
      w.scatter('burrow', 2, { spacing: 300, avoid: [spawn] });

      // ponds (water sources) — block so the rabbit drinks from the shore
      this.ponds = [];
      w.scatter('pond', 3, { spacing: 360, margin: 150, avoid: [spawn], props: () => ({ block: true, br: 30, s: rand(0.95, 1.25) }) });
      for (const p of w.props) if (p.type === 'pond') this.ponds.push(p);

      // clover patches (food)
      this.patches = [];
      for (let i = 0; i < 14; i++) {
        let x, y, ok, t = 0;
        do { x = rand(120, w.w - 120); y = rand(120, w.h - 120); ok = true;
          for (const p of w.props) if (dist(x, y, p.x, p.y) < 72 && (p.block || p.type === 'tree')) { ok = false; break; }
          for (const p of this.patches) if (dist(x, y, p.x, p.y) < 150) { ok = false; break; }
        } while (!ok && ++t < 40);
        const prop = { type: 'grasspatch', x, y, s: rand(0.95, 1.2), eaten: false };
        w.addProp(prop); this.patches.push(prop);
      }

      // player
      this.p = new G.Sprite('rabbit', { x: spawn.x, y: spawn.y, scale: 0.40, fps: 12 });
      this.face = 1; this.vx = 0; this.vy = 0;
      this.hunger = 78; this.thirst = 82; this.stamina = 100; this.staminaLock = false;
      this.count = 0; this.catches = 0;
      this.eating = null; this.eatT = 0; this.drinkT = 0; this.caughtT = 0;
      this.deathReason = null;

      // survival drain rates (per second)
      this.hungerDrain = [0.85, 1.00, 1.18][this.diff];
      this.thirstDrain = [0.50, 0.62, 0.76][this.diff];

      // day/night
      this.dayT = 0; this.phase = 'morning';
      this._lightNow = { r: 255, g: 226, b: 168, a: 0.04, vig: 0 };
      this._fireflies = [];
      for (let i = 0; i < 22; i++) this._fireflies.push({ x: rand(0, w.w), y: rand(0, w.h), ph: rand(0, TAU), spd: rand(0.4, 1.0), dx: rand(-1, 1), dy: rand(-1, 1) });

      // foxes — count scales with difficulty. They patrol separate corners and
      // now hunt by EAR (your noise + proximity) and NOSE (your scent trail),
      // not just their vision cone.
      const foxCount = [2, 2, 3][this.diff];
      const foxSpots = [
        { x: w.w * 0.25, y: w.h * 0.26 },
        { x: w.w * 0.78, y: w.h * 0.74 },
        { x: w.w * 0.80, y: w.h * 0.22 },
      ];
      this.foxes = [];
      for (let i = 0; i < foxCount; i++) this.foxes.push(this._makeFox(foxSpots[i].x, foxSpots[i].y));
      this.cfg = this._phaseCfg();

      // predator perception tuning (per difficulty)
      this.hearBase = [115, 145, 178][this.diff];    // hearing radius, scaled by your noise
      this.scentLife = [3.4, 4.8, 6.4][this.diff];  // seconds your scent lingers
      this.foxSniffR = [140, 165, 190][this.diff];  // how far ahead a fox samples the trail
      this.scent = []; this._scentT = 0; this.noise = 0;

      // snakes — lurk submerged in the ponds. Drink too long without noticing
      // the ripples and one bursts out of the water to bite you.
      this.snakeAmbush = [2.0, 1.4, 1.0][this.diff];   // sec of unnoticed drinking before it strikes
      this.snakeHitR = [80, 88, 98][this.diff];
      this.snakeCD = [3.0, 2.5, 2.0][this.diff];
      this.snakeDmg = [15, 21, 27][this.diff];
      this.drinkingPond = null;
      this.snakes = [];
      const addSnake = (home, habitat, senseR) => {
        this.snakes.push({
          spr: new G.Sprite('snake', { x: home.x, y: home.y, scale: 0.32, fps: 6, anchorY: 0.6 }),
          x: home.x, y: home.y, hx: home.x, hy: home.y, home, habitat, senseR: senseR || 0,
          state: 'lurk', face: 1, lurkT: 0, cd: 0, hit: false, emerge: 0, ripple: 0, t: rand(0, 3),
        });
      };
      {   // snakes submerged in the ponds
        const nPond = Math.min([1, 2, 3][this.diff], this.ponds.length);
        for (const pond of this.ponds.slice().sort(() => Math.random() - 0.5).slice(0, nPond)) addSnake(pond, 'pond');
      }
      {   // snakes hidden in tall grass — the bunny's own hiding spot may be taken
        const grass = w.props.filter((p) => p.type === 'tallgrass' && dist(p.x, p.y, spawn.x, spawn.y) > 240);
        const nGrass = Math.min([1, 1, 2][this.diff], grass.length);
        for (const g of grass.sort(() => Math.random() - 0.5).slice(0, nGrass)) addSnake(g, 'grass', (g.coverR || 34) * (g.s || 1) + 6);
      }

      // hawk — aerial hunter by day. Circles overhead, then dives if you're in
      // the open; tall grass is your only shelter from above. Roosts at night.
      this.hawkLock = [2.7, 2.0, 1.5][this.diff];
      this.hawkCD = [22, 17, 12][this.diff];
      this.hawkHitR = 50;
      this.hawkDmg = [14, 20, 26][this.diff];
      this.hawk = {
        spr: new G.Sprite('hawk', { x: 0, y: 0, scale: 0.55, fps: 9, anchorY: 0.5 }),
        state: 'away', timer: rand(9, 15), x: 0, y: 0, px: 0, alt: 260,
        ang: 0, radius: 165, cx: 0, cy: 0, lockT: 0, targetX: 0, targetY: 0, hit: false,
      };

      this.hud.config({
        role: 'RABBIT', accent: '#EE6A1F', goal: this.meta.hudGoal,
        showTimer: true, showPhase: true, showEnergy: true, showThirst: true, showStamina: true,
        energyLabel: 'Hunger',
      });
      this.hud.hint('Eat clover · drink at ponds · hide in tall grass. Foxes hunt by sight, sound & scent · hawks dive by day · snakes lurk in the water — and sometimes in the tall grass. Don\'t linger!');
      this._loHunger = this._loThirst = false;
    }

    _makeFox(x, y) {
      return {
        spr: new G.Sprite('fox', { x, y, scale: 0.55, fps: 9, anchorY: 0.86 }),
        x, y, face: 0, faceSmooth: null, state: 'patrol', seen: 0, lostT: 0,
        suspT: 0, suspLook: 0, restT: 0, qmark: 0, lastX: x, lastY: y,
        exclaim: 0, sniffT: 0, range: 0, half: 0, stuckT: 0, wp: this._wander(x, y),
      };
    }

    _wander(x, y) {
      const w = this.world;
      // pick a roam target that isn't sitting inside a blocker, so the fox
      // doesn't immediately jam itself against the thing it just walked around
      for (let i = 0; i < 12; i++) {
        const tx = clamp(x + rand(-300, 300), 80, w.w - 80);
        const ty = clamp(y + rand(-300, 300), 80, w.h - 80);
        let ok = true;
        for (const b of w.blockers) if (dist(tx, ty, b.x, b.y) < b.r + 40) { ok = false; break; }
        if (ok) return { x: tx, y: ty };
      }
      return { x: clamp(x + rand(-300, 300), 80, w.w - 80), y: clamp(y + rand(-300, 300), 80, w.h - 80) };
    }

    _phaseCfg() {
      const t = this.phase === 'morning' ? 0 : this.phase === 'evening' ? 1 : 2;
      const d = this.diff, es = this.es;
      return {
        foxBase:  [60, 92, 120][t] * es * [1, 1.06, 1.14][d],
        foxChase: [172, 204, 236][t] * es * [1, 1.06, 1.14][d],
        range:    [196, 244, 300][t],
        half:     [0.40, 0.48, 0.56][t],
        detect:   [1.5, 2.1, 2.9][t],
        lose:     [1.6, 2.4, 3.4][t],
        hungerMul:[0.80, 1.00, 1.25][t],
        catchDmg: [16, 24, 32][t],
        canRest:  this.phase === 'morning',
      };
    }
    _phaseHud() {
      if (this.phase === 'morning') return { key: 'morning', name: 'Morning', ico: 'sun' };
      if (this.phase === 'evening') return { key: 'evening', name: 'Evening', ico: 'sunset' };
      return { key: 'night', name: 'Night', ico: 'moon' };
    }

    update(dt) {
      if (this.over) { this.p.update(dt); for (const f of this.foxes) f.spr.update(dt); for (const s of this.snakes) s.spr.update(dt); this.hawk.spr.update(dt); return; }
      this.time += dt; this.dayT += dt;

      // phase transitions
      const ph = this.dayT < EVENING_T ? 'morning' : this.dayT < NIGHT_T ? 'evening' : 'night';
      if (ph !== this.phase) { this.phase = ph; this.cfg = this._phaseCfg(); this._announcePhase(ph); }
      this._lightNow = this._lightingFor(this.dayT);

      // win — survived to dawn
      if (this.dayT >= WIN_T) return this.finish(true);

      this._player(dt);
      this._fox(dt);
      this._snakes(dt);
      this._hawk(dt);

      // survival drains
      this.hunger = clamp(this.hunger - this.hungerDrain * this.cfg.hungerMul * dt, 0, 100);
      this.thirst = clamp(this.thirst - this.thirstDrain * dt, 0, 100);
      if (this.hunger <= 0) return this.finish(false, this._loss(this.deathReason || 'starved'));
      if (this.thirst <= 0) return this.finish(false, this._loss('dehydrated'));
      this._warnLow();

      this.hud.set({
        energy: this.hunger, thirst: this.thirst, stamina: this.stamina,
        timer: WIN_T - this.dayT, phase: this._phaseHud(), danger: this.foxes.some((f) => f.state === 'chase'),
      });

      this.cam.follow(this.p.x, this.p.y, this.world.w, this.world.h);
    }

    _announcePhase(ph) {
      if (ph === 'evening') this.hud.banner('Evening falls', '#f0a24a', 1.4);
      else if (ph === 'night') { this.hud.banner('Night', '#9fb0ff', 1.6); this.hud.hint('Stay in cover — the fox hunts harder in the dark. Hold on until dawn!'); Audio.alert(); }
    }
    _warnLow() {
      if (this.hunger < 22 && !this._loHunger) { this._loHunger = true; this.hud.banner('Getting hungry!', '#f1b15a', 1.0); }
      if (this.hunger > 38) this._loHunger = false;
      if (this.thirst < 22 && !this._loThirst) { this._loThirst = true; this.hud.banner('Getting thirsty!', '#5fbce0', 1.0); }
      if (this.thirst > 38) this._loThirst = false;
    }

    _lightingFor(t) {
      const S = LIGHT_STOPS; let a = S[0], b = S[S.length - 1];
      for (let i = 0; i < S.length - 1; i++) { if (t >= S[i].t && t <= S[i + 1].t) { a = S[i]; b = S[i + 1]; break; } }
      const k = a === b ? 0 : clamp((t - a.t) / (b.t - a.t), 0, 1);
      return {
        r: lerp(a.col[0], b.col[0], k), g: lerp(a.col[1], b.col[1], k), b: lerp(a.col[2], b.col[2], k),
        a: lerp(a.a, b.a, k), vig: lerp(a.vig, b.vig, k),
      };
    }

    _player(dt) {
      this.noise = 0; this.drinkingPond = null;
      if (this.caughtT > 0) { this.caughtT -= dt; this.p.setAnim('alert'); this.vx *= 0.7; this.vy *= 0.7; this.p.update(dt); return; }
      const ax = Input.axis();
      let mvx = ax.x, mvy = ax.y;
      if (this.hud.touchDir) { mvx += this.hud.touchDir.x; mvy += this.hud.touchDir.y; const m = Math.hypot(mvx, mvy) || 1; mvx /= m; mvy /= m; }
      const moving = mvx || mvy;

      // need-based penalties
      const starv = this.hunger < 25 ? lerp(0.60, 1, this.hunger / 25) : 1;
      const dehyd = this.thirst < 25 ? lerp(0.84, 1, this.thirst / 25) : 1;
      const speedMul = this.playerSpeedMul * starv * dehyd;

      const wantSprint = (Input.down('shift') || this.hud.actionDown) && !this.staminaLock && this.stamina > 0 && moving;
      // once stamina is fully drained it locks out until FULLY recovered; recovering keeps you slow
      if (this.stamina <= 0 && !this.staminaLock) { this.staminaLock = true; }
      if (this.staminaLock && this.stamina >= 99.5) { this.staminaLock = false; }
      const replenishMul = this.staminaLock ? 0.55 : 1;
      const targetSpeed = (wantSprint ? 248 : 150) * speedMul * replenishMul;
      if (wantSprint) { this.stamina = clamp(this.stamina - 32 * dt, 0, 100); }
      else { const regen = (moving ? 16 : 26) * (this.thirst < 25 ? 0.5 : 1); this.stamina = clamp(this.stamina + regen * dt, 0, 100); }

      // resource interaction: eat clover / drink at pond when held still
      const patch = this._patchUnder();
      const water = patch ? null : this._waterUnder();
      if (!moving && (patch || water)) {
        this.p.setAnim('eat', { fps: water ? 12 : 10 });
        this.vx *= 0.4; this.vy *= 0.4;
        if (patch) {
          this.eatT += dt;
          if (this.eatT > 0.32) { this.fx.text(this.p.x, this.p.y - 46, 'munch', '#7fb24e', { size: 14, life: .6 }); Audio.eat(); this.eatT = -0.5; }
          patch._t = (patch._t || 0) + dt;
          if (patch._t > 0.9) this._eatPatch(patch);
        } else {
          this.drinkingPond = water;
          this.thirst = clamp(this.thirst + 34 * dt, 0, 100);
          this.drinkT = (this.drinkT || 0) + dt;
          if (this.drinkT > 0.5) { this.fx.text(this.p.x, this.p.y - 46, 'sip', '#5fbce0', { size: 13, life: .55 }); Audio.blip(620, .07, 'sine', .08, 760); this.drinkT = 0; }
          if (Math.random() < 0.3) this.fx.burst(water.x, this.p.y, '#9fd8f0', 1, { spd: 30, up: 10, life: .4, size: 2, g: 60 });
        }
        this.p.update(dt); return;
      } else { this.eatT = 0; if (patch) patch._t = 0; this.drinkT = 0; }

      // movement (sluggish, less responsive control when starving)
      const txv = moving ? mvx * targetSpeed : 0, tyv = moving ? mvy * targetSpeed : 0;
      if (this.hunger < 25) {
        const k = clamp(lerp(0.10, 0.40, this.hunger / 25), 0, 1);
        this.vx = lerp(this.vx, txv, k); this.vy = lerp(this.vy, tyv, k);
      } else { this.vx = txv; this.vy = tyv; }

      if (moving) {
        if (mvx) this.face = mvx < 0 ? -1 : 1;
        this.p.setAnim(wantSprint ? 'sprint' : 'hop', { fps: wantSprint ? 16 : 13 });
        if (Math.random() < (wantSprint ? 0.08 : 0.04)) Audio.step();
      } else { this.vx *= 0.6; this.vy *= 0.6; this.p.setAnim('idle', { fps: 7 }); }

      // noise the foxes can hear this frame — loud sprinting, soft hopping, none
      // when still; tall grass muffles you to half.
      let nz = !moving ? 0 : (wantSprint ? 1.0 : 0.5);
      if (nz > 0 && this.inCover(this.p.x, this.p.y)) nz *= 0.5;
      this.noise = nz;

      const nx = this.p.x + this.vx * dt, ny = this.p.y + this.vy * dt;
      const c = this.collide(nx, ny, 16); this.p.x = c.x; this.p.y = c.y;
      this.p.flipX = this.face < 0;
      this.p.update(dt);
    }

    _patchUnder() {
      for (const p of this.patches) if (!p.eaten && dist(this.p.x, this.p.y, p.x, p.y) < 30) return p;
      return null;
    }
    _waterUnder() {
      for (const p of this.ponds) { const reach = (p.br || 30) * (p.s || 1) + 26; if (dist(this.p.x, this.p.y, p.x, p.y) < reach) return p; }
      return null;
    }
    _eatPatch(p) {
      p.eaten = true; p._t = 0; this.count++;
      this.hunger = clamp(this.hunger + 22, 0, 100);
      this.fx.text(p.x, p.y - 36, '+22 food', '#aee05a', { size: 18 });
      this.fx.burst(p.x, p.y, '#c0e25a', 12, { up: 30, spd: 70 });
      Audio.pickup();
      // regrow elsewhere so the field never fully empties
      setTimeout(() => {
        if (this.over) return; p.eaten = false; p._t = 0;
        const w = this.world; let x, y, ok, t = 0;
        do { x = rand(120, w.w - 120); y = rand(120, w.h - 120); ok = true;
          for (const q of w.props) if (q.block && dist(x, y, q.x, q.y) < 60) { ok = false; break; }
          if (dist(x, y, this.p.x, this.p.y) < 130) ok = false;
        } while (!ok && ++t < 30);
        p.x = x; p.y = y;
      }, 5200);
    }

    _fox(dt) {
      // lay down the player's scent trail (only while audibly moving, so holding
      // still in cover lets the trail go cold)
      this._scentT -= dt;
      if (this.noise > 0.03 && this._scentT <= 0) {
        this.scent.push({ x: this.p.x, y: this.p.y, t: this.time });
        this._scentT = 0.2;
      }
      while (this.scent.length && this.time - this.scent[0].t > this.scentLife) this.scent.shift();

      for (const f of this.foxes) this._foxAI(f, dt);
    }

    // freshest scent sample within sniffing range of this fox (leads it toward you)
    _sniff(f) {
      let best = null, bestT = -1;
      for (const s of this.scent) {
        if (s.t > bestT && dist(f.x, f.y, s.x, s.y) < this.foxSniffR) { bestT = s.t; best = s; }
      }
      return best;
    }

    _foxAI(f, dt) {
      const w = this.world, cfg = this.cfg;
      const half = cfg.half;
      const range = f.state === 'chase' ? cfg.range * 1.25 : cfg.range;
      if (f.exclaim > 0) f.exclaim -= dt;

      const hidden = this.inCover(this.p.x, this.p.y) || this.caughtT > 0;
      const sees = !hidden && inCone(f.x, f.y, f.face, half, range, this.p.x, this.p.y, w.blockers);
      if (sees) { f.seen = Math.min(f.seen + dt * cfg.detect, 1.2); f.lastX = this.p.x; f.lastY = this.p.y; }
      else f.seen = Math.max(f.seen - dt * 1.2, 0);

      // HEARING — proximity × your noise. Works through cover and outside the cone,
      // but builds awareness slower than a clear line of sight.
      const dP = dist(f.x, f.y, this.p.x, this.p.y);
      const hearR = this.hearBase * (0.5 + 1.15 * this.noise);
      let heard = false;
      if (this.caughtT <= 0 && this.noise > 0.04 && dP < hearR) {
        heard = true;
        f.lastX = this.p.x; f.lastY = this.p.y;
        f.seen = Math.min(f.seen + dt * cfg.detect * 0.7 * this.noise, 1.05);
        // Home onto the LIVE source of the noise — not just where you first were.
        if (f.state === 'patrol' || f.state === 'rest') {
          if (f.seen > 0.14) { f.state = 'suspicious'; f.suspT = 0; f.suspLook = 0; f.qmark = 1.0; }
          f.wp = { x: this.p.x, y: this.p.y };
        } else if (f.state === 'suspicious') {
          f.wp = { x: this.p.x, y: this.p.y };   // keep tracking you as you keep moving
          f.suspT = Math.min(f.suspT, 1.0); f.qmark = Math.max(f.qmark, 0.7);
        }
      }

      // escalate awareness
      if (f.state !== 'chase') {
        if (f.seen >= 1) { f.state = 'chase'; f.exclaim = 1.1; f.qmark = 0; Audio.alert(); this.hud.flashDanger(); }
        else if (f.seen >= 0.45 && f.state !== 'suspicious') { f.state = 'suspicious'; f.suspT = 0; f.suspLook = 0; f.qmark = 1.0; f.wp = { x: f.lastX, y: f.lastY }; }
      }

      let tx, ty, speed, anim, fps;
      if (f.state === 'chase') {
        tx = sees ? this.p.x : f.lastX; ty = sees ? this.p.y : f.lastY;
        speed = cfg.foxChase; anim = 'sprint'; fps = 14;
        if (!sees && !heard) { f.lostT += dt; if (f.lostT > cfg.lose) { f.state = 'suspicious'; f.suspT = 0; f.suspLook = 0; f.lostT = 0; f.qmark = 1.0; f.wp = { x: f.lastX, y: f.lastY }; } }
        else f.lostT = 0;
        if (dist(f.x, f.y, this.p.x, this.p.y) < 30 && this.caughtT <= 0) this._caught(f);
      } else if (f.state === 'suspicious') {
        f.suspT += dt; if (f.qmark > 0) f.qmark -= dt * 0.4;
        tx = f.wp.x; ty = f.wp.y; speed = cfg.foxBase * 1.55; anim = 'walk'; fps = 11;
        if (dist(f.x, f.y, tx, ty) < 26) {
          // reached the lead — sniff for a fresher scent and follow it toward you
          const lead = this._sniff(f);
          if (lead && (Math.abs(lead.x - tx) > 8 || Math.abs(lead.y - ty) > 8)) {
            f.wp = { x: lead.x, y: lead.y }; f.qmark = Math.max(f.qmark, 0.7);
            f.suspT = Math.min(f.suspT, 1.6); f.sniffT = 0.5;
          } else {
            speed = 0; f.suspLook += dt;
            if (f.suspLook > 1.4) { f.state = 'patrol'; f.suspLook = 0; f.wp = this._wander(f.x, f.y); }
          }
        }
        if (f.suspT > 6.5) { f.state = 'patrol'; f.suspLook = 0; f.wp = this._wander(f.x, f.y); }
      } else if (f.state === 'rest') {
        speed = 0; anim = 'idle'; fps = 6; tx = f.x + Math.cos(f.face) * 10; ty = f.y + Math.sin(f.face) * 10;
        f.restT -= dt; if (f.restT <= 0) { f.state = 'patrol'; f.wp = this._wander(f.x, f.y); }
      } else { // patrol
        tx = f.wp.x; ty = f.wp.y; speed = cfg.foxBase; anim = 'walk'; fps = 9;
        if (dist(f.x, f.y, tx, ty) < 26) {
          if (cfg.canRest && Math.random() < 0.5) { f.state = 'rest'; f.restT = rand(1.4, 3.0); }
          else f.wp = this._wander(f.x, f.y);
        }
      }
      if (f.sniffT > 0) f.sniffT -= dt;

      const a = Math.atan2(ty - f.y, tx - f.x);
      const turn = (f.state === 'chase' ? 7 : 3.2) * dt;
      f.faceSmooth = f.faceSmooth == null ? a : f.faceSmooth + clamp(angleDiff(f.faceSmooth, a), -turn, turn);
      f.face = f.faceSmooth;
      if (speed > 0) {
        const step = speed * dt;
        // Try to advance straight at the target; if a blocker is in the way,
        // fan out to progressively wider sidesteps and take the first heading
        // that actually makes progress — so the fox routes AROUND obstacles
        // instead of grinding into them.
        let moved = false;
        for (const off of [0, 0.5, -0.5, 1.0, -1.0, 1.7, -1.7]) {
          const ma = a + off;
          const c = this.collide(f.x + Math.cos(ma) * step, f.y + Math.sin(ma) * step, 20);
          if (dist(c.x, c.y, f.x, f.y) > step * 0.5) { f.x = c.x; f.y = c.y; moved = true; break; }
        }
        if (!moved) {
          const c = this.collide(f.x, f.y, 20); f.x = c.x; f.y = c.y;   // settle, don't shove
          f.stuckT = (f.stuckT || 0) + dt;
        } else {
          f.stuckT = Math.max(0, (f.stuckT || 0) - dt * 2);
        }
        // boxed in against something immovable — stop trying to continue and roam off
        if (f.stuckT > 0.35 && f.state !== 'chase') {
          f.wp = this._wander(f.x, f.y); f.stuckT = 0;
          if (f.state === 'suspicious') { f.state = 'patrol'; f.suspLook = 0; f.qmark = 0; }
        } else if (f.stuckT > 0.8 && f.state === 'chase') {
          // can't push through to the rabbit — break off and search nearby
          f.state = 'suspicious'; f.suspT = 0; f.suspLook = 0; f.qmark = 1.0; f.lostT = 0;
          f.wp = this._wander(f.x, f.y); f.stuckT = 0;
        }
      }
      f.spr.x = f.x; f.spr.y = f.y; f.spr.flipX = Math.cos(f.face) < 0;
      f.spr.setAnim(anim, { fps }); f.spr.update(dt);
      f.range = range; f.half = half;
    }

    _caught(f) {
      const dmg = this.cfg.catchDmg;
      this.caughtT = 1.1; this.catches++;
      this.hunger = clamp(this.hunger - dmg, 0, 100);
      if (this.hunger <= 0) this.deathReason = 'caught';
      f.state = 'patrol'; f.seen = 0; f.lostT = 0; f.wp = this._wander(f.x, f.y);
      this.fx.text(this.p.x, this.p.y - 46, '-' + dmg + ' !', '#f1955a', { size: 20 });
      this.fx.burst(this.p.x, this.p.y, '#f1955a', 14, { spd: 120 });
      Audio.pounce();
      // knock rabbit away from the fox
      const a = Math.atan2(this.p.y - f.y, this.p.x - f.x);
      const c = this.collide(this.p.x + Math.cos(a) * 80, this.p.y + Math.sin(a) * 80, 16);
      this.p.x = c.x; this.p.y = c.y;
      this.hud.banner('Caught!', '#f1955a', 0.7);
    }

    /* ---- snakes: submerged ambush in the ponds ---- */
    _snakes(dt) { for (const s of this.snakes) this._snakeAI(s, dt); }
    _snakeAI(s, dt) {
      s.t += dt;
      const here = this.caughtT <= 0 && (s.habitat === 'pond'
        ? this.drinkingPond === s.home
        : dist(this.p.x, this.p.y, s.hx, s.hy) < s.senseR);

      if (s.cd > 0) {                                   // recoiling back under water
        s.cd -= dt; s.state = 'lurk'; s.lurkT = 0;
        s.x = lerp(s.x, s.hx, 8 * dt); s.y = lerp(s.y, s.hy, 8 * dt);
        s.emerge = lerp(s.emerge, 0, 6 * dt); s.ripple = Math.max(0, s.ripple - dt);
        s.spr.setAnim('coiled', { fps: 6 });
      } else if (s.state === 'strike') {                // lunging out of the water
        s.emerge = 1;
        if (this.caughtT <= 0) s.face = this.p.x < s.hx ? -1 : 1;
        const ang = Math.atan2(this.p.y - s.hy, this.p.x - s.hx);
        const md = Math.min(dist(s.hx, s.hy, this.p.x, this.p.y), 100);
        const tx = s.hx + Math.cos(ang) * md, ty = s.hy + Math.sin(ang) * md;
        s.x = lerp(s.x, tx, 13 * dt); s.y = lerp(s.y, ty, 13 * dt);
        if (!s.hit && s.spr.frame >= 2 && dist(s.x, s.y, this.p.x, this.p.y) < this.snakeHitR && this.caughtT <= 0) { s.hit = true; this._snakeBite(s); }
      } else if (here) {                                // you're lingering over its ambush spot
        s.lurkT += dt;
        s.ripple = Math.min(1.4, s.ripple + dt * 1.7);
        s.emerge = lerp(s.emerge, clamp(s.lurkT / this.snakeAmbush, 0, 1) * 0.55, 5 * dt);
        s.face = this.p.x < s.hx ? -1 : 1;
        s.state = 'alert'; s.spr.setAnim('alert', { fps: 8 });
        if (s.habitat === 'pond') {
          if (Math.random() < 0.07) this.fx.burst(s.hx + rand(-12, 12), s.hy + rand(-9, 9), '#bfdcc4', 1, { spd: 16, up: 8, life: .5, size: 2, g: 30 });
        } else if (Math.random() < 0.12) {              // rustling blades give the grass snake away
          this.fx.burst(s.hx + rand(-15, 15), s.hy - 10 + rand(-9, 9), G.pick(['#4f7d3a', '#5e8f44', '#6fa050']), 1, { spd: 22, up: 16, life: .55, size: 3, g: 80 });
        }
        if (s.lurkT >= this.snakeAmbush) {
          s.state = 'strike'; s.hit = false;
          s.spr.setAnim('strike', { fps: 18, loop: false, onEnd: () => { s.state = 'lurk'; s.cd = this.snakeCD; s.lurkT = 0; } });
          Audio.blip(180, .12, 'sawtooth', .08, 90); Audio.pounce();
        }
      } else {                                          // hidden, ripples settling
        s.state = 'lurk'; s.lurkT = Math.max(0, s.lurkT - dt * 2);
        s.ripple = Math.max(0, s.ripple - dt * 1.2); s.emerge = lerp(s.emerge, 0, 5 * dt);
        s.x = lerp(s.x, s.hx, 8 * dt); s.y = lerp(s.y, s.hy, 8 * dt);
        s.spr.setAnim('coiled', { fps: 6 });
      }
      s.spr.x = s.x; s.spr.y = s.y; s.spr.flipX = s.face < 0; s.spr.update(dt);
    }
    _snakeBite(s) {
      const dmg = this.snakeDmg;
      this.caughtT = 1.0; this.catches++;
      this.hunger = clamp(this.hunger - dmg, 0, 100);
      if (this.hunger <= 0) this.deathReason = 'snake';
      this.fx.text(this.p.x, this.p.y - 46, '-' + dmg + ' bite!', '#c7e86a', { size: 19 });
      this.fx.burst(this.p.x, this.p.y, '#9ec24a', 14, { spd: 120 });
      Audio.pounce();
      const a = Math.atan2(this.p.y - s.hy, this.p.x - s.hx);
      const c = this.collide(this.p.x + Math.cos(a) * 92, this.p.y + Math.sin(a) * 92, 16);
      this.p.x = c.x; this.p.y = c.y;
      this.hud.banner('Snake!', '#c7e86a', 0.7); this.hud.flashDanger();
    }

    /* ---- hawk: aerial diver, daylight only ---- */
    _hawk(dt) {
      const h = this.hawk, w = this.world;
      if (this.phase === 'night') {           // hawks roost after dark
        if (h.state !== 'away') h.state = 'away';
        h.timer = Math.max(h.timer, 3); h.spr.update(dt); return;
      }
      switch (h.state) {
        case 'away':
          h.timer -= dt;
          if (h.timer <= 0) {
            h.state = 'circle'; h.lockT = 0; h.alt = 260; h.radius = 165;
            h.cx = clamp(this.p.x, 150, w.w - 150); h.cy = clamp(this.p.y, 150, w.h - 150);
            h.ang = rand(0, TAU);
            h.x = h.cx + Math.cos(h.ang) * h.radius; h.y = h.cy + Math.sin(h.ang) * h.radius * 0.62; h.px = h.x;
          }
          break;
        case 'circle': {
          h.ang += dt * 1.0;
          h.cx = lerp(h.cx, this.p.x, 0.8 * dt); h.cy = lerp(h.cy, this.p.y, 0.8 * dt);
          h.x = h.cx + Math.cos(h.ang) * h.radius;
          h.y = h.cy + Math.sin(h.ang) * h.radius * 0.62;
          h.alt = lerp(h.alt, 250, 3 * dt);
          h.lockT += dt; h.spr.setAnim('glide', { fps: 9 });
          if (h.lockT > this.hawkLock) {
            const exposed = !this.inCover(this.p.x, this.p.y) && this.caughtT <= 0;
            if (exposed) {
              h.state = 'dive'; h.targetX = this.p.x; h.targetY = this.p.y; h.hit = false;
              this.hud.banner('Hawk!', '#ffd27f', 0.7); this.hud.flashDanger();
              Audio.blip(1180, .12, 'sawtooth', .11, 720); Audio.blip(1340, .1, 'sawtooth', .07, 860);
            } else { h.state = 'leave'; h.lockT = 0; }
          }
          break;
        }
        case 'dive': {
          // Once locked, the dive HOMES onto the rat's live position so it always
          // connects — slipping into tall grass cover is the only way to break it.
          const exposed = !this.inCover(this.p.x, this.p.y) && this.caughtT <= 0;
          if (exposed) { h.targetX = this.p.x; h.targetY = this.p.y; }
          const dx = h.targetX - h.x, dy = h.targetY - h.y, dd = Math.hypot(dx, dy) || 1;
          const step = 580 * dt;
          h.x += dx / dd * Math.min(step, dd); h.y += dy / dd * Math.min(step, dd);
          h.alt = lerp(h.alt, 0, 7 * dt); h.spr.setAnim('dive', { fps: 15 });
          if (!h.hit && exposed && dist(h.x, h.y, this.p.x, this.p.y) < this.hawkHitR) {
            h.hit = true; this._hawkStrike();
          }
          if (h.alt < 16 || dd < 14) {
            // Reached the strike point: a locked dive on an exposed rat always lands.
            if (!h.hit && exposed) { h.hit = true; this._hawkStrike(); }
            h.state = 'climb';
          }
          break;
        }
        case 'climb':
          h.alt = lerp(h.alt, 270, 3.2 * dt); h.y -= 130 * dt;
          h.x += (h.cx < w.w / 2 ? 1 : -1) * 70 * dt; h.spr.setAnim('flap', { fps: 14 });
          if (h.alt > 240) { h.state = 'away'; h.timer = this.hawkCD; }
          break;
        case 'leave':
          h.alt = lerp(h.alt, 285, 2.5 * dt); h.ang += dt * 0.8; h.lockT += dt;
          h.x = h.cx + Math.cos(h.ang) * (h.radius + h.lockT * 140);
          h.y = h.cy + Math.sin(h.ang) * (h.radius + h.lockT * 140) * 0.62 - h.lockT * 46;
          h.spr.setAnim('flap', { fps: 12 });
          if (h.lockT > 2.4) { h.state = 'away'; h.timer = this.hawkCD * 0.55; }
          break;
      }
      h.spr.flipX = h.x < h.px - 0.01; h.px = h.x;
      h.spr.x = h.x; h.spr.y = h.y - h.alt; h.spr.update(dt);
    }
    _hawkStrike() {
      const dmg = this.hawkDmg;
      this.caughtT = 1.0; this.catches++;
      this.hunger = clamp(this.hunger - dmg, 0, 100);
      if (this.hunger <= 0) this.deathReason = 'hawk';
      this.fx.text(this.p.x, this.p.y - 50, '-' + dmg + ' !', '#ffce85', { size: 20 });
      this.fx.burst(this.p.x, this.p.y, '#ffd9a0', 16, { spd: 130 });
      Audio.pounce();
      const a = Math.atan2(this.p.y - this.hawk.y, this.p.x - this.hawk.x);
      const c = this.collide(this.p.x + Math.cos(a) * 72, this.p.y + Math.sin(a) * 72, 16);
      this.p.x = c.x; this.p.y = c.y;
      this.hud.banner('Hawk strike!', '#ffce85', 0.7);
    }

    _updateFireflies(dt) {
      if (this._lightNow.vig < 0.05) return;
      const w = this.world;
      for (const f of this._fireflies) {
        f.ph += dt * (1.6 + f.spd);
        f.x += f.dx * f.spd * 14 * dt; f.y += f.dy * f.spd * 14 * dt;
        if (Math.random() < 0.01) { f.dx = rand(-1, 1); f.dy = rand(-1, 1); }
        if (f.x < 0) f.x += w.w; if (f.x > w.w) f.x -= w.w;
        if (f.y < 0) f.y += w.h; if (f.y > w.h) f.y -= w.h;
      }
    }

    draw() {
      const ctx = this.ctx, cam = this.cam;
      this.world.draw(ctx, cam);
      this._drawCloverGlow();
      this._drawScent();
      this._drawHawkShadow();
      // vision cones on ground
      if (this.showCones) {
        for (const f of this.foxes) {
          const col = f.state === 'chase' ? 'rgba(238,90,40,A)' : f.state === 'suspicious' ? 'rgba(245,150,40,A)' : 'rgba(245,180,60,A)';
          drawCone(ctx, cam, f.x, f.y, f.face, f.half || 0.46, f.range || 250, col, f.state === 'chase' ? 0.4 : 0.24);
        }
      }
      // depth-sorted sprites
      this.renderScene([
        { y: this.p.y, fn: () => this._drawPlayer() },
        ...this.foxes.map((f) => ({ y: f.y, fn: () => this._drawFox(f) })),
        ...this.snakes.map((s) => ({ y: s.y, fn: () => this._drawSnake(s) })),
      ]);
      this._drawHawk();
      // night atmosphere then particles/text on top
      this._updateFireflies(0.016);
      this._drawLighting();
      this._drawFireflies();
      this.fx.draw(ctx, cam);
    }

    _drawCloverGlow() {
      const ctx = this.ctx, cam = this.cam;
      const base = this.phase === 'morning' ? 0.5 : this.phase === 'evening' ? 0.34 : 0.26;
      for (const p of this.patches) {
        if (p.eaten) continue;
        const x = p.x - cam.x, y = p.y - cam.y;
        if (x < -60 || x > this.W + 60 || y < -60 || y > this.H + 60) continue;
        const pulse = 0.55 + 0.45 * Math.sin(this.time * 3 + p.x * 0.05);
        ctx.save(); ctx.globalAlpha = base * (0.55 + 0.45 * pulse);
        const r = 36;
        const g = ctx.createRadialGradient(x, y, 3, x, y, r);
        g.addColorStop(0, 'rgba(196,244,118,0.95)'); g.addColorStop(1, 'rgba(196,244,118,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y, r, r * 0.7, 0, 0, TAU); ctx.fill();
        ctx.restore();
      }
    }

    _drawLighting() {
      const ctx = this.ctx, L = this._lightNow;
      if (L.a > 0.012) {
        ctx.save();
        ctx.fillStyle = `rgba(${L.r | 0},${L.g | 0},${L.b | 0},${L.a.toFixed(3)})`;
        ctx.fillRect(0, 0, this.W, this.H);
        ctx.restore();
      }
      if (L.vig > 0.02) {
        const px = this.p.x - this.cam.x, py = this.p.y - this.cam.y;
        const inner = lerp(820, 200, clamp(L.vig / 0.48, 0, 1));
        const outer = inner + 520;
        const g = ctx.createRadialGradient(px, py, inner * 0.42, px, py, outer);
        g.addColorStop(0, 'rgba(8,12,30,0)');
        g.addColorStop(1, `rgba(6,10,26,${clamp(L.vig * 1.75, 0, 0.88).toFixed(3)})`);
        ctx.save(); ctx.fillStyle = g; ctx.fillRect(0, 0, this.W, this.H); ctx.restore();
      }
    }

    _drawFireflies() {
      const L = this._lightNow; if (L.vig < 0.05) return;
      const ctx = this.ctx, cam = this.cam;
      const intensity = clamp(L.vig / 0.48, 0, 1);
      ctx.save();
      for (const f of this._fireflies) {
        const x = f.x - cam.x, y = f.y - cam.y;
        if (x < -10 || x > this.W + 10 || y < -10 || y > this.H + 10) continue;
        const blink = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(f.ph));
        ctx.globalAlpha = blink * intensity * 0.9;
        const g = ctx.createRadialGradient(x, y, 0, x, y, 7);
        g.addColorStop(0, 'rgba(226,255,150,0.95)'); g.addColorStop(1, 'rgba(180,230,90,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 7, 0, TAU); ctx.fill();
        ctx.globalAlpha = blink * intensity;
        ctx.fillStyle = '#f3ffb0'; ctx.beginPath(); ctx.arc(x, y, 1.6, 0, TAU); ctx.fill();
      }
      ctx.restore();
    }

    _drawPlayer() {
      this.p.draw(this.ctx, this.cam);
      const ctx = this.ctx, sx = this.p.x - this.cam.x;
      if (this.inCover(this.p.x, this.p.y)) {
        ctx.save(); ctx.globalAlpha = .9;
        ctx.font = '700 13px Nunito'; ctx.textAlign = 'center'; ctx.fillStyle = '#fff';
        ctx.strokeStyle = 'rgba(20,30,12,.6)'; ctx.lineWidth = 3;
        ctx.strokeText('hidden', sx, this.p.y - 52 - this.cam.y);
        ctx.fillText('hidden', sx, this.p.y - 52 - this.cam.y); ctx.restore();
      }
      if (this.staminaLock) {
        const inCov = this.inCover(this.p.x, this.p.y);
        // sweat droplets right at the head, flicking off to the sides
        const headY = this.p.y - (inCov ? 40 : 26) - this.cam.y;
        ctx.save();
        for (let i = 0; i < 3; i++) {
          const ph = (this.time * 1.9 + i * 0.55) % 1;             // 0..1 flick cycle
          const side = i === 0 ? -1 : (i === 2 ? 1 : 0);
          const dx = side * 11 + Math.sin(this.time * 7 + i) * 1.5;
          const dy = -2 + ph * 12 - (side === 0 ? 4 : 0);          // arc off the head
          const a = (1 - ph) * 0.95;
          const r = 2.8 - ph * 1.1;
          ctx.globalAlpha = a;
          ctx.fillStyle = '#aee4f7';
          ctx.beginPath();
          ctx.moveTo(sx + dx, headY + dy - r * 1.6);
          ctx.quadraticCurveTo(sx + dx + r, headY + dy, sx + dx, headY + dy + r);
          ctx.quadraticCurveTo(sx + dx - r, headY + dy, sx + dx, headY + dy - r * 1.6);
          ctx.fill();
          ctx.globalAlpha = a * 0.7;
          ctx.fillStyle = '#eafaff';
          ctx.beginPath();
          ctx.arc(sx + dx - r * 0.3, headY + dy - r * 0.1, r * 0.32, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
        // "tired" flash above
        ctx.save(); ctx.globalAlpha = .85 * (0.6 + 0.4 * Math.sin(this.time * 8));
        ctx.font = '800 12px Nunito'; ctx.textAlign = 'center'; ctx.fillStyle = '#ffd2bf';
        ctx.strokeStyle = 'rgba(40,16,8,.6)'; ctx.lineWidth = 3;
        const ty = this.p.y - (inCov ? 68 : 52) - this.cam.y;
        ctx.strokeText('tired', sx, ty); ctx.fillText('tired', sx, ty); ctx.restore();
      }
    }
    _drawFox(f) {
      f.spr.draw(this.ctx, this.cam);
      const x = f.x - this.cam.x, y = f.y - 64 - this.cam.y, ctx = this.ctx;
      // sniffing cue — little dust puffs at the nose while tracking your scent
      if (f.sniffT > 0 && f.state === 'suspicious') {
        ctx.save(); ctx.globalAlpha = clamp(f.sniffT, 0, 1) * 0.5;
        ctx.fillStyle = '#cdbd9a';
        for (let i = 0; i < 3; i++) {
          const px = x + Math.cos(f.face) * 22 + rand(-3, 3);
          const py = f.y - 16 - this.cam.y + Math.sin(f.face) * 10 + rand(-3, 3);
          ctx.beginPath(); ctx.arc(px, py, 2.4 - i * 0.5, 0, TAU); ctx.fill();
        }
        ctx.restore();
      }
      if (f.exclaim > 0) {
        ctx.save(); ctx.globalAlpha = clamp(f.exclaim, 0, 1);
        ctx.font = '900 30px Baloo 2'; ctx.textAlign = 'center'; ctx.fillStyle = '#ff5436';
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 5; ctx.strokeText('!', x, y); ctx.fillText('!', x, y); ctx.restore();
      } else if (f.qmark > 0) {
        ctx.save(); ctx.globalAlpha = clamp(f.qmark, 0, 1);
        ctx.font = '900 26px Baloo 2'; ctx.textAlign = 'center'; ctx.fillStyle = '#f7b13a';
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 5; ctx.strokeText('?', x, y); ctx.fillText('?', x, y); ctx.restore();
      }
    }

    // faint scent trail so you can read where you've left a track for the foxes
    _drawScent() {
      if (!this.scent.length) return;
      const ctx = this.ctx, cam = this.cam;
      ctx.save();
      for (const s of this.scent) {
        const age = (this.time - s.t) / this.scentLife;        // 0 fresh .. 1 gone
        const x = s.x - cam.x, y = s.y - cam.y;
        if (x < -20 || x > this.W + 20 || y < -20 || y > this.H + 20) continue;
        ctx.globalAlpha = (1 - age) * 0.16;
        ctx.fillStyle = '#b8a6e8';
        ctx.beginPath(); ctx.ellipse(x, y, 6, 4, 0, 0, TAU); ctx.fill();
      }
      ctx.restore();
    }

    _drawSnake(s) {
      const ctx = this.ctx, cam = this.cam;
      const hx = s.hx - cam.x, hy = s.hy - cam.y;
      // expanding water rings over a lurking pond snake — your only warning while you drink
      if (s.habitat === 'pond' && s.ripple > 0.01) {
        ctx.save();
        for (let i = 0; i < 2; i++) {
          const ph = (this.time * 1.5 + i * 0.5) % 1;
          ctx.globalAlpha = (1 - ph) * 0.4 * clamp(s.ripple, 0, 1);
          ctx.strokeStyle = '#e2f2e8'; ctx.lineWidth = 2;
          const rr = 7 + ph * 28;
          ctx.beginPath(); ctx.ellipse(hx, hy, rr, rr * 0.5, 0, 0, TAU); ctx.stroke();
        }
        ctx.restore();
      }
      // faint under the surface, solid as it rises and strikes
      const alpha = s.state === 'strike' ? 1 : clamp(0.16 + s.emerge * 1.0, 0.16, 1);
      ctx.save(); ctx.globalAlpha = alpha;
      s.spr.draw(ctx, cam);
      ctx.restore();
    }

    _drawHawkShadow() {
      const h = this.hawk; if (h.state === 'away' || this.phase === 'night') return;
      const ctx = this.ctx, x = h.x - this.cam.x, y = h.y - this.cam.y;
      const k = clamp(1 - h.alt / 260, 0, 1);             // tightens & darkens as it descends
      const rx = lerp(36, 16, k);
      ctx.save();
      ctx.globalAlpha = lerp(0.10, 0.42, k);
      ctx.fillStyle = '#0e1707';
      ctx.beginPath(); ctx.ellipse(x, y, rx, rx * 0.5, 0, 0, TAU); ctx.fill();
      ctx.restore();
    }
    _drawHawk() {
      const h = this.hawk; if (h.state === 'away' || this.phase === 'night') return;
      h.spr.draw(this.ctx, this.cam);
    }

    _loss(reason) {
      const map = {
        starved:    { resultKicker: 'YOU STARVED', resultTitle: 'Out of food' },
        dehydrated: { resultKicker: 'YOU RAN DRY', resultTitle: 'Too thirsty' },
        caught:     { resultKicker: 'THE FOX GOT YOU', resultTitle: 'Caught at last' },
        hawk:       { resultKicker: 'A HAWK GOT YOU', resultTitle: 'Snatched from above' },
        snake:      { resultKicker: 'A SNAKE STRUCK', resultTitle: 'Ambushed at the water' },
      };
      const m = map[reason] || map.starved;
      return {
        stars: 0, resultKicker: m.resultKicker, resultTitle: m.resultTitle,
        stats: [
          ['Survived to', this._phaseHud().name + ' · ' + this._fmt(this.dayT)],
          ['Clover grazed', this.count],
          ['Times caught', this.catches],
        ],
      };
    }
    scorePayload() {
      let stars = 2;
      if (this.hunger > 45 && this.thirst > 40 && this.catches <= 1) stars = 3;
      if (this.hunger < 15 || this.thirst < 15) stars = Math.min(stars, 1);
      return {
        stars: this.won ? Math.max(1, stars) : 0,
        resultKicker: 'YOU SURVIVED THE NIGHT',
        resultTitle: 'Dawn breaks!',
        stats: [
          ['Clover grazed', this.count],
          ['Hunger left', Math.round(this.hunger) + '%'],
          ['Thirst left', Math.round(this.thirst) + '%'],
          ['Times caught', this.catches],
        ],
      };
    }
    _fmt(s) { s = Math.max(0, s | 0); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }
  }

  G.LevelClasses.Level1 = Level1;
})(window);
