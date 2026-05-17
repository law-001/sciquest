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

    const sprite = this.scene.add.sprite(x, y, towerId);
    sprite.setDepth(5);
    sprite.setScale(0.65);

    // Range indicator — hidden by default
    const rangeCircle = this.scene.add.graphics();
    rangeCircle.setDepth(4);
    if (def.range > 0) {
      rangeCircle.fillStyle(0xffffff, 0.06);
      rangeCircle.fillCircle(x, y, def.range);
      rangeCircle.lineStyle(1, 0x3BAFA9, 0.4);
      rangeCircle.strokeCircle(x, y, def.range);
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

    slot.tower = {
      id: towerId,
      sprite,
      rangeCircle,
      def,
      cooldown: 0,
      silenced: false,
      disabled: false,
      upgraded: false,
    };

    return true;
  }

  sellTower(slotIndex) {
    const slot = this.slots[slotIndex];
    if (!slot?.tower) return 0;

    const { sprite, rangeCircle, def } = slot.tower;
    sprite.destroy();
    rangeCircle.destroy();
    slot.tower = null;

    return Math.floor(def.cost * 0.5);
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
        if (dist <= tower.def.range && dist < nearestDist) {
          nearest = enemy;
          nearestDist = dist;
        }
      }

      if (nearest) {
        onSpawnProjectile({ x, y }, nearest, tower.def);
        this.animationSystem?.playTowerAttack(tower.id, x, y, nearest.sprite.x, nearest.sprite.y);
        tower.cooldown = tower.def.fireRate;
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
