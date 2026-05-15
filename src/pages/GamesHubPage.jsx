import React, { useState, useEffect, useCallback } from "react";
import {
  Play,
  Clock,
  Lock,
  Atom,
  Activity,
  Cpu,
  Dna,
  Zap,
  FlaskConical,
  Telescope,
  Star,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { listGames } from "../lib/games/registry";
import { useGameProgress } from "../games/_shared/progress/useGameProgress";
import Card from "../components/Card";
import ProgressBar from "../components/ProgressBar";

const CATEGORY_STYLES = {
  Chemistry: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  Biology:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  Physics:
    "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  Astronomy:
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
};

// 3 additional locked games to append to any registry list
const EXTRA_LOCKED_GAMES = [
  {
    id: "dna-decoder",
    title: "DNA Decoder",
    tagline:
      "Unravel the double helix and decode the secrets hidden inside every living cell.",
    category: "Biology",
    difficulty: 2,
    estimatedMinutes: 12,
    locked: true,
    totalLevels: 5,
  },
  {
    id: "quantum-leap",
    title: "Quantum Leap",
    tagline:
      "Bend the rules of classical physics and explore the strange world of quantum mechanics.",
    category: "Physics",
    difficulty: 3,
    estimatedMinutes: 15,
    locked: true,
    totalLevels: 4,
  },
  {
    id: "stellar-forge",
    title: "Stellar Forge",
    tagline:
      "Ignite nuclear fusion and forge the elements that make up every star in the universe.",
    category: "Astronomy",
    difficulty: 2,
    estimatedMinutes: 10,
    locked: true,
    totalLevels: 4,
  },
];

function DifficultyDots({ level }) {
  const label = ["", "Easy", "Medium", "Hard"][level] ?? "";
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {[1, 2, 3].map((n) => (
          <span
            key={n}
            className={`block w-2.5 h-2.5 rounded-full ${n <= level ? "bg-orange-500" : "bg-stone-200 dark:bg-stone-600"}`}
          />
        ))}
      </div>
      <span className="text-xs text-stone-400 dark:text-stone-500">
        {label}
      </span>
    </div>
  );
}

function CategoryBadge({ category }) {
  const cls = CATEGORY_STYLES[category] ?? "bg-stone-100 text-stone-500";
  return (
    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${cls}`}>
      {category}
    </span>
  );
}

// CSS-only animated thumbnail showing the three states of matter
function MatterStateThumbnail({ large = false }) {
  return (
    <div
      className="w-full h-full relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0c1e35 0%, #163354 55%, #0a1929 100%)",
      }}
    >
      <div className="absolute inset-0 flex">
        {/* Solid — tight grid */}
        <div className="flex-1 relative border-r border-white/10">
          <div className="absolute inset-0 flex flex-wrap content-center justify-center gap-1.5 p-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="w-[7px] h-[7px] rounded-sm bg-[#A8C8F0]/70 flex-shrink-0"
              />
            ))}
          </div>
          <span className="absolute bottom-3 inset-x-0 text-center text-[9px] font-bold tracking-widest uppercase text-[#A8C8F0]/60">
            Solid
          </span>
        </div>

        {/* Liquid — close-packed circles */}
        <div className="flex-1 relative border-r border-white/10">
          <div className="absolute inset-0 flex flex-wrap content-start justify-center gap-2 p-3 pt-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="w-[8px] h-[8px] rounded-full bg-[#3BAFA9]/70 flex-shrink-0"
              />
            ))}
          </div>
          <span className="absolute bottom-3 inset-x-0 text-center text-[9px] font-bold tracking-widest uppercase text-[#3BAFA9]/60">
            Liquid
          </span>
        </div>

        {/* Gas — scattered dots */}
        <div className="flex-1 relative">
          {[
            { top: "16%", left: "22%" },
            { top: "32%", left: "68%" },
            { top: "58%", left: "38%" },
            { top: "14%", left: "74%" },
            { top: "70%", left: "16%" },
            { top: "46%", left: "78%" },
          ].map((pos, i) => (
            <div
              key={i}
              className="absolute w-[6px] h-[6px] rounded-full bg-white/30"
              style={pos}
            />
          ))}
          <span className="absolute bottom-3 inset-x-0 text-center text-[9px] font-bold tracking-widest uppercase text-white/30">
            Gas
          </span>
        </div>
      </div>

      <Atom
        className="absolute top-3 right-3 text-white/15"
        size={large ? 48 : 34}
        strokeWidth={1}
      />
      {large && (
        <div className="absolute top-4 left-4 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
          <span className="text-[11px] font-semibold text-orange-300/70">
            Interactive simulation
          </span>
        </div>
      )}
    </div>
  );
}

// Icon map for locked thumbnails
const LOCKED_ICONS = {
  "cell-explorer": Activity,
  "circuit-builder": Cpu,
  "dna-decoder": Dna,
  "quantum-leap": Zap,
  "stellar-forge": Telescope,
};

function LockedThumbnail({ gameId }) {
  const Icon = LOCKED_ICONS[gameId] ?? FlaskConical;

  // Subtle warm gradient per game
  const gradients = {
    "dna-decoder":
      "from-emerald-50 to-teal-100 dark:from-emerald-950/40 dark:to-teal-900/30",
    "quantum-leap":
      "from-violet-50 to-purple-100 dark:from-violet-950/40 dark:to-purple-900/30",
    "stellar-forge":
      "from-indigo-50 to-blue-100 dark:from-indigo-950/40 dark:to-blue-900/30",
  };

  const grad =
    gradients[gameId] ??
    "from-stone-50 to-stone-100 dark:from-stone-800 dark:to-stone-700/50";

  return (
    <div
      className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${grad}`}
    >
      <Icon
        size={42}
        className="text-stone-300 dark:text-stone-500"
        strokeWidth={1.2}
      />
    </div>
  );
}

