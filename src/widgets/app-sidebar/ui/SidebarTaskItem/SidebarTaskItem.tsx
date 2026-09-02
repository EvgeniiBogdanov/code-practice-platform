import React, { memo } from "react";
import { FileText, Check, X, RotateCcw } from "lucide-react";
import { clsx } from "clsx";
import { Tooltip, TreeNodeHeader } from "@/shared/ui";
import styles from "./SidebarTaskItem.module.css";

export interface SidebarTaskItemProps {
  id: string | number;
  to: string;
  params?: Record<string, string>;
  title: string;
  isActive: boolean;
  isSolved: boolean;
  isUnsolved: boolean;
  isDue: boolean;
  isExcluded?: boolean;
  difficulty?: string;
  reviewRating?: string;
  onClick?: () => void;
}

const getRatingClass = (
  isSolved: boolean,
  isUnsolved: boolean,
  _difficulty?: string,
  reviewRating?: string,
  isExcluded?: boolean
) => {
  if (isExcluded) return styles.taskTitleExcluded;
  if (reviewRating === "hard") return styles.ratingHard;
  if (reviewRating === "medium") return styles.ratingMedium;
  if (reviewRating === "easy") return styles.ratingEasy;

  if (isSolved) return styles.ratingSolved;
  if (isUnsolved) return styles.ratingUnsolved;
  return "";
};

export const SidebarTaskItem = memo(
  ({
    id,
    to,
    params,
    title,
    isActive,
    isSolved,
    isUnsolved,
    isDue,
    isExcluded = false,
    difficulty,
    reviewRating,
    onClick,
  }: SidebarTaskItemProps) => {
    const ratingClass = getRatingClass(isSolved, isUnsolved, difficulty, reviewRating, isExcluded);
    const tooltipText = isExcluded
      ? `${title} (Исключена из цикла повторений)`
      : isDue
        ? `${title} (Пора повторить!)`
        : title;

    return (
      <Tooltip content={tooltipText} side="right" sideOffset={10} fullWidth>
        <TreeNodeHeader
          id={`sidebar-task-${id}`}
          to={to}
          params={params}
          isActive={isActive}
          className={clsx(
            styles.sidebarTaskRow,
            !isExcluded && isDue && styles.taskIsDue,
            isExcluded && styles.taskRowExcluded
          )}
          onClick={onClick}
        >
          <div className={styles.taskTitleGroup}>
            <FileText size={16} className={styles.fileIcon} />
            <span className={clsx(styles.taskTitleText, ratingClass)}>
              {title}
            </span>
          </div>

          {!isExcluded && (
            isDue ? (
              <span className={styles.statusIconDue} aria-label="Пора повторить сегодня!">
                <RotateCcw size={11} />
              </span>
            ) : isSolved ? (
              <span className={styles.statusIconSolved} aria-label="Решено">
                <Check size={14} />
              </span>
            ) : isUnsolved ? (
              <span className={styles.statusIconUnsolved} aria-label="Не решено">
                <X size={14} />
              </span>
            ) : null
          )}
        </TreeNodeHeader>
      </Tooltip>
    );
  }
);

SidebarTaskItem.displayName = "SidebarTaskItem";
