/* ===========================================================================
   Level 3 — EARTHWORM (decomposer · soil restorer)  ·  RESTORATION MODE
   You crawl the forest floor as an earthworm. There is no enemy and no clock —
   the goal is to HEAL the land. Three abilities, one button:

     • MOVE   — WASD / Arrows / d-pad. Crawl the surface.
     • ACT    — hold Space / ⬤. Context-sensitive, single verb:
                  · over DEAD MATTER (logs, leaf litter, remains) → EAT it.
                    The matter decomposes and your NUTRIENT reserve fills.
                  · over a DEAD PATCH of soil → DEPOSIT castings to RESTORE it.
                    Soil greens, grass and flowers regrow; reserve drains.
     • BURROW — tap Shift / Burrow button to dive under (and again to surface).
                Underground you travel faster and pass *under* trees & rocks.

   Restore every dead patch to win. Recycle every scrap of dead matter for 3★.
   =========================================================================== */
(function (global) {
  'use strict';
  const G = global.Game;
  const { clamp, lerp, dist, rand, TAU, Input, Audio } = G;

  class Level3 extends G.LevelBase {
    init(opts) {
      const T = opts.tweaks;
      this.diff = T.difficulty;
      this.speedMul = T.playerSpeed || 1;
      this.world = new G.World(1500, 1040, { palette: 'floor', seed: 333 });
      const w = this.world;
      const spawn = { x: w.w * 0.5, y: w.h * 0.55, r: 150 };

      // ---- CENTRAL RESTORATION TREE — the heart & objective of the level ----
      // A single big tree at the centre. It starts severely wilted (stage 1) and
      // blooms (stage 7) as you heal the land. State-based: each restored patch
      // pushes its target stage up; a stepper walks it there one stage at a time.
      const treeSpot = { x: w.w * 0.5, y: w.h * 0.44, r: 175 };
      this.tree = {
        prop: {
          type: 'worldtree', x: treeSpot.x, y: treeSpot.y, s: 1.8,
          stage: 1, _prevStage: 1, _fade: 1, block: true, br: 30, by: 14,
        },
        stage: 1, target: 1, stepCd: 0,
        heal: 0, full: false,   // ← the tree is now a DIRECT heal target you deposit into
      };
      w.addProp(this.tree.prop);
      this.treeGrass = [];            // level-1 grass clumps grown around the tree
      this._grassSeed = 4100;
      this.avoid = [spawn, treeSpot]; // keep matter/patches/backdrop off the worm & tree

      // ---- living backdrop (some block the surface → burrowing helps) ----
      w.scatter('tree', 8, { spacing: 200, margin: 110, avoid: this.avoid, props: () => ({ block: true, br: 24, by: 8, s: rand(0.95, 1.3) }) });
      w.scatter('rock', 5, { spacing: 150, avoid: this.avoid, props: () => ({ block: true, br: 18, s: rand(0.85, 1.15) }) });
      w.scatter('bush', 7, { spacing: 140, avoid: this.avoid, props: () => ({ s: rand(0.85, 1.1) }) });
      w.scatter('tallgrass', 10, { spacing: 120, avoid: this.avoid, props: () => ({ s: rand(0.9, 1.2) }) });
      w.scatter('flower', 12, { spacing: 60, avoid: this.avoid, props: () => ({ color: G.pick(['#f2d24b', '#e87fb0', '#f0f0f0']), s: rand(0.8, 1.1) }) });

      // ---- dead matter (EAT these → make nutrients) ----
      this.matter = []; this.patches = [];
      const matterCount = [7, 9, 11][this.diff];
      const kinds = ['carcass', 'log', 'leaflitter'];
      for (let i = 0; i < matterCount; i++) {
        const p = this._placeProp(kinds[i % kinds.length], spawn, 120, 96);
        if (!p) continue;
        Object.assign(p, { decomp: 0, decomposed: false });
        // logs get a fixed, weighted-random decomposition state at spawn
        // (dirt is excluded — it's only ever the eaten end-state)
        if (p.type === 'log' && G.LogDecomp) p._logSprite = G.LogDecomp.pickLog();
        w.addProp(p); this.matter.push(p);
      }

      // ---- dead patches (RESTORE these → win) ----
      const patchCount = [5, 6, 7][this.diff];
      for (let i = 0; i < patchCount; i++) {
        const p = this._placeProp('deadpatch', spawn, 170, 150);
        if (!p) continue;
        Object.assign(p, { heal: 0, restored: false, s: rand(1.0, 1.35) });
        w.addProp(p); this.patches.push(p);
      }
      this.goal = this.patches.length; // restore them all

      // ---- player worm ----
      this.p = new G.Sprite('worm', { x: spawn.x, y: spawn.y, scale: 0.5, fps: 11, anchorY: 0.94, anim: 'idle' });
      this.face = 1;            // 1 = facing right
      this.mode = 'surface';    // surface | diving | under | emerging
      this.acting = null;       // 'eat' | 'heal' | null
      this.reserve = 0;         // nutrient reserve 0..100
      this.restored = 0; this.recycled = 0;
      this.tip = 0;             // tutorial nudge stage
      this.dust = [];           // underground mound trail

      // tuning
      this.eatFull = [2.0, 2.6, 3.2][this.diff];   // seconds to fully decompose one matter
      this.healFull = [2.6, 3.2, 3.8][this.diff];  // seconds to fully restore one patch
      this.GAIN = 52 / this.eatFull;               // reserve gained per second while eating
      this.COST = 46 / this.healFull;              // reserve spent per second while healing
      this.INTERACT = 52;                          // must be this close to act
      this.NEAR = 104;                             // prompt shows within this range
      this.treeHealFull = [10, 13, 16][this.diff]; // total seconds of deposits to fully revive the tree (~50% more than the base tuning)
      this.TREEREACH = 94;                         // wider reach — the trunk blocks a close approach

      // ---- ambient food chain: a fox stalks wandering rabbits. Every kill drops
      //      a carcass the worm can DECOMPOSE for nutrients; the bones then fade
      //      away after 20s. fox hunts → carcass → worm decomposes → remains fade.
      this.carcasses = [];                         // fox-kill carcasses + the bones they leave
      this.bunnies = [];
      this.fox = {
        spr: new G.Sprite('fox', { x: w.w * 0.28, y: w.h * 0.72, scale: 0.85, fps: 9, anchorY: 0.86 }),
        x: w.w * 0.28, y: w.h * 0.72, face: 1, state: 'roam', target: null, wp: null, cd: 2.5, t: 0,
      };
      this.fox.wp = this._critterWander(this.fox.x, this.fox.y);
      for (let i = 0; i < 4; i++) this._spawnBunny();

      this.cam.x = clamp(spawn.x - this.W / 2, 0, w.w - this.W);
      this.cam.y = clamp(spawn.y - this.H / 2, 0, w.h - this.H);

      this.hud.config({
        role: 'EARTHWORM', accent: '#C9822E', goal: this.meta.hudGoal,
        showTimer: false, showPhase: false, showThirst: false, showStamina: false,
        showEnergy: true, energyLabel: 'Nutrients', countMax: this.goal, aim: false,
      });
      this.hud.hint('Heal the dead patches AND the great tree at the centre · HOLD Space at the trunk to feed it · Shift to burrow');
      this.hud.banner('Revive the great tree', '#C9822E', 1.6);
    }

    // place a prop avoiding spawn, blockers and previously-placed targets
    _placeProp(type, spawn, spawnGap, selfGap) {
      const w = this.world; let x, y, ok, t = 0;
      do {
        x = rand(150, w.w - 150); y = rand(150, w.h - 150); ok = true;
        if (dist(x, y, spawn.x, spawn.y) < spawnGap) ok = false;
        if (ok && this.avoid) for (const a of this.avoid) if (dist(x, y, a.x, a.y) < (a.r || 120)) { ok = false; break; }
        if (ok) for (const b of w.blockers) if (dist(x, y, b.x, b.y) < 70) { ok = false; break; }
        if (ok) for (const q of this.matter) if (dist(x, y, q.x, q.y) < selfGap) { ok = false; break; }
        if (ok) for (const q of this.patches) if (dist(x, y, q.x, q.y) < selfGap) { ok = false; break; }
      } while (!ok && ++t < 80);
      return ok ? { type, x, y, s: rand(0.95, 1.2) } : null;
    }

    /* ----------------------------- update ----------------------------- */
    update(dt) {
      if (this.over) { this.p.update(dt); return; }
      this.time += dt;

      this._burrowInput();
      const transitioning = this.mode === 'diving' || this.mode === 'emerging';

      // ---- context action (hold) ----
      const actHeld = Input.down('space') || this.hud.actionDown;
      this.acting = null; this.curTarget = null;
      if (actHeld && this.mode === 'surface') this._tryAct(dt);

      // ---- movement (unless locked into an action or mid-transition) ----
      const moving = this._move(dt, !!this.acting || transitioning);

      // ---- animation state machine ----
      if (this.mode === 'surface') {
        if (this.acting === 'eat') this._loopAnim('eat', 11);
        else if (this.acting === 'heal') this._loopAnim('deposit', 10);
        else this._loopAnim(moving ? 'crawl' : 'idle', moving ? 13 : 7);
      } else if (this.mode === 'under') {
        this._loopAnim(moving ? 'crawl' : 'idle', moving ? 14 : 6);
        if (moving && Math.random() < dt * 14) this.dust.push({ x: this.p.x, y: this.p.y + 4, a: 1 });
      }
      this.p.update(dt);

      // underground mound trail fade
      for (let i = this.dust.length - 1; i >= 0; i--) { this.dust[i].a -= dt * 1.6; if (this.dust[i].a <= 0) this.dust.splice(i, 1); }

      // ---- tutorial nudges ----
      this._coach();

      // ---- central tree: advance one stage at a time toward its target ----
      this._updateTree(dt);

      // ---- ambient food chain (fox hunts rabbits → carcasses → bones fade) ----
      this._critters(dt);

      this.hud.set({ energy: this.reserve, count: this.restored });
      this.cam.follow(this.p.x, this.p.y, this.world.w, this.world.h, 0.09);

      // WIN — every dead patch restored AND the great tree in full bloom (stage 7).
      if (this.restored >= this.goal && this.tree.stage >= G.TreeArt.STAGES) return this.finish(true);
    }

    /* --------------------------- central tree --------------------------- */
    _updateTree(dt) {
      const tr = this.tree, prop = tr.prop;
      // ease the crossfade between the previous and current stage sprite
      if ((prop._fade || 0) < 1) prop._fade = clamp((prop._fade || 0) + dt * 2.4, 0, 1);
      // walk the displayed stage up to the target — one stage at a time, never skipping
      tr.stepCd -= dt;
      if (tr.stage < tr.target && tr.stepCd <= 0) { this._advanceTreeStage(); tr.stepCd = 0.55; }
      // grow-in animation for the grass around the base
      for (const g of this.treeGrass) if (g.grow < 1) g.grow = clamp(g.grow + dt * 2, 0, 1);
    }

    _advanceTreeStage() {
      const tr = this.tree, prop = tr.prop;
      tr.stage++;
      prop._prevStage = prop.stage; prop.stage = tr.stage; prop._fade = 0; // start crossfade
      const bloom = tr.stage >= G.TreeArt.STAGES;
      const col = bloom ? '#f3a8d0' : '#9ed46a';
      this.fx.ring(prop.x, prop.y - 64, col, 14, 130, 0.9);
      this.fx.burst(prop.x, prop.y - 74, bloom ? '#f7bcd9' : '#bfe87a', bloom ? 28 : 16, { up: 44, spd: 84, life: 1.0, size: 4 });
      this.hud.banner(bloom ? 'The great tree is in full bloom!' : 'The tree grows stronger…', col, 1.0);
      if (bloom) Audio.win(); else Audio.blip(440 + tr.stage * 36, 0.12, 'triangle', 0.1);
      // grow level-1 grass around the base — denser and wider each stage
      this._growGrass(tr.stage);
    }

    // scatter small level-1 grass clumps below + around the tree base
    _growGrass(stage) {
      const GA = G.GrassArt; if (!GA) return;
      const base = this.tree.prop;
      const add = 3 + stage;            // 4,5,6,… clumps per advance
      const rMax = 46 + stage * 26;     // spread widens as the tree heals
      for (let i = 0; i < add && this.treeGrass.length < 72; i++) {
        const ang = rand(0, TAU);
        const rr = 26 + Math.random() * rMax;
        // flattened ellipse centred just below the trunk → reads as "under the tree"
        const gx = base.x + Math.cos(ang) * rr;
        const gy = base.y + 16 + Math.sin(ang) * rr * 0.46;
        this.treeGrass.push({ x: gx, y: gy, s: rand(0.22, 0.4), clump: GA.makeTallClump(this._grassSeed++), grow: 0 });
      }
    }

    _drawGrassTuft(g) {
      const sc = g.s * (0.4 + 0.6 * g.grow); // springs up as it grows in
      G.GrassArt.drawTall(this.ctx, g.clump, g.x - this.cam.x, g.y - this.cam.y, this.time, sc);
    }

    _loopAnim(name, fps) { if (this.p.anim !== name) this.p.setAnim(name, { fps }); else this.p.fps = fps; }

    _burrowInput() {
      const toggle = Input.pressed('shift') || this.hud.burrowPressed;
      if (!toggle) return;
      if (this.mode === 'surface') {
        this.mode = 'diving'; this.acting = null;
        this.p.setAnim('burrow', { fps: 14, loop: false, onEnd: () => { if (this.mode === 'diving') this.mode = 'under'; } });
        Audio.blip(180, 0.16, 'sine', 0.12, 90); this.fx.burst(this.p.x, this.p.y + 6, '#7a5e3e', 9, { up: 14, spd: 55, size: 4 });
      } else if (this.mode === 'under') {
        this.mode = 'emerging';
        this.p.setAnim('surface', { fps: 13, loop: false, onEnd: () => { if (this.mode === 'emerging') this.mode = 'surface'; } });
        Audio.blip(260, 0.16, 'sine', 0.12, 520); this.fx.burst(this.p.x, this.p.y + 6, '#7a5e3e', 11, { up: 26, spd: 70, size: 4 });
      }
    }

    _move(dt, locked) {
      let ax = Input.axis();
      if (this.hud.touchDir) ax = this.hud.touchDir;
      const mag = Math.hypot(ax.x, ax.y);
      if (locked || mag < 0.01) return false;
      const under = this.mode === 'under';
      const sp = (under ? 232 : 150) * this.speedMul;
      let nx = this.p.x + ax.x * sp * dt, ny = this.p.y + ax.y * sp * dt;
      const r = 18;
      if (under) { // ignore blockers, just stay in bounds
        const m = (this.world.border || 0) + r;
        nx = clamp(nx, m, this.world.w - m); ny = clamp(ny, m, this.world.h - m);
      } else {
        const c = this.collide(nx, ny, r); nx = c.x; ny = c.y;
      }
      this.p.x = nx; this.p.y = ny; this.p.y = this.p.y; // keep
      if (Math.abs(ax.x) > 0.08) { this.face = ax.x < 0 ? -1 : 1; this.p.flipX = this.face < 0; }
      return true;
    }

    _tryAct(dt) {
      // nearest dead matter and nearest dead patch within interaction range
      let m = null, md = this.INTERACT; for (const q of this.matter) if (!q.decomposed) { const d = dist(q.x, q.y, this.p.x, this.p.y); if (d < md) { md = d; m = q; } }
      let pt = null, pd = this.INTERACT; for (const q of this.patches) if (!q.restored) { const d = dist(q.x, q.y, this.p.x, this.p.y); if (d < pd) { pd = d; pt = q; } }
      // fox-kill carcasses are eatable matter too (bonus — not part of the goal)
      let carc = null, ccd = this.INTERACT; for (const q of this.carcasses) if (!q.skel) { const d = dist(q.x, q.y, this.p.x, this.p.y); if (d < ccd) { ccd = d; carc = q; } }
      // the GREAT TREE is a direct heal target too — wider reach since the trunk blocks a close approach
      const tr = this.tree;
      const treeD = tr.full ? Infinity : dist(tr.prop.x, tr.prop.y, this.p.x, this.p.y);

      // choose whichever actionable thing is closest
      let kind = null, best = Infinity;
      if (m && md < best) { best = md; kind = 'eat'; }
      if (carc && ccd < best) { best = ccd; kind = 'carcass'; }
      if (pt && pd < best) { best = pd; kind = 'patch'; }
      if (treeD < this.TREEREACH && treeD < best) { best = treeD; kind = 'tree'; }
      if (!kind) return; // nothing in range — let movement run

      if (kind === 'eat') {
        this.acting = 'eat'; this.curTarget = m;
        m.decomp = clamp(m.decomp + dt / this.eatFull, 0, 1);
        this.reserve = clamp(this.reserve + this.GAIN * dt, 0, 100);
        if (Math.random() < dt * 6) this.fx.burst(m.x, m.y - 4, '#b89a5a', 1, { up: 18, spd: 26, life: .6, size: 3 });
        if (Math.random() < dt * 2.2) Audio.eat();
        if (m.decomp >= 1) this._recycle(m);
        return;
      }

      if (kind === 'carcass') {
        // worm decomposes the fox's kill → climbs the decay strip toward bone
        this.acting = 'eat'; this.curTarget = carc;
        carc.decomp = clamp(carc.decomp + dt / this.eatFull, 0, 1);
        this.reserve = clamp(this.reserve + this.GAIN * dt, 0, 100);
        if (Math.random() < dt * 6) this.fx.burst(carc.x, carc.y - 4, '#b89a5a', 1, { up: 18, spd: 26, life: .6, size: 3 });
        if (Math.random() < dt * 2.2) Audio.eat();
        if (carc.decomp >= 1) this._boneify(carc);
        return;
      }

      // both patch and tree are "heal" actions — they spend the nutrient reserve
      if (this.reserve <= 0.5) { this.acting = null; this.hud.flashLabel('Out of nutrients — eat some dead matter first!'); Audio.blip(220, 0.1, 'sine', 0.08); return; }
      this.acting = 'heal';

      if (kind === 'patch') {
        const target = pt; this.curTarget = target;
        const give = Math.min(this.COST * dt, this.reserve);
        target.heal = clamp(target.heal + (give / this.COST) / this.healFull, 0, 1);
        this.reserve = clamp(this.reserve - give, 0, 100);
        if (Math.random() < dt * 7) this.fx.burst(target.x + rand(-16, 16), target.y + rand(-8, 8), G.pick(['#7a5e3e', '#9ed46a']), 1, { up: 12, spd: 22, life: .7, size: 3 });
        if (Math.random() < dt * 2.4) Audio.blip(rand(420, 520), 0.06, 'triangle', 0.07);
        if (target.heal >= 1) this._restore(target);
      } else {
        // ---- feed the great tree directly ----
        const prop = tr.prop; this.curTarget = prop;
        const give = Math.min(this.COST * dt, this.reserve);
        tr.heal = clamp(tr.heal + (give / this.COST) / this.treeHealFull, 0, 1);
        this.reserve = clamp(this.reserve - give, 0, 100);
        // each deposit nudges the tree's target stage up; the stepper walks it there
        tr.target = clamp(1 + Math.round(tr.heal * (G.TreeArt.STAGES - 1)), 1, G.TreeArt.STAGES);
        // castings sink in at the roots, vitality rises up the trunk
        if (Math.random() < dt * 8) this.fx.burst(prop.x + rand(-22, 22), prop.y + rand(-4, 8), G.pick(['#7a5e3e', '#9ed46a', '#cdb06a']), 1, { up: 16, spd: 26, life: .7, size: 3 });
        if (Math.random() < dt * 5) this.fx.burst(prop.x + rand(-12, 12), prop.y - rand(20, 70), tr.heal > 0.8 ? '#f7bcd9' : '#bfe87a', 1, { up: 30, spd: 18, life: 1.0, size: 3 });
        if (Math.random() < dt * 2.4) Audio.blip(rand(360, 470), 0.06, 'triangle', 0.07);
        if (tr.heal >= 1 && !tr.full) { tr.full = true; tr.target = G.TreeArt.STAGES; }
      }
    }

    _recycle(t) {
      t.decomposed = true; t.decomp = 1; this.recycled++;
      // a fully-eaten LOG leaves behind a random final dirt patch (same world
      // position / collision); other matter just reads as "decomposed".
      if (t.type === 'log' && G.LogDecomp) t._dirtSprite = G.LogDecomp.pickDirt();
      this.fx.text(t.x, t.y - 26, '+ nutrients', '#f0be48', { size: 17 });
      this.fx.ring(t.x, t.y, '#cdb06a', 8, 64, .6); this.fx.burst(t.x, t.y, '#cdb06a', 14, { up: 24, spd: 60 });
      this.reserve = clamp(this.reserve + 10, 0, 100);
      Audio.pickup();
    }
    _restore(t) {
      t.restored = true; t.heal = 1; this.restored++;
      this.fx.text(t.x, t.y - 30, 'Restored!', '#aee05a', { size: 20 });
      this.fx.ring(t.x, t.y, '#9ed46a', 10, 90, .8); this.fx.ring(t.x, t.y, '#d6f0a0', 6, 60, .6);
      this.fx.burst(t.x, t.y, '#9ed46a', 20, { up: 34, spd: 78 });
      Audio.win(); this.hud.banner(this.restored + ' / ' + this.goal + ' patches healed', '#aee05a', 1.0);
    }

    _coach() {
      // gentle, one-time hints that adapt to what the player is doing
      if (this.tip === 0 && this.recycled >= 1) { this.tip = 1; this.hud.hint('Nice! Now crawl onto a dull DEAD PATCH — or up to the great tree — and hold Space to heal it.'); }
      else if (this.tip === 1 && (this.restored >= 1 || this.tree.stage > 1)) { this.tip = 2; this.hud.hint('Feed the great tree at its trunk and heal every dead patch to bring the forest to full bloom.'); }
    }

    /* --------------------- ambient food chain --------------------- */
    // A fox roams and hunts the wandering rabbits. Each kill drops a carcass the
    // worm can decompose; once decomposed the bones fade and clear after 20s.
    _critters(dt) {
      this._fox(dt);
      for (const b of this.bunnies) this._bunny(b, dt);
      // skeleton remains fade out gradually and clear after 20s
      for (let i = this.carcasses.length - 1; i >= 0; i--) {
        const c = this.carcasses[i];
        if (!c.skel) continue;
        c.skelT += dt;
        c.alpha = c.skelT < 12 ? 1 : clamp(1 - (c.skelT - 12) / 8, 0, 1);
        if (c.skelT >= 20) this.carcasses.splice(i, 1);
      }
    }

    _critterWander(x, y) {
      const w = this.world;
      for (let i = 0; i < 12; i++) {
        const tx = clamp(x + rand(-300, 300), 100, w.w - 100), ty = clamp(y + rand(-300, 300), 100, w.h - 100);
        let ok = true; for (const b of w.blockers) if (dist(tx, ty, b.x, b.y) < b.r + 40) { ok = false; break; }
        if (ok) return { x: tx, y: ty };
      }
      return { x: clamp(x + rand(-200, 200), 100, w.w - 100), y: clamp(y + rand(-200, 200), 100, w.h - 100) };
    }
    _spawnBunny() {
      const w = this.world; let x, y, ok, t = 0;
      do {
        x = rand(120, w.w - 120); y = rand(120, w.h - 120); ok = true;
        for (const b of w.blockers) if (dist(x, y, b.x, b.y) < 60) { ok = false; break; }
        if (ok && this.p && dist(x, y, this.p.x, this.p.y) < 170) ok = false;
        if (ok && this.fox && dist(x, y, this.fox.x, this.fox.y) < 260) ok = false;
      } while (!ok && ++t < 40);
      this.bunnies.push({ spr: new G.Sprite('rabbit', { x, y, scale: 0.6, fps: 11 }), x, y, face: rand(0, TAU), state: 'graze', t: rand(0, 2), wp: { x, y }, jit: rand(0, TAU) });
    }
    _bunnyWander(b) { const w = this.world; b.wp = { x: clamp(b.x + rand(-200, 200), 90, w.w - 90), y: clamp(b.y + rand(-200, 200), 90, w.h - 90) }; }

    _fox(dt) {
      const f = this.fox; f.t += dt; if (f.cd > 0) f.cd -= dt;
      // acquire / refresh prey
      if ((!f.target || !this.bunnies.includes(f.target)) && f.cd <= 0) {
        let best = null, bd = 1e9; for (const b of this.bunnies) { const d = dist(f.x, f.y, b.x, b.y); if (d < bd) { bd = d; best = b; } }
        if (best && bd < 580) { f.target = best; f.state = 'hunt'; } else { f.target = null; f.state = 'roam'; }
      }
      let tx, ty, speed, anim, fps;
      if (f.target && this.bunnies.includes(f.target)) {
        const d = dist(f.x, f.y, f.target.x, f.target.y); tx = f.target.x; ty = f.target.y;
        if (d < 175) { speed = 248; anim = 'sprint'; fps = 14; } else { speed = 140; anim = 'walk'; fps = 11; }
        if (d < 26) { this._foxCatch(f.target); f.target = null; f.cd = rand(4.5, 7.5); f.state = 'roam'; f.wp = this._critterWander(f.x, f.y); }
      } else {
        if (!f.wp || dist(f.x, f.y, f.wp.x, f.wp.y) < 28) f.wp = this._critterWander(f.x, f.y);
        tx = f.wp.x; ty = f.wp.y; speed = 92; anim = 'walk'; fps = 9;
      }
      const a = Math.atan2(ty - f.y, tx - f.x);
      let moved = false;
      for (const off of [0, 0.5, -0.5, 1.0, -1.0, 1.7]) { const ma = a + off; const c = this.collide(f.x + Math.cos(ma) * speed * dt, f.y + Math.sin(ma) * speed * dt, 18); if (dist(c.x, c.y, f.x, f.y) > speed * dt * 0.5) { f.x = c.x; f.y = c.y; moved = true; break; } }
      if (!moved) { f.wp = this._critterWander(f.x, f.y); f.target = null; f.cd = 0.6; }
      if (Math.abs(Math.cos(a)) > 0.05) f.face = Math.cos(a) < 0 ? -1 : 1;
      f.spr.x = f.x; f.spr.y = f.y; f.spr.flipX = f.face < 0; f.spr.setAnim(anim, { fps }); f.spr.update(dt);
    }
    _bunny(b, dt) {
      b.t += dt; const d = dist(b.x, b.y, this.fox.x, this.fox.y);
      let speed = 0, anim = 'idle', fps = 7;
      if (d < 200) {                       // flee straight away from the fox, with a little juke
        const a = Math.atan2(b.y - this.fox.y, b.x - this.fox.x) + Math.sin(this.time * 8 + b.jit) * 0.22;
        speed = 206; anim = 'sprint'; fps = 16; b.face = a; b.state = 'flee';
        const c = this.collide(b.x + Math.cos(a) * speed * dt, b.y + Math.sin(a) * speed * dt, 12); b.x = c.x; b.y = c.y;
      } else if (b.state === 'flee') { b.state = 'graze'; b.t = 0; this._bunnyWander(b); }
      else if (b.state === 'graze') {
        anim = (Math.floor(b.t * 1.2) % 4 === 0) ? 'eat' : 'idle'; fps = 7; speed = 0;
        if (b.t > rand(1.6, 3.4)) { b.state = 'wander'; b.t = 0; this._bunnyWander(b); }
      } else {                             // wander
        const a = Math.atan2(b.wp.y - b.y, b.wp.x - b.x); speed = 76; anim = 'hop'; fps = 11; b.face = a;
        const c = this.collide(b.x + Math.cos(a) * speed * dt, b.y + Math.sin(a) * speed * dt, 12); b.x = c.x; b.y = c.y;
        if (dist(b.x, b.y, b.wp.x, b.wp.y) < 24 || b.t > 4) { b.state = 'graze'; b.t = 0; }
      }
      b.spr.x = b.x; b.spr.y = b.y; b.spr.flipX = Math.cos(b.face) < 0; b.spr.setAnim(anim, { fps }); b.spr.update(dt);
    }
    _foxCatch(b) {
      this.bunnies = this.bunnies.filter((x) => x !== b);
      this.fx.burst(b.x, b.y, '#d8c0a0', 14, { spd: 90 }); this.fx.ring(b.x, b.y, '#fff', 7, 52, .5);
      Audio.pounce();
      this._spawnCarcass(b.x, b.y);
      // keep the warren alive — a new rabbit wanders in after a while
      setTimeout(() => { if (!this.over) this._spawnBunny(); }, 4500);
    }
    // a fresh carcass the worm can decompose (see _tryAct 'carcass' branch)
    _spawnCarcass(x, y) {
      this.carcasses.push({ x, y, scale: rand(0.24, 0.3), decomp: 0, skel: false, skelT: 0, alpha: 1, flip: Math.random() < 0.5 });
      this.fx.burst(x, y, '#7d6a55', 8, { up: 14, spd: 40, life: .6, size: 3 });
    }
    // worm finished decomposing it → leaves bones (which fade in _critters)
    _boneify(c) {
      c.skel = true; c.decomp = 1; c.skelT = 0;
      // bonus matter — not counted toward the required recycling goal
      this.fx.text(c.x, c.y - 26, '+ nutrients', '#f0be48', { size: 16 });
      this.fx.ring(c.x, c.y, '#cdb06a', 8, 60, .6); this.fx.burst(c.x, c.y, '#cdb06a', 12, { up: 22, spd: 56 });
      this.reserve = clamp(this.reserve + 8, 0, 100);
      Audio.pickup();
    }
    _drawCarcass(c) {
      const data = G.Assets.get('deadbunny', 'decay');
      const ctx = this.ctx, x = c.x - this.cam.x, y = c.y - this.cam.y;
      const N = (data && data.n) || 5;
      // decompose climbs frames 0..N-2 (fresh→rotted); skeleton stage shows the final bone frame
      const frame = c.skel ? N - 1 : clamp(Math.floor(c.decomp * (N - 1)), 0, N - 2);
      const sc = c.scale, w = (data ? data.cw : 248) * sc, h = (data ? data.ch : 171) * sc;
      ctx.save();
      ctx.globalAlpha = c.alpha * 0.26; ctx.fillStyle = '#241c12';
      ctx.beginPath(); ctx.ellipse(x, y, w * 0.34, h * 0.15, 0, 0, TAU); ctx.fill();
      ctx.globalAlpha = c.alpha;
      if (data && data.img && data.img.complete && data.img.naturalWidth) {
        ctx.translate(x, y - h * 0.8);
        if (c.flip) ctx.scale(-1, 1);
        ctx.drawImage(data.img, frame * data.cw, 0, data.cw, data.ch, -w / 2, 0, w, h);
      } else {
        ctx.fillStyle = '#b3a988'; ctx.beginPath(); ctx.ellipse(x, y - 6, 14, 8, 0, 0, TAU); ctx.fill();
      }
      ctx.restore();
    }

    /* ------------------------------ draw ------------------------------ */
    draw() {
      const ctx = this.ctx, cam = this.cam;
      this.world.draw(ctx, cam);

      // soft markers + progress on targets (under the sprites)
      for (const t of this.matter) if (!t.decomposed) this._marker(t, '#e9c668', t.decomp);
      for (const t of this.carcasses) if (!t.skel) this._marker(t, '#e9c668', t.decomp);
      for (const t of this.patches) if (!t.restored) this._marker(t, '#8fcf66', t.heal);
      if (!this.tree.full) this._treeMarker();

      // depth-sorted props + worm + grass grown around the tree + ambient critters
      const extra = [{ y: this.p.y, fn: () => this._drawWorm(ctx, cam) }];
      for (const g of this.treeGrass) extra.push({ y: g.y, fn: () => this._drawGrassTuft(g) });
      for (const c of this.carcasses) extra.push({ y: c.y, fn: () => this._drawCarcass(c) });
      for (const b of this.bunnies) extra.push({ y: b.y, fn: () => b.spr.draw(ctx, cam) });
      extra.push({ y: this.fox.y, fn: () => this.fox.spr.draw(ctx, cam) });
      this.renderScene(extra);

      this.fx.draw(ctx, cam);
      this._drawPrompt();
    }

    _drawWorm(ctx, cam) {
      if (this.mode === 'under') {
        // underground: dust mound trail + dimmed crawl worm to read as "below"
        for (const d of this.dust) { ctx.globalAlpha = d.a * 0.5; ctx.fillStyle = '#6f5436'; ctx.beginPath(); ctx.ellipse(d.x - cam.x, d.y - cam.y, 16, 8, 0, 0, TAU); ctx.fill(); }
        ctx.globalAlpha = 1;
        // soil mound the worm pushes
        ctx.fillStyle = 'rgba(111,84,54,0.55)'; ctx.beginPath(); ctx.ellipse(this.p.x - cam.x, this.p.y - cam.y + 2, 30, 15, 0, 0, TAU); ctx.fill();
        ctx.globalAlpha = 0.55; this.p.draw(ctx, cam); ctx.globalAlpha = 1;
        // a thin dirt veil over the worm
        ctx.fillStyle = 'rgba(95,72,46,0.30)'; ctx.beginPath(); ctx.ellipse(this.p.x - cam.x, this.p.y - cam.y - 4, 34, 18, 0, 0, TAU); ctx.fill();
      } else {
        this.p.draw(ctx, cam);
      }
    }

    // pulsing locator ring + thin progress arc on a target
    _marker(t, color, prog) {
      const ctx = this.ctx, x = t.x - this.cam.x, y = t.y - this.cam.y;
      const pulse = 0.5 + 0.5 * Math.sin(this.time * 2.4 + (t.x + t.y) * 0.01);
      ctx.save();
      ctx.globalAlpha = 0.28 + 0.22 * pulse; ctx.strokeStyle = color; ctx.lineWidth = 2.4;
      ctx.beginPath(); ctx.arc(x, y - 4, 30 + pulse * 3, 0, TAU); ctx.stroke();
      ctx.restore();
      if (prog > 0.01) {
        ctx.save(); ctx.translate(x, y - 34);
        ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(0,0,0,.22)'; ctx.beginPath(); ctx.arc(0, 0, 13, 0, TAU); ctx.stroke();
        ctx.strokeStyle = color; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(0, 0, 13, -Math.PI / 2, -Math.PI / 2 + TAU * prog); ctx.stroke();
        ctx.restore();
      }
    }

    // glowing ring at the roots of the great tree + a progress ring that fills
    // as you feed it. Reads as "pour castings into the roots."
    _treeMarker() {
      const ctx = this.ctx, tr = this.tree, prop = tr.prop;
      const x = prop.x - this.cam.x, y = prop.y - this.cam.y;
      const pulse = 0.5 + 0.5 * Math.sin(this.time * 2.4);
      const col = tr.heal > 0.8 ? '#f3a8d0' : '#9ed46a';
      ctx.save();
      ctx.globalAlpha = 0.24 + 0.2 * pulse; ctx.strokeStyle = col; ctx.lineWidth = 2.6;
      ctx.beginPath(); ctx.ellipse(x, y - 2, 50 + pulse * 4, 23 + pulse * 2, 0, 0, TAU); ctx.stroke();
      ctx.globalAlpha = 0.9; ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(0,0,0,.22)';
      ctx.beginPath(); ctx.ellipse(x, y - 2, 42, 18, 0, 0, TAU); ctx.stroke();
      ctx.strokeStyle = col; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.ellipse(x, y - 2, 42, 18, 0, -Math.PI / 2, -Math.PI / 2 + TAU * clamp(tr.heal, 0, 1)); ctx.stroke();
      ctx.restore();
    }

    // "Hold SPACE" prompt floating above whatever the worm can act on
    _drawPrompt() {
      if (this.mode !== 'surface') return;
      let best = null, bd = this.NEAR, kind = '', yOff = 52;
      for (const q of this.matter) if (!q.decomposed) { const d = dist(q.x, q.y, this.p.x, this.p.y); if (d < bd) { bd = d; best = q; kind = 'EAT'; yOff = 52; } }
      for (const q of this.carcasses) if (!q.skel) { const d = dist(q.x, q.y, this.p.x, this.p.y); if (d < bd) { bd = d; best = q; kind = 'EAT'; yOff = 52; } }
      for (const q of this.patches) if (!q.restored) { const d = dist(q.x, q.y, this.p.x, this.p.y); if (d < bd) { bd = d; best = q; kind = (this.reserve > 0.5 ? 'HEAL' : 'NEED FOOD'); yOff = 52; } }
      // the great tree — wider reach, prompt floats up on the trunk
      const tr = this.tree;
      if (!tr.full) { const d = dist(tr.prop.x, tr.prop.y, this.p.x, this.p.y); if (d < this.TREEREACH + 30 && d < bd) { bd = d; best = tr.prop; kind = (this.reserve > 0.5 ? 'FEED' : 'NEED FOOD'); yOff = 150; } }
      if (!best) return;
      const ctx = this.ctx, x = best.x - this.cam.x, y = best.y - this.cam.y - yOff;
      const isTree = best === tr.prop;
      const inRange = bd < (isTree ? this.TREEREACH : this.INTERACT);
      const label = kind === 'NEED FOOD' ? 'Eat matter first'
        : kind === 'FEED' ? 'Hold SPACE to feed the tree'
        : 'Hold SPACE to ' + (kind === 'EAT' ? 'eat' : 'heal');
      const fill = kind === 'NEED FOOD' ? 'rgba(120,70,40,0.92)' : (kind === 'EAT' ? 'rgba(150,112,40,0.94)' : 'rgba(70,128,52,0.94)');
      ctx.save();
      ctx.font = '800 13px Nunito, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const wpx = ctx.measureText(label).width + 22;
      ctx.globalAlpha = inRange ? 0.96 : 0.62;
      ctx.fillStyle = fill;
      this._roundRect(ctx, x - wpx / 2, y - 12, wpx, 24, 12); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.fillText(label, x, y + 1);
      // little pointer
      ctx.beginPath(); ctx.moveTo(x - 6, y + 12); ctx.lineTo(x + 6, y + 12); ctx.lineTo(x, y + 19); ctx.closePath();
      ctx.fillStyle = fill; ctx.fill();
      ctx.restore();
    }
    _roundRect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }

    /* ----------------------------- scoring ----------------------------- */
    scorePayload() {
      let stars = 0;
      if (this.won) {
        stars = 1;
        if (this.recycled >= Math.ceil(this.matter.length * 0.6)) stars = 2;
        if (this.recycled >= this.matter.length) stars = 3;
      }
      return {
        stars,
        resultKicker: this.won ? 'FOREST RESTORED' : '',
        resultTitle: this.won ? 'The forest is alive again!' : '',
        stats: [
          ['Patches restored', this.restored + ' / ' + this.goal],
          ['Dead matter recycled', this.recycled + ' / ' + this.matter.length],
        ],
      };
    }
  }
  G.LevelClasses.Level3 = Level3;
})(window);
