import Phaser from "phaser";
import { BaseGameScene } from "../../_shared/phaser/BaseGameScene";
import TowerSystem from "../systems/TowerSystem";
import EnemySystem from "../systems/EnemySystem";
import ProjectileSystem from "../systems/ProjectileSystem";
import AnimationSystem from "../systems/AnimationSystem";
import PhaseSystem from "../systems/PhaseSystem";
import MutationSystem from "../systems/MutationSystem";
import { TOWERS } from "../data/towers";
import { LEVELS } from "../data/levels";
import { drawCell, getPhase, cellShapeForPhase } from "./CellPhaseDraw";
import {
  drawLysosome,
  drawProteinKinase,
  drawRepairEnzyme,
  drawViralHijacker,
  drawToxinDroplet,
  drawRadiationPulse,
} from "../systems/EntityDraw";

const HEX_SIZE = 36;
const SLOT_COUNT = 12;

export default class CellDefenseScene extends BaseGameScene {
  constructor() {
    super({ key: "CellDefenseScene" });

    this.cellCX = 0;
    this.cellCY = 0;
    this.cellR = 0;
    this.nucleusR = 0;
    // Scales tower/enemy sprites + ranges with the cell so they stay
    // proportional on small (mobile) viewports. Recomputed in _buildGeometry.
    this.entityScale = 1;

    this.hp = 100;
    this.maxHp = 100;
    this.atp = 300;
    this.mutations = [];
    this.phase = "interphase";
    this.wave = 0;
    this.paused = false;

    this.towers = [];
    this.projectiles = [];
    this.atpPickups = [];
    this.towerSlots = [];

    this.currentLevel = 0;
    this._waveActive = false;
    this.doubleHitActive = false;
    this.splitImbalanceActive = false;

    this._frameCount = 0;
    this.reducedMotion = false;
    this.deviceTier = "mid";

    this.phaseSystem = null;
    this.mutationSystem = null;

    this.hexGrid = null;
    this.cellGraphics = null;
    this.slotGraphics = null;
    this._selectionGraphics = null;
    this._selectedTowerId = null;
    this._vignetteGraphics = null;
    this._breachGraphics = null;
    this._breachLabels = [];

    this._cellCanvas = null;
    this._cellImage = null;
    this._phaseProgress = 0;
    this._animTime = 0;
    this._entityCanvases = null;
    this._enemyWalkPhase = 0;
    this._toxinBouncePhase = 0;

    this._mitosisT = 0;
    this._currentPhase = { idx: 0, t: 0 };
    this._currentShape = { mode: "circle", r: 0 };

    this._shopW = 0;
    this._cameraControlsEnabled = false;
    this._camDragStart = null;
    this._camDragScrollStart = null;
    this._camIsDragging = false;
    this._camPinchDist = null;
    this._suppressNextTap = false;

    this._busListeners = {};
  }

  init(data) {
    super.init();
    this.reducedMotion = data?.reducedMotion ?? false;
    this.deviceTier = data?.deviceTier ?? "mid";
  }

