export interface LintProblem {
  id: string;
  line: number;
  col: number;
  message: string;
  rule: string;
  severity: "error" | "warning";
}

export function validateBrackets(lines: string[], typoMap: Record<number, any>): LintProblem[] {
  const problems: LintProblem[] = [];
  const stack: Array<{ char: string; line: number; col: number; isTemplateExpr?: boolean }> = [];
  let inBlockComment = false;
  let inString: string | null = null;
  let prevTokenChar = "";

  for (let lIdx = 0; lIdx < lines.length; lIdx++) {
    const line = lines[lIdx];
    const lineNum = lIdx + 1;

    for (let cIdx = 0; cIdx < line.length; cIdx++) {
      const ch = line[cIdx];
      const nextCh = line[cIdx + 1];

      if (inBlockComment) {
        if (ch === "*" && nextCh === "/") {
          inBlockComment = false;
          cIdx++;
        }
        continue;
      }

      if (!inString && ch === "/" && nextCh === "/") {
        break;
      }

      if (!inString && ch === "/" && nextCh === "*") {
        inBlockComment = true;
        cIdx++;
        continue;
      }

      if (inString) {
        if (ch === "\\") {
          cIdx++;
          continue;
        }
        if (inString === "`" && ch === "$" && nextCh === "{") {
          stack.push({ char: "${", line: lineNum, col: cIdx + 1, isTemplateExpr: true });
          inString = null;
          cIdx++;
          continue;
        }
        if (ch === inString) {
          inString = null;
        }
        continue;
      }

      if (ch === "/" && !inString) {
        const isRegexStart =
          /^[=(,[!?:;&|~^+\-*/]\s*$/.test(prevTokenChar) ||
          prevTokenChar === "" ||
          /\b(return|typeof|instanceof|case|delete|void|throw|yield|await)$/.test(prevTokenChar);

        if (isRegexStart && nextCh !== "/" && nextCh !== "*") {
          let rIdx = cIdx + 1;
          let inCharClass = false;
          let closed = false;

          while (rIdx < line.length) {
            const rc = line[rIdx];
            if (rc === "\\") {
              rIdx += 2;
              continue;
            }
            if (rc === "[") inCharClass = true;
            else if (rc === "]") inCharClass = false;
            else if (rc === "/" && !inCharClass) {
              closed = true;
              break;
            }
            rIdx++;
          }

          if (closed) {
            cIdx = rIdx;
            prevTokenChar = "regex";
            continue;
          }
        }
      }

      if (!/\s/.test(ch)) {
        prevTokenChar = ch;
      }

      if (ch === "'" || ch === '"' || ch === "`") {
        inString = ch;
        continue;
      }

      if (ch === "{" || ch === "(" || ch === "[") {
        stack.push({ char: ch, line: lineNum, col: cIdx + 1 });
      } else if (ch === "}" || ch === ")" || ch === "]") {
        if (ch === "}" && stack.length > 0 && stack[stack.length - 1].isTemplateExpr) {
          stack.pop();
          inString = "`";
          continue;
        }

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

  while (stack.length > 0) {
    const unclosed = stack.pop()!;
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

  return problems;
}
