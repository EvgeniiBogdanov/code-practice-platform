/**
 * HTML Autocomplete Provider
 */

import { fuzzyMatch } from "../fuzzyMatcher";
import { isEmmetAbbreviation, expandEmmetAbbreviation } from "../emmetEngine";
import { HTML_TAGS, HTML_ATTRIBUTES, HTML_SNIPPETS } from "../languages/htmlKnowledge";
import { CompletionItem } from "../snippetsData";

export function getHtmlCompletions(
  cursorIndex: number,
  currentLineBeforeCursor: string,
  lineAfterCursor: string,
  force = false
): { word: string; items: CompletionItem[] } | null {
  // 1. HTML Boilerplate snippets (! or html:5)
  const snippetMatch = /(?:^|\s)(!|html:5)$/.exec(currentLineBeforeCursor);
  if (snippetMatch) {
    const prefix = snippetMatch[1];
    const snip = HTML_SNIPPETS.find((s) => s.prefix === prefix);
    if (snip) {
      return {
        word: prefix,
        items: [
          {
            prefix: snip.prefix,
            label: snip.label,
            detail: snip.detail,
            kind: "snippet",
            insertText: snip.prefix,
            snippet: snip,
            replaceStart: cursorIndex - prefix.length,
            replaceEnd: cursorIndex,
            score: 150,
          },
        ],
      };
    }
  }

  // 2. Tag open <tag
  const tagOpenMatch = currentLineBeforeCursor.match(/<([a-zA-Z0-9_-]*)$/);
  if (tagOpenMatch) {
    const query = tagOpenMatch[1];
    const afterMatch = lineAfterCursor.match(/^[a-zA-Z0-9_-]*/);
    const afterLen = afterMatch ? afterMatch[0].length : 0;
    const scored: CompletionItem[] = [];

    for (const tag of HTML_TAGS) {
      const { match, score } = fuzzyMatch(tag.name, query);
      if (match || !query || force) {
        scored.push({
          prefix: tag.name,
          label: `<${tag.name}>`,
          detail: tag.detail,
          kind: "keyword",
          insertText: tag.name,
          replaceStart: cursorIndex - query.length,
          replaceEnd: cursorIndex + afterLen,
          score: score + 10,
        });
      }
    }

    if (scored.length > 0) {
      scored.sort((a, b) => (b.score || 0) - (a.score || 0));
      return { word: query || "<", items: scored.slice(0, 12) };
    }
  }

  // 3. Inside Tag Attributes (<div cl...)
  const inTagMatch = currentLineBeforeCursor.match(
    /<([a-zA-Z0-9_-]+)(?:\s+[^>]*?)?\s+([a-zA-Z0-9_-]*)$/
  );
  const isInsideQuote = /=["'][^"']*$/.test(currentLineBeforeCursor);

  if (inTagMatch && !isInsideQuote) {
    const query = inTagMatch[2] || "";
    const afterMatch = lineAfterCursor.match(/^[a-zA-Z0-9_-]*/);
    const afterLen = afterMatch ? afterMatch[0].length : 0;
    const scored: CompletionItem[] = [];

    for (const attr of HTML_ATTRIBUTES) {
      const { match, score } = fuzzyMatch(attr.name, query);
      if (match || !query || force) {
        const cleanInsert = attr.insertText.replace(/\$1/g, "");
        scored.push({
          prefix: attr.name,
          label: attr.name,
          detail: attr.detail,
          kind: "property",
          insertText: cleanInsert,
          replaceStart: cursorIndex - query.length,
          replaceEnd: cursorIndex + afterLen,
          score,
        });
      }
    }

    if (scored.length > 0) {
      scored.sort((a, b) => (b.score || 0) - (a.score || 0));
      return { word: query || "attr", items: scored.slice(0, 12) };
    }
  }

  // 4. Emmet for HTML
  const emmetMatch = currentLineBeforeCursor.match(/([a-zA-Z0-9_$.#:>+*^=$/-]+)$/);
  if (emmetMatch && isEmmetAbbreviation(emmetMatch[1])) {
    const abbr = emmetMatch[1];
    const lineIndentMatch = currentLineBeforeCursor.match(/^(\s*)/);
    const lineIndent = lineIndentMatch ? lineIndentMatch[1] : "";
    const expanded = expandEmmetAbbreviation(abbr, lineIndent);
    if (expanded) {
      return {
        word: abbr,
        items: [
          {
            prefix: abbr,
            label: `${abbr} ⚡ (Emmet)`,
            detail: "Развернуть HTML разметку",
            kind: "snippet",
            insertText: expanded,
            replaceStart: cursorIndex - abbr.length,
            replaceEnd: cursorIndex,
            score: 130,
          },
        ],
      };
    }
  }

  return null;
}
