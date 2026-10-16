import { useEffect, useRef, useState } from "react";
import type { TextRange } from "../lib/multiCursorOperations";
import { MARKUP_WORD, SCRIPT_WORD, findWordOccurrences } from "../lib/wordOccurrences";

/** VS Code waits for the caret to rest before highlighting, so typing never flickers. */
export const OCCURRENCES_DELAY = 150;

const MARKUP_LANGUAGES = new Set(["css", "scss", "less", "html"]);
const NONE: TextRange[] = [];

interface UseOccurrencesParams {
  code: string;
  cursorOffset: number;
  languageId: string;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  /** False while another highlight owns the text (search, extra cursors). */
  enabled: boolean;
  /** Semantic references from the language service; textual matches without it. */
  requestHighlights?: (position: number) => Promise<TextRange[]>;
}

interface Occurrences {
  code: string;
  offset: number;
  ranges: TextRange[];
}

/** Every occurrence of the symbol at the caret, like VS Code's word highlighter. */
export const useOccurrences = ({
  code,
  cursorOffset,
  languageId,
  textareaRef,
  enabled,
  requestHighlights,
}: UseOccurrencesParams): TextRange[] => {
  const [occurrences, setOccurrences] = useState<Occurrences | null>(null);
  const latestRequest = useRef(0);

  useEffect(() => {
    const id = ++latestRequest.current;
    if (!enabled) return;
    const timer = setTimeout(async () => {
      const textarea = textareaRef.current;
      // A selection is about to be replaced or copied: VS Code drops the highlight.
      if (!textarea || textarea.selectionStart !== textarea.selectionEnd) return;
      const wordChar = MARKUP_LANGUAGES.has(languageId) ? MARKUP_WORD : SCRIPT_WORD;
      const ranges = requestHighlights
        ? await requestHighlights(cursorOffset)
        : findWordOccurrences(code, cursorOffset, wordChar);
      if (id !== latestRequest.current) return;
      setOccurrences({ code, offset: cursorOffset, ranges });
    }, OCCURRENCES_DELAY);
    return (): void => clearTimeout(timer);
  }, [code, cursorOffset, languageId, textareaRef, enabled, requestHighlights]);

  // Ranges belong to the text they were found for: an edit hides them at once. Moving
  // inside a highlighted word keeps them, as VS Code does, instead of blinking.
  if (!enabled || occurrences?.code !== code) return NONE;
  const stays =
    occurrences.offset === cursorOffset ||
    occurrences.ranges.some(({ start, end }) => start <= cursorOffset && cursorOffset <= end);
  return stays ? occurrences.ranges : NONE;
};
