import { useMemo } from "react";
import { useReviewStore, isTaskDue, STAGE_INTERVALS } from "@/entities/review";
import { useProgressStore } from "@/entities/progress";
import { ALL_TASKS, Task } from "@/entities/task";
import { getUpcomingTasks, UpcomingTaskItem } from "../lib/upcoming-helpers";

export interface UseSpacedRepetitionDataProps {
  taskList?: Task[];
  sectionName?: string;
}

export const useSpacedRepetitionData = ({
  taskList,
  sectionName = "",
}: UseSpacedRepetitionDataProps) => {
  const reviews = useReviewStore((state) => state.reviews) || {};
  const isInitialized = useReviewStore((state) => state.isInitialized);
  const getMasteryStats = useReviewStore((state) => state.getMasteryStats);
  const completedTasks = useProgressStore((state) => state.completedTasks);

  const targetTasks = useMemo(() => {
    return taskList && taskList.length > 0 ? taskList : ALL_TASKS;
  }, [taskList]);

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
      const rev = reviews[String(t.id)];
      return isTaskDue(rev);
    });
  }, [targetTasks, reviews, isInitialized]);

  const upcomingTasks = useMemo((): UpcomingTaskItem[] => {
    if (!isInitialized) return [];
    return getUpcomingTasks(targetTasks, reviews);
  }, [targetTasks, reviews, isInitialized]);

  const unsolvedTasks = useMemo((): Task[] => {
    return targetTasks.filter((t) => {
      return completedTasks[String(t.id)] === "unsolved";
    });
  }, [targetTasks, completedTasks]);

  const masteryPercent =
    masteryStats.totalReviewed > 0
      ? Math.round((masteryStats.mastered / masteryStats.totalReviewed) * 100)
      : 0;

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
    masteryPercent,
    avgInterval,
    scopeLabel,
  };
};
