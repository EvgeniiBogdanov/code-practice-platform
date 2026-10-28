import React, { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  Check,
  ChevronDown,
  ClipboardList,
  Code2,
  FileCode2,
  FileText,
  Layers,
  Network,
} from "lucide-react";
import { clsx } from "clsx";
import { DESIGN_CASES } from "@/entities/design-case";
import { DESIGN_TOPICS } from "@/entities/design-topic";
import { isTaskCompleted, useProgressStore } from "@/entities/progress";
import { useReviewStore } from "@/entities/review";
import { useTaskSection } from "@/entities/task/catalog";
import { NodeCount } from "@/shared/ui";
import { getRatingClass } from "../lib/getRatingClass";
import { parseSystemDesignPath, type SystemDesignFolder } from "../lib/parseSystemDesignPath";
import type { FinderHierarchyProps } from "../model/types";
import styles from "./FinderBreadcrumbs.module.css";

const ICON_SIZE = 14;

/** The folders of the system design sidebar, in the same order and colours. */
const FOLDERS: Record<SystemDesignFolder, { title: string; icon: React.ReactNode }> = {
  theory: { title: "Теория", icon: <BookOpen size={ICON_SIZE} className={styles.iconTheory} /> },
  cases: { title: "Кейсы", icon: <Layers size={ICON_SIZE} className={styles.iconCases} /> },
  drills: { title: "Дриллы", icon: <Code2 size={ICON_SIZE} className={styles.iconDrills} /> },
};

const PAGE_ICON: Record<SystemDesignFolder, React.ReactNode> = {
  theory: <FileText size={ICON_SIZE} className={styles.fileIcon} />,
  cases: <ClipboardList size={ICON_SIZE} className={styles.fileIcon} />,
  drills: <FileCode2 size={ICON_SIZE} className={styles.fileIcon} />,
};

export type FinderSystemDesignHierarchyProps = Omit<
  FinderHierarchyProps,
  "paramId" | "currentTask"
> & {
  pathname: string;
};

