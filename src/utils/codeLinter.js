/**
 * codeLinter.js
 * Высокопроизводительная проверка синтаксиса, орфографии ключевых слов (Typo Checker)
 * и статический анализ отсутствующих импортов в стиле VS Code (Missing Import Linter).
 * Корректно игнорирует комментарии, строковые литералы, регулярные выражения и интерполяцию в шаблонных строках.
 */

import { addImportToFile } from "./snippetsEngine.js";
import { checkTypeScriptTypes, checkComponentProps } from "./typeChecker.js";

export const KEYWORD_TYPOS = {
  conts: "const",
  cosnt: "const",
  cotns: "const",
  cnost: "const",
  cnsot: "const",
  fucntion: "function",
  funtion: "function",
  funciton: "function",
  fnction: "function",
  fuction: "function",
  reutrn: "return",
  retrun: "return",
  retun: "return",
  reurn: "return",
  asnyc: "async",
  aync: "async",
  asnc: "async",
  awiat: "await",
  awit: "await",
  calss: "class",
  clsas: "class",
  improt: "import",
  imprt: "import",
  exprot: "export",
  exprt: "export",
  lenght: "length",
  lengh: "length",
  consol: "console",
  cosnole: "console",
  cosole: "console",
  pormise: "Promise",
  promse: "Promise",
  stirng: "string",
  nubmer: "number",
  bollean: "boolean",
  usesate: "useState",
  usestate: "useState",
  useefect: "useEffect",
  useeffect: "useEffect",
  useref: "useRef",
  usememo: "useMemo",
  usecallback: "useCallback",
  usecontext: "useContext",
  usereducer: "useReducer",
};

// Предварительно скомпилированное единое регулярное выражение для мгновенной проверки опечаток
const TYPO_KEYS = Object.keys(KEYWORD_TYPOS).sort((a, b) => b.length - a.length);
const TYPO_MASTER_REGEX = new RegExp(`\\b(${TYPO_KEYS.join("|")})\\b`, "gi");

