import React, { memo } from "react";
import { clsx } from "clsx";
import { UiSkeleton } from "@/shared/ui";
import { CodeEditorSkeleton } from "./CodeEditorSkeleton";
import styles from "./TaskTabSkeleton.module.css";

export interface SolutionTabSkeletonProps {
  className?: string;
}

export const SolutionTabSkeleton = memo(
  ({ className }: SolutionTabSkeletonProps): React.JSX.Element => {
    return (
      <div className={clsx(styles.container, className)}>
        {/* Solution Variant Row with a single clean variant button skeleton */}
        <div className={styles.variantsRow}>
          <div className={styles.variantBtn}>
            <UiSkeleton width={140} height={12} radius={3} />
          </div>
        </div>

        {/* Code Editor Skeleton */}
        <CodeEditorSkeleton />
      </div>
    );
  }
);

SolutionTabSkeleton.displayName = "SolutionTabSkeleton";
