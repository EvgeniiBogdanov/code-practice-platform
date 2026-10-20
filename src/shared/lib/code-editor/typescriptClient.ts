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
  TypeScriptTextSpan,
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
  /** False while it waits for an earlier request of the same kind (see LATEST_ONLY). */
  sent: boolean;
  resolve: (response: TypeScriptDiagnosticResponse | null) => void;
}
const pending = new Map<number, PendingRequest>();

/**
 * Asked again on every keystroke or caret move, where only the answer for the latest text
 * matters. The worker answers in order, so each stale request would delay the current one:
 * one request per kind is in the worker, the newest waits, and older waiting ones get null.
 */
const LATEST_ONLY: ReadonlySet<TypeScriptRequest["kind"]> = new Set([
  "completions",
  "signature",
  "hover",
  "highlights",
  "diagnostics",
]);

const resolveAll = (): void => {
  const failed = [...pending.values()];
  pending.clear();
  for (const { resolve } of failed) resolve(null);
};

const settle = (id: number | undefined, response: TypeScriptDiagnosticResponse | null): void => {
  if (id === undefined) return;
  const request = pending.get(id);
  pending.delete(id);
  request?.resolve(response);
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
    settle(data.id, data);
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
  for (const { message, sent } of pending.values()) if (sent) next.postMessage(message);
};

/** Shares one TypeScript worker between all mounted editors. */
export const acquireTypeScriptClient = (): TypeScriptClient => {
  users += 1;
  if (shutdownTimer) clearTimeout(shutdownTimer);
  shutdownTimer = null;
  let released = false;
  // Per editor: two editors asking for completions must not drop each other's answers.
  const slots = new Map<TypeScriptRequest["kind"], { sentId?: number; waitingId?: number }>();

  const send = (entry: PendingRequest): void => {
    entry.sent = true;
    getWorker().postMessage(entry.message);
  };

  /** Sends the request of this kind that waited for the one just answered. */
  const sendWaiting = (kind: TypeScriptRequest["kind"]): void => {
    const slot = slots.get(kind);
    const waiting = slot?.waitingId === undefined ? undefined : pending.get(slot.waitingId);
    if (!slot || !waiting) return;
    slot.sentId = slot.waitingId;
    slot.waitingId = undefined;
    send(waiting);
  };

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
        const latestOnly = LATEST_ONLY.has(message.kind);
        const entry: PendingRequest = {
          message: { ...message, id },
          sent: false,
          resolve: (response) => {
            clearTimeout(timer);
            resolve(response);
            if (latestOnly && response) sendWaiting(message.kind);
          },
        };
        pending.set(id, entry);
        if (!latestOnly) {
          send(entry);
          return;
        }
        const slot = slots.get(message.kind) ?? {};
        slots.set(message.kind, slot);
        settle(slot.waitingId, null);
        // A crash or restart may have dropped the sent one without an answer.
        if (slot.sentId !== undefined && pending.has(slot.sentId)) {
          slot.waitingId = id;
          return;
        }
        slot.sentId = id;
        slot.waitingId = undefined;
        send(entry);
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
