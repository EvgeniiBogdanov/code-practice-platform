/**
 * Infinite-loop protection for user code: every `for`, `while` and `do … while` gets an iteration
 * counter that throws once the loop has spun for too long.
 *
 * The source is scanned, not matched with regexes: loop headers may hold nested parentheses
 * (`for (const x of f(y))`), and strings, comments, template literals and regex literals may hold
 * loop-like text. Every guarded loop is wrapped in its own block, so it stays a single statement
 * (`if (x) for (…)`, `case 1: for (…)`), and nothing is inserted across lines, so error line
 * numbers still point at the user's code.
 */

const LOOP_ERROR = "Обнаружен потенциальный бесконечный цикл (таймаут 1.5 сек)";
const MAX_FAST_ITERATIONS = 200000;
const MAX_LOOP_MS = 1500;

const declareGuard = (id: number): string => `{ let _lt_${id} = Date.now(), _lc_${id} = 0; `;
const checkGuard = (id: number): string =>
  ` if (++_lc_${id} > ${MAX_FAST_ITERATIONS} && Date.now() - _lt_${id} > ${MAX_LOOP_MS}) { throw new Error("${LOOP_ERROR}"); }`;
const CLOSE_BLOCK = " }";

const IDENTIFIER_CHAR = /[\w$]/;
const WHITESPACE = /\s/;
/** After these a `/` starts a regex literal rather than a division. */
const REGEX_AFTER_PUNCTUATION = "(,=:[!&|?{};+-*%<>~^";
const REGEX_AFTER_WORDS = new Set([
  "return",
  "typeof",
  "case",
  "do",
  "else",
  "in",
  "of",
  "new",
  "delete",
  "void",
  "throw",
  "yield",
  "await",
  "instanceof",
]);

const startsRegex = (previous: string): boolean =>
  previous === "" ||
  REGEX_AFTER_WORDS.has(previous) ||
  (previous.length === 1 && REGEX_AFTER_PUNCTUATION.includes(previous));

/** End of a quoted string; an unterminated one stops at the line end (JSX text like `Don't`). */
const endOfQuoted = (code: string, start: number): number => {
  const quote = code[start];
  for (let i = start + 1; i < code.length; i++) {
    const char = code[i];
    if (char === "\\") i++;
    else if (char === quote) return i + 1;
    else if (char === "\n") return i;
  }
  return code.length;
};

/** End of a regex literal, or -1 when the slash turns out not to start one. */
const endOfRegex = (code: string, start: number): number => {
  let isInClass = false;
  for (let i = start + 1; i < code.length; i++) {
    const char = code[i];
    if (char === "\n") return -1;
    if (char === "\\") i++;
    else if (char === "[") isInClass = true;
    else if (char === "]") isInClass = false;
    else if (char === "/" && !isInClass) {
      let end = i + 1;
      while (end < code.length && /[a-z]/i.test(code[end])) end++;
      return end;
    }
  }
  return -1;
};

/** Marks characters that are not code: strings, comments, template text and regex literals. */
const maskLiterals = (code: string): Uint8Array => {
  const mask = new Uint8Array(code.length);
  // Brace depth at each open `${`: the template text resumes when its expression closes.
  const templateDepths: number[] = [];
  let braceDepth = 0;
  let isInTemplate = false;
  let previous = "";
  let i = 0;

  const skipTo = (end: number): void => {
    mask.fill(1, i, end);
    i = end;
  };

  while (i < code.length) {
    const char = code[i];
    const next = code[i + 1];

    if (isInTemplate) {
      if (char === "\\") skipTo(Math.min(i + 2, code.length));
      else if (char === "`") {
        skipTo(i + 1);
        isInTemplate = false;
        previous = "`";
      } else if (char === "$" && next === "{") {
        skipTo(i + 2);
        isInTemplate = false;
        templateDepths.push(braceDepth);
        braceDepth++;
        previous = "{";
      } else skipTo(i + 1);
      continue;
    }

    if (WHITESPACE.test(char)) {
      i++;
    } else if (char === "/" && next === "/") {
      const lineEnd = code.indexOf("\n", i);
      skipTo(lineEnd === -1 ? code.length : lineEnd);
    } else if (char === "/" && next === "*") {
      const commentEnd = code.indexOf("*/", i + 2);
      skipTo(commentEnd === -1 ? code.length : commentEnd + 2);
    } else if (char === '"' || char === "'") {
      skipTo(endOfQuoted(code, i));
      previous = '"';
    } else if (char === "`") {
      skipTo(i + 1);
      isInTemplate = true;
    } else if (char === "/" && startsRegex(previous) && endOfRegex(code, i) !== -1) {
      skipTo(endOfRegex(code, i));
      previous = "/regex/";
    } else if (IDENTIFIER_CHAR.test(char)) {
      let end = i;
      while (end < code.length && IDENTIFIER_CHAR.test(code[end])) end++;
      previous = code.slice(i, end);
      i = end;
    } else if (char === "}" && templateDepths.at(-1) === braceDepth - 1) {
      templateDepths.pop();
      braceDepth--;
      skipTo(i + 1);
      isInTemplate = true;
    } else {
      if (char === "{") braceDepth++;
      if (char === "}") braceDepth--;
      previous = char;
      i++;
    }
  }
  return mask;
};

interface Insertion {
  at: number;
  text: string;
}

