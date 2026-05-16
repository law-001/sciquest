import { useState, useEffect, useRef } from 'react';

export function ChallengePanel({ challenges, activeChallenge, completedIds, holdProgress, reducedMotion, onSelect }) {
  const completed = new Set(completedIds ?? []);
  const [slippingId, setSlippingId] = useState(null);
  const prevIdRef = useRef(activeChallenge?.id ?? null);

  useEffect(() => {
    const prev = prevIdRef.current;
    const curr = activeChallenge?.id ?? null;
    prevIdRef.current = curr;
    if (prev && prev !== curr && completed.has(prev) && !reducedMotion) {
      setSlippingId(prev);
      const t = setTimeout(() => setSlippingId(null), 700);
      return () => clearTimeout(t);
    }
  }, [activeChallenge?.id]); // eslint-disable-line

  const pending = challenges.filter(ch => !completed.has(ch.id) && ch.id !== activeChallenge?.id);
  const done = challenges.filter(ch => completed.has(ch.id) && ch.id !== activeChallenge?.id);

  return (
    <div className="sq-cstack">
      {/* Active challenge — full card */}
      {activeChallenge ? (
        <div className="sq-ccard sq-ccard--active">
          <div className="sq-ccard__eyebrow">Active challenge</div>
          <div className="sq-ccard__title">{activeChallenge.title}</div>
          <div className="sq-ccard__desc">{activeChallenge.description}</div>
          {holdProgress > 0 && (
            <div className="sq-challenge-card__progress">
              <div className="sq-progress-bar">
                <div
                  className="sq-progress-bar__fill"
                  style={{ width: `${holdProgress * 100}%` }}
                  role="progressbar"
                  aria-valuenow={Math.round(holdProgress * 100)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Hold progress"
                />
              </div>
              <span>{Math.round(holdProgress * 100)}%</span>
            </div>
          )}
        </div>
      ) : (
        <div className="sq-ccard sq-ccard--empty">
          <div className="sq-ccard__desc">Explore freely — use the controls below.</div>
        </div>
      )}

      {/* Pending challenges — title only, clickable */}
      {pending.map(ch => (
        <button
          key={ch.id}
          className="sq-ccard sq-ccard--pending sq-ccard--clickable"
          onClick={() => onSelect?.(ch)}
          aria-label={`Switch to challenge: ${ch.title}`}
        >
          <span className="sq-ccard__dot" aria-hidden="true" />
          <span className="sq-ccard__compact-title">{ch.title}</span>
        </button>
      ))}

      {/* Completed challenges — title + check, slip animation on newest, clickable for review */}
      {done.map(ch => (
        <button
          key={ch.id}
          className={`sq-ccard sq-ccard--done sq-ccard--clickable${slippingId === ch.id ? ' sq-ccard--slip' : ''}`}
          onClick={() => onSelect?.(ch)}
          aria-label={`Review challenge: ${ch.title}`}
        >
          <svg
            width="10" height="10" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"
            className="sq-ccard__check" aria-hidden="true"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
          <span className="sq-ccard__compact-title">{ch.title}</span>
        </button>
      ))}
    </div>
  );
}
