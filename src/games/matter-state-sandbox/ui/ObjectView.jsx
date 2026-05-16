import { useEffect, useRef } from 'react';
import { ObjectRenderer } from '../objects/ObjectRenderer';
import { useTheme } from '../../../context/ThemeContext';

export function ObjectView({ bus, substanceId, initialTemp, initialPressure }) {
  const canvasRef = useRef(null);
  const wrapRef   = useRef(null);
  const rendRef   = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    let canceled = false;
    const rend = new ObjectRenderer(canvasRef.current, {
      onStateChange: () => {},
    });
    rendRef.current = rend;

    rend.init();
    if (!canceled) {
      if (substanceId)          rend.setSubstance(substanceId);
      if (initialTemp   != null) rend.setTemperature(initialTemp);
      if (initialPressure != null) rend.setPressure(initialPressure);
    }

    const ro = new ResizeObserver(() => rendRef.current?.resize());
    if (wrapRef.current) ro.observe(wrapRef.current);

    return () => {
      canceled = true;
      ro.disconnect();
      rend.destroy();
      rendRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- mount-only init

  useEffect(() => {
    if (!bus) return;
    const onTemp      = (v)  => rendRef.current?.setTemperature(v);
    const onPressure  = (v)  => rendRef.current?.setPressure(v);
    const onSubstance = (id) => rendRef.current?.setSubstance(id);
    const onReset     = ()   => rendRef.current?.reset();
    const onPause     = ()   => rendRef.current?.setRunning(false);
    const onResume    = ()   => rendRef.current?.setRunning(true);

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
        backgroundColor: isDark ? '#1c1812' : '#fffaf0',
        backgroundImage: [
          `linear-gradient(${isDark ? 'rgba(255,245,220,0.05)' : 'rgba(43,36,23,0.05)'} 1px, transparent 1px)`,
          `linear-gradient(90deg, ${isDark ? 'rgba(255,245,220,0.05)' : 'rgba(43,36,23,0.05)'} 1px, transparent 1px)`,
        ].join(', '),
        backgroundSize: '24px 24px',
        borderRadius: 'inherit',
        overflow: 'hidden',
      }}
      aria-label="Object view"
    >
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  );
}
