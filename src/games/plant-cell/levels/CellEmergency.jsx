import { useState } from 'react';
import { SUSPECTS, TESTS, pickFault } from '../data/faults';
import { ORGANELLES } from '../data/organelles';
import { useQuests } from '../engine/useQuests';
import { useSimLoop } from '../engine/useSimLoop';
import { CellView } from '../ui/CellView';
import { PlantView } from '../ui/PlantView';
import { Meter, StatChip, StatusLine } from '../ui/CellStats';
import { toneForValue } from '../ui/tone';
import { HoldButton } from '../ui/ResourceControls';
import { LabFrame } from '../ui/LabFrame';

const REPAIR_SECONDS = 2.2;

const TONE_WORD = { normal: 'Normal', warn: 'Odd', bad: 'Abnormal' };

const HEALTHY_MONITORS = [
  { label: 'Glucose production', value: 'NORMAL', tone: 'normal' },
  { label: 'Cellular energy', value: 'NORMAL', tone: 'normal' },
  { label: 'Water balance', value: 'NORMAL', tone: 'normal' },
  { label: 'Substances in / out', value: 'NORMAL', tone: 'normal' },
];

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
// until the pattern points at one organelle, then repairs it. Solving a case
// never ends the run: once the cell recovers, another case can be opened.
export function CellEmergency({
  level,
  attempt,
  progressByLevel,
  reducedMotion,
  particleBudget,
  onExit,
  onRestart,
  onQuestComplete,
  onLevelComplete,
}) {
  const [caseNumber, setCaseNumber] = useState(0);
  const [state, setState] = useState(() => initialState(level.sim));
  const [selected, setSelected] = useState(null);
  // Organelles are only clickable in the cell view, so this level opens there.
  const [view, setView] = useState('cell');
  const [message, setMessage] = useState(null);
  const [holding, setHolding] = useState(false);
  const [paused, setPaused] = useState(false);
  const quests = useQuests({ level, progressByLevel, onQuestComplete, onLevelComplete });
  const sim = level.sim;
  const fault = pickFault(attempt + caseNumber);

  useSimLoop(!paused && !quests.celebration, (dt) => {
    setState((prev) => {
      if (prev.phase === 'done') return prev;
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
    quests.tick(
      dt,
      (quest) => quest.isMet(state, fault),
      () => sim.starsByWrongGuesses[Math.min(state.wrong.length, sim.starsByWrongGuesses.length - 1)],
    );
  });

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

  function openNewCase() {
    setCaseNumber((n) => n + 1);
    setState(initialState(sim));
    setSelected(null);
    setMessage(null);
    setHolding(false);
    setView('cell');
  }

  const repaired = state.phase === 'recovering' || state.phase === 'done';
  const monitors = repaired ? HEALTHY_MONITORS : Object.values(fault.symptoms);
  const thirsty = fault.id === 'vacuole' || fault.id === 'membrane';

  const hud = (
    <>
      {message && <StatusLine tone={message.tone}>{message.text}</StatusLine>}

      <div className="sq-stats pc-lab-meters" aria-label="Cell readings">
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
          {monitors.map((monitor) => (
            <StatChip key={monitor.label} label={monitor.label} value={monitor.value} tone={monitor.tone} />
          ))}
        </div>
      </div>

      {repaired ? (
        <div className="pc-note">
          <strong>{fault.title}:</strong> {fault.reasoning}
        </div>
      ) : (
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
      )}
    </>
  );

  let controls;
  if (state.phase === 'investigate') {
    controls = (
      <>
        <div className="sq-ctrl">
          <div className="sq-ctrl__head">
            <span className="sq-ctrl__label" id="pc-tests-label">Run a test</span>
          </div>
          <div className="pc-tests" role="group" aria-labelledby="pc-tests-label">
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

        <div className="sq-ctrl">
          <div className="sq-ctrl__head">
            <span className="sq-ctrl__label" id="pc-suspects-label">Name the faulty organelle</span>
          </div>
          <div className="pc-suspects" role="group" aria-labelledby="pc-suspects-label">
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
        </div>

        <div className="sq-ctrl">
          <div className="sq-ctrl__hint">
            {selected
              ? <><strong>{ORGANELLES[selected].name}:</strong> {ORGANELLES[selected].job}</>
              : 'Pick an organelle in the list or click one in the cell view.'}
          </div>
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
    );
  } else if (state.phase === 'repairing') {
    controls = (
      <>
        <div className="sq-ctrl">
          <div className="sq-ctrl__head">
            <span className="sq-ctrl__label">Repair</span>
          </div>
          <div className="sq-ctrl__hint">{fault.repairNote}</div>
        </div>
        <div className="sq-ctrl">
          <Meter
            label={fault.repairLabel}
            icon="🔧"
            value={state.repair * 100}
            readout={`${Math.round(state.repair * 100)}%`}
            tone="info"
          />
        </div>
        <div className="sq-ctrl">
          <HoldButton
            label={`Hold to ${fault.repairLabel.toLowerCase()}`}
            icon="🔧"
            tone="teal"
            active={holding}
            onHoldChange={setHolding}
          />
        </div>
      </>
    );
  } else {
    controls = (
      <>
        <div className="sq-ctrl">
          <div className="sq-ctrl__head">
            <span className="sq-ctrl__label">{state.phase === 'done' ? 'Case solved' : 'Recovering'}</span>
          </div>
          <div className="sq-ctrl__hint">{fault.repairNote}</div>
        </div>
        {state.phase === 'done' && (
          <div className="sq-ctrl">
            <button type="button" className="pc-btn pc-btn--primary pc-btn--wide" onClick={openNewCase}>
              Open a new case
            </button>
          </div>
        )}
      </>
    );
  }

  return (
    <LabFrame
      level={level}
      quests={quests}
      reducedMotion={reducedMotion}
      paused={paused}
      onTogglePause={() => setPaused((p) => !p)}
      onRestart={onRestart}
      onExit={onExit}
      view={view}
      onViewChange={setView}
      hud={hud}
      readout={(
        <>
          <span>case <b>{caseNumber + 1}</b></span>
          <span>tests run <b>{state.revealed.length} of {TESTS.length}</b></span>
          <span>wrong calls <b>{state.wrong.length}</b></span>
        </>
      )}
      plant={(
        <PlantView
          light={70}
          water={repaired ? 60 : thirsty ? 12 : 45}
          co2={repaired ? 55 : 35}
          soil={60}
          health={state.health}
          turgor={repaired ? 70 : thirsty ? 38 : 65}
          reducedMotion={reducedMotion}
          particleBudget={particleBudget}
          title={repaired ? 'The plant recovering' : 'The plant showing symptoms'}
        />
      )}
      cell={(
        <CellView
          activity={repaired ? 0.7 : fault.id === 'chloroplast' ? 0.08 : 0.5}
          respiration={repaired ? 0.7 : fault.id === 'mitochondrion' ? 0.05 : 0.5}
          vacuoleFill={repaired ? 55 : fault.id === 'vacuole' ? 18 : 50}
          turgor={repaired ? 70 : thirsty ? 38 : 65}
          health={state.health}
          damagedId={state.phase === 'investigate' ? null : fault.organelleId}
          selectedId={selected}
          onSelectOrganelle={state.phase === 'investigate' ? setSelected : null}
          reducedMotion={reducedMotion}
          particleBudget={particleBudget}
          title="Plant cell showing symptoms"
        />
      )}
      caption={(
        <p className="pc-equation">
          {state.phase === 'investigate'
            ? view === 'plant'
              ? 'The whole plant is showing the damage. Switch to the cell view to click an organelle.'
              : 'Click an organelle in the cell (or use the list below) to look at it more closely.'
            : repaired
              ? 'The repaired organelle is back at work and the cell is recovering.'
              : 'Hold the repair button to rebuild the damaged organelle.'}
        </p>
      )}
      controls={controls}
    />
  );
}
