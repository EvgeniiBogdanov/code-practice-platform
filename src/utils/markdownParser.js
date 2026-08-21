import { marked } from "marked";
import { highlightJS } from "./codeHighlighter.js";

const escapeHtmlChar = (str) =>
  str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Настройка официальной библиотеки marked
marked.use({
  gfm: true,
  breaks: false,
  renderer: {
    // Кастомный рендерер блоков кода (для передачи в React-компонент TheoryCodeBlock)
    code({ text, lang }) {
      const cleanLang = (lang || "").trim().split(/\s+/)[0].toLowerCase() || "notepad";
      return `__MD_CODE_BLOCK_START__${cleanLang}__LANG_DELIM__${encodeURIComponent(text)}__MD_CODE_BLOCK_END__`;
    },
    // Безопасная обработка неэкранированных форм HTML (input, select, button) в тексте статей
    html({ text }) {
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
    // Кастомный рендерер заголовков для генерации авто-якорей (h1, h2, h3...)
    heading({ tokens, depth }) {
      const text = this.parser.parseInline(tokens);
      const rawText = tokens.map((t) => t.text || "").join("");
      const slug = rawText
        .toLowerCase()
        .replace(/[^\w\u0400-\u04FF\s-]/g, "")
        .trim()
        .replace(/[\s_]+/g, "-");
      return `<h${depth} id="${slug}">${text}</h${depth}>`;
    },
    // Кастомный рендерер таблиц GFM (Standard style table)
    table(token) {
      const renderCell = (cell) => {
        // Рендерим инлайн-токены без преобразования в теги <code>
        const rawHtml = this.parser.parseInline(cell.tokens);
        return rawHtml.replace(/<\/?code[^>]*>/gi, "");
      };

      const header = token.header
        .map((cell, i) => {
          const align = token.align && token.align[i] ? ` style="text-align: ${token.align[i]}"` : "";
          return `<th${align}>${renderCell(cell)}</th>`;
        })
        .join("");

      const rows = token.rows
        .map((row) => {
          const cells = row
            .map((cell, i) => {
              const align = token.align && token.align[i] ? ` style="text-align: ${token.align[i]}"` : "";
              return `<td${align}>${renderCell(cell)}</td>`;
            })
            .join("");
          return `<tr>${cells}</tr>`;
        })
        .join("");

      return `<div class="table-wrapper"><table class="markdown-table"><thead><tr>${header}</tr></thead><tbody>${rows}</tbody></table></div>`;
    },
    // Кастомные плашки Standard Callouts для цитат с эмодзи
    blockquote(token) {
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
      return `<blockquote>${this.parser.parse(token.tokens)}</blockquote>`;
    },
  },
});

// Функция разделения Markdown на блоки с кодом и стандартизированный HTML
export const parseMarkdownBlocks = (markdownText) => {
  if (!markdownText) return [];

  // Очистка от битых символов юникода (\uFFFD), устаревших иконок 💡 и автозамена LaTeX-стрелок
  const cleanText = markdownText
    .replace(/\uFFFD\uFE0F?|\uFFFD/g, "")
    .replace(/💡\s*/g, "")
    .replace(/\\?\$?\\rightarrow\$?/g, "→")
    .replace(/\\?\$?\\leftarrow\$?/g, "←")
    .replace(/\\?\$?\\Rightarrow\$?/g, "⇒")
    .replace(/\\?\$?\\Leftrightarrow\$?/g, "⇔");

  // Автоматическое объединение оторванных номеров списков (например "1.\nИтерация" -> "1. Итерация")
  const normalizedText = cleanText
    .replace(/^(\s*\d+\.)[ \t]*\n+[ \t]*(\S)/gm, "$1 $2")
    .replace(/^(\s*[-*•])[ \t]*\n+[ \t]*(\S)/gm, "$1 $2");

  // Парсинг через библиотеку marked
  const fullHtml = marked.parse(normalizedText);

  const blocks = [];
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
        const code = decodeURIComponent(
          codeSection.substring(delimIdx + "__LANG_DELIM__".length)
        );

        blocks.push({ type: "code", language: lang, code });
        if (mdSection.trim()) blocks.push({ type: "markdown", html: mdSection });
      } else {
        if (part.trim()) blocks.push({ type: "markdown", html: part });
      }
    }
  });

  return blocks;
};

// Обратная совместимость с генерацией HTML в строку
export const parseMarkdown = (markdownText) => {
  if (!markdownText) return "";

  const blocks = parseMarkdownBlocks(markdownText);
  return blocks
    .map((block) => {
      if (block.type === "markdown") {
        return block.html;
      } else {
        const lang = (block.language || "notepad").trim().toLowerCase();
        const isNotepad =
          lang === "notepad" ||
          lang === "text" ||
          lang === "plaintext" ||
          lang === "txt" ||
          lang === "none";

        const langName =
          isNotepad
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
          ? escapeHtmlChar(block.code)
          : highlightJS(block.code);
        const lines = block.code.split("\n");
        const lineGutter = lines
          .map((_, i) => `<div class="vscode-gutter-line">${i + 1}</div>`)
          .join("");

        return `
          <div class="theory-code-editor" style="margin: 16px 0;">
            <div class="vscode-editor-header">
              <div class="vscode-editor-single-file">
                <span class="file-tab-name" style="font-weight: 500;">${langName}</span>
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
};
