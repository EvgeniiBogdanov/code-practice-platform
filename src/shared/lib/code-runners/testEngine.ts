/**
 * LeetCode-style Unit Testing Engine for JavaScript Solutions
 */

import { runNodeJsCode } from "./nodeRunner";
import { type TestCase, extractTestCasesFromTask } from "./testExtractor";

export { extractTestCasesFromTask };
export type { TestCase };

export interface TestResultItem {
  id: number;
  inputStr: string;
  expected: unknown;
  expectedStr: string;
  actual: unknown;
  actualStr: string;
  passed: boolean;
  error: string | null;
  durationMs: number;
}

export interface RunTestsSummary {
  passedAll: boolean;
  results: TestResultItem[];
  passedCount: number;
  totalCount: number;
  durationMs: number;
  error: string | null;
}

export function deepEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (a === null || b === null || a === undefined || b === undefined) return a === b;

  if (typeof a !== typeof b) return false;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  if (a instanceof Set && b instanceof Set) {
    if (a.size !== b.size) return false;
    for (const item of a) {
      if (!b.has(item)) return false;
    }
    return true;
  }

  if (a instanceof Map && b instanceof Map) {
    if (a.size !== b.size) return false;
    for (const [k, v] of a) {
      if (!b.has(k) || !deepEqual(b.get(k), v)) return false;
    }
    return true;
  }

  if (typeof a === "object" && typeof b === "object") {
    const keysA = Object.keys(a as object);
    const keysB = Object.keys(b as object);
    if (keysA.length !== keysB.length) return false;
    for (const k of keysA) {
      if (!Object.prototype.hasOwnProperty.call(b, k) || !deepEqual((a as any)[k], (b as any)[k])) {
        return false;
      }
    }
    return true;
  }

  return false;
}

export function extractMainFunctionName(codeText: string): string | null {
  if (!codeText) return null;

  const fnMatch =
    codeText.match(
      /(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(?:async\s*)?(?:\([^)]*\)|[a-zA-Z_$][a-zA-Z0-9_$]*)\s*=>/
    ) || codeText.match(/function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/);

  return fnMatch ? fnMatch[1] : null;
}

export async function runTaskTests(
  userCode: string,
  testCases: TestCase[],
  options: { timeoutMs?: number } = {}
): Promise<RunTestsSummary> {
  const { timeoutMs = 3000 } = options;
  const startTime = performance.now();
  const results: TestResultItem[] = [];

  const mainFnName = extractMainFunctionName(userCode);

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    const targetFn = tc.fnName || mainFnName;

    const testHarnessCode = `
      ${userCode}

      (async function() {
        const fn = typeof ${targetFn} === 'function' ? ${targetFn} : null;
        if (!fn) {
          throw new Error("Функция ${targetFn || "решения"} не найдена в коде.");
        }
        return await fn(...${JSON.stringify(tc.input)});
      })();
    `;

    const singleStart = performance.now();
    const runResult = await runNodeJsCode(testHarnessCode, { timeoutMs });
    const singleDuration = Math.round((performance.now() - singleStart) * 10) / 10;

    let passed = false;
    let actualStr = "—";

    if (runResult.exitCode === 0 && !runResult.error) {
      const actualVal = runResult.result;
      actualStr = actualVal !== undefined ? JSON.stringify(actualVal) : "undefined";
      passed = tc.expected !== undefined ? deepEqual(actualVal, tc.expected) : true;
    } else {
      actualStr = runResult.error?.message || "Ошибка выполнения";
    }

    results.push({
      id: i + 1,
      inputStr: tc.inputStr,
      expected: tc.expected,
      expectedStr: tc.expectedStr,
      actual: runResult.result,
      actualStr,
      passed,
      error: runResult.error ? runResult.error.message || String(runResult.error) : null,
      durationMs: singleDuration,
    });
  }

  const totalDuration = Math.round((performance.now() - startTime) * 10) / 10;
  const passedCount = results.filter((r) => r.passed).length;

  return {
    passedAll: passedCount === results.length && results.length > 0,
    results,
    passedCount,
    totalCount: results.length,
    durationMs: totalDuration,
    error: null,
  };
}
