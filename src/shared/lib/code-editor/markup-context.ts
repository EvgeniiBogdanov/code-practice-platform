import { getLanguageCapabilities, getLanguageId } from "./languages/languageDetector";

export const HTML_VOID_TAGS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

interface MarkupTag {
  name: string;
  start: number;
  end: number;
  closing: boolean;
  selfClosing: boolean;
}

export interface MarkupContext {
  mode: "code" | "text" | "tag" | "literal";
  tagStart: number;
  tags: MarkupTag[];
  openTags: string[];
}

// Track lexical context, including JS expressions inside markup. A '>' in an
// attribute string, arrow function or comparison must never finish a tag.
export const getMarkupContext = (code: string, filepath: string): MarkupContext => {
  const capabilities = getLanguageCapabilities(getLanguageId(filepath));
  const jsx = capabilities.supportsJsx;
  let mode: "code" | "text" | "tag" = jsx || !capabilities.supportsHtmlTags ? "code" : "text";
  const tags: MarkupTag[] = [];
  const openTags: string[] = [];
  const expressions: Array<{ mode: "text" | "tag"; depth: number; tagStart: number }> = [];
  const roots: number[] = [];
  let tagStart = -1;
  let typeDepth = 0;
  let quote = "";
  let comment = "";
  let regex = false;
  let regexClass = false;
  let previous = "";
  let i = 0;
  while (i < code.length) {
    const ch = code[i];
    const next = code[i + 1];
    if (comment) {
      const terminator = comment === "line" ? "\n" : comment === "html" ? "-->" : "*/";
      if (code.startsWith(terminator, i)) {
        i += terminator.length;
        comment = "";
      } else i++;
      continue;
    }
    if (quote) {
      if (ch === "\\" && mode === "code") i += 2;
      else {
        if (ch === quote) quote = "";
        i++;
      }
      continue;
    }
    if (regex) {
      if (ch === "\\") i += 2;
      else {
        if (ch === "[") regexClass = true;
        if (ch === "]") regexClass = false;
        if (ch === "/" && !regexClass) regex = false;
        i++;
      }
      continue;
    }
    // HTML raw-text elements contain code, not nested markup.
    if (!jsx && mode === "text" && /^(script|style|textarea|title)$/i.test(openTags.at(-1) ?? "")) {
      const name = openTags.at(-1);
      const rest = code.slice(i);
      const closing = new RegExp(`</${name}\\s*>`, "i").exec(rest);
      if (!closing) return { mode: "literal", tagStart, tags, openTags };
      if (closing.index > 0) {
        i += closing.index;
        continue;
      }
    }
    if (mode === "text" && code.startsWith("<!--", i)) {
      comment = "html";
      i += 4;
      continue;
    }
    if (mode === "code") {
      if (ch === "/" && (next === "/" || next === "*")) {
        comment = next === "/" ? "line" : "block";
        i += 2;
        continue;
      }
      if (ch === '"' || ch === "'" || ch === "`") {
        quote = ch;
        i++;
        continue;
      }
      if (ch === "/" && /^(?:|return|[=(:,!&|?;{])$/.test(previous)) {
        regex = true;
        i++;
        continue;
      }
      const expression = expressions.at(-1);
      if (expression && ch === "{") expression.depth++;
      if (expression && ch === "}" && --expression.depth === 0) {
        mode = expression.mode;
        tagStart = expression.tagStart;
        expressions.pop();
        i++;
        continue;
      }
      if (/[\w$]/.test(ch)) {
        const token = /^[\w$]+/.exec(code.slice(i))?.[0] ?? ch;
        previous = token;
        i += token.length;
        continue;
      }
    }
    if ((mode === "tag" || mode === "text") && jsx && ch === "{") {
      expressions.push({ mode, depth: 1, tagStart });
      mode = "code";
      previous = "";
      i++;
      continue;
    }
    if (mode === "tag" && jsx && (ch === "<" || typeDepth > 0)) {
      if (ch === "<") typeDepth++;
      if (ch === ">") typeDepth--;
      i++;
      continue;
    }
    if (mode === "tag") {
      if (ch === '"' || ch === "'") quote = ch;
      if (ch === ">") {
        const source = code.slice(tagStart, i + 1);
        const match = /^<(\/)?([\w$.:-]*)/.exec(source);
        if (match) {
          const name = match[2];
          const closing = Boolean(match[1]);
          const selfClosing =
            /\/\s*>$/.test(source) || (!jsx && HTML_VOID_TAGS.has(name.toLowerCase()));
          tags.push({ name, closing, selfClosing, start: tagStart, end: i + 1 });
          if (closing) {
            const index = openTags
              .map((tag) => (jsx ? tag : tag.toLowerCase()))
              .lastIndexOf(jsx ? name : name.toLowerCase());
            if (index !== -1) openTags.length = index;
          } else if (!selfClosing) openTags.push(name);
        }
        mode = "text";
        if (jsx && roots.length && openTags.length === roots.at(-1)) {
          roots.pop();
          mode = "code";
          previous = ")";
        }
      }
      i++;
      continue;
    }
    const startsTag = ch === "<" && (next === undefined || /[A-Za-z/>]/.test(next));
    const expressionStart = /^(?:|return|yield|default|[=(:,!&|?;{>])$/.test(previous);
    if (
      capabilities.supportsHtmlTags &&
      startsTag &&
      (mode === "text" || (jsx && expressionStart))
    ) {
      // TSX generic arrow parameters are not markup.
      if (mode === "code" && /^<[\w$]+\s*(?:,|extends\b)/.test(code.slice(i))) {
        i++;
        continue;
      }
      if (mode === "code") roots.push(openTags.length);
      tagStart = i;
      mode = "tag";
    } else if (mode === "code" && !/\s/.test(ch)) previous = ch;
    i++;
  }
  return { mode: quote || comment || regex ? "literal" : mode, tagStart, tags, openTags };
};

export interface MarkupEdit {
  newCode: string;
  newCursor: number;
}

export const getAutoCloseTagEdit = (
  code: string,
  cursor: number,
  filepath: string
): MarkupEdit | null => {
  if (!getLanguageCapabilities(getLanguageId(filepath)).supportsHtmlTags) return null;
  const before = code.slice(0, cursor);
  const context = getMarkupContext(before, filepath);
  const tag = context.tags.at(-1);
  if (!tag || tag.end !== cursor || tag.closing || tag.selfClosing) return null;
  // Do not steal a closing tag belonging to an ancestor with the same name.
  const remaining = getMarkupContext(code, filepath);
  const jsx = getLanguageCapabilities(getLanguageId(filepath)).supportsJsx;
  const matches = (name: string): boolean =>
    jsx ? name === tag.name : name.toLowerCase() === tag.name.toLowerCase();
  const required = context.openTags.filter(matches).length;
  const available = remaining.tags
    .filter((entry) => entry.start >= cursor && matches(entry.name) && !entry.selfClosing)
    .reduce((count, entry) => count + (entry.closing ? 1 : -1), 0);
  if (available >= required) return null;
  const closing = `</${tag.name}>`;
  return { newCode: before + closing + code.slice(cursor), newCursor: cursor };
};
