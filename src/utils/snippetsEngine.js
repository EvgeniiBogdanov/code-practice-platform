/**
 * snippetsEngine.js
 * Движок сниппетов в стиле VS Code & WebStorm + автозакрытие HTML/JSX тегов.
 */

export const JS_SNIPPETS = [
  {
    prefix: "clg",
    label: "clg → console.log()",
    detail: "Вывод в консоль",
    body: "console.log($1);",
    cursorOffset: 12,
  },
  {
    prefix: "clo",
    label: "clo → console.log('var: ', var)",
    detail: "Вывод переменной с меткой",
    body: "console.log('$1: ', $1);",
    cursorOffset: 13,
  },
  {
    prefix: "log",
    label: "log → console.log()",
    detail: "Вывод в консоль",
    body: "console.log($1);",
    cursorOffset: 12,
  },
  {
    prefix: "warn",
    label: "warn → console.warn()",
    detail: "Предупреждение в консоли",
    body: "console.warn($1);",
    cursorOffset: 13,
  },
  {
    prefix: "err",
    label: "err → console.error()",
    detail: "Ошибка в консоли",
    body: "console.error($1);",
    cursorOffset: 14,
  },
  {
    prefix: "fn",
    label: "fn → Стрелочная функция",
    detail: "const name = () => {}",
    body: "const $1 = ($2) => {\n  $3\n};",
    cursorOffset: 6,
  },
  {
    prefix: "afn",
    label: "afn → Асинхронная стрелочная функция",
    detail: "const name = async () => {}",
    body: "const $1 = async ($2) => {\n  $3\n};",
    cursorOffset: 6,
  },
  {
    prefix: "fnd",
    label: "fnd → Function declaration",
    detail: "function name() {}",
    body: "function $1($2) {\n  $3\n}",
    cursorOffset: 9,
  },
  {
    prefix: "for",
    label: "for → Цикл for(let i...)",
    detail: "Классический цикл for",
    body: "for (let i = 0; i < $1.length; i++) {\n  $2\n}",
    cursorOffset: 20,
  },
  {
    prefix: "forof",
    label: "forof → Цикл for...of",
    detail: "Итерация по элементам",
    body: "for (const item of $1) {\n  $2\n}",
    cursorOffset: 19,
  },
  {
    prefix: "forin",
    label: "forin → Цикл for...in",
    detail: "Итерация по ключам объекта",
    body: "for (const key in $1) {\n  $2\n}",
    cursorOffset: 18,
  },
  {
    prefix: "ife",
    label: "ife → if...else",
    detail: "Условная конструкция",
    body: "if ($1) {\n  $2\n} else {\n  $3\n}",
    cursorOffset: 4,
  },
  {
    prefix: "if",
    label: "if → if() {}",
    detail: "Условный оператор",
    body: "if ($1) {\n  $2\n}",
    cursorOffset: 4,
  },
  {
    prefix: "tern",
    label: "tern → Тернарный оператор",
    detail: "cond ? a : b",
    body: "$1 ? $2 : $3",
    cursorOffset: 0,
  },
  {
    prefix: "try",
    label: "try → try...catch",
    detail: "Обработка исключений",
    body: "try {\n  $1\n} catch (error) {\n  console.error(error);\n}",
    cursorOffset: 8,
  },
  {
    prefix: "prom",
    label: "prom → new Promise",
    detail: "Создание промиса",
    body: "new Promise((resolve, reject) => {\n  $1\n})",
    cursorOffset: 37,
  },
  {
    prefix: "map",
    label: "map → Array.map()",
    detail: "Трансформация массива",
    body: "$1.map((item) => $2)",
    cursorOffset: 0,
  },
  {
    prefix: "filter",
    label: "filter → Array.filter()",
    detail: "Фильтрация массива",
    body: "$1.filter((item) => $2)",
    cursorOffset: 0,
  },
  {
    prefix: "reduce",
    label: "reduce → Array.reduce()",
    detail: "Свёртка массива",
    body: "$1.reduce((acc, curr) => {\n  $2\n  return acc;\n}, $3)",
    cursorOffset: 0,
  },
  {
    prefix: "sto",
    label: "sto → setTimeout",
    detail: "Отложенный вызов",
    body: "setTimeout(() => {\n  $1\n}, 1000);",
    cursorOffset: 21,
  },
  {
    prefix: "sti",
    label: "sti → setInterval",
    detail: "Периодический вызов",
    body: "setInterval(() => {\n  $1\n}, 1000);",
    cursorOffset: 22,
  },
  {
    prefix: "ret",
    label: "ret → return",
    detail: "Возврат значения",
    body: "return $1;",
    cursorOffset: 7,
  },
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

/**
 * Проверка автозакрытия тега JSX / HTML при вводе '>'
 */
export const checkAutoCloseTag = (codeBeforeCursor) => {
  const match = codeBeforeCursor.match(/<([a-zA-Z0-9_\-]+)([^>]*)$/);
  if (!match) return null;

  const tagName = match[1];
  const tagAttrs = match[2];

  // Если тег уже самозакрывающийся (<img /> или <br>)
  if (tagAttrs.trim().endsWith("/") || SELF_CLOSING_TAGS.has(tagName.toLowerCase())) {
    return null;
  }

  return tagName;
};

/**
 * Поиск подходящих сниппетов по текущему префиксу слова перед курсором
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
