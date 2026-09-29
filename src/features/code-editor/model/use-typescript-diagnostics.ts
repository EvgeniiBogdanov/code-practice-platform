import { useCallback, useEffect, useRef, useState } from "react";
import {
  createTypeScriptChecker,
  type TypeScriptDiagnosticRequest,
  type TypeScriptDiagnosticResponse,
  type TypeScriptSourceInput,
  type TypeScriptCompletion,
  type TypeScriptHover,
  type TypeScriptRenameEdit,
  type LintResult,
} from "@/shared/lib/code-editor";

interface TypeScriptAnalysis {
  result: LintResult | null;
  isPending: boolean;
  requestCompletions: (position: number, code?: string) => Promise<TypeScriptCompletion[]>;
  requestHover: (position: number, code?: string) => Promise<TypeScriptHover | null>;
  requestRename: (position: number) => Promise<TypeScriptRenameEdit[]>;
}

export const useTypeScriptDiagnostics = (
  input: TypeScriptSourceInput,
  enabled: boolean,
  languageEnabled = enabled
): TypeScriptAnalysis => {
  const workerRef = useRef<Worker | null>(null);
  const requestId = useRef(0);
  const diagnosticId = useRef(0);
  const pending = useRef(
    new Map<number, (response: TypeScriptDiagnosticResponse | null) => void>()
  );
  const [analysis, setAnalysis] = useState({ result: null as LintResult | null, isPending: false });
  // Use content as the dependency: unrelated editor renders must not recheck the file.
  const source = JSON.stringify(input);

  const ensureWorker = useCallback((): Worker | null => {
    if (!languageEnabled || typeof Worker === "undefined") return null;
    if (workerRef.current) return workerRef.current;
    const worker = createTypeScriptChecker();
    workerRef.current = worker;
    worker.onmessage = ({ data }: MessageEvent<TypeScriptDiagnosticResponse>): void => {
      const callback = pending.current.get(data.id);
      if (callback) {
        pending.current.delete(data.id);
        callback(data);
        return;
      }
      if (data.kind !== "diagnostics" || data.id !== diagnosticId.current) return;
      const problems = data.problems ?? [];
      const errorCount = problems.filter((problem) => problem.severity === "error").length;
      setAnalysis({
        isPending: false,
        result: {
          problems,
          errorCount,
          warningCount: problems.length - errorCount,
          isValid: errorCount === 0,
          typoMap: {},
          missingImportMap: {},
          allMissingImports: [],
          unusedImports: new Set(),
        },
      });
    };
    worker.onerror = (): void => {
      for (const resolve of pending.current.values()) resolve(null);
      pending.current.clear();
      worker.terminate();
      workerRef.current = null;
      setAnalysis({
        isPending: false,
        result: {
          problems: [
            {
              id: "typescript-load",
              line: 1,
              col: 1,
              rule: "typescript",
              severity: "warning",
              message: "Не удалось загрузить проверку TypeScript. Перезагрузите страницу.",
            },
          ],
          errorCount: 0,
          warningCount: 1,
          isValid: false,
          typoMap: {},
          missingImportMap: {},
          allMissingImports: [],
          unusedImports: new Set(),
        },
      });
    };
    return worker;
  }, [languageEnabled]);

  useEffect(() => {
    const pendingRequests = pending.current;
    return (): void => {
      workerRef.current?.terminate();
      workerRef.current = null;
      requestId.current += 1;
      for (const resolve of pendingRequests.values()) resolve(null);
      pendingRequests.clear();
    };
  }, [languageEnabled]);

  useEffect(() => {
    if (!enabled) return;
    const id = ++requestId.current;
    diagnosticId.current = id;
    setAnalysis({ result: null, isPending: true });
    const timer = setTimeout(() => {
      const request: TypeScriptDiagnosticRequest = {
        ...(JSON.parse(source) as TypeScriptSourceInput),
        id,
        kind: "diagnostics",
      };
      ensureWorker()?.postMessage(request);
    }, 250);
    return (): void => clearTimeout(timer);
  }, [enabled, source, ensureWorker]);

  const request = useCallback(
    (
      kind: TypeScriptDiagnosticRequest["kind"],
      position: number,
      code?: string
    ): Promise<TypeScriptDiagnosticResponse | null> => {
      const worker = ensureWorker();
      if (!worker) return Promise.resolve(null);
      const id = ++requestId.current;
      return new Promise((resolve) => {
        pending.current.set(id, resolve);
        worker.postMessage({
          ...(JSON.parse(source) as TypeScriptSourceInput),
          code: code ?? input.code,
          id,
          kind,
          position,
        });
      });
    },
    [source, ensureWorker, input.code]
  );

  const requestCompletions = useCallback(
    async (position: number, code?: string): Promise<TypeScriptCompletion[]> =>
      (await request("completions", position, code))?.completions ?? [],
    [request]
  );
  const requestHover = useCallback(
    async (position: number, code?: string): Promise<TypeScriptHover | null> =>
      (await request("hover", position, code))?.hover ?? null,
    [request]
  );
  const requestRename = useCallback(
    async (position: number): Promise<TypeScriptRenameEdit[]> =>
      (await request("rename", position))?.rename ?? [],
    [request]
  );

  return {
    ...(enabled ? analysis : { result: null, isPending: false }),
    requestCompletions,
    requestHover,
    requestRename,
  };
};
