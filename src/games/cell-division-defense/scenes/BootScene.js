import { BaseGameScene } from '../../_shared/phaser/BaseGameScene';

export default class BootScene extends BaseGameScene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    this._makeTexture('lysosome', 48, 48, (g) => {
      g.fillStyle(0xF97316, 1);
      g.fillCircle(24, 24, 22);
      g.fillStyle(0xFB923C, 0.6);
      g.fillCircle(18, 18, 10);
    });

    this._makeTexture('proteinKinase', 48, 48, (g) => {
      g.fillStyle(0x3B82F6, 1);
      g.fillEllipse(24, 24, 44, 30);
      g.fillStyle(0x60A5FA, 0.7);
      g.fillEllipse(20, 20, 20, 14);
    });

    this._makeTexture('repairEnzyme', 48, 48, (g) => {
      g.fillStyle(0x22C55E, 1);
      g.fillCircle(24, 24, 22);
      g.fillStyle(0x15803D, 0.9);
      g.fillCircle(24, 24, 12);
      g.fillStyle(0x0D1B2A, 1);
      g.fillCircle(24, 24, 7);
    });

    this._makeTexture('viralHijacker', 44, 44, (g) => {
      g.fillStyle(0x8B5CF6, 1);
      g.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = -Math.PI / 2 + i * (Math.PI / 3);
        const x = 22 + 20 * Math.cos(angle);
        const y = 22 + 20 * Math.sin(angle);
        if (i === 0) g.moveTo(x, y);
        else g.lineTo(x, y);
      }
      g.closePath();
      g.fillPath();
      g.fillStyle(0xC4B5FD, 0.6);
      g.fillCircle(22, 22, 8);
    });

    this._makeTexture('radiationPulse', 44, 44, (g) => {
      g.fillStyle(0xF59E0B, 1);
      g.fillCircle(22, 22, 20);
      g.fillStyle(0xFDE68A, 0.7);
      g.fillCircle(22, 22, 12);
      g.fillStyle(0xFFFBEB, 0.5);
      g.fillCircle(22, 22, 5);
    });

    this._makeTexture('toxinDroplet', 44, 44, (g) => {
      g.fillStyle(0x10B981, 1);
      g.fillEllipse(22, 24, 28, 38);
      g.fillStyle(0x34D399, 0.7);
      g.fillCircle(22, 18, 8);
    });

    this._makeTexture('projectile', 12, 12, (g) => {
      g.fillStyle(0xEAB308, 1);
      g.fillCircle(6, 6, 5);
    });

    this._makeTexture('atpPickup', 14, 14, (g) => {
      g.fillStyle(0xFDE047, 1);
      g.fillCircle(7, 7, 6);
      g.lineStyle(1.5, 0xF59E0B, 1);
      g.strokeCircle(7, 7, 6);
    });
  }

  create() {
    const initData = {
      reducedMotion: this.game.registry.get('reducedMotion') ?? false,
      deviceTier: this.game.registry.get('deviceTier') ?? 'mid',
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
