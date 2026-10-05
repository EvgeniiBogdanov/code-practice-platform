import { useCallback, useMemo, useState } from "react";
import { getCaretCoordinates } from "../lib/caretCoordinates";
import {
  findMatches,
  getAdjacentMatch,
  getLineStartOffset,
  replaceAll,
  replaceMatch,
  type FindOptions,
} from "../lib/findReplace";
import { findWordAtPosition, type TextRange } from "../lib/multiCursorOperations";
import { matchesKey } from "../lib/editorKeyHelpers";
import type { ApplyEdit } from "./types";

export type FindMode = "find" | "replace" | "goto";

export interface FindReplaceOptions {
  code: string;
  readOnly: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  applyEdit: ApplyEdit;
  /** Called after the panel moves the editor selection (status bar, hover cleanup). */
  onSelect?: () => void;
}

export interface FindReplaceState {
  mode: FindMode | null;
  query: string;
  replacement: string;
  lineNumber: string;
  options: FindOptions;
  matchCount: number;
  /** Position of the selected match among all matches, or -1. */
  activeIndex: number;
  /** The regular expression is invalid. */
  error: string | null;
  /** How many matches the last "replace all" changed; null until it is used. */
  replacedCount: number | null;
  /** Matches to mark in the text while the panel is searching. */
  highlights: TextRange[];
  /** The match the editor selection is on, if any. */
  activeMatch: TextRange | null;
  open: (mode: FindMode) => void;
  close: () => void;
  setQuery: (query: string) => void;
  setReplacement: (replacement: string) => void;
  setLineNumber: (lineNumber: string) => void;
  toggleOption: (option: keyof FindOptions) => void;
  step: (direction: 1 | -1) => void;
  replaceCurrent: () => void;
  replaceEverything: () => void;
  goToLine: () => void;
  /** Handles Cmd/Ctrl+F, Cmd/Ctrl+H, Ctrl+G, F3 and Escape; true when the key was used. */
  handleShortcut: (e: React.KeyboardEvent<HTMLElement>) => boolean;
}

const DEFAULT_OPTIONS: FindOptions = { caseSensitive: false, wholeWord: false, regex: false };
const MAX_SEED_LENGTH = 200;