  create() {
    const { width, height } = this.scale;
    this._buildGeometry(width, height);

    const levelData = LEVELS[this.currentLevel];
    this.atp = levelData?.startAtp ?? 300;
    this.hp = levelData?.nucleusHp ?? 100;
    this.maxHp = levelData?.nucleusHp ?? 100;

    this._entityCanvases = this.game.registry.get("entityCanvases") ?? null;

    this._mitosisT = 4.0;
    this._currentPhase = getPhase(this._mitosisT);
    this._currentShape = cellShapeForPhase(this._currentPhase, this.cellR);

    this._drawHexGrid();
    this._initAnimatedCell();
    this._buildTowerSlots();

    this.animationSystem = new AnimationSystem(this);
    this.towerSystem = new TowerSystem(
      this,
      this.towerSlots,
      this.animationSystem,
    );

    const breachPoints = this._getBreachPoints();
    this.enemySystem = new EnemySystem(
      this,
      breachPoints,
      this.cellCX,
      this.cellCY,
      this.cellR,
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
    this._setupCameraControls();
    this._emitState();

    this.scale.on("resize", (gameSize) => {
      this._onResize(gameSize.width, gameSize.height);
    });

    this.phaseSystem.start();
  }

  _setupCameraControls() {
    const cam = this.cameras.main;
    const { width, height } = this.scale;

    cam.setBounds(-width, -height, width * 3, height * 3);

    this.input.on("wheel", (_p, _o, _dx, dy) => {
      cam.setZoom(Phaser.Math.Clamp(cam.zoom - dy * 0.001, 0.4, 3.0));
    });

    this._cameraControlsEnabled = true;

    this.input.on("pointerdown", (pointer) => {
      this._camIsDragging = false;
      if (pointer.x < this._shopW) return;
      if (this.input.pointer2?.isDown) return;
      this._camDragStart = { x: pointer.x, y: pointer.y };
      this._camDragScrollStart = { x: cam.scrollX, y: cam.scrollY };
    });

    this.input.on("pointermove", (pointer) => {
      if (!this._camDragStart || !pointer.isDown) return;
      if (this.input.pointer2?.isDown) {
        this._camDragStart = null;
        return;
      }
      const dx = pointer.x - this._camDragStart.x;
      const dy = pointer.y - this._camDragStart.y;
      if (!this._camIsDragging && Math.sqrt(dx * dx + dy * dy) > 12) {
        this._camIsDragging = true;
      }
      if (this._camIsDragging) {
        cam.scrollX = this._camDragScrollStart.x - dx / cam.zoom;
        cam.scrollY = this._camDragScrollStart.y - dy / cam.zoom;
      }
    });

    this.input.on("pointerup", (pointer) => {
      const wasDragging = this._camIsDragging;
      this._camDragStart = null;
      this._camDragScrollStart = null;
      this._camIsDragging = false;

      // A pan or a pinch consumed this gesture — don't treat it as a slot tap.
      if (wasDragging) return;
      if (this._suppressNextTap) {
        this._suppressNextTap = false;
        return;
      }
      if (pointer.x < this._shopW) return;
      this._handleSlotTap(pointer);
    });
  }

  // Resolve a tap to the nearest tower slot in world space. Replaces per-slot
  // interactive Zones, whose pointerup did not fire reliably on touch devices.
  _handleSlotTap(pointer) {
    let nearestIdx = -1;
    let nearestDist = Infinity;
    for (let i = 0; i < this.towerSlots.length; i++) {
      const slot = this.towerSlots[i];
      const d = Phaser.Math.Distance.Between(
        pointer.worldX,
        pointer.worldY,
        slot.x,
        slot.y,
      );
      if (d < nearestDist) {
        nearestDist = d;
        nearestIdx = i;
      }
    }
    if (nearestIdx < 0) return;

    // Tap target scales with the cell so it stays generous on small screens,
    // but stays below half the gap between adjacent slots (≈0.26·cellR).
    const hitRadius = Math.max(30, this.cellR * 0.22);
    if (nearestDist > hitRadius) return;

    const slot = this.towerSlots[nearestIdx];
    this.bus?.emit("towerSlotClicked", {
      slotIndex: nearestIdx,
      isEmpty: !slot.tower,
      towerId: slot.tower?.id ?? null,
    });
  }

  _updatePinchZoom() {
    const p1 = this.input.pointer1;
    const p2 = this.input.pointer2;
    if (p1.isDown && p2.isDown) {
      const dist = Phaser.Math.Distance.Between(p1.x, p1.y, p2.x, p2.y);
      if (this._camPinchDist !== null) {
        const delta = dist - this._camPinchDist;
        const cam = this.cameras.main;
        cam.setZoom(Phaser.Math.Clamp(cam.zoom + delta * 0.005, 0.4, 3.0));
      }
      this._camPinchDist = dist;
      this._camDragStart = null;
      // Pinch release shouldn't place a tower.
      this._suppressNextTap = true;
    } else {
      this._camPinchDist = null;
    }
  }

  update(_time, delta) {
    if (this.paused) return;

    if (this._cameraControlsEnabled) this._updatePinchZoom();

    const activeEnemies = this.enemySystem?.enemies ?? [];

    this.towerSystem?.update(
      delta,
      activeEnemies,
      (fromPos, enemy, def) => {
        this.projectileSystem?.fire(fromPos.x, fromPos.y, enemy, def);
      },
      (type, amount) => {
        if (type === "heal") {
          this.hp = Math.min(100, this.hp + amount);
        }
      },
    );

    this.enemySystem?.update(delta);
    this.projectileSystem?.update(delta);

    this._frameCount++;
    this._animTime++;
    this._enemyWalkPhase += 0.045;
    this._toxinBouncePhase += 0.04;

    this._mitosisT += delta / 6000;
    this._currentPhase = getPhase(this._mitosisT);
    this._currentShape = cellShapeForPhase(this._currentPhase, this.cellR);

    if (this._waveActive) {
      this._phaseProgress = Math.min(1, this._phaseProgress + delta / 20000);
    }

    if (!this.reducedMotion && this._frameCount % 2 === 0) {
      this._updateEntityTextures();
      this._updateCellTexture();
    }

    if (this._waveActive && this._frameCount % 30 === 0) {
      if (this.enemySystem.allEnemiesDead()) {
        this._waveActive = false;
        this.bus?.emit("waveCleared", { phase: this.phase });
      }
    }

    if (this._frameCount % 60 === 0) {
      this._emitState();
    }
  }

  _emitState() {
    this.bus?.emit("stateChanged", {
      hp: this.hp,
      atp: this.atp,
      mutations: this.mutations,
      phase: this.phase,
      wave: this.wave,
    });
  }

  _buildGeometry(width, height) {
    // Guard against degenerate sizes fired by Phaser on mobile before the
    // container's height chain resolves (e.g. resize(width, 0)).
    if (!width || !height || width < 100 || height < 100) return;

    const hudH = 56;
    const shopW = Math.max(200, Math.round(width * 0.18));
    const gameW = width - shopW;
    const gameH = height - hudH;

    const topPad = 46;
    const botPad = 40;
    const availH = gameH - topPad - botPad;

    const maxR = Math.min(
      availH / 2.7,
      gameW / 3.6,
      Math.min(width, height) * 0.32,
    );
    this.cellR = Math.round(maxR);
    this.nucleusR = this.cellR * 0.16;
    // 214 ≈ the cell radius on a typical desktop arena, where setScale(1.3)
    // was authored to look right. Clamp so towers never vanish or overflow.
    this.entityScale = Phaser.Math.Clamp(this.cellR / 214, 0.4, 1.15);
    this._shopW = shopW;
    this.cellCX = shopW + gameW * 0.5;
    this.cellCY =
      hudH +
      topPad +
      this.cellR * 1.2 +
      Math.max(0, (availH - this.cellR * 2.7) / 2);
  }

  _getBreachPoints() {
    return [
      { x: this.cellCX - this.cellR * 1.4, y: this.cellCY - this.cellR * 1.2 },
      { x: this.cellCX + this.cellR * 1.4, y: this.cellCY - this.cellR * 1.2 },
      { x: this.cellCX, y: this.cellCY + this.cellR * 1.5 },
      { x: this.cellCX - this.cellR * 1.7, y: this.cellCY + this.cellR * 0.3 },
      { x: this.cellCX + this.cellR * 1.7, y: this.cellCY + this.cellR * 0.3 },
    ];
  }

  _onResize(width, height) {
    // Ignore degenerate resize events (mobile URL bar show/hide can fire width=X, height=0)
    if (!width || !height || width < 100 || height < 100) return;

    this._buildGeometry(width, height);
    const breachPoints = this._getBreachPoints();

    this.hexGrid?.destroy();
    this._vignetteGraphics?.destroy();
    this._drawHexGrid();

    if (this.textures.exists("cellPhase")) this.textures.remove("cellPhase");
    this._cellImage?.destroy();
    this._cellCanvas = null;
    this._cellImage = null;
    this._initAnimatedCell();

    this._breachGraphics?.destroy();
    this._breachLabels.forEach((l) => l.destroy());
    this._breachLabels = [];
    this._drawBreachIndicators(breachPoints);

    const placedTowers = this.towerSlots.map((s) => s.tower ?? null);
    this.slotGraphics?.destroy();
    this._selectionGraphics?.destroy();
    this._selectionGraphics = null;
    this._buildTowerSlots();

    if (this.towerSystem) this.towerSystem.slots = this.towerSlots;

    for (let i = 0; i < this.towerSlots.length; i++) {
      const tower = placedTowers[i];
      if (!tower) continue;
      const slot = this.towerSlots[i];
      slot.tower = tower;

      if (tower.sprite?.active) {
        this.tweens.killTweensOf(tower.sprite);
        tower.sprite.setPosition(slot.x, slot.y);
        tower.sprite.setScale(1.3 * this.entityScale);
        this.tweens.add({
          targets: tower.sprite,
          y: { from: slot.y - 4, to: slot.y + 4 },
          yoyo: true,
          repeat: -1,
          duration: 1500 + Math.random() * 600,
          ease: "Sine.easeInOut",
        });
      }

      tower.range = tower.def.range * this.entityScale;
      if (tower.rangeCircle?.active && tower.range > 0) {
        tower.rangeCircle.clear();
        tower.rangeCircle.fillStyle(0xffffff, 0.06);
        tower.rangeCircle.fillCircle(slot.x, slot.y, tower.range);
        tower.rangeCircle.lineStyle(1, 0x3bafa9, 0.4);
        tower.rangeCircle.strokeCircle(slot.x, slot.y, tower.range);
      }
    }

    if (this.enemySystem) {
      this.enemySystem.cellCX = this.cellCX;
      this.enemySystem.cellCY = this.cellCY;
      this.enemySystem.cellR = this.cellR;
      this.enemySystem.rebuildPaths(breachPoints);
    }
  }

  _initAnimatedCell() {
    const diameter = Math.ceil(this.cellR * 2.6);

    const c = document.createElement("canvas");
    c.width = diameter;
    c.height = diameter;
    this._cellCanvas = c;

    this._drawCellToCanvas();

    if (this.textures.exists("cellPhase")) {
      this.textures.remove("cellPhase");
    }
    this.textures.addCanvas("cellPhase", c);

    this._cellImage = this.add.image(this.cellCX, this.cellCY, "cellPhase");
    this._cellImage.setDepth(1);
  }

  _drawCellToCanvas() {
    if (!this._cellCanvas) return;
    const ctx = this._cellCanvas.getContext("2d");
    const hw = this._cellCanvas.width / 2;
    const hh = this._cellCanvas.height / 2;
    ctx.clearRect(0, 0, this._cellCanvas.width, this._cellCanvas.height);
    drawCell(
      ctx,
      hw,
      hh,
      this.cellR,
      this._currentPhase,
      this._currentShape,
      this._animTime,
    );
  }

  _updateCellTexture() {
    if (!this._cellCanvas) return;
    this._drawCellToCanvas();
    const src = this.textures.get("cellPhase")?.source?.[0];
    if (src) src.update();
  }

  _updateEntityTextures() {
    if (!this._entityCanvases) return;
    const t = this._animTime;

    const drawFns = {
      lysosome: (ctx, cx, cy, r) => drawLysosome(ctx, cx, cy, r, t, 0),
      proteinKinase: (ctx, cx, cy, r) =>
        drawProteinKinase(ctx, cx, cy, r, t, 0),
      repairEnzyme: (ctx, cx, cy, r) => drawRepairEnzyme(ctx, cx, cy, r, t, 0),
      viralHijacker: (ctx, cx, cy, r) =>
        drawViralHijacker(ctx, cx, cy, r, t, this._enemyWalkPhase),
      toxinDroplet: (ctx, cx, cy, r) =>
        drawToxinDroplet(ctx, cx, cy, r, t, this._toxinBouncePhase),
      radiationPulse: (ctx, cx, cy, r) => drawRadiationPulse(ctx, cx, cy, r, t),
    };

    for (const [key, entry] of Object.entries(this._entityCanvases)) {
      const fn = drawFns[key];
      if (!fn) continue;
      const ctx = entry.canvas.getContext("2d");
      ctx.clearRect(0, 0, entry.canvas.width, entry.canvas.height);
      fn(ctx, entry.cx, entry.cy, entry.r);
      const src = this.textures.get(key)?.source?.[0];
      if (src) src.update();
    }
  }

  _drawBreachIndicators(breachPoints) {
    const g = this.add.graphics();
    g.setDepth(3);
    this._breachGraphics = g;

    breachPoints.forEach((bp) => {
      g.lineStyle(2, 0xff4040, 0.65);
      g.strokeCircle(bp.x, bp.y, 26);
      g.lineStyle(1, 0xff4040, 0.25);
      g.strokeCircle(bp.x, bp.y, 38);

      g.lineStyle(1.5, 0xff4040, 0.6);
      g.beginPath();
      g.moveTo(bp.x - 18, bp.y);
      g.lineTo(bp.x + 18, bp.y);
      g.strokePath();
      g.beginPath();
      g.moveTo(bp.x, bp.y - 18);
      g.lineTo(bp.x, bp.y + 18);
      g.strokePath();

      const dx = this.cellCX - bp.x;
      const dy = this.cellCY - bp.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const nx = dx / dist,
        ny = dy / dist;
      const arrowBase = 32,
        arrowTip = 56;
      const ax = bp.x + nx * arrowBase,
        ay = bp.y + ny * arrowBase;
      const tx = bp.x + nx * arrowTip,
        ty = bp.y + ny * arrowTip;
      const px = -ny * 8,
        py = nx * 8;
      g.lineStyle(0, 0, 0);
      g.fillStyle(0xff4040, 0.75);
      g.beginPath();
      g.moveTo(tx, ty);
      g.lineTo(ax + px, ay + py);
      g.lineTo(ax - px, ay - py);
      g.closePath();
      g.fillPath();

      const lbl = this.add
        .text(bp.x, bp.y - 44, "ENTRY POINT", {
          fontSize: "9px",
          color: "#FF8080",
          stroke: "#000000",
          strokeThickness: 2,
          fontFamily: '"Courier New", Courier, monospace',
          fontStyle: "bold",
        })
        .setOrigin(0.5, 1)
        .setDepth(3);
      this._breachLabels.push(lbl);
    });

    this.tweens.add({
      targets: g,
      alpha: { from: 0.6, to: 1 },
      yoyo: true,
      repeat: -1,
      duration: 900,
      ease: "Sine.easeInOut",
    });
  }

  _drawHexGrid() {
    const { width, height } = this.scale;
    const g = this.add.graphics();

    const size = HEX_SIZE;
    const w = size * 2;
    const h = Math.sqrt(3) * size;
    const cols = Math.ceil(width / (w * 0.75)) + 2;
    const rows = Math.ceil(height / h) + 2;

    g.lineStyle(0.8, 0xffffff, 0.045);

    for (let row = -1; row < rows; row++) {
      for (let col = -1; col < cols; col++) {
        const cx = col * w * 0.75;
        const cy = row * h + (col % 2 === 0 ? 0 : h / 2);

        g.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = (Math.PI / 180) * (60 * i);
          const px = cx + size * Math.cos(a);
          const py = cy + size * Math.sin(a);
          if (i === 0) g.moveTo(px, py);
          else g.lineTo(px, py);
        }
        g.closePath();
        g.strokePath();
      }
    }

    this._vignetteGraphics = this.add.graphics();
    this._vignetteGraphics.lineStyle(
      Math.min(width, height) * 0.4,
      0x000000,
      0.35,
    );
    this._vignetteGraphics.strokeCircle(
      width / 2,
      height / 2,
      Math.max(width, height) * 0.7,
    );

    this.hexGrid = g;
  }

