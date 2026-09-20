import ts from "typescript";
import type { LintProblem } from "./linter/missingImportsDetector";

export interface TypeScriptSourceInput {
  code: string;
  filepath: string;
  files: ReadonlyArray<{ name?: string; code?: string }>;
}

export interface TypeScriptDiagnosticRequest extends TypeScriptSourceInput {
  id: number;
}

export interface TypeScriptDiagnosticResponse {
  id: number;
  problems: LintProblem[];
}

// Every editor file is a module, so examples may use names such as "status"
// without accidentally merging with browser globals or another exercise.
export const createTypeScriptDiagnostics = (
  libraries: ReadonlyMap<string, string>
): ((input: TypeScriptSourceInput) => LintProblem[]) => {
  const options: ts.CompilerOptions = {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    moduleDetection: ts.ModuleDetectionKind.Force,
    strict: true,
    noEmit: true,
    skipLibCheck: true,
    types: [],
  };
  let version = 0;
  let sources = new Map<string, string>();
  const snapshots = new Map<string, ts.IScriptSnapshot>();
  const normalize = (name: string): string => `/${name.replace(/^\/+/, "")}`;
  const readFile = (name: string): string | undefined =>
    sources.get(normalize(name)) ?? libraries.get(normalize(name));

  const service = ts.createLanguageService({
    getCompilationSettings: () => options,
    getScriptFileNames: () => [...sources.keys()],
    getScriptVersion: (name) => (sources.has(normalize(name)) ? String(version) : "0"),
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
    useCaseSensitiveFileNames: () => true,
    getNewLine: () => "\n",
  });

  return ({ code, filepath, files }: TypeScriptSourceInput): LintProblem[] => {
    const activePath = normalize(filepath);
    sources = new Map(
      files.flatMap((file) =>
        file.name && /\.tsx?$/.test(file.name)
          ? [[normalize(file.name), file.code ?? ""] as const]
          : []
      )
    );
    sources.set(activePath, code);
    version += 1;

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
};
