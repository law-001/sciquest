import { useTheme } from '../../../context/ThemeContext';

// NOTE: borrowed from the shipped sandbox as-is (never edited) so both games
// show quests the same way — same reason this shell reuses its sq-* classes.
import { ChallengePanel } from '../../matter-state-sandbox/ui/ChallengePanel';
import { QuestModal } from './QuestModal';

// Every level's shell, laid out like the matter-state sandbox: top bar, quest
// sidebar, stage, bottom control bar. It borrows the sandbox's global sq-*
// classes as they are (never edits them) so both games feel like one platform.
// The level supplies the sidebar readings, both views, a caption, controls
// (optional), an overlay drawn above the whole shell and one pinned to the stage.

export function LabFrame({
  level,
  quests,
  reducedMotion,
  paused,
  onTogglePause,
  onRestart,
  onExit,
  view,
  onViewChange,
  hud,
  readout,
  plant,
  cell,
  caption,
  controls,
  overlay,
  stageOverlay,
}) {
  const { isDark, toggle: toggleDark } = useTheme();

  return (
    <>
      <div className="sq-sandbox-shell">
        <div className="sq-sandbox-top">
          <div className="sq-top-left">
            <button type="button" className="sq-icon-btn pc-lab-exit" onClick={onExit} aria-label="Exit to level select">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 12H5M11 6l-6 6 6 6" />
              </svg>
              Exit
            </button>
          </div>

          <div className="sq-top-center">
            <span className="pc-lab-title">Level {level.number} — {level.name}</span>
            <span className="sq-top-desktop-only pc-lab-subtitle">{level.objective}</span>
          </div>

          <div className="sq-top-right">
            <button
              type="button"
              className="sq-icon-btn"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              onClick={toggleDark}
            >
              {isDark ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
            <button
              type="button"
              className="sq-icon-btn"
              aria-label={paused ? 'Resume' : 'Pause'}
              onClick={onTogglePause}
            >
              {paused ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true"><path d="M6 4l14 8L6 20z" /></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
              )}
            </button>
            <button type="button" className="sq-icon-btn" aria-label="Restart level" onClick={onRestart}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" />
              </svg>
            </button>
          </div>
        </div>

        <div className="sq-sandbox-main">
          <aside className="sq-hud" aria-label="Level info">
            <ChallengePanel
              challenges={level.quests}
              activeChallenge={quests.activeQuest}
              completedIds={quests.doneQuestIds}
              holdProgress={quests.holdProgress}
              reducedMotion={reducedMotion}
              onSelect={quests.select}
            />
            {hud}
            {level.keyTerms && (
              <div className="pc-section">
                <div className="pc-eyebrow">Key terms</div>
                <ul className="pc-brief__list">
                  {level.keyTerms.map(({ term, meaning }) => (
                    <li key={term}><strong>{term}:</strong> {meaning}</li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
          <div className="sq-stage-wrap">
            <div className="sq-stage">
              <div className="pc-lab-readout">{readout}</div>

              {onViewChange && (
                <button
                  type="button"
                  className={`pc-lab-viewtoggle${view === 'cell' ? ' is-on' : ''}`}
                  onClick={() => onViewChange(view === 'plant' ? 'cell' : 'plant')}
                >
                  <span aria-hidden="true">{view === 'cell' ? '🪴' : '🔬'}</span>
                  {view === 'cell' ? 'Whole plant' : 'Inside a cell'}
                </button>
              )}

              <div className="pc-lab-stage">
                <div className={`pc-lab-viewport${view === 'plant' ? ' pc-lab-viewport--plant' : ''}`}>
                  {view === 'plant' ? plant : cell}
                </div>
                {caption}
              </div>
              {stageOverlay}
            </div>
          </div>
        </div>

        {controls && <div className="sq-sandbox-bottom pc-lab-bottom">{controls}</div>}
      </div>

      {overlay}

      {paused && (
        <div className="pc-results" onClick={onTogglePause}>
          <div
            className="pc-results__card pc-lab-paused"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pc-paused-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="pc-paused-title" className="pc-results__title">Paused</h2>
            <button type="button" className="pc-btn pc-btn--primary" onClick={onTogglePause} autoFocus>
              Resume
            </button>
          </div>
        </div>
      )}

      {quests.celebration && (
        <QuestModal
          level={level}
          quest={quests.celebration.quest}
          nextQuest={quests.celebration.nextQuest}
          levelStars={quests.celebration.levelStars}
          onKeepExploring={quests.keepExploring}
          onNextQuest={quests.nextQuest}
          onExit={onExit}
        />
      )}
    </>
  );
}
