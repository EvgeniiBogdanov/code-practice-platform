import { describe, it, expect } from "vitest";
import { getAlgoTaskBadges } from "./get-algo-task-badges";
import type { Task } from "../types";

describe("getAlgoTaskBadges", () => {
  it("returns empty array for non-algorithms section tasks", () => {
    const jsTask: Task = {
      id: "js70",
      title: "1. Практическая задача - debounce",
      section: "javascript",
    };
    expect(getAlgoTaskBadges(jsTask)).toEqual([]);
  });

  it("returns probability badge, general algorithm badge and group badge for algorithm tasks", () => {
    const task: Task = {
      id: "algo4",
      title: "1. Two Sum",
      group: "Hash Map",
      section: "algorithms",
    };

    const badges = getAlgoTaskBadges(task);
    expect(badges.length).toBe(3);

    const probBadge = badges.find((b) => b.id === "interview-probability");
    expect(probBadge).toBeDefined();
    expect(probBadge?.label).toBe("Вероятность: 98%");
    expect(probBadge?.variant).toBe("green");
    expect(probBadge?.title).toContain("Критически высокая");

    const generalBadge = badges.find((b) => b.id === "algo-general");
    expect(generalBadge).toBeDefined();
    expect(generalBadge?.label).toBe("Алгоритм");
    expect(generalBadge?.variant).toBe("purple");

    const groupBadge = badges.find((b) => b.id === "algo-hash-map");
    expect(groupBadge).toBeDefined();
    expect(groupBadge?.label).toBe("Hash Map: Lookup");
    expect(groupBadge?.variant).toBe("yellow");
  });

  it("handles different algorithm groups with proper labels, icons and folder colors", () => {
    const twoPointersTask: Task = {
      id: "algo1",
      title: "1. Two Sum II - Input Array Is Sorted",
      group: "Two Pointers",
      section: "algorithms",
    };
    const tpBadges = getAlgoTaskBadges(twoPointersTask);
    const tpBadge = tpBadges.find((b) => b.label === "Two Pointers: Classic");
    expect(tpBadge).toBeDefined();
    expect(tpBadge?.variant).toBe("pink");

    const slowFastTask: Task = {
      id: "algo35",
      title: "4. Move Zeroes",
      group: "Two Pointers",
      section: "algorithms",
    };
    const sfBadges = getAlgoTaskBadges(slowFastTask);
    const sfBadge = sfBadges.find((b) => b.label === "Two Pointers: Slow / Fast");
    expect(sfBadge).toBeDefined();
    expect(sfBadge?.variant).toBe("pink");

    const binarySearchTask: Task = {
      id: "algo14",
      title: "1. Binary Search",
      group: "Binary Search",
      section: "algorithms",
    };
    const bsBadges = getAlgoTaskBadges(binarySearchTask);
    const bsBadge = bsBadges.find((b) => b.label === "Binary Search: Classic");
    expect(bsBadge).toBeDefined();
    expect(bsBadge?.variant).toBe("blue");

    const dfsTask: Task = {
      id: "algo24",
      title: "1. Maximum Depth of Binary Tree",
      group: "Depth-First Search",
      section: "algorithms",
    };
    const dfsBadges = getAlgoTaskBadges(dfsTask);
    const dfsBadge = dfsBadges.find((b) => b.label === "DFS: Bottom-Up");
    expect(dfsBadge).toBeDefined();
    expect(dfsBadge?.variant).toBe("green");

    const linkedListTask: Task = {
      id: "algo21",
      title: "1. Reverse Linked List",
      group: "Linked List",
      section: "algorithms",
    };
    const llBadges = getAlgoTaskBadges(linkedListTask);
    const llBadge = llBadges.find((b) => b.label === "Linked List: Reversal");
    expect(llBadge).toBeDefined();
    expect(llBadge?.variant).toBe("cyan");

    const stackMonotonicTask: Task = {
      id: "algo20",
      title: "3. Daily Temperatures",
      group: "Stack",
      section: "algorithms",
    };
    const stackBadges = getAlgoTaskBadges(stackMonotonicTask);
    const stackBadge = stackBadges.find((b) => b.label === "Stack: Monotonic");
    expect(stackBadge).toBeDefined();
    expect(stackBadge?.variant).toBe("purple");

    const slidingFixedTask: Task = {
      id: "algo9",
      title: "2. Maximum Average Subarray I",
      group: "Sliding Window",
      section: "algorithms",
    };
    const swBadges = getAlgoTaskBadges(slidingFixedTask);
    const swBadge = swBadges.find((b) => b.label === "Sliding Window: Fixed");
    expect(swBadge).toBeDefined();
    expect(swBadge?.variant).toBe("cyan");
  });
});
