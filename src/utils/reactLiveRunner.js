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
import * as ReactDOMClient from "react-dom/client";
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

// Регистрируем изолированный рантайм для песочницы iframe
if (typeof window !== "undefined") {
  window.__SANDBOX_RUNTIME__ = {
    React,
    ReactHooks,
    ReactDOM,
    ReactDOMClient,
    ReactJsxRuntime,
    ReactJsxDevRuntime,
    LucideIcons,
    ReactRedux,
    ReduxToolkit,
    ZustandModule,
    ZustandMiddleware,
  };
}

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

/**
 * Генерирует изолированный HTML документ для песочницы iframe
 * 
 * @param {Object} options
 * @param {Record<string, { name: string, code: string }>} options.filesMap
 * @param {string} [options.entryFileName]
 * @param {string} [options.theme] 'light' | 'dark'
 * @returns {{ srcDoc: string | null, error: Error | null }}
 */
export function buildSandboxIframeSrcDoc({ filesMap = {}, entryFileName = "", theme = "dark" }) {
  const fileKeys = Object.keys(filesMap);
  if (fileKeys.length === 0) {
    return { srcDoc: null, error: null };
  }

  // Определение точки входа: всегда приоритетно запускаем корневой компонент приложения (index, App, main)
  let entryKey =
    fileKeys.find((k) => /^(index|app|main)\.(jsx|tsx)$/i.test(k)) ||
    fileKeys.find((k) => /^(index|app|main)\.(js|ts)$/i.test(k)) ||
    (entryFileName && filesMap[entryFileName] ? entryFileName : null) ||
    fileKeys.find((k) => /\.(jsx|tsx)$/i.test(k)) ||
    fileKeys[0];

  const transpiledModules = {};
  for (const key of fileKeys) {
    const fileObj = filesMap[key];
    const { code: transformedCode, error: transpileErr } = transpileCode(
      fileObj.code,
      key
    );
    if (transpileErr) {
      return { srcDoc: null, error: transpileErr };
    }
    transpiledModules[key] = transformedCode || "";
  }

  const isLight = theme === "light";
  const bgColor = isLight ? "#ffffff" : "#141414";
  const textColor = isLight ? "#1e293b" : "#cccccc";
  const borderColor = isLight ? "#e2e8f0" : "rgba(255, 255, 255, 0.08)";
  const inputBg = isLight ? "#f8fafc" : "#1e1e1e";
  const inputBorder = isLight ? "#cbd5e1" : "rgba(255, 255, 255, 0.12)";
  const btnBg = isLight ? "#f3f4f6" : "#222222";
  const btnText = isLight ? "#1f2937" : "#e5e5e5";
  const btnBorder = isLight ? "#d1d5db" : "rgba(255, 255, 255, 0.1)";
  const btnHoverBg = isLight ? "#e5e7eb" : "#2d2d2d";
  const errorBg = isLight ? "rgba(239, 68, 68, 0.08)" : "rgba(239, 68, 68, 0.12)";
  const errorBorder = isLight ? "rgba(239, 68, 68, 0.3)" : "rgba(239, 68, 68, 0.4)";
  const errorText = isLight ? "#991b1b" : "#fca5a5";

  const srcDoc = `<!DOCTYPE html>
<html lang="ru" data-theme="${isLight ? "light" : "dark"}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    :root {
      color-scheme: ${isLight ? "light" : "dark"};
      --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      --bg: ${bgColor};
      --text: ${textColor};
      --border: ${borderColor};
      --accent: #3b82f6;
    }
    * {
      box-sizing: border-box;
    }
    html, body {
      margin: 0;
      padding: 0;
      background: var(--bg);
      color: var(--text);
      font-family: var(--font-sans);
      font-size: 14px;
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
      overflow: hidden;
      border: none;
      outline: none;
    }
    body {
      padding: 24px;
      min-height: auto;
      height: auto;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 12px;
      width: 100%;
      border: none;
      outline: none;
    }
    #root {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 12px;
      min-height: auto;
      border: none;
      outline: none;
    }
    input, select, textarea, button {
      font-family: inherit;
      font-size: 13.5px;
      line-height: 1.3;
      box-sizing: border-box;
    }
    input:not([type="checkbox"]):not([type="radio"]):not([type="color"]):not([type="range"]):not([type="file"]),
    input:not([type]),
    input[type="text"],
    input[type="search"],
    input[type="password"],
    input[type="email"],
    input[type="number"],
    input[type="date"],
    input[type="time"],
    input[type="datetime-local"],
    input[type="month"],
    input[type="week"],
    input[type="tel"],
    input[type="url"],
    textarea {
      display: inline-block;
      vertical-align: middle;
      box-sizing: border-box;
      width: auto;
      max-width: 100%;
      padding: 6px 10px;
      height: 34px;
      line-height: 1.3;
      color-scheme: ${isLight ? "light" : "dark"};
      background-color: ${inputBg};
      border: 1px solid ${inputBorder};
      border-radius: 6px;
      color: var(--text);
      font-family: var(--font-sans);
      font-size: 13.5px;
      outline: none;
      transition: border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
    }
    input::placeholder,
    textarea::placeholder {
      color: ${isLight ? "#94a3b8" : "rgba(255, 255, 255, 0.45)"};
      opacity: 1;
    }
    input:not([type="checkbox"]):not([type="radio"]):hover,
    textarea:hover {
      border-color: ${isLight ? "#94a3b8" : "rgba(255, 255, 255, 0.28)"};
      background-color: ${isLight ? "#f1f5f9" : "#242424"};
    }
    input:not([type="checkbox"]):not([type="radio"]):focus,
    textarea:focus {
      border-color: var(--accent);
      background-color: ${isLight ? "#ffffff" : "#262626"};
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25);
    }
    textarea {
      resize: vertical;
      min-height: 72px;
      height: auto;
      line-height: 1.45;
    }
    select {
      display: inline-block;
      vertical-align: middle;
      box-sizing: border-box;
      width: auto;
      min-width: 140px;
      height: 34px;
      line-height: 1.3;
      padding: 6px 30px 6px 10px;
      color-scheme: ${isLight ? "light" : "dark"};
      background-color: ${inputBg};
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${isLight ? "%23374151" : "rgba(255,255,255,0.75)"}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>');
      background-repeat: no-repeat;
      background-position: right 10px center;
      background-size: 12px 12px;
      border: 1px solid ${inputBorder};
      border-radius: 6px;
      color: var(--text);
      font-family: var(--font-sans);
      font-size: 13.5px;
      cursor: pointer;
      outline: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      transition: border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
    }
    select:hover {
      border-color: ${isLight ? "#94a3b8" : "rgba(255, 255, 255, 0.28)"};
      background-color: ${isLight ? "#f1f5f9" : "#242424"};
    }
    select:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25);
    }
    select option {
      background-color: ${isLight ? "#ffffff" : "#252525"};
      color: var(--text);
      padding: 8px 12px;
    }
    input[type="checkbox"],
    input[type="radio"] {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      display: inline-block;
      vertical-align: middle;
      width: 16px;
      height: 16px;
      min-width: 16px;
      min-height: 16px;
      margin: 0 6px 0 0;
      color-scheme: ${isLight ? "light" : "dark"};
      background-color: ${inputBg};
      border: 1px solid ${inputBorder};
      cursor: pointer;
      outline: none;
      transition: background-color 0.15s ease, border-color 0.15s ease;
    }
    input[type="checkbox"] {
      border-radius: 4px;
    }
    input[type="radio"] {
      border-radius: 50%;
    }
    input[type="checkbox"]:hover,
    input[type="radio"]:hover {
      border-color: ${isLight ? "#64748b" : "rgba(255, 255, 255, 0.4)"};
    }
    input[type="checkbox"]:checked {
      background-color: var(--accent);
      border-color: var(--accent);
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>');
      background-position: center;
      background-repeat: no-repeat;
    }
    input[type="radio"]:checked {
      background-color: var(--accent);
      border-color: var(--accent);
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 24 24" fill="white"><circle cx="12" cy="12" r="12"/></svg>');
      background-position: center;
      background-repeat: no-repeat;
    }
    button, input[type="button"], input[type="submit"], input[type="reset"] {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      vertical-align: middle;
      gap: 6px;
      padding: 6px 14px;
      height: 34px;
      border-radius: 6px;
      border: 1px solid ${btnBorder};
      background: ${btnBg};
      color: ${btnText};
      font-family: var(--font-sans);
      font-size: 13px;
      font-weight: 500;
      line-height: 1.3;
      cursor: pointer;
      user-select: none;
      outline: none;
      transition: opacity 0.15s ease, background-color 0.15s ease, border-color 0.15s ease, transform 0.1s ease;
    }
    button:hover, input[type="button"]:hover, input[type="submit"]:hover, input[type="reset"]:hover {
      background: ${btnHoverBg};
      border-color: ${isLight ? "#9ca3af" : "rgba(255, 255, 255, 0.25)"};
    }
    button:active, input[type="button"]:active, input[type="submit"]:active, input[type="reset"]:active {
      transform: translateY(0.5px);
    }
    button:focus-visible, input[type="button"]:focus-visible, input[type="submit"]:focus-visible {
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25);
    }
    button:disabled, input:disabled, textarea:disabled, select:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }
    form {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
    }
    ul, ol {
      padding-left: 20px;
      margin: 8px 0;
    }
    li {
      margin-bottom: 4px;
    }
    .sandbox-error-card {
      margin: 12px 0;
      padding: 16px;
      border-radius: 8px;
      background: ${errorBg};
      border: 1px solid ${errorBorder};
      color: var(--text);
    }
    .sandbox-error-title {
      font-weight: 600;
      font-size: 14px;
      color: #ef4444;
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 8px;
    }
    .sandbox-error-msg {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 12.5px;
      white-space: pre-wrap;
      word-break: break-word;
      background: rgba(0, 0, 0, 0.06);
      padding: 8px 12px;
      border-radius: 6px;
      color: ${errorText};
      line-height: 1.45;
    }
    .sandbox-error-hint {
      margin-top: 10px;
      font-size: 12px;
      color: ${isLight ? "#64748b" : "#94a3b8"};
    }
    .sandbox-retry-btn {
      margin-top: 12px;
      background: #3b82f6;
      color: #ffffff;
      padding: 6px 12px;
      font-size: 12px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      font-weight: 500;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script>
    (function() {
      function escapeHtml(str) {
        return String(str || '')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      }

      function renderError(err) {
        var root = document.getElementById('root');
        if (!root) return;
        var msg = err && err.message ? err.message : String(err);
        root.innerHTML = '<div class="sandbox-error-card">' +
          '<div class="sandbox-error-title">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>' +
            '<span>Ошибка выполнения React компонента</span>' +
          '</div>' +
          '<div class="sandbox-error-msg">' + escapeHtml(msg) + '</div>' +
          '<div class="sandbox-error-hint">Или исправьте логику во вкладке «Код».</div>' +
          '<button class="sandbox-retry-btn" onclick="window.location.reload()">' +
            '<span>Попробовать снова</span>' +
          '</button>' +
        '</div>';
      }

      window.onerror = function(msg, src, lineno, colno, error) {
        renderError(error || msg);
        return true;
      };

      window.onunhandledrejection = function(e) {
        renderError(e.reason || 'Unhandled Promise Rejection');
        if (e && typeof e.preventDefault === 'function') e.preventDefault();
      };

      try {
        var runtime = window.parent && window.parent.__SANDBOX_RUNTIME__;
        if (!runtime) {
          throw new Error("Песочница не смогла инициализировать рантайм React");
        }

        var React = runtime.React;
        var ReactHooks = runtime.ReactHooks;
        var ReactDOM = runtime.ReactDOM;
        var ReactDOMClient = runtime.ReactDOMClient || runtime.ReactDOM;
        var ReactJsxRuntime = runtime.ReactJsxRuntime;
        var ReactJsxDevRuntime = runtime.ReactJsxDevRuntime;
        var LucideIcons = runtime.LucideIcons;
        var ReactRedux = runtime.ReactRedux;
        var ReduxToolkit = runtime.ReduxToolkit;
        var ZustandModule = runtime.ZustandModule;
        var ZustandMiddleware = runtime.ZustandMiddleware;

        // Custom ErrorBoundary inside React tree
        var IframeErrorBoundary = (function(_super) {
          function IframeErrorBoundary(props) {
            var _this = _super.call(this, props) || this;
            _this.state = { hasError: false, error: null };
            return _this;
          }
          IframeErrorBoundary.prototype = Object.create(_super.prototype);
          IframeErrorBoundary.prototype.constructor = IframeErrorBoundary;
          IframeErrorBoundary.getDerivedStateFromError = function(error) {
            return { hasError: true, error: error };
          };
          IframeErrorBoundary.prototype.componentDidCatch = function(error) {
            // Error safely contained inside iframe
          };
          IframeErrorBoundary.prototype.render = function() {
            var _this = this;
            if (this.state.hasError) {
              var msg = (this.state.error && this.state.error.message) ? this.state.error.message : String(this.state.error);
              return React.createElement('div', { className: 'sandbox-error-card' },
                React.createElement('div', { className: 'sandbox-error-title' },
                  React.createElement('span', null, 'Ошибка выполнения React компонента')
                ),
                React.createElement('div', { className: 'sandbox-error-msg' }, msg),
                React.createElement('div', { className: 'sandbox-error-hint' }, 'Или исправьте логику во вкладке «Код».'),
                React.createElement('button', {
                  className: 'sandbox-retry-btn',
                  onClick: function() { _this.setState({ hasError: false, error: null }); }
                }, 'Попробовать снова')
              );
            }
            return this.props.children;
          };
          return IframeErrorBoundary;
        })(React.Component);

        var activeTimers = new Set();
        var activeIntervals = new Set();
        var customSetTimeout = function(fn, delay) {
          var args = [];
          for (var i = 2; i < arguments.length; i++) args.push(arguments[i]);
          var id = setTimeout(function() {
            activeTimers.delete(id);
            if (typeof fn === 'function') fn.apply(null, args);
          }, delay);
          activeTimers.add(id);
          return id;
        };
        var customClearTimeout = function(id) {
          activeTimers.delete(id);
          clearTimeout(id);
        };
        var customSetInterval = function(fn, delay) {
          var args = [];
          for (var i = 2; i < arguments.length; i++) args.push(arguments[i]);
          var id = setInterval(function() {
            if (typeof fn === 'function') fn.apply(null, args);
          }, delay);
          activeIntervals.add(id);
          return id;
        };
        var customClearInterval = function(id) {
          activeIntervals.delete(id);
          clearInterval(id);
        };

        var modulesCode = ${JSON.stringify(transpiledModules).replace(/<\/script/gi, "<\\/script")};
        var fileKeys = Object.keys(modulesCode);
        var moduleCache = new Map();

        function requireModule(modulePath) {
          if (modulePath === 'react') return Object.assign({}, React, ReactHooks, { default: React });
          if (modulePath === 'react/jsx-runtime') return Object.assign({}, ReactJsxRuntime, { default: ReactJsxRuntime });
          if (modulePath === 'react/jsx-dev-runtime') return Object.assign({}, ReactJsxDevRuntime, { default: ReactJsxDevRuntime });
          if (modulePath === 'react-dom/client') return Object.assign({}, ReactDOMClient, { default: ReactDOMClient });
          if (modulePath === 'react-dom') return Object.assign({}, ReactDOM, { default: ReactDOM });
          if (modulePath === 'lucide-react') return Object.assign({}, LucideIcons, { default: LucideIcons });
          if (modulePath === 'react-redux') return Object.assign({}, ReactRedux, { default: ReactRedux });
          if (modulePath === '@reduxjs/toolkit') return Object.assign({}, ReduxToolkit, { default: ReduxToolkit });
          if (modulePath === 'zustand') return ZustandModule;
          if (modulePath === 'zustand/middleware') return Object.assign({}, ZustandMiddleware, { default: ZustandMiddleware });
          if (modulePath.endsWith('.css') || modulePath.endsWith('.scss') || modulePath.endsWith('.less')) return {};

          var cleanPath = modulePath.replace(/^(\\.\\/|\\.\\.\\/)+/, '');
          var cleanPathWithoutExt = cleanPath.replace(/\\.[^.]+$/, '');
          var matchedKey = fileKeys.find(function(k) {
            var kBase = k.replace(/\\.[^.]+$/, '');
            return k === cleanPath || kBase === cleanPath || kBase === cleanPathWithoutExt || k.endsWith('/' + cleanPath) || k.endsWith('/' + cleanPathWithoutExt);
          });

          if (!matchedKey) {
            if (LucideIcons[modulePath]) return LucideIcons[modulePath];
            throw new Error('Модуль не найден: "' + modulePath + '"');
          }

          if (moduleCache.has(matchedKey)) {
            return moduleCache.get(matchedKey).exports;
          }

          var code = modulesCode[matchedKey];
          var exports = {};
          var module = { exports: exports };
          moduleCache.set(matchedKey, module);

          if (!code || !code.trim()) {
            return module.exports;
          }

          var fn = new Function(
            'require', 'exports', 'module', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval',
            code + ';\\n' +
            'if (module.exports && module.exports.default) return module.exports.default;\\n' +
            'if (exports && exports.default) return exports.default;\\n' +
            'if (module.exports && typeof module.exports === "function") return module.exports;\\n' +
            'var namedExp = Object.values(module.exports || exports).find(function(v) { return typeof v === "function"; });\\n' +
            'if (namedExp) return namedExp;\\n' +
            'if (typeof App !== "undefined" && typeof App === "function") return App;\\n' +
            'if (typeof Solution !== "undefined" && typeof Solution === "function") return Solution;\\n' +
            'if (typeof Component !== "undefined" && typeof Component === "function") return Component;\\n' +
            'if (typeof TaskComponent !== "undefined" && typeof TaskComponent === "function") return TaskComponent;\\n' +
            'return null;'
          );

          var evaluated = fn(requireModule, exports, module, customSetTimeout, customClearTimeout, customSetInterval, customClearInterval);
          if (evaluated && !module.exports.default) {
            module.exports.default = evaluated;
          }
          return module.exports;
        }

        var entryKey = ${JSON.stringify(entryKey)};
        var entryModule = requireModule('./' + entryKey);
        var LiveComponent = (entryModule && entryModule.default) || (typeof entryModule === 'function' ? entryModule : null) || Object.values(entryModule || {}).find(function(v) { return typeof v === 'function'; });
        if (!LiveComponent) {
          document.getElementById('root').innerHTML = '<div style="padding: 24px; text-align: center; color: #94a3b8;">Экспортируйте React компонент по умолчанию (<code>export default function App() { ... }</code>), чтобы увидеть результат.</div>';
          notifyHeight();
          return;
        }

        var createRootFn = (ReactDOMClient && ReactDOMClient.createRoot) || (ReactDOM && ReactDOM.createRoot);
        var root = createRootFn(document.getElementById('root'));
        root.render(
          React.createElement(IframeErrorBoundary, null,
            React.createElement(LiveComponent)
          )
        );

        // Динамическое измерение реальной высоты контента задачи и отправка родителю
        function notifyHeight() {
          try {
            var rootEl = document.getElementById('root');
            var contentHeight = 0;
            if (rootEl) {
              var rootRect = rootEl.getBoundingClientRect();
              var rootScroll = rootEl.scrollHeight || 0;
              var rootOffset = rootEl.offsetHeight || 0;
              var children = rootEl.children;
              var maxBottom = 0;
              for (var i = 0; i < children.length; i++) {
                var childRect = children[i].getBoundingClientRect();
                if (childRect.bottom > maxBottom) {
                  maxBottom = childRect.bottom;
                }
              }
              contentHeight = Math.max(
                rootRect.height || 0,
                rootScroll,
                rootOffset,
                maxBottom
              );
            }
            var finalHeight = contentHeight > 0 ? Math.max(260, Math.ceil(contentHeight + 48)) : 260;
            if (window.parent && window.parent !== window) {
              window.parent.postMessage({ type: 'SANDBOX_RESIZE', height: finalHeight }, '*');
            }
          } catch (e) {}
        }

        if (typeof ResizeObserver !== 'undefined') {
          var ro = new ResizeObserver(function() {
            notifyHeight();
          });
          var rootEl = document.getElementById('root');
          if (rootEl) ro.observe(rootEl);
          if (document.body) ro.observe(document.body);
        }

        if (typeof MutationObserver !== 'undefined') {
          var mo = new MutationObserver(function() {
            notifyHeight();
          });
          mo.observe(document.documentElement, { childList: true, subtree: true, attributes: true });
        }

        window.addEventListener('resize', notifyHeight);
        window.addEventListener('load', notifyHeight);
        requestAnimationFrame(notifyHeight);
        setTimeout(notifyHeight, 30);
        setTimeout(notifyHeight, 100);
        setTimeout(notifyHeight, 300);
        setTimeout(notifyHeight, 800);
      } catch (err) {
        renderError(err);
      }
    })();
  </script>
</body>
</html>`;

  return { srcDoc, error: null };
}
