/**
 * JSON Syntax Highlighter
 * Strings, keys, numbers, true/false/null and punctuation, and nothing else: JavaScript pasted
 * into a JSON block must not be coloured as JavaScript. Comments are kept for JSONC.
 */

import type { HighlightOptions } from "./types";
import { highlightWithRules, type TokenRule } from "./tokenHighlighter";

const RULES: TokenRule[] = [
  { className: "hl-cm", regex: /\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/y },
  { className: "string", regex: /"(?:[^"\\\n]|\\.)*"?/y },
  { className: "hl-num", regex: /-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/y },
  { className: "hl-bool", regex: /\b(?:true|false|null)\b/y },
  { className: "hl-punct", regex: /[{}[\],:]/y },
  // Anything else (stray words, JavaScript) is consumed whole and left plain.
  { className: "", regex: /[^\s"{}[\],:/\d-]+/y },
];

export function highlightJSON(code: string, options: HighlightOptions = {}): string {
  return highlightWithRules(code, RULES, options, (rule, _text, rest) => {
    if (rule.className !== "string") return rule.className;
    // A string followed by a colon is an object key.
    return rest.trimStart().startsWith(":") ? "hl-prop" : "hl-str";
  });
}
