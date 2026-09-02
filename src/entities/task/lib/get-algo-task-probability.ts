import {
  getProbabilityBadgeVariant,
  getProbabilityBadgeLabel,
  getProbabilityBadgeTitle,
  type TaskProbabilityInfo,
} from "./get-js-task-probability";
import type { Task } from "../types";

export {
  getProbabilityBadgeVariant,
  getProbabilityBadgeLabel,
  getProbabilityBadgeTitle,
  type TaskProbabilityInfo,
};

/**
 * 2026 Frontend Middle/Senior Live Coding Interview Probability Map
 * Aggregated from top tech companies (Yandex, T-Bank, Avito, Ozon, LeetCode Blind 75 / Grind 75)
 */
const ALGO_TASK_PROBABILITIES: Readonly<Record<string, number>> = {
  // Two Pointers
  algo1: 92, // Two Sum II - Input Array Is Sorted
  algo2: 95, // Valid Palindrome
  algo3: 95, // 3Sum

  // Hash Map
  algo4: 98, // Two Sum
  algo5: 92, // Valid Anagram
  algo6: 82, // Contains Duplicate
  algo7: 96, // Group Anagrams

  // Sliding Window
  algo8: 97, // Longest Substring Without Repeating Characters
  algo9: 82, // Maximum Average Subarray I
  algo10: 88, // Minimum Size Subarray Sum

  // Prefix Sum
  algo11: 80, // Range Sum Query - Immutable
  algo12: 92, // Subarray Sum Equals K
  algo13: 84, // Find Pivot Index

  // Binary Search
  algo14: 94, // Binary Search
  algo15: 86, // Search Insert Position
  algo16: 88, // First Bad Version
  algo17: 95, // Search in Rotated Sorted Array

  // Stack
  algo18: 98, // Valid Parentheses
  algo19: 90, // Min Stack
  algo20: 90, // Daily Temperatures

  // Linked List
  algo21: 95, // Reverse Linked List
  algo22: 95, // Merge Two Sorted Lists
  algo23: 91, // Linked List Cycle

  // Depth-First Search (DFS)
  algo24: 95, // Maximum Depth of Binary Tree
  algo25: 94, // Invert Binary Tree
  algo26: 90, // Same Tree
  algo27: 88, // Diameter of Binary Tree

  // Breadth-First Search (BFS)
  algo28: 92, // Binary Tree Level Order Traversal
  algo29: 95, // Number of Islands
  algo30: 89, // Rotting Oranges

  // Backtracking
  algo31: 88, // Subsets
  algo32: 88, // Permutations
  algo33: 87, // Combination Sum
  algo34: 94, // Generate Parentheses
};

const inferFallbackAlgoProbability = (group: string): number => {
  const g = group || "";
  if (g.includes("Two Pointers") || g.includes("Hash Map")) return 94;
  if (g.includes("Sliding Window") || g.includes("Stack")) return 92;
  if (g.includes("Binary Search") || g.includes("Linked List")) return 92;
  if (g.includes("Depth-First") || g.includes("Breadth-First")) return 90;
  if (g.includes("Backtracking")) return 88;
  if (g.includes("Prefix Sum")) return 84;
  return 85;
};

export const getAlgoTaskProbability = (task: Task): number | null => {
  if (task.section !== "algorithms") {
    return null;
  }

  const id = String(task.id);
  if (id in ALGO_TASK_PROBABILITIES) {
    return ALGO_TASK_PROBABILITIES[id];
  }

  return inferFallbackAlgoProbability(task.group || "");
};

export const getAlgoTaskProbabilityInfo = (task: Task): TaskProbabilityInfo | null => {
  const probability = getAlgoTaskProbability(task);
  if (probability === null) {
    return null;
  }

  return {
    probability,
    variant: getProbabilityBadgeVariant(probability),
    label: getProbabilityBadgeLabel(probability),
    tooltip: getProbabilityBadgeTitle(probability),
  };
};
