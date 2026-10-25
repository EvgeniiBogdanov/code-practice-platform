/**
 * Hardening of the worker that runs learner code.
 *
 * A learner's code must not talk to the page (forge a `TEST_RESULT`), load scripts, reach
 * storage or the network. Two layers: the sandboxed module gets these names as `undefined`
 * parameters and a filtered `globalThis`, and `lockdownWorkerGlobals` strips them from the real
 * global scope too, so `Function("return self")()` and prototype lookups find nothing either.
 * The worker keeps its own bound `postMessage` captured before the lockdown.
 */

export const DENIED_GLOBALS = [
  "postMessage",
  "importScripts",
  "close",
  "indexedDB",
  "caches",
  "XMLHttpRequest",
  "EventSource",
  "Worker",
  "SharedWorker",
  "BroadcastChannel",
  "WebTransport",
] as const;

/** Names the sandbox replaces with its own versions (mocks), so the real ones stay unreachable. */
export const MOCKED_GLOBALS = ["fetch", "WebSocket"] as const;

const REVOKED = {
  value: undefined,
  writable: false,
  configurable: false,
  enumerable: false,
} as const;

/** Removes the denied APIs from the global scope and every prototype it inherits from. */
export const lockdownWorkerGlobals = (scope: object): void => {
  const names = [...DENIED_GLOBALS, ...MOCKED_GLOBALS];
  for (const name of names) Object.defineProperty(scope, name, REVOKED);
  for (
    let proto = Object.getPrototypeOf(scope);
    proto !== null && proto !== Object.prototype;
    proto = Object.getPrototypeOf(proto)
  ) {
    for (const name of names) {
      if (Object.hasOwn(proto, name)) Object.defineProperty(proto, name, REVOKED);
    }
  }
};

/**
 * A `globalThis` for the sandbox: mocks win, denied names vanish, the rest reads through to the
 * real scope (Math, JSON, Promise, …).
 */
export const createSandboxGlobal = (
  environment: Readonly<Record<string, unknown>>,
  realGlobal: object
): object => {
  const denied = new Set<PropertyKey>(DENIED_GLOBALS);
  const hidden = (key: PropertyKey): boolean => denied.has(key);
  return new Proxy(realGlobal, {
    get: (target, key) => {
      if (typeof key === "string" && Object.hasOwn(environment, key)) return environment[key];
      return hidden(key) ? undefined : Reflect.get(target, key);
    },
    has: (target, key) =>
      (typeof key === "string" && Object.hasOwn(environment, key)) ||
      (!hidden(key) && Reflect.has(target, key)),
    set: () => false,
    defineProperty: () => false,
    deleteProperty: () => false,
  });
};
