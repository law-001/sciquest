import Phaser from 'phaser';
import { BaseGameScene } from '../../_shared/phaser/BaseGameScene';
import TowerSystem from '../systems/TowerSystem';
import EnemySystem from '../systems/EnemySystem';
import ProjectileSystem from '../systems/ProjectileSystem';
import AnimationSystem from '../systems/AnimationSystem';
import PhaseSystem from '../systems/PhaseSystem';
import MutationSystem from '../systems/MutationSystem';
import { TOWERS } from '../data/towers';
import { LEVELS } from '../data/levels';

const HEX_SIZE = 36;
const SLOT_COUNT = 12;
const ORGANELLE_COUNT = 6;

export default class CellDefenseScene extends BaseGameScene {
  constructor() {
    super({ key: 'CellDefenseScene' });

    this.cellCX = 0;
    this.cellCY = 0;
    this.cellR  = 0;
    this.nucleusR = 0;

    this.hp        = 100;
    this.maxHp     = 100;
    this.atp       = 300;
    this.mutations = [];
    this.phase     = 'interphase';
    this.wave      = 0;
    this.paused    = false;

    this.towers       = [];
    this.projectiles  = [];
    this.atpPickups   = [];
    this.towerSlots   = [];

    this.currentLevel        = 0;
    this._waveActive         = false;
    this.doubleHitActive     = false;
    this.splitImbalanceActive = false;

    this._frameCount  = 0;
    this.reducedMotion = false;
    this.deviceTier    = 'mid';

    this.phaseSystem    = null;
    this.mutationSystem = null;

    // Graphics layers
    this.hexGrid       = null;
    this.cellGraphics  = null;
    this.slotGraphics  = null;
  }

  init(data) {
    super.init();
    this.reducedMotion = data?.reducedMotion ?? false;
    this.deviceTier    = data?.deviceTier   ?? 'mid';
  }

  create() {
    const { width, height } = this.scale;

    // Cell geometry — shifted right to leave room for the React tower panel
    this.cellCX   = width  * 0.55;
    this.cellCY   = height * 0.5 + 8;
    this.cellR    = Math.min(width, height) * 0.30;
    this.nucleusR = this.cellR * 0.16;   // matches handoff: nr = r * 0.16

    // Sync level-specific starting values
    const levelData = LEVELS[this.currentLevel];
    this.atp   = levelData?.startAtp  ?? 300;
    this.hp    = levelData?.nucleusHp ?? 100;
    this.maxHp = levelData?.nucleusHp ?? 100;

    this._drawHexGrid();
    this._drawCell();
    this._buildTowerSlots();

    this.animationSystem = new AnimationSystem(this);
    this.towerSystem = new TowerSystem(this, this.towerSlots, this.animationSystem);

    const breachPoints = [
      { x: this.cellCX - this.cellR * 1.4, y: this.cellCY - this.cellR * 1.2 },
      { x: this.cellCX + this.cellR * 1.4, y: this.cellCY - this.cellR * 1.2 },
      { x: this.cellCX,                    y: this.cellCY + this.cellR * 1.5  },
    ];
    this.enemySystem = new EnemySystem(
      this, breachPoints, this.cellCX, this.cellCY, this.cellR,
    );
    this.enemySystem.towerSystem = this.towerSystem;
    this.enemySystem.animationSystem = this.animationSystem;

    this.projectileSystem = new ProjectileSystem(this);
    this.projectileSystem.registerHitCallback((enemy, def) => {
      this.enemySystem.damageEnemy(enemy, def.damage);
      if (def.slow && enemy.alive && enemy.sprite?.pathTween) {
        enemy.sprite.pathTween.timeScale = def.slow;
        this.time.delayedCall(3000, () => {
          if (enemy.alive && enemy.sprite?.pathTween) {
            enemy.sprite.pathTween.timeScale = 1;
          }
        });
      }
    });

    this.mutationSystem = new MutationSystem(this);
    this.phaseSystem = new PhaseSystem(this, levelData, this.mutationSystem);

    this._setupBusListeners();
    this._emitState();
    this.phaseSystem.start();
  }

