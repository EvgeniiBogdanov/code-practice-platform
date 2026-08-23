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

if (typeof window !== "undefined") {
  (window as any).__SANDBOX_RUNTIME__ = {
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

const activeTimerIds = new Set<any>();
const activeIntervalIds = new Set<any>();

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

const sandboxClearTimeout = (id: unknown) => {
  activeTimerIds.delete(id);
  clearTimeout(id as number);
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

const sandboxClearInterval = (id: any) => {
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

  const moduleCache = new Map<string, { exports: any }>();

  function requireModule(modulePath: string): any {
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
      if ((LucideIcons as any)[modulePath]) {
        return (LucideIcons as any)[modulePath];
      }
      throw new Error(`Модуль не найден: "${modulePath}"`);
    }

    if (moduleCache.has(matchedKey)) {
      return moduleCache.get(matchedKey)!.exports;
    }

    const targetFile = filesMap[matchedKey];
    const { code: transformedCode, error: transpileErr } = transpileCode(
      targetFile.code,
      matchedKey
    );

    if (transpileErr) {
      throw transpileErr;
    }

    const exports: any = {};
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
    const entryModule = requireModule(`./${entryKey}`);
    const FoundComponent =
      entryModule?.default ||
      (typeof entryModule === "function" ? entryModule : null) ||
      Object.values(entryModule || {}).find((v) => typeof v === "function") ||
      null;

    return { Component: FoundComponent, error: null };
  } catch (err: any) {
    return { Component: null, error: err };
  }
}
