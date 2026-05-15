import { useState, useEffect, useCallback } from 'react';
import {
  getProgress,
  recordCompletion as dbRecordCompletion,
  saveArtifact as dbSaveArtifact,
} from '../../../lib/games/progress';

export function useGameProgress(supabase, gameId, studentId) {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!studentId) return;
    setLoading(true);
    try {
      const rows = await getProgress(supabase, { studentId, gameId });
      setProgress(rows);
    } finally {
      setLoading(false);
    }
  }, [supabase, gameId, studentId]);

  useEffect(() => { load(); }, [load]);

  const getChallengeProgress = useCallback(
    (challengeId) => progress.find((r) => r.challenge_id === challengeId) ?? null,
    [progress],
  );

  const recordCompletion = useCallback(async (payload) => {
    await dbRecordCompletion(supabase, { studentId, gameId, ...payload });
    await load();
  }, [supabase, gameId, studentId, load]);

  const saveArtifact = useCallback(async (payload) => {
    await dbSaveArtifact(supabase, { studentId, gameId, ...payload });
  }, [supabase, gameId, studentId]);

  return { progress, loading, getChallengeProgress, recordCompletion, saveArtifact };
}
