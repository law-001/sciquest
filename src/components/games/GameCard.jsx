import { Clock, Play } from 'lucide-react';

function DifficultyDots({ level }) {
  return (
    <div className="flex gap-1 items-center">
      {[1, 2, 3].map((n) => (
        <span
          key={n}
          className={`w-2.5 h-2.5 rounded-full ${n <= level ? 'bg-orange-500' : 'bg-stone-300'}`}
        />
      ))}
    </div>
  );
}

export function GameCard({ game, progress = {}, onPlay }) {
  const { title, tagline, difficulty = 1, estimatedMinutes, thumbnail, locked } = game;
  const { completedLevels = 0, totalLevels = 3 } = progress;

  if (locked) {
    return (
      <div className="rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 opacity-60 select-none">
        <div className="aspect-video bg-gradient-to-br from-stone-200 to-stone-300 relative">
          <span className="absolute top-3 right-3 bg-stone-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Coming Soon
          </span>
        </div>
        <div className="p-4">
          <p className="font-semibold text-stone-500">{title}</p>
          <p className="text-sm text-stone-400 mt-1">{tagline}</p>
        </div>
      </div>
    );
  }

  const progressPct = totalLevels > 0 ? (completedLevels / totalLevels) * 100 : 0;

  return (
    <div className="rounded-2xl overflow-hidden bg-white border border-stone-200 shadow-sm flex flex-col">
      <div className="aspect-video relative overflow-hidden">
        {thumbnail ? (
          <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-teal-400 to-orange-300" />
        )}
      </div>

      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <h3 className="font-semibold text-stone-800 text-base leading-tight">{title}</h3>
          <p className="text-sm text-stone-500 mt-0.5">{tagline}</p>
        </div>

        <div className="flex items-center justify-between text-sm text-stone-500">
          <DifficultyDots level={difficulty} />
          <span className="flex items-center gap-1">
            <Clock size={13} />
            ~{estimatedMinutes} min
          </span>
        </div>

        <div>
          <div className="flex justify-between text-xs text-stone-500 mb-1">
            <span>Progress</span>
            <span>{completedLevels} / {totalLevels} levels</span>
          </div>
          <div className="h-1.5 rounded-full bg-stone-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-teal-500 transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <button
          onClick={onPlay}
          className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold text-sm transition-colors"
        >
          <Play size={15} fill="white" />
          Play
        </button>
      </div>
    </div>
  );
}
