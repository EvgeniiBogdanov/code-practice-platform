import ts from "typescript";
import { createTypeScriptEditorService } from "@/shared/lib/code-editor/typescriptDiagnostics";

const libDirectory = ts.getDefaultLibFilePath({}).replace(/[/\\][^/\\]+$/, "");

/** Standard library declarations keyed the way the editor worker keys them (`/lib.*.d.ts`). */
export const nodeLibraries: ReadonlyMap<string, string> = new Map(
  ts.sys
    .readDirectory(libDirectory, [".d.ts"])
    .filter((file) => /[/\\]lib[^/\\]*\.d\.ts$/.test(file))
    .map((file) => [`/${file.split(/[/\\]/).pop()}`, ts.sys.readFile(file) ?? ""])
);

/** The same language service the browser worker runs, backed by the installed libraries. */
export const createNodeTypeScriptService = (): ReturnType<typeof createTypeScriptEditorService> =>
  createTypeScriptEditorService(nodeLibraries);
