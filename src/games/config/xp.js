// Game XP configuration — edit here to tune all game rewards.

export const GAME_XP = {
  'mystery-lab': {
    // One-time achievement bonus XP awarded when the game is first completed.
    // The variable in-game XP (from observations + experiments) is the primary reward.
    achievementXp: 50,
  },
  'matter-state-sandbox': {
    // One-time achievement bonus XP awarded when all levels are first completed.
    achievementXp: 60,
  },
  'cell-division-lab': {
    // XP by star rating (index = stars earned: 0 = the division failed,
    // 1 = bronze, 2 = silver, 3 = gold). Awarded per level completed; only
    // the improvement over the student's previous best for that level counts
    // toward the profile total.
    starsXp: [0, 40, 80, 120],
    // One-time achievement bonus XP awarded on the first division completed.
    achievementXp: 75,
  },
};
