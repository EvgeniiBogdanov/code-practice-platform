import type { SkillStats } from "@/entities/skill";

export type SkillFilter = "all" | "weak" | "fading" | "new";

export const SKILL_FILTER_OPTIONS: readonly { value: SkillFilter; label: string }[] = [
  { value: "all", label: "Все" },
  { value: "weak", label: "Слабые" },
  { value: "fading", label: "Угасают" },
  { value: "new", label: "Не начаты" },
];

export const matchesSkillFilter = (stats: SkillStats, filter: SkillFilter): boolean => {
  if (filter === "weak") return stats.isWeak;
  if (filter === "fading") return stats.isFading;
  if (filter === "new") return stats.level === "new";
  return true;
};
