import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook for managing the interview practice countdown timer.
 */
export function usePracticeTimer() {
  const [timerSeconds, setTimerSeconds] = useState(null);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    if (!timerRunning || timerSeconds === null || timerSeconds <= 0) return;

    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          setTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const startTimer = useCallback((minutes) => {
    setTimerSeconds(minutes * 60);
    setTimerRunning(true);
  }, []);

  const stopTimer = useCallback(() => {
    setTimerRunning(false);
  }, []);

  const resetTimer = useCallback(() => {
    setTimerRunning(false);
    setTimerSeconds(null);
  }, []);

  const formatTimer = useCallback((totalSec) => {
    if (totalSec === null) return "";
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }, []);

  return {
    timerSeconds,
    setTimerSeconds,
    timerRunning,
    setTimerRunning,
    startTimer,
    stopTimer,
    resetTimer,
    formatTimer,
  };
}
