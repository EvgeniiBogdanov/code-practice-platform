import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createStore } from "zustand/vanilla";

export interface HistoryEntry {
  code: string;
  cursor: number;
}

interface InputEdit {
  inputType: string;
  data: string | null;
}

type InputKind = "insert" | "backspace" | "delete" | "composition";

interface HistoryState {
  entries: HistoryEntry[];
  index: number;
  lastInput: { type: InputKind; cursor: number; at: number } | null;
}

export interface CodeHistoryScope {
  taskKey: string;
  documentKey: string;
}

interface TaskHistoryStore {
  taskKey: string | null;
  documents: Record<string, HistoryState>;
  activateTask: (taskKey: string | null) => void;
  getDocument: (scope: CodeHistoryScope) => HistoryState | undefined;
  saveDocument: (scope: CodeHistoryScope, history: HistoryState) => void;
}

const taskHistoryStore = createStore<TaskHistoryStore>()((set, get) => ({
  taskKey: null,
  documents: {},
  activateTask: (taskKey) => {
    if (get().taskKey !== taskKey) set({ taskKey, documents: {} });
  },
  getDocument: ({ taskKey, documentKey }) =>
    get().taskKey === taskKey ? get().documents[documentKey] : undefined,
  saveDocument: ({ taskKey, documentKey }, history) => {
    if (get().taskKey !== taskKey) return;
    set((current) => ({ documents: { ...current.documents, [documentKey]: history } }));
  },
}));

export const activateCodeHistoryTask = (taskKey: string | null): void => {
  taskHistoryStore.getState().activateTask(taskKey);
};

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
  // Every keystroke of an IME composition rewrites the same preview text: one undo step.
  if (input.inputType === "insertCompositionText" || input.inputType === "insertFromComposition") {
    return "composition";
  }
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

export function useCodeHistory(initialCode = "", scope?: CodeHistoryScope): CodeHistoryState {
  const taskKey = scope?.taskKey;
  const documentKey = scope?.documentKey;
  const stored = scope && taskHistoryStore.getState().getDocument(scope);
  const initial: HistoryState = stored
    ? { ...stored, lastInput: null }
    : {
        entries: [{ code: initialCode, cursor: 0 }],
        index: 0,
        lastInput: null,
      };
  const state = useRef<HistoryState>(initial);
  // The ref is the source of truth for the handlers; the flags mirror it for rendering.
  const [canUndo, setCanUndo] = useState(initial.index > 0);
  const [canRedo, setCanRedo] = useState(initial.index < initial.entries.length - 1);
  const notify = useCallback((): void => {
    const { index, entries } = state.current;
    setCanUndo(index > 0);
    setCanRedo(index < entries.length - 1);
  }, []);
  const save = useCallback((): void => {
    if (taskKey !== undefined && documentKey !== undefined) {
      taskHistoryStore.getState().saveDocument({ taskKey, documentKey }, state.current);
    }
  }, [taskKey, documentKey]);

  const resetHistory = useCallback(
    (code: string): void => {
      state.current = { entries: [{ code, cursor: 0 }], index: 0, lastInput: null };
      save();
      notify();
    },
    [notify, save]
  );

  // Parent-controlled replacements (reset, loaded draft) start a new history.
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
        (kind === "composition" ||
          (kind === "insert"
            ? last.cursor === cursor - (input?.data?.length ?? 0)
            : kind === "backspace"
              ? last.cursor === cursor + 1
              : last.cursor === cursor));

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
      save();
      notify();
    },
    [notify, save]
  );

  const captureCursor = useCallback(
    (cursor: number): void => {
      const current = state.current;
      if (current.entries[current.index].cursor === cursor) return;
      const entries = [...current.entries];
      entries[current.index] = { ...entries[current.index], cursor };
      state.current = { ...current, entries };
      save();
    },
    [save]
  );

  const undo = useCallback(
    (_currentCode: string): HistoryEntry | null => {
      const current = state.current;
      if (current.index === 0) return null;
      state.current = { ...current, index: current.index - 1, lastInput: null };
      save();
      notify();
      return state.current.entries[state.current.index];
    },
    [notify, save]
  );

  const redo = useCallback(
    (_currentCode: string): HistoryEntry | null => {
      const current = state.current;
      if (current.index === current.entries.length - 1) return null;
      state.current = { ...current, index: current.index + 1, lastInput: null };
      save();
      notify();
      return state.current.entries[state.current.index];
    },
    [notify, save]
  );

  // A stable object: it is a dependency of most editor callbacks.
  return useMemo(
    () => ({ canUndo, canRedo, captureCursor, pushHistory, undo, redo, resetHistory }),
    [canUndo, canRedo, captureCursor, pushHistory, undo, redo, resetHistory]
  );
}
