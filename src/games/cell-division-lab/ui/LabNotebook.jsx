import { useEffect, useLayoutEffect, useRef, useState } from 'react';

// Below the two-column breakpoint the notebook is an instruction strip under
// the stage, and its notes open as a sheet over the stage — so they start
// collapsed, or the cell would be hidden from the first frame. The
// instruction itself never collapses. Read once, so rotating the device
// does not throw away whatever the student has chosen. Only ever collapsed
// while stacked: above 900px there is no toggle on screen to open the notes
// back up with.
function startsCollapsed() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(max-width: 900px)').matches;
}

// On phones the instruction box has a fixed height so the stage above it never
// resizes as the wording changes. A hint that does not fit steps down a size at
// a time ('1', '2'); only one that still overflows at the smallest size lets
// the box grow. Where the box has no fixed height nothing overflows and the
// hint stays at full size.
const FIT_STEPS = ['0', '1', '2', 'grow'];

function fitToBox(box) {
  for (const step of FIT_STEPS) {
    box.dataset.fit = step;
    if (box.firstElementChild.offsetHeight <= box.clientHeight) return;
  }
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
  const textRef = useRef(null);
  const hasSubmit = !!instruction.submit;

  // The notes are a fresh read every step, so a scroll left over from the last
  // one would open the new step part-way down its own explanation.
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [stepLabel]);

  // Layout effect, so the hint is sized before it is painted. Re-fitted when
  // the box changes width too — rotating, or the submit button arriving.
  useLayoutEffect(() => {
    const box = textRef.current;
    fitToBox(box);
    const observer = new ResizeObserver(() => fitToBox(box));
    observer.observe(box);
    return () => observer.disconnect();
  }, [instruction.hint, hasSubmit]);

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
            <span className="cdl-notebook__chevron" aria-hidden="true">▲</span>
          </button>
        </div>

        <div className="cdl-instruct__row">
          {/* The paragraph stays mounted so the live region keeps announcing;
              only the span inside is re-keyed, which restarts its entrance. */}
          <p className="cdl-instruct__text" aria-live="polite" ref={textRef}>
            <span key={instruction.hint} className="cdl-instruct__pop">{instruction.hint}</span>
          </p>

          {hasSubmit && (
            <button
              type="button"
              className="cdl-btn cdl-instruct__submit"
              onClick={instruction.submit.onSubmit}
            >
              {instruction.submit.label}
            </button>
          )}
        </div>
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
