/**
 * snippetsEngine.js
 * Движок автодополнения (IntelliSense/Autocomplete) и сниппетов в стиле VS Code & WebStorm.
 * Полная поддержка автодополнения импортов, нечеткого поиска (Fuzzy Search), методов (.member),
 * JSX тегов/пропсов, CSS свойств в style={{ ... }}, TypeScript Utility Types и умных сниппетов.
 */

import { isEmmetAbbreviation, expandEmmetAbbreviation } from "./emmetEngine.js";

// База известных пакетов и их экспортов
export const KNOWN_MODULES = {
  react: {
    name: "react",
    default: "React",
    named: [
      // Хуки состояния и жизненного цикла
      "useState",
      "useEffect",
      "useContext",
      "useReducer",
      "useCallback",
      "useMemo",
      "useRef",
      "useImperativeHandle",
      "useLayoutEffect",
      "useDebugValue",
      "useDeferredValue",
      "useTransition",
      "useId",
      "useSyncExternalStore",
      "useInsertionEffect",
      // Компоненты и утилиты
      "memo",
      "forwardRef",
      "createContext",
      "lazy",
      "Suspense",
      "Fragment",
      "StrictMode",
      "Component",
      "PureComponent",
      "createRef",
      "Children",
      "cloneElement",
      "isValidElement",
      "startTransition",
      // Типы TypeScript
      "FC",
      "ReactNode",
      "ReactElement",
      "CSSProperties",
      "ChangeEvent",
      "MouseEvent",
      "KeyboardEvent",
      "FormEvent",
      "RefObject",
      "Dispatch",
      "SetStateAction",
      "PropsWithChildren",
    ],
  },
  "react-dom": {
    name: "react-dom",
    default: "ReactDOM",
    named: ["createPortal", "flushSync", "findDOMNode", "unmountComponentAtNode", "render"],
  },
  "react-dom/client": {
    name: "react-dom/client",
    named: ["createRoot", "hydrateRoot"],
  },
  "@reduxjs/toolkit": {
    name: "@reduxjs/toolkit",
    named: [
      "createSlice",
      "configureStore",
      "createAsyncThunk",
      "createAction",
      "createReducer",
      "combineReducers",
      "createSelector",
      "createEntityAdapter",
      "isAnyOf",
      "isPending",
      "isFulfilled",
      "isRejected",
      "PayloadAction",
    ],
  },
  "react-redux": {
    name: "react-redux",
    named: ["useSelector", "useDispatch", "useStore", "Provider", "connect", "shallowEqual"],
  },
  zustand: {
    name: "zustand",
    named: ["create", "useStore"],
  },
  "zustand/middleware": {
    name: "zustand/middleware",
    named: ["persist", "devtools", "combine", "immer", "subscribeWithSelector"],
  },
  "@tanstack/react-router": {
    name: "@tanstack/react-router",
    named: [
      "Link",
      "useNavigate",
      "useParams",
      "useSearch",
      "useRouter",
      "createRoute",
      "createRootRoute",
      "createRouter",
      "Outlet",
      "useMatch",
      "useLoaderData",
      "useRouteContext",
      "RouterProvider",
      "redirect",
      "notFound",
    ],
  },
  "lucide-react": {
    name: "lucide-react",
    named: [
      "RotateCcw", "Copy", "Check", "FileCode", "Maximize2", "Minimize2",
      "WrapText", "Undo2", "Redo2", "CheckCircle2", "Code2", "AlertCircle",
      "Wand2", "ZoomIn", "ZoomOut", "Sparkles", "Box", "Globe", "Search",
      "Plus", "Trash", "Trash2", "Edit", "Edit2", "Edit3", "Save", "Download",
      "Upload", "Play", "Pause", "X", "Menu", "ChevronDown", "ChevronUp",
      "ChevronLeft", "ChevronRight", "ArrowLeft", "ArrowRight", "ArrowUp",
      "ArrowDown", "ExternalLink", "Eye", "EyeOff", "Lock", "Unlock",
      "Settings", "User", "Users", "Heart", "Star", "Sun", "Moon", "Folder",
      "File", "Filter", "Clock", "Calendar", "Terminal", "Layers", "Activity",
      "Info", "HelpCircle", "Send", "Share", "MoreVertical", "MoreHorizontal",
      "RefreshCw", "CheckSquare", "Square", "Sliders", "Grid", "List",
    ],
  },
  marked: {
    name: "marked",
    default: "marked",
    named: ["marked", "parse"],
  },
  dompurify: {
    name: "dompurify",
    default: "DOMPurify",
    named: ["DOMPurify", "sanitize"],
  },
  prettier: {
    name: "prettier",
    default: "prettier",
    named: ["prettier", "format"],
  },
};

// Карта прямого соответствия символов к модулям (например: useState -> react, createSlice -> @reduxjs/toolkit)
export const SYMBOL_TO_MODULE_MAP = (() => {
  const map = {};
  for (const [modName, modInfo] of Object.entries(KNOWN_MODULES)) {
    if (modInfo.default) {
      map[modInfo.default] = { module: modName, isDefault: true };
    }
    if (modInfo.named) {
      for (const sym of modInfo.named) {
        if (!map[sym]) {
          map[sym] = { module: modName, isDefault: false };
        }
      }
    }
  }
  return map;
})();

/**
 * Извлечение валидного имени компонента из пути/названия файла
 */
export const getComponentNameFromFilepath = (filepath = "Component.jsx") => {
  if (!filepath) return "Component";
  const basename = filepath.split("/").pop().split("\\").pop().replace(/\.[^/.]+$/, "");
  const clean = basename
    .replace(/[-_](\w)/g, (_, c) => c.toUpperCase())
    .replace(/[^a-zA-Z0-9_$]/g, "");
  if (!clean) return "Component";
  return clean[0].toUpperCase() + clean.slice(1);
};

/**
 * Нечеткий поиск (Fuzzy Matching) с расчетом релевантности (Scoring) в стиле VS Code
 */
export const fuzzyMatch = (target, query) => {
  if (!target || typeof target !== "string") return { match: false, score: 0 };
  if (!query || typeof query !== "string") return { match: true, score: 0 };

  const cleanTarget = target.trim();
  const cleanQuery = query.trim();
  if (!cleanQuery) return { match: true, score: 0 };

  const tLower = cleanTarget.toLowerCase();
  const qLower = cleanQuery.toLowerCase();

  // 1. Точное совпадение
  if (tLower === qLower) {
    return { match: true, score: 100 };
  }

  // 2. Префиксное совпадение
  if (tLower.startsWith(qLower)) {
    const bonus = Math.min(10, Math.round((qLower.length / tLower.length) * 10));
    return { match: true, score: 80 + bonus };
  }

  // 3. CamelCase / PascalCase акронимы и составные префиксы (например "cSl" -> "createSlice", "uSt" -> "useState", "uSel" -> "useSelector")
  const camelWords = cleanTarget.replace(/([a-z0-9])([A-Z])/g, "$1 $2").toLowerCase().split(" ");
  if (camelWords.length > 1) {
    const initials = camelWords.map((w) => w[0]).join("");
    if (initials.startsWith(qLower) || initials === qLower) {
      return { match: true, score: 75 + Math.min(5, qLower.length) };
    }

    let qRest = qLower;
    let wordMatches = 0;
    for (const w of camelWords) {
      if (qRest.length === 0) break;
      if (qRest.startsWith(w[0])) {
        let prefixLen = 1;
        while (prefixLen < w.length && prefixLen < qRest.length && w[prefixLen] === qRest[prefixLen]) {
          prefixLen++;
        }
        qRest = qRest.substring(prefixLen);
        wordMatches++;
      }
    }
    if (qRest.length === 0 && wordMatches >= 2) {
      return { match: true, score: 72 + Math.min(6, qLower.length) };
    }
  }

  // 4. Специфика для React хуков: если запрос "u" + начало имени, например "ust" -> "useState", "ueff" -> "useEffect"
  if (tLower.startsWith("use") && qLower.startsWith("u") && qLower.length >= 2) {
    const afterUse = tLower.substring(3);
    const queryAfterU = qLower.substring(1);
    if (afterUse.startsWith(queryAfterU)) {
      return { match: true, score: 68 };
    }
  }

  // 5. Подстрока
  const subIdx = tLower.indexOf(qLower);
  if (subIdx !== -1) {
    const posPenalty = Math.min(20, subIdx * 2);
    return { match: true, score: 50 - posPenalty };
  }

  // 6. Непрерывная нечеткая подпоследовательность (Fuzzy Subsequence)
  let qIdx = 0;
  let matchesInOrder = 0;
  for (let tIdx = 0; tIdx < tLower.length && qIdx < qLower.length; tIdx++) {
    if (tLower[tIdx] === qLower[qIdx]) {
      qIdx++;
      matchesInOrder++;
    }
  }

  if (matchesInOrder === qLower.length && qLower.length >= 2) {
    return { match: true, score: 20 + Math.min(10, qLower.length * 2) };
  }

  return { match: false, score: 0 };
};

