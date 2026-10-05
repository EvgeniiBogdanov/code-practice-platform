import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { acquireTypeScriptClient } from "@/shared/lib/code-editor";
import { useTypeScriptDiagnostics } from "./use-typescript-diagnostics";

vi.mock("@/shared/lib/code-editor", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/shared/lib/code-editor")>()),
  acquireTypeScriptClient: vi.fn(),
}));

describe("useTypeScriptDiagnostics", () => {
  const request = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal("Worker", class {});
    request.mockReset().mockResolvedValue({ problems: [] });
    vi.mocked(acquireTypeScriptClient).mockReturnValue({ request, release: vi.fn() });
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  const run = async (ms: number): Promise<void> => {
    await act(async () => {
      await vi.advanceTimersByTimeAsync(ms);
    });
  };

  it("checks again only when the code, file or other files change", async () => {
    const { rerender } = renderHook(
      ({ code, files }) => useTypeScriptDiagnostics({ code, filepath: "a.ts", files }, true),
      { initialProps: { code: "let a = 1;", files: [{ name: "b.ts", code: "x" }] } }
    );
    await run(300);
    expect(request).toHaveBeenCalledTimes(1);

    // New array objects with the same content do not trigger a recheck.
    rerender({ code: "let a = 1;", files: [{ name: "b.ts", code: "x" }] });
    await run(300);
    expect(request).toHaveBeenCalledTimes(1);

    rerender({ code: "let a = 2;", files: [{ name: "b.ts", code: "x" }] });
    await run(300);
    expect(request).toHaveBeenCalledTimes(2);
    expect(request.mock.calls[1][0]).toMatchObject({ kind: "diagnostics", code: "let a = 2;" });

    rerender({ code: "let a = 2;", files: [{ name: "b.ts", code: "y" }] });
    await run(300);
    expect(request).toHaveBeenCalledTimes(3);
  });

  it("sends only the latest text after a burst of edits", async () => {
    const { rerender } = renderHook(
      ({ code }) => useTypeScriptDiagnostics({ code, filepath: "a.ts", files: [] }, true),
      { initialProps: { code: "a" } }
    );
    rerender({ code: "ab" });
    rerender({ code: "abc" });
    await run(300);
    expect(request).toHaveBeenCalledTimes(1);
    expect(request.mock.calls[0][0]).toMatchObject({ code: "abc" });
  });
});
