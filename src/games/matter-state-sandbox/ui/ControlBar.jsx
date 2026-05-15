import { useState, useEffect, useRef } from 'react';

function getRange(substance) {
  if (!substance) return [-50, 200];
  const mp = substance.meltingPoint;
  const bp = substance.boilingPoint;
  const span = Math.max(60, Math.abs(bp - mp));
  return [Math.floor(mp - span * 0.45), Math.ceil(bp + span * 0.55)];
}

function SandboxSlider({ value, min, max, step = 1, ticks = [], onChange, locked = false, ariaLabel }) {
  const ref = useRef(null);
  const draggingRef = useRef(false);

  const pct = (v) => Math.max(0, Math.min(100, ((v - min) / (max - min)) * 100));
  const thumbLeft = `calc(10px + ${pct(value)}% * (100% - 20px) / 100%)`;
  const fillWidth = `calc(${pct(value)}% * (100% - 20px) / 100%)`;

  function setFromClientX(clientX) {
    if (locked || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (clientX - r.left - 10) / (r.width - 20)));
    let v = min + x * (max - min);
    v = Math.round(v / step) * step;
    onChange(Math.max(min, Math.min(max, v)));
  }

  function onDown(e) {
    if (locked) return;
    draggingRef.current = true;
    setFromClientX(e.clientX ?? e.touches?.[0]?.clientX);
    ref.current?.focus();
  }

  useEffect(() => {
    function onMove(e) {
      if (!draggingRef.current) return;
      setFromClientX(e.clientX ?? e.touches?.[0]?.clientX);
    }
    function onUp() { draggingRef.current = false; }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [locked, min, max, step]);

  function onKey(e) {
    if (locked) return;
    const big = Math.ceil((max - min) / 20);
    if (e.key === 'ArrowLeft') { onChange(Math.max(min, value - step)); e.preventDefault(); }
    else if (e.key === 'ArrowRight') { onChange(Math.min(max, value + step)); e.preventDefault(); }
    else if (e.key === 'PageDown') { onChange(Math.max(min, value - big)); e.preventDefault(); }
    else if (e.key === 'PageUp') { onChange(Math.min(max, value + big)); e.preventDefault(); }
    else if (e.key === 'Home') { onChange(min); e.preventDefault(); }
    else if (e.key === 'End') { onChange(max); e.preventDefault(); }
  }

  return (
    <div
      ref={ref}
      role="slider"
      tabIndex={locked ? -1 : 0}
      aria-label={ariaLabel}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-disabled={locked || undefined}
      className={`sq-slider${locked ? ' sq-slider--locked' : ''}`}
      onMouseDown={onDown}
      onTouchStart={onDown}
      onKeyDown={onKey}
    >
      <div className="sq-slider__rail" />
      <div className="sq-slider__fill" style={{ width: fillWidth }} />
      {ticks.map((t, i) => (
        <span key={i}>
          <div className="sq-slider__tick" style={{ left: `calc(10px + ${pct(t.value)}% * (100% - 20px) / 100%)`, background: t.color || undefined }} />
          {t.label && (
            <div className="sq-slider__tick-lbl" style={{ left: `calc(10px + ${pct(t.value)}% * (100% - 20px) / 100%)`, color: t.color || undefined }}>
              {t.label}
            </div>
          )}
        </span>
      ))}
      <div className="sq-slider__thumb" style={{ left: thumbLeft }} />
    </div>
  );
}