// База методов и свойств для Member Access (вызов после точки obj.prop)
export const JS_MEMBER_COMPLETIONS = {
  array: [
    { label: "map", insertText: "map((item) => $1)", detail: "(callback) => Array — трансформация", kind: "method" },
    { label: "filter", insertText: "filter((item) => $1)", detail: "(predicate) => Array — фильтрация", kind: "method" },
    { label: "reduce", insertText: "reduce((acc, curr) => {\n  $1\n  return acc;\n}, $2)", detail: "(callback, init) => any — свёртка", kind: "method" },
    { label: "forEach", insertText: "forEach((item) => {\n  $1\n})", detail: "(callback) => void — итерация", kind: "method" },
    { label: "find", insertText: "find((item) => $1)", detail: "(predicate) => item — первый найденный", kind: "method" },
    { label: "findIndex", insertText: "findIndex((item) => $1)", detail: "(predicate) => number — индекс", kind: "method" },
    { label: "some", insertText: "some((item) => $1)", detail: "(predicate) => boolean — хотя бы один", kind: "method" },
    { label: "every", insertText: "every((item) => $1)", detail: "(predicate) => boolean — все элементы", kind: "method" },
    { label: "includes", insertText: "includes($1)", detail: "(value) => boolean — наличие элемента", kind: "method" },
    { label: "indexOf", insertText: "indexOf($1)", detail: "(value) => number — индекс элемента", kind: "method" },
    { label: "slice", insertText: "slice($1)", detail: "(start, end) => Array — срез массива", kind: "method" },
    { label: "splice", insertText: "splice($1, 1)", detail: "(start, deleteCount) => Array — изменение массива", kind: "method" },
    { label: "concat", insertText: "concat($1)", detail: "(...items) => Array — объединение", kind: "method" },
    { label: "join", insertText: "join('$1')", detail: "(separator) => string — объединение в строку", kind: "method" },
    { label: "flat", insertText: "flat()", detail: "(depth) => Array — выравнивание", kind: "method" },
    { label: "flatMap", insertText: "flatMap((item) => $1)", detail: "(callback) => Array — map + flat", kind: "method" },
    { label: "push", insertText: "push($1)", detail: "(...items) => number — добавление в конец", kind: "method" },
    { label: "pop", insertText: "pop()", detail: "() => item — удаление последнего", kind: "method" },
    { label: "shift", insertText: "shift()", detail: "() => item — удаление первого", kind: "method" },
    { label: "unshift", insertText: "unshift($1)", detail: "(...items) => number — добавление в начало", kind: "method" },
    { label: "sort", insertText: "sort((a, b) => $1)", detail: "(compareFn) => Array — сортировка", kind: "method" },
    { label: "reverse", insertText: "reverse()", detail: "() => Array — разворот массива", kind: "method" },
    { label: "length", insertText: "length", detail: "number — длина массива", kind: "property" },
    { label: "at", insertText: "at($1)", detail: "(index) => item — элемент по индексу", kind: "method" },
  ],
  string: [
    { label: "split", insertText: "split('$1')", detail: "(separator) => Array — разбиение строки", kind: "method" },
    { label: "slice", insertText: "slice($1)", detail: "(start, end) => string — срез строки", kind: "method" },
    { label: "substring", insertText: "substring($1)", detail: "(start, end) => string — подстрока", kind: "method" },
    { label: "trim", insertText: "trim()", detail: "() => string — удаление пробелов", kind: "method" },
    { label: "trimStart", insertText: "trimStart()", detail: "() => string — удаление пробелов в начале", kind: "method" },
    { label: "trimEnd", insertText: "trimEnd()", detail: "() => string — удаление пробелов в конце", kind: "method" },
    { label: "toLowerCase", insertText: "toLowerCase()", detail: "() => string — нижний регистр", kind: "method" },
    { label: "toUpperCase", insertText: "toUpperCase()", detail: "() => string — верхний регистр", kind: "method" },
    { label: "includes", insertText: "includes($1)", detail: "(search) => boolean — содержит подстроку", kind: "method" },
    { label: "startsWith", insertText: "startsWith($1)", detail: "(search) => boolean — начинается с", kind: "method" },
    { label: "endsWith", insertText: "endsWith($1)", detail: "(search) => boolean — заканчивается на", kind: "method" },
    { label: "replace", insertText: "replace($1, $2)", detail: "(pattern, replacer) => string — замена", kind: "method" },
    { label: "replaceAll", insertText: "replaceAll($1, $2)", detail: "(pattern, replacer) => string — замена всех", kind: "method" },
    { label: "charAt", insertText: "charAt($1)", detail: "(index) => string — символ по индексу", kind: "method" },
    { label: "charCodeAt", insertText: "charCodeAt($1)", detail: "(index) => number — код символа", kind: "method" },
    { label: "padStart", insertText: "padStart($1, '$2')", detail: "(length, pad) => string — дополнение слева", kind: "method" },
    { label: "padEnd", insertText: "padEnd($1, '$2')", detail: "(length, pad) => string — дополнение справа", kind: "method" },
    { label: "repeat", insertText: "repeat($1)", detail: "(count) => string — повторение", kind: "method" },
    { label: "match", insertText: "match($1)", detail: "(regex) => RegExpMatchArray", kind: "method" },
    { label: "length", insertText: "length", detail: "number — длина строки", kind: "property" },
  ],
  object: [
    { label: "keys", insertText: "keys($1)", detail: "Object.keys(obj) => string[] — ключи", kind: "method" },
    { label: "values", insertText: "values($1)", detail: "Object.values(obj) => any[] — значения", kind: "method" },
    { label: "entries", insertText: "entries($1)", detail: "Object.entries(obj) => [key, val][]", kind: "method" },
    { label: "assign", insertText: "assign($1, $2)", detail: "Object.assign(target, ...sources)", kind: "method" },
    { label: "fromEntries", insertText: "fromEntries($1)", detail: "Object.fromEntries(entries) => Object", kind: "method" },
    { label: "freeze", insertText: "freeze($1)", detail: "Object.freeze(obj) => Readonly", kind: "method" },
    { label: "hasOwn", insertText: "hasOwn($1, '$2')", detail: "Object.hasOwn(obj, prop) => boolean", kind: "method" },
    { label: "hasOwnProperty", insertText: "hasOwnProperty('$1')", detail: "(prop) => boolean — проверка свойства", kind: "method" },
    { label: "toString", insertText: "toString()", detail: "() => string", kind: "method" },
  ],
  event: [
    { label: "preventDefault", insertText: "preventDefault()", detail: "() => void — отмена действия", kind: "method" },
    { label: "stopPropagation", insertText: "stopPropagation()", detail: "() => void — остановка всплытия", kind: "method" },
    { label: "target", insertText: "target", detail: "HTMLElement — целевой элемент", kind: "property" },
    { label: "target.value", insertText: "target.value", detail: "string — значение поля ввода", kind: "property" },
    { label: "target.checked", insertText: "target.checked", detail: "boolean — состояние чекбокса", kind: "property" },
    { label: "target.files", insertText: "target.files", detail: "FileList — выбранные файлы", kind: "property" },
    { label: "currentTarget", insertText: "currentTarget", detail: "HTMLElement — элемент-обработчик", kind: "property" },
    { label: "key", insertText: "key", detail: "string — имя нажатой клавиши", kind: "property" },
    { label: "code", insertText: "code", detail: "string — код клавиши", kind: "property" },
    { label: "clientX", insertText: "clientX", detail: "number — координата X курсора", kind: "property" },
    { label: "clientY", insertText: "clientY", detail: "number — координата Y курсора", kind: "property" },
  ],
  target: [
    { label: "value", insertText: "value", detail: "string — значение поля ввода", kind: "property" },
    { label: "checked", insertText: "checked", detail: "boolean — состояние чекбокса", kind: "property" },
    { label: "files", insertText: "files", detail: "FileList — файлы input file", kind: "property" },
    { label: "name", insertText: "name", detail: "string — имя поля формы", kind: "property" },
    { label: "id", insertText: "id", detail: "string — id элемента", kind: "property" },
    { label: "focus", insertText: "focus()", detail: "() => void — установка фокуса", kind: "method" },
    { label: "blur", insertText: "blur()", detail: "() => void — снятие фокуса", kind: "method" },
  ],
  console: [
    { label: "log", insertText: "log($1);", detail: "(...args) => void — вывод сообщения", kind: "method" },
    { label: "warn", insertText: "warn($1);", detail: "(...args) => void — предупреждение", kind: "method" },
    { label: "error", insertText: "error($1);", detail: "(...args) => void — ошибка", kind: "method" },
    { label: "table", insertText: "table($1);", detail: "(data) => void — табличный вывод", kind: "method" },
    { label: "time", insertText: "time('$1');", detail: "(label) => void — старт таймера", kind: "method" },
    { label: "timeEnd", insertText: "timeEnd('$1');", detail: "(label) => void — стоп таймера", kind: "method" },
    { label: "clear", insertText: "clear();", detail: "() => void — очистка консоли", kind: "method" },
    { label: "group", insertText: "group('$1');", detail: "(label) => void — группировка", kind: "method" },
    { label: "groupEnd", insertText: "groupEnd();", detail: "() => void — конец группы", kind: "method" },
    { label: "count", insertText: "count('$1');", detail: "(label) => void — счетчик", kind: "method" },
  ],
  math: [
    { label: "max", insertText: "max($1)", detail: "(...values) => number — максимум", kind: "method" },
    { label: "min", insertText: "min($1)", detail: "(...values) => number — минимум", kind: "method" },
    { label: "floor", insertText: "floor($1)", detail: "(x) => number — округление вниз", kind: "method" },
    { label: "ceil", insertText: "ceil($1)", detail: "(x) => number — округление вверх", kind: "method" },
    { label: "round", insertText: "round($1)", detail: "(x) => number — округление к ближайшему", kind: "method" },
    { label: "abs", insertText: "abs($1)", detail: "(x) => number — модуль числа", kind: "method" },
    { label: "random", insertText: "random()", detail: "() => number — случайное число 0..1", kind: "method" },
    { label: "sqrt", insertText: "sqrt($1)", detail: "(x) => number — квадратный корень", kind: "method" },
    { label: "pow", insertText: "pow($1, $2)", detail: "(base, exp) => number — степень", kind: "method" },
    { label: "trunc", insertText: "trunc($1)", detail: "(x) => number — целая часть", kind: "method" },
    { label: "PI", insertText: "PI", detail: "3.141592653589793", kind: "property" },
    { label: "E", insertText: "E", detail: "2.718281828459045", kind: "property" },
  ],
  json: [
    { label: "stringify", insertText: "stringify($1, null, 2)", detail: "(val, replacer, space) => string", kind: "method" },
    { label: "parse", insertText: "parse($1)", detail: "(text) => any — парсинг JSON", kind: "method" },
  ],
  promise: [
    { label: "then", insertText: "then((res) => {\n  $1\n})", detail: "(onFulfilled) => Promise", kind: "method" },
    { label: "catch", insertText: "catch((err) => {\n  console.error(err);\n})", detail: "(onRejected) => Promise", kind: "method" },
    { label: "finally", insertText: "finally(() => {\n  $1\n})", detail: "(onFinally) => Promise", kind: "method" },
    { label: "all", insertText: "all([$1])", detail: "(promises) => Promise<any[]>", kind: "method" },
    { label: "allSettled", insertText: "allSettled([$1])", detail: "(promises) => Promise<Status[]>", kind: "method" },
    { label: "race", insertText: "race([$1])", detail: "(promises) => Promise<any>", kind: "method" },
    { label: "resolve", insertText: "resolve($1)", detail: "(val) => Promise", kind: "method" },
    { label: "reject", insertText: "reject($1)", detail: "(reason) => Promise", kind: "method" },
  ],
};

// База JSX элементов и тегов
export const JSX_ELEMENTS = [
  { name: "div", isSelfClosing: false, detail: "HTML <div> контейнер" },
  { name: "span", isSelfClosing: false, detail: "HTML <span> строчный элемент" },
  { name: "button", isSelfClosing: false, detail: "HTML <button> кнопка" },
  { name: "input", isSelfClosing: true, detail: "HTML <input /> поле ввода" },
  { name: "form", isSelfClosing: false, detail: "HTML <form> форма" },
  { name: "p", isSelfClosing: false, detail: "HTML <p> параграф текста" },
  { name: "h1", isSelfClosing: false, detail: "HTML <h1> заголовок 1 уровня" },
  { name: "h2", isSelfClosing: false, detail: "HTML <h2> заголовок 2 уровня" },
  { name: "h3", isSelfClosing: false, detail: "HTML <h3> заголовок 3 уровня" },
  { name: "h4", isSelfClosing: false, detail: "HTML <h4> заголовок 4 уровня" },
  { name: "ul", isSelfClosing: false, detail: "HTML <ul> ненумерованный список" },
  { name: "ol", isSelfClosing: false, detail: "HTML <ol> нумерованный список" },
  { name: "li", isSelfClosing: false, detail: "HTML <li> элемент списка" },
  { name: "label", isSelfClosing: false, detail: "HTML <label> подпись поля" },
  { name: "textarea", isSelfClosing: false, detail: "HTML <textarea> многострочное поле" },
  { name: "select", isSelfClosing: false, detail: "HTML <select> выпадающий список" },
  { name: "option", isSelfClosing: false, detail: "HTML <option> пункт списка" },
  { name: "a", isSelfClosing: false, detail: "HTML <a> гиперссылка" },
  { name: "img", isSelfClosing: true, detail: "HTML <img /> изображение" },
  { name: "header", isSelfClosing: false, detail: "HTML <header> шапка" },
  { name: "main", isSelfClosing: false, detail: "HTML <main> основное содержимое" },
  { name: "footer", isSelfClosing: false, detail: "HTML <footer> подвал" },
  { name: "section", isSelfClosing: false, detail: "HTML <section> секция" },
  { name: "article", isSelfClosing: false, detail: "HTML <article> статья" },
  { name: "nav", isSelfClosing: false, detail: "HTML <nav> навигация" },
  { name: "aside", isSelfClosing: false, detail: "HTML <aside> боковая панель" },
  { name: "table", isSelfClosing: false, detail: "HTML <table> таблица" },
  { name: "thead", isSelfClosing: false, detail: "HTML <thead> заголовок таблицы" },
  { name: "tbody", isSelfClosing: false, detail: "HTML <tbody> тело таблицы" },
  { name: "tr", isSelfClosing: false, detail: "HTML <tr> строка таблицы" },
  { name: "th", isSelfClosing: false, detail: "HTML <th> ячейка-заголовок" },
  { name: "td", isSelfClosing: false, detail: "HTML <td> ячейка таблицы" },
  { name: "svg", isSelfClosing: false, detail: "HTML <svg> векторная графика" },
  { name: "path", isSelfClosing: true, detail: "SVG <path /> путь" },
  { name: "hr", isSelfClosing: true, detail: "HTML <hr /> линия" },
  { name: "br", isSelfClosing: true, detail: "HTML <br /> перенос строки" },
  { name: "Fragment", isSelfClosing: false, detail: "React <Fragment> фрагмент" },
  { name: "Suspense", isSelfClosing: false, detail: "React <Suspense> ленивая загрузка" },
  { name: "StrictMode", isSelfClosing: false, detail: "React <StrictMode> строгий режим" },
  { name: "Link", isSelfClosing: false, detail: "Router <Link to='...'> ссылка" },
  { name: "Outlet", isSelfClosing: true, detail: "Router <Outlet /> дочерний маршрут" },
  { name: "Provider", isSelfClosing: false, detail: "Redux <Provider store={...}>" },
];

