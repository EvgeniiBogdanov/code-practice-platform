import { describe, expect, it, vi } from "vitest";
import { DENIED_GLOBALS, MOCKED_GLOBALS, lockdownWorkerGlobals } from "./workerLockdown";
import { parseWorkerRequest } from "./drillTestTypes";

/** A stand-in for a worker scope: the APIs live on the prototype, like in a real worker. */
const makeWorkerScope = (): {
  scope: object;
  proto: Record<string, unknown>;
  posted: ReturnType<typeof vi.fn>;
} => {
  const posted = vi.fn();
  const proto: Record<string, unknown> = {};
  for (const name of [...DENIED_GLOBALS, ...MOCKED_GLOBALS]) proto[name] = () => name;
  proto.postMessage = posted;
  const scope = Object.create(proto) as object;
  return { scope, proto, posted };
};

describe("lockdownWorkerGlobals", () => {
  it("removes the denied APIs from the scope and its prototype chain", () => {
    const { scope, proto } = makeWorkerScope();
    lockdownWorkerGlobals(scope);
    for (const name of [...DENIED_GLOBALS, ...MOCKED_GLOBALS]) {
      expect(Reflect.get(scope, name)).toBeUndefined();
      expect(proto[name]).toBeUndefined();
    }
  });

  it("keeps a postMessage captured before the lockdown, and only that one", () => {
    const { scope, proto, posted } = makeWorkerScope();
    const post = (proto.postMessage as (m: unknown) => void).bind(scope);
    lockdownWorkerGlobals(scope);

    post({ type: "TEST_RESULT" });
    expect(posted).toHaveBeenCalledOnce();

    // Learner code reaching for the prototype, or for the scope, finds nothing to call.
    expect(() => (Object.getPrototypeOf(scope).postMessage as () => void)()).toThrow(TypeError);
    expect(() => (Reflect.get(scope, "postMessage") as () => void)()).toThrow(TypeError);
    expect(posted).toHaveBeenCalledOnce();
  });

  it("cannot be undone by the learner code", () => {
    const { scope } = makeWorkerScope();
    lockdownWorkerGlobals(scope);
    expect(() => {
      "use strict";
      Reflect.set(scope, "importScripts", () => 1);
      Object.defineProperty(scope, "indexedDB", { value: {} });
    }).toThrow(TypeError);
    expect(Reflect.get(scope, "importScripts")).toBeUndefined();
  });
});

describe("parseWorkerRequest", () => {
  it("accepts well-formed requests", () => {
    expect(parseWorkerRequest({ type: "EXECUTE", code: "1" })).toEqual({
      type: "EXECUTE",
      code: "1",
    });
    expect(
      parseWorkerRequest({ type: "RUN_TESTS", solutionCode: "a", testsCode: "b", testTimeoutMs: 5 })
    ).toEqual({ type: "RUN_TESTS", solutionCode: "a", testsCode: "b", testTimeoutMs: 5 });
  });

  it.each([
    null,
    "EXECUTE",
    {},
    { type: "EXECUTE" },
    { type: "EXECUTE", code: 1 },
    { type: "RUN_TESTS", solutionCode: "a" },
    { type: "RUN_TESTS", solutionCode: 1, testsCode: "b" },
    { type: "OTHER", code: "x" },
  ])("rejects %j", (data) => {
    expect(parseWorkerRequest(data)).toBeNull();
  });
});
