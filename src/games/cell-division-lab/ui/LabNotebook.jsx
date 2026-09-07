// The right-hand panel: what this phase is, what the cell is doing, how to
// work it, what you still have to do, and everything that has gone wrong.
export function LabNotebook({ phase, problems, stepLabel }) {
  return (
    <aside className="cdl-notebook" aria-label="Lab notebook">
      <div className="cdl-card">
        <div className="cdl-card__accent" style={{ background: phase.color }} />
        <div className="cdl-eyebrow">{stepLabel}</div>
        <h3 className="cdl-title" style={{ fontSize: 19, margin: '4px 0 10px' }}>
          {phase.displayName}
        </h3>
        <p className="cdl-teach">{phase.teachingText}</p>
      </div>

      {phase.controls && (
        <div className="cdl-controls">
          <div className="cdl-eyebrow" style={{ marginBottom: 6 }}>How to play</div>
          <p className="cdl-teach" style={{ color: 'var(--cdl-ink-1)' }}>{phase.controls}</p>
        </div>
      )}

      <div>
        <div className="cdl-eyebrow" style={{ marginBottom: 8 }}>What to do</div>
        <ul className="cdl-objectives">
          {phase.objectives.map((text) => (
            <li key={text} className="cdl-objective">
              <span className="cdl-objective__bullet" aria-hidden="true" />
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </div>

      {problems.length > 0 && (
        <div>
          <div className="cdl-eyebrow" style={{ marginBottom: 8 }}>
            What has gone wrong ({problems.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {problems.map((p, i) => (
              <div key={`${p.id}-${i}`} className="cdl-defect">
                <span aria-hidden="true" style={{ fontWeight: 800 }}>!</span>
                <span><strong>{p.label}</strong> — {p.detail}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
