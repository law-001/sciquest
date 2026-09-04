import { useCallback, useEffect, useRef, useState } from 'react';
import { PROCEDURES } from '../procedures';

// Chrome around a single procedure. The procedure itself owns the whole stage
// — it draws into the cell — so everything here floats over the cell rather
// than sitting in a panel on top of it.
export function ProcedureFrame({ phase, procedure, procedureProps, durationSec, paused, onComplete }) {
  const [secondsLeft, setSecondsLeft] = useState(durationSec);
  const [stars, setStars] = useState(3);
  const [status, setStatus] = useState({ hint: '', tone: 'info', submit: null });

  const doneRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const remainingRef = useRef(durationSec);

  // Kept in a ref so the countdown effect does not restart when the parent
  // hands down a fresh callback identity.
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  useEffect(() => {
    if (paused) return undefined;
    const id = setInterval(() => {
      remainingRef.current = Math.max(0, remainingRef.current - 1);
      setSecondsLeft(remainingRef.current);
      if (remainingRef.current > 0) return;
      clearInterval(id);
      if (doneRef.current) return;
      doneRef.current = true;
      onCompleteRef.current({ stars: 0, timedOut: true });
    }, 1000);
    return () => clearInterval(id);
  }, [paused]);

  const handleStatus = useCallback((next) => setStatus(next), []);

  function handleComplete(result) {
    if (doneRef.current) return;
    doneRef.current = true;
    onCompleteRef.current({ stars: result?.stars ?? 0, ...result });
  }

  const Component = PROCEDURES[procedure];
  const pct = (secondsLeft / durationSec) * 100;
  const urgent = secondsLeft <= 5;
  const timerColor = urgent
    ? 'var(--cdl-bad)'
    : secondsLeft <= 12 ? 'var(--cdl-warn)' : 'var(--cdl-teal-deep)';

  return (
    <div className="cdl-proc">
      <div className="cdl-proc__stage">
        {Component
          ? (
            <Component
              {...procedureProps}
              onComplete={handleComplete}
              onStarsUpdate={setStars}
              onStatus={handleStatus}
            />
          )
          : <p className="cdl-hint cdl-hint--bad">No procedure registered for “{procedure}”.</p>}
      </div>

      <div className="cdl-overlay cdl-overlay--top">
        <div className="cdl-tag">
          <span className="cdl-eyebrow" style={{ color: phase.color }}>Procedure</span>
          <h2 className="cdl-title" style={{ fontSize: 16, lineHeight: 1.2 }}>{phase.displayName}</h2>
        </div>

        <div className="cdl-tag cdl-tag--row">
          <div className="cdl-stars" aria-label={`${stars} of 3 stars`}>
            {[1, 2, 3].map((n) => (
              <span key={n} aria-hidden="true" className={`cdl-star${stars >= n ? ' cdl-star--on' : ''}`}>★</span>
            ))}
          </div>
          <div className="cdl-timer">
            <span className="cdl-timer__num" style={{ color: timerColor }}>
              {String(secondsLeft).padStart(2, '0')}
            </span>
            <div className="cdl-timer__bar">
              <div className="cdl-timer__fill" style={{ width: `${pct}%`, background: timerColor }} />
            </div>
          </div>
          <span aria-live="polite" className="cdl-sr">{urgent ? `${secondsLeft} seconds remaining` : ''}</span>
        </div>
      </div>

      <div className="cdl-overlay cdl-overlay--bottom">
        <p className={`cdl-hint cdl-hint--${status.tone ?? 'info'}`} aria-live="polite">
          {status.hint}
        </p>
        {status.submit && (
          <button type="button" className="cdl-btn" onClick={status.submit.onSubmit}>
            {status.submit.label}
          </button>
        )}
      </div>
    </div>
  );
}
