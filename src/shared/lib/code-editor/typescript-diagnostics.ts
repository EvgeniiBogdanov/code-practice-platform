import ts from "typescript";
import type { LintProblem } from "./linter/missingImportsDetector";

export interface TypeScriptSourceInput {
  code: string;
  filepath: string;
  files: ReadonlyArray<{ name?: string; code?: string }>;
}

export interface TypeScriptDiagnosticRequest extends TypeScriptSourceInput {
  id: number;
  kind: "diagnostics" | "completions" | "hover" | "signature" | "rename";
  position?: number;
}

export interface TypeScriptDiagnosticResponse {
  id: number;
  kind: TypeScriptDiagnosticRequest["kind"];
  problems?: LintProblem[];
  completions?: TypeScriptCompletion[];
  hover?: TypeScriptHover | null;
  signature?: TypeScriptSignature | null;
  rename?: TypeScriptRenameEdit[];
}

export interface TypeScriptCompletion {
  label: string;
  insertText: string;
  kind: string;
  replaceStart: number;
  replaceEnd: number;
}

export interface TypeScriptHover {
  signature: string;
  documentation: string;
}

export interface TypeScriptSignature {
  signature: string;
  activeParameter: number;
  documentation: string;
}

export interface TypeScriptRenameEdit {
  filepath: string;
  start: number;
  end: number;
}

