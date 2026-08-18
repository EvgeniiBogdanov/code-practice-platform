/**
 * timerExecution.test.js
 * Юнит-тесты изолированного выполнения JavaScript таймеров (setTimeout, setInterval, clearTimeout, clearInterval)
 */

import assert from "node:assert";

// Симуляция логики песочницы из nodeWorker.js для всестороннего тестирования в Node.js
function createSandboxRunner() {
  return function executeCode(codeText, { timeoutMs = 5000, maxIntervalRuns = 200 } = {}) {
    return new Promise((resolve) => {
      const logs = [];
      const pendingTimeouts = new Map();
      const activeIntervals = new Map();
      let timerCounter = 1;
      let logId = 0;
      const startTime = Date.now();

      const pushLog = (type, args) => {
        logs.push({
          id: ++logId,
          type,
          text: args.map(a => typeof a === "object" ? JSON.stringify(a) : String(a)).join(" "),
          timestamp: Date.now(),
        });
      };

      const sandboxConsole = {
        log: (...args) => pushLog("log", args),
        info: (...args) => pushLog("info", args),
        warn: (...args) => pushLog("warn", args),
        error: (...args) => pushLog("error", args),
      };

      let syncFinished = false;
      let isCompletePosted = false;
      let syncResult = undefined;
      let syncError = null;

      const checkAndNotifyComplete = () => {
        if (!syncFinished || isCompletePosted) return;

        if (pendingTimeouts.size > 0 || activeIntervals.size > 0) {
          return;
        }

        queueMicrotask(() => {
          if (isCompletePosted) return;
          if (pendingTimeouts.size > 0 || activeIntervals.size > 0) {
            return;
          }

          isCompletePosted = true;
          const durationMs = Date.now() - startTime;
          resolve({
            logs,
            result: syncResult,
            error: syncError,
            durationMs,
            exitCode: syncError ? 1 : 0,
          });
        });
      };

      const sandboxSetTimeout = (fn, delay = 0, ...args) => {
        const virtualId = timerCounter++;
        const numDelay = Math.max(0, Number(delay) || 0);

        const nativeId = setTimeout(() => {
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
          clearTimeout(item.nativeId);
          pendingTimeouts.delete(id);
          checkAndNotifyComplete();
        } else {
          clearTimeout(id);
        }
      };

      const sandboxSetInterval = (fn, delay = 0, ...args) => {
        const virtualId = timerCounter++;
        const numDelay = Math.max(5, Number(delay) || 0);

        const nativeId = setInterval(() => {
          const item = activeIntervals.get(virtualId);
          if (!item) {
            clearInterval(nativeId);
            return;
          }

          item.runCount = (item.runCount || 0) + 1;
          if (item.runCount > maxIntervalRuns) {
            clearInterval(nativeId);
            activeIntervals.delete(virtualId);
            sandboxConsole.warn(`Interval stopped after max runs`);
            checkAndNotifyComplete();
            return;
          }

          try {
            if (typeof fn === "function") {
              fn(...args);
            }
          } catch (err) {
            clearInterval(nativeId);
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
          clearInterval(item.nativeId);
          activeIntervals.delete(id);
          checkAndNotifyComplete();
        } else {
          clearInterval(id);
        }
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

      // Watchdog timeout
      const killTimeoutId = setTimeout(() => {
        if (!isCompletePosted) {
          isCompletePosted = true;
          // Clear all pending timers
          for (const item of pendingTimeouts.values()) clearTimeout(item.nativeId);
          for (const item of activeIntervals.values()) clearInterval(item.nativeId);
          resolve({
            logs,
            result: undefined,
            error: { name: "TimeoutError", message: `Timeout exceeded ${timeoutMs}ms` },
            durationMs: Date.now() - startTime,
            exitCode: 1,
          });
        }
      }, timeoutMs);

      (async () => {
        try {
          const wrapped = new Function(
            "console",
            "setTimeout",
            "clearTimeout",
            "setInterval",
            "clearInterval",
            "queueMicrotask",
            `return (async () => { ${codeText} })();`
          );

          syncResult = await wrapped(
            sandboxConsole,
            sandboxSetTimeout,
            sandboxClearTimeout,
            sandboxSetInterval,
            sandboxClearInterval,
            sandboxQueueMicrotask
          );
        } catch (err) {
          syncError = err;
          sandboxConsole.error(err.message || String(err));
        } finally {
          syncFinished = true;
          checkAndNotifyComplete();
        }
      })();
    });
  };
}

async function runTests() {
  console.log("=== Running JavaScript Timers & Event Loop Test Suite ===\n");
  const runCode = createSandboxRunner();
  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    return (async () => {
      try {
        await fn();
        console.log(`  ✓ ${name}`);
        passed++;
      } catch (err) {
        console.error(`  ✗ ${name}:`, err.message);
        failed++;
      }
    })();
  }

  // 1. Synchronous execution
  console.log("--- 1. Synchronous Execution ---");
  await test("Runs synchronous console.log immediately", async () => {
    const res = await runCode(`console.log("Hello", "world"); return 42;`);
    assert.strictEqual(res.logs.length, 1);
    assert.strictEqual(res.logs[0].text, "Hello world");
    assert.strictEqual(res.result, 42);
    assert.strictEqual(res.exitCode, 0);
  });

  // 2. setTimeout basic
  console.log("\n--- 2. setTimeout Basic ---");
  await test("Waits for setTimeout(..., 20) to execute and logs properly", async () => {
    const res = await runCode(`
      setTimeout(() => {
        console.log("Delayed message");
      }, 20);
    `);
    assert.strictEqual(res.logs.length, 1);
    assert.strictEqual(res.logs[0].text, "Delayed message");
    assert.strictEqual(res.exitCode, 0);
  });

  // 3. Execution order (Event Loop)
  console.log("\n--- 3. Event Loop Execution Order ---");
  await test("Preserves correct execution order: sync 1, sync 3, async 2", async () => {
    const res = await runCode(`
      console.log(1);
      setTimeout(() => {
        console.log(2);
      }, 0);
      console.log(3);
    `);
    assert.strictEqual(res.logs.length, 3);
    assert.strictEqual(res.logs[0].text, "1");
    assert.strictEqual(res.logs[1].text, "3");
    assert.strictEqual(res.logs[2].text, "2");
  });

  // 4. Nested setTimeout
  console.log("\n--- 4. Nested setTimeout ---");
  await test("Waits for nested timeouts to complete", async () => {
    const res = await runCode(`
      console.log("Start");
      setTimeout(() => {
        console.log("Timeout 1");
        setTimeout(() => {
          console.log("Nested Timeout");
        }, 10);
      }, 10);
      setTimeout(() => {
        console.log("Timeout 2");
      }, 10);
      console.log("End");
    `);
    const logTexts = res.logs.map(l => l.text);
    assert.deepStrictEqual(logTexts, ["Start", "End", "Timeout 1", "Timeout 2", "Nested Timeout"]);
  });

  // 5. Closure loop with var vs let
  console.log("\n--- 5. Closure Loop with Timers ---");
  await test("Captures loop with let correctly (0, 1, 2)", async () => {
    const res = await runCode(`
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          console.log(i);
        }, 10);
      }
    `);
    const logTexts = res.logs.map(l => l.text);
    assert.deepStrictEqual(logTexts, ["0", "1", "2"]);
  });

  // 6. setInterval with counter and clearInterval
  console.log("\n--- 6. setInterval and clearInterval ---");
  await test("Ticking setInterval stops upon clearInterval", async () => {
    const res = await runCode(`
      let count = 0;
      const intervalId = setInterval(() => {
        count++;
        console.log("Tick:", count);
        if (count === 3) {
          clearInterval(intervalId);
        }
      }, 15);
    `);
    const logTexts = res.logs.map(l => l.text);
    assert.deepStrictEqual(logTexts, ["Tick: 1", "Tick: 2", "Tick: 3"]);
    assert.strictEqual(res.exitCode, 0);
  });

  // 7. Debounce implementation
  console.log("\n--- 7. Debounce ---");
  await test("Debounce cancels previous call and only executes last after delay", async () => {
    const res = await runCode(`
      const debounce = (fn, ms) => {
        let timerId;
        return (...args) => {
          clearTimeout(timerId);
          timerId = setTimeout(() => fn(...args), ms);
        };
      };

      const log = debounce((msg) => console.log("Debounced:", msg), 30);
      log("a");
      log("b");
      log("c");
    `);
    const logTexts = res.logs.map(l => l.text);
    assert.deepStrictEqual(logTexts, ["Debounced: c"]);
  });

  // 8. clearTimeout cancels scheduled timeout
  console.log("\n--- 8. clearTimeout Cancellation ---");
  await test("clearTimeout prevents callback from firing", async () => {
    const res = await runCode(`
      const tId = setTimeout(() => {
        console.log("SHOULD NOT APPEAR");
      }, 30);
      clearTimeout(tId);
      console.log("Cleared immediately");
    `);
    const logTexts = res.logs.map(l => l.text);
    assert.deepStrictEqual(logTexts, ["Cleared immediately"]);
  });

  // 9. Countdown Timer
  console.log("\n--- 9. Countdown Timer ---");
  await test("Countdown timer counts down and prints final message", async () => {
    const res = await runCode(`
      const createTimer = (seconds) => {
        let left = seconds;
        const iId = setInterval(() => {
          console.log(left);
          left--;
          if (left < 1) {
            clearInterval(iId);
            console.log("Time's up!");
          }
        }, 10);
      };

      createTimer(3);
    `);
    const logTexts = res.logs.map(l => l.text);
    assert.deepStrictEqual(logTexts, ["3", "2", "1", "Time's up!"]);
  });

  // 10. User's exact debounce code snippet
  console.log("\n--- 10. User's exact debounce snippet ---");
  await test("Executes user debounce snippet without RangeError and logs 'c'", async () => {
    const userCode = `
      const debounce = (fn, ms) => {
        let timeoutId;
        return (...args) => {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            fn(...args);
          }, ms);
        };
      };

      // Пример вызова:
      const log = debounce((msg) => console.log(msg), 30);
      log("a");
      log("b");
      log("c");
    `;
    const res = await runCode(userCode);
    assert.strictEqual(res.error, null);
    assert.strictEqual(res.exitCode, 0);
    assert.deepStrictEqual(res.logs.map(l => l.text), ["c"]);
  });

  console.log("\n========================================");
  console.log(`Tests finished: ${passed} passed, ${failed} failed.`);
  if (failed > 0) {
    process.exit(1);
  } else {
    console.log("ALL TIMER & CONSOLE TESTS PASSED SUCCESSFULLY! ✓\n");
  }
}

runTests();