// База известных библиотечных символов и их модулей
export const KNOWN_SYMBOLS = {
  // React Hooks
  useState: { module: "react", isDefault: false, category: "hook" },
  useEffect: { module: "react", isDefault: false, category: "hook" },
  useContext: { module: "react", isDefault: false, category: "hook" },
  useReducer: { module: "react", isDefault: false, category: "hook" },
  useCallback: { module: "react", isDefault: false, category: "hook" },
  useMemo: { module: "react", isDefault: false, category: "hook" },
  useRef: { module: "react", isDefault: false, category: "hook" },
  useImperativeHandle: { module: "react", isDefault: false, category: "hook" },
  useLayoutEffect: { module: "react", isDefault: false, category: "hook" },
  useDebugValue: { module: "react", isDefault: false, category: "hook" },
  useDeferredValue: { module: "react", isDefault: false, category: "hook" },
  useTransition: { module: "react", isDefault: false, category: "hook" },
  useId: { module: "react", isDefault: false, category: "hook" },
  useSyncExternalStore: { module: "react", isDefault: false, category: "hook" },
  useInsertionEffect: { module: "react", isDefault: false, category: "hook" },

  // React APIs & Components
  createContext: { module: "react", isDefault: false, category: "api" },
  forwardRef: { module: "react", isDefault: false, category: "api" },
  memo: { module: "react", isDefault: false, category: "api" },
  lazy: { module: "react", isDefault: false, category: "api" },
  Suspense: { module: "react", isDefault: false, category: "api" },
  Fragment: { module: "react", isDefault: false, category: "api" },
  StrictMode: { module: "react", isDefault: false, category: "api" },
  Component: { module: "react", isDefault: false, category: "api" },
  PureComponent: { module: "react", isDefault: false, category: "api" },
  createRef: { module: "react", isDefault: false, category: "api" },
  Children: { module: "react", isDefault: false, category: "api" },
  cloneElement: { module: "react", isDefault: false, category: "api" },
  isValidElement: { module: "react", isDefault: false, category: "api" },
  startTransition: { module: "react", isDefault: false, category: "api" },
  React: { module: "react", isDefault: true, category: "namespace" },

  // React TypeScript Types
  FC: { module: "react", isDefault: false, category: "type" },
  FunctionComponent: { module: "react", isDefault: false, category: "type" },
  ReactNode: { module: "react", isDefault: false, category: "type" },
  ReactElement: { module: "react", isDefault: false, category: "type" },
  ReactPortal: { module: "react", isDefault: false, category: "type" },
  PropsWithChildren: { module: "react", isDefault: false, category: "type" },
  ChangeEvent: { module: "react", isDefault: false, category: "type" },
  MouseEvent: { module: "react", isDefault: false, category: "type" },
  KeyboardEvent: { module: "react", isDefault: false, category: "type" },
  FormEvent: { module: "react", isDefault: false, category: "type" },
  FocusEvent: { module: "react", isDefault: false, category: "type" },
  PointerEvent: { module: "react", isDefault: false, category: "type" },
  TouchEvent: { module: "react", isDefault: false, category: "type" },
  SyntheticEvent: { module: "react", isDefault: false, category: "type" },
  ComponentPropsWithoutRef: { module: "react", isDefault: false, category: "type" },
  ComponentPropsWithRef: { module: "react", isDefault: false, category: "type" },
  ComponentProps: { module: "react", isDefault: false, category: "type" },
  ElementRef: { module: "react", isDefault: false, category: "type" },
  ElementType: { module: "react", isDefault: false, category: "type" },
  MutableRefObject: { module: "react", isDefault: false, category: "type" },
  RefObject: { module: "react", isDefault: false, category: "type" },
  ForwardedRef: { module: "react", isDefault: false, category: "type" },
  Ref: { module: "react", isDefault: false, category: "type" },
  CSSProperties: { module: "react", isDefault: false, category: "type" },
  Dispatch: { module: "react", isDefault: false, category: "type" },
  SetStateAction: { module: "react", isDefault: false, category: "type" },
  Reducer: { module: "react", isDefault: false, category: "type" },
  Context: { module: "react", isDefault: false, category: "type" },
  Key: { module: "react", isDefault: false, category: "type" },

  // React DOM
  createPortal: { module: "react-dom", isDefault: false, category: "api" },
  flushSync: { module: "react-dom", isDefault: false, category: "api" },
  findDOMNode: { module: "react-dom", isDefault: false, category: "api" },
  ReactDOM: { module: "react-dom", isDefault: true, category: "namespace" },
  createRoot: { module: "react-dom/client", isDefault: false, category: "api" },
  hydrateRoot: { module: "react-dom/client", isDefault: false, category: "api" },

  // Redux Toolkit
  createSlice: { module: "@reduxjs/toolkit", isDefault: false, category: "redux" },
  configureStore: { module: "@reduxjs/toolkit", isDefault: false, category: "redux" },
  createAsyncThunk: { module: "@reduxjs/toolkit", isDefault: false, category: "redux" },
  createAction: { module: "@reduxjs/toolkit", isDefault: false, category: "redux" },
  createReducer: { module: "@reduxjs/toolkit", isDefault: false, category: "redux" },
  combineReducers: { module: "@reduxjs/toolkit", isDefault: false, category: "redux" },
  createSelector: { module: "@reduxjs/toolkit", isDefault: false, category: "redux" },
  createEntityAdapter: { module: "@reduxjs/toolkit", isDefault: false, category: "redux" },

  // React Redux
  useSelector: { module: "react-redux", isDefault: false, category: "redux" },
  useDispatch: { module: "react-redux", isDefault: false, category: "redux" },
  Provider: { module: "react-redux", isDefault: false, category: "redux" },
  connect: { module: "react-redux", isDefault: false, category: "redux" },
  shallowEqual: { module: "react-redux", isDefault: false, category: "redux" },

  // Zustand
  create: { module: "zustand", isDefault: false, category: "zustand", requiresCallCheck: true },

  // Lucide Icons (распространенные в задачах)
  Flame: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  Wrench: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  Rocket: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  Brain: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  Zap: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  Search: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  Plus: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  Trash: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  Trash2: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  Edit: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  Check: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  X: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  Heart: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  Star: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  User: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  Users: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  Settings: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  RotateCcw: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  Lock: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  Code2: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  Maximize2: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  Eye: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  ChevronDown: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  ChevronUp: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  ChevronLeft: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  ChevronRight: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  AlertCircle: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  CheckCircle2: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  FileCode: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  Wand2: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  Copy: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
};

/**
 * Безопасно удаляет комментарии и строки для чистого анализа скобок, ключевых слов и идентификаторов.
 * Использует единый регулярный проход O(N), который корректно обрабатывает URL (например, https://)
 * внутри строк и не ломает парность кавычек.
 */
