import { useCallback, useEffect, useRef, useState } from "react";

interface HistoryEntry {
  code: string;
  cursor: number;
}

interface InputEdit {
  inputType: string;
  data: string | null;
}

type InputKind = "insert" | "backspace" | "delete";

interface HistoryState {
  entries: HistoryEntry[];
  index: number;
  lastInput: { type: InputKind; cursor: number; at: number } | null;
}

export interface CodeHistoryState {
  canUndo: boolean;
  canRedo: boolean;
  captureCursor: (cursor: number) => void;
  pushHistory: (code: string, cursorPosition?: number, input?: InputEdit) => void;
  undo: (currentCode: string) => HistoryEntry | null;
  redo: (currentCode: string) => HistoryEntry | null;
  resetHistory: (initialCode: string) => void;
}

const MAX_HISTORY = 100;
const GROUP_DELAY = 1000;
const WORD_CHARACTER = /^[\p{L}\p{N}_$]+$/u;

const getInputKind = (
  previous: HistoryEntry,
  code: string,
  cursor: number,
  input?: InputEdit
): InputKind | null => {
  if (!input) return null;
  if (input.inputType === "insertText" && input.data && WORD_CHARACTER.test(input.data)) {
    const start = cursor - input.data.length;
    if (
      start >= 0 &&
      code === previous.code.slice(0, start) + input.data + previous.code.slice(start)
    ) {
      return "insert";
    }
  }
  if (input.inputType === "deleteContentBackward") {
    if (code === previous.code.slice(0, cursor) + previous.code.slice(cursor + 1)) {
      return "backspace";
    }
  }
  if (input.inputType === "deleteContentForward") {
    if (code === previous.code.slice(0, cursor) + previous.code.slice(cursor + 1)) {
      return "delete";
    }
  }
  return null;
};

export function useCodeHistory(initialCode = ""): CodeHistoryState {
  const state = useRef<HistoryState>({
    entries: [{ code: initialCode, cursor: 0 }],
    index: 0,
    lastInput: null,
  });
  const [, setRevision] = useState(0);
  const notify = useCallback((): void => setRevision((revision) => revision + 1), []);

  const resetHistory = useCallback(
    (code: string): void => {
      state.current = { entries: [{ code, cursor: 0 }], index: 0, lastInput: null };
      notify();
    },
    [notify]
  );

  // Parent-controlled replacements (reset, file switch, loaded draft) start a new history.
  useEffect(() => {
    if (state.current.entries[state.current.index].code !== initialCode) {
      resetHistory(initialCode);
    }
  }, [initialCode, resetHistory]);

  const pushHistory = useCallback(
    (code: string, cursor = 0, input?: InputEdit): void => {
      const current = state.current;
      const previous = current.entries[current.index];
      if (code === previous.code) return;

      const kind = getInputKind(previous, code, cursor, input);
      const now = Date.now();
      const last = current.lastInput;
      const joinsPrevious =
        kind !== null &&
        last?.type === kind &&
        now - last.at < GROUP_DELAY &&
        (kind === "insert"
          ? last.cursor === cursor - (input?.data?.length ?? 0)
          : kind === "backspace"
            ? last.cursor === cursor + 1
            : last.cursor === cursor);

      const entries = current.entries.slice(0, current.index + 1);
      if (joinsPrevious) {
        entries[entries.length - 1] = { code, cursor };
      } else {
        entries.push({ code, cursor });
        if (entries.length > MAX_HISTORY) entries.shift();
      }
      state.current = {
        entries,
        index: entries.length - 1,
        lastInput: kind ? { type: kind, cursor, at: now } : null,
      };
      notify();
    },
    [notify]
  );

  const captureCursor = useCallback((cursor: number): void => {
    state.current.entries[state.current.index].cursor = cursor;
  }, []);

  const undo = useCallback(
    (_currentCode: string): HistoryEntry | null => {
      const current = state.current;
      if (current.index === 0) return null;
      current.index -= 1;
      current.lastInput = null;
      notify();
      return current.entries[current.index];
    },
    [notify]
  );

  const redo = useCallback(
    (_currentCode: string): HistoryEntry | null => {
      const current = state.current;
      if (current.index === current.entries.length - 1) return null;
      current.index += 1;
      current.lastInput = null;
      notify();
      return current.entries[current.index];
    },
    [notify]
  );

  return {
    canUndo: state.current.index > 0,
    canRedo: state.current.index < state.current.entries.length - 1,
    captureCursor,
    pushHistory,
    undo,
    redo,
    resetHistory,
  };
}
