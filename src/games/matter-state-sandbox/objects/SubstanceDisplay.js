import Phaser from 'phaser';

const GAS_PUFF_COUNT = 7;

function parseColor(str) {
  if (str.startsWith('rgba') || str.startsWith('rgb')) {
    const m = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (!m) return { color: 0xffffff, alpha: 1 };
    const r = parseInt(m[1]);
    const g = parseInt(m[2]);
    const b = parseInt(m[3]);
    return { color: (r << 16) | (g << 8) | b, alpha: m[4] !== undefined ? parseFloat(m[4]) : 1 };
  }
  const c = Phaser.Display.Color.HexStringToColor(str);
  return { color: c.color, alpha: 1 };
}

function darkenColor(colorInt, factor = 0.65) {
  const r = Math.floor(((colorInt >> 16) & 0xff) * factor);
  const g = Math.floor(((colorInt >> 8) & 0xff) * factor);
  const b = Math.floor((colorInt & 0xff) * factor);
  return (r << 16) | (g << 8) | b;
}

export default class SubstanceDisplay {
  constructor(scene, substance, containerBounds, reducedMotion) {
    this.scene = scene;
    this.substance = substance;
    this.bounds = containerBounds;
    this.reducedMotion = reducedMotion;

    this.currentState = null;
    this.isTransitioning = false;
    this._queuedState = null;

    this._solidGfx = null;
    this._solidPulseTween = null;
    this._liquidGfx = null;
    this._liquidManaged = false; // true during grow/shrink animations
    this._liquidHeightFraction = 1;
    this._gasPuffs = []; // { gfx }
    this._gasPuffsActive = false;
  }

  // ── Public API ───────────────────────────────────────────────

  show(state) {
    this._clearAll();
    this.currentState = state;
    if (state === 'solid') {
      this._drawSolid();
      if (!this.reducedMotion) this._startSolidPulse();
    } else if (state === 'liquid') {
      this._liquidHeightFraction = 1;
      this._drawLiquid();
    } else if (state === 'gas') {
      this._drawGas(1);
    }
  }

  transitionTo(newState) {
    if (newState === this.currentState && !this.isTransitioning) return;

    if (this.isTransitioning) {
      this._queuedState = newState;
      return;
    }

    if (this.reducedMotion) {
      this.show(newState);
      this.scene.bus.emit('transitionComplete');
      return;
    }

    this.isTransitioning = true;
    const from = this.currentState;
    const to = newState;

    const onComplete = () => {
      this.isTransitioning = false;
      this.currentState = to;
      this.scene.bus.emit('transitionComplete');
      if (this._queuedState) {
        const next = this._queuedState;
        this._queuedState = null;
        this.transitionTo(next);
      }
    };

    const map = {
      'solid>liquid': () => this._transitionSolidToLiquid(onComplete),
      'liquid>solid': () => this._transitionLiquidToSolid(onComplete),
      'liquid>gas':   () => this._transitionLiquidToGas(onComplete),
      'gas>liquid':   () => this._transitionGasToLiquid(onComplete),
      'solid>gas':    () => this._transitionSolidToGas(onComplete),
      'gas>solid':    () => this._transitionGasToSolid(onComplete),
    };

    const handler = map[`${from}>${to}`];
    if (handler) {
      handler();
    } else {
      this.show(to);
      onComplete();
    }
  }

  // Called every frame by SandboxScene.update() when state is 'liquid'
  updateLiquidSurface(time) {
    if (!this._liquidGfx || this._liquidManaged) return;
    this._redrawLiquid(time, this._liquidHeightFraction);
  }

  destroy() {
    this._clearAll();
  }

  // ── Private: drawing ─────────────────────────────────────────

  _solidDims() {
    const { x, y, width, height } = this.bounds;
    return {
      w: width * 0.6,
      h: height * 0.35,
      cx: x + width * 0.5,
      by: y + height,
    };
  }

  _drawSolid() {
    const { color: fillColor } = parseColor(this.substance.solidColor);
    const strokeColor = darkenColor(fillColor);
    const { w, h, cx, by } = this._solidDims();

    const gfx = this.scene.add.graphics();
    // Drawn upward from origin so scaleY=0 collapses toward the bottom anchor
    gfx.fillStyle(fillColor, 1);
    gfx.fillRoundedRect(-w / 2, -h, w, h, 10);
    gfx.lineStyle(2, strokeColor, 1);
    gfx.strokeRoundedRect(-w / 2, -h, w, h, 10);
    gfx.setPosition(cx, by);
    this._solidGfx = gfx;
  }

