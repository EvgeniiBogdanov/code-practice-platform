import React, { memo } from "react";
import { Task } from "@/entities/task";
import { isTaskCompleted, ProgressState } from "@/entities/progress";
import { isTaskDue, ReviewItem, useReviewStore } from "@/entities/review";
import { TaskListWrapper } from "@/shared/ui";
import { SidebarTaskItem } from "./SidebarTaskItem";

export interface SidebarTasksListProps {
  tasks: Task[];
  to: "/javascript/$taskId" | "/algorithms/$taskId" | "/react/$taskId";
  currentTaskId: string;
  completedTasks: ProgressState["completedTasks"];
  reviews: Record<string, ReviewItem>;
  expanded: boolean;
}

export const SidebarTasksList = memo(
  ({ tasks, to, currentTaskId, completedTasks, reviews, expanded }: SidebarTasksListProps) => {
    const excludedTaskIds = useReviewStore((state) => state.excludedTaskIds);

    return (
      <TaskListWrapper expanded={expanded} isSubgroup={false}>
        {tasks.map((task) => {
          const stringId = String(task.id);
          const isActive = stringId === currentTaskId;
          const isCompleted = isTaskCompleted(completedTasks[stringId]);
          const isUnsolved = completedTasks[stringId] === "unsolved";
          const rev = reviews[stringId];
          const isExcluded = excludedTaskIds.includes(stringId);

          return (
            <SidebarTaskItem
              key={task.id}
              id={task.id}
              to={to}
              params={{ taskId: stringId }}
              title={task.title}
              isActive={isActive}
              isSolved={isCompleted}
              isUnsolved={isUnsolved}
              isDue={isTaskDue(rev)}
              isExcluded={isExcluded}
              difficulty={task.difficulty}
              reviewRating={rev?.rating}
            />
          );
        })}
      </TaskListWrapper>
    );
  }
);

SidebarTasksList.displayName = "SidebarTasksList";