// База React JSX пропсов и обработчиков
export const REACT_JSX_PROPS = {
  common: [
    { label: "className", insertText: 'className=""', detail: "CSS класс(ы)", kind: "property" },
    { label: "style", insertText: "style={{}}", detail: "Инлайн стили React", kind: "property" },
    { label: "id", insertText: 'id=""', detail: "Уникальный ID элемента", kind: "property" },
    { label: "key", insertText: "key={}", detail: "Уникальный React key", kind: "property" },
    { label: "ref", insertText: "ref={}", detail: "Ссылка на DOM узел (useRef)", kind: "property" },
    { label: "title", insertText: 'title=""', detail: "Всплывающая подсказка", kind: "property" },
    { label: "children", insertText: "children={}", detail: "Дочерние элементы", kind: "property" },
    { label: "aria-label", insertText: 'aria-label=""', detail: "ARIA метка доступности", kind: "property" },
    { label: "role", insertText: 'role=""', detail: "ARIA роль элемента", kind: "property" },
    { label: "tabIndex", insertText: "tabIndex={}", detail: "Порядок фокуса (Tab)", kind: "property" },
    { label: "hidden", insertText: "hidden", detail: "Скрытие элемента", kind: "property" },
  ],
  events: [
    { label: "onClick", insertText: "onClick={}", detail: "(e) => void — клик мыши", kind: "method" },
    { label: "onChange", insertText: "onChange={}", detail: "(e) => void — изменение значения", kind: "method" },
    { label: "onSubmit", insertText: "onSubmit={}", detail: "(e) => void — отправка формы", kind: "method" },
    { label: "onKeyDown", insertText: "onKeyDown={}", detail: "(e) => void — нажатие клавиши", kind: "method" },
    { label: "onKeyUp", insertText: "onKeyUp={}", detail: "(e) => void — отпускание клавиши", kind: "method" },
    { label: "onFocus", insertText: "onFocus={}", detail: "(e) => void — получение фокуса", kind: "method" },
    { label: "onBlur", insertText: "onBlur={}", detail: "(e) => void — потеря фокуса", kind: "method" },
    { label: "onMouseEnter", insertText: "onMouseEnter={}", detail: "(e) => void — наведение курсора", kind: "method" },
    { label: "onMouseLeave", insertText: "onMouseLeave={}", detail: "(e) => void — уход курсора", kind: "method" },
    { label: "onMouseDown", insertText: "onMouseDown={}", detail: "(e) => void — нажатие кнопки мыши", kind: "method" },
    { label: "onMouseUp", insertText: "onMouseUp={}", detail: "(e) => void — отпускание кнопки", kind: "method" },
    { label: "onScroll", insertText: "onScroll={}", detail: "(e) => void — скролл элемента", kind: "method" },
  ],
  input: [
    { label: "type", insertText: 'type=""', detail: "text | number | checkbox | radio | password | email", kind: "property" },
    { label: "value", insertText: "value={}", detail: "Контролируемое значение поля", kind: "property" },
    { label: "defaultValue", insertText: 'defaultValue=""', detail: "Начальное значение поля", kind: "property" },
    { label: "placeholder", insertText: 'placeholder=""', detail: "Текст подсказки в поле", kind: "property" },
    { label: "disabled", insertText: "disabled", detail: "Отключение поля ввода", kind: "property" },
    { label: "checked", insertText: "checked={}", detail: "Состояние чекбокса / радио", kind: "property" },
    { label: "defaultChecked", insertText: "defaultChecked={}", detail: "Начальное состояние чекбокса", kind: "property" },
    { label: "name", insertText: 'name=""', detail: "Имя поля для форм", kind: "property" },
    { label: "required", insertText: "required", detail: "Обязательное поле", kind: "property" },
    { label: "autoFocus", insertText: "autoFocus", detail: "Автофокус при монтировании", kind: "property" },
    { label: "readOnly", insertText: "readOnly", detail: "Только для чтения", kind: "property" },
    { label: "autoComplete", insertText: 'autoComplete="off"', detail: "Автозаполнение браузера", kind: "property" },
    { label: "min", insertText: 'min=""', detail: "Минимальное значение", kind: "property" },
    { label: "max", insertText: 'max=""', detail: "Максимальное значение", kind: "property" },
    { label: "step", insertText: 'step=""', detail: "Шаг изменения числа", kind: "property" },
    { label: "maxLength", insertText: "maxLength={}", detail: "Макс. длина текста", kind: "property" },
  ],
  button: [
    { label: "type", insertText: 'type="button"', detail: "button | submit | reset", kind: "property" },
    { label: "disabled", insertText: "disabled={}", detail: "Отключение кнопки", kind: "property" },
    { label: "autoFocus", insertText: "autoFocus", detail: "Автофокус при монтировании", kind: "property" },
  ],
  form: [
    { label: "action", insertText: 'action=""', detail: "URL обработчика формы", kind: "property" },
    { label: "method", insertText: 'method="POST"', detail: "GET | POST", kind: "property" },
    { label: "noValidate", insertText: "noValidate", detail: "Отключение HTML5 валидации", kind: "property" },
  ],
  link: [
    { label: "to", insertText: 'to=""', detail: "Маршрут перехода", kind: "property" },
    { label: "params", insertText: "params={{}}", detail: "Параметры маршрута", kind: "property" },
    { label: "search", insertText: "search={{}}", detail: "Поисковые параметры URL", kind: "property" },
  ],
  a: [
    { label: "href", insertText: 'href=""', detail: "URL адрес ссылки", kind: "property" },
    { label: "target", insertText: 'target="_blank"', detail: "_blank | _self | _parent | _top", kind: "property" },
    { label: "rel", insertText: 'rel="noopener noreferrer"', detail: "Безопасность внешних ссылок", kind: "property" },
  ],
  img: [
    { label: "src", insertText: 'src=""', detail: "Путь к изображению", kind: "property" },
    { label: "alt", insertText: 'alt=""', detail: "Альтернативный текст", kind: "property" },
    { label: "width", insertText: "width={}", detail: "Ширина изображения", kind: "property" },
    { label: "height", insertText: "height={}", detail: "Высота изображения", kind: "property" },
    { label: "loading", insertText: 'loading="lazy"', detail: "lazy | eager", kind: "property" },
  ],
};

// База CSS свойств в стиле React camelCase для style={{ ... }}
export const REACT_CSS_PROPERTIES = [
  // Layout & Flexbox
  { label: "display", insertText: "display: '',", detail: "'flex' | 'grid' | 'block' | 'inline-block' | 'none'", kind: "property" },
  { label: "flexDirection", insertText: "flexDirection: '',", detail: "'row' | 'column' | 'row-reverse' | 'column-reverse'", kind: "property" },
  { label: "justifyContent", insertText: "justifyContent: '',", detail: "'center' | 'space-between' | 'flex-start' | 'flex-end' | 'space-around'", kind: "property" },
  { label: "alignItems", insertText: "alignItems: '',", detail: "'center' | 'flex-start' | 'flex-end' | 'stretch' | 'baseline'", kind: "property" },
  { label: "alignSelf", insertText: "alignSelf: '',", detail: "'auto' | 'center' | 'flex-start' | 'flex-end' | 'stretch'", kind: "property" },
  { label: "flexWrap", insertText: "flexWrap: '',", detail: "'wrap' | 'nowrap' | 'wrap-reverse'", kind: "property" },
  { label: "flex", insertText: "flex: 1,", detail: "1 | '1 1 auto' | '0 0 auto'", kind: "property" },
  { label: "gap", insertText: "gap: '',", detail: "Расстояние между flex/grid элементами ('12px')", kind: "property" },
  { label: "rowGap", insertText: "rowGap: '',", detail: "Расстояние между строками ('8px')", kind: "property" },
  { label: "columnGap", insertText: "columnGap: '',", detail: "Расстояние между колонками ('8px')", kind: "property" },

  // Grid
  { label: "gridTemplateColumns", insertText: "gridTemplateColumns: '',", detail: "'repeat(auto-fit, minmax(200px, 1fr))' | '1fr 1fr'", kind: "property" },
  { label: "gridTemplateRows", insertText: "gridTemplateRows: '',", detail: "Шаблон строк grid", kind: "property" },
  { label: "gridColumn", insertText: "gridColumn: '',", detail: "'span 2' | '1 / 3'", kind: "property" },

  // Box Model & Spacing
  { label: "padding", insertText: "padding: '',", detail: "Внутренний отступ ('8px 16px')", kind: "property" },
  { label: "paddingTop", insertText: "paddingTop: '',", detail: "Отступ сверху", kind: "property" },
  { label: "paddingRight", insertText: "paddingRight: '',", detail: "Отступ справа", kind: "property" },
  { label: "paddingBottom", insertText: "paddingBottom: '',", detail: "Отступ снизу", kind: "property" },
  { label: "paddingLeft", insertText: "paddingLeft: '',", detail: "Отступ слева", kind: "property" },
  { label: "margin", insertText: "margin: '',", detail: "Внешний отступ ('0 auto', '16px')", kind: "property" },
  { label: "marginTop", insertText: "marginTop: '',", detail: "Внешний отступ сверху", kind: "property" },
  { label: "marginRight", insertText: "marginRight: '',", detail: "Внешний отступ справа", kind: "property" },
  { label: "marginBottom", insertText: "marginBottom: '',", detail: "Внешний отступ снизу", kind: "property" },
  { label: "marginLeft", insertText: "marginLeft: '',", detail: "Внешний отступ слева", kind: "property" },
  { label: "width", insertText: "width: '',", detail: "Ширина ('100%', '300px', 'auto')", kind: "property" },
  { label: "height", insertText: "height: '',", detail: "Высота ('100vh', '40px')", kind: "property" },
  { label: "minWidth", insertText: "minWidth: '',", detail: "Мин. ширина", kind: "property" },
  { label: "maxWidth", insertText: "maxWidth: '',", detail: "Макс. ширина", kind: "property" },
  { label: "minHeight", insertText: "minHeight: '',", detail: "Мин. высота", kind: "property" },
  { label: "maxHeight", insertText: "maxHeight: '',", detail: "Макс. высота", kind: "property" },

  // Typography & Colors
  { label: "color", insertText: "color: '',", detail: "Цвет текста ('#ffffff', 'currentColor')", kind: "property" },
  { label: "backgroundColor", insertText: "backgroundColor: '',", detail: "Цвет фона ('#1e293b')", kind: "property" },
  { label: "fontSize", insertText: "fontSize: '',", detail: "Размер шрифта ('14px', '1.25rem')", kind: "property" },
  { label: "fontWeight", insertText: "fontWeight: '',", detail: "'normal' | 'bold' | 500 | 600 | 700", kind: "property" },
  { label: "lineHeight", insertText: "lineHeight: 1.5,", detail: "Высота строки (1.5, '24px')", kind: "property" },
  { label: "textAlign", insertText: "textAlign: '',", detail: "'center' | 'left' | 'right' | 'justify'", kind: "property" },
  { label: "textDecoration", insertText: "textDecoration: '',", detail: "'none' | 'underline' | 'line-through'", kind: "property" },
  { label: "textTransform", insertText: "textTransform: '',", detail: "'uppercase' | 'lowercase' | 'capitalize'", kind: "property" },
  { label: "letterSpacing", insertText: "letterSpacing: '',", detail: "Межбуквенный интервал ('0.5px')", kind: "property" },

  // Borders & Radii
  { label: "border", insertText: "border: '',", detail: "Рамка ('1px solid #ccc')", kind: "property" },
  { label: "borderRadius", insertText: "borderRadius: '',", detail: "Скругление углов ('8px', '50%')", kind: "property" },
  { label: "borderWidth", insertText: "borderWidth: '',", detail: "Толщина рамки", kind: "property" },
  { label: "borderColor", insertText: "borderColor: '',", detail: "Цвет рамки", kind: "property" },
  { label: "outline", insertText: "outline: 'none',", detail: "Внешний контур", kind: "property" },

  // Positioning & Display
  { label: "position", insertText: "position: '',", detail: "'relative' | 'absolute' | 'fixed' | 'sticky' | 'static'", kind: "property" },
  { label: "top", insertText: "top: 0,", detail: "Позиция сверху (0, '10px')", kind: "property" },
  { label: "right", insertText: "right: 0,", detail: "Позиция справа (0, '10px')", kind: "property" },
  { label: "bottom", insertText: "bottom: 0,", detail: "Позиция снизу (0, '10px')", kind: "property" },
  { label: "left", insertText: "left: 0,", detail: "Позиция слева (0, '10px')", kind: "property" },
  { label: "zIndex", insertText: "zIndex: 10,", detail: "Порядок наложения по оси Z (10, 1000)", kind: "property" },

  // Effects & Transitions
  { label: "opacity", insertText: "opacity: 0.8,", detail: "Прозрачность от 0 до 1", kind: "property" },
  { label: "cursor", insertText: "cursor: '',", detail: "'pointer' | 'default' | 'not-allowed' | 'grab'", kind: "property" },
  { label: "overflow", insertText: "overflow: '',", detail: "'hidden' | 'auto' | 'scroll' | 'visible'", kind: "property" },
  { label: "boxShadow", insertText: "boxShadow: '',", detail: "Тень блока ('0 4px 6px -1px rgba(0,0,0,0.1)')", kind: "property" },
  { label: "transition", insertText: "transition: 'all 0.2s ease',", detail: "Плавный переход", kind: "property" },
  { label: "transform", insertText: "transform: '',", detail: "Трансформация ('scale(1.05)', 'translateY(-2px)')", kind: "property" },
  { label: "userSelect", insertText: "userSelect: 'none',", detail: "'none' | 'text' | 'all'", kind: "property" },
];

