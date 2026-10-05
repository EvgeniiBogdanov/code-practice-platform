import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import { useSnippetSession } from "./useSnippetSession";

describe("useSnippetSession", () => {
  // "function name(params) {\n  \n}": name 9–13, params 14–20, $0 at 26.
  const code = "function name(params) {\n  \n}";
  const stops = [
    { start: 9, end: 13 },
    { start: 14, end: 20 },
    { start: 26, end: 26 },
  ];

  it("shifts later fields by what was typed in the current one", () => {
    const { result } = renderHook(() => useSnippetSession());
    result.current.start(stops, code);
    const typed = code.replace("name", "sum");
    expect(result.current.jump(1, typed, 12)).toEqual({ start: 13, end: 19 });
    expect(result.current.jump(1, typed, 13)).toEqual({ start: 25, end: 25 });
    expect(result.current.jump(1, typed, 25)).toBeNull();
  });

  it("ends when the caret leaves the current field", () => {
    const { result } = renderHook(() => useSnippetSession());
    result.current.start(stops, code);
    expect(result.current.jump(1, code, 0)).toBeNull();
    expect(result.current.jump(1, code, 10)).toBeNull();
  });
});
