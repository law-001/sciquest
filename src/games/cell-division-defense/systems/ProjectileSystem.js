const PROJ_COLOR = {
  lysosome:      0xFFEE00,
  proteinKinase: 0xFFD700,
  repairEnzyme:  0x00FF88,
};

class ProjectileSystem {
  constructor(scene) {
    this.scene = scene;
    this.projectiles = [];
    this.hitCallback = null;
  }

  // enemy is the full enemy object { sprite, alive, def, hp, … }
  fire(fromX, fromY, enemy, towerDef) {
    const color = PROJ_COLOR[towerDef.id] ?? 0xffffff;
    const sprite = this.scene.add.arc(fromX, fromY, 6, 0, 360, false, color, 1);
    sprite.setDepth(8);

    // Scale projectile speed with the cell: on mobile the engagement distances
    // shrink with entityScale, so a fixed px/s speed makes projectiles hit
    // almost instantly. Scaling keeps travel time roughly constant.
    const speed = 320 * (this.scene.entityScale ?? 1);
    this.projectiles.push({ sprite, target: enemy, speed, def: towerDef });
  }

  update(delta) {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];

      // Target died or sprite was destroyed by another hit
      if (!p.target.alive || !p.target.sprite?.active) {
        p.sprite.destroy();
        this.projectiles.splice(i, 1);
        continue;
      }

      const tx = p.target.sprite.x;
      const ty = p.target.sprite.y;
      const dx = tx - p.sprite.x;
      const dy = ty - p.sprite.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 8) {
        this._onHit(p, i);
        continue;
      }

      const step = (p.speed * delta) / 1000;
      p.sprite.x += (dx / dist) * step;
      p.sprite.y += (dy / dist) * step;
    }
  }

  registerHitCallback(fn) {
    this.hitCallback = fn;
  }

  // ── Private ───────────────────────────────────────────────────────────────

  _onHit(projectile, index) {
    const { target: enemy, def } = projectile;
    const hx = projectile.sprite.x;
    const hy = projectile.sprite.y;

    this.hitCallback?.(enemy, def);

    // Splash — lysosome upgrade (splash:60)
    if (def.splash) {
      const enemies = this.scene.enemySystem?.enemies ?? [];
      for (const e of enemies) {
        if (!e.alive || e === enemy) continue;
        const dx = e.sprite.x - hx;
        const dy = e.sprite.y - hy;
        if (Math.sqrt(dx * dx + dy * dy) <= def.splash) {
          // Pass def without splash to avoid recursive splash calls
          this.hitCallback?.(e, { ...def, splash: 0 });
        }
      }
    }

    this._spawnBurst(hx, hy, def.id);
    projectile.sprite.destroy();
    this.projectiles.splice(index, 1);
  }

  _spawnBurst(x, y, towerId) {
    const color = PROJ_COLOR[towerId] ?? 0xffffff;
    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2 + Math.random() * 1.2;
      const travelDist = 22 + Math.random() * 18;
      const dot = this.scene.add.arc(x, y, 3, 0, 360, false, color, 0.9);
      dot.setDepth(9);
      this.scene.tweens.add({
        targets: dot,
        x: x + Math.cos(angle) * travelDist,
        y: y + Math.sin(angle) * travelDist,
        alpha: { from: 0.9, to: 0 },
        scaleX: { from: 1, to: 0.2 },
        scaleY: { from: 1, to: 0.2 },
        duration: 260,
        ease: 'Quad.easeOut',
        onComplete: () => dot.destroy(),
      });
    }
  }
}

export default ProjectileSystem;
