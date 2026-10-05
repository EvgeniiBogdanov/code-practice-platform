import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { measureLineHeights } from "../lib/caretCoordinates";
import { useWrappedLineHeights } from "./useWrappedLineHeights";

vi.mock("../lib/caretCoordinates", () => ({ measureLineHeights: vi.fn() }));

describe("useWrappedLineHeights", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("keeps the same array while the measured heights do not change", () => {
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe = vi.fn();
        disconnect = vi.fn();
      }
    );
    const measure = vi.mocked(measureLineHeights);
    measure.mockImplementation(() => [21, 21]);
    const textarea = document.createElement("textarea");
    Object.defineProperty(textarea, "clientWidth", { value: 600 });
    const ref = { current: textarea };
    const { result, rerender } = renderHook(({ key }) => useWrappedLineHeights(ref, true, key), {
      initialProps: { key: "a" },
    });
    const first = result.current;
    expect(first).toEqual([21, 21]);

    rerender({ key: "b" });
    expect(measure).toHaveBeenCalledTimes(2);
    expect(result.current).toBe(first);

    measure.mockImplementation(() => [21, 42]);
    rerender({ key: "c" });
    expect(result.current).toEqual([21, 42]);
  });

  it("skips measuring a hidden editor that has no width", () => {
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe = vi.fn();
        disconnect = vi.fn();
      }
    );
    const measure = vi.mocked(measureLineHeights);
    measure.mockClear();
    const ref = { current: document.createElement("textarea") };
    const { result } = renderHook(() => useWrappedLineHeights(ref, true, "a"));
    expect(measure).not.toHaveBeenCalled();
    expect(result.current).toBeNull();
  });

  it("is null while word wrap is off", () => {
    const ref = { current: document.createElement("textarea") };
    const { result } = renderHook(() => useWrappedLineHeights(ref, false, "a"));
    expect(result.current).toBeNull();
  });
});
