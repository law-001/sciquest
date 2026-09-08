// The post-level debrief: how it went, then what the cell was actually doing.

function Star({ filled }) {
  return (
    <span className={`pc-star${filled ? ' is-on' : ''}`} aria-hidden="true">★</span>
  );
}

export function ResultsScreen({ level, result, onReplay, onExit }) {
  const { stars, failed, headline, detail, stats, xpEarned } = result;

  return (
    <div className="pc-results">
      <div className="pc-card">
        <div className="pc-card__accent" style={{ background: failed ? 'var(--pc-bad)' : level.accent }} />
        <div className="pc-eyebrow">Level {level.number} · {level.name}</div>
        <h2 className="pc-results__title">{failed ? headline : level.debrief.title}</h2>

        <div className="pc-results__score">
          <span className="pc-stars" aria-label={`${stars} of 3 stars`}>
            {[1, 2, 3].map((n) => <Star key={n} filled={stars >= n} />)}
          </span>
          {xpEarned > 0 && <span className="pc-pill pc-pill--orange">+{xpEarned} XP</span>}
        </div>

        <p className="pc-results__detail">{detail}</p>

        {stats.length > 0 && (
          <div className="pc-results__stats">
            {stats.map((stat) => (
              <div key={stat.label} className="pc-chip">
                <span className="pc-chip__label">{stat.label}</span>
                <span className="pc-chip__value">{stat.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {!failed && (
        <div className="pc-card">
          <div className="pc-eyebrow">What just happened</div>
          <p className="pc-results__teach">{level.debrief.body}</p>
          <ul className="pc-brief__list">
            {level.debrief.points.map((point) => <li key={point}>{point}</li>)}
          </ul>
        </div>
      )}

      <div className="pc-results__actions">
        <button type="button" className="pc-btn" onClick={onExit}>Back to levels</button>
        <button type="button" className="pc-btn pc-btn--primary" onClick={onReplay}>
          {failed ? 'Try again' : 'Play again'}
        </button>
      </div>
    </div>
  );
}
