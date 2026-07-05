/* ===========================================================================
   Level 2 — Shake Safe (survive before / during / after)
   Top-down house + yard. Phase 1: prepare (7 tasks, timed). Phase 2: the
   quake — Duck·Cover·Hold under the sturdy table while unprepared hazards
   come back to bite. Phase 3: injuries, gas, go-bag, evacuation, aftershock.
   =========================================================================== */
(function (global) {
  'use strict';
  const G = global.Game;
  const { clamp, lerp, dist, rand, TAU } = G;

  const WORLD_W = 1180, WORLD_H = 740;
  const PREP_TIME = 100, QUAKE_TIME = 22, AFTERSHOCK_TIME = 6;
  const HOUSE = { x0: 60, y0: 60, x1: 660, y1: 520 };
  const FLAG = { x: 900, y: 430 };
  const POLE = { x: 730, y: 320 };

  const PREP_TASKS = [
    { id: 'shelf', label: 'Strap the bookshelf to the wall' },
    { id: 'tv', label: 'Secure the TV' },
    { id: 'stove', label: 'Turn off the gas stove' },
    { id: 'bag', label: 'Pack the go-bag (4 items)' },
    { id: 'table', label: 'Find your safe spot (sturdy table)' },
    { id: 'exit', label: 'Know your exit (front door)' },
    { id: 'plan', label: 'Set the family meeting place' },
  ];
  const AFTER_TASKS = [
    { id: 'sister', label: 'Check your sister for injuries' },
    { id: 'gas', label: 'Make sure the gas is off' },
    { id: 'grab', label: 'Take the go-bag' },
    { id: 'evac', label: 'Evacuate to the meeting place' },
    { id: 'ashock', label: 'Ride out the aftershock safely' },
  ];

  class Level2 extends G.LevelBase {
    init() {
      this.phase = 'prep';
      this.prepLeft = PREP_TIME;
      this.health = 100; this.flashT = 0;
      this.player = { x: 500, y: 400, r: 10, face: 1, walk: 0 };
      this.sister = { x: 150, y: 430, following: false, treated: false, comforted: false };
      this.holdT = 0; this.holdTarget = null;
      this.coverTime = 0; this.outsideWarned = false;
      this.bagItems = 0; this.bagPacked = false; this.bagTaken = false;
      this.gasLeaking = false; this.gasShut = false;
      this.ceilingHit = false; this.ashockSafe = true; this.ashockCover = 0;
      this.dust = []; this.shards = []; this.books = [];
      this.doneTasks = {};
      this.buildWorld();
      this.hud.config({
        role: 'SURVIVOR', goal: 'Prepare the house before the quake hits',
        countMax: PREP_TASKS.length, showTimer: true, showPhase: true, showHealth: true,
        tasks: 'Get ready', touch: 'move', actionLabel: 'HOLD',
      });
      this.hud.setTasks(PREP_TASKS);
      this.hud.set({ count: 0, health: 100, timer: this.prepLeft, phase: { ico: 'home', name: 'Before' } });
      this.hud.hint('Walk to a glowing spot and HOLD Space to prepare it. The clock is ticking…', 6);
    }

    /* ---------------- world ---------------- */
    buildWorld() {
      // walls: [x,y,w,h] — outer shell + inner rooms, gaps are doorways
      this.walls = [
        [60, 60, 600, 10], [60, 510, 600, 10], [60, 60, 10, 460],
        [650, 60, 10, 340], [650, 460, 10, 60],                       // front-door gap y 400..460
        [355, 60, 10, 90], [355, 210, 10, 95],                        // living | kitchen
        [60, 295, 120, 10], [240, 295, 125, 10],                      // living | bedroom
        [360, 295, 120, 10], [540, 295, 120, 10],                     // kitchen | hallway
        [355, 305, 10, 75], [355, 440, 10, 80],                       // bedroom | hallway
      ];
      // furniture: solid + drawn; some are hazards when unprepared
      this.furn = {
        shelf: { x: 90, y: 75, w: 74, h: 22, toppled: false },
        tv: { x: 255, y: 75, w: 52, h: 20, fallen: false },
        sofa: { x: 140, y: 205, w: 92, h: 32 },
        table: { x: 445, y: 170, w: 84, h: 50 },                      // the sturdy safe spot
        fridge: { x: 545, y: 75, w: 36, h: 26 },
        stove: { x: 598, y: 75, w: 42, h: 26 },
        bed: { x: 85, y: 340, w: 62, h: 92 },
        desk: { x: 255, y: 330, w: 62, h: 26 },
        board: { x: 385, y: 460, w: 46, h: 18 },                      // family-plan corkboard (hall)
      };
      this.windows = [ // world rects on outer walls; nearby = glass hazard mid-quake
        { x: 60, y: 140, w: 10, h: 60 }, { x: 60, y: 360, w: 10, h: 60 }, { x: 470, y: 60, w: 70, h: 10 },
      ];
      this.lamp = { x: 210, y: 400, swing: 0, fallen: false, dropT: 8 };  // bedroom pendant light
      this.items = [ // go-bag contents
        { id: 'water', label: 'Water', x: 390, y: 130, got: false },
        { id: 'aid', label: 'First-aid kit', x: 628, y: 250, got: false },
        { id: 'torch', label: 'Flashlight', x: 315, y: 480, got: false },
        { id: 'radio', label: 'Radio', x: 320, y: 255, got: false },
      ];
      this.bagSpot = { x: 610, y: 430 };
      this.ceiling = { x: 370, y: 305, w: 130, h: 58 };               // cracked-ceiling zone (after)
      this.interactables = this.makePrepInteractables();
    }

    makePrepInteractables() {
      const F = this.furn;
      const at = (f, dy = 30) => ({ x: f.x + f.w / 2, y: f.y + f.h / 2 + dy });
      const list = [
        { id: 'shelf', ...at(F.shelf), prompt: 'Strap the bookshelf', hold: 0.8 },
        { id: 'tv', ...at(F.tv), prompt: 'Secure the TV', hold: 0.8 },
        { id: 'stove', ...at(F.stove), prompt: 'Turn off the stove', hold: 0.6 },
        { id: 'table', ...at(F.table, 40), prompt: 'Memorise this safe spot', hold: 0.6 },
        { id: 'exit', x: 640, y: 430, prompt: 'Memorise the exit', hold: 0.6 },
        { id: 'plan', ...at(F.board), prompt: 'Pick the meeting place: yard flag', hold: 0.8 },
      ];
      for (const it of this.items) {
        list.push({ id: 'item-' + it.id, x: it.x, y: it.y, prompt: 'Pick up: ' + it.label, hold: 0.4, item: it });
      }
      return list;
    }
    makeAfterInteractables() {
      const F = this.furn;
      const list = [
        { id: 'sister', x: this.sister.x, y: this.sister.y, r: 40, prompt: this.items[1].got ? 'Treat your sister\'s cut' : 'Comfort your sister (no first-aid kit…)', hold: 1.0 },
      ];
      if (this.gasLeaking) list.push({ id: 'gas', x: F.stove.x + F.stove.w / 2, y: F.stove.y + F.stove.h / 2 + 30, prompt: 'Shut off the gas valve', hold: 1.0 });
      if (this.bagPacked) list.push({ id: 'grab', x: this.bagSpot.x, y: this.bagSpot.y, prompt: 'Take the go-bag', hold: 0.4 });
      return list;
    }

    /* ---------------- helpers ---------------- */
    collides(x, y, r) {
      const rects = [...this.walls];
      for (const k in this.furn) { const f = this.furn[k]; rects.push([f.x, f.y, f.w, f.h]); }
      for (const [rx, ry, rw, rh] of rects) {
        const cx = clamp(x, rx, rx + rw), cy = clamp(y, ry, ry + rh);
        if (dist(x, y, cx, cy) < r) return true;
      }
      return false;
    }
    move(e, dx, dy, r) {
      if (dx && !this.collides(e.x + dx, e.y, r)) e.x += dx;
      if (dy && !this.collides(e.x, e.y + dy, r)) e.y += dy;
      e.x = clamp(e.x, 20, WORLD_W - 20); e.y = clamp(e.y, 20, WORLD_H - 20);
    }
    actionHeld() { return G.Input.down('space') || this.hud.actionDown; }
    hurt(n, why) {
      if (this.over) return;
      this.health = clamp(this.health - n, 0, 100);
      this.flashT = 0.35;
      this.hud.set({ health: this.health });
      G.Audio.alert();
      this.fx.text(this.player.x, this.player.y - 22, '-' + Math.round(n), '#ff7a5c', { size: 15 });
      if (why) this.hud.hint(why, 3.5);
      if (this.health <= 0) {
        this.finish(false, {
          stars: 0, resultKicker: 'INJURED', resultTitle: 'The quake won this time',
          stats: [['Preparation', this.prepScore() + ' / 7'], ['Last mistake', why || 'Too many injuries']],
          feedback: ['Get under the sturdy table the moment shaking starts, and stay clear of windows and unsecured furniture.'],
        });
      }
    }
    prepScore() { return PREP_TASKS.filter((t) => this.doneTasks[t.id]).length; }
    completeTask(id, hint) {
      if (this.doneTasks[id]) return;
      this.doneTasks[id] = true;
      this.hud.taskState(id, 'done');
      G.Audio.pickup();
      if (hint) this.hud.hint(hint, 3.5);
      const inPrep = this.phase === 'prep';
      this.hud.set({ count: (inPrep ? PREP_TASKS : AFTER_TASKS).filter((t) => this.doneTasks[t.id]).length });
    }

    /* ---------------- update ---------------- */
    update(dt) {
      if (this.over) return;
      this.time += dt;
      const pl = this.player;

      // movement (blocked while holding an interaction or covering)
      let ax = 0, ay = 0;
      const axis = G.Input.axis();
      if (axis.x || axis.y) { ax = axis.x; ay = axis.y; }
      else if (this.hud.touchDir) { ax = this.hud.touchDir.x; ay = this.hud.touchDir.y; }
      const holding = this.holdTarget != null || (this.phase === 'quake' && this.underTable() && this.actionHeld());
      if (!holding && (ax || ay)) {
        this.move(pl, ax * 175 * dt, ay * 175 * dt, pl.r);
        pl.walk += dt * 9; if (ax) pl.face = ax > 0 ? 1 : -1;
      } else pl.walk = 0;

      if (this.flashT > 0) this.flashT -= dt;

      if (this.phase === 'prep') this.updatePrep(dt);
      else if (this.phase === 'quake') this.updateQuake(dt);
      else if (this.phase === 'after') this.updateAfter(dt);
      else if (this.phase === 'aftershock') this.updateAftershock(dt);

      // sister follows once checked
      if (this.sister.following) {
        const d = dist(this.sister.x, this.sister.y, pl.x, pl.y);
        if (d > 44) {
          const vx = (pl.x - this.sister.x) / d, vy = (pl.y - this.sister.y) / d;
          this.move(this.sister, vx * 150 * dt, vy * 150 * dt, 8);
        }
      }

      // dust motes decay
      for (let i = this.dust.length - 1; i >= 0; i--) {
        const d = this.dust[i]; d.y += d.vy * dt; d.life -= dt;
        if (d.life <= 0) this.dust.splice(i, 1);
      }

      this.cam.follow(pl.x, pl.y, WORLD_W, WORLD_H);

      // ghost the task panel while the player walks behind it
      const panel = document.querySelector('#taskPanel');
      if (panel) {
        const sx = pl.x - this.cam.x, sy = pl.y - this.cam.y;
        panel.style.opacity = (sx < 300 && sy > 40 && sy < 420) ? '0.18' : '';
        panel.style.transition = 'opacity .25s';
      }
    }

    /* ----- interactions shared by prep + after ----- */
    updateInteractions(dt, onComplete) {
      const pl = this.player;
      let near = null;
      for (const it of this.interactables) {
        if (this.doneTasks[it.id] || (it.item && it.item.got)) continue;
        if (dist(pl.x, pl.y, it.x, it.y) < (it.r || 34)) { near = it; break; }
      }
      this.nearInteract = near;
      if (near && this.actionHeld()) {
        if (this.holdTarget !== near) { this.holdTarget = near; this.holdT = 0; }
        this.holdT += dt;
        if (this.holdT >= near.hold) { this.holdTarget = null; this.holdT = 0; onComplete(near); }
      } else { this.holdTarget = null; this.holdT = 0; }
    }

    updatePrep(dt) {
      this.prepLeft -= dt;
      this.hud.set({ timer: this.prepLeft });
      this.updateInteractions(dt, (it) => {
        if (it.item) {
          it.item.got = true; this.bagItems++;
          G.Audio.eat();
          this.fx.text(it.x, it.y - 14, '+ ' + it.item.label, '#aee05a', { size: 14 });
          if (this.bagItems >= 4) { this.bagPacked = true; this.completeTask('bag', 'Go-bag packed! It\'s waiting by the front door.'); }
          return;
        }
        const hints = {
          shelf: 'Strapped! Tall furniture is the #1 indoor danger.',
          tv: 'Secured. Heavy things fly in a quake.',
          stove: 'Stove off — no fire, no gas leak later.',
          table: 'Remember it: DUCK, COVER, HOLD under this table.',
          exit: 'Exit memorised. Never use elevators after a quake.',
          plan: 'Meeting place set: the flag in the yard.',
        };
        this.completeTask(it.id, hints[it.id]);
      });
      const allDone = PREP_TASKS.every((t) => this.doneTasks[t.id]);
      if (this.prepLeft <= 0 || (allDone && !this._readyT)) {
        if (allDone && this.prepLeft > 0) { this._readyT = true; this.hud.banner('All set!', '#aee05a', 1); setTimeout(() => this.startQuake(), 1100); }
        else if (this.prepLeft <= 0) this.startQuake();
      }
    }

    cleanup() {
      this._dead = true;
      const panel = document.querySelector('#taskPanel');
      if (panel) panel.style.opacity = '';
    }

    startQuake() {
      if (this.phase !== 'prep' || this._dead) return;
      this.phase = 'quake'; this.qt = 0;
      this.gasLeaking = !this.doneTasks.stove;
      this.hud.config({
        role: 'SURVIVOR', goal: 'DUCK · COVER · HOLD under the sturdy table!',
        countMax: null, showTimer: true, showPhase: true, showHealth: true, tasks: 'Get ready', touch: 'move', actionLabel: 'HOLD',
      });
      this.hud.set({ phase: { ico: 'quake', name: 'During', warn: true }, health: this.health, danger: true });
      this.hud.banner('EARTHQUAKE!', '#ff6b4a', 1.6);
      this.hud.hint('Get under the sturdy table and HOLD Space! Stay away from windows!', 5);
      G.Audio.noise(1.2, 0.35); G.Audio.blip(60, 1.4, 'sawtooth', 0.28, 40);
      this.interactables = [];
    }

    underTable() {
      const t = this.furn.table, pl = this.player;
      return pl.x > t.x - 16 && pl.x < t.x + t.w + 16 && pl.y > t.y - 16 && pl.y < t.y + t.h + 24;
    }

    updateQuake(dt) {
      this.qt += dt;
      this.hud.set({ timer: QUAKE_TIME - this.qt });
      const pl = this.player;
      const covered = this.underTable() && this.actionHeld();
      if (covered) { this.coverTime += dt; }

      // ambient rumble + dust
      if (Math.random() < dt * 14) this.dust.push({ x: rand(this.cam.x, this.cam.x + 960), y: rand(this.cam.y, this.cam.y + 300), vy: rand(20, 60), life: rand(0.5, 1.4) });
      if (Math.random() < dt * 1.6) G.Audio.noise(0.25, 0.12);

      // --- hazards (all skippable through preparation / positioning) ---
      // flying books from an unstrapped shelf
      if (!this.doneTasks.shelf && this.books.length < 10 && Math.random() < dt * 3) {
        const s = this.furn.shelf;
        this.books.push({ x: rand(s.x, s.x + s.w), y: s.y + s.h, vx: rand(-40, 60), vy: rand(60, 130), t: 0 });
      }
      for (let i = this.books.length - 1; i >= 0; i--) {
        const b = this.books[i]; b.t += dt; b.x += b.vx * dt; b.y += b.vy * dt; b.vy *= 0.99;
        if (!covered && dist(b.x, b.y, pl.x, pl.y) < 14) { this.hurt(6, 'Flying books! That shelf was never strapped.'); this.books.splice(i, 1); continue; }
        if (b.t > 1.6) { b.vx = 0; b.vy = 0; }
      }
      // unstrapped shelf topples at t=3
      if (!this.doneTasks.shelf && !this.furn.shelf.toppled && this.qt > 3) {
        this.furn.shelf.toppled = true;
        const s = this.furn.shelf;
        this.fx.burst(s.x + s.w / 2, s.y + 40, '#b9a58a', 16, { spd: 100 });
        G.Audio.noise(0.4, 0.3);
        if (!covered && pl.x > s.x - 10 && pl.x < s.x + s.w + 10 && pl.y < s.y + 74) this.hurt(24, 'The unstrapped bookshelf came down on you!');
      }
      // unsecured TV falls at t=5
      if (!this.doneTasks.tv && !this.furn.tv.fallen && this.qt > 5) {
        this.furn.tv.fallen = true;
        const t = this.furn.tv;
        this.fx.burst(t.x + t.w / 2, t.y + 30, '#8fa3b3', 12, { spd: 90 });
        G.Audio.noise(0.3, 0.25);
        if (!covered && dist(pl.x, pl.y, t.x + t.w / 2, t.y + 28) < 34) this.hurt(16, 'The loose TV crashed down!');
      }
      // pendant light drops at t=8
      if (!this.lamp.fallen) {
        this.lamp.swing = Math.sin(this.qt * 6) * 0.5;
        if (this.qt > this.lamp.dropT) {
          this.lamp.fallen = true;
          this.fx.burst(this.lamp.x, this.lamp.y, '#ffe9a8', 14, { spd: 110 });
          G.Audio.noise(0.3, 0.25);
          if (!covered && dist(pl.x, pl.y, this.lamp.x, this.lamp.y) < 26) this.hurt(15, 'The light fixture fell — never stand under hanging things!');
        }
      }
      // window glass
      for (const w of this.windows) {
        const wx = w.x + w.w / 2, wy = w.y + w.h / 2;
        if (!covered && dist(pl.x, pl.y, wx, wy) < 52) {
          if (Math.random() < dt * 2.2) {
            this.shards.push({ x: wx + rand(-8, 8), y: wy + rand(-8, 8), t: 0.6 });
            this.hurt(6, 'Breaking glass! Keep away from windows while it shakes.');
          }
        } else if (Math.random() < dt * 0.5) this.shards.push({ x: wx + rand(-10, 10), y: wy + rand(-10, 10), t: 0.6 });
      }
      for (let i = this.shards.length - 1; i >= 0; i--) { this.shards[i].t -= dt; if (this.shards[i].t <= 0) this.shards.splice(i, 1); }
      // running outside mid-shake
      if (pl.x > HOUSE.x1 + 8) {
        if (!this.outsideWarned) { this.outsideWarned = true; this.hurt(18, 'Roof tiles rain down at the doorway — never run out mid-shake!'); }
        else if (Math.random() < dt * 1.2) this.hurt(5);
      }
      // standing in the open (not covered, inside) drains slowly
      if (!covered && pl.x <= HOUSE.x1 + 8 && Math.random() < dt * 0.8) this.hurt(3, 'You\'re on your feet in the shaking — DUCK, COVER, HOLD!');

      if (this.qt >= QUAKE_TIME) this.startAfter();
    }

    startAfter() {
      this.phase = 'after';
      this.books.length = 0;
      this.hud.config({
        role: 'SURVIVOR', goal: 'Check people, check hazards, then evacuate',
        countMax: AFTER_TASKS.length, showTimer: false, showPhase: true, showHealth: true,
        tasks: 'After the quake', touch: 'move', actionLabel: 'HOLD',
      });
      this.hud.setTasks(AFTER_TASKS);
      if (!this.gasLeaking) this.completeTask('gas', 'The stove was already off — no gas leak. Preparation pays.');
      this.hud.set({ phase: { ico: 'siren', name: 'After' }, count: AFTER_TASKS.filter((t) => this.doneTasks[t.id]).length, danger: false });
      this.hud.banner('The shaking stops…', '#fff', 1.6);
      this.hud.hint(this.gasLeaking ? 'You smell gas from the kitchen! Check your sister, shut the valve, then get out.' : 'Check your sister, grab the go-bag, and evacuate to the yard flag.', 6);
      this.interactables = this.makeAfterInteractables();
      this.sisterCrying = true;
    }

    updateAfter(dt) {
      const pl = this.player;
      // gas hiss particles
      if (this.gasLeaking && !this.gasShut && Math.random() < dt * 10) {
        const s = this.furn.stove;
        this.dust.push({ x: s.x + s.w / 2 + rand(-6, 6), y: s.y + s.h + rand(0, 8), vy: -22, life: 0.9, gas: true });
      }
      // cracked ceiling zone in the hallway
      const cz = this.ceiling;
      if (!this.ceilingHit && pl.x > cz.x && pl.x < cz.x + cz.w && pl.y > cz.y && pl.y < cz.y + cz.h) {
        this.ceilingHit = true;
        this.fx.burst(pl.x, pl.y - 14, '#b9a58a', 12, { spd: 80 });
        this.hurt(12, 'Chunks fall from the cracked ceiling — walk around damaged spots!');
      }
      this.updateInteractions(dt, (it) => {
        if (it.id === 'sister') {
          this.sister.following = true; this.sisterCrying = false;
          if (this.items[1].got) { this.sister.treated = true; this.completeTask('sister', 'Cut cleaned and bandaged. She\'s coming with you.'); }
          else { this.sister.comforted = true; this.completeTask('sister', 'You calm her down… but with no first-aid kit her cut stays open.'); }
        } else if (it.id === 'gas') {
          this.gasShut = true; this.gasLeaking = false;
          this.completeTask('gas', 'Valve closed. Gas fires are the deadliest post-quake danger.');
        } else if (it.id === 'grab') {
          this.bagTaken = true;
          this.completeTask('grab', 'Go-bag on your back — water, light, first aid, radio.');
        }
        this.interactables = this.makeAfterInteractables();
      });
      // reaching the flag
      if (dist(pl.x, pl.y, FLAG.x, FLAG.y) < 40) {
        if (!this.sister.following) this.hud.hint('Your sister is still inside the house!', 3);
        else if (dist(this.sister.x, this.sister.y, FLAG.x, FLAG.y) < 90) {
          this.completeTask('evac', 'Meeting place reached — open ground, away from walls and wires.');
          this.startAftershock();
        }
      }
    }

    startAftershock() {
      if (this.phase !== 'after') return;
      this.phase = 'aftershock'; this.at = 0;
      this.hud.set({ phase: { ico: 'quake', name: 'Aftershock', warn: true }, danger: true, goal: 'Aftershock! Stay in the open — drop and cover!' });
      this.hud.banner('AFTERSHOCK!', '#ff6b4a', 1.5);
      this.hud.hint('Aftershocks follow big quakes. Stay clear of the house and the power pole — drop low and HOLD.', 5);
      G.Audio.noise(1.0, 0.3); G.Audio.blip(65, 1.2, 'sawtooth', 0.25, 45);
    }

    updateAftershock(dt) {
      this.at += dt;
      const pl = this.player;
      if (Math.random() < dt * 2) G.Audio.noise(0.2, 0.1);
      const nearHouse = pl.x > HOUSE.x0 - 40 && pl.x < HOUSE.x1 + 55 && pl.y > HOUSE.y0 - 40 && pl.y < HOUSE.y1 + 55;
      const nearPole = dist(pl.x, pl.y, POLE.x, POLE.y) < 60;
      if ((nearHouse || nearPole) && Math.random() < dt * 2.4) {
        this.ashockSafe = false;
        this.hurt(8, nearPole ? 'The power pole is whipping — keep clear of wires!' : 'Debris falls from the house — stay in the open!');
      }
      if (this.actionHeld() && !nearHouse && !nearPole) this.ashockCover += dt;
      if (this.at >= AFTERSHOCK_TIME) this.endLevel();
    }

    endLevel() {
      if (this.over) return;
      this.doneTasks.ashock = this.ashockSafe;
      this.hud.taskState('ashock', this.ashockSafe ? 'done' : 'fail');
      this.hud.set({ danger: false, phase: { ico: 'siren', name: 'All clear' } });
      const prep = this.prepScore();
      const gasSafe = !this.gasLeaking;
      const stars = (prep >= 6 && this.health >= 70 && this.sister.treated && gasSafe && this.ashockSafe) ? 3
        : (prep >= 4 && this.health >= 40) ? 2 : 1;
      const fb = [];
      if (!this.doneTasks.shelf) fb.push('The unstrapped bookshelf became a hazard — securing tall furniture is the single best indoor preparation.');
      if (!this.items[1].got) fb.push('Without a first-aid kit in the go-bag you couldn\'t treat your sister\'s cut. Pack it first.');
      if (this.coverTime < 8) fb.push('You spent too much of the shaking on your feet. Drop under sturdy cover within the first three seconds.');
      if (!gasSafe) fb.push('You left the gas leaking. After shaking stops, shut the valve if it\'s safe — gas fires destroy more homes than the shaking.');
      if (!this.ashockSafe) fb.push('The aftershock caught you near structures. Once you\'re out, stay in the open.');
      if (!fb.length) fb.push('Textbook survival: prepared home, fast Duck·Cover·Hold, clean evacuation. Teach your family this drill!');
      this.finish(true, {
        stars,
        resultKicker: 'SURVIVAL REPORT', resultTitle: this.health >= 70 ? 'You made it — barely a scratch!' : 'You made it out',
        stats: [
          ['🏠 Preparation', prep + ' / 7'],
          ['🛡 Duck·Cover·Hold', Math.round(this.coverTime) + 's under cover'],
          ['❤️ Health', this.health + ' / 100'],
          ['👧 Sister', this.sister.treated ? 'Treated' : this.sister.comforted ? 'Comforted (untreated)' : 'Left behind'],
          ['⏱ House prepped in', Math.round(PREP_TIME - Math.max(0, this.prepLeft)) + 's'],
        ],
        feedback: fb,
      });
    }

    /* ================= drawing ================= */
    draw() {
      const c = this.ctx, cam = this.cam;
      let shx = 0, shy = 0;
      const shakeAmp = this.phase === 'quake' ? lerp(7, 3, this.qt / QUAKE_TIME) : this.phase === 'aftershock' ? 4 : 0;
      if (shakeAmp) { const a = G.REDUCED ? shakeAmp * 0.25 : shakeAmp; shx = rand(-a, a); shy = rand(-a, a); }
      c.save();
      c.translate(-Math.round(cam.x) + shx, -Math.round(cam.y) + shy);

      this.drawYard(c);
      this.drawHouse(c);
      this.drawSister(c);
      this.drawPlayer(c);
      this.drawLamp(c);
      this.drawPrompts(c);
      this.fx.draw(c, { x: 0, y: 0 });
      c.restore();

      // red damage vignette
      if (this.flashT > 0) {
        c.fillStyle = 'rgba(224,74,58,' + (this.flashT * 0.7) + ')';
        c.fillRect(0, 0, this.W, this.H);
      }
    }

    drawYard(c) {
      c.fillStyle = '#9CCB63'; c.fillRect(0, 0, WORLD_W, WORLD_H);
      c.fillStyle = 'rgba(255,255,255,.35)';
      for (let i = 0; i < 40; i++) { const x = (i * 173) % WORLD_W, y = (i * 271) % WORLD_H; c.fillRect(x, y, 3, 3); }
      // path from door to flag
      c.strokeStyle = '#D8C89A'; c.lineWidth = 26; c.lineCap = 'round';
      c.beginPath(); c.moveTo(668, 430); c.quadraticCurveTo(790, 430, FLAG.x, FLAG.y); c.stroke();
      // power pole
      c.save(); c.translate(POLE.x, POLE.y);
      if (this.phase === 'aftershock') c.rotate(Math.sin(this.at * 9) * 0.06);
      c.strokeStyle = '#6B5B49'; c.lineWidth = 5;
      c.beginPath(); c.moveTo(0, 20); c.lineTo(0, -46); c.stroke();
      c.lineWidth = 3; c.beginPath(); c.moveTo(-14, -38); c.lineTo(14, -38); c.stroke();
      c.restore();
      // meeting-place flag
      c.strokeStyle = '#6B5B49'; c.lineWidth = 4;
      c.beginPath(); c.moveTo(FLAG.x, FLAG.y + 16); c.lineTo(FLAG.x, FLAG.y - 34); c.stroke();
      c.fillStyle = '#13A597';
      c.beginPath(); c.moveTo(FLAG.x, FLAG.y - 34); c.lineTo(FLAG.x + 26, FLAG.y - 26); c.lineTo(FLAG.x, FLAG.y - 18); c.closePath(); c.fill();
      c.fillStyle = 'rgba(19,165,151,.18)';
      c.beginPath(); c.arc(FLAG.x, FLAG.y, 46, 0, TAU); c.fill();
      // trees
      for (const [tx, ty] of [[790, 150], [1050, 260], [1000, 620], [740, 660]]) {
        c.fillStyle = '#8A6647'; c.fillRect(tx - 4, ty - 6, 8, 20);
        c.fillStyle = '#5FA653';
        c.beginPath(); c.arc(tx, ty - 18, 24, 0, TAU); c.arc(tx - 15, ty - 6, 16, 0, TAU); c.arc(tx + 15, ty - 6, 16, 0, TAU); c.fill();
      }
    }

    drawHouse(c) {
      // floors
      c.fillStyle = '#E8D3A8'; c.fillRect(HOUSE.x0, HOUSE.y0, HOUSE.x1 - HOUSE.x0, HOUSE.y1 - HOUSE.y0);
      c.fillStyle = '#DCE9E4'; c.fillRect(365, 70, 285, 225);          // kitchen tiles
      c.strokeStyle = 'rgba(43,36,23,.08)'; c.lineWidth = 1;
      for (let x = 365; x <= 650; x += 28) { c.beginPath(); c.moveTo(x, 70); c.lineTo(x, 295); c.stroke(); }
      for (let y = 70; y <= 295; y += 28) { c.beginPath(); c.moveTo(365, y); c.lineTo(650, y); c.stroke(); }
      c.fillStyle = '#D9BFD4'; c.fillRect(70, 305, 285, 205);          // bedroom rug tone
      // cracked-ceiling zone (after phase)
      if (this.phase === 'after' || this.phase === 'aftershock') {
        const z = this.ceiling;
        c.fillStyle = 'rgba(110,90,60,.25)'; c.fillRect(z.x, z.y, z.w, z.h);
        c.strokeStyle = 'rgba(60,45,30,.6)'; c.lineWidth = 1.5;
        c.beginPath(); c.moveTo(z.x + 12, z.y + 6); c.lineTo(z.x + 40, z.y + 30); c.lineTo(z.x + 28, z.y + 52); c.stroke();
        c.beginPath(); c.moveTo(z.x + 80, z.y + 8); c.lineTo(z.x + 66, z.y + 34); c.lineTo(z.x + 96, z.y + 50); c.stroke();
      }
      // walls
      c.fillStyle = '#6B5B49';
      for (const [x, y, w, h] of this.walls) c.fillRect(x, y, w, h);
      // windows glow on walls
      for (const w of this.windows) {
        c.fillStyle = this.phase === 'quake' ? '#F6D7CE' : '#BEE3F0';
        c.fillRect(w.x, w.y, w.w, w.h);
      }
      // front door mark
      c.fillStyle = '#C97F3B'; c.fillRect(652, 402, 8, 56);
      // furniture
      const F = this.furn;
      this.box(c, F.sofa, '#D6845B', 'sofa');
      this.box(c, F.bed, '#BFD9EE', 'bed');
      this.box(c, F.desk, '#C9A26B', 'desk');
      this.box(c, F.fridge, '#DDE7EC', 'fridge');
      this.drawStove(c, F.stove);
      this.drawTable(c, F.table);
      this.drawShelf(c, F.shelf);
      this.drawTV(c, F.tv);
      this.drawBoard(c, F.board);
      // go-bag items + bag
      for (const it of this.items) if (!it.got) this.drawItem(c, it);
      if (this.bagPacked && !this.bagTaken) this.drawBag(c, this.bagSpot.x, this.bagSpot.y);
      // glass shards + books + dust
      c.fillStyle = '#CFEAF5';
      for (const s of this.shards) { c.globalAlpha = clamp(s.t / 0.6, 0, 1); c.fillRect(s.x, s.y, 4, 3); }
      c.globalAlpha = 1;
      c.fillStyle = '#C97F3B';
      for (const b of this.books) { c.save(); c.translate(b.x, b.y); c.rotate(b.t * 5); c.fillRect(-5, -3, 10, 6); c.restore(); }
      for (const d of this.dust) {
        c.fillStyle = d.gas ? 'rgba(190,230,190,.5)' : 'rgba(180,160,130,.4)';
        c.beginPath(); c.arc(d.x, d.y, 2.4, 0, TAU); c.fill();
      }
    }

    box(c, f, color, tag) {
      c.fillStyle = color;
      c.fillRect(f.x, f.y, f.w, f.h);
      c.strokeStyle = 'rgba(43,36,23,.25)'; c.lineWidth = 1.5; c.strokeRect(f.x, f.y, f.w, f.h);
      if (tag === 'bed') { c.fillStyle = '#fff'; c.fillRect(f.x + 6, f.y + 6, f.w - 12, 22); }
      if (tag === 'sofa') { c.fillStyle = 'rgba(255,255,255,.3)'; c.fillRect(f.x + 4, f.y + 4, f.w - 8, 10); }
    }
    drawStove(c, f) {
      this.box(c, f, '#B9C4CC');
      c.fillStyle = this.doneTasks.stove || this.gasShut ? '#5f6b73' : '#EE6A1F';
      c.beginPath(); c.arc(f.x + 12, f.y + 13, 5, 0, TAU); c.arc(f.x + 30, f.y + 13, 5, 0, TAU); c.fill();
    }
    drawTable(c, f) {
      // glow to mark the safe spot once memorised
      if (this.doneTasks.table) {
        c.fillStyle = 'rgba(19,165,151,.2)';
        c.beginPath(); c.arc(f.x + f.w / 2, f.y + f.h / 2, 56, 0, TAU); c.fill();
      }
      this.box(c, f, '#A8794F');
      c.fillStyle = '#C9A26B'; c.fillRect(f.x + 6, f.y + 6, f.w - 12, f.h - 12);
    }
    drawShelf(c, f) {
      if (f.toppled) {
        c.save(); c.translate(f.x + f.w / 2, f.y + 40); c.rotate(0.16);
        c.fillStyle = '#8A6647'; c.fillRect(-f.w / 2, -34, f.w, 68);
        c.restore();
        return;
      }
      this.box(c, f, '#8A6647');
      c.fillStyle = '#E8B04B'; c.fillRect(f.x + 5, f.y + 4, 12, 6); c.fillRect(f.x + 22, f.y + 4, 10, 6);
      c.fillStyle = '#4E8F86'; c.fillRect(f.x + 38, f.y + 4, 12, 6); c.fillRect(f.x + 55, f.y + 4, 10, 6);
      if (this.doneTasks.shelf) { c.strokeStyle = '#13A597'; c.lineWidth = 3; c.beginPath(); c.moveTo(f.x + 4, f.y + f.h + 3); c.lineTo(f.x + f.w - 4, f.y - 3); c.stroke(); }
    }
    drawTV(c, f) {
      if (f.fallen) {
        c.save(); c.translate(f.x + f.w / 2, f.y + 28); c.rotate(-0.3);
        c.fillStyle = '#3d434a'; c.fillRect(-22, -8, 44, 16);
        c.restore();
        return;
      }
      this.box(c, f, '#3d434a');
      c.fillStyle = '#9AD1E8'; c.fillRect(f.x + 4, f.y + 4, f.w - 8, f.h - 8);
      if (this.doneTasks.tv) { c.strokeStyle = '#13A597'; c.lineWidth = 3; c.beginPath(); c.moveTo(f.x + 3, f.y + f.h + 2); c.lineTo(f.x + f.w - 3, f.y - 2); c.stroke(); }
    }
    drawBoard(c, f) {
      this.box(c, f, '#C9A26B');
      c.fillStyle = '#FFF6E3'; c.fillRect(f.x + 4, f.y + 3, f.w - 8, f.h - 6);
      if (this.doneTasks.plan) { c.fillStyle = '#13A597'; c.fillRect(f.x + f.w / 2 - 3, f.y + 5, 6, 8); }
    }
    drawItem(c, it) {
      const bob = Math.sin(this.time * 3 + it.x) * 2;
      c.fillStyle = 'rgba(238,106,31,.18)';
      c.beginPath(); c.arc(it.x, it.y, 16, 0, TAU); c.fill();
      c.save(); c.translate(it.x, it.y + bob);
      const colors = { water: '#3B8FD4', aid: '#E05A4E', torch: '#E2A41C', radio: '#5f6b73' };
      c.fillStyle = colors[it.id];
      if (it.id === 'water') { c.fillRect(-4, -8, 8, 16); c.fillStyle = '#9AD1E8'; c.fillRect(-4, -8, 8, 5); }
      else if (it.id === 'aid') { c.fillRect(-8, -6, 16, 12); c.fillStyle = '#fff'; c.fillRect(-1.5, -4, 3, 8); c.fillRect(-4, -1.5, 8, 3); }
      else if (it.id === 'torch') { c.fillRect(-3, -8, 6, 12); c.fillStyle = '#FFE28A'; c.beginPath(); c.arc(0, 7, 4, 0, TAU); c.fill(); }
      else { c.fillRect(-8, -5, 16, 11); c.fillStyle = '#E2A41C'; c.beginPath(); c.arc(-3, 0, 2.5, 0, TAU); c.fill(); }
      c.restore();
    }
    drawBag(c, x, y) {
      c.fillStyle = 'rgba(19,165,151,.18)';
      c.beginPath(); c.arc(x, y, 16, 0, TAU); c.fill();
      c.fillStyle = '#13A597';
      c.beginPath(); c.moveTo(x - 8, y + 8); c.lineTo(x - 6, y - 8); c.lineTo(x + 6, y - 8); c.lineTo(x + 8, y + 8); c.closePath(); c.fill();
      c.fillStyle = '#0e7f74'; c.fillRect(x - 4, y - 4, 8, 6);
    }
    drawLamp(c) {
      const L = this.lamp;
      if (L.fallen) {
        c.fillStyle = '#E2A41C';
        c.beginPath(); c.arc(L.x, L.y, 7, 0, Math.PI, true); c.fill();
        c.fillStyle = '#FFE28A'; c.fillRect(L.x - 9, L.y, 4, 3); c.fillRect(L.x + 5, L.y + 2, 4, 3);
        return;
      }
      c.save(); c.translate(L.x, L.y - 26); c.rotate(L.swing || 0);
      c.strokeStyle = '#6B5B49'; c.lineWidth = 2;
      c.beginPath(); c.moveTo(0, 0); c.lineTo(0, 18); c.stroke();
      c.fillStyle = '#E2A41C';
      c.beginPath(); c.arc(0, 24, 8, 0, Math.PI, true); c.fill();
      c.fillStyle = 'rgba(255,226,138,.25)';
      c.beginPath(); c.arc(0, 26, 16, 0, TAU); c.fill();
      c.restore();
    }
    drawPerson(c, x, y, opts) {
      c.save(); c.translate(x, y);
      const hop = Math.abs(Math.sin((opts.walk || 0))) * (opts.walk ? 2.5 : 0);
      c.translate(0, -hop);
      c.fillStyle = 'rgba(30,30,20,.2)';
      c.beginPath(); c.ellipse(0, 8 + hop, 9, 4, 0, 0, TAU); c.fill();
      if (opts.crouch) {
        c.fillStyle = opts.shirt; c.beginPath(); c.arc(0, 2, 8, 0, TAU); c.fill();
        c.fillStyle = '#F6C9A0'; c.beginPath(); c.arc(0, -5, 6, 0, TAU); c.fill();
      } else {
        c.fillStyle = opts.shirt;
        c.beginPath(); c.arc(0, -2, 7.5, 0, TAU); c.fill();
        c.fillRect(-7.5, -2, 15, 8);
        c.fillStyle = '#F6C9A0'; c.beginPath(); c.arc(0, -12, 6.5, 0, TAU); c.fill();
        c.fillStyle = opts.hair; c.beginPath(); c.arc(0, -14.5, 6, Math.PI, TAU); c.fill();
        c.fillStyle = '#2B2622';
        c.beginPath(); c.arc(2.2 * (opts.face || 1), -12, 1.1, 0, TAU); c.arc(4.6 * (opts.face || 1), -12, 1.1, 0, TAU); c.fill();
      }
      if (opts.bag) { c.fillStyle = '#13A597'; c.fillRect(-10, -6, 4, 9); }
      c.restore();
    }
    drawPlayer(c) {
      const pl = this.player;
      const covering = this.phase === 'quake' && this.underTable() && this.actionHeld();
      this.drawPerson(c, pl.x, pl.y, { shirt: '#13A597', hair: '#5a3d24', face: pl.face, walk: pl.walk, crouch: covering || (this.phase === 'aftershock' && this.actionHeld()), bag: this.bagTaken });
      if (covering) {
        c.font = '900 11px Nunito, sans-serif'; c.textAlign = 'center';
        c.fillStyle = '#13A597';
        c.fillText('DUCK · COVER · HOLD', pl.x, pl.y - 30);
      }
    }
    drawSister(c) {
      const s = this.sister;
      if (this.phase === 'prep') return;                       // she's at school until evening
      this.drawPerson(c, s.x, s.y, { shirt: '#E27A9E', hair: '#3d2a18', face: -1, walk: s.following ? this.time * 9 : 0, crouch: false });
      if (this.sisterCrying && (this.phase === 'after')) {
        const bob = Math.sin(this.time * 5) * 2;
        c.font = '900 13px Nunito, sans-serif'; c.textAlign = 'center';
        c.fillStyle = '#E05A4E'; c.fillText('!', s.x, s.y - 30 + bob);
      }
    }
    drawPrompts(c) {
      const it = this.nearInteract;
      if (!it) return;
      const pl = this.player;
      // anchor the prompt to the player (screen centre), never to the object —
      // objects can sit behind the fixed task panel, the player never does
      c.font = '800 12px Nunito, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
      const label = it.prompt + '  —  hold SPACE';
      const w = c.measureText(label).width + 16;
      c.fillStyle = 'rgba(20,24,32,.78)';
      c.beginPath(); c.roundRect(pl.x - w / 2, pl.y + 22, w, 22, 8); c.fill();
      c.fillStyle = '#fff'; c.fillText(label, pl.x, pl.y + 33);
      if (this.holdTarget === it && this.holdT > 0) {
        c.strokeStyle = '#EE6A1F'; c.lineWidth = 4;
        c.beginPath(); c.arc(pl.x, pl.y - 24, 10, -Math.PI / 2, -Math.PI / 2 + TAU * (this.holdT / it.hold)); c.stroke();
      }
    }
  }

  G.LevelClasses.Level2 = Level2;
})(window);