export function normalizeAndProtectLoops(code: string): string {
  if (!code || typeof code !== "string") return code;

  const mask = maskLiterals(code);
  const isCode = (index: number): boolean => mask[index] === 0;
  const skipSpaces = (from: number): number => {
    let index = from;
    while (index < code.length && WHITESPACE.test(code[index])) index++;
    return index;
  };
  const isKeywordAt = (index: number, keyword: string): boolean =>
    code.startsWith(keyword, index) &&
    isCode(index) &&
    !IDENTIFIER_CHAR.test(code[index + keyword.length] ?? "") &&
    !IDENTIFIER_CHAR.test(code[index - 1] ?? "") &&
    code[index - 1] !== ".";

  /** Index of the bracket that closes the one at `open`, or -1. */
  const matchBracket = (open: number): number => {
    const opener = code[open];
    const closer = opener === "(" ? ")" : "}";
    let depth = 0;
    for (let index = open; index < code.length; index++) {
      if (!isCode(index)) continue;
      if (code[index] === opener) depth++;
      else if (code[index] === closer && --depth === 0) return index;
    }
    return -1;
  };

  /** End (after `;`) of a one-line statement without braces, or -1 when it is anything else. */
  const endOfSimpleStatement = (start: number): number => {
    let depth = 0;
    for (let index = start; index < code.length; index++) {
      if (!isCode(index)) continue;
      const char = code[index];
      if (char === "\n" || char === "{" || (char === "}" && depth === 0)) return -1;
      if (char === "(" || char === "[") depth++;
      else if (char === ")" || char === "]") depth--;
      else if (char === ";" && depth === 0) {
        // `for (…) if (a) b; else c;` — the statement does not end at the first semicolon.
        return isKeywordAt(skipSpaces(index + 1), "else") ? -1 : index + 1;
      }
    }
    return -1;
  };

  /** A label stays on the loop, so the guard block opens before it: `{ … outer: for (…) }`. */
  const startWithLabel = (loopStart: number): number => {
    const before = code.slice(Math.max(0, loopStart - 200), loopStart);
    const label = /(?:^|[^\w$.])([A-Za-z_$][\w$]*)\s*:\s*$/.exec(before);
    if (!label || label[1] === "default") return loopStart;
    const labelStart = loopStart - before.length + before.lastIndexOf(label[1]);
    const isCaseValue = /\bcase\s+$/.test(code.slice(0, labelStart));
    return isCaseValue || !isCode(labelStart) ? loopStart : labelStart;
  };

  const insertions: Insertion[] = [];
  const doWhileTails = new Set<number>();
  let loopId = 0;

  const guardBraced = (loopStart: number, bodyOpen: number, loopEnd: number): void => {
    const id = ++loopId;
    insertions.push({ at: startWithLabel(loopStart), text: declareGuard(id) });
    insertions.push({ at: bodyOpen + 1, text: checkGuard(id) });
    insertions.push({ at: loopEnd, text: CLOSE_BLOCK });
  };

  for (let index = 0; index < code.length; index++) {
    if (!isCode(index)) continue;

    if (isKeywordAt(index, "do")) {
      const bodyOpen = skipSpaces(index + 2);
      const bodyClose = code[bodyOpen] === "{" ? matchBracket(bodyOpen) : -1;
      const tail = bodyClose === -1 ? -1 : skipSpaces(bodyClose + 1);
      if (tail === -1 || !isKeywordAt(tail, "while")) continue;
      const conditionOpen = skipSpaces(tail + 5);
      const conditionClose = code[conditionOpen] === "(" ? matchBracket(conditionOpen) : -1;
      if (conditionClose === -1) continue;
      const semicolon = skipSpaces(conditionClose + 1);
      doWhileTails.add(tail);
      guardBraced(index, bodyOpen, code[semicolon] === ";" ? semicolon + 1 : conditionClose + 1);
      continue;
    }

    const keyword = isKeywordAt(index, "for") ? "for" : isKeywordAt(index, "while") ? "while" : "";
    if (!keyword || doWhileTails.has(index)) continue;
    let headerOpen = skipSpaces(index + keyword.length);
    if (keyword === "for" && isKeywordAt(headerOpen, "await"))
      headerOpen = skipSpaces(headerOpen + 5);
    const headerClose = code[headerOpen] === "(" ? matchBracket(headerOpen) : -1;
    if (headerClose === -1) continue;

    const bodyStart = skipSpaces(headerClose + 1);
    if (code[bodyStart] === "{") {
      const bodyClose = matchBracket(bodyStart);
      if (bodyClose !== -1) guardBraced(index, bodyStart, bodyClose + 1);
      continue;
    }
    // An empty body (`while (x);`) or a multi-line one without braces stays unguarded.
    const bodyEnd = code[bodyStart] === ";" ? -1 : endOfSimpleStatement(bodyStart);
    if (bodyEnd === -1) continue;
    const id = ++loopId;
    insertions.push({ at: startWithLabel(index), text: declareGuard(id) });
    insertions.push({ at: bodyStart, text: `{${checkGuard(id)} ` });
    insertions.push({ at: bodyEnd, text: CLOSE_BLOCK + CLOSE_BLOCK });
  }

  // Stable sort: at one position an outer loop's text, pushed first, stays first.
  insertions.sort((a, b) => a.at - b.at);
  let result = "";
  let cursor = 0;
  for (const { at, text } of insertions) {
    result += code.slice(cursor, at) + text;
    cursor = at;
  }
  return result + code.slice(cursor);
}
