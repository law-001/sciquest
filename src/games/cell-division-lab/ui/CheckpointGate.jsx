import { useState } from 'react';

// A checkpoint gate, floating over the live cell so the cell you are judging
// stays in view. Read the readout, then decide whether it is safe to carry on.
// Answering wrongly does not block progress — it just costs accuracy and, for
// a checkpoint waved through, leaves a problem behind.
export function CheckpointGate({ phase, checkpoint, evidence, correctId, canRetry, onResolve }) {
  const [choice, setChoice] = useState(null);

  const chosen = choice ? checkpoint.options.find((o) => o.id === choice) : null;
  const isCorrect = choice === correctId;

  function handleChoose(id) {
    if (choice) return;
    setChoice(id);
  }

  return (
    <div className="cdl-gate">
      <div className="cdl-gate__head">
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="cdl-eyebrow" style={{ color: phase.color }}>Checkpoint</div>
          <h2 className="cdl-title cdl-gate__title">{phase.displayName}</h2>
        </div>
        <span className={`cdl-pill${choice ? (isCorrect ? ' cdl-pill--good' : ' cdl-pill--bad') : ''}`}>
          {choice ? (isCorrect ? 'Right call' : 'Wrong call') : 'Your call'}
        </span>
      </div>

      <div className="cdl-gate__body">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p className="cdl-gate__prompt">{checkpoint.prompt}</p>

          {evidence.length > 0 && (
            <div className="cdl-card" style={{ boxShadow: 'none' }}>
              <div className="cdl-eyebrow" style={{ marginBottom: 10 }}>Cell readout</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {evidence.map((row) => (
                  <div
                    key={row.label}
                    style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 14.5 }}
                  >
                    <span style={{ color: 'var(--cdl-ink-3)' }}>{row.label}</span>
                    <span
                      className="cdl-mono"
                      style={{
                        fontWeight: 700,
                        color: row.tone === 'bad'
                          ? 'var(--cdl-bad)'
                          : row.tone === 'warn' ? 'var(--cdl-warn)' : 'var(--cdl-good)',
                      }}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {checkpoint.options.map((opt) => {
              const isChosen = choice === opt.id;
              const isAnswer = choice && opt.id === correctId;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleChoose(opt.id)}
                  disabled={!!choice}
                  aria-label={`${opt.label} — ${opt.detail}`}
                  className="cdl-gate__option"
                  style={{
                    cursor: choice ? 'default' : 'pointer',
                    background: isAnswer
                      ? 'var(--cdl-good-soft)'
                      : isChosen ? 'var(--cdl-bad-soft)' : 'var(--cdl-surface)',
                    borderColor: isAnswer
                      ? 'var(--cdl-good)'
                      : isChosen ? 'var(--cdl-bad)' : 'var(--cdl-line-strong)',
                    opacity: choice && !isChosen && !isAnswer ? 0.5 : 1,
                  }}
                >
                  <span className="cdl-mono cdl-gate__option-label">{opt.label}</span>
                  <span className="cdl-gate__option-detail">{opt.detail}</span>
                  {choice && (isAnswer || isChosen) && (
                    <span aria-hidden="true" style={{ fontWeight: 800, color: isAnswer ? 'var(--cdl-good)' : 'var(--cdl-bad)' }}>
                      {isAnswer ? '✓' : '✗'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* The rewind is the whole point of a checkpoint, and there is no way
              to guess it from the buttons — so say it out loud, but keep it
              conditional: WAIT only rewinds when WAIT is the right call, and
              spelling that out here would hand over the answer. */}
          {!choice && canRetry && (
            <p className="cdl-teach" style={{ margin: 0, fontSize: 13.5 }}>
              If the readout shows a problem, WAIT sends the cell back to redo the last step and fix it.
            </p>
          )}

          {chosen && (
            <>
              <div
                className="cdl-card"
                style={{
                  boxShadow: 'none',
                  background: isCorrect ? 'var(--cdl-good-soft)' : 'var(--cdl-bad-soft)',
                  borderColor: isCorrect ? 'var(--cdl-good)' : 'var(--cdl-bad)',
                }}
              >
                <p className="cdl-teach" style={{ color: 'var(--cdl-ink-1)' }}>{chosen.explain}</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="cdl-btn cdl-btn--primary"
                  onClick={() => onResolve({ choice, correct: isCorrect })}
                >
                  Continue →
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