export function ControlBar({ bus, level, substances, currentSubstanceId, reducedMotion }) {
  const [currentTemp, setCurrentTemp] = useState(() => level.number === 2 ? -2 : level.number === 3 ? 110 : 20);
  const [currentPressure, setCurrentPressure] = useState(level.number === 3 ? 1.6 : 1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeSubstanceId, setActiveSubstanceId] = useState(currentSubstanceId ?? 'water');

  const substance = substances[activeSubstanceId] ?? substances[Object.keys(substances)[0]];
  const [min, max] = getRange(substance);

  useEffect(() => {
    function onTransitionStart() { setIsTransitioning(true); }
    function onTransitionComplete() { setIsTransitioning(false); }
    bus.on('transitionStart', onTransitionStart);
    bus.on('transitionComplete', onTransitionComplete);
    return () => {
      bus.off('transitionStart', onTransitionStart);
      bus.off('transitionComplete', onTransitionComplete);
    };
  }, [bus]);

  // Reset temp/pressure when level changes
  useEffect(() => {
    const initialTemp = level.number === 2 ? -2 : level.number === 3 ? 110 : 20;
    const initialPressure = level.number === 3 ? 1.6 : 1;
    setCurrentTemp(initialTemp);
    setCurrentPressure(initialPressure);
  }, [level.number]);

  function emitTemp(t) {
    setCurrentTemp(t);
    bus.emit('setTemperature', t);
  }

  function emitPressure(p) {
    setCurrentPressure(p);
    bus.emit('setPressure', p);
  }

  function selectSubstance(id) {
    setActiveSubstanceId(id);
    setCurrentTemp(-10);
    setCurrentPressure(1);
    bus.emit('setSubstance', id);
  }

  const meltingT = substance?.meltingPoint ?? 0;
  const boilingT = substance?.boilingPoint ?? 100;
  const effectiveBoil = boilingT + (currentPressure - 1) * boilingT * 0.06;

  const tempStr = `${currentTemp > 0 ? '+' : ''}${Math.round(currentTemp)}°C`;
  const tempK = (currentTemp + 273.15).toFixed(0);

  // Determine which preset is active (L1 only)
  const presetKey = currentTemp <= meltingT - 5 ? 'cold' : currentTemp >= boilingT + 5 ? 'hot' : 'room';

  const pressureLocked = level.number < 3;

  return (
    <div className="sq-sandbox-bottom">
      {/* Substance */}
      <div className="sq-ctrl">
        <span className="sq-ctrl__label">Substance</span>
        {level.features.substanceSelector ? (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {level.availableSubstances.map(id => (
              <button
                key={id}
                disabled={isTransitioning}
                onClick={() => selectSubstance(id)}
                className="sq-substance-chip"
                style={{
                  background: activeSubstanceId === id ? 'var(--sq-teal)' : undefined,
                  color: activeSubstanceId === id ? 'white' : undefined,
                  borderColor: activeSubstanceId === id ? 'var(--sq-teal-deep)' : undefined,
                  cursor: isTransitioning ? 'not-allowed' : 'pointer',
                  opacity: isTransitioning ? 0.5 : 1,
                  transition: 'all 0.15s',
                }}
              >
                {substances[id]?.name ?? id}
              </button>
            ))}
          </div>
        ) : (
          <div className="sq-substance-chip" style={{ alignSelf: 'flex-start' }}>
            {substance?.name ?? '—'}
            <span style={{ color: 'var(--sq-ink-4)', fontSize: 11, fontWeight: 500, marginLeft: 4 }}>locked</span>
          </div>
        )}
      </div>

      {/* Temperature */}
      <div className="sq-ctrl">
        <div className="sq-ctrl__head">
          <span className="sq-ctrl__label">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} aria-hidden="true">
              <path d="M10 14V5a2 2 0 1 1 4 0v9"/><circle cx="12" cy="17" r="3"/>
            </svg>
            Temperature
          </span>
          <span className="sq-ctrl__value">
            {tempStr}
            <span className="unit">/ {tempK} K</span>
          </span>
        </div>

        {level.features.presets ? (
          <div className="sq-preset-row">
            <button
              className={`sq-preset-btn${presetKey === 'cold' ? ' on--cold' : ''}`}
              disabled={isTransitioning}
              onClick={() => emitTemp(Math.round(meltingT - 20))}
            >
              <span>❄</span>
              <span>Cold</span>
              <span className="tmp">{Math.round(meltingT - 20)}°C</span>
            </button>
            <button
              className={`sq-preset-btn${presetKey === 'room' ? ' on--room' : ''}`}
              disabled={isTransitioning}
              onClick={() => emitTemp(20)}
            >
              <span>◐</span>
              <span>Room</span>
              <span className="tmp">+20°C</span>
            </button>
            <button
              className={`sq-preset-btn${presetKey === 'hot' ? ' on--hot' : ''}`}
              disabled={isTransitioning}
              onClick={() => emitTemp(Math.round(boilingT + 25))}
            >
              <span>🔥</span>
              <span>Hot</span>
              <span className="tmp">{Math.round(boilingT + 25)}°C</span>
            </button>
          </div>
        ) : (
          <>
            <SandboxSlider
              ariaLabel="Temperature"
              value={currentTemp}
              min={min}
              max={max}
              step={1}
              ticks={[
                { value: meltingT, label: `melt ${meltingT}°`, color: 'var(--sq-solid-1)' },
                ...(Math.abs(effectiveBoil - meltingT) > 5 ? [{ value: effectiveBoil, label: `boil ${Math.round(effectiveBoil)}°`, color: 'var(--sq-gas-1)' }] : []),
              ]}
              onChange={emitTemp}
            />
            <div className="sq-ctrl__hint">
              <span className="sq-kbd">←</span> <span className="sq-kbd">→</span> nudge 1°C · <span className="sq-kbd">PgUp</span>/<span className="sq-kbd">PgDn</span> bigger jumps
            </div>
          </>
        )}
      </div>

      {/* Pressure */}
      <div className="sq-ctrl">
        <div className="sq-ctrl__head">
          <span className="sq-ctrl__label">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} aria-hidden="true">
              <path d="M3 13a9 9 0 1 1 18 0"/><path d="M12 13l4-3"/>
            </svg>
            Pressure
          </span>
          <span className="sq-ctrl__value" style={pressureLocked ? { color: 'var(--sq-ink-4)' } : undefined}>
            {pressureLocked ? '— atm' : `${currentPressure.toFixed(2)} atm`}
          </span>
        </div>
        <SandboxSlider
          ariaLabel="Pressure"
          value={currentPressure}
          min={0.2}
          max={5}
          step={0.05}
          ticks={[
            { value: 1, label: '1 atm' },
            { value: 3, label: '3 atm' },
          ]}
          onChange={emitPressure}
          locked={pressureLocked}
        />
        {pressureLocked ? (
          <div className="sq-ctrl__hint">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle' }} aria-hidden="true">
              <rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>
            </svg>
            {' '}Unlocks at Level 3
          </div>
        ) : (
          <div className="sq-ctrl__hint">Pressure shifts the boiling point. Watch the curve respond.</div>
        )}
      </div>
    </div>
  );
}
