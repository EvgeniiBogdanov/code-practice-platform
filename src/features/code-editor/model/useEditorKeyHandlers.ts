import React, { useCallback, type RefObject } from "react";
import { IntelliSenseState, type AppliedCompletion } from "./useIntelliSense";
import { CodeHistoryState, type HistoryEntry } from "./useCodeHistory";
import { MultiCursorState } from "./useMultiCursor";
import type { FindReplaceState } from "./useFindReplace";
import type { HoverSignaturesState } from "./useHoverSignatures";
import type { SignatureHelpState } from "./useSignatureHelp";
import type { ApplyEdit } from "./types";
import {
  handleMarkupKey,
  handleLineMovement,
  handleCommentShortcuts,
  handleEnterKey,
  handlePairsAndBackspace,
  matchesKey,
} from "../lib/editorKeyHelpers";
import { handleTabKey } from "../lib/tabKey";
import {
  handleIntelliSenseKey,
  handleMultiSelectionShortcuts,
  handleUndoRedo,
} from "../lib/editorKeyCommands";
import { handleLineCommands } from "../lib/lineKeyHandlers";
import { TAB_SIZE } from "../lib/editorUtils";

const MODIFIER_KEYS = new Set(["Shift", "Control", "Alt", "Meta"]);

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
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  find: Pick<FindReplaceState, "handleShortcut">;
  signatureHelp: Pick<SignatureHelpState, "signature" | "trigger" | "close">;
  hoverSignatures: Pick<HoverSignaturesState, "closeHover">;
  firstQuickFixRef: RefObject<HTMLButtonElement | null>;
  goToDefinition: (position: number) => Promise<void>;
  goToProblem: (direction: 1 | -1) => void;
  toggleWordWrap: () => void;
  onFormat: () => Promise<void>;
  onRename: () => Promise<void>;
  updateCursorCoords: () => void;
}

