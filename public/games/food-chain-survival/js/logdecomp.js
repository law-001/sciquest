/* ===========================================================================
   Log decomposition — sprite pools + selection logic.

   Wires the auto-sliced sprites in /sprites into the game:
     • SPAWNABLE LOG STATES  → log_stage_01..30 (intact → cracked → decaying)
                               + fungus_stage_01..20 (fungus-covered / heavy decay)
       Picked with weighted randomness on spawn so the forest looks naturally
       varied — early stages common, advanced decay rare. Dirt is NEVER spawned.
     • FINAL DIRT STATES     → dirt_patch_01..09 (fully decomposed remains).
       Used ONLY as the end-state replacement once the worm finishes a log.

   Each prop keeps ONE fixed spawn sprite for its whole life (no stage scrubbing
   while being eaten); on completion it is swapped to one random dirt patch.
   =========================================================================== */
(function (global) {
  'use strict';
  const G = global.Game;

  // pad to the on-disk naming: log_stage_01.png, fungus_stage_07.png, ...
  function range(prefix, a, b) {
    const out = [];
    for (let i = a; i <= b; i++) out.push(prefix + String(i).padStart(2, '0'));
    return out;
  }

  // Weighted decomposition tiers. Weight = relative spawn likelihood.
  //   intact        — most common, a healthy forest is mostly fresh-ish logs
  //   cracked       — common
  //   decaying      — moderate
  //   fungus-light  — occasional
  //   fungus-heavy  — rare (advanced decay reads as a special find)
  const TIERS = [
    { tier: 'intact',       weight: 5.0, names: range('log_stage_', 1, 10) },
    { tier: 'cracked',      weight: 4.0, names: range('log_stage_', 11, 20) },
    { tier: 'decaying',     weight: 2.5, names: range('log_stage_', 21, 30) },
    { tier: 'fungus-light', weight: 1.5, names: range('fungus_stage_', 1, 10) },
    { tier: 'fungus-heavy', weight: 0.6, names: range('fungus_stage_', 11, 20) },
  ];

  // Final remains — end-state replacements only, NOT spawnable as logs.
  const DIRT = range('dirt_patch_', 1, 9);

  // Flattened weighted selection table.
  const SPAWN = [];
  for (const t of TIERS) for (const n of t.names) SPAWN.push({ name: n, w: t.weight });
  const TOTAL = SPAWN.reduce((s, e) => s + e.w, 0);

  const imgs = Object.create(null); // name -> HTMLImageElement
  let ready = false;

  // Preload every sliced sprite once at boot (alongside the manifest atlases).
  async function preload() {
    const names = SPAWN.map((e) => e.name).concat(DIRT);
    await Promise.all(names.map((n) =>
      G.loadImage('sprites/' + n + '.png')
        .then((img) => { imgs[n] = img; })
        .catch(() => { /* leave missing → procedural fallback in _log */ })
    ));
    ready = true;
  }

  // Weighted-random spawn pick. Avoids repeating the previous selection so
  // adjacent logs don't clone each other and the spread stays natural.
  let last = null;
  function pickLog() {
    let chosen = SPAWN[0].name;
    for (let tries = 0; tries < 5; tries++) {
      let r = Math.random() * TOTAL;
      for (const e of SPAWN) { r -= e.w; if (r <= 0) { chosen = e.name; break; } }
      if (chosen !== last) break; // accept; otherwise reroll a few times
    }
    last = chosen;
    return chosen;
  }

  // One random final dirt patch — every completed decomposition looks different.
  function pickDirt() { return DIRT[(Math.random() * DIRT.length) | 0]; }

  function img(name) { return imgs[name]; }

  G.LogDecomp = {
    preload, pickLog, pickDirt, img,
    DIRT, SPAWN,
    get ready() { return ready; },
  };
})(window);
