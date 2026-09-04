import { LEVELS, isLevelUnlocked } from '../data/levels';

function Stars({ count }) {
  return (
    <span className="cdl-stars" aria-label={`${count} of 3 stars earned`}>
      {[1, 2, 3].map((n) => (
        <span key={n} aria-hidden="true" className={`cdl-star${count >= n ? ' cdl-star--on' : ''}`} style={{ fontSize: 15 }}>★</span>
      ))}
    </span>
  );
}

export function LevelSelect({ progressByLevel, onSelect, onExit }) {
  const completedIds = LEVELS.filter((l) => progressByLevel[l.id]?.completed).map((l) => l.id);

  return (
    <div className="cdl-select">
      <header className="cdl-select__head">
        <button type="button" className="cdl-icon-btn" onClick={onExit} aria-label="Back to games">←</button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="cdl-eyebrow">Cell Division Lab</div>
          <h1 className="cdl-title" style={{ fontSize: 26, lineHeight: 1.15 }}>Choose a division</h1>
        </div>
      </header>

      <div className="cdl-select__body">
        <div className="cdl-level-grid">
          {LEVELS.map((level) => {
            const prog = progressByLevel[level.id];
            const unlocked = isLevelUnlocked(level, completedIds);
            const stars = prog?.stars ?? 0;
            const status = !unlocked ? 'Locked' : prog?.completed ? 'Cleared' : 'New';

            return (
              <article key={level.id} className={`cdl-level-card${unlocked ? '' : ' cdl-level-card--locked'}`}>
                <div className="cdl-level-card__accent" style={{ background: level.accent }} />

                <div className="cdl-level-card__top">
                  <div>
                    <div className="cdl-eyebrow">Level {String(level.number).padStart(2, '0')}</div>
                    <div className="cdl-level-card__num" style={{ color: level.accent }}>
                      {String(level.number).padStart(2, '0')}
                    </div>
                  </div>
                  <span className={`cdl-pill${status === 'Cleared' ? ' cdl-pill--teal' : status === 'New' ? ' cdl-pill--orange' : ''}`}>
                    {status}
                  </span>
                </div>

                <h2 className="cdl-title" style={{ fontSize: 18, margin: '2px 0 6px' }}>{level.name}</h2>
                <p className="cdl-teach" style={{ flex: 1 }}>{level.goal}</p>

                <div className="cdl-level-card__foot">
                  <Stars count={stars} />
                  <span style={{ fontSize: 12, color: 'var(--cdl-ink-3)' }}>
                    {level.steps.length} steps · {level.outcome}
                  </span>
                </div>

                {unlocked ? (
                  <button
                    type="button"
                    className="cdl-btn cdl-btn--primary"
                    style={{ width: '100%' }}
                    onClick={() => onSelect(level)}
                  >
                    {prog?.completed ? 'Play again' : 'Start'}
                  </button>
                ) : (
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--cdl-ink-3)', textAlign: 'center' }}>
                    Clear level {level.number - 1} to unlock
                  </p>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
