import { useEffect, useRef } from 'react';
import { useGameProgress } from '../_shared/progress/useGameProgress';
import { supabase } from '../../lib/supabase';

const GAME_ID = 'quake-ready';
const GAME_URL = `${import.meta.env.BASE_URL}games/quake-ready/index.html`;

// The game ships as a self-contained HTML/canvas prototype served from /public.
// It runs inside an iframe so its global CSS stays fully isolated from the
// SciQuest app. The two sides talk only via postMessage.
export default function QuakeReady({ user, profile, onExit, onProgressUpdate }) {
  const iframeRef = useRef(null);
  const studentId = profile?.id ?? user?.id ?? null;
  const { recordCompletion } = useGameProgress(supabase, GAME_ID, studentId);

  const recordRef = useRef(recordCompletion);
  useEffect(() => { recordRef.current = recordCompletion; }, [recordCompletion]);
  const onExitRef = useRef(onExit);
  useEffect(() => { onExitRef.current = onExit; }, [onExit]);
  const onProgressRef = useRef(onProgressUpdate);
  useEffect(() => { onProgressRef.current = onProgressUpdate; }, [onProgressUpdate]);

  useEffect(() => {
    function handleMessage(event) {
      if (event.source !== iframeRef.current?.contentWindow) return;
      const data = event.data;
      if (!data || typeof data.type !== 'string') return;

      if (data.type === 'qr:exit') {
        onExitRef.current?.();
        return;
      }
      if (data.type === 'qr:cleared') {
        recordRef.current?.({
          challengeId: `l${data.levelId}`,
          score: data.stars ?? 1,
          scoreUnit: 'stars',
        }).catch(() => {});
        if (data.allCleared) onProgressRef.current?.({ challengeId: 'disaster-ready' });
      }
    }
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <iframe
      ref={iframeRef}
      src={GAME_URL}
      title="Quake Ready"
      style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
      allow="autoplay"
    />
  );
}
