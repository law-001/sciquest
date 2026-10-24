import React, { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Play,
  Radio,
  Timer,
  Trophy,
  Users,
  X,
} from "lucide-react";

import Button from "../Button";
import { TabHead } from "../portal";
import { useAuth } from "../../context/AuthContext";
import { useLessonsData } from "../../context/LessonsDataContext";
import { getSecondsLeft, useLiveRoom, useNow } from "../../hooks/useLiveRoom";
import {
  SECONDS_OPTIONS,
  buildQuestionPool,
  countPlayableQuestions,
  createLiveRoom,
  endLiveRoom,
  fetchOpenHostedRoom,
  fetchPlayers,
  fetchQuestionAnswers,
  revealQuestion,
  startLiveRoom,
  startQuestion,
  subscribeToAnswers,
  subscribeToPlayers,
  updateRoomSettings,
} from "../../lib/liveQuest";
import { cn } from "../../lib/utils";
import { LiveLeaderboard } from "./LiveLeaderboard";
import { formatOption, getOptionStyle } from "./options";

const CARD =
  "rounded-2xl border border-orange-100 dark:border-stone-700 bg-white dark:bg-stone-800 p-5";

// Teacher portal "Live Quest" tab: create a room, pick lessons + timer in the
// lobby while students join, then run the questions live.
export function LiveQuestHost() {
  const { user } = useAuth();
  const [roomId, setRoomId] = useState(null);
  const [isChecking, setIsChecking] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);

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
        <HostRoom key={roomId} roomId={roomId} onClosed={() => setRoomId(null)} />
      ) : (
        <div className={cn(CARD, "flex flex-col items-center text-center gap-4 py-12")}>
          <span className="w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center">
            <Radio className="w-7 h-7 text-primary-600 dark:text-primary-400" />
          </span>
          <div>
            <h2 className="font-heading text-lg font-black text-stone-900 dark:text-white">
              Start a Live Quest
            </h2>
            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400 max-w-sm">
              You&apos;ll get a join code to show your class. Pick lessons and
              set the timer while students join.
            </p>
          </div>
          <Button variant="primary" onClick={handleCreate} isLoading={isCreating}>
            Create room
          </Button>
        </div>
      )}
    </div>
  );
}

function HostRoom({ roomId, onClosed }) {
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
          isBusy={isBusy}
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

function HostLobby({ room, players, isBusy, onStart, onClose, onError }) {
  const { weeksWithHidden: weeks, getQuiz } = useLessonsData();
  const [lessonIds, setLessonIds] = useState(room.lessonIds);
  const [seconds, setSeconds] = useState(room.secondsPerQuestion);

  const questions = buildQuestionPool(lessonIds, getQuiz);

  // Saved as they change so a refresh keeps the teacher's picks.
  function save(patch) {
    updateRoomSettings(room.id, patch).catch((err) =>
      onError(err.message ?? "Couldn't save room settings."),
    );
  }

  function toggleLesson(lessonId) {
    const next = lessonIds.includes(lessonId)
      ? lessonIds.filter((id) => id !== lessonId)
      : [...lessonIds, lessonId];
    setLessonIds(next);
    save({ lessonIds: next });
  }

  function handleSecondsChange(event) {
    const next = Number(event.target.value);
    setSeconds(next);
    save({ secondsPerQuestion: next });
  }

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
          <h2 className="font-heading font-black text-stone-900 dark:text-white">Lessons</h2>
          <p className="mt-0.5 mb-3 text-sm text-stone-500 dark:text-stone-400">
            Multiple-choice and true/false questions from each picked lesson&apos;s
            quiz are played. {questions.length} question
            {questions.length === 1 ? "" : "s"} selected.
          </p>
          <div className="flex flex-col gap-2">
            {weeks.map((week) => {
              const pickedCount = week.lessons.filter((l) => lessonIds.includes(l.id)).length;
              return (
                <details
                  key={week.id}
                  className="rounded-xl border border-orange-100 dark:border-stone-700"
                >
                  <summary className="cursor-pointer select-none px-4 py-3 min-h-[44px] flex items-center justify-between gap-3 font-bold text-stone-800 dark:text-stone-100">
                    <span className="truncate">
                      Week {week.weekNumber}: {week.title}
                    </span>
                    {pickedCount > 0 && (
                      <span className="shrink-0 text-xs font-black rounded-full px-2 py-0.5 bg-secondary-100 text-secondary-800 dark:bg-secondary-900/40 dark:text-secondary-300">
                        {pickedCount} picked
                      </span>
                    )}
                  </summary>
                  <ul className="px-2 pb-2">
                    {week.lessons.map((lesson) => {
                      const playable = countPlayableQuestions(getQuiz(lesson.id));
                      return (
                        <li key={lesson.id}>
                          <label
                            className={cn(
                              "flex items-center gap-3 rounded-lg px-2 py-2 min-h-[44px]",
                              playable
                                ? "cursor-pointer hover:bg-orange-50 dark:hover:bg-stone-700/50"
                                : "opacity-50 cursor-not-allowed",
                            )}
                          >
                            <input
                              type="checkbox"
                              className="w-4 h-4 accent-primary-600"
                              checked={lessonIds.includes(lesson.id)}
                              disabled={!playable}
                              onChange={() => toggleLesson(lesson.id)}
                            />
                            <span className="flex-1 min-w-0 truncate text-sm font-medium text-stone-700 dark:text-stone-200">
                              {lesson.title}
                            </span>
                            <span className="shrink-0 text-xs font-bold text-stone-500 dark:text-stone-400">
                              {playable ? `${playable} Q` : "No live questions"}
                            </span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </details>
              );
            })}
          </div>
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
            className="mt-2 w-full min-h-[44px] rounded-xl border border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-900 px-3 text-sm font-bold text-stone-800 dark:text-stone-100"
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
  const correctAnswer = room.currentAnswer?.correctAnswer;
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
            const isCorrect = option === correctAnswer;
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
