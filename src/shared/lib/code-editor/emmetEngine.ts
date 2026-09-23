import expandAbbreviation, { extract, markupAbbreviation, resolveConfig } from "emmet";
import { JS_GLOBALS } from "./languages/javascriptKnowledge";
import { MARKUP_TAG_NAMES } from "./languages/markup-tags";
import { getMarkupContext } from "./markup-context";
import type { CompletionItem } from "./snippetsData";

export const parseEmmet: typeof markupAbbreviation = markupAbbreviation;
const EMMET_SNIPPETS = new Set(Object.keys(resolveConfig({ syntax: "jsx" }).snippets));
const isKnownAbbreviation = (value: string): boolean =>
  MARKUP_TAG_NAMES.has(value) || EMMET_SNIPPETS.has(value);

export const isEmmetAbbreviation = (value: string): boolean => {
  if (!value || value.length > 500) return false;
  try {
    return markupAbbreviation(value, { maxRepeat: 1000 }).children.length > 0;
  } catch {
    return false;
  }
};

interface Expansion {
  text: string;
  cursorOffset: number;
}

const expand = (abbr: string, baseIndent: string, jsx: boolean): Expansion | null => {
  if (!isEmmetAbbreviation(abbr)) return null;
  try {
    const marker = "\u0000";
    const text = expandAbbreviation(abbr, {
      syntax: jsx ? "jsx" : "html",
      maxRepeat: 1000,
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

export interface EmmetCompletions {
  word: string;
  items: CompletionItem[];
}

export const getEmmetCompletions = (
  code: string,
  cursor: number,
  filepath: string,
  jsx: boolean
): EmmetCompletions | null => {
  const extracted = extract(code, cursor, { lookAhead: true });
  if (!extracted) return null;
  const context = getMarkupContext(code.slice(0, extracted.start), filepath);
  if (context.mode === "literal" || context.mode === "tag") return null;
  const lineStart = code.lastIndexOf("\n", extracted.start - 1) + 1;
  const prefix = code.slice(lineStart, extracted.start);
  if (
    jsx &&
    context.mode === "code" &&
    !/^\s*$/.test(prefix) &&
    !/(?:\breturn\s*\(?|=>\s*\(?|[=(])\s*$/.test(prefix)
  )
    return null;

  const query = extracted.abbreviation;
  if (
    jsx &&
    context.mode === "code" &&
    /^(const|let|var|function|return|import|export|if|for|while|switch|class|type|interface)\b/.test(
      query
    )
  )
    return null;
  const simple = /^[A-Za-z][\w:-]*$/.test(query);
  const root = /^[A-Za-z][\w:-]*/.exec(query)?.[0];
  if (
    jsx &&
    context.mode === "code" &&
    root &&
    (JS_GLOBALS.includes(root) || root === "React" || root === "ReactDOM") &&
    query.startsWith(root + ".")
  )
    return null;
  const candidates = new Set<string>();
  const known = isKnownAbbreviation(query);
  if (known) candidates.add(query);
  if (simple) {
    for (const name of MARKUP_TAG_NAMES) if (name.startsWith(query)) candidates.add(name);
    for (const name of EMMET_SNIPPETS) if (name.startsWith(query)) candidates.add(name);
  }
  // Unknown names are valid Emmet in HTML/JSX children. In JavaScript code,
  // preserve identifiers and property access; custom compound components and
  // hyphenated custom elements are unambiguous markup abbreviations.
  const custom =
    !jsx ||
    context.mode === "text" ||
    Boolean(root?.includes("-")) ||
    (!simple && /^[A-Z]/.test(query));
  if (custom || (!simple && (!root || isKnownAbbreviation(root)))) candidates.add(query);
  if (!candidates.size) return null;

  const indent = /^[ \t]*/.exec(prefix)?.[0] ?? "";
  const items: CompletionItem[] = [];
  for (const candidate of candidates) {
    const expanded = expand(candidate, indent, jsx);
    if (!expanded) continue;
    items.push({
      prefix: candidate,
      label: `${candidate} ⚡ (Emmet)`,
      detail: expanded.text,
      kind: "snippet",
      insertText: expanded.text,
      cursorOffset: expanded.cursorOffset,
      replaceStart: extracted.start,
      replaceEnd:
        extracted.end +
        (simple ? (/^[\w:-]*/.exec(code.slice(extracted.end))?.[0].length ?? 0) : 0),
      score: candidate === query ? 140 : 130,
    });
    if (items.length === 12) break;
  }
  return items.length ? { word: query, items } : null;
};

export const getEmmetCompletion = (
  code: string,
  cursor: number,
  filepath: string,
  jsx: boolean
): CompletionItem | null => getEmmetCompletions(code, cursor, filepath, jsx)?.items[0] ?? null;
