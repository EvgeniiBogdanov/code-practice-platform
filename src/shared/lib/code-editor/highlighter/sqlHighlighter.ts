/**
 * SQL Syntax Highlighter
 */

import type { HighlightOptions } from "./types";
import { highlightWithRules, type TokenRule } from "./tokenHighlighter";
import { SQL_KEYWORDS, SQL_TYPES } from "../languages/sqlKnowledge";

const words = (entries: readonly string[]): Set<string> =>
  new Set(entries.flatMap((entry) => entry.toUpperCase().match(/[A-Z_]+/g) ?? []));

const KEYWORDS = words(SQL_KEYWORDS);
const TYPES = words(SQL_TYPES);

const RULES: TokenRule[] = [
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
  return highlightWithRules(code, RULES, options, (rule, text, rest) =>
    rule.className === "word" ? classifyWord(text, rest.trimStart()[0] ?? "") : rule.className
  );
}
