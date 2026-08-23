import React from "react";
import { Link } from "@tanstack/react-router";
import { FileText, Folder, Check, X, RotateCcw, Minus, Calendar } from "lucide-react";
import { Task } from "@/entities/task";
import { getGroupCompletionClass } from "@/entities/review";
import {
  NodeCount,
  TreeToggleIcon,
  TreeNodeHeader,
  TaskListWrapper,
  Button,
  Badge,
} from "@/shared/ui";
import styles from "./GroupOverviewPage.module.css";

export interface GroupTaskListProps {
  tasks: Task[];
  groupedSubgroups: Record<string, Task[]>;
  hasSubgroups: boolean;
  groupName?: string;
  folderColor?: string;
  isSubgroupOpen: (subName: string) => boolean;
  toggleSubgroup: (subName: string) => void;
  taskRoute: string;
  getTaskStatus: (taskId: string | number) => "solved" | "unsolved" | "unstarted";
  getTaskGradientClass: (
    task: Task,
    status: "solved" | "unsolved" | "unstarted",
    taskReview: unknown
  ) => string;
  formatLastSolved: (timestamp?: number | string | null) => string | null;
  formatNextReviewDate: (timestamp?: number | string | null) => string | null;
  isTaskDue: (review: unknown) => boolean;
  reviews: Record<string, any>;
  completedTasks: Record<string, string>;
  onResetFilter: () => void;
}

export const GroupTaskList = React.memo(
  ({
    tasks,
    groupedSubgroups,
    hasSubgroups,
    groupName = "",
    folderColor,
    isSubgroupOpen,
    toggleSubgroup,
    taskRoute,
    getTaskStatus,
    getTaskGradientClass,
    formatLastSolved,
    formatNextReviewDate,
    isTaskDue,
    reviews,
    completedTasks,
    onResetFilter,
  }: GroupTaskListProps) => {
    if (tasks.length === 0) {
      return (
        <div className={styles.emptyState}>
          <div className={styles.emptyTitle}>Задач по выбранному фильтру нет</div>
          <Button onClick={onResetFilter}>Показать все задачи</Button>
        </div>
      );
    }

    const renderTaskRow = (task: Task) => {
      const s = getTaskStatus(task.id);
      const taskReview = reviews[String(task.id)] || reviews[task.id];
      const lastReviewedAt = taskReview?.lastReviewedAt;
      const nextReviewAt = taskReview?.nextReviewAt;
      const isDue = isTaskDue(taskReview);
      const gradientClass = getTaskGradientClass(task, s, taskReview);

      return (
        <TreeNodeHeader
          key={task.id}
          to={taskRoute}
          params={{ taskId: String(task.id) }}
          className={[styles.treeTaskBtn, gradientClass].filter(Boolean).join(" ")}
        >
          <span className={styles.taskBtnTitle}>
            <FileText size={16} className={styles.nodeFileIcon} />
            <span className={styles.taskBtnText}>{task.title}</span>
          </span>

          <div className={styles.taskRowMeta}>
            {/* Last Solved Date */}
            <div className={styles.dbColLastSolved}>
              {lastReviewedAt ? (
                <Badge
                  variant="gray"
                  size="sm"
                  uppercase={false}
                  icon={<Calendar size={11} />}
                  title={`Дата последнего решения: ${new Date(lastReviewedAt).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}`}
                >
                  {formatLastSolved(lastReviewedAt)}
                </Badge>
              ) : (
                <span className={styles.statusUnstarted} title="Ещё не решалась">
                  <Minus size={13} />
                </span>
              )}
            </div>

            {/* Next Review Badge */}
            <div className={styles.dbColNextReview}>
              {isDue ? (
                <Badge
                  variant="yellow"
                  size="sm"
                  uppercase={false}
                  icon={<RotateCcw size={11} />}
                  title="Срок повторения подошел! Пора повторить сегодня"
                >
                  Пора повторить
                </Badge>
              ) : nextReviewAt ? (
                <Badge
                  variant="blue"
                  size="sm"
                  uppercase={false}
                  icon={<RotateCcw size={11} />}
                  title={`Следующее повторение: ${formatNextReviewDate(nextReviewAt)}`}
                >
                  {formatNextReviewDate(nextReviewAt)}
                </Badge>
              ) : (
                <span className={styles.statusUnstarted} title="Повторение не запланировано">
                  <Minus size={13} />
                </span>
              )}
            </div>

            {/* Status Icon */}
            <span className={styles.dbColStatus}>
              {isDue ? (
                <span className={styles.statusDue} title="Пора повторить!">
                  <RotateCcw size={13} />
                </span>
              ) : s === "solved" ? (
                <span className={styles.statusSolved} title="Решено">
                  <Check size={13} />
                </span>
              ) : s === "unsolved" ? (
                <span className={styles.statusUnsolved} title="Не решено">
                  <X size={13} />
                </span>
              ) : (
                <span className={styles.statusUnstarted} title="Не начато">
                  <Minus size={13} />
                </span>
              )}
            </span>
          </div>
        </TreeNodeHeader>
      );
    };

    return (
      <div className={styles.folderPageTree}>
        {/* DB Column Headers */}
        <div className={styles.dbColumnsHeader}>
          <span className={styles.dbColName}>Папка / Файл</span>
          <div className={styles.dbColMeta}>
            <span className={styles.dbColLastSolved}>Решение</span>
            <span className={styles.dbColNextReview}>Повторение</span>
            <span className={styles.dbColStatus}>Статус</span>
          </div>
        </div>

        {hasSubgroups ? (
          Object.entries(groupedSubgroups).map(([subgroupName, subTasks]) => {
            if (subTasks.length === 0) return null;
            const isOpen = isSubgroupOpen(subgroupName);
            const completedSubCount = subTasks.filter(
              (t) => getTaskStatus(t.id) === "solved"
            ).length;
            const completionClass = getGroupCompletionClass(subTasks, reviews, completedTasks);
            const subgroupId = `subgroup-${groupName}-${subgroupName}`;

            return (
              <div className={styles.treeGroupBlock} key={`${groupName || ""}-${subgroupName}`}>
                <TreeNodeHeader className={styles.subgroupHeader}>
                  <TreeToggleIcon
                    icon={
                      <Folder
                        size={17}
                        className={styles.folderIcon}
                        style={{ color: folderColor }}
                      />
                    }
                    size="md"
                    expanded={isOpen}
                    onToggle={() => toggleSubgroup(subgroupName)}
                  />

                  <Link
                    to={taskRoute}
                    params={{ taskId: subgroupId }}
                    className={styles.nodeTitleLink}
                    title={`Открыть раздел «${subgroupName}»`}
                  >
                    <span className={styles.nodeTitle}>{subgroupName}</span>
                  </Link>

                  <NodeCount
                    completed={completedSubCount}
                    total={subTasks.length}
                    completedClass={completionClass}
                  />
                </TreeNodeHeader>

                <TaskListWrapper expanded={isOpen} className={styles.treeTasksContainer}>
                  {subTasks.map(renderTaskRow)}
                </TaskListWrapper>
              </div>
            );
          })
        ) : (
          <div className={styles.folderPageTree}>{tasks.map(renderTaskRow)}</div>
        )}
      </div>
    );
  }
);

GroupTaskList.displayName = "GroupTaskList";
