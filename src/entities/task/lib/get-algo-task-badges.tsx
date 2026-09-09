import React from "react";
import {
  Code2,
  GitMerge,
  Hash,
  SlidersHorizontal,
  Sigma,
  Search,
  Layers,
  Link2,
  GitBranch,
  Compass,
  RotateCcw,
  Brain,
} from "lucide-react";
import { GaugeIndicator, type MetaBadgeVariant } from "@/shared/ui";
import { getAlgoTaskProbabilityInfo } from "./get-algo-task-probability";
import type { Task } from "../types";

export interface AlgoTaskBadge {
  id: string;
  label: string;
  variant: MetaBadgeVariant;
  icon: React.ReactNode;
  title?: string;
}

const ICON_SIZE = 12;

const ALGO_SUB_LABELS: Record<string, string> = {
  // Two Pointers
  algo1: "Two Pointers: Classic",
  algo2: "Two Pointers: Classic",
  algo3: "Two Pointers: Classic",
  algo35: "Two Pointers: Slow / Fast",
  algo36: "Two Pointers: Slow / Fast",
  // Hash Map
  algo4: "Hash Map: Lookup",
  algo5: "Hash Map: Frequency",
  algo6: "Hash Map: Set",
  algo7: "Hash Map: Grouping",
  // Sliding Window
  algo8: "Sliding Window: Dynamic",
  algo9: "Sliding Window: Fixed",
  algo10: "Sliding Window: Dynamic",
  // Prefix Sum
  algo11: "Prefix Sum: Array",
  algo12: "Prefix Sum: Hash Map",
  algo13: "Prefix Sum: Balance",
  // Binary Search
  algo14: "Binary Search: Classic",
  algo15: "Binary Search: Insertion",
  algo16: "Binary Search: Boundary",
  algo17: "Binary Search: Rotated",
  // Stack
  algo18: "Stack: LIFO",
  algo19: "Stack: Min Stack",
  algo20: "Stack: Monotonic",
  // Linked List
  algo21: "Linked List: Reversal",
  algo22: "Linked List: Merge",
  algo23: "Linked List: Fast / Slow",
  // Depth-First Search
  algo24: "DFS: Bottom-Up",
  algo25: "DFS: Transformation",
  algo26: "DFS: Simultaneous",
  algo27: "DFS: Bottom-Up",
  // Breadth-First Search
  algo28: "BFS: Level Order",
  algo29: "BFS: Flood Fill",
  algo30: "BFS: Multi-Source",
  // Backtracking
  algo31: "Backtracking: Subsets",
  algo32: "Backtracking: Permutations",
  algo33: "Backtracking: Combinations",
  algo34: "Backtracking: Constraints",
};

/**
 * Returns folder badge for algorithms section with icons and colors strictly matching ALGO_GROUP_CONFIG
 */
const getAlgoGroupBadge = (group: string, task?: Task): AlgoTaskBadge => {
  const taskId = task?.id ? String(task.id) : "";
  const subLabel = ALGO_SUB_LABELS[taskId];

  switch (group) {
    case "Two Pointers":
      return {
        id: "algo-two-pointers",
        label: subLabel || "Two Pointers",
        variant: "pink",
        icon: <GitMerge size={ICON_SIZE} />,
      };
    case "Hash Map":
      return {
        id: "algo-hash-map",
        label: subLabel || "Hash Map",
        variant: "yellow",
        icon: <Hash size={ICON_SIZE} />,
      };
    case "Sliding Window":
      return {
        id: "algo-sliding-window",
        label: subLabel || "Sliding Window",
        variant: "cyan",
        icon: <SlidersHorizontal size={ICON_SIZE} />,
      };
    case "Prefix Sum":
      return {
        id: "algo-prefix-sum",
        label: subLabel || "Prefix Sum",
        variant: "green",
        icon: <Sigma size={ICON_SIZE} />,
      };
    case "Binary Search":
      return {
        id: "algo-binary-search",
        label: subLabel || "Binary Search",
        variant: "blue",
        icon: <Search size={ICON_SIZE} />,
      };
    case "Stack":
      return {
        id: "algo-stack",
        label: subLabel || "Stack",
        variant: "purple",
        icon: <Layers size={ICON_SIZE} />,
      };
    case "Linked List":
      return {
        id: "algo-linked-list",
        label: subLabel || "Linked List",
        variant: "cyan",
        icon: <Link2 size={ICON_SIZE} />,
      };
    case "Depth-First Search":
      return {
        id: "algo-dfs",
        label: subLabel || "DFS",
        variant: "green",
        icon: <GitBranch size={ICON_SIZE} />,
      };
    case "Breadth-First Search":
      return {
        id: "algo-bfs",
        label: subLabel || "BFS",
        variant: "cyan",
        icon: <Compass size={ICON_SIZE} />,
      };
    case "Backtracking":
      return {
        id: "algo-backtracking",
        label: subLabel || "Backtracking",
        variant: "yellow",
        icon: <RotateCcw size={ICON_SIZE} />,
      };
    default:
      return {
        id: "algo-group",
        label: group || "Алгоритм",
        variant: "purple",
        icon: <Code2 size={ICON_SIZE} />,
      };
  }
};

export const getAlgoTaskBadges = (task: Task): AlgoTaskBadge[] => {
  if (task.section !== "algorithms") {
    return [];
  }

  const badges: AlgoTaskBadge[] = [];

  // Interview Probability Gauge Badge
  const probInfo = getAlgoTaskProbabilityInfo(task);
  if (probInfo && probInfo.probability !== null) {
    badges.push({
      id: "interview-probability",
      label: probInfo.label,
      variant: probInfo.variant,
      icon: <GaugeIndicator value={probInfo.probability} size={13} />,
      title: probInfo.tooltip,
    });
  }

  // Base Algorithm badge (Purple with Brain icon matching the Algorithms section)
  badges.push({
    id: "algo-general",
    label: "Алгоритм",
    variant: "purple",
    icon: <Brain size={ICON_SIZE} />,
  });

  // Algorithm Folder / Group Badge with exact folder icon and color from ALGO_GROUP_CONFIG
  if (task.group) {
    badges.push(getAlgoGroupBadge(task.group, task));
  }

  return badges;
};
