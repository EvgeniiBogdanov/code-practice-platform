import { describe, it, expect } from "vitest";
import {
  getAlgoTaskProbability,
  getAlgoTaskProbabilityInfo,
} from "./get-algo-task-probability";
import type { Task } from "../types";

describe("get-algo-task-probability", () => {
  it("returns null for non-algorithms section tasks", () => {
    const jsTask: Task = {
      id: "js70",
      title: "1. Практическая задача - debounce",
      section: "javascript",
    };
    expect(getAlgoTaskProbability(jsTask)).toBeNull();
  });

  it("returns critically high probability (>= 95%) for top algorithm staples", () => {
    const twoSumTask: Task = {
      id: "algo4",
      title: "1. Two Sum",
      group: "Hash Map",
      section: "algorithms",
    };
    expect(getAlgoTaskProbability(twoSumTask)).toBe(98);

    const validParenthesesTask: Task = {
      id: "algo18",
      title: "1. Valid Parentheses",
      group: "Stack",
      section: "algorithms",
    };
    expect(getAlgoTaskProbability(validParenthesesTask)).toBe(98);

    const longestSubstringTask: Task = {
      id: "algo8",
      title: "1. Longest Substring Without Repeating Characters",
      group: "Sliding Window",
      section: "algorithms",
    };
    expect(getAlgoTaskProbability(longestSubstringTask)).toBe(97);

    const groupAnagramsTask: Task = {
      id: "algo7",
      title: "4. Group Anagrams",
      group: "Hash Map",
      section: "algorithms",
    };
    expect(getAlgoTaskProbability(groupAnagramsTask)).toBe(96);

    const validPalindromeTask: Task = {
      id: "algo2",
      title: "2. Valid Palindrome",
      group: "Two Pointers",
      section: "algorithms",
    };
    expect(getAlgoTaskProbability(validPalindromeTask)).toBe(95);

    const threeSumTask: Task = {
      id: "algo3",
      title: "3. 3Sum",
      group: "Two Pointers",
      section: "algorithms",
    };
    expect(getAlgoTaskProbability(threeSumTask)).toBe(95);

    const reverseLinkedListTask: Task = {
      id: "algo21",
      title: "1. Reverse Linked List",
      group: "Linked List",
      section: "algorithms",
    };
    expect(getAlgoTaskProbability(reverseLinkedListTask)).toBe(95);

    const numberOfIslandsTask: Task = {
      id: "algo29",
      title: "2. Number of Islands",
      group: "Breadth-First Search",
      section: "algorithms",
    };
    expect(getAlgoTaskProbability(numberOfIslandsTask)).toBe(95);
  });

  it("returns formatted info with traffic light green badge variant for top algorithm tasks", () => {
    const task: Task = {
      id: "algo4",
      title: "1. Two Sum",
      group: "Hash Map",
      section: "algorithms",
    };

    const info = getAlgoTaskProbabilityInfo(task);
    expect(info).not.toBeNull();
    expect(info?.probability).toBe(98);
    expect(info?.variant).toBe("green");
    expect(info?.label).toBe("Вероятность: 98%");
    expect(info?.tooltip).toContain("Middle/Senior");
    expect(info?.tooltip).toContain("Критически высокая");
  });

  it("uses fallback group calculation for unknown algorithm task IDs", () => {
    const unknownTask: Task = {
      id: "algo-custom-99",
      title: "Custom Two Pointers Problem",
      group: "Two Pointers",
      section: "algorithms",
    };

    const prob = getAlgoTaskProbability(unknownTask);
    expect(prob).toBe(94);
  });
});