export const stripCommentsAndStrings = (code) => {
  if (!code || typeof code !== "string") return "";
  return code.replace(
    /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|\/\*[\s\S]*?\*\/|\/\/.*$/gm,
    (match, str) => {
      if (str) {
        const newlines = (str.match(/\n/g) || []).length;
        return '""' + "\n".repeat(newlines);
      }
      const newlines = (match.match(/\n/g) || []).length;
      return "\n".repeat(newlines);
    }
  );
};

/**
 * Извлекает все импортированные символы из исходного кода
 */
export const extractImportedSymbols = (code) => {
  const imported = new Set();
  if (!code) return imported;

  // 1. import ... from '...'
  const importMatches = code.matchAll(/import\s+(?:type\s+)?([\s\S]*?)\s+from\s+['"][^'"]+['"]/g);
  for (const m of importMatches) {
    const clause = m[1].trim();

    // Namespace: import * as React
    const nsMatch = clause.match(/\*\s*as\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/);
    if (nsMatch) {
      imported.add(nsMatch[1]);
      continue;
    }

    // Default import: import React or import React, { ... }
    const defMatch = clause.match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)(?:\s*,|\s*$)/);
    if (defMatch && defMatch[1] !== "type") {
      imported.add(defMatch[1]);
    }

    // Named imports: { useState, useEffect as myEff }
    const namedMatch = clause.match(/\{([^}]+)\}/);
    if (namedMatch) {
      const names = namedMatch[1].split(",");
      for (const n of names) {
        const item = n.trim();
        if (!item) continue;
        const asMatch = item.match(/(?:type\s+)?([a-zA-Z_$][a-zA-Z0-9_$]*)(?:\s+as\s+([a-zA-Z_$][a-zA-Z0-9_$]*))?/);
        if (asMatch) {
          imported.add(asMatch[2] || asMatch[1]);
        }
      }
    }
  }

  // 2. const ... = require('...')
  const reqMatches = code.matchAll(/(?:const|let|var)\s+([\s\S]*?)\s*=\s*require\(['"][^'"]+['"]\)/g);
  for (const m of reqMatches) {
    const clause = m[1].trim();
    const namedMatch = clause.match(/\{([^}]+)\}/);
    if (namedMatch) {
      const names = namedMatch[1].split(",");
      for (const n of names) {
        const parts = n.split(":");
        const name = (parts[1] || parts[0]).trim();
        if (name) imported.add(name);
      }
    } else if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(clause)) {
      imported.add(clause);
    }
  }

  return imported;
};

/**
 * Извлекает все локально объявленные идентификаторы
 */
export const extractDeclaredSymbols = (code) => {
  const declared = new Set();
  if (!code) return declared;

  const clean = stripCommentsAndStrings(code);

  // 1. Переменные: const, let, var
  const varMatches = clean.matchAll(/\b(?:const|let|var)\s+([^;=\n]+)/g);
  for (const m of varMatches) {
    const declPart = m[1];
    // Деструктуризация объектов { a, b: c }
    const objMatches = declPart.matchAll(/\{([^}]+)\}/g);
    for (const om of objMatches) {
      const entries = om[1].split(",");
      for (const e of entries) {
        const item = e.split("=")[0].trim();
        const parts = item.split(":");
        const name = (parts[1] || parts[0]).trim();
        if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name)) declared.add(name);
      }
    }
    // Деструктуризация массивов [ a, b ]
    const arrMatches = declPart.matchAll(/\[([^\]]+)\]/g);
    for (const am of arrMatches) {
      const entries = am[1].split(",");
      for (const e of entries) {
        const name = e.split("=")[0].replace(/\.\.\./, "").trim();
        if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name)) declared.add(name);
      }
    }
    // Простые переменные
    const simple = declPart.replace(/\{[^}]*\}/g, "").replace(/\[[^\]]*\]/g, "");
    const names = simple.split(",");
    for (const n of names) {
      const name = n.split("=")[0].trim();
      if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name)) declared.add(name);
    }
  }

  // 2. Функции: function name(...)
  const fnMatches = clean.matchAll(/\bfunction\s*\*?\s*([a-zA-Z_$][a-zA-Z0-9_$]*)/g);
  for (const m of fnMatches) {
    if (m[1]) declared.add(m[1]);
  }

  // 3. Классы: class Name
  const classMatches = clean.matchAll(/\bclass\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g);
  for (const m of classMatches) {
    if (m[1]) declared.add(m[1]);
  }

  // 4. Параметры функций: (a, b) => ... или function(a, b)
  const paramMatches = clean.matchAll(/(?:\(([^)]*)\)\s*=>|function[^(]*\(([^)]*)\))/g);
  for (const m of paramMatches) {
    const rawParams = m[1] || m[2] || "";
    const params = rawParams.split(",");
    for (const p of params) {
      const cleanParam = p.split("=")[0].replace(/\{|\}|\[|\]|\.\.\./g, "").trim();
      const subNames = cleanParam.split(/\s*,\s*|\s*:\s*|\s+/);
      for (const sn of subNames) {
        if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(sn)) declared.add(sn);
      }
    }
  }

  // 5. Одиночный параметр стрелочной функции: x => ...
  const singleArrowMatches = clean.matchAll(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=>/g);
  for (const m of singleArrowMatches) {
    if (m[1]) declared.add(m[1]);
  }

  // 6. catch (err)
  const catchMatches = clean.matchAll(/\bcatch\s*\(\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\)/g);
  for (const m of catchMatches) {
    if (m[1]) declared.add(m[1]);
  }

  // 7. TypeScript type / interface / enum
  const tsMatches = clean.matchAll(/\b(?:type|interface|enum)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g);
  for (const m of tsMatches) {
    if (m[1]) declared.add(m[1]);
  }

  return declared;
};

