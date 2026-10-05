import TypeScriptWorker from "./typescript-worker?worker";
import type { TypeScriptDiagnosticRequest, TypeScriptDiagnosticResponse } from "./typescript-types";

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
} from "./typescript-types";

export type TypeScriptRequest = Omit<TypeScriptDiagnosticRequest, "id">;

export interface TypeScriptClient {
  /** Resolves with null when the worker fails or was shut down. */
  request: (message: TypeScriptRequest) => Promise<TypeScriptDiagnosticResponse | null>;
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
const pending = new Map<number, (response: TypeScriptDiagnosticResponse | null) => void>();

const shutdown = (): void => {
  worker?.terminate();
  worker = null;
  for (const resolve of pending.values()) resolve(null);
  pending.clear();
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
    const resolve = pending.get(data.id);
    pending.delete(data.id);
    resolve?.(data);
  };
  created.onerror = recordCrash;
  // A message that cannot be cloned or read is lost: fail that request, not the worker.
  created.onmessageerror = (): void => {
    for (const resolve of pending.values()) resolve(null);
    pending.clear();
  };
  worker = created;
  return created;
};

/** Shares one TypeScript worker between all mounted editors. */
export const acquireTypeScriptClient = (): TypeScriptClient => {
  users += 1;
  if (shutdownTimer) clearTimeout(shutdownTimer);
  shutdownTimer = null;
  let released = false;
  return {
    request: (message) => {
      if (released || isCrashLooping()) return Promise.resolve(null);
      const id = ++nextId;
      return new Promise((resolve) => {
        pending.set(id, resolve);
        getWorker().postMessage({ ...message, id });
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
