import type React from "react";
import type { ApplyEdit } from "../model/types";
import {
  changeLineIndentation,
  deleteLines,
  getSmartHomeOffset,
  insertLineAbove,
  type LineOperationResult,
} from "./line-operations";

type KeyEvent = React.KeyboardEvent<HTMLTextAreaElement>;

const isMod = (e: KeyEvent): boolean => (e.metaKey || e.ctrlKey) && !e.altKey;

/** Home that alternates between the first character and column 0, extending with Shift. */
const handleSmartHome = (e: KeyEvent, textarea: HTMLTextAreaElement, code: string): boolean => {
  if (e.key !== "Home" || e.metaKey || e.ctrlKey || e.altKey) return false;
  const backward = textarea.selectionDirection === "backward";
  const anchor = backward ? textarea.selectionEnd : textarea.selectionStart;
  const caret = backward ? textarea.selectionStart : textarea.selectionEnd;
  const target = getSmartHomeOffset(code, caret);
  e.preventDefault();
  if (!e.shiftKey) {
    textarea.setSelectionRange(target, target);
  } else if (target < anchor) {
    textarea.setSelectionRange(target, anchor, "backward");
  } else {
    textarea.setSelectionRange(anchor, target, "forward");
  }
  return true;
};

/**
 * VS Code line commands: delete line (Cmd/Ctrl+Shift+K), open a line above
 * (Cmd/Ctrl+Shift+Enter), indent and outdent (Cmd/Ctrl+] and [) and Smart Home. Cmd/Ctrl+Enter
 * is not "insert line below" here: it runs the code.
 */
export const handleLineCommands = (
  e: KeyEvent,
  textarea: HTMLTextAreaElement,
  code: string,
  applyEdit: ApplyEdit,
  tabSize: number,
  { smartHome = true }: { smartHome?: boolean } = {}
): boolean => {
  if (smartHome && handleSmartHome(e, textarea, code)) return true;
  if (!isMod(e)) return false;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  let result: LineOperationResult | null = null;
  if (e.shiftKey && (e.code === "KeyK" || e.key.toLowerCase() === "k")) {
    result = deleteLines(code, start, end);
  } else if (e.shiftKey && e.key === "Enter") {
    result = insertLineAbove(code, start, end);
  } else if (!e.shiftKey && (e.code === "BracketRight" || e.key === "]")) {
    result = changeLineIndentation(code, start, end, tabSize, "indent");
  } else if (!e.shiftKey && (e.code === "BracketLeft" || e.key === "[")) {
    result = changeLineIndentation(code, start, end, tabSize, "outdent");
  }
  if (!result) return false;

  e.preventDefault();
  if (result.changed) applyEdit(result.newCode, result.newSelectionStart, result.newSelectionEnd);
  return true;
};
