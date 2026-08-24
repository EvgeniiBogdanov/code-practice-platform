import React from "react";
import { CodeHistoryState } from "../model/useCodeHistory";
import { IntelliSenseState } from "../model/useIntelliSense";
import { moveLines, duplicateLines } from "./line-operations";

export const MATCHING_PAIRS: Record<string, string> = {
  "(": ")",
  "[": "]",
  "{": "}",
  '"': '"',
  "'": "'",
  "`": "`",
};

export const CLOSING_PAIRS = new Set([")", "]", "}", '"', "'", "`"]);

export const handleLineMovement = (
  e: React.KeyboardEvent<HTMLTextAreaElement>,
  textarea: HTMLTextAreaElement,
  code: string,
  onChange: (newCode: string) => void,
  history: CodeHistoryState,
  intelliSense: IntelliSenseState,
  readOnly?: boolean
): boolean => {
  if (!e.altKey || (e.key !== "ArrowUp" && e.key !== "ArrowDown") || e.ctrlKey || e.metaKey) {
    return false;
  }

  e.preventDefault();
  e.stopPropagation();

  if (intelliSense.isOpen) {
    intelliSense.closeCompletions();
  }

  if (readOnly) {
    return true;
  }

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const direction = e.key === "ArrowUp" ? "up" : "down";
  const result = e.shiftKey
    ? duplicateLines(code, start, end, direction)
    : moveLines(code, start, end, direction);

  if (result.changed) {
    onChange(result.newCode);
    history.pushHistory(result.newCode, result.newSelectionStart);
    const selDirection = textarea.selectionDirection;
    textarea.setSelectionRange(result.newSelectionStart, result.newSelectionEnd, selDirection);
    setTimeout(() => {
      textarea.setSelectionRange(result.newSelectionStart, result.newSelectionEnd, selDirection);
    }, 0);
  }

  return true;
};

export const handleTabKey = (
  e: React.KeyboardEvent<HTMLTextAreaElement>,
  textarea: HTMLTextAreaElement,
  code: string,
  onChange: (newCode: string) => void,
  history: CodeHistoryState,
  tabSize: number
): boolean => {
  if (e.key !== "Tab" || e.ctrlKey || e.metaKey) return false;

  e.preventDefault();
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
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
  return true;
};

export const handleEnterKey = (
  e: React.KeyboardEvent<HTMLTextAreaElement>,
  textarea: HTMLTextAreaElement,
  code: string,
  onChange: (newCode: string) => void,
  history: CodeHistoryState
): boolean => {
  if (e.key !== "Enter") return false;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const textBefore = code.substring(0, start);
  const lastLineStart = textBefore.lastIndexOf("\n") + 1;
  const currentLine = textBefore.substring(lastLineStart);
  const indentMatch = currentLine.match(/^(\s*)/);
  const indent = indentMatch ? indentMatch[1] : "";

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
      return true;
    }

    const insertion = `\n${extraIndent}`;
    const newCode = code.substring(0, start) + insertion + code.substring(end);
    const nextCursor = start + insertion.length;
    onChange(newCode);
    history.pushHistory(newCode, nextCursor);
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = nextCursor;
    }, 0);
    return true;
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
    return true;
  }

  return false;
};

export const handlePairsAndBackspace = (
  e: React.KeyboardEvent<HTMLTextAreaElement>,
  textarea: HTMLTextAreaElement,
  code: string,
  onChange: (newCode: string) => void,
  history: CodeHistoryState
): boolean => {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;

  if (MATCHING_PAIRS[e.key] && !e.ctrlKey && !e.metaKey) {
    const closing = MATCHING_PAIRS[e.key];
    const nextChar = code.charAt(end);

    if (CLOSING_PAIRS.has(e.key) && nextChar === e.key && start === end) {
      e.preventDefault();
      textarea.selectionStart = textarea.selectionEnd = start + 1;
      return true;
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
    return true;
  }

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
      return true;
    }
  }

  return false;
};
