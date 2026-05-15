import { useState } from 'react';

export function ChallengePanel({ challenges, activeChallenge, completedChallengeIds, onSelectChallenge }) {
  const [open, setOpen] = useState(false);

  const completed = new Set(completedChallengeIds ?? []);

  return (
    <>
      {/* Slide-in drawer */}
      <div
        className={`absolute left-0 top-0 bottom-[100px] w-72 bg-white shadow-2xl border-r border-stone-200 z-30 flex flex-col transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-[260px]' : '-translate-x-full'
        }`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100 shrink-0">
          <h2 className="font-bold text-stone-800 text-sm">Challenges</h2>
          <button
            onClick={() => setOpen(false)}
            className="text-stone-400 hover:text-stone-700 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center text-lg"
            aria-label="Close challenges panel"
          >
            ×
          </button>
        </div>

        <ul className="flex-1 overflow-y-auto divide-y divide-stone-100">
          {challenges.map(ch => {
            const isDone = completed.has(ch.id);
            const isActive = activeChallenge?.id === ch.id;

            return (
              <li key={ch.id}>
                <button
                  onClick={() => {
                    if (!isDone) onSelectChallenge(ch);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors min-h-[56px] ${
                    isActive
                      ? 'bg-orange-50'
                      : isDone
                        ? 'opacity-60 cursor-default'
                        : 'hover:bg-stone-50'
                  }`}
                  aria-disabled={isDone}
                  aria-current={isActive ? 'true' : undefined}
                >
                  <span className="shrink-0 mt-0.5 text-base" aria-hidden="true">
                    {isDone ? '✅' : isActive ? '▶' : '○'}
                  </span>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className={`text-sm font-semibold truncate ${isDone ? 'text-stone-400' : 'text-stone-800'}`}>
                      {ch.title}
                    </span>
                    <span className="text-xs text-stone-500 leading-snug line-clamp-2">
                      {ch.description}
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Backdrop */}
      {open && (
        <div
          className="absolute inset-0 z-20"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Toggle tab — sits at the right edge of the drawer gap, vertically centered */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-label="Toggle challenges panel"
        className="absolute left-[260px] top-1/2 -translate-y-1/2 z-40 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-colors shadow-md rounded-r-xl flex items-center justify-center min-w-[44px]"
        style={{ writingMode: 'vertical-rl', transform: 'translateY(-50%) rotate(180deg)', padding: '12px 6px' }}
      >
        📋 Challenges
      </button>
    </>
  );
}
