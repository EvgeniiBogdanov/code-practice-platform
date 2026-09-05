import React, { memo } from "react";
import { Play, CheckCircle, BookOpen, HelpCircle, ListChecks } from "lucide-react";
import { clsx } from "clsx";
import { Task, SectionType, TaskDifficultyBadge, TaskMetaBadges } from "@/entities/task";
import { getLoadedTaskById } from "@/entities/task/catalog";
import { useProgressStore, isTaskCompleted } from "@/entities/progress";
import { TaskReviewRatingBar, TaskExcludeButton } from "@/features/spaced-repetition";
import { TaskFavoriteButton } from "@/features/task-favorite";
import { UiSkeleton, NotificationBadge, TaskButton } from "@/shared/ui";
import { TaskTabSkeleton } from "./TaskTabSkeleton";
import styles from "./TaskPageSkeleton.module.css";

export interface TaskPageSkeletonProps {
  initialTab?: string;
  className?: string;
  taskId?: string | number;
  section?: SectionType;
  task?: Task;
}

export const TaskPageSkeleton = memo(
  ({
    initialTab = "candidate",
    className,
    taskId,
    section,
    task: propTask,
  }: TaskPageSkeletonProps): React.JSX.Element => {
    const resolvedTask = propTask ?? getLoadedTaskById(taskId, section);
    const completedTasks = useProgressStore((state) => state.completedTasks);
    const isCompleted = isTaskCompleted(
      resolvedTask ? completedTasks?.[String(resolvedTask.id)] : undefined
    );
    const isUnsolved =
      resolvedTask ? completedTasks?.[String(resolvedTask.id)] === "unsolved" : false;

    const questionsCount =
      resolvedTask?.questions?.length ||
      (resolvedTask as { interviewerQuestions?: unknown[] } | undefined)?.interviewerQuestions
        ?.length ||
      0;
    const checklistCount = resolvedTask?.checklist?.length || 0;

    const realTabs = [
      {
        id: "candidate",
        label: "Задача",
        icon: <Play size={14} className={styles.tabIcon} />,
      },
      {
        id: "solution",
        label: "Решение",
        icon: <CheckCircle size={14} className={styles.tabIcon} />,
      },
      {
        id: "materials",
        label: "Разбор и теория",
        icon: <BookOpen size={14} className={styles.tabIcon} />,
      },
      {
        id: "questions",
        label: "Вопросы",
        icon: <HelpCircle size={14} className={styles.tabIcon} />,
        badge: questionsCount > 0 ? questionsCount : undefined,
      },
      {
        id: "checklist",
        label: "Самопроверка",
        icon: <ListChecks size={14} className={styles.tabIcon} />,
        badge: checklistCount > 0 ? checklistCount : undefined,
      },
    ];

    return (
      <div
        className={clsx(styles.pageContainer, className)}
        role="status"
        aria-label="Загрузка страницы задачи"
      >
        <div className={styles.taskDetailCard}>
          {/* Top Title & Actions Header Row */}
          <div className={styles.taskHeaderRow}>
            {resolvedTask ? (
              <div className={styles.taskTitleContainer}>
                <h1 className={styles.taskDetailTitle}>
                  <span className={styles.taskDetailTitleText}>{resolvedTask.title}</span>
                  {resolvedTask.section !== "javascript" && resolvedTask.difficulty && (
                    <TaskDifficultyBadge
                      difficulty={resolvedTask.difficulty}
                      className={styles.titleBadge}
                    />
                  )}
                </h1>
                <TaskMetaBadges task={resolvedTask} />
              </div>
            ) : (
              <div className={styles.taskTitleContainer}>
                <div className={styles.titleRow}>
                  <UiSkeleton width="45%" height={32} radius={6} />
                  <UiSkeleton width={72} height={22} radius={4} />
                </div>

                <div className={styles.metaRow}>
                  <UiSkeleton width={110} height={20} radius={4} />
                  <UiSkeleton width={90} height={20} radius={4} />
                  <UiSkeleton width={80} height={20} radius={4} />
                </div>
              </div>
            )}

            {resolvedTask ? (
              <div className={styles.taskStatusActions}>
                <TaskFavoriteButton taskId={resolvedTask.id} taskTitle={resolvedTask.title} />
                <TaskExcludeButton taskId={resolvedTask.id} taskTitle={resolvedTask.title} />
                <TaskButton
                  statusVariant="solved"
                  isActive={isCompleted}
                  disabled
                >
                  Решено
                </TaskButton>
                <TaskButton
                  statusVariant="unsolved"
                  isActive={isUnsolved}
                  disabled
                >
                  Не решено
                </TaskButton>
              </div>
            ) : (
              <div className={styles.taskStatusActions}>
                <UiSkeleton width={32} height={32} radius={6} />
                <UiSkeleton width={32} height={32} radius={6} />
                <UiSkeleton width={88} height={32} radius={6} />
                <UiSkeleton width={96} height={32} radius={6} />
              </div>
            )}
          </div>

          {/* SM-2 Rating Bar */}
          {resolvedTask ? (
            <TaskReviewRatingBar taskId={resolvedTask.id} task={resolvedTask} />
          ) : (
            <UiSkeleton width="100%" height={38} radius={6} />
          )}

          {/* Единый контейнер вкладок и содержимого: ВСЕГДА СТАТИЧНЫЙ, НИКАКИХ ПЕРЕРИСОВОК ИЛИ СКЕЛЕТОНОВ */}
          <div className={styles.tabsContainer}>
            <div className={styles.tabsHeader} role="tablist">
              {realTabs.map((tab) => {
                const isActive = initialTab === tab.id;
                const tabModifier = styles[`tab_${tab.id}`];

                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={clsx(styles.tabLink, tabModifier, isActive && styles.tabActive)}
                  >
                    {tab.icon}
                    <span className={styles.tabLabel}>{tab.label}</span>
                    {tab.badge !== undefined && (
                      <NotificationBadge
                        count={tab.badge}
                        variant="neutral"
                        pinned={false}
                        ring={false}
                        size="tab"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <div className={styles.tabsContent}>
              <TaskTabSkeleton tab={initialTab} task={resolvedTask} />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

TaskPageSkeleton.displayName = "TaskPageSkeleton";
