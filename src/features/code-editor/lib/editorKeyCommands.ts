import React from "react";
import type { CodeHistoryState, HistoryEntry } from "../model/useCodeHistory";
import type { AppliedCompletion, IntelliSenseState } from "../model/useIntelliSense";
import type { MultiCursorState } from "../model/useMultiCursor";
import { matchesKey } from "./editorKeyHelpers";

const isModKey = (e: React.KeyboardEvent, code: string): boolean =>
  (e.metaKey || e.ctrlKey) && matchesKey(e, code);

export const handleUndoRedo = (
  e: React.KeyboardEvent<HTMLTextAreaElement>,
  code: string,
  history: CodeHistoryState,
  restoreEntry: (entry: HistoryEntry | null) => void
): boolean => {
  const isRedo = isModKey(e, "KeyY") || (isModKey(e, "KeyZ") && e.shiftKey);
  if (!isRedo && !isModKey(e, "KeyZ")) return false;

  e.preventDefault();
  restoreEntry(isRedo ? history.redo(code) : history.undo(code));
  return true;
};

export const handleMultiSelectionShortcuts = (
  e: React.KeyboardEvent<HTMLTextAreaElement>,
  textarea: HTMLTextAreaElement,
  code: string,
  multiCursor?: MultiCursorState
): boolean => {
  if (!multiCursor) return false;

  // Cmd+D (Mac) / Ctrl+D (Windows/Linux) / Alt+D: Select next match
  if ((e.metaKey || e.ctrlKey || e.altKey) && !e.shiftKey && matchesKey(e, "KeyD")) {
    e.preventDefault();
    e.stopPropagation();
    multiCursor.addNextMatch(code, textarea.selectionStart, textarea.selectionEnd, textarea);
    return true;
  }

  // Cmd+Shift+L / Ctrl+Shift+L: Select all matches
  if (isModKey(e, "KeyL") && e.shiftKey) {
    e.preventDefault();
    e.stopPropagation();
    multiCursor.selectAllMatches(code, textarea.selectionStart, textarea.selectionEnd, textarea);
    return true;
  }

  return false;
};

export const handleIntelliSenseKey = (
  e: React.KeyboardEvent<HTMLTextAreaElement>,
  textarea: HTMLTextAreaElement,
  code: string,
  applyCompletion: (applied: AppliedCompletion) => void,
  intelliSense: IntelliSenseState
): boolean => {
  if (!intelliSense.isOpen) return false;

  if (e.key === "ArrowDown") {
    e.preventDefault();
    intelliSense.selectNext();
    return true;
  }
  if (e.key === "ArrowUp") {
    e.preventDefault();
    intelliSense.selectPrev();
    return true;
  }
  if (e.key === "Enter" || (e.key === "Tab" && !e.shiftKey)) {
    e.preventDefault();
    const applied = intelliSense.applySelected(code, textarea.selectionStart);
    if (applied) applyCompletion(applied);
    return true;
  }
  if (e.key === "Escape") {
    e.preventDefault();
    intelliSense.closeCompletions();
    return true;
  }
  if (
    e.key === "ArrowLeft" ||
    e.key === "ArrowRight" ||
    e.key === "Home" ||
    e.key === "End" ||
    e.key === "PageUp" ||
    e.key === "PageDown"
  ) {
    setTimeout(() => {
      intelliSense.handleCursorMove(code, textarea.selectionStart, textarea);
    }, 0);
  }
  return false;
};
