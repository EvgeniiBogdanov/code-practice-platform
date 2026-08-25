import React, { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, FileText, Check, X, RotateCcw, Brain } from "lucide-react";
import { clsx } from "clsx";
import { useProgressStore, selectIsTaskCompleted } from "@/entities/progress";
import { useReviewStore, isTaskDue, getGroupCompletionClass } from "@/entities/review";
import { ALL_ALGO_TASKS, getAlgoGroupMeta, getAlgoGroupMetaByInfoId } from "@/entities/task";
import { safeDecodeURI } from "@/shared/lib/url";
import { FinderHierarchyProps } from "../model/types";
import { getRatingClass } from "../lib/getRatingClass";
import { NodeCount } from "@/shared/ui";
import styles from "./FinderBreadcrumbs.module.css";

export const FinderAlgoHierarchy = ({
  paramId,
  currentTask,
  activeDropdown,
  toggleDropdown,
  closeAllDropdowns,
}: FinderHierarchyProps) => {
  const progressState = useProgressStore();
  const reviews = useReviewStore((state) => state.reviews);

  const currentGroupName = useMemo(() => {
    if (currentTask) return currentTask.group || null;
    if (paramId) {
      const meta = getAlgoGroupMetaByInfoId(paramId);
      if (meta) return meta.name;
      if (paramId.startsWith("group-")) {
        const raw = safeDecodeURI(paramId.replace(/^group-/, ""));
        const matched = ALL_ALGO_TASKS.find((t) => t.group === raw);
        return matched?.group || raw;
      }
    }
    return null;
  }, [currentTask, paramId]);

  const currentGroupMeta = currentGroupName ? getAlgoGroupMeta(currentGroupName) : null;

  const algoGroupsList = useMemo(() => {
    const groupsMap = new Map<string, typeof ALL_ALGO_TASKS>();
    ALL_ALGO_TASKS.forEach((t) => {
      const g = t.group || "Общие";
      if (!groupsMap.has(g)) groupsMap.set(g, []);
      groupsMap.get(g)!.push(t);
    });
    return Array.from(groupsMap.entries()).map(([name, tasks]) => {
      const completedCount = tasks.filter((t) => selectIsTaskCompleted(progressState, t.id)).length;
      const completionClass = getGroupCompletionClass(tasks, reviews, progressState.completedTasks);
      const meta = getAlgoGroupMeta(name);
      return { name, tasks, completedCount, completionClass, meta };
    });
  }, [progressState, reviews]);

  return (
    <>
      <span className={styles.separator}>/</span>

      {/* 1. Group Breadcrumb */}
      <div className={styles.dropdownWrapper}>
        <button
          type="button"
          className={clsx(
            styles.breadcrumbBtn,
            activeDropdown === "group" && styles.breadcrumbBtnActive
          )}
          onClick={() => toggleDropdown("group")}
          title="Выбрать группу задач Алгоритмы"
          aria-label="Выбрать группу задач Алгоритмы"
        >
          {currentGroupMeta ? (
            currentGroupMeta.renderIcon(14)
          ) : (
            <Brain size={14} className={styles.iconAlgo} />
          )}
          <span className={styles.itemText}>{currentGroupName || "Все темы алгоритмов"}</span>
          <ChevronDown size={13} className={styles.chevron} />
        </button>

        {activeDropdown === "group" && (
          <div className={styles.dropdownMenu}>
            <div className={styles.dropdownHeader}>
              <span className={styles.dropdownHeaderIcon}>
                {currentGroupMeta ? (
                  currentGroupMeta.renderIcon(14)
                ) : (
                  <Brain size={14} className={styles.iconAlgo} />
                )}
              </span>
              <span className={styles.dropdownHeaderTitle}>Группы задач Алгоритмы</span>
            </div>
            <div className={styles.dropdownList}>
              {algoGroupsList.map((g) => {
                const isActive = g.name === currentGroupName;
                return (
                  <Link
                    key={g.name}
                    to="/algorithms/$taskId"
                    params={{ taskId: g.meta.infoId || "group-two-pointers" }}
                    className={clsx(styles.dropdownItem, isActive && styles.active)}
                    onClick={() => {
                      closeAllDropdowns();
                      setTimeout(() => {
                        const el = document.getElementById(`category-algo-${g.name}`);
                        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                      }, 50);
                    }}
                  >
                    <span className={styles.dropdownItemIcon}>{g.meta.renderIcon(14)}</span>
                    <span className={styles.dropdownItemTitle}>{g.name}</span>
                    <NodeCount
                      completed={g.completedCount}
                      total={g.tasks.length}
                      completedClass={g.completionClass}
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 2. Task Breadcrumb (only when a specific task is open) */}
      {currentTask && !currentTask.isGroupOverview && currentGroupName && (
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
              title="Выбрать материал из группы"
              aria-label="Выбрать материал из группы"
            >
              <FileText size={14} className={styles.fileIcon} />
              <span className={styles.itemText}>{currentTask.title}</span>
              <ChevronDown size={13} className={styles.chevron} />
            </button>

            {activeDropdown === "task" && (
              <div className={styles.dropdownMenu}>
                <div className={styles.dropdownHeader}>
                  <span className={styles.dropdownHeaderIcon}>
                    {currentGroupMeta ? (
                      currentGroupMeta.renderIcon(14)
                    ) : (
                      <Brain size={14} className={styles.iconAlgo} />
                    )}
                  </span>
                  <span className={styles.dropdownHeaderTitle}>Задачи {currentGroupName}</span>
                </div>
                <div className={styles.dropdownList}>
                  {ALL_ALGO_TASKS.filter((t) => t.group === currentGroupName).map((t) => {
                    const isSolved = selectIsTaskCompleted(progressState, t.id);
                    const isUnsolved =
                      progressState.completedTasks[t.id] === "unsolved" ||
                      progressState.completedTasks[String(t.id)] === "unsolved";
                    const rev = reviews[String(t.id)];
                    const isDueToday = isTaskDue(rev);
                    const isActive = t.id === currentTask.id;
                    const ratingClass = getRatingClass(
                      isSolved,
                      isUnsolved,
                      t.difficulty,
                      rev?.rating
                    );

                    return (
                      <Link
                        key={t.id}
                        to="/algorithms/$taskId"
                        params={{ taskId: String(t.id) }}
                        className={clsx(styles.dropdownItem, isActive && styles.active)}
                        onClick={closeAllDropdowns}
                      >
                        <FileText size={14} className={styles.fileIcon} />
                        <span className={clsx(styles.dropdownItemTitle, ratingClass)}>
                          {t.title}
                        </span>
                        {isDueToday ? (
                          <span className={styles.statusDue} title="Пора повторить!">
                            <RotateCcw size={10} />
                          </span>
                        ) : isSolved ? (
                          <span className={styles.statusSolved} title="Решено">
                            <Check size={12} />
                          </span>
                        ) : isUnsolved ? (
                          <span className={styles.statusUnsolved} title="Не решено">
                            <X size={12} />
                          </span>
                        ) : null}
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
