/**
 * Sucrase JSX / TypeScript Transpiler with Loop Protection
 */

import { transform } from "sucrase";

export function normalizeAndProtectLoops(code: string): string {
  if (!code || typeof code !== "string") return code;
  let loopId = 0;

  let transformed = code.replace(
    /\b(while|for)\s*\(([^)]*)\)\s*(?!\{)([^{;\n]+;)/g,
    (_, type, cond, stmt) => `${type}(${cond}) { ${stmt} }`
  );

  transformed = transformed.replace(/\b(while|for)\s*\(([^)]*)\)\s*\{/g, (_, type, condition) => {
    const id = ++loopId;
    return `let _lt_${id} = Date.now(), _lc_${id} = 0; ${type}(${condition}) { if (++_lc_${id} > 200000 && Date.now() - _lt_${id} > 1500) { throw new Error("Обнаружен потенциальный бесконечный цикл (таймаут 1.5 сек)"); }`;
  });

  transformed = transformed.replace(/\bdo\s*\{/g, () => {
    const id = ++loopId;
    return `let _lt_${id} = Date.now(), _lc_${id} = 0; do { if (++_lc_${id} > 200000 && Date.now() - _lt_${id} > 1500) { throw new Error("Обнаружен потенциальный бесконечный цикл (таймаут 1.5 сек)"); }`;
  });

  return transformed;
}

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
    const transforms: any[] = ["jsx", "imports"];
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
  } catch (err: any) {
    return { code: null, error: err };
  }
}
