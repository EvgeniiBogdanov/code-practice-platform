import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { playbackReducer, useTracePlayback } from "./use-trace-playback";

describe("trace playback", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }))
    );
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("starts paused, advances, stops at the end and replays", () => {
    const { result } = renderHook(() => useTracePlayback(3));
    expect(result.current.playing).toBe(false);
    act(() => result.current.toggle());
    act(() => vi.advanceTimersByTime(1900));
    expect(result.current.index).toBe(1);
    act(() => vi.advanceTimersByTime(1900));
    expect(result.current.index).toBe(2);
    expect(result.current.playing).toBe(false);
    act(() => result.current.toggle());
    expect(result.current.index).toBe(0);
    expect(result.current.playing).toBe(true);
  });
  it("cancels a pending tick when seeking, pausing, changing speed or unmounting", () => {
    const { result, unmount } = renderHook(() => useTracePlayback(5));
    act(() => result.current.toggle());
    act(() => result.current.seek(3));
    act(() => vi.advanceTimersByTime(5000));
    expect(result.current.index).toBe(3);
    act(() => {
      result.current.setSpeed(2);
      result.current.toggle();
    });
    act(() => vi.advanceTimersByTime(950));
    expect(result.current.index).toBe(4);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
  it("stops when the document becomes hidden", () => {
    const { result } = renderHook(() => useTracePlayback(5));
    act(() => result.current.toggle());
    const hidden = vi.spyOn(document, "hidden", "get").mockReturnValue(true);
    act(() => document.dispatchEvent(new Event("visibilitychange")));
    expect(result.current.playing).toBe(false);
    hidden.mockRestore();
  });
  it("pauses an inactive tab without losing its position or restarting on return", () => {
    const { result, rerender } = renderHook(({ active }) => useTracePlayback(5, active), {
      initialProps: { active: true },
    });
    act(() => result.current.toggle());
    act(() => vi.advanceTimersByTime(1900));
    rerender({ active: false });
    act(() => vi.advanceTimersByTime(10000));
    expect(result.current.index).toBe(1);
    expect(result.current.playing).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
    rerender({ active: true });
    expect(result.current.index).toBe(1);
    expect(result.current.playing).toBe(false);
  });
  it("clamps invalid seek positions and ignores stale ticks or unsupported speeds", () => {
    const state = { index: 0, playing: false, speed: 1 };
    expect(playbackReducer(state, { type: "seek", index: 999, length: 4 }).index).toBe(3);
    expect(playbackReducer(state, { type: "seek", index: -8, length: 4 }).index).toBe(0);
    expect(playbackReducer(state, { type: "tick", length: 4 })).toEqual(state);
    expect(playbackReducer(state, { type: "speed", speed: 99 })).toEqual(state);
  });
});