// База TypeScript Utility Types & React Types
export const TS_UTILITY_TYPES = [
  { name: "Partial", label: "Partial<T>", insertText: "Partial<$1>", detail: "Делает все свойства T необязательными", kind: "type" },
  { name: "Required", label: "Required<T>", insertText: "Required<$1>", detail: "Делает все свойства T обязательными", kind: "type" },
  { name: "Readonly", label: "Readonly<T>", insertText: "Readonly<$1>", detail: "Делает все свойства T неизменяемыми", kind: "type" },
  { name: "Record", label: "Record<K, T>", insertText: "Record<$1, $2>", detail: "Создает тип объекта с ключами K и значениями T", kind: "type" },
  { name: "Pick", label: "Pick<T, K>", insertText: "Pick<$1, '$2'>", detail: "Выбирает указанные свойства K из типа T", kind: "type" },
  { name: "Omit", label: "Omit<T, K>", insertText: "Omit<$1, '$2'>", detail: "Исключает указанные свойства K из типа T", kind: "type" },
  { name: "Exclude", label: "Exclude<T, U>", insertText: "Exclude<$1, $2>", detail: "Исключает из T типы, совместимые с U", kind: "type" },
  { name: "Extract", label: "Extract<T, U>", insertText: "Extract<$1, $2>", detail: "Извлекает из T типы, совместимые с U", kind: "type" },
  { name: "NonNullable", label: "NonNullable<T>", insertText: "NonNullable<$1>", detail: "Исключает null и undefined из типа T", kind: "type" },
  { name: "ReturnType", label: "ReturnType<T>", insertText: "ReturnType<$1>", detail: "Получает тип возвращаемого значения функции T", kind: "type" },
  { name: "Parameters", label: "Parameters<T>", insertText: "Parameters<$1>", detail: "Получает кортеж параметров функции T", kind: "type" },
  { name: "Awaited", label: "Awaited<T>", insertText: "Awaited<$1>", detail: "Разворачивает тип Promise<T>", kind: "type" },
  { name: "Promise", label: "Promise<T>", insertText: "Promise<$1>", detail: "Тип асинхронного промиса", kind: "type" },

  // React TypeScript Types
  { name: "FC", label: "FC<Props>", insertText: "FC<$1>", detail: "React.FC — функциональный компонент", kind: "type", autoImport: { symbol: "FC", module: "react" } },
  { name: "ReactNode", label: "ReactNode", insertText: "ReactNode", detail: "Любой валидный React узел/рендер", kind: "type", autoImport: { symbol: "ReactNode", module: "react" } },
  { name: "ReactElement", label: "ReactElement", insertText: "ReactElement", detail: "React JSX элемент", kind: "type", autoImport: { symbol: "ReactElement", module: "react" } },
  { name: "CSSProperties", label: "CSSProperties", insertText: "CSSProperties", detail: "Тип для инлайн стилей React", kind: "type", autoImport: { symbol: "CSSProperties", module: "react" } },
  { name: "ChangeEvent", label: "ChangeEvent<T>", insertText: "ChangeEvent<HTML$1Element>", detail: "Событие изменения формы", kind: "type", autoImport: { symbol: "ChangeEvent", module: "react" } },
  { name: "MouseEvent", label: "MouseEvent<T>", insertText: "MouseEvent<HTML$1Element>", detail: "Событие мыши в React", kind: "type", autoImport: { symbol: "MouseEvent", module: "react" } },
  { name: "KeyboardEvent", label: "KeyboardEvent<T>", insertText: "KeyboardEvent<HTML$1Element>", detail: "Событие клавиатуры в React", kind: "type", autoImport: { symbol: "KeyboardEvent", module: "react" } },
  { name: "FormEvent", label: "FormEvent<T>", insertText: "FormEvent<HTMLFormElement>", detail: "Событие отправки формы", kind: "type", autoImport: { symbol: "FormEvent", module: "react" } },
  { name: "PropsWithChildren", label: "PropsWithChildren<P>", insertText: "PropsWithChildren<$1>", detail: "Добавляет свойство children к пропсам", kind: "type", autoImport: { symbol: "PropsWithChildren", module: "react" } },
  { name: "Dispatch", label: "Dispatch<SetStateAction<T>>", insertText: "Dispatch<SetStateAction<$1>>", detail: "Тип функции-сеттера useState", kind: "type", autoImport: { symbol: "Dispatch", module: "react" } },
];

