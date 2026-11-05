import React, { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Info,
  Loader2,
  Pencil,
  Play,
  Plus,
  Radio,
  Timer,
  Trophy,
  Users,
  X,
} from "lucide-react";

import Button from "../Button";
import { SELECT, TabHead } from "../portal";
import { useAuth } from "../../context/AuthContext";
import { useLessonsData } from "../../context/LessonsDataContext";
import { getSecondsLeft, useLiveRoom, useNow } from "../../hooks/useLiveRoom";
import {
  SECONDS_OPTIONS,
  buildQuestionPool,
  buildSetQuestionPool,
  createLiveRoom,
  deleteQuestionSet,
  endLiveRoom,
  fetchOpenHostedRoom,
  fetchPlayers,
  fetchQuestionAnswers,
  fetchQuestionSets,
  getPlayableQuestions,
  getPlayableSetQuestions,
  revealQuestion,
  saveQuestionSet,
  startLiveRoom,
  startQuestion,
  subscribeToAnswers,
  subscribeToPlayers,
  toQuestionKey,
  updateRoomSettings,
} from "../../lib/liveQuest";
import { cn } from "../../lib/utils";
import { LiveLeaderboard } from "./LiveLeaderboard";
import { formatOption, getCorrectAnswers, getOptionStyle } from "./options";
import { QuestionExtras } from "./QuestionExtras";
import { QuestionSetEditor } from "./QuestionSetEditor";
import { QuestionSetLibrary } from "./QuestionSetLibrary";

const CARD =
  "rounded-2xl border border-orange-100 dark:border-stone-700 bg-white dark:bg-stone-800 p-5";

