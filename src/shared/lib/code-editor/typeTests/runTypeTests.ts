import ts from "typescript";
import type {
  EditorDiagnostic,
  TypeTestCase,
  TypeTestCompileResult,
  TypeTestFailure,
  TypeTestReport,
  TypeTestResult,
  TypeTestsInput,
} from "../typescriptTypes";
import { buildTestDocument, mapToSource, type TestDocument } from "./buildTestDocument";
import { collectTestCases } from "./collectTestCases";
import { RESERVED_TEST_NAMES } from "./typeTestsPrelude";

const UNUSED_EXPECT_ERROR = 2578;
const CONSTRAINT_NOT_SATISFIED = 2344;

export interface DocumentAnalysis {
  program: ts.Program;
  diagnostics: readonly ts.Diagnostic[];
}

/** What the engine needs from a TypeScript language service. */
export interface TypeTestsHost {
  /** Diagnostics of the learner's own file, exactly as the editor shows them. */
  diagnoseSolution: (input: TypeTestsInput) => EditorDiagnostic[];
  /** Type-checks the assembled document. */
  analyzeDocument: (text: string) => DocumentAnalysis;
}

const flatten = (diagnostic: ts.Diagnostic): string =>
  `TS${diagnostic.code}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`;

const hasNoCheckPragma = (code: string): boolean =>
  (ts.getLeadingCommentRanges(code, 0) ?? []).some((range) =>
    /@ts-nocheck\b/.test(code.slice(range.pos, range.end))
  );

const findReservedNames = (code: string): string[] => {
  const file = ts.createSourceFile("solution.ts", code, ts.ScriptTarget.ESNext, false);
  const names: string[] = [];
  for (const statement of file.statements) {
    if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name)) names.push(declaration.name.text);
      }
    } else if (
      (ts.isFunctionDeclaration(statement) ||
        ts.isClassDeclaration(statement) ||
        ts.isInterfaceDeclaration(statement) ||
        ts.isTypeAliasDeclaration(statement) ||
        ts.isEnumDeclaration(statement)) &&
      statement.name
    ) {
      names.push(statement.name.text);
    }
  }
  return names.filter((name) => RESERVED_TEST_NAMES.includes(name));
};

const syntaxErrors = (input: TypeTestsInput): string[] =>
  (
    ts.transpileModule(input.code, {
      fileName: input.filepath,
      reportDiagnostics: true,
      compilerOptions: { target: ts.ScriptTarget.ESNext, module: ts.ModuleKind.ESNext },
    }).diagnostics ?? []
  )
    .filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error)
    .map(flatten);

const checkCompile = (input: TypeTestsInput, host: TypeTestsHost): TypeTestCompileResult => {
  const syntax = syntaxErrors(input);
  if (syntax.length > 0) {
    return {
      passed: false,
      problems: [],
      reason: "syntax",
      message: `В решении синтаксическая ошибка: ${syntax[0]}`,
    };
  }
  const reserved = findReservedNames(input.code);
  if (reserved.length > 0) {
    return {
      passed: false,
      problems: [],
      reason: "reserved",
      message: `Имя «${reserved[0]}» зарезервировано тестами — переименуйте его в решении.`,
    };
  }
  if (hasNoCheckPragma(input.code)) {
    return {
      passed: false,
      problems: [],
      reason: "nocheck",
      message: "Директива @ts-nocheck отключает проверку решения — удалите её.",
    };
  }
  const problems = host.diagnoseSolution(input).filter((problem) => problem.severity === "error");
  return {
    passed: problems.length === 0,
    problems,
    reason: problems.length > 0 ? "errors" : null,
    message: null,
  };
};