export const JS_SNIPPETS = [
  // Импорты
  {
    prefix: "imp",
    label: "imp → import default from '...'",
    detail: "Импорт модуля по умолчанию",
    kind: "snippet",
    body: "import $1 from '$2';",
    cursorOffset: 7,
  },
  {
    prefix: "impr",
    label: "impr → import React from 'react'",
    detail: "Импорт React",
    kind: "snippet",
    body: "import React from 'react';",
    cursorOffset: 26,
  },
  {
    prefix: "impreact",
    label: "impreact → import React from 'react'",
    detail: "Импорт React",
    kind: "snippet",
    body: "import React from 'react';",
    cursorOffset: 26,
  },
  {
    prefix: "imph",
    label: "imph → import { useState, useEffect } from 'react'",
    detail: "Импорт базовых React хуков",
    kind: "snippet",
    body: "import { useState, useEffect } from 'react';",
    cursorOffset: 43,
  },
  {
    prefix: "imprh",
    label: "imprh → import { useState, useEffect } from 'react'",
    detail: "Импорт базовых React хуков",
    kind: "snippet",
    body: "import { useState, useEffect } from 'react';",
    cursorOffset: 43,
  },
  {
    prefix: "impn",
    label: "impn → import { named } from '...'",
    detail: "Именованный импорт",
    kind: "snippet",
    body: "import { $1 } from '$2';",
    cursorOffset: 9,
  },
  {
    prefix: "impt",
    label: "impt → import type { ... } from '...'",
    detail: "Импорт типов TypeScript",
    kind: "snippet",
    body: "import type { $1 } from '$2';",
    cursorOffset: 14,
  },
  {
    prefix: "impa",
    label: "impa → import * as name from '...'",
    detail: "Импорт всего пространства имен",
    kind: "snippet",
    body: "import * as $1 from '$2';",
    cursorOffset: 12,
  },
  {
    prefix: "imprtk",
    label: "imprtk → import { createSlice } from '@reduxjs/toolkit'",
    detail: "Импорт Redux Toolkit",
    kind: "snippet",
    body: "import { createSlice } from '@reduxjs/toolkit';",
    cursorOffset: 46,
  },
  {
    prefix: "imprr",
    label: "imprr → import { useSelector, useDispatch } from 'react-redux'",
    detail: "Импорт хуков React Redux",
    kind: "snippet",
    body: "import { useSelector, useDispatch } from 'react-redux';",
    cursorOffset: 54,
  },
  {
    prefix: "improuter",
    label: "improuter → import { Link, useNavigate } from '@tanstack/react-router'",
    detail: "Импорт TanStack Router",
    kind: "snippet",
    body: "import { Link, useNavigate } from '@tanstack/react-router';",
    cursorOffset: 57,
  },

  // React функциональные компоненты
  {
    prefix: "rfc",
    label: "rfc → React Functional Component",
    detail: "export default function Component() { ... }",
    kind: "snippet",
    body: (compName) =>
      `export default function ${compName}() {\n  return (\n    <div>\n      \n    </div>\n  );\n}`,
  },
  {
    prefix: "rafce",
    label: "rafce → React Arrow Function Component",
    detail: "export const Component = () => { ... }",
    kind: "snippet",
    body: (compName) =>
      `export const ${compName} = () => {\n  return (\n    <div>\n      \n    </div>\n  );\n};\n\nexport default ${compName};`,
  },

  // React Хуки с умными дефолтами
  {
    prefix: "usestate",
    label: "useState → const [state, setState] = useState(null)",
    detail: "React Hook useState",
    kind: "snippet",
    body: "const [state, setState] = useState(null);",
    cursorOffset: 34,
  },
  {
    prefix: "useeffect",
    label: "useEffect → useEffect(() => { ... }, [])",
    detail: "React Hook useEffect",
    kind: "snippet",
    body: "useEffect(() => {\n  \n}, []);",
    cursorOffset: 16,
  },
  {
    prefix: "useref",
    label: "useRef → const inputRef = useRef(null)",
    detail: "React Hook useRef",
    kind: "snippet",
    body: "const inputRef = useRef(null);",
    cursorOffset: 6,
  },
  {
    prefix: "usememo",
    label: "useMemo → useMemo(() => value, [deps])",
    detail: "React Hook useMemo",
    kind: "snippet",
    body: "const memoizedValue = useMemo(() => {\n  return null;\n}, []);",
    cursorOffset: 6,
  },
  {
    prefix: "usecallback",
    label: "useCallback → useCallback((args) => { ... }, [deps])",
    detail: "React Hook useCallback",
    kind: "snippet",
    body: "const handleClick = useCallback(() => {\n  \n}, []);",
    cursorOffset: 6,
  },
  {
    prefix: "usecontext",
    label: "useContext → useContext(MyContext)",
    detail: "React Hook useContext",
    kind: "snippet",
    body: "const context = useContext(MyContext);",
    cursorOffset: 27,
  },
  {
    prefix: "usereducer",
    label: "useReducer → const [state, dispatch] = useReducer(...)",
    detail: "React Hook useReducer",
    kind: "snippet",
    body: "const [state, dispatch] = useReducer(reducer, initialState);",
    cursorOffset: 37,
  },

  // Консоль и логи
  {
    prefix: "clg",
    label: "clg → console.log()",
    detail: "Вывод в консоль",
    kind: "snippet",
    body: "console.log();",
    cursorOffset: 12,
  },
  {
    prefix: "clo",
    label: "clo → console.log('val: ', val)",
    detail: "Вывод переменной с меткой",
    kind: "snippet",
    body: "console.log('val: ', val);",
    cursorOffset: 13,
  },
  {
    prefix: "log",
    label: "log → console.log()",
    detail: "Вывод в консоль",
    kind: "snippet",
    body: "console.log();",
    cursorOffset: 12,
  },
  {
    prefix: "warn",
    label: "warn → console.warn()",
    detail: "Предупреждение в консоли",
    kind: "snippet",
    body: "console.warn();",
    cursorOffset: 13,
  },
  {
    prefix: "err",
    label: "err → console.error()",
    detail: "Ошибка в консоли",
    kind: "snippet",
    body: "console.error();",
    cursorOffset: 14,
  },
  {
    prefix: "fn",
    label: "fn → Стрелочная функция",
    detail: "const handler = () => {}",
    kind: "snippet",
    body: "const handler = () => {\n  \n};",
    cursorOffset: 6,
  },
  {
    prefix: "afn",
    label: "afn → Асинхронная стрелочная функция",
    detail: "const fetchData = async () => {}",
    kind: "snippet",
    body: "const fetchData = async () => {\n  \n};",
    cursorOffset: 6,
  },
  {
    prefix: "fnd",
    label: "fnd → Function declaration",
    detail: "function handler() {}",
    kind: "snippet",
    body: "function handler() {\n  \n}",
    cursorOffset: 9,
  },
  {
    prefix: "for",
    label: "for → Цикл for(let i...)",
    detail: "Классический цикл for",
    kind: "snippet",
    body: "for (let i = 0; i < items.length; i++) {\n  \n}",
    cursorOffset: 20,
  },
  {
    prefix: "forof",
    label: "forof → Цикл for...of",
    detail: "Итерация по элементам",
    kind: "snippet",
    body: "for (const item of items) {\n  \n}",
    cursorOffset: 19,
  },
  {
    prefix: "forin",
    label: "forin → Цикл for...in",
    detail: "Итерация по ключам объекта",
    kind: "snippet",
    body: "for (const key in object) {\n  \n}",
    cursorOffset: 18,
  },
  {
    prefix: "ife",
    label: "ife → if...else",
    detail: "Условная конструкция",
    kind: "snippet",
    body: "if (condition) {\n  \n} else {\n  \n}",
    cursorOffset: 4,
  },
  {
    prefix: "if",
    label: "if → if() {}",
    detail: "Условный оператор",
    kind: "snippet",
    body: "if (condition) {\n  \n}",
    cursorOffset: 4,
  },
  {
    prefix: "tern",
    label: "tern → Тернарный оператор",
    detail: "cond ? a : b",
    kind: "snippet",
    body: "condition ? a : b",
    cursorOffset: 0,
  },
  {
    prefix: "try",
    label: "try → try...catch",
    detail: "Обработка исключений",
    kind: "snippet",
    body: "try {\n  \n} catch (error) {\n  console.error(error);\n}",
    cursorOffset: 8,
  },
  {
    prefix: "prom",
    label: "prom → new Promise",
    detail: "Создание промиса",
    kind: "snippet",
    body: "new Promise((resolve, reject) => {\n  \n});",
    cursorOffset: 37,
  },
  {
    prefix: "map",
    label: "map → Array.map()",
    detail: "Трансформация массива",
    kind: "snippet",
    body: "items.map((item) => item)",
    cursorOffset: 0,
  },
  {
    prefix: "filter",
    label: "filter → Array.filter()",
    detail: "Фильтрация массива",
    kind: "snippet",
    body: "items.filter((item) => item)",
    cursorOffset: 0,
  },
  {
    prefix: "reduce",
    label: "reduce → Array.reduce()",
    detail: "Свёртка массива",
    kind: "snippet",
    body: "items.reduce((acc, curr) => {\n  \n  return acc;\n}, initialValue)",
    cursorOffset: 0,
  },
  {
    prefix: "sto",
    label: "sto → setTimeout",
    detail: "Отложенный вызов",
    kind: "snippet",
    body: "setTimeout(() => {\n  \n}, 1000);",
    cursorOffset: 21,
  },
  {
    prefix: "sti",
    label: "sti → setInterval",
    detail: "Периодический вызов",
    kind: "snippet",
    body: "setInterval(() => {\n  \n}, 1000);",
    cursorOffset: 22,
  },
  {
    prefix: "ret",
    label: "ret → return",
    detail: "Возврат значения",
    kind: "snippet",
    body: "return null;",
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
  "type",
  "interface",
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
  "useDebugValue",
  "useSyncExternalStore",
  "useInsertionEffect",
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

import { checkAutoCloseTag, isTypeScriptGenericContext } from "./tagEngine.js";
export { checkAutoCloseTag, isTypeScriptGenericContext };

/**
 * Извлечение информации об экспортированных символах из других файлов задачи (многофайловый режим)
 */
export const getTaskFilesExports = (files = [], currentFilepath = "") => {
  const exportsMap = {};
  if (!Array.isArray(files)) return exportsMap;

  for (const file of files) {
    if (!file || !file.code || file.name === currentFilepath || file.filepath === currentFilepath) {
      continue;
    }
    const cleanName = (file.name || file.filepath || "").replace(/\.[^/.]+$/, "");
    const relativePath = `./${cleanName}`;

    const defaultMatch = file.code.match(/export\s+default\s+(?:function\s+|class\s+|const\s+)?([a-zA-Z0-9_$]+)/);
    if (defaultMatch) {
      exportsMap[defaultMatch[1]] = {
        module: relativePath,
        isDefault: true,
        filename: file.name,
      };
    }

    const namedRegex = /export\s+(?:const|let|var|function|class|interface|type|enum)\s+([a-zA-Z0-9_$]+)/g;
    let nMatch;
    while ((nMatch = namedRegex.exec(file.code)) !== null) {
      exportsMap[nMatch[1]] = {
        module: relativePath,
        isDefault: false,
        filename: file.name,
      };
    }
  }

  return exportsMap;
};

/**
 * Определение модуля для символа (из базы известных библиотек или файлов задачи)
 */
export const resolveModuleForSymbol = (symbolName, taskFiles = [], currentFilepath = "") => {
  if (!symbolName) return null;
  const cleanSym = symbolName.trim();

  if (SYMBOL_TO_MODULE_MAP[cleanSym]) {
    return SYMBOL_TO_MODULE_MAP[cleanSym];
  }

  const filesExports = getTaskFilesExports(taskFiles, currentFilepath);
  if (filesExports[cleanSym]) {
    return filesExports[cleanSym];
  }

  return null;
};

/**
 * Автоматическое расширение незавершенной строки импорта по клавише Tab
 */
export const expandImportStatement = (lineText, taskFiles = [], currentFilepath = "") => {
  if (!lineText || typeof lineText !== "string") return null;
  const trimmed = lineText.trim();

  if (!trimmed.startsWith("import")) return null;

  if (/from\s+['"][^'"]+['"];?\s*$/.test(trimmed)) {
    return null;
  }

  // 1. Кейс: `import { ... }` или `import { ...` (именованный импорт)
  const namedMatch = trimmed.match(/^import\s+(type\s+)?\{\s*([^}]+?)\s*\}?\s*$/);
  if (namedMatch) {
    const isType = Boolean(namedMatch[1]);
    const rawSymbols = namedMatch[2].split(",").map((s) => s.trim()).filter(Boolean);
    if (rawSymbols.length === 0) return null;

    let targetModule = null;
    for (const sym of rawSymbols) {
      const resolved = resolveModuleForSymbol(sym, taskFiles, currentFilepath);
      if (resolved) {
        targetModule = resolved.module;
        break;
      }
    }

    if (!targetModule) {
      targetModule = "react";
    }

    const formattedSymbols = rawSymbols.join(", ");
    const typePrefix = isType ? "type " : "";
    return `import ${typePrefix}{ ${formattedSymbols} } from '${targetModule}';`;
  }

  // 2. Кейс: `import React, { ... }` или `import React, { ...`
  const defaultAndNamedMatch = trimmed.match(/^import\s+([a-zA-Z0-9_$]+)\s*,\s*\{\s*([^}]+?)\s*\}?\s*$/);
  if (defaultAndNamedMatch) {
    const defaultSym = defaultAndNamedMatch[1];
    const rawSymbols = defaultAndNamedMatch[2].split(",").map((s) => s.trim()).filter(Boolean);
    const resolved = resolveModuleForSymbol(defaultSym, taskFiles, currentFilepath);
    const targetModule = resolved ? resolved.module : "react";
    const formattedSymbols = rawSymbols.join(", ");
    return `import ${defaultSym}, { ${formattedSymbols} } from '${targetModule}';`;
  }

  // 3. Кейс: `import Identifier` (импорт по умолчанию: React, ReactDOM, DOMPurify, etc.)
  const defaultMatch = trimmed.match(/^import\s+([a-zA-Z0-9_$]+)\s*$/);
  if (defaultMatch) {
    const defaultSym = defaultMatch[1];
    const resolved = resolveModuleForSymbol(defaultSym, taskFiles, currentFilepath);
    const targetModule = resolved ? resolved.module : defaultSym === "React" ? "react" : `./${defaultSym}`;
    return `import ${defaultSym} from '${targetModule}';`;
  }

  return null;
};

/**
 * Умное добавление или слияние импорта в заголовок файла (Auto-Import)
 */
export const addImportToFile = (code, symbolName, moduleSpecifier = "react", isDefault = false) => {
  if (!code && code !== "") return { newCode: code, insertedLength: 0, insertIndex: 0 };
  const cleanSym = symbolName.trim();
  if (!cleanSym) return { newCode: code, insertedLength: 0, insertIndex: 0 };

  const alreadyImportedRegex = new RegExp(`\\bimport\\s+[^;]*?\\b${cleanSym}\\b[^;]*?;?`, "m");
  if (alreadyImportedRegex.test(code)) {
    return { newCode: code, insertedLength: 0, insertIndex: 0 };
  }

  const escapedMod = moduleSpecifier.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const moduleImportRegex = new RegExp(
    `^(import\\s+(?:type\\s+)?(?:([a-zA-Z0-9_$]+)\\s*,?\\s*)?(?:\\{\\s*([^}]*?)\\s*\\})?\\s+from\\s+['"]${escapedMod}['"];?)`,
    "m"
  );
  const match = code.match(moduleImportRegex);

  if (match) {
    const fullImportLine = match[1];
    const existingDefault = match[2];
    const existingNamed = match[3];
    let newImportLine = fullImportLine;

    if (isDefault) {
      if (!existingDefault) {
        if (existingNamed) {
          newImportLine = `import ${cleanSym}, { ${existingNamed} } from '${moduleSpecifier}';`;
        } else {
          newImportLine = `import ${cleanSym} from '${moduleSpecifier}';`;
        }
      }
    } else {
      if (existingNamed) {
        const namedList = existingNamed.split(",").map((s) => s.trim()).filter(Boolean);
        if (!namedList.includes(cleanSym)) {
          namedList.push(cleanSym);
          const formatted = namedList.join(", ");
          if (existingDefault) {
            newImportLine = `import ${existingDefault}, { ${formatted} } from '${moduleSpecifier}';`;
          } else {
            newImportLine = `import { ${formatted} } from '${moduleSpecifier}';`;
          }
        }
      } else if (existingDefault) {
        newImportLine = `import ${existingDefault}, { ${cleanSym} } from '${moduleSpecifier}';`;
      }
    }

    if (newImportLine !== fullImportLine) {
      const newCode = code.replace(fullImportLine, newImportLine);
      const diff = newImportLine.length - fullImportLine.length;
      return { newCode, insertedLength: diff, insertIndex: match.index };
    }

    return { newCode: code, insertedLength: 0, insertIndex: 0 };
  }

  const statement = isDefault
    ? `import ${cleanSym} from '${moduleSpecifier}';\n`
    : `import { ${cleanSym} } from '${moduleSpecifier}';\n`;

  const lines = code.split("\n");
  let lastImportLineIdx = -1;

  for (let i = 0; i < lines.length; i++) {
    if (/^\s*import\b/.test(lines[i])) {
      lastImportLineIdx = i;
    }
  }

  if (lastImportLineIdx !== -1) {
    lines.splice(lastImportLineIdx + 1, 0, statement.trim());
    const newCode = lines.join("\n");
    return { newCode, insertedLength: statement.length, insertIndex: 0 };
  }

  let insertLineIdx = 0;
  while (
    insertLineIdx < lines.length &&
    (lines[insertLineIdx].trim().startsWith("//") ||
      lines[insertLineIdx].trim().startsWith("/*") ||
      lines[insertLineIdx].trim().startsWith("*"))
  ) {
    insertLineIdx++;
  }

  lines.splice(insertLineIdx, 0, statement.trim());
  const newCode = lines.join("\n");
  return { newCode, insertedLength: statement.length, insertIndex: 0 };
};

