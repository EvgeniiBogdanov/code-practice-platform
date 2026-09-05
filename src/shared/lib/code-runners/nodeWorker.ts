/**
 * Isolated Web Worker for JavaScript / Node.js runtime
 */

import { formatNodeValue, formatConsoleTable } from "./nodeFormatter";
import { sandboxHelpers } from "./nodeSandboxHelpers";

export { formatNodeValue, formatConsoleTable };

const _nativeSetTimeout =
  typeof self !== "undefined" && self.setTimeout ? self.setTimeout.bind(self) : setTimeout;
const _nativeClearTimeout =
  typeof self !== "undefined" && self.clearTimeout ? self.clearTimeout.bind(self) : clearTimeout;
const _nativeSetInterval =
  typeof self !== "undefined" && self.setInterval ? self.setInterval.bind(self) : setInterval;
const _nativeClearInterval =
  typeof self !== "undefined" && self.clearInterval ? self.clearInterval.bind(self) : clearInterval;
const _nativeQueueMicrotask =
  typeof self !== "undefined" && self.queueMicrotask
    ? self.queueMicrotask.bind(self)
    : queueMicrotask;

interface LogEntry {
  id: number;
  type: string;
  text: string;
  args: Array<{ type: string; text: string }>;
  tableData?: unknown;
  timestamp: number;
}

const formatSafeResult = (val: unknown): unknown => {
  try {
    if (typeof val === "function") {
      return val.name ? `[Function: ${val.name}]` : "[Function (anonymous)]";
    } else if (typeof val === "symbol") {
      return val.toString();
    } else if (typeof val === "bigint") {
      return `${val}n`;
    } else {
      return val;
    }
  } catch {
    return String(val);
  }
};

let currentUnhandledRejectionHandler: ((event: PromiseRejectionEvent) => void) | null = null;

