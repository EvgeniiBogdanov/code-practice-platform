/**
 * codeFormatter.ts
 * Форматирование кода через Prettier standalone с правилами из .prettierrc проекта.
 */

import type { Options, Plugin } from "prettier";

export interface PrettierModules {
  format: (source: string, options?: Options) => Promise<string>;
  plugins: Plugin[];
}

let prettierModulesPromise: Promise<PrettierModules> | null = null;

export const PRETTIER_CONFIG: Readonly<Options> = {
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "es5",
  printWidth: 100,
  bracketSpacing: true,
  arrowParens: "always",
  endOfLine: "lf",
};

const loadPrettierModules = async (): Promise<PrettierModules> => {
  if (!prettierModulesPromise) {
    prettierModulesPromise = Promise.all([
      import("prettier/standalone"),
      import("prettier/plugins/babel"),
      import("prettier/plugins/estree"),
      import("prettier/plugins/typescript"),
      import("prettier/plugins/postcss"),
      import("prettier/plugins/html"),
      import("prettier/plugins/markdown"),
    ]).then(([prettierMod, babelMod, estreeMod, tsMod, postcssMod, htmlMod, mdMod]) => {
      const format =
        prettierMod.format ||
        (prettierMod as unknown as { default: { format: typeof prettierMod.format } }).default
          ?.format;
      const plugins: Plugin[] = [
        babelMod.default || babelMod,
        estreeMod.default || estreeMod,
        tsMod.default || tsMod,
        postcssMod.default || postcssMod,
        htmlMod.default || htmlMod,
        mdMod.default || mdMod,
      ] as Plugin[];

      return { format, plugins };
    });
  }
  return prettierModulesPromise;
};

const resolveParser = (filepath?: string): string => {
  if (!filepath) return "babel-ts";
  const ext = filepath.toLowerCase().split(".").pop();
  switch (ext) {
    case "css":
    case "scss":
    case "less":
      return "css";
    case "json":
      return "json";
    case "html":
    case "htm":
      return "html";
    case "md":
    case "markdown":
      return "markdown";
    case "ts":
    case "tsx":
    case "js":
    case "jsx":
    default:
      return "babel-ts";
  }
};

export const formatJavaScriptCode = async (rawCode: string, filepath?: string): Promise<string> => {
  if (!rawCode || typeof rawCode !== "string") return "";

  try {
    const { format, plugins } = await loadPrettierModules();
    const parser = resolveParser(filepath);

    const formatted = await format(rawCode, {
      ...PRETTIER_CONFIG,
      parser,
      plugins,
    });

    return formatted.trimEnd();
  } catch (err: unknown) {
    // If babel-ts fails on special edge-case TS, attempt with typescript parser
    try {
      const { format, plugins } = await loadPrettierModules();
      const formatted = await format(rawCode, {
        ...PRETTIER_CONFIG,
        parser: "typescript",
        plugins,
      });
      return formatted.trimEnd();
    } catch {
      // In case of syntax errors, preserve existing rawCode safely
      return rawCode;
    }
  }
};

export const formatJavaScriptCodeSync = (rawCode: string): string => {
  if (!rawCode || typeof rawCode !== "string") return "";
  return rawCode;
};
