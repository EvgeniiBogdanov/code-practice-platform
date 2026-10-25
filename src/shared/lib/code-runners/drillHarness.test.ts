import { describe, expect, it, vi } from "vitest";
import { runDrillSuite } from "./drillHarness";
import type { DrillTestsReport } from "./drillTestTypes";
import { transpileCode } from "./transpiler";

const run = (
  solution: string,
  tests: string,
  testTimeoutMs?: number
): Promise<DrillTestsReport> => {
  const solutionCode = transpileCode(solution, "solution.ts").code ?? "";
  const testsCode = transpileCode(tests, "tests.ts").code ?? "";
  return runDrillSuite({ solutionCode, testsCode, testTimeoutMs });
};

const outcome = (report: DrillTestsReport): Array<[string, boolean]> =>
  report.tests.map((t) => [t.name, t.passed]);

const SUM = "export const sum = (a: number, b: number): number => a + b;";

describe("runDrillSuite: basics", () => {
  it("passes matching tests and exposes solution exports as bare names", async () => {
    const report = await run(
      SUM,
      `describe("sum", () => {
        test("adds", () => { expect(sum(1, 2)).toBe(3); });
        it("handles objects", () => { expect({ a: [1] }).toEqual({ a: [1] }); });
      });`
    );
    expect(report.loadError).toBeNull();
    expect(outcome(report)).toEqual([
      ["adds", true],
      ["handles objects", true],
    ]);
    expect(report.tests[0].suite).toEqual(["sum"]);
  });

  it("reports expected and received for a failing matcher", async () => {
    const report = await run(SUM, `test("wrong", () => { expect(sum(1, 2)).toBe(4); });`);
    const [wrong] = report.tests;
    expect(wrong.passed).toBe(false);
    expect(wrong.error).toBe("Ожидалось: 4\nПолучено: 3");
  });

  it("fails toEqual by structure, not identity, and supports .not", async () => {
    const report = await run(
      "export const make = () => ({ a: 1 });",
      `test("same shape", () => { expect(make()).toEqual({ a: 1 }); });
       test("not identical", () => { expect(make()).not.toBe(make()); });
       test("differs", () => { expect(make()).toEqual({ a: 2 }); });`
    );
    expect(outcome(report)).toEqual([
      ["same shape", true],
      ["not identical", true],
      ["differs", false],
    ]);
  });

  it("checks toThrow by message, regexp and class", async () => {
    const report = await run(
      `export const boom = (): never => { throw new TypeError("bad input"); };
       export const calm = (): number => 1;`,
      `test("message", () => { expect(boom).toThrow("bad"); });
       test("regexp", () => { expect(boom).toThrow(/input$/); });
       test("class", () => { expect(boom).toThrow(TypeError); });
       test("wrong class", () => { expect(boom).toThrow(RangeError); });
       test("no throw", () => { expect(calm).toThrow(); });
       test("not throw", () => { expect(calm).not.toThrow(); });`
    );
    expect(outcome(report)).toEqual([
      ["message", true],
      ["regexp", true],
      ["class", true],
      ["wrong class", false],
      ["no throw", false],
      ["not throw", true],
    ]);
    expect(report.tests[4].error).toContain("ошибки не было");
  });

  it("reports an unexpected exception thrown by the solution inside a test", async () => {
    const report = await run(
      `export const parse = (s: string): unknown => JSON.parse(s);`,
      `test("crash", () => { parse("{"); });`
    );
    expect(report.tests[0].passed).toBe(false);
    expect(report.tests[0].error).toMatch(/^SyntaxError:/);
  });

  it("lets tests import the solution", async () => {
    const report = await run(
      SUM,
      `import { sum } from "./solution";
       test("imported", () => { expect(sum(2, 2)).toBe(4); });`
    );
    expect(outcome(report)).toEqual([["imported", true]]);
  });
});

describe("runDrillSuite: async", () => {
  const SOLUTION = `
    export const ok = async (): Promise<number> => 7;
    export const fails = async (): Promise<never> => { throw new Error("nope"); };
  `;

  it("supports resolves and rejects", async () => {
    const report = await run(
      SOLUTION,
      `test("resolves", async () => { await expect(ok()).resolves.toBe(7); });
       test("rejects", async () => { await expect(fails()).rejects.toThrow("nope"); });
       test("rejects value", async () => { await expect(fails()).rejects.toEqual(new Error("nope")); });
       test("wrong resolve", async () => { await expect(ok()).resolves.toBe(8); });
       test("should reject", async () => { await expect(ok()).rejects.toThrow(); });
       test("should resolve", async () => { await expect(fails()).resolves.toBe(1); });`
    );
    expect(outcome(report)).toEqual([
      ["resolves", true],
      ["rejects", true],
      ["rejects value", true],
      ["wrong resolve", false],
      ["should reject", false],
      ["should resolve", false],
    ]);
    expect(report.tests[4].error).toContain("отклониться");
  });

  it("fails a test that never settles instead of hanging", async () => {
    const report = await run(
      "export const never = (): Promise<void> => new Promise(() => {});",
      `test("hangs", async () => { await never(); });`,
      30
    );
    expect(report.tests[0].passed).toBe(false);
    expect(report.tests[0].error).toContain("не завершился");
  });
});

