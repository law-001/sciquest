// The shell every level plays inside: back control, objective, optional
// countdown and pause. The level supplies the stage and the panel.

export function RunFrame({
  level,
  secondsLeft = null,
  progress = null,
  paused = false,
  onTogglePause = null,
  onExit,
  stage,
  panel,
}) {
  return (
    <div className="pc-run">
      <header className="pc-run__head">
        <span className="pc-run__stripe" style={{ background: level.accent }} aria-hidden="true" />

        <button type="button" className="pc-icon-btn" onClick={onExit} aria-label="Back to levels">
          <svg width="20" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </svg>
        </button>

        <div className="pc-run__title">
          <div className="pc-eyebrow">
            <span aria-hidden="true">{level.icon}</span> Level {level.number} · {level.name}
          </div>
          <p className="pc-run__objective">{level.objective}</p>
        </div>

        <div className="pc-run__right">
          {secondsLeft !== null && (
            <div className="pc-timer" aria-label={`${Math.ceil(secondsLeft)} seconds left`}>
              <span className="pc-timer__value">{Math.ceil(secondsLeft)}s</span>
              <span className="pc-timer__track">
                <span className="pc-timer__fill" style={{ width: `${progress ?? 0}%`, background: level.accent }} />
              </span>
            </div>
          )}
          {onTogglePause && (
            <button type="button" className="pc-btn pc-btn--small" onClick={onTogglePause}>
              {paused ? 'Resume' : 'Pause'}
            </button>
          )}
        </div>
      </header>

      <div className="pc-run__body">
        <div className="pc-run__stage">{stage}</div>
        <aside className="pc-run__panel">{panel}</aside>
      </div>
    </div>
  );
}