/**
 * Обнаруживает повторные объявления переменных, функций, классов и типов в одной области видимости (Duplicate Declarations)
 * @param {string} code Исходный код
 * @returns {Array<{ name: string, kind: string, line: number, column: number, message: string }>}
 */
export const findDuplicateDeclarations = (code) => {
  if (!code || typeof code !== "string") return [];

  const lines = code.split("\n");
  const duplicates = [];
  const scopeStack = [new Map()];
  let inBlockComment = false;
  let inString = null;

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    const lineNum = lineIdx + 1;

    let cleanLine = "";
    for (let cIdx = 0; cIdx < line.length; cIdx++) {
      const ch = line[cIdx];
      const nextCh = line[cIdx + 1];

      if (inBlockComment) {
        if (ch === "*" && nextCh === "/") {
          inBlockComment = false;
          cIdx++;
          cleanLine += "  ";
        } else {
          cleanLine += " ";
        }
        continue;
      }

      if (inString) {
        if (ch === "\\" && nextCh) {
          cleanLine += "  ";
          cIdx++;
        } else if (ch === inString) {
          inString = null;
          cleanLine += " ";
        } else {
          cleanLine += " ";
        }
        continue;
      }

      if (ch === "/" && nextCh === "/") {
        cleanLine += " ".repeat(line.length - cIdx);
        break;
      }

      if (ch === "/" && nextCh === "*") {
        inBlockComment = true;
        cleanLine += "  ";
        cIdx++;
        continue;
      }

      if (ch === '"' || ch === "'" || ch === "`") {
        inString = ch;
        cleanLine += " ";
        continue;
      }

      cleanLine += ch;
    }

    const checkAndAdd = (name, kind, col) => {
      const currentScope = scopeStack[scopeStack.length - 1];
      if (currentScope.has(name)) {
        const prev = currentScope.get(name);
        if (prev.line === lineNum && prev.col === col) return;
        const typeNoun = kind === "type" ? "типа" : kind === "function" ? "функции" : kind === "class" ? "класса" : "идентификатора";
        duplicates.push({
          name,
          kind,
          line: lineNum,
          column: col,
          message: `Повторное объявление ${typeNoun} '${name}' (Duplicate identifier '${name}'). Ранее объявлен на стр. ${prev.line}`,
        });
      } else {
        currentScope.set(name, { line: lineNum, col, kind });
      }
    };

    // 1. type Name<...
    const typeMatches = cleanLine.matchAll(/\btype\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g);
    for (const tm of typeMatches) {
      if (tm[1]) checkAndAdd(tm[1], "type", tm.index + 1);
    }

    // 2. const, let, var
    const varMatches = cleanLine.matchAll(/\b(?:const|let|var)\s+([^;=\n]+)/g);
    for (const vm of varMatches) {
      const declPart = vm[1];
      // Деструктуризация объектов { a, b: c }
      const objMatches = declPart.matchAll(/\{([^}]+)\}/g);
      for (const om of objMatches) {
        const entries = om[1].split(",");
        for (const e of entries) {
          const item = e.split("=")[0].trim();
          const parts = item.split(":");
          const name = (parts[1] || parts[0]).trim();
          if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name)) {
            checkAndAdd(name, "variable", vm.index + 1);
          }
        }
      }
      // Деструктуризация массивов [ a, b ]
      const arrMatches = declPart.matchAll(/\[([^\]]+)\]/g);
      for (const am of arrMatches) {
        const entries = am[1].split(",");
        for (const e of entries) {
          const name = e.split("=")[0].replace(/\.\.\./, "").trim();
          if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name)) {
            checkAndAdd(name, "variable", vm.index + 1);
          }
        }
      }
      // Обычные переменные
      const simple = declPart.replace(/\{[^}]*\}/g, "").replace(/\[[^\]]*\]/g, "");
      const names = simple.split(",");
      for (const n of names) {
        const name = n.split("=")[0].trim();
        if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name)) {
          checkAndAdd(name, "variable", vm.index + 1);
        }
      }
    }

    // 3. function name(...)
    const fnMatches = cleanLine.matchAll(/\bfunction\s*\*?\s*([a-zA-Z_$][a-zA-Z0-9_$]*)/g);
    for (const fm of fnMatches) {
      if (fm[1]) checkAndAdd(fm[1], "function", fm.index + 1);
    }

    // 4. class Name
    const classMatches = cleanLine.matchAll(/\bclass\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g);
    for (const cm of classMatches) {
      if (cm[1]) checkAndAdd(cm[1], "class", cm.index + 1);
    }

    // 5. enum Name
    const enumMatches = cleanLine.matchAll(/\benum\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g);
    for (const em of enumMatches) {
      if (em[1]) checkAndAdd(em[1], "enum", em.index + 1);
    }

    // Отслеживание глубины скобок для областей видимости
    for (let i = 0; i < cleanLine.length; i++) {
      const c = cleanLine[i];
      if (c === "{") {
        scopeStack.push(new Map());
      } else if (c === "}") {
        if (scopeStack.length > 1) {
          scopeStack.pop();
        }
      }
    }
  }

  return duplicates;
};

