/**
 * HTML Syntax Highlighter with embedded CSS and JS support
 */

import { HighlightOptions, escapeHtml } from "./types";
import { highlightCSS } from "./cssHighlighter";
import { highlightJS } from "./jsHighlighter";

export function highlightHTML(code: string, options: HighlightOptions = {}): string {
  if (!code) return "";

  const {
    highlightWord = "",
    bracketPair = null,
    problems = [],
    multiSelections = [],
  } = options;

  const isWordMatch = (txt: string): boolean =>
    Boolean(highlightWord && highlightWord.length >= 2 && txt === highlightWord);
  const isBracketMatch = (idx: number): boolean =>
    Boolean(bracketPair && (idx === bracketPair[0] || idx === bracketPair[1]));
  const isMultiSelected = (start: number, len: number): boolean => {
    if (!multiSelections || multiSelections.length === 0) return false;
    const end = start + len;
    return multiSelections.some((s) => !(end <= s.start || start >= s.end));
  };

  let html = "";
  let rest = code;
  let currentIndex = 0;
  let currentLine = 1;
  let currentCol = 1;

  while (rest.length > 0) {
    // 1. HTML Comments
    if (rest.startsWith("<!--")) {
      const endIdx = rest.indexOf("-->");
      const commentText = endIdx !== -1 ? rest.substring(0, endIdx + 3) : rest;
      const multiSelectClass = isMultiSelected(currentIndex, commentText.length)
        ? " hl-multi-selected"
        : "";
      html += `<span class="hl-cm${multiSelectClass}">${escapeHtml(commentText)}</span>`;
      const len = commentText.length;
      currentIndex += len;
      rest = rest.slice(len);
      const newlines = commentText.split("\n").length - 1;
      if (newlines > 0) {
        currentLine += newlines;
        currentCol = commentText.length - commentText.lastIndexOf("\n");
      } else {
        currentCol += len;
      }
      continue;
    }

    // 2. Doctype
    const doctypeMatch = /^<!DOCTYPE\s+[^>]+>/i.exec(rest);
    if (doctypeMatch) {
      const text = doctypeMatch[0];
      const multiSelectClass = isMultiSelected(currentIndex, text.length)
        ? " hl-multi-selected"
        : "";
      html += `<span class="hl-doctype${multiSelectClass}">${escapeHtml(text)}</span>`;
      currentIndex += text.length;
      rest = rest.slice(text.length);
      currentCol += text.length;
      continue;
    }

    // 3. Embedded <style> block
    const styleOpenMatch = /^<style\b([^>]*)>/i.exec(rest);
    if (styleOpenMatch) {
      const openTag = styleOpenMatch[0];
      html += `<span class="hl-tag-punct">&lt;</span><span class="hl-tag">style</span>`;
      if (styleOpenMatch[1]) {
        html += highlightHtmlAttributes(styleOpenMatch[1], options);
      }
      html += `<span class="hl-tag-punct">&gt;</span>`;
      currentIndex += openTag.length;
      rest = rest.slice(openTag.length);

      const closeIdx = rest.toLowerCase().indexOf("</style>");
      if (closeIdx !== -1) {
        const cssContent = rest.substring(0, closeIdx);
        html += highlightCSS(cssContent, options);
        currentIndex += cssContent.length;
        rest = rest.slice(closeIdx);
        html += `<span class="hl-tag-punct">&lt;/</span><span class="hl-tag">style</span><span class="hl-tag-punct">&gt;</span>`;
        currentIndex += 8;
        rest = rest.slice(8);
      }
      continue;
    }

    // 4. Embedded <script> block
    const scriptOpenMatch = /^<script\b([^>]*)>/i.exec(rest);
    if (scriptOpenMatch) {
      const openTag = scriptOpenMatch[0];
      html += `<span class="hl-tag-punct">&lt;</span><span class="hl-tag">script</span>`;
      if (scriptOpenMatch[1]) {
        html += highlightHtmlAttributes(scriptOpenMatch[1], options);
      }
      html += `<span class="hl-tag-punct">&gt;</span>`;
      currentIndex += openTag.length;
      rest = rest.slice(openTag.length);

      const closeIdx = rest.toLowerCase().indexOf("</script>");
      if (closeIdx !== -1) {
        const jsContent = rest.substring(0, closeIdx);
        html += highlightJS(jsContent, options);
        currentIndex += jsContent.length;
        rest = rest.slice(closeIdx);
        html += `<span class="hl-tag-punct">&lt;/</span><span class="hl-tag">script</span><span class="hl-tag-punct">&gt;</span>`;
        currentIndex += 9;
        rest = rest.slice(9);
      }
      continue;
    }

    // 5. HTML Tag (Open or Close)
    const tagMatch = /^<\/?([a-zA-Z0-9:-]+)/.exec(rest);
    if (tagMatch) {
      const isClosing = rest.startsWith("</");
      const tagName = tagMatch[1];
      const prefix = isClosing ? "&lt;/" : "&lt;";
      html += `<span class="hl-tag-punct">${prefix}</span><span class="hl-tag">${escapeHtml(tagName)}</span>`;
      currentIndex += tagMatch[0].length;
      rest = rest.slice(tagMatch[0].length);

      // Parse attributes up to '>' or '/>'
      while (rest.length > 0 && !rest.startsWith(">") && !rest.startsWith("/>")) {
        const spaceMatch = /^(\s+)/.exec(rest);
        if (spaceMatch) {
          html += escapeHtml(spaceMatch[0]);
          currentIndex += spaceMatch[0].length;
          rest = rest.slice(spaceMatch[0].length);
          continue;
        }

        const attrMatch = /^([a-zA-Z0-9_:@.-]+)/.exec(rest);
        if (attrMatch) {
          const attrName = attrMatch[1];
          const wordClass = isWordMatch(attrName) ? " hl-word-match" : "";
          const multiSelectClass = isMultiSelected(currentIndex, attrName.length)
            ? " hl-multi-selected"
            : "";
          html += `<span class="hl-attr${wordClass}${multiSelectClass}">${escapeHtml(attrName)}</span>`;
          currentIndex += attrName.length;
          rest = rest.slice(attrName.length);

          // Check for '='
          if (rest.startsWith("=")) {
            html += `<span class="hl-op">=</span>`;
            currentIndex += 1;
            rest = rest.slice(1);

            // Check for attribute value string
            const strMatch = /^("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/.exec(rest);
            if (strMatch) {
              const strVal = strMatch[0];
              const strMultiClass = isMultiSelected(currentIndex, strVal.length)
                ? " hl-multi-selected"
                : "";
              html += `<span class="hl-str${strMultiClass}">${escapeHtml(strVal)}</span>`;
              currentIndex += strVal.length;
              rest = rest.slice(strVal.length);
            }
          }
          continue;
        }

        // Catch unhandled character in tag
        html += escapeHtml(rest[0]);
        currentIndex += 1;
        rest = rest.slice(1);
      }

      if (rest.startsWith("/>")) {
        html += `<span class="hl-tag-punct">/&gt;</span>`;
        currentIndex += 2;
        rest = rest.slice(2);
      } else if (rest.startsWith(">")) {
        html += `<span class="hl-tag-punct">&gt;</span>`;
        currentIndex += 1;
        rest = rest.slice(1);
      }
      continue;
    }

    // 6. HTML Entity
    const entityMatch = /^&([a-zA-Z0-9]+|#[0-9]+|#x[0-9a-fA-F]+);/.exec(rest);
    if (entityMatch) {
      const entity = entityMatch[0];
      html += `<span class="hl-entity">${escapeHtml(entity)}</span>`;
      currentIndex += entity.length;
      rest = rest.slice(entity.length);
      continue;
    }

    // 7. Regular Text character
    const charStart = currentIndex;
    const bracketClass = isBracketMatch(charStart) ? ' class="hl-bracket-match"' : "";
    if (bracketClass) {
      html += `<span${bracketClass}>${escapeHtml(rest[0])}</span>`;
    } else {
      html += escapeHtml(rest[0]);
    }
    currentIndex += 1;
    if (rest[0] === "\n") {
      currentLine += 1;
      currentCol = 1;
    } else {
      currentCol += 1;
    }
    rest = rest.slice(1);
  }

  return html;
}

function highlightHtmlAttributes(attrString: string, options: HighlightOptions): string {
  let res = "";
  let rest = attrString;
  while (rest.length > 0) {
    const spaceMatch = /^(\s+)/.exec(rest);
    if (spaceMatch) {
      res += escapeHtml(spaceMatch[0]);
      rest = rest.slice(spaceMatch[0].length);
      continue;
    }
    const attrMatch = /^([a-zA-Z0-9_:@.-]+)/.exec(rest);
    if (attrMatch) {
      res += `<span class="hl-attr">${escapeHtml(attrMatch[1])}</span>`;
      rest = rest.slice(attrMatch[1].length);
      if (rest.startsWith("=")) {
        res += `<span class="hl-op">=</span>`;
        rest = rest.slice(1);
        const strMatch = /^("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/.exec(rest);
        if (strMatch) {
          res += `<span class="hl-str">${escapeHtml(strMatch[0])}</span>`;
          rest = rest.slice(strMatch[0].length);
        }
      }
      continue;
    }
    res += escapeHtml(rest[0]);
    rest = rest.slice(1);
  }
  return res;
}
