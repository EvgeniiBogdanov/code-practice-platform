import React, { useState, useRef, useMemo, useEffect, memo } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { RotateCcw, FileText, Sparkles, BookOpen } from "lucide-react";
import { useReviewStore, isTaskDue, getReviewBadgeMeta } from "@/entities/review";
import { ALL_TASKS, Task } from "@/entities/task";
import { Tooltip, SquareButton } from "@/shared/ui";
import styles from "./HeaderReviewMenu.module.css";

const getRatingClass = (_difficulty?: string, reviewRating?: string) => {
  if (reviewRating === "hard") return styles.ratingHard;
  if (reviewRating === "medium") return styles.ratingMedium;
  if (reviewRating === "easy") return styles.ratingEasy;
  return "";
};

export const HeaderReviewMenu = memo(() => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const reviews = useReviewStore((state) => state.reviews);
  const isInitialized = useReviewStore((state) => state.isInitialized);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const dueTasks = useMemo(() => {
    if (!isInitialized) return [];
    return ALL_TASKS.filter((t) => {
      const rev = reviews[String(t.id)];
      return isTaskDue(rev);
    });
  }, [reviews, isInitialized]);

  const hasAnyReviewed = useMemo(() => {
    return Object.values(reviews).some((r) => r && (r.stage > 0 || r.lastReviewedAt));
  }, [reviews]);

  const getTaskPath = (task: Task) => {
    if (task.section === "javascript") return `/javascript/${task.id}`;
    if (task.section === "algorithms") return `/algorithms/${task.id}`;
    return `/react/${task.id}`;
  };

  const tooltipContent =
    dueTasks.length > 0 ? `Пора повторить (${dueTasks.length})` : "Интервальное повторение";

  return (
    <div className={styles.reviewDropdownWrapper} ref={menuRef}>
      <Tooltip content={tooltipContent} side="bottom">
        <SquareButton
          icon={<RotateCcw size={16} />}
          isActive={open}
          className={dueTasks.length > 0 ? styles.hasDueReviews : undefined}
          badge={
            dueTasks.length > 0 ? (
              <span className={styles.countBadge}>{dueTasks.length}</span>
            ) : undefined
          }
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Интервальное повторение"
        />
      </Tooltip>

      {open && (
        <div className={styles.dropdownMenu}>
          <div className={styles.dropdownHeader}>
            <div className={styles.headerTitleGroup}>
              <RotateCcw
                size={14}
                className={dueTasks.length > 0 ? styles.iconDueYellow : styles.iconMuted}
              />
              <span className={styles.headerTitle}>К повторению</span>
            </div>
            <span className={styles.headerCount}>
              {dueTasks.length > 0
                ? `${dueTasks.length} к повторению`
                : hasAnyReviewed
                  ? "Задач нет"
                  : "0 решено"}
            </span>
          </div>

          {dueTasks.length > 0 ? (
            <div className={styles.dropdownList}>
              {dueTasks.map((task) => {
                const rev = reviews[String(task.id)];
                const badge = getReviewBadgeMeta(rev);
                const section = task.section || "react";
                const ratingClass = getRatingClass(task.difficulty, rev?.rating);

                return (
                  <Link
                    key={task.id}
                    to={getTaskPath(task)}
                    className={styles.reviewItem}
                    onClick={() => setOpen(false)}
                  >
                    <div className={styles.itemMain}>
                      <FileText size={14} className={styles.itemFileIcon} />
                      <span className={[styles.itemTitle, ratingClass].filter(Boolean).join(" ")}>
                        {task.title}
                      </span>
                    </div>

                    <div className={styles.itemMeta}>
                      <span className={[styles.sectionTag, styles[`tag_${section}`]].join(" ")}>
                        {section === "javascript"
                          ? "JS"
                          : section === "algorithms"
                            ? "Algo"
                            : "React"}
                      </span>
                      <span
                        className={[
                          styles.difficultyBadge,
                          styles[`diff_${badge.badgeVariant}`],
                        ].join(" ")}
                      >
                        {badge.stageName || badge.label}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : !hasAnyReviewed ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <BookOpen size={20} />
              </div>
              <div className={styles.emptyText}>
                <strong>Ещё нет решённых задач</strong>
                <span>
                  Решайте задачи в каталоге, чтобы добавлять их в систему интервального повторения
                </span>
              </div>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={[styles.emptyIcon, styles.emptyIconSuccess].join(" ")}>
                <Sparkles size={20} />
              </div>
              <div className={styles.emptyText}>
                <strong>Все задачи повторены!</strong>
                <span>Новые повторения появятся согласно вашему персональному графику</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

HeaderReviewMenu.displayName = "HeaderReviewMenu";
