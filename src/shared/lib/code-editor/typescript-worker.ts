import {
  createTypeScriptDiagnostics,
  type TypeScriptDiagnosticRequest,
  type TypeScriptDiagnosticResponse,
} from "./typescript-diagnostics";

// The installed `typescript` package delegates to @typescript/old, which owns
// the standard declarations. They are bundled only into this worker.
const rawLibraries = import.meta.glob<string>("/node_modules/@typescript/old/lib/lib*.d.ts", {
  query: "?raw",
  import: "default",
  eager: true,
});
const libraries = new Map(
  Object.entries(rawLibraries).map(([path, source]) => [
    `/${path.slice(path.lastIndexOf("/") + 1)}`,
    source,
  ])
);
const reactLibraries = import.meta.glob<string>(
  ["/node_modules/@types/react/*.d.ts", "/node_modules/csstype/index.d.ts"],
  { query: "?raw", import: "default", eager: true }
);
for (const [path, source] of Object.entries(reactLibraries)) libraries.set(path, source);
const diagnose = createTypeScriptDiagnostics(libraries);

self.onmessage = (event: MessageEvent<TypeScriptDiagnosticRequest>): void => {
  const { id, ...input } = event.data;
  try {
    const response: TypeScriptDiagnosticResponse = { id, problems: diagnose(input) };
    self.postMessage(response);
  } catch (error: unknown) {
    const response: TypeScriptDiagnosticResponse = {
      id,
      problems: [
        {
          id: "typescript-unavailable",
          line: 1,
          col: 1,
          message: `Не удалось проверить типы: ${error instanceof Error ? error.message : String(error)}`,
          rule: "typescript",
          severity: "warning",
        },
      ],
    };
    self.postMessage(response);
  }
};
