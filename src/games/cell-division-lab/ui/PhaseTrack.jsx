import { useEffect, useRef } from 'react';
import { PHASES } from '../data/phases';

// The rail across the top of the HUD showing every step of the run and where
// the student currently is. Scrolls the active step into view on mobile.
export function PhaseTrack({ steps, currentIndex }) {
  const activeRef = useRef(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest', inline: 'center' });
  }, [currentIndex]);

  return (
    <nav className="cdl-track" aria-label="Cell cycle progress">
      {steps.map((step, i) => {
        const phase = PHASES[step.phaseId];
        const state = i < currentIndex ? 'done' : i === currentIndex ? 'active' : 'todo';
        return (
          <div key={`${step.phaseId}-${i}`} style={{ display: 'contents' }}>
            {i > 0 && <span className="cdl-track__sep" aria-hidden="true" />}
            <span
              ref={state === 'active' ? activeRef : null}
              className={`cdl-track__step${state === 'done' ? ' cdl-track__step--done' : state === 'active' ? ' cdl-track__step--active' : ''}`}
              aria-current={state === 'active' ? 'step' : undefined}
            >
              <span className="cdl-track__dot" aria-hidden="true" />
              {phase?.shortName ?? step.phaseId}
              <span className="cdl-sr">
                {state === 'done' ? ' completed' : state === 'active' ? ' current step' : ' not started'}
              </span>
            </span>
          </div>
        );
      })}
    </nav>
  );
}
