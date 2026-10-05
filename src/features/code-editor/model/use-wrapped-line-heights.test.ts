import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { measureLineHeights } from "../lib/caret-coordinates";
import { useWrappedLineHeights } from "./use-wrapped-line-heights";

vi.mock("../lib/caret-coordinates", () => ({ measureLineHeights: vi.fn() }));

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

  it("is null while word wrap is off", () => {
    const ref = { current: document.createElement("textarea") };
    const { result } = renderHook(() => useWrappedLineHeights(ref, false, "a"));
    expect(result.current).toBeNull();
  });
});
