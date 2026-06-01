/* ===========================================================================
   Levels — metadata, educational cards, and a shared LevelBase with common
   movement / collision / depth-sort / HUD plumbing. Individual level classes
   (Level1..3) register themselves on Game.LevelClasses.
   =========================================================================== */
(function (global) {
  'use strict';
  const G = global.Game;
  const { clamp, dist, TAU } = G;

  /* ----- level metadata (drives cards + edu modals + HUD) ----- */
  const LEVELS = [
    {
      id: 1, key: 'rabbit', cls: 'Level1', color: 'orange', num: '01',
      role: 'Primary Consumer', title: 'Rabbit',
      desc: 'Survive a day and night in the meadow. Graze clover, drink from ponds, and manage your stamina — all while a fox prowls and the light fades.',
      stars: 1, goal: 'Survive until dawn',
      hudGoal: 'Survive until dawn',
      edu: {
        pre: {
          title: 'You are the Rabbit',
          html: `<p>A rabbit is a <b>primary consumer</b> — a herbivore that must constantly forage to fuel its body and stay alert for predators.</p>
                 <div class="fact"><span class="fico">🌿</span><div><b>Hunger & thirst</b> drain all day. Stand on glowing clover to <b>eat</b>, and on a pond's edge to <b>drink</b>. Let either empty and you won't last.</div></div>
                 <div class="fact"><span class="fico">⚡</span><div><b>Stamina</b> fuels your sprint (Shift). It refills when you slow down — so pick your escapes wisely.</div></div>
                 <div class="fact"><span class="fico">🌙</span><div><b>Survive the cycle.</b> The fox grows bolder and the meadow darker as <b>evening</b> and <b>night</b> fall. Hide in grass and bushes until <b>dawn</b>.</div></div>`,
          controls: true,
        },
        post: {
          title: 'A day in the food web',
          html: `<p>To survive, you spent the day converting clover into stored energy — energy a predator would gain only a fraction of. Prey live on a knife's edge: feeding, drinking, and resting all while staying unseen. That constant pressure is what keeps a healthy ecosystem in balance.</p>`,
        },
      },
    },
    {
      id: 2, key: 'fox', cls: 'Level2', color: 'teal', num: '02',
      role: 'Predator', title: 'Fox',
      desc: "Now you're the hunter — half-starved and not the only one. Sneak through tall grass to stay unseen, pick off the head-down grazers, and beat the rival fox, the hawk and the snakes to your quota before your energy runs out.",
      stars: 2, goal: 'Catch 4 rabbits',
      hudGoal: 'Hunt before you starve',
      edu: {
        pre: {
          title: 'You are the Fox',
          html: `<p>A fox is a <b>secondary consumer</b> and <b>predator</b> — but it competes with every other hunter in the wood, and a hunt costs more energy than it returns.</p>
                 <div class="fact"><span class="fico">🍖</span><div>You start the hunt <b>only half fed</b>. Energy drains the whole time and pouncing burns it fast — only a <b>catch</b> refills it. Waste your pounces and you'll starve.</div></div>
                 <div class="fact"><span class="fico">🌿</span><div><b>Sneak (hold Shift)</b> and use tall grass — it hides you from sight. But rabbits <b>hear</b> a fox that walks or pounces in the open, and they bolt the instant they do.</div></div>
                 <div class="fact"><span class="fico">🦅</span><div><b>You're not alone.</b> A rival fox, a diving hawk and ambushing snakes hunt the same rabbits. Every one they take is one you don't get.</div></div>`,
          controls: true,
        },
        post: {
          title: 'Balance of the meadow',
          html: `<p>By hunting, you kept the rabbit population in check. Predators and prey rise and fall together in cycles — too many foxes and the rabbits vanish; too few and the meadow is overgrazed.</p>`,
        },
      },
    },
    {
      id: 3, key: 'worm', cls: 'Level3', color: 'gold', num: '03',
      role: 'Decomposer', title: 'Earthworm',
      desc: 'Close the loop. Crawl the forest floor as an earthworm: eat fallen logs, leaves and remains to make nutrients, then deposit them on dead soil to bring the forest back to life.',
      stars: 3, goal: 'Restore the forest',
      hudGoal: 'Revive the great tree',
      edu: {
        pre: {
          title: 'You are the Earthworm',
          html: `<p>An earthworm is a <b>decomposer</b> and the soil's engineer. It eats dead matter and turns it into <b>castings</b> — nutrient-rich fertiliser that lets new plants grow.</p>
                 <div class="fact"><span class="fico">🍂</span><div><b>Eat dead matter.</b> Crawl onto a log, leaf pile or remains and <b>hold the button</b> to break it down — your <b>Nutrient</b> meter fills as it decomposes.</div></div>
                 <div class="fact"><span class="fico">🌱</span><div><b>Restore the soil.</b> Crawl onto a dull <b>dead patch</b> and hold the button to deposit castings. The soil greens, grass and flowers regrow — it uses up your nutrients.</div></div>
                 <div class="fact"><span class="fico">🌳</span><div><b>Feed the great tree.</b> Crawl up to the dying tree at the centre and hold the button to pour castings into its roots. It blooms from bare to flowering as you feed it.</div></div>
                 <div class="fact"><span class="fico">⬇️</span><div><b>Burrow</b> to travel faster and pass safely <i>under</i> trees and rocks. Surface again whenever you want to work.</div></div>`,
          controls: 'worm',
        },
        post: {
          title: 'Nothing is wasted',
          html: `<p>Earthworms are the recyclers of the forest. By eating dead matter and returning its nutrients to the soil, you fed the clover that feeds the rabbit that feeds the fox — closing the circle you've now played all the way around.</p>`,
        },
      },
    },
  ];

  /* ----- shared base class ----- */
  class LevelBase {
    constructor(env) {
      this.ctx = env.ctx; this.canvas = env.canvas; this.cam = env.cam;
      this.fx = env.fx; this.hud = env.hud; this.meta = env.meta;
      this.W = env.canvas.width; this.H = env.canvas.height;
      this.over = false; this.won = false;
      this.time = 0; this.scene = [];
    }
    // collide a circle (x,y,r) against world blockers, returns adjusted {x,y}
    collide(x, y, r) {
      for (const b of this.world.blockers) {
        const d = dist(x, y, b.x, b.y), min = r + b.r;
        if (d < min && d > 0.01) { const push = (min - d); x += (x - b.x) / d * push; y += (y - b.y) / d * push; }
      }
      const m = (this.world.border || 0) + r;
      x = clamp(x, m, this.world.w - m); y = clamp(y, m, this.world.h - m);
      return { x, y };
    }
    // is point inside any hiding prop?
    //  Tall grass and bushes are anchored at their base and rise UPWARD, and the
    //  scene is depth-sorted by that base y. So a prop only draws OVER (conceals)
    //  the rabbit when the rabbit's feet sit above the prop's base — i.e. the
    //  rabbit is rendered behind it. We mirror that exact render-order test, then
    //  require real overlap: horizontally within the foliage width (>50% of the
    //  body covered) and vertically close enough that the foliage still reaches
    //  the body. The moment the rabbit steps out in front, it's visible again.
    inCover(x, y) {
      for (const p of this.world.props) {
        if (p.type !== 'tallgrass') continue;
        const s = p.s || 1;
        const grass = true;
        const dx = x - p.x, dy = y - p.y;            // dy<0 => feet above base => drawn behind
        // Must be rendered behind the prop (feet at/above its base line).
        if (dy > 2 * s) continue;                    // in front -> visible, never hidden
        // Horizontal: center within the foliage half-width => >50% of body covered.
        const halfW = (grass ? 24 : 30) * s;
        if (Math.abs(dx) > halfW) continue;
        // Vertical: don't count once the rabbit floats above the foliage's reach
        // (blades/lobes only rise ~this far above the base, so beyond it nothing
        //  actually overlaps the body on screen).
        const reach = (grass ? 42 : 46) * s;
        if (dy < -reach) continue;
        return true;
      }
      return false;
    }
    // depth-sorted scene draw: pushes {y, fn}
    renderScene(extra) {
      const list = [];
      for (const p of this.world.props) list.push({ y: p.y, fn: () => this.world.drawProp(this.ctx, this.cam, p) });
      if (extra) for (const e of extra) list.push(e);
      list.sort((a, b) => a.y - b.y);
      for (const it of list) it.fn();
    }
    finish(won, payload) {
      if (this.over) return; this.over = true; this.won = won;
      if (won) G.Audio.win(); else G.Audio.lose();
      this.hud.banner(won ? 'Success!' : 'Try again', won ? '#aee05a' : '#f1955a');
      setTimeout(() => this.hud.result(won, payload || this.scorePayload()), 1100);
    }
    scorePayload() { return { stars: 1, stats: [] }; }
    cleanup() {}
  }

  G.LEVELS = LEVELS;
  G.LevelBase = LevelBase;
  G.LevelClasses = {};
})(window);
