import { useMemo } from "react";
import { useProgressStore } from "@/entities/progress";
import { useReviewStore } from "@/entities/review";
import { computeAllSkillStats, type SkillStats } from "@/entities/skill";
import { toSkillStatus } from "./skillStatus";

/** Mastery of every skill, recomputed when progress, reviews or exclusions change. */
export const useSkillStats = (): ReadonlyMap<string, SkillStats> => {
  const completedTasks = useProgressStore((state) => state.completedTasks);
  const reviews = useReviewStore((state) => state.reviews);
  const excludedTaskIds = useReviewStore((state) => state.excludedTaskIds);

  return useMemo(() => {
    const statuses = Object.fromEntries(
      Object.entries(completedTasks).map(([id, status]) => [id, toSkillStatus(status)])
    );
    return computeAllSkillStats({ statuses, reviews, excluded: new Set(excludedTaskIds) });
  }, [completedTasks, reviews, excludedTaskIds]);
};
