/**
 * Rule-based highlighter for flat languages (SQL, JSON, Shell): the first rule that matches at
 * the current offset wins, anything unmatched stays plain text.
 */

import { HighlightOptions, escapeHtml, getProblemClass } from "./types";

export interface TokenRule {
  className: string;
  /** Sticky (`y`) expression, tried at the current offset. */
  regex: RegExp;
}

/** Lets a language refine a match, e.g. split identifiers into keywords and plain names. */
export type TokenClassifier = (rule: TokenRule, text: string, rest: string) => string;

const useRuleClass: TokenClassifier = (rule) => rule.className;

export function highlightWithRules(
  code: string,
  rules: readonly TokenRule[],
  options: HighlightOptions = {},
  classify: TokenClassifier = useRuleClass
): string {
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
    for (const rule of rules) {
      rule.regex.lastIndex = index;
      const match = rule.regex.exec(code);
      if (!match?.[0]) continue;
      text = match[0];
      className = classify(rule, text, code.slice(index + text.length));
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
