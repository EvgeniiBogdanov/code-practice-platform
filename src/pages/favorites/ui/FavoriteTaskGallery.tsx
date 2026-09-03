import React from "react";
import { Link } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { clsx } from "clsx";
import type { ReviewItem } from "@/entities/review";
import { Task, getTaskRoute } from "@/entities/task";
import { TaskFavoriteButton } from "@/features/task-favorite";
import { getTaskRowTone } from "@/features/task-table";
import { Card } from "@/shared/ui";
import { getFavoriteFolderVisual } from "../lib/get-favorite-folder-visual";
import { FavoriteTaskStatus as TaskStatus } from "../model/use-favorites-page";
import { FavoriteTaskStatus } from "./FavoriteTaskStatus";
import styles from "./FavoritesPage.module.css";

export interface FavoriteTaskGalleryProps {
  tasks: Task[];
  getTaskStatus: (taskId: string | number) => TaskStatus;
  getTaskIsDue: (taskId: string | number) => boolean;
  reviews?: Record<string, ReviewItem>;
  excludedTaskIds?: readonly string[];
}

const getTaskLocation = (task: Task): string => {
  return [task.group || task.category, task.subgroup].filter(Boolean).join(" / ");
};

export const FavoriteTaskGallery = ({
  tasks,
  getTaskStatus,
  getTaskIsDue,
  reviews = {},
  excludedTaskIds = [],
}: Readonly<FavoriteTaskGalleryProps>): React.JSX.Element => (
  <div className={styles.gallery}>
    {tasks.map((task) => {
      const isExcluded = excludedTaskIds.includes(String(task.id));
      const status = getTaskStatus(task.id);
      const isDue = !isExcluded && getTaskIsDue(task.id);
      const folderTitle = task.group || task.category || "Без папки";
      const folderVisual = getFavoriteFolderVisual(task.section, folderTitle, 14);
      const taskReview = reviews[String(task.id)] || reviews[task.id];
      const tone = getTaskRowTone(task, status, taskReview, isExcluded);

      return (
        <Card
          key={task.id}
          className={clsx(
            styles.galleryCard,
            styles[`tone_${tone}`],
            isExcluded && styles.galleryCardExcluded
          )}
          variant="interactive"
        >
          <Link
            to={getTaskRoute(task)}
            params={{ taskId: String(task.id) }}
            className={styles.galleryLink}
          >
            <span className={styles.galleryLocation}>
              {folderVisual.icon}
              <span>{getTaskLocation(task)}</span>
            </span>
            <span className={styles.galleryTitle}>
              <FileText
                size={17}
                className={clsx(styles.fileIcon, isExcluded && styles.fileIconExcluded)}
              />
              <span
                className={clsx(
                  styles.galleryTitleText,
                  isExcluded && styles.galleryTitleTextExcluded
                )}
              >
                {task.title}
              </span>
            </span>
            {task.desc ? <span className={styles.galleryDescription}>{task.desc}</span> : null}
            <FavoriteTaskStatus status={status} isDue={isDue} isExcluded={isExcluded} showLabel />
          </Link>
          <TaskFavoriteButton
            taskId={task.id}
            taskTitle={task.title}
            size="sm"
            iconSize={13}
            className={styles.galleryFavoriteAction}
          />
        </Card>
      );
    })}
  </div>
);
