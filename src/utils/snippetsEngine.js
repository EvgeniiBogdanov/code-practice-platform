/**
 * snippetsEngine.js
 * Движок автодополнения (IntelliSense/Autocomplete) в стиле VS Code & WebStorm.
 */

export const JS_SNIPPETS = [
  {
    prefix: "clg",
    label: "clg → console.log()",
    detail: "Вывод в консоль",
    kind: "snippet",
    body: "console.log($1);",
    cursorOffset: 12,
  },
  {
    prefix: "clo",
    label: "clo → console.log('var: ', var)",
    detail: "Вывод переменной с меткой",
    kind: "snippet",
    body: "console.log('$1: ', $1);",
    cursorOffset: 13,
  },
  {
    prefix: "log",
    label: "log → console.log()",
    detail: "Вывод в консоль",
    kind: "snippet",
    body: "console.log($1);",
    cursorOffset: 12,
  },
  {
    prefix: "warn",
    label: "warn → console.warn()",
    detail: "Предупреждение в консоли",
    kind: "snippet",
    body: "console.warn($1);",
    cursorOffset: 13,
  },
  {
    prefix: "err",
    label: "err → console.error()",
    detail: "Ошибка в консоли",
    kind: "snippet",
    body: "console.error($1);",
    cursorOffset: 14,
  },
  {
    prefix: "fn",
    label: "fn → Стрелочная функция",
    detail: "const name = () => {}",
    kind: "snippet",
    body: "const $1 = ($2) => {\n  $3\n};",
    cursorOffset: 6,
  },
  {
    prefix: "afn",
    label: "afn → Асинхронная стрелочная функция",
    detail: "const name = async () => {}",
    kind: "snippet",
    body: "const $1 = async ($2) => {\n  $3\n};",
    cursorOffset: 6,
  },
  {
    prefix: "fnd",
    label: "fnd → Function declaration",
    detail: "function name() {}",
    kind: "snippet",
    body: "function $1($2) {\n  $3\n}",
    cursorOffset: 9,
  },
  {
    prefix: "for",
    label: "for → Цикл for(let i...)",
    detail: "Классический цикл for",
    kind: "snippet",
    body: "for (let i = 0; i < $1.length; i++) {\n  $2\n}",
    cursorOffset: 20,
  },
  {
    prefix: "forof",
    label: "forof → Цикл for...of",
    detail: "Итерация по элементам",
    kind: "snippet",
    body: "for (const item of $1) {\n  $2\n}",
    cursorOffset: 19,
  },
  {
    prefix: "forin",
    label: "forin → Цикл for...in",
    detail: "Итерация по ключам объекта",
    kind: "snippet",
    body: "for (const key in $1) {\n  $2\n}",
    cursorOffset: 18,
  },
  {
    prefix: "ife",
    label: "ife → if...else",
    detail: "Условная конструкция",
    kind: "snippet",
    body: "if ($1) {\n  $2\n} else {\n  $3\n}",
    cursorOffset: 4,
  },
  {
    prefix: "if",
    label: "if → if() {}",
    detail: "Условный оператор",
    kind: "snippet",
    body: "if ($1) {\n  $2\n}",
    cursorOffset: 4,
  },
  {
    prefix: "tern",
    label: "tern → Тернарный оператор",
    detail: "cond ? a : b",
    kind: "snippet",
    body: "$1 ? $2 : $3",
    cursorOffset: 0,
  },
  {
    prefix: "try",
    label: "try → try...catch",
    detail: "Обработка исключений",
    kind: "snippet",
    body: "try {\n  $1\n} catch (error) {\n  console.error(error);\n}",
    cursorOffset: 8,
  },
  {
    prefix: "prom",
    label: "prom → new Promise",
    detail: "Создание промиса",
    kind: "snippet",
    body: "new Promise((resolve, reject) => {\n  $1\n})",
    cursorOffset: 37,
  },
  {
    prefix: "map",
    label: "map → Array.map()",
    detail: "Трансформация массива",
    kind: "snippet",
    body: "$1.map((item) => $2)",
    cursorOffset: 0,
  },
  {
    prefix: "filter",
    label: "filter → Array.filter()",
    detail: "Фильтрация массива",
    kind: "snippet",
    body: "$1.filter((item) => $2)",
    cursorOffset: 0,
  },
  {
    prefix: "reduce",
    label: "reduce → Array.reduce()",
    detail: "Свёртка массива",
    kind: "snippet",
    body: "$1.reduce((acc, curr) => {\n  $2\n  return acc;\n}, $3)",
    cursorOffset: 0,
  },
  {
    prefix: "sto",
    label: "sto → setTimeout",
    detail: "Отложенный вызов",
    kind: "snippet",
    body: "setTimeout(() => {\n  $1\n}, 1000);",
    cursorOffset: 21,
  },
  {
    prefix: "sti",
    label: "sti → setInterval",
    detail: "Периодический вызов",
    kind: "snippet",
    body: "setInterval(() => {\n  $1\n}, 1000);",
    cursorOffset: 22,
  },
  {
    prefix: "ret",
    label: "ret → return",
    detail: "Возврат значения",
    kind: "snippet",
    body: "return $1;",
    cursorOffset: 7,
  },
];

export const JS_KEYWORDS = [
  "const",
  "let",
  "var",
  "function",
  "return",
  "async",
  "await",
  "import",
  "export",
  "from",
  "default",
  "class",
  "extends",
  "super",
  "this",
  "constructor",
  "if",
  "else",
  "switch",
  "case",
  "break",
  "continue",
  "for",
  "while",
  "do",
  "try",
  "catch",
  "finally",
  "throw",
  "new",
  "typeof",
  "instanceof",
  "void",
  "delete",
  "in",
  "of",
  "yield",
  "null",
  "undefined",
  "true",
  "false",
];

