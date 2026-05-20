import Phaser from 'phaser';
import { ENEMIES } from '../data/enemies';

class EnemySystem {
  constructor(scene, breachPoints, cellCX, cellCY, cellR) {
    this.scene = scene;
    this.cellCX = cellCX;
    this.cellCY = cellCY;
    this.cellR  = cellR;
    this.enemies = [];
    this.towerSystem = null;
    this.animationSystem = null;
    this._pendingSpawns = 0;
    this._frameCount = 0;

    this._spawnTimers = [];
    this.rebuildPaths(breachPoints);
  }

  rebuildPaths(breachPoints) {
    this.paths = breachPoints.map(({ x: bx, y: by }) => {
      const midX = (bx + this.cellCX) / 2;
      const midY = (by + this.cellCY) / 2;
      const dx = bx - this.cellCX;
      const dy = by - this.cellCY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const ctrlX = midX + (dx / dist) * this.cellR * 0.35;
      const ctrlY = midY + (dy / dist) * this.cellR * 0.35;

      const path = new Phaser.Curves.Path(bx, by);
      path.quadraticBezierTo(this.cellCX, this.cellCY, ctrlX, ctrlY);
      return { path, startX: bx, startY: by };
    });
  }

  spawnEnemy(type, breachIndex) {
    const def = ENEMIES[type];
    if (!def) return null;

    const { path, startX, startY } = this.paths[breachIndex % this.paths.length];
    const pathLength = path.getLength();
    const pathDuration = (pathLength / def.speed) * 1000;

    const follower = this.scene.add.follower(path, startX, startY, type);
    follower.setDepth(5);
    follower.setScale(1.3 * (this.scene.entityScale ?? 1));
    // Force GPU refresh for canvas-backed textures (same issue as tower images)
    const texSrc = this.scene.textures.get(type)?.source?.[0];
    if (texSrc?.update) texSrc.update();

    const hpBar = this.scene.add.graphics();
    hpBar.setDepth(7);

    const label = this.scene.add.text(startX, startY - 46, def.displayName, {
      fontSize: '8px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2,
    });
    label.setOrigin(0.5, 1);
    label.setDepth(8);

    const enemy = {
      sprite: follower,
      hpBar,
      label,
      def,
      hp: def.hp,
      maxHp: def.hp,
      type,
      breachIndex,
      alive: true,
      // Tower-attack state
      attackCooldownMs: 0,
      pathPaused: false,
    };

    this.enemies.push(enemy);

    follower.startFollow({
      duration: pathDuration,
      repeat: 0,
      rotateToPath: false,
      onComplete: () => this._onReachNucleus(enemy),
    });

    return enemy;
  }

  spawnWave(waveConfig, activeBreachCount = 3) {
    let delay = 0;
    let spawnIndex = 0;
    const numBreaches = Math.min(activeBreachCount, this.paths.length);

    for (const group of waveConfig) {
      for (let i = 0; i < group.count; i++) {
        this._pendingSpawns++;
        const capturedDelay = delay;
        const breachIndex = spawnIndex % numBreaches;
        const capturedType = group.type;

        const id = setTimeout(() => {
          this._spawnTimers = this._spawnTimers.filter(t => t !== id);
          this._pendingSpawns--;
          this.spawnEnemy(capturedType, breachIndex);
        }, capturedDelay);
        this._spawnTimers.push(id);

        spawnIndex++;
        delay += group.interval;
      }
    }
  }

  destroy() {
    this._spawnTimers.forEach(id => clearTimeout(id));
    this._spawnTimers = [];
  }

  update(delta) {
    this._frameCount++;

    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];

      // Clean up enemies killed by damage (alive=false set by damageEnemy)
      if (!enemy.alive) {
        const { x, y } = enemy.sprite;
        enemy.sprite.destroy();
        enemy.hpBar.destroy();
        enemy.label.destroy();
        this.enemies.splice(i, 1);

        this.scene.bus?.emit('atpPickupSpawned', {
          x,
          y,
          amount: enemy.def.reward,
        });
        continue;
      }

      // Tower attack logic
      this._updateTowerAttack(enemy, delta);

      // Walk effects (only when not stopped attacking a tower)
      if (this.animationSystem && !enemy.pathPaused) {
        if (enemy.type === 'viralHijacker') {
          this.animationSystem.playViralHijackerWalk(enemy, this._frameCount);
        } else if (enemy.type === 'radiationPulse') {
          this.animationSystem.playRadiationPulseFloat(enemy, this._frameCount);
        } else if (enemy.type === 'toxinDroplet') {
          this.animationSystem.playToxinDropletBounce(enemy, this._frameCount % 24);
        }
      }

      // Redraw HP bar above sprite
      const { sprite, hpBar, label } = enemy;
      const bx = sprite.x - 28;
      const by = sprite.y - 42;

      hpBar.clear();
      hpBar.fillStyle(0x000000, 0.6);
      hpBar.fillRect(bx, by, 56, 5);

      const hpFrac = Math.max(0, enemy.hp / enemy.maxHp);
      const hpColor = hpFrac > 0.5 ? 0x22c55e : hpFrac > 0.25 ? 0xf59e0b : 0xef4444;
      hpBar.fillStyle(hpColor, 1);
      hpBar.fillRect(bx, by, 56 * hpFrac, 5);

