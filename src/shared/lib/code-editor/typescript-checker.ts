import TypeScriptWorker from "./typescript-worker?worker";

export type {
  TypeScriptSourceInput,
  TypeScriptDiagnosticRequest,
  TypeScriptDiagnosticResponse,
  TypeScriptCompletion,
  TypeScriptHover,
  TypeScriptSignature,
  TypeScriptRenameEdit,
} from "./typescript-diagnostics";

export const createTypeScriptChecker = (): Worker => new TypeScriptWorker();
