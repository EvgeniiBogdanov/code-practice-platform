import React, { useCallback } from "react";
import { BellOff } from "lucide-react";
import { clsx, SquareButton, SquareButtonSize, Tooltip } from "@/shared/ui";
import { useReviewStore } from "@/entities/review";
import { useProgressStore } from "@/entities/progress";
import styles from "./TaskExcludeButton.module.css";

export interface TaskExcludeButtonProps {
  taskId: string | number;
  taskTitle?: string;
  size?: SquareButtonSize;
  iconSize?: 13 | 18;
  className?: string;
}

export const TaskExcludeButton = React.memo(
  ({
    taskId,
    taskTitle,
    size = "md",
    iconSize = 18,
    className,
  }: Readonly<TaskExcludeButtonProps>): React.JSX.Element => {
    const stringId = String(taskId);
    const isExcluded = useReviewStore((state) => state.excludedTaskIds.includes(stringId));
    const toggleExcludeTask = useReviewStore((state) => state.toggleExcludeTask);
    const removeReview = useReviewStore((state) => state.removeReview);
    const setTaskStatus = useProgressStore((state) => state.setTaskStatus);

    const tooltipText = isExcluded
      ? "Вернуть в интервальное повторение"
      : "Исключить из интервального повторения";

    const handleToggle = useCallback(
      async (event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
        event.preventDefault();
        event.stopPropagation();
        const willBeExcluded = !isExcluded;
        await toggleExcludeTask(taskId);
        if (willBeExcluded) {
          await setTaskStatus(taskId, null);
          await removeReview(taskId);
        }
      },
      [isExcluded, removeReview, setTaskStatus, taskId, toggleExcludeTask]
    );

    return (
      <Tooltip content={tooltipText} side="bottom" sideOffset={6} delayDuration={400}>
        <SquareButton
          size={size}
          variant="transparent"
          className={clsx(className, isExcluded && styles.buttonActive)}
          icon={
            <BellOff
              size={iconSize}
              className={clsx(styles.excludeIcon, isExcluded && styles.excludeIconActive)}
            />
          }
          onClick={handleToggle}
          aria-label={tooltipText}
          aria-pressed={isExcluded}
        />
      </Tooltip>
    );
  }
);

TaskExcludeButton.displayName = "TaskExcludeButton";
