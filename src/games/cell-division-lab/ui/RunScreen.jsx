import { useCallback, useMemo, useState } from 'react';
import { CHECKPOINTS, PHASES } from '../data/phases';
import { PROBLEMS, ACCURACY_COST, problemForProcedure } from '../data/defects';
import { PROCEDURE_SECONDS } from '../procedures';
import { AmbientCell } from './AmbientCell';
import { CheckpointGate } from './CheckpointGate';
import { HowToPlay } from './HowToPlay';
import { hasSeenHowToPlay } from './how-to-play-seen';
import { LabNotebook } from './LabNotebook';
import { PhaseTrack } from './PhaseTrack';
import { ProcedureFrame } from './ProcedureFrame';

// Until a procedure reports in there is still something to say — the phase's
// own controls line, or for a checkpoint the decision it is waiting on.
function fallbackInstruction(step, phase) {
  if (step.kind === 'checkpoint') {
    return { hint: 'Read the cell readout, then choose GO or WAIT', tone: 'info' };
  }
  return { hint: phase.controls ?? 'Work on the cell', tone: 'info' };
}

// One attempt at one level. Mounted only while a run is in progress, so `run`
// is never null in here — which keeps every derived value below safe to
// dereference.
export function RunScreen({ level, reducedMotion, onExit, onFinish }) {
  const [run, setRun] = useState(() => ({
    stepIndex: 0,
    accuracy: 100,
    problems: [],
    results: [],
    clearedFaults: [],
    retriedSteps: [],
  }));
  const [paused, setPaused] = useState(false);
  const [showGuide, setShowGuide] = useState(() => !hasSeenHowToPlay());
  // The running instruction is the notebook's headline, so it is held here
  // rather than inside the procedure frame that produces it. Tagged with the
  // step it belongs to and dropped the moment the step changes, so a stale
  // instruction can never outlive the procedure that wrote it — the reset has
  // to happen in render, before the next procedure's mount effect reports in.
  const [status, setStatus] = useState({ stepKey: null, value: null });

  const handleStatus = useCallback((next) => {
    setStatus((prev) => ({ stepKey: prev.stepKey, value: next }));
  }, []);

  const stepKey = `${run.stepIndex}-${run.results.length}`;
  if (status.stepKey !== stepKey) setStatus({ stepKey, value: null });

  const step = level.steps[run.stepIndex] ?? null;
  const phase = step ? PHASES[step.phaseId] : null;
  const checkpoint = step?.kind === 'checkpoint' ? CHECKPOINTS[step.checkpointId] : null;

  // A step's fault is skipped once the cell has been given time to fix it.
  const activeFault = step?.fault && !run.clearedFaults.includes(step.fault)
    ? step.fault
    : undefined;

  // Only procedure results carry a score, so ignore a preceding checkpoint.
  const lastResult = run.results[run.results.length - 1] ?? null;
  const priorResult = lastResult?.procedure ? lastResult : null;

  const checkpointCorrectId = useMemo(() => {
    if (!checkpoint) return null;
    if (checkpoint.correct !== 'dynamic') return checkpoint.correct;
    return priorResult && priorResult.stars < 3 ? 'wait' : 'go';
  }, [checkpoint, priorResult]);

  // WAIT only means "go back and redo it" while the cell still has a retry
  // left. Once it is used up the gate has to say so, or the player is told to
  // expect a rewind that never comes.
  const canRetry = priorResult && !run.retriedSteps.includes(priorResult.stepIndex);

  const checkpointEvidence = useMemo(() => {
    if (!checkpoint) return [];
    if (checkpoint.id === 'g1') {
      return [
        { label: 'Cell size', value: 'Big enough', tone: 'good' },
        { label: 'Food supply', value: 'Plenty', tone: 'good' },
        { label: 'DNA damage', value: 'None found', tone: 'good' },
      ];
    }
    if (checkpoint.id === 'g2') {
      const errs = priorResult?.replicationErrors ?? (priorResult?.stars === 3 ? 0 : 1);
      return [
        {
          label: 'Copying mistakes',
          value: errs === 0 ? 'None' : `${errs} wrong ${errs === 1 ? 'letter' : 'letters'}`,
          tone: errs === 0 ? 'good' : 'bad',
        },
        { label: 'Chromosomes', value: 'All there', tone: 'good' },
      ];
    }
    const loose = priorResult?.monoOriented ?? (priorResult?.stars === 3 ? 0 : 1);
    return [
      { label: 'Held from both sides', value: `${4 - loose} of 4`, tone: loose === 0 ? 'good' : 'bad' },
      { label: 'Still loose', value: loose === 0 ? 'None' : `${loose}`, tone: loose === 0 ? 'good' : 'bad' },
    ];
  }, [checkpoint, priorResult]);

  function advance(next) {
    if (next.stepIndex >= level.steps.length) onFinish(next);
    else setRun(next);
  }

  function handleProcedureComplete({ stars, ...detail }) {
    const cost = ACCURACY_COST[stars] ?? 0;
    const problem = problemForProcedure(step.procedure, stars);

    advance({
      ...run,
      stepIndex: run.stepIndex + 1,
      accuracy: Math.max(0, run.accuracy - cost),
      problems: problem ? [...run.problems, problem] : run.problems,
      results: [
        ...run.results,
        { stepIndex: run.stepIndex, procedure: step.procedure, stars, cost, problem, ...detail },
      ],
    });
  }

  function handleCheckpointResolve({ choice, correct }) {
    // A correct WAIT buys the cell time to fix the problem: the previous
    // procedure is rolled back and replayed with its fault cleared. Only once
    // per step — a cell that still cannot fix the fault has to move on, and
    // without this cap a player who keeps failing the retry loops forever.
    if (correct && choice === 'wait' && canRetry) {
      const faultOfStep = level.steps[priorResult.stepIndex]?.fault;
      advance({
        ...run,
        stepIndex: priorResult.stepIndex,
        accuracy: Math.min(100, run.accuracy + priorResult.cost),
        problems: priorResult.problem
          ? run.problems.filter((p) => p !== priorResult.problem)
          : run.problems,
        results: run.results.filter((r) => r.stepIndex !== priorResult.stepIndex),
        clearedFaults: faultOfStep ? [...run.clearedFaults, faultOfStep] : run.clearedFaults,
        retriedSteps: [...run.retriedSteps, priorResult.stepIndex],
      });
      return;
    }

    const wavedThrough = !correct && choice === 'go' && checkpointCorrectId === 'wait';
    const cost = correct ? 0 : wavedThrough ? 15 : 8;

    advance({
      ...run,
      stepIndex: run.stepIndex + 1,
      accuracy: Math.max(0, run.accuracy - cost),
      problems: wavedThrough ? [...run.problems, PROBLEMS.checkpointBypass] : run.problems,
      results: [...run.results, { stepIndex: run.stepIndex, checkpoint: checkpoint.id, choice, correct }],
    });
  }

  if (!step || !phase) return null;

  const accuracyTone = run.accuracy >= 90
    ? 'var(--cdl-good)'
    : run.accuracy >= 70 ? 'var(--cdl-teal)' : run.accuracy >= 50 ? 'var(--cdl-warn)' : 'var(--cdl-bad)';

  return (
    <>
      <div className={`cdl-app${reducedMotion ? ' cdl-app--still' : ''}`}>
        <div className="cdl-hud">
          <div className="cdl-hud__left">
            <button type="button" className="cdl-icon-btn" onClick={onExit} aria-label="Leave this run">←</button>
          </div>

          <div className="cdl-hud__center">
            <PhaseTrack steps={level.steps} currentIndex={run.stepIndex} />
          </div>

          <div className="cdl-hud__right">
            <div className="cdl-fidelity">
              <span className="cdl-eyebrow">Accuracy</span>
              <div className="cdl-fidelity__bar">
                <div className="cdl-fidelity__fill" style={{ width: `${run.accuracy}%`, background: accuracyTone }} />
              </div>
              <span className="cdl-mono" style={{ fontWeight: 700, fontSize: 13, minWidth: 36 }}>
                {run.accuracy}%
              </span>
            </div>
            <button
              type="button"
              className="cdl-icon-btn"
              onClick={() => setShowGuide(true)}
              aria-label="How to play"
            >
              ?
            </button>
            <button
              type="button"
              className="cdl-icon-btn"
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? 'Resume' : 'Pause'}
            >
              {paused ? '▶' : '❚❚'}
            </button>
          </div>
        </div>

        <div className="cdl-body">
          <div className="cdl-stage-wrap">
            <div className="cdl-stage">
              {step.kind === 'checkpoint' ? (
                <>
                  <AmbientCell stage={phase.cellIdx} label={`Cell at ${phase.displayName}`} />
                  <CheckpointGate
                    key={`cp-${run.stepIndex}`}
                    phase={phase}
                    checkpoint={checkpoint}
                    evidence={checkpointEvidence}
                    correctId={checkpointCorrectId}
                    canRetry={!!canRetry}
                    onResolve={handleCheckpointResolve}
                  />
                </>
              ) : (
                <ProcedureFrame
                  key={`pr-${stepKey}-${step.procedure}`}
                  phase={phase}
                  procedure={step.procedure}
                  procedureProps={{ ...(step.props ?? {}), fault: activeFault }}
                  durationSec={PROCEDURE_SECONDS[step.procedure] ?? 45}
                  paused={paused || showGuide}
                  onStatus={handleStatus}
                  onComplete={handleProcedureComplete}
                />
              )}
            </div>
          </div>

          <LabNotebook
            phase={phase}
            problems={run.problems}
            stepLabel={`Step ${run.stepIndex + 1} of ${level.steps.length}`}
            instruction={status.value ?? fallbackInstruction(step, phase)}
          />
        </div>
      </div>

      {showGuide && <HowToPlay onClose={() => setShowGuide(false)} />}

      {paused && !showGuide && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Paused"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            background: 'rgba(43,36,23,0.45)',
            backdropFilter: 'blur(2px)',
            zIndex: 30,
          }}
        >
          <div className="cdl-card" style={{ textAlign: 'center', maxWidth: 320 }}>
            <h2 className="cdl-title" style={{ fontSize: 20, marginBottom: 6 }}>Paused</h2>
            <p className="cdl-teach" style={{ marginBottom: 14 }}>The timer is stopped.</p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button type="button" className="cdl-btn" onClick={onExit}>Leave run</button>
              <button type="button" className="cdl-btn cdl-btn--primary" onClick={() => setPaused(false)}>Resume</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