/**
 * Извлекает слово (идентификатор) под указанной позицией курсора
 */
export const getWordAtPosition = (text, position) => {
  if (!text || typeof text !== "string" || position < 0 || position > text.length) return "";
  let start = position;
  let end = position;

  // Если курсор стоит сразу после слова, смещаемся на 1 символ назад
  if (start > 0 && !/[a-zA-Z0-9_$]/.test(text[start]) && /[a-zA-Z0-9_$]/.test(text[start - 1])) {
    start--;
    end--;
  }

  while (start > 0 && /[a-zA-Z0-9_$]/.test(text[start - 1])) {
    start--;
  }
  while (end < text.length && /[a-zA-Z0-9_$]/.test(text[end])) {
    end++;
  }
  return text.substring(start, end);
};

/**
 * Ищет определение символа (переменная, функция, тип в текущем файле или экспорт в других файлах задачи)
 * @param {string} symbol Имя искомого идентификатора
 * @param {string} currentCode Исходный код текущего файла
 * @param {Array} taskFiles Список файлов задачи
 * @param {string} currentFilepath Текущий путь к файлу
 * @returns {{ type: 'file', fileIndex: number, filename: string } | { type: 'local', line: number, col: number } | null}
 */
export const findDefinition = (symbol, currentCode = "", taskFiles = [], currentFilepath = "") => {
  if (!symbol || typeof symbol !== "string") return null;
  const cleanSym = symbol.trim();
  if (!cleanSym) return null;

  // 1. Поиск в файлах задачи (переключение между файлами / Go to File)
  if (Array.isArray(taskFiles) && taskFiles.length > 0) {
    for (let i = 0; i < taskFiles.length; i++) {
      const file = taskFiles[i];
      if (!file || file.name === currentFilepath || file.filepath === currentFilepath) continue;

      // Проверка совпадения с именем файла (например, CustomHeader -> CustomHeader.jsx)
      const baseFilename = (file.name || file.filepath || "").replace(/\.[^/.]+$/, "");
      if (baseFilename.toLowerCase() === cleanSym.toLowerCase()) {
        return { type: "file", fileIndex: i, filename: file.name || file.filepath };
      }

      // Проверка экспортов внутри файла
      if (file.code) {
        const hasExport =
          new RegExp(`export\\s+default\\s+(?:function\\s+|class\\s+|const\\s+)?\\b${cleanSym}\\b`).test(file.code) ||
          new RegExp(`export\\s+(?:const|let|var|function|class|type|interface|enum)\\s+\\b${cleanSym}\\b`).test(file.code) ||
          new RegExp(`export\\s*\\{[^}]*\\b${cleanSym}\\b[^}]*\\}`).test(file.code);

        if (hasExport) {
          return { type: "file", fileIndex: i, filename: file.name || file.filepath };
        }
      }
    }
  }

  // 2. Поиск локального определения в текущем файле (Go to Local Definition)
  if (currentCode) {
    const lines = currentCode.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const patterns = [
        new RegExp(`\\b(?:const|let|var)\\s+(?:\\{[^}]*\\b${cleanSym}\\b[^}]*\\}|\\[[^\\]]*\\b${cleanSym}\\b[^\\]]*\\}|\\b${cleanSym}\\b)`),
        new RegExp(`\\bfunction\\s*\\*?\\s*\\b${cleanSym}\\b`),
        new RegExp(`\\bclass\\s+\\b${cleanSym}\\b`),
        new RegExp(`\\b(?:type|interface|enum)\\s+\\b${cleanSym}\\b`),
      ];

      for (const pat of patterns) {
        const m = line.match(pat);
        if (m) {
          return { type: "local", line: i + 1, col: (m.index || 0) + 1 };
        }
      }
    }
  }

  return null;
};

/**
 * Интеллектуальный поиск подсказок автодополнения
 */
