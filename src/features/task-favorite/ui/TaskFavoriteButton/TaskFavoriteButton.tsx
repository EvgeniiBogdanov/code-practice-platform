import React, { useCallback } from "react";
import { Star } from "lucide-react";
import { clsx } from "clsx";
import { useFavoriteTaskStore } from "@/entities/favorite-task";
import { SquareButton, SquareButtonSize, Tooltip } from "@/shared/ui";
import styles from "./TaskFavoriteButton.module.css";

export interface TaskFavoriteButtonProps {
  taskId: string | number;
  taskTitle: string;
  size?: SquareButtonSize;
  iconSize?: 13 | 18;
  className?: string;
}

export const TaskFavoriteButton = React.memo(
  ({
    taskId,
    taskTitle,
    size = "md",
    iconSize = 18,
    className,
  }: Readonly<TaskFavoriteButtonProps>): React.JSX.Element => {
    const isFavorite = useFavoriteTaskStore((state) =>
      state.favoriteTaskIds.includes(String(taskId))
    );
    const toggleFavoriteTask = useFavoriteTaskStore((state) => state.toggleFavoriteTask);
    const label = isFavorite
      ? "Убрать из избранного"
      : "Добавить в избранное";
    const handleToggleFavorite = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>): void => {
        event.preventDefault();
        event.stopPropagation();
        toggleFavoriteTask(taskId);
      },
      [taskId, toggleFavoriteTask]
    );

    return (
      <Tooltip content={label} side="bottom" sideOffset={6}>
        <SquareButton
          size={size}
          variant="transparent"
          className={className}
          icon={
            <Star
              size={iconSize}
              fill={isFavorite ? "currentColor" : "none"}
              className={clsx(styles.favoriteIcon, isFavorite && styles.favoriteIconActive)}
            />
          }
          onClick={handleToggleFavorite}
          aria-label={label}
          aria-pressed={isFavorite}
        />
      </Tooltip>
    );
  }
);

TaskFavoriteButton.displayName = "TaskFavoriteButton";