      label.setPosition(sprite.x, sprite.y - 48);
    }
  }

  _updateTowerAttack(enemy, delta) {
    const { attackType, attackRange, towerDamage, attackCooldown } = enemy.def;
    if (!attackType || !this.towerSystem) return;

    // Scale reach with the cell so engagement distances stay proportional on mobile.
    const scaledRange = attackRange * (this.scene.entityScale ?? 1);
    const { x, y } = enemy.sprite;

    // Find nearest tower within attack range
    let nearestIdx = -1;
    let nearestDist = Infinity;
    const slots = this.towerSystem.slots;

    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i];
      if (!slot.tower || slot.tower.hp <= 0) continue;
      const dx = slot.x - x;
      const dy = slot.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= scaledRange && dist < nearestDist) {
        nearestDist = dist;
        nearestIdx = i;
      }
    }

    if (nearestIdx < 0) {
      // No tower in range — resume path if paused (melee/tank only)
      if (enemy.pathPaused) {
        enemy.sprite.pathTween?.resume();
        enemy.pathPaused = false;
      }
      enemy.attackCooldownMs = 0;
      return;
    }

    // Tower in range
    if (attackType === 'melee' || attackType === 'tank') {
      if (!enemy.pathPaused) {
        enemy.sprite.pathTween?.pause();
        enemy.pathPaused = true;
      }
    }

    // Attack on cooldown
    enemy.attackCooldownMs = (enemy.attackCooldownMs ?? 0) - delta;
    if (enemy.attackCooldownMs > 0) return;
    enemy.attackCooldownMs = attackCooldown;

    const slot = slots[nearestIdx];
    this.towerSystem.damageTower(nearestIdx, towerDamage);

    // Visual: attack flash toward tower
    const tx = slot.x, ty = slot.y;
    const flash = this.scene.add.graphics();
    flash.setDepth(9);
    if (attackType === 'projectile') {
      flash.lineStyle(2, 0xFFB300, 0.85);
      flash.lineBetween(x, y, tx, ty);
    } else {
      flash.fillStyle(attackType === 'tank' ? 0xff4400 : 0xcc00ff, 0.7);
      flash.fillCircle(tx, ty, attackType === 'tank' ? 14 : 10);
    }
    this.scene.tweens.add({
      targets: flash,
      alpha: { from: 0.85, to: 0 },
      duration: attackType === 'projectile' ? 220 : 180,
      ease: 'Quad.easeOut',
      onComplete: () => flash.destroy(),
    });
  }

  damageEnemy(enemy, amount) {
    if (!enemy.alive) return;
    enemy.hp -= amount;
    if (enemy.hp <= 0) {
      enemy.alive = false;
      const { x, y } = enemy.sprite;
      if (enemy.def.deathEffect === 'aoe') {
        this._spawnAoeFlash(x, y);
      }
      this.animationSystem?.playEnemyDeath(enemy.type, x, y);
      this.scene.bus?.emit('sfx', { type: 'death', enemyType: enemy.type });
    }
  }

  silenceNearestTower(enemy, towerSystem, duration) {
    let nearestIdx = -1;
    let nearestDist = Infinity;
    const { x, y } = enemy.sprite;

    for (let i = 0; i < towerSystem.slots.length; i++) {
      if (!towerSystem.slots[i].tower) continue;
      const dx = towerSystem.slots[i].x - x;
      const dy = towerSystem.slots[i].y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestIdx = i;
      }
    }

    if (nearestIdx < 0) return;

    towerSystem.silenceTower(nearestIdx, duration);

    const slot = towerSystem.slots[nearestIdx];
    const label = this.scene.add.text(slot.x, slot.y - 28, 'Tower Silenced!', {
      fontSize: '9px',
      color: '#ff9090',
      stroke: '#000000',
      strokeThickness: 2,
    });
    label.setOrigin(0.5, 1);
    label.setDepth(10);
    this.scene.time.delayedCall(2000, () => label.destroy());
  }

  allEnemiesDead() {
    return this._pendingSpawns === 0 && this.enemies.length === 0;
  }

  _onReachNucleus(enemy) {
    if (!enemy.alive) return;
    enemy.alive = false;

    this.scene.bus?.emit('enemyReachedNucleus', {
      enemyType: enemy.type,
      mutationType: enemy.def.onReachNucleus,
    });

    if (enemy.type === 'toxinDroplet' && this.towerSystem) {
      this.silenceNearestTower(enemy, this.towerSystem, enemy.def.silenceDuration);
    }

    this.animationSystem?.playEnemyReachNucleus(
      enemy.type,
      this.cellCX,
      this.cellCY,
    );

    enemy.sprite.stopFollow?.();
    enemy.sprite.destroy();
    enemy.hpBar.destroy();
    enemy.label.destroy();

    const idx = this.enemies.indexOf(enemy);
    if (idx !== -1) this.enemies.splice(idx, 1);
  }

  _spawnAoeFlash(x, y) {
    const g = this.scene.add.graphics();
    g.setDepth(6);
    g.fillStyle(0xf59e0b, 0.5);
    g.fillCircle(x, y, 60);
    this.scene.tweens.add({
      targets: g,
      alpha: { from: 0.5, to: 0 },
      duration: 400,
      onComplete: () => g.destroy(),
    });
  }
}

export default EnemySystem;
