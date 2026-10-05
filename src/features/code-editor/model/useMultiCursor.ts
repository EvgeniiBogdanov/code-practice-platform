import React, { useState, useCallback, useMemo, useRef } from "react";
import { getAutoCloseTagEdit } from "@/shared/lib/code-editor";
import {
  TextRange,
  findWordAtPosition,
  findAllMatches,
  findNextMatch,
  applyMultiTextInsert,
  type MultiEditResult,
  applyMultiBackspace,
  applyMultiDelete,
} from "../lib/multi-cursor-operations";
import type { ApplyEdit } from "./types";
import { producesText } from "../lib/editor-key-helpers";

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
  clearSelections: () => void;
  setSelections: React.Dispatch<React.SetStateAction<TextRange[]>>;
  handleMultiKeyDown: (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    code: string,
    applyEdit: ApplyEdit
  ) => boolean;
  handleMultiPaste: (pastedText: string, code: string, applyEdit: ApplyEdit) => boolean;
}

const NON_EDITING_KEYS = new Set(["Shift", "Control", "Alt", "AltGraph", "Meta", "CapsLock"]);
const isCopyShortcut = (e: React.KeyboardEvent): boolean =>
  (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "c";

export function useMultiCursor(filepath = "main.jsx"): MultiCursorState {
  const [selections, setSelections] = useState<TextRange[]>([]);
  const wholeWordRef = useRef(false);

  const commit = useCallback((res: MultiEditResult, applyEdit: ApplyEdit): void => {
    const cursor = res.newSelections.at(-1)?.start ?? 0;
    applyEdit(res.newCode, cursor);
    setSelections(res.newSelections);
  }, []);

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
          wholeWordRef.current = true;
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
      const continuesSelection = selections.some(
        (selection) => selection.start === currentStart && selection.end === currentEnd
      );
      if (!continuesSelection) wholeWordRef.current = false;
      const currentList = continuesSelection
        ? selections
        : [{ start: currentStart, end: currentEnd }];

      const next = findNextMatch(code, selectedText, currentList, true, wholeWordRef.current);
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
      let wholeWord = false;
      if (currentStart === currentEnd) {
        const wordInfo = findWordAtPosition(code, currentStart);
        if (wordInfo) {
          targetText = wordInfo.word;
          wholeWord = true;
        }
      } else {
        targetText = code.substring(currentStart, currentEnd);
        wholeWord =
          wholeWordRef.current &&
          selections.some(
            (selection) => selection.start === currentStart && selection.end === currentEnd
          );
      }

      if (!targetText) return;

      const all = findAllMatches(code, targetText, true, wholeWord);
      if (all.length > 0) {
        setSelections(all);
        if (textarea) {
          const last = all[all.length - 1];
          textarea.setSelectionRange(last.start, last.end);
        }
      }
    },
    [selections]
  );

  const clearSelections = useCallback((): void => {
    wholeWordRef.current = false;
    setSelections([]);
  }, []);

  const handleMultiKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>, code: string, applyEdit: ApplyEdit): boolean => {
      if (selections.length <= 1) return false;

      const textarea = e.currentTarget;

      if (e.key === "Escape") {
        e.preventDefault();
        setSelections([]);
        return true;
      }

      const wordOrLineEdit = e.ctrlKey || e.metaKey || e.altKey;
      if (wordOrLineEdit && (e.key === "Backspace" || e.key === "Delete")) {
        clearSelections();
        return false;
      }

      if (e.key === "Backspace") {
        e.preventDefault();
        const res = applyMultiBackspace(code, selections);
        if (res.changed) commit(res, applyEdit);
        return true;
      }

      if (e.key === "Delete") {
        e.preventDefault();
        const res = applyMultiDelete(code, selections);
        if (res.changed) commit(res, applyEdit);
        return true;
      }

      if (e.key === "Enter") {
        e.preventDefault();
        const res = applyMultiTextInsert(code, selections, "\n");
        if (res.changed) commit(res, applyEdit);
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

      if (producesText(e)) {
        e.preventDefault();
        const res = applyMultiTextInsert(code, selections, e.key);
        if (e.key === ">") {
          for (const cursor of [...res.newSelections].sort((a, b) => b.start - a.start)) {
            const edit = getAutoCloseTagEdit(res.newCode, cursor.start, filepath);
            if (!edit) continue;
            const added = edit.newCode.length - res.newCode.length;
            res.newCode = edit.newCode;
            res.newSelections = res.newSelections.map((selection) =>
              selection.start > cursor.start
                ? { start: selection.start + added, end: selection.end + added }
                : selection
            );
          }
        }
        if (res.changed) commit(res, applyEdit);
        return true;
      }

      // Anything else (Home/End/↑/↓, Tab, Ctrl+X, Ctrl+Backspace, …) acts on the main
      // caret only, so the extra cursors would be stale offsets: drop them, let it run.
      if (!NON_EDITING_KEYS.has(e.key) && !isCopyShortcut(e)) clearSelections();
      return false;
    },
    [selections, filepath, commit, clearSelections]
  );

  const handleMultiPaste = useCallback(
    (pastedText: string, code: string, applyEdit: ApplyEdit): boolean => {
      if (selections.length <= 1 || !pastedText) return false;

      const res = applyMultiTextInsert(code, selections, pastedText);
      if (res.changed) commit(res, applyEdit);
      return true;
    },
    [selections, commit]
  );

  return useMemo(
    () => ({
      selections,
      hasMultipleCursors: selections.length > 1,
      addNextMatch,
      selectAllMatches,
      clearSelections,
      setSelections,
      handleMultiKeyDown,
      handleMultiPaste,
    }),
    [
      selections,
      addNextMatch,
      selectAllMatches,
      clearSelections,
      handleMultiKeyDown,
      handleMultiPaste,
    ]
  );
}
