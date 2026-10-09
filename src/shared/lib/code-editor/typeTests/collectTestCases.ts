import ts from "typescript";
import type { TypeTestCase } from "../typescriptTypes";

export interface CollectedTests {
  cases: TypeTestCase[];
  /** Structural problems of `tests.ts` itself: a content bug, caught by the CI guard. */
  errors: string[];
}

const stringLiteralText = (node: ts.Expression | undefined): string | null =>
  node && (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) ? node.text : null;

const calleeName = (call: ts.CallExpression): string | null =>
  ts.isIdentifier(call.expression) ? call.expression.text : null;

const functionBody = (node: ts.Expression | undefined): ts.Block | null => {
  if (!node || !(ts.isArrowFunction(node) || ts.isFunctionExpression(node))) return null;
  return ts.isBlock(node.body) ? node.body : null;
};

const statementCall = (statement: ts.Statement): ts.CallExpression | null =>
  ts.isExpressionStatement(statement) && ts.isCallExpression(statement.expression)
    ? statement.expression
    : null;

/**
 * Finds `describe("…", () => { test("…", () => { … }) })` blocks. `tests.ts` may contain
 * nothing else at the top level: any helper declaration would clash with the solution's names.
 */
export const collectTestCases = (source: string): CollectedTests => {
  const file = ts.createSourceFile("tests.ts", source, ts.ScriptTarget.ESNext, true);
  const cases: TypeTestCase[] = [];
  const errors: string[] = [];
  const seen = new Set<string>();

  const addTest = (
    statement: ts.Statement,
    call: ts.CallExpression,
    group: string | null
  ): void => {
    const name = stringLiteralText(call.arguments[0]);
    if (name === null || !functionBody(call.arguments[1])) {
      errors.push("test() принимает строковый литерал и функцию с телом в фигурных скобках");
      return;
    }
    const id = `${group ?? ""}/${name}`;
    if (seen.has(id)) errors.push(`Дублирующееся имя теста: ${name}`);
    seen.add(id);
    const start = statement.getStart(file);
    cases.push({
      id,
      name,
      describe: group,
      line: file.getLineAndCharacterOfPosition(start).line + 1,
      start,
      end: statement.getEnd(),
    });
  };

  for (const statement of file.statements) {
    const call = statementCall(statement);
    const callee = call ? calleeName(call) : null;
    if (call && callee === "test") {
      addTest(statement, call, null);
    } else if (call && callee === "describe") {
      const group = stringLiteralText(call.arguments[0]);
      const body = functionBody(call.arguments[1]);
      if (group === null || !body) {
        errors.push("describe() принимает строковый литерал и функцию с телом в фигурных скобках");
        continue;
      }
      for (const inner of body.statements) {
        const innerCall = statementCall(inner);
        if (innerCall && calleeName(innerCall) === "test") addTest(inner, innerCall, group);
        else errors.push("Внутри describe() допустимы только вызовы test()");
      }
    } else {
      errors.push("В tests.ts на верхнем уровне допустимы только describe() и test()");
    }
  }
  return { cases, errors: [...new Set(errors)] };
};
