import { useState } from 'react';

import { createPhotosynthesisState, stepPhotosynthesis } from '../engine/photosynthesis';
import { useQuests } from '../engine/useQuests';
import { useSimLoop } from '../engine/useSimLoop';
import { CellView } from '../ui/CellView';
import { Meter, StatusLine } from '../ui/CellStats';
import { LabFrame } from '../ui/LabFrame';
import { PlantView } from '../ui/PlantView';
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
// normally while the player picks a prediction; "Let's see it happen" makes
// the change and plays it out for a few seconds, then marks the prediction.
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

  const controlBar = (
    <>
      <div className="sq-ctrl">
        <div className="sq-ctrl__head">
          <span className="sq-ctrl__label">What happens if…?</span>
        </div>
        <div className="sq-ctrl__hint">
          <strong>{quest.question}</strong>
          {changes.map(({ key, label, icon }) => (
            <span key={key}>
              <br />
              <span aria-hidden="true">{icon}</span> {label}: {sim.baseControls[key]}% → {quest.change[key]}%
            </span>
          ))}
        </div>
      </div>

      <div className="sq-ctrl">
        <div className="sq-ctrl__head">
          <span className="sq-ctrl__label" id="pc-predict-label">Your prediction</span>
        </div>
        <div className="pc-suspects" role="group" aria-labelledby="pc-predict-label">
          {quest.choices.map((c, index) => {
            const isChosen = index === round.choice;
            const isWrong = isChosen && round.phase === 'result' && !c.correct;
            // Once marked, the right answer is highlighted even if it was not picked.
            const isHighlighted = round.phase === 'result' ? c.correct : isChosen;
            return (
              <button
                key={c.label}
                type="button"
                className={`pc-suspect${isHighlighted ? ' is-selected' : ''}${isWrong ? ' is-ruled-out' : ''}`}
                aria-pressed={isChosen}
                disabled={round.phase !== 'predict'}
                onClick={() => setRound({ ...round, choice: index })}
              >
                {c.label}
                {isWrong && <span className="pc-suspect__x" aria-hidden="true"> ✕</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="sq-ctrl">
        {round.phase === 'predict' && (
          <button
            type="button"
            className="pc-btn pc-btn--primary pc-btn--wide"
            disabled={round.choice === null}
            onClick={() => setRound({ ...round, phase: 'watch' })}
          >
            {round.choice === null ? 'Pick a prediction first' : 'Let’s see it happen'}
          </button>
        )}
        {round.phase === 'watch' && (
          <button type="button" className="pc-btn pc-btn--primary pc-btn--wide" disabled>
            Watching… {Math.max(1, Math.ceil(sim.watchSeconds - round.watched))}s
          </button>
        )}
        {round.phase === 'result' && (
          <button
            type="button"
            className="pc-btn pc-btn--primary pc-btn--wide"
            onClick={() => setRound(createRound(quest, sim))}
          >
            {isRight ? 'Watch it again' : 'Try again'}
          </button>
        )}
      </div>
    </>
  );

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
        <div className="pc-equation" aria-label="The photosynthesis equation">
          <span className="pc-equation__side">
            <b style={{ color: '#d9a824' }}>sunlight</b> + <b style={{ color: '#3f7fb5' }}>water</b> + <b style={{ color: '#6f6553' }}>carbon dioxide</b>
          </span>
          <span className="pc-equation__arrow" aria-hidden="true">→</span>
          <span className="pc-equation__mid">chloroplast</span>
          <span className="pc-equation__arrow" aria-hidden="true">→</span>
          <span className="pc-equation__side">
            <b style={{ color: '#d76d2e' }}>glucose</b> + <b style={{ color: '#1d8580' }}>oxygen</b>
          </span>
        </div>
      )}
      controls={controlBar}
    />
  );
}