// Teacher portal "Live Quest" tab: create a room, pick lessons + timer in the
// lobby while students join, then run the questions live.
export function LiveQuestHost({ onEditQuiz }) {
  const { user } = useAuth();
  const [roomId, setRoomId] = useState(null);
  const [isChecking, setIsChecking] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);
  const [sets, setSets] = useState([]);
  const [isLoadingSets, setIsLoadingSets] = useState(true);
  const [busySetId, setBusySetId] = useState(null);
  // null = not editing; { id?, title, questions } = the set open in the editor.
  const [editingSet, setEditingSet] = useState(null);

  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    fetchQuestionSets(user.id)
      .then((next) => {
        if (!cancelled) setSets(next);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message ?? "Couldn't load your question sets.");
      })
      .finally(() => {
        if (!cancelled) setIsLoadingSets(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  function handleSetSaved(saved) {
    setSets((prev) => [saved, ...prev.filter((s) => s.id !== saved.id)]);
  }

  async function handleDuplicateSet(set) {
    setError(null);
    setBusySetId(set.id);
    try {
      const copy = await saveQuestionSet(user?.id, {
        title: `${set.title} (copy)`.slice(0, 120),
        questions: set.questions.map((q) => ({ ...q, id: crypto.randomUUID() })),
      });
      handleSetSaved(copy);
    } catch (err) {
      setError(err.message ?? "Couldn't duplicate the set.");
    } finally {
      setBusySetId(null);
    }
  }

  async function handleDeleteSet(set) {
    if (!window.confirm(`Delete "${set.title}"? This can't be undone.`)) return;
    setError(null);
    setBusySetId(set.id);
    try {
      await deleteQuestionSet(set.id);
      setSets((prev) => prev.filter((s) => s.id !== set.id));
    } catch (err) {
      setError(err.message ?? "Couldn't delete the set.");
    } finally {
      setBusySetId(null);
    }
  }

  const newSet = () => setEditingSet({ title: "", questions: [] });

  // A refresh or tab switch mid-game picks the open room back up.
  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    fetchOpenHostedRoom(user.id)
      .then((room) => {
        if (!cancelled) setRoomId(room?.id ?? null);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message ?? "Couldn't check for open rooms.");
      })
      .finally(() => {
        if (!cancelled) setIsChecking(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  async function handleCreate() {
    setError(null);
    setIsCreating(true);
    try {
      const room = await createLiveRoom(user?.id);
      setRoomId(room.id);
    } catch (err) {
      setError(err.message ?? "Couldn't create the room.");
    } finally {
      setIsCreating(false);
    }
  }

  if (editingSet) {
    return (
      <QuestionSetEditor
        key={editingSet.id ?? "new"}
        ownerId={user?.id}
        set={editingSet}
        onSaved={handleSetSaved}
        onBack={() => setEditingSet(null)}
      />
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <TabHead
        title="Live Quest"
        subtitle="Run a live, timed quiz your class answers from their own devices."
      />

      {error && <ErrorBanner message={error} />}

      {isChecking ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 text-secondary-500 animate-spin" />
        </div>
      ) : roomId ? (
        <HostRoom
          key={roomId}
          roomId={roomId}
          sets={sets}
          onNewSet={newSet}
          onEditSet={setEditingSet}
          onEditQuiz={onEditQuiz}
          onClosed={() => setRoomId(null)}
        />
      ) : (
        <>
          <div className={cn(CARD, "flex flex-col items-center text-center gap-4 py-12")}>
            <span className="w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center">
              <Radio className="w-7 h-7 text-primary-600 dark:text-primary-400" />
            </span>
            <div>
              <h2 className="font-heading text-lg font-black text-stone-900 dark:text-white">
                Start a Live Quest
              </h2>
              <p className="mt-1 text-sm text-stone-500 dark:text-stone-400 max-w-sm">
                You&apos;ll get a join code to show your class. Pick lessons or
                your own question sets while students join.
              </p>
            </div>
            <Button variant="primary" onClick={handleCreate} isLoading={isCreating}>
              Create room
            </Button>
          </div>
          <QuestionSetLibrary
            sets={sets}
            isLoading={isLoadingSets}
            busySetId={busySetId}
            onNew={newSet}
            onEdit={setEditingSet}
            onDuplicate={handleDuplicateSet}
            onDelete={handleDeleteSet}
          />
        </>
      )}
    </div>
  );
}

function HostRoom({ roomId, sets, onNewSet, onEditSet, onEditQuiz, onClosed }) {
  const { room, deadline, loadState, refresh } = useLiveRoom(roomId);
  const [players, setPlayers] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const revealedIndexRef = useRef(-1);

  useEffect(() => {
    let cancelled = false;
    const load = () =>
      fetchPlayers(roomId)
        .then((next) => {
          if (!cancelled) setPlayers(next);
        })
        .catch(() => {});
    load();
    const unsubscribe = subscribeToPlayers(roomId, load);
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [roomId]);

  const currentIndex = room?.currentIndex ?? -1;

  useEffect(() => {
    if (currentIndex < 0) return undefined;
    let cancelled = false;
    const load = () =>
      fetchQuestionAnswers(roomId, currentIndex)
        .then((next) => {
          if (!cancelled) setAnswers(next);
        })
        .catch(() => {});
    load();
    const unsubscribe = subscribeToAnswers(roomId, load);
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [roomId, currentIndex]);

  const now = useNow(room?.status === "question");
  const secondsLeft = getSecondsLeft(room, deadline, now);
  // Answers for the previous question linger until the new fetch lands.
  const currentAnswers = answers.filter((a) => a.questionIndex === currentIndex);
  const isEveryoneIn = players.length > 0 && currentAnswers.length >= players.length;

  // Time up, or every player answered: reveal once per question.
  useEffect(() => {
    if (room?.status !== "question" || !deadline) return;
    if (secondsLeft > 0 && !isEveryoneIn) return;
    if (revealedIndexRef.current === currentIndex) return;
    revealedIndexRef.current = currentIndex;
    revealQuestion(roomId)
      .then(refresh)
      .catch((err) => setError(err.message ?? "Couldn't reveal the answer."));
  }, [room?.status, deadline, secondsLeft, isEveryoneIn, currentIndex, roomId, refresh]);

  async function run(action) {
    setError(null);
    setIsBusy(true);
    try {
      await action();
      await refresh();
    } catch (err) {
      setError(err.message ?? "Something went wrong.");
    } finally {
      setIsBusy(false);
    }
  }

  if (loadState === "loading") {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-8 h-8 text-secondary-500 animate-spin" />
      </div>
    );
  }
  if (!room) {
    return (
      <div className="flex flex-col items-start gap-3">
        <ErrorBanner message="This room couldn't be loaded." />
        <Button variant="outline" size="sm" onClick={onClosed}>
          Start over
        </Button>
      </div>
    );
  }

  const isLast = room.currentIndex >= room.questionCount - 1;

  return (
    <div className="flex flex-col gap-4">
      {error && <ErrorBanner message={error} />}

      {room.status === "lobby" && (
        <HostLobby
          room={room}
          players={players}
          sets={sets}
          isBusy={isBusy}
          onNewSet={onNewSet}
          onEditSet={onEditSet}
          onEditQuiz={onEditQuiz}
          onStart={(questions) => run(() => startLiveRoom(room.id, questions))}
          onClose={() => run(() => endLiveRoom(room.id)).then(onClosed)}
          onError={setError}
        />
      )}

      {room.status === "question" && (
        <HostQuestion
          room={room}
          secondsLeft={secondsLeft}
          answeredCount={currentAnswers.length}
          playerCount={players.length}
          isBusy={isBusy}
          onReveal={() => {
            revealedIndexRef.current = room.currentIndex;
            run(() => revealQuestion(room.id));
          }}
        />
      )}

      {room.status === "reveal" && (
        <HostReveal
          room={room}
          answers={currentAnswers}
          players={players}
          isLast={isLast}
          isBusy={isBusy}
          onNext={() => run(() => startQuestion(room.id, room.currentIndex + 1))}
          onFinish={() => run(() => endLiveRoom(room.id))}
        />
      )}

      {room.status === "ended" && <HostResults players={players} onDone={onClosed} />}
    </div>
  );
}

function HostLobby({
  room,
  players,
  sets,
  isBusy,
  onNewSet,
  onEditSet,
  onEditQuiz,
  onStart,
  onClose,
  onError,
}) {
  const { weeksWithHidden: weeks, getQuiz } = useLessonsData();
  const [lessonIds, setLessonIds] = useState(room.lessonIds);
  const [setIds, setSetIds] = useState(room.setIds);
  const [excluded, setExcluded] = useState(() => loadExcluded(room.id));
  const [seconds, setSeconds] = useState(room.secondsPerQuestion);
  const [source, setSource] = useState("lessons");
  const [weekIndex, setWeekIndex] = useState(0);

  const lessonQuestions = buildQuestionPool(lessonIds, getQuiz, excluded);
  const setQuestions = buildSetQuestionPool(setIds, sets, excluded);
  const questions = [...lessonQuestions, ...setQuestions];
  // Clamped in case a hidden week drops out of the list mid-lobby.
  const safeWeekIndex = Math.min(weekIndex, Math.max(weeks.length - 1, 0));
  const week = weeks[safeWeekIndex];

  function getWeekPickedCount(w) {
    const pickedIds = w.lessons.filter((l) => lessonIds.includes(l.id)).map((l) => l.id);
    return buildQuestionPool(pickedIds, getQuiz, excluded).length;
  }

  // Saved as they change so a refresh keeps the teacher's picks.
  function save(patch) {
    updateRoomSettings(room.id, patch).catch((err) =>
      onError(err.message ?? "Couldn't save room settings."),
    );
  }

  // `kind` is "lesson" or "set": the two kinds of question group a host picks.
  function getPickedIds(kind) {
    return kind === "set" ? setIds : lessonIds;
  }

  function setPicks(kind, nextIds, nextExcluded) {
    if (nextIds !== getPickedIds(kind)) {
      if (kind === "set") {
        setSetIds(nextIds);
        save({ setIds: nextIds });
      } else {
        setLessonIds(nextIds);
        save({ lessonIds: nextIds });
      }
    }
    setExcluded(nextExcluded);
    saveExcluded(room.id, nextExcluded);
  }

  // A partly picked group ticks fully on; a fully picked one ticks off.
  function toggleGroup(kind, groupId) {
    const ids = getPickedIds(kind);
    const prefix = toQuestionKey(groupId, "");
    const othersExcluded = excluded.filter((key) => !key.startsWith(prefix));
    const isPicked = ids.includes(groupId);
    if (isPicked && othersExcluded.length === excluded.length) {
      setPicks(kind, ids.filter((id) => id !== groupId), othersExcluded);
    } else {
      setPicks(kind, isPicked ? ids : [...ids, groupId], othersExcluded);
    }
  }

  function toggleQuestion(kind, groupId, pickId, playable) {
    const ids = getPickedIds(kind);
    const prefix = toQuestionKey(groupId, "");
    const key = toQuestionKey(groupId, pickId);
    const othersExcluded = excluded.filter((k) => !k.startsWith(prefix));

    // Ticking one question of an unpicked group picks just that question.
    if (!ids.includes(groupId)) {
      const rest = playable
        .filter((q) => q.pickId !== pickId)
        .map((q) => toQuestionKey(groupId, q.pickId));
      setPicks(kind, [...ids, groupId], [...othersExcluded, ...rest]);
      return;
    }
    if (excluded.includes(key)) {
      setPicks(kind, ids, excluded.filter((k) => k !== key));
      return;
    }
    const next = [...excluded, key];
    const isGroupEmpty = playable.every((q) => next.includes(toQuestionKey(groupId, q.pickId)));
    if (isGroupEmpty) {
      setPicks(kind, ids.filter((id) => id !== groupId), othersExcluded);
    } else {
      setPicks(kind, ids, next);
    }
  }

  function handleSecondsChange(event) {
    const next = Number(event.target.value);
    setSeconds(next);
    save({ secondsPerQuestion: next });
  }

  const SOURCE_TABS = [
    { id: "lessons", label: "Lessons", count: lessonQuestions.length },
    { id: "sets", label: "My sets", count: setQuestions.length },
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="flex flex-col gap-4 min-w-0">
        <div className={cn(CARD, "flex flex-wrap items-center justify-between gap-4")}>
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-stone-500 dark:text-stone-400">
              Join code
            </p>
            <p className="font-heading text-5xl font-black tracking-[0.2em] text-primary-700 dark:text-primary-400 tabular-nums">
              {room.code}
            </p>
            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
              Students open <strong>Live Quest</strong> in SciQuest and enter this code.
            </p>
          </div>
          <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300 font-bold">
            <Users className="w-5 h-5" />
            {players.length} joined
          </div>
        </div>

        <div className={CARD}>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <h2 className="font-heading font-black text-stone-900 dark:text-white">Questions</h2>
            <p className="text-sm font-black text-primary-700 dark:text-primary-400" aria-live="polite">
              {questions.length} question{questions.length === 1 ? "" : "s"} selected
            </p>
          </div>

          <div role="group" aria-label="Question source" className="flex gap-1 mb-3 p-1 rounded-xl bg-orange-50 dark:bg-stone-900">
            {SOURCE_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                aria-pressed={source === tab.id}
                onClick={() => setSource(tab.id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 rounded-lg min-h-[44px] text-sm font-black focus-visible:outline-2 focus-visible:outline-primary-500",
                  source === tab.id
                    ? "bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-sm"
                    : "text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white",
                )}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="text-xs rounded-full px-2 py-0.5 bg-secondary-100 text-secondary-800 dark:bg-secondary-900/40 dark:text-secondary-300">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {source === "lessons" ? (
            <>
              <p className="mb-3 flex items-start gap-2 rounded-xl border border-secondary-200 dark:border-secondary-800/50 bg-secondary-50 dark:bg-secondary-900/20 px-3 py-2.5 text-sm text-stone-700 dark:text-stone-200">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-secondary-700 dark:text-secondary-400" aria-hidden="true" />
                <span>
                  These are the <strong>exact questions from each lesson&apos;s
                  quiz</strong> — nothing is rewritten for Live Quest, so playing
                  them doubles as a review of the real quiz. Only multiple-choice
                  and true/false questions can be played live. To change a
                  question&apos;s wording or answers, use the pencil beside it.
                </span>
              </p>
              <p className="mb-3 text-sm text-stone-500 dark:text-stone-400">
                Use the arrows to switch weeks. Tick a lesson to play all its
                questions, or tick questions one by one.
              </p>
              {week && (
                <div className="rounded-xl border border-orange-100 dark:border-stone-700">
                  <div className="flex items-center gap-2 px-2 py-2 border-b border-orange-100 dark:border-stone-700 bg-orange-50 dark:bg-stone-900 rounded-t-xl">
                    <button
                      type="button"
                      aria-label="Previous week"
                      disabled={safeWeekIndex === 0}
                      onClick={() => setWeekIndex(safeWeekIndex - 1)}
                      className="shrink-0 flex items-center justify-center w-11 h-11 rounded-lg text-stone-700 dark:text-stone-200 hover:bg-white dark:hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-primary-500"
                    >
                      <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                    </button>
                    <label htmlFor="live-quest-week" className="sr-only">
                      Week
                    </label>
                    <select
                      id="live-quest-week"
                      value={safeWeekIndex}
                      onChange={(event) => setWeekIndex(Number(event.target.value))}
                      className={cn(SELECT, "flex-1 min-w-0 text-center")}
                    >
                      {weeks.map((w, index) => {
                        const count = getWeekPickedCount(w);
                        return (
                          <option key={w.id} value={index}>
                            Week {w.weekNumber}: {w.title}
                            {count ? ` (${count} Q)` : ""}
                          </option>
                        );
                      })}
                    </select>
                    <button
                      type="button"
                      aria-label="Next week"
                      disabled={safeWeekIndex === weeks.length - 1}
                      onClick={() => setWeekIndex(safeWeekIndex + 1)}
                      className="shrink-0 flex items-center justify-center w-11 h-11 rounded-lg text-stone-700 dark:text-stone-200 hover:bg-white dark:hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-primary-500"
                    >
                      <ChevronRight className="w-5 h-5" aria-hidden="true" />
                    </button>
                  </div>
                  <ul className="px-2 py-1">
                    {week.lessons.map((lesson) => (
                      <QuestionGroupPicker
                        key={lesson.id}
                        group={lesson}
                        playable={getPlayableQuestions(getQuiz(lesson.id))}
                        isPicked={lessonIds.includes(lesson.id)}
                        excluded={excluded}
                        emptyLabel="No live questions"
                        onEditQuestion={
                          onEditQuiz && (() => onEditQuiz(lesson.id, week.id, "live-quest"))
                        }
                        onToggleGroup={(id) => toggleGroup("lesson", id)}
                        onToggleQuestion={(id, pickId, playable) =>
                          toggleQuestion("lesson", id, pickId, playable)
                        }
                      />
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  Your own questions. Mix them with lesson questions freely.
                </p>
                <Button variant="outline" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={onNewSet}>
                  New set
                </Button>
              </div>
              {sets.length ? (
                <ul className="rounded-xl border border-orange-100 dark:border-stone-700 px-2 py-1">
                  {sets.map((set) => (
                    <QuestionGroupPicker
                      key={set.id}
                      group={set}
                      playable={getPlayableSetQuestions(set)}
                      isPicked={setIds.includes(set.id)}
                      excluded={excluded}
                      emptyLabel="No finished questions"
                      onEdit={() => onEditSet(set)}
                      onToggleGroup={(id) => toggleGroup("set", id)}
                      onToggleQuestion={(id, pickId, playable) =>
                        toggleQuestion("set", id, pickId, playable)
                      }
                    />
                  ))}
                </ul>
              ) : (
                <p className="rounded-xl border-2 border-dashed border-orange-100 dark:border-stone-700 px-4 py-8 text-center text-sm text-stone-500 dark:text-stone-400">
                  You haven&apos;t written any sets yet. Click <strong>New set</strong> to make one.
                </p>
              )}
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className={CARD}>
          <h2 className="font-heading font-black text-stone-900 dark:text-white mb-3">
            Room settings
          </h2>
          <label
            htmlFor="live-quest-seconds"
            className="flex items-center gap-2 text-sm font-bold text-stone-700 dark:text-stone-200"
          >
            <Timer className="w-4 h-4" />
            Time per question
          </label>
          <select
            id="live-quest-seconds"
            value={seconds}
            onChange={handleSecondsChange}
            className={cn(SELECT, "mt-2 w-full")}
          >
            {SECONDS_OPTIONS.map((value) => (
              <option key={value} value={value}>
                {value} seconds
              </option>
            ))}
          </select>
        </div>

        <div className={CARD}>
          <h2 className="font-heading font-black text-stone-900 dark:text-white mb-3">
            Players
          </h2>
          {players.length ? (
            <ul className="flex flex-wrap gap-2">
              {players.map((player) => (
                <li
                  key={player.studentId}
                  className="rounded-full px-3 py-1 text-sm font-bold bg-secondary-50 text-secondary-800 dark:bg-secondary-900/30 dark:text-secondary-300"
                >
                  {player.displayName}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-stone-500 dark:text-stone-400">
              Waiting for students to join…
            </p>
          )}
        </div>

        <Button
          variant="primary"
          size="lg"
          leftIcon={<Play className="w-5 h-5" />}
          disabled={!questions.length || isBusy}
          onClick={() => onStart(questions)}
        >
          Start Live Quest
        </Button>
        <Button
          variant="ghost"
          leftIcon={<X className="w-4 h-4" />}
          disabled={isBusy}
          onClick={onClose}
        >
          Close room
        </Button>
      </div>
    </div>
  );
}

const TYPE_LABELS = {
  "multiple-choice": "Multiple choice",
  "true-false": "True / False",
};

const CHIP =
  "inline-block text-[11px] font-bold rounded-full px-2 py-0.5 bg-stone-100 text-stone-600 dark:bg-stone-700 dark:text-stone-300";

// Teacher-written questions carry extra settings worth seeing while picking.
function getQuestionChips(q) {
  const chips = [TYPE_LABELS[q.type]];
  if (q.correctIndexes?.length > 1) chips.push("Multiple correct");
  if (q.seconds) chips.push(`${q.seconds}s`);
  if (q.points === "double") chips.push("Double points");
  if (q.points === "none") chips.push("No points");
  if (q.imageUrl) chips.push("Image");
  return chips;
}

// One lesson or one question set: a checkbox for the whole group plus a list
// of its questions, each with its own checkbox.
function QuestionGroupPicker({
  group,
  playable,
  isPicked,
  excluded,
  emptyLabel,
  onEdit,
  onEditQuestion,
  onToggleGroup,
  onToggleQuestion,
}) {
  // Collapsed on arrival — a week of lessons is a long list, and the host
  // only needs to open the group they are actually picking from.
  const [isOpen, setIsOpen] = useState(false);
  const isQuestionPicked = (q) => isPicked && !excluded.includes(toQuestionKey(group.id, q.pickId));
  const pickedCount = playable.filter(isQuestionPicked).length;
  const isPartial = pickedCount > 0 && pickedCount < playable.length;
  const listId = `live-quest-questions-${group.id}`;

  const editButton = onEdit && (
    <button
      type="button"
      onClick={onEdit}
      aria-label={`Edit ${group.title}`}
      title="Edit set"
      className="shrink-0 flex items-center justify-center w-11 h-11 rounded-lg text-stone-500 dark:text-stone-400 hover:text-primary-700 dark:hover:text-primary-400 focus-visible:outline-2 focus-visible:outline-primary-500"
    >
      <Pencil className="w-4 h-4" aria-hidden="true" />
    </button>
  );

  if (!playable.length) {
    return (
      <li className="flex items-center gap-3 rounded-lg px-2 py-2 min-h-[44px]">
        <input type="checkbox" className="w-4 h-4 opacity-50" disabled aria-label={group.title} />
        <span className="flex-1 min-w-0 truncate text-sm font-medium text-stone-500 dark:text-stone-400">
          {group.title}
        </span>
        <span className="shrink-0 text-xs font-bold text-stone-500 dark:text-stone-400">
          {emptyLabel}
        </span>
        {editButton}
      </li>
    );
  }

  return (
    <li>
      <div className="flex items-center gap-1 rounded-lg hover:bg-orange-50 dark:hover:bg-stone-700/50">
        <label className="flex flex-1 min-w-0 items-center gap-3 px-2 py-2 min-h-[44px] cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 accent-primary-600"
            checked={pickedCount === playable.length}
            ref={(el) => {
              if (el) el.indeterminate = isPartial;
            }}
            onChange={() => onToggleGroup(group.id)}
          />
          <span className="flex-1 min-w-0 truncate text-sm font-medium text-stone-700 dark:text-stone-200">
            {group.title}
          </span>
        </label>
        {editButton}
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={listId}
          onClick={() => setIsOpen((open) => !open)}
          className="shrink-0 flex items-center gap-1 rounded-lg px-2 min-h-[44px] text-xs font-bold text-stone-600 dark:text-stone-300 hover:text-primary-700 dark:hover:text-primary-400 focus-visible:outline-2 focus-visible:outline-primary-500"
        >
          {pickedCount}/{playable.length} Q
          <span className="sr-only">{isOpen ? "Hide questions" : "Show questions"}</span>
          <ChevronDown
            className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")}
            aria-hidden="true"
          />
        </button>
      </div>

      {isOpen && (
        <ol id={listId} className="ml-7 mb-2 flex flex-col gap-1 border-l-2 border-orange-100 dark:border-stone-700 pl-3">
          {playable.map((q, position) => (
            <li key={q.pickId} className="flex items-start gap-1">
              <label className="flex flex-1 min-w-0 items-start gap-3 rounded-lg px-2 py-2 min-h-[44px] cursor-pointer hover:bg-orange-50 dark:hover:bg-stone-700/50">
                <input
                  type="checkbox"
                  className="mt-0.5 w-4 h-4 shrink-0 accent-primary-600"
                  checked={isQuestionPicked(q)}
                  onChange={() => onToggleQuestion(group.id, q.pickId, playable)}
                />
                <span className="flex-1 min-w-0">
                  <span className="block text-sm text-stone-800 dark:text-stone-100">
                    <span className="font-black text-stone-500 dark:text-stone-400">{position + 1}.</span>{" "}
                    {q.question}
                  </span>
                  <span className="mt-1 flex flex-wrap gap-1">
                    {getQuestionChips(q).map((chip) => (
                      <span key={chip} className={CHIP}>
                        {chip}
                      </span>
                    ))}
                  </span>
                </span>
              </label>
              {onEditQuestion && (
                <button
                  type="button"
                  onClick={onEditQuestion}
                  aria-label={`Edit question ${position + 1} in the ${group.title} quiz`}
                  title="Edit in the lesson quiz editor"
                  className="shrink-0 flex items-center justify-center w-11 h-11 rounded-lg text-stone-500 dark:text-stone-400 hover:text-primary-700 dark:hover:text-primary-400 focus-visible:outline-2 focus-visible:outline-primary-500"
                >
                  <Pencil className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
            </li>
          ))}
        </ol>
      )}
    </li>
  );
}

// Per-question unticks live only on the host's device: the room row stores
// lesson ids, and the full question list is written once at start.
function getExcludedStorageKey(roomId) {
  return `liveQuest:excluded:${roomId}`;
}

function loadExcluded(roomId) {
  try {
    const stored = JSON.parse(localStorage.getItem(getExcludedStorageKey(roomId)));
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

function saveExcluded(roomId, keys) {
  try {
    localStorage.setItem(getExcludedStorageKey(roomId), JSON.stringify(keys));
  } catch {
    // Storage blocked: picks still work, they just won't survive a refresh.
  }
}

function QuestionHeader({ room, children }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm font-black uppercase tracking-[0.14em] text-stone-500 dark:text-stone-400">
        Question {room.currentIndex + 1} of {room.questionCount}
        {room.currentQuestion?.lessonTitle && (
          <span className="normal-case tracking-normal font-bold">
            {" "}· {room.currentQuestion.lessonTitle}
          </span>
        )}
      </p>
      {children}
    </div>
  );
}

function HostQuestion({ room, secondsLeft, answeredCount, playerCount, isBusy, onReveal }) {
  const question = room.currentQuestion;
  return (
    <div className={cn(CARD, "flex flex-col gap-5")}>
      <QuestionHeader room={room}>
        <span
          className="flex items-center gap-2 font-heading text-3xl font-black tabular-nums text-primary-700 dark:text-primary-400"
          role="timer"
        >
          <Timer className="w-6 h-6" />
          {secondsLeft}s
        </span>
      </QuestionHeader>

      <h2 className="font-heading text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
        {question?.question}
      </h2>
      <QuestionExtras question={question} />

      <div className="grid gap-3 sm:grid-cols-2">
        {(question?.options ?? []).map((option, index) => {
          const style = getOptionStyle(index);
          return (
            <div
              key={String(option)}
              className={cn("flex items-center gap-3 rounded-2xl px-5 py-4 min-h-[64px]", style.tile)}
            >
              <style.Icon className="w-6 h-6 shrink-0" aria-hidden="true" />
              <span className="font-black">{style.letter}</span>
              <span className="text-lg font-bold">{formatOption(option)}</span>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-bold text-stone-600 dark:text-stone-300">
          {answeredCount} / {playerCount} answered
        </p>
        <Button variant="secondary" size="sm" disabled={isBusy} onClick={onReveal}>
          Reveal answer now
        </Button>
      </div>
    </div>
  );
}

function HostReveal({ room, answers, players, isLast, isBusy, onNext, onFinish }) {
  const question = room.currentQuestion;
  const correctAnswers = getCorrectAnswers(room.currentAnswer);
  const explanation = room.currentAnswer?.explanation;
  const options = question?.options ?? [];
  const maxCount = Math.max(1, ...options.map((o) => answers.filter((a) => a.answer === o).length));

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className={cn(CARD, "flex flex-col gap-5 min-w-0")}>
        <QuestionHeader room={room} />
        <h2 className="font-heading text-2xl font-black text-stone-900 dark:text-white">
          {question?.question}
        </h2>

        <ul className="flex flex-col gap-3">
          {options.map((option, index) => {
            const style = getOptionStyle(index);
            const count = answers.filter((a) => a.answer === option).length;
            const isCorrect = correctAnswers.includes(option);
            return (
              <li
                key={String(option)}
                className={cn(
                  "rounded-2xl border-2 p-3",
                  isCorrect
                    ? "border-secondary-500 bg-secondary-50 dark:bg-secondary-900/20"
                    : "border-transparent opacity-70",
                )}
              >
                <div className="flex items-center gap-3">
                  <style.Icon className="w-5 h-5 shrink-0 text-stone-600 dark:text-stone-300" aria-hidden="true" />
                  <span className="font-black text-stone-700 dark:text-stone-200">{style.letter}</span>
                  <span className="flex-1 min-w-0 font-bold text-stone-800 dark:text-stone-100">
                    {formatOption(option)}
                  </span>
                  {isCorrect && (
                    <span className="flex items-center gap-1 text-sm font-black text-secondary-700 dark:text-secondary-400">
                      <CheckCircle2 className="w-4 h-4" />
                      Correct
                    </span>
                  )}
                  <span className="w-10 text-right font-black tabular-nums text-stone-700 dark:text-stone-200">
                    {count}
                  </span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-stone-100 dark:bg-stone-700 overflow-hidden">
                  <div
                    className={cn("h-full rounded-full origin-left", style.bar)}
                    style={{ transform: `scaleX(${count / maxCount})` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>

        {explanation && (
          <p className="text-sm text-stone-600 dark:text-stone-300 rounded-xl bg-orange-50 dark:bg-stone-900/50 px-4 py-3">
            {explanation}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <div className={CARD}>
          <h2 className="font-heading font-black text-stone-900 dark:text-white mb-3">Top 5</h2>
          <LiveLeaderboard players={players} limit={5} />
        </div>
        {isLast ? (
          <Button
            variant="primary"
            size="lg"
            leftIcon={<Trophy className="w-5 h-5" />}
            disabled={isBusy}
            onClick={onFinish}
          >
            Show final results
          </Button>
        ) : (
          <Button
            variant="primary"
            size="lg"
            leftIcon={<Play className="w-5 h-5" />}
            disabled={isBusy}
            onClick={onNext}
          >
            Next question
          </Button>
        )}
      </div>
    </div>
  );
}

function HostResults({ players, onDone }) {
  return (
    <div className={cn(CARD, "flex flex-col gap-5")}>
      <div className="flex items-center gap-3">
        <Trophy className="w-7 h-7 text-yellow-500" />
        <h2 className="font-heading text-2xl font-black text-stone-900 dark:text-white">
          Final results
        </h2>
      </div>
      <LiveLeaderboard players={players} />
      <div>
        <Button variant="primary" onClick={onDone}>
          Host another Live Quest
        </Button>
      </div>
    </div>
  );
}

function ErrorBanner({ message }) {
  return (
    <div
      role="alert"
      className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 text-red-700 dark:text-red-400 text-sm font-bold"
    >
      <AlertCircle className="w-4 h-4 shrink-0" />
      {message}
    </div>
  );
}
