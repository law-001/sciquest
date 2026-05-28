import { useEffect, useState } from 'react';

// Mobile/landscape-aware breakpoint hook used by the minigame overlay and
// the individual minigame components. Returns 'xs' | 'sm' | 'md' so each
// minigame can pick proportional sizes (chromosome sprites, drag fields,
// fill arcs, …) instead of relying on fixed pixels that overflow on a
// short iPhone-class landscape viewport.
function readBp() {
  if (typeof window === 'undefined') return 'md';
  const w = window.innerWidth;
  const h = window.innerHeight;
  if (w < 560 || h < 380) return 'xs';
  if (w < 768 || h < 460) return 'sm';
  return 'md';
}

export function useViewportBp() {
  const [bp, setBp] = useState(readBp);
  useEffect(() => {
    const sync = () => setBp(readBp());
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, []);
  return bp;
}
