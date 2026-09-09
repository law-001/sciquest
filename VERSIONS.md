# Versions

## VERSION_1
- Shrunk "All Achievements" badges on the profile achievements section: medal tiles `w-24 h-24` → `w-16 h-16`, grid now `grid-cols-3 / sm:4 / lg:6` with tighter gaps (`gap-x-3 gap-y-6`) in `src/pages/ProfilePage.jsx`.

## VERSION_2
- Fixed `cell-division-lab` `relatedLessonIds` in `src/lib/games/registry.js` — was pointing at non-existent ids `week-07-cell-division` / `week-08-meiosis`, now `week-15` / `week-16` (the real Mitosis and Meiosis weeks).

## VERSION_3
- New game **Plant Cell: Keep the Cell Alive** (React, no Phaser) under `src/games/plant-cell/` — 3 levels: photosynthesis resource management (L1), osmosis / water balance through changing weather (L2), evidence-based organelle fault diagnosis (L3).
- Data-driven levels (`data/levels.js`, `data/faults.js`, `data/organelles.js`), pure sim steps (`engine/photosynthesis.js`, `engine/osmosis.js`), one shared `ui/CellView.jsx` SVG cell, level-select copied from `cell-division-lab` so the SciQuest topbar matches.
- Registered in `src/lib/games/registry.js` (thumbnail `src/assets/plantcell.svg`), XP in `src/games/config/xp.js`, medals `sun-catcher` / `water-keeper` / `cell-medic` in `src/lib/game-achievements.js` + `public/achievements/`, slug added to `GAMES_WITH_OWN_BACK` in `src/pages/GamePlayPage.jsx`.
- Progress writes go through the existing `src/lib/games/progress.js` via `useGameProgress` — no new progress system, no migration needed.
- `CLAUDE.md`: new rule that every new game ships a Codex asset prompt; worked example at `docs/asset-prompts/plant-cell.md`.

