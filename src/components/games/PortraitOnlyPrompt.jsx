import './PortraitGameFrame.css';

// Always rendered for portrait-only games; PortraitGameFrame.css shows it only
// on a touch device held sideways, so there is no JS orientation state to flicker.
export function PortraitOnlyPrompt() {
  return (
    <div className="sq-rotate-prompt" role="alertdialog" aria-modal="true" aria-labelledby="sq-rotate-title" aria-describedby="sq-rotate-body">
      <svg className="sq-rotate-prompt__icon" width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden="true">
        <rect x="22" y="8" width="28" height="56" rx="6" stroke="currentColor" strokeWidth="3" />
        <line x1="32" y1="56" x2="40" y2="56" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <h2 id="sq-rotate-title" className="sq-rotate-prompt__title">Turn your phone upright</h2>
      <p id="sq-rotate-body" className="sq-rotate-prompt__body">
        This game is played in portrait mode. Rotate your device to keep playing.
      </p>
    </div>
  );
}