export const REACT_HOOKS = [
  "useState",
  "useEffect",
  "useRef",
  "useMemo",
  "useCallback",
  "useContext",
  "useReducer",
  "useLayoutEffect",
  "useImperativeHandle",
  "useId",
  "useDeferredValue",
  "useTransition",
];

export const JS_GLOBALS = [
  "console",
  "console.log",
  "console.error",
  "console.warn",
  "Math",
  "Object",
  "Array",
  "String",
  "Number",
  "Boolean",
  "Promise",
  "JSON",
  "Map",
  "Set",
  "Date",
  "RegExp",
  "Symbol",
  "Error",
  "parseInt",
  "parseFloat",
  "isNaN",
  "setTimeout",
  "setInterval",
  "clearTimeout",
  "clearInterval",
];

// Автозакрываемые HTML/JSX теги
const SELF_CLOSING_TAGS = new Set([
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

export { checkAutoCloseTag } from "./tagEngine";

/**
 * Поиск всех подсказок (автодополнения) для текста перед курсором
 */
export const getCompletions = (fullCode, cursorIndex) => {
  if (!fullCode || cursorIndex <= 0) return { word: "", items: [] };

  const textBeforeCursor = fullCode.substring(0, cursorIndex);
  const match = textBeforeCursor.match(/([a-zA-Z_$][a-zA-Z0-9_$]*)$/);
  if (!match) return { word: "", items: [] };

  const word = match[1];
  if (!word || word.length < 1) return { word: "", items: [] };

  // Проверка: находится ли курсор внутри однострочного комментария
  const lineStart = textBeforeCursor.lastIndexOf("\n") + 1;
  const currentLineBeforeCursor = textBeforeCursor.substring(lineStart);
  if (currentLineBeforeCursor.includes("//")) {
    return { word: "", items: [] };
  }

  const wordLower = word.toLowerCase();

  // 1. Поиск по сниппетам
  const snippetItems = JS_SNIPPETS.filter((s) => s.prefix.toLowerCase().startsWith(wordLower)).map((s) => ({
    prefix: s.prefix,
    label: s.label,
    detail: s.detail,
    kind: "snippet",
    insertText: s.prefix,
    snippet: s,
  }));

  // 2. Поиск по ключевым словам
  const keywordItems = JS_KEYWORDS.filter((k) => k.toLowerCase().startsWith(wordLower)).map((k) => ({
    prefix: k,
    label: k,
    detail: "Ключевое слово JS",
    kind: "keyword",
    insertText: k,
  }));

  // 3. Поиск по React хукам
  const hookItems = REACT_HOOKS.filter((h) => h.toLowerCase().startsWith(wordLower)).map((h) => ({
    prefix: h,
    label: h,
    detail: "React Хук",
    kind: "hook",
    insertText: h,
  }));

  // 4. Поиск по глобальным объектам JS
  const globalItems = JS_GLOBALS.filter((g) => g.toLowerCase().startsWith(wordLower)).map((g) => ({
    prefix: g,
    label: g,
    detail: "Глобальный объект JS",
    kind: "global",
    insertText: g,
  }));

  // 5. Поиск по идентификаторам в текущем документе
  const docTokens = new Set();
  const tokenRegex = /\b[a-zA-Z_$][a-zA-Z0-9_$]*\b/g;
  let tMatch;
  while ((tMatch = tokenRegex.exec(fullCode)) !== null) {
    const tok = tMatch[0];
    if (
      tok !== word &&
      tok.length > 2 &&
      tok.toLowerCase().startsWith(wordLower) &&
      !JS_KEYWORDS.includes(tok) &&
      !REACT_HOOKS.includes(tok) &&
      !JS_GLOBALS.includes(tok)
    ) {
      docTokens.add(tok);
    }
  }

  const variableItems = Array.from(docTokens).slice(0, 5).map((v) => ({
    prefix: v,
    label: v,
    detail: "Переменная / Символ в коде",
    kind: "variable",
    insertText: v,
  }));

  // Объединение и ранжирование
  const allItems = [
    ...snippetItems,
    ...keywordItems,
    ...hookItems,
    ...variableItems,
    ...globalItems,
  ];

  // Убираем дубликаты по label
  const seenLabels = new Set();
  const uniqueItems = [];
  for (const item of allItems) {
    if (!seenLabels.has(item.label)) {
      seenLabels.add(item.label);
      uniqueItems.push(item);
    }
  }

  return {
    word,
    items: uniqueItems.slice(0, 10),
  };
};

/**
 * Совместимость: Поиск подходящих сниппетов
 */
export const getMatchingSnippets = (textBeforeCursor) => {
  const match = textBeforeCursor.match(/([a-zA-Z0-9_$]+)$/);
  if (!match) return { word: "", matches: [] };

  const word = match[1];
  if (word.length === 0) return { word: "", matches: [] };

  const matches = JS_SNIPPETS.filter((s) => s.prefix.toLowerCase().startsWith(word.toLowerCase()));
  return { word, matches };
};

/**
 * Вставка сниппета в текст с удалением префикса и расчетом позиции курсора
 */
export const expandSnippet = (fullCode, cursorIndex, snippet, prefixWord) => {
  const startReplace = cursorIndex - prefixWord.length;
  const rawBody = snippet.body.replace(/\$1/g, "").replace(/\$2/g, "").replace(/\$3/g, "").replace(/\$4/g, "");

  const before = fullCode.substring(0, startReplace);
  const after = fullCode.substring(cursorIndex);

  const newCode = before + rawBody + after;
  const newCursorPos = startReplace + (snippet.cursorOffset || rawBody.length);

  return { newCode, newCursorPos };
};