describe("runDrillSuite: virtual clock", () => {
  const DEBOUNCE = `
    export const debounce = (fn: (v: string) => void, ms: number) => {
      let id: number | undefined;
      return (v: string) => { clearTimeout(id); id = setTimeout(() => fn(v), ms) as unknown as number; };
    };
  `;

  it("fires debounced calls only after the delay", async () => {
    const report = await run(
      DEBOUNCE,
      `test("debounces", async () => {
        const seen: string[] = [];
        const call = debounce((v) => seen.push(v), 300);
        call("a"); call("ab");
        await clock.tick(299);
        expect(seen).toEqual([]);
        await clock.tick(1);
        expect(seen).toEqual(["ab"]);
      });`
    );
    expect(outcome(report)).toEqual([["debounces", true]]);
  });

  it("virtualizes Date.now and new Date", async () => {
    const report = await run(
      "export const stamp = () => [Date.now(), new Date().getTime()];",
      `test("time moves with the clock", async () => {
        const [start] = stamp();
        await clock.tick(1500);
        expect(stamp()).toEqual([start + 1500, start + 1500]);
      });`
    );
    expect(outcome(report)).toEqual([["time moves with the clock", true]]);
  });

  it("runs exponential backoff chains through awaited promises with runAll", async () => {
    const report = await run(
      `export const retry = async (task: () => Promise<string>): Promise<string> => {
        let delay = 100;
        for (;;) {
          try { return await task(); } catch {
            await new Promise((r) => setTimeout(r, delay));
            delay *= 2;
          }
        }
      };`,
      `test("retries with growing delays", async () => {
        const stamps: number[] = [];
        let attempts = 0;
        const result = retry(async () => {
          stamps.push(Date.now());
          if (++attempts < 4) throw new Error("fail");
          return "done";
        });
        await clock.runAll();
        await expect(result).resolves.toBe("done");
        expect(stamps.map((t) => t - stamps[0])).toEqual([0, 100, 300, 700]);
      });`
    );
    expect(outcome(report)).toEqual([["retries with growing delays", true]]);
  });

  it("stops a runaway interval in runAll", async () => {
    const report = await run(
      "export const start = () => { setInterval(() => {}, 10); };",
      `test("endless", async () => { start(); await clock.runAll(); });`
    );
    expect(report.tests[0].passed).toBe(false);
    expect(report.tests[0].error).toContain("бесконечен");
  });

  it("isolates tests: timers and time do not leak between them", async () => {
    const report = await run(
      "export const later = (cb: () => void) => { setTimeout(cb, 50); };",
      `let leaked = 0;
       test("first", async () => { later(() => leaked++); });
       test("second", async () => { await clock.tick(100); expect(leaked).toBe(0); expect(clock.pendingCount()).toBe(0); });`
    );
    expect(outcome(report)).toEqual([
      ["first", true],
      ["second", true],
    ]);
  });
});

describe("runDrillSuite: fetch mock", () => {
  const SEARCH = `
    export const createSearch = () => {
      let controller: AbortController | null = null;
      return async (q: string): Promise<string[] | null> => {
        controller?.abort();
        controller = new AbortController();
        try {
          const res = await fetch("/api?q=" + q, { signal: controller.signal });
          return await res.json();
        } catch (e) {
          if ((e as Error).name === "AbortError") return null;
          throw e;
        }
      };
    };
  `;

  it("aborts the previous request and exposes the signal state", async () => {
    const report = await run(
      SEARCH,
      `test("latest wins", async () => {
        const search = createSearch();
        const first = search("a");
        const second = search("ab");
        expect(fetchMock.calls.map((c) => c.url)).toEqual(["/api?q=a", "/api?q=ab"]);
        expect(fetchMock.calls[0].aborted).toBe(true);
        expect(fetchMock.calls[1].aborted).toBe(false);
        fetchMock.calls[1].resolve(["abc"]);
        await expect(first).resolves.toBe(null);
        await expect(second).resolves.toEqual(["abc"]);
      });`
    );
    expect(outcome(report)).toEqual([["latest wins", true]]);
  });

  it("responds automatically and supports failing statuses", async () => {
    const report = await run(
      `export const load = async (url: string): Promise<number> => (await fetch(url)).status;`,
      `test("auto response", async () => {
        fetchMock.respondWith((call) => (call.url === "/ok" ? { fine: true } : Promise.reject(new Error("down"))));
        await expect(load("/ok")).resolves.toBe(200);
        await expect(load("/bad")).rejects.toThrow("down");
      });
      test("manual status", async () => {
        const status = load("/x");
        fetchMock.calls[0].resolve({ error: "missing" }, { status: 404 });
        await expect(status).resolves.toBe(404);
      });`
    );
    expect(outcome(report)).toEqual([
      ["auto response", true],
      ["manual status", true],
    ]);
  });

  it("rejects immediately when the signal is already aborted", async () => {
    const report = await run(
      `export const go = (signal: AbortSignal) => fetch("/x", { signal });`,
      `test("pre-aborted", async () => {
        const controller = new AbortController();
        controller.abort();
        await expect(go(controller.signal)).rejects.toThrow();
        expect(fetchMock.calls[0].aborted).toBe(true);
      });`
    );
    expect(outcome(report)).toEqual([["pre-aborted", true]]);
  });
});

