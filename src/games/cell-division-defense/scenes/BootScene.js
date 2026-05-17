import { BaseGameScene } from '../../_shared/phaser/BaseGameScene';
import {
  drawLysosome,
  drawProteinKinase,
  drawRepairEnzyme,
  drawViralHijacker,
  drawToxinDroplet,
  drawRadiationPulse,
} from '../systems/EntityDraw';

// Canvas dimensions for each entity type
const TOWER_SIZE  = 80;
const ENEMY_SIZE  = 64;
const PROJ_SIZE   = 12;
const ATP_SIZE    = 14;

function makeCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width  = w;
  c.height = h;
  return c;
}

export default class BootScene extends BaseGameScene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    const mid = TOWER_SIZE / 2;
    const emid = ENEMY_SIZE / 2;
    const tr = mid * 0.7;   // tower body radius
    const er = emid * 0.7;  // enemy body radius

    // ── Tower canvases ─────────────────────────────────────────────────────
    const lysosomeCanvas = makeCanvas(TOWER_SIZE, TOWER_SIZE);
    drawLysosome(lysosomeCanvas.getContext('2d'), mid, mid, tr, 60, 0);
    this.textures.addCanvas('lysosome', lysosomeCanvas);

    const pkCanvas = makeCanvas(TOWER_SIZE, TOWER_SIZE);
    drawProteinKinase(pkCanvas.getContext('2d'), mid, mid, tr, 60, 0);
    this.textures.addCanvas('proteinKinase', pkCanvas);

    const reCanvas = makeCanvas(TOWER_SIZE, TOWER_SIZE);
    drawRepairEnzyme(reCanvas.getContext('2d'), mid, mid, tr, 60, 0);
    this.textures.addCanvas('repairEnzyme', reCanvas);

    // ── Enemy canvases ─────────────────────────────────────────────────────
    const vhCanvas = makeCanvas(ENEMY_SIZE, ENEMY_SIZE);
    drawViralHijacker(vhCanvas.getContext('2d'), emid, emid, er, 60, 0);
    this.textures.addCanvas('viralHijacker', vhCanvas);

    const tdCanvas = makeCanvas(ENEMY_SIZE, ENEMY_SIZE);
    drawToxinDroplet(tdCanvas.getContext('2d'), emid, emid, er, 60, 0);
    this.textures.addCanvas('toxinDroplet', tdCanvas);

    const rpCanvas = makeCanvas(ENEMY_SIZE, ENEMY_SIZE);
    drawRadiationPulse(rpCanvas.getContext('2d'), emid, emid, er, 60);
    this.textures.addCanvas('radiationPulse', rpCanvas);

    // ── Store canvases in registry for CellDefenseScene to animate ──────────
    this.game.registry.set('entityCanvases', {
      lysosome:      { canvas: lysosomeCanvas, cx: mid, cy: mid, r: tr },
      proteinKinase: { canvas: pkCanvas,       cx: mid, cy: mid, r: tr },
      repairEnzyme:  { canvas: reCanvas,       cx: mid, cy: mid, r: tr },
      viralHijacker: { canvas: vhCanvas,       cx: emid, cy: emid, r: er },
      toxinDroplet:  { canvas: tdCanvas,       cx: emid, cy: emid, r: er },
      radiationPulse:{ canvas: rpCanvas,       cx: emid, cy: emid, r: er },
    });

    // ── Simple Phaser.Graphics for projectile + ATP pickup ─────────────────
    this._makeTexture('projectile', PROJ_SIZE, PROJ_SIZE, (g) => {
      g.fillStyle(0xEAB308, 1);
      g.fillCircle(6, 6, 5);
    });

    this._makeTexture('atpPickup', ATP_SIZE, ATP_SIZE, (g) => {
      g.fillStyle(0xFDE047, 1);
      g.fillCircle(7, 7, 6);
      g.lineStyle(1.5, 0xF59E0B, 1);
      g.strokeCircle(7, 7, 6);
    });
  }

  create() {
    const initData = {
      reducedMotion: this.game.registry.get('reducedMotion') ?? false,
      deviceTier:    this.game.registry.get('deviceTier')    ?? 'mid',
    };
    this.scene.start('CellDefenseScene', initData);
  }

  _makeTexture(key, w, h, drawFn) {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    drawFn(g);
    g.generateTexture(key, w, h);
    g.destroy();
  }
}