/**
 * Находит неиспользуемые импорты в коде (Unused Imports) для приглушения их подсветки
 * @param {string} code
 * @returns {Set<string>}
 */
export const findUnusedImports = (code) => {
  const unused = new Set();
  if (!code || typeof code !== "string" || !code.trim()) return unused;

  const importedItems = [];

  // Парсим все import блоки в исходном коде (однострочные и многострочные)
  const importBlockRegex = /(?:^|\n)\s*import\s+([\s\S]*?)\s+from\s*['"][^'"]+['"]/g;
  let match;
  while ((match = importBlockRegex.exec(code)) !== null) {
    const importClause = match[1].trim();

    // 1. Default import: import React or import React, { ... }
    const defaultMatch = importClause.match(/^(?:type\s+)?([a-zA-Z_$][a-zA-Z0-9_$]*)(?:\s*,|\s*$)/);
    if (defaultMatch && defaultMatch[1] && defaultMatch[1] !== "type") {
      importedItems.push(defaultMatch[1]);
    }

    // 2. Namespace import: import * as React
    const nsMatch = importClause.match(/\*\s+as\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/);
    if (nsMatch && nsMatch[1]) {
      importedItems.push(nsMatch[1]);
    }

    // 3. Named imports: { useState, useEffect as myEff }
    const namedMatch = importClause.match(/\{([\s\S]*?)\}/);
    if (namedMatch && namedMatch[1]) {
      const parts = namedMatch[1].split(",");
      for (const part of parts) {
        const item = part.trim();
        if (!item) continue;
        const asMatch = item.match(/(?:type\s+)?([a-zA-Z_$][a-zA-Z0-9_$]*)(?:\s+as\s+([a-zA-Z_$][a-zA-Z0-9_$]*))?/);
        if (asMatch) {
          importedItems.push(asMatch[2] || asMatch[1]);
        }
      }
    }
  }

  if (importedItems.length === 0) {
    return unused;
  }

  // Очищаем код от комментариев и строк безопасно через единый проход
  const cleanCode = stripCommentsAndStrings(code);

  // Удаляем все import блоки из cleanCode, чтобы искать использование только в теле кода
  const bodyCode = cleanCode.replace(/(?:^|\n)\s*import\s+[\s\S]*?from\s*""/g, "\n");

  for (const sym of importedItems) {
    const regex = new RegExp(`\\b${sym}\\b`);
    if (!regex.test(bodyCode)) {
      unused.add(sym);
    }
  }

  return unused;
};

/**
 * Комплексный линтер JavaScript / JSX / TSX кода.
 * @param {string} code
 * @param {object} [options]
 * @param {Array<{ name: string }>} [options.files]
 * @param {string} [options.filepath]
 * @returns {{ problems: Array, errorCount: number, warningCount: number, isValid: boolean, typoMap: object, missingImportMap: object, allMissingImports: Array, unusedImports: Set<string> }}
 */
