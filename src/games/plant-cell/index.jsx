import { useMemo, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { GAME_XP } from '../config/xp';
import { useGameProgress } from '../_shared/progress/useGameProgress';
import { getLevel } from './data/levels';
import { pickFault } from './data/faults';
import { CellEmergency } from './levels/CellEmergency';
import { KeepItAlive } from './levels/KeepItAlive';
import { PowerTheCell } from './levels/PowerTheCell';
import { EducationalModal } from './ui/EducationalModal';
import { LevelSelect } from './ui/LevelSelect';
import { ResultsScreen } from './ui/ResultsScreen';
import './styles.css';

const GAME_ID = 'plant-cell';

// How many particles each stream may draw at once on this device.
const PARTICLE_BUDGET = { low: 1, mid: 2, high: 3 };

export default function PlantCellGame({
  user,
  profile,
  onExit,
  onProgressUpdate,
  initialChallengeId = null,
  reducedMotion = false,
  deviceTier = 'mid',
}) {
  const studentId = profile?.id ?? user?.id ?? null;
  const { progress, recordCompletion } = useGameProgress(supabase, GAME_ID, studentId);

  const [level, setLevel] = useState(() => getLevel(initialChallengeId));
  const [stage, setStage] = useState(() => (getLevel(initialChallengeId) ? 'brief' : 'select'));
  const [result, setResult] = useState(null);
  // Bumped on every run so the level screen remounts with fresh state — and so
  // Level 3 hands out a different case each time.
  const [attempt, setAttempt] = useState(0);

  const particleBudget = PARTICLE_BUDGET[deviceTier] ?? 2;
  const fault = useMemo(() => pickFault(attempt), [attempt]);

  const progressByLevel = useMemo(() => {
    const map = {};
    for (const row of progress) {
      map[row.challenge_id] = { completed: row.completed, stars: row.best_score ?? 0 };
    }
    return map;
  }, [progress]);

  function openLevel(chosen) {
    setLevel(chosen);
    setResult(null);
    setStage('brief');
  }

  function startLevel() {
    setAttempt((n) => n + 1);
    setResult(null);
    setStage('play');
  }

  function backToLevels() {
    setLevel(null);
    setResult(null);
    setStage('select');
  }

  function handleFinish(runResult) {
    const xpEarned = GAME_XP[GAME_ID]?.starsXp?.[runResult.stars] ?? 0;
    setResult({ ...runResult, xpEarned });
    setStage('results');

    if (runResult.stars <= 0) return;
    const notifyCompletion = () => onProgressUpdate?.({
      gameId: GAME_ID,
      challengeId: level.id,
      levelId: level.id,
      completed: true,
      stars: runResult.stars,
      xpEarned,
      progressSaved: Boolean(studentId),
    });

    if (studentId) {
      recordCompletion({
        challengeId: level.id,
        score: runResult.stars,
        scoreUnit: 'stars',
        metadata: { xpEarned, focus: level.focus },
      }).then(notifyCompletion).catch((err) => console.error('Failed to save plant cell run:', err));
    } else {
      notifyCompletion();
    }
  }

  let body;
  if (!level || stage === 'select') {
    body = <LevelSelect progressByLevel={progressByLevel} onSelect={openLevel} onExit={onExit} />;
  } else if (stage === 'brief') {
    body = <EducationalModal level={level} onStart={startLevel} onExit={backToLevels} />;
  } else if (stage === 'results') {
    body = (
      <ResultsScreen
        level={level}
        result={result}
        onReplay={startLevel}
        onExit={backToLevels}
      />
    );
  } else if (level.id === 'l1') {
    body = (
      <PowerTheCell
        key={attempt}
        level={level}
        reducedMotion={reducedMotion}
        particleBudget={particleBudget}
        onExit={backToLevels}
        onFinish={handleFinish}
      />
    );
  } else if (level.id === 'l2') {
    body = (
      <KeepItAlive
        key={attempt}
        level={level}
        reducedMotion={reducedMotion}
        particleBudget={particleBudget}
        onExit={backToLevels}
        onFinish={handleFinish}
      />
    );
  } else {
    body = (
      <CellEmergency
        key={attempt}
        level={level}
        fault={fault}
        reducedMotion={reducedMotion}
        particleBudget={particleBudget}
        onExit={backToLevels}
        onFinish={handleFinish}
      />
    );
  }

  return <div className="pc-root">{body}</div>;
}
