import { Task } from "@/entities/task";

export interface FavoriteTaskSubfolderNode {
  key: string;
  title: string;
  tasks: Task[];
}

export interface FavoriteTaskFolderNode {
  key: string;
  title: string;
  tasks: Task[];
  subfolders: FavoriteTaskSubfolderNode[];
}

const getFolderTitle = (task: Task): string => {
  return task.group?.trim() || task.category?.trim() || "Без папки";
};

export const buildFavoriteTaskTree = (tasks: readonly Task[]): FavoriteTaskFolderNode[] => {
  const folders: FavoriteTaskFolderNode[] = [];

  tasks.forEach((task) => {
    const folderTitle = getFolderTitle(task);
    const folderKey = `folder:${task.section}:${folderTitle}`;
    const folderNode = folders.find((folder) => folder.key === folderKey) ?? {
      key: folderKey,
      title: folderTitle,
      tasks: [],
      subfolders: [],
    };

    if (!folders.includes(folderNode)) folders.push(folderNode);

    const subfolderTitle = task.subgroup?.trim();
    if (!subfolderTitle) {
      folderNode.tasks.push(task);
      return;
    }

    const subfolderKey = `${folderKey}/subfolder:${subfolderTitle}`;
    const subfolderNode = folderNode.subfolders.find((node) => node.key === subfolderKey) ?? {
      key: subfolderKey,
      title: subfolderTitle,
      tasks: [],
    };

    if (!folderNode.subfolders.includes(subfolderNode)) folderNode.subfolders.push(subfolderNode);
    subfolderNode.tasks.push(task);
  });

  return folders;
};
