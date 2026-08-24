/**
 * JavaScript, JSX, TypeScript Live Linter Engine
 */

import { KEYWORD_TYPOS, TYPO_MASTER_REGEX } from "./linter/keywordTypos";
import { KNOWN_SYMBOLS } from "./linter/knownSymbols";
import {
  stripCommentsAndStrings,
  extractImportedSymbols,
  extractDeclaredSymbols,
  findDuplicateDeclarations,
  findUnusedImports,
} from "./linter/scopeAnalyzer";
import { addImportToFile } from "./importManager";
import { checkTypeScriptTypes, checkComponentProps } from "./typeChecker";
import { detectMissingImports, type LintProblem } from "./linter/missingImportsDetector";
import { validateBrackets } from "./linter/bracketValidator";
import { getLanguageId, getLanguageCapabilities } from "./languages/languageDetector";

export {
  KEYWORD_TYPOS,
  KNOWN_SYMBOLS,
  stripCommentsAndStrings,
  extractImportedSymbols,
  extractDeclaredSymbols,
  findDuplicateDeclarations,
  findUnusedImports,
};
export type { LintProblem };

export interface LintResult {
  problems: LintProblem[];
  errorCount: number;
  warningCount: number;
  isValid: boolean;
  typoMap: Record<number, LintProblem>;
  missingImportMap: Record<number, LintProblem>;
  allMissingImports: LintProblem[];
  unusedImports: Set<string>;
}

export function lintJavaScriptCode(
  code: string,
  options: { files?: Array<{ name?: string; code?: string }>; filepath?: string } = {}
): LintResult {
  if (!code || typeof code !== "string" || !code.trim()) {
    return {
      problems: [],
      errorCount: 0,
      warningCount: 0,
      isValid: true,
      typoMap: {},
      missingImportMap: {},
      allMissingImports: [],
      unusedImports: new Set(),
    };
  }

  const filepath = options.filepath || "main.jsx";
  const languageId = getLanguageId(filepath);
  const capabilities = getLanguageCapabilities(languageId);

  // If not a JS/TS/JSX/TSX file, skip JS-specific lint rules
  if (["css", "html", "json", "sql", "markdown", "plaintext"].includes(languageId)) {
    return {
      problems: [],
      errorCount: 0,
      warningCount: 0,
      isValid: true,
      typoMap: {},
      missingImportMap: {},
      allMissingImports: [],
      unusedImports: new Set(),
    };
  }

  const problems: LintProblem[] = [];
  const typoMap: Record<number, LintProblem> = {};
  const lines = code.split("\n");

  // 1. Keyword Typos & var / NaN rules
  lines.forEach((line, lineIdx) => {
    const lineNum = lineIdx + 1;
    const trimmed = line.trim();

    if (trimmed.startsWith("//") || trimmed.startsWith("/*") || trimmed.startsWith("*")) {
      return;
    }

    const codePart = stripCommentsAndStrings(line);
    TYPO_MASTER_REGEX.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = TYPO_MASTER_REGEX.exec(codePart)) !== null) {
      const matchedWord = match[0];
      const lower = matchedWord.toLowerCase();
      const correct = KEYWORD_TYPOS[lower];

      if (correct && matchedWord !== correct) {
        const col = match.index + 1;
        const problem: LintProblem = {
          id: `typo-${lineNum}-${col}`,
          line: lineNum,
          col,
          typo: matchedWord,
          correct,
          message: `Опечатка в ключевом слове: '${matchedWord}' вместо '${correct}'`,
          rule: "keyword-typo",
          severity: "error",
        };
        problems.push(problem);
        typoMap[lineNum] = problem;
      }
    }

    if (/\bvar\s+[a-zA-Z0-9_$]+/.test(codePart)) {
      problems.push({
        id: `warn-var-${lineNum}`,
        line: lineNum,
        col: codePart.indexOf("var") + 1,
        message: "Использование 'var' устарело, используйте 'let' или 'const'",
        rule: "no-var",
        severity: "warning",
      });
    }

    if (/===?\s*NaN\b|!==?\s*NaN\b/.test(codePart)) {
      problems.push({
        id: `err-isnan-${lineNum}`,
        line: lineNum,
        col: codePart.indexOf("NaN") + 1,
        message: "Используйте Number.isNaN() вместо прямого сравнения с NaN",
        rule: "use-isnan",
        severity: "error",
      });
    }
  });

  // 2. Missing Imports (scoped by language environment)
  const missingImportsRes = detectMissingImports(code, lines, options.files, filepath);
  problems.push(...missingImportsRes.problems);

  // 3. Bracket Matching
  const bracketProblems = validateBrackets(lines, typoMap);
  problems.push(...bracketProblems);

  // 4. Duplicate Declarations
  const duplicateDeclarations = findDuplicateDeclarations(code);
  for (const dup of duplicateDeclarations) {
    problems.push({
      id: `duplicate-${dup.line}-${dup.column}-${dup.name}`,
      line: dup.line,
      col: dup.column,
      message: dup.message,
      rule: "duplicate-identifier",
      severity: "error",
    });
  }

  // 5. TypeScript Types (only if TS supported)
  if (capabilities.supportsTypeScript) {
    const tsTypeProblems = checkTypeScriptTypes(code);
    for (const tsProb of tsTypeProblems) {
      problems.push(tsProb as LintProblem);
    }
  }

  // 6. React Component Props (only if JSX supported)
  if (capabilities.supportsJsx) {
    const propsProblems = checkComponentProps(code, options);
    for (const propProb of propsProblems) {
      problems.push(propProb as LintProblem);
    }
  }

  const errorCount = problems.filter((p) => p.severity === "error").length;
  const warningCount = problems.filter((p) => p.severity === "warning").length;
  const unusedImports = findUnusedImports(code);

  return {
    problems,
    errorCount,
    warningCount,
    isValid: errorCount === 0,
    typoMap,
    missingImportMap: missingImportsRes.missingImportMap,
    allMissingImports: missingImportsRes.allMissingImports,
    unusedImports,
  };
}

export function fixTypoInCode(
  code: string,
  lineNum: number,
  typo: string,
  correct: string
): string {
  const lines = code.split("\n");
  if (lineNum - 1 < lines.length) {
    const regex = new RegExp(`\\b${typo}\\b`, "i");
    lines[lineNum - 1] = lines[lineNum - 1].replace(regex, correct);
    return lines.join("\n");
  }
  return code;
}

export function fixMissingImportInCode(
  code: string,
  symbol: string,
  moduleSpecifier: string,
  isDefault = false
): string {
  const res = addImportToFile(code, symbol, moduleSpecifier, isDefault);
  return res.newCode;
}

export const lintCode = lintJavaScriptCode;
