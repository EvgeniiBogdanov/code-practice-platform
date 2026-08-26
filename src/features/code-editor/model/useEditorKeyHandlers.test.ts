import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import React from "react";
import { useEditorKeyHandlers } from "./useEditorKeyHandlers";
import { IntelliSenseState } from "./useIntelliSense";
import { CodeHistoryState } from "./useCodeHistory";
import { MultiCursorState } from "./useMultiCursor";

describe("useEditorKeyHandlers", () => {
  const createMockIntelliSense = (isOpen = false): IntelliSenseState => ({
    isOpen,
    items: [],
    selectedIndex: 0,
    word: "",
    popupPosition: { top: 0, left: 0 },
    openCompletions: vi.fn(),
    selectNext: vi.fn(),
    selectPrev: vi.fn(),
    selectIndex: vi.fn(),
    applySelected: vi.fn(),
    closeCompletions: vi.fn(),
    handleCursorMove: vi.fn(),
  });

  const createMockHistory = (): CodeHistoryState => ({
    canUndo: true,
    canRedo: true,
    pushHistory: vi.fn(),
    undo: vi.fn(),
    redo: vi.fn(),
    resetHistory: vi.fn(),
  });

  const createMockMultiCursor = (hasMultiple = false): MultiCursorState => ({
    selections: hasMultiple
      ? [
          { start: 0, end: 3 },
          { start: 6, end: 9 },
        ]
      : [],
    hasMultipleCursors: hasMultiple,
    addNextMatch: vi.fn(),
    selectAllMatches: vi.fn(),
    undoLastSelection: vi.fn(),
    clearSelections: vi.fn(),
    setSelections: vi.fn(),
    handleMultiKeyDown: vi.fn().mockReturnValue(true),
    handleMultiPaste: vi.fn().mockReturnValue(true),
  });

  it("handles Alt+ArrowDown to move line down", () => {
    const code = "first\nsecond\nthird";
    const onChange = vi.fn();
    const history = createMockHistory();
    const intelliSense = createMockIntelliSense();

    const { result } = renderHook(() =>
      useEditorKeyHandlers({
        code,
        onChange,
        intelliSense,
        history,
      })
    );

    const textarea = document.createElement("textarea");
    textarea.value = code;
    textarea.selectionStart = 2; // on "first"
    textarea.selectionEnd = 2;

    const preventDefault = vi.fn();
    const stopPropagation = vi.fn();

    const event = {
      currentTarget: textarea,
      target: textarea,
      altKey: true,
      key: "ArrowDown",
      shiftKey: false,
      ctrlKey: false,
      metaKey: false,
      preventDefault,
      stopPropagation,
    } as unknown as React.KeyboardEvent<HTMLTextAreaElement>;

    result.current.handleKeyDown(event);

    expect(preventDefault).toHaveBeenCalled();
    expect(stopPropagation).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith("second\nfirst\nthird");
    expect(history.pushHistory).toHaveBeenCalledWith("second\nfirst\nthird", 9);
  });

  it("handles Alt+ArrowUp to move line up", () => {
    const code = "first\nsecond\nthird";
    const onChange = vi.fn();
    const history = createMockHistory();
    const intelliSense = createMockIntelliSense();

    const { result } = renderHook(() =>
      useEditorKeyHandlers({
        code,
        onChange,
        intelliSense,
        history,
      })
    );

    const textarea = document.createElement("textarea");
    textarea.value = code;
    textarea.selectionStart = 8; // on "second" (offset 6 + 2 = 8)
    textarea.selectionEnd = 8;

    const preventDefault = vi.fn();
    const stopPropagation = vi.fn();

    const event = {
      currentTarget: textarea,
      target: textarea,
      altKey: true,
      key: "ArrowUp",
      shiftKey: false,
      ctrlKey: false,
      metaKey: false,
      preventDefault,
      stopPropagation,
    } as unknown as React.KeyboardEvent<HTMLTextAreaElement>;

    result.current.handleKeyDown(event);

    expect(preventDefault).toHaveBeenCalled();
    expect(stopPropagation).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith("second\nfirst\nthird");
    expect(history.pushHistory).toHaveBeenCalledWith("second\nfirst\nthird", 2);
  });

  it("handles Cmd+D (or Ctrl+D) to add next match and prevents browser bookmarking", () => {
    const code = "foo + foo";
    const onChange = vi.fn();
    const history = createMockHistory();
    const intelliSense = createMockIntelliSense();
    const multiCursor = createMockMultiCursor();

    const { result } = renderHook(() =>
      useEditorKeyHandlers({
        code,
        onChange,
        intelliSense,
        history,
        multiCursor,
      })
    );

    const textarea = document.createElement("textarea");
    textarea.value = code;
    textarea.selectionStart = 0;
    textarea.selectionEnd = 3;

    const preventDefault = vi.fn();
    const stopPropagation = vi.fn();

    const event = {
      currentTarget: textarea,
      target: textarea,
      metaKey: true,
      key: "d",
      shiftKey: false,
      ctrlKey: false,
      altKey: false,
      preventDefault,
      stopPropagation,
    } as unknown as React.KeyboardEvent<HTMLTextAreaElement>;

    result.current.handleKeyDown(event);

    expect(preventDefault).toHaveBeenCalled();
    expect(stopPropagation).toHaveBeenCalled();
    expect(multiCursor.addNextMatch).toHaveBeenCalledWith(code, 0, 3, textarea);
  });

  it("handles Cmd+Shift+L to select all matches", () => {
    const code = "foo + foo";
    const onChange = vi.fn();
    const history = createMockHistory();
    const intelliSense = createMockIntelliSense();
    const multiCursor = createMockMultiCursor();

    const { result } = renderHook(() =>
      useEditorKeyHandlers({
        code,
        onChange,
        intelliSense,
        history,
        multiCursor,
      })
    );

    const textarea = document.createElement("textarea");
    textarea.value = code;
    textarea.selectionStart = 0;
    textarea.selectionEnd = 3;

    const preventDefault = vi.fn();
    const stopPropagation = vi.fn();

    const event = {
      currentTarget: textarea,
      target: textarea,
      metaKey: true,
      shiftKey: true,
      key: "l",
      ctrlKey: false,
      altKey: false,
      preventDefault,
      stopPropagation,
    } as unknown as React.KeyboardEvent<HTMLTextAreaElement>;

    result.current.handleKeyDown(event);

    expect(preventDefault).toHaveBeenCalled();
    expect(stopPropagation).toHaveBeenCalled();
    expect(multiCursor.selectAllMatches).toHaveBeenCalledWith(code, 0, 3, textarea);
  });

  it("delegates to handleMultiKeyDown when hasMultipleCursors is true", () => {
    const code = "foo + foo";
    const onChange = vi.fn();
    const history = createMockHistory();
    const intelliSense = createMockIntelliSense();
    const multiCursor = createMockMultiCursor(true);

    const { result } = renderHook(() =>
      useEditorKeyHandlers({
        code,
        onChange,
        intelliSense,
        history,
        multiCursor,
      })
    );

    const textarea = document.createElement("textarea");
    textarea.value = code;

    const event = {
      currentTarget: textarea,
      target: textarea,
      key: "a",
      shiftKey: false,
      ctrlKey: false,
      metaKey: false,
      altKey: false,
      preventDefault: vi.fn(),
    } as unknown as React.KeyboardEvent<HTMLTextAreaElement>;

    result.current.handleKeyDown(event);

    expect(multiCursor.handleMultiKeyDown).toHaveBeenCalledWith(event, code, onChange, history);
  });

  it("closes open IntelliSense when moving lines with Alt+Arrow", () => {
    const code = "first\nsecond";
    const onChange = vi.fn();
    const history = createMockHistory();
    const intelliSense = createMockIntelliSense(true);

    const { result } = renderHook(() =>
      useEditorKeyHandlers({
        code,
        onChange,
        intelliSense,
        history,
      })
    );

    const textarea = document.createElement("textarea");
    textarea.value = code;
    textarea.selectionStart = 1;
    textarea.selectionEnd = 1;

    const event = {
      currentTarget: textarea,
      target: textarea,
      altKey: true,
      key: "ArrowDown",
      shiftKey: false,
      ctrlKey: false,
      metaKey: false,
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as unknown as React.KeyboardEvent<HTMLTextAreaElement>;

    result.current.handleKeyDown(event);

    expect(intelliSense.closeCompletions).toHaveBeenCalled();
  });

  it("does not mutate code if readOnly is true", () => {
    const code = "first\nsecond";
    const onChange = vi.fn();
    const history = createMockHistory();
    const intelliSense = createMockIntelliSense();

    const { result } = renderHook(() =>
      useEditorKeyHandlers({
        code,
        onChange,
        intelliSense,
        history,
        readOnly: true,
      })
    );

    const textarea = document.createElement("textarea");
    textarea.value = code;
    textarea.selectionStart = 1;
    textarea.selectionEnd = 1;

    const event = {
      currentTarget: textarea,
      target: textarea,
      altKey: true,
      key: "ArrowDown",
      shiftKey: false,
      ctrlKey: false,
      metaKey: false,
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as unknown as React.KeyboardEvent<HTMLTextAreaElement>;

    result.current.handleKeyDown(event);

    expect(onChange).not.toHaveBeenCalled();
  });
});