function GameThumbnail({ game, large = false }) {
  if (game.id === "states-of-matter")
    return <MatterStateThumbnail large={large} />;
  return <LockedThumbnail gameId={game.id} />;
}

// Progress bar row
function ProgressRow({ completed, total }) {
  const pct = total > 0 ? (completed / total) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between text-xs text-stone-400 dark:text-stone-500 mb-1.5">
        <span>Progress</span>
        <span>
          {completed}/{total} levels
        </span>
      </div>
      <div className="h-2 rounded-full bg-stone-100 dark:bg-stone-700 overflow-hidden">
        <div
          className="h-full rounded-full bg-teal-500 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// Featured hero card — wide horizontal layout
function FeaturedCard({ game, userId, onPlay }) {
  const { progress } = useGameProgress(supabase, game.id, userId);
  const completedLevels = progress.filter((r) => r.completed).length;
  const totalLevels = game.totalLevels ?? 3;

  return (
    <div className="rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-700 shadow-lg flex flex-col md:flex-row">
      {/* Thumbnail */}
      <div className="md:w-[56%] aspect-video md:aspect-auto min-h-[240px] flex-shrink-0">
        <GameThumbnail game={game} large />
      </div>

      {/* Info panel */}
      <div className="flex flex-col justify-between p-7 bg-white dark:bg-stone-800 flex-1 gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold text-orange-500 uppercase tracking-widest">
              Featured
            </span>
            {game.category && <CategoryBadge category={game.category} />}
          </div>
          <h2 className="text-2xl font-black text-stone-800 dark:text-stone-100 leading-tight">
            {game.title}
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
            {game.tagline}
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-5 text-sm">
            <DifficultyDots level={game.difficulty ?? 1} />
            <div className="flex items-center gap-1.5 text-stone-400 dark:text-stone-500">
              <Clock size={14} />
              <span className="text-xs">~{game.estimatedMinutes} min</span>
            </div>
          </div>

          <ProgressRow completed={completedLevels} total={totalLevels} />

          <button
            onClick={onPlay}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-sm transition-colors"
          >
            <Play size={16} fill="white" />
            Play Now
          </button>
        </div>
      </div>
    </div>
  );
}

// Unlocked game card
function UnlockedCard({ game, userId, onPlay }) {
  const { progress } = useGameProgress(supabase, game.id, userId);
  const completedLevels = progress.filter((r) => r.completed).length;
  const totalLevels = game.totalLevels ?? 3;

  return (
    <div className="rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 shadow-sm hover:shadow-lg transition-shadow flex flex-col">
      <div className="aspect-[4/3] relative overflow-hidden">
        <GameThumbnail game={game} />
        {game.category && (
          <span className="absolute top-3 left-3">
            <CategoryBadge category={game.category} />
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col gap-4 flex-1">
        <div>
          <h3 className="font-bold text-stone-800 dark:text-stone-100 text-base leading-snug">
            {game.title}
          </h3>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1 line-clamp-2">
            {game.tagline}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <DifficultyDots level={game.difficulty ?? 1} />
          <div className="flex items-center gap-1.5 text-stone-400 dark:text-stone-500">
            <Clock size={13} />
            <span className="text-xs">~{game.estimatedMinutes} min</span>
          </div>
        </div>

        <ProgressRow completed={completedLevels} total={totalLevels} />

        <button
          onClick={onPlay}
          className="mt-auto flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold text-sm transition-colors"
        >
          <Play size={15} fill="white" />
          Play
        </button>
      </div>
    </div>
  );
}

// Locked / coming-soon card
function LockedCard({ game }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 opacity-70 select-none flex flex-col">
      <div className="aspect-[4/3] relative">
        <GameThumbnail game={game} />
        <div className="absolute inset-0 flex items-center justify-center bg-stone-900/10 dark:bg-black/20">
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white/80 dark:bg-stone-700/80 flex items-center justify-center shadow">
              <Lock size={18} className="text-stone-400 dark:text-stone-500" />
            </div>
          </div>
        </div>
        <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 bg-white/90 dark:bg-stone-700/90 px-2.5 py-1 rounded-full shadow-sm">
          Coming Soon
        </span>
      </div>
      <div className="p-5 flex flex-col gap-2.5">
        {game.category && <CategoryBadge category={game.category} />}
        <p className="font-bold text-stone-400 dark:text-stone-500 text-base leading-snug">
          {game.title}
        </p>
        <p className="text-sm text-stone-300 dark:text-stone-600 line-clamp-2">
          {game.tagline}
        </p>
      </div>
    </div>
  );
}

function useScrollTrigger(threshold = 0.1) {
  const [el, setEl] = useState(null);
  const [triggered, setTriggered] = useState(false);
  const ref = useCallback((node) => setEl(node), []);
  useEffect(() => {
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [el, threshold]);
  return [ref, triggered];
}

export function GamesHubPage({ onNavigate }) {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [cardsRef, cardsTriggered] = useScrollTrigger(0.05);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const registryGames = listGames();
  // Merge registry games with extra locked ones, avoiding duplicates by id
  const existingIds = new Set(registryGames.map((g) => g.id));
  const games = [
    ...registryGames,
    ...EXTRA_LOCKED_GAMES.filter((g) => !existingIds.has(g.id)),
  ];

  const unlocked = games.filter((g) => !g.locked);
  const featured = unlocked[0] ?? null;

  const handlePlay = (game) => onNavigate("game-play", { gameId: game.id });

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: "#fdf6e3" }}
    >
      {/* ── Decorative blur orbs ── */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-72 h-72 bg-violet-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page header */}
        <div
          className={`flex items-start justify-between gap-6 flex-wrap transition-all duration-700 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6"
          }`}
        >
          <div>
            <h1 className="text-4xl font-black text-stone-900 dark:text-white mb-2">
              Science Games
            </h1>
            <p className="text-lg text-stone-500 dark:text-stone-400">
              Level up your knowledge through interactive play.
            </p>
            <div className="flex flex-wrap gap-2 mt-5">
              {[
                `${games.length} Games`,
                "Interactive Simulations",
                "Free to Play",
              ].map((chip) => (
                <span
                  key={chip}
                  className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-white text-stone-500 border border-stone-200 shadow-sm"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          <Card className="p-4 flex items-center gap-6 border-2 border-primary-100 dark:border-stone-700 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-accent-100 flex items-center justify-center shrink-0">
                <Star className="w-6 h-6 text-accent-500 fill-accent-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-stone-500 dark:text-stone-400">Current Level</p>
                <p className="text-xl font-black text-stone-900 dark:text-white">Level 5</p>
              </div>
            </div>
            <div className="w-px h-12 bg-orange-200 shrink-0" />
            <div className="w-48">
              <div className="flex justify-between text-sm font-bold mb-1">
                <span className="text-stone-600">XP</span>
                <span className="text-primary-600">1,250 / 2,000</span>
              </div>
              <ProgressBar progress={62.5} color="primary" size="sm" />
            </div>
          </Card>
        </div>

        {/* Featured card */}
        {featured && (
          <section
            className={`mt-10 transition-all duration-700 ease-out ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "150ms" }}
          >
            <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">
              Featured
            </p>
            <FeaturedCard
              game={featured}
              userId={user?.id}
              onPlay={() => handlePlay(featured)}
            />
          </section>
        )}

        {/* All games grid */}
        {games.length > 0 && (
          <section className="mt-10">
            <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-5">
              All Games
            </p>
            <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {games.map((game, index) => (
                <div
                  key={game.id}
                  className={`transition-all duration-700 ease-out ${
                    cardsTriggered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                  }`}
                  style={{ transitionDelay: `${index * 80}ms` }}
                >
                  {game.locked ? (
                    <LockedCard game={game} />
                  ) : (
                    <UnlockedCard
                      game={game}
                      userId={user?.id}
                      onPlay={() => handlePlay(game)}
                    />
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {games.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Atom size={44} className="text-stone-300" strokeWidth={1} />
            <p className="text-stone-400 font-medium text-sm">
              No games yet — check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
