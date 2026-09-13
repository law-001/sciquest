const CROWNS = {
  1: "/leaderboard/crown-gold-1.png",
  2: "/leaderboard/crown-silver-2.png",
  3: "/leaderboard/crown-bronze-3.png",
};

export function LeaderboardRank({ rank, muted = false, className = "" }) {
  return (
    <span
      className={`flex h-8 w-8 shrink-0 items-center justify-center text-sm font-black tabular-nums ${
        className || (muted
          ? "text-stone-400 dark:text-stone-500"
          : "text-stone-600 dark:text-stone-300")
      }`}
    >
      {CROWNS[rank] ? (
        <img
          src={CROWNS[rank]}
          alt={`Rank ${rank}`}
          width={32}
          height={32}
          className="h-8 w-8 object-contain"
        />
      ) : (
        <span aria-label={`Rank ${rank}`}>{rank}</span>
      )}
    </span>
  );
}
