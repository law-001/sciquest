import { useMemo, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { GAME_XP } from '../config/xp';
import { useGameProgress } from '../_shared/progress/useGameProgress';
import { starsForFidelity } from './data/defects';
import { LevelSelect } from './ui/LevelSelect';
import { ResultsScreen } from './ui/ResultsScreen';
import { RunScreen } from './ui/RunScreen';
import './styles.css';

const GAME_ID = 'cell-division-lab';

export default function CellDivisionLab({
  user,
  profile,
  onExit,
  onProgressUpdate,
  reducedMotion = false,
}) {
  const studentId = profile?.id ?? user?.id ?? null;
  const { progress, recordCompletion } = useGameProgress(supabase, GAME_ID, studentId);

  const [level, setLevel] = useState(null);
  const [summary, setSummary] = useState(null);
  // Bumped on replay so RunScreen remounts with a fresh run.
  const [attempt, setAttempt] = useState(0);

  const progressByLevel = useMemo(() => {
    const map = {};
    for (const row of progress) {
      map[row.challenge_id] = { completed: row.completed, stars: row.best_score ?? 0 };
    }
    return map;
  }, [progress]);

  function startLevel(chosen) {
    setLevel(chosen);
    setSummary(null);
    setAttempt((n) => n + 1);
  }

  function leaveRun() {
    setLevel(null);
    setSummary(null);
  }

  function handleFinish(finalRun) {
    const stars = starsForFidelity(finalRun.fidelity);
    const xpEarned = GAME_XP[GAME_ID]?.starsXp?.[stars] ?? 0;

    setSummary({ stars, fidelity: finalRun.fidelity, defects: finalRun.defects, xpEarned });

    if (studentId) {
      recordCompletion({
        challengeId: level.id,
        score: stars,
        scoreUnit: 'stars',
        metadata: { xpEarned, fidelity: finalRun.fidelity, defects: finalRun.defects.map((d) => d.id) },
      }).catch(() => { /* the run still ends; the hub just won't show it yet */ });
    }

    onProgressUpdate?.({
      gameId: GAME_ID,
      challengeId: level.id,
      levelId: level.id,
      completed: stars > 0,
      stars,
      xpEarned,
      reason: stars > 0 ? undefined : 'divisionFailed',
    });
  }

  let body;
  if (!level) {
    body = <LevelSelect progressByLevel={progressByLevel} onSelect={startLevel} onExit={onExit} />;
  } else if (summary) {
    body = (
      <ResultsScreen
        level={level}
        stars={summary.stars}
        fidelity={summary.fidelity}
        defects={summary.defects}
        xpEarned={summary.xpEarned}
        onReplay={() => startLevel(level)}
        onExit={leaveRun}
      />
    );
  } else {
    body = (
      <RunScreen
        key={`${level.id}-${attempt}`}
        level={level}
        reducedMotion={reducedMotion}
        onExit={leaveRun}
        onFinish={handleFinish}
      />
    );
  }

  return <div className="cdl-root">{body}</div>;
}
