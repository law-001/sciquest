import { lazy } from "react";
import simulationImg from "../../assets/game1logo.png";

const _lazyCache = new Map();
function _lazyLoader(loader) {
  if (!_lazyCache.has(loader)) _lazyCache.set(loader, lazy(loader));
  return _lazyCache.get(loader);
}

export const GAMES = {
  "matter-state-sandbox": {
    id: "matter-state-sandbox",
    title: "Matter State Sandbox",
    tagline: "Heat and cool matter to watch it change state",
    subject: "Science",
    relatedLessonIds: ["week-03-matter", "week-04-phase-change"],
    difficulty: 2,
    estimatedMinutes: 15,
    thumbnail: simulationImg,
    engine: "phaser",
    category: "Chemistry",
    loader: () => import("../../games/matter-state-sandbox/index.jsx"),
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
