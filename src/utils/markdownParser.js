import { marked } from "marked";
import { highlightJS } from "./codeHighlighter";

const escapeHtmlChar = (str) =>
  str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Настройка официальной библиотеки marked
marked.use({
  gfm: true,
  breaks: true,
  renderer: {
    // Кастомный рендерер блоков кода (для передачи в React-компонент TheoryCodeBlock)
    code({ text, lang }) {
      const cleanLang = (lang || "javascript").toLowerCase();
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
        return `<code class="notion-inline-code">${escapeHtmlChar(text.trim())}</code>`;
      }
      return text;
    },
    // Кастомные плашки Notion Callouts для цитат с эмодзи
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
        return `<div class="notion-callout-box notion-callout-${alertClass}"><span class="notion-callout-icon">${icon}</span><div class="notion-callout-text"><p>${content}</p></div></div>`;
      }
      return `blockquote>${this.parser.parse(token.tokens)}</blockquote>`;
    },
  },
});

// Функция разделения Markdown на блоки с кодом и стандартизированный HTML
export const parseMarkdownBlocks = (markdownText) => {
  if (!markdownText) return [];

  // Очистка от битых символов юникода (\uFFFD) и устаревших иконок 💡
  const cleanText = markdownText
    .replace(/\uFFFD\uFE0F?|\uFFFD|/g, "")
    .replace(/💡\s*/g, "");

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
        const lang = block.language || "javascript";
        const langName =
          lang === "jsx" || lang === "react"
            ? "React JSX"
            : lang === "tsx"
            ? "React TSX"
            : lang === "ts" || lang === "typescript"
            ? "TypeScript"
            : lang === "html"
            ? "HTML"
            : lang === "css"
            ? "CSS"
            : "JavaScript";
        const highlighted = highlightJS(block.code);
        const lines = block.code.split("\n");
        const lineGutter = lines
          .map((_, i) => `<div class="vscode-gutter-line">${i + 1}</div>`)
          .join("");

        return `
          <div class="vscode-ide-editor theory-code-editor" style="margin: 16px 0;">
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
