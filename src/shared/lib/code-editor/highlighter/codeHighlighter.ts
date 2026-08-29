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
        return escapeHtml(code);
      }
      return highlightJS(code, options);
    case "javascript":
    case "javascriptreact":
    case "typescript":
    case "typescriptreact":
    case "json":
    case "sql":
    default:
      return highlightJS(code, options);
  }
}
