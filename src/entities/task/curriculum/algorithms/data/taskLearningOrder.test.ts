import { describe, expect, it } from "vitest";
import { loadTaskSection } from "@/entities/task/catalog";
import { getAlgoGroupMeta } from "@/entities/task/groups";
import type { Task } from "@/entities/task/meta";

const EXPECTED_INTERNAL_CHAINS = {
  "Hash Map": [["algo6"], ["algo4"], ["algo5", "algo7"]],
  "Two Pointers": [
    ["algo38", "algo36", "algo35"],
    ["algo2", "algo37", "algo1", "algo3"],
  ],
  "Sliding Window": [["algo9"], ["algo10", "algo8"]],
  "Prefix Sum": [["algo39", "algo11"], ["algo13"], ["algo12"]],
  "Binary Search": [["algo14", "algo15", "algo16"], ["algo17"]],
  Stack: [["algo40", "algo18"], ["algo19"], ["algo20"]],
  "Linked List": [["algo21"], ["algo22"], ["algo23"]],
  "Depth-First Search": [["algo41"], ["algo24", "algo27"], ["algo25"], ["algo26"]],
  "Breadth-First Search": [
    ["algo42", "algo28"],
    ["algo43", "algo29"],
    ["algo30"],
  ],
  Backtracking: [["algo44", "algo31"], ["algo32"], ["algo33", "algo34"]],
} as const;

const EXPECTED_PRACTICE_CHAINS = {
  "Hash Map": [
    ["algo6", "algo_lc128"], // Set membership and sequence expansion.
    ["algo4"], // Complement lookup.
    ["algo5", "algo_lc387", "algo7", "algo_lc347"], // Frequency maps.
  ],
  "Two Pointers": [
    ["algo38", "algo36", "algo35"], // Same-direction read/write.
    ["algo9_ext"], // Parallel inputs.
    ["algo8_ext"], // Different-speed runners.
    ["algo4_ext", "algo2", "algo37", "algo1", "algo7_ext", "algo3"], // Opposite ends and composition.
  ],
  "Sliding Window": [
    ["algo9", "algo_lc438"], // Fixed windows.
    ["algo_lc53"], // Kadane's neighboring linear-scan technique.
    ["algo10", "algo8", "algo_lc76"], // Dynamic windows.
  ],
  "Prefix Sum": [
    ["algo39", "algo11", "algo_lc304"], // Construction and range queries from 1D to 2D.
    ["algo13"], // Running balance.
    ["algo_lc238"], // Prefix/suffix accumulation.
    ["algo12", "algo_lc525"], // Prefix sum with a hash map.
  ],
  "Binary Search": [
    ["algo14", "algo15", "algo16", "algo_lc74"], // Classic search, boundaries, and a virtual array.
    ["algo_lc153", "algo17"], // Rotated arrays.
    ["algo_lc875"], // Search over the answer space.
  ],
  Stack: [
    ["algo40", "algo18", "algo_lc150"], // Basic LIFO applications.
    ["algo19"], // Augmented stack state.
    ["algo_lc22"], // Backtracking/stack hybrid.
    ["algo20", "algo_lc84"], // Monotonic stack.
  ],
  "Linked List": [
    ["algo21", "algo22"], // Core pointer rewiring and composition.
    ["algo_lc876", "algo23", "algo_lc234"], // Slow/fast runners.
    ["algo_lc160", "algo_lc19"], // Synchronized and offset pointers.
  ],
  "Depth-First Search": [
    ["algo41"], // Plain preorder traversal.
    ["algo24", "algo_lc110", "algo27"], // Post-order height aggregation.
    ["algo25"], // Tree transformation.
    ["algo26", "algo_lc572"], // Structural comparison.
    ["algo_lc112", "algo_lc235"], // Path and ancestor queries.
  ],
  "Breadth-First Search": [
    ["algo42", "algo28", "algo_lc116"], // Tree levels and early exit.
    ["algo43", "algo29", "algo_lc130"], // Flood fill and components.
    ["algo_lc1091", "algo_lc127"], // Single-source shortest paths.
    ["algo30", "algo_lc542"], // Multi-source BFS.
  ],
  Backtracking: [
    ["algo44", "algo31", "algo_lc17", "algo32"], // Basic combinatorial generation.
    ["algo33", "algo34"], // Constrained generation.
    ["algo_lc79"], // Grid path search.
    ["algo_lc131"], // Partitioning.
    ["algo_lc51", "algo_lc37"], // Constraint-satisfaction boards.
  ],
} as const;

