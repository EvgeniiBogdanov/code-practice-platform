/**
 * nodeWorker.js
 * Изолированный Web Worker для выполнения JavaScript / Node.js кода.
 * 
 * Преимущества:
 * 1. Полная изоляция от DOM, window, localStorage, indexedDB главного приложения.
 * 2. Возможность принудительной остановки через worker.terminate() при бесконечных циклах (while(true)).
 * 3. 0% блокировки главного UI-потока (сохранение 60 FPS).
 */

// Сохраняем нативные функции таймеров и очередей до их переопределения в глобальной области видимости
const _nativeSetTimeout = typeof self !== "undefined" && self.setTimeout ? self.setTimeout.bind(self) : setTimeout;
const _nativeClearTimeout = typeof self !== "undefined" && self.clearTimeout ? self.clearTimeout.bind(self) : clearTimeout;
const _nativeSetInterval = typeof self !== "undefined" && self.setInterval ? self.setInterval.bind(self) : setInterval;
const _nativeClearInterval = typeof self !== "undefined" && self.clearInterval ? self.clearInterval.bind(self) : clearInterval;
const _nativeQueueMicrotask = typeof self !== "undefined" && self.queueMicrotask ? self.queueMicrotask.bind(self) : queueMicrotask;

/**
 * Безопасное форматирование значений в стиле Node.js REPL
 */
export const formatNodeValue = (val, depth = 0, seen = new WeakSet()) => {
  if (val === null) return { type: "null", text: "null" };
  if (val === undefined) return { type: "undefined", text: "undefined" };

  const type = typeof val;

  if (type === "string") {
    return { type: "string", text: depth === 0 ? val : `'${val}'` };
  }

  if (type === "number") {
    if (Number.isNaN(val)) return { type: "nan", text: "NaN" };
    if (val === Infinity) return { type: "number", text: "Infinity" };
    if (val === -Infinity) return { type: "number", text: "-Infinity" };
    if (Object.is(val, -0)) return { type: "number", text: "-0" };
    return { type: "number", text: String(val) };
  }

  if (type === "boolean") {
    return { type: "boolean", text: String(val) };
  }

  if (type === "bigint") {
    return { type: "bigint", text: `${val}n` };
  }

  if (type === "symbol") {
    return { type: "symbol", text: val.toString() };
  }

  if (type === "function") {
    const isAsync = val.constructor?.name === "AsyncFunction";
    const isGenerator = val.constructor?.name === "GeneratorFunction";
    const fnPrefix = isAsync ? "AsyncFunction" : isGenerator ? "GeneratorFunction" : "Function";
    const name = val.name ? `: ${val.name}` : " (anonymous)";
    return { type: "function", text: `[${fnPrefix}${name}]` };
  }

  if (type === "object") {
    if (seen.has(val)) {
      return { type: "circular", text: "[Circular]" };
    }

    if (depth > 4) {
      return { type: "object", text: Array.isArray(val) ? "[Array]" : "[Object]" };
    }

    seen.add(val);

    try {
      if (val instanceof Error) {
        return {
          type: "error",
          text: `${val.name}: ${val.message}${val.stack ? `\n${val.stack.split("\n").slice(1, 4).join("\n")}` : ""}`,
        };
      }

      if (val instanceof Date) {
        return { type: "date", text: isNaN(val.getTime()) ? "Invalid Date" : val.toISOString() };
      }

      if (val instanceof RegExp) {
        return { type: "regexp", text: val.toString() };
      }

      if (val instanceof Promise) {
        return { type: "promise", text: "Promise { <pending> }" };
      }

      if (val instanceof Set) {
        const items = Array.from(val).map((item) => formatNodeValue(item, depth + 1, seen).text);
        const inner = items.join(", ");
        return { type: "set", text: `Set(${val.size}) { ${inner} }` };
      }

      if (val instanceof Map) {
        const items = Array.from(val.entries()).map(
          ([k, v]) => `${formatNodeValue(k, depth + 1, seen).text} => ${formatNodeValue(v, depth + 1, seen).text}`
        );
        const inner = items.join(", ");
        return { type: "map", text: `Map(${val.size}) { ${inner} }` };
      }

      if (Array.isArray(val)) {
        if (val.length === 0) return { type: "array", text: "[]" };
        const items = [];
        let emptyCount = 0;

        for (let i = 0; i < val.length; i++) {
          if (!(i in val)) {
            emptyCount++;
          } else {
            if (emptyCount > 0) {
              items.push(`<${emptyCount} empty item${emptyCount > 1 ? "s" : ""}>`);
              emptyCount = 0;
            }
            items.push(formatNodeValue(val[i], depth + 1, seen).text);
          }
        }
        if (emptyCount > 0) {
          items.push(`<${emptyCount} empty item${emptyCount > 1 ? "s" : ""}>`);
        }

        const singleLine = `[ ${items.join(", ")} ]`;
        if (singleLine.length < 80 && !singleLine.includes("\n")) {
          return { type: "array", text: singleLine };
        }
        const indent = "  ".repeat(depth + 1);
        const closeIndent = "  ".repeat(depth);
        return {
          type: "array",
          text: `[\n${items.map((it) => `${indent}${it}`).join(",\n")}\n${closeIndent}]`,
        };
      }

      // Обычный объект
      const keys = Object.keys(val);
      const symbolKeys = Object.getOwnPropertySymbols(val);
      const allKeys = [...keys, ...symbolKeys];

      if (allKeys.length === 0) {
        return { type: "object", text: "{}" };
      }

      const entries = allKeys.map((k) => {
        const keyStr = typeof k === "symbol" ? `[${k.toString()}]` : /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : `'${k}'`;
        const valFormatted = formatNodeValue(val[k], depth + 1, seen).text;
        return `${keyStr}: ${valFormatted}`;
      });

      const singleLine = `{ ${entries.join(", ")} }`;
      if (singleLine.length < 80 && !singleLine.includes("\n")) {
        return { type: "object", text: singleLine };
      }
      const indent = "  ".repeat(depth + 1);
      const closeIndent = "  ".repeat(depth);
      return {
        type: "object",
        text: `{\n${entries.map((e) => `${indent}${e}`).join(",\n")}\n${closeIndent}}`,
      };
    } finally {
      seen.delete(val);
    }
  }

  return { type: "unknown", text: String(val) };
};

