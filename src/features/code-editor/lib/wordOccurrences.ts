import type { TextRange } from "./multiCursorOperations";

/** Characters of a word in scripts; markup and style sheets also join words with `-`. */
export const SCRIPT_WORD = /[\p{L}\p{N}_$]/u;
export const MARKUP_WORD = /[\p{L}\p{N}_$-]/u;

/** Keeps a huge file with a common word from flooding the layer. */
const MAX_OCCURRENCES = 500;

/**
 * Whole-word occurrences of the word at `offset` (the caret may sit right after it),
 * the textual highlight VS Code falls back to without a language service.
 */
export const findWordOccurrences = (
  code: string,
  offset: number,
  wordChar: RegExp = SCRIPT_WORD
): TextRange[] => {
  const isWordChar = (char: string | undefined): boolean =>
    char !== undefined && wordChar.test(char);
  let start = offset;
  while (start > 0 && isWordChar(code[start - 1])) start--;
  let end = offset;
  while (end < code.length && isWordChar(code[end])) end++;
  if (start === end) return [];

  const word = code.slice(start, end);
  const ranges: TextRange[] = [];
  for (
    let index = code.indexOf(word);
    index !== -1 && ranges.length < MAX_OCCURRENCES;
    index = code.indexOf(word, index + 1)
  ) {
    if (isWordChar(code[index - 1]) || isWordChar(code[index + word.length])) continue;
    ranges.push({ start: index, end: index + word.length });
  }
  return ranges;
};
