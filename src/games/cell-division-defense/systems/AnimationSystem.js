const COMIC_LYSOSOME     = ['ZAP!', 'SPLAT!', 'ACID!'];
const COMIC_KINASE       = ['TAGGED!', '~P!', 'KINASE!', 'ACTIVATE!'];
const COMIC_REPAIR       = ['PATCHED!', 'FIXED!', 'REPAIR!', 'HEALED!'];

class AnimationSystem {
  constructor(scene) {
    this.scene = scene;
  }

  // ── Tower attacks ─────────────────────────────────────────────────────────

  playTowerAttack(towerId, fromX, fromY, targetX, targetY) {
    if (this.scene.reducedMotion) return;
    if (towerId === 'lysosome')      this._lysosomeAttack(fromX, fromY, targetX, targetY);
    if (towerId === 'proteinKinase') this._proteinKinaseAttack(fromX, fromY, targetX, targetY);
    if (towerId === 'repairEnzyme')  this._repairEnzymeAttack(fromX, fromY, targetX, targetY);
  }

  _lysosomeAttack(fromX, fromY, targetX, targetY) {
    const s = this.scene;

    // Squash/stretch body flash
    const blob = s.add.arc(fromX, fromY, 12, 0, 360, false, 0xFF8C00, 0.85);
    blob.setDepth(9);
    s.tweens.add({
      targets: blob,
      scaleX: { from: 0.88, to: 1.15 },
      scaleY: { from: 1.12, to: 0.85 },
      yoyo: true,
      duration: 120,
      ease: 'Sine.easeInOut',
      onComplete: () => blob.destroy(),
    });

    // Membrane spikes — 8 lines radiating outward
    const spikes = s.add.graphics();
    spikes.setDepth(9);
    spikes.lineStyle(1.5, 0xFFD28C, 0.9);
    for (let i = 0; i < 8; i++) {
      const a  = (i / 8) * Math.PI * 2;
      spikes.lineBetween(
        fromX + Math.cos(a) * 12,
        fromY + Math.sin(a) * 12,
        fromX + Math.cos(a) * 22,
        fromY + Math.sin(a) * 22,
      );
    }
    s.tweens.add({
      targets: spikes,
      alpha: { from: 0.9, to: 0 },
      duration: 200,
      ease: 'Quad.easeOut',
      onComplete: () => spikes.destroy(),
    });

    // Enzyme spray — 5 arcs toward target
    const dx = targetX - fromX;
    const dy = targetY - fromY;
    const baseAngle = Math.atan2(dy, dx);
    for (let i = 0; i < 5; i++) {
      const spread = (i - 2) * 0.22;
      const a  = baseAngle + spread;
      const dist = 28 + i * 6;
      const dot = s.add.arc(fromX + Math.cos(a) * 8, fromY + Math.sin(a) * 8, 7, 0, 360, false, 0xFFEE00, 0.9);
      dot.setDepth(9);
      s.tweens.add({
        targets: dot,
        x: fromX + Math.cos(a) * dist,
        y: fromY + Math.sin(a) * dist,
        alpha: { from: 0.9, to: 0 },
        scaleX: { from: 1, to: 0.3 },
        scaleY: { from: 1, to: 0.3 },
        duration: 220,
        ease: 'Quad.easeOut',
        onComplete: () => dot.destroy(),
      });
    }

    // 8 burst particles at target
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const p = s.add.arc(targetX, targetY, 4, 0, 360, false, 0xFFEE00, 0.85);
      p.setDepth(9);
      s.tweens.add({
        targets: p,
        x: targetX + Math.cos(a) * (20 + Math.random() * 14),
        y: targetY + Math.sin(a) * (20 + Math.random() * 14),
        alpha: { from: 0.85, to: 0 },
        scaleX: { from: 1, to: 0.2 },
        scaleY: { from: 1, to: 0.2 },
        duration: 280,
        ease: 'Quad.easeOut',
        onComplete: () => p.destroy(),
      });
    }

