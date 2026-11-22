import { lazy } from "react";
import sandbox from "../../assets/sandbox.png";
import celldiv from "../../assets/celldivision.png";
import mysteryLab from "../../assets/mysterylab.png";
import foodchain from "../../assets/foodchain.png";
import quakeready from "../../assets/quakeready.png";
import plantcell from "../../assets/plantcell.png";
import animalcell from "../../assets/animalcell.svg";

const _lazyCache = new Map();
function _lazyLoader(loader) {
  if (!_lazyCache.has(loader)) _lazyCache.set(loader, lazy(loader));
  return _lazyCache.get(loader);
}

// Ordered: Quake Ready pinned first (no matching week), then by the week that
// unlocks the game. A game unlocks the moment the reader scrolls to 100% on
// its *final* lesson of that week — the scroll-to-complete already fires
// `handleLessonComplete`, which flips the gate.
export const GAMES = {
  "quake-ready": {
    id: "quake-ready",
    title: "Quake Ready",
    tagline:
      "Run your own earthquakes, survive the big one, then command the rescue of Bayside Town.",
    subject: "Science",
    relatedLessonIds: [],
    difficulty: 2,
    estimatedMinutes: 20,
    thumbnail: quakeready,
    engine: "custom",
    category: "Earth Science",
    loader: () => import("../../games/quake-ready/index.jsx"),
    minRole: "student",
    totalLevels: 1,
    countCompletedLevels: (progress) =>
      progress.some((r) => r.completed && r.challenge_id === "l1") ? 1 : 0,
  },
  "matter-state-sandbox": {
    id: "matter-state-sandbox",
    title: "Matter State Sandbox",
    tagline:
      "Heat and cool matter to observe its fascinating transformation between physical states.",
    subject: "Science",
    relatedLessonIds: ["w03-l2"],
    unlockHint: "Finish Week 3 to unlock",
    difficulty: 1,
    estimatedMinutes: 15,
    thumbnail: sandbox,
    engine: "phaser",
    category: "Chemistry",
    loader: () => import("../../games/matter-state-sandbox/index.jsx"),
    minRole: "student",
    totalLevels: 3,
    // Challenges group into levels; count unique completed levels, not challenges.
    countCompletedLevels: (progress) => {
      const CHALLENGE_LEVEL = {
        ch_01: 'l1', ch_02: 'l1',
        ch_03: 'l2', ch_04: 'l2', ch_05: 'l2',
        ch_06: 'l3', ch_07: 'l3', ch_08: 'l3',
      };
      const completedLevelIds = new Set(
        progress
          .filter((r) => r.completed && CHALLENGE_LEVEL[r.challenge_id])
          .map((r) => r.challenge_id),
      );
      return completedLevelIds.size;
    },
  },
  "mystery-lab": {
    id: "mystery-lab",
    title: "Mystery Lab: The Dying Pond",
    tagline:
      "Junior science detectives use the scientific method to solve a fish-die-off mystery.",
    subject: "Science",
    relatedLessonIds: ["w05-l2"],
    unlockHint: "Finish Week 5 to unlock",
    difficulty: 2,
    estimatedMinutes: 20,
    thumbnail: mysteryLab,
    engine: "react",
    category: "Scientific Method",
    loader: () => import("../../games/mystery-lab/index.jsx"),
    minRole: "student",
    totalLevels: 1,
  },
  "cell-division-lab": {
    id: "cell-division-lab",
    title: "Cell Division Lab",
    tagline:
      "Run a cell through mitosis and meiosis, one procedure at a time, and see what the daughter cells inherit.",

    subject: "Science",
    relatedLessonIds: ["w12-l2"],
    unlockHint: "Finish Week 12 to unlock",
    difficulty: 2,
    estimatedMinutes: 20,
    thumbnail: celldiv,
    engine: "react",
    category: "Biology",
    loader: () => import("../../games/cell-division-lab/index.jsx"),
    minRole: "student",
    totalLevels: 3,
    countCompletedLevels: (progress) => {
      const LEVEL_CHALLENGES = new Set(["l1", "l2", "l3"]);
      return new Set(
        progress
          .filter((r) => r.completed && LEVEL_CHALLENGES.has(r.challenge_id))
          .map((r) => r.challenge_id),
      ).size;
    },
  },
  "animal-cell": {
    id: "animal-cell",
    title: "Animal Cell: Power the Cell",
    tagline:
      "Fuel the mitochondria, predict where water goes, then find the organelle that broke.",
    subject: "Science",
    relatedLessonIds: ["w13-l1"],
    unlockHint: "Finish Week 13 to unlock",
    difficulty: 2,
    estimatedMinutes: 15,
    thumbnail: animalcell,
    engine: "react",
    category: "Biology",
    loader: () => import("../../games/animal-cell/index.jsx"),
    minRole: "student",
    totalLevels: 3,
    countCompletedLevels: (progress) => {
      const LEVEL_CHALLENGES = new Set(["l1", "l2", "l3"]);
      return new Set(
        progress
          .filter((r) => r.completed && LEVEL_CHALLENGES.has(r.challenge_id))
          .map((r) => r.challenge_id),
      ).size;
    },
  },
  "plant-cell": {
    id: "plant-cell",
    title: "Plant Cell: Keep the Cell Alive",
    tagline:
      "Run photosynthesis, balance the cell's water, then diagnose the organelle that fails.",
    subject: "Science",
    relatedLessonIds: ["w13-l1"],
    unlockHint: "Finish Week 13 to unlock",
    difficulty: 2,
    estimatedMinutes: 15,
    thumbnail: plantcell,
    engine: "react",
    category: "Biology",
    loader: () => import("../../games/plant-cell/index.jsx"),
    minRole: "student",
    totalLevels: 3,
    countCompletedLevels: (progress) => {
      const LEVEL_CHALLENGES = new Set(["l1", "l2", "l3"]);
      return new Set(
        progress
          .filter((r) => r.completed && LEVEL_CHALLENGES.has(r.challenge_id))
          .map((r) => r.challenge_id),
      ).size;
    },
  },
  "food-chain-survival": {
    id: "food-chain-survival",
    title: "Food Chain Survival",
    tagline:
      "Survive as each organism — rabbit, fox, mushroom — to restore every link in the chain.",
    subject: "Science",
    relatedLessonIds: ["w19-l2"],
    unlockHint: "Finish Week 19 to unlock",
    difficulty: 2,
    estimatedMinutes: 15,
    thumbnail: foodchain,
    engine: "custom",
    category: "Ecology",
    loader: () => import("../../games/food-chain-survival/index.jsx"),
    minRole: "student",
    totalLevels: 3,
    countCompletedLevels: (progress) => {
      const LEVEL_CHALLENGES = new Set(["l1", "l2", "l3"]);
      return new Set(
        progress
          .filter((r) => r.completed && LEVEL_CHALLENGES.has(r.challenge_id))
          .map((r) => r.challenge_id),
      ).size;
    },
  },
};

