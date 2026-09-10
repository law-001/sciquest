import { useEffect, useRef } from 'react';

// One animation-frame loop per level screen. `onTick` receives the seconds
// since the previous frame, clamped so a backgrounded tab cannot resume with a
// single enormous step that kills the cell instantly.
export function useSimLoop(active, onTick) {
  const tickRef = useRef(onTick);

  useEffect(() => {
    tickRef.current = onTick;
  });

  useEffect(() => {
    if (!active) return undefined;
    let frame = 0;
    let last = performance.now();
    const step = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      tickRef.current(dt);
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [active]);
}
