import React, { useCallback } from "react";
import { BellOff } from "lucide-react";
import { clsx, SquareButton, SquareButtonSize, Tooltip } from "@/shared/ui";
import { useReviewStore } from "@/entities/review";
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
    const isExcluded = useReviewStore((state) =>
      state.excludedTaskIds.includes(stringId)
    );
    const toggleExcludeTask = useReviewStore((state) => state.toggleExcludeTask);

    const tooltipText = isExcluded
      ? "Вернуть в интервальное повторение"
      : "Исключить из интервального повторения";

    const handleToggle = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>): void => {
        event.preventDefault();
        event.stopPropagation();
        toggleExcludeTask(taskId);
      },
      [taskId, toggleExcludeTask]
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
