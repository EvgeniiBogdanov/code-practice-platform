import React from "react";
import { Badge, BadgeVariant } from "@/shared/ui";
import { TaskDifficulty } from "../../types";

export interface TaskDifficultyBadgeProps {
  difficulty?: TaskDifficulty | string;
  className?: string;
}

const DIFFICULTY_LABELS: Record<string, string> = {
  "warm-up": "Разминка",
  refactoring: "Рефакторинг",
  middle: "Middle",
  strong: "Strong",
  ts: "TypeScript",
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

const getBadgeVariant = (diff: string): BadgeVariant => {
  switch (diff) {
    case "easy":
    case "warm-up":
    case "middle":
      return "easy";
    case "medium":
    case "refactoring":
    case "ts":
      return "medium";
    case "hard":
      return "hard";
    case "strong":
      return "purple";
    default:
      return "gray";
  }
};

export function TaskDifficultyBadge({ difficulty, className }: TaskDifficultyBadgeProps) {
  if (!difficulty) return null;

  const normalizedDiff = difficulty.toLowerCase();
  const label = DIFFICULTY_LABELS[normalizedDiff] || difficulty;
  const variant = getBadgeVariant(normalizedDiff);

  return (
    <Badge variant={variant} size="md" className={className}>
      {label}
    </Badge>
  );
}
