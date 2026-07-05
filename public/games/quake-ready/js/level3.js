/* ===========================================================================
   Level 3 — Rescue Ops (post-quake command & triage)
   Fixed top-down town split by a river. Incidents appear on a schedule; the
   player clicks one, then dispatches limited units from the Command Post.
   Everything costs fuel and time; the blocked bridge gates the east side.
   =========================================================================== */
(function (global) {
  'use strict';
  const G = global.Game;
  const { clamp, dist, rand, TAU } = G;

  // NOTE: keep interactive map content at x ≤ ~660 — the Command Post panel
  // overlays the right edge of the stage on narrow windows.
  const MISSION_TIME = 300;
  const RIVER_X = 430, RIVER_W = 44;
  const BRIDGE = { x: RIVER_X + RIVER_W / 2, y: 310 };
  const HQ = { x: 110, y: 510 };
  const HOSPITAL = { x: 90, y: 100, w: 110, h: 64 };
  const SUBSTATION = { x: 240, y: 115, w: 44, h: 34 };
  const SCHOOL = { x: 520, y: 105, w: 105, h: 62 };
  const SHELTER = { x: 640, y: 330 };
  const FLOOD = { x: 500, y: 460, w: 140, h: 75 };
  const HOMES = [130, 190, 250, 310].map((x) => ({ x, y: 330, w: 48, h: 40, state: 'intact', burnT: 0 }));

  const UNIT_SPEED = 95, FUEL_MAX = 110;

  class Level3 extends G.LevelBase {
    init() {
      this.t = 0;
      this.fuel = FUEL_MAX; this.meds = 3; this.saved = 0; this.lost = 0;
      this.homes = HOMES.map((h) => ({ ...h, state: 'intact', burnT: 0 }));
      this.bridgeCleared = false; this.bridgeClearedAt = null;
      this.powered = true;                     // blackout hits at t=30
      this.pendingHospital = 0;                // injured waiting for power
      this.walkers = [];                       // cosmetic rescued people
      this.units = [
        this.unit('r1', 'Rescue Team 1', '#13A597', 'rescue'),
        this.unit('r2', 'Rescue Team 2', '#37BCAE', 'rescue'),
        this.unit('fire', 'Fire Truck', '#E05A4E', 'fire'),
        this.unit('amb', 'Ambulance', '#F2E3C8', 'ambulance'),
        this.unit('rep', 'Repair Crew', '#EE6A1F', 'repair'),
        this.unit('pow', 'Power Crew', '#E2A41C', 'power'),
      ];
      this.incidents = {
        bridge: { id: 'bridge', x: BRIDGE.x, y: BRIDGE.y, t0: 0, live: false, resolved: false, name: 'Blocked bridge', icon: '⛏', color: '#EE6A1F', work: 20, resolvedAt: null },
        school: { id: 'school', x: SCHOOL.x + SCHOOL.w / 2, y: SCHOOL.y + SCHOOL.h / 2, t0: 0, live: false, resolved: false, name: 'Collapsed school', icon: '!', color: '#E05A4E', trapped: 6, waitingInjured: 0, survival: 150, rescueT: 0, nextInjured: false },
        fire: { id: 'fire', x: 244, y: 316, t0: 15, live: false, resolved: false, name: 'House fire', icon: '🔥', color: '#E05A4E' },
        power: { id: 'power', x: SUBSTATION.x + 22, y: SUBSTATION.y + 17, t0: 30, live: false, resolved: false, name: 'Hospital blackout', icon: '⚡', color: '#E2A41C', work: 25 },
        family: { id: 'family', x: FLOOD.x + 75, y: FLOOD.y + 40, t0: 55, live: false, resolved: false, name: 'Stranded family', icon: '!', color: '#3B8FD4', work: 12 },
        supplies: { id: 'supplies', x: SHELTER.x, y: SHELTER.y, t0: 85, live: false, resolved: false, name: 'Shelter needs supplies', icon: '⬛', color: '#13A597', work: 6 },
      };
      this.selected = null;
      this.hud.config({
        role: 'COMMANDER', goal: 'Triage: lives first, spreading danger second',
        countMax: 9, showTimer: true, panel: 'ops', touch: null,
      });
      this.hud.set({ count: 0, timer: MISSION_TIME });
      this.dom = {
        fuel: document.querySelector('#opsFuel'), meds: document.querySelector('#opsMeds'),
        saved: document.querySelector('#opsSaved'), inc: document.querySelector('#opsIncident'),
        act: document.querySelector('#opsActions'),
      };
      this.renderPanel();
      this.hud.hint('The bridge is blocked — nothing reaches the east side until it\'s cleared. Click an incident to respond.', 7);
    }
    unit(id, label, color, kind) {
      return { id, label, color, kind, x: HQ.x + rand(-26, 26), y: HQ.y + rand(-14, 14), path: [], task: null, workLeft: 0, waiting: false, cargo: 0 };
    }
    cleanup() { if (this.dom) { this.dom.inc.innerHTML = '<p class="ops-empty">Click a flashing incident on the map to see what it needs.</p>'; this.dom.act.innerHTML = ''; } }

    /* ---------------- routing + dispatch ---------------- */
    sideOf(x) { return x < RIVER_X + RIVER_W / 2 ? -1 : 1; }
    routeTo(unit, tx, ty) {
      // the bridge itself is approached directly — the repair crew must be able
      // to reach its own worksite while the crossing is still blocked
      if (dist(tx, ty, BRIDGE.x, BRIDGE.y) < 60) return [{ x: tx, y: ty }];
      const cross = this.sideOf(unit.x) !== this.sideOf(tx);
      return cross ? [{ x: BRIDGE.x, y: BRIDGE.y, gate: true }, { x: tx, y: ty }] : [{ x: tx, y: ty }];
    }
    pathLen(unit, path) {
      let len = 0, px = unit.x, py = unit.y;
      for (const p of path) { len += dist(px, py, p.x, p.y); px = p.x; py = p.y; }
      return len;
    }
    fuelCost(unit, tx, ty) { return Math.max(2, Math.round(this.pathLen(unit, this.routeTo(unit, tx, ty)) / 45)); }

    eligibleUnits(inc) {
      const byKind = {
        bridge: ['repair'], school: ['rescue', 'ambulance'], fire: ['fire'],
        power: ['power'], family: ['rescue'], supplies: ['rescue', 'ambulance'],
      }[inc.id];
      // free units, plus rescue teams idly digging (they can be re-tasked);
      // units mid-drive, mid-work or carrying patients are committed.
      return this.units.filter((u) =>
        byKind.includes(u.kind) && !u.path.length && u.workLeft <= 0 && u.cargo === 0 &&
        (!u.task || (u.task.inc === 'school' && !u.task.deliver && u.task.inc !== inc.id)));
    }
    dispatch(unit, inc) {
      // ambulances only help the school once someone needs transport
      const target = { x: inc.x, y: inc.y };
      const cost = this.fuelCost(unit, target.x, target.y);
      if (cost > this.fuel) return;
      this.fuel -= cost;
      unit.path = this.routeTo(unit, target.x, target.y);
      unit.task = { inc: inc.id };
      unit.waiting = false;
      G.Audio.blip(540, 0.08, 'triangle', 0.13, 660);
      this.renderPanel();
    }

    /* ---------------- update ---------------- */
    update(dt) {
      if (this.over) return;
      this.t += dt; this.time += dt;
      this.hud.set({ timer: MISSION_TIME - this.t });

      // incident spawns
      for (const key in this.incidents) {
        const inc = this.incidents[key];
        if (!inc.live && !inc.resolved && this.t >= inc.t0) {
          inc.live = true;
          if (inc.id === 'fire') { this.homes[1].state = 'burning'; this.hud.banner('FIRE!', '#ff6b4a', 1.3); this.hud.hint('A house caught fire — it spreads to the next roof every ~20 seconds!', 5); G.Audio.alert(); }
          else if (inc.id === 'power') { this.powered = false; this.hud.banner('Hospital blackout!', '#ffd24a', 1.4); this.hud.hint('No electricity, no surgeons. Injured patients can\'t be treated until power returns.', 5); G.Audio.alert(); }
          else if (inc.id === 'family') { this.hud.hint('A family is stranded on the flooded street east of the river.', 4.5); G.Audio.alert(); }
          else if (inc.id === 'supplies') { this.hud.hint('The shelter is out of food and water.', 4); }
          this.renderPanel();
        }
      }

      this.updateUnits(dt);
      this.updateSchool(dt);
      this.updateFire(dt);

      // cosmetic walkers head to the shelter
      for (let i = this.walkers.length - 1; i >= 0; i--) {
        const w = this.walkers[i];
        const d = dist(w.x, w.y, SHELTER.x, SHELTER.y);
        if (d < 20) { this.walkers.splice(i, 1); continue; }
        w.x += (SHELTER.x - w.x) / d * 40 * dt; w.y += (SHELTER.y - w.y) / d * 40 * dt;
      }

      // map click → select incident
      const p = G.Input.pointer;
      if (p.justDown) {
        let hit = null;
        for (const key in this.incidents) {
          const inc = this.incidents[key];
          if (inc.live && !inc.resolved && dist(p.x, p.y, inc.x, inc.y) < 30) { hit = inc.id; break; }
        }
        if (hit) { this.selected = hit; G.Audio.blip(620, 0.06, 'triangle', 0.12); }
        else this.selected = null;
        this.renderPanel();
      }

      // keep the school countdown in the panel fresh
      this._panelT = (this._panelT || 0) + dt;
      if (this.selected === 'school' && this._panelT > 1) { this._panelT = 0; this.renderPanel(); }

      if (this.t >= MISSION_TIME) this.endMission();
      else if (this.allResolved()) this.endMission();
    }

    updateUnits(dt) {
      for (const u of this.units) {
        // travel
        if (u.path.length) {
          const wp = u.path[0];
          if (wp.gate && !this.bridgeCleared && dist(u.x, u.y, wp.x, wp.y) < 46) {
            u.waiting = true;                                  // stuck at the blocked bridge
            continue;
          }
          u.waiting = false;
          const d = dist(u.x, u.y, wp.x, wp.y);
          if (d < 4) { u.path.shift(); if (!u.path.length) this.arrive(u); }
          else { u.x += (wp.x - u.x) / d * UNIT_SPEED * dt; u.y += (wp.y - u.y) / d * UNIT_SPEED * dt; }
          continue;
        }
        // work
        if (u.task && u.workLeft > 0) {
          u.workLeft -= dt;
          if (u.workLeft <= 0) this.finishWork(u);
        }
      }
    }

    arrive(u) {
      const inc = this.incidents[u.task && u.task.inc];
      if (!inc) { u.task = null; return; }
      if (u.task.deliver) {                                    // ambulance reaching the hospital
        if (this.powered) { this.addSaved(u.cargo, inc.x, 'Patients treated!'); }
        else { this.pendingHospital += u.cargo; this.hud.hint('The hospital is dark — patients wait until power returns.', 4); }
        u.cargo = 0; u.task = null; this.renderPanel();
        return;
      }
      if (inc.resolved) { u.task = null; this.renderPanel(); return; }
      switch (inc.id) {
        case 'bridge': u.workLeft = inc.work; break;
        case 'power': u.workLeft = inc.work; break;
        case 'family': u.workLeft = inc.work; break;
        case 'supplies': u.workLeft = inc.work; break;
        case 'fire': {
          const burning = this.homes.find((h) => h.state === 'burning');
          if (burning) { u.workLeft = 8; u.task.home = this.homes.indexOf(burning); }
          else u.task = null;
          break;
        }
        case 'school': {
          if (u.kind === 'ambulance') {
            const load = Math.min(2, inc.waitingInjured, this.meds);
            if (load > 0) {
              inc.waitingInjured -= load; this.meds -= load; u.cargo = load;
              u.task = { inc: 'school', deliver: true };
              u.path = this.routeTo(u, HOSPITAL.x + HOSPITAL.w / 2, HOSPITAL.y + HOSPITAL.h + 14);
              this.hud.hint('Ambulance loaded — heading to the hospital.', 3);
            } else { u.task = null; this.hud.hint(this.meds <= 0 ? 'No med kits left for safe transport!' : 'No one is waiting for transport yet.', 3.5); }
          }
          // rescue teams keep digging via updateSchool
          break;
        }
      }
      this.renderPanel();
    }

    finishWork(u) {
      const inc = this.incidents[u.task.inc];
      u.workLeft = 0;
      switch (inc.id) {
        case 'bridge':
          this.bridgeCleared = true; this.bridgeClearedAt = this.t;
          inc.resolved = true; inc.resolvedAt = this.t;
          this.hud.banner('Bridge open!', '#aee05a', 1.3);
          this.hud.hint('Route restored — units can now reach the east side.', 4);
          G.Audio.pickup();
          u.task = null;
          break;
        case 'power':
          this.powered = true; inc.resolved = true; inc.resolvedAt = this.t;
          this.hud.banner('Power restored!', '#ffd24a', 1.3);
          G.Audio.pickup();
          if (this.pendingHospital > 0) { this.addSaved(this.pendingHospital, HOSPITAL.x + 55, 'Waiting patients treated!'); this.pendingHospital = 0; }
          u.task = null;
          break;
        case 'family':
          inc.resolved = true; inc.resolvedAt = this.t;
          this.addSaved(3, inc.x, 'Family safe!');
          for (let i = 0; i < 3; i++) this.walkers.push({ x: inc.x + rand(-10, 10), y: inc.y + rand(-10, 10) });
          u.task = null;
          break;
        case 'supplies':
          inc.resolved = true; inc.resolvedAt = this.t;
          this.hud.banner('Supplies delivered', '#7BC9CF', 1.2);
          G.Audio.pickup();
          u.task = null;
          break;
        case 'fire': {
          const h = this.homes[u.task.home];
          if (h && h.state === 'burning') { h.state = 'saved'; this.fx.burst(h.x + h.w / 2, h.y + 10, '#7BC9CF', 14, { spd: 80 }); G.Audio.eat(); }
          const next = this.homes.find((x) => x.state === 'burning');
          if (next) { u.workLeft = 8; u.task.home = this.homes.indexOf(next); }   // keep hosing the row
          else {
            const inc2 = this.incidents.fire;
            inc2.resolved = true; inc2.resolvedAt = this.t;
            this.hud.banner('Fire out!', '#aee05a', 1.3);
            u.task = null;
          }
          break;
        }
      }
      this.renderPanel();
    }

    updateSchool(dt) {
      const inc = this.incidents.school;
      if (!inc.live || inc.resolved) return;
      if (inc.trapped > 0) {
        inc.survival -= dt;
        const diggers = this.units.filter((u) => u.kind === 'rescue' && u.task && u.task.inc === 'school' && !u.path.length && !u.waiting).length;
        if (diggers > 0) {
          inc.rescueT += dt * diggers;
          if (inc.rescueT >= 10) {
            inc.rescueT -= 10; inc.trapped--;
            if (inc.nextInjured) { inc.waitingInjured++; this.hud.hint('Survivor pulled out — injured, needs an ambulance to the hospital!', 4); }
            else { this.addSaved(1, inc.x, 'Rescued!'); this.walkers.push({ x: inc.x, y: inc.y + 20 }); }
            inc.nextInjured = !inc.nextInjured;
          }
        }
        if (inc.survival <= 0) {
          this.lost += inc.trapped; inc.trapped = 0;
          this.hud.banner('Too late for some…', '#f1955a', 1.8);
          this.hud.hint('Trapped survivors can\'t wait forever. Rescue teams had to get there sooner.', 5);
          G.Audio.lose();
        }
      }
      if (inc.trapped === 0 && inc.waitingInjured === 0 && !this.units.some((u) => u.cargo > 0)) {
        inc.resolved = true; inc.resolvedAt = this.t;
        for (const u of this.units) if (u.task && u.task.inc === 'school' && !u.task.deliver) u.task = null;
        this.renderPanel();
      }
    }

    updateFire(dt) {
      const anyTruckComing = this.units.some((u) => u.kind === 'fire' && u.task && u.task.inc === 'fire');
      for (let i = 0; i < this.homes.length; i++) {
        const h = this.homes[i];
        if (h.state !== 'burning') continue;
        const beingFought = this.units.some((u) => u.task && u.task.inc === 'fire' && u.task.home === i && !u.path.length && u.workLeft > 0);
        h.burnT += dt * (beingFought ? 0.25 : 1);
        if (h.burnT > 20) {
          h.state = 'burned';
          this.fx.burst(h.x + h.w / 2, h.y + 10, '#4b4237', 16, { spd: 70 });
          const next = this.homes[i + 1] && this.homes[i + 1].state === 'intact' ? this.homes[i + 1]
            : this.homes[i - 1] && this.homes[i - 1].state === 'intact' ? this.homes[i - 1] : null;
          if (next) { next.state = 'burning'; if (!anyTruckComing) this.hud.hint('The fire is jumping between roofs!', 3.5); }
          else if (!this.homes.some((x) => x.state === 'burning')) {
            const inc = this.incidents.fire; inc.resolved = true; inc.resolvedAt = this.t;
          }
          this.renderPanel();
        }
      }
    }

    addSaved(n, x, msg) {
      this.saved += n;
      this.hud.set({ count: this.saved });
      this.fx.text(x, 90, '+' + n + ' saved', '#aee05a', { size: 18 });
      if (msg) this.hud.banner(msg, '#aee05a', 1.2);
      G.Audio.pickup();
      this.renderPanel();
    }

    allResolved() {
      return Object.values(this.incidents).every((i) => i.resolved);
    }

    /* ---------------- command panel ---------------- */
    renderPanel() {
      if (!this.dom) return;
      this.dom.fuel.style.width = clamp(this.fuel / FUEL_MAX * 100, 0, 100) + '%';
      this.dom.meds.textContent = this.meds;
      this.dom.saved.textContent = this.saved;
      const inc = this.incidents[this.selected];
      this.dom.act.innerHTML = '';
      if (!inc || inc.resolved || !inc.live) {
        this.dom.inc.innerHTML = '<p class="ops-empty">Click a flashing incident on the map to see what it needs.</p>';
        return;
      }
      const desc = {
        bridge: 'Debris blocks the only river crossing. East-side incidents are unreachable until a repair crew clears it.',
        school: `<b>${inc.trapped}</b> still trapped — survival timer running. ${inc.waitingInjured ? `<b>${inc.waitingInjured}</b> injured waiting for an ambulance.` : 'Rescue teams dig people out.'}`,
        fire: 'Flames spread to the next house every ~20s. Only the fire truck can put them out.',
        power: 'The hospital is dark. Restore the substation so patients can be treated.',
        family: 'Three people stranded on a flooded street. A rescue team can wade in.',
        supplies: 'Evacuees need food and water. Any free rescue team or the ambulance can deliver a crate.',
      }[inc.id];
      this.dom.inc.innerHTML = `<h4>${inc.name}</h4><p>${desc}</p>` +
        (inc.id === 'school' ? `<p class="ops-need">Time left: ${Math.max(0, Math.ceil(inc.survival))}s</p>` : '');
      for (const u of this.eligibleUnits(inc)) {
        const cost = this.fuelCost(u, inc.x, inc.y);
        const btn = document.createElement('button');
        btn.className = 'ops-btn';
        btn.style.background = u.kind === 'ambulance' ? '#C9784F' : u.color;
        btn.innerHTML = `<span>Send ${u.label}</span><span class="cost">${cost} fuel</span>`;
        if (cost > this.fuel) { btn.disabled = true; btn.innerHTML = `<span>${u.label}</span><span class="cost">not enough fuel</span>`; }
        btn.addEventListener('click', () => this.dispatch(u, inc));
        this.dom.act.appendChild(btn);
      }
      if (!this.eligibleUnits(inc).length) {
        const p = document.createElement('p');
        p.className = 'ops-empty'; p.style.fontSize = '12px'; p.style.fontWeight = '700';
        p.textContent = 'No suitable unit is free right now.';
        this.dom.act.appendChild(p);
      }
    }

    /* ---------------- end + report ---------------- */
    endMission() {
      if (this.over) return;
      const protectedHomes = this.homes.filter((h) => h.state !== 'burned').length;
      const infra = (this.bridgeCleared ? 1 : 0) + (this.powered ? 1 : 0);
      const school = this.incidents.school;
      const stranded = school.trapped + school.waitingInjured + this.pendingHospital + this.units.reduce((s, u) => s + u.cargo, 0);
      const failed = this.saved <= 2;
      const stars = (this.saved >= 8 && protectedHomes >= 3 && infra === 2) ? 3 : this.saved >= 5 ? 2 : 1;
      const fb = [];
      if (this.bridgeClearedAt == null) fb.push('The bridge stayed blocked all mission — the whole east side was cut off. Clearing routes is a rescue in itself.');
      else if (this.bridgeClearedAt > 70) fb.push('Units sat waiting at the blocked bridge. Send the repair crew first — open routes multiply every other unit.');
      if (this.lost > 0) fb.push(`${this.lost} trapped ${this.lost === 1 ? 'person' : 'people'} ran out of time at the school. Life-saving rescues always come first in triage.`);
      if (protectedHomes <= 2) fb.push('The fire jumped from roof to roof while the truck was elsewhere. Spreading dangers grow — hit them early.');
      if (stranded > 0) fb.push('Some survivors were pulled out but never reached treatment. A rescue only counts when the patient is safe in a working hospital.');
      if (this.fuel <= 5) fb.push('You ran the tanks dry. Every dispatch costs fuel — plan routes before you send.');
      if (!fb.length) fb.push('A textbook response: routes first, lives first, fires early, hospital powered. Bayside Town owes you one.');
      const respTime = Math.round(Math.max(...Object.values(this.incidents).map((i) => i.resolvedAt || this.t)));
      this.finish(!failed, {
        stars: failed ? 0 : stars,
        resultKicker: failed ? 'TOWN OVERWHELMED' : 'AFTER-ACTION REPORT',
        resultTitle: failed ? 'The response fell apart' : this.saved >= 8 ? 'Bayside Town pulls through!' : 'The town survives the night',
        stats: [
          ['❤️ Lives saved', `${this.saved} / 9` + (this.lost ? `  (${this.lost} lost)` : '')],
          ['🏠 Homes protected', `${protectedHomes} / 4`],
          ['⚡ Infrastructure restored', `${infra} / 2`],
          ['📦 Relief supplies', this.incidents.supplies.resolved ? 'Delivered' : 'Not delivered'],
          ['⛽ Fuel remaining', Math.max(0, Math.round(this.fuel)) + ' / ' + FUEL_MAX],
          ['⏱ Response time', respTime + 's'],
        ],
        feedback: fb,
      });
    }

    /* ================= drawing ================= */
    draw() {
      const c = this.ctx;
      c.clearRect(0, 0, this.W, this.H);
      this.drawGround(c);
      this.drawRiver(c);
      this.drawBuildings(c);
      this.drawIncidents(c);
      this.drawUnits(c);
      for (const w of this.walkers) { c.fillStyle = '#F6C9A0'; c.beginPath(); c.arc(w.x, w.y - 4, 3, 0, TAU); c.fill(); c.fillStyle = '#4E8F86'; c.fillRect(w.x - 3, w.y - 2, 6, 7); }
      this.fx.draw(c, { x: 0, y: 0 });
    }

    drawGround(c) {
      c.fillStyle = '#9CCB63'; c.fillRect(0, 0, this.W, this.H);
      // roads
      c.strokeStyle = '#8E8B84'; c.lineCap = 'round'; c.lineWidth = 22;
      const road = (pts) => { c.beginPath(); pts.forEach(([x, y], i) => i === 0 ? c.moveTo(x, y) : c.lineTo(x, y)); c.stroke(); };
      road([[HQ.x, HQ.y], [HQ.x, 330], [240, 330]]);
      road([[240, 330], [240, 170], [HOSPITAL.x + 55, 170]]);
      road([[240, 330], [BRIDGE.x - 60, 310], [BRIDGE.x + 60, 310], [SCHOOL.x + 55, 200]]);
      road([[BRIDGE.x + 60, 310], [SHELTER.x, SHELTER.y], [FLOOD.x + 70, FLOOD.y + 40]]);
      c.strokeStyle = 'rgba(246,239,221,.5)'; c.lineWidth = 2; c.setLineDash([10, 12]);
      road([[HQ.x, HQ.y], [HQ.x, 330], [240, 330], [BRIDGE.x - 60, 310], [BRIDGE.x + 60, 310], [SCHOOL.x + 55, 200]]);
      c.setLineDash([]);
      // flood zone
      c.fillStyle = 'rgba(123,201,207,.6)';
      c.beginPath(); c.roundRect(FLOOD.x, FLOOD.y, FLOOD.w, FLOOD.h, 18); c.fill();
      c.strokeStyle = 'rgba(255,255,255,.5)'; c.lineWidth = 2;
      for (let i = 0; i < 3; i++) {
        c.beginPath();
        c.moveTo(FLOOD.x + 16, FLOOD.y + 20 + i * 22);
        c.quadraticCurveTo(FLOOD.x + 45, FLOOD.y + 12 + i * 22, FLOOD.x + 74, FLOOD.y + 20 + i * 22);
        c.quadraticCurveTo(FLOOD.x + 103, FLOOD.y + 28 + i * 22, FLOOD.x + 132, FLOOD.y + 20 + i * 22);
        c.stroke();
      }
    }

    drawRiver(c) {
      c.fillStyle = '#5CB6BC'; c.fillRect(RIVER_X, 0, RIVER_W, this.H);
      c.strokeStyle = 'rgba(255,255,255,.4)'; c.lineWidth = 2;
      for (let y = 20; y < this.H; y += 60) {
        c.beginPath(); c.moveTo(RIVER_X + 8, y + Math.sin(this.time * 2 + y) * 3);
        c.quadraticCurveTo(RIVER_X + RIVER_W / 2, y + 10, RIVER_X + RIVER_W - 8, y);
        c.stroke();
      }
      // bridge deck
      c.fillStyle = '#B98A5C'; c.fillRect(RIVER_X - 8, 292, RIVER_W + 16, 36);
      c.strokeStyle = '#8A6647'; c.lineWidth = 2;
      c.strokeRect(RIVER_X - 8, 292, RIVER_W + 16, 36);
      if (!this.bridgeCleared) {
        c.fillStyle = '#6B5B49';
        for (const [dx, dy, r] of [[8, 8, 9], [24, 16, 11], [40, 6, 8], [16, 24, 7], [34, 26, 9]]) {
          c.beginPath(); c.arc(RIVER_X + dx, 296 + dy, r, 0, TAU); c.fill();
        }
      }
    }

    drawBuildings(c) {
      // HQ depot
      c.fillStyle = '#D8C89A'; c.beginPath(); c.roundRect(HQ.x - 55, HQ.y - 35, 110, 70, 10); c.fill();
      c.strokeStyle = '#8A6647'; c.lineWidth = 2; c.stroke();
      this.tag(c, 'COMMAND HQ', HQ.x, HQ.y - 44);
      // hospital
      this.building(c, HOSPITAL, '#FFFFFF', '#E05A4E');
      c.fillStyle = '#E05A4E';
      c.fillRect(HOSPITAL.x + 47, HOSPITAL.y + 18, 16, 5); c.fillRect(HOSPITAL.x + 52.5, HOSPITAL.y + 12.5, 5, 16);
      this.tag(c, this.powered ? 'HOSPITAL' : 'HOSPITAL · NO POWER', HOSPITAL.x + HOSPITAL.w / 2, HOSPITAL.y - 10, this.powered ? undefined : '#E05A4E');
      if (!this.powered && Math.floor(this.time * 2) % 2) { c.fillStyle = 'rgba(30,30,40,.35)'; c.fillRect(HOSPITAL.x, HOSPITAL.y, HOSPITAL.w, HOSPITAL.h); }
      if (this.pendingHospital) this.tag(c, this.pendingHospital + ' waiting', HOSPITAL.x + HOSPITAL.w / 2, HOSPITAL.y + HOSPITAL.h + 12, '#E2A41C');
      // substation
      this.building(c, SUBSTATION, '#CBD6DE', '#8FA3B3');
      c.strokeStyle = '#E2A41C'; c.lineWidth = 2;
      c.beginPath(); c.moveTo(SUBSTATION.x + 22, SUBSTATION.y + 6); c.lineTo(SUBSTATION.x + 16, SUBSTATION.y + 18); c.lineTo(SUBSTATION.x + 26, SUBSTATION.y + 18); c.lineTo(SUBSTATION.x + 20, SUBSTATION.y + 30); c.stroke();
      // school (collapsed)
      const s = this.incidents.school;
      c.fillStyle = '#9C8E7B';
      c.beginPath();
      c.moveTo(SCHOOL.x - 4, SCHOOL.y + SCHOOL.h);
      c.lineTo(SCHOOL.x + 20, SCHOOL.y + 20); c.lineTo(SCHOOL.x + 50, SCHOOL.y + 42); c.lineTo(SCHOOL.x + 80, SCHOOL.y + 14); c.lineTo(SCHOOL.x + SCHOOL.w + 4, SCHOOL.y + SCHOOL.h);
      c.closePath(); c.fill();
      c.fillStyle = '#B5A78F'; c.fillRect(SCHOOL.x + 26, SCHOOL.y + 40, 18, 9); c.fillRect(SCHOOL.x + 66, SCHOOL.y + 30, 20, 9);
      this.tag(c, 'SCHOOL · ' + (s.trapped > 0 ? s.trapped + ' TRAPPED' : 'CLEARED'), SCHOOL.x + SCHOOL.w / 2, SCHOOL.y - 10, s.trapped > 0 ? '#E05A4E' : undefined);
      if (s.live && s.trapped > 0) {   // survival bar
        c.fillStyle = 'rgba(20,24,32,.6)'; c.fillRect(SCHOOL.x, SCHOOL.y + SCHOOL.h + 6, SCHOOL.w, 7);
        c.fillStyle = s.survival < 40 ? '#E05A4E' : '#E2A41C';
        c.fillRect(SCHOOL.x, SCHOOL.y + SCHOOL.h + 6, SCHOOL.w * clamp(s.survival / 150, 0, 1), 7);
      }
      if (s.waitingInjured > 0) {
        for (let i = 0; i < s.waitingInjured; i++) {
          c.fillStyle = '#F6C9A0'; c.beginPath(); c.arc(SCHOOL.x + 14 + i * 14, SCHOOL.y + SCHOOL.h + 26, 4, 0, TAU); c.fill();
          c.fillStyle = '#E05A4E'; c.fillRect(SCHOOL.x + 10 + i * 14, SCHOOL.y + SCHOOL.h + 32, 8, 3);
        }
      }
      // homes row
      for (const h of this.homes) {
        const colors = { intact: ['#F2E3C8', '#D6653B'], burning: ['#F2E3C8', '#D6653B'], saved: ['#DCE9E4', '#4E8F86'], burned: ['#5b5148', '#3d362c'] };
        this.building(c, h, colors[h.state][0], colors[h.state][1]);
        if (h.state === 'burning') {
          for (let i = 0; i < 3; i++) {
            const fx = h.x + 10 + i * 14, fh = 10 + Math.sin(this.time * 9 + i * 2) * 4;
            c.fillStyle = '#EE6A1F';
            c.beginPath(); c.moveTo(fx - 5, h.y + 4); c.quadraticCurveTo(fx, h.y - fh - 8, fx + 5, h.y + 4); c.closePath(); c.fill();
            c.fillStyle = '#FFD24A';
            c.beginPath(); c.moveTo(fx - 2.5, h.y + 4); c.quadraticCurveTo(fx, h.y - fh / 2 - 4, fx + 2.5, h.y + 4); c.closePath(); c.fill();
          }
        }
        if (h.state === 'burned') { c.fillStyle = 'rgba(60,54,44,.8)'; c.beginPath(); c.arc(h.x + h.w / 2, h.y - 4, 8 + Math.sin(this.time * 2) * 2, 0, TAU); c.fill(); }
      }
      this.tag(c, 'HOMES', 240, 388);
      // shelter tent
      c.fillStyle = '#13A597';
      c.beginPath(); c.moveTo(SHELTER.x - 30, SHELTER.y + 16); c.lineTo(SHELTER.x, SHELTER.y - 20); c.lineTo(SHELTER.x + 30, SHELTER.y + 16); c.closePath(); c.fill();
      c.fillStyle = '#FFF6E3';
      c.beginPath(); c.moveTo(SHELTER.x - 8, SHELTER.y + 16); c.lineTo(SHELTER.x, SHELTER.y - 4); c.lineTo(SHELTER.x + 8, SHELTER.y + 16); c.closePath(); c.fill();
      this.tag(c, 'SHELTER', SHELTER.x, SHELTER.y + 30);
      this.tag(c, 'FLOODED STREET', FLOOD.x + FLOOD.w / 2, FLOOD.y - 10);
    }

    building(c, b, body, roof) {
      c.fillStyle = body;
      c.beginPath(); c.roundRect(b.x, b.y, b.w, b.h, 6); c.fill();
      c.strokeStyle = 'rgba(43,36,23,.25)'; c.lineWidth = 1.5; c.stroke();
      c.fillStyle = roof; c.fillRect(b.x, b.y, b.w, 9);
    }

    drawIncidents(c) {
      for (const key in this.incidents) {
        const inc = this.incidents[key];
        if (!inc.live || inc.resolved) continue;
        const pulse = 1 + Math.sin(this.time * 5) * 0.18;
        const sel = this.selected === inc.id;
        c.fillStyle = inc.color;
        c.globalAlpha = 0.25;
        c.beginPath(); c.arc(inc.x, inc.y, 26 * pulse, 0, TAU); c.fill();
        c.globalAlpha = 1;
        c.beginPath(); c.arc(inc.x, inc.y, 13, 0, TAU); c.fill();
        c.strokeStyle = sel ? '#2B2622' : '#fff'; c.lineWidth = sel ? 3 : 2; c.stroke();
        c.fillStyle = '#fff'; c.font = '900 14px Nunito, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('!', inc.x, inc.y + 0.5);
      }
    }

    drawUnits(c) {
      for (const u of this.units) {
        c.save(); c.translate(u.x, u.y);
        c.fillStyle = 'rgba(30,30,20,.2)';
        c.beginPath(); c.ellipse(0, 7, 11, 4, 0, 0, TAU); c.fill();
        c.fillStyle = u.kind === 'ambulance' ? '#FFF6E3' : u.color;
        c.beginPath(); c.roundRect(-12, -8, 24, 15, 4); c.fill();
        c.strokeStyle = 'rgba(43,36,23,.35)'; c.lineWidth = 1.5; c.stroke();
        c.fillStyle = '#2B2622';
        c.beginPath(); c.arc(-6, 8, 3, 0, TAU); c.arc(6, 8, 3, 0, TAU); c.fill();
        if (u.kind === 'ambulance') { c.fillStyle = '#E05A4E'; c.fillRect(-1.5, -6, 3, 9); c.fillRect(-4.5, -3, 9, 3); }
        else { c.fillStyle = '#fff'; c.font = '900 9px Nunito, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText({ rescue: 'R', fire: 'F', repair: 'C', power: 'P' }[u.kind], 0, 0); }
        // working spinner / waiting alert
        if (u.workLeft > 0) {
          c.strokeStyle = '#fff'; c.lineWidth = 2.5;
          c.beginPath(); c.arc(0, -16, 7, this.time * 4, this.time * 4 + 4); c.stroke();
        } else if (u.waiting) {
          c.fillStyle = '#E05A4E'; c.font = '900 15px Nunito, sans-serif'; c.textAlign = 'center';
          c.fillText('!', 0, -16 + Math.sin(this.time * 6) * 2);
        }
        c.restore();
      }
    }

    tag(c, str, x, y, color) {
      c.font = '900 10.5px Nunito, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
      const w = c.measureText(str).width + 10;
      c.fillStyle = 'rgba(20,24,32,.62)';
      c.beginPath(); c.roundRect(x - w / 2, y - 8, w, 16, 6); c.fill();
      c.fillStyle = color || '#FFF6E3'; c.fillText(str, x, y + 0.5);
    }
  }

  G.LevelClasses.Level3 = Level3;
})(window);
