import { useState, useEffect, useRef } from 'react';

export function useChallengeTracker(challenge, bus, isGamePaused) {
  const [holdProgress, setHoldProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Mutable refs — read by interval closure without causing re-creation
  const stateMatchStart = useRef(null);
  const challengeStart = useRef(null);
  const pausedAt = useRef(null);
  const isCompleteRef = useRef(false);
  const isPausedRef = useRef(isGamePaused);

  useEffect(() => { isPausedRef.current = isGamePaused; }, [isGamePaused]);

  // Reset everything when the challenge changes
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setHoldProgress(0);
    setElapsed(0);
    setIsComplete(false);
    /* eslint-enable react-hooks/set-state-in-effect */
    stateMatchStart.current = null;
    challengeStart.current = challenge ? Date.now() : null;
    pausedAt.current = null;
    isCompleteRef.current = false;
  }, [challenge?.id]);

  // Shift start times forward by the pause duration so timers ignore paused periods
  useEffect(() => {
    if (!challenge) return;
    if (isGamePaused) {
      pausedAt.current = Date.now();
    } else if (pausedAt.current !== null) {
      const dur = Date.now() - pausedAt.current;
      pausedAt.current = null;
      if (stateMatchStart.current !== null) stateMatchStart.current += dur;
      if (challengeStart.current !== null) challengeStart.current += dur;
    }
  }, [isGamePaused, challenge?.id]);

  // Listen for state changes and decide whether criteria are met
  useEffect(() => {
    if (!bus || !challenge) return;
    const criteria = challenge.successCriteria;

    function onStateChanged({ state, substance, temp }) {
      if (isCompleteRef.current) return;

      const subId = substance?.id ?? substance;
      const matches =
        state === criteria.targetState &&
        (!criteria.substanceId || subId === criteria.substanceId) &&
        (criteria.minTemp == null || temp >= criteria.minTemp);

      // Latch the start time; reset it when criteria stop being met
      stateMatchStart.current = matches
        ? (stateMatchStart.current ?? Date.now())
        : null;
    }

    bus.on('stateChanged', onStateChanged);
    return () => bus.off('stateChanged', onStateChanged);
  }, [bus, challenge?.id]);

  // 100ms tick — advances hold progress and checks completion
  useEffect(() => {
    if (!challenge) return;
    const criteria = challenge.successCriteria;

    const id = setInterval(() => {
      if (isCompleteRef.current || isPausedRef.current || pausedAt.current !== null) return;

      const now = Date.now();
      const elapsedMs = challengeStart.current ? now - challengeStart.current : 0;
      setElapsed(elapsedMs);

      if (stateMatchStart.current === null) {
        // State not matching — reset hold progress so the bar drains back
        setHoldProgress(0);
        return;
      }

      if (criteria.holdSeconds) {
        const held = now - stateMatchStart.current;
        const progress = Math.min(1, held / (criteria.holdSeconds * 1000));
        setHoldProgress(progress);

        if (progress >= 1 && (!criteria.timeLimit || elapsedMs <= criteria.timeLimit)) {
          isCompleteRef.current = true;
          setIsComplete(true);
        }
      } else if (criteria.timeLimit) {
        // Just needs to reach the target state within the time limit
        if (elapsedMs <= criteria.timeLimit) {
          isCompleteRef.current = true;
          setIsComplete(true);
        }
      }
    }, 100);

    return () => clearInterval(id);
  }, [challenge?.id]);

  return { holdProgress, elapsed, isComplete };
}
