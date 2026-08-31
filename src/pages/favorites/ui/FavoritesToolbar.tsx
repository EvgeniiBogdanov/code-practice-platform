import React from "react";
import { FolderTree, LayoutGrid, LayoutList } from "lucide-react";
import { Button } from "@/shared/ui";
import type {
  FavoriteListDisplayMode,
  FavoriteStatusFilter,
  FavoritesViewMode,
} from "../model/use-favorites-page";
import styles from "./FavoritesPage.module.css";

export interface FavoritesToolbarProps {
  statusFilter: FavoriteStatusFilter;
  viewMode: FavoritesViewMode;
  listDisplayMode: FavoriteListDisplayMode;
  onStatusFilterChange: (filter: FavoriteStatusFilter) => void;
  onViewModeChange: (mode: FavoritesViewMode) => void;
  onListDisplayModeChange: (mode: FavoriteListDisplayMode) => void;
}

export const FavoritesToolbar = React.memo(
  ({
    statusFilter,
    viewMode,
    listDisplayMode,
    onStatusFilterChange,
    onViewModeChange,
    onListDisplayModeChange,
  }: Readonly<FavoritesToolbarProps>): React.JSX.Element => (
    <div className={styles.toolbar}>
      <div className={styles.toolbarGroup} aria-label="Фильтр избранных задач">
        <Button
          size="sm"
          variant="ghost"
          isActive={statusFilter === "all"}
          onClick={() => onStatusFilterChange("all")}
        >
          Все
        </Button>
        <Button
          size="sm"
          variant="ghost"
          isActive={statusFilter === "solved"}
          onClick={() => onStatusFilterChange("solved")}
        >
          Решено
        </Button>
        <Button
          size="sm"
          variant="ghost"
          isActive={statusFilter === "unsolved"}
          onClick={() => onStatusFilterChange("unsolved")}
        >
          Не решено
        </Button>
      </div>

      {viewMode === "list" ? (
        <div className={styles.toolbarGroup} aria-label="Структура списка">
          <Button
            size="sm"
            variant="ghost"
            leftIcon={<FolderTree size={14} />}
            isActive={listDisplayMode === "folders"}
            onClick={() => onListDisplayModeChange("folders")}
          >
            С папками
          </Button>
          <Button
            size="sm"
            variant="ghost"
            leftIcon={<LayoutList size={14} />}
            isActive={listDisplayMode === "tasks"}
            onClick={() => onListDisplayModeChange("tasks")}
          >
            Только задачи
          </Button>
        </div>
      ) : null}

      <div className={styles.toolbarGroup} aria-label="Режим отображения">
        <Button
          size="sm"
          variant="ghost"
          leftIcon={<LayoutList size={14} />}
          isActive={viewMode === "list"}
          onClick={() => onViewModeChange("list")}
        >
          Список
        </Button>
        <Button
          size="sm"
          variant="ghost"
          leftIcon={<LayoutGrid size={14} />}
          isActive={viewMode === "cards"}
          onClick={() => onViewModeChange("cards")}
        >
          Карточки
        </Button>
      </div>
    </div>
  )
);

FavoritesToolbar.displayName = "FavoritesToolbar";
