import type { BadgeVariant } from "@/shared/ui";
import type { DesignCaseDifficulty } from "@/entities/design-case";

export const DIFFICULTY_BADGE: Record<
  DesignCaseDifficulty,
  { label: string; variant: BadgeVariant }
> = {
  easy: { label: "Лёгкий", variant: "easy" },
  medium: { label: "Средний", variant: "medium" },
  hard: { label: "Сложный", variant: "hard" },
};
