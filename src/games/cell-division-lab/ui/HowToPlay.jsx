import { markHowToPlaySeen } from './how-to-play-seen';

const POINTS = [
  {
    title: 'The cell is the board',
    body: 'You work straight on the cell itself — drag, press and draw on the chromosomes, the DNA and the outside of the cell. Scroll the wheel, pinch, or use the + and − buttons in the corner to zoom in and out.',
  },
  {
    title: 'Read the instruction, then move it',
    body: 'The floating instruction tells you your next move. Drag it out of the way (or move it with the arrow keys) if it is covering something you need.',
  },
  {
    title: 'The notebook explains the step',
    body: 'The panel on the right says what the cell is doing, how the controls work, and what you still have to finish.',
  },
  {
    title: 'Beat the timer',
    body: 'Every step is timed. Doing a step neatly keeps all three stars and your Accuracy high. Rushing it leaves a problem behind, and problems get passed on to the new cells.',
  },
  {
    title: 'Checkpoints are your decision',
    body: 'Between steps the cell asks you GO or WAIT. Read the readout first. If it shows a problem, choose WAIT — the cell goes back and redoes that step, and the problem gets fixed. Choosing GO on a cell that has a problem costs you far more than waiting.',
  },
];

export function HowToPlay({ onClose }) {
  function handleClose() {
    markHowToPlaySeen();
    onClose();
  }

  return (
    <div
      className="cdl-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cdl-howto-title"
      onKeyDown={(e) => { if (e.key === 'Escape') handleClose(); }}
    >
      <div className="cdl-card cdl-howto">
        <div className="cdl-eyebrow">Cell Division Lab</div>
        <h2 id="cdl-howto-title" className="cdl-title cdl-howto__title">How to play</h2>

        <ol className="cdl-howto__list">
          {POINTS.map((point, i) => (
            <li key={point.title} className="cdl-howto__item">
              <span className="cdl-howto__num" aria-hidden="true">{i + 1}</span>
              <div>
                <strong className="cdl-howto__heading">{point.title}</strong>
                <p className="cdl-teach cdl-howto__body">{point.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <button
          type="button"
          className="cdl-btn cdl-btn--primary cdl-howto__go"
          onClick={handleClose}
          autoFocus
        >
          Start
        </button>
      </div>
    </div>
  );
}
