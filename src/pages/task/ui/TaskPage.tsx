import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Play, CheckCircle, BookOpen, HelpCircle, ListChecks } from "lucide-react";
import { clsx } from "clsx";
import { TaskDifficultyBadge, TaskMetaBadges } from "@/entities/task";
import type { SectionType } from "@/entities/task/meta";
import { useTaskById } from "@/entities/task/catalog";
import { useProgressStore, isTaskCompleted } from "@/entities/progress";
import { useReviewStore } from "@/entities/review";
import { TaskReviewRatingBar, TaskExcludeButton } from "@/features/spaced-repetition";
import { TaskFavoriteButton } from "@/features/task-favorite";
import {
  TaskButton,
  NotificationBadge,
  NotificationBadgeVariant,
  Tooltip,
  UiSkeleton,
} from "@/shared/ui";
import { TaskTabSkeleton } from "./skeletons";
import { CandidateTab } from "./CandidateTab";
import { SolutionTab } from "./SolutionTab";
import { ChecklistTab } from "./ChecklistTab";
import { MaterialsTab } from "./MaterialsTab";
import { QuestionsTab } from "./QuestionsTab";
import styles from "./TaskPage.module.css";



export interface TaskPageProps {
  taskId: string;
  section: SectionType;
  initialTab?: string;
}

