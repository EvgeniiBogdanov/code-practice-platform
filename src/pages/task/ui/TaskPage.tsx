import React, { useDeferredValue, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Play,
  CheckCircle,
  BookOpen,
  HelpCircle,
  ListChecks,
  Box,
  NotebookPen,
} from "lucide-react";
import { clsx } from "clsx";
import { TaskDifficultyBadge, TaskMetaBadges } from "@/entities/task";
import type { SectionType } from "@/entities/task/meta";
import { useTaskById } from "@/entities/task/catalog";
import { useProgressStore, isTaskCompleted } from "@/entities/progress";
import { useReviewStore } from "@/entities/review";
import { TaskReviewRatingBar, TaskExcludeButton } from "@/features/spaced-repetition";
import { TaskFavoriteButton } from "@/features/task-favorite";
import { TaskNotes } from "@/features/task-notes";
import { activateCodeHistoryTask } from "@/features/code-editor";
import { preloadTaskVisualization } from "@/widgets/task-visualization";
import { hasAlgorithmVisualization } from "@/entities/algorithm-trace";
import {
  KeepAlivePane,
  TaskButton,
  NotificationBadge,
  NotificationBadgeVariant,
  Tooltip,
  UiSkeleton,
} from "@/shared/ui";
import { TaskTabSkeleton } from "./skeletons";
import { TaskVisualizationTab } from "./TaskVisualizationTab";
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

interface TaskPageViewProps extends TaskPageProps {
  /** A newer task is being prepared; this one is still on screen. */
  isPending: boolean;
}