  update(_time, delta) {
    if (this.paused) return;

    const activeEnemies = this.enemySystem?.enemies ?? [];

    this.towerSystem?.update(
      delta,
      activeEnemies,
      (fromPos, enemy, def) => {
        this.projectileSystem?.fire(fromPos.x, fromPos.y, enemy, def);
      },
      (type, amount) => {
        if (type === 'heal') {
          this.hp = Math.min(100, this.hp + amount);
        }
      },
    );

    this.enemySystem?.update(delta);
    this.projectileSystem?.update(delta);

    this._frameCount++;

    // Check if wave is cleared (check every 30 frames to reduce overhead)
    if (this._waveActive && this._frameCount % 30 === 0) {
      if (this.enemySystem.allEnemiesDead()) {
        this._waveActive = false;
        this.bus?.emit('waveCleared', { phase: this.phase });
      }
    }

    if (this._frameCount % 60 === 0) {
      this._emitState();
    }
  }

  _emitState() {
    this.bus?.emit('stateChanged', {
      hp:        this.hp,
      atp:       this.atp,
      mutations: this.mutations,
      phase:     this.phase,
      wave:      this.wave,
    });
  }

  // ── Drawing ───────────────────────────────────────────────────────────────

  _drawHexGrid() {
    const { width, height } = this.scale;
    const g = this.add.graphics();

    // Flat-top hex layout matching game.js (col * w * 0.75, row offset on odd cols)
    const size   = HEX_SIZE;
    const w      = size * 2;
    const h      = Math.sqrt(3) * size;
    const cols   = Math.ceil(width  / (w * 0.75)) + 2;
    const rows   = Math.ceil(height / h) + 2;

    g.lineStyle(0.8, 0xffffff, 0.045);

    for (let row = -1; row < rows; row++) {
      for (let col = -1; col < cols; col++) {
        const cx = col * w * 0.75;
        const cy = row * h + (col % 2 === 0 ? 0 : h / 2);

        g.beginPath();
        for (let i = 0; i < 6; i++) {
          const a  = (Math.PI / 180) * (60 * i); // flat-top (0° = rightward vertex)
          const px = cx + size * Math.cos(a);
          const py = cy + size * Math.sin(a);
          if (i === 0) g.moveTo(px, py);
          else         g.lineTo(px, py);
        }
        g.closePath();
        g.strokePath();
      }
    }

    // Radial vignette (subtract opacity toward edges) — drawn as a dark overlay
    const vignette = this.add.graphics();
    vignette.fillStyle(0x000000, 0);
    // We approximate the vignette with a simple alpha tween on the canvas edges.
    // For now a very subtle dark border circle is enough.
    vignette.lineStyle(Math.min(width, height) * 0.4, 0x000000, 0.35);
    vignette.strokeCircle(width / 2, height / 2, Math.max(width, height) * 0.7);

    this.hexGrid = g;
  }

