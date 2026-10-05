import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  acquireTypeScriptClient,
  type EditorDiagnostic,
  type TypeScriptClient,
  type TypeScriptDiagnosticResponse,
  type TypeScriptRequest,
  type TypeScriptSourceInput,
  type TypeScriptCompletion,
  type TypeScriptHover,
  type TypeScriptSignature,
  type TypeScriptRenameEdit,
  type TypeScriptCodeFix,
  type TypeScriptLocation,
} from "@/shared/lib/code-editor";

export interface TypeScriptAnalysis {
  problems: EditorDiagnostic[] | null;
  isPending: boolean;
  requestCompletions: (position: number, code?: string) => Promise<TypeScriptCompletion[]>;
  requestHover: (position: number, code?: string) => Promise<TypeScriptHover | null>;
  requestSignature: (position: number, code?: string) => Promise<TypeScriptSignature | null>;
  requestRename: (position: number) => Promise<TypeScriptRenameEdit[]>;
  requestCodeFixes: (diagnostic: EditorDiagnostic) => Promise<TypeScriptCodeFix[]>;
  requestDefinition: (position: number) => Promise<TypeScriptLocation | null>;
}

const LOAD_FAILED: EditorDiagnostic = {
  id: "typescript-load",
  line: 1,
  col: 1,
  start: 0,
  end: 0,
  code: 0,
  severity: "warning",
  synthetic: true,
  message: "Не удалось загрузить проверку TypeScript. Перезагрузите страницу.",
};

export const useTypeScriptDiagnostics = (
  input: TypeScriptSourceInput,
  enabled: boolean,
  languageEnabled = enabled
): TypeScriptAnalysis => {
  const clientRef = useRef<TypeScriptClient | null>(null);
  const inputRef = useRef(input);
  inputRef.current = input;
  const latestDiagnostics = useRef(0);
  const [analysis, setAnalysis] = useState<{
    problems: EditorDiagnostic[] | null;
    isPending: boolean;
  }>({ problems: null, isPending: false });
  // Content is the dependency: unrelated editor renders must not recheck the file. The other
  // files are serialised once per array, not on every keystroke's several renders.
  const { code, filepath, files } = input;
  const filesKey = useMemo(() => JSON.stringify(files), [files]);

  useEffect(() => {
    if (!languageEnabled || typeof Worker === "undefined") return;
    const client = acquireTypeScriptClient();
    clientRef.current = client;
    return (): void => {
      client.release();
      clientRef.current = null;
    };
  }, [languageEnabled]);

  useEffect(() => {
    if (!enabled) return;
    const id = ++latestDiagnostics.current;
    // Keep the previous problems while typing, as VS Code does, instead of flickering.
    setAnalysis((current) => ({ ...current, isPending: true }));
    const timer = setTimeout(async () => {
      const client = clientRef.current;
      if (!client) return;
      const response = await client.request({ ...inputRef.current, kind: "diagnostics" });
      if (id !== latestDiagnostics.current) return;
      setAnalysis({ isPending: false, problems: response?.problems ?? [LOAD_FAILED] });
    }, 250);
    return (): void => clearTimeout(timer);
  }, [enabled, code, filepath, filesKey]);

  const request = useCallback(
    (message: Omit<TypeScriptRequest, keyof TypeScriptSourceInput> & { code?: string }) =>
      clientRef.current?.request({
        ...inputRef.current,
        ...message,
        code: message.code ?? inputRef.current.code,
      }) ?? Promise.resolve<TypeScriptDiagnosticResponse | null>(null),
    []
  );

  const requestCompletions = useCallback(
    async (position: number, code?: string): Promise<TypeScriptCompletion[]> =>
      (await request({ kind: "completions", position, code }))?.completions ?? [],
    [request]
  );
  const requestHover = useCallback(
    async (position: number, code?: string): Promise<TypeScriptHover | null> =>
      (await request({ kind: "hover", position, code }))?.hover ?? null,
    [request]
  );
  const requestSignature = useCallback(
    async (position: number, code?: string): Promise<TypeScriptSignature | null> =>
      (await request({ kind: "signature", position, code }))?.signature ?? null,
    [request]
  );
  const requestRename = useCallback(
    async (position: number): Promise<TypeScriptRenameEdit[]> =>
      (await request({ kind: "rename", position }))?.rename ?? [],
    [request]
  );
  const requestCodeFixes = useCallback(
    async (diagnostic: EditorDiagnostic): Promise<TypeScriptCodeFix[]> =>
      (
        await request({
          kind: "codefix",
          position: diagnostic.start,
          end: diagnostic.end,
          errorCode: diagnostic.code,
        })
      )?.codefixes ?? [],
    [request]
  );
  const requestDefinition = useCallback(
    async (position: number): Promise<TypeScriptLocation | null> =>
      (await request({ kind: "definition", position }))?.definition ?? null,
    [request]
  );

  return {
    ...(enabled ? analysis : { problems: null, isPending: false }),
    requestCompletions,
    requestHover,
    requestSignature,
    requestRename,
    requestCodeFixes,
    requestDefinition,
  };
};
