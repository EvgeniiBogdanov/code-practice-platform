import React, { memo } from "react";
import { clsx } from "clsx";
import { Task } from "@/entities/task";
import { UiSkeleton } from "@/shared/ui";
import { ChecklistTab } from "../ChecklistTab";
import checklistStyles from "../ChecklistTab/ChecklistTab.module.css";

export interface ChecklistTabSkeletonProps {
  task?: Task;
  className?: string;
}

export const ChecklistTabSkeleton = memo(
  ({ task, className }: ChecklistTabSkeletonProps): React.JSX.Element => {
    if (task) {
      return <ChecklistTab task={task} className={className} />;
    }

    return (
      <div className={clsx(checklistStyles.container, className)}>
        <div className={checklistStyles.header}>
          <div>
            <h3 className={checklistStyles.title}>📋 Самопроверка</h3>
            <p className={checklistStyles.subtitle}>
              Убедитесь, что ваше решение соответствует ключевым требованиям задачи и современным
              лучшим практикам.
            </p>
          </div>
          <div className={checklistStyles.scoreBadge}>
            <UiSkeleton width={80} height={14} radius={3} />
          </div>
        </div>
      </div>
    );
  }
);

ChecklistTabSkeleton.displayName = "ChecklistTabSkeleton";


