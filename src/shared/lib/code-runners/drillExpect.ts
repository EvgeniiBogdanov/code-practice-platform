/** Mini `expect` for drill tests: toBe, toEqual, toThrow, `.not`, `.resolves`, `.rejects`. */

import { deepEqual } from "./deepEqual";
import { formatNodeValue } from "./nodeFormatter";

export class AssertionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AssertionError";
  }
}

export type ThrowExpectation = string | RegExp | (new (...args: never[]) => unknown) | Error;

export interface Matchers {
  toBe: (expected: unknown) => void;
  toEqual: (expected: unknown) => void;
  toThrow: (expected?: ThrowExpectation) => void;
}

export interface AsyncMatchers {
  toBe: (expected: unknown) => Promise<void>;
  toEqual: (expected: unknown) => Promise<void>;
  toThrow: (expected?: ThrowExpectation) => Promise<void>;
}

export interface Expectation extends Matchers {
  not: Matchers;
  /** The promise fulfils; the matcher is applied to its value. */
  resolves: AsyncMatchers;
  /** The promise rejects; the matcher is applied to the reason. */
  rejects: AsyncMatchers;
}

const format = (value: unknown): string =>
  typeof value === "string" ? JSON.stringify(value) : formatNodeValue(value, 0).text;

const getMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

const isThenable = (value: unknown): value is PromiseLike<unknown> =>
  typeof value === "object" &&
  value !== null &&
  "then" in value &&
  typeof value.then === "function";

const matchesThrown = (error: unknown, expected: ThrowExpectation | undefined): boolean => {
  if (expected === undefined) return true;
  if (typeof expected === "string") return getMessage(error).includes(expected);
  if (expected instanceof RegExp) return expected.test(getMessage(error));
  if (expected instanceof Error) return getMessage(error) === expected.message;
  return error instanceof expected;
};

const describeExpected = (expected: ThrowExpectation | undefined): string => {
  if (expected === undefined) return "ошибка";
  if (typeof expected === "function") return `ошибка ${expected.name}`;
  if (expected instanceof Error) return `ошибка с сообщением ${format(expected.message)}`;
  return `ошибка, подходящая под ${format(expected)}`;
};

/** `isReason`: the value is already the rejection reason, not a function to call. */
const createMatchers = (actual: unknown, isNegated: boolean, isReason: boolean): Matchers => {
  const assert = (passed: boolean, failure: string, negatedFailure: string): void => {
    if (passed === isNegated) throw new AssertionError(isNegated ? negatedFailure : failure);
  };

  return {
    toBe: (expected) =>
      assert(
        Object.is(actual, expected),
        `Ожидалось: ${format(expected)}\nПолучено: ${format(actual)}`,
        `Ожидалось значение, отличное от ${format(expected)}`
      ),
    toEqual: (expected) =>
      assert(
        deepEqual(actual, expected),
        `Ожидалось: ${format(expected)}\nПолучено: ${format(actual)}`,
        `Ожидалось значение, не равное ${format(expected)}`
      ),
    toThrow: (expected) => {
      let didThrow = isReason;
      let error: unknown = isReason ? actual : undefined;
      if (!isReason) {
        if (typeof actual !== "function") {
          throw new AssertionError("toThrow ожидает функцию, а получено другое значение.");
        }
        try {
          actual();
        } catch (caught) {
          didThrow = true;
          error = caught;
        }
      }
      const expectation = describeExpected(expected);
      assert(
        didThrow && matchesThrown(error, expected),
        didThrow
          ? `Ожидалась ${expectation}\nПолучено: ${format(getMessage(error))}`
          : `Ожидалась ${expectation}, но ошибки не было`,
        `Ожидалось, что ${expectation} не будет выброшена`
      );
    },
  };
};

const createAsyncMatchers = (promise: unknown, mode: "resolves" | "rejects"): AsyncMatchers => {
  const settle = async (): Promise<unknown> => {
    if (!isThenable(promise)) {
      throw new AssertionError(`${mode} ожидает промис, а получено ${format(promise)}.`);
    }
    if (mode === "resolves") {
      try {
        return await promise;
      } catch (reason) {
        throw new AssertionError(`Промис отклонён: ${format(getMessage(reason))}`);
      }
    }
    try {
      await promise;
    } catch (reason) {
      return reason;
    }
    throw new AssertionError("Промис должен был отклониться, но он выполнился.");
  };

  const run =
    <Args extends unknown[]>(pick: (matchers: Matchers) => (...args: Args) => void) =>
    async (...args: Args): Promise<void> => {
      const value = await settle();
      pick(createMatchers(value, false, mode === "rejects"))(...args);
    };

  return {
    toBe: run((m) => m.toBe),
    toEqual: run((m) => m.toEqual),
    toThrow: run((m) => m.toThrow),
  };
};

export const expect = (actual: unknown): Expectation => ({
  ...createMatchers(actual, false, false),
  not: createMatchers(actual, true, false),
  resolves: createAsyncMatchers(actual, "resolves"),
  rejects: createAsyncMatchers(actual, "rejects"),
});
