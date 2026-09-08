import { useMemo } from "react";
import { useReviewStore, isTaskDue, STAGE_INTERVALS } from "@/entities/review";
import { selectDailyTaskStats, useProgressStore } from "@/entities/progress";
import type { MasteryStats, ReviewItem } from "@/entities/review";
import type { DailyTaskStats } from "@/entities/progress";
import type { Task } from "@/entities/task/meta";
import { useAllTaskSections } from "@/entities/task/catalog";
import { getUpcomingTasks } from "../lib/upcoming-helpers";
import type { UpcomingTaskItem } from "../lib/upcoming-helpers";
import { getReviewActivityByDate } from "../lib/get-review-activity";

export interface UseSpacedRepetitionDataProps {
  taskList?: Task[];
  sectionName?: string;
}

export interface UseSpacedRepetitionDataResult {
  reviews: Record<string, ReviewItem>;
  targetTasks: Task[];
  masteryStats: MasteryStats;
  dueTasks: Task[];
  upcomingTasks: UpcomingTaskItem[];
  unsolvedTasks: Task[];
  dailyTaskStats: DailyTaskStats;
  reviewActivityByDate: Record<string, number>;
  masteryPercent: number;
  avgInterval: number;
  scopeLabel: string;
}

export const useSpacedRepetitionData = ({
  taskList,
  sectionName = "",
}: UseSpacedRepetitionDataProps): UseSpacedRepetitionDataResult => {
  const reviews = useReviewStore((state) => state.reviews);
  const isInitialized = useReviewStore((state) => state.isInitialized);
  const getMasteryStats = useReviewStore((state) => state.getMasteryStats);
  const excludedTaskIds = useReviewStore((state) => state.excludedTaskIds);
  const completedTasks = useProgressStore((state) => state.completedTasks);
  const taskStatusTimestamps = useProgressStore((state) => state.taskStatusTimestamps);
  const { tasks: catalogTasks } = useAllTaskSections(!taskList?.length);

  const excludedSet = useMemo(() => new Set(excludedTaskIds.map(String)), [excludedTaskIds]);

  const targetTasks = useMemo(() => {
    const raw = taskList && taskList.length > 0 ? taskList : catalogTasks;
    return raw.filter((t) => !excludedSet.has(String(t.id)));
  }, [catalogTasks, taskList, excludedSet]);

  const masteryStats = useMemo(() => {
    return isInitialized
      ? getMasteryStats(targetTasks)
      : {
          dueToday: 0,
          learning: 0,
          reviewing: 0,
          mastered: 0,
          totalReviewed: 0,
          unreviewed: targetTasks.length,
          totalCount: targetTasks.length,
        };
  }, [targetTasks, isInitialized, getMasteryStats]);

  const dueTasks = useMemo(() => {
    if (!isInitialized) return [];
    return targetTasks.filter((t) => {
      if (excludedSet.has(String(t.id))) return false;
      const rev = reviews[String(t.id)];
      return isTaskDue(rev);
    });
  }, [targetTasks, reviews, isInitialized, excludedSet]);

  const upcomingTasks = useMemo((): UpcomingTaskItem[] => {
    if (!isInitialized) return [];
    return getUpcomingTasks(targetTasks, reviews, excludedTaskIds);
  }, [targetTasks, reviews, isInitialized, excludedTaskIds]);

  const unsolvedTasks = useMemo((): Task[] => {
    return targetTasks.filter((t) => {
      if (excludedSet.has(String(t.id))) return false;
      const status = completedTasks[String(t.id)] ?? completedTasks[t.id];
      return status === "unsolved";
    });
  }, [targetTasks, completedTasks, excludedSet]);

  const masteryPercent =
    masteryStats.totalReviewed > 0
      ? Math.round((masteryStats.mastered / masteryStats.totalReviewed) * 100)
      : 0;

  const dailyTaskStats = useMemo(
    () => selectDailyTaskStats({ completedTasks, taskStatusTimestamps }, targetTasks),
    [completedTasks, taskStatusTimestamps, targetTasks]
  );

  const reviewActivityByDate = useMemo(
    () => getReviewActivityByDate(reviews, targetTasks),
    [reviews, targetTasks]
  );

  const avgInterval = useMemo(() => {
    if (!reviews || masteryStats.totalReviewed === 0 || !targetTasks) return 0;
    let sum = 0;
    let count = 0;
    for (const task of targetTasks) {
      const rev = reviews[String(task.id)];
      if (rev && rev.stage > 0) {
        sum += rev.intervalDays || STAGE_INTERVALS[rev.stage] || 1;
        count++;
      }
    }
    return count > 0 ? Math.round(sum / count) : 0;
  }, [reviews, masteryStats.totalReviewed, targetTasks]);

  const scopeLabel = sectionName ? `в разделе ${sectionName}` : "в каталоге";

  return {
    reviews,
    targetTasks,
    masteryStats,
    dueTasks,
    upcomingTasks,
    unsolvedTasks,
    dailyTaskStats,
    reviewActivityByDate,
    masteryPercent,
    avgInterval,
    scopeLabel,
  };
};
