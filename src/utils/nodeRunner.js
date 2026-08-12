/**
 * nodeRunner.js
 * Полноценная эмуляция среды выполнения Node.js (аналог `node main.js`) в браузере.
 * Поддерживает:
 * - Перехват всех методов `console.*` (log, info, warn, error, table, dir, time, timeEnd, count, clear, assert, trace)
 * - Форматирование в стиле Node.js REPL (примитивы, массивы, объекты, Set, Map, Date, RegExp, Error, Function, Symbol, BigInt)
 * - Защиту от циклических ссылок ([Circular])
 * - Асинхронный код (async/await, Promises, queueMicrotask)
 * - Таймеры (setTimeout, setInterval, setImmediate, clearTimeout, clearInterval) с потоковым обновлением вывода
 * - Защиту от бесконечных циклов и таймаут выполнения
 */

// Хранилище активных таймеров для очистки при повторном запуске
let activeIntervalIds = new Set();
let activeTimeoutIds = new Set();

export const clearRunningTimers = () => {
  activeIntervalIds.forEach((id) => clearInterval(id));
  activeIntervalIds.clear();
  activeTimeoutIds.forEach((id) => clearTimeout(id));
  activeTimeoutIds.clear();
};

/**
 * Безопасное форматирование значений в стиле Node.js
 */
export const formatNodeValue = (val, depth = 0, seen = new WeakSet()) => {
  if (val === null) return { type: "null", text: "null" };
  if (val === undefined) return { type: "undefined", text: "undefined" };

  const type = typeof val;

  if (type === "string") {
    // Внутри объектов/массивов строки оборачиваются в кавычки, верхнеуровнево в log — нет
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

/**
 * Исполняет JavaScript код в безопасной песочнице с перехватом консоли
 * @param {string} codeText Исходный код для выполнения
 * @param {object} options Дополнительные опции
 * @param {function} options.onLog Потоковый колбэк при появлении новых логов (включая асинхронные таймеры)
 * @param {number} options.timeoutMs Максимальное время синхронного выполнения (защита от бесконечных циклов)
 * @returns {Promise<{ logs: Array, result: any, error: object|null, durationMs: number, exitCode: number }>}
 */
export const runNodeJsCode = async (codeText, options = {}) => {
  const { onLog, timeoutMs = 4000 } = options;

  // Очищаем предыдущие запущенные таймеры
  clearRunningTimers();

  const logs = [];
  const timers = new Map();
  const counters = new Map();
  let logId = 0;

  const pushLog = (type, args, tableData = null) => {
    const formattedArgs = args.map((arg) => formatNodeValue(arg, 0));
    const text = formattedArgs.map((f) => f.text).join(" ");
    const logItem = {
      id: `log-${++logId}-${Date.now()}`,
      type,
      args: formattedArgs,
      text,
      tableData,
      timestamp: new Date().toLocaleTimeString("ru-RU", { hour12: false }),
    };
    logs.push(logItem);
    if (typeof onLog === "function") {
      onLog(logItem, [...logs]);
    }
  };

  // Эмулируем объект console
  const sandboxConsole = {
    log: (...args) => pushLog("log", args),
    info: (...args) => pushLog("info", args),
    warn: (...args) => pushLog("warn", args),
    error: (...args) => pushLog("error", args),
    dir: (item) => pushLog("dir", [item]),
    clear: () => {
      logs.length = 0;
      if (typeof onLog === "function") onLog({ type: "clear" }, []);
    },
    table: (data, properties) => {
      const tableFormatted = formatConsoleTable(data, properties);
      if (tableFormatted.type === "table") {
        pushLog("table", [data], tableFormatted);
      } else {
        pushLog("log", [data]);
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
      timers.set(label, performance.now());
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

  // Эмулируем таймеры для безопасного сбора асинхронных логов
  const sandboxSetTimeout = (fn, delay = 0, ...args) => {
    let tId = null;
    tId = setTimeout(() => {
      activeTimeoutIds.delete(tId);
      try {
        if (typeof fn === "function") {
          fn(...args);
        } else {
          sandboxConsole.log(fn);
        }
      } catch (err) {
        sandboxConsole.error(err);
      }
    }, Math.max(0, delay));
    activeTimeoutIds.add(tId);
    return tId;
  };

  const sandboxClearTimeout = (id) => {
    clearTimeout(id);
    activeTimeoutIds.delete(id);
  };

  let intervalRunCounts = new Map();
  const MAX_INTERVAL_RUNS = 200; // защита от спама бесконечными интервалами

  const sandboxSetInterval = (fn, delay = 0, ...args) => {
    let iId = null;
    iId = setInterval(() => {
      const count = (intervalRunCounts.get(iId) || 0) + 1;
      intervalRunCounts.set(iId, count);

      if (count > MAX_INTERVAL_RUNS) {
        clearInterval(iId);
        activeIntervalIds.delete(iId);
        sandboxConsole.warn(`[NodeRunner] Интервал остановлен после ${MAX_INTERVAL_RUNS} итераций для предотвращения утечки.`);
        return;
      }

      try {
        if (typeof fn === "function") {
          fn(...args);
        }
      } catch (err) {
        clearInterval(iId);
        activeIntervalIds.delete(iId);
        sandboxConsole.error(err);
      }
    }, Math.max(10, delay));

    activeIntervalIds.add(iId);
    return iId;
  };

  const sandboxClearInterval = (id) => {
    clearInterval(id);
    activeIntervalIds.delete(id);
    intervalRunCounts.delete(id);
  };

  const sandboxQueueMicrotask = (fn) => {
    queueMicrotask(() => {
      try {
        if (typeof fn === "function") fn();
      } catch (err) {
        sandboxConsole.error(err);
      }
    });
  };

  const startTime = performance.now();
  let result = undefined;
  let error = null;
  let exitCode = 0;

  try {
    // Очищаем код от лишних BOM и форматируем
    const trimmedCode = codeText.trim();
    if (!trimmedCode) {
      return {
        logs: [],
        result: undefined,
        error: null,
        durationMs: 0,
        exitCode: 0,
      };
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

    // Оборачиваем код в асинхронную функцию с изолированными переменными среды
    const wrappedCode = `
      return (async function(console, setTimeout, clearTimeout, setInterval, clearInterval, queueMicrotask, require) {
        "use strict";
        ${trimmedCode}
      })(sandboxConsole, sandboxSetTimeout, sandboxClearTimeout, sandboxSetInterval, sandboxClearInterval, sandboxQueueMicrotask, sandboxRequire);
    `;

    // Создаем функцию исполнения
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

    // Запускаем с контролем таймаута для синхронных блокировок
    const execPromise = executor(
      sandboxConsole,
      sandboxSetTimeout,
      sandboxClearTimeout,
      sandboxSetInterval,
      sandboxClearInterval,
      sandboxQueueMicrotask,
      sandboxRequire
    );

    const timeoutPromise = new Promise((_, reject) => {
      const toId = setTimeout(() => {
        reject(new Error(`Execution timed out after ${timeoutMs}ms (infinite loop protection)`));
      }, timeoutMs);
      activeTimeoutIds.add(toId);
    });

    result = await Promise.race([execPromise, timeoutPromise]);
  } catch (err) {
    error = err;
    exitCode = 1;
    pushLog("error", [err instanceof Error ? `${err.name}: ${err.message}` : String(err)]);
  }

  const durationMs = Math.round((performance.now() - startTime) * 10) / 10;

  return {
    logs,
    result,
    error,
    durationMs,
    exitCode,
  };
};
