import React, { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, FileText, Check, X, RotateCcw, Brain } from "lucide-react";
import { clsx } from "clsx";
import { useProgressStore, selectIsTaskCompleted } from "@/entities/progress";
import { useReviewStore, isTaskDue, getGroupCompletionClass } from "@/entities/review";
import { getAlgoGroupMeta, getAlgoGroupMetaByInfoId } from "@/entities/task/groups";
import type { Task } from "@/entities/task/meta";
import { useTaskSection } from "@/entities/task/catalog";
import { safeDecodeURI } from "@/shared/lib/url";
import { FinderHierarchyProps } from "../model/types";
import { getRatingClass } from "../lib/getRatingClass";
import { NodeCount, Tooltip } from "@/shared/ui";
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
  const excludedTaskIds = useReviewStore((state) => state.excludedTaskIds);
  const { tasks } = useTaskSection("algorithms");

  const currentGroupName = useMemo(() => {
    if (currentTask) return currentTask.group || null;
    if (paramId) {
      const meta = getAlgoGroupMetaByInfoId(paramId);
      if (meta) return meta.name;
      if (paramId.startsWith("group-")) {
        const raw = safeDecodeURI(paramId.replace(/^group-/, ""));
        const matched = tasks.find((t) => t.group === raw);
        return matched?.group || raw;
      }
    }
    return null;
  }, [currentTask, paramId, tasks]);

  const currentGroupMeta = currentGroupName ? getAlgoGroupMeta(currentGroupName) : null;

  const algoGroupsList = useMemo(() => {
    const groupsMap = new Map<string, Task[]>();
    tasks.forEach((t) => {
      const g = t.group || "Общие";
      if (!groupsMap.has(g)) groupsMap.set(g, []);
      groupsMap.get(g)!.push(t);
    });
    return Array.from(groupsMap.entries()).map(([name, groupTasksList]) => {
      const activeGroupTasks = groupTasksList.filter(
        (t) => !excludedTaskIds.includes(String(t.id))
      );
      const completedCount = activeGroupTasks.filter((t) =>
        selectIsTaskCompleted(progressState, t.id)
      ).length;
      const completionClass = getGroupCompletionClass(
        activeGroupTasks,
        reviews,
        progressState.completedTasks
      );
      const meta = getAlgoGroupMeta(name);
      return { name, tasks: activeGroupTasks, completedCount, completionClass, meta };
    });
  }, [progressState, reviews, tasks, excludedTaskIds]);

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
                  {tasks.filter((t) => t.group === currentGroupName).map((t) => {
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
                        to="/algorithms/$taskId"
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
