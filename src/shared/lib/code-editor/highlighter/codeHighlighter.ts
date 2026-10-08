/**
 * Unified Code Highlighter Engine
 * Dispatches to language-specific highlighters (JS/TS/React, CSS, HTML, etc.)
 */

import { HighlightOptions, DiagnosticProblem, HighlighterFunction, escapeHtml } from "./types";
import { highlightJS, highlightTemplateLiteral } from "./jsHighlighter";
import { highlightCSS } from "./cssHighlighter";
import { highlightHTML } from "./htmlHighlighter";
import { highlightSQL } from "./sqlHighlighter";
import { highlightJSON } from "./jsonHighlighter";
import { highlightShell } from "./shellHighlighter";
import { findMatchingBracketPair } from "../bracketMatcher";
import { getLanguageCapabilities, getLanguageId } from "../languages/languageDetector";
import { getMarkupContext } from "../markupContext";

export {
  highlightJS,
  highlightCSS,
  highlightHTML,
  highlightSQL,
  highlightJSON,
  highlightShell,
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
    case "scss":
    case "less":
      return highlightCSS(code, options);
    case "html":
      return highlightHTML(code, options);
    case "markdown":
    case "plaintext":
      return highlightPlainText(code, options.multiSelections);
    case "sql":
      return highlightSQL(code, options);
    case "json":
      return highlightJSON(code, options);
    case "shellscript":
      return highlightShell(code, options);
    case "javascript":
    case "javascriptreact":
    case "typescript":
    case "typescriptreact":
    default: {
      const { supportsJsx, supportsTypeScript } = getLanguageCapabilities(lang);
      return highlightJS(code, {
        ...options,
        supportsJsx,
        supportsTypeScript,
        jsxTextRanges: supportsJsx ? getMarkupContext(code, languageOrFilepath).textRanges : [],
      });
    }
  }
}
