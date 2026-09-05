import { markHowToPlaySeen } from './how-to-play-seen';

const POINTS = [
  {
    title: 'The cell is the board',
    body: 'You work directly on the cell — drag, press and draw on the chromosomes, DNA and membrane themselves. Scroll the wheel, pinch, or use the + and − buttons in the corner to zoom in and out.',
  },
  {
    title: 'Read the instruction, then move it',
    body: 'The floating instruction tells you the next move. Drag it (or use the arrow keys) to park it away from whatever you are working on.',
  },
  {
    title: 'The notebook explains the phase',
    body: 'The panel on the right says what the cell is doing, how the controls work, and what still has to be done.',
  },
  {
    title: 'Work before the timer runs out',
    body: 'Each procedure is timed. Finishing cleanly keeps all three stars and your fidelity high; sloppy work leaves a defect in the log.',
  },
  {
    title: 'Checkpoints are judgement calls',
    body: 'Between procedures the cell asks GO or WAIT. Read the readout — waving a damaged cell through costs far more than pausing it.',
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
          Start the procedure
        </button>
      </div>
    </div>
  );
}
