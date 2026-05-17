import Phaser from 'phaser';
import { ENEMIES } from '../data/enemies';

class EnemySystem {
  constructor(scene, breachPoints, cellCX, cellCY, cellR) {
    this.scene = scene;
    this.cellCX = cellCX;
    this.cellCY = cellCY;
    this.enemies = [];
    this.towerSystem = null;
    this.animationSystem = null;
    this._pendingSpawns = 0;
    this._frameCount = 0;

    // Build a QuadraticBezier Path for each breach point
    this.paths = breachPoints.map(({ x: bx, y: by }) => {
      // Control point: midpoint pushed outward by cellR*0.35 to bow path around membrane
      const midX = (bx + cellCX) / 2;
      const midY = (by + cellCY) / 2;
      const dx = bx - cellCX;
      const dy = by - cellCY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const ctrlX = midX + (dx / dist) * cellR * 0.35;
      const ctrlY = midY + (dy / dist) * cellR * 0.35;

      const path = new Phaser.Curves.Path(bx, by);
      path.quadraticBezierTo(cellCX, cellCY, ctrlX, ctrlY);
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
    follower.setScale(0.65);

    const hpBar = this.scene.add.graphics();
    hpBar.setDepth(7);

    const label = this.scene.add.text(startX, startY - 26, def.displayName, {
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

  spawnWave(waveConfig) {
    let delay = 0;
    let spawnIndex = 0;

    for (const group of waveConfig) {
      for (let i = 0; i < group.count; i++) {
        this._pendingSpawns++;
        const capturedDelay = delay;
        const breachIndex = spawnIndex % 3;
        const capturedType = group.type;

        this.scene.time.delayedCall(capturedDelay, () => {
          this._pendingSpawns--;
          this.spawnEnemy(capturedType, breachIndex);
        });

        spawnIndex++;
        delay += group.interval;
      }
    }
  }

  update(_delta) {
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

      // Walk effects
      if (this.animationSystem) {
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
      const bx = sprite.x - 14;
      const by = sprite.y - 22;

      hpBar.clear();
      hpBar.fillStyle(0x000000, 0.6);
      hpBar.fillRect(bx, by, 28, 4);

      const hpFrac = Math.max(0, enemy.hp / enemy.maxHp);
      const hpColor = hpFrac > 0.5 ? 0x22c55e : hpFrac > 0.25 ? 0xf59e0b : 0xef4444;
      hpBar.fillStyle(hpColor, 1);
      hpBar.fillRect(bx, by, 28 * hpFrac, 4);

      label.setPosition(sprite.x, sprite.y - 25);
    }
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
