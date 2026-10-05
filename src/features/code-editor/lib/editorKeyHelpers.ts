import React from "react";
import {
  getEmbeddedRegion,
  getMarkupContext,
  getLanguageCapabilities,
  getLanguageId,
} from "@/shared/lib/code-editor";
import type { ApplyEdit } from "../model/types";
import { IntelliSenseState } from "../model/useIntelliSense";
import { moveLines, duplicateLines } from "./lineOperations";
import { toggleLineComment, toggleBlockComment } from "./commentOperations";
import { TAB_SIZE } from "./editorUtils";

export const MATCHING_PAIRS: Record<string, string> = {
  "(": ")",
  "[": "]",
  "{": "}",
  '"': '"',
  "'": "'",
  "`": "`",
};

export const CLOSING_PAIRS = new Set([")", "]", "}", '"', "'", "`"]);

const QUOTES = new Set(['"', "'", "`"]);
// VS Code `autoCloseBefore`: pairs are closed only before whitespace or punctuation.
const AUTO_CLOSE_BEFORE = /^(?:$|[\s;:.,=}\])>])/;
const WORD_CHARACTER = /[\p{L}\p{N}_$]/u;

/**
 * Matches a physical key (`KeyZ`, `Slash`), so shortcuts survive Option on macOS
 * and non-Latin layouts. Virtual keyboards report an empty code: fall back to the key.
 */
export const matchesKey = (e: { code: string; key: string }, code: string): boolean =>
  e.code ? e.code === code : e.key.toLowerCase() === code.replace(/^Key/, "").toLowerCase();

/**
 * Whether the key press types a character. AltGr (reported as Ctrl+Alt on Windows) and
 * macOS Option produce text — `{`, `[`, `|` on many layouts — unlike real shortcuts.
 */
export const producesText = (
  e: Pick<React.KeyboardEvent, "key" | "ctrlKey" | "metaKey" | "altKey"> &
    Partial<Pick<React.KeyboardEvent, "getModifierState">>
): boolean => {
  if (e.key.length !== 1 || e.metaKey) return false;
  if (e.getModifierState?.("AltGraph")) return true;
  // Option+letter types a symbol whose key differs from the letter; Alt+letter does not.
  return !e.ctrlKey && (!e.altKey || !/^[a-z\d]$/i.test(e.key));
};

export const handleLineMovement = (
  e: React.KeyboardEvent<HTMLTextAreaElement>,
  textarea: HTMLTextAreaElement,
  code: string,
  applyEdit: ApplyEdit,
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
    applyEdit(result.newCode, result.newSelectionStart, result.newSelectionEnd);
  }

  return true;
};

export const handleEnterKey = (
  e: React.KeyboardEvent<HTMLTextAreaElement>,
  textarea: HTMLTextAreaElement,
  code: string,
  applyEdit: ApplyEdit,
  tabSize = TAB_SIZE
): boolean => {
  if (e.key !== "Enter") return false;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const textBefore = code.substring(0, start);
  const lastLineStart = textBefore.lastIndexOf("\n") + 1;
  const currentLine = textBefore.substring(lastLineStart);
  const indent = /^\s*/.exec(currentLine)?.[0] ?? "";
  const insert = (insertion: string, cursorOffset = insertion.length): true => {
    e.preventDefault();
    applyEdit(code.substring(0, start) + insertion + code.substring(end), start + cursorOffset);
    return true;
  };

  if (currentLine.trimEnd() === `${indent}/**`) {
    return insert(`\n${indent} * \n${indent} */`, 1 + indent.length + 3);
  }

  // The line's own last character decides: Enter on a blank line after `{` keeps its indent.
  const prevChar = currentLine.trimEnd().slice(-1);
  const nextChar = code.charAt(end);

  if (prevChar === "{" || prevChar === "(" || prevChar === "[") {
    const extraIndent = indent + " ".repeat(tabSize);
    if (MATCHING_PAIRS[prevChar] === nextChar) {
      return insert(`\n${extraIndent}\n${indent}`, 1 + extraIndent.length);
    }
    return insert(`\n${extraIndent}`);
  }

  if (indent.length > 0) return insert(`\n${indent}`);

  return false;
};

/** Quotes are not paired after a word, inside literals/comments or in markup text. */
const shouldPairQuote = (code: string, start: number, filepath: string): boolean => {
  if (WORD_CHARACTER.test(code.charAt(start - 1))) return false;
  // Script and style bodies in HTML are code, not markup text.
  if (getEmbeddedRegion(code, start, filepath)) return true;
  const mode = getMarkupContext(code.slice(0, start), filepath).mode;
  return mode !== "literal" && mode !== "text";
};