  _drawCell() {
    const cx  = this.cellCX;
    const cy  = this.cellCY;
    const r   = this.cellR;
    const nr  = this.nucleusR;

    // ── Outer atmosphere (soft teal aura) ───────────────────────────────────
    const aura = this.add.graphics();
    aura.x = cx;
    aura.y = cy;
    // Approximate radial gradient aura: stacked concentric circles
    for (let i = 12; i >= 1; i--) {
      const ratio = i / 12;
      const rad   = r * (0.6 + ratio * 0.75);
      const alpha = 0.10 * (1 - ratio);
      aura.fillStyle(0x3BAFA9, alpha);
      aura.fillCircle(0, 0, rad);
    }

    // ── Inner watery fill (matches game.js radial gradient fill) ────────────
    const fill = this.add.graphics();
    // We simulate the bumpy membrane using a custom polygon drawn from
    // sinusoidal perturbations, matching game.js's N=64 loop.
    const N     = 64;
    const pts   = [];
    for (let i = 0; i <= N; i++) {
      const a    = (i / N) * Math.PI * 2;
      // time=0 on first draw; harmonic bumps from game.js
      const bump = Math.sin(a * 7) * (r * 0.012) + Math.sin(a * 13) * (r * 0.008);
      const rr   = r + bump;
      pts.push(new Phaser.Math.Vector2(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr));
    }

    // Inner fill — teal gradient approximated with concentric rings
    // rgba(80,200,200,0.20) center → rgba(59,175,169,0.16) mid → rgba(15,60,70,0.45) edge
    for (let step = 10; step >= 0; step--) {
      const t   = step / 10;
      // Center color: rgb(80,200,200) → Edge: rgb(15,60,70)
      const rC  = Math.round(80  + (15  - 80)  * (1 - t));
      const gC  = Math.round(200 + (60  - 200) * (1 - t));
      const bC  = Math.round(200 + (70  - 200) * (1 - t));
      const col = (rC << 16) | (gC << 8) | bC;
      const alp = t < 0.5 ? 0.20 * (t / 0.5) : 0.16 + (0.45 - 0.16) * ((t - 0.5) / 0.5);
      fill.fillStyle(col, alp);
      fill.fillCircle(cx, cy, r * t);
    }

    // Draw bumpy membrane path as polygon fill
    fill.fillStyle(0x3BAFA9, 0.08);
    fill.fillPoints(pts, true, true);

    // ── Membrane stroke — teal glow ──────────────────────────────────────────
    const membrane = this.add.graphics();
    membrane.lineStyle(4, 0x3BAFA9, 1.0);
    membrane.strokePoints(pts, true);

    // Inner ring (rgba(160,230,225,0.18))
    membrane.lineStyle(1.2, 0xA0E6E1, 0.18);
    membrane.strokeCircle(cx, cy, r - 6);

    // ── Phospholipid dots around membrane ────────────────────────────────────
    const phospho = this.add.graphics();
    phospho.fillStyle(0x78DCD2, 0.5);
    for (let i = 0; i < 48; i++) {
      const a  = (i / 48) * Math.PI * 2;
      const px = cx + Math.cos(a) * (r + 3);
      const py = cy + Math.sin(a) * (r + 3);
      phospho.fillCircle(px, py, 1.4);
    }

    // ── Floating organelles (mitochondria ellipses) ────────────────────────
    const organelles = this.add.graphics();
    for (let i = 0; i < ORGANELLE_COUNT; i++) {
      const a  = (i / ORGANELLE_COUNT) * Math.PI * 2;
      const rr = r * 0.55;
      const ox = cx + Math.cos(a) * rr;
      const oy = cy + Math.sin(a) * rr;
      organelles.fillStyle(0xB4965A, 0.22);
      organelles.fillEllipse(ox, oy, 18, 10);
      organelles.lineStyle(1, 0xFFD28C, 0.28);
      organelles.strokeEllipse(ox, oy, 18, 10);
    }

    // ── Nucleus ──────────────────────────────────────────────────────────────
    const nucleus = this.add.graphics();
    nucleus.x = cx;
    nucleus.y = cy;

    // Nucleus aura: rgba(168,200,240,0.35) → rgba(168,200,240,0) over radius nr*2.4
    for (let i = 8; i >= 0; i--) {
      const ratio = i / 8;
      const rad   = nr * 2.4 * ratio;
      const alpha = 0.35 * (1 - ratio);
      nucleus.fillStyle(0xA8C8F0, alpha);
      nucleus.fillCircle(0, 0, rad);
    }

    // Nucleus body gradient: centre #D6E5F8 → mid #A8C8F0 → edge #5B8FD4
    const bodySteps = 10;
    for (let i = bodySteps; i >= 0; i--) {
      const t   = i / bodySteps;
      let rC, gC, bC;
      if (t > 0.55) {
        // centre → mid (#D6E5F8 → #A8C8F0)
        const p = (t - 0.55) / 0.45;
        rC = Math.round(168 + (214 - 168) * p);
        gC = Math.round(200 + (229 - 200) * p);
        bC = Math.round(240 + (248 - 240) * p);
      } else {
        // mid → edge (#A8C8F0 → #5B8FD4)
        const p = t / 0.55;
        rC = Math.round(91  + (168 - 91)  * p);
        gC = Math.round(143 + (200 - 143) * p);
        bC = Math.round(212 + (240 - 212) * p);
      }
      const col = (rC << 16) | (gC << 8) | bC;
      nucleus.fillStyle(col, 1.0);
      nucleus.fillCircle(0, 0, nr * t);
    }

    // Highlight ellipse (rgba(255,255,255,0.45)) — top-left offset
    nucleus.fillStyle(0xffffff, 0.45);
    nucleus.fillEllipse(-nr * 0.35, -nr * 0.4, nr * 0.7, nr * 0.36);

    // Inner nucleolus dot (rgba(91,143,212,0.55))
    nucleus.fillStyle(0x5B8FD4, 0.55);
    nucleus.fillCircle(nr * 0.15, nr * 0.18, nr * 0.22);

    // ── Membrane pulse tween ────────────────────────────────────────────────
    if (!this.reducedMotion) {
      this.tweens.add({
        targets: membrane,
        alpha: { from: 0.85, to: 1.0 },
        yoyo: true,
        repeat: -1,
        duration: 2000,
        ease: 'Sine.easeInOut',
      });

      this.tweens.add({
        targets: nucleus,
        scaleX: { from: 0.96, to: 1.04 },
        scaleY: { from: 0.96, to: 1.04 },
        yoyo: true,
        repeat: -1,
        duration: 2800,
        ease: 'Sine.easeInOut',
      });

      // Organelles drift slowly
      this.tweens.add({
        targets: organelles,
        angle: { from: 0, to: 360 },
        repeat: -1,
        duration: 40000,
        ease: 'Linear',
      });
    }

    // Store refs for later manipulation
    this.cellGraphics = membrane;
  }

