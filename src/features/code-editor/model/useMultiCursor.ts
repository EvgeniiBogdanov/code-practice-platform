import React, { useState, useCallback } from "react";
import {
  TextRange,
  findWordAtPosition,
  findAllMatches,
  findNextMatch,
  applyMultiTextInsert,
  applyMultiBackspace,
  applyMultiDelete,
} from "../lib/multi-cursor-operations";
import { CodeHistoryState } from "./useCodeHistory";

export interface MultiCursorState {
  selections: TextRange[];
  hasMultipleCursors: boolean;
  addNextMatch: (
    code: string,
    currentStart: number,
    currentEnd: number,
    textarea?: HTMLTextAreaElement | null
  ) => void;
  selectAllMatches: (
    code: string,
    currentStart: number,
    currentEnd: number,
    textarea?: HTMLTextAreaElement | null
  ) => void;
  undoLastSelection: () => void;
  clearSelections: () => void;
  setSelections: React.Dispatch<React.SetStateAction<TextRange[]>>;
  handleMultiKeyDown: (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    code: string,
    onChange: (newCode: string) => void,
    history: CodeHistoryState
  ) => boolean;
  handleMultiPaste: (
    pastedText: string,
    code: string,
    onChange: (newCode: string) => void,
    history: CodeHistoryState,
    textarea?: HTMLTextAreaElement | null
  ) => boolean;
}

export function useMultiCursor(): MultiCursorState {
  const [selections, setSelections] = useState<TextRange[]>([]);

  const addNextMatch = useCallback(
    (
      code: string,
      currentStart: number,
      currentEnd: number,
      textarea?: HTMLTextAreaElement | null
    ): void => {
      // Case 1: Cursor is collapsed (no selection) -> Select word under cursor
      if (currentStart === currentEnd) {
        const wordInfo = findWordAtPosition(code, currentStart);
        if (wordInfo) {
          const initialSelection = [{ start: wordInfo.start, end: wordInfo.end }];
          setSelections(initialSelection);
          if (textarea) {
            textarea.setSelectionRange(wordInfo.start, wordInfo.end);
          }
        }
        return;
      }

      // Case 2: Text is already selected -> Find and add next match
      const selectedText = code.substring(currentStart, currentEnd);
      const currentList =
        selections.length > 0 ? selections : [{ start: currentStart, end: currentEnd }];

      const next = findNextMatch(code, selectedText, currentList);
      if (next) {
        const updated = [...currentList, next];
        setSelections(updated);
        if (textarea) {
          textarea.setSelectionRange(next.start, next.end);
        }
      }
    },
    [selections]
  );

  const selectAllMatches = useCallback(
    (
      code: string,
      currentStart: number,
      currentEnd: number,
      textarea?: HTMLTextAreaElement | null
    ): void => {
      let targetText = "";
      if (currentStart === currentEnd) {
        const wordInfo = findWordAtPosition(code, currentStart);
        if (wordInfo) {
          targetText = wordInfo.word;
        }
      } else {
        targetText = code.substring(currentStart, currentEnd);
      }

      if (!targetText) return;

      const all = findAllMatches(code, targetText);
      if (all.length > 0) {
        setSelections(all);
        if (textarea) {
          const last = all[all.length - 1];
          textarea.setSelectionRange(last.start, last.end);
        }
      }
    },
    []
  );

  const undoLastSelection = useCallback((): void => {
    setSelections((prev) => (prev.length > 1 ? prev.slice(0, prev.length - 1) : []));
  }, []);

  const clearSelections = useCallback((): void => {
    setSelections([]);
  }, []);

  const handleMultiKeyDown = useCallback(
    (
      e: React.KeyboardEvent<HTMLTextAreaElement>,
      code: string,
      onChange: (newCode: string) => void,
      history: CodeHistoryState
    ): boolean => {
      if (selections.length <= 1) return false;

      const textarea = e.currentTarget;

      if (e.key === "Escape") {
        e.preventDefault();
        setSelections([]);
        return true;
      }

      if (e.key === "Backspace") {
        e.preventDefault();
        const res = applyMultiBackspace(code, selections);
        if (res.changed) {
          onChange(res.newCode);
          const cursor = res.newSelections[res.newSelections.length - 1]?.start || 0;
          history.pushHistory(res.newCode, cursor);
          setSelections(res.newSelections);
          setTimeout(() => {
            textarea.setSelectionRange(cursor, cursor);
          }, 0);
        }
        return true;
      }

      if (e.key === "Delete") {
        e.preventDefault();
        const res = applyMultiDelete(code, selections);
        if (res.changed) {
          onChange(res.newCode);
          const cursor = res.newSelections[res.newSelections.length - 1]?.start || 0;
          history.pushHistory(res.newCode, cursor);
          setSelections(res.newSelections);
          setTimeout(() => {
            textarea.setSelectionRange(cursor, cursor);
          }, 0);
        }
        return true;
      }

      if (e.key === "Enter") {
        e.preventDefault();
        const res = applyMultiTextInsert(code, selections, "\n");
        if (res.changed) {
          onChange(res.newCode);
          const cursor = res.newSelections[res.newSelections.length - 1]?.start || 0;
          history.pushHistory(res.newCode, cursor);
          setSelections(res.newSelections);
          setTimeout(() => {
            textarea.setSelectionRange(cursor, cursor);
          }, 0);
        }
        return true;
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        const collapsed = selections.map((s) => ({ start: s.start, end: s.start }));
        setSelections(collapsed);
        const last = collapsed[collapsed.length - 1];
        if (last) {
          textarea.setSelectionRange(last.start, last.end);
        }
        return true;
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        const collapsed = selections.map((s) => ({ start: s.end, end: s.end }));
        setSelections(collapsed);
        const last = collapsed[collapsed.length - 1];
        if (last) {
          textarea.setSelectionRange(last.start, last.end);
        }
        return true;
      }

      if (!e.ctrlKey && !e.metaKey && !e.altKey && e.key.length === 1) {
        e.preventDefault();
        const res = applyMultiTextInsert(code, selections, e.key);
        if (res.changed) {
          onChange(res.newCode);
          const cursor = res.newSelections[res.newSelections.length - 1]?.start || 0;
          history.pushHistory(res.newCode, cursor);
          setSelections(res.newSelections);
          setTimeout(() => {
            textarea.setSelectionRange(cursor, cursor);
          }, 0);
        }
        return true;
      }

      return false;
    },
    [selections]
  );

  const handleMultiPaste = useCallback(
    (
      pastedText: string,
      code: string,
      onChange: (newCode: string) => void,
      history: CodeHistoryState,
      textarea?: HTMLTextAreaElement | null
    ): boolean => {
      if (selections.length <= 1 || !pastedText) return false;

      const res = applyMultiTextInsert(code, selections, pastedText);
      if (res.changed) {
        onChange(res.newCode);
        const cursor = res.newSelections[res.newSelections.length - 1]?.start || 0;
        history.pushHistory(res.newCode, cursor);
        setSelections(res.newSelections);
        if (textarea) {
          setTimeout(() => {
            textarea.setSelectionRange(cursor, cursor);
          }, 0);
        }
      }
      return true;
    },
    [selections]
  );

  return {
    selections,
    hasMultipleCursors: selections.length > 1,
    addNextMatch,
    selectAllMatches,
    undoLastSelection,
    clearSelections,
    setSelections,
    handleMultiKeyDown,
    handleMultiPaste,
  };
}
