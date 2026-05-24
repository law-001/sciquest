import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Play,
  Clock,
  Lock,
  Atom,
  Activity,
  Cpu,
  FlaskConical,
  Star,
  Search,
  X,
  LogIn,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { listGames } from "../lib/games/registry";
import { useGameProgress } from "../games/_shared/progress/useGameProgress";
import { levelFromXp, xpToNextLevel } from "../lib/xp-config";
import Card from "../components/Card";
import Button from "../components/Button";
import ProgressBar from "../components/ProgressBar";

const CATEGORY_STYLES = {
  Chemistry: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  Biology:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  Physics:
    "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  Astronomy:
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  "Scientific Method":
    "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
};

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

// Icon map for locked thumbnails
const LOCKED_ICONS = {
  "cell-explorer": Activity,
  "circuit-builder": Cpu,
};

function LockedThumbnail({ gameId }) {
  const Icon = LOCKED_ICONS[gameId] ?? FlaskConical;

  const gradients = {};

  const grad =
    gradients[gameId] ??
    "from-stone-50 to-stone-100 dark:from-stone-800 dark:to-stone-700/50";

  return (
    <div
      className={`w-full h-full flex items-center justify-center bg-linear-to-br ${grad}`}
    >
      <Icon
        size={42}
        className="text-stone-300 dark:text-stone-500"
        strokeWidth={1.2}
      />
    </div>
  );
}

