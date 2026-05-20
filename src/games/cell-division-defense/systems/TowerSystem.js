import { TOWERS } from '../data/towers';

class TowerSystem {
  constructor(scene, slots, animationSystem = null) {
    this.scene = scene;
    this.slots = slots;
    this.animationSystem = animationSystem;
  }

  placeTower(slotIndex, towerId) {
    const slot = this.slots[slotIndex];
    if (!slot || slot.tower) return false;

    const def = TOWERS[towerId];
    if (!def) return false;

    const { x, y } = slot;
    const scale = this.scene.entityScale ?? 1;
    const range = def.range * scale;

    const sprite = this.scene.add.image(x, y, towerId);
    sprite.setDepth(5);
    sprite.setScale(1.3 * scale);
    // Canvas-backed textures need an explicit GPU refresh the first time they're
    // used in WebGL mode; otherwise the sprite renders as transparent.
    const texSrc = this.scene.textures.get(towerId)?.source?.[0];
    if (texSrc?.update) texSrc.update();

    // Range indicator — hidden by default
    const rangeCircle = this.scene.add.graphics();
    rangeCircle.setDepth(4);
    if (range > 0) {
      rangeCircle.fillStyle(0xffffff, 0.06);
      rangeCircle.fillCircle(x, y, range);
      rangeCircle.lineStyle(1, 0x3BAFA9, 0.4);
      rangeCircle.strokeCircle(x, y, range);
    }
    rangeCircle.setVisible(false);

    // Show range on hover
    sprite.setInteractive();
    sprite.on('pointerover',  () => rangeCircle.setVisible(true));
    sprite.on('pointerout',   () => rangeCircle.setVisible(false));

    // Idle float tween
    const baseY = y;
    this.scene.tweens.add({
      targets: sprite,
      y: { from: baseY - 4, to: baseY + 4 },
      yoyo: true,
      repeat: -1,
      duration: 1500 + Math.random() * 600,
      ease: 'Sine.easeInOut',
      delay: Math.random() * 800,
    });

    const hpBar = this.scene.add.graphics();
    hpBar.setDepth(8);

    slot.tower = {
      id: towerId,
      sprite,
      rangeCircle,
      hpBar,
      def,
      range,
      cooldown: 0,
      silenced: false,
      disabled: false,
      upgraded: false,
      hp: 40,
      maxHp: 40,
    };

    return true;
  }

  sellTower(slotIndex) {
    const slot = this.slots[slotIndex];
    if (!slot?.tower) return 0;

    const { sprite, rangeCircle, hpBar, def } = slot.tower;
    sprite.destroy();
    rangeCircle.destroy();
    hpBar.destroy();
    slot.tower = null;

    return Math.floor(def.cost * 0.5);
  }

  damageTower(slotIndex, amount) {
    const slot = this.slots[slotIndex];
    if (!slot?.tower) return;
    slot.tower.hp = Math.max(0, slot.tower.hp - amount);

    // Brief red tint flash
    slot.tower.sprite.setTint(0xff3333);
    this.scene.time.delayedCall(180, () => {
      if (slot.tower) slot.tower.sprite.clearTint();
    });

    if (slot.tower.hp <= 0) {
      this.destroyTower(slotIndex);
    }
  }

  destroyTower(slotIndex) {
    const slot = this.slots[slotIndex];
    if (!slot?.tower) return;

    const { x, y } = slot;
    // Destruction burst
    const g = this.scene.add.graphics();
    g.setDepth(10);
    g.fillStyle(0xff6600, 0.9);
    g.fillCircle(x, y, 28);
    this.scene.tweens.add({
      targets: g,
      alpha: { from: 0.9, to: 0 },
      scaleX: { from: 1, to: 2.5 },
      scaleY: { from: 1, to: 2.5 },
      duration: 420,
      ease: 'Quad.easeOut',
      onComplete: () => g.destroy(),
    });

    slot.tower.sprite.destroy();
    slot.tower.rangeCircle.destroy();
    slot.tower.hpBar.destroy();
    slot.tower = null;

    this.scene._emitState?.();
  }

  upgradeTower(slotIndex) {
    const slot = this.slots[slotIndex];
    if (!slot?.tower) return;

    const tower = slot.tower;
    tower.upgraded = true;
    Object.assign(tower.def, tower.def.upgrade ?? {});
    tower.sprite.setTint(0xffffff);
    tower.sprite.setAlpha(1);
    // Slightly brighter tint to signal upgrade
    tower.sprite.setTint(0xddeeff);
  }

  update(delta, enemies, onSpawnProjectile, atpCallback) {
    for (let i = 0; i < this.slots.length; i++) {
      const slot = this.slots[i];
      const tower = slot?.tower;
      if (!tower || tower.silenced || tower.disabled) continue;

      if (tower.id === 'repairEnzyme') {
        tower.cooldown -= delta;
        if (tower.cooldown <= 0) {
          atpCallback('heal', 2);
          tower.cooldown = 1000;
        }
        continue;
      }

      tower.cooldown -= delta;
      if (tower.cooldown > 0) continue;

      // Find nearest enemy in range
      const { x, y } = slot;
      let nearest = null;
      let nearestDist = Infinity;

      for (const enemy of enemies) {
        if (!enemy.alive) continue;
        const dx = enemy.sprite.x - x;
        const dy = enemy.sprite.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= tower.range && dist < nearestDist) {
          nearest = enemy;
          nearestDist = dist;
        }
      }

      if (nearest) {
        onSpawnProjectile({ x, y }, nearest, tower.def);
        this.animationSystem?.playTowerAttack(tower.id, x, y, nearest.sprite.x, nearest.sprite.y);
        tower.cooldown = tower.def.fireRate;
        this.scene.bus?.emit('sfx', { type: 'attack' });
      }

      // Draw HP bar only when damaged
      if (tower.hpBar) {
        tower.hpBar.clear();
        if (tower.hp < tower.maxHp) {
          const bx = slot.x - 20;
          const by = slot.y - 28;
          const bw = 40;
          const bh = 5;
          tower.hpBar.fillStyle(0x000000, 0.6);
          tower.hpBar.fillRect(bx, by, bw, bh);
          const frac = tower.hp / tower.maxHp;
          const col = frac > 0.5 ? 0x22c55e : frac > 0.25 ? 0xf59e0b : 0xef4444;
          tower.hpBar.fillStyle(col, 1);
          tower.hpBar.fillRect(bx, by, bw * frac, bh);
        }
      }
    }
  }

  silenceTower(slotIndex, duration) {
    const tower = this.slots[slotIndex]?.tower;
    if (!tower) return;
    tower.silenced = true;
    setTimeout(() => { tower.silenced = false; }, duration);
  }

  disableTower(slotIndex) {
    const tower = this.slots[slotIndex]?.tower;
    if (tower) tower.disabled = true;
  }

  enableTower(slotIndex) {
    const tower = this.slots[slotIndex]?.tower;
    if (tower) tower.disabled = false;
  }

  getOccupiedSlots() {
    return this.slots
      .map((slot, i) => (slot?.tower ? i : null))
      .filter((i) => i !== null);
  }
}

export default TowerSystem;
