import React, { memo } from "react";
import { clsx } from "clsx";
import { Task } from "@/entities/task";
import { UiSkeleton, MetaRow } from "@/shared/ui";
import materialsStyles from "../MaterialsTab/MaterialsTab.module.css";

export interface MaterialsTabSkeletonProps {
  task?: Task;
  className?: string;
}

export const MaterialsTabSkeleton = memo(
  ({ task, className }: MaterialsTabSkeletonProps): React.JSX.Element => {
    const hasArticles = Boolean(task?.articles && task.articles.length > 0);

    return (
      <div className={clsx(materialsStyles.container, className)}>
        <article className={materialsStyles.articlePage}>
          {/* Article Header with precision skeletons matching UI elements 1:1 */}
          <header className={materialsStyles.header}>
            {task ? (
              <h1 className={materialsStyles.title}>Разбор решения: {task.title}</h1>
            ) : (
              <UiSkeleton width="55%" height={31} radius={6} />
            )}

            <MetaRow>
              <UiSkeleton width={112} height={22} radius={8} />
              <UiSkeleton width={102} height={22} radius={8} />
              {(!task || hasArticles) && (
                <UiSkeleton width={198} height={22} radius={8} />
              )}
            </MetaRow>
          </header>

          <hr className={materialsStyles.divider} />

          {/* Article Markdown Content on transparent background */}
          <div className={materialsStyles.content}>
            <UiSkeleton lines={3} height={16} radius={3} />
            <UiSkeleton lines={4} height={16} radius={3} />
            <UiSkeleton lines={2} height={16} radius={3} />
            <UiSkeleton lines={3} height={16} radius={3} />
          </div>
        </article>
      </div>
    );
  }
);

MaterialsTabSkeleton.displayName = "MaterialsTabSkeleton";

