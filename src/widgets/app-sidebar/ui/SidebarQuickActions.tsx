import React, { memo } from "react";
import { BarChart2, Lightbulb, Search } from "lucide-react";
import type { SectionType } from "@/entities/task/meta";
import { useUIStore } from "@/entities/ui-state";
import { SquareButton, Tooltip } from "@/shared/ui";
import { SidebarFavorites } from "./SidebarFavorites/SidebarFavorites";
import styles from "./SidebarQuickActions.module.css";

export interface SidebarQuickActionsProps {
  section: SectionType;
  currentTaskId: string;
}

export const SidebarQuickActions = memo(
  ({ section, currentTaskId }: Readonly<SidebarQuickActionsProps>): React.JSX.Element => {
    const setPaletteOpen = useUIStore((state) => state.setPaletteOpen);
    const setStatsModalOpen = useUIStore((state) => state.setStatsModalOpen);
    const setCheatSheetOpen = useUIStore((state) => state.setCheatSheetOpen);
    const statsModalOpen = useUIStore((state) => state.statsModalOpen);
    const cheatSheetOpen = useUIStore((state) => state.cheatSheetOpen);

    return (
      <div className={styles.quickActions} aria-label="Быстрые действия">
        <Tooltip content="Статистика повторений" side="right" sideOffset={8}>
          <SquareButton
            icon={<BarChart2 size={16} />}
            isActive={statsModalOpen}
            onClick={() => setStatsModalOpen(!statsModalOpen)}
            aria-label="Статистика повторений"
          />
        </Tooltip>

        <Tooltip content="Шпаргалка" side="right" sideOffset={8}>
          <SquareButton
            icon={<Lightbulb size={16} />}
            isActive={cheatSheetOpen}
            onClick={() => setCheatSheetOpen(!cheatSheetOpen)}
            aria-label="Шпаргалка"
          />
        </Tooltip>

        <Tooltip content="Поиск по задачам (⌘K)" side="right" sideOffset={8}>
          <SquareButton
            icon={<Search size={16} />}
            onClick={() => setPaletteOpen(true)}
            aria-label="Поиск по задачам (Cmd+K)"
          />
        </Tooltip>

        <SidebarFavorites section={section} currentTaskId={currentTaskId} />
      </div>
    );
  }
);

SidebarQuickActions.displayName = "SidebarQuickActions";
