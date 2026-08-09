/**
 * tagEngine.js
 * Движок автозакрытия и автопереименования тегов HTML / JSX / React (Auto Close Tag & Auto Rename Tag).
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

    // Пропуск однострочных комментариев
    if (ch === "/" && code[i + 1] === "/") {
      i += 2;
      while (i < len && code[i] !== "\n") i++;
      continue;
    }

    // Пропуск многострочных комментариев
    if (ch === "/" && code[i + 1] === "*") {
      i += 2;
      while (i < len && !(code[i] === "*" && code[i + 1] === "/")) i++;
      i += 2;
      continue;
    }

    // Пропуск HTML комментариев
    if (ch === "<" && code.substring(i, i + 4) === "<!--") {
      i += 4;
      while (i < len && code.substring(i, i + 3) !== "-->") i++;
      i += 3;
      continue;
    }

    // Пропуск строковых литералов вне тегов
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

      // Извлечение имени тега (поддержка букв, цифр, _, $, -, ., :)
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

        if (c === '"' || c === "'") {
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
        } else if (VOID_HTML_TAGS.has(tagName.toLowerCase()) && !/^[A-Z]/.test(tagName)) {
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

      // 1. Поиск точно совпадающего по имени открывающего тега в стеке
      for (let i = stack.length - 1; i >= 0; i--) {
        if (stack[i].name.toLowerCase() === tag.name.toLowerCase()) {
          matchIdx = i;
          break;
        }
      }

      if (matchIdx !== -1) {
        const openTag = stack[matchIdx];
        pairs.push({ openTag, closeTag: tag });
        stack.splice(matchIdx, stack.length - matchIdx);
      } else if (stack.length > 0) {
        // 2. Если имена отличаются (например, в процессе переименования тега),
        // верхний открывающий тег в стеке является структурной парой
        const openTag = stack.pop();
        pairs.push({ openTag, closeTag: tag });
      }
    }
  }

  return pairs;
}

/**
 * Поиск диапазона изменений между старым и новым кодом
 */
function getDiffRange(oldStr, newStr) {
  let start = 0;
  while (start < oldStr.length && start < newStr.length && oldStr[start] === newStr[start]) {
    start++;
  }

  let oldEnd = oldStr.length;
  let newEnd = newStr.length;
  while (oldEnd > start && newEnd > start && oldStr[oldEnd - 1] === newStr[newEnd - 1]) {
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

    // --- Вариант 1: Изменение в открывающем теге <tagName ...> ---
    const isOpenTagMatch =
      (oldStart >= openTag.start && oldEnd <= openTag.nameEnd + 1) ||
      (openTag.isFragment && oldStart >= openTag.start && oldEnd <= openTag.end);

    if (isOpenTagMatch) {
      // Ищем новое имя открывающего тега в newCode
      const newNameStart = openTag.nameStart;
      let newNameEnd = newNameStart;
      while (newNameEnd < newCode.length && /[a-zA-Z0-9_$.:-]/.test(newCode[newNameEnd])) {
        newNameEnd++;
      }
      const newTagName = newCode.substring(newNameStart, newNameEnd);

      if (newTagName !== openTag.name) {
        const delta = newTagName.length - openTag.name.length;
        const closeNameStartInNew = closeTag.nameStart + delta;
        const closeNameEndInNew = closeTag.nameEnd + delta;

        // Проверяем, что в newCode на месте закрывающего тега действительно старое имя
        const currentCloseName = newCode.substring(closeNameStartInNew, closeNameEndInNew);
        if (currentCloseName === closeTag.name || (closeTag.isFragment && currentCloseName === "")) {
          const finalCode =
            newCode.substring(0, closeNameStartInNew) +
            newTagName +
            newCode.substring(closeNameEndInNew);

          return { updatedCode: finalCode, newCursorPos: cursorPos };
        }
      }
    }

    // --- Вариант 2: Изменение в закрывающем теге </tagName> ---
    const isCloseTagMatch =
      (oldStart >= closeTag.start && oldEnd <= closeTag.nameEnd + 1) ||
      (closeTag.isFragment && oldStart >= closeTag.start && oldEnd <= closeTag.end);

    if (isCloseTagMatch) {
      // Ищем новое имя закрывающего тега в newCode
      const newNameStart = closeTag.nameStart;
      let newNameEnd = newNameStart;
      while (newNameEnd < newCode.length && /[a-zA-Z0-9_$.:-]/.test(newCode[newNameEnd])) {
        newNameEnd++;
      }
      const newTagName = newCode.substring(newNameStart, newNameEnd);

      if (newTagName !== closeTag.name) {
        const openNameStartInNew = openTag.nameStart;
        const openNameEndInNew = openTag.nameEnd;

        // Проверяем, что в newCode на месте открывающего тега действительно старое имя
        const currentOpenName = newCode.substring(openNameStartInNew, openNameEndInNew);
        if (currentOpenName === openTag.name || (openTag.isFragment && currentOpenName === "")) {
          const openDelta = newTagName.length - openTag.name.length;
          const finalCode =
            newCode.substring(0, openNameStartInNew) +
            newTagName +
            newCode.substring(openNameEndInNew);

          return { updatedCode: finalCode, newCursorPos: cursorPos + openDelta };
        }
      }
    }
  }

  return { updatedCode: newCode, newCursorPos: cursorPos };
}

/**
 * Auto Close Tag: Проверка необходимости вставки закрывающего тега при вводе '>'
 */
export function checkAutoCloseTag(textBeforeCursor, textAfterCursor = "") {
  if (!textBeforeCursor) return null;

  // React Fragment: <>
  if (textBeforeCursor.endsWith("<")) {
    return { tagName: "", isFragment: true };
  }

  // Закрывающий тег уже формируется (</tag...) -> не дублировать
  if (textBeforeCursor.match(/<\/[a-zA-Z0-9_$.:-]*$/)) {
    return null;
  }

  const match = textBeforeCursor.match(/<([a-zA-Z0-9_$.:-]+)([^>]*)$/);
  if (!match) return null;

  const tagName = match[1];
  const tagAttrs = match[2];

  // Самозакрывающийся тег с косой чертой />
  if (tagAttrs.trim().endsWith("/")) {
    return null;
  }

  // Обычный void-элемент HTML (<img>, <input>, <br>, etc.)
  if (VOID_HTML_TAGS.has(tagName.toLowerCase()) && !/^[A-Z]/.test(tagName)) {
    return null;
  }

  // Если непосредственно после курсора уже есть парный закрывающий тег
  if (textAfterCursor.trim().startsWith(`</${tagName}>`)) {
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
      } else if (stack.length > 0) {
        stack.pop();
      }
    }
  }

  if (stack.length > 0) {
    return stack[stack.length - 1];
  }

  return null;
}
