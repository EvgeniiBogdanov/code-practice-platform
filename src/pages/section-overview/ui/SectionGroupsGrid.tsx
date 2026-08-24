import { memo } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, X, RotateCcw, FileText } from "lucide-react";
import { SectionType, Task } from "@/entities/task";
import { ReviewItem } from "@/entities/review";
import { GroupCard, TaskButton, NodeCount } from "@/shared/ui";
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
}

interface GroupItemProps {
  section: SectionType;
  group: GroupCardData;
  isSolved: (id: string | number) => boolean;
  completedTasks: Record<string, unknown>;
  reviews: Record<string, ReviewItem>;
  isDue: (review: ReviewItem | null | undefined) => boolean;
}

const GroupItem = memo(
  ({ section, group, isSolved, completedTasks, reviews, isDue }: GroupItemProps) => {
    const progressPercent =
      group.tasks.length > 0 ? Math.round((group.completedCount / group.tasks.length) * 100) : 0;

    return (
      <GroupCard
        icon={group.icon}
        title={group.name}
        progressPercent={progressPercent}
        progressFillClass={styles[`fill_${section}`]}
        countBadge={
          <NodeCount
            completed={group.completedCount}
            total={group.tasks.length}
            completedClass={group.completionClass}
          />
        }
        footer={
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
        }
      >
        <div className={styles.groupTasksPreview}>
          {group.tasks.slice(0, 3).map((t) => {
            const solved = isSolved(t.id);
            const unsolved =
              completedTasks[t.id] === "unsolved" || completedTasks[String(t.id)] === "unsolved";
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
  ({ section, groups, isSolved, completedTasks, reviews, isDue }: SectionGroupsGridProps) => {
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
            />
          ))}
        </div>
      </>
    );
  }
);

SectionGroupsGrid.displayName = "SectionGroupsGrid";
