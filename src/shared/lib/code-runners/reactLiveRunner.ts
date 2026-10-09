/**
 * Live React Project Runner & Compiler
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
import * as ReactQuery from "@tanstack/react-query";
import { create as createZustandStore, useStore as useZustandStore } from "zustand";
import { peekCachedSolution } from "../storage";
import { transpileCode, normalizeAndProtectLoops } from "./transpiler";
import { buildSandboxIframeSrcDoc } from "./sandboxHtmlBuilder";

export { transpileCode, normalizeAndProtectLoops, buildSandboxIframeSrcDoc };

const ZustandModule = {
  create: createZustandStore,
  useStore: useZustandStore,
  default: createZustandStore,
};

declare global {
  interface Window {
    /** Read by the sandbox iframe (see sandboxHtmlBuilder) to share the host's React runtime. */
    __SANDBOX_RUNTIME__?: Record<string, unknown>;
  }
}

/** CommonJS-style exports object of a sandbox module. */
type ModuleExports = Record<string, unknown>;
type TimerId = ReturnType<typeof setTimeout>;
type IntervalId = ReturnType<typeof setInterval>;

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
    ReactQuery,
  };
}

const activeTimerIds = new Set<TimerId>();
const activeIntervalIds = new Set<IntervalId>();

export function clearLiveSandboxTimers(): void {
  activeTimerIds.forEach((id) => clearTimeout(id));
  activeTimerIds.clear();
  activeIntervalIds.forEach((id) => clearInterval(id));
  activeIntervalIds.clear();
}

const sandboxSetTimeout = (
  fn: (...args: unknown[]) => unknown,
  delay: number,
  ...args: unknown[]
) => {
  const id = setTimeout(() => {
    activeTimerIds.delete(id);
    if (typeof fn === "function") fn(...args);
  }, delay);
  activeTimerIds.add(id);
  return id;
};

const sandboxClearTimeout = (id: TimerId) => {
  activeTimerIds.delete(id);
  clearTimeout(id);
};

const sandboxSetInterval = (
  fn: (...args: unknown[]) => unknown,
  delay: number,
  ...args: unknown[]
) => {
  const id = setInterval(fn, delay, ...args);
  activeIntervalIds.add(id);
  return id;
};

const sandboxClearInterval = (id: IntervalId) => {
  activeIntervalIds.delete(id);
  clearInterval(id);
};

export interface TaskSourceFile {
  name?: string;
  filepath?: string;
  code?: string;
}

export function buildFilesMap(
  files: TaskSourceFile[] = [],
  storagePrefix: "cand" | "sol" = "cand",
  taskId: string | number = "",
  activeFileIdx = 0,
  currentEditingCode?: string,
  variantIdx = 0
): Record<string, { name: string; code: string }> {
  const map: Record<string, { name: string; code: string }> = {};

  if (!Array.isArray(files) || files.length === 0) {
    return map;
  }

  files.forEach((file, idx) => {
    const fileName = file.name || `file_${idx}.jsx`;

    let fileTaskId: string;
    if (storagePrefix === "sol") {
      fileTaskId = `sol_${taskId}_${variantIdx}_file_${idx}`;
    } else {
      fileTaskId = `cand_${taskId}_file_${idx}`;
    }

    let code = file.code || "";

    const cached = peekCachedSolution(fileTaskId);
    if (cached !== null && typeof cached === "string") {
      code = cached;
    }

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

const isComponent = (value: unknown): value is React.ComponentType => typeof value === "function";

/** Default export first, then the module itself, then any exported function. */
const findComponent = (mod: unknown): React.ComponentType | null => {
  if (mod === null || (typeof mod !== "object" && typeof mod !== "function")) return null;
  const exported: ModuleExports = { ...mod };
  return [exported.default, mod, ...Object.values(exported)].find(isComponent) ?? null;
};

export function compileReactProject(
  filesMap: Record<string, { name: string; code: string }>,
  entryFileName?: string
): { Component: React.ComponentType | null; error: Error | null } {
  const fileKeys = Object.keys(filesMap);
  if (fileKeys.length === 0) {
    return { Component: null, error: null };
  }

  const entryKey =
    fileKeys.find((k) => /^(index|app|main)\.(jsx|tsx)$/i.test(k)) ||
    fileKeys.find((k) => /^(index|app|main)\.(js|ts)$/i.test(k)) ||
    (entryFileName && filesMap[entryFileName] ? entryFileName : null) ||
    fileKeys.find((k) => /\.(jsx|tsx)$/i.test(k)) ||
    fileKeys[0];

  const moduleCache = new Map<string, { exports: ModuleExports }>();

  function requireModule(modulePath: string): unknown {
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
    if (modulePath === "@tanstack/react-query") {
      return { ...ReactQuery, default: ReactQuery };
    }

    if (
      modulePath.endsWith(".css") ||
      modulePath.endsWith(".scss") ||
      modulePath.endsWith(".less")
    ) {
      return {};
    }

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
      const icon = (LucideIcons as ModuleExports)[modulePath];
      if (icon) {
        return icon;
      }
      throw new Error(`Модуль не найден: "${modulePath}"`);
    }

    if (moduleCache.has(matchedKey)) {
      return moduleCache.get(matchedKey)?.exports;
    }

    const targetFile = filesMap[matchedKey];
    const { code: transformedCode, error: transpileErr } = transpileCode(
      targetFile.code,
      matchedKey
    );

    if (transpileErr) {
      throw transpileErr;
    }

    const exports: ModuleExports = {};
    const module = { exports };
    moduleCache.set(matchedKey, module);

    if (!transformedCode || !transformedCode.trim()) {
      return module.exports;
    }

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
    return { Component: findComponent(requireModule(`./${entryKey}`)), error: null };
  } catch (err) {
    return { Component: null, error: err instanceof Error ? err : new Error(String(err)) };
  }
}
