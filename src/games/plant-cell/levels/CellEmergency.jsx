import { useEffect, useRef, useState } from 'react';
import { SUSPECTS, TESTS } from '../data/faults';
import { ORGANELLES } from '../data/organelles';
import { useSimLoop } from '../engine/useSimLoop';
import { CellView } from '../ui/CellView';
import { Meter, StatChip, StatusLine } from '../ui/CellStats';
import { toneForValue } from '../ui/tone';
import { HoldButton } from '../ui/ResourceControls';
import { RunFrame } from '../ui/RunFrame';

const REPAIR_SECONDS = 2.2;

const TONE_WORD = { normal: 'Normal', warn: 'Odd', bad: 'Abnormal' };

function initialState(sim) {
  return {
    phase: 'investigate',
    elapsed: 0,
    health: sim.healthStart,
    running: null,
    revealed: [],
    wrong: [],
    repair: 0,
  };
}

// Level 3 — the symptoms are on screen from the start; the player runs tests
// until the pattern points at one organelle, then repairs it.
export function CellEmergency({ level, fault, reducedMotion, particleBudget, onExit, onFinish }) {
  const [state, setState] = useState(() => initialState(level.sim));
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState(null);
  const [holding, setHolding] = useState(false);
  const finishedRef = useRef(false);
  const sim = level.sim;

  useSimLoop(state.phase !== 'done', (dt) => {
    setState((prev) => {
      const next = { ...prev, elapsed: prev.elapsed + dt };

      if (prev.phase === 'investigate') {
        next.health = Math.max(sim.healthFloor, prev.health - sim.declinePerSec * dt);
      }

      if (prev.running) {
        const remaining = prev.running.remaining - dt;
        if (remaining <= 0) {
          next.running = null;
          next.revealed = prev.revealed.includes(prev.running.id)
            ? prev.revealed
            : [...prev.revealed, prev.running.id];
        } else {
          next.running = { ...prev.running, remaining };
        }
      }

      if (prev.phase === 'repairing') {
        const repair = Math.min(1, prev.repair + (holding ? dt / REPAIR_SECONDS : -dt * 0.4));
        next.repair = Math.max(0, repair);
        if (repair >= 1) next.phase = 'recovering';
      }

      if (prev.phase === 'recovering') {
        next.health = Math.min(100, prev.health + sim.recoverPerSec * dt);
        if (next.health >= 100) next.phase = 'done';
      }

      return next;
    });
  });

  useEffect(() => {
    if (state.phase !== 'done' || finishedRef.current) return;
    finishedRef.current = true;
    const wrongCount = state.wrong.length;
    const stars = sim.starsByWrongGuesses[Math.min(wrongCount, sim.starsByWrongGuesses.length - 1)];
    onFinish({
      stars,
      failed: false,
      headline: '',
      detail: `${fault.title} — ${fault.reasoning}`,
      stats: [
        { label: 'Tests run', value: `${state.revealed.length} of ${TESTS.length}` },
        { label: 'Wrong diagnoses', value: `${wrongCount}` },
        { label: 'Time taken', value: `${Math.round(state.elapsed)}s` },
      ],
    });
  }, [state, fault, sim, onFinish]);

  function runTest(testId) {
    if (state.running || state.phase !== 'investigate') return;
    setMessage(null);
    setState((prev) => ({ ...prev, running: { id: testId, remaining: sim.testSeconds } }));
  }

  function accuse(organelleId) {
    if (state.phase !== 'investigate') return;
    if (organelleId === fault.organelleId) {
      setMessage({ tone: 'good', text: `${ORGANELLES[organelleId].name} it is. Now repair it.` });
      setState((prev) => ({ ...prev, phase: 'repairing' }));
      return;
    }
    setMessage({
      tone: 'bad',
      text: `The readings do not fit a broken ${ORGANELLES[organelleId].name.toLowerCase()}. ${ORGANELLES[organelleId].job} Keep testing.`,
    });
    setState((prev) => ({
      ...prev,
      wrong: prev.wrong.includes(organelleId) ? prev.wrong : [...prev.wrong, organelleId],
      health: Math.max(sim.healthFloor, prev.health - sim.wrongGuessHealth),
    }));
  }

  const repaired = state.phase === 'recovering' || state.phase === 'done';
  const symptomEntries = Object.values(repaired
    ? {
      glucose: { label: 'Glucose production', value: 'NORMAL', tone: 'normal' },
      energy: { label: 'Cellular energy', value: 'NORMAL', tone: 'normal' },
      water: { label: 'Water balance', value: 'NORMAL', tone: 'normal' },
      transport: { label: 'Substances in / out', value: 'NORMAL', tone: 'normal' },
    }
    : fault.symptoms);

  const stage = (
    <div className="pc-stage">
      <CellView
        activity={repaired ? 0.7 : fault.id === 'chloroplast' ? 0.08 : 0.5}
        respiration={repaired ? 0.7 : fault.id === 'mitochondrion' ? 0.05 : 0.5}
        vacuoleFill={repaired ? 55 : fault.id === 'vacuole' ? 18 : 50}
        turgor={repaired ? 70 : fault.id === 'vacuole' || fault.id === 'membrane' ? 38 : 65}
        health={state.health}
        damagedId={state.phase === 'investigate' ? null : fault.organelleId}
        selectedId={selected}
        onSelectOrganelle={state.phase === 'investigate' ? setSelected : null}
        reducedMotion={reducedMotion}
        particleBudget={particleBudget}
        title="Plant cell showing symptoms"
      />
      <p className="pc-flow">
        {state.phase === 'investigate'
          ? 'Click an organelle in the cell (or use the list) to look at it more closely.'
          : repaired
            ? 'The repaired organelle is back at work and the cell is recovering.'
            : 'Hold the repair button to rebuild the damaged organelle.'}
      </p>
    </div>
  );

  const panel = (
    <>
      {message && <StatusLine tone={message.tone}>{message.text}</StatusLine>}

      <div className="pc-panel__group">
        <Meter
          label="Cell health"
          icon="❤️"
          value={state.health}
          readout={`${Math.round(state.health)}%`}
          tone={toneForValue(state.health, { low: 35, high: 70 })}
        />
      </div>

      <div className="pc-section">
        <div className="pc-eyebrow">Monitors</div>
        <div className="pc-chips">
          {symptomEntries.map((symptom) => (
            <StatChip key={symptom.label} label={symptom.label} value={symptom.value} tone={symptom.tone} />
          ))}
        </div>
      </div>

      {state.phase === 'investigate' && (
        <>
          <div className="pc-section">
            <div className="pc-eyebrow">Run a test</div>
            <div className="pc-tests">
              {TESTS.map((test) => {
                const done = state.revealed.includes(test.id);
                const busy = state.running?.id === test.id;
                return (
                  <button
                    key={test.id}
                    type="button"
                    className={`pc-test${done ? ' is-done' : ''}`}
                    onClick={() => runTest(test.id)}
                    disabled={done || Boolean(state.running)}
                  >
                    <span className="pc-test__label">{test.label}</span>
                    <span className="pc-test__meta">
                      {busy ? 'Running…' : done ? 'Done' : test.measures}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pc-section">
            <div className="pc-eyebrow">Evidence ({state.revealed.length})</div>
            {state.revealed.length === 0 ? (
              <p className="pc-note">No test results yet. Start with whatever the monitors say is wrong.</p>
            ) : (
              <ul className="pc-evidence">
                {state.revealed.map((testId) => {
                  const test = TESTS.find((t) => t.id === testId);
                  const result = fault.results[testId];
                  return (
                    <li key={testId} className={`pc-evidence__row pc-evidence__row--${result.tone}`}>
                      <span className="pc-evidence__tag">{TONE_WORD[result.tone]}</span>
                      <span>
                        <strong>{test.measures}:</strong> {result.text}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="pc-section">
            <div className="pc-eyebrow">Name the faulty organelle</div>
            <div className="pc-suspects">
              {SUSPECTS.map((id) => (
                <button
                  key={id}
                  type="button"
                  className={`pc-suspect${selected === id ? ' is-selected' : ''}${state.wrong.includes(id) ? ' is-ruled-out' : ''}`}
                  onClick={() => setSelected(id)}
                  aria-pressed={selected === id}
                >
                  {ORGANELLES[id].name}
                  {state.wrong.includes(id) && <span className="pc-suspect__x" aria-hidden="true"> ✕</span>}
                </button>
              ))}
            </div>
            {selected && (
              <div className="pc-note">
                <strong>{ORGANELLES[selected].name}:</strong> {ORGANELLES[selected].job}
              </div>
            )}
            <button
              type="button"
              className="pc-btn pc-btn--primary pc-btn--wide"
              disabled={!selected || state.wrong.includes(selected)}
              onClick={() => accuse(selected)}
            >
              {selected ? `This is the fault: ${ORGANELLES[selected].name}` : 'Choose an organelle first'}
            </button>
          </div>
        </>
      )}

      {state.phase === 'repairing' && (
        <div className="pc-section">
          <div className="pc-eyebrow">Repair</div>
          <p className="pc-note">{fault.repairNote}</p>
          <Meter
            label={fault.repairLabel}
            icon="🔧"
            value={state.repair * 100}
            readout={`${Math.round(state.repair * 100)}%`}
            tone="info"
          />
          <HoldButton
            label={`Hold to ${fault.repairLabel.toLowerCase()}`}
            icon="🔧"
            tone="teal"
            active={holding}
            onHoldChange={setHolding}
          />
        </div>
      )}

      {repaired && (
        <div className="pc-section">
          <div className="pc-eyebrow">Recovering</div>
          <p className="pc-note">{fault.repairNote}</p>
        </div>
      )}
    </>
  );

  return (
    <RunFrame
      level={level}
      onExit={onExit}
      stage={stage}
      panel={panel}
    />
  );
}