export const TaskPage = React.memo<TaskPageProps>(
  ({ taskId, section, initialTab }: TaskPageProps): React.JSX.Element => {
    const navigate = useNavigate();
    const { task, isLoading } = useTaskById(taskId, section);
    const [activeTab, setActiveTab] = useState(initialTab || "candidate");

    const completedTasks = useProgressStore((state) => state.completedTasks);
    const setTaskStatus = useProgressStore((state) => state.setTaskStatus);
    const removeReview = useReviewStore((state) => state.removeReview);
    const excludedTaskIds = useReviewStore((state) => state.excludedTaskIds);

    useEffect(() => {
      if (initialTab) {
        setActiveTab(initialTab);
      }
    }, [initialTab, taskId]);

    if (!isLoading && !task) {
      return (
        <div className={styles.notFound}>
          <h2>Задача #{taskId} не найдена</h2>
          <p>Возможно, задача была переименована или перемещена.</p>
          <Link to="/" className={styles.notFoundLink}>
            Вернуться на главную
          </Link>
        </div>
      );
    }

    const handleTabChange = (tabId: string) => {
      setActiveTab(tabId);
      navigate({
        to: ".",
        search: (prev: Record<string, unknown>) => ({ ...prev, tab: tabId }),
        replace: true,
      });
    };

    const isCompleted = task ? isTaskCompleted(completedTasks?.[String(task.id)]) : false;
    const isUnsolved = task ? completedTasks?.[String(task.id)] === "unsolved" : false;
    const isExcluded = task ? excludedTaskIds.includes(String(task.id)) : false;

    const handleToggleSolved = async () => {
      if (!task || isExcluded) return;
      const nextStatus = isCompleted ? null : "solved";
      await setTaskStatus(task.id, nextStatus);
      if (!nextStatus) {
        await removeReview(task.id);
      }
    };

    const handleToggleUnsolved = async () => {
      if (!task || isExcluded) return;
      const nextStatus = isUnsolved ? null : "unsolved";
      await setTaskStatus(task.id, nextStatus);
      if (nextStatus) {
        await removeReview(task.id);
      }
    };

    const questionsCount =
      task?.questions?.length ||
      (task as { interviewerQuestions?: unknown[] } | undefined)?.interviewerQuestions?.length ||
      0;
    const checklistCount = task?.checklist?.length || 0;

    const tabs: Array<{
      id: string;
      label: string;
      icon: React.ReactNode;
      badge?: number;
      badgeVariant?: NotificationBadgeVariant;
    }> = [
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
        badgeVariant: "neutral",
      },
      {
        id: "checklist",
        label: "Самопроверка",
        icon: <ListChecks size={14} className={styles.tabIcon} />,
        badge: checklistCount > 0 ? checklistCount : undefined,
        badgeVariant: "neutral",
      },
    ];

    return (
      <div className={styles.pageContainer}>
        <div className={styles.taskDetailCard}>
          {/* Заголовок задачи и кнопки статуса */}
          <div className={styles.taskHeaderRow}>
            {task ? (
              <div className={styles.taskTitleContainer}>
                <h1 className={styles.taskDetailTitle}>
                  <span className={styles.taskDetailTitleText}>{task.title}</span>
                  {task.section !== "javascript" && task.difficulty && (
                    <TaskDifficultyBadge difficulty={task.difficulty} className={styles.titleBadge} />
                  )}
                </h1>
                <TaskMetaBadges task={task} />
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

            <div className={styles.taskStatusActions}>
              {task ? (
                <>
                  <TaskFavoriteButton taskId={task.id} taskTitle={task.title} />
                  <TaskExcludeButton taskId={task.id} taskTitle={task.title} />

                  <Tooltip
                    content={
                      isExcluded
                        ? "Задача исключена из цикла повторений"
                        : isCompleted
                          ? "Нажмите повторно, чтобы снять отметку"
                          : "Пометить как решённую"
                    }
                    side="top"
                  >
                    <TaskButton
                      statusVariant="solved"
                      isActive={isCompleted}
                      onClick={handleToggleSolved}
                      disabled={isExcluded}
                    >
                      Решено
                    </TaskButton>
                  </Tooltip>

                  <Tooltip
                    content={
                      isExcluded
                        ? "Задача исключена из цикла повторений"
                        : isUnsolved
                          ? "Нажмите повторно, чтобы снять отметку"
                          : "Пометить как нерешённую"
                    }
                    side="top"
                  >
                    <TaskButton
                      statusVariant="unsolved"
                      isActive={isUnsolved}
                      onClick={handleToggleUnsolved}
                      disabled={isExcluded}
                    >
                      Не решено
                    </TaskButton>
                  </Tooltip>
                </>
              ) : (
                <>
                  <UiSkeleton width={32} height={32} radius={6} />
                  <UiSkeleton width={32} height={32} radius={6} />
                  <UiSkeleton width={88} height={32} radius={6} />
                  <UiSkeleton width={96} height={32} radius={6} />
                </>
              )}
            </div>
          </div>

          {/* Шкала интервального повторения SM-2 */}
          {task ? (
            <TaskReviewRatingBar taskId={task.id} task={task} />
          ) : (
            <UiSkeleton width="100%" height={38} radius={6} />
          )}

          {/* Единый контейнер вкладок и содержимого: ВСЕГДА СТАТИЧНЫЙ, НИКАКИХ ПЕРЕРИСОВОК ИЛИ СКЕЛЕТОНОВ */}
          <div className={styles.tabsContainer}>
            <div className={styles.tabsHeader} role="tablist">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const tabModifier = styles[`tab_${tab.id}`];

                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={clsx(styles.tabLink, tabModifier, isActive && styles.tabActive)}
                    onClick={() => handleTabChange(tab.id)}
                  >
                    {tab.icon}
                    <span className={styles.tabLabel}>{tab.label}</span>
                    {tab.badge !== undefined && (
                      <NotificationBadge
                        count={tab.badge}
                        variant={tab.badgeVariant || "neutral"}
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
              {!task ? (
                <TaskTabSkeleton tab={activeTab} />
              ) : (
                <React.Suspense fallback={<TaskTabSkeleton tab={activeTab} task={task} />}>
                  {activeTab === "candidate" && <CandidateTab task={task} />}
                  {activeTab === "solution" && <SolutionTab task={task} />}
                  {activeTab === "materials" && <MaterialsTab task={task} />}
                  {activeTab === "questions" && <QuestionsTab task={task} />}
                  {activeTab === "checklist" && <ChecklistTab task={task} />}
                </React.Suspense>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

TaskPage.displayName = "TaskPage";