const TaskPageView = React.memo<TaskPageViewProps>(
  ({ taskId, section, initialTab, isPending }: TaskPageViewProps): React.JSX.Element => {
    const navigate = useNavigate();
    const { task, isLoading } = useTaskById(taskId, section);
    const [requestedTab, setActiveTab] = useState(initialTab || "candidate");
    const hasVisualization = hasAlgorithmVisualization(taskId, section);
    const activeTab =
      requestedTab === "visualization" && !hasVisualization ? "candidate" : requestedTab;

    // LeetCode-style tabs: a visited tab stays mounted and is only hidden, so switching back
    // is instant and keeps editor state (no remount, no reload of stored code).
    const [visited, setVisited] = useState({ taskId, tabs: new Set([activeTab]) });
    if (visited.taskId !== taskId || !visited.tabs.has(activeTab)) {
      setVisited({
        taskId,
        tabs: new Set(visited.taskId === taskId ? [...visited.tabs, activeTab] : [activeTab]),
      });
    }
    const renderKeptTab = (tab: string, content: React.ReactNode): React.ReactNode =>
      (tab === activeTab || (visited.taskId === taskId && visited.tabs.has(tab))) && (
        // Keyed by task: a tab always starts from its own task's state, never from the previous one's.
        <KeepAlivePane key={`${taskId}:${tab}`} isActive={tab === activeTab}>
          {content}
        </KeepAlivePane>
      );

    const completedTasks = useProgressStore((state) => state.completedTasks);
    const setTaskStatus = useProgressStore((state) => state.setTaskStatus);
    const submitReview = useReviewStore((state) => state.submitReview);
    const removeReview = useReviewStore((state) => state.removeReview);
    const excludedTaskIds = useReviewStore((state) => state.excludedTaskIds);

    // The URL decides the tab whenever it or the task changes: adjusted while rendering, so the
    // new task never paints once with the previous task's tab.
    const [syncedRoute, setSyncedRoute] = useState({ taskId, initialTab });
    if (syncedRoute.taskId !== taskId || syncedRoute.initialTab !== initialTab) {
      setSyncedRoute({ taskId, initialTab });
      if (initialTab) setActiveTab(initialTab);
    }

    useEffect(() => {
      activateCodeHistoryTask(`${section}:${taskId}`);
    }, [section, taskId]);

    // The URL only mirrors the tab. Syncing it re-renders the whole route tree, so it runs
    // after the new tab has painted; a newer click or leaving the task cancels the pending one.
    const pendingTabUrlRef = useRef<number | null>(null);
    useEffect(
      () => (): void => {
        if (pendingTabUrlRef.current !== null) cancelAnimationFrame(pendingTabUrlRef.current);
      },
      [taskId]
    );

    if (!isLoading && !task) {
      return (
        <div className={styles.notFound}>
          <h2>Задача #{taskId} не найдена</h2>
          <p>Возможно, задача была переименована или перемещена.</p>
          <Link to="/home" className={styles.notFoundLink}>
            Вернуться на главную
          </Link>
        </div>
      );
    }

    const handleTabChange = (tabId: string) => {
      setActiveTab(tabId);
      if (pendingTabUrlRef.current !== null) cancelAnimationFrame(pendingTabUrlRef.current);
      // rAF fires before the paint of the frame that shows the tab, so wait one more frame.
      pendingTabUrlRef.current = requestAnimationFrame(() => {
        pendingTabUrlRef.current = requestAnimationFrame(() => {
          pendingTabUrlRef.current = null;
          navigate({
            to: ".",
            search: (prev: Record<string, unknown>) => ({ ...prev, tab: tabId }),
            replace: true,
            resetScroll: false,
          });
        });
      });
    };

    const isExcluded = task ? excludedTaskIds.includes(String(task.id)) : false;
    const isCompleted =
      task && !isExcluded ? isTaskCompleted(completedTasks?.[String(task.id)]) : false;
    const isUnsolved =
      task && !isExcluded ? completedTasks?.[String(task.id)] === "unsolved" : false;

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
        await submitReview(task.id, "hard", true);
      } else {
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
      {
        id: "notes",
        label: "Заметки",
        icon: <NotebookPen size={14} className={styles.tabIcon} />,
      },
    ];
    if (hasVisualization)
      tabs.splice(2, 0, {
        id: "visualization",
        label: "Визуализация",
        icon: <Box size={14} className={styles.tabIcon} />,
      });

    return (
      <div className={styles.pageContainer}>
        <div className={styles.taskDetailCard} data-pending={isPending || undefined}>
          {/* Заголовок задачи и кнопки статуса */}
          <div className={styles.taskHeaderRow}>
            {task ? (
              <div className={styles.taskTitleContainer}>
                <h1 className={styles.taskDetailTitle}>
                  <span className={styles.taskDetailTitleText}>{task.title}</span>
                  {task.section !== "javascript" && task.difficulty && (
                    <TaskDifficultyBadge
                      difficulty={task.difficulty}
                      className={styles.titleBadge}
                    />
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

          {/* Шкала интервального повторения */}
          {task ? (
            <TaskReviewRatingBar taskId={task.id} task={task} />
          ) : (
            <UiSkeleton width="100%" height={38} radius={6} />
          )}

          {/* Единый контейнер вкладок и содержимого: ВСЕГДА СТАТИЧНЫЙ, НИКАКИХ ПЕРЕРИСОВОК ИЛИ СКЕЛЕТОНОВ */}
          <div className={styles.tabsContainer}>
            <div
              className={clsx(
                styles.tabsHeader,
                section === "algorithms" && styles.tabsHeaderStretch
              )}
              role="tablist"
              aria-label="Разделы задачи"
            >
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const tabModifier = styles[`tab_${tab.id}`];

                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    id={`task-tab-${tab.id}`}
                    aria-controls="task-tab-panel"
                    aria-selected={isActive}
                    className={clsx(styles.tabLink, tabModifier, isActive && styles.tabActive)}
                    onClick={() => handleTabChange(tab.id)}
                    onPointerEnter={
                      tab.id === "visualization" ? preloadTaskVisualization : undefined
                    }
                    onFocus={tab.id === "visualization" ? preloadTaskVisualization : undefined}
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

            <div
              className={styles.tabsContent}
              id="task-tab-panel"
              role="tabpanel"
              aria-labelledby={`task-tab-${activeTab}`}
            >
              {!task ? (
                <TaskTabSkeleton tab={activeTab} />
              ) : (
                <React.Suspense fallback={<TaskTabSkeleton tab={activeTab} task={task} />}>
                  {renderKeptTab("candidate", <CandidateTab task={task} />)}
                  {renderKeptTab("solution", <SolutionTab task={task} />)}
                  {hasVisualization && (
                    <TaskVisualizationTab
                      key={taskId}
                      task={task}
                      active={activeTab === "visualization"}
                    />
                  )}
                  {renderKeptTab("materials", <MaterialsTab task={task} />)}
                  {renderKeptTab("questions", <QuestionsTab task={task} />)}
                  {renderKeptTab("checklist", <ChecklistTab task={task} />)}
                  {renderKeptTab("notes", <TaskNotes key={task.id} taskId={task.id} />)}
                </React.Suspense>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

TaskPageView.displayName = "TaskPageView";

/**
 * While another task is being prepared the current one stays on screen, whole and unchanged,
 * and is replaced in one step once the next is ready. Showing the new title over empty or stale
 * content (or a skeleton for a few milliseconds) is what made quick switching flicker.
 * The sidebar reacts at once, so the click is acknowledged before the page swaps; a slow swap
 * also dims the old page (see `data-pending` in the styles).
 */
export const TaskPage = ({ taskId, section, initialTab }: TaskPageProps): React.JSX.Element => {
  const readyTaskId = useDeferredValue(taskId);
  const readyTab = useDeferredValue(initialTab);
  return (
    <TaskPageView
      taskId={readyTaskId}
      section={section}
      initialTab={readyTab}
      isPending={readyTaskId !== taskId}
    />
  );
};

TaskPage.displayName = "TaskPage";