const findEqualReference = (file: ts.SourceFile, position: number): ts.TypeReferenceNode | null => {
  let found: ts.TypeReferenceNode | null = null;
  const visit = (node: ts.Node): void => {
    if (found || node.getEnd() < position || node.getStart(file) > position) return;
    if (
      ts.isTypeReferenceNode(node) &&
      node.getStart(file) === position &&
      ts.isIdentifier(node.typeName) &&
      node.typeName.text === "Equal" &&
      node.typeArguments?.length === 2
    ) {
      found = node;
      return;
    }
    ts.forEachChild(node, visit);
  };
  visit(file);
  return found;
};

const describeFailure = (
  diagnostic: ts.Diagnostic,
  analysis: DocumentAnalysis,
  tests: string,
  document: TestDocument
): TypeTestFailure => {
  const message = flatten(diagnostic);
  if (diagnostic.code === UNUSED_EXPECT_ERROR) {
    const start = diagnostic.start ?? 0;
    const offset = mapToSource(document, start).offset;
    const nextLine = tests.slice(offset).split("\n")[1] ?? "";
    return { kind: "expected-error", snippet: nextLine.trim() };
  }
  if (
    diagnostic.code === CONSTRAINT_NOT_SATISFIED &&
    diagnostic.file &&
    diagnostic.start !== undefined
  ) {
    const reference = findEqualReference(diagnostic.file, diagnostic.start);
    if (reference?.typeArguments) {
      const checker = analysis.program.getTypeChecker();
      const format = (node: ts.TypeNode): string =>
        checker.typeToString(
          checker.getTypeFromTypeNode(node),
          undefined,
          ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.InTypeAlias
        );
      const [actual, expected] = reference.typeArguments;
      return { kind: "mismatch", actual: format(actual), expected: format(expected), message };
    }
  }
  return { kind: "diagnostic", message, code: diagnostic.code };
};

const skipped = (testCase: TypeTestCase): TypeTestResult => ({
  case: testCase,
  status: "skipped",
  failure: null,
});

const buildReport = (
  compile: TypeTestCompileResult,
  results: TypeTestResult[],
  fileError: string | null,
  startedAt: number
): TypeTestReport => ({
  compile,
  results,
  fileError,
  passed: (compile.passed ? 1 : 0) + results.filter((result) => result.status === "passed").length,
  total: 1 + results.length,
  durationMs: Math.round((performance.now() - startedAt) * 10) / 10,
});

/** Pure engine: one report per run. Used by the worker and by the CI guard alike. */
export const runTypeTests = (input: TypeTestsInput, host: TypeTestsHost): TypeTestReport => {
  const startedAt = performance.now();
  const { cases, errors } = collectTestCases(input.tests);
  const compile = checkCompile(input, host);
  const fileError = errors.length > 0 ? errors.join("\n") : null;
  if (fileError) return buildReport(compile, cases.map(skipped), fileError, startedAt);
  if (compile.reason === "syntax" || compile.reason === "reserved") {
    return buildReport(compile, cases.map(skipped), null, startedAt);
  }

  const document = buildTestDocument(input.code, input.tests);
  const analysis = host.analyzeDocument(document.text);
  const failures = new Map<TypeTestCase, TypeTestResult>();
  let strayError: string | null = null;
  for (const diagnostic of analysis.diagnostics) {
    if (diagnostic.category !== ts.DiagnosticCategory.Error || diagnostic.start === undefined) {
      continue;
    }
    const origin = mapToSource(document, diagnostic.start);
    if (origin.segment === "solution") continue;
    const owner =
      origin.segment === "tests"
        ? cases.find((item) => item.start <= origin.offset && origin.offset <= item.end)
        : undefined;
    if (!owner) {
      strayError ??= `${origin.segment === "prelude" ? "Прелюдия" : "tests.ts"}: ${flatten(diagnostic)}`;
      continue;
    }
    if (failures.has(owner)) continue;
    failures.set(owner, {
      case: owner,
      status: "failed",
      failure: describeFailure(diagnostic, analysis, input.tests, document),
    });
  }
  const results = cases.map(
    (item): TypeTestResult => failures.get(item) ?? { case: item, status: "passed", failure: null }
  );
  return buildReport(compile, results, strayError, startedAt);
};