export const lintJavaScriptCode = (code, options = {}) => {
  if (!code || typeof code !== "string" || !code.trim()) {
    return {
      problems: [],
      errorCount: 0,
      warningCount: 0,
      isValid: true,
      typoMap: {},
      missingImportMap: {},
      allMissingImports: [],
      unusedImports: new Set(),
    };
  }

  const problems = [];
  const typoMap = {}; // lineNum -> problem
  const missingImportMap = {}; // lineNum -> problem
  const allMissingImports = [];
  const seenMissingSymbols = new Set();

  const lines = code.split("\n");

  // 1. Быстрая построчная проверка опечаток с использованием скомпилированного RegExp O(1)
  lines.forEach((line, lineIdx) => {
    const lineNum = lineIdx + 1;
    const trimmed = line.trim();

    // Пропуск строк, состоящих только из комментариев
    if (trimmed.startsWith("//") || trimmed.startsWith("/*") || trimmed.startsWith("*")) {
      return;
    }

    // Исключаем комментарии и строковые литералы перед проверкой опечаток
    const codePart = stripCommentsAndStrings(line);

    // Единый проход по скомпилированному мастер-регексу
    TYPO_MASTER_REGEX.lastIndex = 0;
    let match;
    while ((match = TYPO_MASTER_REGEX.exec(codePart)) !== null) {
      const matchedWord = match[0];
      const lower = matchedWord.toLowerCase();
      const correct = KEYWORD_TYPOS[lower];

      if (correct && matchedWord !== correct) {
        const col = match.index + 1;
        const problem = {
          id: `typo-${lineNum}-${col}`,
          line: lineNum,
          col,
          typo: matchedWord,
          correct,
          message: `Опечатка в ключевом слове: '${matchedWord}' вместо '${correct}'`,
          rule: "keyword-typo",
          severity: "error",
        };
        problems.push(problem);
        typoMap[lineNum] = problem;
      }
    }

    // Проверка устаревшего var (только вне комментариев)
    if (/\bvar\s+[a-zA-Z0-9_$]+/.test(codePart)) {
      problems.push({
        id: `warn-var-${lineNum}`,
        line: lineNum,
        col: codePart.indexOf("var") + 1,
        message: "Использование 'var' устарело, используйте 'let' или 'const'",
        rule: "no-var",
        severity: "warning",
      });
    }

    // Проверка прямого сравнения с NaN
    if (/===?\s*NaN\b|!==?\s*NaN\b/.test(codePart)) {
      problems.push({
        id: `err-isnan-${lineNum}`,
        line: lineNum,
        col: codePart.indexOf("NaN") + 1,
        message: "Используйте Number.isNaN() вместо прямого сравнения с NaN",
        rule: "use-isnan",
        severity: "error",
      });
    }
  });

  // 2. Статический анализ отсутствующих импортов (Missing Imports Linter)
  const importedSymbols = extractImportedSymbols(code);
  const declaredSymbols = extractDeclaredSymbols(code);

  // Добавляем файлы текущей многофайловой задачи в базу символов
  const symbolRegistry = { ...KNOWN_SYMBOLS };
  if (Array.isArray(options.files)) {
    options.files.forEach((f) => {
      if (!f || !f.name) return;
      const baseName = f.name.replace(/\.[^.]+$/, "");
      if (baseName && /^[A-Z][a-zA-Z0-9_$]*$/.test(baseName)) {
        if (!symbolRegistry[baseName]) {
          symbolRegistry[baseName] = {
            module: `./${baseName}`,
            isDefault: true,
            category: "local",
            isComponent: true,
          };
        }
      }
    });
  }

  // Проверяем использование каждого известного символа
  Object.entries(symbolRegistry).forEach(([sym, info]) => {
    // Если символ уже импортирован или объявлен локально — пропускаем
    if (importedSymbols.has(sym) || declaredSymbols.has(sym)) {
      return;
    }

    // Поиск использования символа построчно
    lines.forEach((line, lineIdx) => {
      const lineNum = lineIdx + 1;
      const trimmed = line.trim();

      // Пропуск строк комментариев и строк самого импорта
      if (
        trimmed.startsWith("//") ||
        trimmed.startsWith("/*") ||
        trimmed.startsWith("*") ||
        trimmed.startsWith("import ")
      ) {
        return;
      }

      // Исключаем комментарии и строковые литералы
      const codePart = stripCommentsAndStrings(line);

      // Быстрая проверка наличия подстроки
      if (!codePart.includes(sym)) return;

      const symRegex = new RegExp(`\\b${sym}\\b`, "g");
      let match;
      while ((match = symRegex.exec(codePart)) !== null) {
        const col = match.index + 1;
        const matchIdx = match.index;

        // 1. Проверяем, не является ли это свойством объекта (obj.useState или obj?.useState)
        const textBefore = codePart.substring(0, matchIdx).trimEnd();
        if (textBefore.endsWith(".") || textBefore.endsWith("?.")) {
          // Если это React.useState или React.memo — флагуем React, но не сам метод
          continue;
        }

        // 2. Проверяем, не является ли это ключом объекта в объявлении ({ useState: 1 })
        const textAfter = codePart.substring(matchIdx + sym.length).trimStart();
        if (textAfter.startsWith(":") && !textAfter.startsWith(":=") && !textAfter.startsWith("::")) {
          // Исключаем type annotations вида let x: useState или case value:
          if (!textBefore.endsWith("let") && !textBefore.endsWith("const") && !textBefore.endsWith("var")) {
            continue;
          }
        }

        // 3. Для Zustand 'create' требуем вызов функции create( или create<
        if (info.requiresCallCheck && !textAfter.startsWith("(") && !textAfter.startsWith("<")) {
          continue;
        }

        // 4. Для Lucide иконок требуем использование как JSX тега или компонента
        if (info.category === "icon" && !textBefore.endsWith("<") && !textBefore.endsWith("</") && !textAfter.startsWith("(") && !textAfter.startsWith("/")) {
          if (!/^[<{,\s]/.test(textBefore.slice(-1)) || !/[/>},\s]/.test(textAfter.charAt(0))) {
            continue;
          }
        }

        // Формируем диагностическое сообщение
        const importSnippet = info.isDefault
          ? `import ${sym} from '${info.module}';`
          : `import { ${sym} } from '${info.module}';`;

        const problem = {
          id: `missing-import-${lineNum}-${col}-${sym}`,
          line: lineNum,
          col,
          symbol: sym,
          module: info.module,
          isDefault: info.isDefault,
          category: info.category,
          message: `'${sym}' не импортирован. Добавьте: ${importSnippet}`,
          rule: "missing-import",
          severity: "error",
        };

        problems.push(problem);

        if (!missingImportMap[lineNum]) {
          missingImportMap[lineNum] = problem;
        }

        if (!seenMissingSymbols.has(sym)) {
          seenMissingSymbols.add(sym);
          allMissingImports.push(problem);
        }
      }
    });
  });

  // 3. Высокоточный парсер баланса скобок и кавычек с поддержкой JSX/TSX, RegExp и Template Literals
  const stack = [];
  let inBlockComment = false;
  let inString = null;
  let prevTokenChar = "";

  for (let lIdx = 0; lIdx < lines.length; lIdx++) {
    const line = lines[lIdx];
    const lineNum = lIdx + 1;

    for (let cIdx = 0; cIdx < line.length; cIdx++) {
      const ch = line[cIdx];
      const nextCh = line[cIdx + 1];

      // Многострочный комментарий
      if (inBlockComment) {
        if (ch === "*" && nextCh === "/") {
          inBlockComment = false;
          cIdx++;
        }
        continue;
      }

      // Начало однострочного комментария вне строк
      if (!inString && ch === "/" && nextCh === "/") {
        break; // остаток строки — комментарий
      }

      // Начало многострочного комментария вне строк
      if (!inString && ch === "/" && nextCh === "*") {
        inBlockComment = true;
        cIdx++;
        continue;
      }

      // Строковый литерал
      if (inString) {
        if (ch === "\\") {
          cIdx++; // пропускаем экранированный символ
          continue;
        }
        // Интерполяция в шаблонных строках: ${...}
        if (inString === "`" && ch === "$" && nextCh === "{") {
          stack.push({ char: "${", line: lineNum, col: cIdx + 1, isTemplateExpr: true });
          inString = null;
          cIdx++;
          continue;
        }
        if (ch === inString) {
          inString = null;
        }
        continue;
      }

      // Проверка на литерал регулярного выражения: /pattern/flags
      if (ch === "/" && !inString) {
        const isRegexStart =
          /^[=(,\[!?:;&|~^+\-*\/]\s*$/.test(prevTokenChar) ||
          prevTokenChar === "" ||
          /\b(return|typeof|instanceof|case|delete|void|throw|yield|await)$/.test(prevTokenChar);

        if (isRegexStart && nextCh !== "/" && nextCh !== "*") {
          let rIdx = cIdx + 1;
          let inCharClass = false;
          let closed = false;

          while (rIdx < line.length) {
            const rc = line[rIdx];
            if (rc === "\\") {
              rIdx += 2;
              continue;
            }
            if (rc === "[") inCharClass = true;
            else if (rc === "]") inCharClass = false;
            else if (rc === "/" && !inCharClass) {
              closed = true;
              break;
            }
            rIdx++;
          }

          if (closed) {
            cIdx = rIdx; // пропускаем литерал RegExp целиком
            prevTokenChar = "regex";
            continue;
          }
        }
      }

      if (!/\s/.test(ch)) {
        prevTokenChar = ch;
      }

      // Начало строкового литерала
      if (ch === "'" || ch === '"' || ch === "`") {
        inString = ch;
        continue;
      }

      // Проверка открывающих скобок
      if (ch === "{" || ch === "(" || ch === "[") {
        stack.push({ char: ch, line: lineNum, col: cIdx + 1 });
      } else if (ch === "}" || ch === ")" || ch === "]") {
        // Закрытие интерполяции шаблонной строки: }
        if (ch === "}" && stack.length > 0 && stack[stack.length - 1].isTemplateExpr) {
          stack.pop();
          inString = "`";
          continue;
        }

        const expected = ch === "}" ? "{" : ch === ")" ? "(" : "[";
        if (stack.length === 0 || stack[stack.length - 1].char !== expected) {
          if (!typoMap[lineNum]) {
            problems.push({
              id: `bracket-${lineNum}-${cIdx}`,
              line: lineNum,
              col: cIdx + 1,
              message: `Неожиданная закрывающая скобка '${ch}'`,
              rule: "syntax-bracket",
              severity: "error",
            });
          }
        } else {
          stack.pop();
        }
      }
    }
  }

  // Проверка незакрытых скобок
  while (stack.length > 0) {
    const unclosed = stack.pop();
    if (!typoMap[unclosed.line]) {
      problems.push({
        id: `unclosed-${unclosed.line}-${unclosed.col}`,
        line: unclosed.line,
        col: unclosed.col,
        message: `Не закрыта скобка '${unclosed.char}'`,
        rule: "syntax-unclosed",
        severity: "error",
      });
    }
  }

  // 4. Поиск повторных объявлений переменных, функций, классов и типов (Duplicate Identifier / Variable Redeclaration)
  const duplicateDeclarations = findDuplicateDeclarations(code);
  for (const dup of duplicateDeclarations) {
    problems.push({
      id: `duplicate-${dup.line}-${dup.column}-${dup.name}`,
      line: dup.line,
      col: dup.column,
      message: dup.message,
      rule: "duplicate-identifier",
      severity: "error",
    });
  }

  // 5. Проверка типов TypeScript (Type Mismatches & Return Type Mismatches)
  const tsTypeProblems = checkTypeScriptTypes(code);
  for (const tsProb of tsTypeProblems) {
    problems.push(tsProb);
  }

  // 6. Валидация обязательных пропсов компонентов в JSX (Required Props & Accessibility)
  const propsProblems = checkComponentProps(code, options);
  for (const propProb of propsProblems) {
    problems.push(propProb);
  }

  const errorCount = problems.filter((p) => p.severity === "error").length;
  const warningCount = problems.filter((p) => p.severity === "warning").length;
  const unusedImports = findUnusedImports(code);

  return {
    problems,
    errorCount,
    warningCount,
    isValid: errorCount === 0,
    typoMap,
    missingImportMap,
    allMissingImports,
    unusedImports,
  };
};

/**
 * Автоматическое исправление конкретной опечатки в коде
 */
export const fixTypoInCode = (code, lineNum, typo, correct) => {
  const lines = code.split("\n");
  if (lineNum - 1 < lines.length) {
    const regex = new RegExp(`\\b${typo}\\b`, "i");
    lines[lineNum - 1] = lines[lineNum - 1].replace(regex, correct);
    return lines.join("\n");
  }
  return code;
};

/**
 * Автоматическое добавление отсутствующего импорта в код
 */
export const fixMissingImportInCode = (code, symbol, moduleSpecifier, isDefault = false) => {
  const res = addImportToFile(code, symbol, moduleSpecifier, isDefault);
  return res.newCode;
};
