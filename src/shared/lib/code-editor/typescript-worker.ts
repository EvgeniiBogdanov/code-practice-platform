import {
  createTypeScriptEditorService,
  type TypeScriptDiagnosticRequest,
  type TypeScriptDiagnosticResponse,
} from "./typescript-diagnostics";
import projectConfig from "../../../../tsconfig.json?raw";

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
  [
    "/node_modules/@types/react/*.d.ts",
    "/node_modules/@types/react-dom/*.d.ts",
    "/node_modules/@types/prop-types/*.d.ts",
    "/node_modules/@types/scheduler/*.d.ts",
    "/node_modules/csstype/index.d.ts",
    "/node_modules/lucide-react/dist/*.d.ts",
    "/node_modules/lucide-react/*.d.ts",
    "/node_modules/react-redux/dist/*.d.ts",
    "/node_modules/zustand/**/*.d.ts",
    "/node_modules/@reduxjs/toolkit/dist/**/*.d.ts",
  ],
  { query: "?raw", import: "default", eager: true }
);
for (const [path, source] of Object.entries(reactLibraries)) libraries.set(path, source);
const packageMetadata = import.meta.glob<string>(
  [
    "/node_modules/@types/{react,react-dom,prop-types,scheduler}/package.json",
    "/node_modules/{csstype,lucide-react,react-redux,zustand}/package.json",
    "/node_modules/@reduxjs/toolkit/package.json",
  ],
  { query: "?raw", import: "default", eager: true }
);
for (const [path, source] of Object.entries(packageMetadata)) libraries.set(path, source);
const editorService = createTypeScriptEditorService(libraries, projectConfig);

self.onmessage = (event: MessageEvent<TypeScriptDiagnosticRequest>): void => {
  const { id, ...input } = event.data;
  try {
    const position = input.position ?? 0;
    const response: TypeScriptDiagnosticResponse = { id, kind: input.kind };
    switch (input.kind) {
      case "completions":
        response.completions = editorService.complete(input, position);
        break;
      case "hover":
        response.hover = editorService.hover(input, position);
        break;
      case "signature":
        response.signature = editorService.signature(input, position);
        break;
      case "rename":
        response.rename = editorService.rename(input, position);
        break;
      case "diagnostics":
        response.problems = editorService.diagnose(input);
        break;
    }
    self.postMessage(response);
  } catch (error: unknown) {
    const response: TypeScriptDiagnosticResponse = {
      id,
      kind: input.kind,
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
