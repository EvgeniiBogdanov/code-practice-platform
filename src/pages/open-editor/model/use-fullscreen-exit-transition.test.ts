import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useFullscreenExitTransition } from "./use-fullscreen-exit-transition";

describe("useFullscreenExitTransition", () => {
  it("tracks the navigation action and ignores repeated exit requests", async () => {
    let resolveExit: (() => void) | undefined;
    const onExit = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveExit = resolve;
        })
    );
    const { result } = renderHook(() => useFullscreenExitTransition());

    act(() => {
      result.current.startFullscreenExit(onExit);
      result.current.startFullscreenExit(onExit);
    });

    expect(result.current.isFullscreenExiting).toBe(true);
    expect(onExit).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolveExit?.();
    });

    expect(result.current.isFullscreenExiting).toBe(false);
  });
});
