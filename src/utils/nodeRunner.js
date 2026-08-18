/**
 * nodeRunner.js
 * Выполнение пользовательского JavaScript / Node.js кода через изолированный Web Worker.
 * 
 * Ключевые возможности:
 * 1. Гарантированная защита от блокировки UI: при while(true) или таймауте worker мгновенно
 *    уничтожается через worker.terminate(), интерфейс не зависает.
 * 2. Полная изоляция от DOM, window, localStorage и indexedDB.
 * 3. Потоковый стриминг логов консоли в реальном времени.
 */

import NodeWorker from "./nodeWorker.js?worker";
export { formatNodeValue, formatConsoleTable } from "./nodeWorker.js";

// Активный экземпляр воркера для возможности немедленной остановки
let activeWorker = null;
let activeTimeoutId = null;

/**
 * Принудительно останавливает текущий исполняемый скрипт и очищает ресурсы
 */
export const clearRunningTimers = () => {
  if (activeTimeoutId) {
    clearTimeout(activeTimeoutId);
    activeTimeoutId = null;
  }
  if (activeWorker) {
    try {
      activeWorker.terminate();
    } catch {
      // ignore
    }
    activeWorker = null;
  }
};

/**
 * Исполняет JavaScript код в изолированном Web Worker
 * @param {string} codeText Исходный код для выполнения
 * @param {object} options Дополнительные опции
 * @param {function} options.onLog Потоковый колбэк при появлении новых логов
 * @param {number} options.timeoutMs Максимальное время выполнения (по умолчанию 12000ms для поддержки многосекундных таймеров)
 * @returns {Promise<{ logs: Array, result: any, error: object|null, durationMs: number, exitCode: number }>}
 */
export const runNodeJsCode = (codeText, options = {}) => {
  const { onLog, timeoutMs = 12000 } = options;

  // Останавливаем предыдущий запуск, если он ещё идёт
  clearRunningTimers();

  return new Promise((resolve) => {
    const trimmedCode = (codeText || "").trim();
    if (!trimmedCode) {
      resolve({
        logs: [],
        result: undefined,
        error: null,
        durationMs: 0,
        exitCode: 0,
      });
      return;
    }

    let worker = null;
    try {
      worker = new NodeWorker();
      activeWorker = worker;
    } catch (err) {
      console.error("[NodeRunner] Failed to spawn Web Worker:", err);
      resolve({
        logs: [
          {
            id: 1,
            type: "error",
            text: `Не удалось инициализировать Web Worker: ${err.message}`,
            args: [{ type: "string", text: err.message }],
            timestamp: Date.now(),
          },
        ],
        result: undefined,
        error: err,
        durationMs: 0,
        exitCode: 1,
      });
      return;
    }

    let currentLogs = [];
    const startTime = performance.now();

    // Защитный таймаут для остановки бесконечных циклов
    activeTimeoutId = setTimeout(() => {
      if (activeWorker === worker) {
        worker.terminate();
        activeWorker = null;
        activeTimeoutId = null;

        const durationMs = Math.round((performance.now() - startTime) * 10) / 10;
        const timeoutError = {
          name: "TimeoutError",
          message: `Время выполнения превысило ${timeoutMs}ms (сработала защита от бесконечного цикла)`,
        };

        const timeoutLog = {
          id: currentLogs.length + 1,
          type: "error",
          text: `[NodeRunner] Ошибка: Время выполнения превысило ${timeoutMs}ms (бесконечный цикл остановлен).`,
          args: [{ type: "error", text: timeoutError.message }],
          timestamp: Date.now(),
        };

        const finalLogs = [...currentLogs, timeoutLog];
        if (onLog) {
          onLog(timeoutLog, finalLogs);
        }

        resolve({
          logs: finalLogs,
          result: undefined,
          error: timeoutError,
          durationMs,
          exitCode: 1,
        });
      }
    }, timeoutMs);

    worker.onmessage = (event) => {
      const data = event.data || {};

      if (data.type === "LOG") {
        currentLogs = data.allLogs || [...currentLogs, data.log];
        if (onLog && data.log) {
          onLog(data.log, currentLogs);
        }
      } else if (data.type === "LOG_CLEAR") {
        currentLogs = [];
        if (onLog) {
          onLog(null, []);
        }
      } else if (data.type === "COMPLETE") {
        if (activeTimeoutId) {
          clearTimeout(activeTimeoutId);
          activeTimeoutId = null;
        }
        if (activeWorker === worker) {
          activeWorker = null;
        }

        try {
          worker.terminate();
        } catch {
          // ignore
        }

        resolve({
          logs: data.logs || currentLogs,
          result: data.result,
          error: data.error,
          durationMs: data.durationMs || Math.round((performance.now() - startTime) * 10) / 10,
          exitCode: data.exitCode || 0,
        });
      }
    };

    worker.onerror = (err) => {
      if (activeTimeoutId) {
        clearTimeout(activeTimeoutId);
        activeTimeoutId = null;
      }
      if (activeWorker === worker) {
        activeWorker = null;
      }

      try {
        worker.terminate();
      } catch {
        // ignore
      }

      const durationMs = Math.round((performance.now() - startTime) * 10) / 10;
      const errorObj = {
        name: "WorkerError",
        message: err?.message || "Ошибка в потоке Web Worker",
      };

      const errorLog = {
        id: currentLogs.length + 1,
        type: "error",
        text: `Error: ${errorObj.message}`,
        args: [{ type: "error", text: errorObj.message }],
        timestamp: Date.now(),
      };

      const finalLogs = [...currentLogs, errorLog];
      if (onLog) {
        onLog(errorLog, finalLogs);
      }

      resolve({
        logs: finalLogs,
        result: undefined,
        error: errorObj,
        durationMs,
        exitCode: 1,
      });
    };

    // Запускаем исполнение в воркере
    worker.postMessage({
      type: "EXECUTE",
      code: trimmedCode,
      timeoutMs,
    });
  });
};
