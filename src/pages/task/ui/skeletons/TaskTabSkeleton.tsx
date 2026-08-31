import React, { memo } from "react";
import { CandidateTabSkeleton } from "./CandidateTabSkeleton";
import { SolutionTabSkeleton } from "./SolutionTabSkeleton";
import { MaterialsTabSkeleton } from "./MaterialsTabSkeleton";
import { QuestionsTabSkeleton } from "./QuestionsTabSkeleton";
import { ChecklistTabSkeleton } from "./ChecklistTabSkeleton";

export interface TaskTabSkeletonProps {
  tab: string;
  className?: string;
}

export const TaskTabSkeleton = memo(
  ({ tab, className }: TaskTabSkeletonProps): React.JSX.Element => {
    switch (tab) {
      case "solution":
        return <SolutionTabSkeleton className={className} />;
      case "materials":
        return <MaterialsTabSkeleton className={className} />;
      case "questions":
        return <QuestionsTabSkeleton className={className} />;
      case "checklist":
        return <ChecklistTabSkeleton className={className} />;
      case "candidate":
      default:
        return <CandidateTabSkeleton className={className} />;
    }
  }
);

TaskTabSkeleton.displayName = "TaskTabSkeleton";
