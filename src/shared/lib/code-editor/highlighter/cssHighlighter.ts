/**
 * CSS / SCSS / LESS Syntax Highlighter
 */

import { HighlightOptions, escapeHtml } from "./types";

const CSS_RULES = [
  { type: "comment", regex: /^(\/\*[\s\S]*?\*\/|\/\/.*)/ },
  { type: "string", regex: /^("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/ },
  { type: "at-rule", regex: /^@(?:keyframes|media|import|font-face|supports|container|layer|charset)\b[^\s{;]*/ },
  { type: "important", regex: /^!important\b/ },
  { type: "hex-color", regex: /^#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})\b/ },
  { type: "dimension", regex: /^(-?\d+(?:\.\d+)?)(px|rem|em|%|vh|vw|dvh|dvw|s|ms|deg|rad|turn|fr|ch|ex)\b/i },
  { type: "number", regex: /^-?\b\d+(?:\.\d+)?\b/ },
  { type: "css-var", regex: /^--[a-zA-Z0-9_-]+/ },
  { type: "fn-call", regex: /^(?:var|calc|min|max|clamp|rgb|rgba|hsl|hsla|oklch|url|linear-gradient|radial-gradient|scale|rotate|translate|translateX|translateY|translate3d|skew|matrix|cubic-bezier|polygon|circle|ellipse)(?=\s*\()/i },
  { type: "property", regex: /^[a-zA-Z_-][a-zA-Z0-9_-]*(?=\s*:)/ },
  {
    type: "css-keyword",
    regex:
      /^\b(flex|inline-flex|grid|inline-grid|block|inline-block|inline|none|solid|dashed|dotted|double|hidden|visible|auto|inherit|initial|unset|revert|center|start|end|flex-start|flex-end|space-between|space-around|space-evenly|stretch|baseline|row|column|row-reverse|column-reverse|wrap|nowrap|wrap-reverse|relative|absolute|fixed|sticky|static|pointer|default|not-allowed|grab|grabbing|text|crosshair|move|wait|help|border-box|content-box|uppercase|lowercase|capitalize|underline|line-through|bold|bolder|lighter|normal|italic|oblique|ease|ease-in|ease-out|ease-in-out|linear|infinite|forwards|backwards|both|paused|running|sans-serif|serif|monospace|system-ui|cursive|fantasy)\b(?![-a-zA-Z0-9_])/i,
  },
  { type: "pseudo", regex: /^::?[a-zA-Z0-9_-]+(?:\([^)]*\))?/ },
  { type: "class-selector", regex: /^\.[a-zA-Z0-9_-]+/ },
  { type: "id-selector", regex: /^#[a-zA-Z0-9_-]+/ },
  { type: "attribute-selector", regex: /^\[[^\]]+\]/ },
  { type: "ident", regex: /^[a-zA-Z_-][a-zA-Z0-9_-]*/ },
  { type: "operator", regex: /^(>|\+|~|\*)/ },
  { type: "punct", regex: /^[{}:;,()]/ },
  { type: "space", regex: /^(\s+)/ },
];

export function highlightCSS(code: string, options: HighlightOptions = {}): string {
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
  let insideBlock = 0;
  let currentIndex = 0;
  let currentLine = 1;
  let currentCol = 1;

  while (rest.length > 0) {
    let matched = false;

    for (const rule of CSS_RULES) {
      const m = rule.regex.exec(rest);
      if (m) {
        matched = true;
        const text = m[0];
        const tokenStart = currentIndex;
        const tokenLine = currentLine;
        const tokenCol = currentCol;
        const tokenLen = text.length;

        rest = rest.slice(text.length);
        currentIndex += text.length;

        const newlines = text.split("\n").length - 1;
        if (newlines > 0) {
          currentLine += newlines;
          const lastNl = text.lastIndexOf("\n");
          currentCol = text.length - lastNl;
        } else {
          currentCol += text.length;
        }

        const wordClass = isWordMatch(text) ? " hl-word-match" : "";
        let squigglyClass = "";
        if (problems && problems.length > 0 && rule.type !== "space" && rule.type !== "comment") {
          const prob = problems.find((p) => {
            if (p.line !== tokenLine) return false;
            if (tokenCol >= p.col && tokenCol < p.col + (p.symbol?.length || 5)) return true;
            if (p.col >= tokenCol && p.col < tokenCol + tokenLen) return true;
            return false;
          });
          if (prob) {
            squigglyClass =
              prob.severity === "warning" ? " hl-squiggly-warning" : " hl-squiggly-error";
          }
        }

        const multiSelectClass = isMultiSelected(tokenStart, tokenLen) ? " hl-multi-selected" : "";
        const extraClasses = wordClass + squigglyClass + multiSelectClass;

        if (rule.type === "comment") {
          html += `<span class="hl-cm${multiSelectClass}">${escapeHtml(text)}</span>`;
        } else if (rule.type === "string") {
          html += `<span class="hl-str${extraClasses}">${escapeHtml(text)}</span>`;
        } else if (rule.type === "at-rule") {
          html += `<span class="hl-css-atrule${extraClasses}">${escapeHtml(text)}</span>`;
        } else if (rule.type === "important") {
          html += `<span class="hl-css-atrule${extraClasses}">${escapeHtml(text)}</span>`;
        } else if (rule.type === "hex-color") {
          html += `<span class="hl-css-color${extraClasses}" style="border-bottom: 2px solid ${escapeHtml(text)};">${escapeHtml(text)}</span>`;
        } else if (rule.type === "dimension") {
          const numPart = m[1];
          const unitPart = m[2];
          html += `<span class="hl-num${extraClasses}">${escapeHtml(numPart)}</span><span class="hl-css-unit">${escapeHtml(unitPart)}</span>`;
        } else if (rule.type === "number") {
          html += `<span class="hl-num${extraClasses}">${escapeHtml(text)}</span>`;
        } else if (rule.type === "css-var") {
          html += `<span class="hl-css-prop${extraClasses}">${escapeHtml(text)}</span>`;
        } else if (rule.type === "fn-call") {
          html += `<span class="hl-fn${extraClasses}">${escapeHtml(text)}</span>`;
        } else if (rule.type === "css-keyword") {
          html += `<span class="hl-css-val${extraClasses}">${escapeHtml(text)}</span>`;
        } else if (rule.type === "pseudo" || rule.type === "class-selector" || rule.type === "id-selector") {
          html += `<span class="hl-css-selector${extraClasses}">${escapeHtml(text)}</span>`;
        } else if (rule.type === "attribute-selector") {
          html += `<span class="hl-css-selector${extraClasses}">${escapeHtml(text)}</span>`;
        } else if (rule.type === "property") {
          html += `<span class="hl-css-prop${extraClasses}">${escapeHtml(text)}</span>`;
        } else if (rule.type === "operator") {
          html += `<span class="hl-op${extraClasses}">${escapeHtml(text)}</span>`;
        } else if (rule.type === "ident") {
          if (insideBlock === 0) {
            html += `<span class="hl-tag${extraClasses}">${escapeHtml(text)}</span>`;
          } else {
            html += `<span class="hl-css-val${extraClasses}">${escapeHtml(text)}</span>`;
          }
        } else if (rule.type === "punct") {
          if (text === "{") insideBlock++;
          if (text === "}") insideBlock = Math.max(0, insideBlock - 1);
          const bracketClass = isBracketMatch(tokenStart) ? " hl-bracket-match" : "";
          html += `<span class="hl-punct${bracketClass}${extraClasses}">${escapeHtml(text)}</span>`;
        } else {
          html += escapeHtml(text);
        }
        break;
      }
    }

    if (!matched) {
      const charStart = currentIndex;
      const bracketClass = isBracketMatch(charStart) ? ' class="hl-bracket-match"' : "";
      if (bracketClass) {
        html += "<span" + bracketClass + ">" + escapeHtml(rest[0]) + "</span>";
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
  }

  return html;
}