// Every editor file is a module, so examples may use names such as "status"
// without accidentally merging with browser globals or another exercise.
export const createTypeScriptEditorService = (
  libraries: ReadonlyMap<string, string>,
  projectConfig?: string
): {
  diagnose: (input: TypeScriptSourceInput) => LintProblem[];
  complete: (input: TypeScriptSourceInput, position: number) => TypeScriptCompletion[];
  hover: (input: TypeScriptSourceInput, position: number) => TypeScriptHover | null;
  signature: (input: TypeScriptSourceInput, position: number) => TypeScriptSignature | null;
  rename: (input: TypeScriptSourceInput, position: number) => TypeScriptRenameEdit[];
} => {
  const defaultOptions: ts.CompilerOptions = {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    moduleDetection: ts.ModuleDetectionKind.Force,
    strict: true,
    jsx: ts.JsxEmit.ReactJSX,
    allowJs: true,
    checkJs: true,
    noEmit: true,
    skipLibCheck: true,
    types: [],
  };
  const parseOptions = (content: string): ts.CompilerOptions => {
    const parsed = ts.parseConfigFileTextToJson("tsconfig.json", content);
    if (parsed.error || !parsed.config?.compilerOptions) return defaultOptions;
    const converted = ts.convertCompilerOptionsFromJson(parsed.config.compilerOptions, "/");
    return { ...defaultOptions, ...converted.options, noEmit: true, allowJs: true };
  };
  let appliedConfig = projectConfig;
  let options = projectConfig ? parseOptions(projectConfig) : defaultOptions;
  let version = 0;
  let sources = new Map<string, string>();
  const sourceVersions = new Map<string, number>();
  const snapshots = new Map<string, ts.IScriptSnapshot>();
  const normalize = (name: string): string => `/${name.replace(/^\/+/, "")}`;
  const readFile = (name: string): string | undefined =>
    sources.get(normalize(name)) ?? libraries.get(normalize(name));

  const service = ts.createLanguageService({
    getCompilationSettings: () => options,
    getScriptFileNames: () => [...sources.keys()],
    getScriptVersion: (name) => String(sourceVersions.get(normalize(name)) ?? 0),
    getProjectVersion: () => String(version),
    getScriptSnapshot: (name) => {
      const key = normalize(name);
      const text = readFile(key);
      if (text === undefined) return undefined;
      if (sources.has(key)) return ts.ScriptSnapshot.fromString(text);
      let snapshot = snapshots.get(key);
      if (!snapshot) {
        snapshot = ts.ScriptSnapshot.fromString(text);
        snapshots.set(key, snapshot);
      }
      return snapshot;
    },
    getCurrentDirectory: () => "/",
    getDefaultLibFileName: () => "/lib.es2022.full.d.ts",
    fileExists: (name) => readFile(name) !== undefined,
    readFile,
    readDirectory: () => [],
    directoryExists: (directory) => {
      const prefix = normalize(directory).replace(/\/$/, "") + "/";
      return [...sources.keys(), ...libraries.keys()].some((name) => name.startsWith(prefix));
    },
    useCaseSensitiveFileNames: () => true,
    getNewLine: () => "\n",
  });

  const update = ({ code, filepath, files }: TypeScriptSourceInput): string => {
    const virtualConfig = files.find((file) => file.name === "tsconfig.json")?.code;
    const nextConfig = virtualConfig ?? projectConfig;
    if (nextConfig !== appliedConfig) {
      options = nextConfig ? parseOptions(nextConfig) : defaultOptions;
      appliedConfig = nextConfig;
      version += 1;
    }
    const activePath = normalize(filepath);
    const nextSources = new Map(
      files.flatMap((file) =>
        file.name && /\.(?:[cm]?[jt]s|[jt]sx)$/i.test(file.name)
          ? [[normalize(file.name), file.code ?? ""] as const]
          : []
      )
    );
    nextSources.set(activePath, code);
    for (const [name, content] of nextSources) {
      if (sources.get(name) !== content) {
        version += 1;
        sourceVersions.set(name, version);
      }
    }
    for (const name of sources.keys()) {
      if (!nextSources.has(name)) {
        sourceVersions.delete(name);
        version += 1;
      }
    }
    sources = nextSources;
    return activePath;
  };

  const diagnose = (input: TypeScriptSourceInput): LintProblem[] => {
    const activePath = update(input);
    const diagnostics = [
      ...service.getSyntacticDiagnostics(activePath),
      ...service.getSemanticDiagnostics(activePath),
    ];
    return diagnostics.map((diagnostic): LintProblem => {
      const position = diagnostic.file?.getLineAndCharacterOfPosition(diagnostic.start ?? 0);
      return {
        id: `ts-${diagnostic.code}-${diagnostic.start ?? 0}`,
        line: (position?.line ?? 0) + 1,
        col: (position?.character ?? 0) + 1,
        message: `TS${diagnostic.code}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`,
        rule: "typescript",
        severity: diagnostic.category === ts.DiagnosticCategory.Warning ? "warning" : "error",
      };
    });
  };

  const complete = (input: TypeScriptSourceInput, position: number): TypeScriptCompletion[] => {
    const activePath = update(input);
    const result = service.getCompletionsAtPosition(activePath, position, {
      includeCompletionsForModuleExports: true,
      includeInsertTextCompletions: true,
    });
    if (!result) return [];
    const before = input.code.slice(0, position);
    const prefix = /[\w$:-]*$/.exec(before)?.[0] ?? "";
    return result.entries.slice(0, 80).map((entry) => ({
      label: entry.name,
      insertText: entry.insertText ?? entry.name,
      kind: entry.kind,
      replaceStart: entry.replacementSpan?.start ?? position - prefix.length,
      replaceEnd:
        entry.replacementSpan === undefined
          ? position
          : entry.replacementSpan.start + entry.replacementSpan.length,
    }));
  };

  const hover = (input: TypeScriptSourceInput, position: number): TypeScriptHover | null => {
    const activePath = update(input);
    const info = service.getQuickInfoAtPosition(activePath, position);
    if (!info) return null;
    return {
      signature: ts.displayPartsToString(info.displayParts),
      documentation: ts.displayPartsToString(info.documentation),
    };
  };

  const signature = (
    input: TypeScriptSourceInput,
    position: number
  ): TypeScriptSignature | null => {
    const activePath = update(input);
    const info = service.getSignatureHelpItems(activePath, position, undefined);
    const item = info?.items[info.selectedItemIndex];
    if (!info || !item) return null;
    return {
      signature:
        ts.displayPartsToString(item.prefixDisplayParts) +
        item.parameters.map((parameter) => ts.displayPartsToString(parameter.displayParts)).join(", ") +
        ts.displayPartsToString(item.suffixDisplayParts),
      activeParameter: info.argumentIndex,
      documentation: ts.displayPartsToString(item.documentation),
    };
  };

  const rename = (input: TypeScriptSourceInput, position: number): TypeScriptRenameEdit[] => {
    const activePath = update(input);
    const sourceFile = service.getProgram()?.getSourceFile(activePath);
    if (sourceFile) {
      let matchingTags: TypeScriptRenameEdit[] = [];
      const visit = (node: ts.Node): void => {
        if (ts.isJsxElement(node)) {
          const names = [node.openingElement.tagName, node.closingElement.tagName];
          const selected = names.some(
            (name) => name.getStart(sourceFile) <= position && position <= name.getEnd()
          );
          if (selected && /^[a-z]/.test(node.openingElement.tagName.getText(sourceFile))) {
            matchingTags = names.map((name) => ({
              filepath: input.filepath,
              start: name.getStart(sourceFile),
              end: name.getEnd(),
            }));
          }
        }
        ts.forEachChild(node, visit);
      };
      visit(sourceFile);
      if (matchingTags.length) return matchingTags;
    }
    const info = service.getRenameInfo(activePath, position, { allowRenameOfImportPath: false });
    if (!info.canRename) return [];
    return (service.findRenameLocations(activePath, position, false, false) ?? []).map((location) => ({
      filepath: location.fileName.replace(/^\//, ""),
      start: location.textSpan.start,
      end: location.textSpan.start + location.textSpan.length,
    }));
  };

  return { diagnose, complete, hover, signature, rename };
};

export const createTypeScriptDiagnostics = (
  libraries: ReadonlyMap<string, string>
): ((input: TypeScriptSourceInput) => LintProblem[]) =>
  createTypeScriptEditorService(libraries).diagnose;
