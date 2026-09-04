import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCommandPalette } from "./useCommandPalette";
import { useUIStore } from "@/entities/ui-state";
import type { Task } from "@/entities/task/meta";

const mockNavigate = vi.fn();
let mockPathname = "/";

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: mockPathname }),
}));

const sampleTasks: Task[] = [
  {
    id: "r1",
    title: "React Task 1",
    section: "react",
    difficulty: "easy",
    category: "Hooks",
  },
  {
    id: "r2",
    title: "React State Management",
    section: "react",
    difficulty: "medium",
    category: "State",
  },
  {
    id: "js1",
    title: "JavaScript Promises",
    section: "javascript",
    difficulty: "easy",
    category: "Async",
  },
  {
    id: "a1",
    title: "Binary Search",
    section: "algorithms",
    difficulty: "medium",
    category: "Search",
  },
];

vi.mock("@/entities/task/catalog", () => ({
  useAllTaskSections: () => ({
    tasks: sampleTasks,
    isLoading: false,
  }),
}));

describe("useCommandPalette", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockPathname = "/";
    mockNavigate.mockReset();
    useUIStore.setState({
      paletteOpen: true,
      paletteQuery: "",
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should initialize activeSection based on route and filter tasks", () => {
    mockPathname = "/react";
    const { result } = renderHook(() => useCommandPalette());

    expect(result.current.activeSection).toBe("react");
    expect(result.current.filteredTasks).toHaveLength(2);
    expect(result.current.filteredTasks.every((t) => t.section === "react")).toBe(true);
  });

  it("should debounce search input and only update filtered tasks after 200ms", () => {
    const { result } = renderHook(() => useCommandPalette());

    expect(result.current.activeSection).toBe("all");
    expect(result.current.filteredTasks).toHaveLength(4);

    act(() => {
      result.current.setQuery("Promises");
    });

    // Query is updated immediately in state
    expect(result.current.query).toBe("Promises");
    // Debounced query and filteredTasks are NOT updated yet
    expect(result.current.debouncedQuery).toBe("");
    expect(result.current.filteredTasks).toHaveLength(4);

    // Fast forward 100ms
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current.debouncedQuery).toBe("");

    // Fast forward remaining 100ms (total 200ms)
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current.debouncedQuery).toBe("Promises");
    expect(result.current.filteredTasks).toHaveLength(1);
    expect(result.current.filteredTasks[0].id).toBe("js1");
  });

  it("should filter by active section when tab changes", () => {
    const { result } = renderHook(() => useCommandPalette());

    act(() => {
      result.current.setActiveSection("algorithms");
    });

    expect(result.current.filteredTasks).toHaveLength(1);
    expect(result.current.filteredTasks[0].id).toBe("a1");
  });

  it("should handle navigation on task select", () => {
    const { result } = renderHook(() => useCommandPalette());

    act(() => {
      result.current.handleSelectTask(sampleTasks[0]);
    });

    expect(mockNavigate).toHaveBeenCalledWith({
      to: "/react/$taskId",
      params: { taskId: "r1" },
    });
    expect(useUIStore.getState().paletteOpen).toBe(false);
  });
});
