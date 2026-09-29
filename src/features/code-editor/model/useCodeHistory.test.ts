import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { activateCodeHistoryTask, useCodeHistory } from "./useCodeHistory";

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

  it("keeps independent undo and redo stacks for files in the current task", () => {
    activateCodeHistoryTask("javascript:1");
    const firstFile = { taskKey: "javascript:1", documentKey: "candidate:0" };
    const secondFile = { taskKey: "javascript:1", documentKey: "candidate:1" };
    const first = renderHook(() => useCodeHistory("first", firstFile));
    act(() => first.result.current.pushHistory("first!", 6));
    first.unmount();

    const second = renderHook(() => useCodeHistory("second", secondFile));
    expect(second.result.current.canUndo).toBe(false);
    act(() => second.result.current.pushHistory("second!", 7));
    second.unmount();

    const restored = renderHook(() => useCodeHistory("first!", firstFile));
    expect(restored.result.current.canUndo).toBe(true);
    act(() => expect(restored.result.current.undo("first!")?.code).toBe("first"));
    restored.unmount();

    const reopened = renderHook(() => useCodeHistory("first", firstFile));
    expect(reopened.result.current.canRedo).toBe(true);
    act(() => expect(reopened.result.current.redo("first")?.code).toBe("first!"));
    reopened.unmount();
    activateCodeHistoryTask(null);
  });

  it("releases the previous task history when another task opens", () => {
    const scope = { taskKey: "javascript:1", documentKey: "solution:0:0" };
    activateCodeHistoryTask(scope.taskKey);
    const editor = renderHook(() => useCodeHistory("start", scope));
    act(() => editor.result.current.pushHistory("changed", 7));
    editor.unmount();

    activateCodeHistoryTask("javascript:2");
    activateCodeHistoryTask(scope.taskKey);
    const reopened = renderHook(() => useCodeHistory("changed", scope));
    expect(reopened.result.current.canUndo).toBe(false);
    reopened.unmount();
    activateCodeHistoryTask(null);
  });
});
