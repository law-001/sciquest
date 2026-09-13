import { useEffect, useRef, useState } from 'react';
import { starsForValue } from '../data/levels';
import {
  LIMITING_LABEL,
  createPhotosynthesisState,
  photosynthesisAdvice,
  stepPhotosynthesis,
} from '../engine/photosynthesis';
import { useSimLoop } from '../engine/useSimLoop';
import { CellView } from '../ui/CellView';
import { PlantView } from '../ui/PlantView';
import { Meter, StatusLine } from '../ui/CellStats';
import { toneForValue } from '../ui/tone';
import { LabFrame } from '../ui/LabFrame';

const CONTROLS = [
  { key: 'light', label: 'Sunlight', icon: '☀️', accent: '#d9a824', hint: 'More light drives photosynthesis, but the leaf loses water faster.' },
  { key: 'water', label: 'Water from roots', icon: '💧', accent: '#3f7fb5', hint: 'The soil refills slowly. Drain it and uptake stops.' },
  { key: 'co2', label: 'Stomata open', icon: '🌬️', accent: '#6f6553', hint: 'Lets carbon dioxide in — and water vapour out.' },
];

// Level 1 — sunlight, water and carbon dioxide in; glucose and oxygen out.
export function PowerTheCell({ level, reducedMotion, particleBudget, onExit, onRestart, onFinish }) {
  const [controls, setControls] = useState({ light: 50, water: 50, co2: 50 });
  // 'plant' is the object view (whole plant by a window); 'cell' zooms inside.
  const [view, setView] = useState('plant');
  const [sim, setSim] = useState(() => createPhotosynthesisState(level.sim));
  const [paused, setPaused] = useState(false);
  const finishedRef = useRef(false);

  const over = sim.dead || sim.elapsed >= level.durationSeconds;

  useSimLoop(!paused && !over, (dt) => {
    setSim((prev) => stepPhotosynthesis(prev, controls, level.sim, dt));
  });

  useEffect(() => {
    if (!over || finishedRef.current) return;
    finishedRef.current = true;
    const survived = !sim.dead;
    const stars = survived ? Math.max(1, starsForValue(level.sim.starMinHealth, sim.minHealth)) : 0;
    onFinish({
      stars,
      failed: !survived,
      headline: 'The cell ran out of energy.',
      detail: survived
        ? `The chloroplasts kept glucose flowing for the full ${level.durationSeconds} seconds. Health never dropped below ${Math.round(sim.minHealth)}%.`
        : 'Glucose production fell below what the cell was using, the store emptied, and the cell had nothing left to live on. Watch the limiting factor — the raw material in shortest supply is the one to fix.',
      stats: [
        { label: 'Lowest health', value: `${Math.round(sim.minHealth)}%` },
        { label: 'Glucose stored', value: `${Math.round(sim.glucose)}%` },
        { label: 'Oxygen released', value: `${Math.round(sim.oxygen)} units` },
      ],
    });
  }, [over, sim, level, onFinish]);

  const advice = photosynthesisAdvice(sim, controls);
  const secondsLeft = Math.max(0, level.durationSeconds - sim.elapsed);
  const progress = Math.min(100, (sim.elapsed / level.durationSeconds) * 100);

  const hud = (
    <>
      <div className="sq-ccard sq-ccard--active">
        <div className="sq-ccard__eyebrow">Objective</div>
        <div className="sq-ccard__title">{level.objective}</div>
        <div className="sq-ccard__desc">{level.goal}</div>
        <div className="sq-challenge-card__progress">
          <div className="sq-progress-bar">
            <div
              className="sq-progress-bar__fill"
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Time survived"
            />
          </div>
          <span>{Math.ceil(secondsLeft)}s</span>
        </div>
      </div>

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
        <Meter
          label="Water in the cell"
          icon="💧"
          value={sim.cellWater}
          readout={`${Math.round(sim.cellWater)}%`}
          tone={toneForValue(sim.cellWater, { low: 25, high: 45 })}
        />
        <Meter
          label="Water in the soil"
          icon="🪴"
          value={sim.soil}
          readout={`${Math.round(sim.soil)}%`}
          tone={toneForValue(sim.soil, { low: 15, high: 35 })}
        />
      </div>
    </>
  );

  const stage = (
    <>
      <div className="pc-lab-readout">
        <span>photosynthesis <b>{Math.round(sim.rate * 100)}%</b></span>
        <span>limiting <b>{LIMITING_LABEL[sim.limiting]}</b></span>
        <span>oxygen <b>{Math.round(sim.oxygen)}</b></span>
      </div>

      <button
        type="button"
        className={`pc-lab-viewtoggle${view === 'cell' ? ' is-on' : ''}`}
        onClick={() => setView((v) => (v === 'plant' ? 'cell' : 'plant'))}
      >
        <span aria-hidden="true">{view === 'cell' ? '🪴' : '🔬'}</span>
        {view === 'cell' ? 'Whole plant' : 'Inside a cell'}
      </button>

      <div className="pc-lab-stage">
        {view === 'plant' ? (
          <PlantView
            light={controls.light}
            water={controls.water}
            co2={controls.co2}
            soil={sim.soil}
            health={sim.health}
            turgor={sim.cellWater}
            reducedMotion={reducedMotion}
            particleBudget={particleBudget}
            title="The plant by the window"
          />
        ) : (
          <CellView
            activity={sim.rate}
            respiration={sim.glucose > 0 ? 0.6 : 0.1}
            vacuoleFill={45}
            turgor={Math.max(40, sim.cellWater)}
            health={sim.health}
            photosynthesis={{ ...controls, rate: sim.rate }}
            reducedMotion={reducedMotion}
            particleBudget={particleBudget}
            title="Plant cell running photosynthesis"
          />
        )}
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
      paused={paused}
      onTogglePause={() => setPaused((p) => !p)}
      onRestart={onRestart}
      onExit={onExit}
      hud={hud}
      stage={stage}
      controls={controlBar}
    />
  );
}
