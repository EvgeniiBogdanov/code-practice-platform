import React from "react";
import { Link } from "@tanstack/react-router";
import { Folder } from "lucide-react";
import type { TaskCompletionStatus } from "@/entities/progress";
import { getGroupCompletionClass } from "@/entities/review";
import type { ReviewItem } from "@/entities/review";
import type { Task } from "@/entities/task";
import { TaskFavoriteButton } from "@/features/task-favorite";
import { TaskTableHeader, TaskTableRow } from "@/features/task-table";
import { NodeCount, TreeToggleIcon, TreeNodeHeader, TaskListWrapper } from "@/shared/ui";
import styles from "./GroupOverviewPage.module.css";

export interface GroupTaskListProps {
  tasks: Task[];
  groupedSubgroups: Record<string, Task[]>;
  hasSubgroups: boolean;
  groupName?: string;
  folderColor?: string;
  isSubgroupOpen: (subName: string) => boolean;
  toggleSubgroup: (subName: string) => void;
  taskRoute: string;
  getTaskStatus: (taskId: string | number) => "solved" | "unsolved" | "unstarted";
  reviews: Record<string, ReviewItem>;
  completedTasks: Record<string, TaskCompletionStatus>;
}

interface GroupHeaderMetaProps {
  completed: number;
  total: number;
  completedClass: string;
}

const GroupHeaderMeta = ({
  completed,
  total,
  completedClass,
}: Readonly<GroupHeaderMetaProps>): React.JSX.Element => (
  <div className={styles.groupHeaderMeta}>
    <NodeCount
      completed={completed}
      total={total}
      completedClass={completedClass}
      className={styles.statusNodeCount}
    />
    <span className={styles.favoriteColumnPlaceholder} aria-hidden="true" />
  </div>
);

export const GroupTaskList = React.memo(
  ({
    tasks,
    groupedSubgroups,
    hasSubgroups,
    groupName = "",
    folderColor,
    isSubgroupOpen,
    toggleSubgroup,
    taskRoute,
    getTaskStatus,
    reviews,
    completedTasks,
  }: GroupTaskListProps): React.JSX.Element => {
    if (tasks.length === 0) {
      return (
        <div className={styles.emptyState}>
          <h2>По выбранному фильтру задач нет</h2>
          <p>Измените фильтр, чтобы увидеть остальные задачи.</p>
        </div>
      );
    }

    const renderTaskRow = (task: Task): React.JSX.Element => {
      return (
        <TaskTableRow
          key={task.id}
          task={task}
          to={taskRoute}
          status={getTaskStatus(task.id)}
          review={reviews[String(task.id)]}
          favoriteMarker={
            <TaskFavoriteButton
              taskId={task.id}
              taskTitle={task.title}
              size="sm"
              iconSize={13}
              className={styles.taskFavoriteQuickAction}
            />
          }
        />
      );
    };

    return (
      <div className={styles.folderPageTree}>
        <TaskTableHeader />

        {hasSubgroups ? (
          Object.entries(groupedSubgroups).map(([subgroupName, subTasks]) => {
            if (subTasks.length === 0) return null;
            const isOpen = isSubgroupOpen(subgroupName);
            const completedSubCount = subTasks.filter(
              (t) => getTaskStatus(t.id) === "solved"
            ).length;
            const completionClass = getGroupCompletionClass(subTasks, reviews, completedTasks);
            const subgroupId = `subgroup-${groupName}-${subgroupName}`;

            return (
              <div className={styles.treeGroupBlock} key={`${groupName || ""}-${subgroupName}`}>
                <TreeNodeHeader className={styles.subgroupHeader}>
                  <TreeToggleIcon
                    icon={<Folder size={17} className={styles.folderIcon} color={folderColor} />}
                    size="md"
                    expanded={isOpen}
                    onToggle={() => toggleSubgroup(subgroupName)}
                  />

                  <Link
                    to={taskRoute}
                    params={{ taskId: subgroupId }}
                    className={styles.nodeTitleLink}
                    title={`Открыть раздел «${subgroupName}»`}
                  >
                    <span className={styles.nodeTitle}>{subgroupName}</span>
                  </Link>

                  <GroupHeaderMeta
                    completed={completedSubCount}
                    total={subTasks.length}
                    completedClass={completionClass}
                  />
                </TreeNodeHeader>

                <TaskListWrapper expanded={isOpen} className={styles.treeTasksContainer}>
                  {subTasks.map(renderTaskRow)}
                </TaskListWrapper>
              </div>
            );
          })
        ) : (
          <div className={styles.folderPageTree}>{tasks.map(renderTaskRow)}</div>
        )}
      </div>
    );
  }
);

GroupTaskList.displayName = "GroupTaskList";
