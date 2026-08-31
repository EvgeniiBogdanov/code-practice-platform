import React from "react";
import { Star } from "lucide-react";
import { clsx } from "clsx";
import { useFavoriteTaskStore } from "@/entities/favorite-task";
import styles from "./TaskFavoriteMarker.module.css";

export interface TaskFavoriteMarkerProps {
  taskId: string | number;
  taskTitle: string;
  className?: string;
}

export const TaskFavoriteMarker = React.memo(
  ({
    taskId,
    taskTitle,
    className,
  }: Readonly<TaskFavoriteMarkerProps>): React.JSX.Element | null => {
    const isFavorite = useFavoriteTaskStore((state) =>
      state.favoriteTaskIds.includes(String(taskId))
    );

    if (!isFavorite) return null;

    return (
      <span
        className={clsx(styles.marker, className)}
        role="img"
        aria-label={`Задача «${taskTitle}» в избранном`}
        title="В избранном"
      >
        <Star size={13} fill="currentColor" />
      </span>
    );
  }
);

TaskFavoriteMarker.displayName = "TaskFavoriteMarker";
