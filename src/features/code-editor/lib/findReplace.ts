import type { TextRange } from "./multiCursorOperations";

export interface FindOptions {
  caseSensitive: boolean;
  wholeWord: boolean;
  regex: boolean;
}

export interface FindResult {
  matches: TextRange[];
  /** The pattern is not a valid regular expression. */
  error: string | null;
}

/** More matches than this are not highlighted one by one; the count stays honest. */
export const MAX_MATCHES = 1000;

const WORD = "[\\p{L}\\p{N}_$]";

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Builds the search regex; throws a SyntaxError for an invalid user pattern. */
const createRegExp = (query: string, options: FindOptions, flags: string): RegExp => {
  let source = options.regex ? query : escapeRegExp(query);
  if (options.wholeWord) source = `(?<!${WORD})(?:${source})(?!${WORD})`;
  return new RegExp(source, `u${options.caseSensitive ? "" : "i"}${flags}`);
};

export const findMatches = (code: string, query: string, options: FindOptions): FindResult => {
  if (!query) return { matches: [], error: null };
  let pattern: RegExp;
  try {
    pattern = createRegExp(query, options, "gm");
  } catch (error) {
    return { matches: [], error: error instanceof Error ? error.message : "Invalid pattern" };
  }
  const matches: TextRange[] = [];
  for (const match of code.matchAll(pattern)) {
    // An empty match (`a*`, `^`) selects nothing and would loop in "next match".
    if (match[0].length === 0) continue;
    matches.push({ start: match.index, end: match.index + match[0].length });
    if (matches.length >= MAX_MATCHES) break;
  }
  return { matches, error: null };
};

/** Index of the first match at or after `caret` (forward) or before it (backward), wrapping. */
export const getAdjacentMatch = (
  matches: ReadonlyArray<TextRange>,
  caret: number,
  direction: 1 | -1
): number => {
  if (matches.length === 0) return -1;
  if (direction === 1) {
    const next = matches.findIndex((match) => match.start >= caret);
    return next === -1 ? 0 : next;
  }
  for (let index = matches.length - 1; index >= 0; index--) {
    if (matches[index].end < caret) return index;
  }
  return matches.length - 1;
};

/** `$&`, `$1`, `$<name>` and `$$` of a regex replacement, like String.prototype.replace. */
const expandReplacement = (template: string, match: RegExpExecArray): string =>
  template.replace(/\$(\$|&|\d{1,2}|<[^>]+>)/g, (token, key: string) => {
    if (key === "$") return "$";
    if (key === "&") return match[0];
    if (key.startsWith("<")) return match.groups?.[key.slice(1, -1)] ?? token;
    return match[Number(key)] ?? token;
  });

export interface ReplaceResult {
  newCode: string;
  /** Range of the inserted text in `newCode`. */
  inserted: TextRange;
}

/** Replaces one match; in regex mode the replacement may use capture groups. */
export const replaceMatch = (
  code: string,
  match: TextRange,
  query: string,
  replacement: string,
  options: FindOptions
): ReplaceResult | null => {
  let text = replacement;
  if (options.regex) {
    let pattern: RegExp;
    try {
      pattern = createRegExp(query, options, "y");
    } catch {
      return null;
    }
    pattern.lastIndex = match.start;
    const found = pattern.exec(code);
    if (!found) return null;
    text = expandReplacement(replacement, found);
  }
  return {
    newCode: code.slice(0, match.start) + text + code.slice(match.end),
    inserted: { start: match.start, end: match.start + text.length },
  };
};

/** Replaces every match, from the end so earlier offsets stay valid. */
export const replaceAll = (
  code: string,
  query: string,
  replacement: string,
  options: FindOptions
): { newCode: string; count: number } => {
  const { matches } = findMatches(code, query, options);
  let newCode = code;
  let count = 0;
  for (const match of [...matches].reverse()) {
    const result = replaceMatch(newCode, match, query, replacement, options);
    if (!result) continue;
    newCode = result.newCode;
    count++;
  }
  return { newCode, count };
};

/** Offset of the start of a 1-based line, clamped into the document. */
export const getLineStartOffset = (code: string, line: number): number => {
  let offset = 0;
  for (let current = 1; current < line; current++) {
    const next = code.indexOf("\n", offset);
    if (next === -1) break;
    offset = next + 1;
  }
  return offset;
};
