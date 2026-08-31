import { memo } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, X, RotateCcw, FileText } from "lucide-react";
import { SectionType, Task } from "@/entities/task";
import { ReviewItem } from "@/entities/review";
import { GroupCard, TaskButton, NodeCount, UiSkeleton } from "@/shared/ui";
import styles from "./SectionOverviewPage.module.css";

export interface GroupCardData {
  id: string;
  groupId?: string;
  name: string;
  icon: React.ReactNode;
  tasks: Task[];
  completedCount: number;
  completionClass: string;
  firstTaskId: string | number;
  color?: string;
}

export interface SectionGroupsGridProps {
  section: SectionType;
  groups: GroupCardData[];
  isSolved: (id: string | number) => boolean;
  completedTasks: Record<string, unknown>;
  reviews: Record<string, ReviewItem>;
  isDue: (review: ReviewItem | null | undefined) => boolean;
  isLoading?: boolean;
}

interface GroupItemProps {
  section: SectionType;
  group: GroupCardData;
  isSolved: (id: string | number) => boolean;
  completedTasks: Record<string, unknown>;
  reviews: Record<string, ReviewItem>;
  isDue: (review: ReviewItem | null | undefined) => boolean;
  isLoading?: boolean;
}

const PREVIEW_SKELETON_WIDTHS = ["75%", "58%", "82%"];

const GroupItem = memo(
  ({ section, group, isSolved, completedTasks, reviews, isDue, isLoading }: GroupItemProps) => {
    const progressPercent =
      group.tasks.length > 0 ? Math.round((group.completedCount / group.tasks.length) * 100) : 0;

    const visibleTasks = group.tasks.slice(0, 3);

    return (
      <GroupCard
        icon={group.icon}
        title={group.name}
        progressPercent={progressPercent}
        progressFillClass={styles[`fill_${section}`]}
        isLoadingProgress={isLoading}
        countBadge={
          isLoading ? (
            <UiSkeleton width={32} height={18} radius={9999} />
          ) : (
            <NodeCount
              completed={group.completedCount}
              total={group.tasks.length}
              completedClass={group.completionClass}
            />
          )
        }
        footer={
          isLoading ? (
            <div className={styles.groupActionLink}>
              <UiSkeleton width="100%" height={34} radius={8} />
            </div>
          ) : (
            <Link
              to={`/${section}/$taskId`}
              params={{ taskId: String(group.groupId || group.id) }}
              className={styles.groupActionLink}
            >
              <TaskButton accentColor={group.color} className={styles.groupActionBtn}>
                <span>{group.completedCount > 0 ? "Продолжить" : "Начать решать"}</span>
                <ArrowRight size={14} />
              </TaskButton>
            </Link>
          )
        }
      >
        <div className={styles.groupTasksPreview}>
          {isLoading
            ? visibleTasks.map((t, idx) => (
                <div
                  key={t.id}
                  className={styles.previewTaskItem}
                  style={{ pointerEvents: "none" }}
                >
                  <UiSkeleton width={13} height={13} radius={3} />
                  <UiSkeleton
                    width={PREVIEW_SKELETON_WIDTHS[idx % PREVIEW_SKELETON_WIDTHS.length]}
                    height={13}
                    radius={3}
                  />
                </div>
              ))
            : visibleTasks.map((t) => {
                const solved = isSolved(t.id);
                const unsolved =
                  completedTasks[t.id] === "unsolved" ||
                  completedTasks[String(t.id)] === "unsolved";
                const rev = reviews[String(t.id)];
                const due = isDue(rev);

                return (
                  <Link
                    key={t.id}
                    to={`/${section}/$taskId`}
                    params={{ taskId: String(t.id) }}
                    className={styles.previewTaskItem}
                  >
                    <FileText size={13} className={styles.fileIcon} />
                    <span className={styles.previewTaskTitle}>{t.title}</span>
                    {due ? (
                      <span className={styles.statusDue} title="Пора повторить!">
                        <RotateCcw size={10} />
                      </span>
                    ) : solved ? (
                      <span className={styles.statusSolved} title="Решено">
                        <Check size={11} />
                      </span>
                    ) : unsolved ? (
                      <span className={styles.statusUnsolved} title="Не решено">
                        <X size={11} />
                      </span>
                    ) : null}
                  </Link>
                );
              })}
        </div>
      </GroupCard>
    );
  }
);

GroupItem.displayName = "GroupItem";

export const SectionGroupsGrid = memo(
  ({
    section,
    groups,
    isSolved,
    completedTasks,
    reviews,
    isDue,
    isLoading = false,
  }: SectionGroupsGridProps) => {
    return (
      <>
        <div className={styles.groupsSectionHeader}>
          <h2 className={styles.groupsSectionTitle}>Темы и группы задач</h2>
          <span className={styles.groupsSectionCount}>{groups.length} групп</span>
        </div>

        <div className={styles.groupsGrid}>
          {groups.map((g) => (
            <GroupItem
              key={g.id}
              section={section}
              group={g}
              isSolved={isSolved}
              completedTasks={completedTasks}
              reviews={reviews}
              isDue={isDue}
              isLoading={isLoading}
            />
          ))}
        </div>
      </>
    );
  }
);

SectionGroupsGrid.displayName = "SectionGroupsGrid";
