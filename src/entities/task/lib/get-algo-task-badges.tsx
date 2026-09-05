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

/**
 * Returns folder badge for algorithms section with icons and colors strictly matching ALGO_GROUP_CONFIG
 */
const getAlgoGroupBadge = (group: string): AlgoTaskBadge => {
  switch (group) {
    case "Two Pointers":
      return {
        id: "algo-two-pointers",
        label: "Two Pointers",
        variant: "pink",
        icon: <GitMerge size={ICON_SIZE} />,
      };
    case "Hash Map":
      return {
        id: "algo-hash-map",
        label: "Hash Map",
        variant: "yellow",
        icon: <Hash size={ICON_SIZE} />,
      };
    case "Sliding Window":
      return {
        id: "algo-sliding-window",
        label: "Sliding Window",
        variant: "cyan",
        icon: <SlidersHorizontal size={ICON_SIZE} />,
      };
    case "Prefix Sum":
      return {
        id: "algo-prefix-sum",
        label: "Prefix Sum",
        variant: "green",
        icon: <Sigma size={ICON_SIZE} />,
      };
    case "Binary Search":
      return {
        id: "algo-binary-search",
        label: "Binary Search",
        variant: "blue",
        icon: <Search size={ICON_SIZE} />,
      };
    case "Stack":
      return {
        id: "algo-stack",
        label: "Stack",
        variant: "purple",
        icon: <Layers size={ICON_SIZE} />,
      };
    case "Linked List":
      return {
        id: "algo-linked-list",
        label: "Linked List",
        variant: "cyan",
        icon: <Link2 size={ICON_SIZE} />,
      };
    case "Depth-First Search":
      return {
        id: "algo-dfs",
        label: "DFS",
        variant: "green",
        icon: <GitBranch size={ICON_SIZE} />,
      };
    case "Breadth-First Search":
      return {
        id: "algo-bfs",
        label: "BFS",
        variant: "cyan",
        icon: <Compass size={ICON_SIZE} />,
      };
    case "Backtracking":
      return {
        id: "algo-backtracking",
        label: "Backtracking",
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
    badges.push(getAlgoGroupBadge(task.group));
  }

  return badges;
};
