export async function getProgress(supabase, { studentId, gameId }) {
  const { data, error } = await supabase
    .from('game_progress')
    .select('*')
    .eq('student_id', studentId)
    .eq('game_id', gameId);
  if (error) throw error;
  return data;
}

export async function recordCompletion(supabase, { studentId, gameId, challengeId, score, scoreUnit, metadata = {} }) {
  const { data: existing } = await supabase
    .from('game_progress')
    .select('attempts, best_score')
    .eq('student_id', studentId)
    .eq('game_id', gameId)
    .eq('challenge_id', challengeId)
    .maybeSingle();

  const attempts = (existing?.attempts ?? 0) + 1;
  const bestScore = existing?.best_score == null || score > existing.best_score
    ? score
    : existing.best_score;

  const { error } = await supabase
    .from('game_progress')
    .upsert({
      student_id: studentId,
      game_id: gameId,
      challenge_id: challengeId,
      completed: true,
      completed_at: new Date().toISOString(),
      best_score: bestScore,
      score_unit: scoreUnit,
      attempts,
      metadata,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'student_id,game_id,challenge_id' });

  if (error) throw error;
}

export async function saveArtifact(supabase, { studentId, gameId, saveType, payload }) {
  const { error } = await supabase
    .from('game_saves')
    .insert({ student_id: studentId, game_id: gameId, save_type: saveType, payload });
  if (error) throw error;
}

export async function startSession(supabase, { studentId, gameId }) {
  const { data, error } = await supabase
    .from('game_sessions')
    .insert({ student_id: studentId, game_id: gameId })
    .select('id')
    .single();
  if (error) throw error;
  return data.id;
}

export async function endSession(supabase, { sessionId, startedAt }) {
  const endedAt = new Date();
  const duration = Math.round((endedAt - new Date(startedAt)) / 1000);
  const { error } = await supabase
    .from('game_sessions')
    .update({ ended_at: endedAt.toISOString(), duration_seconds: duration })
    .eq('id', sessionId);
  if (error) throw error;
}