/**
 * Форматирование таблицы для console.table
 */
export const formatConsoleTable = (tabularData, properties) => {
  if (!tabularData || typeof tabularData !== "object") {
    return { type: "text", text: String(tabularData) };
  }

  try {
    const isArr = Array.isArray(tabularData);
    const rows = [];
    const keysSet = new Set();

    if (isArr) {
      tabularData.forEach((item, idx) => {
        if (item && typeof item === "object") {
          const itemKeys = properties || Object.keys(item);
          itemKeys.forEach((k) => keysSet.add(k));
          rows.push({ "(index)": idx, ...item });
        } else {
          keysSet.add("Values");
          rows.push({ "(index)": idx, Values: item });
        }
      });
    } else {
      Object.entries(tabularData).forEach(([key, item]) => {
        if (item && typeof item === "object") {
          const itemKeys = properties || Object.keys(item);
          itemKeys.forEach((k) => keysSet.add(k));
          rows.push({ "(index)": key, ...item });
        } else {
          keysSet.add("Values");
          rows.push({ "(index)": key, Values: item });
        }
      });
    }

    const columns = ["(index)", ...Array.from(keysSet)];
    return {
      type: "table",
      columns,
      rows: rows.map((row) => {
        const mapped = {};
        columns.forEach((col) => {
          mapped[col] = col in row ? formatNodeValue(row[col], 1).text : "";
        });
        return mapped;
      }),
    };
  } catch {
    return { type: "text", text: formatNodeValue(tabularData, 0).text };
  }
};

