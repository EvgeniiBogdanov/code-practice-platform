import { highlightJS } from "./codeHighlighter";

export const parseMarkdown = (text) => {
  if (!text) return "";

  // 1. Извлекаем блоки кода ```lang ... ``` или ``lang ... `` (с учетом любых отступов)
  const codeBlocks = [];
  const extractCodeBlocks = (str, pattern) => {
    return str.replace(pattern, (_, lang, code) => {
      const placeholder = `__MD_CODE_BLOCK_${codeBlocks.length}__`;
      const highlighted = highlightJS(code.trim());
      const blockHtml = `<div class="code-preview-wrapper" style="margin: 10px 0;"><pre class="code-preview-block" style="padding: 12px 16px; font-size: 13px;"><code>${highlighted}</code></pre></div>`;
      codeBlocks.push(blockHtml);
      return placeholder;
    });
  };

  // 3 бактэка (с отступом или без)
  let htmlText = extractCodeBlocks(text, /^[ \t]*\`{3}(\w*)[ \t]*\n([\s\S]*?)^[ \t]*\`{3}/gm);
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

    // Заголовки ####, ###, ##, #
    if (/^####\s+(.*)/.test(l)) {
      l = l.replace(/^####\s+(.*)/, '<h5 class="md-h4">$1</h5>');
    } else if (/^###\s+(.*)/.test(l)) {
      l = l.replace(/^###\s+(.*)/, '<h4 class="md-h3">$1</h4>');
    } else if (/^##\s+(.*)/.test(l)) {
      l = l.replace(/^##\s+(.*)/, '<h3 class="md-h2">$1</h3>');
    } else if (/^#\s+(.*)/.test(l)) {
      l = l.replace(/^#\s+(.*)/, '<h2 class="md-h1">$1</h2>');
    }
    // Разделитель --- или ***
    else if (/^(---|[*]{3})$/.test(l)) {
      l = '<hr class="md-hr" />';
    }
    // Цитаты / коллауты >
    else if (/^>\s+(.*)/.test(l)) {
      l = l.replace(/^>\s+(.*)/, '<blockquote class="md-quote">$1</blockquote>');
    }
    // Нумерованный список: 1. текст
    else if (/^\d+\.\s+(.*)/.test(l)) {
      l = l.replace(
        /^(\d+\.)\s+(.*)/,
        '<div class="md-list-item"><span class="md-list-num">$1</span><span>$2</span></div>'
      );
    }
    // Маркированный список: - или * или •
    else if (/^[-*•]\s+(.*)/.test(l)) {
      l = l.replace(
        /^[-*•]\s+(.*)/,
        '<div class="md-list-item"><span class="md-list-bullet">•</span><span>$1</span></div>'
      );
    }
    // Обычный абзац
    else {
      l = `<p class="md-p">${l}</p>`;
    }

    // Ссылки: [text](url)
    l = l.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a class="md-link" href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    // Инлайн-код: `code`
    l = l.replace(/`([^`]+)`/g, '<code class="md-inline-code">$1</code>');

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
