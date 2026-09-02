import React from "react";
import { clsx } from "clsx";
import { MetaRow, MetaBadge, Tooltip } from "@/shared/ui";
import { getJsTaskBadges } from "../../lib/get-js-task-badges";
import { getAlgoTaskBadges } from "../../lib/get-algo-task-badges";
import type { Task } from "../../types";
import styles from "./TaskMetaBadges.module.css";

export interface TaskMetaBadgesProps {
  task: Task;
  className?: string;
}

export const TaskMetaBadges = React.memo<TaskMetaBadgesProps>(
  ({ task, className }: TaskMetaBadgesProps): React.JSX.Element | null => {
    let badges = null;

    if (task.section === "javascript") {
      badges = getJsTaskBadges(task);
    } else if (task.section === "algorithms") {
      badges = getAlgoTaskBadges(task);
    }

    if (!badges || badges.length === 0) {
      return null;
    }

    return (
      <MetaRow className={clsx(styles.taskBadgesRow, className)}>
        {badges.map((badge) => {
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
      </MetaRow>
    );
  }
);

TaskMetaBadges.displayName = "TaskMetaBadges";
