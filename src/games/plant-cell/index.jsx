import { useMemo, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { GAME_XP } from '../config/xp';
import { useGameProgress } from '../_shared/progress/useGameProgress';
import { getLevel } from './data/levels';
import { CellEmergency } from './levels/CellEmergency';
import { PowerTheCell } from './levels/PowerTheCell';
import { PredictThenTest } from './levels/PredictThenTest';
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

  // Saves a finished level and returns the XP its stars are worth.
  function saveLevel(stars) {
    const xpEarned = GAME_XP[GAME_ID]?.starsXp?.[stars] ?? 0;
    if (stars <= 0) return xpEarned;
    const notifyCompletion = () => onProgressUpdate?.({
      gameId: GAME_ID,
      challengeId: level.id,
      levelId: level.id,
      completed: true,
      stars,
      xpEarned,
      progressSaved: Boolean(studentId),
    });

    if (studentId) {
      recordCompletion({
        challengeId: level.id,
        score: stars,
        scoreUnit: 'stars',
        metadata: { xpEarned, focus: level.focus },
      }).then(notifyCompletion).catch((err) => console.error('Failed to save plant cell run:', err));
    } else {
      notifyCompletion();
    }
    return xpEarned;
  }

  // Only a dead cell ends a run now, so this always shows the failure debrief.
  function handleFinish(runResult) {
    const xpEarned = saveLevel(runResult.stars);
    setResult({ ...runResult, xpEarned });
    setStage('results');
  }

  // Quest rows only drive the check marks; unlocks and achievements read the
  // level row that saveLevel writes.
  function handleQuestComplete(questId) {
    if (!studentId) return;
    recordCompletion({ challengeId: questId, score: 1, scoreUnit: 'completion' })
      .catch((err) => console.error('Failed to save plant cell quest:', err));
  }

  const levelProps = {
    level,
    progressByLevel,
    reducedMotion,
    particleBudget,
    onExit: backToLevels,
    onRestart: startLevel,
    onQuestComplete: handleQuestComplete,
    onLevelComplete: saveLevel,
  };

  let body;
  if (!level || stage === 'select') {
    body = <LevelSelect progressByLevel={progressByLevel} onSelect={openLevel} onExit={onExit} />;
  } else if (stage === 'brief') {
    body = (
      <>
        <LevelSelect progressByLevel={progressByLevel} onSelect={openLevel} onExit={onExit} />
        <EducationalModal level={level} onStart={startLevel} onExit={backToLevels} />
      </>
    );
  } else if (level.id === 'l1') {
    body = <PowerTheCell key={attempt} {...levelProps} onFinish={handleFinish} />;
  } else if (level.id === 'l2') {
    body = <PredictThenTest key={attempt} {...levelProps} />;
  } else {
    body = <CellEmergency key={attempt} {...levelProps} attempt={attempt} />;
  }

  // The level component stays mounted behind the debrief — its sim loop already
  // stops once the cell dies, so the last frame holds under the modal.
  return (
    <div className="pc-root">
      {body}
      {stage === 'results' && result && (
        <ResultsScreen
          level={level}
          result={result}
          onReplay={startLevel}
          onExit={backToLevels}
        />
      )}
    </div>
  );
}
