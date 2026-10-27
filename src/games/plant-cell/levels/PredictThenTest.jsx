import { useState } from 'react';

import { createPhotosynthesisState, stepPhotosynthesis } from '../engine/photosynthesis';
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
  { key: 'light', label: 'Sunlight', icon: '☀️' },
  { key: 'water', label: 'Water', icon: '💧' },
  { key: 'co2', label: 'Carbon dioxide', icon: '🌬️' },
];

function createRound(quest, sim) {
  return { questId: quest.id, phase: 'predict', choice: null, watched: 0, cell: createPhotosynthesisState(sim) };
}

// Level 2 — each quest is one "what happens if…?" round. The plant runs
// normally behind the question overlay; "Let's see what happens" makes the
// change and plays it out on the plant for a few seconds, then marks the prediction.
// A right one completes the quest; a wrong one costs a star and lets the
// player try again.
export function PredictThenTest({
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
  // Rounds whose prediction was wrong at least once — these cost stars.
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
  const controls = round.phase === 'predict' ? sim.baseControls : { ...sim.baseControls, ...quest.change };
  const chosen = round.choice === null ? null : quest.choices[round.choice];
  const isRight = round.phase === 'result' && Boolean(chosen?.correct);

  if (round.phase === 'result' && !isRight && !missedIds.includes(quest.id)) {
    setMissedIds([...missedIds, quest.id]);
  }

  useSimLoop(!paused && !quests.celebration, (dt) => {
    setRound((prev) => {
      // The last frame holds once the prediction is marked.
      if (prev.phase === 'result') return prev;
      const next = { ...prev, cell: stepPhotosynthesis(prev.cell, controls, sim, dt) };
      if (prev.phase === 'watch') {
        next.watched = prev.watched + dt;
        if (next.watched >= sim.watchSeconds) next.phase = 'result';
      }
      return next;
    });
    quests.tick(
      dt,
      (q) => q.id === round.questId && isRight,
      () => sim.starsByMisses[Math.min(missedIds.length, sim.starsByMisses.length - 1)],
    );
  });

  let status;
  if (round.phase === 'predict') {
    status = { tone: 'info', text: quest.question };
  } else if (round.phase === 'watch') {
    status = { tone: 'info', text: `You predicted: “${chosen.label}”. Watch the glucose meters…` };
  } else if (isRight) {
    status = { tone: 'good', text: `Right! ${chosen.label}.` };
  } else {
    status = { tone: 'warn', text: `Not quite. ${quest.educationalNote}` };
  }

  const ratePct = Math.round(round.cell.rate * 100);
  const changes = INPUTS.filter(({ key }) => key in quest.change);

  const hud = (
    <>
      <StatusLine tone={status.tone}>{status.text}</StatusLine>

      <div className="sq-stats pc-lab-meters" aria-label="Cell readings">
        <Meter
          label="Glucose being made"
          icon="🌿"
          value={ratePct}
          readout={`${ratePct}%`}
          tone={toneForValue(ratePct, { low: 15, high: 60 })}
        />
        <Meter
          label="Glucose store"
          icon="🍬"
          value={round.cell.glucose}
          readout={`${Math.round(round.cell.glucose)}%`}
          tone={toneForValue(round.cell.glucose, { low: 15, high: 40 })}
        />
      </div>
    </>
  );

  // No bottom bar on this level: the question, and later the verdict, sit over
  // the stage so the plant itself is what the player watches.
  let overlay = null;
  if (quests.celebration) {
    // The quest modal is already up.
  } else if (round.phase === 'predict') {
    // The question takes over the whole screen so the prediction is made
    // before the player can read the answer off the meters.
    overlay = (
      <div className="pc-ask" role="dialog" aria-modal="true" aria-labelledby="pc-ask-title">
        <div className="pc-ask__card">
          <span className="pc-ask__eyebrow">What happens if…?</span>
          <h2 className="pc-ask__title" id="pc-ask-title">{quest.question}</h2>
          {changes.map(({ key, label, icon }) => (
            <p key={key} className="pc-ask__change">
              <span aria-hidden="true">{icon}</span> {label}: {sim.baseControls[key]}% → {quest.change[key]}%
            </p>
          ))}
          <div className="pc-ask__choices" role="group" aria-label="Your prediction">
            {quest.choices.map((c, index) => (
              <button
                key={c.label}
                type="button"
                className={`pc-ask__choice${index === round.choice ? ' is-selected' : ''}`}
                aria-pressed={index === round.choice}
                onClick={() => setRound({ ...round, choice: index })}
              >
                {c.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="pc-btn pc-btn--primary pc-btn--wide"
            disabled={round.choice === null}
            onClick={() => setRound({ ...round, phase: 'watch' })}
          >
            {round.choice === null ? 'Pick a prediction first' : 'Let’s see what happens'}
          </button>
        </div>
      </div>
    );
  }

  // While the change plays out the story rises in as subtitles; once the
  // round is marked the verdict arrives as the last line, with the next
  // button under it.
  let narration = null;
  if (round.phase !== 'predict' && !quests.celebration) {
    const answer = quest.choices.find((c) => c.correct);
    const lines = (round.phase === 'result' ? quest.story : storyLinesAt(quest.story, round.watched))
      .map((text) => ({ key: text, text }));
    if (round.phase === 'result') {
      lines.push({
        key: 'verdict',
        tag: isRight ? '✓ You predicted it' : '✕ Not quite',
        tone: isRight ? 'is-right' : 'is-wrong',
        text: answer.label,
      });
    }
    narration = (
      <Subtitles lines={lines}>
        {round.phase === 'result' && (
          <button
            type="button"
            className="pc-btn pc-btn--primary pc-subs__btn"
            onClick={() => setRound(createRound(quest, sim))}
          >
            {isRight ? 'Watch it again' : 'Try again'}
          </button>
        )}
      </Subtitles>
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
          <span>round <b>{level.quests.indexOf(quest) + 1} of {level.quests.length}</b></span>
          <span>glucose made <b>{ratePct}%</b></span>
          <span>wrong predictions <b>{missedIds.length}</b></span>
          {round.phase === 'watch' && (
            <span>watching <b>{Math.max(1, Math.ceil(sim.watchSeconds - round.watched))}s</b></span>
          )}
        </>
      )}
      plant={(
        <PlantView
          light={controls.light}
          water={controls.water}
          co2={controls.co2}
          soil={controls.water}
          health={round.cell.health}
          turgor={100}
          rate={round.cell.rate}
          reducedMotion={reducedMotion}
          particleBudget={particleBudget}
          title="The plant by the window"
        />
      )}
      cell={(
        <CellView
          vacuoleFill={45}
          photosynthesis={{ ...controls, rate: round.cell.rate }}
          reducedMotion={reducedMotion}
          particleBudget={particleBudget}
          title="Plant cell running photosynthesis"
        />
      )}
      caption={(
        <PhotosynthesisEquation {...controls} isStopped={round.cell.rate === 0} />
      )}
      overlay={overlay}
      stageOverlay={narration}
    />
  );
}
