import { useEffect } from 'react';

export function usePageVisibility(callback) {
  useEffect(() => {
    const handler = () => callback(document.visibilityState === 'hidden');
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, [callback]);
}