## VERSION_4
- Rewrote `docs/asset-prompts/plant-cell.md` for Codex **image generation** (PNG) instead of SVG: one file per sprite (image models can't do labelled sprite sheets), style-reference chaining, transparent-background + magenta-key fallback, fixed lighting/camera rules, per-asset export sizes, and a `public/games/plant-cell/art/` + `src/assets/plantcell.png` delivery path.
- Consumption table now points at real `CellView.jsx` line numbers; achievement medals explicitly stay SVG; added a code-handoff checklist and a note that object-view sprites are out of scope until that view exists.

## VERSION_5
- New **object view** for Plant Cell level 1: `src/games/plant-cell/ui/PlantView.jsx` — a potted plant by a window drawn in the same 320 × 220 viewBox as `CellView`, driven live by the three sliders (sunlight → sky + sun size + beam opacity, water → sap rising the stem + soil darkening, stomata → guard cells opening in a leaf close-up + CO₂ in / water vapour out) and by the sim (leaves and stem droop and yellow as health/water fall).
- `levels/PowerTheCell.jsx`: 🪴 Whole plant / 🔬 Inside a cell toggle above the stage, defaulting to the plant view.
- `styles.css`: `.pc-viewtabs` (44 px tap targets, pressed state) and leaf/stem transitions with a `prefers-reduced-motion` opt-out.
- `docs/asset-prompts/plant-cell.md`: section 5 adds the 12 object-view images (room, window, sun, beam, healthy/wilted leaf, pot, dry/wet soil, leaf surface, guard cell, vapour particle) and the consumption table now covers `PlantView.jsx`.

## VERSION_6
- Object view now on all three Plant Cell levels. New shared `ui/ViewTabs.jsx` (🪴 Whole plant / 🔬 Inside a cell) used by every level instead of the inline toggle in level 1.
- `PlantView` gained a `weather` prop: falling rain clipped to the window glass, cracks on drought soil, salt grains on salty soil, plus the matching wording in its `aria-label`.
- Level 2 (`KeepItAlive.jsx`) maps the weather onto the scene — `light`/`stomata` per weather row in `data/levels.js` (object view only, they do not feed the sim), membrane channels drive the sap flow, outside water drives the soil colour, and turgor drives the wilt. Opens on the plant view.
- Level 3 (`CellEmergency.jsx`) shows the plant sick or recovering (thirst for a vacuole/membrane fault, health drives the droop). Opens on the cell view because organelles are only clickable there; the hint line says so when the plant view is up.
- `docs/asset-prompts/plant-cell.md`: weather decorations listed as code-drawn, with the images they would need if redrawn.

## VERSION_7
- Plant Cell levels now fit one screen — no page scrolling on desktop. `styles.css` gained window-height scale tokens on `.pc-root` (`--pc-gap`, `--pc-pad`, `--pc-text`, `--pc-text-sm`, `--pc-control`), used by the run header, stage, panel, meters, chips, sliders, hold buttons and level 3's tests/evidence/suspects; the mobile block (`max-width: 900px`) resets them to fixed comfortable sizes and keeps scrolling there.
- The stage now stretches instead of scrolling: `.pc-stage` is full height and the SVG (`.pc-cell`) takes the leftover space and letterboxes, so the cell/plant drawing shrinks with the window rather than pushing captions off screen.
- Controls moved to the top of the panel under a "Your controls" eyebrow in levels 1 and 2, so the sliders are the first thing a student sees.
- Level 3's evidence list scrolls inside its own box (`max-height: clamp(86px, 15vh, 180px)`) and the tests are a 2-column grid, keeping the panel to one screen as evidence piles up.


## VERSION_8
- `docs/asset-prompts/plant-cell.md` now treats the object view as a first-class half of the brief: the consumption table is split into a **Cell view** (`CellView.jsx`) and an **Object view** (`PlantView.jsx`, reached from `ViewTabs.jsx`) block, plus a shared thumbnail row.
- The object-view images moved from a trailing section 5 into **section 4**, inside the "paste into Codex" block where the artist actually reads them; the registry thumbnail became section 5. The intro now states that sections 1-3 are the cell view and 4 the object view, and that both must look like one set because the player flips between them live.
- Object-view section gained the rule that each piece must not contain the others (no plant in the pot, no sun baked into the window) and that `sun.png` is drawn full brightness since the game fades it.
- Corrected every stale `file:line` link in the table (wall 180, cytoplasm 191, vacuole 203, nucleus 220, ribosomes 225, `Stream` 41; plant background 156, window 159, beam 189, `Leaf` 78, pot 212, stomata 241, vapour 54).
- Code handoff now has a `PlantView.jsx` step (shared 320 x 220 viewBox, `LEAVES`/`LANES` unchanged, stem stays a code path, soil `mix()` becomes a two-image crossfade), and the thumbnail steps match reality - `registry.js` already imports `plantcell.png`.


## VERSION_9
- Object view (`PlantView.jsx`) re-aligned to the artwork — every box now matches what the PNGs actually draw, measured off the files.
- Window: the sky rectangle and the rain clip are the glass opening (`GLASS` = 33, 32, 70 x 91) instead of the whole window box, so the blue no longer haloes around the frame. Rain seeds re-laid in three bands 32 apart to match the slide distance.
- Sun sits centred in the top-left pane (`SUN_X`/`SUN_Y`) and is drawn at `sunR * 2.2` so it never spills onto the frame at full light.
- Sunbeam is pinned to the sun (268 x 196 from the pane) instead of stretched full-bleed from the canvas corner, so the light leaves the window rather than the wall.
- Plant shifted to x 160 — its stem base is drawn at x 205, which is the pot's mouth centre, so stem, pot and the sap lane share one axis.
- Soil sized to the pot's mouth ellipse (175, 144.5, 60 x 18) instead of a flat 68 x 14 strip; drought cracks and salt grains moved onto the new band.
- Flow lanes retargeted: sap runs the stem (205, 154 → 70), CO2 arrives at the two right leaf tips, vapour leaves from those leaves. Particle radii evened out (water 15, CO2 9, vapour 6) so the three sprites read the same size despite different padding in each PNG.
- Stoma leader line ends on the close-up and the label pill matches its width; dead `.pc-plant__leaf` / `.pc-plant__stem` rules removed from `styles.css`.


## VERSION_10
- Object view sunbeam angled up: the beam image is now 300 x 150 (flatter wedge) inside a `rotate(-14 SUN_X SUN_Y)` group in `PlantView.jsx`, pivoting on the sun so the apex stays in the pane. The shaft now crosses the plant from the upper leaves down to the pot rim instead of clipping the lowest leaves and pooling on the floor.

---
Staged changes: Angle the Plant Cell sunbeam up so it crosses more of the plant