/** «Системный дизайн / Папка / Страница»: theory topics, cases and drills, like the sidebar folders. */
export const FinderSystemDesignHierarchy = ({
  pathname,
  activeDropdown,
  toggleDropdown,
  closeAllDropdowns,
}: FinderSystemDesignHierarchyProps): React.JSX.Element => {
  const { folder, pageId } = parseSystemDesignPath(pathname);
  const { tasks: drills } = useTaskSection("system-design");
  const completedTasks = useProgressStore((state) => state.completedTasks);
  const reviews = useReviewStore((state) => state.reviews);
  const excludedTaskIds = useReviewStore((state) => state.excludedTaskIds);

  const activeDrills = useMemo(
    () => drills.filter((task) => !excludedTaskIds.includes(String(task.id))),
    [drills, excludedTaskIds]
  );
  const solvedDrills = activeDrills.filter((task) =>
    isTaskCompleted(completedTasks[String(task.id)])
  ).length;

  const pageTitle =
    folder === "theory"
      ? DESIGN_TOPICS.find(({ id }) => id === pageId)?.title
      : folder === "cases"
        ? DESIGN_CASES.find(({ id }) => id === pageId)?.title
        : drills.find((task) => String(task.id) === pageId)?.title;

  const folderLink = (id: SystemDesignFolder, children: React.ReactNode): React.ReactNode => {
    const className = clsx(styles.dropdownItem, id === folder && styles.active);
    const to =
      id === "theory"
        ? "/system-design/topics"
        : id === "cases"
          ? "/system-design/cases"
          : "/system-design/drills";
    return (
      <Link key={id} to={to} className={className} onClick={closeAllDropdowns}>
        {children}
      </Link>
    );
  };

  const renderPages = (current: SystemDesignFolder): React.ReactNode => {
    const itemClass = (id: string): string =>
      clsx(styles.dropdownItem, id === pageId && styles.active);

    if (current === "theory") {
      return DESIGN_TOPICS.map((topic) => (
        <Link
          key={topic.id}
          to="/system-design/topics/$topicId"
          params={{ topicId: topic.id }}
          className={itemClass(topic.id)}
          onClick={closeAllDropdowns}
        >
          {PAGE_ICON.theory}
          <span className={styles.dropdownItemTitle}>{topic.title}</span>
        </Link>
      ));
    }
    if (current === "cases") {
      return DESIGN_CASES.map((designCase) => (
        <Link
          key={designCase.id}
          to="/system-design/cases/$caseId"
          params={{ caseId: designCase.id }}
          className={itemClass(designCase.id)}
          onClick={closeAllDropdowns}
        >
          {PAGE_ICON.cases}
          <span className={styles.dropdownItemTitle}>{designCase.title}</span>
        </Link>
      ));
    }
    return drills.map((task) => {
      const id = String(task.id);
      const progress = completedTasks[id];
      const isSolved = isTaskCompleted(progress);
      const isExcluded = excludedTaskIds.includes(id);
      const ratingClass = getRatingClass(
        isSolved,
        progress === "unsolved",
        task.difficulty,
        reviews[id]?.rating,
        isExcluded
      );
      return (
        <Link
          key={id}
          to="/system-design/$taskId"
          params={{ taskId: id }}
          className={itemClass(id)}
          onClick={closeAllDropdowns}
        >
          {PAGE_ICON.drills}
          <span className={clsx(styles.dropdownItemTitle, ratingClass)}>{task.title}</span>
          {isSolved && !isExcluded && (
            <span className={styles.statusSolved} aria-label="Решено">
              <Check size={12} />
            </span>
          )}
        </Link>
      );
    });
  };

  const folderCounts: Record<SystemDesignFolder, React.ReactNode> = {
    theory: <NodeCount completed={0} total={DESIGN_TOPICS.length} variant="count" />,
    cases: <NodeCount completed={0} total={DESIGN_CASES.length} variant="count" />,
    drills: <NodeCount completed={solvedDrills} total={activeDrills.length} />,
  };

  const currentFolder = folder ? FOLDERS[folder] : null;

  return (
    <>
      <span className={styles.separator}>/</span>

      {/* 1. Folder: theory, cases or drills */}
      <div className={styles.dropdownWrapper}>
        <button
          type="button"
          className={clsx(
            styles.breadcrumbBtn,
            activeDropdown === "group" && styles.breadcrumbBtnActive
          )}
          onClick={() => toggleDropdown("group")}
          aria-label={`${currentFolder?.title ?? "Все папки"}: выбрать папку раздела`}
        >
          {currentFolder?.icon ?? (
            <Network size={ICON_SIZE} className={styles["icon_system-design"]} />
          )}
          <span className={styles.itemText}>{currentFolder?.title ?? "Все папки"}</span>
          <ChevronDown size={13} className={styles.chevron} />
        </button>

        {activeDropdown === "group" && (
          <div className={styles.dropdownMenu}>
            <div className={styles.dropdownHeader}>
              <span className={styles.dropdownHeaderIcon}>
                <Network size={ICON_SIZE} className={styles["icon_system-design"]} />
              </span>
              <span className={styles.dropdownHeaderTitle}>Папки Системный дизайн</span>
            </div>
            <div className={styles.dropdownList}>
              {(Object.keys(FOLDERS) as SystemDesignFolder[]).map((id) =>
                folderLink(
                  id,
                  <>
                    <span className={styles.dropdownItemIcon}>{FOLDERS[id].icon}</span>
                    <span className={styles.dropdownItemTitle}>{FOLDERS[id].title}</span>
                    {folderCounts[id]}
                  </>
                )
              )}
            </div>
          </div>
        )}
      </div>

      {/* 2. Page: a topic, a case or a drill of the folder */}
      {folder && currentFolder && pageId && pageTitle && (
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
              aria-label={`${pageTitle}: выбрать страницу из папки`}
            >
              {PAGE_ICON[folder]}
              <span className={styles.itemText}>{pageTitle}</span>
              <ChevronDown size={13} className={styles.chevron} />
            </button>

            {activeDropdown === "task" && (
              <div className={styles.dropdownMenu}>
                <div className={styles.dropdownHeader}>
                  <span className={styles.dropdownHeaderIcon}>{currentFolder.icon}</span>
                  <span className={styles.dropdownHeaderTitle}>{currentFolder.title}</span>
                </div>
                <div className={styles.dropdownList}>{renderPages(folder)}</div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};
