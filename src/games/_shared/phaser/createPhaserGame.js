import Phaser from 'phaser';

export function createPhaserGame({ containerId, scenes, bus, deviceTier }) {
  const fps = deviceTier === 'low' ? 30 : 60;

  return new Phaser.Game({
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
    callbacks: {
      postBoot: (game) => {
        game.bus = bus;
      },
    },
  });
}
