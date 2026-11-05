import { useState } from 'react';

import { useQuests } from '../plant-cell/engine/useQuests';
import { useSimLoop } from '../plant-cell/engine/useSimLoop';
import { Meter, StatusLine } from '../plant-cell/ui/CellStats';
import { LabFrame } from '../plant-cell/ui/LabFrame';
import { Subtitles } from '../plant-cell/ui/Subtitles';
import { storyLinesAt } from '../plant-cell/ui/story';
import { toneForValue } from '../plant-cell/ui/tone';
import { AnimalCellView } from './AnimalCellView';
import { ORGANELLES } from './levels';

function createRound(quest, sim) {
  return { questId: quest.id, phase: 'spot', picked: [], wrongGuesses: 0, fixed: 0, health: sim.sickHealth };
}

function isSameSet(a, b) {
  return a.length === b.length && a.every((id) => b.includes(id));
}

// Level 3 — each quest is one sick cell, played like plant-cell's PlantDoctor.
// Each organelle runs one job meter; the broken one's meter is near zero. The
// player picks the organelle(s) that do the stopped job; a right pick fixes
// the cell, a wrong one costs a star and shows a hint.
export function CellDoctor({
  level,
  progressByLevel,
  reducedMotion,
  particleBudget,
  onExit,
  onRestart,
  onQuestComplete,
  onLevelComplete,
}) {
  const [paused, setPaused] = useState(false);
  const [missedIds, setMissedIds] = useState([]);
  const quests = useQuests({ level, progressByLevel, onQuestComplete, onLevelComplete });
  const [round, setRound] = useState(() => createRound(quests.activeQuest ?? level.quests[0], level.sim));

  if (quests.activeQuest && quests.activeQuest.id !== round.questId) {
    setRound(createRound(quests.activeQuest, level.sim));
  }

  const { sim } = level;
  const quest = level.quests.find((q) => q.id === round.questId);
  // A fixed job climbs back up over the fix, in step with the story.
  const recovered = Math.min(1, round.fixed / (sim.fixSeconds * 0.5));
  const jobLevel = (id) => {
    if (!quest.broken.includes(id) || round.phase === 'done') return sim.healthyJob;
    if (round.phase === 'spot') return sim.brokenJob;
    return sim.brokenJob + (sim.healthyJob - sim.brokenJob) * recovered;
  };

  useSimLoop(!paused && !quests.celebration, (dt) => {
    setRound((prev) => {
      if (prev.phase !== 'fixing') return prev;
      const fixed = prev.fixed + dt;
      return {
        ...prev,
        fixed,
        health: Math.min(100, prev.health + sim.recoverPerSec * dt),
        phase: fixed >= sim.fixSeconds ? 'done' : 'fixing',
      };
    });
    quests.tick(
      dt,
      (q) => q.id === round.questId && round.phase === 'done',
      () => sim.starsByMisses[Math.min(missedIds.length, sim.starsByMisses.length - 1)],
    );
  });

  function handleTogglePick(id) {
    const picked = round.picked.includes(id) ? round.picked.filter((p) => p !== id) : [...round.picked, id];
    setRound({ ...round, picked });
  }

  function handleFix() {
    if (isSameSet(round.picked, quest.broken)) {
      setRound({ ...round, phase: 'fixing' });
      return;
    }
    setRound({ ...round, picked: [], wrongGuesses: round.wrongGuesses + 1 });
    if (!missedIds.includes(quest.id)) setMissedIds([...missedIds, quest.id]);
  }

  const brokenNames = ORGANELLES.filter(({ id }) => quest.broken.includes(id)).map(({ name }) => name).join(' and ');

  let status;
  if (round.phase === 'spot') {
    status = round.wrongGuesses > 0 ? { tone: 'warn', text: `Not quite. ${quest.hint}` } : { tone: 'info', text: quest.question };
  } else if (round.phase === 'fixing') {
    status = { tone: 'good', text: `Right — the ${brokenNames} broke. Watch the cell recover…` };
  } else {
    status = { tone: 'good', text: quest.educationalNote };
  }

  let lines;
  if (round.phase === 'spot') {
    lines = [{ key: 'question', text: quest.question }];
    if (round.wrongGuesses > 0) {
      lines.push({ key: `hint-${round.wrongGuesses}`, tag: '✕ Not quite', tone: 'is-wrong', text: quest.hint });
    }
  } else {
    const story = [
      { key: 'verdict', tag: '✓ Right', tone: 'is-right', text: `The ${brokenNames} broke.` },
      ...quest.story.map((text) => ({ key: text, text })),
    ];
    lines = round.phase === 'done' ? story : storyLinesAt(story, round.fixed);
  }

  const hud = (
    <>
      <StatusLine tone={status.tone}>{status.text}</StatusLine>
      <div className="sq-stats pc-lab-meters" aria-label="Cell job meters">
        <Meter label="Cell health" icon="❤️" value={round.health} readout={`${Math.round(round.health)}%`} tone={toneForValue(round.health, { low: 35, high: 70 })} />
        {/* Meters name the job, never the organelle — matching the two is the puzzle. */}
        {ORGANELLES.map(({ id, job }) => {
          const value = jobLevel(id);
          const tone = toneForValue(value, { low: 30, high: 70 });
          return (
            <Meter key={id} label={job} value={value} readout={tone === 'bad' ? 'Stopped' : `${Math.round(value)}%`} tone={tone} />
          );
        })}
      </div>
    </>
  );

  let actions = null;
  if (round.phase === 'spot') {
    actions = (
      <div className="pc-subs__choices" role="group" aria-label="Which organelle broke?">
        {ORGANELLES.map(({ id, name, icon }) => {
          const isPicked = round.picked.includes(id);
          return (
            <button
              key={id}
              type="button"
              className={`pc-suspect pc-subs__choice${isPicked ? ' is-selected' : ''}`}
              aria-pressed={isPicked}
              onClick={() => handleTogglePick(id)}
            >
              <span aria-hidden="true">{icon}</span> {name}
            </button>
          );
        })}
        <button type="button" className="pc-btn pc-btn--primary pc-subs__fix" disabled={round.picked.length === 0} onClick={handleFix}>
          {round.picked.length === 0 ? 'Pick what broke' : 'Fix it'}
        </button>
      </div>
    );
  } else if (round.phase === 'done') {
    actions = (
      <button type="button" className="pc-btn pc-btn--primary pc-subs__btn" onClick={() => setRound(createRound(quest, sim))}>
        See this cell again
      </button>
    );
  }

  return (
    <LabFrame
      level={level}
      quests={quests}
      reducedMotion={reducedMotion}
      paused={paused}
      onTogglePause={() => setPaused((p) => !p)}
      onRestart={onRestart}
      onExit={onExit}
      hud={hud}
      readout={(
        <>
          <span>cell <b>{level.quests.indexOf(quest) + 1} of {level.quests.length}</b></span>
          <span>wrong guesses <b>{missedIds.length}</b></span>
          {round.phase === 'fixing' && (
            <span>recovering <b>{Math.max(1, Math.ceil(sim.fixSeconds - round.fixed))}s</b></span>
          )}
        </>
      )}
      cell={(
        <AnimalCellView
          health={round.health}
          highlighted={round.phase === 'spot' ? round.picked : []}
          reducedMotion={reducedMotion}
          particleBudget={particleBudget}
          title="A sick animal cell"
        />
      )}
      stageOverlay={quests.celebration ? null : <Subtitles lines={lines}>{actions}</Subtitles>}
    />
  );
}
