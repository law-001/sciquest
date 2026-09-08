import { GAME_XP } from '../games/config/xp.js';

// Stable tier keys retain historical unlocks; presentation shows only the highest tier.
export const GAME_MEDALS = [
  { gameId: 'matter-state-sandbox', gameName: 'Matter State Sandbox', names: ['Matter Observer', 'Phase Shaper', 'State Changer'], keys: ['matter-observer', 'phase-shaper', 'matter-state-sandbox-complete'], xp: [20, 40, GAME_XP['matter-state-sandbox'].achievementXp], levels: [['ch_01', 'ch_02'], ['ch_03', 'ch_04', 'ch_05'], ['ch_06', 'ch_07', 'ch_08']] },
  { gameId: 'mystery-lab', gameName: 'Mystery Lab', names: ['Lab Detective'], keys: ['mystery-lab-complete'], xp: [GAME_XP['mystery-lab'].achievementXp], levels: [['ep01-dying-pond']] },
  { gameId: 'cell-division-lab', gameName: 'Cell Division Lab', names: ['Cell Splitter', 'Chromosome Keeper', 'Genome Guardian'], keys: ['cell-division-lab-complete', 'chromosome-keeper', 'genome-guardian'], xp: [GAME_XP['cell-division-lab'].achievementXp, 40, 60], levels: [['l1'], ['l2'], ['l3']] },
  { gameId: 'food-chain-survival', gameName: 'Food Chain Survival', names: ['Meadow Forager', 'Apex Hunter', 'Circle of Life'], keys: ['meadow-forager', 'apex-hunter', 'circle-of-life'], xp: [20, 40, 60], levels: [['l1'], ['l2'], ['l3']] },
  { gameId: 'quake-ready', gameName: 'Quake Ready', names: ['Seismic Scout', 'Quake Survivor', 'Rescue Commander'], keys: ['seismic-scout', 'quake-survivor', 'rescue-commander'], xp: [20, 40, 60], levels: [['l1'], ['l2'], ['l3']] },
  { gameId: 'plant-cell', gameName: 'Plant Cell', names: ['Sun Catcher', 'Water Keeper', 'Cell Medic'], keys: ['sun-catcher', 'water-keeper', 'cell-medic'], xp: [GAME_XP['plant-cell'].achievementXp, 40, 60], levels: [['l1'], ['l2'], ['l3']] },
];

export const GAME_ACHIEVEMENTS = GAME_MEDALS.flatMap((game) => game.keys.map((key, index) => ({
  key, label: game.names[index], gameId: game.gameId, gameName: game.gameName,
  tier: index + 1, maxTier: game.keys.length, xp: game.xp[index],
  req: `Complete ${game.keys.length === 1 ? 'the mystery' : `levels 1–${index + 1}`} in ${game.gameName}`,
  next: game.names[index + 1] ?? null,
  criteria: (ctx) => {
    const completed = new Set((ctx.completedGames ?? []).filter((row) => row.gameId === game.gameId).map((row) => row.challengeId));
    return game.levels.slice(0, index + 1).every((ids) => ids.every((id) => completed.has(id)));
  },
})));

export function visibleAchievementCatalog(catalog, unlockedKeys = []) {
  const unlocked = new Set(unlockedKeys);
  const chosen = new Set(GAME_MEDALS.map((game) => [...game.keys].reverse().find((key) => unlocked.has(key)) ?? game.keys[0]));
  return catalog.filter((a) => !a.gameId || chosen.has(a.key));
}

export function currentAchievementKey(key, unlockedKeys) {
  const game = GAME_MEDALS.find((g) => g.keys.includes(key));
  return game ? [...game.keys].reverse().find((k) => unlockedKeys.includes(k)) ?? key : key;
}
