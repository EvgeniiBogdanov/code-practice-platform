/**
 * tagEngine.js
 * Высокопроизводительный движок автозакрытия и синхронного автопереименования тегов HTML / JSX / React
 * (Auto Close Tag & Auto Rename Tag) в стиле VS Code / WebStorm.
 */

export const VOID_HTML_TAGS = new Set([
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

export const KNOWN_HTML_TAGS = new Set([
  "a",
  "abbr",
  "address",
  "article",
  "aside",
  "audio",
  "b",
  "base",
  "bdi",
  "bdo",
  "blockquote",
  "body",
  "button",
  "canvas",
  "caption",
  "cite",
  "code",
  "col",
  "colgroup",
  "data",
  "datalist",
  "dd",
  "del",
  "details",
  "dfn",
  "dialog",
  "div",
  "dl",
  "dt",
  "em",
  "embed",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hgroup",
  "hr",
  "html",
  "i",
  "iframe",
  "img",
  "input",
  "ins",
  "kbd",
  "label",
  "legend",
  "li",
  "link",
  "main",
  "map",
  "mark",
  "menu",
  "meta",
  "meter",
  "nav",
  "noscript",
  "object",
  "ol",
  "optgroup",
  "option",
  "output",
  "p",
  "picture",
  "portal",
  "pre",
  "progress",
  "q",
  "rp",
  "rt",
  "ruby",
  "s",
  "samp",
  "script",
  "section",
  "select",
  "slot",
  "small",
  "source",
  "span",
  "strong",
  "style",
  "sub",
  "summary",
  "sup",
  "svg",
  "table",
  "tbody",
  "td",
  "template",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "title",
  "tr",
  "track",
  "u",
  "ul",
  "var",
  "video",
  "wbr",
  // SVG tags
  "circle",
  "clipPath",
  "defs",
  "ellipse",
  "foreignObject",
  "g",
  "image",
  "line",
  "linearGradient",
  "mask",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "radialGradient",
  "rect",
  "stop",
  "text",
  "tspan",
  "use",
]);

/**
 * Парсинг всех тегов JSX / HTML в документе
 */
export function parseJsxTags(code) {
  if (!code || typeof code !== "string") return [];

  const tags = [];
  const len = code.length;
  let i = 0;

  while (i < len) {
    const ch = code[i];

    // Пропуск однострочных комментариев //
    if (ch === "/" && code[i + 1] === "/") {
      i += 2;
      while (i < len && code[i] !== "\n") i++;
      continue;
    }

    // Пропуск многострочных комментариев /* */
    if (ch === "/" && code[i + 1] === "*") {
      i += 2;
      while (i < len && !(code[i] === "*" && code[i + 1] === "/")) i++;
      i += 2;
      continue;
    }

    // Пропуск HTML комментариев <!-- -->
    if (ch === "<" && code.substring(i, i + 4) === "<!--") {
      i += 4;
      while (i < len && code.substring(i, i + 3) !== "-->") i++;
      i += 3;
      continue;
    }

    // Пропуск строковых литералов вне тегов ("...", '...', `...`)
    if (ch === '"' || ch === "'" || ch === "`") {
      const quote = ch;
      i++;
      while (i < len) {
        if (code[i] === "\\") {
          i += 2;
        } else if (code[i] === quote) {
          i++;
          break;
        } else {
          i++;
        }
      }
      continue;
    }

    // Обнаружение начала тега '<'
    if (ch === "<") {
      const tagStart = i;
      i++;

      // Проверка на закрывающий тег '</'
      let isClosing = false;
      if (i < len && code[i] === "/") {
        isClosing = true;
        i++;
      }

      // Пропуск пробелов после '<' или '</'
      while (i < len && /\s/.test(code[i])) i++;

      // React Fragment: <> или </>
      if (i < len && code[i] === ">") {
        const tagEnd = i + 1;
        tags.push({
          type: isClosing ? "close" : "open",
          name: "",
          start: tagStart,
          end: tagEnd,
          nameStart: isClosing ? tagStart + 2 : tagStart + 1,
          nameEnd: isClosing ? tagStart + 2 : tagStart + 1,
          isFragment: true,
        });
        i++;
        continue;
      }

      // Извлечение имени тега (буквы, цифры, _, $, -, ., :)
      const nameStart = i;
      while (i < len && /[a-zA-Z0-9_$.:-]/.test(code[i])) {
        i++;
      }
      const nameEnd = i;
      const tagName = code.substring(nameStart, nameEnd);

      // Если после '<' нет валидного имени тега (например, операция 'x < y'), пропускаем
      if (tagName.length === 0) {
        continue;
      }

      // Сканируем тело тега до символа '>' с учетом атрибутов, строк и JSX выражений {...}
      let isSelfClosing = false;
      let inAttrString = null;
      let braceDepth = 0;
      let validTag = false;

      while (i < len) {
        const c = code[i];

        if (inAttrString) {
          if (c === "\\") {
            i += 2;
            continue;
          }
          if (c === inAttrString) {
            inAttrString = null;
          }
          i++;
          continue;
        }

        if (c === '"' || c === "'" || c === "`") {
          inAttrString = c;
          i++;
          continue;
        }

        if (c === "{") {
          braceDepth++;
          i++;
          continue;
        }
        if (c === "}") {
          if (braceDepth > 0) braceDepth--;
          i++;
          continue;
        }

        if (braceDepth === 0) {
          if (c === "/" && code[i + 1] === ">") {
            isSelfClosing = true;
            i += 2;
            validTag = true;
            break;
          }
          if (c === ">") {
            i++;
            validTag = true;
            break;
          }
          if (c === "<") {
            // Новый тег начался до закрытия текущего
            break;
          }
        }

        i++;
      }

      if (validTag) {
        const tagEnd = i;
        let type;
        if (isClosing) {
          type = "close";
        } else if (isSelfClosing) {
          type = "selfClosing";
        } else if (
          VOID_HTML_TAGS.has(tagName.toLowerCase()) &&
          !/^[A-Z]/.test(tagName)
        ) {
          type = "selfClosing";
        } else {
          type = "open";
        }

        tags.push({
          type,
          name: tagName,
          start: tagStart,
          end: tagEnd,
          nameStart,
          nameEnd,
          isFragment: false,
        });
      }
      continue;
    }

    i++;
  }

  return tags;
}

/**
 * Сопоставление открывающих и закрывающих тегов в пары (Tag Pairs)
 */
export function getTagPairs(tags) {
  const pairs = [];
  const stack = [];

  for (const tag of tags) {
    if (tag.type === "selfClosing") {
      continue;
    }

    if (tag.type === "open") {
      stack.push(tag);
    } else if (tag.type === "close") {
      let matchIdx = -1;

      // Поиск ближайшего совпадающего открывающего тега в стеке
      for (let i = stack.length - 1; i >= 0; i--) {
        if (tag.isFragment && stack[i].isFragment) {
          matchIdx = i;
          break;
        }
        if (
          !tag.isFragment &&
          !stack[i].isFragment &&
          stack[i].name.toLowerCase() === tag.name.toLowerCase()
        ) {
          matchIdx = i;
          break;
        }
      }

      if (matchIdx !== -1) {
        const openTag = stack[matchIdx];
        pairs.push({ openTag, closeTag: tag });
        stack.splice(matchIdx, stack.length - matchIdx);
      }
    }
  }

  return pairs;
}

/**
 * Поиск диапазона изменений между старым и новым кодом
 */
export function getDiffRange(oldStr, newStr) {
  let start = 0;
  while (
    start < oldStr.length &&
    start < newStr.length &&
    oldStr[start] === newStr[start]
  ) {
    start++;
  }

  let oldEnd = oldStr.length;
  let newEnd = newStr.length;
  while (
    oldEnd > start &&
    newEnd > start &&
    oldStr[oldEnd - 1] === newStr[newEnd - 1]
  ) {
    oldEnd--;
    newEnd--;
  }

  return {
    oldStart: start,
    oldEnd: oldEnd,
    newStart: start,
    newEnd: newEnd,
  };
}

/**
 * Auto Rename Tag: Синхронное переименование парного тега при редактировании названия
 * Работает строго в границах имени тега и никогда не ломает разметку при вводе внутри тега.
 */
export function handleAutoRenameTag(oldCode, newCode, cursorPos) {
  if (!oldCode || !newCode || oldCode === newCode) {
    return { updatedCode: newCode, newCursorPos: cursorPos };
  }

  const diff = getDiffRange(oldCode, newCode);
  const { oldStart, oldEnd } = diff;

  const oldTags = parseJsxTags(oldCode);
  if (oldTags.length === 0) {
    return { updatedCode: newCode, newCursorPos: cursorPos };
  }

  const pairs = getTagPairs(oldTags);
  if (pairs.length === 0) {
    return { updatedCode: newCode, newCursorPos: cursorPos };
  }

  for (const pair of pairs) {
    const { openTag, closeTag } = pair;

    // --- Вариант 1: Изменение строго в имени открывающего тега <tagName ...> ---
    const isOpenTagMatch = openTag.isFragment
      ? oldStart === openTag.nameStart && oldEnd === openTag.nameStart
      : oldStart >= openTag.nameStart && oldEnd <= openTag.nameEnd;

    if (isOpenTagMatch) {
      // Ищем новое имя открывающего тега в newCode от nameStart
      const newNameStart = openTag.nameStart;
      let newNameEnd = newNameStart;
      while (
        newNameEnd < newCode.length &&
        /[a-zA-Z0-9_$.:-]/.test(newCode[newNameEnd])
      ) {
        newNameEnd++;
      }
      const newTagName = newCode.substring(newNameStart, newNameEnd);

      if (newTagName !== openTag.name) {
        const delta = newTagName.length - openTag.name.length;
        const closeNameStartInNew = closeTag.nameStart + delta;
        const closeNameEndInNew = closeTag.nameEnd + delta;

        // Проверяем, что в newCode на месте закрывающего тега действительно старое имя
        const currentCloseName = newCode.substring(
          closeNameStartInNew,
          closeNameEndInNew,
        );
        if (
          currentCloseName === closeTag.name ||
          (closeTag.isFragment && currentCloseName === "")
        ) {
          const finalCode =
            newCode.substring(0, closeNameStartInNew) +
            newTagName +
            newCode.substring(closeNameEndInNew);

          return { updatedCode: finalCode, newCursorPos: cursorPos };
        }
      }
    }

    // --- Вариант 2: Изменение строго в имени закрывающего тега </tagName> ---
    const isCloseTagMatch = closeTag.isFragment
      ? oldStart === closeTag.nameStart && oldEnd === closeTag.nameStart
      : oldStart >= closeTag.nameStart && oldEnd <= closeTag.nameEnd;

    if (isCloseTagMatch) {
      // Ищем новое имя закрывающего тега в newCode от nameStart
      const newNameStart = closeTag.nameStart;
      let newNameEnd = newNameStart;
      while (
        newNameEnd < newCode.length &&
        /[a-zA-Z0-9_$.:-]/.test(newCode[newNameEnd])
      ) {
        newNameEnd++;
      }
      const newTagName = newCode.substring(newNameStart, newNameEnd);

      if (newTagName !== closeTag.name) {
        const openNameStartInNew = openTag.nameStart;
        const openNameEndInNew = openTag.nameEnd;

        // Проверяем, что в newCode на месте открывающего тега действительно старое имя
        const currentOpenName = newCode.substring(
          openNameStartInNew,
          openNameEndInNew,
        );
        if (
          currentOpenName === openTag.name ||
          (openTag.isFragment && currentOpenName === "")
        ) {
          const openDelta = newTagName.length - openTag.name.length;
          const finalCode =
            newCode.substring(0, openNameStartInNew) +
            newTagName +
            newCode.substring(openNameEndInNew);

          return {
            updatedCode: finalCode,
            newCursorPos: cursorPos + openDelta,
          };
        }
      }
    }
  }

  return { updatedCode: newCode, newCursorPos: cursorPos };
}

/**
 * Auto Close Tag: Проверка необходимости вставки закрывающего тега при вводе '>'
 * Корректно учитывает вложенные выражения {...}, стрелочные функции =>, кавычки и void-теги.
 */
export function checkAutoCloseTag(textBeforeCursor, textAfterCursor = "") {
  if (!textBeforeCursor || typeof textBeforeCursor !== "string") return null;

  // React Fragment: <>
  if (textBeforeCursor.endsWith("<")) {
    return { tagName: "", isFragment: true };
  }

  // Закрывающий тег уже формируется (</tag...) -> не дублировать
  if (/<\/[a-zA-Z0-9_$.:-]*$/.test(textBeforeCursor)) {
    return null;
  }

  // Сканируем назад от курсора для нахождения открывающего '<' текущего тега
  const len = textBeforeCursor.length;
  let inString = null;
  let braceDepth = 0;
  let tagStart = -1;

  for (let i = len - 1; i >= 0; i--) {
    const ch = textBeforeCursor[i];

    if (ch === "}" && !inString) {
      braceDepth++;
      continue;
    }
    if (ch === "{" && !inString) {
      if (braceDepth > 0) braceDepth--;
      continue;
    }

    // Обработка строк внутри атрибутов
    if (
      (ch === '"' || ch === "'" || ch === "`") &&
      textBeforeCursor[i - 1] !== "\\"
    ) {
      if (inString === ch) {
        inString = null;
      } else if (!inString) {
        inString = ch;
      }
      continue;
    }

    if (!inString && braceDepth === 0) {
      if (ch === ">") {
        // Тег уже был закрыт перед курсором
        return null;
      }
      if (ch === "<") {
        tagStart = i;
        break;
      }
    }
  }

  if (tagStart === -1) return null;

  const tagContent = textBeforeCursor.substring(tagStart);

  // Должен начинаться с <tagName (с возможными атрибутами)
  const tagMatch = tagContent.match(/^<([a-zA-Z0-9_$.:-]+)([\s\S]*)$/);
  if (!tagMatch) return null;

  const tagName = tagMatch[1];
  const tagAttrs = tagMatch[2];

  // Самозакрывающийся тег с косой чертой />
  if (tagAttrs.trim().endsWith("/")) {
    return null;
  }

  // Обычный void-элемент HTML (<img>, <input>, <br>, etc.)
  if (VOID_HTML_TAGS.has(tagName.toLowerCase()) && !/^[A-Z]/.test(tagName)) {
    return null;
  }

  // Проверка на JS операторы сравнения (например, `i < len`, `x < y`)
  const textBeforeTag = textBeforeCursor.substring(0, tagStart).trimEnd();
  if (
    /(===|!==|==|!=|<=|>=|\+|-|\*|\/|%|&&|\|\||\?|:|\b(if|while|for|return|switch|case|typeof|instanceof))\s*\(?$/i.test(
      textBeforeTag,
    )
  ) {
    const isReactComponent = /^[A-Z]/.test(tagName);
    const isStandardHtmlTag =
      KNOWN_HTML_TAGS.has(tagName.toLowerCase()) || tagName.includes("-");
    if (!isReactComponent && !isStandardHtmlTag) {
      return null;
    }
  }

  // Если непосредственно после курсора уже есть закрывающий тег или символ '>'
  const trimmedAfter = textAfterCursor.trimStart();
  if (
    trimmedAfter.startsWith(`</${tagName}>`) ||
    trimmedAfter.startsWith(`</${tagName}`) ||
    trimmedAfter.startsWith("</>") ||
    trimmedAfter.startsWith(">")
  ) {
    return null;
  }

  return { tagName, isFragment: false };
}

/**
 * Автодополнение незакрытого тега при вводе '</'
 */
export function findLastUnclosedTag(textBeforeCursor) {
  if (!textBeforeCursor) return null;

  const tags = parseJsxTags(textBeforeCursor);
  const stack = [];

  for (const tag of tags) {
    if (tag.type === "selfClosing") continue;

    if (tag.type === "open") {
      stack.push(tag.name);
    } else if (tag.type === "close") {
      let idx = -1;
      for (let i = stack.length - 1; i >= 0; i--) {
        if (stack[i].toLowerCase() === tag.name.toLowerCase()) {
          idx = i;
          break;
        }
      }
      if (idx !== -1) {
        stack.splice(idx, stack.length - idx);
      }
    }
  }

  if (stack.length > 0) {
    return stack[stack.length - 1];
  }

  return null;
}
