/**
 * IntelliSense & Autocomplete Engine
 */

import { TaskFile } from "./importManager";
import { CompletionItem } from "./snippetsData";
import { expandSnippet } from "./snippets/snippetExpander";
import { getImportCompletions } from "./snippets/importCompleter";
import { getMemberCompletions } from "./snippets/memberCompleter";
import { getGeneralCompletions } from "./snippets/generalCompleter";
import { getCssCompletions } from "./snippets/cssCompleter";
import { getHtmlCompletions } from "./snippets/htmlCompleter";
import { getSqlCompletions } from "./snippets/sqlCompleter";
import { getLanguageId, getLanguageCapabilities } from "./languages/languageDetector";
import { JSON_SNIPPETS } from "./languages/jsonKnowledge";
import { fuzzyMatch } from "./fuzzyMatcher";

export { expandSnippet };

export interface CompletionOptions {
  files?: TaskFile[];
  filepath?: string;
  title?: string;
  force?: boolean;
}

export interface CompletionResult {
  word: string;
  items: CompletionItem[];
}

export function getCompletions(
  fullCode: string,
  cursorIndex: number,
  options: CompletionOptions = {}
): CompletionResult {
  if (!fullCode && fullCode !== "") return { word: "", items: [] };

  const { files = [], filepath = "main.jsx", title = "", force = false } = options;
  const currentFilepath = title || filepath;
  const languageId = getLanguageId(currentFilepath);
  const capabilities = getLanguageCapabilities(languageId);

  const textBeforeCursor = fullCode.substring(0, cursorIndex);
  const lineStart = textBeforeCursor.lastIndexOf("\n") + 1;
  const currentLineBeforeCursor = textBeforeCursor.substring(lineStart);
  const lineEnd = fullCode.indexOf("\n", cursorIndex);
  const lineAfterCursor =
    lineEnd === -1 ? fullCode.substring(cursorIndex) : fullCode.substring(cursorIndex, lineEnd);
  const fullCurrentLine = currentLineBeforeCursor + lineAfterCursor;

  if (currentLineBeforeCursor.includes("//")) {
    return { word: "", items: [] };
  }

  // 1. Language-Specific Handlers
  if (languageId === "css") {
    const cssRes = getCssCompletions(cursorIndex, currentLineBeforeCursor, lineAfterCursor, force);
    return cssRes || { word: "", items: [] };
  }

  if (languageId === "html") {
    const htmlRes = getHtmlCompletions(
      cursorIndex,
      currentLineBeforeCursor,
      lineAfterCursor,
      force
    );
    return htmlRes || { word: "", items: [] };
  }

  if (languageId === "sql") {
    const sqlRes = getSqlCompletions(cursorIndex, currentLineBeforeCursor, lineAfterCursor, force);
    return sqlRes || { word: "", items: [] };
  }

  if (languageId === "json") {
    const wordMatch = currentLineBeforeCursor.match(/([a-zA-Z0-9_$"]*)$/);
    const word = wordMatch ? wordMatch[1] : "";
    const items: CompletionItem[] = [];
    for (const snip of JSON_SNIPPETS) {
      const { match, score } = fuzzyMatch(snip.prefix, word);
      if (match || !word || force) {
        items.push({
          prefix: snip.prefix,
          label: snip.label,
          detail: snip.detail,
          kind: "snippet",
          insertText: snip.prefix,
          snippet: snip,
          score,
        });
      }
    }
    return { word, items };
  }

  // 2. Import Line Context
  const isImportLine =
    /^\s*import\b/.test(currentLineBeforeCursor) || /^\s*import\b/.test(fullCurrentLine);
  if (isImportLine) {
    const importRes = getImportCompletions(
      fullCode,
      cursorIndex,
      currentLineBeforeCursor,
      lineAfterCursor,
      lineStart,
      lineEnd,
      fullCurrentLine,
      files,
      currentFilepath,
      capabilities
    );
    if (importRes) return importRes;
  }

  // 3. Member & Receiver & CSS in JS Context
  const memberRes = getMemberCompletions(
    cursorIndex,
    currentLineBeforeCursor,
    lineAfterCursor,
    capabilities
  );
  if (memberRes) return memberRes;

  // 4. General Identifiers, Tags, Props, Snippets & Emmet
  return getGeneralCompletions(
    fullCode,
    cursorIndex,
    textBeforeCursor,
    currentLineBeforeCursor,
    lineAfterCursor,
    files,
    currentFilepath,
    capabilities,
    force
  );
}
