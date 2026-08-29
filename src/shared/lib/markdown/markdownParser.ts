/**
 * Markdown and LaTeX Parser
 * Complete GFM parser with custom code blocks, callouts, tables, and typography.
 */

import { marked } from "marked";
import { highlightCode } from "../code-editor/codeHighlighter";

const escapeHtmlChar = (str: string): string =>
  str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export interface MarkdownBlock {
  type: "markdown" | "code";
  html?: string;
  language?: string;
  code?: string;
}

export function generateHeadingSlug(rawText: string): string {
  return rawText
    .toLowerCase()
    .replace(/[—–]/g, "-")
    .replace(/[/]/g, "-")
    .replace(/[^\w\u0400-\u04FF\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-");
}

marked.use({
  gfm: true,
  breaks: false,
  renderer: {
    code({ text, lang }: { text: string; lang?: string }) {
      const cleanLang = (lang || "").trim().split(/\s+/)[0].toLowerCase() || "notepad";
      return `__MD_CODE_BLOCK_START__${cleanLang}__LANG_DELIM__${encodeURIComponent(text)}__MD_CODE_BLOCK_END__`;
    },
    html({ text }: { text: string }) {
      const lower = text.trim().toLowerCase();
      if (
        lower.startsWith("<input") ||
        lower.startsWith("<select") ||
        lower.startsWith("<button") ||
        lower.startsWith("<form") ||
        lower.startsWith("<textarea") ||
        lower.startsWith("<option")
      ) {
        return `<code class="inline-code-block">${escapeHtmlChar(text.trim())}</code>`;
      }
      return text;
    },
    heading({ tokens, depth }: { tokens: any[]; depth: number }) {
      const text = (this as any).parser.parseInline(tokens);
      const rawText = tokens.map((t: any) => t.text || "").join("");
      const slug = generateHeadingSlug(rawText);
      return `<h${depth} id="${slug}">${text}</h${depth}>`;
    },
    table(token: any) {
      const renderCell = (cell: any) => {
        const rawHtml = (this as any).parser.parseInline(cell.tokens);
        return rawHtml.replace(/<\/?code[^>]*>/gi, "");
      };

      const header = token.header
        .map((cell: any, i: number) => {
          const align =
            token.align && token.align[i] ? ` style="text-align: ${token.align[i]}"` : "";
          return `<th${align}>${renderCell(cell)}</th>`;
        })
        .join("");

      const rows = token.rows
        .map((row: any) => {
          const cells = row
            .map((cell: any, i: number) => {
              const align =
                token.align && token.align[i] ? ` style="text-align: ${token.align[i]}"` : "";
              return `<td${align}>${renderCell(cell)}</td>`;
            })
            .join("");
          return `<tr>${cells}</tr>`;
        })
        .join("");

      return `<div class="table-wrapper"><table class="markdown-table"><thead><tr>${header}</tr></thead><tbody>${rows}</tbody></table></div>`;
    },
    blockquote(token: any) {
      const text = (token.text || "").trim();
      const match = text.match(/^(⚠️|📌|🚀|🎯|🛠️|ℹ️|🔥)\s*(.*)/s);
      if (match) {
        const icon = match[1];
        const content = match[2];
        let alertClass = "note";
        if (icon === "⚠️") alertClass = "warning";
        if (icon === "📌") alertClass = "tip";
        if (icon === "🚀" || icon === "🔥") alertClass = "important";
        return `<div class="callout-box callout-${alertClass}"><span class="callout-icon">${icon}</span><div class="callout-text"><p>${content}</p></div></div>`;
      }
      return `<blockquote>${(this as any).parser.parse(token.tokens)}</blockquote>`;
    },
  },
});

export function normalizeMarkdown(markdownText: string): string {
  if (!markdownText) return "";

  return (
    markdownText
      // Удаление битых юникод-символов и старых иконок
      .replace(/\uFFFD\uFE0F?|\uFFFD/g, "")
      .replace(/💡\s*/g, "")
      // Стрелки LaTeX
      .replace(/\\?\$?\\rightarrow\$?/g, "→")
      .replace(/\\?\$?\\to\$?/g, "→")
      .replace(/\\?\$?\\leftarrow\$?/g, "←")
      .replace(/\\?\$?\\Rightarrow\$?/g, "⇒")
      .replace(/\\?\$?\\Leftarrow\$?/g, "⇐")
      .replace(/\\?\$?\\Leftrightarrow\$?/g, "⇔")
      // Сравнения и операторы LaTeX
      .replace(/\\?\$?\\le(q)?\$?/g, "≤")
      .replace(/\\?\$?\\ge(q)?\$?/g, "≥")
      .replace(/\\?\$?\\ne(q)?\$?/g, "≠")
      .replace(/\\?\$?\\approx\$?/g, "≈")
      .replace(/\\?\$?\\times\$?/g, "×")
      .replace(/\\?\$?\\cdot\$?/g, "·")
      .replace(/\\?\$?\\dots[bm]?\$?/g, "…")
      // Множества
      .replace(/\\?\$?\\in\$?/g, "∈")
      .replace(/\\?\$?\\notin\$?/g, "∉")
      .replace(/\\?\$?\\subset\$?/g, "⊂")
      .replace(/\\?\$?\\cup\$?/g, "∪")
      .replace(/\\?\$?\\cap\$?/g, "∩")
      // Очистка одиночных математических оберток для простых выражений вроде $O(n)$
      .replace(/\$([a-zA-Z0-9_()+*/^ -]+)\$/g, "$1")
      // Нормализация оторванных списков
      .replace(/^(\s*\d+\.)[ \t]*\n+[ \t]*(\S)/gm, "$1 $2")
      .replace(/^(\s*[-*•])[ \t]*\n+[ \t]*(\S)/gm, "$1 $2")
  );
}

export function parseMarkdownBlocks(markdownText: string): MarkdownBlock[] {
  if (!markdownText) return [];

  const normalizedText = normalizeMarkdown(markdownText);
  const fullHtml = marked.parse(normalizedText) as string;

  const blocks: MarkdownBlock[] = [];
  const parts = fullHtml.split("__MD_CODE_BLOCK_START__");

  parts.forEach((part, i) => {
    if (i === 0) {
      if (part.trim()) blocks.push({ type: "markdown", html: part });
    } else {
      const endIdx = part.indexOf("__MD_CODE_BLOCK_END__");
      if (endIdx !== -1) {
        const codeSection = part.substring(0, endIdx);
        const mdSection = part.substring(endIdx + "__MD_CODE_BLOCK_END__".length);

        const delimIdx = codeSection.indexOf("__LANG_DELIM__");
        const lang = codeSection.substring(0, delimIdx);
        const code = decodeURIComponent(codeSection.substring(delimIdx + "__LANG_DELIM__".length));

        blocks.push({ type: "code", language: lang, code });
        if (mdSection.trim()) blocks.push({ type: "markdown", html: mdSection });
      } else {
        if (part.trim()) blocks.push({ type: "markdown", html: part });
      }
    }
  });

  return blocks;
}

export function parseMarkdown(markdownText: string): string {
  if (!markdownText) return "";

  const blocks = parseMarkdownBlocks(markdownText);
  return blocks
    .map((block) => {
      if (block.type === "markdown") {
        return block.html || "";
      } else {
        const lang = (block.language || "notepad").trim().toLowerCase();
        const isNotepad =
          lang === "notepad" ||
          lang === "text" ||
          lang === "plaintext" ||
          lang === "txt" ||
          lang === "none";

        const langName = isNotepad
          ? "Notepad"
          : lang === "jsx" || lang === "react"
            ? "React JSX"
            : lang === "tsx"
              ? "React TSX"
              : lang === "ts" || lang === "typescript"
                ? "TypeScript"
                : lang === "html"
                  ? "HTML"
                  : lang === "css"
                    ? "CSS"
                    : lang === "json"
                      ? "JSON"
                      : lang === "bash" || lang === "sh" || lang === "shell"
                        ? "Shell"
                        : lang === "js" || lang === "javascript"
                          ? "JavaScript"
                          : lang.charAt(0).toUpperCase() + lang.slice(1);

        const highlighted = isNotepad
          ? escapeHtmlChar(block.code || "")
          : highlightCode(block.code || "", lang);
        const lines = (block.code || "").split("\n");
        const lineGutter = lines
          .map((_, i) => `<div class="vscode-gutter-line">${i + 1}</div>`)
          .join("");

        return `
          <div class="theory-code-editor">
            <div class="vscode-editor-header">
              <div class="vscode-editor-single-file">
                <span class="file-tab-name">${langName}</span>
              </div>
            </div>
            <div class="vscode-editor-surface wrap-off">
              <div class="vscode-gutter" aria-hidden="true">${lineGutter}</div>
              <div class="vscode-canvas">
                <pre class="vscode-pre-only"><code>${highlighted}</code></pre>
              </div>
            </div>
          </div>
        `;
      }
    })
    .join("");
}

export const parseMarkdownSafe = parseMarkdown;
