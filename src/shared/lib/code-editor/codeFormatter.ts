/**
 * codeFormatter.ts
 * Форматирование кода через Prettier standalone с правилами из .prettierrc проекта.
 */

import type { Options, Plugin } from "prettier";
import { LANGUAGES } from "./languages/language-registry";
import { getLanguageId } from "./languages/languageDetector";

export interface PrettierModules {
  formatWithCursor: typeof import("prettier/standalone").formatWithCursor;
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
      const formatWithCursor = prettierMod.formatWithCursor;
      const plugins: Plugin[] = [
        babelMod.default || babelMod,
        estreeMod.default || estreeMod,
        tsMod.default || tsMod,
        postcssMod.default || postcssMod,
        htmlMod.default || htmlMod,
        mdMod.default || mdMod,
      ] as Plugin[];

      return { formatWithCursor, plugins };
    });
  }
  return prettierModulesPromise;
};

const resolveParser = (filepath?: string): string | undefined =>
  LANGUAGES[getLanguageId(filepath)].prettierParser;

export type FormatStatus = "formatted" | "unsupported" | "syntax-error";

export interface FormatResult {
  code: string;
  cursorOffset: number;
  status: FormatStatus;
}

/** Whether the file's language has a formatter at all. */
export const canFormat = (filepath?: string): boolean => Boolean(resolveParser(filepath));

/** Formats with Prettier, keeping the caret on the same token like VS Code. */
export const formatCode = async (
  rawCode: string,
  filepath?: string,
  cursorOffset = 0
): Promise<FormatResult> => {
  const parser = resolveParser(filepath);
  if (!parser) return { code: rawCode, cursorOffset, status: "unsupported" };
  if (!rawCode) return { code: rawCode, cursorOffset, status: "formatted" };
  const { formatWithCursor, plugins } = await loadPrettierModules();
  // babel-ts rejects a few TypeScript-only constructs that the typescript parser accepts.
  for (const candidate of parser === "babel-ts" ? [parser, "typescript"] : [parser]) {
    try {
      const result = await formatWithCursor(rawCode, {
        ...PRETTIER_CONFIG,
        parser: candidate,
        plugins,
        cursorOffset: Math.min(cursorOffset, rawCode.length),
      });
      const code = result.formatted.trimEnd();
      return {
        code,
        cursorOffset: Math.min(result.cursorOffset, code.length),
        status: "formatted",
      };
    } catch {
      // Try the next parser; syntax errors keep the source untouched.
    }
  }
  return { code: rawCode, cursorOffset, status: "syntax-error" };
};
