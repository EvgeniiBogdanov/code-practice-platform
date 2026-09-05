import React, { memo } from "react";
import { Task } from "@/entities/task";
import { CandidateTabSkeleton } from "./CandidateTabSkeleton";
import { SolutionTabSkeleton } from "./SolutionTabSkeleton";
import { MaterialsTabSkeleton } from "./MaterialsTabSkeleton";
import { QuestionsTabSkeleton } from "./QuestionsTabSkeleton";
import { ChecklistTabSkeleton } from "./ChecklistTabSkeleton";

export interface TaskTabSkeletonProps {
  tab: string;
  className?: string;
  task?: Task;
}

export const TaskTabSkeleton = memo(
  ({ tab, className, task }: TaskTabSkeletonProps): React.JSX.Element => {
    switch (tab) {
      case "solution":
        return <SolutionTabSkeleton task={task} className={className} />;
      case "materials":
        return <MaterialsTabSkeleton task={task} className={className} />;
      case "questions":
        return <QuestionsTabSkeleton task={task} className={className} />;
      case "checklist":
        return <ChecklistTabSkeleton task={task} className={className} />;
      case "candidate":
      default:
        return <CandidateTabSkeleton task={task} className={className} />;
    }
  }
);

TaskTabSkeleton.displayName = "TaskTabSkeleton";
