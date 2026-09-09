import { useEffect, useRef, useState } from 'react';

// Below the two-column breakpoint the notebook becomes a sheet under the
// stage, and on a phone-sized or landscape-phone-sized viewport its notes
// start collapsed — the instruction above them never does. Read once, so
// rotating the device does not throw away whatever the student has chosen.
// Only ever collapsed while stacked: above 900px there is no toggle on screen
// to open the notes back up with.
function startsCollapsed() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia(
    '(max-width: 640px), (max-width: 900px) and (max-height: 500px)',
  ).matches;
}

// The notebook: the instruction the student is working to, then what this
// phase is, what the cell is doing, how to work it, what is still to do, and
// everything that has gone wrong.
//
// The instruction is the one thing here that has to be read every few seconds,
// so it sits above the notes, outside the part that collapses, and is the
// loudest thing on the panel.
export function LabNotebook({ phase, problems, stepLabel, instruction }) {
  const [collapsed, setCollapsed] = useState(startsCollapsed);
  const bodyRef = useRef(null);

  // The notes are a fresh read every step, so a scroll left over from the last
  // one would open the new step part-way down its own explanation.
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [stepLabel]);

  return (
    <aside
      className={`cdl-notebook${collapsed ? ' cdl-notebook--collapsed' : ''}`}
      aria-label="Lab notebook"
    >
      <div className={`cdl-instruct cdl-instruct--${instruction.tone ?? 'info'}`}>
        <div className="cdl-instruct__head">
          <span className="cdl-instruct__eyebrow">Do this now</span>
          <span className="cdl-instruct__step">{stepLabel}</span>
          <button
            type="button"
            className="cdl-notebook__toggle"
            aria-expanded={!collapsed}
            aria-controls="cdl-notebook-body"
            onClick={() => setCollapsed((c) => !c)}
          >
            {collapsed ? 'Notes' : 'Hide notes'}
            {problems.length > 0 && (
              <span className="cdl-notebook__badge">
                {problems.length}
                <span className="cdl-sr"> problems so far</span>
              </span>
            )}
            <span className="cdl-notebook__chevron" aria-hidden="true">{collapsed ? '▲' : '▼'}</span>
          </button>
        </div>

        {/* The paragraph stays mounted so the live region keeps announcing;
            only the span inside is re-keyed, which restarts its entrance. */}
        <p className="cdl-instruct__text" aria-live="polite">
          <span key={instruction.hint} className="cdl-instruct__pop">{instruction.hint}</span>
        </p>

        {instruction.submit && (
          <button
            type="button"
            className="cdl-btn cdl-instruct__submit"
            onClick={instruction.submit.onSubmit}
          >
            {instruction.submit.label}
          </button>
        )}
      </div>

      <div className="cdl-notebook__body" id="cdl-notebook-body" ref={bodyRef}>
        <div className="cdl-card">
          <div className="cdl-card__accent" style={{ background: phase.color }} />
          <div className="cdl-eyebrow">{stepLabel}</div>
          <h3 className="cdl-title cdl-notebook__title">{phase.displayName}</h3>
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
      </div>
    </aside>
  );
}
