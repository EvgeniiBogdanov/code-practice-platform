import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCheatSheetData } from "./useCheatSheetData";
import { useUIStore } from "@/entities/ui-state";

let mockPathname = "/react";

vi.mock("@tanstack/react-router", () => ({
  useLocation: () => ({
    pathname: mockPathname,
  }),
}));

describe("useCheatSheetData", () => {
  beforeEach(() => {
    mockPathname = "/react";
    useUIStore.setState({ cheatSheetOpen: true, cheatSearch: "" });
  });

  it("should initialize with 'react' section and default 'hooks' category when on /react", () => {
    mockPathname = "/react/1_FetchPersons";
    const { result } = renderHook(() => useCheatSheetData(""));

    expect(result.current.activeSection).toBe("react");
    expect(result.current.activeCategory).toBe("hooks");
    expect(result.current.currentSectionConfig.title).toContain("React");
    expect(result.current.filteredData.length).toBeGreaterThan(0);
  });

  it("should initialize with 'javascript' section and 'js_async' category when on /javascript", () => {
    mockPathname = "/javascript/js1";
    const { result } = renderHook(() => useCheatSheetData(""));

    expect(result.current.activeSection).toBe("javascript");
    expect(result.current.activeCategory).toBe("js_async");
    expect(result.current.currentSectionConfig.title).toContain("JavaScript");
  });

  it("should initialize with 'algorithms' section and 'algo_hashmap' category when on /algorithms", () => {
    mockPathname = "/algorithms/algo1";
    const { result } = renderHook(() => useCheatSheetData(""));

    expect(result.current.activeSection).toBe("algorithms");
    expect(result.current.activeCategory).toBe("algo_hashmap");
    expect(result.current.currentSectionConfig.title).toContain("Алгоритмам");
  });

  it("should initialize with 'home' section when on / or /home", () => {
    mockPathname = "/home";
    const { result } = renderHook(() => useCheatSheetData(""));

    expect(result.current.activeSection).toBe("home");
    expect(result.current.currentSectionConfig.title).toContain("Общая");
  });

  it("should switch section and default category via handleSelectSection", () => {
    const { result } = renderHook(() => useCheatSheetData(""));

    act(() => {
      result.current.handleSelectSection("algorithms");
    });

    expect(result.current.activeSection).toBe("algorithms");
    expect(result.current.activeCategory).toBe("algo_hashmap");
  });

  it("should switch active category via setActiveCategory", () => {
    const { result } = renderHook(() => useCheatSheetData(""));

    act(() => {
      result.current.setActiveCategory("ts");
    });

    expect(result.current.activeCategory).toBe("ts");
  });

  it("should filter data based on search query", () => {
    const { result } = renderHook(({ query }) => useCheatSheetData(query), {
      initialProps: { query: "useState" },
    });

    expect(result.current.filteredData.length).toBeGreaterThan(0);
    expect(
      result.current.filteredData.every(
        (item) =>
          item.title.toLowerCase().includes("usestate") ||
          item.code.toLowerCase().includes("usestate") ||
          item.desc?.toLowerCase().includes("usestate") ||
          item.tip?.toLowerCase().includes("usestate")
      )
    ).toBe(true);
  });

  it("should re-sync active section to current route when cheatSheetOpen becomes true", () => {
    useUIStore.setState({ cheatSheetOpen: false });
    mockPathname = "/javascript/js10";

    const { result, rerender } = renderHook(() => useCheatSheetData(""));

    expect(result.current.activeSection).toBe("javascript");
    expect(result.current.activeCategory).toBe("js_async");

    // User switches to react tab while modal is open
    act(() => {
      result.current.handleSelectSection("react");
    });
    expect(result.current.activeSection).toBe("react");

    // Modal closes
    act(() => {
      useUIStore.setState({ cheatSheetOpen: false });
    });

    // User navigates to /algorithms
    mockPathname = "/algorithms/algo5";
    rerender();

    // Modal opens again
    act(() => {
      useUIStore.setState({ cheatSheetOpen: true });
    });
    rerender();

    expect(result.current.activeSection).toBe("algorithms");
    expect(result.current.activeCategory).toBe("algo_hashmap");
  });
});
