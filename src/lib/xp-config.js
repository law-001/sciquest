// ============================================================
// XP / Level rules — edit numbers here to retune the economy.
//
// Lesson completion XP is read from each lesson's `xp` field in
// src/data/lessonsweek-*.js. This file owns everything else.
// ============================================================

// Score and XP are decoupled. Score counts correct *units* — 1 per
// question, and 1 per pair in a matching question — so a 10-item quiz
// scores out of 10. XP is awarded per correct unit. Even a 0-correct
// submission earns QUIZ_MIN_XP for trying. Manual-grade questions (essay,
// short-answer) are excluded until a teacher reviews them.
export const QUIZ_MIN_XP = 5;
export const QUIZ_XP_PER_CORRECT = 5; // 5 XP per correct unit

// Cumulative XP required to REACH each level. Index = level number.
// Level 1 starts at 0 XP; the array end caps progression — once a student
// passes the last threshold they stay at the max level.
//   100 → L2, 250 → L3, 450 → L4, 700 → L5, 1000 → L6, 1400 → L7, ...
export const LEVEL_THRESHOLDS = [
  0,     // L1
  100,   // L2
  250,   // L3
  450,   // L4
  700,   // L5
  1000,  // L6
  1400,  // L7
  1900,  // L8
  2500,  // L9
  3200,  // L10
  4000,  // L11
  5000,  // L12
  6500,  // L13
  8500,  // L14
  11000, // L15
];

// A student gets at most this many submissions per quiz. The 4th is blocked.
export const MAX_QUIZ_ATTEMPTS = 3;

// XP ceiling per attempt, as a fraction of what the same performance would
// earn on the first try. Index = attempt number − 1.
//   attempt 1 → full, attempt 2 → 50% max, attempt 3 → 25% max.
export const ATTEMPT_XP_FACTORS = [1, 0.5, 0.25];

// Multiplier applied to a quiz's earned XP based on which attempt this is
// (1-indexed). Beyond the configured attempts the factor is 0.
export function attemptXpFactor(attemptNumber) {
  return ATTEMPT_XP_FACTORS[attemptNumber - 1] ?? 0;
}

// Quiz question types that need a human to grade them. Their `points` are
// excluded from XP math; teachers can award them later via the portal.
export const MANUAL_GRADE_TYPES = new Set(["essay", "short-answer"]);

// ---- Helpers ----

// Max scorable units for a question: 1 per normal question, one per pair
// in a matching question, and the recursive sum for a case study.
export function questionUnits(q) {
  if (q.type === "case-study") {
    return (q.subQuestions ?? []).reduce((s, sq) => s + questionUnits(sq), 0);
  }
  if (q.type === "matching") return q.leftItems?.length ?? 0;
  return 1;
}

// Computes how much XP a quiz submission earns. `correctUnits` is the
// number of correct units (questions / matching pairs) from the
// auto-gradable questions. A submission always earns at least QUIZ_MIN_XP.
export function calcQuizXp(correctUnits) {
  return Math.max(QUIZ_MIN_XP, Math.round(correctUnits * QUIZ_XP_PER_CORRECT));
}

// Returns the highest level whose cumulative-XP threshold the student has
// reached. Always at least 1.
export function levelFromXp(totalXp) {
  let level = 1;
  for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
    if (totalXp >= LEVEL_THRESHOLDS[i]) level = i + 1;
    else break;
  }
  return level;
}

// XP needed to reach the next level — used for progress bars.
// Returns null if the student is already at max level.
export function xpToNextLevel(totalXp) {
  const level = levelFromXp(totalXp);
  const next = LEVEL_THRESHOLDS[level]; // index = level when next exists
  if (next === undefined) return null;
  return {
    currentLevel: level,
    nextLevel: level + 1,
    currentLevelXp: LEVEL_THRESHOLDS[level - 1],
    nextLevelXp: next,
    progressXp: totalXp - LEVEL_THRESHOLDS[level - 1],
    neededXp: next - LEVEL_THRESHOLDS[level - 1],
  };
}
