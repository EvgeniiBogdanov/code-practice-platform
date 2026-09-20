import React, { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, FileText, Folder, Check, X, RotateCcw } from "lucide-react";
import { clsx } from "clsx";
import { selectIsTaskCompleted } from "@/entities/progress";
import { isTaskDue, useReviewStore } from "@/entities/review";
import { getScriptGroupMeta, SECTIONS_CONFIG } from "@/entities/task";
import { useTaskSection } from "@/entities/task/catalog";
import { FinderHierarchyProps } from "../model/types";
import { useJsHierarchyLists } from "../model/useJsHierarchyLists";
import { resolveJsHierarchyNames } from "../lib/resolveJsHierarchyNames";
import { getRatingClass } from "../lib/getRatingClass";
import { NodeCount, Tooltip } from "@/shared/ui";
import styles from "./FinderBreadcrumbs.module.css";

export const FinderJsHierarchy = ({
  section = "javascript",
  paramId,
  currentTask,
  activeDropdown,
  toggleDropdown,
  closeAllDropdowns,
}: FinderHierarchyProps & { section?: "javascript" | "typescript" }): React.JSX.Element => {
  const SectionIcon = SECTIONS_CONFIG[section].icon;
  const sectionTitle = SECTIONS_CONFIG[section].title;
  const { tasks } = useTaskSection(section);
  const { currentGroupName, currentSubgroupName } = useMemo(
    () => resolveJsHierarchyNames(currentTask, paramId, tasks),
    [currentTask, paramId, tasks]
  );

  const currentGroupMeta = currentGroupName ? getScriptGroupMeta(currentGroupName, section) : null;

  const excludedTaskIds = useReviewStore((state) => state.excludedTaskIds);

  const { jsGroupsList, jsSubgroupsList, progressState, reviews } = useJsHierarchyLists(
    currentGroupName,
    section
  );

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
          aria-label={`${currentGroupName || `Все темы ${sectionTitle}`}: выбрать группу задач`}
        >
          {currentGroupMeta ? (
            currentGroupMeta.renderIcon(14)
          ) : (
            <SectionIcon size={14} color={SECTIONS_CONFIG[section].color} />
          )}
          <span className={styles.itemText}>{currentGroupName || `Все темы ${sectionTitle}`}</span>
          <ChevronDown size={13} className={styles.chevron} />
        </button>

        {activeDropdown === "group" && (
          <div className={styles.dropdownMenu}>
            <div className={styles.dropdownHeader}>
              <span className={styles.dropdownHeaderIcon}>
                {currentGroupMeta ? (
                  currentGroupMeta.renderIcon(14)
                ) : (
                  <SectionIcon size={14} color={SECTIONS_CONFIG[section].color} />
                )}
              </span>
              <span className={styles.dropdownHeaderTitle}>Группы задач {sectionTitle}</span>
            </div>
            <div className={styles.dropdownList}>
              {jsGroupsList.map((g) => {
                const isActive = g.name === currentGroupName;
                return (
                  <Link
                    key={g.name}
                    to={`/${section}/$taskId`}
                    params={{ taskId: `group-${g.name}` }}
                    className={clsx(styles.dropdownItem, isActive && styles.active)}
                    onClick={() => {
                      closeAllDropdowns();
                      setTimeout(() => {
                        const el = document.getElementById(`category-js-${g.name}`);
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

      {/* 2. Subgroup Breadcrumb */}
      {currentGroupName && currentSubgroupName && (
        <>
          <span className={styles.separator}>/</span>
          <div className={styles.dropdownWrapper}>
            <button
              type="button"
              className={clsx(
                styles.breadcrumbBtn,
                activeDropdown === "subgroup" && styles.breadcrumbBtnActive
              )}
              onClick={() => toggleDropdown("subgroup")}
              aria-label={`${currentSubgroupName}: выбрать подгруппу задач`}
            >
              <Folder size={14} color={currentGroupMeta?.color} className={styles.iconJs} />
              <span className={styles.itemText}>{currentSubgroupName}</span>
              <ChevronDown size={13} className={styles.chevron} />
            </button>

            {activeDropdown === "subgroup" && (
              <div className={styles.dropdownMenu}>
                <div className={styles.dropdownHeader}>
                  <span className={styles.dropdownHeaderIcon}>
                    <Folder size={14} color={currentGroupMeta?.color} className={styles.iconJs} />
                  </span>
                  <span className={styles.dropdownHeaderTitle}>Подгруппы ({currentGroupName})</span>
                </div>
                <div className={styles.dropdownList}>
                  {jsSubgroupsList.map((sub) => {
                    const isActive = sub.name === currentSubgroupName;
                    return (
                      <Link
                        key={sub.name}
                        to={`/${section}/$taskId`}
                        params={{ taskId: `subgroup-${currentGroupName}-${sub.name}` }}
                        className={clsx(styles.dropdownItem, isActive && styles.active)}
                        onClick={() => {
                          closeAllDropdowns();
                          setTimeout(() => {
                            const el =
                              document.getElementById(
                                `category-subgroup-${currentGroupName}-${sub.name}`
                              ) || document.getElementById(`category-js-${currentGroupName}`);
                            if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
                          }, 50);
                        }}
                      >
                        <Folder
                          size={14}
                          color={currentGroupMeta?.color}
                          className={styles.iconJs}
                        />
                        <span className={styles.dropdownItemTitle}>{sub.name}</span>
                        <NodeCount
                          completed={sub.completedCount}
                          total={sub.tasks.length}
                          completedClass={sub.completionClass}
                        />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* 3. Task Breadcrumb (only when a specific task is open) */}
      {currentTask && !currentTask.isGroupOverview && (
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
              aria-label={`${currentTask.title}: выбрать задачу из подгруппы`}
            >
              <FileText size={14} className={styles.fileIcon} />
              <span className={styles.itemText}>{currentTask.title}</span>
              <ChevronDown size={13} className={styles.chevron} />
            </button>

            {activeDropdown === "task" && (
              <div className={styles.dropdownMenu}>
                <div className={styles.dropdownHeader}>
                  <span className={styles.dropdownHeaderIcon}>
                    <Folder size={14} color={currentGroupMeta?.color} className={styles.iconJs} />
                  </span>
                  <span className={styles.dropdownHeaderTitle}>
                    Задачи {currentSubgroupName || currentGroupName}
                  </span>
                </div>
                <div className={styles.dropdownList}>
                  {tasks
                    .filter(
                      (t) =>
                        t.group === currentGroupName &&
                        (!currentSubgroupName || t.subgroup === currentSubgroupName)
                    )
                    .map((t) => {
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
                          to={`/${section}/$taskId`}
                          params={{ taskId: String(t.id) }}
                          className={clsx(styles.dropdownItem, isActive && styles.active)}
                          onClick={closeAllDropdowns}
                        >
                          <FileText size={14} className={styles.fileIcon} />
                          <span className={clsx(styles.dropdownItemTitle, ratingClass)}>
                            {t.title}
                          </span>
                          {!isExcluded &&
                            (isDueToday ? (
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
                            ) : null)}
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
