import React, { memo } from "react";
import { clsx } from "clsx";
import { UiSkeleton } from "@/shared/ui";
import styles from "./TaskTabSkeleton.module.css";

export interface MaterialsTabSkeletonProps {
  className?: string;
}

export const MaterialsTabSkeleton = memo(
  ({ className }: MaterialsTabSkeletonProps): React.JSX.Element => {
    return (
      <div className={clsx(styles.container, className)}>
        <article className={styles.articlePage}>
          {/* Article Header */}
          <div className={styles.articleHeader}>
            <UiSkeleton width="55%" height={26} radius={4} />

            {/* Meta Badges Row */}
            <div className={styles.articleMetaRow}>
              <UiSkeleton width={120} height={22} radius={4} />
              <UiSkeleton width={100} height={22} radius={4} />
              <UiSkeleton width={190} height={22} radius={4} />
            </div>
          </div>

          <hr className={styles.divider} />

          {/* Article Markdown Content with uniform background */}
          <div className={styles.articleContent}>
            {/* Paragraph 1 */}
            <UiSkeleton lines={3} height={15} />

            {/* Code block snippet */}
            <div className={styles.codeSnippetBlock}>
              <UiSkeleton width="35%" height={13} radius={3} />
              <UiSkeleton width="65%" height={13} radius={3} />
              <UiSkeleton width="50%" height={13} radius={3} />
              <UiSkeleton width="25%" height={13} radius={3} />
            </div>

            {/* Paragraph 2 */}
            <UiSkeleton lines={2} height={15} />

            {/* Callout box */}
            <div className={styles.calloutBlock}>
              <UiSkeleton width={210} height={16} radius={4} />
              <UiSkeleton lines={2} height={13} />
            </div>
          </div>
        </article>
      </div>
    );
  }
);

MaterialsTabSkeleton.displayName = "MaterialsTabSkeleton";
