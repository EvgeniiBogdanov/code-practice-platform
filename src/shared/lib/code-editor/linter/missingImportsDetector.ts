import { KNOWN_SYMBOLS, KnownSymbolInfo } from "./knownSymbols";
import {
  stripCommentsAndStrings,
  extractImportedSymbols,
  extractDeclaredSymbols,
} from "./scopeAnalyzer";
import { getLanguageId, getLanguageCapabilities } from "../languages/languageDetector";

export interface LintProblem {
  id: string;
  line: number;
  col: number;
  message: string;
  rule: string;
  severity: "error" | "warning";
  typo?: string;
  correct?: string;
  symbol?: string;
  module?: string;
  isDefault?: boolean;
  category?: string;
}

export function detectMissingImports(
  code: string,
  lines: string[],
  files?: Array<{ name?: string; code?: string }>,
  filepath = "main.jsx"
): {
  problems: LintProblem[];
  missingImportMap: Record<number, LintProblem>;
  allMissingImports: LintProblem[];
} {
  const languageId = getLanguageId(filepath);
  const capabilities = getLanguageCapabilities(languageId);

  if (!capabilities.supportsAutoImport) {
    return { problems: [], missingImportMap: {}, allMissingImports: [] };
  }

  const problems: LintProblem[] = [];
  const missingImportMap: Record<number, LintProblem> = {};
  const allMissingImports: LintProblem[] = [];
  const seenMissingSymbols = new Set<string>();

  const importedSymbols = extractImportedSymbols(code);
  const declaredSymbols = extractDeclaredSymbols(code);

  const symbolRegistry: Record<string, KnownSymbolInfo> = {};

  Object.entries(KNOWN_SYMBOLS).forEach(([sym, info]) => {
    // If not in React environment, do not check React/Redux/Zustand/Lucide missing imports
    if (
      !capabilities.supportsReactHooks &&
      ["hook", "api", "type", "namespace", "redux", "zustand", "icon"].includes(info.category)
    ) {
      return;
    }
    symbolRegistry[sym] = info;
  });

  if (Array.isArray(files)) {
    files.forEach((f) => {
      if (!f || !f.name) return;
      const baseName = f.name.replace(/\.[^.]+$/, "");
      if (baseName && /^[A-Z][a-zA-Z0-9_$]*$/.test(baseName)) {
        if (!symbolRegistry[baseName]) {
          symbolRegistry[baseName] = {
            module: `./${baseName}`,
            isDefault: true,
            category: "local",
            isComponent: true,
          };
        }
      }
    });
  }

  Object.entries(symbolRegistry).forEach(([sym, info]) => {
    if (importedSymbols.has(sym) || declaredSymbols.has(sym)) {
      return;
    }

    lines.forEach((line, lineIdx) => {
      const lineNum = lineIdx + 1;
      const trimmed = line.trim();

      if (
        trimmed.startsWith("//") ||
        trimmed.startsWith("/*") ||
        trimmed.startsWith("*") ||
        trimmed.startsWith("import ")
      ) {
        return;
      }

      const codePart = stripCommentsAndStrings(line);
      if (!codePart.includes(sym)) return;

      const symRegex = new RegExp(`\\b${sym}\\b`, "g");
      let match: RegExpExecArray | null;
      while ((match = symRegex.exec(codePart)) !== null) {
        const col = match.index + 1;
        const matchIdx = match.index;

        const textBefore = codePart.substring(0, matchIdx).trimEnd();
        if (textBefore.endsWith(".") || textBefore.endsWith("?.")) {
          continue;
        }

        const textAfter = codePart.substring(matchIdx + sym.length).trimStart();
        if (
          textAfter.startsWith(":") &&
          !textAfter.startsWith(":=") &&
          !textAfter.startsWith("::")
        ) {
          if (
            !textBefore.endsWith("let") &&
            !textBefore.endsWith("const") &&
            !textBefore.endsWith("var")
          ) {
            continue;
          }
        }

        if (info.requiresCallCheck && !textAfter.startsWith("(") && !textAfter.startsWith("<")) {
          continue;
        }

        if (
          info.category === "icon" &&
          !textBefore.endsWith("<") &&
          !textBefore.endsWith("</") &&
          !textAfter.startsWith("(") &&
          !textAfter.startsWith("/")
        ) {
          if (!/^[<{,\s]/.test(textBefore.slice(-1)) || !/[/>},\s]/.test(textAfter.charAt(0))) {
            continue;
          }
        }

        const importSnippet = info.isDefault
          ? `import ${sym} from '${info.module}';`
          : `import { ${sym} } from '${info.module}';`;

        const problem: LintProblem = {
          id: `missing-import-${lineNum}-${col}-${sym}`,
          line: lineNum,
          col,
          symbol: sym,
          module: info.module,
          isDefault: info.isDefault,
          category: info.category,
          message: `'${sym}' не импортирован. Добавьте: ${importSnippet}`,
          rule: "missing-import",
          severity: "error",
        };

        problems.push(problem);

        if (!missingImportMap[lineNum]) {
          missingImportMap[lineNum] = problem;
        }

        if (!seenMissingSymbols.has(sym)) {
          seenMissingSymbols.add(sym);
          allMissingImports.push(problem);
        }
      }
    });
  });

  return { problems, missingImportMap, allMissingImports };
}
