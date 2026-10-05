/**
 * Single source of truth for editor languages: file extensions, labels,
 * comment tokens, Prettier parser and editing capabilities.
 */

import type { LanguageCapabilities, LanguageId } from "./languageTypes";

export interface CommentSyntax {
  line: { prefix: string; suffix?: string };
  block: { start: string; end: string };
}

export interface LanguageDefinition {
  label: string;
  /** Extensions and pseudo names (`notepad`, `react`) that resolve to this language. */
  extensions: readonly string[];
  comment: CommentSyntax;
  /** Prettier parser; languages without one are not formatted. */
  prettierParser?: string;
  capabilities: Omit<LanguageCapabilities, "languageId">;
}

const NO_FEATURES: LanguageDefinition["capabilities"] = {
  supportsJsx: false,
  supportsTypeScript: false,
  supportsReactHooks: false,
  supportsEmmet: false,
  supportsCssProperties: false,
  supportsHtmlTags: false,
  supportsSql: false,
  supportsAutoImport: false,
  supportsJavaScriptGlobals: false,
};
const SCRIPT: LanguageDefinition["capabilities"] = {
  ...NO_FEATURES,
  supportsAutoImport: true,
  supportsJavaScriptGlobals: true,
};
const REACT: LanguageDefinition["capabilities"] = {
  ...SCRIPT,
  supportsJsx: true,
  supportsReactHooks: true,
  supportsEmmet: true,
  supportsCssProperties: true,
  supportsHtmlTags: true,
};
const STYLE: LanguageDefinition["capabilities"] = { ...NO_FEATURES, supportsCssProperties: true };
const C_COMMENTS: CommentSyntax = {
  line: { prefix: "// " },
  block: { start: "/* ", end: " */" },
};
const MARKUP_COMMENTS: CommentSyntax = {
  line: { prefix: "<!-- ", suffix: " -->" },
  block: { start: "<!-- ", end: " -->" },
};

export const LANGUAGES: Record<LanguageId, LanguageDefinition> = {
  javascript: {
    label: "JavaScript",
    extensions: ["js", "mjs", "cjs", "javascript"],
    comment: C_COMMENTS,
    prettierParser: "babel-ts",
    // Like VS Code, plain .js parses JSX (React tasks often keep JSX in .js files);
    // React snippets and Emmet stay limited to .jsx/.tsx.
    capabilities: { ...SCRIPT, supportsJsx: true, supportsHtmlTags: true },
  },
  javascriptreact: {
    label: "React JSX",
    extensions: ["jsx", "react"],
    comment: C_COMMENTS,
    prettierParser: "babel-ts",
    capabilities: REACT,
  },
  typescript: {
    label: "TypeScript",
    extensions: ["ts", "mts", "cts", "typescript"],
    comment: C_COMMENTS,
    prettierParser: "typescript",
    capabilities: { ...SCRIPT, supportsTypeScript: true },
  },
  typescriptreact: {
    label: "React TSX",
    extensions: ["tsx"],
    comment: C_COMMENTS,
    prettierParser: "typescript",
    capabilities: { ...REACT, supportsTypeScript: true },
  },
  css: {
    label: "CSS",
    extensions: ["css"],
    comment: { line: { prefix: "/* ", suffix: " */" }, block: { start: "/* ", end: " */" } },
    prettierParser: "css",
    capabilities: STYLE,
  },
  // SCSS and LESS add `//` line comments and syntax plain CSS parsers reject.
  scss: {
    label: "SCSS",
    extensions: ["scss"],
    comment: C_COMMENTS,
    prettierParser: "scss",
    capabilities: STYLE,
  },
  less: {
    label: "LESS",
    extensions: ["less"],
    comment: C_COMMENTS,
    prettierParser: "less",
    capabilities: STYLE,
  },
  html: {
    label: "HTML",
    extensions: ["html", "htm"],
    comment: MARKUP_COMMENTS,
    prettierParser: "html",
    capabilities: { ...NO_FEATURES, supportsEmmet: true, supportsHtmlTags: true },
  },
  json: {
    label: "JSON",
    extensions: ["json"],
    comment: C_COMMENTS,
    prettierParser: "json",
    capabilities: NO_FEATURES,
  },
  sql: {
    label: "SQL",
    extensions: ["sql"],
    comment: { line: { prefix: "-- " }, block: { start: "/* ", end: " */" } },
    capabilities: { ...NO_FEATURES, supportsSql: true },
  },
  markdown: {
    label: "Markdown",
    extensions: ["md", "markdown"],
    comment: MARKUP_COMMENTS,
    prettierParser: "markdown",
    capabilities: NO_FEATURES,
  },
  plaintext: {
    label: "Текст",
    extensions: ["txt", "text", "notepad", "plaintext"],
    comment: C_COMMENTS,
    capabilities: NO_FEATURES,
  },
};

// A language id (`typescriptreact`) resolves to itself, like a file extension.
export const LANGUAGE_BY_EXTENSION: ReadonlyMap<string, LanguageId> = new Map(
  (Object.entries(LANGUAGES) as Array<[LanguageId, LanguageDefinition]>).flatMap(([id, language]) =>
    [...language.extensions, id].map((extension) => [extension, id] as const)
  )
);
