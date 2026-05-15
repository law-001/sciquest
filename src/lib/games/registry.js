export const GAMES = {
  'states-of-matter': {
    id: 'states-of-matter',
    title: 'Matter State Sandbox',
    tagline: 'Explore solids, liquids & gases through interactive simulation',
    difficulty: 2,
    estimatedMinutes: 15,
    totalLevels: 3,
    thumbnail: null,
    locked: false,
    category: 'Chemistry',
    loader: () => import('../../games/states-of-matter/index.jsx'),
  },
  'cell-explorer': {
    id: 'cell-explorer',
    title: 'Cell Explorer',
    tagline: 'Journey inside a living cell and discover its hidden secrets',
    difficulty: 1,
    estimatedMinutes: 10,
    totalLevels: 4,
    thumbnail: null,
    locked: true,
    category: 'Biology',
  },
  'circuit-lab': {
    id: 'circuit-lab',
    title: 'Circuit Lab',
    tagline: 'Build and test electrical circuits in a virtual physics lab',
    difficulty: 3,
    estimatedMinutes: 20,
    totalLevels: 5,
    thumbnail: null,
    locked: true,
    category: 'Physics',
  },
};

export const getGame = (id) => GAMES[id] ?? null;
export const listGames = () => Object.values(GAMES);
