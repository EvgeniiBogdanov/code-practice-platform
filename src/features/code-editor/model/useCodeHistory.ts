import { useState, useCallback, useRef } from "react";

export interface CodeHistoryState {
  canUndo: boolean;
  canRedo: boolean;
  pushHistory: (code: string, cursorPosition?: number) => void;
  undo: (currentCode: string) => { code: string; cursor: number } | null;
  redo: (currentCode: string) => { code: string; cursor: number } | null;
  resetHistory: (initialCode: string) => void;
}

interface HistoryEntry {
  code: string;
  cursor: number;
}

const MAX_HISTORY = 100;

export function useCodeHistory(initialCode = ""): CodeHistoryState {
  const [undoStack, setUndoStack] = useState<HistoryEntry[]>([{ code: initialCode, cursor: 0 }]);
  const [redoStack, setRedoStack] = useState<HistoryEntry[]>([]);
  const lastPushedCode = useRef(initialCode);

  const pushHistory = useCallback((code: string, cursor = 0) => {
    if (code === lastPushedCode.current) return;
    lastPushedCode.current = code;

    setUndoStack((prev) => {
      const next = [...prev, { code, cursor }];
      if (next.length > MAX_HISTORY) next.shift();
      return next;
    });
    setRedoStack([]);
  }, []);

  const undo = useCallback(
    (currentCode: string) => {
      if (undoStack.length <= 1) return null;

      const currentEntry = undoStack[undoStack.length - 1];
      const prevEntry = undoStack[undoStack.length - 2];

      setRedoStack((prev) => [...prev, currentEntry]);
      setUndoStack((prev) => prev.slice(0, prev.length - 1));
      lastPushedCode.current = prevEntry.code;

      return prevEntry;
    },
    [undoStack]
  );

  const redo = useCallback(
    (currentCode: string) => {
      if (redoStack.length === 0) return null;

      const nextEntry = redoStack[redoStack.length - 1];

      setUndoStack((prev) => [...prev, nextEntry]);
      setRedoStack((prev) => prev.slice(0, prev.length - 1));
      lastPushedCode.current = nextEntry.code;

      return nextEntry;
    },
    [redoStack]
  );

  const resetHistory = useCallback((code: string) => {
    setUndoStack([{ code, cursor: 0 }]);
    setRedoStack([]);
    lastPushedCode.current = code;
  }, []);

  return {
    canUndo: undoStack.length > 1,
    canRedo: redoStack.length > 0,
    pushHistory,
    undo,
    redo,
    resetHistory,
  };
}
