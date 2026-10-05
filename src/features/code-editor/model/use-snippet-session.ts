import { useCallback, useRef } from "react";
import type { TabStop } from "@/shared/lib/code-editor";

export interface SnippetSession {
  start: (stops: TabStop[], code: string) => void;
  /** Moves to the next/previous field; null when the session is over. */
  jump: (direction: 1 | -1, code: string, cursor: number) => TabStop | null;
  cancel: () => void;
}

interface SessionState {
  stops: TabStop[];
  index: number;
  /** Document length when the current field was entered. */
  length: number;
}

/**
 * VS Code snippet fields: Tab/Shift+Tab walk $1…$n and finish on $0. Typing is
 * assumed to happen inside the current field, so later fields shift by the
 * change in document length; leaving the field ends the session.
 */
export const useSnippetSession = (): SnippetSession => {
  const session = useRef<SessionState | null>(null);

  const cancel = useCallback((): void => {
    session.current = null;
  }, []);

  const start = useCallback((stops: TabStop[], code: string): void => {
    session.current = stops.length > 1 ? { stops, index: 0, length: code.length } : null;
  }, []);

  const jump = useCallback((direction: 1 | -1, code: string, cursor: number): TabStop | null => {
    const state = session.current;
    if (!state) return null;
    const delta = code.length - state.length;
    const current = state.stops[state.index];
    if (cursor < current.start || cursor > current.end + delta) {
      session.current = null;
      return null;
    }
    const stops = state.stops.map((stop, index) =>
      index < state.index
        ? stop
        : index === state.index
          ? { start: stop.start, end: stop.end + delta }
          : { start: stop.start + delta, end: stop.end + delta }
    );
    const index = Math.max(0, state.index + direction);
    // Reaching $0 (the last stop) finishes the snippet.
    session.current = index < stops.length - 1 ? { stops, index, length: code.length } : null;
    return stops[Math.min(index, stops.length - 1)];
  }, []);

  return { start, jump, cancel };
};