const ENTRY_TASK_EXPECTATIONS = [
  { id: "algo38", group: "Two Pointers", functionName: "removeElement" },
  { id: "algo39", group: "Prefix Sum", functionName: "runningSum" },
  { id: "algo40", group: "Stack", functionName: "removeAdjacentDuplicates" },
  { id: "algo41", group: "Depth-First Search", functionName: "preorderTraversal" },
  { id: "algo42", group: "Breadth-First Search", functionName: "minDepth" },
  { id: "algo43", group: "Breadth-First Search", functionName: "floodFill" },
  { id: "algo44", group: "Backtracking", functionName: "generateBinaryStrings" },
] as const;

const getTasksByGroup = (tasks: readonly Task[], groupName: string): Task[] =>
  tasks.filter((task) => task.group === groupName);

const getDifficultyRank = (difficulty: Task["difficulty"]): number => {
  if (difficulty === "easy") return 0;
  if (difficulty === "medium") return 1;
  if (difficulty === "hard") return 2;
  return Number.MAX_SAFE_INTEGER;
};

describe("Algorithms learning order", () => {
  it("starts every algorithm folder with an Easy entry task", async () => {
    const tasks = await loadTaskSection("algorithms");

    Object.keys(EXPECTED_INTERNAL_CHAINS).forEach((groupName) => {
      const [firstTask] = getTasksByGroup(tasks, groupName);

      expect(firstTask?.difficulty).toBe("easy");
    });
  });

  it("loads every new entry task with complete learning materials", async () => {
    const tasks = await loadTaskSection("algorithms");
    const taskById = new Map(tasks.map((task) => [String(task.id), task]));

    ENTRY_TASK_EXPECTATIONS.forEach(({ id, group, functionName }) => {
      const task = taskById.get(id);

      expect(task).toMatchObject({ id, group, difficulty: "easy", isRaw: true });
      expect(task?.rawCandidate).toContain(functionName);
      expect(task?.rawSolution).toContain(functionName);
      expect(task?.explanation?.length).toBeGreaterThan(500);
      expect(task?.checklist?.length).toBeGreaterThanOrEqual(5);
    });
  });

  it("keeps internal folder tasks in the curated learning order", async () => {
    const tasks = await loadTaskSection("algorithms");

    Object.entries(EXPECTED_INTERNAL_CHAINS).forEach(([groupName, expectedChains]) => {
      const groupTasks = getTasksByGroup(tasks, groupName);
      const expectedIds = expectedChains.flat();

      expect(groupTasks.map((task) => String(task.id))).toEqual(expectedIds);
      groupTasks.forEach((task, index) => {
        expect(task.title).toMatch(new RegExp(`^${index + 1}\\.`));
      });
    });
  });

  it("keeps difficulty non-decreasing inside every pattern family", async () => {
    const tasks = await loadTaskSection("algorithms");

    Object.entries(EXPECTED_INTERNAL_CHAINS).forEach(([groupName, expectedChains]) => {
      const taskById = new Map(
        getTasksByGroup(tasks, groupName).map((task) => [String(task.id), task])
      );

      expectedChains.forEach((chain) => {
        const difficultyRanks = chain.map((taskId) =>
          getDifficultyRank(taskById.get(taskId)?.difficulty)
        );

        expect(difficultyRanks).toEqual([...difficultyRanks].sort((left, right) => left - right));
      });
    });
  });

  it("keeps practice recommendations aligned with the same progression", () => {
    Object.entries(EXPECTED_PRACTICE_CHAINS).forEach(([groupName, expectedChains]) => {
      const practiceTasks = getAlgoGroupMeta(groupName).practiceTasksList as ReadonlyArray<{
        id: string;
      }>;

      expect(practiceTasks.map((task) => task.id)).toEqual(expectedChains.flat());
    });
  });
});
