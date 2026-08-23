import React, { memo } from "react";
import { Task } from "@/entities/task";
import { selectIsTaskCompleted, ProgressState } from "@/entities/progress";
import { isTaskDue, ReviewItem } from "@/entities/review";
import { TaskListWrapper } from "@/shared/ui";
import { SidebarTaskItem } from "./SidebarTaskItem";

export interface SidebarTasksListProps {
  tasks: Task[];
  to: "/javascript/$taskId" | "/algorithms/$taskId" | "/react/$taskId";
  currentTaskId: string;
  progressState: ProgressState;
  reviews: Record<string, ReviewItem>;
  expanded: boolean;
}

export const SidebarTasksList = memo(
  ({ tasks, to, currentTaskId, progressState, reviews, expanded }: SidebarTasksListProps) => {
    return (
      <TaskListWrapper expanded={expanded} isSubgroup={false}>
        {tasks.map((task) => {
          const isActive = String(task.id) === currentTaskId;
          const isCompleted = selectIsTaskCompleted(progressState, task.id);
          const isUnsolved =
            progressState.completedTasks[task.id] === "unsolved" ||
            progressState.completedTasks[String(task.id)] === "unsolved";
          const rev = reviews[String(task.id)];

          return (
            <SidebarTaskItem
              key={task.id}
              id={task.id}
              to={to}
              params={{ taskId: String(task.id) }}
              title={task.title}
              isActive={isActive}
              isSolved={isCompleted}
              isUnsolved={isUnsolved}
              isDue={isTaskDue(rev)}
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
