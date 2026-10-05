import ts from "typescript";

import type {
  TypeScriptSourceInput,
  EditorDiagnostic,
  TypeScriptCompletion,
  TypeScriptHover,
  TypeScriptSignature,
  TypeScriptLocation,
  TypeScriptRenameEdit,
  TypeScriptCodeFix,
} from "./typescriptTypes";
import {
  DEFAULT_OPTIONS,
  EDITOR_GLOBALS_FILE,
  EDITOR_GLOBALS_SOURCE,
  FORMAT_SETTINGS,
  JS_SEMANTIC_CODES,
  PREFERENCES,
  isJavaScriptFile,
  isUnresolvedPackage,
} from "./typescriptOptions";
import { fuzzyScore } from "./fuzzyMatcher";

export const createTypeScriptEditorService = (
  libraries: ReadonlyMap<string, string>
): {
  diagnose: (input: TypeScriptSourceInput) => EditorDiagnostic[];
  complete: (input: TypeScriptSourceInput, position: number) => TypeScriptCompletion[];
  hover: (input: TypeScriptSourceInput, position: number) => TypeScriptHover | null;
  signature: (input: TypeScriptSourceInput, position: number) => TypeScriptSignature | null;
  rename: (input: TypeScriptSourceInput, position: number) => TypeScriptRenameEdit[];
  codefix: (
    input: TypeScriptSourceInput,
    start: number,
    end: number,
    errorCode: number
  ) => TypeScriptCodeFix[];
  definition: (input: TypeScriptSourceInput, position: number) => TypeScriptLocation | null;
} => {
  const parseOptions = (content: string): ts.CompilerOptions => {
    const parsed = ts.parseConfigFileTextToJson("tsconfig.json", content);
    if (parsed.error || !parsed.config?.compilerOptions) return DEFAULT_OPTIONS;
    const converted = ts.convertCompilerOptionsFromJson(parsed.config.compilerOptions, "/");
    return { ...DEFAULT_OPTIONS, ...converted.options, noEmit: true, allowJs: true };
  };
  let appliedConfig: string | undefined;
  let options = DEFAULT_OPTIONS;
  let version = 0;
  let sources = new Map<string, string>();
  const sourceVersions = new Map<string, number>();
  const snapshots = new Map<string, ts.IScriptSnapshot>();
  const normalize = (name: string): string => `/${name.replace(/^\/+/, "")}`;
  const denormalize = (name: string): string => name.replace(/^\//, "");
  const readFile = (name: string): string | undefined =>
    normalize(name) === EDITOR_GLOBALS_FILE
      ? EDITOR_GLOBALS_SOURCE
      : (sources.get(normalize(name)) ?? libraries.get(normalize(name)));

  const service = ts.createLanguageService({
    getCompilationSettings: () => options,
    getScriptFileNames: () => [EDITOR_GLOBALS_FILE, ...sources.keys()],
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
    getDefaultLibFileName: () => "/lib.esnext.full.d.ts",
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
    const nextConfig = files.find((file) => file.name === "tsconfig.json")?.code;
    if (nextConfig !== appliedConfig) {
      options = nextConfig ? parseOptions(nextConfig) : DEFAULT_OPTIONS;
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

  const toDiagnostic = (
    diagnostic: ts.Diagnostic,
    severity: EditorDiagnostic["severity"]
  ): EditorDiagnostic => {
    const start = diagnostic.start ?? 0;
    const position = diagnostic.file?.getLineAndCharacterOfPosition(start);
    return {
      id: `ts-${diagnostic.code}-${start}`,
      line: (position?.line ?? 0) + 1,
      col: (position?.character ?? 0) + 1,
      start,
      end: start + (diagnostic.length ?? 0),
      code: diagnostic.code,
      message: `TS${diagnostic.code}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`,
      severity,
    };
  };

  const diagnose = (input: TypeScriptSourceInput): EditorDiagnostic[] => {
    const activePath = update(input);
    const javascript = isJavaScriptFile(activePath);
    const semantic = service
      .getSemanticDiagnostics(activePath)
      .filter(
        (diagnostic) =>
          !isUnresolvedPackage(
            diagnostic.code,
            ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")
          ) &&
          (!javascript || diagnostic.code < 2000 || JS_SEMANTIC_CODES.has(diagnostic.code))
      );
    return [
      ...[...service.getSyntacticDiagnostics(activePath), ...semantic].map((diagnostic) =>
        toDiagnostic(
          diagnostic,
          diagnostic.category === ts.DiagnosticCategory.Warning ? "warning" : "error"
        )
      ),
      ...service
        .getSuggestionDiagnostics(activePath)
        .filter((diagnostic) => diagnostic.reportsUnnecessary)
        .map((diagnostic) => toDiagnostic(diagnostic, "hint")),
    ];
  };

  const complete = (input: TypeScriptSourceInput, position: number): TypeScriptCompletion[] => {
    const activePath = update(input);
    const result = service.getCompletionsAtPosition(activePath, position, PREFERENCES);
    if (!result) return [];
    // `aria-label` is one JSX attribute name; a colon is never part of an identifier.
    const prefix = /(?:[\w$]+-)*[\w$]*$/.exec(input.code.slice(0, position))?.[0] ?? "";
    // Filter before limiting: entries come as locals, globals A–Z, then auto-imports.
    // VS Code's suggest order: fuzzy score (`gcs` → `getComputedStyle`), then TypeScript's.
    return result.entries
      .map((entry) => ({ entry, score: fuzzyScore(entry.name, prefix)?.score }))
      .filter(
        (item): item is { entry: ts.CompletionEntry; score: number } => item.score !== undefined
      )
      .sort(
        (a, b) =>
          b.score - a.score ||
          a.entry.sortText.localeCompare(b.entry.sortText) ||
          a.entry.name.localeCompare(b.entry.name)
      )
      .slice(0, 80)
      .map(({ entry }): TypeScriptCompletion => {
        const moduleSpecifier = entry.hasAction ? entry.data?.moduleSpecifier : undefined;
        return {
          label: entry.name,
          insertText: entry.insertText ?? entry.name,
          kind: entry.kind,
          replaceStart: entry.replacementSpan?.start ?? position - prefix.length,
          replaceEnd:
            entry.replacementSpan === undefined
              ? position
              : entry.replacementSpan.start + entry.replacementSpan.length,
          autoImport: moduleSpecifier
            ? {
                symbol: entry.name,
                module: moduleSpecifier,
                isDefault: entry.data?.exportName === ts.InternalSymbolName.Default,
              }
            : undefined,
        };
      });
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
    let text = ts.displayPartsToString(item.prefixDisplayParts);
    const separator = ts.displayPartsToString(item.separatorDisplayParts);
    const parameters = item.parameters.map((parameter, index) => {
      if (index > 0) text += separator;
      const start = text.length;
      text += ts.displayPartsToString(parameter.displayParts);
      return { start, end: text.length };
    });
    text += ts.displayPartsToString(item.suffixDisplayParts);
    return {
      signature: text,
      activeParameter: info.argumentIndex,
      documentation: ts.displayPartsToString(item.documentation),
      parameters,
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
    // Prefix/suffix keep `{ a }` and `import { a }` valid: `{ b: a }`, `import { b as a }`.
    const preferences = {
      allowRenameOfImportPath: false,
      providePrefixAndSuffixTextForRename: true,
    };
    const info = service.getRenameInfo(activePath, position, preferences);
    if (!info.canRename) return [];
    return (service.findRenameLocations(activePath, position, false, false, preferences) ?? []).map(
      (location) => ({
        filepath: denormalize(location.fileName),
        start: location.textSpan.start,
        end: location.textSpan.start + location.textSpan.length,
        prefixText: location.prefixText,
        suffixText: location.suffixText,
      })
    );
  };

  const codefix = (
    input: TypeScriptSourceInput,
    start: number,
    end: number,
    errorCode: number
  ): TypeScriptCodeFix[] => {
    const activePath = update(input);
    return (
      service
        .getCodeFixesAtPosition(activePath, start, end, [errorCode], FORMAT_SETTINGS, PREFERENCES)
        // `// @ts-ignore` and `// @ts-nocheck` hide the problem instead of teaching the fix.
        .filter((fix) => fix.fixName !== "disableJsDiagnostics")
        .map((fix) => ({
          description: fix.description,
          changes: fix.changes.flatMap((file) =>
            file.textChanges.map((change) => ({
              filepath: denormalize(file.fileName),
              start: change.span.start,
              end: change.span.start + change.span.length,
              newText: change.newText,
            }))
          ),
        }))
        .filter((fix) => fix.changes.length > 0)
    );
  };

  const definition = (
    input: TypeScriptSourceInput,
    position: number
  ): TypeScriptLocation | null => {
    const activePath = update(input);
    // Only editor files are navigable; library declarations have no tab.
    const target = service
      .getDefinitionAtPosition(activePath, position)
      ?.find((location) => sources.has(normalize(location.fileName)));
    return target
      ? {
          filepath: denormalize(target.fileName),
          start: target.textSpan.start,
          end: target.textSpan.start + target.textSpan.length,
        }
      : null;
  };

  return { diagnose, complete, hover, signature, rename, codefix, definition };
};

/** Errors and warnings only, for callers that do not render unused-code hints. */
export const createTypeScriptDiagnostics = (
  libraries: ReadonlyMap<string, string>
): ((input: TypeScriptSourceInput) => EditorDiagnostic[]) => {
  const { diagnose } = createTypeScriptEditorService(libraries);
  return (input) => diagnose(input).filter((problem) => problem.severity !== "hint");
};
