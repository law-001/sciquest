import { useRef, useState } from 'react';

// Quest progress for every level, worked like the matter-state sandbox's
// challenges. Only the active quest is tracked: it completes once its
// condition has held for `holdSeconds` (0 = the moment it is true), and
// finishing the last quest completes the level without ending the run.
export function useQuests({ level, progressByLevel, onQuestComplete, onLevelComplete }) {
  // A level finished before it had quests has no quest rows, so its saved
  // level row ticks every quest.
  const savedQuestIds = progressByLevel[level.id]?.completed
    ? level.quests.map((q) => q.id)
    : level.quests.filter((q) => progressByLevel[q.id]?.completed).map((q) => q.id);
  const [sessionQuestIds, setSessionQuestIds] = useState([]);
  const doneQuestIds = [...new Set([...savedQuestIds, ...sessionQuestIds])];
  const [activeQuest, setActiveQuest] = useState(
    () => level.quests.find((q) => !savedQuestIds.includes(q.id)) ?? null,
  );
  // Seconds the active quest's condition has held without a break.
  const [hold, setHold] = useState(0);
  // { quest, nextQuest, levelStars } while the quest popup is open.
  const [celebration, setCelebration] = useState(null);
  // The sim loop can run one more frame before the popup state lands; this
  // stops that frame completing the same quest (and level) a second time.
  const isCelebratingRef = useRef(false);

  function completeQuest(quest, getStars) {
    const wasLevelComplete = level.quests.every((q) => doneQuestIds.includes(q.id));
    const nowDone = [...doneQuestIds, quest.id];
    const isLevelComplete = !wasLevelComplete && level.quests.every((q) => nowDone.includes(q.id));
    const levelStars = isLevelComplete ? getStars() : null;

    isCelebratingRef.current = true;
    setHold(0);
    setSessionQuestIds((ids) => (ids.includes(quest.id) ? ids : [...ids, quest.id]));
    setCelebration({
      quest,
      nextQuest: level.quests.find((q) => !nowDone.includes(q.id)) ?? null,
      levelStars,
    });
    onQuestComplete(quest.id);
    if (isLevelComplete) onLevelComplete(levelStars);
  }

  // Called once per sim frame. `isMet` answers for the active quest;
  // `getStars` scores the level in case this quest is its last.
  function tick(dt, isMet, getStars) {
    if (!activeQuest || isCelebratingRef.current) return;
    if (!isMet(activeQuest)) {
      if (hold > 0) setHold(0);
      return;
    }
    const held = hold + dt;
    if (held >= activeQuest.holdSeconds) completeQuest(activeQuest, getStars);
    else setHold(held);
  }

  function select(quest) {
    setActiveQuest(quest);
    setHold(0);
  }

  function keepExploring() {
    isCelebratingRef.current = false;
    setActiveQuest(null);
    setCelebration(null);
  }

  // NOTE: `?.` is load-bearing. The React Compiler reads `celebration.nextQuest`
  // during render to memoise this handler, and celebration is null then.
  function nextQuest() {
    isCelebratingRef.current = false;
    setActiveQuest(celebration?.nextQuest ?? null);
    setCelebration(null);
  }

  return {
    doneQuestIds,
    activeQuest,
    celebration,
    holdProgress: activeQuest?.holdSeconds ? Math.min(1, hold / activeQuest.holdSeconds) : 0,
    tick,
    select,
    keepExploring,
    nextQuest,
  };
}