if (typeof self !== "undefined") {
  try {
    self.addEventListener("unhandledrejection", (event: PromiseRejectionEvent) => {
      if (currentUnhandledRejectionHandler) {
        currentUnhandledRejectionHandler(event);
      }
    });
  } catch {
    // ignore
  }

  self.onmessage = async (event: MessageEvent) => {
    const { type, code: codeText } = event.data || {};
    if (type !== "EXECUTE") return;

    const logs: LogEntry[] = [];
    const timers = new Map<string, number>();
    const counters = new Map<string, number>();
    let logId = 0;

    const pushLog = (logType: string, args: unknown[], tableData: unknown = null) => {
      const formattedArgs = args.map((arg) => formatNodeValue(arg, 0));
      const entry: LogEntry = {
        id: ++logId,
        type: logType,
        text: formattedArgs.map((a) => a.text).join(" "),
        args: formattedArgs,
        tableData,
        timestamp: Date.now(),
      };
      logs.push(entry);

      self.postMessage({
        type: "LOG",
        log: entry,
        allLogs: logs,
      });
    };

    const sandboxConsole = {
      log: (...args: unknown[]) => pushLog("log", args),
      info: (...args: unknown[]) => pushLog("info", args),
      warn: (...args: unknown[]) => pushLog("warn", args),
      error: (...args: unknown[]) => pushLog("error", args),
      dir: (item: unknown) => pushLog("dir", [item]),
      clear: () => {
        logs.length = 0;
        self.postMessage({ type: "LOG_CLEAR" });
      },
      table: (tabularData: unknown, properties?: string[]) => {
        const tableObj = formatConsoleTable(tabularData, properties);
        if (tableObj.type === "table") {
          pushLog("table", [tabularData], tableObj);
        } else {
          pushLog("log", [tabularData]);
        }
      },
      count: (label = "default") => {
        const current = (counters.get(label) || 0) + 1;
        counters.set(label, current);
        pushLog("count", [`${label}: ${current}`]);
      },
      countReset: (label = "default") => {
        counters.delete(label);
      },
      time: (label = "default") => {
        if (timers.has(label)) {
          pushLog("warn", [`Timer '${label}' already exists`]);
        } else {
          timers.set(label, performance.now());
        }
      },
      timeLog: (label = "default", ...args: unknown[]) => {
        const start = timers.get(label);
        if (start === undefined) {
          pushLog("warn", [`Timer '${label}' does not exist`]);
        } else {
          const elapsed = (performance.now() - start).toFixed(3);
          pushLog("time", [`${label}: ${elapsed}ms`, ...args]);
        }
      },
      timeEnd: (label = "default") => {
        const start = timers.get(label);
        if (start === undefined) {
          pushLog("warn", [`Timer '${label}' does not exist`]);
        } else {
          const elapsed = (performance.now() - start).toFixed(3);
          timers.delete(label);
          pushLog("time", [`${label}: ${elapsed}ms`]);
        }
      },
      assert: (condition: unknown, ...args: unknown[]) => {
        if (!condition) {
          pushLog("error", ["Assertion failed:", ...(args.length ? args : ["console.assert"])]);
        }
      },
      trace: (...args: unknown[]) => {
        const err = new Error();
        pushLog("trace", ["Trace:", ...args, err.stack?.split("\n").slice(2).join("\n")]);
      },
    };

    let timerCounter = 1;
    const pendingTimeouts = new Map<number, { nativeId: any }>();
    const activeIntervals = new Map<number, { nativeId: any; runCount: number }>();
    const MAX_INTERVAL_RUNS = 200;

    const sandboxSetTimeout = (fn: any, delay = 0, ...args: unknown[]) => {
      const virtualId = timerCounter++;
      const numDelay = Math.max(0, Number(delay) || 0);

      const nativeId = _nativeSetTimeout(() => {
        pendingTimeouts.delete(virtualId);
        try {
          if (typeof fn === "function") {
            fn(...args);
          } else {
            sandboxConsole.log(fn);
          }
        } catch (err) {
          sandboxConsole.error(err);
        } finally {
          checkAndNotifyComplete();
        }
      }, numDelay);

      pendingTimeouts.set(virtualId, { nativeId });
      return virtualId;
    };

    const sandboxClearTimeout = (id: number) => {
      if (id === undefined || id === null) return;
      if (pendingTimeouts.has(id)) {
        const item = pendingTimeouts.get(id)!;
        _nativeClearTimeout(item.nativeId);
        pendingTimeouts.delete(id);
        checkAndNotifyComplete();
      } else {
        _nativeClearTimeout(id);
      }
    };

    const sandboxSetInterval = (fn: any, delay = 0, ...args: unknown[]) => {
      const virtualId = timerCounter++;
      const numDelay = Math.max(10, Number(delay) || 0);

      const nativeId = _nativeSetInterval(() => {
        const item = activeIntervals.get(virtualId);
        if (!item) {
          _nativeClearInterval(nativeId);
          return;
        }

        item.runCount = (item.runCount || 0) + 1;
        if (item.runCount > MAX_INTERVAL_RUNS) {
          _nativeClearInterval(nativeId);
          activeIntervals.delete(virtualId);
          sandboxConsole.warn(
            `[NodeRunner] Интервал остановлен после ${MAX_INTERVAL_RUNS} итераций.`
          );
          checkAndNotifyComplete();
          return;
        }

        try {
          if (typeof fn === "function") {
            fn(...args);
          }
        } catch (err) {
          _nativeClearInterval(nativeId);
          activeIntervals.delete(virtualId);
          sandboxConsole.error(err);
          checkAndNotifyComplete();
        }
      }, numDelay);

      activeIntervals.set(virtualId, { nativeId, runCount: 0 });
      return virtualId;
    };

    const sandboxClearInterval = (id: number) => {
      if (id === undefined || id === null) return;
      if (activeIntervals.has(id)) {
        const item = activeIntervals.get(id)!;
        _nativeClearInterval(item.nativeId);
        activeIntervals.delete(id);
        checkAndNotifyComplete();
      } else {
        _nativeClearInterval(id);
      }
    };

    const sandboxQueueMicrotask = (fn: () => void) => {
      _nativeQueueMicrotask(() => {
        try {
          if (typeof fn === "function") fn();
        } catch (err) {
          sandboxConsole.error(err);
        }
      });
    };

    // Override global sandbox APIs in worker scope for async callbacks
    try {
      (self as any).console = sandboxConsole;
      (self as any).setTimeout = sandboxSetTimeout;
      (self as any).clearTimeout = sandboxClearTimeout;
      (self as any).setInterval = sandboxSetInterval;
      (self as any).clearInterval = sandboxClearInterval;
      (self as any).queueMicrotask = sandboxQueueMicrotask;
    } catch {
      // ignore
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event?.reason;
      if (!syncError) {
        const errorObj = reason instanceof Error ? reason : new Error(String(reason));
        syncError = {
          name: errorObj.name || "UnhandledPromiseRejection",
          message: errorObj.message || String(reason),
          stack: errorObj.stack || "",
        };
      }
      sandboxConsole.error(
        reason instanceof Error
          ? `${reason.name}: ${reason.message}`
          : `UnhandledPromiseRejection: ${String(reason)}`
      );
      checkAndNotifyComplete();
    };

    currentUnhandledRejectionHandler = handleUnhandledRejection;

    const sandboxExports: Record<string, unknown> = {};
    const sandboxModule = { exports: sandboxExports };

    const reactMock = {
      default: {},
      useState: (initial: unknown) => [typeof initial === "function" ? (initial as () => unknown)() : initial, () => {}],
      useEffect: (fn: unknown) => {
        try {
          if (typeof fn === "function") (fn as () => void)();
        } catch (err) {
          void err;
        }
      },
      useLayoutEffect: (fn: unknown) => {
        try {
          if (typeof fn === "function") (fn as () => void)();
        } catch (err) {
          void err;
        }
      },
      useCallback: (fn: unknown) => fn,
      useMemo: (fn: unknown) => (typeof fn === "function" ? (fn as () => unknown)() : fn),
      useRef: (initial: unknown) => ({ current: initial }),
      useReducer: (_reducer: unknown, initial: unknown) => [initial, () => {}],
      useContext: () => ({}),
      createContext: () => ({
        Provider: ({ children }: { children?: unknown }) => children,
        Consumer: ({ children }: { children?: unknown }) => children,
      }),
      memo: (c: unknown) => c,
      forwardRef: (c: unknown) => c,
      createElement: () => ({}),
      Fragment: Symbol("React.Fragment"),
    };

    const sandboxRequire = (mod: string) => {
      if (
        mod === "react" ||
        mod === "react/jsx-runtime" ||
        mod === "react/jsx-dev-runtime"
      ) {
        return reactMock;
      }
      if (mod === "react-dom" || mod === "react-dom/client") {
        return {
          default: {},
          createRoot: () => ({ render: () => {}, unmount: () => {} }),
        };
      }
      return sandboxHelpers;
    };

    const startTime = performance.now();
    let syncFinished = false;
    let isCompletePosted = false;
    let syncResult: unknown = undefined;
    let syncError: { name: string; message: string; stack?: string } | null = null;
    let completeTimeoutId: any = null;

    const checkAndNotifyComplete = () => {
      if (!syncFinished || isCompletePosted) return;

      if (pendingTimeouts.size > 0 || activeIntervals.size > 0) {
        if (completeTimeoutId !== null) {
          _nativeClearTimeout(completeTimeoutId);
          completeTimeoutId = null;
        }
        return;
      }

      if (completeTimeoutId !== null) {
        _nativeClearTimeout(completeTimeoutId);
      }

      completeTimeoutId = _nativeSetTimeout(() => {
        completeTimeoutId = null;
        if (isCompletePosted) return;
        if (pendingTimeouts.size > 0 || activeIntervals.size > 0) {
          return;
        }

        isCompletePosted = true;
        currentUnhandledRejectionHandler = null;
        const durationMs = Math.round((performance.now() - startTime) * 10) / 10;
        const safeResult = formatSafeResult(syncResult);

        try {
          self.postMessage({
            type: "COMPLETE",
            logs,
            result: safeResult,
            error: syncError,
            durationMs,
            exitCode: syncError ? 1 : 0,
          });
        } catch {
          self.postMessage({
            type: "COMPLETE",
            logs,
            result: formatNodeValue(syncResult, 0).text,
            error: syncError,
            durationMs,
            exitCode: syncError ? 1 : 0,
          });
        }
      }, 0);
    };

    try {
      const trimmedCode = (codeText || "").trim();
      if (!trimmedCode) {
        self.postMessage({
          type: "COMPLETE",
          logs: [],
          result: undefined,
          error: null,
          durationMs: 0,
          exitCode: 0,
        });
        return;
      }

      const wrappedCode = `
        return (async function(console, setTimeout, clearTimeout, setInterval, clearInterval, queueMicrotask, require, exports, module, window, global, globalThis) {
          "use strict";
          ${trimmedCode}
        })(sandboxConsole, sandboxSetTimeout, sandboxClearTimeout, sandboxSetInterval, sandboxClearInterval, sandboxQueueMicrotask, sandboxRequire, sandboxExports, sandboxModule, self, self, self);
      `;

      const executor = new Function(
        "sandboxConsole",
        "sandboxSetTimeout",
        "sandboxClearTimeout",
        "sandboxSetInterval",
        "sandboxClearInterval",
        "sandboxQueueMicrotask",
        "sandboxRequire",
        "sandboxExports",
        "sandboxModule",
        wrappedCode
      );

      const execPromise = executor(
        sandboxConsole,
        sandboxSetTimeout,
        sandboxClearTimeout,
        sandboxSetInterval,
        sandboxClearInterval,
        sandboxQueueMicrotask,
        sandboxRequire,
        sandboxExports,
        sandboxModule
      );

      syncResult = await execPromise;
    } catch (err: any) {
      syncError = {
        name: err?.name || "Error",
        message: err?.message || String(err),
        stack: err?.stack || "",
      };
      pushLog("error", [err instanceof Error ? `${err.name}: ${err.message}` : String(err)]);
    } finally {
      syncFinished = true;
      checkAndNotifyComplete();
    }
  };
}
