import { highlightJS } from "./codeHighlighter";

export const parseMarkdown = (text) => {
  if (!text) return "";

  // 0. Нормализация списков (склеиваем номера 1., 2. и маркеры, случайно оторванные переносом строки от текста)
  let cleanedText = text.replace(/^(\d+\.|[-*•])[ \t]*\n+[ \t]*(?=\S)/gm, "$1 ");

  // 1. Извлекаем блоки кода ```lang ... ``` или ``lang ... `` (с учетом любых отступов)
  const codeBlocks = [];
  const extractCodeBlocks = (str, pattern) => {
    return str.replace(pattern, (_, lang, code) => {
      const placeholder = `__MD_CODE_BLOCK_${codeBlocks.length}__`;
      const languageName = (lang || "javascript").toLowerCase();
      const highlighted = highlightJS(code.trim());
      const blockHtml = `
        <div class="notion-code-wrapper">
          <div class="notion-code-header">
            <span class="notion-code-lang">${languageName}</span>
          </div>
          <pre class="code-preview-block notion-code-content"><code>${highlighted}</code></pre>
        </div>
      `;
      codeBlocks.push(blockHtml);
      return placeholder;
    });
  };

  // 3 бактэка (с отступом или без)
  let htmlText = extractCodeBlocks(cleanedText, /^[ \t]*\`{3}(\w*)[ \t]*\n([\s\S]*?)^[ \t]*\`{3}/gm);
  // 2 бактэка (на случай неполного эскейпинга)
  htmlText = extractCodeBlocks(htmlText, /^[ \t]*\`{2}(\w*)[ \t]*\n([\s\S]*?)^[ \t]*\`{2}/gm);

  // 2. Разбиваем на отдельные строки
  const rawLines = htmlText.split("\n");
  const processedLines = [];

  for (let line of rawLines) {
    let l = line.trim();

    if (!l) {
      continue;
    }

    if (/^__MD_CODE_BLOCK_\d+__$/.test(l)) {
      processedLines.push(l);
      continue;
    }

    // Чекбоксы Notion / To-do list: - [ ] или - [x]
    if (/^[-*•]?\s*\[([ xX])\]\s*(.*)/.test(l)) {
      l = l.replace(
        /^[-*•]?\s*\[([ xX])\]\s*(.*)/,
        (_, checked, content) => {
          const isChecked = checked !== " ";
          return `<div class="notion-todo-item ${isChecked ? "checked" : ""}"><span class="notion-todo-box">${isChecked ? "☑" : "☐"}</span><span class="notion-todo-text">${content}</span></div>`;
        }
      );
    }
    // Коллаут с эмодзи или GitHub-style alerts (> 💡, > ⚠️, > [!NOTE], etc.)
    else if (/^>\s+([💡⚠️📌ℹ️🚀📝🔑🔥⭐]|\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION)\])\s*(.*)/i.test(l)) {
      l = l.replace(
        /^>\s+([💡⚠️📌ℹ️🚀📝🔑🔥⭐]|\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION)\])\s*(.*)/i,
        (_, icon, alertType, content) => {
          let calloutIcon = icon;
          if (alertType) {
            const upper = alertType.toUpperCase();
            calloutIcon = upper === "WARNING" || upper === "CAUTION" ? "⚠️" : upper === "TIP" ? "💡" : "ℹ️";
          }
          return `<div class="notion-callout-box"><span class="notion-callout-icon">${calloutIcon}</span><div class="notion-callout-text">${content}</div></div>`;
        }
      );
    }
    // Цитаты / обычные коллауты >
    else if (/^>\s+(.*)/.test(l)) {
      l = l.replace(/^>\s+(.*)/, '<blockquote class="notion-quote-block">$1</blockquote>');
    }
    // Заголовки ####, ###, ##, #
    else if (/^####\s+(.*)/.test(l)) {
      l = l.replace(/^####\s+(.*)/, '<h5 class="notion-h4">$1</h5>');
    } else if (/^###\s+(.*)/.test(l)) {
      l = l.replace(/^###\s+(.*)/, '<h4 class="notion-h3">$1</h4>');
    } else if (/^##\s+(.*)/.test(l)) {
      l = l.replace(/^##\s+(.*)/, '<h3 class="notion-h2">$1</h3>');
    } else if (/^#\s+(.*)/.test(l)) {
      l = l.replace(/^#\s+(.*)/, '<h2 class="notion-h1">$1</h2>');
    }
    // Разделитель --- или ***
    else if (/^(---|[*]{3})$/.test(l)) {
      l = '<hr class="notion-body-hr" />';
    }
    // Нумерованный список: 1. текст
    else if (/^\d+\.\s*(.*)/.test(l)) {
      l = l.replace(
        /^(\d+\.)\s*(.*)/,
        '<div class="notion-list-item"><span class="notion-list-num">$1</span><span class="notion-list-content">$2</span></div>'
      );
    }
    // Маркированный список: - или * или •
    else if (/^[-*•]\s*(.*)/.test(l)) {
      l = l.replace(
        /^[-*•]\s*(.*)/,
        '<div class="notion-list-item"><span class="notion-list-bullet">•</span><span class="notion-list-content">$1</span></div>'
      );
    }
    // Обычный абзац
    else {
      l = `<p class="notion-paragraph">${l}</p>`;
    }

    // Ссылки: [text](url)
    l = l.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a class="notion-text-link" href="$2" target="_blank" rel="noopener noreferrer">$1 ↗</a>'
    );

    // Инлайн-код: `code`
    l = l.replace(/`([^`]+)`/g, '<code class="notion-inline-code">$1</code>');

    // Жирный текст: **bold**
    l = l.replace(/(\*\*|__)(.*?)\1/g, '<strong>$2</strong>');

    // Курсив: *italic*
    l = l.replace(/(\*|_)(.*?)\1/g, '<em>$2</em>');

    // Зачеркнутый текст: ~~text~~
    l = l.replace(/~~(.*?)~~/g, '<del>$1</del>');

    processedLines.push(l);
  }

  let result = processedLines.join("");

  // Возвращаем сохраненные блоки кода
  codeBlocks.forEach((blockHtml, index) => {
    result = result.replace(`__MD_CODE_BLOCK_${index}__`, blockHtml);
  });

  return result;
};
