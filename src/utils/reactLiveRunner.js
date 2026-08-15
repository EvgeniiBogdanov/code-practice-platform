/**
 * reactLiveRunner.js
 * Рантайм-компиляция и безопасное выполнение React / TSX / JSX компонентов в браузере.
 * 
 * Особенности:
 * 1. Транспиляция JSX, TypeScript и ES-модулей с помощью sucrase (<1ms).
 * 2. Виртуальная модульная система с поддержкой:
 *    - react (все хуки и функции)
 *    - react-dom / react-dom/client (включая createPortal)
 *    - lucide-react (все доступные иконки)
 *    - react-redux & @reduxjs/toolkit (configureStore, createSlice, etc.)
 *    - zustand
 *    - Относительных импортов многофайловых задач (./reducer, ./store, etc.)
 * 3. Автоматическое извлечение корневого React-компонента (export default, App, Solution, etc.).
 * 4. Защита от сбоев и детальная локализация ошибок синтаксиса.
 */

import React, * as ReactHooks from "react";
import * as ReactDOM from "react-dom";
import * as ReactJsxRuntime from "react/jsx-runtime";
import * as ReactJsxDevRuntime from "react/jsx-dev-runtime";
import * as LucideIcons from "lucide-react";
import * as ReactRedux from "react-redux";
import * as ReduxToolkit from "@reduxjs/toolkit";
import * as ZustandMiddleware from "zustand/middleware";
import { create as createZustandStore, useStore as useZustandStore } from "zustand";
import { transform } from "sucrase";
import { peekCachedSolution } from "../services/storage/index.js";

const ZustandModule = {
  create: createZustandStore,
  useStore: useZustandStore,
  default: createZustandStore,
};

const activeTimerIds = new Set();
const activeIntervalIds = new Set();

/**
 * Очищает все активные таймауты и интервалы, созданные в песочнице
 */
export function clearLiveSandboxTimers() {
  activeTimerIds.forEach((id) => clearTimeout(id));
  activeTimerIds.clear();
  activeIntervalIds.forEach((id) => clearInterval(id));
  activeIntervalIds.clear();
}

const sandboxSetTimeout = (fn, delay, ...args) => {
  const id = setTimeout(() => {
    activeTimerIds.delete(id);
    if (typeof fn === "function") fn(...args);
  }, delay);
  activeTimerIds.add(id);
  return id;
};

const sandboxClearTimeout = (id) => {
  activeTimerIds.delete(id);
  clearTimeout(id);
};

const sandboxSetInterval = (fn, delay, ...args) => {
  const id = setInterval(fn, delay, ...args);
  activeIntervalIds.add(id);
  return id;
};

const sandboxClearInterval = (id) => {
  activeIntervalIds.delete(id);
  clearInterval(id);
};

/**
 * Инструментирует циклы guard-таймаутами для защиты от зависаний (Loop Protector)
 */
