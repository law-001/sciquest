import { useState, useEffect } from 'react';

export function useReducedMotion() {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  const [reduced, setReduced] = useState(mq.matches);

  useEffect(() => {
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return reduced;
}
