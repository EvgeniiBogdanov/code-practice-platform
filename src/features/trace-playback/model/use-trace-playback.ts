import {
  getInitialPlaybackSpeed,
  persistPlaybackSpeed,
  PLAYBACK_SPEEDS,
  PLAYBACK_SPEED_STORAGE_KEY,
} from "../config/playback-speeds";
import { useCallback, useEffect, useReducer, useState } from "react";

export interface PlaybackState {
  readonly index: number;
  readonly playing: boolean;
  readonly speed: number;
}
export type PlaybackAction =
  | { type: "toggle"; length: number }
  | { type: "seek"; index: number; length: number }
  | { type: "tick"; length: number }
  | { type: "pause" }
  | { type: "speed"; speed: number };

export const playbackReducer = (state: PlaybackState, action: PlaybackAction): PlaybackState => {
  switch (action.type) {
    case "pause":
      return { ...state, playing: false };
    case "speed":
      return PLAYBACK_SPEEDS.includes(action.speed) ? { ...state, speed: action.speed } : state;
    case "seek":
      return {
        ...state,
        index: Math.max(0, Math.min(action.length - 1, Math.trunc(action.index) || 0)),
        playing: false,
      };
    case "toggle":
      return {
        ...state,
        index: state.index >= action.length - 1 ? 0 : state.index,
        playing: !state.playing && action.length > 1,
      };
    case "tick": {
      if (!state.playing) return state;
      const index = Math.min(state.index + 1, action.length - 1);
      return { ...state, index, playing: index < action.length - 1 };
    }
  }
};

export interface TracePlayback extends PlaybackState {
  readonly reducedMotion: boolean;
  readonly toggle: () => void;
  readonly seek: (index: number) => void;
  readonly setSpeed: (speed: number) => void;
}

export const useTracePlayback = (length: number, isActive = true): TracePlayback => {
  const [state, dispatch] = useReducer(playbackReducer, undefined, (): PlaybackState => ({
    index: 0,
    playing: false,
    speed: getInitialPlaybackSpeed(),
  }));
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const changed = (): void => {
      setReducedMotion(media.matches);
      dispatch({ type: "pause" });
    };
    media.addEventListener("change", changed);
    return (): void => media.removeEventListener("change", changed);
  }, []);
  useEffect(() => {
    if (!isActive) dispatch({ type: "pause" });
  }, [isActive]);
  useEffect(() => {
    if (!state.playing || !isActive) return;
    const timer = window.setTimeout(() => dispatch({ type: "tick", length }), 1900 / state.speed);
    return (): void => window.clearTimeout(timer);
  }, [state.index, state.playing, state.speed, length, isActive]);
  useEffect(() => {
    const pauseWhenHidden = (): void => {
      if (document.hidden) dispatch({ type: "pause" });
    };
    document.addEventListener("visibilitychange", pauseWhenHidden);
    return (): void => document.removeEventListener("visibilitychange", pauseWhenHidden);
  }, []);
  useEffect(() => {
    const handleStorage = (event: StorageEvent): void => {
      if (event.key === PLAYBACK_SPEED_STORAGE_KEY && event.newValue) {
        const parsed = Number(event.newValue);
        if (PLAYBACK_SPEEDS.includes(parsed)) {
          dispatch({ type: "speed", speed: parsed });
        }
      }
    };
    window.addEventListener("storage", handleStorage);
    return (): void => window.removeEventListener("storage", handleStorage);
  }, []);
  const toggle = useCallback((): void => dispatch({ type: "toggle", length }), [length]);
  const seek = useCallback(
    (index: number): void => dispatch({ type: "seek", index, length }),
    [length]
  );
  const setSpeed = useCallback((speed: number): void => {
    persistPlaybackSpeed(speed);
    dispatch({ type: "speed", speed });
  }, []);
  return { ...state, reducedMotion, toggle, seek, setSpeed };
};
