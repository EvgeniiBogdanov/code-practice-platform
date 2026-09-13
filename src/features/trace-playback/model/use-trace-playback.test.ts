import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PLAYBACK_SPEED_STORAGE_KEY } from "../config/playback-speeds";
import { playbackReducer, useTracePlayback } from "./use-trace-playback";

describe("trace playback", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }))
    );
  });
  afterEach(() => {
    localStorage.clear();
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
  it("persists selected speed to localStorage and restores it on next hook initialization", () => {
    const { result: firstRun } = renderHook(() => useTracePlayback(5));
    expect(firstRun.current.speed).toBe(1);

    act(() => {
      firstRun.current.setSpeed(1.5);
    });
    expect(firstRun.current.speed).toBe(1.5);
    expect(localStorage.getItem(PLAYBACK_SPEED_STORAGE_KEY)).toBe("1.5");

    const { result: secondRun } = renderHook(() => useTracePlayback(5));
    expect(secondRun.current.speed).toBe(1.5);
  });
  it("falls back to default 1x speed when localStorage contains invalid or unsupported speed", () => {
    localStorage.setItem(PLAYBACK_SPEED_STORAGE_KEY, "99");
    const { result } = renderHook(() => useTracePlayback(5));
    expect(result.current.speed).toBe(1);
  });
  it("syncs speed when storage event is fired from another tab or window", () => {
    const { result } = renderHook(() => useTracePlayback(5));
    expect(result.current.speed).toBe(1);

    act(() => {
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: PLAYBACK_SPEED_STORAGE_KEY,
          newValue: "2",
        })
      );
    });
    expect(result.current.speed).toBe(2);
  });
});