export interface EditorKeyHandlers {
  /** Keys typed into the textarea. */
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  /** Keys from other controls inside the editor, such as the find bar. */
  handleOverlayKeyDown: (e: React.KeyboardEvent<HTMLElement>) => void;
}

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
  textareaRef,
  find,
  signatureHelp,
  hoverSignatures,
  firstQuickFixRef,
  goToDefinition,
  goToProblem,
  toggleWordWrap,
  onFormat,
  onRename,
  updateCursorCoords,
}: EditorKeyHandlersProps): EditorKeyHandlers => {
  /** Editor-wide commands. Escape is ordered by runEscape, not here. */
  const runCommand = useCallback(
    (e: React.KeyboardEvent<HTMLElement>): boolean => {
      if (e.key === "Escape") return false;
      if (e.altKey && !e.shiftKey && !e.metaKey && !e.ctrlKey && matchesKey(e, "KeyZ")) {
        e.preventDefault();
        toggleWordWrap();
        return true;
      }
      if (e.altKey && e.shiftKey && !e.metaKey && !e.ctrlKey && matchesKey(e, "KeyF")) {
        e.preventDefault();
        void onFormat();
        return true;
      }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.code === "Space") {
        e.preventDefault();
        signatureHelp.trigger();
        return true;
      }
      if (e.key === "F12" && textareaRef.current) {
        e.preventDefault();
        void goToDefinition(textareaRef.current.selectionStart);
        return true;
      }
      if (e.key === "F8" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        goToProblem(e.shiftKey ? -1 : 1);
        return true;
      }
      // Cmd/Ctrl+. moves focus to the quick fixes, as VS Code opens its light bulb.
      if ((e.metaKey || e.ctrlKey) && e.code === "Period" && firstQuickFixRef.current) {
        e.preventDefault();
        firstQuickFixRef.current.focus();
        return true;
      }
      // Find, replace, go to line (Cmd/Ctrl+F, Cmd/Ctrl+H, Ctrl+G, F3).
      return find.handleShortcut(e);
    },
    [
      toggleWordWrap,
      onFormat,
      signatureHelp,
      textareaRef,
      goToDefinition,
      goToProblem,
      firstQuickFixRef,
      find,
    ]
  );

  /** One Escape closes one widget: a parameter hint, then the find panel. */
  const runEscape = useCallback(
    (e: React.KeyboardEvent<HTMLElement>): boolean => {
      if (e.key !== "Escape") return false;
      // A handler that already took the key (such as the find bar's own Escape) keeps it.
      if (!e.defaultPrevented && signatureHelp.signature) {
        e.preventDefault();
        signatureHelp.close();
        return true;
      }
      return find.handleShortcut(e);
    },
    [signatureHelp, find]
  );

  const handleOverlayKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>): void => {
      // The textarea's keys are handled by handleKeyDown; they bubble through here too.
      if (e.target instanceof HTMLTextAreaElement) return;
      if (!MODIFIER_KEYS.has(e.key)) hoverSignatures.closeHover();
      if (runCommand(e)) return;
      runEscape(e);
    },
    [hoverSignatures, runCommand, runEscape]
  );

  const handleTextareaKey = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
      const textarea = e.currentTarget;
      if (!MODIFIER_KEYS.has(e.key)) hoverSignatures.closeHover();
      if (e.key === "F2" && !readOnly) {
        e.preventDefault();
        void onRename();
        return;
      }
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

      // 3. Editor-wide commands; they also work in read-only mode
      if (runCommand(e)) return;

      if (readOnly) {
        if (e.altKey && (e.key === "ArrowUp" || e.key === "ArrowDown")) e.preventDefault();
        runEscape(e);
        return;
      }

      // 4. Multi-cursor active typing / backspace / delete / navigation
      // An open completion list owns Escape before the extra cursors do.
      const completionOwnsKey = e.key === "Escape" && intelliSense.isOpen;
      if (
        multiCursor?.hasMultipleCursors &&
        !completionOwnsKey &&
        multiCursor.handleMultiKeyDown(e, code, applyEdit)
      ) {
        return;
      }

      // 5. Undo / Redo Shortcuts
      if (handleUndoRedo(e, code, history, restoreEntry)) {
        return;
      }

      // Delete / insert line, indent, Smart Home
      if (handleLineCommands(e, textarea, code, applyEdit, tabSize, { smartHome: !wordWrap })) {
        return;
      }

      // 6. Move / Duplicate Lines (VS Code: Alt/Option + ArrowUp/ArrowDown)
      if (handleLineMovement(e, textarea, code, applyEdit, intelliSense, readOnly)) {
        return;
      }

      // 7. Comment Shortcuts (VS Code: Cmd/Ctrl + /, Shift + Alt/Option + A)
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

      // 8. IntelliSense navigation and dismissal
      const acceptCompletion =
        applyCompletion ??
        ((applied: AppliedCompletion) =>
          applyEdit(applied.newCode, applied.newCursor, applied.newSelectionEnd));
      if (handleIntelliSenseKey(e, textarea, code, acceptCompletion, intelliSense)) {
        return;
      }

      // 9. Escape closes the parameter hint or find panel once no completion list took it
      if (runEscape(e)) return;

      // 10. Snippet fields (Tab / Shift+Tab)
      if (e.key === "Tab" && jumpToTabStop?.(e.shiftKey ? -1 : 1)) {
        e.preventDefault();
        return;
      }

      // 11. Tab key indentation
      if (handleTabKey(e, textarea, code, applyEdit, tabSize)) {
        return;
      }

      // 12. Enter key auto-indentation
      if (handleEnterKey(e, textarea, code, applyEdit, tabSize)) {
        return;
      }

      // 13. Matching Pair Insertion & Deletion
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
      onRename,
      tabSize,
      wordWrap,
      readOnly,
      filepath,
      hoverSignatures,
      runCommand,
      runEscape,
    ]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
      handleTextareaKey(e);
      // The caret moves after the browser applies the key, so it is read one tick later.
      setTimeout(updateCursorCoords, 0);
    },
    [handleTextareaKey, updateCursorCoords]
  );

  return { handleKeyDown, handleOverlayKeyDown };
};
