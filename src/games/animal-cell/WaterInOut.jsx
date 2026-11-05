import { useState } from 'react';

// NOTE: plant-cell's water model and its plant-vs-animal WaterCell drawing are
// used as-is — this level is where the two cell games meet.
import { createCellState, stepCell } from '../plant-cell/engine/water';
import { useQuests } from '../plant-cell/engine/useQuests';
import { useSimLoop } from '../plant-cell/engine/useSimLoop';
import { Meter, StatusLine } from '../plant-cell/ui/CellStats';
import { LabFrame } from '../plant-cell/ui/LabFrame';
import { Subtitles } from '../plant-cell/ui/Subtitles';
import { storyLinesAt } from '../plant-cell/ui/story';
import { WaterCell } from '../plant-cell/ui/WaterCell';

const AROUND_LABEL = { pure: 'pure water', salty: 'very salty water', same: 'water as salty as the cell' };
const CELL_LABEL = { animal: 'Animal cell', plant: 'Plant cell' };

function createRound(quest, sim) {
  return { questId: quest.id, phase: 'predict', choice: null, watched: 0, cell: createCellState(quest, sim) };
}

// Level 2 — each quest is one "what happens if…?" round, played like
// plant-cell's PredictThenTest: pick a prediction, watch the cell for
// sim.watchSeconds, then the prediction is marked. Wrong ones cost a star.
export function WaterInOut({
  level,
  progressByLevel,
  reducedMotion,
  onExit,
  onRestart,
  onQuestComplete,
  onLevelComplete,
}) {
  const [paused, setPaused] = useState(false);
  const [missedIds, setMissedIds] = useState([]);
  const quests = useQuests({ level, progressByLevel, onQuestComplete, onLevelComplete });
  const [round, setRound] = useState(() => createRound(quests.activeQuest ?? level.quests[0], level.sim));

  // The sidebar picks the round, so a new active quest starts its round fresh.
  if (quests.activeQuest && quests.activeQuest.id !== round.questId) {
    setRound(createRound(quests.activeQuest, level.sim));
  }

  const { sim } = level;
  const quest = level.quests.find((q) => q.id === round.questId);
  const chosen = round.choice === null ? null : quest.choices[round.choice];
  const isRight = round.phase === 'result' && Boolean(chosen?.correct);

  if (round.phase === 'result' && !isRight && !missedIds.includes(quest.id)) {
    setMissedIds([...missedIds, quest.id]);
  }

  useSimLoop(!paused && !quests.celebration, (dt) => {
    setRound((prev) => {
      if (prev.phase !== 'watch') return prev;
      const watched = prev.watched + dt;
      return {
        ...prev,
        watched,
        cell: stepCell(prev.cell, quest, sim, dt),
        phase: watched >= sim.watchSeconds ? 'result' : 'watch',
      };
    });
    quests.tick(
      dt,
      (q) => q.id === round.questId && isRight,
      () => sim.starsByMisses[Math.min(missedIds.length, sim.starsByMisses.length - 1)],
    );
  });

  let status;
  if (round.phase === 'predict') status = { tone: 'info', text: quest.question };
  else if (round.phase === 'watch') status = { tone: 'info', text: `You predicted: “${chosen.label}”. Watch the cell…` };
  else if (isRight) status = { tone: 'good', text: `Right! ${chosen.label}.` };
  else status = { tone: 'warn', text: `Not quite. ${quest.educationalNote}` };

  const waterPct = Math.round(round.cell.water);

  const hud = (
    <>
      <StatusLine tone={status.tone}>{status.text}</StatusLine>
      <div className="sq-stats pc-lab-meters" aria-label="Cell readings">
        <Meter
          label="Water in the cell"
          icon="💧"
          value={round.cell.water}
          readout={round.cell.burst ? 'Burst' : `${waterPct}%`}
          tone={round.cell.burst || waterPct <= sim.minWater + 5 ? 'bad' : waterPct >= 95 ? 'warn' : 'good'}
        />
      </div>
    </>
  );

  let overlay = null;
  if (!quests.celebration && round.phase === 'predict') {
    overlay = (
      <div className="pc-ask" role="dialog" aria-modal="true" aria-labelledby="ac-ask-title">
        <div className="pc-ask__card">
          <span className="pc-ask__eyebrow">What happens if…?</span>
          <h2 className="pc-ask__title" id="ac-ask-title">{quest.question}</h2>
          <p className="pc-ask__change">
            <span aria-hidden="true">🔬</span> {CELL_LABEL[quest.cell]} → {AROUND_LABEL[quest.around]}
          </p>
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
          <button type="button" className="pc-btn pc-btn--primary pc-subs__btn" onClick={() => setRound(createRound(quest, sim))}>
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
      hud={hud}
      readout={(
        <>
          <span>round <b>{level.quests.indexOf(quest) + 1} of {level.quests.length}</b></span>
          <span>in <b>{AROUND_LABEL[quest.around]}</b></span>
          <span>wrong predictions <b>{missedIds.length}</b></span>
          {round.phase === 'watch' && (
            <span>watching <b>{Math.max(1, Math.ceil(sim.watchSeconds - round.watched))}s</b></span>
          )}
        </>
      )}
      cell={<WaterCell kind={quest.cell} water={round.cell.water} burst={round.cell.burst} />}
      overlay={overlay}
      stageOverlay={narration}
    />
  );
}