export const getCompletions = (fullCode, cursorIndex, options = {}) => {
  if (!fullCode && fullCode !== "") return { word: "", items: [] };

  const { files = [], filepath = "main.jsx", title = "", force = false } = options;
  const currentFilepath = title || filepath;

  const textBeforeCursor = fullCode.substring(0, cursorIndex);
  const lineStart = textBeforeCursor.lastIndexOf("\n") + 1;
  const currentLineBeforeCursor = textBeforeCursor.substring(lineStart);
  const lineEnd = fullCode.indexOf("\n", cursorIndex);
  const lineAfterCursor = lineEnd === -1 ? fullCode.substring(cursorIndex) : fullCode.substring(cursorIndex, lineEnd);
  const fullCurrentLine = currentLineBeforeCursor + lineAfterCursor;

  // Игнорируем однострочные комментарии
  if (currentLineBeforeCursor.includes("//")) {
    return { word: "", items: [] };
  }

  const isImportLine = /^\s*import\b/.test(currentLineBeforeCursor) || /^\s*import\b/.test(fullCurrentLine);

  // ==========================================
  // 1. Контекст строки импорта
  // ==========================================
  if (isImportLine) {
    // 1.1. Курсор после `from '`, `from "` или `from `
    const fromMatch = currentLineBeforeCursor.match(/from\s*(['"]?)([a-zA-Z0-9_@/.-]*)$/);
    if (fromMatch && currentLineBeforeCursor.includes("from")) {
      const hasQuote = Boolean(fromMatch[1]);
      const quoteChar = fromMatch[1] || "'";
      const query = fromMatch[2] || "";

      // Полный остаток модуля после курсора (буквы, закрывающая кавычка, точка с запятой)
      const afterMatch = lineAfterCursor.match(/^([a-zA-Z0-9_@/.-]*)(\s*['"]?)(\s*;?)/);
      const afterTotalLen = afterMatch ? afterMatch[0].length : 0;

      const replaceStart = cursorIndex - query.length;
      const replaceEnd = cursorIndex + afterTotalLen;
      const quoteToUse = hasQuote ? quoteChar : "'";
      const insertSuffix = `${quoteToUse};`;

      const moduleCandidates = Object.keys(KNOWN_MODULES).map((mod) => ({
        prefix: mod,
        label: `'${mod}'`,
        detail: `Модуль библиотеки`,
        kind: "module",
        insertText: hasQuote ? `${mod}${insertSuffix}` : `'${mod}${insertSuffix}`,
        replaceStart,
        replaceEnd,
        cursorOffset: (hasQuote ? `${mod}${insertSuffix}` : `'${mod}${insertSuffix}`).length,
      }));

      if (Array.isArray(files)) {
        files.forEach((f) => {
          if (f.name !== currentFilepath) {
            const rel = `./${f.name.replace(/\.[^/.]+$/, "")}`;
            moduleCandidates.push({
              prefix: rel,
              label: `'${rel}'`,
              detail: `Локальный файл: ${f.name}`,
              kind: "module",
              insertText: hasQuote ? `${rel}${insertSuffix}` : `'${rel}${insertSuffix}`,
              replaceStart,
              replaceEnd,
              cursorOffset: (hasQuote ? `${rel}${insertSuffix}` : `'${rel}${insertSuffix}`).length,
            });
          }
        });
      }

      const scoredModules = [];
      for (const modItem of moduleCandidates) {
        const { match, score } = fuzzyMatch(modItem.prefix, query);
        if (match || !query) {
          scoredModules.push({ ...modItem, score });
        }
      }

      scoredModules.sort((a, b) => b.score - a.score);

      return {
        word: query || "from",
        items: scoredModules.slice(0, 10),
      };
    }

    // 1.2. Пользователь написал `import {useState}` или `import {useS}` (с закрывающей скобкой)
    const completedBracesMatch = currentLineBeforeCursor.match(/^import\s+(type\s+)?\{\s*([^}]+?)\s*\}\s*$/);
    if (completedBracesMatch) {
      const isType = Boolean(completedBracesMatch[1]);
      const typePrefix = isType ? "type " : "";
      const rawSyms = completedBracesMatch[2].split(",").map((s) => s.trim()).filter(Boolean);
      if (rawSyms.length > 0) {
        let mod = "react";
        const expandedSyms = [];
        for (const s of rawSyms) {
          const res = resolveModuleForSymbol(s, files, currentFilepath);
          if (res) {
            mod = res.module;
            expandedSyms.push(s);
          } else {
            // Fuzzy поиск незавершенного символа (например useS -> useState)
            let bestSym = s;
            let bestScore = 0;
            let bestMod = "react";
            for (const [modName, modInfo] of Object.entries(KNOWN_MODULES)) {
              if (modInfo.named) {
                for (const namedSym of modInfo.named) {
                  const { match, score } = fuzzyMatch(namedSym, s);
                  if (match && score > bestScore) {
                    bestScore = score;
                    bestSym = namedSym;
                    bestMod = modName;
                  }
                }
              }
            }
            if (bestScore > 50) {
              mod = bestMod;
              expandedSyms.push(bestSym);
            } else {
              expandedSyms.push(s);
            }
          }
        }
        const fullStatement = `import ${typePrefix}{ ${expandedSyms.join(", ")} } from '${mod}';`;
        return {
          word: expandedSyms[expandedSyms.length - 1],
          items: [
            {
              prefix: "import",
              label: fullStatement,
              detail: `Завершить импорт из '${mod}'`,
              kind: "import",
              insertText: fullStatement,
              replaceStart: lineStart,
              replaceEnd: lineEnd === -1 ? fullCode.length : lineEnd,
              cursorOffset: fullStatement.length,
              score: 100,
            },
            {
              prefix: "from",
              label: ` from '${mod}';`,
              detail: `Добавить источник '${mod}'`,
              kind: "import",
              insertText: ` from '${mod}';`,
              replaceStart: cursorIndex,
              replaceEnd: cursorIndex,
              cursorOffset: ` from '${mod}';`.length,
              score: 90,
            },
          ],
        };
      }
    }

    // 1.3. Внутри фигурных скобок `import { ...`
    const inBracesMatch = currentLineBeforeCursor.match(/^import\s+(type\s+)?\{\s*([^}]*?)$/);
    if (inBracesMatch) {
      const isType = Boolean(inBracesMatch[1]);
      const typePrefix = isType ? "type " : "";
      const insideText = inBracesMatch[2];
      const parts = insideText.split(",");
      const currentPart = parts[parts.length - 1].trim();
      const alreadyImported = parts.slice(0, -1).map((s) => s.trim()).filter(Boolean);

      const hasFromClause = /from\s+['"]([^'"]+)['"]/.exec(fullCurrentLine);
      const targetModuleName = hasFromClause ? hasFromClause[1] : null;

      const afterIdentMatch = lineAfterCursor.match(/^[a-zA-Z0-9_$]*/);
      const afterIdentLen = afterIdentMatch ? afterIdentMatch[0].length : 0;

      const suggestions = [];

      const addNamedExportsFromModule = (modName, modInfo) => {
        if (!modInfo || !modInfo.named) return;
        for (const sym of modInfo.named) {
          if (alreadyImported.includes(sym)) continue;
          const { match, score } = fuzzyMatch(sym, currentPart);
          if (match || !currentPart) {
            let insertStr;
            let repStart;
            let repEnd;
            let cOffset;

            if (hasFromClause) {
              // Линия уже содержит `from '...'` -> заменяем только текущее имя символа (с учетом остатка слова)
              insertStr = sym;
              repStart = cursorIndex - currentPart.length;
              repEnd = cursorIndex + afterIdentLen;
              cOffset = currentPart.length > 0 ? sym.length : undefined;
            } else {
              // Линия НЕ содержит `from '...'` -> разворачиваем полный валидный import statement с from '...'
              const allSyms = [...alreadyImported, sym].join(", ");
              insertStr = `import ${typePrefix}{ ${allSyms} } from '${modName}';`;
              repStart = lineStart;
              repEnd = lineEnd === -1 ? fullCode.length : lineEnd;
              cOffset = `import ${typePrefix}{ ${allSyms}`.length;
            }

            suggestions.push({
              prefix: sym,
              label: hasFromClause ? sym : `{ ${[...alreadyImported, sym].join(", ")} } from '${modName}';`,
              detail: `from '${modName}'`,
              kind: sym.startsWith("use") ? "hook" : "import",
              insertText: insertStr,
              replaceStart: repStart,
              replaceEnd: repEnd,
              cursorOffset: cOffset,
              score,
            });
          }
        }
      };

      if (targetModuleName && KNOWN_MODULES[targetModuleName]) {
        addNamedExportsFromModule(targetModuleName, KNOWN_MODULES[targetModuleName]);
      } else {
        for (const [modName, modInfo] of Object.entries(KNOWN_MODULES)) {
          addNamedExportsFromModule(modName, modInfo);
        }

        const taskExports = getTaskFilesExports(files, currentFilepath);
        for (const [sym, info] of Object.entries(taskExports)) {
          if (!info.isDefault) {
            if (alreadyImported.includes(sym)) continue;
            const { match, score } = fuzzyMatch(sym, currentPart);
            if (match || !currentPart) {
              let insertStr;
              let repStart;
              let repEnd;
              let cOffset;

              if (hasFromClause) {
                insertStr = sym;
                repStart = cursorIndex - currentPart.length;
                repEnd = cursorIndex + afterIdentLen;
                cOffset = currentPart.length > 0 ? sym.length : undefined;
              } else {
                const allSyms = [...alreadyImported, sym].join(", ");
                insertStr = `import ${typePrefix}{ ${allSyms} } from '${info.module}';`;
                repStart = lineStart;
                repEnd = lineEnd === -1 ? fullCode.length : lineEnd;
                cOffset = `import ${typePrefix}{ ${allSyms}`.length;
              }

              suggestions.push({
                prefix: sym,
                label: hasFromClause ? sym : `{ ${[...alreadyImported, sym].join(", ")} } from '${info.module}';`,
                detail: `from '${info.module}' (${info.filename})`,
                kind: "import",
                insertText: insertStr,
                replaceStart: repStart,
                replaceEnd: repEnd,
                cursorOffset: cOffset,
                score,
              });
            }
          }
        }
      }

      if (suggestions.length > 0) {
        suggestions.sort((a, b) => b.score - a.score);
        return {
          word: currentPart || "{",
          items: suggestions.slice(0, 12),
        };
      }
    }

    // 1.4. Курсор после `import ` (начало выбора шаблона импорта или символа без скобок)
    const importSpaceMatch = currentLineBeforeCursor.match(/^import\s+(type\s+)?([a-zA-Z0-9_$]*)$/);
    if (importSpaceMatch) {
      const isType = Boolean(importSpaceMatch[1]);
      const typePrefix = isType ? "type " : "";
      const typed = importSpaceMatch[2];

      const suggestions = [];

      for (const [modName, modInfo] of Object.entries(KNOWN_MODULES)) {
        if (modInfo.default) {
          const { match, score } = fuzzyMatch(modInfo.default, typed);
          if (match || !typed) {
            const insertStr = `import ${typePrefix}${modInfo.default} from '${modName}';`;
            suggestions.push({
              prefix: modInfo.default,
              label: `${modInfo.default} from '${modName}';`,
              detail: `Импорт по умолчанию из '${modName}'`,
              kind: "import",
              insertText: insertStr,
              replaceStart: lineStart,
              replaceEnd: lineEnd === -1 ? fullCode.length : lineEnd,
              cursorOffset: `import ${typePrefix}${modInfo.default}`.length,
              score: score + 10,
            });
          }
        }
        if (modInfo.named) {
          for (const sym of modInfo.named) {
            const { match, score } = fuzzyMatch(sym, typed);
            if (match || !typed) {
              const insertStr = `import ${typePrefix}{ ${sym} } from '${modName}';`;
              suggestions.push({
                prefix: sym,
                label: `{ ${sym} } from '${modName}';`,
                detail: `Именованный импорт из '${modName}'`,
                kind: sym.startsWith("use") ? "hook" : "import",
                insertText: insertStr,
                replaceStart: lineStart,
                replaceEnd: lineEnd === -1 ? fullCode.length : lineEnd,
                cursorOffset: `import ${typePrefix}{ ${sym}`.length,
                score: score + (sym === "useState" || sym === "createSlice" ? 12 : 8),
              });
            }
          }
        }
      }

      const taskExports = getTaskFilesExports(files, currentFilepath);
      for (const [sym, info] of Object.entries(taskExports)) {
        const { match, score } = fuzzyMatch(sym, typed);
        if (match || !typed) {
          const insertStr = info.isDefault
            ? `import ${typePrefix}${sym} from '${info.module}';`
            : `import ${typePrefix}{ ${sym} } from '${info.module}';`;
          suggestions.push({
            prefix: sym,
            label: info.isDefault ? `${sym} from '${info.module}';` : `{ ${sym} } from '${info.module}';`,
            detail: `Локальный файл: ${info.filename}`,
            kind: "import",
            insertText: insertStr,
            replaceStart: lineStart,
            replaceEnd: lineEnd === -1 ? fullCode.length : lineEnd,
            cursorOffset: info.isDefault ? `import ${typePrefix}${sym}`.length : `import ${typePrefix}{ ${sym}`.length,
            score: score + 10,
          });
        }
      }

      if (suggestions.length > 0) {
        suggestions.sort((a, b) => b.score - a.score);
        return {
          word: typed || "import",
          items: suggestions.slice(0, 12),
        };
      }
    }
  }

  // ==========================================
  // 2. Контекст доступа к свойствам и методам через точку (Member Access: obj.prop, array.map, e.preventDefault)
  // ==========================================
  const memberMatch = currentLineBeforeCursor.match(/(?:([a-zA-Z0-9_$]+|\)|\]|\})\s*(?:\.|\?\.)\s*([a-zA-Z0-9_$]*))$/);
  if (memberMatch) {
    const rawReceiver = memberMatch[1];
    const memberQuery = memberMatch[2] || "";
    const receiverLower = rawReceiver.toLowerCase();

    let candidateMembers = [];

    if (receiverLower === "console") {
      candidateMembers = JS_MEMBER_COMPLETIONS.console;
    } else if (receiverLower === "math") {
      candidateMembers = JS_MEMBER_COMPLETIONS.math;
    } else if (receiverLower === "object") {
      candidateMembers = JS_MEMBER_COMPLETIONS.object;
    } else if (receiverLower === "json") {
      candidateMembers = JS_MEMBER_COMPLETIONS.json;
    } else if (receiverLower === "promise") {
      candidateMembers = JS_MEMBER_COMPLETIONS.promise;
    } else if (["e", "event", "evt"].includes(receiverLower)) {
      candidateMembers = JS_MEMBER_COMPLETIONS.event;
    } else if (receiverLower === "target") {
      candidateMembers = JS_MEMBER_COMPLETIONS.target;
    } else if (
      rawReceiver === "]" ||
      /list|items|arr|array|users|todos|tasks|data|rows|elements|filtered|mapped/i.test(rawReceiver)
    ) {
      candidateMembers = [
        ...JS_MEMBER_COMPLETIONS.array,
        ...JS_MEMBER_COMPLETIONS.object.filter((o) => o.label === "hasOwnProperty" || o.label === "toString"),
      ];
    } else if (
      /str|string|text|name|title|msg|message|val|value|url|query/i.test(rawReceiver)
    ) {
      candidateMembers = [
        ...JS_MEMBER_COMPLETIONS.string,
        ...JS_MEMBER_COMPLETIONS.object.filter((o) => o.label === "hasOwnProperty" || o.label === "toString"),
      ];
    } else if (/promise|res|req|response|request|fetch|async/i.test(rawReceiver)) {
      candidateMembers = [
        ...JS_MEMBER_COMPLETIONS.promise.filter((p) => ["then", "catch", "finally"].includes(p.label)),
        ...JS_MEMBER_COMPLETIONS.object.filter((o) => o.label === "hasOwnProperty" || o.label === "toString"),
      ];
    } else {
      candidateMembers = [
        ...JS_MEMBER_COMPLETIONS.array,
        ...JS_MEMBER_COMPLETIONS.string.filter((s) => !["length", "slice", "includes"].includes(s.label)),
        ...JS_MEMBER_COMPLETIONS.promise.filter((p) => ["then", "catch", "finally"].includes(p.label)),
        ...JS_MEMBER_COMPLETIONS.object.filter((o) => ["hasOwnProperty", "toString"].includes(o.label)),
      ];
    }

    const scoredMembers = [];
    const afterMemberMatch = lineAfterCursor.match(/^[a-zA-Z0-9_$]*/);
    const afterMemberLen = afterMemberMatch ? afterMemberMatch[0].length : 0;

    for (const mem of candidateMembers) {
      const { match, score } = fuzzyMatch(mem.label, memberQuery);
      if (match || !memberQuery) {
        const rawInsert = mem.insertText.replace(/\$1/g, "").replace(/\$2/g, "");
        scoredMembers.push({
          prefix: mem.label,
          label: mem.label,
          detail: mem.detail,
          kind: mem.kind,
          insertText: rawInsert,
          replaceStart: cursorIndex - memberQuery.length,
          replaceEnd: cursorIndex + afterMemberLen,
          score,
        });
      }
    }

    if (scoredMembers.length > 0) {
      scoredMembers.sort((a, b) => b.score - a.score);
      const seen = new Set();
      const uniqueMembers = [];
      for (const m of scoredMembers) {
        if (!seen.has(m.label)) {
          seen.add(m.label);
          uniqueMembers.push(m);
        }
      }
      return {
        word: memberQuery || ".",
        items: uniqueMembers.slice(0, 12),
      };
    }
  }

  // ==========================================
  // 3. Контекст CSS свойств внутри `style={{ ... }}`
  // ==========================================
  const inStyleMatch = currentLineBeforeCursor.match(/style=\{\{\s*([^}]*?)$/);
  if (inStyleMatch) {
    const styleContent = inStyleMatch[1];
    const cssPropMatch = styleContent.match(/(?:^|[,;])\s*([a-zA-Z0-9_$]*)$/);
    if (cssPropMatch) {
      const cssQuery = cssPropMatch[1] || "";
      const afterCssMatch = lineAfterCursor.match(/^[a-zA-Z0-9_$]*/);
      const afterCssLen = afterCssMatch ? afterCssMatch[0].length : 0;
      const scoredCss = [];

      for (const prop of REACT_CSS_PROPERTIES) {
        const { match, score } = fuzzyMatch(prop.label, cssQuery);
        if (match || !cssQuery) {
          scoredCss.push({
            prefix: prop.label,
            label: prop.label,
            detail: prop.detail,
            kind: prop.kind,
            insertText: prop.insertText,
            replaceStart: cursorIndex - cssQuery.length,
            replaceEnd: cursorIndex + afterCssLen,
            score: score + 15,
          });
        }
      }

      if (scoredCss.length > 0) {
        scoredCss.sort((a, b) => b.score - a.score);
        return {
          word: cssQuery || "style",
          items: scoredCss.slice(0, 12),
        };
      }
    }
  }

  // ==========================================
  // 4. Контекст JSX: автодополнение тегов (<tag) и пропсов/обработчиков (<div prop=)
  // ==========================================
  // 4.1. Ввод открывающего тега JSX (например: `<d`, `<button`, `<Fragment`, `<`)
  // Исключаем контекст TypeScript дженериков (type ListProps<T>, interface Props<T>, useRef<T>, Array<T>, etc.)
  const isGenericContext = isTypeScriptGenericContext(currentLineBeforeCursor);
  const tagOpenMatch = !isGenericContext && currentLineBeforeCursor.match(/<([a-zA-Z0-9_$]*)$/);
  if (tagOpenMatch) {
    const tagQuery = tagOpenMatch[1];
    const afterTagMatch = lineAfterCursor.match(/^[a-zA-Z0-9_$]*/);
    const afterTagLen = afterTagMatch ? afterTagMatch[0].length : 0;
    const scoredTags = [];

    // Стандартные JSX элементы
    for (const el of JSX_ELEMENTS) {
      const { match, score } = fuzzyMatch(el.name, tagQuery);
      if (match || !tagQuery) {
        scoredTags.push({
          prefix: el.name,
          label: `<${el.name}>`,
          detail: el.detail,
          kind: "keyword",
          insertText: el.name,
          replaceStart: cursorIndex - tagQuery.length,
          replaceEnd: cursorIndex + afterTagLen,
          score: score + 10,
        });
      }
    }

    // Компоненты из других файлов задачи
    const taskFilesExports = getTaskFilesExports(files, currentFilepath);
    for (const [sym, info] of Object.entries(taskFilesExports)) {
      if (/^[A-Z]/.test(sym)) {
        const { match, score } = fuzzyMatch(sym, tagQuery);
        if (match || !tagQuery) {
          scoredTags.push({
            prefix: sym,
            label: `<${sym}>`,
            detail: `Компонент задачи: ${info.filename}`,
            kind: "import",
            insertText: sym,
            autoImport: { symbol: sym, module: info.module, isDefault: info.isDefault },
            replaceStart: cursorIndex - tagQuery.length,
            replaceEnd: cursorIndex + afterTagLen,
            score: score + 15,
          });
        }
      }
    }

    if (scoredTags.length > 0) {
      scoredTags.sort((a, b) => b.score - a.score);
      return {
        word: tagQuery || "<",
        items: scoredTags.slice(0, 12),
      };
    }
  }

  // 4.2. Ввод пропсов/атрибутов внутри открытого тега JSX (например: `<button on`, `<input type="text" pl`)
  const inTagMatch = currentLineBeforeCursor.match(/<([a-zA-Z0-9_$]+)(?:\s+[^>]*?)?\s+([a-zA-Z0-9_$-]*)$/);
  const isInsideQuoteOrBrace = /=["'][^"']*$/.test(currentLineBeforeCursor) || /=\{[^}]*$/.test(currentLineBeforeCursor);

  if (inTagMatch && !isInsideQuoteOrBrace) {
    const tagName = inTagMatch[1].toLowerCase();
    const propQuery = inTagMatch[2] || "";
    const afterPropMatch = lineAfterCursor.match(/^[a-zA-Z0-9_$-]*/);
    const afterPropLen = afterPropMatch ? afterPropMatch[0].length : 0;

    let candidateProps = [...REACT_JSX_PROPS.common, ...REACT_JSX_PROPS.events];

    if (REACT_JSX_PROPS[tagName]) {
      candidateProps = [...REACT_JSX_PROPS[tagName], ...candidateProps];
    }

    const scoredProps = [];
    for (const prop of candidateProps) {
      const { match, score } = fuzzyMatch(prop.label, propQuery);
      if (match || !propQuery) {
        scoredProps.push({
          prefix: prop.label,
          label: prop.label,
          detail: prop.detail,
          kind: prop.kind,
          insertText: prop.insertText,
          replaceStart: cursorIndex - propQuery.length,
          replaceEnd: cursorIndex + afterPropLen,
          score,
        });
      }
    }

    if (scoredProps.length > 0) {
      scoredProps.sort((a, b) => b.score - a.score);
      const seen = new Set();
      const uniqueProps = [];
      for (const p of scoredProps) {
        if (!seen.has(p.label)) {
          seen.add(p.label);
          uniqueProps.push(p);
        }
      }
      return {
        word: propQuery || "prop",
        items: uniqueProps.slice(0, 12),
      };
    }
  }

  // ==========================================
  // 4.3. Emmet JSX генератор разметки (div.card>button.btn*2)
  // ==========================================
  const emmetMatch = currentLineBeforeCursor.match(/([a-zA-Z0-9_$.#:>+*^=$/-]+)$/);
  if (emmetMatch && isEmmetAbbreviation(emmetMatch[1])) {
    const abbr = emmetMatch[1];
    const lineIndentMatch = currentLineBeforeCursor.match(/^(\s*)/);
    const lineIndent = lineIndentMatch ? lineIndentMatch[1] : "";
    const expanded = expandEmmetAbbreviation(abbr, lineIndent);
    if (expanded) {
      const emmetItem = {
        prefix: abbr,
        label: `${abbr} ⚡ (Emmet)`,
        detail: `Развернуть Emmet JSX разметку`,
        kind: "snippet",
        insertText: expanded,
        replaceStart: cursorIndex - abbr.length,
        replaceEnd: cursorIndex,
        score: 130,
      };

      if (/[.#>+*\[{]/.test(abbr)) {
        return {
          word: abbr,
          items: [emmetItem],
        };
      }
    }
  }

  // ==========================================
  // 5. Стандартный контекст набора кода (в теле компонентов, функций и типов)
  // ==========================================
  const wordMatch = textBeforeCursor.match(/([a-zA-Z_$][a-zA-Z0-9_$]*)$/);
  const word = wordMatch ? wordMatch[1] : "";

  if (!word && !force) return { word: "", items: [] };

  const allItems = [];

  // 5.1. Сниппеты
  for (const s of JS_SNIPPETS) {
    const { match, score } = fuzzyMatch(s.prefix, word);
    if (match || (!word && force)) {
      allItems.push({
        prefix: s.prefix,
        label: s.label,
        detail: s.detail,
        kind: "snippet",
        insertText: s.prefix,
        snippet: s,
        score: score + 5,
      });
    }
  }

  // 5.2. React Хуки (с поддержкой умного Auto-Import при вставке)
  for (const h of REACT_HOOKS) {
    const { match, score } = fuzzyMatch(h, word);
    if (match || (!word && force)) {
      allItems.push({
        prefix: h,
        label: h,
        detail: "React Hook (auto-import)",
        kind: "hook",
        insertText: h,
        autoImport: { symbol: h, module: "react", isDefault: false },
        score: score + 10,
      });
    }
  }

  // 5.3. TypeScript Utility Types & React Types
  for (const t of TS_UTILITY_TYPES) {
    const { match, score } = fuzzyMatch(t.name, word);
    if (match || (!word && force)) {
      const cleanInsert = t.insertText.replace(/\$1/g, "").replace(/\$2/g, "");
      allItems.push({
        prefix: t.name,
        label: t.label,
        detail: t.detail,
        kind: "type",
        insertText: cleanInsert,
        autoImport: t.autoImport,
        score: score + 7,
      });
    }
  }

  // 5.4. Популярные библиотеки (Redux, Router, Zustand) с Auto-Import
  const popularSymbols = [
    { sym: "createSlice", mod: "@reduxjs/toolkit" },
    { sym: "configureStore", mod: "@reduxjs/toolkit" },
    { sym: "useSelector", mod: "react-redux" },
    { sym: "useDispatch", mod: "react-redux" },
    { sym: "useNavigate", mod: "@tanstack/react-router" },
    { sym: "useParams", mod: "@tanstack/react-router" },
    { sym: "Link", mod: "@tanstack/react-router" },
    { sym: "create", mod: "zustand" },
    { sym: "createPortal", mod: "react-dom" },
    { sym: "createRoot", mod: "react-dom/client" },
  ];

  for (const item of popularSymbols) {
    const { match, score } = fuzzyMatch(item.sym, word);
    if (match || (!word && force)) {
      allItems.push({
        prefix: item.sym,
        label: item.sym,
        detail: `Auto-import from '${item.mod}'`,
        kind: "import",
        insertText: item.sym,
        autoImport: { symbol: item.sym, module: item.mod, isDefault: false },
        score: score + 8,
      });
    }
  }

  // 5.5. Ключевые слова JS
  for (const k of JS_KEYWORDS) {
    const { match, score } = fuzzyMatch(k, word);
    if (match || (!word && force)) {
      allItems.push({
        prefix: k,
        label: k,
        detail: "Ключевое слово JS",
        kind: "keyword",
        insertText: k,
        score,
      });
    }
  }

  // 5.6. Глобальные объекты JS
  for (const g of JS_GLOBALS) {
    const { match, score } = fuzzyMatch(g, word);
    if (match || (!word && force)) {
      allItems.push({
        prefix: g,
        label: g,
        detail: "Глобальный объект JS",
        kind: "global",
        insertText: g,
        score,
      });
    }
  }

  // 5.7. Символы из текущего документа
  const docTokens = new Set();
  const tokenRegex = /\b[a-zA-Z_$][a-zA-Z0-9_$]*\b/g;
  let tMatch;
  while ((tMatch = tokenRegex.exec(fullCode)) !== null) {
    const tok = tMatch[0];
    if (
      tok !== word &&
      tok.length > 2 &&
      !JS_KEYWORDS.includes(tok) &&
      !REACT_HOOKS.includes(tok) &&
      !JS_GLOBALS.includes(tok)
    ) {
      docTokens.add(tok);
    }
  }

  for (const tok of docTokens) {
    const { match, score } = fuzzyMatch(tok, word);
    if (match || (!word && force)) {
      allItems.push({
        prefix: tok,
        label: tok,
        detail: "Переменная / Символ в коде",
        kind: "variable",
        insertText: tok,
        score: score - 5,
      });
    }
  }

  // 5.8. Экспорты из других файлов задачи
  const taskFilesExports = getTaskFilesExports(files, currentFilepath);
  for (const [sym, info] of Object.entries(taskFilesExports)) {
    const { match, score } = fuzzyMatch(sym, word);
    if (match || (!word && force)) {
      allItems.push({
        prefix: sym,
        label: sym,
        detail: `Auto-import from '${info.module}' (${info.filename})`,
        kind: "import",
        insertText: sym,
        autoImport: { symbol: sym, module: info.module, isDefault: info.isDefault },
        score: score + 6,
      });
    }
  }

  // Сортировка по релевантности (Scoring)
  allItems.sort((a, b) => b.score - a.score);

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
    word: word || "",
    items: uniqueItems.slice(0, 12),
  };
};

/**
 * Вставка сниппета в текст с умной подстановкой имени компонента и параметров
 */
export const expandSnippet = (fullCode, cursorIndex, snippet, prefixWord = "", options = {}) => {
  const { filepath = "Component.jsx", title = "" } = options;
  const currentFile = title || filepath || "Component.jsx";
  const compName = getComponentNameFromFilepath(currentFile);

  const startReplace = cursorIndex - (prefixWord ? prefixWord.length : 0);

  let rawBody = typeof snippet.body === "function" ? snippet.body(compName) : snippet.body;

  // Очистка и замена плейсхолдеров $1, $2, $3, $4
  rawBody = rawBody
    .replace(/\$1/g, compName)
    .replace(/\$2/g, "")
    .replace(/\$3/g, "")
    .replace(/\$4/g, "");

  const before = fullCode.substring(0, startReplace);
  const after = fullCode.substring(cursorIndex);

  const newCode = before + rawBody + after;

  let newCursorPos = startReplace + rawBody.length;
  if (snippet.cursorOffset !== undefined) {
    newCursorPos = startReplace + snippet.cursorOffset;
  } else if (rawBody.includes("<div>\n      \n    </div>")) {
    newCursorPos = startReplace + rawBody.indexOf("<div>\n      \n    </div>") + 12;
  } else if (rawBody.includes("{\n  \n}")) {
    newCursorPos = startReplace + rawBody.indexOf("{\n  \n}") + 4;
  }

  return { newCode, newCursorPos };
};
