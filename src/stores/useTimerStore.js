import { create } from "zustand";

let timerInterval = null;

export const useTimerStore = create((set, get) => ({
  timerSeconds: null,
  timerRunning: false,

  startTimer: (minutes) => {
    if (timerInterval) {
      clearInterval(timerInterval);
    }

    const totalSeconds = minutes * 60;
    set({ timerSeconds: totalSeconds, timerRunning: true });

    timerInterval = setInterval(() => {
      const current = get().timerSeconds;
      if (current === null || current <= 1) {
        clearInterval(timerInterval);
        timerInterval = null;
        set({ timerSeconds: 0, timerRunning: false });
      } else {
        set({ timerSeconds: current - 1 });
      }
    }, 1000);
  },

  stopTimer: () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    set({ timerRunning: false });
  },

  resetTimer: () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    set({ timerSeconds: null, timerRunning: false });
  },

  setTimerSeconds: (secondsOrFn) => {
    const nextSeconds =
      typeof secondsOrFn === "function"
        ? secondsOrFn(get().timerSeconds)
        : secondsOrFn;

    if (nextSeconds === null && timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    set({ timerSeconds: nextSeconds });
  },

  setTimerRunning: (runningOrFn) => {
    const isRunning =
      typeof runningOrFn === "function"
        ? runningOrFn(get().timerRunning)
        : runningOrFn;

    if (!isRunning && timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    } else if (isRunning && !timerInterval && (get().timerSeconds || 0) > 0) {
      timerInterval = setInterval(() => {
        const current = get().timerSeconds;
        if (current === null || current <= 1) {
          clearInterval(timerInterval);
          timerInterval = null;
          set({ timerSeconds: 0, timerRunning: false });
        } else {
          set({ timerSeconds: current - 1 });
        }
      }, 1000);
    }
    set({ timerRunning: isRunning });
  },

  formatTimer: (totalSec) => {
    if (totalSec === null || totalSec === undefined) return "";
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  },
}));
