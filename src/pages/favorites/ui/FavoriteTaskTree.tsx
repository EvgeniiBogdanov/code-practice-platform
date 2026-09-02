import React from "react";
import { Link } from "@tanstack/react-router";
import { Folder } from "lucide-react";
import type { ReviewItem } from "@/entities/review";
import type { SectionType, Task } from "@/entities/task";
import { TaskFavoriteButton } from "@/features/task-favorite";
import { TaskTableHeader, TaskTableRow } from "@/features/task-table";
import { NodeCount, TaskListWrapper, TreeNodeHeader, TreeToggleIcon } from "@/shared/ui";
import { getFavoriteFolderVisual } from "../lib/get-favorite-folder-visual";
import type {
  FavoriteTaskFolderNode,
  FavoriteTaskSubfolderNode,
} from "../model/favorite-task-tree";
import { useFavoriteTreeExpansion } from "../model/use-favorite-tree-expansion";
import type { FavoriteTaskStatus } from "../model/use-favorites-page";
import styles from "./FavoritesPage.module.css";

interface NodeDataProps {
  taskRoute: string;
  reviews: Record<string, ReviewItem>;
  getTaskStatus: (taskId: string | number) => FavoriteTaskStatus;
}

interface NodeTasksProps extends NodeDataProps {
  tasks: Task[];
}

const NodeTasks = ({
  tasks,
  taskRoute,
  reviews,
  getTaskStatus,
}: Readonly<NodeTasksProps>): React.JSX.Element => (
  <>
    {tasks.map((task) => (
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
    ))}
  </>
);

interface FavoriteSubfolderProps extends NodeDataProps {
  node: FavoriteTaskSubfolderNode;
  folderTitle: string;
  folderColor: string;
  expanded: boolean;
  onToggle: (key: string) => void;
}

interface FavoriteSubfolderHeaderProps {
  node: FavoriteTaskSubfolderNode;
  taskRoute: string;
  folderColor: string;
  routeId: string;
  expanded: boolean;
  onToggle: (key: string) => void;
}

interface FavoriteHeaderMetaProps {
  total: number;
}

const FavoriteHeaderMeta = ({ total }: Readonly<FavoriteHeaderMetaProps>): React.JSX.Element => (
  <div className={styles.favoriteHeaderMeta}>
    <NodeCount total={total} completed={0} variant="count" className={styles.statusNodeCount} />
    <span className={styles.favoriteColumnPlaceholder} aria-hidden="true" />
  </div>
);

const FavoriteSubfolderHeader = ({
  node,
  taskRoute,
  folderColor,
  routeId,
  expanded,
  onToggle,
}: Readonly<FavoriteSubfolderHeaderProps>): React.JSX.Element => (
  <TreeNodeHeader className={styles.subfolderHeader} aria-expanded={expanded}>
    <TreeToggleIcon
      icon={<Folder size={17} color={folderColor} />}
      expanded={expanded}
      onToggle={() => onToggle(node.key)}
      size="md"
    />
    <Link
      to={taskRoute}
      params={{ taskId: routeId }}
      className={styles.nodeTitleLink}
      aria-label={`Открыть раздел «${node.title}»`}
    >
      <span className={styles.nodeTitle}>{node.title}</span>
    </Link>
    <FavoriteHeaderMeta total={node.tasks.length} />
  </TreeNodeHeader>
);

const FavoriteSubfolder = ({
  node,
  folderTitle,
  folderColor,
  expanded,
  onToggle,
  ...nodeData
}: Readonly<FavoriteSubfolderProps>): React.JSX.Element => {
  const routeId = `subgroup-${folderTitle}-${node.title}`;

  return (
    <div className={styles.treeBlock}>
      <FavoriteSubfolderHeader
        node={node}
        taskRoute={nodeData.taskRoute}
        folderColor={folderColor}
        routeId={routeId}
        expanded={expanded}
        onToggle={onToggle}
      />
      <TaskListWrapper expanded={expanded} className={styles.treeTasksContainer}>
        <NodeTasks tasks={node.tasks} {...nodeData} />
      </TaskListWrapper>
    </div>
  );
};

interface FavoriteFolderProps extends NodeDataProps {
  node: FavoriteTaskFolderNode;
  section: SectionType;
  isExpanded: (key: string) => boolean;
  onToggle: (key: string) => void;
}

interface FavoriteFolderHeaderProps {
  node: FavoriteTaskFolderNode;
  taskRoute: string;
  routeId: string;
  icon: React.ReactNode;
  expanded: boolean;
  totalCount: number;
  onToggle: (key: string) => void;
}

const FavoriteFolderHeader = ({
  node,
  taskRoute,
  routeId,
  icon,
  expanded,
  totalCount,
  onToggle,
}: Readonly<FavoriteFolderHeaderProps>): React.JSX.Element => (
  <TreeNodeHeader className={styles.folderHeader} aria-expanded={expanded}>
    <TreeToggleIcon icon={icon} expanded={expanded} onToggle={() => onToggle(node.key)} size="md" />
    <Link
      to={taskRoute}
      params={{ taskId: routeId }}
      className={styles.nodeTitleLink}
      aria-label={`Открыть раздел «${node.title}»`}
    >
      <span className={styles.nodeTitle}>{node.title}</span>
    </Link>
    <FavoriteHeaderMeta total={totalCount} />
  </TreeNodeHeader>
);

const FavoriteFolder = ({
  node,
  section,
  isExpanded,
  onToggle,
  ...nodeData
}: Readonly<FavoriteFolderProps>): React.JSX.Element => {
  const expanded = isExpanded(node.key);
  const allTasks = [...node.tasks, ...node.subfolders.flatMap((subfolder) => subfolder.tasks)];
  const visual = getFavoriteFolderVisual(section, node.title);

  return (
    <div className={styles.treeBlock}>
      <FavoriteFolderHeader
        node={node}
        taskRoute={nodeData.taskRoute}
        routeId={visual.routeId}
        icon={visual.icon}
        expanded={expanded}
        totalCount={allTasks.length}
        onToggle={onToggle}
      />
      <TaskListWrapper expanded={expanded} className={styles.treeFoldersContainer}>
        <NodeTasks tasks={node.tasks} {...nodeData} />
        {node.subfolders.map((subfolder) => (
          <FavoriteSubfolder
            key={subfolder.key}
            node={subfolder}
            folderTitle={node.title}
            folderColor={visual.color}
            expanded={isExpanded(subfolder.key)}
            onToggle={onToggle}
            {...nodeData}
          />
        ))}
      </TaskListWrapper>
    </div>
  );
};

export interface FavoriteTaskTreeProps extends Omit<NodeDataProps, "taskRoute"> {
  folders: FavoriteTaskFolderNode[];
  section: SectionType;
}

export const FavoriteTaskTree = ({
  folders,
  section,
  ...nodeData
}: Readonly<FavoriteTaskTreeProps>): React.JSX.Element => {
  const { isExpanded, toggleNode } = useFavoriteTreeExpansion(section);
  const taskRoute = `/${section}/$taskId`;

  return (
    <div className={styles.tree}>
      <TaskTableHeader />
      {folders.map((folder) => (
        <FavoriteFolder
          key={folder.key}
          node={folder}
          section={section}
          taskRoute={taskRoute}
          isExpanded={isExpanded}
          onToggle={toggleNode}
          {...nodeData}
        />
      ))}
    </div>
  );
};
