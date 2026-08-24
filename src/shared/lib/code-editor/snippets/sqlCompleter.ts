/**
 * SQL Autocomplete Provider
 */

import { fuzzyMatch } from "../fuzzyMatcher";
import { SQL_KEYWORDS, SQL_TYPES } from "../languages/sqlKnowledge";
import { CompletionItem } from "../snippetsData";

export function getSqlCompletions(
  cursorIndex: number,
  currentLineBeforeCursor: string,
  lineAfterCursor: string,
  force = false
): { word: string; items: CompletionItem[] } | null {
  const wordMatch = currentLineBeforeCursor.match(/([a-zA-Z0-9_$]+)$/);
  const query = wordMatch ? wordMatch[1] : "";
  if (!query && !force) return null;

  const afterMatch = lineAfterCursor.match(/^[a-zA-Z0-9_$]*/);
  const afterLen = afterMatch ? afterMatch[0].length : 0;
  const scored: CompletionItem[] = [];

  for (const kw of SQL_KEYWORDS) {
    const { match, score } = fuzzyMatch(kw, query);
    if (match || !query || force) {
      scored.push({
        prefix: kw,
        label: kw,
        detail: "SQL ключевое слово",
        kind: "keyword",
        insertText: kw,
        replaceStart: cursorIndex - query.length,
        replaceEnd: cursorIndex + afterLen,
        score: score + 5,
      });
    }
  }

  for (const t of SQL_TYPES) {
    const { match, score } = fuzzyMatch(t, query);
    if (match || !query || force) {
      scored.push({
        prefix: t,
        label: t,
        detail: "SQL тип данных",
        kind: "type",
        insertText: t,
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

  return null;
}
