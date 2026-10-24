import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Hourglass,
  Loader2,
  Radio,
  Timer,
  Trophy,
  XCircle,
} from "lucide-react";

import Button from "../components/Button";
import { LiveLeaderboard } from "../components/live-quest/LiveLeaderboard";
import { formatOption, getOptionStyle } from "../components/live-quest/options";
import { useAuth } from "../context/AuthContext";
import { getSecondsLeft, useLiveRoom, useNow } from "../hooks/useLiveRoom";
import {
  fetchMyAnswer,
  fetchPlayers,
  joinLiveRoom,
  submitLiveAnswer,
} from "../lib/liveQuest";
import { cn } from "../lib/utils";

// Survives a refresh mid-game; cleared on leave.
const ROOM_KEY = "sq_live_quest_room";

function readStoredRoom() {
  try {
    return sessionStorage.getItem(ROOM_KEY);
  } catch {
    return null;
  }
}

function writeStoredRoom(roomId) {
  try {
    if (roomId) sessionStorage.setItem(ROOM_KEY, roomId);
    else sessionStorage.removeItem(ROOM_KEY);
  } catch {
    /* storage disabled — the game still works, it just won't survive a refresh */
  }
}

const CARD =
  "rounded-3xl border border-orange-100 dark:border-stone-700 bg-white dark:bg-stone-800 p-6 sm:p-8";

// Student side of Live Quest: enter the teacher's code, then answer each
// question on this device as the teacher runs the room.
export function LiveQuestPage({ onLoginClick }) {
  const { user, profile } = useAuth();
  const [roomId, setRoomId] = useState(readStoredRoom);
  const [notice, setNotice] = useState(null);

  function enterRoom(id) {
    writeStoredRoom(id);
    setNotice(null);
    setRoomId(id);
  }

  function leaveRoom(message) {
    writeStoredRoom(null);
    setNotice(message ?? null);
    setRoomId(null);
  }

  let content;
  if (!user) {
    content = (
      <div className={cn(CARD, "text-center flex flex-col items-center gap-4")}>
        <p className="font-bold text-stone-700 dark:text-stone-200">
          Log in to join your class&apos;s Live Quest.
        </p>
        <Button variant="primary" onClick={onLoginClick}>
          Log in
        </Button>
      </div>
    );
  } else if (profile?.role && profile.role !== "student") {
    content = (
      <div className={cn(CARD, "text-center")}>
        <p className="font-bold text-stone-700 dark:text-stone-200">
          Live Quest is played by students. Host one from the Teacher Portal&apos;s
          Live Quest tab.
        </p>
      </div>
    );
  } else if (roomId) {
    content = (
      <PlayerRoom
        key={roomId}
        roomId={roomId}
        studentId={user.id}
        onLeave={leaveRoom}
      />
    );
  } else {
    content = <JoinForm notice={notice} onJoined={enterRoom} />;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 sm:py-14">
      <div className="flex items-center gap-3 mb-6">
        <span className="w-11 h-11 rounded-2xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center">
          <Radio className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        </span>
        <div>
          <h1 className="font-heading text-2xl font-black text-stone-900 dark:text-white">
            Live Quest
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Race your classmates — faster correct answers score more.
          </p>
        </div>
      </div>
      {content}
    </div>
  );
}

function JoinForm({ notice, onJoined }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const [isJoining, setIsJoining] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setIsJoining(true);
    try {
      onJoined(await joinLiveRoom(code));
    } catch (err) {
      setError(err.message ?? "Couldn't join that room.");
      setIsJoining(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn(CARD, "flex flex-col gap-4")}>
      {notice && (
        <p className="text-sm font-bold text-stone-600 dark:text-stone-300">{notice}</p>
      )}
      <label
        htmlFor="live-quest-code"
        className="font-heading text-lg font-black text-stone-900 dark:text-white"
      >
        Enter your room code
      </label>
      <input
        id="live-quest-code"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
        maxLength={6}
        autoComplete="off"
        autoCapitalize="characters"
        placeholder="ABC123"
        className="w-full min-h-[64px] rounded-2xl border-2 border-orange-200 dark:border-stone-600 bg-[#fdf6e3] dark:bg-stone-900 px-4 text-center font-heading text-3xl font-black tracking-[0.3em] text-stone-900 dark:text-white placeholder:text-stone-300 dark:placeholder:text-stone-600 focus:outline-none focus:border-primary-500"
      />
      {error && (
        <p role="alert" className="flex items-center gap-2 text-sm font-bold text-red-700 dark:text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </p>
      )}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={code.length !== 6}
        isLoading={isJoining}
      >
        Join
      </Button>
    </form>
  );
}

