import { useEffect, useRef, useState } from 'react';

// NOTE: the quest engine, sim loop, read-outs and shell are the plant cell
// game's, used as-is so the two cell games play and look like one pair.
import { starsForValue } from '../plant-cell/data/levels';
import { useQuests } from '../plant-cell/engine/useQuests';
import { useSimLoop } from '../plant-cell/engine/useSimLoop';
import { Meter, StatusLine } from '../plant-cell/ui/CellStats';
import { LabFrame } from '../plant-cell/ui/LabFrame';
import { toneForValue } from '../plant-cell/ui/tone';
import { AnimalCellView } from './AnimalCellView';
import { AnimalView } from './AnimalView';

const CONTROLS = [
  { key: 'glucose', label: 'Glucose', icon: '🍬', accent: '#d76d2e', hint: 'Food the animal ate — mitochondria break it down.' },
  { key: 'oxygen', label: 'Oxygen', icon: '🫁', accent: '#2bafa9', hint: 'Breathed in and carried to every cell.' },
];

const clamp = (value) => Math.min(100, Math.max(0, value));

function createRespiration(sim) {
  return { energy: sim.energyStart, health: sim.healthStart, minHealth: sim.healthStart, co2: 0, rate: 0, lowest: 'glucose', dead: false };
}

// Same shape as plant-cell's photosynthesis model: respiration only runs as
// fast as the input there is least of, and the cell spends energy every second.
function stepRespiration(state, controls, sim, dt) {
  const lowest = controls.glucose <= controls.oxygen ? 'glucose' : 'oxygen';
  const rate = controls[lowest] / 100;
  const used = sim.demandPerSec * dt;
  let energy = state.energy + rate * sim.productionPerSec * dt - used;
  let health = state.health;

  if (energy < 0) {
    health += energy * (sim.deficitHealthPerSec / sim.demandPerSec);
    energy = 0;
  } else if (energy > 20 && rate * sim.productionPerSec >= sim.demandPerSec) {
    health += sim.regenHealthPerSec * dt;
  }
  health = clamp(health);

  return {
    energy: clamp(energy),
    health,
    minHealth: Math.min(state.minHealth, health),
    co2: state.co2 + rate * sim.co2PerSec * dt,
    rate,
    lowest,
    dead: health <= 0,
  };
}

function adviceFor(state) {
  if (state.rate < 0.15) {
    return { tone: 'bad', text: `Respiration has almost stopped — there is not enough ${state.lowest}. Mitochondria need glucose and oxygen.` };
  }
  if (state.energy < 15) return { tone: 'warn', text: 'The energy store is nearly empty. The cell uses energy all the time.' };
  if (state.rate < 0.9) return { tone: 'info', text: `Releasing energy at ${Math.round(state.rate * 100)}%. More ${state.lowest} would speed it up.` };
  return { tone: 'good', text: 'Plenty of glucose and oxygen — the mitochondria are releasing lots of energy.' };
}

