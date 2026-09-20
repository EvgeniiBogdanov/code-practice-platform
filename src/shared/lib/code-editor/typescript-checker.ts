import TypeScriptWorker from "./typescript-worker?worker";

export type {
  TypeScriptSourceInput,
  TypeScriptDiagnosticRequest,
  TypeScriptDiagnosticResponse,
} from "./typescript-diagnostics";

export const createTypeScriptChecker = (): Worker => new TypeScriptWorker();
