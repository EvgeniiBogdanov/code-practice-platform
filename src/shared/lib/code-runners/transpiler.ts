/**
 * Sucrase JSX / TypeScript Transpiler with Loop Protection
 */

import { transform, type Transform } from "sucrase";
import { normalizeAndProtectLoops } from "./protectLoops";

export { normalizeAndProtectLoops };

export function transpileCode(
  code: string,
  filename = "index.jsx"
): { code: string | null; error: Error | null } {
  if (!code || typeof code !== "string" || !code.trim()) {
    return { code: null, error: null };
  }

  try {
    const protectedCode = normalizeAndProtectLoops(code);
    const isTs = filename.endsWith(".ts") || filename.endsWith(".tsx");
    const transforms: Transform[] = ["jsx", "imports"];
    if (isTs) {
      transforms.push("typescript");
    }

    const output = transform(protectedCode, {
      transforms,
      jsxRuntime: "automatic",
      production: true,
    });

    const safeCode = (output.code || "").replace(/\n(\s*)\(\s*\{/g, "\n$1;({");
    return { code: safeCode, error: null };
  } catch (err) {
    return { code: null, error: err instanceof Error ? err : new Error(String(err)) };
  }
}