  _buildTowerSlots() {
    const g = this.add.graphics();

    this.towerSlots = [];

    for (let i = 0; i < SLOT_COUNT; i++) {
      const angle = (i / SLOT_COUNT) * Math.PI * 2 - Math.PI / 2;
      const x = this.cellCX + this.cellR * Math.cos(angle);
      const y = this.cellCY + this.cellR * Math.sin(angle);

      g.lineStyle(1.5, 0x3bafa9, 0.3);
      g.strokeCircle(x, y, 11);
      g.fillStyle(0x3bafa9, 0.2);
      g.fillCircle(x, y, 4);

      // Slot taps are resolved by _handleSlotTap via the scene-level pointerup,
      // which behaves consistently for both mouse and touch input.
      this.towerSlots.push({ angle, x, y, tower: null });
    }

    this.slotGraphics = g;
  }

  _busOn(event, fn) {
    this._busListeners[event] ??= [];
    this._busListeners[event].push(fn);
    this.bus.on(event, fn);
  }

  _setupBusListeners() {
    if (!this.bus) return;

    this._busOn("cameraZoomIn", () => {
      const cam = this.cameras.main;
      cam.setZoom(Phaser.Math.Clamp(cam.zoom * 1.3, 0.4, 3.0));
    });
    this._busOn("cameraZoomOut", () => {
      const cam = this.cameras.main;
      cam.setZoom(Phaser.Math.Clamp(cam.zoom / 1.3, 0.4, 3.0));
    });
    this._busOn("cameraReset", () => {
      const cam = this.cameras.main;
      cam.setZoom(1);
      cam.setScroll(0, 0);
    });

    this._busOn("phaseTransition", ({ fromPhase, toPhase }) => {
      if (toPhase !== this.phase) this._phaseProgress = 0;
      if (fromPhase !== toPhase) {
        const phaseStartT = {
          interphase: 0,
          prophase: 4.0,
          metaphase: 7.5,
          anaphase: 11.0,
          telophase: 14.5,
          cytokinesis: 18.0,
        };
        const t = phaseStartT[toPhase];
        if (t !== undefined) this._mitosisT = t;
      }
    });

    this._busOn("pause", () => {
      this.physics.pause();
      this.tweens.pauseAll();
      this.paused = true;
    });

    this._busOn("resume", () => {
      this.physics.resume();
      this.tweens.resumeAll();
      this.paused = false;
    });

    this._busOn("towerSelected", ({ towerId }) => {
      this._selectedTowerId = towerId ?? null;
      this._showSlotHighlights(this._selectedTowerId);
      const canvas = this.sys?.game?.canvas;
      if (canvas) canvas.style.cursor = towerId ? "crosshair" : "default";
    });

    this._busOn("placeTower", ({ towerId, slotIndex }) => {
      const def = TOWERS[towerId];
      if (!def || this.atp < def.cost) return;

      const placed = this.towerSystem.placeTower(slotIndex, towerId);
      if (placed) {
        this.atp -= def.cost;
        this._emitState();
      }
    });

    this._busOn("sellTower", ({ slotIndex }) => {
      const refund = this.towerSystem.sellTower(slotIndex);
      if (refund > 0) {
        this.atp += refund;
        this._emitState();
      }
    });

    this._busOn("upgradeTower", ({ slotIndex }) => {
      const slot = this.towerSlots[slotIndex];
      if (!slot?.tower) return;
      const upgradeCost = slot.tower.def.upgradeCost ?? 0;
      if (this.atp < upgradeCost) return;
      this.atp -= upgradeCost;
      this.towerSystem.upgradeTower(slotIndex);
      this._emitState();
    });

    this._busOn("waveCleared", () => {
      this.phaseSystem?.onWaveCleared();
    });

    this._busOn("enemyReachedNucleus", ({ mutationType }) => {
      const damage = this.doubleHitActive ? 20 : 10;
      this.doubleHitActive = false;
      this.hp = Math.max(0, this.hp - damage);

      if (mutationType) {
        this.mutationSystem?.addMutation(mutationType);
      } else {
        this._emitState();
      }

      if (this.hp <= 0) {
        this.bus?.emit("gameOver", { reason: "nucleusDestroyed" });
      }
    });

    this._busOn("gameOver", ({ reason }) => {
      this.physics.pause();
      this.paused = true;
      this._emitState();
      this.bus?.emit("runComplete", {
        stars: 0,
        mutations: this.mutationSystem?.getAll() ?? [],
        hpLeft: this.hp,
        xpEarned: 0,
        levelId: LEVELS[this.currentLevel]?.id ?? null,
        reason,
      });
    });

    this._busOn("atpPickupSpawned", ({ x, y, amount }) => {
      this._spawnAtpPickup(x, y, amount);
    });

    this._busOn("spawnTutorialAtp", () => {
      this._spawnAtpPickup(
        this.cellCX + this.cellR * 0.38,
        this.cellCY - this.cellR * 0.42,
        30,
      );
    });

    this._busOn("aoeBlast", ({ x, y, radius }) => {
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

    this._busOn("towerSilence", ({ x, y }) => {
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
          nearestIdx = i;
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
    const color = canAfford ? 0x3bafa9 : 0xff4444;

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
        ease: "Sine.easeInOut",
      });
    }
  }

  destroy() {
    this.scale.off("resize");

    if (this.bus && this._busListeners) {
      for (const [event, fns] of Object.entries(this._busListeners)) {
        for (const fn of fns) {
          this.bus.off(event, fn);
        }
      }
    }
    this._busListeners = {};

    this.phaseSystem?.destroy();
    this.enemySystem?.destroy();

    if (this.textures.exists("cellPhase")) {
      this.textures.remove("cellPhase");
    }
    this._cellCanvas = null;

    const canvas = this.sys?.game?.canvas;
    if (canvas) canvas.style.cursor = "default";
  }

  _spawnAtpPickup(x, y, amount) {
    const pickup = this.add.image(x, y, "atpPickup");
    pickup.setDepth(6);
    pickup.setInteractive({ useHandCursor: true });

    this.tweens.add({
      targets: pickup,
      y: { from: y, to: y - 6 },
      yoyo: true,
      repeat: 3,
      duration: 400,
      ease: "Sine.easeInOut",
    });

    pickup.once("pointerdown", () => {
      // Collecting a pickup must not double as a slot tap on the same gesture.
      this._suppressNextTap = true;
      this.atp += amount;
      this._emitState();

      const label = this.add.text(pickup.x, pickup.y, `+${amount} ATP`, {
        fontSize: "18px",
        fontStyle: "bold",
        color: "#FFD700",
        stroke: "#000000",
        strokeThickness: 3,
      });
      label.setOrigin(0.5, 1);
      label.setDepth(10);
      this.tweens.add({
        targets: label,
        y: label.y - 32,
        alpha: { from: 1, to: 0 },
        duration: 900,
        ease: "Sine.easeOut",
        onComplete: () => label.destroy(),
      });

      pickup.destroy();
    });
  }
}