  _buildTowerSlots() {
    const g = this.add.graphics();

    this.towerSlots = [];

    for (let i = 0; i < SLOT_COUNT; i++) {
      const angle = (i / SLOT_COUNT) * Math.PI * 2 - Math.PI / 2;
      const x     = this.cellCX + this.cellR * Math.cos(angle);
      const y     = this.cellCY + this.cellR * Math.sin(angle);

      g.lineStyle(1.5, 0x3BAFA9, 0.30);
      g.strokeCircle(x, y, 11);
      g.fillStyle(0x3BAFA9, 0.20);
      g.fillCircle(x, y, 4);

      // Invisible click zone for this slot
      const zone = this.add.zone(x, y, 44, 44).setInteractive();
      zone.on('pointerdown', () => {
        const slot = this.towerSlots[i];
        this.bus?.emit('towerSlotClicked', { slotIndex: i, isEmpty: !slot.tower });
      });

      this.towerSlots.push({ angle, x, y, tower: null });
    }

    this.slotGraphics = g;
  }

  // ── Event bus ─────────────────────────────────────────────────────────────

  _setupBusListeners() {
    if (!this.bus) return;

    this.bus.on('pause', () => {
      this.physics.pause();
      this.paused = true;
    });

    this.bus.on('resume', () => {
      this.physics.resume();
      this.paused = false;
    });

    this.bus.on('placeTower', ({ towerId, slotIndex }) => {
      const def = TOWERS[towerId];
      if (!def || this.atp < def.cost) return;

      const placed = this.towerSystem.placeTower(slotIndex, towerId);
      if (placed) {
        this.atp -= def.cost;
        this._emitState();
      }
    });

    this.bus.on('sellTower', ({ slotIndex }) => {
      const refund = this.towerSystem.sellTower(slotIndex);
      if (refund > 0) {
        this.atp += refund;
        this._emitState();
      }
    });

    this.bus.on('upgradeTower', ({ slotIndex }) => {
      const slot = this.towerSlots[slotIndex];
      if (!slot?.tower) return;
      const upgradeCost = slot.tower.def.upgradeCost ?? 0;
      if (this.atp < upgradeCost) return;
      this.atp -= upgradeCost;
      this.towerSystem.upgradeTower(slotIndex);
      this._emitState();
    });

    this.bus.on('waveCleared', () => {
      this.phaseSystem?.onWaveCleared();
    });

    this.bus.on('enemyReachedNucleus', ({ mutationType }) => {
      const damage = this.doubleHitActive ? 20 : 10;
      this.doubleHitActive = false;
      this.hp = Math.max(0, this.hp - damage);

      if (mutationType) {
        this.mutationSystem?.addMutation(mutationType);
      } else {
        this._emitState();
      }

      if (this.hp <= 0) {
        this.bus?.emit('gameOver', { reason: 'nucleusDestroyed' });
      }
    });

    this.bus.on('gameOver', ({ reason }) => {
      this.physics.pause();
      this.paused = true;
      this._emitState();
      this.bus?.emit('runComplete', {
        stars:     0,
        mutations: this.mutationSystem?.getAll() ?? [],
        hpLeft:    this.hp,
        xpEarned:  0,
        levelId:   LEVELS[this.currentLevel]?.id ?? null,
        reason,
      });
    });

    this.bus.on('atpPickupSpawned', ({ x, y, amount }) => {
      this._spawnAtpPickup(x, y, amount);
    });

    this.bus.on('aoeBlast', ({ x, y, radius }) => {
      const enemies = this.enemySystem?.enemies ?? [];
      for (const enemy of enemies) {
        if (!enemy.alive) continue;
        const dx = enemy.sprite.x - x;
        const dy = enemy.sprite.y - y;
        if (Math.sqrt(dx * dx + dy * dy) <= radius) {
          this.enemySystem.damageEnemy(enemy, 20);
        }
      }
    });

    this.bus.on('towerSilence', ({ x, y }) => {
      const slots = this.towerSystem?.slots ?? [];
      let nearestIdx = -1;
      let nearestDist = Infinity;
      for (let i = 0; i < slots.length; i++) {
        if (!slots[i].tower) continue;
        const dx = slots[i].x - x;
        const dy = slots[i].y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < nearestDist) {
          nearestDist = dist;
          nearestIdx  = i;
        }
      }
      if (nearestIdx >= 0) {
        this.towerSystem.silenceTower(nearestIdx, 4000);
      }
    });
  }

  _spawnAtpPickup(x, y, amount) {
    const pickup = this.add.image(x, y, 'atpPickup');
    pickup.setDepth(6);
    pickup.setInteractive({ useHandCursor: true });

    this.tweens.add({
      targets: pickup,
      y: { from: y, to: y - 6 },
      yoyo: true,
      repeat: 3,
      duration: 400,
      ease: 'Sine.easeInOut',
    });

    pickup.once('pointerdown', () => {
      this.atp += amount;
      this._emitState();

      const label = this.add.text(pickup.x, pickup.y, `+${amount} ATP`, {
        fontSize: '11px',
        color: '#FFD700',
        stroke: '#000000',
        strokeThickness: 2,
      });
      label.setOrigin(0.5, 1);
      label.setDepth(10);
      this.tweens.add({
        targets: label,
        y: label.y - 32,
        alpha: { from: 1, to: 0 },
        duration: 900,
        ease: 'Sine.easeOut',
        onComplete: () => label.destroy(),
      });

      pickup.destroy();
    });
  }
}
