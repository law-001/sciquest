import { useEffect, useRef, useState } from 'react';
import { starsForValue } from '../data/levels';
import { createPhotosynthesisState, photosynthesisAdvice, stepPhotosynthesis } from '../engine/photosynthesis';
import { useQuests } from '../engine/useQuests';
import { useSimLoop } from '../engine/useSimLoop';
import { CellView } from '../ui/CellView';
import { PlantView } from '../ui/PlantView';
import { Meter, StatusLine } from '../ui/CellStats';
import { toneForValue } from '../ui/tone';
import { LabFrame } from '../ui/LabFrame';

const CONTROLS = [
  { key: 'light', label: 'Sunlight', icon: '☀️', accent: '#d9a824', hint: 'Chloroplasts use light energy to make glucose.' },
  { key: 'water', label: 'Water', icon: '💧', accent: '#3f7fb5', hint: 'Water is one of the raw materials for photosynthesis.' },
  { key: 'co2', label: 'Carbon dioxide', icon: '🌬️', accent: '#6f6553', hint: 'Plants take in carbon dioxide from the air.' },
];

// Level 1 — sunlight, water and carbon dioxide in; glucose and oxygen out.
// Played as a sandbox: quests complete one by one and the run only ends if the
// cell runs out of glucose.
export function PowerTheCell({
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
  const [controls, setControls] = useState({ light: 50, water: 50, co2: 50 });
  // 'plant' is the object view (whole plant by a window); 'cell' zooms inside.
  const [view, setView] = useState('plant');
  const [sim, setSim] = useState(() => createPhotosynthesisState(level.sim));
  const [paused, setPaused] = useState(false);
  const finishedRef = useRef(false);
  const quests = useQuests({ level, progressByLevel, onQuestComplete, onLevelComplete });

  // The sim holds still under the quest popup so the cell cannot die while
  // the note is being read.
  useSimLoop(!paused && !sim.dead && !quests.celebration, (dt) => {
    setSim((prev) => stepPhotosynthesis(prev, controls, level.sim, dt));
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
      headline: 'The cell ran out of glucose.',
      detail: 'Photosynthesis made less glucose than the cell was using, so the store ran out and the cell had no energy left. Chloroplasts need all three: sunlight, water and carbon dioxide.',
      stats: [
        { label: 'Quests done', value: `${quests.doneQuestIds.length} of ${level.quests.length}` },
        { label: 'Glucose stored', value: `${Math.round(sim.glucose)}%` },
        { label: 'Oxygen released', value: `${Math.round(sim.oxygen)} units` },
      ],
    });
  }, [sim, level, quests.doneQuestIds.length, onFinish]);

  const advice = photosynthesisAdvice(sim);

  const hud = (
    <>
      <StatusLine tone={advice.tone}>{advice.text}</StatusLine>

      <div className="sq-stats pc-lab-meters" aria-label="Cell readings">
        <Meter
          label="Cell health"
          icon="❤️"
          value={sim.health}
          readout={`${Math.round(sim.health)}%`}
          tone={toneForValue(sim.health, { low: 25, high: 60 })}
        />
        <Meter
          label="Glucose store"
          icon="🍬"
          value={sim.glucose}
          readout={`${Math.round(sim.glucose)}%`}
          tone={toneForValue(sim.glucose, { low: 15, high: 40 })}
        />
      </div>
    </>
  );

  const controlBar = CONTROLS.map(({ key, label, icon, accent, hint }) => (
    <div key={key} className="sq-ctrl">
      <div className="sq-ctrl__head">
        <label className="sq-ctrl__label" htmlFor={`pc-${key}`}>
          <span aria-hidden="true">{icon}</span> {label}
        </label>
        <span className="sq-ctrl__value">{controls[key]}%</span>
      </div>
      <input
        id={`pc-${key}`}
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
      hud={hud}
      readout={(
        <>
          <span>glucose made <b>{Math.round(sim.rate * 100)}%</b></span>
          <span>oxygen released <b>{Math.round(sim.oxygen)}</b></span>
        </>
      )}
      plant={(
        <PlantView
          light={controls.light}
          water={controls.water}
          co2={controls.co2}
          soil={controls.water}
          health={sim.health}
          turgor={100}
          reducedMotion={reducedMotion}
          particleBudget={particleBudget}
          title="The plant by the window"
        />
      )}
      cell={(
        <CellView
          vacuoleFill={45}
          photosynthesis={{ ...controls, rate: sim.rate }}
          reducedMotion={reducedMotion}
          particleBudget={particleBudget}
          title="Plant cell running photosynthesis"
        />
      )}
      caption={(
        <div className="pc-equation" aria-label="The photosynthesis equation">
          <span className="pc-equation__side">
            <b style={{ color: '#d9a824' }}>sunlight</b> + <b style={{ color: '#3f7fb5' }}>water</b> + <b style={{ color: '#6f6553' }}>carbon dioxide</b>
          </span>
          <span className="pc-equation__arrow" aria-hidden="true">→</span>
          <span className="pc-equation__mid">chloroplast</span>
          <span className="pc-equation__arrow" aria-hidden="true">→</span>
          <span className="pc-equation__side">
            <b style={{ color: '#d76d2e' }}>glucose</b> + <b style={{ color: '#1d8580' }}>oxygen</b>
          </span>
        </div>
      )}
      controls={controlBar}
    />
  );
}
