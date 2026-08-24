import React, { useCallback } from "react";
import { IntelliSenseState } from "./useIntelliSense";
import { CodeHistoryState } from "./useCodeHistory";
import { MultiCursorState } from "./useMultiCursor";
import {
  handleLineMovement,
  handleTabKey,
  handleEnterKey,
  handlePairsAndBackspace,
} from "../lib/editor-key-helpers";

export interface EditorKeyHandlersProps {
  code: string;
  onChange: (newCode: string) => void;
  intelliSense: IntelliSenseState;
  history: CodeHistoryState;
  multiCursor?: MultiCursorState;
  onRun?: () => void;
  tabSize?: number;
  readOnly?: boolean;
}

const handleUndoRedo = (
  e: React.KeyboardEvent<HTMLTextAreaElement>,
  textarea: HTMLTextAreaElement,
  code: string,
  onChange: (newCode: string) => void,
  history: CodeHistoryState
): boolean => {
  if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== "z") {
    return false;
  }

  e.preventDefault();
  if (e.shiftKey) {
    const redoRes = history.redo(code);
    if (redoRes) {
      onChange(redoRes.code);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = redoRes.cursor;
      }, 0);
    }
  } else {
    const undoRes = history.undo(code);
    if (undoRes) {
      onChange(undoRes.code);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = undoRes.cursor;
      }, 0);
    }
  }
  return true;
};

const handleMultiSelectionShortcuts = (
  e: React.KeyboardEvent<HTMLTextAreaElement>,
  textarea: HTMLTextAreaElement,
  code: string,
  multiCursor?: MultiCursorState
): boolean => {
  if (!multiCursor) return false;

  const keyLower = e.key.toLowerCase();

  // Cmd+D (Mac) / Ctrl+D (Windows/Linux) / Alt+D: Select next match
  const isCmdOrCtrlOrAltD =
    (e.metaKey || e.ctrlKey || e.altKey) && !e.shiftKey && keyLower === "d";

  if (isCmdOrCtrlOrAltD) {
    e.preventDefault();
    e.stopPropagation();
    multiCursor.addNextMatch(code, textarea.selectionStart, textarea.selectionEnd, textarea);
    return true;
  }

  // Cmd+Shift+L / Ctrl+Shift+L: Select all matches
  const isSelectAllMatches = (e.metaKey || e.ctrlKey) && e.shiftKey && keyLower === "l";
  if (isSelectAllMatches) {
    e.preventDefault();
    e.stopPropagation();
    multiCursor.selectAllMatches(code, textarea.selectionStart, textarea.selectionEnd, textarea);
    return true;
  }

  return false;
};

const handleIntelliSenseKey = (
  e: React.KeyboardEvent<HTMLTextAreaElement>,
  textarea: HTMLTextAreaElement,
  code: string,
  onChange: (newCode: string) => void,
  history: CodeHistoryState,
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
  if (e.key === "Enter" || e.key === "Tab") {
    e.preventDefault();
    const applied = intelliSense.applySelected(code, textarea.selectionStart);
    if (applied) {
      onChange(applied.newCode);
      history.pushHistory(applied.newCode, applied.newCursor);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = applied.newCursor;
      }, 0);
    }
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

export const useEditorKeyHandlers = ({
  code,
  onChange,
  intelliSense,
  history,
  multiCursor,
  onRun,
  tabSize = 2,
  readOnly = false,
}: EditorKeyHandlersProps): {
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
} => {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
      const textarea = e.currentTarget;

      // 1. Run shortcut (Cmd/Ctrl + Enter)
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        onRun?.();
        return;
      }

      // 2. Multi-selection commands (Cmd/Ctrl+D, Cmd/Ctrl+Shift+L)
      if (handleMultiSelectionShortcuts(e, textarea, code, multiCursor)) {
        return;
      }

      // 3. Multi-cursor active typing / backspace / delete / navigation
      if (multiCursor && multiCursor.hasMultipleCursors) {
        if (multiCursor.handleMultiKeyDown(e, code, onChange, history)) {
          return;
        }
      }

      // 4. Undo / Redo Shortcuts
      if (handleUndoRedo(e, textarea, code, onChange, history)) {
        return;
      }

      // 5. Move / Duplicate Lines (VS Code: Alt/Option + ArrowUp/ArrowDown)
      if (
        handleLineMovement(e, textarea, code, onChange, history, intelliSense, readOnly)
      ) {
        return;
      }

      // 6. IntelliSense navigation and dismissal
      if (handleIntelliSenseKey(e, textarea, code, onChange, history, intelliSense)) {
        return;
      }

      if (readOnly) {
        return;
      }

      // 7. Tab key indentation
      if (handleTabKey(e, textarea, code, onChange, history, tabSize)) {
        return;
      }

      // 8. Enter key auto-indentation
      if (handleEnterKey(e, textarea, code, onChange, history)) {
        return;
      }

      // 9. Matching Pair Insertion & Deletion
      handlePairsAndBackspace(e, textarea, code, onChange, history);
    },
    [code, onChange, intelliSense, history, multiCursor, onRun, tabSize, readOnly]
  );

  return { handleKeyDown };
};
