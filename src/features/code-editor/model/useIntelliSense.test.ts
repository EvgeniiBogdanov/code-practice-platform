import { describe, it, expect, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useIntelliSense } from "./useIntelliSense";
import { CompletionItem, type TypeScriptCompletion } from "@/shared/lib/code-editor";

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

  it("preserves the selected completion when semantic results arrive", async () => {
    let resolveCompletions: (items: TypeScriptCompletion[]) => void = () => {};
    const request = vi.fn(
      () =>
        new Promise<TypeScriptCompletion[]>((resolve) => {
          resolveCompletions = resolve;
        })
    );
    const { result } = renderHook(() => useIntelliSense([], "App.jsx", request));
    const textarea = createTextarea();

    act(() => result.current.openCompletions("console.", 8, textarea));
    act(() => result.current.selectNext());
    const selectedLabel = result.current.items[result.current.selectedIndex]?.label;
    expect(selectedLabel).toBeDefined();

    act(() => result.current.handleCursorMove("console.", 8, textarea));
    expect(result.current.items[result.current.selectedIndex]?.label).toBe(selectedLabel);

    await act(async () => {
      resolveCompletions([
        {
          label: "customMember",
          insertText: "customMember",
          kind: "property",
          replaceStart: 8,
          replaceEnd: 8,
        },
      ]);
    });

    expect(request).toHaveBeenCalledTimes(1);
    expect(result.current.items[result.current.selectedIndex]?.label).toBe(selectedLabel);
  });

  it("selects the best match when semantic results arrive without navigation", async () => {
    let resolveCompletions: (items: TypeScriptCompletion[]) => void = () => {};
    const request = vi.fn(
      () =>
        new Promise<TypeScriptCompletion[]>((resolve) => {
          resolveCompletions = resolve;
        })
    );
    const { result } = renderHook(() => useIntelliSense([], "App.jsx", request));

    act(() => result.current.openCompletions("console.", 8, createTextarea()));
    await act(async () => {
      resolveCompletions([
        { label: "log", insertText: "log", kind: "method", replaceStart: 8, replaceEnd: 8 },
      ]);
    });

    expect(result.current.selectedIndex).toBe(0);
    expect(result.current.items[0]?.label).toBe("log");
  });

  it("calculates popup position with placement and maxHeight on open", () => {
    const { result } = renderHook(() => useIntelliSense([], "solution.js"));
    const textarea = createTextarea();

    act(() => {
      result.current.openCompletions("arr.", 4, textarea, true);
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.popupPosition.placement).toBe("bottom");
    expect(result.current.popupPosition.top).toBeGreaterThan(0);
    expect(result.current.popupPosition.maxHeight).toBeGreaterThan(0);
  });

  it("updates popupPosition when updatePosition is called on scroll", () => {
    const { result } = renderHook(() => useIntelliSense([], "solution.js"));
    const textarea = createTextarea();

    act(() => {
      result.current.openCompletions("arr.", 4, textarea, true);
    });

    const initialTop = result.current.popupPosition.top;

    act(() => {
      Object.defineProperty(textarea, "scrollTop", { value: 10, configurable: true });
      result.current.updatePosition(textarea);
    });

    expect(result.current.isOpen).toBe(true);
    // After scrolling down by 10px, viewport position moves up
    expect(result.current.popupPosition.top).toBe(initialTop - 10);
  });

  it("closes completions when cursor is scrolled out of view", () => {
    const { result } = renderHook(() => useIntelliSense([], "solution.js"));
    const textarea = createTextarea();
    Object.defineProperty(textarea, "clientHeight", { value: 200, configurable: true });

    act(() => {
      result.current.openCompletions("arr.", 4, textarea, true);
    });

    expect(result.current.isOpen).toBe(true);

    act(() => {
      // Scroll far down so the caret line at top ~14 is completely above the viewport
      Object.defineProperty(textarea, "scrollTop", { value: 500, configurable: true });
      result.current.updatePosition(textarea);
    });

    expect(result.current.isOpen).toBe(false);
  });

  it("requests semantic JSX props using the latest text and applies their spans", async () => {
    const code = "const view = <Card na";
    const request = vi.fn().mockResolvedValue([
      {
        label: "name",
        insertText: "name",
        kind: "property",
        replaceStart: code.length - 2,
        replaceEnd: code.length,
      },
    ]);
    const { result } = renderHook(() => useIntelliSense([], "App.tsx", request));

    act(() => result.current.openCompletions(code, code.length, createTextarea()));
    await waitFor(() =>
      expect(result.current.items.some((item) => item.label === "name")).toBe(true)
    );
    expect(request).toHaveBeenCalledWith(code.length, code);
    const completion = result.current.items.find((item) => item.label === "name");
    expect(
      result.current.applySelected(code, code.length, [], "App.tsx", completion)?.newCode
    ).toBe("const view = <Card name");
  });

  it("ignores unrelated TypeScript symbols for an arbitrary word but keeps matching symbols", async () => {
    const request = vi.fn().mockResolvedValue([
      {
        label: "Subscription",
        insertText: "Subscription",
        kind: "class",
        replaceStart: 0,
        replaceEnd: 6,
      },
    ]);
    const { result } = renderHook(() => useIntelliSense([], "App.jsx", request));
    const textarea = createTextarea();

    act(() => result.current.openCompletions("dsfdsf", 6, textarea));
    await waitFor(() => expect(request).toHaveBeenCalledTimes(1));
    await act(async () => {});
    expect(result.current.isOpen).toBe(false);

    act(() => result.current.openCompletions("Sub", 3, textarea));
    await waitFor(() =>
      expect(result.current.items.map((item) => item.label)).toContain("Subscription")
    );
  });

  it("keeps snippet completions while typing their prefix", () => {
    const { result } = renderHook(() => useIntelliSense([], "solution.js"));

    act(() => result.current.openCompletions("clg", 3, createTextarea()));

    expect(result.current.items.some((item) => item.prefix === "clg" && item.snippet)).toBe(true);
  });

  it("shows semantic JSX props before the first attribute letter", async () => {
    const code = "const view = <Card ";
    const request = vi.fn().mockResolvedValue([
      {
        label: "name",
        insertText: "name",
        kind: "property",
        replaceStart: code.length,
        replaceEnd: code.length,
      },
    ]);
    const { result } = renderHook(() => useIntelliSense([], "App.tsx", request));

    act(() => result.current.openCompletions(code, code.length, createTextarea()));

    await waitFor(() => expect(result.current.items.map((item) => item.label)).toContain("name"));
  });

  it("drops words scraped from the document once TypeScript answers with scoped symbols", async () => {
    const code = "// consolidate later\ncons";
    const request = vi
      .fn()
      .mockResolvedValue([
        { label: "console", insertText: "console", kind: "var", replaceStart: 21, replaceEnd: 25 },
      ]);
    const { result } = renderHook(() => useIntelliSense([], "App.tsx", request));

    act(() => result.current.openCompletions(code, code.length, createTextarea()));
    expect(result.current.items.map((item) => item.label)).toContain("consolidate");

    await waitFor(() => expect(result.current.items[0]?.label).toBe("console"));
    expect(result.current.items.map((item) => item.label)).not.toContain("consolidate");
  });

  describe("semantic completions without local ones", () => {
    const completion = (label: string, kind: string, at: number): TypeScriptCompletion => ({
      label,
      insertText: label,
      kind,
      replaceStart: at,
      replaceEnd: at,
    });

    it("offers literal union members right after the opening quote", async () => {
      const code = 'const a: "x" | "y" = "';
      const request = vi.fn().mockResolvedValue([completion("x", "string", code.length)]);
      const { result } = renderHook(() => useIntelliSense([], "App.tsx", request));

      act(() => result.current.openCompletions(code, code.length, createTextarea()));

      await waitFor(() => expect(result.current.items.map((item) => item.label)).toContain("x"));
    });

    it("does not pop up globals after a closing quote", async () => {
      const code = 'const a = "x"';
      const request = vi.fn().mockResolvedValue([completion("Array", "var", code.length)]);
      const { result } = renderHook(() => useIntelliSense([], "App.tsx", request));

      act(() => result.current.openCompletions(code, code.length, createTextarea()));
      await act(async () => {});

      expect(result.current.isOpen).toBe(false);
    });

    it("matches camelCase initials of semantic symbols but not stray substrings", async () => {
      const request = vi
        .fn()
        .mockResolvedValue([
          completion("getElementById", "method", 0),
          completion("Subscription", "class", 0),
        ]);
      const { result } = renderHook(() => useIntelliSense([], "App.tsx", request));

      act(() => result.current.openCompletions("gEBI", 4, createTextarea()));

      await waitFor(() =>
        expect(result.current.items.map((item) => item.label)).toContain("getElementById")
      );
      expect(result.current.items.map((item) => item.label)).not.toContain("Subscription");
    });
  });
});
