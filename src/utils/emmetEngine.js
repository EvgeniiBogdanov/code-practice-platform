/**
 * emmetEngine.js
 * Высокопроизводительный парсер и генератор Emmet-разметки специально для React JSX / TSX.
 * Преобразует компактные аббревиатуры (div.card>button.btn*2) в валидный красивый JSX с className.
 */

const VOID_TAGS = new Set([
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
 * Парсит одиночный токен тега Emmet с классами, id, атрибутами и текстом
 * Пример: `button.btn.btn-primary#submit[type="button" disabled]{Click me}`
 */
function parseAtomicTag(token, itemIndex = 1) {
  let rest = token;
  let text = "";

  // 1. Извлекаем текст {text}
  const textMatch = rest.match(/\{([^}]*)\}/);
  if (textMatch) {
    text = textMatch[1].replace(/\$/g, String(itemIndex));
    rest = rest.replace(/\{[^}]*\}/, "");
  }

  // 2. Извлекаем кастомные атрибуты [attr=val]
  const attributes = {};
  const attrMatch = rest.match(/\[([^\]]*)\]/);
  if (attrMatch) {
    const rawAttrs = attrMatch[1];
    rest = rest.replace(/\[[^\]]*\]/, "");

    // Парсим пары attr="val" или attr=val или просто attr (boolean)
    const attrRegex = /([a-zA-Z0-9_-]+)(?:=(?:"([^"]*)"|'([^']*)'|([^,\s\]]+)))?/g;
    let am;
    while ((am = attrRegex.exec(rawAttrs)) !== null) {
      const attrName = am[1] === "class" ? "className" : am[1];
      const val = am[2] !== undefined ? am[2] : am[3] !== undefined ? am[3] : am[4] !== undefined ? am[4] : true;
      attributes[attrName] = typeof val === "string" ? val.replace(/\$/g, String(itemIndex)) : val;
    }
  }

  // 3. Извлекаем имя тега
  let tag = "div";
  const tagMatch = rest.match(/^([a-zA-Z0-9_-]+)/);
  if (tagMatch) {
    tag = tagMatch[1];
    rest = rest.substring(tag.length);
  }

  // 4. Извлекаем ID (#id) и классы (.class)
  let id = "";
  const classNames = [];

  const modifierRegex = /([.#])([a-zA-Z0-9_$-]+)/g;
  let mm;
  while ((mm = modifierRegex.exec(rest)) !== null) {
    const symbol = mm[1];
    const val = mm[2].replace(/\$/g, String(itemIndex));
    if (symbol === "#") {
      id = val;
    } else if (symbol === ".") {
      classNames.push(val);
    }
  }

  return {
    tag,
    id,
    classNames,
    attributes,
    text,
  };
}

/**
 * Парсит Emmet-аббревиатуру в AST-дерево
 */
export function parseEmmet(abbr) {
  if (!abbr || typeof abbr !== "string") return null;

  // Разбиваем строку на узлы с учетом операторов >, +, ^
  const root = { children: [] };
  let currentParent = root;
  const parentStack = [root];

  // Токенизатор с учетом группировок скобками ()
  let i = 0;
  let currentToken = "";

  const pushToken = () => {
    if (!currentToken.trim()) return;

    // Проверяем умножение: tag*N
    let count = 1;
    const multMatch = currentToken.match(/\*(\d+)$/);
    let baseToken = currentToken;
    if (multMatch) {
      count = Math.min(parseInt(multMatch[1], 10) || 1, 50); // защита от переполнения
      baseToken = currentToken.substring(0, multMatch.index);
    }

    const nodeGroup = [];
    for (let c = 1; c <= count; c++) {
      const parsed = parseAtomicTag(baseToken, c);
      nodeGroup.push({
        ...parsed,
        children: [],
      });
    }

    // Добавляем к текущему родителю
    for (const node of nodeGroup) {
      currentParent.children.push(node);
    }

    // Последний созданный узел становится потенциальным родителем для оператора >
    return nodeGroup[nodeGroup.length - 1];
  };

  let lastNode = null;

  while (i < abbr.length) {
    const ch = abbr[i];

    if (ch === "{") {
      // Считываем текст до закрывающей }
      const closeIdx = abbr.indexOf("}", i);
      if (closeIdx === -1) {
        currentToken += abbr.slice(i);
        break;
      }
      currentToken += abbr.slice(i, closeIdx + 1);
      i = closeIdx + 1;
      continue;
    }

    if (ch === "[") {
      // Считываем атрибуты до закрывающей ]
      const closeIdx = abbr.indexOf("]", i);
      if (closeIdx === -1) {
        currentToken += abbr.slice(i);
        break;
      }
      currentToken += abbr.slice(i, closeIdx + 1);
      i = closeIdx + 1;
      continue;
    }

    if (ch === ">") {
      lastNode = pushToken();
      if (lastNode) {
        parentStack.push(currentParent);
        currentParent = lastNode;
      }
      currentToken = "";
      i++;
      continue;
    }

    if (ch === "+") {
      pushToken();
      currentToken = "";
      i++;
      continue;
    }

    if (ch === "^") {
      pushToken();
      if (parentStack.length > 1) {
        currentParent = parentStack.pop();
      }
      currentToken = "";
      i++;
      continue;
    }

    currentToken += ch;
    i++;
  }

  pushToken();
  return root;
}

/**
 * Рендерит узел AST в красивый JSX код
 */
function renderNodeToJSX(node, indentLevel = 0, indentStr = "  ") {
  const currentIndent = indentStr.repeat(indentLevel);
  const { tag, id, classNames, attributes, text, children } = node;

  // Формируем атрибуты
  const attrs = [];
  if (id) {
    attrs.push(`id="${id}"`);
  }
  if (classNames.length > 0) {
    attrs.push(`className="${classNames.join(" ")}"`);
  }
  for (const [k, v] of Object.entries(attributes)) {
    if (v === true) {
      attrs.push(k);
    } else {
      attrs.push(`${k}="${v}"`);
    }
  }

  const attrStr = attrs.length > 0 ? " " + attrs.join(" ") : "";
  const isVoid = VOID_TAGS.has(tag.toLowerCase());

  if (isVoid) {
    return `${currentIndent}<${tag}${attrStr} />`;
  }

  if (children.length === 0 && !text) {
    return `${currentIndent}<${tag}${attrStr}></${tag}>`;
  }

  if (children.length === 0 && text) {
    return `${currentIndent}<${tag}${attrStr}>${text}</${tag}>`;
  }

  const childLines = [];
  if (text) {
    childLines.push(indentStr.repeat(indentLevel + 1) + text);
  }
  for (const child of children) {
    childLines.push(renderNodeToJSX(child, indentLevel + 1, indentStr));
  }

  return `${currentIndent}<${tag}${attrStr}>\n${childLines.join("\n")}\n${currentIndent}</${tag}>`;
}

/**
 * Разворачивает Emmet-аббревиатуру в JSX код
 * @param {string} abbr Строка аббревиатуры (например, `div.card>button.btn*2`)
 * @param {string} [baseIndent=""] Начальный отступ строки
 * @returns {string | null}
 */
export function expandEmmetAbbreviation(abbr, baseIndent = "") {
  if (!isEmmetAbbreviation(abbr)) return null;

  try {
    const ast = parseEmmet(abbr.trim());
    if (!ast || !ast.children || ast.children.length === 0) return null;

    const lines = ast.children.map((child) => renderNodeToJSX(child, 0, "  "));
    const rendered = lines.join("\n");

    if (baseIndent) {
      return rendered
        .split("\n")
        .map((line, idx) => (idx === 0 ? line : baseIndent + line))
        .join("\n");
    }

    return rendered;
  } catch (err) {
    return null;
  }
}

/**
 * Быстрая проверка, похожа ли строка на валидную Emmet-аббревиатуру
 * @param {string} str
 * @returns {boolean}
 */
export function isEmmetAbbreviation(str) {
  if (!str || typeof str !== "string") return false;
  const trimmed = str.trim();
  if (trimmed.length < 2) return false;

  // Исключаем ключевые слова JS, операторы и комментарии
  if (
    /^(const|let|var|function|return|import|export|if|for|while|switch|class|type|interface)\b/.test(
      trimmed
    )
  ) {
    return false;
  }

  // Должен содержать характерные синтаксические маркеры Emmet
  // (.className, #id, tag>child, tag+sibling, tag*N, [attr], {text})
  const hasEmmetMarker =
    /[.#>+*\[{]/.test(trimmed) ||
    /^(div|span|button|input|p|h[1-6]|ul|ol|li|section|header|footer|nav|main|form|table|tr|td|th|select|option|a|img|label)$/.test(
      trimmed
    );

  if (!hasEmmetMarker) return false;

  // Исключаем содержимое фигурных скобок и кастомных атрибутов
  const withoutStrings = trimmed.replace(/\{[^}]*\}/g, "").replace(/\[[^\]]*\]/g, "");
  if (/\s/.test(withoutStrings)) return false;

  // Базовая проверка валидности синтаксической структуры
  return /^[a-zA-Z0-9_$.#:>+*^=$/-]+$/.test(withoutStrings);
}
