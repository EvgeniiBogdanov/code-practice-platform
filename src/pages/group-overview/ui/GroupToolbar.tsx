import React from "react";
import { LayoutList, LayoutGrid } from "lucide-react";
import { Button } from "@/shared/ui";
import { StatusFilter, ViewMode } from "../model/types";
import styles from "./GroupOverviewPage.module.css";

export interface GroupToolbarProps {
  statusFilter: StatusFilter;
  setStatusFilter: (filter: StatusFilter) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export const GroupToolbar = React.memo<GroupToolbarProps>(
  ({ statusFilter, setStatusFilter, viewMode, setViewMode }) => {
    return (
      <div className={styles.folderToolbar}>
        {/* Status Filter Pills */}
        <div className={styles.pillGroup}>
          <Button
            variant="ghost"
            size="sm"
            isActive={statusFilter === "all"}
            onClick={() => setStatusFilter("all")}
          >
            Все
          </Button>
          <Button
            variant="ghost"
            size="sm"
            isActive={statusFilter === "completed"}
            onClick={() => setStatusFilter("completed")}
          >
            Решено
          </Button>
          <Button
            variant="ghost"
            size="sm"
            isActive={statusFilter === "uncompleted"}
            onClick={() => setStatusFilter("uncompleted")}
          >
            Не решено
          </Button>
        </div>

        {/* View Switcher */}
        <div className={styles.dbViewSwitch}>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<LayoutList size={14} />}
            isActive={viewMode === "list"}
            onClick={() => setViewMode("list")}
            title="Вид: Список"
          >
            Список
          </Button>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<LayoutGrid size={14} />}
            isActive={viewMode === "cards"}
            onClick={() => setViewMode("cards")}
            title="Вид: Карточки"
          >
            Карточки
          </Button>
        </div>
      </div>
    );
  }
);

GroupToolbar.displayName = "GroupToolbar";