function GameThumbnail({ game }) {
  if (game.thumbnail)
    return (
      <img
        src={game.thumbnail}
        alt={game.title}
        className="w-full h-full object-cover"
      />
    );
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

// Unlocked game card
function UnlockedCard({ game, userId, onPlay }) {
  const { progress } = useGameProgress(supabase, game.id, userId);
  const completedLevels = progress.filter((r) => r.completed).length;
  const totalLevels = game.totalLevels ?? 3;

  return (
    <div className="group rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-orange-300 dark:hover:border-orange-500/50 transition-all duration-300 ease-out flex flex-col">
      <div className="aspect-25/9 relative overflow-hidden">
        <div className="w-full h-full transition-transform duration-500 ease-out group-hover:scale-105">
          <GameThumbnail game={game} />
        </div>
        {game.category && (
          <span className="absolute top-3 left-3">
            <CategoryBadge category={game.category} />
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col gap-4 flex-1">
        <div>
          <h3 className="font-bold text-stone-800 dark:text-stone-100 text-base leading-snug transition-colors duration-200 group-hover:text-orange-500 dark:group-hover:text-orange-400">
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
          className="mt-auto flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 active:scale-95 text-white font-semibold text-sm transition-all duration-200 group-hover:shadow-md group-hover:shadow-orange-200 dark:group-hover:shadow-orange-900/40"
        >
          <Play
            size={15}
            fill="white"
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
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
      <div className="aspect-video relative">
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

export function GamesHubPage({
  onNavigate,
  totalXp = 0,
  isLoggedIn,
  onLoginClick,
}) {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [cardsRef, cardsTriggered] = useScrollTrigger(0.05);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const level = levelFromXp(totalXp);
  const levelProgress = xpToNextLevel(totalXp);

  const games = listGames();

  const displayedGames = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return games;
    return games.filter(
      (g) =>
        g.title?.toLowerCase().includes(q) ||
        g.tagline?.toLowerCase().includes(q) ||
        g.category?.toLowerCase().includes(q),
    );
  }, [games, searchQuery]);

  const handlePlay = (game) => onNavigate("game-play", { gameId: game.id });

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-amber-50/60 dark:bg-stone-900 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-6">
            <LogIn className="w-10 h-10 text-primary-500" />
          </div>
          <h2 className="text-3xl font-black text-stone-900 dark:text-white mb-3">
            Sign in to play games
          </h2>
          <p className="text-stone-500 dark:text-stone-400 mb-8">
            Create a free account or log in to access the games hub and track
            your progress.
          </p>
          <div className="flex justify-center">
            <Button size="lg" onClick={onLoginClick}>
              Login / Sign Up
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-amber-50/60 dark:bg-stone-900">
      {/* ── Decorative blur orbs ── */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-200/30 dark:bg-orange-900/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-teal-200/20 dark:bg-teal-900/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-72 h-72 bg-violet-200/20 dark:bg-violet-900/15 rounded-full blur-3xl pointer-events-none" />

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
            <div className="flex flex-wrap gap-2 mt-5 dark:bgst">
              {[
                `${games.length} Games`,
                "Interactive Simulation",
                "Free to Play",
              ].map((chip) => (
                <span
                  key={chip}
                  className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-white text-stone-500 border border-stone-200 shadow-sm dark:bg-stone-900 dark:border-stone-800"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          <Card className="p-4 flex items-center gap-6 bg-white dark:bg-stone-800 border-2 border-primary-100 dark:border-stone-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-accent-100 flex items-center justify-center">
                <Star className="w-6 h-6 text-accent-500 fill-accent-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-stone-500 dark:text-stone-400">
                  Current Level
                </p>
                <p className="text-xl font-black text-stone-900 dark:text-white">
                  Level {level}
                </p>
              </div>
            </div>
            <div className="w-px h-12 bg-orange-200" />
            <div className="w-48">
              <div className="flex justify-between text-sm font-bold mb-1">
                <span className="text-stone-600">XP</span>
                <span className="text-primary-600">
                  {levelProgress
                    ? `${totalXp.toLocaleString()} / ${levelProgress.nextLevelXp.toLocaleString()}`
                    : `${totalXp.toLocaleString()} XP`}
                </span>
              </div>
              <ProgressBar
                progress={
                  levelProgress
                    ? Math.round(
                        (levelProgress.progressXp / levelProgress.neededXp) *
                          100,
                      )
                    : 100
                }
                color="primary"
                size="sm"
              />
            </div>
          </Card>
        </div>

        {/* All games grid */}
        {displayedGames.length === 0 && searchQuery && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="w-10 h-10 text-stone-300 dark:text-stone-600 mb-4" />
            <p className="text-stone-500 dark:text-stone-400 font-bold">
              No games match &ldquo;{searchQuery}&rdquo;
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-3 text-sm text-orange-500 hover:underline font-bold"
            >
              Clear search
            </button>
          </div>
        )}
        {(displayedGames.length > 0 || searchQuery) && (
          <section className="mt-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest shrink-0">
                All Games
              </p>

              {/* Mobile: icon toggles inline input */}
              <div className="flex items-center gap-2 sm:hidden">
                {searchOpen ? (
                  <div className="flex items-center gap-2 bg-white dark:bg-stone-800 border border-orange-200 dark:border-stone-600 rounded-full px-3 py-2 focus-within:border-orange-400 dark:focus-within:border-orange-500 transition-colors">
                    <Search className="w-4 h-4 text-stone-400 shrink-0" />
                    <input
                      autoFocus
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className="w-32 text-sm font-medium bg-transparent text-stone-700 dark:text-stone-200 placeholder-stone-400 outline-none"
                    />
                    <button
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery("");
                      }}
                      className="shrink-0 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                      aria-label="Close search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-stone-800 border border-orange-200 dark:border-stone-600 text-stone-500 dark:text-stone-300 transition-colors"
                    aria-label="Search games"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Desktop: always-visible search bar */}
              <div className="hidden sm:flex items-center gap-2 bg-white dark:bg-stone-800 border border-orange-200 dark:border-stone-600 rounded-full px-4 py-2 w-56 focus-within:border-orange-400 dark:focus-within:border-orange-500 transition-colors">
                <Search className="w-4 h-4 text-stone-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search games..."
                  className="bg-transparent text-sm font-medium text-stone-700 dark:text-stone-200 placeholder-stone-400 outline-none w-full"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="shrink-0 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
            <div
              ref={cardsRef}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            >
              {displayedGames.map((game, index) => (
                <div
                  key={game.id}
                  className={`transition-all duration-700 ease-out ${
                    cardsTriggered
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
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
