import React, { memo } from "react";
import { Task } from "@/entities/task";
import { CandidateTab } from "../CandidateTab";

export interface CandidateTabSkeletonProps {
  task?: Task;
  className?: string;
}

export const CandidateTabSkeleton = memo(
  ({ task, className }: CandidateTabSkeletonProps): React.JSX.Element => {
    return <CandidateTab task={task} className={className} />;
  }
);

CandidateTabSkeleton.displayName = "CandidateTabSkeleton";
