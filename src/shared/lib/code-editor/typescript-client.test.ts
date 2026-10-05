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

vi.mock("./typescript-worker?worker", () => ({ default: FakeWorker }));

const load = async () => (await import("./typescript-client")).acquireTypeScriptClient;

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
});
