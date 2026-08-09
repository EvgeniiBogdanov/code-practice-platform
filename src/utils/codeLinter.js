/**
 * codeLinter.js
 * Надежная и быстрая проверка синтаксиса и орфографии JavaScript / TypeScript / React JSX ключевых слов (Typo Checker).
 * Корректно игнорирует комментарии //, /* ... * / и строки, полноценно поддерживает JSX/TSX разметку.
 */

export const KEYWORD_TYPOS = {
  conts: "const",
  cosnt: "const",
  cotns: "const",
  cnost: "const",
  cnsot: "const",
  fucntion: "function",
  funtion: "function",
  funciton: "function",
  fnction: "function",
  fuction: "function",
  reutrn: "return",
  retrun: "return",
  retun: "return",
  reurn: "return",
  asnyc: "async",
  aync: "async",
  asnc: "async",
  awiat: "await",
  awit: "await",
  calss: "class",
  clsas: "class",
  improt: "import",
  imprt: "import",
  exprot: "export",
  exprt: "export",
  lenght: "length",
  lengh: "length",
  consol: "console",
  cosnole: "console",
  cosole: "console",
  pormise: "Promise",
  promse: "Promise",
  stirng: "string",
  nubmer: "number",
  bollean: "boolean",
  usesate: "useState",
  usestate: "useState",
  useefect: "useEffect",
  useeffect: "useEffect",
  useref: "useRef",
  usememo: "useMemo",
  usecallback: "useCallback",
  usecontext: "useContext",
  usereducer: "useReducer",
};

/**
 * Безопасно удаляет комментарии и строки для чистого анализа скобок и ключевых слов
 */
export const stripCommentsAndStrings = (code) => {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "")
    .replace(/'(?:\\.|[^'\\])*'/g, "''")
    .replace(/"(?:\\.|[^"\\])*"/g, '""')
    .replace(/`(?:\\.|[^`\\])*`/g, "``");
};

export const lintJavaScriptCode = (code) => {
  if (!code || typeof code !== "string" || !code.trim()) {
    return { problems: [], errorCount: 0, warningCount: 0, isValid: true, typoMap: {} };
  }

  const problems = [];
  const typoMap = {}; // lineNum -> { typo, correct, col }
  const lines = code.split("\n");

  // 1. Построчная проверка опечаток в ключевых словах (строго вне комментариев и строк)
  lines.forEach((line, lineIdx) => {
    const lineNum = lineIdx + 1;
    const trimmed = line.trim();

    // Пропуск строк, состоящих только из комментариев
    if (trimmed.startsWith("//") || trimmed.startsWith("/*") || trimmed.startsWith("*")) {
      return;
    }

    // Исключаем комментарии и строковые литералы перед проверкой опечаток
    const codePart = line
      .replace(/\/\/.*$/, "")
      .replace(/\/\*.*?\*\//g, "")
      .replace(/'(?:\\.|[^'\\])*'/g, "''")
      .replace(/"(?:\\.|[^"\\])*"/g, '""')
      .replace(/`(?:\\.|[^`\\])*`/g, "``");

    // Проверка опечаток по словарю
    for (const [typo, correct] of Object.entries(KEYWORD_TYPOS)) {
      const regex = new RegExp(`\\b${typo}\\b`, "gi");
      let match;
      while ((match = regex.exec(codePart)) !== null) {
        if (match[0].toLowerCase() === typo.toLowerCase() && match[0] !== correct) {
          const col = match.index + 1;
          const problem = {
            id: `typo-${lineNum}-${col}`,
            line: lineNum,
            col,
            typo: match[0],
            correct,
            message: `Опечатка в ключевом слове: '${match[0]}' вместо '${correct}'`,
            rule: "keyword-typo",
            severity: "error",
          };
          problems.push(problem);
          typoMap[lineNum] = problem;
        }
      }
    }

    // Проверка устаревшего var (только вне комментариев)
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

    // Проверка прямого сравнения с NaN
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

  // 2. Парсер баланса скобок и кавычек с поддержкой React JSX/TSX
  const stack = [];
  let inBlockComment = false;
  let inString = null;

  for (let lIdx = 0; lIdx < lines.length; lIdx++) {
    const line = lines[lIdx];
    const lineNum = lIdx + 1;

    for (let cIdx = 0; cIdx < line.length; cIdx++) {
      const ch = line[cIdx];
      const nextCh = line[cIdx + 1];

      // Многострочный комментарий
      if (inBlockComment) {
        if (ch === "*" && nextCh === "/") {
          inBlockComment = false;
          cIdx++;
        }
        continue;
      }

      // Строковый литерал
      if (inString) {
        if (ch === "\\") {
          cIdx++; // пропускаем экранированный символ
        } else if (ch === inString) {
          inString = null;
        }
        continue;
      }

      // Начало однострочного комментария
      if (ch === "/" && nextCh === "/") {
        break; // остаток строки — комментарий
      }

      // Начало многострочного комментария
      if (ch === "/" && nextCh === "*") {
        inBlockComment = true;
        cIdx++;
        continue;
      }

      // Начало строкового литерала
      if (ch === "'" || ch === '"' || ch === "`") {
        inString = ch;
        continue;
      }

      // Проверка открывающих скобок
      if (ch === "{" || ch === "(" || ch === "[") {
        stack.push({ char: ch, line: lineNum, col: cIdx + 1 });
      } else if (ch === "}" || ch === ")" || ch === "]") {
        const expected = ch === "}" ? "{" : ch === ")" ? "(" : "[";
        if (stack.length === 0 || stack[stack.length - 1].char !== expected) {
          if (!typoMap[lineNum]) {
            problems.push({
              id: `bracket-${lineNum}-${cIdx}`,
              line: lineNum,
              col: cIdx + 1,
              message: `Неожиданная закрывающая скобка '${ch}'`,
              rule: "syntax-bracket",
              severity: "error",
            });
          }
        } else {
          stack.pop();
        }
      }
    }
  }

  // Проверка незакрытых скобок
  while (stack.length > 0) {
    const unclosed = stack.pop();
    if (!typoMap[unclosed.line]) {
      problems.push({
        id: `unclosed-${unclosed.line}-${unclosed.col}`,
        line: unclosed.line,
        col: unclosed.col,
        message: `Не закрыта скобка '${unclosed.char}'`,
        rule: "syntax-unclosed",
        severity: "error",
      });
    }
  }

  const errorCount = problems.filter((p) => p.severity === "error").length;
  const warningCount = problems.filter((p) => p.severity === "warning").length;

  return {
    problems,
    errorCount,
    warningCount,
    isValid: errorCount === 0,
    typoMap,
  };
};

/**
 * Автоматическое исправление конкретной опечатки в коде
 */
export const fixTypoInCode = (code, lineNum, typo, correct) => {
  const lines = code.split("\n");
  if (lineNum - 1 < lines.length) {
    const regex = new RegExp(`\\b${typo}\\b`, "i");
    lines[lineNum - 1] = lines[lineNum - 1].replace(regex, correct);
    return lines.join("\n");
  }
  return code;
};
