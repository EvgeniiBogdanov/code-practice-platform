import React, { memo } from "react";
import { clsx } from "clsx";
import { UiSkeleton } from "@/shared/ui";
import { CodeEditorSkeleton } from "./CodeEditorSkeleton";
import styles from "./TaskTabSkeleton.module.css";

export interface CandidateTabSkeletonProps {
  className?: string;
}

export const CandidateTabSkeleton = memo(
  ({ className }: CandidateTabSkeletonProps): React.JSX.Element => {
    return (
      <div className={clsx(styles.container, className)}>
        {/* Top button element matching top toggle bar with exact bottom margin */}
        <div className={styles.variantsRow}>
          <div className={styles.variantBtn}>
            <UiSkeleton width={130} height={12} radius={3} />
          </div>
        </div>

        {/* Code Editor Skeleton */}
        <CodeEditorSkeleton />
      </div>
    );
  }
);

CandidateTabSkeleton.displayName = "CandidateTabSkeleton";
