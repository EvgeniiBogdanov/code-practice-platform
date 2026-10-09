import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

class FakeWorker {
  static instances: FakeWorker[] = [];
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: (() => void) | null = null;
  onmessageerror: (() => void) | null = null;
  posted: unknown[] = [];
  terminated = false;
  constructor() {
    FakeWorker.instances.push(this);
  }
  postMessage(message: unknown): void {
    this.posted.push(message);
  }
  terminate(): void {
    this.terminated = true;
  }
}

vi.mock("./typescriptWorker?worker", () => ({ default: FakeWorker }));

const load = async () => (await import("./typescriptClient")).acquireTypeScriptClient;

describe("typescript worker client", () => {
  beforeEach(() => {
    vi.resetModules();
    FakeWorker.instances = [];
    vi.useFakeTimers();
  });
  afterEach(() => vi.useRealTimers());

  it("answers a request with the worker response for the same id", async () => {
    const client = (await load())();
    const response = client.request({ kind: "hover", code: "", filepath: "a.ts", files: [] });
    const worker = FakeWorker.instances[0];
    const { id } = worker.posted[0] as { id: number };
    worker.onmessage?.({ data: { id, kind: "hover", hover: null } } as MessageEvent);
    await expect(response).resolves.toMatchObject({ id });
  });

  it("recreates the worker after a crash but stops after repeated ones", async () => {
    const client = (await load())();
    const ask = () => client.request({ kind: "hover", code: "", filepath: "a.ts", files: [] });

    for (let attempt = 0; attempt < 3; attempt++) {
      const pendingResponse = ask();
      FakeWorker.instances.at(-1)?.onerror?.();
      await expect(pendingResponse).resolves.toBeNull();
    }
    expect(FakeWorker.instances).toHaveLength(3);

    // Crash loop: no fourth worker, the request resolves null at once.
    await expect(ask()).resolves.toBeNull();
    expect(FakeWorker.instances).toHaveLength(3);

    // After the window passes the worker may be tried again.
    vi.advanceTimersByTime(31_000);
    void ask();
    expect(FakeWorker.instances).toHaveLength(4);
  });

  it("fails pending requests on an unreadable message without killing the worker", async () => {
    const client = (await load())();
    const response = client.request({ kind: "hover", code: "", filepath: "a.ts", files: [] });
    const worker = FakeWorker.instances[0];
    worker.onmessageerror?.();
    await expect(response).resolves.toBeNull();
    expect(worker.terminated).toBe(false);
  });

  it("abandons an overrunning request, restarts the worker and resends the others", async () => {
    const client = (await load())();
    const onTimeout = vi.fn();
    const slow = client.request(
      { kind: "tests", code: "", filepath: "a.ts", files: [], tests: "" },
      { timeoutMs: 5000, onTimeout }
    );
    const other = client.request({ kind: "hover", code: "", filepath: "a.ts", files: [] });
    const first = FakeWorker.instances[0];

    vi.advanceTimersByTime(5000);
    await expect(slow).resolves.toBeNull();
    expect(onTimeout).toHaveBeenCalledOnce();
    expect(first.terminated).toBe(true);

    // The other request survives on a fresh worker; the timeout is not counted as a crash.
    const second = FakeWorker.instances[1];
    const { id } = second.posted[0] as { id: number };
    second.onmessage?.({ data: { id, kind: "hover", hover: null } } as MessageEvent);
    await expect(other).resolves.toMatchObject({ id });
    expect(FakeWorker.instances).toHaveLength(2);
  });

  it("does not time out a request that was answered in time", async () => {
    const client = (await load())();
    const onTimeout = vi.fn();
    const response = client.request(
      { kind: "tests", code: "", filepath: "a.ts", files: [], tests: "" },
      { timeoutMs: 5000, onTimeout }
    );
    const worker = FakeWorker.instances[0];
    const { id } = worker.posted[0] as { id: number };
    worker.onmessage?.({ data: { id, kind: "tests" } } as MessageEvent);
    await expect(response).resolves.toMatchObject({ id });
    vi.advanceTimersByTime(10_000);
    expect(onTimeout).not.toHaveBeenCalled();
    expect(worker.terminated).toBe(false);
  });
});
