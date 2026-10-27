import { useState } from 'react';

import { useQuests } from '../engine/useQuests';
import { useSimLoop } from '../engine/useSimLoop';
import { CellView } from '../ui/CellView';
import { Meter, StatusLine } from '../ui/CellStats';
import { LabFrame } from '../ui/LabFrame';
import { PhotosynthesisEquation } from '../ui/PhotosynthesisEquation';
import { PlantView } from '../ui/PlantView';
import { Subtitles } from '../ui/Subtitles';
import { storyLinesAt } from '../ui/story';
import { toneForValue } from '../ui/tone';

const INPUTS = [
  { key: 'light', label: 'Sunlight', word: 'sunlight', icon: '☀️' },
  { key: 'water', label: 'Water', word: 'water', icon: '💧' },
  { key: 'co2', label: 'Carbon dioxide', word: 'carbon dioxide', icon: '🌬️' },
];

function createRound(quest, sim) {
  return { questId: quest.id, phase: 'spot', picked: [], wrongGuesses: 0, fixed: 0, health: sim.sickHealth };
}

function isSameSet(a, b) {
  return a.length === b.length && a.every((key) => b.includes(key));
}

// Level 3 — each quest is one sick plant. The room shows a clue (closed
// curtains, dry soil, a bag over the plant, night outside); the player picks
// what the plant is missing. A right answer fixes the room and the plant
// recovers while the story explains why; a wrong one costs a star and gives
// a hint.
export function PlantDoctor({
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
  const [view, setView] = useState('plant');
  // Rounds with at least one wrong guess — these cost stars.
  const [missedIds, setMissedIds] = useState([]);
  const quests = useQuests({ level, progressByLevel, onQuestComplete, onLevelComplete });
  const [round, setRound] = useState(() => createRound(quests.activeQuest ?? level.quests[0], level.sim));

  // The sidebar picks the round, so a new active quest starts its round fresh.
  // With no active quest (after Keep exploring) the last round stays on screen.
  if (quests.activeQuest && quests.activeQuest.id !== round.questId) {
    setRound(createRound(quests.activeQuest, level.sim));
  }

  const { sim } = level;
  const quest = level.quests.find((q) => q.id === round.questId);
  const isSick = round.phase === 'spot';
  const controls = isSick
    ? { ...sim.baseControls, ...Object.fromEntries(quest.missing.map((key) => [key, 0])) }
    : sim.baseControls;
  const rate = Math.min(controls.light, controls.water, controls.co2) / 100;
  const scene = isSick ? quest.scene : {};

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

  function handleTogglePick(key) {
    const picked = round.picked.includes(key)
      ? round.picked.filter((k) => k !== key)
      : [...round.picked, key];
    setRound({ ...round, picked });
  }

  function handleFix() {
    if (isSameSet(round.picked, quest.missing)) {
      setRound({ ...round, phase: 'fixing' });
      return;
    }
    setRound({ ...round, picked: [], wrongGuesses: round.wrongGuesses + 1 });
    if (!missedIds.includes(quest.id)) setMissedIds([...missedIds, quest.id]);
  }

  const missingWords = INPUTS.filter(({ key }) => quest.missing.includes(key)).map(({ word }) => word).join(' and ');

  let status;
  if (round.phase === 'spot') {
    status = round.wrongGuesses > 0
      ? { tone: 'warn', text: `Not quite. ${quest.hint}` }
      : { tone: 'info', text: quest.question };
  } else if (round.phase === 'fixing') {
    status = { tone: 'good', text: `Right — it was missing ${missingWords}. Watch it recover…` };
  } else {
    status = { tone: 'good', text: quest.educationalNote };
  }

  // The verdict rises in first, then the story of the fix, as subtitles.
  let lines;
  if (round.phase === 'spot') {
    lines = [{ key: 'question', text: quest.question }];
    if (round.wrongGuesses > 0) {
      lines.push({ key: `hint-${round.wrongGuesses}`, tag: '✕ Not quite', tone: 'is-wrong', text: quest.hint });
    }
  } else {
    const story = [
      { key: 'verdict', tag: '✓ Right', tone: 'is-right', text: `It was missing ${missingWords}.` },
      ...quest.story.map((text) => ({ key: text, text })),
    ];
    lines = round.phase === 'done' ? story : storyLinesAt(story, round.fixed);
  }

  const ratePct = Math.round(rate * 100);
  const healthPct = Math.round(round.health);

  const hud = (
    <>
      <StatusLine tone={status.tone}>{status.text}</StatusLine>

      <div className="sq-stats pc-lab-meters" aria-label="Plant readings">
        <Meter
          label="Glucose being made"
          icon="🌿"
          value={ratePct}
          readout={`${ratePct}%`}
          tone={toneForValue(ratePct, { low: 15, high: 60 })}
        />
        <Meter
          label="Plant health"
          icon="🪴"
          value={round.health}
          readout={`${healthPct}%`}
          tone={toneForValue(round.health, { low: 35, high: 70 })}
        />
      </div>
    </>
  );

  // No bottom bar: the answer pills sit on the stage under the subtitles,
  // unblurred, so the clue in the room stays in view while the player picks.
  let actions = null;
  if (round.phase === 'spot') {
    actions = (
      <div className="pc-subs__choices" role="group" aria-label="What is the plant missing?">
        {INPUTS.map(({ key, label, icon }) => {
          const isPicked = round.picked.includes(key);
          return (
            <button
              key={key}
              type="button"
              className={`pc-suspect pc-subs__choice${isPicked ? ' is-selected' : ''}`}
              aria-pressed={isPicked}
              onClick={() => handleTogglePick(key)}
            >
              <span aria-hidden="true">{icon}</span> {label}
            </button>
          );
        })}
        <button
          type="button"
          className="pc-btn pc-btn--primary pc-subs__fix"
          disabled={round.picked.length === 0}
          onClick={handleFix}
        >
          {round.picked.length === 0 ? 'Pick what’s missing' : 'Fix it'}
        </button>
      </div>
    );
  } else if (round.phase === 'done') {
    actions = (
      <button
        type="button"
        className="pc-btn pc-btn--primary pc-subs__btn"
        onClick={() => setRound(createRound(quest, sim))}
      >
        See this plant again
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
      view={view}
      onViewChange={setView}
      hud={hud}
      readout={(
        <>
          <span>plant <b>{level.quests.indexOf(quest) + 1} of {level.quests.length}</b></span>
          <span>glucose made <b>{ratePct}%</b></span>
          <span>wrong guesses <b>{missedIds.length}</b></span>
          {round.phase === 'fixing' && (
            <span>recovering <b>{Math.max(1, Math.ceil(sim.fixSeconds - round.fixed))}s</b></span>
          )}
        </>
      )}
      plant={(
        <PlantView
          light={controls.light}
          water={controls.water}
          co2={controls.co2}
          soil={controls.water}
          health={round.health}
          turgor={100}
          rate={rate}
          weather={scene.weather ?? null}
          curtain={Boolean(scene.curtain)}
          night={Boolean(scene.night)}
          bag={Boolean(scene.bag)}
          reducedMotion={reducedMotion}
          particleBudget={particleBudget}
          title="A sick plant by the window"
        />
      )}
      cell={(
        <CellView
          vacuoleFill={45}
          photosynthesis={{ ...controls, rate }}
          reducedMotion={reducedMotion}
          particleBudget={particleBudget}
          title="Plant cell running photosynthesis"
        />
      )}
      caption={<PhotosynthesisEquation {...controls} isStopped={rate === 0} />}
      stageOverlay={quests.celebration ? null : <Subtitles lines={lines}>{actions}</Subtitles>}
    />
  );
}
