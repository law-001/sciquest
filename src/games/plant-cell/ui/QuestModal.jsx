// Shown when a quest completes. Modelled on the sandbox's SuccessModal; the
// last quest of a level also carries the level debrief and its stars.

import { useEffect, useRef } from 'react';

export function QuestModal({ level, quest, nextQuest, levelStars, onKeepExploring, onNextQuest, onExit }) {
  const dialogRef = useRef(null);
  const isLevelComplete = levelStars !== null;

  useEffect(() => {
    dialogRef.current?.querySelector('button')?.focus();
  }, []);

  function handleKeyDown(e) {
    if (e.key === 'Escape') { onKeepExploring(); return; }
    if (e.key !== 'Tab') return;
    const focusable = Array.from(dialogRef.current?.querySelectorAll('button') ?? []);
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  return (
    <div
      className="pc-results sq-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pc-quest-title"
      onClick={onKeepExploring}
    >
      <div
        ref={dialogRef}
        className="pc-results__card sq-modal-card"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="pc-card__accent" style={{ background: level.accent }} />

        <div className="pc-eyebrow">{isLevelComplete ? 'Level complete!' : 'Quest complete!'}</div>
        <h2 className="pc-results__title" id="pc-quest-title">{quest.title}</h2>

        <p className="pc-results__detail">{quest.educationalNote}</p>

        {isLevelComplete && (
          <>
            <div className="pc-results__score">
              <span className="pc-stars" aria-label={`${levelStars} of 3 stars`}>
                {[1, 2, 3].map((n) => (
                  <span key={n} className={`pc-star${levelStars >= n ? ' is-on' : ''}`} aria-hidden="true">★</span>
                ))}
              </span>
            </div>
            <div className="pc-results__note">
              <div className="pc-eyebrow">{level.debrief.title}</div>
              <p className="pc-results__teach">{level.debrief.body}</p>
              <ul className="pc-brief__list">
                {level.debrief.points.map((point) => <li key={point}>{point}</li>)}
              </ul>
            </div>
          </>
        )}

        <div className="pc-results__actions">
          <button type="button" className="pc-btn" onClick={onKeepExploring}>Keep exploring</button>
          {nextQuest && (
            <button type="button" className="pc-btn pc-btn--primary" onClick={onNextQuest}>
              Next quest →
            </button>
          )}
          {!nextQuest && isLevelComplete && (
            <button type="button" className="pc-btn pc-btn--primary" onClick={onExit}>
              Back to levels
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
