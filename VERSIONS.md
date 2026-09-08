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

---
Staged changes: Add Plant Cell: Keep the Cell Alive game (3 levels) with registry, XP and achievement wiring
