import { useMemo, useState } from 'react';
import { CHECKPOINTS, PHASES } from '../data/phases';
import { DEFECTS, FIDELITY_COST, defectForProcedure } from '../data/defects';
import { PROCEDURE_SECONDS } from '../procedures';
import { AmbientCell } from './AmbientCell';
import { CheckpointGate } from './CheckpointGate';
import { HowToPlay } from './HowToPlay';
import { hasSeenHowToPlay } from './how-to-play-seen';
import { LabNotebook } from './LabNotebook';
import { PhaseTrack } from './PhaseTrack';
import { ProcedureFrame } from './ProcedureFrame';

// One attempt at one level. Mounted only while a run is in progress, so `run`
// is never null in here — which keeps every derived value below safe to
// dereference.
export function RunScreen({ level, reducedMotion, onExit, onFinish }) {
  const [run, setRun] = useState(() => ({
    stepIndex: 0,
    fidelity: 100,
    defects: [],
    results: [],
    clearedFaults: [],
    retriedSteps: [],
  }));
  const [paused, setPaused] = useState(false);
  const [showGuide, setShowGuide] = useState(() => !hasSeenHowToPlay());

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

  const checkpointEvidence = useMemo(() => {
    if (!checkpoint) return [];
    if (checkpoint.id === 'g1') {
      return [
        { label: 'Cell size', value: 'Sufficient', tone: 'good' },
        { label: 'Nutrients', value: 'Plentiful', tone: 'good' },
        { label: 'DNA damage scan', value: 'Clear', tone: 'good' },
      ];
    }
    if (checkpoint.id === 'g2') {
      const errs = priorResult?.replicationErrors ?? (priorResult?.stars === 3 ? 0 : 1);
      return [
        {
          label: 'Replication errors',
          value: errs === 0 ? 'None detected' : `${errs} mispaired`,
          tone: errs === 0 ? 'good' : 'bad',
        },
        { label: 'Chromosome count', value: 'Complete', tone: 'good' },
      ];
    }
    const mono = priorResult?.monoOriented ?? (priorResult?.stars === 3 ? 0 : 1);
    return [
      { label: 'Bi-oriented chromosomes', value: `${4 - mono} / 4`, tone: mono === 0 ? 'good' : 'bad' },
      { label: 'Unattached kinetochores', value: mono === 0 ? 'None' : `${mono}`, tone: mono === 0 ? 'good' : 'bad' },
    ];
  }, [checkpoint, priorResult]);

  function advance(next) {
    if (next.stepIndex >= level.steps.length) onFinish(next);
    else setRun(next);
  }

  function handleProcedureComplete({ stars, ...detail }) {
    const cost = FIDELITY_COST[stars] ?? 0;
    const defect = defectForProcedure(step.procedure, stars);

    advance({
      ...run,
      stepIndex: run.stepIndex + 1,
      fidelity: Math.max(0, run.fidelity - cost),
      defects: defect ? [...run.defects, defect] : run.defects,
      results: [
        ...run.results,
        { stepIndex: run.stepIndex, procedure: step.procedure, stars, cost, defect, ...detail },
      ],
    });
  }

  function handleCheckpointResolve({ choice, correct }) {
    // A correct WAIT buys the cell time to fix the problem: the previous
    // procedure is rolled back and replayed with its fault cleared. Only once
    // per step — a cell that still cannot fix the fault has to move on, and
    // without this cap a player who keeps failing the retry loops forever.
    const canRetry = priorResult && !run.retriedSteps.includes(priorResult.stepIndex);
    if (correct && choice === 'wait' && canRetry) {
      const faultOfStep = level.steps[priorResult.stepIndex]?.fault;
      advance({
        ...run,
        stepIndex: priorResult.stepIndex,
        fidelity: Math.min(100, run.fidelity + priorResult.cost),
        defects: priorResult.defect
          ? run.defects.filter((d) => d !== priorResult.defect)
          : run.defects,
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
      fidelity: Math.max(0, run.fidelity - cost),
      defects: wavedThrough ? [...run.defects, DEFECTS.checkpointBypass] : run.defects,
      results: [...run.results, { stepIndex: run.stepIndex, checkpoint: checkpoint.id, choice, correct }],
    });
  }

  if (!step || !phase) return null;

  const fidelityTone = run.fidelity >= 90
    ? 'var(--cdl-good)'
    : run.fidelity >= 70 ? 'var(--cdl-teal)' : run.fidelity >= 50 ? 'var(--cdl-warn)' : 'var(--cdl-bad)';

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
              <span className="cdl-eyebrow">Fidelity</span>
              <div className="cdl-fidelity__bar">
                <div className="cdl-fidelity__fill" style={{ width: `${run.fidelity}%`, background: fidelityTone }} />
              </div>
              <span className="cdl-mono" style={{ fontWeight: 700, fontSize: 13, minWidth: 36 }}>
                {run.fidelity}%
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
                    onResolve={handleCheckpointResolve}
                  />
                </>
              ) : (
                <ProcedureFrame
                  key={`pr-${run.stepIndex}-${step.procedure}-${run.results.length}`}
                  phase={phase}
                  procedure={step.procedure}
                  procedureProps={{ ...(step.props ?? {}), fault: activeFault }}
                  durationSec={PROCEDURE_SECONDS[step.procedure] ?? 45}
                  paused={paused || showGuide}
                  onComplete={handleProcedureComplete}
                />
              )}
            </div>
          </div>

          <LabNotebook
            phase={phase}
            defects={run.defects}
            stepLabel={`Step ${run.stepIndex + 1} of ${level.steps.length}`}
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
            <p className="cdl-teach" style={{ marginBottom: 14 }}>The procedure timer is stopped.</p>
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
