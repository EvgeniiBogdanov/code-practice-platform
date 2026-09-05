import React, { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  ChevronDown,
  FileText,
  FolderTree,
  Check,
  X,
  RotateCcw,
  Flame,
  Wrench,
  Rocket,
  Brain,
  Zap,
} from "lucide-react";
import { clsx } from "clsx";
import { useProgressStore, selectIsTaskCompleted } from "@/entities/progress";
import { useReviewStore, isTaskDue, getGroupCompletionClass } from "@/entities/review";
import { useTaskSection } from "@/entities/task/catalog";
import { FinderHierarchyProps } from "../model/types";
import { getRatingClass } from "../lib/getRatingClass";
import { NodeCount, Tooltip, ReactIcon } from "@/shared/ui";
import styles from "./FinderBreadcrumbs.module.css";

export const FinderReactHierarchy = ({
  paramId,
  currentTask,
  activeDropdown,
  toggleDropdown,
  closeAllDropdowns,
}: FinderHierarchyProps) => {
  const progressState = useProgressStore();
  const reviews = useReviewStore((state) => state.reviews);
  const excludedTaskIds = useReviewStore((state) => state.excludedTaskIds);
  const { tasks } = useTaskSection("react");

  const reactCategories = useMemo(
    () => [
      {
        id: "warmup",
        label: "Разминка",
        icon: <Flame size={14} className={styles.iconFlame} />,
        infoId: "group-warmup",
        tasks: tasks.filter((t) => t.difficulty === "warm-up"),
      },
      {
        id: "refactoring",
        label: "Рефакторинг",
        icon: <Wrench size={14} className={styles.iconWrench} />,
        infoId: "group-refactoring",
        tasks: tasks.filter((t) => t.difficulty === "refactoring"),
      },
      {
        id: "middle",
        label: "UI-компоненты и паттерны",
        icon: <Rocket size={14} className={styles.iconRocket} />,
        infoId: "group-middle",
        tasks: tasks.filter((t) => t.difficulty === "middle"),
      },
      {
        id: "strong",
        label: "Управление состоянием",
        icon: <Brain size={14} className={styles.iconBrain} />,
        infoId: "group-strong",
        tasks: tasks.filter((t) => t.category === "Управление состоянием"),
      },
      {
        id: "lifecycle",
        label: "Жизненный цикл и рантайм",
        icon: <RotateCcw size={14} />,
        infoId: "group-lifecycle",
        tasks: tasks.filter((t) => t.category === "Жизненный цикл и рантайм"),
      },
      {
        id: "ts",
        label: "TypeScript: Паттерны типизации",
        icon: <Zap size={14} className={styles.iconZap} />,
        infoId: "group-ts",
        tasks: tasks.filter((t) => t.category === "TypeScript: Паттерны типизации"),
      },
      {
        id: "ts-practice",
        label: "TypeScript: Прикладные сценарии",
        icon: <Zap size={14} className={styles.iconZap} />,
        infoId: "group-ts-practice",
        tasks: tasks.filter((t) => t.category === "TypeScript: Прикладные сценарии"),
      },
    ],
    [tasks]
  );

  const currentReactCategory = useMemo(() => {
    if (currentTask) {
      const cat = reactCategories.find((c) => c.tasks.some((t) => t.id === currentTask.id));
      if (cat) return cat;
    }
    if (paramId) {
      const cat = reactCategories.find((c) => c.infoId === paramId || c.id === paramId);
      if (cat) return cat;
    }
    return null;
  }, [currentTask, paramId, reactCategories]);

  return (
    <>
      <span className={styles.separator}>/</span>

      {/* 1. Category Breadcrumb */}
      <div className={styles.dropdownWrapper}>
        <button
          type="button"
          className={clsx(
            styles.breadcrumbBtn,
            activeDropdown === "group" && styles.breadcrumbBtnActive
          )}
          onClick={() => toggleDropdown("group")}
          aria-label={`${currentReactCategory?.label || "Все категории React"}: выбрать категорию задач`}
        >
          {currentReactCategory ? (
            currentReactCategory.icon
          ) : (
            <ReactIcon size={14} className={styles.iconReact} />
          )}
          <span className={styles.itemText}>
            {currentReactCategory?.label || "Все категории React"}
          </span>
          <ChevronDown size={13} className={styles.chevron} />
        </button>

        {activeDropdown === "group" && (
          <div className={styles.dropdownMenu}>
            <div className={styles.dropdownHeader}>
              <span className={styles.dropdownHeaderIcon}>
                <FolderTree size={14} />
              </span>
              <span className={styles.dropdownHeaderTitle}>Группы задач React</span>
            </div>
            <div className={styles.dropdownList}>
              {reactCategories.map((cat) => {
                const activeCatTasks = cat.tasks.filter(
                  (t) => !excludedTaskIds.includes(String(t.id))
                );
                const completedCount = activeCatTasks.filter((t) =>
                  selectIsTaskCompleted(progressState, t.id)
                ).length;
                const completionClass = getGroupCompletionClass(
                  activeCatTasks,
                  reviews,
                  progressState.completedTasks
                );
                const isActive = currentReactCategory && cat.id === currentReactCategory.id;

                return (
                  <Link
                    key={cat.id}
                    to="/react/$taskId"
                    params={{ taskId: cat.infoId }}
                    className={clsx(styles.dropdownItem, isActive && styles.active)}
                    onClick={() => {
                      closeAllDropdowns();
                      setTimeout(() => {
                        const el = document.getElementById(cat.id);
                        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                      }, 50);
                    }}
                  >
                    <span className={styles.dropdownItemIcon}>{cat.icon}</span>
                    <span className={styles.dropdownItemTitle}>{cat.label}</span>
                    <NodeCount
                      completed={completedCount}
                      total={activeCatTasks.length}
                      completedClass={completionClass}
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 2. Task Breadcrumb (only when a specific task is open) */}
      {currentTask && !currentTask.isGroupOverview && currentReactCategory && (
        <>
          <span className={styles.separator}>/</span>
          <div className={styles.dropdownWrapper}>
            <button
              type="button"
              className={clsx(
                styles.breadcrumbBtn,
                styles.taskActiveBtn,
                activeDropdown === "task" && styles.breadcrumbBtnActive
              )}
              onClick={() => toggleDropdown("task")}
              aria-label={`${currentTask.title}: выбрать другую задачу`}
            >
              <FileText size={14} className={styles.fileIcon} />
              <span className={styles.itemText}>{currentTask.title}</span>
              <ChevronDown size={13} className={styles.chevron} />
            </button>

            {activeDropdown === "task" && (
              <div className={styles.dropdownMenu}>
                <div className={styles.dropdownHeader}>
                  <span className={styles.dropdownHeaderIcon}>
                    <FolderTree size={14} />
                  </span>
                  <span className={styles.dropdownHeaderTitle}>
                    Задачи: {currentReactCategory.label}
                  </span>
                </div>
                <div className={styles.dropdownList}>
                  {currentReactCategory.tasks.map((t) => {
                    const isSolved = selectIsTaskCompleted(progressState, t.id);
                    const isUnsolved =
                      progressState.completedTasks[t.id] === "unsolved" ||
                      progressState.completedTasks[String(t.id)] === "unsolved";
                    const isExcluded = excludedTaskIds.includes(String(t.id));
                    const rev = reviews[String(t.id)];
                    const isDueToday = isTaskDue(rev);
                    const isActive = t.id === currentTask.id;
                    const ratingClass = getRatingClass(
                      isSolved,
                      isUnsolved,
                      t.difficulty,
                      rev?.rating,
                      isExcluded
                    );

                    return (
                      <Link
                        key={t.id}
                        to="/react/$taskId"
                        params={{ taskId: String(t.id) }}
                        className={clsx(styles.dropdownItem, isActive && styles.active)}
                        onClick={closeAllDropdowns}
                      >
                        <FileText size={14} className={styles.fileIcon} />
                        <span className={clsx(styles.dropdownItemTitle, ratingClass)}>
                          {t.title}
                        </span>
                        {!isExcluded && (
                          isDueToday ? (
                            <Tooltip content="Пора повторить!" side="left">
                              <span className={styles.statusDue}>
                                <RotateCcw size={10} />
                              </span>
                            </Tooltip>
                          ) : isSolved ? (
                            <Tooltip content="Решено" side="left">
                              <span className={styles.statusSolved}>
                                <Check size={12} />
                              </span>
                            </Tooltip>
                          ) : isUnsolved ? (
                            <Tooltip content="Не решено" side="left">
                              <span className={styles.statusUnsolved}>
                                <X size={12} />
                              </span>
                            </Tooltip>
                          ) : null
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};
