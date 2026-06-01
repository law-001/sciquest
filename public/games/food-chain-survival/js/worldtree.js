/* ===========================================================================
   World Tree — the central restoration objective of Level 3.

   Loads the 7 sliced tree sprites (sprites/tree_stage_01..07.png) and exposes
   them by stage. The trees form a STATE-BASED healing progression (not an
   animation loop):

     1 severely wilted / dying    5 healthy
     2 weak recovery              6 lush
     3 partial healing            7 fully blooming / restored
     4 noticeable regrowth

   The sprites all share the same ground baseline (trimmed to a common bottom),
   so swapping stages never makes the trunk jump — it just fills out in place.
   =========================================================================== */
(function (global) {
  'use strict';
  const G = global.Game;

  const STAGES = 7;
  const imgs = []; // index 0..6  → stage 1..7
  let ready = false;

  async function preload() {
    const tasks = [];
    for (let i = 1; i <= STAGES; i++) {
      const name = 'sprites/tree_stage_' + String(i).padStart(2, '0') + '.png';
      tasks.push(G.loadImage(name).then((img) => { imgs[i - 1] = img; }).catch(() => {}));
    }
    await Promise.all(tasks);
    ready = true;
  }

  // clamp stage to 1..7 and return its image (or null until loaded)
  function img(stage) {
    const i = Math.max(1, Math.min(STAGES, stage | 0)) - 1;
    return imgs[i] || null;
  }

  G.TreeArt = { preload, img, STAGES, get ready() { return ready; } };
})(window);
