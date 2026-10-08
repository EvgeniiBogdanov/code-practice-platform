/**
 * Shell Syntax Highlighter (sh, bash, zsh)
 */

import type { HighlightOptions } from "./types";
import { highlightWithRules, type TokenRule } from "./tokenHighlighter";

const KEYWORDS = new Set([
  "if",
  "then",
  "elif",
  "else",
  "fi",
  "for",
  "while",
  "until",
  "do",
  "done",
  "case",
  "esac",
  "in",
  "function",
  "select",
  "time",
  "return",
  "break",
  "continue",
  "local",
  "export",
  "readonly",
  "declare",
  "unset",
  "shift",
  "exit",
]);

const BUILTINS = new Set([
  "echo",
  "printf",
  "cd",
  "pwd",
  "ls",
  "cat",
  "grep",
  "sed",
  "awk",
  "find",
  "mkdir",
  "rm",
  "cp",
  "mv",
  "touch",
  "chmod",
  "chown",
  "curl",
  "wget",
  "git",
  "npm",
  "npx",
  "pnpm",
  "yarn",
  "node",
  "source",
  "eval",
  "exec",
  "test",
  "read",
  "trap",
  "kill",
  "sudo",
  "tar",
  "head",
  "tail",
  "sort",
  "uniq",
  "xargs",
  "tee",
  "env",
  "which",
]);

const RULES: TokenRule[] = [
  { className: "hl-cm", regex: /(?<![\w$])#.*/y },
  { className: "hl-str", regex: /"(?:[^"\\]|\\[\s\S])*"?|'[^']*'?/y },
  { className: "hl-prop", regex: /\$(?:\{[^}\n]*\}?|[A-Za-z_]\w*|[0-9@#?$!*-])/y },
  { className: "hl-attr", regex: /(?<![\w-])--?[A-Za-z][\w-]*/y },
  { className: "hl-num", regex: /\b\d+\b/y },
  { className: "word", regex: /[A-Za-z_][\w.-]*/y },
  { className: "hl-op", regex: /&&|\|\||>>|<<|[|;&<>=]/y },
];

export function highlightShell(code: string, options: HighlightOptions = {}): string {
  return highlightWithRules(code, RULES, options, (rule, text) => {
    if (rule.className !== "word") return rule.className;
    if (KEYWORDS.has(text)) return "hl-kw";
    return BUILTINS.has(text) ? "hl-fn" : "";
  });
}
