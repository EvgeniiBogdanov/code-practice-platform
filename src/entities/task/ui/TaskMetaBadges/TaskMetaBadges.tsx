import React from "react";
import { clsx } from "clsx";
import { MetaRow, MetaBadge, Tooltip } from "@/shared/ui";
import { getJsTaskBadges } from "../../lib/getJsTaskBadges";
import { getAlgoTaskBadges } from "../../lib/getAlgoTaskBadges";
import type { Task } from "../../types";
import styles from "./TaskMetaBadges.module.css";

export interface TaskMetaBadgesProps {
  task: Task;
  className?: string;
  /** Extra badges from higher layers, shown after the task's own ones. */
  children?: React.ReactNode;
}

export const TaskMetaBadges = React.memo<TaskMetaBadgesProps>(
  ({ task, className, children }: TaskMetaBadgesProps): React.JSX.Element | null => {
    let badges = null;

    if (task.section === "javascript") {
      badges = getJsTaskBadges(task);
    } else if (task.section === "algorithms") {
      badges = getAlgoTaskBadges(task);
    }

    if (!badges?.length && !children) {
      return null;
    }

    return (
      <MetaRow className={clsx(styles.taskBadgesRow, className)}>
        {badges?.map((badge) => {
          const badgeNode = (
            <MetaBadge key={badge.id} variant={badge.variant} icon={badge.icon}>
              {badge.label}
            </MetaBadge>
          );

          if (badge.title) {
            return (
              <Tooltip key={badge.id} content={badge.title} side="bottom" sideOffset={6}>
                {badgeNode}
              </Tooltip>
            );
          }

          return badgeNode;
        })}
        {children}
      </MetaRow>
    );
  }
);

TaskMetaBadges.displayName = "TaskMetaBadges";
