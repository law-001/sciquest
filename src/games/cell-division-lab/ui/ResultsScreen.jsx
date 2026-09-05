import { OUTCOME_BY_STARS } from '../data/defects';

const TONE_COLOR = {
  good: 'var(--cdl-good)',
  ok: 'var(--cdl-teal-deep)',
  warn: 'var(--cdl-warn)',
  bad: 'var(--cdl-bad)',
};

// A single daughter cell drawn as a simple diagram, tinted by how healthy it
// turned out. Defects are also listed in words — the colour is never the only
// thing telling you something went wrong.
function DaughterCell({ index, healthy, size = 84 }) {
  const tint = healthy ? 'var(--cdl-teal)' : 'var(--cdl-bad)';
  return (
    <figure style={{ margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <svg width={size} height={size} viewBox="0 0 84 84" aria-hidden="true">
        <circle cx="42" cy="42" r="36" fill={healthy ? 'rgba(43,175,169,0.12)' : 'rgba(209,84,79,0.12)'} stroke={tint} strokeWidth="2.5" />
        <circle cx="42" cy="42" r="15" fill="rgba(120,160,215,0.35)" stroke="#4A7CC4" strokeWidth="1.5" />
        {!healthy && (
          <circle cx="63" cy="24" r="6" fill="rgba(209,84,79,0.3)" stroke={tint} strokeWidth="1.5" />
        )}
      </svg>
      <figcaption style={{ fontSize: 12.5, fontWeight: 700, color: healthy ? 'var(--cdl-good)' : 'var(--cdl-bad)' }}>
        Cell {index + 1} · {healthy ? 'healthy' : 'defective'}
      </figcaption>
    </figure>
  );
}

export function ResultsScreen({ level, stars, fidelity, defects, xpEarned, onReplay, onExit }) {
  const outcome = OUTCOME_BY_STARS[stars];
  const cellCount = level.id === 'l2' ? 4 : 2;
  // Defects are shared across the products of the division, so a run with any
  // major defect marks every daughter cell.
  const healthyCount = defects.length === 0
    ? cellCount
    : Math.max(0, cellCount - Math.min(cellCount, defects.filter((d) => d.severity === 'major').length));

  return (
    <div className="cdl-select">
      <header className="cdl-select__head">
        <button type="button" className="cdl-icon-btn" onClick={onExit} aria-label="Back to games">←</button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="cdl-eyebrow">Level {level.number} · {level.name}</div>
          <h1 className="cdl-title" style={{ fontSize: 24, lineHeight: 1.15 }}>{outcome.title}</h1>
        </div>
      </header>

      <div className="cdl-select__body">
        <div className="cdl-results">
          <div className="cdl-card">
            <div className="cdl-card__accent" style={{ background: TONE_COLOR[outcome.tone] }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 12 }}>
              <span className="cdl-stars" aria-label={`${stars} of 3 stars`}>
                {[1, 2, 3].map((n) => (
                  <span key={n} aria-hidden="true" className={`cdl-star${stars >= n ? ' cdl-star--on' : ''}`} style={{ fontSize: 28 }}>★</span>
                ))}
              </span>
              <div className="cdl-fidelity">
                <span className="cdl-eyebrow">Fidelity</span>
                <div className="cdl-fidelity__bar" style={{ width: 120 }}>
                  <div
                    className="cdl-fidelity__fill"
                    style={{ width: `${fidelity}%`, background: TONE_COLOR[outcome.tone] }}
                  />
                </div>
                <span className="cdl-mono" style={{ fontWeight: 700, fontSize: 14 }}>{fidelity}%</span>
              </div>
              {xpEarned > 0 && <span className="cdl-pill cdl-pill--orange">+{xpEarned} XP</span>}
            </div>

            <p className="cdl-teach" style={{ fontSize: 15 }}>{outcome.detail}</p>
          </div>

          <div className="cdl-card">
            <div className="cdl-eyebrow" style={{ marginBottom: 12 }}>Daughter cells</div>
            <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'center' }}>
              {Array.from({ length: cellCount }, (_, i) => (
                <DaughterCell key={i} index={i} healthy={i < healthyCount} />
              ))}
            </div>
          </div>

          <div className="cdl-card">
            <div className="cdl-eyebrow" style={{ marginBottom: 10 }}>
              {defects.length === 0 ? 'Defect report' : `Defect report (${defects.length})`}
            </div>
            {defects.length === 0 ? (
              <p className="cdl-teach" style={{ color: 'var(--cdl-good)' }}>
                No defects. Every chromosome was copied, separated and packaged correctly.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {defects.map((d, i) => (
                  <div key={`${d.id}-${i}`} className="cdl-defect">
                    <span aria-hidden="true" style={{ fontWeight: 800 }}>!</span>
                    <span><strong>{d.label}</strong> — {d.detail}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button type="button" className="cdl-btn" onClick={onExit}>Back to games</button>
            <button type="button" className="cdl-btn cdl-btn--primary" onClick={onReplay}>Run it again</button>
          </div>
        </div>
      </div>
    </div>
  );
}
