import { renderHook } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { loadTaskSection } from "@/entities/task/catalog";
import { useGroupOverview } from "./use-group-overview";

vi.mock("@tanstack/react-router", () => ({
  useLocation: () => ({ pathname: "/algorithms/group-two-pointers" }),
}));

describe("useGroupOverview - algorithms section", () => {
  beforeAll(async () => {
    await loadTaskSection("algorithms");
  });

  it("ensures Two Pointers group overview does not have subgroups/folders", () => {
    const { result } = renderHook(() => useGroupOverview("group-two-pointers"));

    expect(result.current.section).toBe("algorithms");
    expect(result.current.hasSubgroups).toBe(false);
    expect(result.current.filteredTasks.length).toBe(7);

    const taskIds = result.current.filteredTasks.map((t) => t.id);
    expect(taskIds).toEqual(["algo38", "algo36", "algo35", "algo2", "algo37", "algo1", "algo3"]);

    // Ensure no task in Two Pointers has a subgroup
    expect(result.current.filteredTasks.every((t) => !t.subgroup)).toBe(true);
  });
});
