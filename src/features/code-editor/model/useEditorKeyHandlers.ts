import React, { useCallback } from "react";
import { IntelliSenseState, type AppliedCompletion } from "./useIntelliSense";
import { CodeHistoryState, type HistoryEntry } from "./useCodeHistory";
import { MultiCursorState } from "./useMultiCursor";
import type { ApplyEdit } from "./types";
import {
  handleMarkupKey,
  handleLineMovement,
  handleCommentShortcuts,
  handleEnterKey,
  handlePairsAndBackspace,
  matchesKey,
} from "../lib/editor-key-helpers";
import { handleTabKey } from "../lib/tab-key";
import { handleLineCommands } from "../lib/line-key-handlers";
import { TAB_SIZE } from "../lib/editor-utils";

export interface EditorKeyHandlersProps {
  code: string;
  applyEdit: ApplyEdit;
  /** Applies an undo/redo entry without recording a new history step. */
  restoreEntry: (entry: HistoryEntry | null) => void;
  /** Applies an accepted completion; defaults to a plain edit. */
  applyCompletion?: (applied: AppliedCompletion) => void;
  /** Moves between snippet fields; returns false when no snippet is active. */
  jumpToTabStop?: (direction: 1 | -1) => boolean;
  intelliSense: IntelliSenseState;
  history: CodeHistoryState;
  multiCursor?: MultiCursorState;
  onRun?: () => void;
  tabSize?: number;
  /** Wrapped lines have visual rows: Home then keeps its native, per-row behaviour. */
  wordWrap?: boolean;
  readOnly?: boolean;
  filepath?: string;
}

const isModKey = (e: React.KeyboardEvent, code: string): boolean =>
  (e.metaKey || e.ctrlKey) && matchesKey(e, code);

const handleUndoRedo = (
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

const handleMultiSelectionShortcuts = (
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

const handleIntelliSenseKey = (
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

export const useEditorKeyHandlers = ({
  code,
  applyEdit,
  restoreEntry,
  applyCompletion,
  jumpToTabStop,
  intelliSense,
  history,
  multiCursor,
  onRun,
  tabSize = TAB_SIZE,
  wordWrap = false,
  readOnly = false,
  filepath = "main.jsx",
}: EditorKeyHandlersProps): {
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
} => {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
      const textarea = e.currentTarget;
      // Safari reports the Enter that commits an IME composition with `isComposing` already
      // false but keyCode 229.
      if (e.nativeEvent?.isComposing || e.key === "Process" || e.keyCode === 229) return;
      history.captureCursor(textarea.selectionStart);

      // 1. Run shortcut (Cmd/Ctrl + Enter; with Shift it opens a line above)
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key === "Enter") {
        e.preventDefault();
        onRun?.();
        return;
      }

      // 2. Multi-selection commands (Cmd/Ctrl+D, Cmd/Ctrl+Shift+L)
      if (handleMultiSelectionShortcuts(e, textarea, code, multiCursor)) {
        return;
      }

      if (readOnly) {
        if (e.altKey && (e.key === "ArrowUp" || e.key === "ArrowDown")) e.preventDefault();
        return;
      }

      // 3. Multi-cursor active typing / backspace / delete / navigation
      // An open completion list owns Escape before the extra cursors do.
      const completionOwnsKey = e.key === "Escape" && intelliSense.isOpen;
      if (
        multiCursor?.hasMultipleCursors &&
        !completionOwnsKey &&
        multiCursor.handleMultiKeyDown(e, code, applyEdit)
      ) {
        return;
      }

      // 4. Undo / Redo Shortcuts
      if (handleUndoRedo(e, code, history, restoreEntry)) {
        return;
      }

      // Delete / insert line, indent, Smart Home
      if (handleLineCommands(e, textarea, code, applyEdit, tabSize, { smartHome: !wordWrap })) {
        return;
      }

      // 5. Move / Duplicate Lines (VS Code: Alt/Option + ArrowUp/ArrowDown)
      if (handleLineMovement(e, textarea, code, applyEdit, intelliSense, readOnly)) {
        return;
      }

      // 6. Comment Shortcuts (VS Code: Cmd/Ctrl + /, Shift + Alt/Option + A)
      if (handleCommentShortcuts(e, textarea, code, applyEdit, intelliSense, filepath, readOnly)) {
        return;
      }

      if (handleMarkupKey(e, textarea, code, applyEdit, filepath, tabSize)) {
        intelliSense.closeCompletions();
        return;
      }
      // Ctrl/Cmd+Shift+Space belongs to parameter hints.
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.code === "Space") {
        e.preventDefault();
        intelliSense.openCompletions(code, textarea.selectionStart, textarea, true);
        return;
      }

      // 7. IntelliSense navigation and dismissal
      const acceptCompletion =
        applyCompletion ??
        ((applied: AppliedCompletion) =>
          applyEdit(applied.newCode, applied.newCursor, applied.newSelectionEnd));
      if (handleIntelliSenseKey(e, textarea, code, acceptCompletion, intelliSense)) {
        return;
      }

      // 8. Snippet fields (Tab / Shift+Tab)
      if (e.key === "Tab" && jumpToTabStop?.(e.shiftKey ? -1 : 1)) {
        e.preventDefault();
        return;
      }

      // 9. Tab key indentation
      if (handleTabKey(e, textarea, code, applyEdit, tabSize)) {
        return;
      }

      // 10. Enter key auto-indentation
      if (handleEnterKey(e, textarea, code, applyEdit, tabSize)) {
        return;
      }

      // 11. Matching Pair Insertion & Deletion
      handlePairsAndBackspace(e, textarea, code, applyEdit, filepath);
    },
    [
      code,
      applyEdit,
      restoreEntry,
      applyCompletion,
      jumpToTabStop,
      intelliSense,
      history,
      multiCursor,
      onRun,
      tabSize,
      wordWrap,
      readOnly,
      filepath,
    ]
  );

  return { handleKeyDown };
};