// Level 1 — glucose and oxygen in; energy, carbon dioxide and water out.
// A sandbox like plant-cell's PowerTheCell: the run only ends if the cell dies.
export function FuelTheCell({
  level,
  progressByLevel,
  reducedMotion,
  particleBudget,
  onExit,
  onRestart,
  onQuestComplete,
  onLevelComplete,
  onFinish,
}) {
  const [controls, setControls] = useState({ glucose: 50, oxygen: 50 });
  // 'plant' is LabFrame's name for the outside view — here, the whole dog.
  const [view, setView] = useState('plant');
  const [sim, setSim] = useState(() => createRespiration(level.sim));
  const [paused, setPaused] = useState(false);
  const finishedRef = useRef(false);
  const quests = useQuests({ level, progressByLevel, onQuestComplete, onLevelComplete });

  useSimLoop(!paused && !sim.dead && !quests.celebration, (dt) => {
    setSim((prev) => stepRespiration(prev, controls, level.sim, dt));
    quests.tick(
      dt,
      (quest) => quest.isMet(sim, controls),
      () => Math.max(1, starsForValue(level.sim.starMinHealth, sim.minHealth)),
    );
  });

  useEffect(() => {
    if (!sim.dead || finishedRef.current) return;
    finishedRef.current = true;
    onFinish({
      stars: 0,
      failed: true,
      headline: 'The cell ran out of energy.',
      detail: 'The mitochondria released less energy than the cell was using, so the store ran out. Respiration needs both glucose and oxygen.',
      stats: [
        { label: 'Quests done', value: `${quests.doneQuestIds.length} of ${level.quests.length}` },
        { label: 'Energy stored', value: `${Math.round(sim.energy)}%` },
        { label: 'Carbon dioxide released', value: `${Math.round(sim.co2)} units` },
      ],
    });
  }, [sim, level, quests.doneQuestIds.length, onFinish]);

  const advice = adviceFor(sim);

  const hud = (
    <>
      <StatusLine tone={advice.tone}>{advice.text}</StatusLine>
      <div className="sq-stats pc-lab-meters" aria-label="Cell readings">
        <Meter label="Cell health" icon="❤️" value={sim.health} readout={`${Math.round(sim.health)}%`} tone={toneForValue(sim.health, { low: 25, high: 60 })} />
        <Meter label="Energy store" icon="⚡" value={sim.energy} readout={`${Math.round(sim.energy)}%`} tone={toneForValue(sim.energy, { low: 15, high: 40 })} />
      </div>
    </>
  );

  const controlBar = CONTROLS.map(({ key, label, icon, accent, hint }) => (
    <div key={key} className="sq-ctrl">
      <div className="sq-ctrl__head">
        <label className="sq-ctrl__label" htmlFor={`ac-${key}`}>
          <span aria-hidden="true">{icon}</span> {label}
        </label>
        <span className="sq-ctrl__value">{controls[key]}%</span>
      </div>
      <input
        id={`ac-${key}`}
        className="pc-range"
        type="range"
        min="0"
        max="100"
        step="1"
        value={controls[key]}
        onChange={(e) => {
          const value = Number(e.target.value);
          setControls((c) => ({ ...c, [key]: value }));
        }}
        style={{ '--pc-range-accent': accent }}
      />
      <div className="sq-ctrl__hint">{hint}</div>
    </div>
  ));

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
      outsideView={{ icon: '🐕', label: 'Whole animal' }}
      plant={(
        <AnimalView
          {...controls}
          rate={sim.rate}
          energy={sim.energy}
          health={sim.health}
          reducedMotion={reducedMotion}
          particleBudget={particleBudget}
          title="The dog in the room"
        />
      )}
      hud={hud}
      readout={(
        <>
          <span>energy released <b>{Math.round(sim.rate * 100)}%</b></span>
          <span>carbon dioxide out <b>{Math.round(sim.co2)}</b></span>
        </>
      )}
      cell={(
        <AnimalCellView
          respiration={{ ...controls, rate: sim.rate }}
          health={sim.health}
          reducedMotion={reducedMotion}
          particleBudget={particleBudget}
          title="Animal cell running cellular respiration"
        />
      )}
      caption={(
        <div className="pc-equation" aria-label="The respiration equation">
          <span className="pc-equation__side">
            <b style={{ color: '#d76d2e' }}>glucose</b> + <b style={{ color: '#1d8580' }}>oxygen</b>
          </span>
          <span className="pc-equation__arrow" aria-hidden="true">→</span>
          <span className="pc-equation__mid">mitochondria</span>
          <span className="pc-equation__arrow" aria-hidden="true">→</span>
          <span className="pc-equation__side">
            <b style={{ color: '#a87a12' }}>energy</b> + <b style={{ color: '#6f6553' }}>carbon dioxide</b> + <b style={{ color: '#3f7fb5' }}>water</b>
          </span>
        </div>
      )}
      controls={controlBar}
    />
  );
}