function PlayerRoom({ roomId, studentId, onLeave }) {
  const { room, deadline, loadState } = useLiveRoom(roomId);
  // { index, answer, result } — the answer this student gave on a question.
  const [mine, setMine] = useState(null);
  // { index, message } — scoped to a question so it clears on the next one.
  const [submitError, setSubmitError] = useState(null);
  const [players, setPlayers] = useState([]);

  const status = room?.status;
  const currentIndex = room?.currentIndex ?? -1;

  useEffect(() => {
    if (loadState === "missing") onLeave("That Live Quest has closed.");
  }, [loadState, onLeave]);

  // Picks up an answer already given if the page reloads mid-question.
  useEffect(() => {
    if (currentIndex < 0) return;
    let cancelled = false;
    fetchMyAnswer(roomId, currentIndex)
      .then((answer) => {
        if (cancelled || !answer) return;
        setMine({
          index: answer.questionIndex,
          answer: answer.answer,
          result: { isCorrect: answer.isCorrect, points: answer.points },
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [roomId, currentIndex]);

  // Scores only matter between questions and at the end.
  useEffect(() => {
    if (status !== "reveal" && status !== "ended") return;
    let cancelled = false;
    fetchPlayers(roomId)
      .then((next) => {
        if (!cancelled) setPlayers(next);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [roomId, status, currentIndex]);

  const now = useNow(status === "question");
  const secondsLeft = getSecondsLeft(room, deadline, now);
  const myAnswer = mine?.index === currentIndex ? mine : null;

  async function handlePick(option) {
    if (myAnswer || secondsLeft <= 0) return;
    setSubmitError(null);
    setMine({ index: currentIndex, answer: option, result: null });
    try {
      const result = await submitLiveAnswer(roomId, currentIndex, option);
      setMine({ index: currentIndex, answer: option, result });
    } catch (err) {
      // Not counted — clear it so the student can try again if time remains.
      setMine(null);
      setSubmitError({
        index: currentIndex,
        message: err.message ?? "Your answer didn't go through.",
      });
    }
  }

  if (!room) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-8 h-8 text-secondary-500 animate-spin" />
      </div>
    );
  }

  const me = players.find((p) => p.studentId === studentId);
  const myRank = me ? players.indexOf(me) + 1 : null;

  if (status === "lobby") {
    return (
      <div className={cn(CARD, "text-center flex flex-col items-center gap-3")}>
        <Hourglass className="w-10 h-10 text-secondary-600 dark:text-secondary-400" />
        <h2 className="font-heading text-xl font-black text-stone-900 dark:text-white">
          You&apos;re in!
        </h2>
        <p className="text-stone-600 dark:text-stone-300">
          Room <strong className="tracking-widest">{room.code}</strong>. Watch the board —
          your teacher will start soon.
        </p>
        <Button variant="ghost" size="sm" onClick={() => onLeave()}>
          Leave room
        </Button>
      </div>
    );
  }

  if (status === "question") {
    const question = room.currentQuestion;
    return (
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-black uppercase tracking-[0.14em] text-stone-500 dark:text-stone-400">
            Question {currentIndex + 1} of {room.questionCount}
          </p>
          <span
            className="flex items-center gap-2 font-heading text-2xl font-black tabular-nums text-primary-700 dark:text-primary-400"
            role="timer"
          >
            <Timer className="w-5 h-5" />
            {secondsLeft}s
          </span>
        </div>
        <h2 className="font-heading text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
          {question?.question}
        </h2>
        {submitError?.index === currentIndex && (
          <p role="alert" className="flex items-center gap-2 text-sm font-bold text-red-700 dark:text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {submitError.message}
          </p>
        )}

        {myAnswer ? (
          <div className={cn(CARD, "text-center")}>
            <p className="font-heading text-lg font-black text-stone-900 dark:text-white">
              Answer locked in!
            </p>
            <p className="mt-1 text-stone-600 dark:text-stone-300">
              You picked <strong>{formatOption(myAnswer.answer)}</strong>. Waiting for the reveal…
            </p>
          </div>
        ) : secondsLeft <= 0 ? (
          <div className={cn(CARD, "text-center font-bold text-stone-700 dark:text-stone-200")}>
            Time&apos;s up! Waiting for the reveal…
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {(question?.options ?? []).map((option, index) => {
              const style = getOptionStyle(index);
              return (
                <button
                  key={String(option)}
                  type="button"
                  onClick={() => handlePick(option)}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-5 py-5 min-h-[80px] text-left transition-transform active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-stone-900 dark:focus-visible:outline-white",
                    style.tile,
                    style.hover,
                  )}
                >
                  <style.Icon className="w-7 h-7 shrink-0" aria-hidden="true" />
                  <span className="font-black">{style.letter}</span>
                  <span className="text-lg font-bold">{formatOption(option)}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  if (status === "reveal") {
    const correctAnswer = room.currentAnswer?.correctAnswer;
    const isCorrect = myAnswer?.result?.isCorrect ?? myAnswer?.answer === correctAnswer;
    return (
      <div className="flex flex-col gap-4">
        <div
          className={cn(
            CARD,
            "text-center flex flex-col items-center gap-2",
            !myAnswer
              ? ""
              : isCorrect
                ? "border-secondary-400 bg-secondary-50 dark:bg-secondary-900/20"
                : "border-primary-300 bg-primary-50 dark:bg-primary-900/20",
          )}
        >
          {!myAnswer ? (
            <Hourglass className="w-10 h-10 text-stone-500" />
          ) : isCorrect ? (
            <CheckCircle2 className="w-10 h-10 text-secondary-600 dark:text-secondary-400" />
          ) : (
            <XCircle className="w-10 h-10 text-primary-600 dark:text-primary-400" />
          )}
          <h2 className="font-heading text-2xl font-black text-stone-900 dark:text-white">
            {!myAnswer ? "No answer" : isCorrect ? "Correct!" : "Not quite"}
          </h2>
          {myAnswer?.result && (
            <p className="font-bold text-stone-700 dark:text-stone-200">
              +{myAnswer.result.points.toLocaleString()} points
            </p>
          )}
          <p className="text-stone-600 dark:text-stone-300">
            Answer: <strong>{formatOption(correctAnswer)}</strong>
          </p>
          {room.currentAnswer?.explanation && (
            <p className="text-sm text-stone-500 dark:text-stone-400 max-w-md">
              {room.currentAnswer.explanation}
            </p>
          )}
        </div>
        {me && (
          <p className="text-center font-bold text-stone-700 dark:text-stone-200">
            You&apos;re #{myRank} with {me.score.toLocaleString()} points
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={cn(CARD, "flex flex-col gap-5")}>
      <div className="text-center flex flex-col items-center gap-2">
        <Trophy className="w-10 h-10 text-yellow-500" />
        <h2 className="font-heading text-2xl font-black text-stone-900 dark:text-white">
          Quest complete!
        </h2>
        {me && (
          <p className="font-bold text-stone-700 dark:text-stone-200">
            You finished #{myRank} of {players.length} with {me.score.toLocaleString()} points
          </p>
        )}
      </div>
      <LiveLeaderboard players={players} limit={5} highlightId={studentId} />
      <Button variant="primary" onClick={() => onLeave()}>
        Join another Live Quest
      </Button>
    </div>
  );
}