export const handlePairsAndBackspace = (
  e: React.KeyboardEvent<HTMLTextAreaElement>,
  textarea: HTMLTextAreaElement,
  code: string,
  applyEdit: ApplyEdit,
  filepath = "main.jsx"
): boolean => {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;

  if (MATCHING_PAIRS[e.key] && producesText(e)) {
    const closing = MATCHING_PAIRS[e.key];
    const nextChar = code.charAt(end);

    if (CLOSING_PAIRS.has(e.key) && nextChar === e.key && start === end) {
      e.preventDefault();
      textarea.selectionStart = textarea.selectionEnd = start + 1;
      return true;
    }

    if (start === end) {
      if (!AUTO_CLOSE_BEFORE.test(code.slice(end))) return false;
      if (QUOTES.has(e.key) && !shouldPairQuote(code, start, filepath)) return false;
    }

    e.preventDefault();
    const selectedText = code.substring(start, end);
    const newCode = code.substring(0, start) + e.key + selectedText + closing + code.substring(end);
    applyEdit(newCode, start + 1, start + 1 + selectedText.length);
    return true;
  }

  if (e.key === "Backspace" && start === end && start > 0) {
    const prevChar = code.charAt(start - 1);
    const nextChar = code.charAt(start);

    if (MATCHING_PAIRS[prevChar] === nextChar) {
      e.preventDefault();
      applyEdit(code.substring(0, start - 1) + code.substring(start + 1), start - 1);
      return true;
    }
  }

  return false;
};

export const isLineCommentShortcut = (e: React.KeyboardEvent<HTMLTextAreaElement>): boolean => {
  if (e.altKey) return false;
  if (!e.metaKey && !e.ctrlKey) return false;
  if (e.shiftKey) return false;
  return e.key === "/" || e.code === "Slash";
};

export const isBlockCommentShortcut = (e: React.KeyboardEvent<HTMLTextAreaElement>): boolean => {
  const isShiftAltA = e.shiftKey && e.altKey && !e.ctrlKey && !e.metaKey && matchesKey(e, "KeyA");

  if (isShiftAltA) return true;

  return (
    (e.metaKey || e.ctrlKey) &&
    e.shiftKey &&
    !e.altKey &&
    (e.key === "/" || e.key === "?" || e.code === "Slash")
  );
};

export const handleCommentShortcuts = (
  e: React.KeyboardEvent<HTMLTextAreaElement>,
  textarea: HTMLTextAreaElement,
  code: string,
  applyEdit: ApplyEdit,
  intelliSense: IntelliSenseState,
  filepath = "main.jsx",
  readOnly?: boolean
): boolean => {
  const isLine = isLineCommentShortcut(e);
  const isBlock = isBlockCommentShortcut(e);

  if (!isLine && !isBlock) return false;

  e.preventDefault();
  e.stopPropagation();

  if (intelliSense.isOpen) {
    intelliSense.closeCompletions();
  }

  if (readOnly) return true;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const result = isLine
    ? toggleLineComment(code, start, end, filepath)
    : toggleBlockComment(code, start, end, filepath);

  if (result.changed) {
    applyEdit(result.newCode, result.newSelectionStart, result.newSelectionEnd);
  }

  return true;
};

export const handleMarkupKey = (
  e: React.KeyboardEvent<HTMLTextAreaElement>,
  textarea: HTMLTextAreaElement,
  code: string,
  applyEdit: ApplyEdit,
  filepath: string,
  tabSize: number
): boolean => {
  const cursor = textarea.selectionStart;
  if (
    cursor !== textarea.selectionEnd ||
    e.ctrlKey ||
    e.metaKey ||
    e.altKey ||
    !getLanguageCapabilities(getLanguageId(filepath)).supportsHtmlTags
  )
    return false;
  const before = code.slice(0, cursor);
  const after = code.slice(cursor);
  const context = getMarkupContext(before, filepath);
  let insertion: string;
  let offset: number;
  if (e.key === "/" && before.endsWith("<") && context.mode === "tag" && context.openTags.length) {
    const name = context.openTags.at(-1) ?? "";
    insertion = `/${name}${after.startsWith(">") ? "" : ">"}`;
    offset = insertion.length + (after.startsWith(">") ? 1 : 0);
  } else if (e.key === "Enter" && context.tags.at(-1)?.end === cursor && context.mode === "text") {
    const indent = /^[ \t]*/.exec(before.slice(before.lastIndexOf("\n") + 1))?.[0] ?? "";
    const name = context.openTags.at(-1);
    if (name === undefined) return false;
    const innerIndent = indent + " ".repeat(tabSize);
    insertion = `\n${innerIndent}${after.startsWith(`</${name}>`) ? `\n${indent}` : ""}`;
    offset = 1 + innerIndent.length;
  } else return false;
  e.preventDefault();
  applyEdit(before + insertion + after, cursor + offset);
  return true;
};