    this._comicWord(targetX, targetY - 14, COMIC_LYSOSOME, '#FFD700');
  }

  _proteinKinaseAttack(fromX, fromY, targetX, targetY) {
    const s = this.scene;

    // Shockwave ring
    const ring = s.add.graphics();
    ring.setDepth(9);
    ring.lineStyle(2, 0x0000FF, 0.8);
    ring.strokeCircle(targetX, targetY, 8);
    s.tweens.add({
      targets: ring,
      scaleX: { from: 0.2, to: 5 },
      scaleY: { from: 0.2, to: 5 },
      alpha: { from: 0.8, to: 0 },
      duration: 340,
      ease: 'Quad.easeOut',
      onComplete: () => ring.destroy(),
    });

    // ~P stamp text
    const stamp = s.add.text(targetX, targetY - 8, '~P', {
      fontSize: '14px',
      fontStyle: 'bold',
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 3,
    });
    stamp.setOrigin(0.5, 0.5);
    stamp.setDepth(10);
    s.tweens.add({
      targets: stamp,
      scaleX: { from: 0.2, to: 1.4 },
      scaleY: { from: 0.2, to: 1.4 },
      alpha: { from: 1, to: 0 },
      duration: 420,
      ease: 'Back.easeOut',
      onComplete: () => stamp.destroy(),
    });

    // 10 gold particles
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      const p = s.add.arc(targetX, targetY, 3, 0, 360, false, 0xFFD700, 0.9);
      p.setDepth(9);
      s.tweens.add({
        targets: p,
        x: targetX + Math.cos(a) * (16 + Math.random() * 16),
        y: targetY + Math.sin(a) * (16 + Math.random() * 16),
        alpha: { from: 0.9, to: 0 },
        scaleX: { from: 1, to: 0.2 },
        scaleY: { from: 1, to: 0.2 },
        duration: 300,
        ease: 'Quad.easeOut',
        onComplete: () => p.destroy(),
      });
    }

    // 3 electric zigzag arcs from tower toward target
    const dx = targetX - fromX;
    const dy = targetY - fromY;
    for (let arc = 0; arc < 3; arc++) {
      const g = s.add.graphics();
      g.setDepth(9);
      g.lineStyle(1.2, 0x0022FF, 0.75);
      const steps = 6;
      let px = fromX;
      let py = fromY;
      g.moveTo(px, py);
      for (let step = 1; step <= steps; step++) {
        const t = step / steps;
        const nx = fromX + dx * t + (Math.random() - 0.5) * 18;
        const ny = fromY + dy * t + (Math.random() - 0.5) * 18;
        g.lineTo(nx, ny);
        px = nx;
        py = ny;
      }
      g.strokePath();
      s.tweens.add({
        targets: g,
        alpha: { from: 0.75, to: 0 },
        duration: 160 + arc * 40,
        ease: 'Linear',
        onComplete: () => g.destroy(),
      });
    }

    this._comicWord(targetX, targetY - 16, COMIC_KINASE, '#A0C8FF');
  }

  _repairEnzymeAttack(fromX, fromY, targetX, targetY) {
    const s = this.scene;

    const dx = targetX - fromX;
    const dy = targetY - fromY;

    // Green beam from tower toward target
    const beamW = 6;
    const beam = s.add.graphics();
    beam.setDepth(8);
    beam.lineStyle(beamW, 0x00FF88, 0.35);
    beam.lineBetween(fromX, fromY, targetX, targetY);

    s.tweens.add({
      targets: beam,
      alpha: { from: 0.7, to: 0 },
      duration: 260,
      ease: 'Quad.easeOut',
      onComplete: () => beam.destroy(),
    });

    // 5 DNA helix dots scrolling along the beam
    const beamAngle = Math.atan2(dy, dx);
    for (let i = 0; i < 5; i++) {
      const t   = i / 4;
      const hx  = fromX + dx * t;
      const hy  = fromY + dy * t;
      const perp = beamAngle + Math.PI * 0.5;
      const side = (i % 2 === 0 ? 1 : -1) * 4;
      const col  = i % 2 === 0 ? 0xFF9999 : 0x9999FF;
      const dot  = s.add.arc(hx + Math.cos(perp) * side, hy + Math.sin(perp) * side, 3, 0, 360, false, col, 0.9);
      dot.setDepth(10);
      s.tweens.add({
        targets: dot,
        x: targetX + Math.cos(perp) * side,
        y: targetY + Math.sin(perp) * side,
        alpha: { from: 0.9, to: 0 },
        duration: 220 + i * 20,
        ease: 'Sine.easeIn',
        onComplete: () => dot.destroy(),
      });
    }

    // 12 green burst particles at target
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const p = s.add.arc(targetX, targetY, 3, 0, 360, false, 0x00FF88, 0.85);
      p.setDepth(9);
      s.tweens.add({
        targets: p,
        x: targetX + Math.cos(a) * (12 + Math.random() * 14),
        y: targetY + Math.sin(a) * (12 + Math.random() * 14),
        alpha: { from: 0.85, to: 0 },
        duration: 260,
        ease: 'Quad.easeOut',
        onComplete: () => p.destroy(),
      });
    }

    // 4 patch flakes (cross shapes) at impact
    for (let i = 0; i < 4; i++) {
      const a  = (i / 4) * Math.PI * 2;
      const px = targetX + Math.cos(a) * 10;
      const py = targetY + Math.sin(a) * 10;
      const flake = s.add.graphics();
      flake.setDepth(9);
      flake.lineStyle(2, 0x00FF88, 0.8);
      flake.lineBetween(px - 4, py, px + 4, py);
      flake.lineBetween(px, py - 4, px, py + 4);
      s.tweens.add({
        targets: flake,
        alpha: { from: 0.8, to: 0 },
        y: py - 12,
        duration: 300,
        ease: 'Sine.easeOut',
        onComplete: () => flake.destroy(),
      });
    }

    this._comicWord(targetX, targetY - 16, COMIC_REPAIR, '#00FF88');
  }

  // ── Enemy walk effects ────────────────────────────────────────────────────

  playViralHijackerWalk(enemy, frameCount) {
    if (this.scene.reducedMotion || !enemy.alive) return;
    const { x, y } = enemy.sprite;

    // Ghost trail every 18 frames
    if (frameCount % 18 === 0) {
      const ghost = this.scene.add.graphics();
      ghost.setDepth(4);
      ghost.lineStyle(1.5, 0x9933FF, 0.15);
      // Hex outline at current position
      for (let i = 0; i < 6; i++) {
        const a0 = (i / 6) * Math.PI * 2;
        const a1 = ((i + 1) / 6) * Math.PI * 2;
        ghost.lineBetween(
          x + Math.cos(a0) * 11,
          y + Math.sin(a0) * 11,
          x + Math.cos(a1) * 11,
          y + Math.sin(a1) * 11,
        );
      }
      this.scene.tweens.add({
        targets: ghost,
        alpha: { from: 0.15, to: 0 },
        duration: 380,
        ease: 'Linear',
        onComplete: () => ghost.destroy(),
      });
    }

    // Ground corruption every 30 frames
    if (frameCount % 30 === 0) {
      const mark = this.scene.add.graphics();
      mark.setDepth(3);
      mark.lineStyle(1, 0x39FF14, 0.55);
      for (let i = 0; i < 6; i++) {
        const a0 = (i / 6) * Math.PI * 2;
        const a1 = ((i + 1) / 6) * Math.PI * 2;
        mark.lineBetween(
          x + Math.cos(a0) * 8,
          y + Math.sin(a0) * 8,
          x + Math.cos(a1) * 8,
          y + Math.sin(a1) * 8,
        );
      }
      this.scene.tweens.add({
        targets: mark,
        alpha: { from: 0.55, to: 0 },
        duration: 800,
        ease: 'Linear',
        onComplete: () => mark.destroy(),
      });
    }
  }

  playRadiationPulseFloat(enemy, frameCount) {
    if (this.scene.reducedMotion || !enemy.alive) return;

    // Expanding dashed ring every 22 frames
    if (frameCount % 22 !== 0) return;
    const { x, y } = enemy.sprite;
    const ring = this.scene.add.graphics();
    ring.setDepth(4);
    ring.lineStyle(2, 0xFFB300, 0.5);
    ring.strokeCircle(x, y, 42);
    this.scene.tweens.add({
      targets: ring,
      scaleX: { from: 1, to: 2.15 },
      scaleY: { from: 1, to: 2.15 },
      alpha: { from: 0.5, to: 0 },
      duration: 500,
      ease: 'Quad.easeOut',
      onComplete: () => ring.destroy(),
    });
  }

  playToxinDropletBounce(enemy, squashAmount) {
    if (this.scene.reducedMotion || !enemy.alive) return;
    if (squashAmount < 12) return;

    const { x, y } = enemy.sprite;

    // Splash ring
    const ring = this.scene.add.graphics();
    ring.setDepth(4);
    ring.lineStyle(2, 0x39FF14, 0.6);
    ring.strokeEllipse(x, y, 16, 8);
    this.scene.tweens.add({
      targets: ring,
      scaleX: { from: 0.5, to: 5 },
      scaleY: { from: 0.5, to: 2 },
      alpha: { from: 0.6, to: 0 },
      duration: 320,
      ease: 'Quad.easeOut',
      onComplete: () => ring.destroy(),
    });

    // 6 green droplets with gravity
    for (let i = 0; i < 6; i++) {
      const a  = (i / 6) * Math.PI * 2;
      const vx = Math.cos(a) * (18 + Math.random() * 12);
      const vy = Math.sin(a) * (18 + Math.random() * 12) - 10;
      const drop = this.scene.add.arc(x, y, 3, 0, 360, false, 0x39FF14, 0.8);
      drop.setDepth(5);
      this.scene.tweens.add({
        targets: drop,
        x: x + vx,
        y: y + vy + 18,
        alpha: { from: 0.8, to: 0 },
        duration: 380,
        ease: 'Quad.easeIn',
        onComplete: () => drop.destroy(),
      });
    }
  }

  // ── Enemy death ───────────────────────────────────────────────────────────

  playEnemyDeath(enemyType, x, y) {
    if (this.scene.reducedMotion) return;
    if (enemyType === 'viralHijacker')   this._viralHijackerDeath(x, y);
    if (enemyType === 'radiationPulse')  this._radiationPulseDeath(x, y);
    if (enemyType === 'toxinDroplet')    this._toxinDropletDeath(x, y);
  }

  _viralHijackerDeath(x, y) {
    const s = this.scene;

    // 6 shard triangles
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const g = s.add.graphics();
      g.setDepth(9);
      g.fillStyle(0x9933FF, 0.75);
      const tip  = { x: x + Math.cos(a) * 18, y: y + Math.sin(a) * 18 };
      const l    = { x: x + Math.cos(a + 0.4) * 8, y: y + Math.sin(a + 0.4) * 8 };
      const r    = { x: x + Math.cos(a - 0.4) * 8, y: y + Math.sin(a - 0.4) * 8 };
      g.fillTriangle(tip.x, tip.y, l.x, l.y, r.x, r.y);
      s.tweens.add({
        targets: g,
        x: Math.cos(a) * 20,
        y: Math.sin(a) * 20,
        alpha: { from: 0.75, to: 0 },
        duration: 360,
        ease: 'Quad.easeOut',
        onComplete: () => g.destroy(),
      });
    }

    // 8 green corruption particles
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const p = s.add.arc(x, y, 3, 0, 360, false, 0x39FF14, 0.8);
      p.setDepth(9);
      s.tweens.add({
        targets: p,
        x: x + Math.cos(a) * (16 + Math.random() * 12),
        y: y + Math.sin(a) * (16 + Math.random() * 12),
        alpha: { from: 0.8, to: 0 },
        duration: 320,
        ease: 'Quad.easeOut',
        onComplete: () => p.destroy(),
      });
    }

    // Corruption splash ring
    const splash = s.add.graphics();
    splash.setDepth(8);
    splash.lineStyle(2, 0x39FF14, 0.5);
    splash.strokeCircle(x, y, 14);
    s.tweens.add({
      targets: splash,
      scaleX: { from: 1, to: 3.5 },
      scaleY: { from: 1, to: 3.5 },
      alpha: { from: 0.5, to: 0 },
      duration: 420,
      ease: 'Quad.easeOut',
      onComplete: () => splash.destroy(),
    });
  }

  _radiationPulseDeath(x, y) {
    const s = this.scene;

    // 8 fin flares
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const g = s.add.graphics();
      g.setDepth(9);
      g.lineStyle(2, 0xFFB300, 0.8);
      g.lineBetween(x + Math.cos(a) * 12, y + Math.sin(a) * 12, x + Math.cos(a) * 38, y + Math.sin(a) * 38);
      s.tweens.add({
        targets: g,
        alpha: { from: 0.8, to: 0 },
        scaleX: { from: 1, to: 1.4 },
        scaleY: { from: 1, to: 1.4 },
        duration: 380,
        ease: 'Quad.easeOut',
        onComplete: () => g.destroy(),
      });
    }

    // AOE shockwave r=80
    const shockwave = s.add.graphics();
    shockwave.setDepth(8);
    shockwave.lineStyle(3, 0xFFB300, 0.7);
    shockwave.strokeCircle(x, y, 20);
    s.tweens.add({
      targets: shockwave,
      scaleX: { from: 0.25, to: 4 },
      scaleY: { from: 0.25, to: 4 },
      alpha: { from: 0.7, to: 0 },
      duration: 500,
      ease: 'Quad.easeOut',
      onComplete: () => shockwave.destroy(),
    });

    // 5 crack flares
    for (let i = 0; i < 5; i++) {
      const a   = (i / 5) * Math.PI * 2;
      const len = 20 + Math.random() * 18;
      const g   = s.add.graphics();
      g.setDepth(9);
      g.lineStyle(1.5, 0xFFEE00, 0.75);
      g.lineBetween(x, y, x + Math.cos(a) * len, y + Math.sin(a) * len);
      s.tweens.add({
        targets: g,
        alpha: { from: 0.75, to: 0 },
        duration: 280,
        ease: 'Linear',
        onComplete: () => g.destroy(),
      });
    }

    // Eye flash — white circle
    const flash = s.add.arc(x, y, 20, 0, 360, false, 0xffffff, 0.6);
    flash.setDepth(10);
    s.tweens.add({
      targets: flash,
      alpha: { from: 0.6, to: 0 },
      scaleX: { from: 1, to: 2 },
      scaleY: { from: 1, to: 2 },
      duration: 200,
      ease: 'Quad.easeOut',
      onComplete: () => flash.destroy(),
    });

    // Emit AOE blast so CellDefenseScene can apply damage
    s.bus?.emit('aoeBlast', { x, y, radius: 80 });
  }

  _toxinDropletDeath(x, y) {
    const s = this.scene;

    // Splat
    const splat = s.add.graphics();
    splat.setDepth(8);
    splat.fillStyle(0x39FF14, 0.5);
    splat.fillCircle(x, y, 24);
    s.tweens.add({
      targets: splat,
      alpha: { from: 0.5, to: 0 },
      scaleX: { from: 1, to: 2.2 },
      scaleY: { from: 1, to: 1.2 },
      duration: 400,
      ease: 'Quad.easeOut',
      onComplete: () => splat.destroy(),
    });

    // Splash ring
    const ring = s.add.graphics();
    ring.setDepth(9);
    ring.lineStyle(2, 0x39FF14, 0.6);
    ring.strokeCircle(x, y, 12);
    s.tweens.add({
      targets: ring,
      scaleX: { from: 1, to: 4 },
      scaleY: { from: 1, to: 2.5 },
      alpha: { from: 0.6, to: 0 },
      duration: 360,
      ease: 'Quad.easeOut',
      onComplete: () => ring.destroy(),
    });

    // 10 droplets
    for (let i = 0; i < 10; i++) {
      const a  = (i / 10) * Math.PI * 2;
      const d  = 18 + Math.random() * 18;
      const p  = s.add.arc(x, y, 3, 0, 360, false, 0x39FF14, 0.8);
      p.setDepth(9);
      s.tweens.add({
        targets: p,
        x: x + Math.cos(a) * d,
        y: y + Math.sin(a) * d + 12,
        alpha: { from: 0.8, to: 0 },
        duration: 340,
        ease: 'Quad.easeIn',
        onComplete: () => p.destroy(),
      });
    }

    // Slime pool
    const pool = s.add.graphics();
    pool.setDepth(3);
    pool.fillStyle(0x39FF14, 0.22);
    pool.fillEllipse(x, y + 4, 40, 14);
    s.tweens.add({
      targets: pool,
      alpha: { from: 0.22, to: 0 },
      duration: 1400,
      ease: 'Linear',
      onComplete: () => pool.destroy(),
    });

    // Emit tower silence event
    s.bus?.emit('towerSilence', { x, y });
  }

  // ── Enemy reach nucleus ───────────────────────────────────────────────────

  playEnemyReachNucleus(enemyType, nucleusX, nucleusY) {
    if (this.scene.reducedMotion) return;
    if (enemyType === 'viralHijacker') this._viralHijackerInject(nucleusX, nucleusY);
  }

  _viralHijackerInject(nx, ny) {
    const s = this.scene;

    // Injection beam toward nucleus center
    const beam = s.add.graphics();
    beam.setDepth(9);
    beam.lineStyle(3, 0x9933FF, 0.75);
    beam.lineBetween(nx, ny, nx, ny - 28);
    s.tweens.add({
      targets: beam,
      alpha: { from: 0.75, to: 0 },
      duration: 300,
      ease: 'Linear',
      onComplete: () => beam.destroy(),
    });

    // DNA dots injecting downward
    for (let i = 0; i < 5; i++) {
      const col  = i % 2 === 0 ? 0xFF9999 : 0x9999FF;
      const dot  = s.add.arc(nx + (i % 2 === 0 ? -3 : 3), ny - 28 + i * 5, 3, 0, 360, false, col, 0.9);
      dot.setDepth(10);
      s.tweens.add({
        targets: dot,
        y: dot.y + 32,
        alpha: { from: 0.9, to: 0 },
        duration: 260 + i * 20,
        ease: 'Sine.easeIn',
        onComplete: () => dot.destroy(),
      });
    }

    // Nucleus mutation flash
    const flash = s.add.arc(nx, ny, 20, 0, 360, false, 0x9933FF, 0.5);
    flash.setDepth(10);
    s.tweens.add({
      targets: flash,
      alpha: { from: 0.5, to: 0 },
      scaleX: { from: 1, to: 2.4 },
      scaleY: { from: 1, to: 2.4 },
      duration: 350,
      ease: 'Quad.easeOut',
      onComplete: () => flash.destroy(),
    });
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  _comicWord(x, y, words, color) {
    const word = words[Math.floor(Math.random() * words.length)];
    const t    = this.scene.add.text(x, y, word, {
      fontSize: '11px',
      fontStyle: 'bold',
      color,
      stroke: '#000000',
      strokeThickness: 2,
    });
    t.setOrigin(0.5, 1);
    t.setDepth(11);
    this.scene.tweens.add({
      targets: t,
      y: y - 28,
      alpha: { from: 1, to: 0 },
      scaleX: { from: 1.3, to: 1 },
      scaleY: { from: 1.3, to: 1 },
      duration: 700,
      ease: 'Sine.easeOut',
      onComplete: () => t.destroy(),
    });
  }
}

export default AnimationSystem;
