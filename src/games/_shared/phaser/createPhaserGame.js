import Phaser from 'phaser';

export function createPhaserGame({ containerId, scenes, bus, deviceTier }) {
  const fps = deviceTier === 'low' ? 30 : 60;

  const game = new Phaser.Game({
    type: Phaser.WEBGL,
    parent: containerId,
    backgroundColor: 'transparent',
    transparent: true,
    scene: scenes,
    fps: { target: fps, forceSetTimeOut: deviceTier === 'low' },
    physics: {
      default: 'matter',
      matter: { gravity: { y: 1 }, debug: false },
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 800,
      height: 600,
    },
  });

  // Set bus synchronously so BaseGameScene.init() always finds it, regardless of
  // when Phaser fires internal boot callbacks relative to the scene lifecycle.
  game.bus = bus;
  return game;
}