export const getGame = (id) => GAMES[id] ?? null;
export const listGames = () => Object.values(GAMES);
export function getGameComponent(id) {
  const game = GAMES[id];
  if (!game?.loader) return null;
  return _lazyLoader(game.loader);
}

// TODO(kyouuuuka): TEMPORARY — all games force-unlocked for testing. REVERT before
// shipping: uncomment the real gate below and delete the stub under it.
// A game with no related lessons has no gate — stays unlocked.
// A game with related lessons unlocks the moment *any* of them is completed.
// export function isGameUnlocked(game, completedLessonIds = []) {
//   const related = game?.relatedLessonIds ?? [];
//   if (related.length === 0) return true;
//   if (!completedLessonIds || completedLessonIds.length === 0) return false;
//   return related.some((id) => completedLessonIds.includes(id));
// }
export function isGameUnlocked() {
  return true;
}

// Games whose lock flips from closed → open the moment `lessonId` is completed,
// given the set of lessons the student had already finished *before* this one.
export function getGamesNewlyUnlockedBy(lessonId, previouslyCompletedLessonIds = []) {
  return listGames().filter((game) => {
    const related = game.relatedLessonIds ?? [];
    if (related.length === 0) return false;
    if (!related.includes(lessonId)) return false;
    // Was already unlocked by an earlier related lesson — don't re-announce.
    return !related.some(
      (id) => id !== lessonId && previouslyCompletedLessonIds.includes(id),
    );
  });
}
