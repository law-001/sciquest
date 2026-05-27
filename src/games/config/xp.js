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
  'cell-division-defense': {
    // XP by star rating (index = stars earned: 0 = game over / failed,
    // 1 = bronze, 2 = silver, 3 = gold). Awarded each time the game is won;
    // only the improvement over the student's previous best counts toward
    // the profile total.
    starsXp: [0, 40, 80, 120],
    // One-time achievement bonus XP awarded on first completion.
    achievementXp: 75,
  },
};
