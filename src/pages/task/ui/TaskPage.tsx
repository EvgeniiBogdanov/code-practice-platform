import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Play, CheckCircle, BookOpen, HelpCircle, ListChecks } from "lucide-react";
import { clsx } from "clsx";
import { TaskDifficultyBadge } from "@/entities/task";
import type { SectionType } from "@/entities/task/meta";
import { useTaskById } from "@/entities/task/catalog";
import { useProgressStore, isTaskCompleted } from "@/entities/progress";
import { useReviewStore } from "@/entities/review";
import { TaskReviewRatingBar } from "@/features/spaced-repetition";
import { TaskFavoriteButton } from "@/features/task-favorite";
import { TaskButton, NotificationBadge, NotificationBadgeVariant, UiLoader } from "@/shared/ui";
import { CandidateTab } from "./CandidateTab";
import { SolutionTab } from "./SolutionTab";
import { MaterialsTab } from "./MaterialsTab";
import { ChecklistTab } from "./ChecklistTab";
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

    useEffect(() => {
      if (initialTab) {
        setActiveTab(initialTab);
      }
    }, [initialTab, taskId]);

    if (isLoading) {
      return <UiLoader center={true} size="lg" label="Загружаем задачу" />;
    }

    if (!task) {
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

    const isCompleted = isTaskCompleted(completedTasks[String(task.id)]);
    const isUnsolved = completedTasks[String(task.id)] === "unsolved";

    const handleToggleSolved = async () => {
      const nextStatus = isCompleted ? null : "solved";
      await setTaskStatus(task.id, nextStatus);
      if (!nextStatus) {
        await removeReview(task.id);
      }
    };

    const handleToggleUnsolved = async () => {
      const nextStatus = isUnsolved ? null : "unsolved";
      await setTaskStatus(task.id, nextStatus);
      if (nextStatus) {
        await removeReview(task.id);
      }
    };

    const questionsCount =
      task.questions?.length ||
      (task as { interviewerQuestions?: unknown[] }).interviewerQuestions?.length ||
      0;
    const checklistCount = task.checklist?.length || 0;

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
            <div className={styles.taskTitleContainer}>
              <h1 className={styles.taskDetailTitle}>
                <span className={styles.taskDetailTitleText}>{task.title}</span>
                {task.section !== "javascript" && task.difficulty && (
                  <TaskDifficultyBadge difficulty={task.difficulty} className={styles.titleBadge} />
                )}
              </h1>
            </div>

            <div className={styles.taskStatusActions}>
              <TaskFavoriteButton taskId={task.id} taskTitle={task.title} />

              <TaskButton
                statusVariant="solved"
                isActive={isCompleted}
                onClick={handleToggleSolved}
                title={
                  isCompleted ? "Нажмите повторно, чтобы снять отметку" : "Пометить как решённую"
                }
              >
                Решено
              </TaskButton>

              <TaskButton
                statusVariant="unsolved"
                isActive={isUnsolved}
                onClick={handleToggleUnsolved}
                title={
                  isUnsolved ? "Нажмите повторно, чтобы снять отметку" : "Пометить как нерешённую"
                }
              >
                Не решено
              </TaskButton>
            </div>
          </div>

          {/* Шкала интервального повторения SM-2 */}
          <TaskReviewRatingBar taskId={task.id} />

          {/* Единый контейнер вкладок и содержимого */}
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
              {activeTab === "candidate" && <CandidateTab task={task} />}
              {activeTab === "solution" && <SolutionTab task={task} />}
              {activeTab === "materials" && <MaterialsTab task={task} />}
              {activeTab === "questions" && <QuestionsTab task={task} />}
              {activeTab === "checklist" && <ChecklistTab task={task} />}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

TaskPage.displayName = "TaskPage";
