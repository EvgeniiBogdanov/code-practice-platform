import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useIntelliSense } from "./useIntelliSense";
import { CompletionItem } from "@/shared/lib/code-editor";

describe("useIntelliSense", () => {
  const createTextarea = () => {
    const el = document.createElement("textarea");
    Object.defineProperty(el, "clientWidth", { value: 800 });
    return el;
  };

  it("applies explicitly passed item instead of selectedIndex item when clicked", () => {
    const { result } = renderHook(() => useIntelliSense([], "solution.js"));

    act(() => {
      result.current.openCompletions("arr.", 4, createTextarea(), true);
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.selectedIndex).toBe(0);

    const explicitItem: CompletionItem = {
      prefix: "reduce",
      label: "reduce",
      detail: "Array.prototype.reduce()",
      insertText: "reduce()",
      cursorOffset: 7,
      replaceStart: 4,
      replaceEnd: 4,
    };

    let appliedResult: { newCode: string; newCursor: number } | null = null;
    act(() => {
      appliedResult = result.current.applySelected("arr.", 4, [], "solution.js", explicitItem);
    });

    expect(appliedResult).not.toBeNull();
    const res = appliedResult as unknown as { newCode: string; newCursor: number };
    expect(res.newCode).toBe("arr.reduce()");
    expect(res.newCursor).toBe(11); // 4 + 7
    expect(result.current.isOpen).toBe(false);
  });

  it("updates selectedIndex when selectIndex is called on hover", () => {
    const { result } = renderHook(() => useIntelliSense([], "solution.js"));

    act(() => {
      result.current.openCompletions("arr.", 4, createTextarea(), true);
    });

    expect(result.current.selectedIndex).toBe(0);

    act(() => {
      result.current.selectIndex(3);
    });

    expect(result.current.selectedIndex).toBe(3);
  });
});
