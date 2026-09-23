import expandAbbreviation, { extract, markupAbbreviation } from "emmet";
import { HTML_TAGS } from "./languages/htmlKnowledge";
import { getMarkupContext } from "./markup-context";
import type { CompletionItem } from "./snippetsData";

export const parseEmmet = markupAbbreviation;

export const isEmmetAbbreviation = (value: string): boolean => {
  if (!value || value.length > 500) return false;
  if (
    /^(const|let|var|function|return|import|export|if|for|while|switch|class|type|interface)\b/.test(
      value
    )
  )
    return false;
  return (
    HTML_TAGS.some((tag) => tag.name === value) ||
    /[.#>+*[{(]/.test(value) ||
    /^[a-z]+-[\w-]+$/.test(value)
  );
};

interface Expansion {
  text: string;
  cursorOffset: number;
}

const expand = (abbr: string, baseIndent: string, jsx: boolean): Expansion | null => {
  if (!isEmmetAbbreviation(abbr)) return null;
  try {
    // A bounded repeat count prevents accidental UI freezes while typing.
    if ([...abbr.matchAll(/\*(\d+)/g)].reduce((total, match) => total * Number(match[1]), 1) > 100)
      return null;
    const marker = "\u0000";
    const text = expandAbbreviation(abbr, {
      syntax: jsx ? "jsx" : "html",
      options: {
        "output.indent": "  ",
        "output.selfClosingStyle": jsx ? "xhtml" : "html",
        "output.baseIndent": baseIndent,
        "output.field": (_index: number, placeholder: string): string => marker + placeholder,
      },
    });
    const first = text.indexOf(marker);
    return { text: text.replaceAll(marker, ""), cursorOffset: first < 0 ? text.length : first };
  } catch {
    return null;
  }
};

export const expandEmmetAbbreviation = (abbr: string, baseIndent = "", jsx = true): string | null =>
  expand(abbr, baseIndent, jsx)?.text ?? null;

export const getEmmetCompletion = (
  code: string,
  cursor: number,
  filepath: string,
  jsx: boolean
): CompletionItem | null => {
  const extracted = extract(code, cursor, { lookAhead: true });
  if (!extracted) return null;
  const context = getMarkupContext(code.slice(0, extracted.start), filepath);
  if (context.mode === "literal" || context.mode === "tag") return null;
  const lineStart = code.lastIndexOf("\n", extracted.start - 1) + 1;
  const prefix = code.slice(lineStart, extracted.start);
  // In JS expressions only offer markup at an expression boundary, never for
  // variable declarations, property access or arithmetic such as a + b.
  if (
    jsx &&
    context.mode === "code" &&
    !/^\s*$/.test(prefix) &&
    !/(?:\breturn\s*\(?|=>\s*\(?|[=(])\s*$/.test(prefix)
  )
    return null;
  if (jsx && context.mode === "code") {
    const root = /^[a-z][\w-]*/.exec(extracted.abbreviation)?.[0];
    if (root && !HTML_TAGS.some((tag) => tag.name === root) && !root.includes("-")) return null;
  }
  const expanded = expand(extracted.abbreviation, /^\s*/.exec(prefix)?.[0] ?? "", jsx);
  if (!expanded) return null;
  return {
    prefix: extracted.abbreviation,
    label: `${extracted.abbreviation} ⚡ (Emmet)`,
    detail: jsx ? "Развернуть JSX разметку" : "Развернуть HTML разметку",
    kind: "snippet",
    insertText: expanded.text,
    cursorOffset: expanded.cursorOffset,
    replaceStart: extracted.start,
    replaceEnd: extracted.end,
    score: 130,
  };
};