export function normalizeAndProtectLoops(code) {
  if (!code || typeof code !== "string") return code;
  let loopId = 0;

  // 1. Оборачиваем однострочные циклы: while (...) stmt; -> while (...) { stmt; }
  let transformed = code.replace(
    /\b(while|for)\s*\(([^)]*)\)\s*(?!\{)([^{;\n]+;)/g,
    (match, type, cond, stmt) => {
      return `${type}(${cond}) { ${stmt} }`;
    }
  );

  // 2. Внедряем guard в циклы while и for
  transformed = transformed.replace(
    /\b(while|for)\s*\(([^)]*)\)\s*\{/g,
    (match, type, condition) => {
      const id = ++loopId;
      return `let _lt_${id} = Date.now(), _lc_${id} = 0; ${type}(${condition}) { if (++_lc_${id} > 200000 && Date.now() - _lt_${id} > 1500) { throw new Error("Обнаружен потенциальный бесконечный цикл (таймаут 1.5 сек)"); }`;
    }
  );

  // 3. Внедряем guard в циклы do-while
  transformed = transformed.replace(/\bdo\s*\{/g, () => {
    const id = ++loopId;
    return `let _lt_${id} = Date.now(), _lc_${id} = 0; do { if (++_lc_${id} > 200000 && Date.now() - _lt_${id} > 1500) { throw new Error("Обнаружен потенциальный бесконечный цикл (таймаут 1.5 сек)"); }`;
  });

  return transformed;
}

/**
 * Транспилирует строку исходного кода (JSX / TSX / JS / TS) в исполняемый JS.
 * @param {string} code
 * @param {string} filename
 * @returns {{ code: string | null, error: Error | null }}
 */
export function transpileCode(code, filename = "index.jsx") {
  if (!code || typeof code !== "string" || !code.trim()) {
    return { code: null, error: null };
  }

  try {
    const protectedCode = normalizeAndProtectLoops(code);
    const isTs = filename.endsWith(".ts") || filename.endsWith(".tsx");
    const transforms = ["jsx", "imports"];
    if (isTs) {
      transforms.push("typescript");
    }

    const output = transform(protectedCode, {
      transforms,
      jsxRuntime: "automatic",
      production: true,
    });

    // Защита от ошибок ASI (Automatic Semicolon Insertion) при деструктурирующих экспортах
    const safeCode = (output.code || "").replace(/\n(\s*)\(\s*\{/g, "\n$1;({");

    return { code: safeCode, error: null };
  } catch (err) {
    return { code: null, error: err };
  }
}

/**
 * Собирает актуальную карту файлов задачи, объединяя базовый код,
 * кэш изменений из IndexedDB / L1-кэша и текущее несохранённое состояние редактора.
 * 
 * @param {Array<{ name: string, filepath?: string, code: string }>} files
 * @param {string} storagePrefix 'cand' | 'sol'
 * @param {string|number} taskId
 * @param {number} activeFileIdx
 * @param {string} currentEditingCode
 * @param {number} [variantIdx]
 * @returns {Record<string, { name: string, code: string }>}
 */
export function buildFilesMap(
  files = [],
  storagePrefix = "cand",
  taskId = "",
  activeFileIdx = 0,
  currentEditingCode = undefined,
  variantIdx = 0
) {
  const map = {};

  if (!Array.isArray(files) || files.length === 0) {
    return map;
  }

  files.forEach((file, idx) => {
    const fileName = file.name || `file_${idx}.jsx`;
    
    // Вычисляем storage taskId для данного файла
    let fileTaskId;
    if (storagePrefix === "sol") {
      fileTaskId = `sol_${taskId}_${variantIdx}_file_${idx}`;
    } else {
      fileTaskId = `cand_${taskId}_file_${idx}`;
    }

    let code = file.code || "";

    // 1. Проверяем L1 / IndexedDB кэш решений
    const cached = peekCachedSolution(fileTaskId);
    if (cached !== null && typeof cached === "string") {
      code = cached;
    }

    // 2. Если этот файл сейчас открыт и редактируется прямо в инпуте, берем свежий код
    if (idx === activeFileIdx && typeof currentEditingCode === "string") {
      code = currentEditingCode;
    }

    map[fileName] = {
      name: fileName,
      code,
    };
  });

  return map;
}

/**
 * Компилирует и выполняет виртуальный проект React компонентов.
 * Возвращает React-компонент, готовый для отображения в песочнице.
 * 
 * @param {Record<string, { name: string, code: string }>} filesMap
 * @param {string} [entryFileName]
 * @returns {{ Component: React.ComponentType | null, error: Error | null }}
 */
export function compileReactProject(filesMap, entryFileName) {
  const fileKeys = Object.keys(filesMap);
  if (fileKeys.length === 0) {
    return { Component: null, error: null };
  }

  // Определение точки входа: всегда приоритетно запускаем корневой компонент приложения (index, App, main)
  let entryKey =
    fileKeys.find((k) => /^(index|app|main)\.(jsx|tsx)$/i.test(k)) ||
    fileKeys.find((k) => /^(index|app|main)\.(js|ts)$/i.test(k)) ||
    (entryFileName && filesMap[entryFileName] ? entryFileName : null) ||
    fileKeys.find((k) => /\.(jsx|tsx)$/i.test(k)) ||
    fileKeys[0];

  const moduleCache = new Map();

  function requireModule(modulePath) {
    // 1. Стандартные внешние зависимости платформы
    if (modulePath === "react") {
      return { ...React, ...ReactHooks, default: React };
    }
    if (modulePath === "react/jsx-runtime") {
      return { ...ReactJsxRuntime, default: ReactJsxRuntime };
    }
    if (modulePath === "react/jsx-dev-runtime") {
      return { ...ReactJsxDevRuntime, default: ReactJsxDevRuntime };
    }
    if (modulePath === "react-dom" || modulePath === "react-dom/client") {
      return { ...ReactDOM, default: ReactDOM };
    }
    if (modulePath === "lucide-react") {
      return { ...LucideIcons, default: LucideIcons };
    }
    if (modulePath === "react-redux") {
      return { ...ReactRedux, default: ReactRedux };
    }
    if (modulePath === "@reduxjs/toolkit") {
      return { ...ReduxToolkit, default: ReduxToolkit };
    }
    if (modulePath === "zustand") {
      return ZustandModule;
    }
    if (modulePath === "zustand/middleware") {
      return { ...ZustandMiddleware, default: ZustandMiddleware };
    }

    // Игнорируем импорты стилей
    if (modulePath.endsWith(".css") || modulePath.endsWith(".scss") || modulePath.endsWith(".less")) {
      return {};
    }

    // 2. Относительные локальные модули (./reducer, ./useFetchUsers, etc.)
    const cleanPath = modulePath.replace(/^(\.\/|\.\.\/)+/, "");
    const cleanPathWithoutExt = cleanPath.replace(/\.[^.]+$/, "");

    const matchedKey = fileKeys.find((k) => {
      const kBase = k.replace(/\.[^.]+$/, "");
      return (
        k === cleanPath ||
        kBase === cleanPath ||
        kBase === cleanPathWithoutExt ||
        k.endsWith(`/${cleanPath}`) ||
        k.endsWith(`/${cleanPathWithoutExt}`)
      );
    });

    if (!matchedKey) {
      // Проверка на импорт иконки напрямую или глобального символа
      if (LucideIcons[modulePath]) {
        return LucideIcons[modulePath];
      }
      throw new Error(`Модуль не найден: "${modulePath}"`);
    }

    if (moduleCache.has(matchedKey)) {
      return moduleCache.get(matchedKey).exports;
    }

    const targetFile = filesMap[matchedKey];
    const { code: transformedCode, error: transpileErr } = transpileCode(
      targetFile.code,
      matchedKey
    );

    if (transpileErr) {
      throw transpileErr;
    }

    const exports = {};
    const module = { exports };
    moduleCache.set(matchedKey, module);

    if (!transformedCode || !transformedCode.trim()) {
      return module.exports;
    }

    // Создаем изолированную функцию исполнения без инъекции глобальных хуков React
    const fn = new Function(
      "require",
      "exports",
      "module",
      "setTimeout",
      "clearTimeout",
      "setInterval",
      "clearInterval",
      `
        ${transformedCode};
        if (module.exports && module.exports.default) return module.exports.default;
        if (exports && exports.default) return exports.default;
        if (module.exports && typeof module.exports === 'function') return module.exports;
        const namedExp = Object.values(module.exports || exports).find(v => typeof v === 'function');
        if (namedExp) return namedExp;
        if (typeof App !== 'undefined' && typeof App === 'function') return App;
        if (typeof Solution !== 'undefined' && typeof Solution === 'function') return Solution;
        if (typeof Component !== 'undefined' && typeof Component === 'function') return Component;
        if (typeof TaskComponent !== 'undefined' && typeof TaskComponent === 'function') return TaskComponent;
        return null;
      `
    );

    const evaluated = fn(
      requireModule,
      exports,
      module,
      sandboxSetTimeout,
      sandboxClearTimeout,
      sandboxSetInterval,
      sandboxClearInterval
    );

    if (evaluated && !module.exports.default) {
      module.exports.default = evaluated;
    }

    return module.exports;
  }

  try {
    const entryModule = requireModule(`./${entryKey}`);
    let FoundComponent =
      entryModule?.default ||
      (typeof entryModule === "function" ? entryModule : null) ||
      Object.values(entryModule || {}).find((v) => typeof v === "function") ||
      null;

    return { Component: FoundComponent, error: null };
  } catch (err) {
    return { Component: null, error: err };
  }
}
