import { useEffect, useRef, useState } from 'react';
import { starsForValue } from '../data/levels';
import {
  createOsmosisState,
  currentWeather,
  flowDirection,
  osmosisStatus,
  stepOsmosis,
} from '../engine/osmosis';
import { useSimLoop } from '../engine/useSimLoop';
import { CellView } from '../ui/CellView';
import { PlantView } from '../ui/PlantView';
import { ViewTabs } from '../ui/ViewTabs';
import { Meter, StatChip, StatusLine } from '../ui/CellStats';
import { toneForValue } from '../ui/tone';
import { HoldButton, ResourceSlider } from '../ui/ResourceControls';
import { RunFrame } from '../ui/RunFrame';

const WEATHER_ICON = { mild: '🌤️', rain: '🌧️', drought: '🔥', salty: '🧂' };

// Level 2 — osmosis across the membrane, with the vacuole as the water bank.
export function KeepItAlive({ level, reducedMotion, particleBudget, onExit, onFinish }) {
  const [channels, setChannels] = useState(50);
  const [view, setView] = useState('plant');
  const [transfer, setTransfer] = useState(null);
  const [sim, setSim] = useState(() => createOsmosisState(level.sim));
  const [paused, setPaused] = useState(false);
  const finishedRef = useRef(false);

  const over = sim.dead || sim.elapsed >= level.durationSeconds;

  useSimLoop(!paused && !over, (dt) => {
    setSim((prev) => stepOsmosis(prev, { channels, transfer }, level, dt));
  });

  useEffect(() => {
    if (!over || finishedRef.current) return;
    finishedRef.current = true;
    const bandPercent = Math.round((sim.bandTime / level.durationSeconds) * 100);
    const survived = !sim.dead;
    const stars = survived ? Math.max(1, starsForValue(level.sim.starBandPercent, bandPercent)) : 0;
    onFinish({
      stars,
      failed: !survived,
      headline: 'The cell dried out.',
      detail: survived
        ? `The water balance sat in the healthy band for ${bandPercent}% of the time, through rain, drought and salty soil.`
        : 'So much water left the cytoplasm that the cell shrivelled. When salt is more concentrated outside, water leaves by osmosis — narrow the membrane channels and release the water you banked in the vacuole.',
      stats: [
        { label: 'Time in healthy band', value: `${bandPercent}%` },
        { label: 'Water left in the cell', value: `${Math.round(sim.cellWater)}%` },
        { label: 'Vacuole store', value: `${Math.round(sim.vacuole)}%` },
      ],
    });
  }, [over, sim, level, onFinish]);

  const env = currentWeather(level.weather, sim.elapsed);
  const status = osmosisStatus(sim, level, env);
  const direction = flowDirection(sim.flow);
  const secondsLeft = Math.max(0, level.durationSeconds - sim.elapsed);

  const stage = (
    <div className="pc-stage">
      <div className="pc-weather" style={{ borderColor: 'var(--pc-teal)' }}>
        <span className="pc-weather__icon" aria-hidden="true">{WEATHER_ICON[env.id]}</span>
        <span>
          <strong>{env.label}</strong>
          <span className="pc-weather__note">{env.note}</span>
        </span>
      </div>

      <ViewTabs view={view} onChange={setView} />

      {view === 'plant' ? (
        <PlantView
          light={env.light}
          water={channels}
          co2={env.stomata}
          soil={env.water}
          health={sim.health}
          turgor={sim.turgor}
          weather={env.id === 'mild' ? null : env.id}
          reducedMotion={reducedMotion}
          particleBudget={particleBudget}
          title={`The plant in ${env.label.toLowerCase()}`}
        />
      ) : (
        <CellView
          activity={0.35}
          respiration={0.45}
          vacuoleFill={sim.vacuole}
          turgor={sim.turgor}
          health={sim.health}
          waterFlow={{ direction, strength: Math.min(1, Math.abs(sim.flow) / 8) }}
          reducedMotion={reducedMotion}
          particleBudget={particleBudget}
          title="Plant cell exchanging water with its surroundings"
        />
      )}

      <p className="pc-flow" aria-live="polite">
        {direction === 'in' && 'Water is moving INTO the cell through the membrane.'}
        {direction === 'out' && 'Water is moving OUT of the cell through the membrane.'}
        {direction === 'still' && 'Almost no net water movement across the membrane.'}
      </p>
    </div>
  );

  const panel = (
    <>
      <StatusLine tone={status.tone}>{status.text}</StatusLine>

      <div className="pc-eyebrow">Your controls</div>
      <div className="pc-panel__group">
        <ResourceSlider
          id="pc-channels"
          label="Membrane channels open"
          icon="🚪"
          accent="#2bafa9"
          value={channels}
          onChange={setChannels}
          hint="The membrane sets how fast water crosses — never which way. Some water always seeps through, even fully closed."
        />

        <div className="pc-holds">
          <HoldButton
            label="Store in vacuole"
            icon="⬇"
            tone="teal"
            active={transfer === 'store'}
            onHoldChange={(on) => setTransfer(on ? 'store' : null)}
          />
          <HoldButton
            label="Release from vacuole"
            icon="⬆"
            tone="orange"
            active={transfer === 'release'}
            onHoldChange={(on) => setTransfer(on ? 'release' : null)}
          />
        </div>
        <p className="pc-slider__hint">
          Hold a button (or press and hold Enter on it) to move water between the cytoplasm and the vacuole.
        </p>
      </div>

      <div className="pc-panel__group">
        <Meter
          label="Turgor (how firm the cell is)"
          icon="🫧"
          value={sim.turgor}
          readout={
            sim.turgor >= level.sim.wallStrainAt ? 'Fully turgid'
              : sim.turgor > level.sim.bandHigh ? 'Very full'
                : sim.turgor >= level.sim.bandLow ? 'Healthy'
                  : 'Going limp'
          }
          tone={sim.turgor >= level.sim.bandLow && sim.turgor <= level.sim.bandHigh ? 'good' : 'warn'}
          band={{ low: level.sim.bandLow, high: level.sim.bandHigh }}
        />
        <Meter
          label="Water in the cytoplasm"
          icon="💧"
          value={sim.cellWater}
          readout={`${Math.round(sim.cellWater)}%`}
          tone={toneForValue(sim.cellWater, { low: level.sim.dryThreshold, high: 45 })}
        />
        <Meter
          label="Vacuole store"
          icon="🏺"
          value={sim.vacuole}
          readout={`${Math.round(sim.vacuole)}% full`}
          tone={sim.vacuole > 25 ? 'good' : 'warn'}
        />
        <Meter
          label="Cell health"
          icon="❤️"
          value={sim.health}
          readout={`${Math.round(sim.health)}%`}
          tone={toneForValue(sim.health, { low: 30, high: 65 })}
        />
      </div>

      <div className="pc-chips">
        <StatChip label="Salt outside" value={`${env.solute}%`} tone={env.solute > level.sim.insideSolute ? 'warn' : 'info'} />
        <StatChip label="Salt inside" value={`${level.sim.insideSolute}%`} tone="info" />
        <StatChip label="Water outside" value={`${env.water}%`} tone={env.water < 25 ? 'warn' : 'info'} />
      </div>


      <div className="pc-note">
        <strong>Cell wall:</strong> holding firm. It supports the cell and stops it bursting when water floods in — it does not decide what crosses.
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
