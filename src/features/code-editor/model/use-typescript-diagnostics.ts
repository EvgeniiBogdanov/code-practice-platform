import { useEffect, useRef, useState } from "react";
import {
  createTypeScriptChecker,
  type TypeScriptDiagnosticRequest,
  type TypeScriptDiagnosticResponse,
  type TypeScriptSourceInput,
  type LintResult,
} from "@/shared/lib/code-editor";

interface TypeScriptAnalysis {
  result: LintResult | null;
  isPending: boolean;
}

export const useTypeScriptDiagnostics = (
  input: TypeScriptSourceInput,
  enabled: boolean
): TypeScriptAnalysis => {
  const workerRef = useRef<Worker | null>(null);
  const requestId = useRef(0);
  const [analysis, setAnalysis] = useState<TypeScriptAnalysis>({ result: null, isPending: false });
  // Use content as the dependency: unrelated editor renders must not recheck the file.
  const source = JSON.stringify(input);

  useEffect(() => {
    if (!enabled) return;
    const worker = createTypeScriptChecker();
    workerRef.current = worker;
    worker.onmessage = ({ data }: MessageEvent<TypeScriptDiagnosticResponse>): void => {
      if (data.id !== requestId.current) return;
      const errorCount = data.problems.filter((problem) => problem.severity === "error").length;
      setAnalysis({
        isPending: false,
        result: {
          problems: data.problems,
          errorCount,
          warningCount: data.problems.length - errorCount,
          isValid: errorCount === 0,
          typoMap: {},
          missingImportMap: {},
          allMissingImports: [],
          unusedImports: new Set(),
        },
      });
    };
    worker.onerror = (): void => {
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
    return (): void => {
      worker.terminate();
      workerRef.current = null;
      requestId.current += 1;
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    const id = ++requestId.current;
    setAnalysis({ result: null, isPending: true });
    const timer = setTimeout(() => {
      const request: TypeScriptDiagnosticRequest = { ...JSON.parse(source), id };
      workerRef.current?.postMessage(request);
    }, 250);
    return (): void => clearTimeout(timer);
  }, [enabled, source]);

  return enabled ? analysis : { result: null, isPending: false };
};
