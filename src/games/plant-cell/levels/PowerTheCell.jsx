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
import { Meter, StatChip, StatusLine } from '../ui/CellStats';
import { toneForValue } from '../ui/tone';
import { ResourceSlider } from '../ui/ResourceControls';
import { RunFrame } from '../ui/RunFrame';

// Level 1 — sunlight, water and carbon dioxide in; glucose and oxygen out.
export function PowerTheCell({ level, reducedMotion, particleBudget, onExit, onFinish }) {
  const [controls, setControls] = useState({ light: 50, water: 50, co2: 50 });
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

  const stage = (
    <div className="pc-stage">
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
  );

  const panel = (
    <>
      <StatusLine tone={advice.tone}>{advice.text}</StatusLine>

      <div className="pc-panel__group">
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

      <div className="pc-chips">
        <StatChip
          label="Photosynthesis"
          value={`${Math.round(sim.rate * 100)}%`}
          tone={sim.rate > 0.6 ? 'good' : sim.rate > 0.3 ? 'warn' : 'bad'}
        />
        <StatChip
          label="Limiting factor"
          value={LIMITING_LABEL[sim.limiting]}
          tone={sim.limiting === 'none' ? 'good' : 'warn'}
        />
        <StatChip label="Oxygen released" value={`${Math.round(sim.oxygen)}`} tone="info" />
      </div>

      <div className="pc-panel__group">
        <ResourceSlider
          id="pc-light"
          label="Sunlight on the leaf"
          icon="☀️"
          accent="#d9a824"
          value={controls.light}
          onChange={(light) => setControls((c) => ({ ...c, light }))}
          hint="More light drives photosynthesis, but the leaf also loses water faster."
        />
        <ResourceSlider
          id="pc-water"
          label="Water drawn from the roots"
          icon="💧"
          accent="#3f7fb5"
          value={controls.water}
          onChange={(water) => setControls((c) => ({ ...c, water }))}
          hint="The soil around the roots refills slowly. Drain it and uptake stops."
        />
        <ResourceSlider
          id="pc-co2"
          label="Stomata open (carbon dioxide in)"
          icon="🌬️"
          accent="#6f6553"
          value={controls.co2}
          onChange={(co2) => setControls((c) => ({ ...c, co2 }))}
          hint="Open stomata let carbon dioxide in — and let water vapour out."
        />
      </div>
    </>
  );

  return (
    <RunFrame
      level={level}
      secondsLeft={secondsLeft}
      progress={(sim.elapsed / level.durationSeconds) * 100}
      paused={paused}
      onTogglePause={() => setPaused((p) => !p)}
      onExit={onExit}
      stage={stage}
      panel={panel}
    />
  );
}
