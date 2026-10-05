/**
 * JavaScript, JSX, TypeScript, TSX Syntax Highlighter
 */

import { HighlightOptions, escapeHtml, getProblemClass } from "./types";
import { scanExpression, scanTemplate } from "./jsScanning";
import {
  ACCESSOR_KEYWORDS,
  CONTEXTUAL_KEYWORDS,
  DECLARATION_KEYWORDS,
  FOLLOWED_BY_MEMBER_NAME,
  GENERIC_PARAMS_START,
  REGEX_PRECEDING_TOKENS,
  RULES,
  TOKEN_CLASSES,
  USED_AS_IDENTIFIER,
  VALUE_TOKENS,
} from "./jsHighlightRules";

/** Options for code embedded at `offset`: absolute ranges are rebased. */
const embedOptions = (options: HighlightOptions, offset: number): HighlightOptions => ({
  ...options,
  jsxTextRanges: [],
  multiSelections: options.multiSelections?.map(({ start, end }) => ({
    start: start - offset,
    end: end - offset,
  })),
  problems: options.problems?.map((problem) => ({
    ...problem,
    start: problem.start - offset,
    end: problem.end - offset,
  })),
});

export function highlightTemplateLiteral(
  text: string,
  options: HighlightOptions = {},
  offset = 0
): string {
  const closed = text.length > 1 && text.endsWith("`");
  const bodyEnd = closed ? text.length - 1 : text.length;
  const isSelected = (index: number): boolean =>
    Boolean(
      options.multiSelections?.some(
        (selection) => offset + index >= selection.start && offset + index < selection.end
      )
    );
  // Consecutive characters with the same selection state share one span: a long template
  // would otherwise emit a span per character.
  let result = "";
  let run = "";
  let runSelected = false;
  const flush = (): void => {
    if (run) {
      result += `<span class="hl-str${runSelected ? " hl-multi-selected" : ""}">${escapeHtml(run)}</span>`;
    }
    run = "";
  };
  const str = (index: number, value: string): void => {
    const selected = isSelected(index);
    if (run && selected !== runSelected) flush();
    runSelected = selected;
    run += value;
  };

  str(0, "`");
  let i = 1;
  while (i < bodyEnd) {
    if (text[i] === "\\" && i + 1 < bodyEnd) {
      str(i, text[i] + text[i + 1]);
      i += 2;
    } else if (text[i] === "$" && text[i + 1] === "{") {
      flush();
      const end = Math.min(scanExpression(text, i + 2), bodyEnd);
      const closedExpression = text[end - 1] === "}";
      const inner = text.slice(i + 2, closedExpression ? end - 1 : end);
      const innerOffset = offset + i + 2;
      result += `<span class="hl-op">\${</span>${highlightJS(inner, embedOptions(options, innerOffset))}`;
      if (closedExpression) result += '<span class="hl-op">}</span>';
      i = end;
    } else {
      str(i, text[i]);
      i++;
    }
  }
  if (closed) str(text.length - 1, "`");
  flush();
  return result;
}

