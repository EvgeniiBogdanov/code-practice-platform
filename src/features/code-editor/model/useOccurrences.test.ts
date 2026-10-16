import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { OCCURRENCES_DELAY, useOccurrences } from "./useOccurrences";

const createTextarea = (code: string, caret: number): HTMLTextAreaElement => {
  const textarea = document.createElement("textarea");
  textarea.value = code;
  textarea.setSelectionRange(caret, caret);
  return textarea;
};

describe("useOccurrences", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  const code = "const total = 1;\nlog(total, totals);";

  it("highlights whole-word matches once the caret rests", async () => {
    const textareaRef = { current: createTextarea(code, 8) };
    const { result } = renderHook(() =>
      useOccurrences({ code, cursorOffset: 8, languageId: "css", textareaRef, enabled: true })
    );
    expect(result.current).toEqual([]);
    await act(async () => vi.advanceTimersByTimeAsync(OCCURRENCES_DELAY));
    expect(result.current.map(({ start, end }) => code.slice(start, end))).toEqual([
      "total",
      "total",
    ]);
  });

  it("hides the highlight as soon as the text changes", async () => {
    const textareaRef = { current: createTextarea(code, 8) };
    const { result, rerender } = renderHook(
      ({ text }) =>
        useOccurrences({
          code: text,
          cursorOffset: 8,
          languageId: "css",
          textareaRef,
          enabled: true,
        }),
      { initialProps: { text: code } }
    );
    await act(async () => vi.advanceTimersByTimeAsync(OCCURRENCES_DELAY));
    expect(result.current).toHaveLength(2);
    rerender({ text: `${code} ` });
    expect(result.current).toEqual([]);
  });

  it("asks the language service when it is available", async () => {
    const requestHighlights = vi.fn().mockResolvedValue([{ start: 6, end: 11 }]);
    const textareaRef = { current: createTextarea(code, 8) };
    const { result } = renderHook(() =>
      useOccurrences({
        code,
        cursorOffset: 8,
        languageId: "typescript",
        textareaRef,
        enabled: true,
        requestHighlights,
      })
    );
    await act(async () => vi.advanceTimersByTimeAsync(OCCURRENCES_DELAY));
    expect(requestHighlights).toHaveBeenCalledWith(8);
    expect(result.current).toEqual([{ start: 6, end: 11 }]);
  });

  it("stays off while disabled or with a selection", async () => {
    const selecting = createTextarea(code, 6);
    selecting.setSelectionRange(6, 11);
    const { result, rerender } = renderHook(
      ({ enabled, textarea }) =>
        useOccurrences({
          code,
          cursorOffset: 6,
          languageId: "css",
          textareaRef: { current: textarea },
          enabled,
        }),
      { initialProps: { enabled: false, textarea: createTextarea(code, 6) } }
    );
    await act(async () => vi.advanceTimersByTimeAsync(OCCURRENCES_DELAY));
    expect(result.current).toEqual([]);
    rerender({ enabled: true, textarea: selecting });
    await act(async () => vi.advanceTimersByTimeAsync(OCCURRENCES_DELAY));
    expect(result.current).toEqual([]);
  });
});
