import { lazy } from "react";
import sandbox from "../../assets/sandbox.png";
import celldiv from "../../assets/celldivision.png";
import mysteryLab from "../../assets/mysterylab.png";
import foodchain from "../../assets/foodchain.png";

const _lazyCache = new Map();
function _lazyLoader(loader) {
  if (!_lazyCache.has(loader)) _lazyCache.set(loader, lazy(loader));
  return _lazyCache.get(loader);
}

export const GAMES = {
  "matter-state-sandbox": {
    id: "matter-state-sandbox",
    title: "Matter State Sandbox",
    tagline:
      "Heat and cool matter to observe its fascinating transformation between physical states.",
    subject: "Science",
    relatedLessonIds: ["week-03-matter", "week-04-phase-change"],
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
          .map((r) => CHALLENGE_LEVEL[r.challenge_id]),
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
    relatedLessonIds: ["week-01-scientific-method"],
    difficulty: 2,
    estimatedMinutes: 20,
    thumbnail: mysteryLab,
    engine: "react",
    category: "Scientific Method",
    loader: () => import("../../games/mystery-lab/index.jsx"),
    minRole: "student",
    totalLevels: 1,
  },
  "food-chain-survival": {
    id: "food-chain-survival",
    title: "Food Chain Survival",
    tagline:
      "Survive as each organism — rabbit, fox, mushroom — to restore every link in the chain.",
    subject: "Science",
    relatedLessonIds: [],
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
  "cell-division-lab": {
    id: "cell-division-lab",
    title: "Cell Division Lab",
    tagline:
      "Run a cell through mitosis and meiosis, one procedure at a time, and see what the daughter cells inherit.",
    subject: "Science",
    relatedLessonIds: ["week-07-cell-division", "week-08-meiosis"],
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
};

export const getGame = (id) => GAMES[id] ?? null;
export const listGames = () => Object.values(GAMES);
export function getGameComponent(id) {
  const game = GAMES[id];
  if (!game?.loader) return null;
  return _lazyLoader(game.loader);
}
