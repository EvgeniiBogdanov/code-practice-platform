/**
 * IntelliSense & Autocomplete Engine
 */

import { TaskFile } from "./importManager";
import { CompletionItem } from "./snippetsData";
import { expandSnippet } from "./snippets/snippetExpander";
import { getImportCompletions } from "./snippets/importCompleter";
import { getMemberCompletions } from "./snippets/memberCompleter";
import { getGeneralCompletions } from "./snippets/generalCompleter";

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

  // 1. Import Line Context
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
      currentFilepath
    );
    if (importRes) return importRes;
  }

  // 2. Member & CSS & Generics Context
  const memberRes = getMemberCompletions(cursorIndex, currentLineBeforeCursor, lineAfterCursor);
  if (memberRes) return memberRes;

  // 3. General Identifiers, Tags, Props, Snippets & Emmet
  return getGeneralCompletions(
    fullCode,
    cursorIndex,
    textBeforeCursor,
    currentLineBeforeCursor,
    lineAfterCursor,
    files,
    currentFilepath,
    force
  );
}
