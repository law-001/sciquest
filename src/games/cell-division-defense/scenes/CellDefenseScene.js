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
import { drawCell, getPhase, cellShapeForPhase } from './CellPhaseDraw';
import {
  drawLysosome,
  drawProteinKinase,
  drawRepairEnzyme,
  drawViralHijacker,
  drawToxinDroplet,
  drawRadiationPulse,
} from '../systems/EntityDraw';

const HEX_SIZE = 36;
const SLOT_COUNT = 12;

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
    this.hexGrid          = null;
    this.cellGraphics     = null;
    this.slotGraphics     = null;
    this._selectionGraphics = null;
    this._selectedTowerId   = null;

    // Animated canvas texture state
    this._cellCanvas   = null;
    this._cellImage    = null;
    this._phaseProgress = 0;
    this._animTime     = 0;
    this._entityCanvases = null;
    this._enemyWalkPhase  = 0;
    this._toxinBouncePhase = 0;

    // Mitosis visual cycle (real-time seconds, independent of game logic phase)
    this._mitosisT     = 0;
    this._currentPhase = { idx: 0, t: 0 };
    this._currentShape = { mode: 'circle', r: 0 };

    // Bus listener registry for clean destroy()
    this._busListeners = {};
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

    this._entityCanvases = this.game.registry.get('entityCanvases') ?? null;

    // Start visual cycle at prophase so action is visible immediately (matches reference)
    this._mitosisT     = 4.0;
    this._currentPhase = getPhase(this._mitosisT);
    this._currentShape = cellShapeForPhase(this._currentPhase, this.cellR);

    this._drawHexGrid();
    this._initAnimatedCell();
    this._buildTowerSlots();

    this.animationSystem = new AnimationSystem(this);
    this.towerSystem = new TowerSystem(this, this.towerSlots, this.animationSystem);

    const breachPoints = [
      { x: this.cellCX - this.cellR * 1.4, y: this.cellCY - this.cellR * 1.2 }, // top-left
      { x: this.cellCX + this.cellR * 1.4, y: this.cellCY - this.cellR * 1.2 }, // top-right
      { x: this.cellCX,                    y: this.cellCY + this.cellR * 1.5  }, // bottom
      { x: this.cellCX - this.cellR * 1.7, y: this.cellCY + this.cellR * 0.3 }, // left
      { x: this.cellCX + this.cellR * 1.7, y: this.cellCY + this.cellR * 0.3 }, // right
    ];
    this.enemySystem = new EnemySystem(
      this, breachPoints, this.cellCX, this.cellCY, this.cellR,
    );
    this.enemySystem.towerSystem = this.towerSystem;
    this.enemySystem.animationSystem = this.animationSystem;

    this._drawBreachIndicators(breachPoints);

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
    this._animTime++;
    this._enemyWalkPhase  += 0.045;
    this._toxinBouncePhase += 0.04;

    // Advance visual mitosis cycle slowly so each stage is appreciable
    this._mitosisT    += delta / 6000;
    this._currentPhase = getPhase(this._mitosisT);
    this._currentShape = cellShapeForPhase(this._currentPhase, this.cellR);

    // Legacy phase progress for any remaining consumers
    if (this._waveActive) {
      this._phaseProgress = Math.min(1, this._phaseProgress + delta / 20000);
    }

    // Animate canvas textures every 2 frames (30fps animation)
    if (!this.reducedMotion && this._frameCount % 2 === 0) {
      this._updateEntityTextures();
      this._updateCellTexture();
    }

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

  _initAnimatedCell() {
    const diameter = Math.ceil(this.cellR * 2.6);

    // Create offscreen canvas sized to the cell area
    const c = document.createElement('canvas');
    c.width  = diameter;
    c.height = diameter;
    this._cellCanvas = c;

    // Draw initial frame
    this._drawCellToCanvas();

    // Register as Phaser texture (key must be unique per scene)
    if (this.textures.exists('cellPhase')) {
      this.textures.remove('cellPhase');
    }
    this.textures.addCanvas('cellPhase', c);

    // Place as centered image object
    this._cellImage = this.add.image(this.cellCX, this.cellCY, 'cellPhase');
    this._cellImage.setDepth(1);
  }

  _drawCellToCanvas() {
    if (!this._cellCanvas) return;
    const ctx = this._cellCanvas.getContext('2d');
    const hw  = this._cellCanvas.width  / 2;
    const hh  = this._cellCanvas.height / 2;
    ctx.clearRect(0, 0, this._cellCanvas.width, this._cellCanvas.height);
    drawCell(ctx, hw, hh, this.cellR, this._currentPhase, this._currentShape, this._animTime);
  }

  _updateCellTexture() {
    if (!this._cellCanvas) return;
    this._drawCellToCanvas();
    const src = this.textures.get('cellPhase')?.source?.[0];
    if (src) src.update();
  }

  _updateEntityTextures() {
    if (!this._entityCanvases) return;
    const t = this._animTime;

    const drawFns = {
      lysosome:      (ctx, cx, cy, r) => drawLysosome(ctx, cx, cy, r, t, 0),
      proteinKinase: (ctx, cx, cy, r) => drawProteinKinase(ctx, cx, cy, r, t, 0),
      repairEnzyme:  (ctx, cx, cy, r) => drawRepairEnzyme(ctx, cx, cy, r, t, 0),
      viralHijacker: (ctx, cx, cy, r) => drawViralHijacker(ctx, cx, cy, r, t, this._enemyWalkPhase),
      toxinDroplet:  (ctx, cx, cy, r) => drawToxinDroplet(ctx, cx, cy, r, t, this._toxinBouncePhase),
      radiationPulse:(ctx, cx, cy, r) => drawRadiationPulse(ctx, cx, cy, r, t),
    };

    for (const [key, entry] of Object.entries(this._entityCanvases)) {
      const fn = drawFns[key];
      if (!fn) continue;
      const ctx = entry.canvas.getContext('2d');
      ctx.clearRect(0, 0, entry.canvas.width, entry.canvas.height);
      fn(ctx, entry.cx, entry.cy, entry.r);
      const src = this.textures.get(key)?.source?.[0];
      if (src) src.update();
    }
  }

  _drawBreachIndicators(breachPoints) {
    const g = this.add.graphics();
    g.setDepth(3);

    breachPoints.forEach((bp) => {
      // Outer pulsing ring
      g.lineStyle(2, 0xFF4040, 0.65);
      g.strokeCircle(bp.x, bp.y, 26);
      g.lineStyle(1, 0xFF4040, 0.25);
      g.strokeCircle(bp.x, bp.y, 38);

      // Crosshair
      g.lineStyle(1.5, 0xFF4040, 0.6);
      g.beginPath(); g.moveTo(bp.x - 18, bp.y); g.lineTo(bp.x + 18, bp.y); g.strokePath();
      g.beginPath(); g.moveTo(bp.x, bp.y - 18); g.lineTo(bp.x, bp.y + 18); g.strokePath();

      // Arrow pointing toward cell center
      const dx = this.cellCX - bp.x;
      const dy = this.cellCY - bp.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const nx = dx / dist, ny = dy / dist;
      const arrowBase = 32, arrowTip = 56;
      const ax = bp.x + nx * arrowBase, ay = bp.y + ny * arrowBase;
      const tx = bp.x + nx * arrowTip,  ty = bp.y + ny * arrowTip;
      const px = -ny * 8, py = nx * 8;
      g.lineStyle(0, 0, 0);
      g.fillStyle(0xFF4040, 0.75);
      g.beginPath();
      g.moveTo(tx, ty);
      g.lineTo(ax + px, ay + py);
      g.lineTo(ax - px, ay - py);
      g.closePath();
      g.fillPath();

      // "ENTRY" label
      this.add.text(bp.x, bp.y - 44, 'ENTRY POINT', {
        fontSize: '9px',
        color: '#FF8080',
        stroke: '#000000',
        strokeThickness: 2,
        fontFamily: '"Courier New", Courier, monospace',
        fontStyle: 'bold',
      }).setOrigin(0.5, 1).setDepth(3);
    });

    // Pulse the whole indicators layer
    this.tweens.add({
      targets: g,
      alpha: { from: 0.6, to: 1 },
      yoyo: true,
      repeat: -1,
      duration: 900,
      ease: 'Sine.easeInOut',
    });
  }

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
      zone.on('pointerdown', (pointer) => {
        const slot = this.towerSlots[i];
        this.bus?.emit('towerSlotClicked', {
          slotIndex: i,
          isEmpty: !slot.tower,
          towerId: slot.tower?.id ?? null,
          canvasX: pointer.x,
          canvasY: pointer.y,
        });
      });

      this.towerSlots.push({ angle, x, y, tower: null });
    }

    this.slotGraphics = g;
  }

  // ── Event bus ─────────────────────────────────────────────────────────────

  _busOn(event, fn) {
    this._busListeners[event] ??= [];
    this._busListeners[event].push(fn);
    this.bus.on(event, fn);
  }

  _setupBusListeners() {
    if (!this.bus) return;

    this._busOn('phaseTransition', ({ fromPhase, toPhase }) => {
      if (toPhase !== this.phase) this._phaseProgress = 0;
      // Jump visual cell to the matching mitosis stage when game phase actually changes
      if (fromPhase !== toPhase) {
        const phaseStartT = {
          interphase:  0,
          prophase:    4.0,
          metaphase:   7.5,
          anaphase:   11.0,
          telophase:  14.5,
          cytokinesis: 18.0,
        };
        const t = phaseStartT[toPhase];
        if (t !== undefined) this._mitosisT = t;
      }
    });

    this._busOn('pause', () => {
      this.physics.pause();
      this.tweens.pauseAll();
      this.paused = true;
    });

    this._busOn('resume', () => {
      this.physics.resume();
      this.tweens.resumeAll();
      this.paused = false;
    });

    this._busOn('towerSelected', ({ towerId }) => {
      this._selectedTowerId = towerId ?? null;
      this._showSlotHighlights(this._selectedTowerId);
      const canvas = this.sys?.game?.canvas;
      if (canvas) canvas.style.cursor = towerId ? 'crosshair' : 'default';
    });

    this._busOn('placeTower', ({ towerId, slotIndex }) => {
      const def = TOWERS[towerId];
      if (!def || this.atp < def.cost) return;

      const placed = this.towerSystem.placeTower(slotIndex, towerId);
      if (placed) {
        this.atp -= def.cost;
        this._emitState();
      }
    });

    this._busOn('sellTower', ({ slotIndex }) => {
      const refund = this.towerSystem.sellTower(slotIndex);
      if (refund > 0) {
        this.atp += refund;
        this._emitState();
      }
    });

    this._busOn('upgradeTower', ({ slotIndex }) => {
      const slot = this.towerSlots[slotIndex];
      if (!slot?.tower) return;
      const upgradeCost = slot.tower.def.upgradeCost ?? 0;
      if (this.atp < upgradeCost) return;
      this.atp -= upgradeCost;
      this.towerSystem.upgradeTower(slotIndex);
      this._emitState();
    });

    this._busOn('waveCleared', () => {
      this.phaseSystem?.onWaveCleared();
    });

    this._busOn('enemyReachedNucleus', ({ mutationType }) => {
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

    this._busOn('gameOver', ({ reason }) => {
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

    this._busOn('atpPickupSpawned', ({ x, y, amount }) => {
      this._spawnAtpPickup(x, y, amount);
    });

    this._busOn('spawnTutorialAtp', () => {
      // Spawn inside the cell, offset from nucleus so it's clearly clickable
      this._spawnAtpPickup(
        this.cellCX + this.cellR * 0.38,
        this.cellCY - this.cellR * 0.42,
        30,
      );
    });

    this._busOn('aoeBlast', ({ x, y, radius }) => {
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

    this._busOn('towerSilence', ({ x, y }) => {
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

  _showSlotHighlights(towerId) {
    if (!this._selectionGraphics) {
      this._selectionGraphics = this.add.graphics();
      this._selectionGraphics.setDepth(9);
    }
    this._selectionGraphics.clear();
    this.tweens.killTweensOf(this._selectionGraphics);

    if (!towerId) return;

    const def = TOWERS[towerId];
    const canAfford = def && this.atp >= def.cost;
    const color = canAfford ? 0x3BAFA9 : 0xFF4444;

    for (const slot of this.towerSlots) {
      if (slot.tower) continue;
      this._selectionGraphics.lineStyle(2, color, 0.9);
      this._selectionGraphics.strokeCircle(slot.x, slot.y, 20);
      this._selectionGraphics.fillStyle(color, canAfford ? 0.18 : 0.12);
      this._selectionGraphics.fillCircle(slot.x, slot.y, 20);
    }

    if (!this.reducedMotion) {
      this.tweens.add({
        targets: this._selectionGraphics,
        alpha: { from: 0.5, to: 1.0 },
        yoyo: true,
        repeat: -1,
        duration: 600,
        ease: 'Sine.easeInOut',
      });
    }
  }

  destroy() {
    // Remove all bus listeners registered by this scene
    if (this.bus && this._busListeners) {
      for (const [event, fns] of Object.entries(this._busListeners)) {
        for (const fn of fns) {
          this.bus.off(event, fn);
        }
      }
    }
    this._busListeners = {};

    this.phaseSystem?.destroy();

    // Clean up animated cell texture
    if (this.textures.exists('cellPhase')) {
      this.textures.remove('cellPhase');
    }
    this._cellCanvas = null;

    // Reset cursor in case we changed it
    const canvas = this.sys?.game?.canvas;
    if (canvas) canvas.style.cursor = 'default';
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
        fontSize: '18px',
        fontStyle: 'bold',
        color: '#FFD700',
        stroke: '#000000',
        strokeThickness: 3,
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
