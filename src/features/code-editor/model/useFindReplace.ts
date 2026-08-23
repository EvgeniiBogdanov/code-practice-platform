import { useState, useMemo, useRef, useCallback } from "react";

export interface FindMatch {
  start: number;
  end: number;
  line: number;
  text: string;
}

export interface FindState {
  isOpen: boolean;
  showReplace: boolean;
  query: string;
  replaceText: string;
  matchCase: boolean;
  matchWholeWord: boolean;
  useRegex: boolean;
  currentIndex: number;
}

export interface UseFindReplaceOptions {
  code: string;
  onChange: (newCode: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  readOnly?: boolean;
}

export function useFindReplace({
  code,
  onChange,
  textareaRef,
  readOnly = false,
}: UseFindReplaceOptions) {
  const [findState, setFindState] = useState<FindState>({
    isOpen: false,
    showReplace: false,
    query: "",
    replaceText: "",
    matchCase: false,
    matchWholeWord: false,
    useRegex: false,
    currentIndex: -1,
  });

  const findInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  // Compute all matches in code
  const findMatches = useMemo<FindMatch[]>(() => {
    if (!findState.isOpen || !findState.query || !code) return [];

    let regex: RegExp | null = null;
    try {
      let pattern = findState.query;
      if (!findState.useRegex) {
        pattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
      if (findState.matchWholeWord) {
        pattern = `\\b${pattern}\\b`;
      }
      const flags = findState.matchCase ? "g" : "gi";
      regex = new RegExp(pattern, flags);
    } catch {
      return [];
    }

    const matches: FindMatch[] = [];
    let m: RegExpExecArray | null;
    while ((m = regex.exec(code)) !== null) {
      if (m[0].length === 0) {
        regex.lastIndex++;
        continue;
      }
      const textBefore = code.substring(0, m.index);
      const line = textBefore.split("\n").length;
      matches.push({
        start: m.index,
        end: m.index + m[0].length,
        line,
        text: m[0],
      });
      if (!regex.global) break;
    }

    return matches;
  }, [
    code,
    findState.isOpen,
    findState.query,
    findState.matchCase,
    findState.matchWholeWord,
    findState.useRegex,
  ]);

  const selectMatch = useCallback(
    (index: number) => {
      if (findMatches.length === 0 || index < 0 || index >= findMatches.length) return;
      setFindState((prev) => ({ ...prev, currentIndex: index }));

      const match = findMatches[index];
      if (textareaRef.current) {
        textareaRef.current.selectionStart = match.start;
        textareaRef.current.selectionEnd = match.end;
        const lineHeight = 21;
        textareaRef.current.scrollTop = Math.max(0, (match.line - 5) * lineHeight);
      }
    },
    [findMatches, textareaRef]
  );

  const findNext = useCallback(() => {
    if (findMatches.length === 0) return;
    const nextIdx = (findState.currentIndex + 1) % findMatches.length;
    selectMatch(nextIdx);
  }, [findMatches.length, findState.currentIndex, selectMatch]);

  const findPrev = useCallback(() => {
    if (findMatches.length === 0) return;
    const prevIdx = (findState.currentIndex - 1 + findMatches.length) % findMatches.length;
    selectMatch(prevIdx);
  }, [findMatches.length, findState.currentIndex, selectMatch]);

  const openFind = useCallback(
    (showReplace = false) => {
      if (readOnly) return;
      const textarea = textareaRef.current;
      let initialQuery = findState.query;

      if (textarea && textarea.selectionStart !== textarea.selectionEnd) {
        const selected = code.substring(textarea.selectionStart, textarea.selectionEnd);
        if (selected && !selected.includes("\n") && selected.length < 80) {
          initialQuery = selected;
        }
      }

      setFindState((prev) => ({
        ...prev,
        isOpen: true,
        showReplace,
        query: initialQuery,
        currentIndex: initialQuery ? 0 : -1,
      }));

      setTimeout(() => {
        if (showReplace && replaceInputRef.current && initialQuery) {
          replaceInputRef.current.focus();
          replaceInputRef.current.select();
        } else if (findInputRef.current) {
          findInputRef.current.focus();
          findInputRef.current.select();
        }
      }, 50);
    },
    [code, findState.query, readOnly, textareaRef]
  );

  const closeFind = useCallback(() => {
    setFindState((prev) => ({ ...prev, isOpen: false }));
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [textareaRef]);

  const replaceCurrent = useCallback(() => {
    if (findMatches.length === 0 || findState.currentIndex < 0) return;
    const match = findMatches[findState.currentIndex];
    if (!match) return;

    const updated =
      code.substring(0, match.start) + findState.replaceText + code.substring(match.end);
    onChange(updated);

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.selectionStart = match.start;
        textareaRef.current.selectionEnd = match.start + findState.replaceText.length;
      }
    }, 0);
  }, [code, findMatches, findState.currentIndex, findState.replaceText, onChange, textareaRef]);

  const replaceAllMatches = useCallback(() => {
    if (findMatches.length === 0 || !findState.query) return;

    let pattern = findState.query;
    if (!findState.useRegex) {
      pattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
    if (findState.matchWholeWord) {
      pattern = `\\b${pattern}\\b`;
    }
    const flags = findState.matchCase ? "g" : "gi";
    try {
      const regex = new RegExp(pattern, flags);
      const updated = code.replace(regex, findState.replaceText);
      onChange(updated);
    } catch {
      // ignore
    }
  }, [
    code,
    findMatches.length,
    findState.matchCase,
    findState.matchWholeWord,
    findState.query,
    findState.replaceText,
    findState.useRegex,
    onChange,
  ]);

  const setQuery = useCallback((query: string) => {
    setFindState((prev) => ({ ...prev, query, currentIndex: 0 }));
  }, []);

  const setReplaceText = useCallback((replaceText: string) => {
    setFindState((prev) => ({ ...prev, replaceText }));
  }, []);

  const toggleShowReplace = useCallback(() => {
    setFindState((prev) => ({ ...prev, showReplace: !prev.showReplace }));
  }, []);

  const toggleMatchCase = useCallback(() => {
    setFindState((prev) => ({ ...prev, matchCase: !prev.matchCase }));
  }, []);

  const toggleMatchWholeWord = useCallback(() => {
    setFindState((prev) => ({ ...prev, matchWholeWord: !prev.matchWholeWord }));
  }, []);

  const toggleUseRegex = useCallback(() => {
    setFindState((prev) => ({ ...prev, useRegex: !prev.useRegex }));
  }, []);

  return {
    findState,
    findMatches,
    findInputRef,
    replaceInputRef,
    openFind,
    closeFind,
    findNext,
    findPrev,
    selectMatch,
    replaceCurrent,
    replaceAllMatches,
    setQuery,
    setReplaceText,
    toggleShowReplace,
    toggleMatchCase,
    toggleMatchWholeWord,
    toggleUseRegex,
  };
}
