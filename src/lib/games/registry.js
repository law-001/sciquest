import { lazy } from "react";
import sandbox from "../../assets/sandbox.png";
import celldiv from "../../assets/celldivision.png";
import mysteryLab from "../../assets/mysterylab.png";

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
    difficulty: 2,
    estimatedMinutes: 15,
    thumbnail: sandbox,
    engine: "phaser",
    category: "Chemistry",
    loader: () => import("../../games/matter-state-sandbox/index.jsx"),
    minRole: "student",
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
  },
  "cell-division-defense": {
    id: "cell-division-defense",
    title: "Cell Division: Divide & Defend",
    tagline: "Defend the nucleus and guide your cell through mitosis",
    subject: "Science",
    relatedLessonIds: ["week-07-cell-division", "week-08-meiosis"],
    difficulty: 2,
    estimatedMinutes: 12,
    thumbnail: celldiv,
    engine: "phaser",
    category: "Biology",
    loader: () => import("../../games/cell-division-defense/index.jsx"),
    minRole: "student",
  },
  "cell-explorer": {
    id: "cell-explorer",
    title: "Cell Explorer",
    tagline: "Journey inside a living cell and discover its hidden secrets",
    difficulty: 1,
    estimatedMinutes: 10,
    totalLevels: 4,
    thumbnail: null,
    locked: true,
    category: "Biology",
  },
  "circuit-lab": {
    id: "circuit-lab",
    title: "Circuit Lab",
    tagline: "Build and test electrical circuits in a virtual physics lab",
    difficulty: 3,
    estimatedMinutes: 20,
    totalLevels: 5,
    thumbnail: null,
    locked: true,
    category: "Physics",
  },
};

export const getGame = (id) => GAMES[id] ?? null;
export const listGames = () => Object.values(GAMES);
export function getGameComponent(id) {
  const game = GAMES[id];
  if (!game?.loader) return null;
  return _lazyLoader(game.loader);
}
