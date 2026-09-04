import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "./useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("hello", 300));
    expect(result.current).toBe("hello");
  });

  it("should update debounced value only after delay has passed", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "hello", delay: 300 },
      }
    );

    expect(result.current).toBe("hello");

    rerender({ value: "hello world", delay: 300 });

    // Value should not update immediately
    expect(result.current).toBe("hello");

    // Fast-forward time halfway
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(result.current).toBe("hello");

    // Fast-forward remaining time
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(result.current).toBe("hello world");
  });

  it("should cancel previous timer when value changes rapidly", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "a", delay: 300 },
      }
    );

    act(() => {
      vi.advanceTimersByTime(100);
    });
    rerender({ value: "ab", delay: 300 });

    act(() => {
      vi.advanceTimersByTime(100);
    });
    rerender({ value: "abc", delay: 300 });

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe("a");

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe("abc");
  });
});
