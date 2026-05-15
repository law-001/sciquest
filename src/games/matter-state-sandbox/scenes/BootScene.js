import { BaseGameScene } from '../../_shared/phaser/BaseGameScene';

export default class BootScene extends BaseGameScene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {}

  create() {
    this.bus.emit('sceneReady');

    const initData = {
      level: this.game.registry.get('level') ?? 'level_1',
      substanceId: this.game.registry.get('substanceId') ?? 'water',
      reducedMotion: this.game.registry.get('reducedMotion') ?? false,
      deviceTier: this.game.registry.get('deviceTier') ?? 'mid',
    };

    this.scene.start('SandboxScene', initData);
  }
}
