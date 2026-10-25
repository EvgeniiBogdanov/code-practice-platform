/**
 * "Solution + tests" harness: runs the solution, then a test file written against the mini API
 * `describe / test / expect` with a virtual clock and mocked `fetch` / `WebSocket`.
 *
 * Pure (no `self`, no globals are replaced): the sandbox is built from function parameters,
 * so the same code runs in the worker and under Vitest.
 */

import { createClockDate, createDrillClock } from "./drillClock";
import { AssertionError, expect } from "./drillExpect";
import { createFetchMock, createWebSocketMock } from "./drillMocks";
import { DENIED_GLOBALS, createSandboxGlobal } from "./workerLockdown";
import type {
  DrillLoadError,
  DrillTestCaseResult,
  DrillTestsReport,
  RunTestsMessage,
} from "./drillTestTypes";

const DEFAULT_TEST_TIMEOUT_MS = 2000;

const realSetTimeout = globalThis.setTimeout.bind(globalThis);
const realClearTimeout = globalThis.clearTimeout.bind(globalThis);
const now = (): number => globalThis.performance.now();
const round = (ms: number): number => Math.round(ms * 10) / 10;

type TestBody = () => unknown;

interface RegisteredTest {
  suite: readonly string[];
  name: string;
  body: TestBody;
}

const describeError = (error: unknown): string => {
  if (error instanceof AssertionError) return error.message;
  if (error instanceof Error) return `${error.name}: ${error.message}`;
  return String(error);
};

const withTimeout = async (body: TestBody, timeoutMs: number): Promise<void> => {
  let timer: ReturnType<typeof realSetTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = realSetTimeout(
      () =>
        reject(
          new Error(
            `Тест не завершился за ${timeoutMs}ms. Возможно, он ждёт таймер: используйте await clock.tick(...).`
          )
        ),
      timeoutMs
    );
  });
  try {
    await Promise.race([Promise.resolve().then(body), timeout]);
  } finally {
    realClearTimeout(timer);
  }
};

const IDENTIFIER = /^[A-Za-z_$][\w$]*$/;
/** Cannot (or must not) be a parameter name of the sandboxed module function. */
const RESERVED_NAMES = new Set(["exports", "module", "require", "eval", "arguments", "default"]);

export const runDrillSuite = async ({
  solutionCode,
  testsCode,
  testTimeoutMs = DEFAULT_TEST_TIMEOUT_MS,
}: Pick<
  RunTestsMessage,
  "solutionCode" | "testsCode" | "testTimeoutMs"
>): Promise<DrillTestsReport> => {
  const startedAt = now();
  const clock = createDrillClock();
  const fetchMock = createFetchMock();
  const wsMock = createWebSocketMock();

  const environment: Record<string, unknown> = {
    setTimeout: clock.setTimeout,
    clearTimeout: clock.clearTimeout,
    setInterval: clock.setInterval,
    clearInterval: clock.clearInterval,
    Date: createClockDate(clock),
    fetch: fetchMock.fetch,
    WebSocket: wsMock.WebSocket,
  };

  const sandboxGlobal = createSandboxGlobal(environment, globalThis);
  const lockedGlobals = Object.fromEntries(DENIED_GLOBALS.map((name) => [name, undefined]));
  const globalAliases = {
    globalThis: sandboxGlobal,
    self: sandboxGlobal,
    window: sandboxGlobal,
    global: sandboxGlobal,
  };

  const solutionExports: Record<string, unknown> = {};
  const loadModule = (
    code: string,
    exportsObject: Record<string, unknown>,
    extra: Record<string, unknown>
  ): void => {
    const scope: Record<string, unknown> = {
      ...lockedGlobals,
      ...globalAliases,
      ...environment,
      ...extra,
      exports: exportsObject,
      module: { exports: exportsObject },
      require: (specifier: string): unknown => {
        if (specifier.startsWith(".")) return solutionExports;
        throw new Error(`Модуль "${specifier}" недоступен: в дриллах нет внешних зависимостей.`);
      },
    };
    const names = Object.keys(scope);
    new Function(...names, `"use strict";\n${code}`)(...names.map((name) => scope[name]));
  };

  const fail = (source: DrillLoadError["source"], error: unknown): DrillTestsReport => ({
    tests: [],
    loadError: { source, message: describeError(error) },
    durationMs: round(now() - startedAt),
  });

  try {
    loadModule(solutionCode, solutionExports, {});
  } catch (error) {
    return fail("solution", error);
  }

  const registered: RegisteredTest[] = [];
  const suiteStack: string[] = [];
  const test = (name: string, body: TestBody): void => {
    registered.push({ suite: [...suiteStack], name, body });
  };
  const describe = (name: string, body: () => void): void => {
    suiteStack.push(name);
    try {
      body();
    } finally {
      suiteStack.pop();
    }
  };

  // The solution's exports are also visible as bare names, next to the harness API.
  const harnessApi: Record<string, unknown> = {
    describe,
    test,
    it: test,
    expect,
    clock,
    fetchMock,
    wsMock,
  };
  const exportedNames = Object.keys(solutionExports).filter(
    (name) =>
      IDENTIFIER.test(name) &&
      !RESERVED_NAMES.has(name) &&
      !(name in harnessApi) &&
      !(name in environment)
  );
  const testsScope: Record<string, unknown> = { ...harnessApi };
  for (const name of exportedNames) testsScope[name] = solutionExports[name];

  try {
    loadModule(testsCode, {}, testsScope);
  } catch (error) {
    return fail("tests", error);
  }

  const results: DrillTestCaseResult[] = [];
  for (const { suite, name, body } of registered) {
    clock.reset();
    fetchMock.reset();
    wsMock.reset();
    const testStartedAt = now();
    let error: string | null = null;
    try {
      await withTimeout(body, testTimeoutMs);
    } catch (caught) {
      error = describeError(caught);
    }
    results.push({
      suite,
      name,
      passed: error === null,
      error,
      durationMs: round(now() - testStartedAt),
    });
  }

  return { tests: results, loadError: null, durationMs: round(now() - startedAt) };
};
