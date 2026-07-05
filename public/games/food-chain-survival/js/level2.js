/* ===========================================================================
   Level 2 — FOX (predator / secondary consumer)  ·  THE HUNT
   You are a hungry fox in a contested wood. Four pressures bite at once:
     1. ENERGY (hunger). You start the hunt only HALF fed. It drains the whole
        time and pouncing burns it fast. Only a kill refills it. Starve and the
        hunt is over.
     2. STAMINA. Sprint-pounces burn stamina; empty it and you're winded —
        locked out of sprinting until you've fully caught your breath.
     3. THE WARREN. Rabbits forage as a group with sentinels. They CANNOT see
        you while you're tucked in tall grass — but they HEAR you. A fox that
        walks or pounces in the open is heard and the rabbit bolts at once, so
        the only way in is to SNEAK. A kill in view of the warren makes every
        rabbit nearby panic.
     4. COMPETITION. You are not the only hunter. A rival fox stalks the same
        rabbits, a hawk dives on any in the open, and snakes ambush from the
        grass. Every rabbit they take is one you don't.
   =========================================================================== */
(function (global) {
  'use strict';
  const G = global.Game;
  const { clamp, lerp, dist, rand, TAU, angleDiff, inCone, drawCone, Input, Audio } = G;

  class Level2 extends G.LevelBase {
    init(opts) {
      const T = opts.tweaks;
      this.diff = T.difficulty; this.showCones = T.showCones; this.playerSpeedMul = T.playerSpeed;
      this.foxHunger = T.foxHunger !== false;     // energy/hunger system (default on)
      this.rivals = T.rivals !== false;           // competing predators (default on)
      this.nerves = T.warrenNerves || 1;          // warren alertness multiplier

      this.world = new G.World(1680, 1160, { palette: 'forest', seed: 204 });
      const w = this.world;
      const spawn = { x: w.w * 0.5, y: w.h * 0.55, r: 130 };
      w.scatter('tree', 8, { spacing: 210, margin: 120, avoid: [spawn], props: () => ({ block: true, br: 26, by: 8, s: rand(0.9, 1.3) }) });
      w.scatter('bush', 14, { spacing: 120, props: () => ({ block: true, br: 20, coverR: 32, s: rand(0.85, 1.25) }) });
      w.scatter('tallgrass', 22, { spacing: 96, props: () => ({ coverR: 34, s: rand(0.9, 1.3) }) });
      w.scatter('rock', 6, { spacing: 150, props: () => ({ block: true, br: 18, s: rand(0.8, 1.1) }) });
      w.scatter('flower', 18, { spacing: 50, props: () => ({ color: G.pick(['#f2d24b', '#f0f0f0', '#e87fb0']), s: rand(0.8, 1.1) }) });
      w.scatter('grasspatch', 12, { spacing: 120, props: () => ({ eaten: false, s: rand(0.95, 1.1) }) });
      this.patches = w.props.filter((p) => p.type === 'grasspatch');
      this.burrows = [];
      w.scatter('burrow', 5, { spacing: 260, margin: 140, avoid: [spawn], props: () => ({ s: rand(1, 1.25) }) });
      for (const p of w.props) if (p.type === 'burrow') this.burrows.push(p);

      // player fox
      this.p = new G.Sprite('fox', { x: spawn.x, y: spawn.y, scale: 0.58, fps: 9, anchorY: 0.86 });
      this.face = 1; this.vx = 0; this.vy = 0;
      this.stamina = 100; this.staminaLock = false;
      this.goal = [4, 4, 5][this.diff]; this.count = 0; this.escaped = 0; this.lostToRivals = 0;
      this.timeLeft = this.totalTime = [150, 132, 118][this.diff];

      // ENERGY / hunger — start at HALF
      this.energy = 50;
      this.energyDrain = [0.45, 0.58, 0.74][this.diff];   // per second, all hunt long
      this.pounceCost = 6;                                 // extra per second while pouncing
      this.catchFood  = [32, 29, 26][this.diff];           // energy per kill
      this.deathReason = null;

      // DUSK lighting across the hunt
      this._lightNow = { r: 255, g: 240, b: 210, a: 0.02, vig: 0 };
      this.phase = 'day';

      // rabbits — a warren with foragers and sentinels
      this.rabbits = [];
      this.rabbitCount = 8;
      for (let i = 0; i < this.rabbitCount; i++) this._spawnRabbit(true, i % 3 === 0);
      this.hearBase = [150, 168, 188][this.diff];          // fox hearing radius, scaled by noise
      this.rabbitFleeSpeed = [196, 214, 232][this.diff] * (T.enemySpeed || 1);
      this.thumpR = [220, 260, 310][this.diff];

      // ---- competition: rival fox, hawk, snakes ----
      this.predFoxes = [];
      if (this.rivals) {
        const nRival = [1, 1, 2][this.diff];
        const spots = [{ x: w.w * 0.2, y: w.h * 0.25 }, { x: w.w * 0.82, y: w.h * 0.78 }];
        for (let i = 0; i < nRival; i++) this.predFoxes.push(this._makeRival(spots[i].x, spots[i].y));
      }
      // snakes lurk in tall grass, ambushing rabbits
      this.snakes = [];
      if (this.rivals) {
        const grass = w.props.filter((p) => p.type === 'tallgrass' && dist(p.x, p.y, spawn.x, spawn.y) > 230);
        const nGrass = [1, 1, 2][this.diff];
        this.snakeAmbush = [1.4, 1.1, 0.85][this.diff]; this.snakeHitR = 70; this.snakeCD = [4.5, 3.6, 2.8][this.diff];
        for (const g of grass.sort(() => Math.random() - 0.5).slice(0, nGrass)) {
          this.snakes.push({
            spr: new G.Sprite('snake', { x: g.x, y: g.y, scale: 0.32, fps: 6, anchorY: 0.6 }),
            x: g.x, y: g.y, hx: g.x, hy: g.y, senseR: (g.coverR || 34) * (g.s || 1) + 14,
            state: 'lurk', face: 1, lurkT: 0, cd: 0, hit: false, emerge: 0, t: rand(0, 3), target: null,
          });
        }
      }
      // hawk — aerial competitor, daylight only
      this.hawk = null;
      if (this.rivals) {
        this.hawkLock = [2.6, 2.1, 1.6][this.diff]; this.hawkCD = [16, 13, 10][this.diff]; this.hawkHitR = 46;
        this.hawk = {
          spr: new G.Sprite('hawk', { x: 0, y: 0, scale: 0.55, fps: 9, anchorY: 0.5 }),
          state: 'away', timer: rand(8, 13), x: 0, y: 0, px: 0, alt: 260,
          ang: 0, radius: 165, cx: 0, cy: 0, lockT: 0, targetX: 0, targetY: 0, hit: false, prey: null,
        };
      }

      this.hud.config({
        role: 'FOX', accent: '#13A597', goal: this.meta.hudGoal,
        showTimer: true, showPhase: true, showEnergy: this.foxHunger, energyLabel: 'Energy',
        showStamina: true, countMax: this.goal,
      });
      this.hud.hint(this.rivals
        ? 'SNEAK (Shift) — tall grass hides you, but rabbits HEAR a fox that walks or pounces in the open. Stalk the grazers, Space to pounce. You start half-starved & rivals are hunting too!'
        : 'SNEAK (Shift) to stay quiet — rabbits HEAR a walking fox and bolt. Hide in tall grass, stalk the grazers, then Space to pounce. Mind your Energy — only kills refill it!');
      this.noise = 0.15;
    }

    /* ---------------- rabbits ---------------- */
    _spawnRabbit(initial, sentinel) {
      const w = this.world; let x, y, ok, t = 0;
      do { x = rand(120, w.w - 120); y = rand(120, w.h - 120); ok = true;
        for (const q of w.props) if (q.block && dist(x, y, q.x, q.y) < 60) { ok = false; break; }
        if (!initial && this.p && dist(x, y, this.p.x, this.p.y) < 360) ok = false;
      } while (!ok && ++t < 40);
      this.rabbits.push({
        spr: new G.Sprite('rabbit', { x, y, scale: 0.32, fps: 11 }),
        x, y, face: rand(0, TAU), state: 'graze', t: rand(0, 2), wp: { x, y },
        alive: true, sentinel: !!sentinel, scanAng: rand(0, TAU), scanT: rand(0.6, 2.0),
        thumped: false, jit: rand(0, TAU), exclaim: 0, calm: 0,
      });
    }
    _newWander(r) { const w = this.world; r.wp = { x: clamp(r.x + rand(-220, 220), 90, w.w - 90), y: clamp(r.y + rand(-220, 220), 90, w.h - 90) }; }
    _aliveRabbits() { return this.rabbits.filter((r) => r.alive && r.state !== 'caught'); }
    _nearestRabbit(x, y, filter) {
      let best = null, bd = 1e9;
      for (const r of this.rabbits) { if (!r.alive || (filter && !filter(r))) continue; const d = dist(x, y, r.x, r.y); if (d < bd) { bd = d; best = r; } }
      return best ? { r: best, d: bd } : null;
    }

    /* ---------------- dusk lighting ---------------- */
    _lightingFor(frac) {
      const S = [
        { t: 0.00, col: [255, 240, 210], a: 0.02, vig: 0.00 },
        { t: 0.42, col: [255, 214, 150], a: 0.12, vig: 0.04 },
        { t: 0.68, col: [225, 150, 110], a: 0.24, vig: 0.16 },
        { t: 0.86, col: [120, 96, 150],  a: 0.36, vig: 0.26 },
        { t: 1.00, col: [40, 50, 96],    a: 0.48, vig: 0.36 },
      ];
      let a = S[0], b = S[S.length - 1];
      for (let i = 0; i < S.length - 1; i++) { if (frac >= S[i].t && frac <= S[i + 1].t) { a = S[i]; b = S[i + 1]; break; } }
      const k = a === b ? 0 : clamp((frac - a.t) / (b.t - a.t), 0, 1);
      return { r: lerp(a.col[0], b.col[0], k), g: lerp(a.col[1], b.col[1], k), b: lerp(a.col[2], b.col[2], k), a: lerp(a.a, b.a, k), vig: lerp(a.vig, b.vig, k) };
    }
    _phaseHud() {
      if (this.phase === 'day') return { key: 'day', name: 'Afternoon', ico: 'sun' };
      if (this.phase === 'dusk') return { key: 'evening', name: 'Dusk', ico: 'sunset' };
      return { key: 'night', name: 'Nightfall', ico: 'moon' };
    }
    get _dark() { return clamp(this._lightNow.vig / 0.36, 0, 1); }

    /* ---------------- main loop ---------------- */
    update(dt) {
      if (this.over) { this.p.update(dt); this.rabbits.forEach((r) => r.spr.update(dt)); this.predFoxes.forEach((f) => f.spr.update(dt)); this.snakes.forEach((s) => s.spr.update(dt)); if (this.hawk) this.hawk.spr.update(dt); return; }
      this.time += dt; this.timeLeft -= dt;

      const frac = clamp(1 - this.timeLeft / this.totalTime, 0, 1);
      this._lightNow = this._lightingFor(frac);
      const ph = frac < 0.42 ? 'day' : frac < 0.74 ? 'dusk' : 'night';
      if (ph !== this.phase) { this.phase = ph; this._announcePhase(ph); }

      if (this.timeLeft <= 0) { this.timeLeft = 0; return this.finish(this.count >= this.goal, this._loss('time')); }

      this._player(dt);
      for (const r of this.rabbits) if (r.alive) this._rabbit(r, dt);
      for (const f of this.predFoxes) this._rivalAI(f, dt);
      this._snakes(dt);
      this._hawk(dt);

      // ENERGY drain & starvation
      if (this.foxHunger) {
        let drain = this.energyDrain;
        if (this.pouncing) drain += this.pounceCost;
        this.energy = clamp(this.energy - drain * dt, 0, 100);
        if (this.energy <= 0) return this.finish(false, this._loss('starved'));
        if (this.energy < 22 && !this._loEnergy) { this._loEnergy = true; this.hud.banner('Running on empty!', '#f1b15a', 1.0); }
        if (this.energy > 38) this._loEnergy = false;
      }

      this.hud.set({
        stamina: this.stamina, energy: this.energy, count: this.count, timer: this.timeLeft,
        phase: this._phaseHud(), danger: this.foxHunger && this.energy < 25,
      });
      if (this.count >= this.goal) return this.finish(true);
      this.cam.follow(this.p.x, this.p.y, this.world.w, this.world.h);
    }

    _announcePhase(ph) {
      if (ph === 'dusk') this.hud.banner('Dusk falls', '#f0a24a', 1.3);
      else if (ph === 'night') { this.hud.banner('Nightfall — the warren is on edge', '#9fb0ff', 1.6); Audio.alert(); }
    }

    /* ---------------- player ---------------- */
    _player(dt) {
      const ax = Input.axis(); let mvx = ax.x, mvy = ax.y;
      if (this.hud.touchDir) { mvx += this.hud.touchDir.x; mvy += this.hud.touchDir.y; const m = Math.hypot(mvx, mvy) || 1; mvx /= m; mvy /= m; }
      const moving = mvx || mvy;
      const sneaking = Input.down('shift') || this.hud.sneakDown;

      // stamina exhaust lock — same logic as the rabbit: drains on pounce, and
      // once empty you can't sprint again until fully recovered.
      if (this.stamina <= 0 && !this.staminaLock) this.staminaLock = true;
      if (this.staminaLock && this.stamina >= 99.5) this.staminaLock = false;
      const wantPounce = (Input.down('space') || this.hud.actionDown) && !this.staminaLock && this.stamina > 0 && moving && !sneaking;

      const starv = (this.foxHunger && this.energy < 25) ? lerp(0.62, 1, this.energy / 25) : 1;
      const winded = this.staminaLock ? 0.6 : 1;
      let speed, anim, fps;
      if (wantPounce) { speed = 285; anim = 'sprint'; fps = 14; this.stamina = clamp(this.stamina - 38 * dt, 0, 100); if (Math.random() < .1) Audio.step(); }
      else if (sneaking) { speed = 92; anim = 'sneak'; fps = 7; this.stamina = clamp(this.stamina + 26 * dt, 0, 100); }
      else { speed = 156; anim = moving ? 'walk' : 'idle'; fps = moving ? 10 : 6; this.stamina = clamp(this.stamina + (moving ? 18 : 26) * dt, 0, 100); }
      speed *= this.playerSpeedMul * starv * winded;

      // NOISE the warren can hear (0..~1.7). Sneaking is near-silent; walking is
      // loud; pouncing is loudest. Tall grass muffles you.
      let nz = !moving ? 0.15 : (wantPounce ? 1.7 : (sneaking ? 0.32 : 1.0));
      if (this.inCover(this.p.x, this.p.y)) nz *= 0.45;
      this.noise = nz;
      this.sneaking = sneaking; this.pouncing = wantPounce;

      if (moving) { this.vx = mvx * speed; this.vy = mvy * speed; if (mvx) this.face = mvx < 0 ? -1 : 1; }
      else { this.vx *= 0.6; this.vy *= 0.6; }
      const c = this.collide(this.p.x + this.vx * dt, this.p.y + this.vy * dt, 20); this.p.x = c.x; this.p.y = c.y;
      this.p.flipX = this.face < 0; this.p.setAnim(anim, { fps }); this.p.update(dt);
    }

    /* ---------------- rabbit AI ---------------- */
    _rabbit(r, dt) {
      const w = this.world; r.t += dt;
      const d = dist(r.x, r.y, this.p.x, this.p.y);
      // tall grass hides the fox from SIGHT (but not sound). Pouncing bursts cover.
      const foxHidden = this.inCover(this.p.x, this.p.y) && !this.pouncing;
      const nightMul = 1 + this._dark * 0.5;               // crepuscular: jumpier as it darkens
      const sens = this.nerves * nightMul;
      const roleMul = r.sentinel ? 1.2 : (r.state === 'graze' ? 0.62 : 0.95);

      let detect = false;
      // --- SIGHT (blocked by cover) ---
      if (!foxHidden) {
        if (d < 64 * roleMul) {                            // close-range awareness, needs line of sight
          let clear = true; for (const b of w.blockers) if (G.segCircle(r.x, r.y, this.p.x, this.p.y, b.x, b.y, b.r)) { clear = false; break; }
          if (clear) detect = true;
        }
        if (r.sentinel && inCone(r.x, r.y, r.scanAng, 0.52, 250, this.p.x, this.p.y, w.blockers)) detect = true;
      }
      // --- HEARING (through cover) — a non-sneaking fox is heard and the rabbit bolts at once ---
      const hearR = this.hearBase * this.noise * sens * roleMul;
      if (d < hearR) detect = true;
      // --- a rival fox crashing through nearby also spooks the warren ---
      if (this.rivals) for (const rf of this.predFoxes) if (rf.state === 'pounce' && dist(r.x, r.y, rf.x, rf.y) < 150) { detect = true; break; }

      if (detect && r.state !== 'flee' && r.state !== 'caught') this._spook(r);

      let speed, anim, fps;
      if (r.state === 'flee') {
        const bb = this._bestBurrow(r);
        let tx, ty, bd = bb ? dist(r.x, r.y, bb.x, bb.y) : 1e9;
        if (bb && bd > 30) { tx = bb.x; ty = bb.y; }
        else if (bb && bd <= 30) { this._escape(r); return; }
        else { tx = r.x + (r.x - this.p.x); ty = r.y + (r.y - this.p.y); }
        let a = Math.atan2(ty - r.y, tx - r.x);
        a += Math.sin(this.time * 8 + r.jit) * 0.28;       // juke
        speed = this.rabbitFleeSpeed; anim = 'sprint'; fps = 16; r.face = a; this._moveRabbit(r, a, speed, dt);
        if (r.exclaim > 0) r.exclaim -= dt;
        if (!detect) { r.calm += dt; if (r.calm > 3) { r.state = 'graze'; r.calm = 0; r.thumped = false; this._newWander(r); } } else r.calm = 0;
      } else if (r.state === 'graze') {
        anim = (Math.floor(r.t * 1.2) % 4 === 0) ? 'eat' : 'idle'; fps = 7; speed = 0;
        if (r.sentinel) { r.scanT -= dt; if (r.scanT <= 0) { r.scanAng += rand(-1.4, 1.4); r.scanT = rand(1.0, 2.4); anim = 'alert'; } }
        if (r.t > rand(1.8, 3.6)) { r.state = 'wander'; r.t = 0; this._newWander(r); }
      } else { // wander
        const a = Math.atan2(r.wp.y - r.y, r.wp.x - r.x);
        speed = 78; anim = 'hop'; fps = 11; r.face = a; this._moveRabbit(r, a, speed, dt);
        if (r.sentinel) r.scanAng = a;
        if (dist(r.x, r.y, r.wp.x, r.wp.y) < 24 || r.t > 4) { r.state = 'graze'; r.t = 0; }
      }
      if (r.state !== 'caught' && d < 30 && (this.pouncing || d < 22)) this._catch(r);
      r.spr.x = r.x; r.spr.y = r.y; r.spr.flipX = Math.cos(r.face) < 0;
      r.spr.setAnim(anim, { fps }); r.spr.update(dt);
    }

    _bestBurrow(r) {
      let best = null, bestScore = 1e9;
      const fa = Math.atan2(this.p.y - r.y, this.p.x - r.x);
      for (const b of this.burrows) {
        const ba = Math.atan2(b.y - r.y, b.x - r.x);
        const toward = Math.cos(angleDiff(fa, ba));
        const score = dist(r.x, r.y, b.x, b.y) + Math.max(0, toward) * 520;
        if (score < bestScore) { bestScore = score; best = b; }
      }
      return best;
    }
    _spook(r) {
      r.state = 'flee'; r.exclaim = 1; r.calm = 0; Audio.alert();
      if (!r.thumped) {                                     // thump scatters the warren
        r.thumped = true;
        this.fx.ring(r.x, r.y, '#ffd23c', 10, this.thumpR * 0.6, 0.55);
        this.fx.text(r.x, r.y - 46, 'thump!', '#ffd23c', { size: 15, life: .7 });
        Audio.blip(150, 0.1, 'sine', 0.13, 90);
        for (const o of this.rabbits) {
          if (!o.alive || o === r || o.state === 'flee') continue;
          if (dist(o.x, o.y, r.x, r.y) < this.thumpR) { o.state = 'flee'; o.exclaim = 0.8; o.thumped = true; o.calm = 0; }
        }
      }
    }
    _moveRabbit(r, a, speed, dt) { const c = this.collide(r.x + Math.cos(a) * speed * dt, r.y + Math.sin(a) * speed * dt, 13); r.x = c.x; r.y = c.y; }

    // a kill seen by the warren — every nearby rabbit panics and flees at once
    _panic(x, y, radius) {
      for (const o of this.rabbits) {
        if (!o.alive || o.state === 'caught') continue;
        if (dist(o.x, o.y, x, y) < radius) { o.state = 'flee'; o.exclaim = 1; o.thumped = true; o.calm = 0; }
      }
    }

    _catch(r) {
      r.alive = false; r.state = 'caught'; this.count++;
      if (this.foxHunger) this.energy = clamp(this.energy + this.catchFood, 0, 100);
      this.fx.text(r.x, r.y - 40, this.foxHunger ? 'Caught! +' + this.catchFood : 'Caught!', '#aee05a', { size: 20 });
      this.fx.burst(r.x, r.y, '#d8c0a0', 16, { spd: 130 }); this.fx.ring(r.x, r.y, '#fff', 8, 60, .5);
      Audio.pounce(); this.hud.flashGood();
      this._panic(r.x, r.y, this.thumpR * 0.9);             // witnessed kill spooks the survivors
      this.rabbits = this.rabbits.filter((x) => x !== r);
      if (this.count < this.goal) setTimeout(() => { if (!this.over) this._spawnRabbit(false, Math.random() < 0.34); }, 1400);
    }
    _escape(r) {
      r.alive = false; this.escaped++;
      this.fx.text(r.x, r.y - 36, 'escaped', '#cdb', { size: 15 });
      this.fx.burst(r.x, r.y, '#9c8', 8, { up: 20 });
      this.rabbits = this.rabbits.filter((x) => x !== r);
      setTimeout(() => { if (!this.over && this.count < this.goal) this._spawnRabbit(false, Math.random() < 0.34); }, 1800);
    }
    // a rabbit taken by a competing predator
    _rivalTake(r, x, y) {
      if (!r || !r.alive) return;
      r.alive = false; r.state = 'caught'; this.lostToRivals++;
      this.fx.text(x, y - 38, 'lost!', '#ff9b6b', { size: 16, life: .9 });
      this.fx.burst(x, y, '#caa', 12, { spd: 110 });
      this._panic(x, y, this.thumpR);
      this.rabbits = this.rabbits.filter((q) => q !== r);
      if (this.count < this.goal) setTimeout(() => { if (!this.over) this._spawnRabbit(false, Math.random() < 0.34); }, 1600);
    }

    /* ---------------- rival fox ---------------- */
    _makeRival(x, y) {
      return { spr: new G.Sprite('fox', { x, y, scale: 0.55, fps: 9, anchorY: 0.86 }),
        x, y, face: 0, faceSmooth: null, state: 'roam', wp: this._wander(x, y), target: null,
        t: 0, cd: 0, score: 0, stuckT: 0 };
    }
    _wander(x, y) {
      const w = this.world;
      for (let i = 0; i < 12; i++) { const tx = clamp(x + rand(-320, 320), 80, w.w - 80), ty = clamp(y + rand(-320, 320), 80, w.h - 80); let ok = true; for (const b of w.blockers) if (dist(tx, ty, b.x, b.y) < b.r + 40) { ok = false; break; } if (ok) return { x: tx, y: ty }; }
      return { x: clamp(x + rand(-300, 300), 80, w.w - 80), y: clamp(y + rand(-300, 300), 80, w.h - 80) };
    }
    _rivalAI(f, dt) {
      f.t += dt; if (f.cd > 0) f.cd -= dt;
      // pick / refresh prey
      if ((!f.target || !f.target.alive) && f.cd <= 0) {
        const near = this._nearestRabbit(f.x, f.y, (r) => r.state !== 'flee' || dist(f.x, f.y, r.x, r.y) < 240);
        if (near && near.d < 520) { f.target = near.r; f.state = 'stalk'; } else { f.target = null; if (f.state !== 'roam') f.state = 'roam'; }
      }
      let tx, ty, speed, anim, fps;
      if (f.target && f.target.alive) {
        const d = dist(f.x, f.y, f.target.x, f.target.y);
        tx = f.target.x; ty = f.target.y;
        if (d < 150) { f.state = 'pounce'; speed = this.rabbitFleeSpeed * 1.04; anim = 'sprint'; fps = 14; }
        else { f.state = 'stalk'; speed = 150; anim = 'walk'; fps = 11; }
        if (d < 28) { const r = f.target; f.target = null; f.cd = rand(2.6, 4.2); f.score++; f.state = 'roam'; f.wp = this._wander(f.x, f.y); this._rivalTake(r, r.x, r.y); }
      } else {
        tx = f.wp.x; ty = f.wp.y; speed = 92; anim = 'walk'; fps = 9;
        if (dist(f.x, f.y, tx, ty) < 28) f.wp = this._wander(f.x, f.y);
      }
      const a = Math.atan2(ty - f.y, tx - f.x);
      const turn = (f.state === 'pounce' ? 7 : 3.2) * dt;
      f.faceSmooth = f.faceSmooth == null ? a : f.faceSmooth + clamp(angleDiff(f.faceSmooth, a), -turn, turn);
      f.face = f.faceSmooth;
      let moved = false;
      for (const off of [0, 0.5, -0.5, 1.0, -1.0, 1.7]) { const ma = a + off; const c = this.collide(f.x + Math.cos(ma) * speed * dt, f.y + Math.sin(ma) * speed * dt, 20); if (dist(c.x, c.y, f.x, f.y) > speed * dt * 0.5) { f.x = c.x; f.y = c.y; moved = true; break; } }
      if (!moved) { f.stuckT += dt; if (f.stuckT > 0.4) { f.wp = this._wander(f.x, f.y); f.target = null; f.cd = 0.6; f.stuckT = 0; } } else f.stuckT = Math.max(0, f.stuckT - dt * 2);
      f.spr.x = f.x; f.spr.y = f.y; f.spr.flipX = Math.cos(f.face) < 0; f.spr.setAnim(anim, { fps }); f.spr.update(dt);
    }

    /* ---------------- snakes (ambush rabbits in grass) ---------------- */
    _snakes(dt) { for (const s of this.snakes) this._snakeAI(s, dt); }
    _snakeAI(s, dt) {
      s.t += dt;
      // a rabbit lingering over the snake's grass patch
      const prey = this._nearestRabbit(s.hx, s.hy, (r) => dist(r.x, r.y, s.hx, s.hy) < s.senseR);
      const here = !!prey && s.cd <= 0;
      if (s.cd > 0) {
        s.cd -= dt; s.state = 'lurk'; s.lurkT = 0; s.x = lerp(s.x, s.hx, 8 * dt); s.y = lerp(s.y, s.hy, 8 * dt);
        s.emerge = lerp(s.emerge, 0, 6 * dt); s.spr.setAnim('coiled', { fps: 6 });
      } else if (s.state === 'strike') {
        s.emerge = 1;
        const tgt = s.target;
        if (tgt && tgt.alive) {
          s.face = tgt.x < s.hx ? -1 : 1;
          const ang = Math.atan2(tgt.y - s.hy, tgt.x - s.hx), md = Math.min(dist(s.hx, s.hy, tgt.x, tgt.y), 100);
          s.x = lerp(s.x, s.hx + Math.cos(ang) * md, 13 * dt); s.y = lerp(s.y, s.hy + Math.sin(ang) * md, 13 * dt);
          if (!s.hit && s.spr.frame >= 2 && dist(s.x, s.y, tgt.x, tgt.y) < this.snakeHitR) { s.hit = true; this._rivalTake(tgt, tgt.x, tgt.y); Audio.pounce(); }
        }
      } else if (here) {
        s.target = prey.r; s.lurkT += dt; s.face = prey.r.x < s.hx ? -1 : 1;
        s.emerge = lerp(s.emerge, clamp(s.lurkT / this.snakeAmbush, 0, 1) * 0.55, 5 * dt);
        s.state = 'alert'; s.spr.setAnim('alert', { fps: 8 });
        if (Math.random() < 0.12) this.fx.burst(s.hx + rand(-15, 15), s.hy - 10 + rand(-9, 9), G.pick(['#4f7d3a', '#5e8f44', '#6fa050']), 1, { spd: 22, up: 16, life: .55, size: 3, g: 80 });
        if (s.lurkT >= this.snakeAmbush) { s.state = 'strike'; s.hit = false; s.spr.setAnim('strike', { fps: 18, loop: false, onEnd: () => { s.state = 'lurk'; s.cd = this.snakeCD; s.lurkT = 0; } }); Audio.blip(180, .12, 'sawtooth', .08, 90); }
      } else {
        s.state = 'lurk'; s.lurkT = Math.max(0, s.lurkT - dt * 2); s.emerge = lerp(s.emerge, 0, 5 * dt);
        s.x = lerp(s.x, s.hx, 8 * dt); s.y = lerp(s.y, s.hy, 8 * dt); s.spr.setAnim('coiled', { fps: 6 });
      }
      s.spr.x = s.x; s.spr.y = s.y; s.spr.flipX = s.face < 0; s.spr.update(dt);
    }

    /* ---------------- hawk (aerial competitor) ---------------- */
    _hawk(dt) {
      const h = this.hawk; if (!h) return; const w = this.world;
      if (this.phase === 'night') { if (h.state !== 'away') h.state = 'away'; h.timer = Math.max(h.timer, 3); h.spr.update(dt); return; }
      const exposed = (r) => r && r.alive && !this.inCover(r.x, r.y);
      switch (h.state) {
        case 'away':
          h.timer -= dt;
          if (h.timer <= 0) {
            const tgt = this._nearestRabbit(w.w / 2, w.h / 2, exposed);
            if (tgt) { h.prey = tgt.r; h.state = 'circle'; h.lockT = 0; h.alt = 260; h.radius = 165; h.cx = clamp(tgt.r.x, 150, w.w - 150); h.cy = clamp(tgt.r.y, 150, w.h - 150); h.ang = rand(0, TAU); h.x = h.cx + Math.cos(h.ang) * h.radius; h.y = h.cy + Math.sin(h.ang) * h.radius * 0.62; h.px = h.x; }
            else h.timer = 2.5;
          }
          break;
        case 'circle': {
          if (!exposed(h.prey)) { const tgt = this._nearestRabbit(h.cx, h.cy, exposed); if (tgt) h.prey = tgt.r; else { h.state = 'leave'; h.lockT = 0; break; } }
          h.ang += dt * 1.0; h.cx = lerp(h.cx, h.prey.x, 1.4 * dt); h.cy = lerp(h.cy, h.prey.y, 1.4 * dt);
          h.x = h.cx + Math.cos(h.ang) * h.radius; h.y = h.cy + Math.sin(h.ang) * h.radius * 0.62;
          h.alt = lerp(h.alt, 250, 3 * dt); h.lockT += dt; h.spr.setAnim('glide', { fps: 9 });
          if (h.lockT > this.hawkLock) { h.state = 'dive'; h.targetX = h.prey.x; h.targetY = h.prey.y; h.hit = false; Audio.blip(1180, .12, 'sawtooth', .11, 720); }
          break;
        }
        case 'dive': {
          if (exposed(h.prey)) { h.targetX = h.prey.x; h.targetY = h.prey.y; }
          const dx = h.targetX - h.x, dy = h.targetY - h.y, dd = Math.hypot(dx, dy) || 1, step = 560 * dt;
          h.x += dx / dd * Math.min(step, dd); h.y += dy / dd * Math.min(step, dd);
          h.alt = lerp(h.alt, 0, 7 * dt); h.spr.setAnim('dive', { fps: 15 });
          if (!h.hit && exposed(h.prey) && dist(h.x, h.y, h.prey.x, h.prey.y) < this.hawkHitR) { h.hit = true; this._rivalTake(h.prey, h.prey.x, h.prey.y); Audio.pounce(); }
          if (h.alt < 16 || dd < 14) { if (!h.hit && exposed(h.prey)) { h.hit = true; this._rivalTake(h.prey, h.prey.x, h.prey.y); } h.state = 'climb'; }
          break;
        }
        case 'climb':
          h.alt = lerp(h.alt, 270, 3.2 * dt); h.y -= 130 * dt; h.x += (h.cx < w.w / 2 ? 1 : -1) * 70 * dt; h.spr.setAnim('flap', { fps: 14 });
          if (h.alt > 240) { h.state = 'away'; h.timer = this.hawkCD; h.prey = null; }
          break;
        case 'leave':
          h.alt = lerp(h.alt, 285, 2.5 * dt); h.ang += dt * 0.8; h.lockT += dt;
          h.x = h.cx + Math.cos(h.ang) * (h.radius + h.lockT * 140); h.y = h.cy + Math.sin(h.ang) * (h.radius + h.lockT * 140) * 0.62 - h.lockT * 46; h.spr.setAnim('flap', { fps: 12 });
          if (h.lockT > 2.0) { h.state = 'away'; h.timer = this.hawkCD * 0.5; h.prey = null; }
          break;
      }
      h.spr.flipX = h.x < h.px - 0.01; h.px = h.x; h.spr.x = h.x; h.spr.y = h.y - h.alt; h.spr.update(dt);
    }

    /* ---------------- draw ---------------- */
    draw() {
      const ctx = this.ctx, cam = this.cam;
      this.world.draw(ctx, cam);
      this._drawHawkShadow();
      // fox noise ring — visual feedback on how loud you are
      if (this.noise > 0.28) {
        ctx.save(); ctx.globalAlpha = this.sneaking ? .12 : .2;
        ctx.strokeStyle = this.pouncing ? '#ee5a28' : (this.sneaking ? '#7fd0c4' : '#f5b43c');
        ctx.setLineDash([6, 7]); ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(this.p.x - cam.x, this.p.y - cam.y, this.hearBase * this.noise, 0, TAU); ctx.stroke();
        ctx.setLineDash([]); ctx.restore();
      }
      if (this.showCones) {
        for (const r of this.rabbits) if (r.alive && r.sentinel && r.state !== 'flee') drawCone(ctx, cam, r.x, r.y, r.scanAng, 0.52, 250, 'rgba(245,210,90,A)', 0.16);
      }
      const extra = [{ y: this.p.y, fn: () => this._drawFox() }];
      for (const r of this.rabbits) extra.push({ y: r.y, fn: () => this._drawRabbit(r) });
      for (const f of this.predFoxes) extra.push({ y: f.y, fn: () => this._drawRival(f) });
      for (const s of this.snakes) extra.push({ y: s.y, fn: () => this._drawSnake(s) });
      this.renderScene(extra);
      this._drawHawk();
      this._drawLighting();
      this.fx.draw(ctx, cam);
    }

    _drawLighting() {
      const ctx = this.ctx, L = this._lightNow;
      if (L.a > 0.012) { ctx.save(); ctx.fillStyle = `rgba(${L.r | 0},${L.g | 0},${L.b | 0},${L.a.toFixed(3)})`; ctx.fillRect(0, 0, this.W, this.H); ctx.restore(); }
      if (L.vig > 0.02) {
        const px = this.p.x - this.cam.x, py = this.p.y - this.cam.y;
        const inner = lerp(820, 260, clamp(L.vig / 0.36, 0, 1)), outer = inner + 520;
        const g = ctx.createRadialGradient(px, py, inner * 0.42, px, py, outer);
        g.addColorStop(0, 'rgba(10,14,32,0)'); g.addColorStop(1, `rgba(8,12,30,${clamp(L.vig * 1.7, 0, 0.82).toFixed(3)})`);
        ctx.save(); ctx.fillStyle = g; ctx.fillRect(0, 0, this.W, this.H); ctx.restore();
      }
    }

    _drawFox() {
      this.p.draw(this.ctx, this.cam);
      const ctx = this.ctx, sx = this.p.x - this.cam.x;
      if (this.sneaking) {
        ctx.save(); ctx.globalAlpha = .85; ctx.font = '700 12px Nunito'; ctx.textAlign = 'center';
        ctx.fillStyle = this.inCover(this.p.x, this.p.y) ? '#bff0d6' : '#cdeee8'; ctx.strokeStyle = 'rgba(10,30,26,.6)'; ctx.lineWidth = 3;
        const tag = this.inCover(this.p.x, this.p.y) ? 'hidden' : 'sneaking';
        ctx.strokeText(tag, sx, this.p.y - 56 - this.cam.y); ctx.fillText(tag, sx, this.p.y - 56 - this.cam.y); ctx.restore();
      }
      if (this.staminaLock) {
        // sweat droplets flicking off the head — same effect as the rabbit
        const headY = this.p.y - 44 - this.cam.y;
        ctx.save();
        for (let i = 0; i < 3; i++) {
          const ph = (this.time * 1.9 + i * 0.55) % 1;             // 0..1 flick cycle
          const side = i === 0 ? -1 : (i === 2 ? 1 : 0);
          const dx = side * 12 + Math.sin(this.time * 7 + i) * 1.5;
          const dy = -2 + ph * 13 - (side === 0 ? 4 : 0);          // arc off the head
          const a = (1 - ph) * 0.95;
          const r = 3 - ph * 1.1;
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
        ctx.save(); ctx.globalAlpha = .85 * (0.6 + 0.4 * Math.sin(this.time * 8));
        ctx.font = '800 12px Nunito'; ctx.textAlign = 'center'; ctx.fillStyle = '#ffd2bf'; ctx.strokeStyle = 'rgba(40,16,8,.6)'; ctx.lineWidth = 3;
        const ty = this.p.y - 72 - this.cam.y; ctx.strokeText('winded', sx, ty); ctx.fillText('winded', sx, ty); ctx.restore();
      }
    }
    _drawRival(f) {
      const ctx = this.ctx, x = f.x - this.cam.x, y = f.y - this.cam.y;
      // magenta ground ring marks the competing fox
      ctx.save(); ctx.globalAlpha = .5; ctx.strokeStyle = '#d65ad0'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.ellipse(x, y, 20, 9, 0, 0, TAU); ctx.stroke(); ctx.restore();
      f.spr.draw(this.ctx, this.cam);
      ctx.save(); ctx.globalAlpha = .9; ctx.font = '800 11px Nunito'; ctx.textAlign = 'center';
      ctx.fillStyle = '#f3b8ef'; ctx.strokeStyle = 'rgba(40,8,38,.6)'; ctx.lineWidth = 3;
      ctx.strokeText('rival', x, f.y - 60 - this.cam.y); ctx.fillText('rival', x, f.y - 60 - this.cam.y); ctx.restore();
    }
    _drawRabbit(r) {
      r.spr.draw(this.ctx, this.cam);
      const ctx = this.ctx, x = r.x - this.cam.x, y = r.y - 50 - this.cam.y;
      if (r.exclaim > 0) {
        ctx.save(); ctx.globalAlpha = clamp(r.exclaim, 0, 1); ctx.font = '900 24px Baloo 2'; ctx.textAlign = 'center';
        ctx.fillStyle = '#ffd23c'; ctx.strokeStyle = '#7a4a10'; ctx.lineWidth = 4; ctx.strokeText('!', x, y); ctx.fillText('!', x, y); ctx.restore();
      } else if (r.sentinel && r.state !== 'flee') {
        ctx.save(); ctx.globalAlpha = 0.5; ctx.fillStyle = '#ffe9a8'; ctx.beginPath(); ctx.arc(x, y + 8, 2.4, 0, TAU); ctx.fill(); ctx.restore();
      }
    }
    _drawSnake(s) {
      const ctx = this.ctx, cam = this.cam;
      const alpha = s.state === 'strike' ? 1 : clamp(0.16 + s.emerge * 1.0, 0.16, 1);
      ctx.save(); ctx.globalAlpha = alpha; s.spr.draw(ctx, cam); ctx.restore();
    }
    _drawHawkShadow() {
      const h = this.hawk; if (!h || h.state === 'away' || this.phase === 'night') return;
      const ctx = this.ctx, x = h.x - this.cam.x, y = h.y - this.cam.y, k = clamp(1 - h.alt / 260, 0, 1), rx = lerp(36, 16, k);
      ctx.save(); ctx.globalAlpha = lerp(0.10, 0.42, k); ctx.fillStyle = '#0e1707';
      ctx.beginPath(); ctx.ellipse(x, y, rx, rx * 0.5, 0, 0, TAU); ctx.fill(); ctx.restore();
    }
    _drawHawk() { const h = this.hawk; if (!h || h.state === 'away' || this.phase === 'night') return; h.spr.draw(this.ctx, this.cam); }

    _loss(reason) {
      const map = {
        starved: { resultKicker: 'YOU STARVED', resultTitle: 'The hunt outlasted you' },
        time:    { resultKicker: 'NIGHT FELL', resultTitle: 'The warren slipped away' },
      };
      const m = map[reason] || map.time;
      return {
        stars: 0, resultKicker: m.resultKicker, resultTitle: m.resultTitle,
        stats: [
          ['Rabbits caught', this.count + ' / ' + this.goal],
          ['Lost to rivals', String(this.lostToRivals)],
          this.foxHunger ? ['Energy left', Math.round(this.energy) + '%'] : ['Got away', String(this.escaped)],
        ],
      };
    }
    scorePayload() {
      let stars = 0;
      if (this.won) {
        stars = 1;
        if (this.lostToRivals <= 2 && (!this.foxHunger || this.energy > 30)) stars = 2;
        if (this.lostToRivals <= 1 && this.timeLeft > 20 && (!this.foxHunger || this.energy > 45)) stars = 3;
      }
      const stats = [
        ['Rabbits caught', this.count + ' / ' + this.goal],
        ['Lost to rivals', String(this.lostToRivals)],
        ['Got away', String(this.escaped)],
        ['Time left', this._fmt(this.timeLeft)],
      ];
      if (this.foxHunger) stats.push(['Energy left', Math.round(this.energy) + '%']);
      return { stars, resultKicker: 'HUNT COMPLETE', resultTitle: 'A full belly', stats };
    }
    _fmt(s) { s = Math.max(0, s | 0); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }
  }
  G.LevelClasses.Level2 = Level2;
})(window);
