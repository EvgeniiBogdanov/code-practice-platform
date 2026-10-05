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
  junior: "Junior",
  middle: "Middle",
  senior: "Senior",
  easy: "Лёгкая",
  medium: "Средняя",
  hard: "Сложная",
};

const getBadgeVariant = (diff: string): BadgeVariant => {
  switch (diff) {
    case "easy":
    case "warm-up":
    case "junior":
      return "easy";
    case "medium":
    case "middle":
      return "medium";
    case "hard":
    case "senior":
      return "hard";
    case "refactoring":
      return "blue";
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
