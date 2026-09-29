import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useCodeHistory } from "./useCodeHistory";

describe("useCodeHistory", () => {
  afterEach(() => vi.useRealTimers());

  it("groups a typed word and keeps punctuation as a separate undo step", () => {
    const { result } = renderHook(() => useCodeHistory(""));

    act(() => {
      result.current.pushHistory("h", 1, { inputType: "insertText", data: "h" });
      result.current.pushHistory("he", 2, { inputType: "insertText", data: "e" });
      result.current.pushHistory("hel", 3, { inputType: "insertText", data: "l" });
      result.current.pushHistory("hel.", 4, { inputType: "insertText", data: "." });
    });

    expect(result.current.canUndo).toBe(true);
    act(() => expect(result.current.undo("hel.")?.code).toBe("hel"));
    act(() => expect(result.current.undo("hel")?.code).toBe(""));
    expect(result.current.canUndo).toBe(false);
    act(() => expect(result.current.redo("")?.code).toBe("hel"));
    act(() => expect(result.current.redo("hel")?.code).toBe("hel."));
    expect(result.current.canRedo).toBe(false);
  });

  it("starts a new undo step after a pause and discards redo after a new edit", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useCodeHistory(""));

    act(() => result.current.pushHistory("a", 1, { inputType: "insertText", data: "a" }));
    vi.advanceTimersByTime(1100);
    act(() => result.current.pushHistory("ab", 2, { inputType: "insertText", data: "b" }));
    act(() => expect(result.current.undo("ab")?.code).toBe("a"));
    expect(result.current.canRedo).toBe(true);
    act(() => result.current.pushHistory("ax", 2, { inputType: "insertText", data: "x" }));
    expect(result.current.canRedo).toBe(false);
    act(() => expect(result.current.undo("ax")?.code).toBe("a"));
  });

  it("groups contiguous backspaces and resets when the parent replaces the document", () => {
    const { result, rerender } = renderHook(({ code }) => useCodeHistory(code), {
      initialProps: { code: "hello" },
    });

    act(() => {
      result.current.pushHistory("hell", 4, { inputType: "deleteContentBackward", data: null });
      result.current.pushHistory("hel", 3, { inputType: "deleteContentBackward", data: null });
    });
    act(() => expect(result.current.undo("hel")?.code).toBe("hello"));
    rerender({ code: "different file" });
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
    act(() => expect(result.current.undo("different file")).toBeNull());
  });

  it("restores the cursor before an edit and handles consecutive undo calls", () => {
    const { result } = renderHook(() => useCodeHistory("prefix"));
    act(() => {
      result.current.captureCursor(6);
      result.current.pushHistory("prefixa", 7);
      result.current.pushHistory("prefixab", 8);
    });

    act(() => {
      expect(result.current.undo("prefixab")).toEqual({ code: "prefixa", cursor: 7 });
      expect(result.current.undo("prefixa")).toEqual({ code: "prefix", cursor: 6 });
    });
    expect(result.current.canUndo).toBe(false);
  });
});
