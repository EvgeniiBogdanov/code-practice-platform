import ts from "typescript";

// Without checkJs, plain JavaScript gets only syntax errors. With it, inference
// noise appears (`useState(null)` then `setData(data)`), so JavaScript keeps
// grammar errors plus the semantic errors a learner actually needs.
export const JS_SEMANTIC_CODES = new Set([
  2300, // Duplicate identifier
  2304, // Cannot find name
  2305, // Module has no exported member
  2307, // Cannot find module (relative paths only; see isUnresolvedPackage)
  2349, // This expression is not callable
  2554, // Expected N arguments, but got M
  2555, // Expected at least N arguments, but got M
  2448, // Block-scoped variable used before its declaration
  2451, // Cannot redeclare block-scoped variable
  2551, // Property does not exist. Did you mean ...?
  2552, // Cannot find name. Did you mean ...?
  2588, // Cannot assign to a constant
  2724, // Module has no exported member. Did you mean ...?
]);
// Packages that are not bundled into the worker cannot be resolved, which says nothing
// about the learner's code; a mistyped relative path, however, is a real error.
export const isUnresolvedPackage = (code: number, message: string): boolean =>
  (code === 2307 || code === 2882) && !/'(?:\.{0,2}\/)/.test(message);

// Bundler-resolved assets: styles, images and JSON import as loosely typed modules.
export const EDITOR_GLOBALS_FILE = "/editor-globals.d.ts";
export const EDITOR_GLOBALS_SOURCE = [
  "css",
  "scss",
  "sass",
  "less",
  "svg",
  "png",
  "jpg",
  "jpeg",
  "gif",
  "webp",
  "json",
]
  .map((extension) => `declare module "*.${extension}";`)
  .join("\n");

export const isJavaScriptFile = (name: string): boolean => /\.[cm]?jsx?$/i.test(name);

export const FORMAT_SETTINGS: ts.FormatCodeSettings = {
  ...ts.getDefaultFormatCodeSettings("\n"),
  indentSize: 2,
  tabSize: 2,
  convertTabsToSpaces: true,
};
export const PREFERENCES: ts.GetCompletionsAtPositionOptions = {
  quotePreference: "double",
  includeCompletionsForModuleExports: true,
  includeInsertTextCompletions: true,
};

// Every editor file is a module, so examples may use names such as "status"
// without accidentally merging with browser globals or another exercise.
export const DEFAULT_OPTIONS: ts.CompilerOptions = {
  target: ts.ScriptTarget.ESNext,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  moduleDetection: ts.ModuleDetectionKind.Force,
  strict: true,
  jsx: ts.JsxEmit.ReactJSX,
  allowJs: true,
  checkJs: true,
  noEmit: true,
  skipLibCheck: true,
  // React is always known, so quick fixes can import hooks into an empty file.
  types: ["react"],
};
