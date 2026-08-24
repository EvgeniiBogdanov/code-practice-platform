import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import React from "react";
import { useMultiCursor } from "./useMultiCursor";
import { CodeHistoryState } from "./useCodeHistory";

describe("useMultiCursor", () => {
  const createMockHistory = (): CodeHistoryState => ({
    canUndo: true,
    canRedo: true,
    pushHistory: vi.fn(),
    undo: vi.fn(),
    redo: vi.fn(),
    resetHistory: vi.fn(),
  });

  it("selects word under collapsed cursor on first addNextMatch", () => {
    const { result } = renderHook(() => useMultiCursor());
    const code = "const myVar = 10; const next = myVar;";

    const textarea = document.createElement("textarea");
    textarea.value = code;

    act(() => {
      // Cursor on "myVar" (pos 8)
      result.current.addNextMatch(code, 8, 8, textarea);
    });

    expect(result.current.selections).toEqual([{ start: 6, end: 11 }]);
    expect(result.current.hasMultipleCursors).toBe(false);
  });

  it("adds next match on subsequent addNextMatch calls", () => {
    const { result } = renderHook(() => useMultiCursor());
    const code = "const myVar = 10; const next = myVar;";

    const textarea = document.createElement("textarea");
    textarea.value = code;

    act(() => {
      // First call selects "myVar" at [6..11]
      result.current.addNextMatch(code, 6, 11, textarea);
    });

    act(() => {
      // Second call adds second "myVar" at [31..36]
      result.current.addNextMatch(code, 6, 11, textarea);
    });

    expect(result.current.selections).toEqual([
      { start: 6, end: 11 },
      { start: 31, end: 36 },
    ]);
    expect(result.current.hasMultipleCursors).toBe(true);
  });

  it("selectAllMatches selects all occurrences at once", () => {
    const { result } = renderHook(() => useMultiCursor());
    const code = "val + val + val";

    const textarea = document.createElement("textarea");
    textarea.value = code;

    act(() => {
      result.current.selectAllMatches(code, 0, 3, textarea);
    });

    expect(result.current.selections).toEqual([
      { start: 0, end: 3 },
      { start: 6, end: 9 },
      { start: 12, end: 15 },
    ]);
    expect(result.current.hasMultipleCursors).toBe(true);
  });

  it("handles concurrent typing in multi-cursor mode", () => {
    const { result } = renderHook(() => useMultiCursor());
    const code = "val + val";
    const onChange = vi.fn();
    const history = createMockHistory();

    const textarea = document.createElement("textarea");
    textarea.value = code;

    act(() => {
      result.current.selectAllMatches(code, 0, 3, textarea);
    });

    const preventDefault = vi.fn();
    const event = {
      currentTarget: textarea,
      target: textarea,
      key: "X",
      shiftKey: false,
      ctrlKey: false,
      metaKey: false,
      altKey: false,
      preventDefault,
    } as unknown as React.KeyboardEvent<HTMLTextAreaElement>;

    let handled = false;
    act(() => {
      handled = result.current.handleMultiKeyDown(event, code, onChange, history);
    });

    expect(handled).toBe(true);
    expect(preventDefault).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith("X + X");
    expect(history.pushHistory).toHaveBeenCalledWith("X + X", 5);
  });

  it("handles backspace in multi-cursor mode", () => {
    const { result } = renderHook(() => useMultiCursor());
    const code = "aX + bX";
    const onChange = vi.fn();
    const history = createMockHistory();

    const textarea = document.createElement("textarea");
    textarea.value = code;

    // Set 2 collapsed cursors right after "X"
    act(() => {
      result.current.setSelections([
        { start: 2, end: 2 },
        { start: 7, end: 7 },
      ]);
    });

    const preventDefault = vi.fn();
    const event = {
      currentTarget: textarea,
      target: textarea,
      key: "Backspace",
      shiftKey: false,
      ctrlKey: false,
      metaKey: false,
      altKey: false,
      preventDefault,
    } as unknown as React.KeyboardEvent<HTMLTextAreaElement>;

    let handled = false;
    act(() => {
      handled = result.current.handleMultiKeyDown(event, code, onChange, history);
    });

    expect(handled).toBe(true);
    expect(preventDefault).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith("a + b");
  });

  it("clears selections on Escape", () => {
    const { result } = renderHook(() => useMultiCursor());
    const code = "val + val";
    const onChange = vi.fn();
    const history = createMockHistory();

    const textarea = document.createElement("textarea");
    textarea.value = code;

    act(() => {
      result.current.selectAllMatches(code, 0, 3, textarea);
    });

    expect(result.current.hasMultipleCursors).toBe(true);

    const event = {
      currentTarget: textarea,
      target: textarea,
      key: "Escape",
      shiftKey: false,
      ctrlKey: false,
      metaKey: false,
      altKey: false,
      preventDefault: vi.fn(),
    } as unknown as React.KeyboardEvent<HTMLTextAreaElement>;

    act(() => {
      result.current.handleMultiKeyDown(event, code, onChange, history);
    });

    expect(result.current.selections).toEqual([]);
    expect(result.current.hasMultipleCursors).toBe(false);
  });
});