  _startSolidPulse() {
    if (!this._solidGfx || this.reducedMotion) return;
    this._solidPulseTween = this.scene.tweens.add({
      targets: this._solidGfx,
      scaleX: 1.015,
      scaleY: 1.015,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  _stopSolidPulse() {
    if (this._solidPulseTween) {
      this._solidPulseTween.stop();
      this._solidPulseTween = null;
    }
    if (this._solidGfx) {
      this._solidGfx.setScale(1, 1);
    }
  }

  _drawLiquid() {
    const gfx = this.scene.add.graphics();
    this._liquidGfx = gfx;
    this._redrawLiquid(0, this._liquidHeightFraction);
  }

  _redrawLiquid(time, heightFraction = 1) {
    const gfx = this._liquidGfx;
    if (!gfx) return;

    const { x, y, width, height } = this.bounds;
    const liquidH = height * 0.4 * heightFraction;
    const baseY = y + height;
    const topBaseY = baseY - liquidH;
    const { color: fillColor, alpha: fillAlpha } = parseColor(this.substance.liquidColor);

    gfx.clear();
    gfx.fillStyle(fillColor, fillAlpha);
    gfx.beginPath();
    gfx.moveTo(x, topBaseY + (this.reducedMotion ? 0 : Math.sin(time / 800) * 4));
    for (let px = 2; px <= width; px += 2) {
      const waveY = topBaseY + (this.reducedMotion ? 0 : Math.sin(time / 800 + px * 0.02) * 4);
      gfx.lineTo(x + px, waveY);
    }
    gfx.lineTo(x + width, baseY);
    gfx.lineTo(x, baseY);
    gfx.closePath();
    gfx.fillPath();
  }

  _drawGas(initialAlpha) {
    const { x, y, width, height } = this.bounds;
    const { color: fillColor, alpha: baseAlpha } = parseColor(this.substance.gasColor);
    this._gasPuffsActive = true;

    for (let i = 0; i < GAS_PUFF_COUNT; i++) {
      const pw = Phaser.Math.Between(30, 60);
      const ph = Phaser.Math.Between(20, 35);
      const px = Phaser.Math.Between(x + pw / 2, x + width - pw / 2);
      const py = Phaser.Math.Between(y + ph / 2, y + height - ph / 2);
      const targetAlpha = Phaser.Math.FloatBetween(0.3, 0.5) * baseAlpha;

      const gfx = this.scene.add.graphics();
      gfx.fillStyle(fillColor, 1);
      gfx.fillEllipse(0, 0, pw, ph);
      gfx.setPosition(px, py);
      gfx.setAlpha(targetAlpha * initialAlpha);

      this._gasPuffs.push({ gfx });
      if (!this.reducedMotion) {
        const delay = Phaser.Math.Between(0, 2000);
        this.scene.time.delayedCall(delay, () => this._driftGasPuff(gfx));
      }
    }
  }

  _driftGasPuff(gfx) {
    if (!this._gasPuffsActive) return;
    const { x, y, width, height } = this.bounds;
    this.scene.tweens.add({
      targets: gfx,
      x: Phaser.Math.Between(x + 15, x + width - 15),
      y: Phaser.Math.Between(y + 10, y + height - 10),
      duration: Phaser.Math.Between(3000, 5000),
      ease: 'Sine.easeInOut',
      onComplete: () => this._driftGasPuff(gfx),
    });
  }

  // ── Private: transitions ─────────────────────────────────────

  _transitionSolidToLiquid(onComplete) {
    this._stopSolidPulse();
    const solidGfx = this._solidGfx;

    this.scene.tweens.add({
      targets: solidGfx,
      scaleY: 0,
      duration: 800,
      ease: 'Power1.easeIn',
      onComplete: () => {
        solidGfx.destroy();
        this._solidGfx = null;

        this._liquidHeightFraction = 0;
        this._liquidManaged = true;
        this._drawLiquid();
        const prog = { t: 0 };
        this.scene.tweens.add({
          targets: prog,
          t: 1,
          duration: 600,
          ease: 'Power1.easeOut',
          onUpdate: () => {
            this._liquidHeightFraction = prog.t;
            this._redrawLiquid(0, prog.t);
          },
          onComplete: () => {
            this._liquidHeightFraction = 1;
            this._liquidManaged = false;
            onComplete();
          },
        });
      },
    });
  }

  _transitionLiquidToSolid(onComplete) {
    const liquidGfx = this._liquidGfx;
    this._liquidGfx = null;
    this._liquidManaged = true;

    this.scene.tweens.add({
      targets: liquidGfx,
      alpha: 0,
      duration: 600,
      ease: 'Power1.easeIn',
      onComplete: () => {
        liquidGfx.destroy();
        this._liquidManaged = false;
        this._drawSolid();
        const solidGfx = this._solidGfx;
        solidGfx.setAlpha(0);
        this.scene.tweens.add({
          targets: solidGfx,
          alpha: 1,
          duration: 500,
          ease: 'Power1.easeOut',
          onComplete: () => {
            this._startSolidPulse();
            onComplete();
          },
        });
      },
    });
  }

  _transitionLiquidToGas(onComplete) {
    const liquidGfx = this._liquidGfx;
    this._liquidGfx = null;
    this._liquidManaged = true;

    const { x, y, width, height } = this.bounds;
    const { color: fillColor, alpha: baseAlpha } = parseColor(this.substance.gasColor);

    // Spawn puffs at alpha 0 while liquid fades out
    const newPuffs = [];
    this._gasPuffsActive = true;

    for (let i = 0; i < GAS_PUFF_COUNT; i++) {
      const pw = Phaser.Math.Between(30, 60);
      const ph = Phaser.Math.Between(20, 35);
      const px = Phaser.Math.Between(x + pw / 2, x + width - pw / 2);
      const py = Phaser.Math.Between(y + ph / 2, y + height - ph / 2);
      const targetAlpha = Phaser.Math.FloatBetween(0.3, 0.5) * baseAlpha;

      const gfx = this.scene.add.graphics();
      gfx.fillStyle(fillColor, 1);
      gfx.fillEllipse(0, 0, pw, ph);
      gfx.setPosition(px, py);
      gfx.setAlpha(0);
      newPuffs.push({ gfx, targetAlpha });
    }

    this.scene.tweens.add({
      targets: liquidGfx,
      alpha: 0,
      duration: 1000,
      ease: 'Power1.easeIn',
      onComplete: () => { liquidGfx.destroy(); this._liquidManaged = false; },
    });

    let fadedIn = 0;
    newPuffs.forEach(({ gfx, targetAlpha }) => {
      this.scene.tweens.add({
        targets: gfx,
        alpha: targetAlpha,
        duration: 1000,
        ease: 'Power1.easeOut',
        onComplete: () => {
          fadedIn++;
          if (fadedIn === GAS_PUFF_COUNT) {
            this._gasPuffs = newPuffs.map(p => ({ gfx: p.gfx }));
            newPuffs.forEach(({ gfx: pg }) => this._driftGasPuff(pg));
            onComplete();
          }
        },
      });
    });
  }

  _transitionGasToLiquid(onComplete) {
    this._gasPuffsActive = false;
    const puffs = this._gasPuffs.slice();
    this._gasPuffs = [];

    if (puffs.length === 0) {
      this._liquidHeightFraction = 0;
      this._liquidManaged = true;
      this._drawLiquid();
      const prog = { t: 0 };
      this.scene.tweens.add({
        targets: prog,
        t: 1,
        duration: 600,
        ease: 'Power1.easeOut',
        onUpdate: () => { this._liquidHeightFraction = prog.t; this._redrawLiquid(0, prog.t); },
        onComplete: () => { this._liquidHeightFraction = 1; this._liquidManaged = false; onComplete(); },
      });
      return;
    }

    let done = 0;
    puffs.forEach(({ gfx }) => {
      this.scene.tweens.killTweensOf(gfx);
      this.scene.tweens.add({
        targets: gfx,
        alpha: 0,
        duration: 800,
        ease: 'Power1.easeIn',
        onComplete: () => {
          gfx.destroy();
          done++;
          if (done === puffs.length) {
            this._liquidHeightFraction = 0;
            this._liquidManaged = true;
            this._drawLiquid();
            const prog = { t: 0 };
            this.scene.tweens.add({
              targets: prog,
              t: 1,
              duration: 600,
              ease: 'Power1.easeOut',
              onUpdate: () => { this._liquidHeightFraction = prog.t; this._redrawLiquid(0, prog.t); },
              onComplete: () => {
                this._liquidHeightFraction = 1;
                this._liquidManaged = false;
                onComplete();
              },
            });
          }
        },
      });
    });
  }

  _transitionSolidToGas(onComplete) {
    this._stopSolidPulse();
    const solidGfx = this._solidGfx;
    this._solidGfx = null;

    this.scene.tweens.add({
      targets: solidGfx,
      alpha: 0,
      duration: 800,
      ease: 'Power1.easeIn',
      onComplete: () => {
        solidGfx.destroy();
        this._drawGas(1);
        this._gasPuffs.forEach(({ gfx }) => this._driftGasPuff(gfx));
        onComplete();
      },
    });
  }

  _transitionGasToSolid(onComplete) {
    this._gasPuffsActive = false;
    const puffs = this._gasPuffs.slice();
    this._gasPuffs = [];

    if (puffs.length === 0) {
      this._drawSolid();
      this._startSolidPulse();
      onComplete();
      return;
    }

    let done = 0;
    puffs.forEach(({ gfx }) => {
      this.scene.tweens.killTweensOf(gfx);
      this.scene.tweens.add({
        targets: gfx,
        alpha: 0,
        duration: 800,
        ease: 'Power1.easeIn',
        onComplete: () => {
          gfx.destroy();
          done++;
          if (done === puffs.length) {
            this._drawSolid();
            this._startSolidPulse();
            onComplete();
          }
        },
      });
    });
  }

  // ── Private: cleanup ─────────────────────────────────────────

  _clearAll() {
    this._stopSolidPulse();
    if (this._solidGfx) { this._solidGfx.destroy(); this._solidGfx = null; }

    if (this._liquidGfx) { this._liquidGfx.destroy(); this._liquidGfx = null; }
    this._liquidManaged = false;
    this._liquidHeightFraction = 1;

    this._gasPuffsActive = false;
    this._gasPuffs.forEach(({ gfx }) => {
      this.scene.tweens.killTweensOf(gfx);
      gfx.destroy();
    });
    this._gasPuffs = [];
  }
}
