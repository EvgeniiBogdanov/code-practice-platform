/** Network mocks for drill tests: a controllable `fetch` and `WebSocket`. */

export interface MockResponseInit {
  status?: number;
  headers?: Record<string, string>;
}

/** One `fetch` call; stays pending until the test (or the auto-responder) settles it. */
export interface FetchCall {
  url: string;
  init: RequestInit | undefined;
  /** The request signal fired before the call was settled. */
  aborted: boolean;
  /** Settles with a `Response`; a non-string body is sent as JSON. */
  resolve: (body?: unknown, init?: MockResponseInit) => void;
  reject: (reason?: unknown) => void;
}

export interface FetchMock {
  fetch: typeof fetch;
  calls: FetchCall[];
  /** Answers every call automatically; a throw or rejection becomes a failed request. */
  respondWith: (handler: (call: FetchCall) => unknown) => void;
  reset: () => void;
}

const createAbortError = (): Error => {
  const reason =
    typeof DOMException === "function" ? new DOMException("Aborted", "AbortError") : null;
  if (reason) return reason;
  const fallback = new Error("Aborted");
  fallback.name = "AbortError";
  return fallback;
};

const toRequestUrl = (input: RequestInfo | URL): string =>
  typeof input === "string" ? input : input instanceof URL ? input.href : input.url;

const toResponse = (body: unknown, init: MockResponseInit = {}): Response => {
  const isText = typeof body === "string";
  return new Response(isText ? body : JSON.stringify(body ?? null), {
    status: init.status ?? 200,
    headers: { "content-type": isText ? "text/plain" : "application/json", ...init.headers },
  });
};

export const createFetchMock = (): FetchMock => {
  const calls: FetchCall[] = [];
  let autoRespond: ((call: FetchCall) => unknown) | null = null;

  const mockFetch = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> =>
    new Promise<Response>((resolve, reject) => {
      const signal = init?.signal ?? null;
      let isSettled = false;
      const call: FetchCall = {
        url: toRequestUrl(input),
        init,
        aborted: false,
        resolve: (body, responseInit) => {
          if (isSettled) return;
          isSettled = true;
          resolve(toResponse(body, responseInit));
        },
        reject: (reason) => {
          if (isSettled) return;
          isSettled = true;
          reject(reason);
        },
      };
      calls.push(call);

      const abort = (): void => {
        call.aborted = true;
        call.reject(signal?.reason ?? createAbortError());
      };
      if (signal?.aborted) {
        abort();
        return;
      }
      signal?.addEventListener("abort", abort, { once: true });

      if (autoRespond) {
        Promise.resolve()
          .then(() => autoRespond?.(call))
          .then((body) => call.resolve(body), call.reject);
      }
    });

  return {
    fetch: mockFetch,
    calls,
    respondWith: (handler) => {
      autoRespond = handler;
    },
    reset: () => {
      calls.length = 0;
      autoRespond = null;
    },
  };
};

type SocketListener = (event: unknown) => void;
type SocketEventType = "open" | "message" | "close" | "error";

export interface MockSocket {
  readonly url: string;
  readyState: number;
  /** Everything passed to `send`, in order. */
  readonly sent: unknown[];
  /** Server side: the connection is established. */
  simulateOpen: () => void;
  /** Server side: a message arrives. */
  simulateMessage: (data: unknown) => void;
  /** Server side: the connection drops. */
  simulateClose: (code?: number) => void;
  simulateError: () => void;
}

export interface WebSocketMock {
  /** Pass it to the solution as `WebSocket`. */
  WebSocket: new (url: string | URL) => MockSocket;
  /** Every socket the solution has created, in order. */
  instances: MockSocket[];
  reset: () => void;
}

export const createWebSocketMock = (): WebSocketMock => {
  const instances: MockSocket[] = [];

  class MockWebSocket implements MockSocket {
    static readonly CONNECTING = 0;
    static readonly OPEN = 1;
    static readonly CLOSING = 2;
    static readonly CLOSED = 3;
    readonly CONNECTING = 0;
    readonly OPEN = 1;
    readonly CLOSING = 2;
    readonly CLOSED = 3;

    readonly url: string;
    readyState = 0;
    readonly sent: unknown[] = [];
    onopen: SocketListener | null = null;
    onmessage: SocketListener | null = null;
    onclose: SocketListener | null = null;
    onerror: SocketListener | null = null;
    private readonly listeners = new Map<SocketEventType, Set<SocketListener>>();

    constructor(url: string | URL) {
      this.url = String(url);
      instances.push(this);
    }

    addEventListener(type: SocketEventType, listener: SocketListener): void {
      const set = this.listeners.get(type) ?? new Set<SocketListener>();
      set.add(listener);
      this.listeners.set(type, set);
    }

    removeEventListener(type: SocketEventType, listener: SocketListener): void {
      this.listeners.get(type)?.delete(listener);
    }

    send(data: unknown): void {
      if (this.readyState !== MockWebSocket.OPEN) {
        throw new Error("WebSocket не открыт: send вызван до события open.");
      }
      this.sent.push(data);
    }

    close(code = 1000): void {
      if (this.readyState === MockWebSocket.CLOSED) return;
      this.simulateClose(code);
    }

    simulateOpen(): void {
      this.readyState = MockWebSocket.OPEN;
      this.emit("open", { type: "open" });
    }

    simulateMessage(data: unknown): void {
      this.emit("message", { type: "message", data });
    }

    simulateClose(code = 1006): void {
      this.readyState = MockWebSocket.CLOSED;
      this.emit("close", { type: "close", code, wasClean: code === 1000 });
    }

    simulateError(): void {
      this.emit("error", { type: "error" });
    }

    private emit(type: SocketEventType, event: unknown): void {
      const handler = {
        open: this.onopen,
        message: this.onmessage,
        close: this.onclose,
        error: this.onerror,
      }[type];
      handler?.call(this, event);
      this.listeners.get(type)?.forEach((listener) => listener.call(this, event));
    }
  }

  return {
    WebSocket: MockWebSocket,
    instances,
    reset: () => {
      instances.length = 0;
    },
  };
};
