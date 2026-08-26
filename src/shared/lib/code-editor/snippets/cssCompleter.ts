/**
 * CSS Autocomplete Provider
 */

import { fuzzyMatch } from "../fuzzyMatcher";
import { CSS_PROPERTIES, CSS_VALUES, CSS_PSEUDO_CLASSES } from "../languages/cssKnowledge";
import { CompletionItem } from "../snippetsData";

export function getCssCompletions(
  cursorIndex: number,
  currentLineBeforeCursor: string,
  lineAfterCursor: string,
  force = false
): { word: string; items: CompletionItem[] } | null {
  const isValueContext = /:\s*([a-zA-Z0-9_-]*)$/.exec(currentLineBeforeCursor);
  if (isValueContext) {
    const propMatch = /([a-zA-Z0-9_-]+)\s*:\s*([a-zA-Z0-9_-]*)$/.exec(currentLineBeforeCursor);
    const propName = propMatch ? propMatch[1].toLowerCase() : "";
    const query = isValueContext[1] || "";

    const afterMatch = lineAfterCursor.match(/^[a-zA-Z0-9_-]*/);
    const afterLen = afterMatch ? afterMatch[0].length : 0;

    const candidateValues = CSS_VALUES[propName] || [
      "inherit",
      "initial",
      "unset",
      "none",
      "auto",
      "transparent",
    ];

    const scored: CompletionItem[] = [];
    for (const val of candidateValues) {
      const { match, score } = fuzzyMatch(val, query);
      if (match || !query || force) {
        scored.push({
          prefix: val,
          label: val,
          detail: `CSS значение для '${propName}'`,
          kind: "value",
          insertText: val.endsWith(";") ? val : `${val};`,
          replaceStart: cursorIndex - query.length,
          replaceEnd: cursorIndex + afterLen,
          score,
        });
      }
    }

    if (scored.length > 0) {
      scored.sort((a, b) => (b.score || 0) - (a.score || 0));
      return { word: query || ":", items: scored.slice(0, 12) };
    }
  }

  // Pseudo-classes (:hover, etc.)
  const pseudoMatch = /(:{1,2}[a-zA-Z0-9_-]*)$/.exec(currentLineBeforeCursor);
  if (pseudoMatch) {
    const query = pseudoMatch[1];
    const afterMatch = lineAfterCursor.match(/^[a-zA-Z0-9_-]*/);
    const afterLen = afterMatch ? afterMatch[0].length : 0;

    const scored: CompletionItem[] = [];
    for (const pseudo of CSS_PSEUDO_CLASSES) {
      const { match, score } = fuzzyMatch(pseudo.name, query);
      if (match || !query || force) {
        scored.push({
          prefix: pseudo.name,
          label: pseudo.name,
          detail: pseudo.detail,
          kind: "property",
          insertText: pseudo.name,
          replaceStart: cursorIndex - query.length,
          replaceEnd: cursorIndex + afterLen,
          score,
        });
      }
    }

    if (scored.length > 0) {
      scored.sort((a, b) => (b.score || 0) - (a.score || 0));
      return { word: query, items: scored.slice(0, 12) };
    }
  }

  // CSS Properties
  const propQueryMatch = /([a-zA-Z0-9_-]+)$/.exec(currentLineBeforeCursor);
  const query = propQueryMatch ? propQueryMatch[1] : "";
  if (!query && !force) return null;

  const afterMatch = lineAfterCursor.match(/^[a-zA-Z0-9_-]*/);
  const afterLen = afterMatch ? afterMatch[0].length : 0;

  const scoredProps: CompletionItem[] = [];
  for (const prop of CSS_PROPERTIES) {
    const { match, score } = fuzzyMatch(prop.name, query);
    if (match || (!query && force)) {
      const tabStop = prop.insertText.indexOf("$1");
      const rawInsert = prop.insertText.replace(/\$1/g, "");
      const cursorOffset = tabStop >= 0 ? tabStop : undefined;
      scoredProps.push({
        prefix: prop.name,
        label: prop.name,
        detail: prop.detail,
        kind: "property",
        insertText: rawInsert,
        cursorOffset,
        replaceStart: cursorIndex - query.length,
        replaceEnd: cursorIndex + afterLen,
        score,
      });
    }
  }

  if (scoredProps.length > 0) {
    scoredProps.sort((a, b) => (b.score || 0) - (a.score || 0));
    return { word: query, items: scoredProps.slice(0, 12) };
  }

  return null;
}