export const useFindReplace = ({
  code,
  readOnly,
  textareaRef,
  applyEdit,
  onSelect,
}: FindReplaceOptions): FindReplaceState => {
  const [mode, setMode] = useState<FindMode | null>(null);
  const [query, setQueryState] = useState("");
  const [replacement, setReplacement] = useState("");
  const [lineNumber, setLineNumber] = useState("");
  const [options, setOptions] = useState<FindOptions>(DEFAULT_OPTIONS);
  const [activeRange, setActiveRange] = useState<TextRange | null>(null);
  const [replacedCount, setReplacedCount] = useState<number | null>(null);

  const searching = mode === "find" || mode === "replace";
  const result = useMemo(
    () => (searching ? findMatches(code, query, options) : { matches: [], error: null }),
    [searching, code, query, options]
  );
  const { matches, error } = result;
  // The range is stale after an edit moved the matches: then no index is shown.
  const activeIndex = activeRange
    ? matches.findIndex((m) => m.start === activeRange.start && m.end === activeRange.end)
    : -1;

  /** Selects a range without taking focus from the panel's inputs, and scrolls to it. */
  const select = useCallback(
    (range: TextRange): void => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      textarea.setSelectionRange(range.start, range.end);
      const caret = getCaretCoordinates(textarea, range.start);
      if (
        caret.top < textarea.scrollTop ||
        caret.lineBottom > textarea.scrollTop + textarea.clientHeight
      ) {
        textarea.scrollTop = Math.max(0, caret.top - textarea.clientHeight / 3);
      }
      setActiveRange(range);
      onSelect?.();
    },
    [textareaRef, onSelect]
  );

  const goTo = useCallback(
    (list: ReadonlyArray<TextRange>, caret: number, direction: 1 | -1): void => {
      const index = getAdjacentMatch(list, caret, direction);
      if (index !== -1) select(list[index]);
    },
    [select]
  );

  const step = useCallback(
    (direction: 1 | -1): void => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      const caret = direction === 1 ? textarea.selectionEnd : textarea.selectionStart;
      goTo(matches, caret, direction);
    },
    [textareaRef, matches, goTo]
  );

  const open = useCallback(
    (nextMode: FindMode): void => {
      const textarea = textareaRef.current;
      setMode(readOnly && nextMode === "replace" ? "find" : nextMode);
      setReplacedCount(null);
      if (!textarea || nextMode === "goto") return;
      // Like VS Code: the selection, or the word under the caret, becomes the query.
      const { selectionStart: start, selectionEnd: end } = textarea;
      const selected = code.slice(start, end);
      const seed =
        selected && !selected.includes("\n") && selected.length <= MAX_SEED_LENGTH
          ? selected
          : start === end
            ? (findWordAtPosition(code, start)?.word ?? "")
            : "";
      if (seed) {
        setQueryState(seed);
        setActiveRange(null);
      }
    },
    [textareaRef, readOnly, code]
  );

  const close = useCallback((): void => {
    setMode(null);
    textareaRef.current?.focus();
  }, [textareaRef]);

  const setQuery = useCallback(
    (next: string): void => {
      setQueryState(next);
      setReplacedCount(null);
      setActiveRange(null);
      // Incremental search: typing keeps the current match when it still fits, else moves on.
      const textarea = textareaRef.current;
      if (!textarea || !next) return;
      goTo(findMatches(code, next, options).matches, textarea.selectionStart, 1);
    },
    [textareaRef, code, options, goTo]
  );

  const toggleOption = useCallback(
    (option: keyof FindOptions): void => {
      const nextOptions = { ...options, [option]: !options[option] };
      setOptions(nextOptions);
      setActiveRange(null);
      const textarea = textareaRef.current;
      if (textarea && query) {
        goTo(findMatches(code, query, nextOptions).matches, textarea.selectionStart, 1);
      }
    },
    [options, textareaRef, query, code, goTo]
  );

  const replaceCurrent = useCallback((): void => {
    const textarea = textareaRef.current;
    if (!textarea || readOnly || error) return;
    const { selectionStart: start, selectionEnd: end } = textarea;
    const current = matches.find((m) => m.start === start && m.end === end);
    if (!current) {
      step(1);
      return;
    }
    const replaced = replaceMatch(code, current, query, replacement, options);
    if (!replaced) return;
    const next = findMatches(replaced.newCode, query, options).matches;
    const index = getAdjacentMatch(next, replaced.inserted.end, 1);
    const target = index === -1 ? null : next[index];
    applyEdit(
      replaced.newCode,
      target?.start ?? replaced.inserted.end,
      target?.end ?? replaced.inserted.end
    );
    setActiveRange(target);
    setReplacedCount(null);
    // Scroll once React has committed the new text.
    if (target) setTimeout(() => select(target), 0);
  }, [
    textareaRef,
    readOnly,
    error,
    matches,
    code,
    query,
    replacement,
    options,
    applyEdit,
    step,
    select,
  ]);

  const replaceEverything = useCallback((): void => {
    if (readOnly || error || !query) return;
    const { newCode, count } = replaceAll(code, query, replacement, options);
    if (count === 0) return;
    applyEdit(newCode, Math.min(textareaRef.current?.selectionStart ?? 0, newCode.length));
    setActiveRange(null);
    setReplacedCount(count);
  }, [readOnly, error, query, code, replacement, options, applyEdit, textareaRef]);

  const goToLine = useCallback((): void => {
    const line = Number.parseInt(lineNumber, 10);
    if (!Number.isFinite(line)) return;
    const offset = getLineStartOffset(code, line);
    select({ start: offset, end: offset });
    close();
  }, [lineNumber, code, select, close]);

  const handleShortcut = useCallback(
    (e: React.KeyboardEvent<HTMLElement>): boolean => {
      const mod = e.metaKey || e.ctrlKey;
      let handled = true;
      if (e.metaKey && e.altKey && !e.ctrlKey && !e.shiftKey && matchesKey(e, "KeyF")) {
        open("replace");
      } else if (mod && !e.altKey && !e.shiftKey && matchesKey(e, "KeyF")) {
        open("find");
      } else if (e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey && matchesKey(e, "KeyH")) {
        open("replace");
      } else if (e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey && matchesKey(e, "KeyG")) {
        open("goto");
      } else if (e.key === "F3" && !mod && !e.altKey) {
        if (query) step(e.shiftKey ? -1 : 1);
        else open("find");
      } else if (e.key === "Escape" && mode && !e.defaultPrevented) {
        close();
      } else {
        handled = false;
      }
      if (handled) e.preventDefault();
      return handled;
    },
    [open, close, step, query, mode]
  );

  return {
    mode,
    query,
    replacement,
    lineNumber,
    options,
    matchCount: matches.length,
    activeIndex,
    error,
    replacedCount,
    highlights: matches,
    activeMatch: activeIndex >= 0 ? matches[activeIndex] : null,
    open,
    close,
    setQuery,
    setReplacement,
    setLineNumber,
    toggleOption,
    step,
    replaceCurrent,
    replaceEverything,
    goToLine,
    handleShortcut,
  };
};
