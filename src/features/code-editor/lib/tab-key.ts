import React from "react";
import type { ApplyEdit } from "../model/types";
import { changeLineIndentation } from "./line-operations";

export const handleTabKey = (
  e: React.KeyboardEvent<HTMLTextAreaElement>,
  textarea: HTMLTextAreaElement,
  code: string,
  applyEdit: ApplyEdit,
  tabSize: number
): boolean => {
  if (e.key !== "Tab" || e.ctrlKey || e.metaKey || e.altKey) return false;

  e.preventDefault();
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;

  if (start === end && !e.shiftKey) {
    const newCode = code.substring(0, start) + " ".repeat(tabSize) + code.substring(end);
    applyEdit(newCode, start + tabSize);
    return true;
  }

  const result = changeLineIndentation(
    code,
    start,
    end,
    tabSize,
    e.shiftKey ? "outdent" : "indent"
  );
  if (result.changed) applyEdit(result.newCode, result.newSelectionStart, result.newSelectionEnd);
  return true;
};