export function highlightJS(code: string, options: HighlightOptions = {}): string {
  if (!code) return "";

  const { bracketPair = null, problems = [], multiSelections = [] } = options;
  const rules = options.supportsTypeScript ? RULES.ts : RULES.js;

  const isBracketMatch = (idx: number): boolean =>
    Boolean(bracketPair && (idx === bracketPair[0] || idx === bracketPair[1]));
  const isMultiSelected = (start: number, len: number): boolean => {
    if (multiSelections.length === 0) return false;
    const end = start + len;
    return multiSelections.some((s) => !(end <= s.start || start >= s.end));
  };
  let html = "";
  let insideJsxTag = false;
  let jsxBraceDepth = 0;
  // `<` nesting of type arguments in a tag head: `<Foo<string> a={1} />`.
  let jsxTypeDepth = 0;
  // Brace depths of enclosing tags while markup is nested in an attribute expression.
  const outerTags: number[] = [];
  const openTag = (): void => {
    if (insideJsxTag) outerTags.push(jsxBraceDepth);
    insideJsxTag = true;
    jsxBraceDepth = 0;
    jsxTypeDepth = 0;
  };
  const closeTag = (): void => {
    const outer = outerTags.pop();
    insideJsxTag = outer !== undefined;
    jsxBraceDepth = outer ?? 0;
    jsxTypeDepth = 0;
  };
  let lastTokenType = "";
  let lastTokenText = "";
  let index = 0;
  let textRangeIndex = 0;

  // `<` starts markup only where an expression may begin: not after a value or `)`.
  const canStartMarkup = (): boolean =>
    options.supportsJsx !== false &&
    !VALUE_TOKENS.has(lastTokenType) &&
    !(lastTokenType === "punct" && (lastTokenText === ")" || lastTokenText === "]")) &&
    // TSX generic arrow parameters are not markup.
    !GENERIC_PARAMS_START.test(code.slice(index, index + 64));

  while (index < code.length) {
    const textRange = options.jsxTextRanges?.[textRangeIndex];
    if (textRange && index === textRange.start) {
      const text = code.slice(textRange.start, textRange.end);
      for (let offset = 0; offset < text.length; offset++) {
        const escaped = escapeHtml(text[offset]);
        html += isMultiSelected(index + offset, 1)
          ? `<span class="hl-multi-selected">${escaped}</span>`
          : escaped;
      }
      index = textRange.end;
      textRangeIndex++;
      lastTokenType = "jsx-text";
      lastTokenText = "";
      continue;
    }

    const tokenStart = index;
    let type = "";
    let text = "";
    let match: RegExpExecArray | null = null;

    if (code[index] === "`") {
      type = "template";
      text = code.slice(index, scanTemplate(code, index));
    } else {
      for (const rule of rules) {
        if (rule.type === "disabled") continue;
        if (
          rule.type === "regex" &&
          (!REGEX_PRECEDING_TOKENS.has(lastTokenType) ||
            lastTokenText === ")" ||
            lastTokenText === "]" ||
            // In a tag head a slash can only start `/>`.
            (insideJsxTag && jsxBraceDepth === 0))
        )
          continue;
        if (
          (rule.type === "jsx-tag-open" || rule.type === "jsx-tag-close") &&
          ((insideJsxTag && jsxBraceDepth === 0) || !canStartMarkup())
        )
          continue;
        if (
          (rule.type === "jsx-tag-end" || rule.type === "jsx-tag-self-close") &&
          (!insideJsxTag || jsxBraceDepth > 0 || jsxTypeDepth > 0)
        )
          continue;
        rule.regex.lastIndex = index;
        match = rule.regex.exec(code);
        if (!match || match[0].length === 0) continue;
        if (textRange && index + match[0].length > textRange.start) continue;
        type = rule.type;
        text = match[0];
        break;
      }
    }

    if (!type) {
      const charClasses = [
        isBracketMatch(index) ? "hl-bracket-match" : "",
        isMultiSelected(index, 1) ? "hl-multi-selected" : "",
      ].filter(Boolean);
      const escaped = escapeHtml(code[index]);
      html += charClasses.length
        ? `<span class="${charClasses.join(" ")}">${escaped}</span>`
        : escaped;
      index++;
      continue;
    }

    index += text.length;

    const following = code.slice(index, index + 32);
    if (
      type === "keyword" &&
      ((CONTEXTUAL_KEYWORDS.has(text) && USED_AS_IDENTIFIER.test(following)) ||
        (ACCESSOR_KEYWORDS.has(text) && !FOLLOWED_BY_MEMBER_NAME.test(following)))
    ) {
      type = /^\s*\(/.test(following) ? "function-call" : "ident";
    } else if (
      type === "type" &&
      ((lastTokenType === "keyword" && DECLARATION_KEYWORDS.has(lastTokenText)) ||
        /^\s*(?:\(|\.(?!\.))/.test(following))
    ) {
      type = "ident";
    }

    const squigglyClass =
      type === "space" || type === "comment"
        ? ""
        : getProblemClass(problems, tokenStart, text.length);

    const multiSelectClass = isMultiSelected(tokenStart, text.length) ? " hl-multi-selected" : "";
    const extraClasses = squigglyClass + multiSelectClass;

    if (type === "comment") {
      html += `<span class="hl-cm${multiSelectClass}">${escapeHtml(text)}</span>`;
    } else if (type === "template") {
      html += highlightTemplateLiteral(text, options, tokenStart);
    } else if (type === "string") {
      html += `<span class="hl-str${squigglyClass}${multiSelectClass}">${escapeHtml(text)}</span>`;
    } else if (type === "regex") {
      html += `<span class="hl-regex${multiSelectClass}">${escapeHtml(text)}</span>`;
    } else if (type === "jsx-tag-open") {
      openTag();
      html += `<span class="hl-tag-punct${multiSelectClass}">&lt;</span>`;
    } else if (type === "jsx-tag-close") {
      openTag();
      html += `<span class="hl-tag-punct${multiSelectClass}">&lt;/</span>`;
    } else if (type === "jsx-tag-self-close") {
      closeTag();
      html += `<span class="hl-tag-punct${multiSelectClass}">/&gt;</span>`;
    } else if (type === "jsx-tag-end") {
      closeTag();
      html += `<span class="hl-tag-punct${multiSelectClass}">&gt;</span>`;
    } else if (type === "arrow") {
      html += `<span class="hl-arrow${multiSelectClass}">=&gt;</span>`;
    } else if (type === "operator" || type === "update") {
      html += `<span class="hl-op${multiSelectClass}">${escapeHtml(text)}</span>`;
    } else if (TOKEN_CLASSES[type]) {
      html += `<span class="${TOKEN_CLASSES[type]}${extraClasses}">${escapeHtml(text)}</span>`;
    } else if (type === "property" && match) {
      const [, dot, prop] = match;
      const dotClass = isMultiSelected(tokenStart, dot.length) ? " hl-multi-selected" : "";
      const propClass = isMultiSelected(tokenStart + dot.length, prop.length)
        ? " hl-multi-selected"
        : "";
      html +=
        `<span class="hl-punct${dotClass}">${escapeHtml(dot)}</span>` +
        `<span class="hl-prop${squigglyClass}${propClass}">${escapeHtml(prop)}</span>`;
    } else if (type === "ident") {
      if (
        insideJsxTag &&
        jsxBraceDepth === 0 &&
        (lastTokenType !== "punct" || lastTokenText === "}" || lastTokenText === ">")
      ) {
        const tagClass =
          lastTokenType === "jsx-tag-open" || lastTokenType === "jsx-tag-close"
            ? "hl-tag"
            : "hl-attr";
        html += `<span class="${tagClass}${extraClasses}">${escapeHtml(text)}</span>`;
      } else if (extraClasses) {
        html += `<span class="${extraClasses.trim()}">${escapeHtml(text)}</span>`;
      } else {
        html += escapeHtml(text);
      }
    } else if (type === "punct") {
      if (insideJsxTag && text === "{") jsxBraceDepth++;
      if (insideJsxTag && text === "}" && jsxBraceDepth > 0) jsxBraceDepth--;
      if (insideJsxTag && jsxBraceDepth === 0) {
        if (text === "<") jsxTypeDepth++;
        if (text === ">" && jsxTypeDepth > 0) jsxTypeDepth--;
      }
      if ("{}()[]".includes(text)) {
        const bracketClass = isBracketMatch(tokenStart) ? " hl-bracket-match" : "";
        html += `<span class="hl-punct${bracketClass}${squigglyClass}${multiSelectClass}">${escapeHtml(text)}</span>`;
      } else if (text === "=" && !insideJsxTag) {
        html += `<span class="hl-op${multiSelectClass}">${escapeHtml(text)}</span>`;
      } else {
        html += multiSelectClass
          ? `<span class="hl-multi-selected">${escapeHtml(text)}</span>`
          : escapeHtml(text);
      }
    } else {
      html += multiSelectClass
        ? `<span class="hl-multi-selected">${escapeHtml(text)}</span>`
        : escapeHtml(text);
    }

    if (type !== "space") {
      lastTokenType = type;
      lastTokenText = text;
    }
  }

  return html;
}
