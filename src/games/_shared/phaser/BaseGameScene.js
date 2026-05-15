import Phaser from 'phaser';

export class BaseGameScene extends Phaser.Scene {
  constructor(config) {
    super(config);
    this.bus = null;
  }

  init() {
    this.bus = this.game.bus ?? null;
  }

  pause() {
    this.scene.pause();
    this.bus?.emit('gamePaused');
  }

  resume() {
    this.scene.resume();
    this.bus?.emit('gameResumed');
  }
}
