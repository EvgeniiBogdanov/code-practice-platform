import TypeScriptWorker from "./typescriptWorker?worker";
import type { TypeScriptDiagnosticRequest, TypeScriptDiagnosticResponse } from "./typescriptTypes";

export type {
  TypeScriptSourceInput,
  TypeScriptDiagnosticRequest,
  TypeScriptDiagnosticResponse,
  TypeScriptCompletion,
  TypeScriptHover,
  TypeScriptSignature,
  TypeScriptRenameEdit,
  TypeScriptCodeFix,
  TypeScriptTextChange,
  TypeScriptLocation,
  EditorDiagnostic,
  TypeTestCase,
  TypeTestCompileResult,
  TypeTestFailure,
  TypeTestReport,
  TypeTestResult,
  TypeTestStatus,
  TypeTestsInput,
} from "./typescriptTypes";

export type TypeScriptRequest = Omit<TypeScriptDiagnosticRequest, "id">;

export interface TypeScriptRequestOptions {
  /**
   * A request that overruns is abandoned and the worker is restarted (a type that never
   * finishes would otherwise block every later request). A restart is not a crash: it does not
   * count towards the crash-loop guard, and the other pending requests are sent again.
   */
  timeoutMs?: number;
  onTimeout?: () => void;
}

export interface TypeScriptClient {
  /** Resolves with null when the worker fails, was shut down or the request timed out. */
  request: (
    message: TypeScriptRequest,
    options?: TypeScriptRequestOptions
  ) => Promise<TypeScriptDiagnosticResponse | null>;
  release: () => void;
}

// Editors remount on every file or task switch; a short grace period keeps the
// already parsed standard library instead of booting a new language service.
const IDLE_SHUTDOWN_MS = 30_000;

// A worker that keeps crashing (broken bundle, out of memory) would otherwise be recreated by
// every keystroke's requests: give up for a while and answer null, so the editor shows
// "analysis unavailable" instead of spinning.
const MAX_CRASHES = 3;
const CRASH_WINDOW_MS = 30_000;
let crashes: number[] = [];

let worker: Worker | null = null;
let users = 0;
let nextId = 0;
let shutdownTimer: ReturnType<typeof setTimeout> | null = null;
interface PendingRequest {
  message: TypeScriptRequest & { id: number };
  resolve: (response: TypeScriptDiagnosticResponse | null) => void;
}
const pending = new Map<number, PendingRequest>();

const resolveAll = (): void => {
  for (const { resolve } of pending.values()) resolve(null);
  pending.clear();
};

const shutdown = (): void => {
  worker?.terminate();
  worker = null;
  resolveAll();
};

const recordCrash = (): void => {
  const now = Date.now();
  crashes = [...crashes.filter((at) => now - at < CRASH_WINDOW_MS), now];
  shutdown();
};

const isCrashLooping = (): boolean =>
  crashes.filter((at) => Date.now() - at < CRASH_WINDOW_MS).length >= MAX_CRASHES;

const getWorker = (): Worker => {
  if (worker) return worker;
  const created = new TypeScriptWorker();
  created.onmessage = ({ data }: MessageEvent<TypeScriptDiagnosticResponse>): void => {
    const request = pending.get(data.id);
    pending.delete(data.id);
    request?.resolve(data);
  };
  created.onerror = recordCrash;
  // A message that cannot be cloned or read is lost: fail that request, not the worker.
  created.onmessageerror = resolveAll;
  worker = created;
  return created;
};

/** Replaces a stuck worker with a fresh one and resends everything that is still waiting. */
const restart = (abandoned: number): void => {
  pending.delete(abandoned);
  worker?.terminate();
  worker = null;
  if (pending.size === 0) return;
  const next = getWorker();
  for (const { message } of pending.values()) next.postMessage(message);
};

/** Shares one TypeScript worker between all mounted editors. */
export const acquireTypeScriptClient = (): TypeScriptClient => {
  users += 1;
  if (shutdownTimer) clearTimeout(shutdownTimer);
  shutdownTimer = null;
  let released = false;
  return {
    request: (message, options = {}) => {
      if (released || isCrashLooping()) return Promise.resolve(null);
      const id = ++nextId;
      return new Promise((resolve) => {
        const timer =
          options.timeoutMs === undefined
            ? undefined
            : setTimeout(() => {
                if (!pending.has(id)) return;
                restart(id);
                options.onTimeout?.();
                resolve(null);
              }, options.timeoutMs);
        const request = { ...message, id };
        pending.set(id, {
          message: request,
          resolve: (response) => {
            clearTimeout(timer);
            resolve(response);
          },
        });
        getWorker().postMessage(request);
      });
    },
    release: () => {
      if (released) return;
      released = true;
      users -= 1;
      if (users === 0) shutdownTimer = setTimeout(shutdown, IDLE_SHUTDOWN_MS);
    },
  };
};