describe("runDrillSuite: WebSocket mock", () => {
  it("reconnects after a drop using the virtual clock", async () => {
    const report = await run(
      `export const connect = (url: string, onMessage: (d: unknown) => void) => {
        const open = (): void => {
          const ws = new WebSocket(url);
          ws.onmessage = (e: MessageEvent) => onMessage(e.data);
          ws.onclose = () => { setTimeout(open, 1000); };
        };
        open();
      };`,
      `test("reconnects", async () => {
        const got: unknown[] = [];
        connect("wss://chat", (d) => got.push(d));
        wsMock.instances[0].simulateOpen();
        wsMock.instances[0].simulateMessage("hi");
        wsMock.instances[0].simulateClose();
        expect(wsMock.instances.length).toBe(1);
        await clock.tick(1000);
        expect(wsMock.instances.length).toBe(2);
        expect(wsMock.instances[1].url).toBe("wss://chat");
        expect(got).toEqual(["hi"]);
      });
      test("send before open throws", () => {
        const ws = new WebSocket("wss://x");
        expect(() => ws.send("early")).toThrow("не открыт");
        ws.simulateOpen();
        ws.send("ok");
        expect(ws.sent).toEqual(["ok"]);
      });`
    );
    expect(outcome(report)).toEqual([
      ["reconnects", true],
      ["send before open throws", true],
    ]);
  });
});

describe("runDrillSuite: load errors", () => {
  it("blames the solution when it throws on load", async () => {
    const report = await run(`throw new Error("broken");`, `test("x", () => {});`);
    expect(report.tests).toEqual([]);
    expect(report.loadError).toEqual({ source: "solution", message: "Error: broken" });
  });

  it("blames the tests file when it throws on load", async () => {
    const report = await run(SUM, `missingHelper();`);
    expect(report.loadError?.source).toBe("tests");
  });

  it("rejects imports of external modules", async () => {
    const report = await run(`import _ from "lodash"; export const x = _;`, `test("x", () => {});`);
    expect(report.loadError?.source).toBe("solution");
    expect(report.loadError?.message).toContain("lodash");
  });
});

describe("runDrillSuite: isolation", () => {
  it("hides the page and storage APIs from the solution and the tests", async () => {
    const report = await run(
      `export const seen = {
        post: typeof postMessage,
        scripts: typeof importScripts,
        db: typeof indexedDB,
        xhr: typeof XMLHttpRequest,
        viaSelf: typeof self.postMessage,
        viaGlobal: typeof globalThis.indexedDB,
        viaWindow: typeof window.importScripts,
      };`,
      `test("solution", () => {
        expect(seen).toEqual({
          post: "undefined", scripts: "undefined", db: "undefined", xhr: "undefined",
          viaSelf: "undefined", viaGlobal: "undefined", viaWindow: "undefined",
        });
      });
      test("tests", () => {
        expect([typeof postMessage, typeof self.postMessage, typeof Worker]).toEqual(["undefined", "undefined", "undefined"]);
      });`
    );
    expect(outcome(report)).toEqual([
      ["solution", true],
      ["tests", true],
    ]);
  });

  it("cannot send its own messages: calling postMessage fails and nothing reaches the page", async () => {
    const posted = vi.spyOn(globalThis, "postMessage").mockImplementation(() => {});
    try {
      const report = await run(
        `export const forge = (): void => { postMessage({ type: "TEST_RESULT" }); };
         export const forgeViaSelf = (): void => { self.postMessage({ type: "TEST_RESULT" }); };`,
        `test("bare", () => { expect(forge).toThrow(TypeError); });
         test("via self", () => { expect(forgeViaSelf).toThrow(TypeError); });`
      );
      expect(outcome(report)).toEqual([
        ["bare", true],
        ["via self", true],
      ]);
      expect(posted).not.toHaveBeenCalled();
    } finally {
      posted.mockRestore();
    }
  });

  it("routes fetch, WebSocket and timers through the mocks even via globalThis", async () => {
    const report = await run(
      `export const viaGlobal = () => {
        globalThis.fetch("/x");
        new globalThis.WebSocket("wss://x");
        return globalThis.setTimeout === setTimeout;
      };`,
      `test("mocks win", () => {
        expect(viaGlobal()).toBe(true);
        expect(fetchMock.calls.map((c) => c.url)).toEqual(["/x"]);
        expect(wsMock.instances.length).toBe(1);
      });`
    );
    expect(outcome(report)).toEqual([["mocks win", true]]);
  });

  it("does not let the code change the sandbox global", async () => {
    const report = await run(
      `export const tamper = () => { "use strict"; globalThis.fetch = () => null; };`,
      `test("frozen", () => { expect(tamper).toThrow(TypeError); });`
    );
    expect(outcome(report)).toEqual([["frozen", true]]);
  });
});