self.onmessage = async (event) => {
  const { type, code: codeText } = event.data || {};
  if (type !== "EXECUTE") return;

  const logs = [];
  const timers = new Map();
  const counters = new Map();
  let logId = 0;

  const pushLog = (logType, args, tableData = null) => {
    const formattedArgs = args.map((arg) => formatNodeValue(arg, 0));
    const entry = {
      id: ++logId,
      type: logType,
      text: formattedArgs.map((a) => a.text).join(" "),
      args: formattedArgs,
      tableData,
      timestamp: Date.now(),
    };
    logs.push(entry);

    // Стримим лог в главный поток
    self.postMessage({
      type: "LOG",
      log: entry,
      allLogs: logs,
    });
  };

  const sandboxConsole = {
    log: (...args) => pushLog("log", args),
    info: (...args) => pushLog("info", args),
    warn: (...args) => pushLog("warn", args),
    error: (...args) => pushLog("error", args),
    dir: (item) => pushLog("dir", [item]),
    clear: () => {
      logs.length = 0;
      self.postMessage({ type: "LOG_CLEAR" });
    },
    table: (tabularData, properties) => {
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
    timeLog: (label = "default", ...args) => {
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
    assert: (condition, ...args) => {
      if (!condition) {
        pushLog("error", ["Assertion failed:", ...(args.length ? args : ["console.assert"])]);
      }
    },
    trace: (...args) => {
      const err = new Error();
      pushLog("trace", ["Trace:", ...args, err.stack?.split("\n").slice(2).join("\n")]);
    },
  };

  let timerCounter = 1;
  const pendingTimeouts = new Map();
  const activeIntervals = new Map();
  const MAX_INTERVAL_RUNS = 200;

  const sandboxSetTimeout = (fn, delay = 0, ...args) => {
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

  const sandboxClearTimeout = (id) => {
    if (id === undefined || id === null) return;
    if (pendingTimeouts.has(id)) {
      const item = pendingTimeouts.get(id);
      _nativeClearTimeout(item.nativeId);
      pendingTimeouts.delete(id);
      checkAndNotifyComplete();
    } else {
      _nativeClearTimeout(id);
    }
  };

  const sandboxSetInterval = (fn, delay = 0, ...args) => {
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
        sandboxConsole.warn(`[NodeRunner] Интервал остановлен после ${MAX_INTERVAL_RUNS} итераций для предотвращения утечки памяти.`);
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

  const sandboxClearInterval = (id) => {
    if (id === undefined || id === null) return;
    if (activeIntervals.has(id)) {
      const item = activeIntervals.get(id);
      _nativeClearInterval(item.nativeId);
      activeIntervals.delete(id);
      checkAndNotifyComplete();
    } else {
      _nativeClearInterval(id);
    }
  };

  const sandboxQueueMicrotask = (fn) => {
    _nativeQueueMicrotask(() => {
      try {
        if (typeof fn === "function") fn();
      } catch (err) {
        sandboxConsole.error(err);
      }
    });
  };

  // Переопределяем глобальные таймеры и консоль в контексте воркера
  try {
    self.console = sandboxConsole;
    self.setTimeout = sandboxSetTimeout;
    self.clearTimeout = sandboxClearTimeout;
    self.setInterval = sandboxSetInterval;
    self.clearInterval = sandboxClearInterval;
    self.queueMicrotask = sandboxQueueMicrotask;
  } catch {
    // ignore
  }

  const sandboxHelpers = {
    createNode: (val = 0, left = null, right = null) => ({ val, left, right }),
    createTreeNode: (val = 0, left = null, right = null) => ({ val, left, right }),
    createListNode: (val = 0, next = null) => ({ val, next }),
    buildTree: (values) => {
      if (!values || values.length === 0) return null;
      const root = { val: values[0], left: null, right: null };
      const queue = [root];
      let i = 1;
      while (i < values.length) {
        const current = queue.shift();
        const leftVal = values[i++];
        if (leftVal !== null && leftVal !== undefined) {
          current.left = { val: leftVal, left: null, right: null };
          queue.push(current.left);
        }
        if (i < values.length) {
          const rightVal = values[i++];
          if (rightVal !== null && rightVal !== undefined) {
            current.right = { val: rightVal, left: null, right: null };
            queue.push(current.right);
          }
        }
      }
      return root;
    },
    treeToArray: (root) => {
      if (root === null) return [];
      const result = [];
      const queue = [root];
      while (queue.length > 0) {
        const node = queue.shift();
        if (node === null) {
          result.push(null);
        } else {
          result.push(node.val);
          queue.push(node.left);
          queue.push(node.right);
        }
      }
      while (result.length > 0 && result[result.length - 1] === null) {
        result.pop();
      }
      return result;
    },
    createLinkedList: (arr) => {
      if (!arr || arr.length === 0) return null;
      return arr.reduceRight((acc, val) => ({ val, next: acc }), null);
    },
    linkedListToArray: (head) => {
      const res = [];
      let curr = head;
      while (curr) {
        res.push(curr.val);
        curr = curr.next;
      }
      return res;
    },
    printLinkedList: (head) => {
      const res = [];
      let curr = head;
      while (curr) {
        res.push(curr.val);
        curr = curr.next;
      }
      return res;
    },
    createLinkedListWithCycle: (arr, pos) => {
      if (!arr || arr.length === 0) return null;
      const nodes = arr.map((val) => ({ val, next: null }));
      for (let i = 0; i < nodes.length - 1; i++) {
        nodes[i].next = nodes[i + 1];
      }
      if (pos >= 0 && pos < nodes.length) {
        nodes[nodes.length - 1].next = nodes[pos];
      }
      return nodes[0];
    },
    createListWithCycle: (arr, pos) => {
      if (!arr || arr.length === 0) return null;
      const nodes = arr.map((val) => ({ val, next: null }));
      for (let i = 0; i < nodes.length - 1; i++) {
        nodes[i].next = nodes[i + 1];
      }
      if (pos >= 0 && pos < nodes.length) {
        nodes[nodes.length - 1].next = nodes[pos];
      }
      return nodes[0];
    },
  };

  const sandboxRequire = (mod) => {
    return sandboxHelpers;
  };

  const formatSafeResult = (val) => {
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

  const startTime = performance.now();
  let syncFinished = false;
  let isCompletePosted = false;
  let syncResult = undefined;
  let syncError = null;

  const checkAndNotifyComplete = () => {
    if (!syncFinished || isCompletePosted) return;

    // Если остались активные таймеры или интервалы — не завершаем воркер до их выполнения
    if (pendingTimeouts.size > 0 || activeIntervals.size > 0) {
      return;
    }

    _nativeQueueMicrotask(() => {
      if (isCompletePosted) return;
      if (pendingTimeouts.size > 0 || activeIntervals.size > 0) {
        return;
      }

      isCompletePosted = true;
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
    });
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
      return (async function(console, setTimeout, clearTimeout, setInterval, clearInterval, queueMicrotask, require, window, global, globalThis) {
        "use strict";
        ${trimmedCode}
      })(sandboxConsole, sandboxSetTimeout, sandboxClearTimeout, sandboxSetInterval, sandboxClearInterval, sandboxQueueMicrotask, sandboxRequire, self, self, self);
    `;

    const executor = new Function(
      "sandboxConsole",
      "sandboxSetTimeout",
      "sandboxClearTimeout",
      "sandboxSetInterval",
      "sandboxClearInterval",
      "sandboxQueueMicrotask",
      "sandboxRequire",
      wrappedCode
    );

    const execPromise = executor(
      sandboxConsole,
      sandboxSetTimeout,
      sandboxClearTimeout,
      sandboxSetInterval,
      sandboxClearInterval,
      sandboxQueueMicrotask,
      sandboxRequire
    );

    syncResult = await execPromise;
  } catch (err) {
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
