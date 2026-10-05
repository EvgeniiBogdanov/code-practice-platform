/**
 * SQL Syntax Highlighter
 */

import { HighlightOptions, escapeHtml, getProblemClass } from "./types";
import { SQL_KEYWORDS, SQL_TYPES } from "../languages/sqlKnowledge";

const words = (entries: readonly string[]): Set<string> =>
  new Set(entries.flatMap((entry) => entry.toUpperCase().match(/[A-Z_]+/g) ?? []));

const KEYWORDS = words(SQL_KEYWORDS);
const TYPES = words(SQL_TYPES);

const RULES: Array<{ className: string; regex: RegExp }> = [
  { className: "hl-cm", regex: /--.*|\/\*[\s\S]*?(?:\*\/|$)/y },
  { className: "hl-str", regex: /'(?:''|[^'])*'?/y },
  { className: "hl-prop", regex: /"(?:""|[^"])*"?|`[^`]*`?/y },
  { className: "hl-num", regex: /\d+(?:\.\d+)?\b/y },
  { className: "word", regex: /[A-Za-z_][\w$]*/y },
  { className: "hl-op", regex: /<>|!=|<=|>=|\|\||[=<>+\-*/%]/y },
];

const classifyWord = (word: string, next: string): string => {
  const upper = word.toUpperCase();
  if (KEYWORDS.has(upper)) return "hl-kw";
  if (TYPES.has(upper)) return "hl-type";
  if (upper === "NULL" || upper === "TRUE" || upper === "FALSE") return "hl-bool";
  return next === "(" ? "hl-fn" : "";
};

export function highlightSQL(code: string, options: HighlightOptions = {}): string {
  const { problems = [], multiSelections = [] } = options;
  const selectedClass = (start: number, length: number): string =>
    multiSelections.some((s) => start < s.end && start + length > s.start)
      ? " hl-multi-selected"
      : "";

  let html = "";
  let index = 0;
  while (index < code.length) {
    let className = "";
    let text = "";
    for (const rule of RULES) {
      rule.regex.lastIndex = index;
      const match = rule.regex.exec(code);
      if (!match?.[0]) continue;
      text = match[0];
      className =
        rule.className === "word"
          ? classifyWord(text, code.slice(index + text.length).trimStart()[0] ?? "")
          : rule.className;
      break;
    }
    if (!text) text = code[index];
    const classes =
      `${className}${getProblemClass(problems, index, text.length)}${selectedClass(index, text.length)}`.trim();
    html += classes ? `<span class="${classes}">${escapeHtml(text)}</span>` : escapeHtml(text);
    index += text.length;
  }
  return html;
}
