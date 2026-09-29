import React from "react";
import { CodeHistoryState } from "../model/useCodeHistory";
import { changeLineIndentation } from "./line-operations";

export const handleTabKey = (
  e: React.KeyboardEvent<HTMLTextAreaElement>,
  textarea: HTMLTextAreaElement,
  code: string,
  onChange: (newCode: string) => void,
  history: CodeHistoryState,
  tabSize: number
): boolean => {
  if (e.key !== "Tab" || e.ctrlKey || e.metaKey || e.altKey) return false;

  e.preventDefault();
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const indentStr = " ".repeat(tabSize);

  if (start === end && !e.shiftKey) {
    const newCode = code.substring(0, start) + indentStr + code.substring(end);
    const nextCursor = start + tabSize;
    onChange(newCode);
    history.pushHistory(newCode, nextCursor);
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = nextCursor;
    }, 0);
  } else {
    const result = changeLineIndentation(
      code,
      start,
      end,
      tabSize,
      e.shiftKey ? "outdent" : "indent"
    );
    if (result.changed) {
      onChange(result.newCode);
      history.pushHistory(result.newCode, result.newSelectionEnd);
      const selectionDirection = textarea.selectionDirection;
      setTimeout(() => {
        textarea.setSelectionRange(
          result.newSelectionStart,
          result.newSelectionEnd,
          selectionDirection
        );
      }, 0);
    }
  }
  return true;
};
