/**
 * Node.js Execution Runner via Web Worker
 */

import NodeWorker from "./nodeWorker?worker";
export { formatNodeValue, formatConsoleTable } from "./nodeFormatter";

export interface NodeRunnerLogEntry {
  id: number;
  type: string;
  text: string;
  args: Array<{ type: string; text: string }>;
  tableData?: unknown;
  timestamp: number;
}

export interface NodeRunnerResult {
  logs: NodeRunnerLogEntry[];
  result: unknown;
  error: { name?: string; message?: string } | null;
  durationMs: number;
  exitCode: number;
}

export interface NodeRunnerOptions {
  onLog?: (log: NodeRunnerLogEntry | null, allLogs: NodeRunnerLogEntry[]) => void;
  timeoutMs?: number;
}

let activeWorker: Worker | null = null;
let activeTimeoutId: ReturnType<typeof setTimeout> | null = null;

export function clearRunningTimers(): void {
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
}

export function runNodeJsCode(
  codeText: string,
  options: NodeRunnerOptions = {}
): Promise<NodeRunnerResult> {
  const { onLog, timeoutMs = 12000 } = options;

  clearRunningTimers();

  return new Promise<NodeRunnerResult>((resolve) => {
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

    let worker: Worker | null = null;
    try {
      worker = new NodeWorker();
      activeWorker = worker;
    } catch (err: any) {
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

    let currentLogs: NodeRunnerLogEntry[] = [];
    const startTime = performance.now();

    activeTimeoutId = setTimeout(() => {
      if (activeWorker === worker) {
        worker!.terminate();
        activeWorker = null;
        activeTimeoutId = null;

        const durationMs = Math.round((performance.now() - startTime) * 10) / 10;
        const timeoutError = {
          name: "TimeoutError",
          message: `Время выполнения превысило ${timeoutMs}ms (сработала защита от бесконечного цикла)`,
        };

        const timeoutLog: NodeRunnerLogEntry = {
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

    worker.onmessage = (event: MessageEvent) => {
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
          worker!.terminate();
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

    worker.onerror = (err: ErrorEvent) => {
      if (activeTimeoutId) {
        clearTimeout(activeTimeoutId);
        activeTimeoutId = null;
      }
      if (activeWorker === worker) {
        activeWorker = null;
      }

      try {
        worker!.terminate();
      } catch {
        // ignore
      }

      const durationMs = Math.round((performance.now() - startTime) * 10) / 10;
      const errorObj = {
        name: "WorkerError",
        message: err?.message || "Ошибка в потоке Web Worker",
      };

      const errorLog: NodeRunnerLogEntry = {
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

    worker.postMessage({
      type: "EXECUTE",
      code: trimmedCode,
      timeoutMs,
    });
  });
}
