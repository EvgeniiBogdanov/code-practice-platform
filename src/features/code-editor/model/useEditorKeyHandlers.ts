import React, { useCallback } from "react";
import { IntelliSenseState } from "./useIntelliSense";
import { CodeHistoryState } from "./useCodeHistory";

export interface EditorKeyHandlersProps {
  code: string;
  onChange: (newCode: string) => void;
  intelliSense: IntelliSenseState;
  history: CodeHistoryState;
  onRun?: () => void;
  tabSize?: number;
}

const MATCHING_PAIRS: Record<string, string> = {
  "(": ")",
  "[": "]",
  "{": "}",
  '"': '"',
  "'": "'",
  "`": "`",
};

const CLOSING_PAIRS = new Set([")", "]", "}", '"', "'", "`"]);

export function useEditorKeyHandlers({
  code,
  onChange,
  intelliSense,
  history,
  onRun,
  tabSize = 2,
}: EditorKeyHandlersProps) {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      // 1. Run shortcut (Cmd/Ctrl + Enter)
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        onRun?.();
        return;
      }

      // 2. Undo / Redo Shortcuts
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") {
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
        return;
      }

      // 3. IntelliSense navigation
      if (intelliSense.isOpen) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          intelliSense.selectNext();
          return;
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          intelliSense.selectPrev();
          return;
        }
        if (e.key === "Enter" || e.key === "Tab") {
          e.preventDefault();
          const applied = intelliSense.applySelected(code, start);
          if (applied) {
            onChange(applied.newCode);
            history.pushHistory(applied.newCode, applied.newCursor);
            setTimeout(() => {
              textarea.selectionStart = textarea.selectionEnd = applied.newCursor;
            }, 0);
          }
          return;
        }
        if (e.key === "Escape") {
          e.preventDefault();
          intelliSense.closeCompletions();
          return;
        }
      }

      // 4. Tab key indentation
      if (e.key === "Tab" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        const indentStr = " ".repeat(tabSize);

        if (start === end) {
          const newCode = code.substring(0, start) + indentStr + code.substring(end);
          const nextCursor = start + tabSize;
          onChange(newCode);
          history.pushHistory(newCode, nextCursor);
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = nextCursor;
          }, 0);
        }
        return;
      }

      // 5. Enter key auto-indentation
      if (e.key === "Enter") {
        const textBefore = code.substring(0, start);
        const lastLineStart = textBefore.lastIndexOf("\n") + 1;
        const currentLine = textBefore.substring(lastLineStart);
        const indentMatch = currentLine.match(/^(\s*)/);
        let indent = indentMatch ? indentMatch[1] : "";

        const prevChar = textBefore.trimEnd().slice(-1);
        const nextChar = code.charAt(end);

        if (prevChar === "{" || prevChar === "(" || prevChar === "[") {
          e.preventDefault();
          const extraIndent = indent + "  ";

          if ((prevChar === "{" && nextChar === "}") || (prevChar === "(" && nextChar === ")")) {
            const insertion = `\n${extraIndent}\n${indent}`;
            const newCode = code.substring(0, start) + insertion + code.substring(end);
            const nextCursor = start + 1 + extraIndent.length;
            onChange(newCode);
            history.pushHistory(newCode, nextCursor);
            setTimeout(() => {
              textarea.selectionStart = textarea.selectionEnd = nextCursor;
            }, 0);
            return;
          }

          const insertion = `\n${extraIndent}`;
          const newCode = code.substring(0, start) + insertion + code.substring(end);
          const nextCursor = start + insertion.length;
          onChange(newCode);
          history.pushHistory(newCode, nextCursor);
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = nextCursor;
          }, 0);
          return;
        }

        if (indent.length > 0) {
          e.preventDefault();
          const insertion = `\n${indent}`;
          const newCode = code.substring(0, start) + insertion + code.substring(end);
          const nextCursor = start + insertion.length;
          onChange(newCode);
          history.pushHistory(newCode, nextCursor);
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = nextCursor;
          }, 0);
          return;
        }
      }

      // 6. Matching Pair Insertion
      if (MATCHING_PAIRS[e.key] && !e.ctrlKey && !e.metaKey) {
        const closing = MATCHING_PAIRS[e.key];
        const nextChar = code.charAt(end);

        if (CLOSING_PAIRS.has(e.key) && nextChar === e.key && start === end) {
          e.preventDefault();
          textarea.selectionStart = textarea.selectionEnd = start + 1;
          return;
        }

        e.preventDefault();
        const selectedText = code.substring(start, end);
        const insertion = `${e.key}${selectedText}${closing}`;
        const newCode = code.substring(0, start) + insertion + code.substring(end);
        const nextCursor = start + 1;
        onChange(newCode);
        history.pushHistory(newCode, nextCursor);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = nextCursor;
        }, 0);
        return;
      }

      // 7. Backspace bracket pair deletion
      if (e.key === "Backspace" && start === end && start > 0) {
        const prevChar = code.charAt(start - 1);
        const nextChar = code.charAt(start);

        if (MATCHING_PAIRS[prevChar] === nextChar) {
          e.preventDefault();
          const newCode = code.substring(0, start - 1) + code.substring(start + 1);
          const nextCursor = start - 1;
          onChange(newCode);
          history.pushHistory(newCode, nextCursor);
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = nextCursor;
          }, 0);
        }
      }
    },
    [code, onChange, intelliSense, history, onRun, tabSize]
  );

  return { handleKeyDown };
}
