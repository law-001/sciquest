import { useEffect, useRef } from 'react';
import { ParticleSim } from '../ParticleSim';

export function ParticleView({ bus, substanceId, initialTemp, initialPressure }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const simRef = useRef(null);

  useEffect(() => {
    let canceled = false;
    const sim = new ParticleSim(canvasRef.current, {
      onStateChange: () => {},
      onStats: () => {},
    });
    simRef.current = sim;

    sim.init().then(() => {
      if (canceled) return;
      if (substanceId) sim.setSubstance(substanceId);
      if (initialTemp  != null) sim.setTemperature(initialTemp);
      if (initialPressure != null) sim.setPressure(initialPressure);
    });

    const ro = new ResizeObserver(() => simRef.current?.resize());
    if (wrapRef.current) ro.observe(wrapRef.current);

    return () => {
      canceled = true;
      ro.disconnect();
      sim.destroy();
      simRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- mount-only init

  useEffect(() => {
    if (!bus) return;
    const onTemp      = (v)  => simRef.current?.setTemperature(v);
    const onPressure  = (v)  => simRef.current?.setPressure(v);
    const onSubstance = (id) => simRef.current?.setSubstance(id);
    const onReset     = ()   => simRef.current?.reset();
    const onPause     = ()   => simRef.current?.setRunning(false);
    const onResume    = ()   => simRef.current?.setRunning(true);

    bus.on('setTemperature', onTemp);
    bus.on('setPressure',    onPressure);
    bus.on('setSubstance',   onSubstance);
    bus.on('reset',          onReset);
    bus.on('pauseGame',      onPause);
    bus.on('resumeGame',     onResume);

    return () => {
      bus.off('setTemperature', onTemp);
      bus.off('setPressure',    onPressure);
      bus.off('setSubstance',   onSubstance);
      bus.off('reset',          onReset);
      bus.off('pauseGame',      onPause);
      bus.off('resumeGame',     onResume);
    };
  }, [bus]);

  return (
    <div
      ref={wrapRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 3,
        background: 'var(--sq-stage-bg, #fffaf0)',
        borderRadius: 'inherit',
        overflow: 'hidden',
      }}
      aria-label="Particle view"
    >
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  );
}
