/**
 * Unified Code Highlighter Engine
 * Dispatches to language-specific highlighters (JS/TS/React, CSS, HTML, etc.)
 */

import { HighlightOptions, DiagnosticProblem, HighlighterFunction, escapeHtml } from "./types";
import { highlightJS, highlightTemplateLiteral } from "./jsHighlighter";
import { highlightCSS } from "./cssHighlighter";
import { highlightHTML } from "./htmlHighlighter";
import { findMatchingBracketPair } from "../bracketMatcher";
import { getLanguageId } from "../languages/languageDetector";

export {
  highlightJS,
  highlightCSS,
  highlightHTML,
  highlightTemplateLiteral,
  findMatchingBracketPair,
  escapeHtml,
};
export type { DiagnosticProblem, HighlightOptions, HighlighterFunction };

function highlightPlainText(code: string, selections: HighlightOptions["multiSelections"]): string {
  if (!selections?.length) return escapeHtml(code);

  let html = "";
  let cursor = 0;
  for (const selection of [...selections].sort((a, b) => a.start - b.start)) {
    const start = Math.max(cursor, selection.start);
    const end = Math.min(code.length, selection.end);
    if (end <= start) continue;
    html += escapeHtml(code.slice(cursor, start));
    html += `<span class="hl-multi-selected">${escapeHtml(code.slice(start, end))}</span>`;
    cursor = end;
  }
  return html + escapeHtml(code.slice(cursor));
}

export function highlightCode(
  code: string,
  languageOrFilepath = "main.jsx",
  options: HighlightOptions = {}
): string {
  if (!code) return "";

  const lang = getLanguageId(languageOrFilepath);

  switch (lang) {
    case "css":
      return highlightCSS(code, options);
    case "html":
      return highlightHTML(code, options);
    case "markdown":
    case "plaintext":
      if (
        languageOrFilepath === "notepad" ||
        languageOrFilepath === "text" ||
        languageOrFilepath === "txt"
      ) {
        return highlightPlainText(code, options.multiSelections);
      }
      return highlightPlainText(code, options.multiSelections);
    case "javascript":
    case "javascriptreact":
    case "typescript":
    case "typescriptreact":
    case "json":
    case "sql":
    default:
      return highlightJS(code, {
        ...options,
        supportsJsx: lang === "javascriptreact" || lang === "typescriptreact",
        supportsTypeScript: lang === "typescript" || lang === "typescriptreact",
      });
  }
}
