import React from "react";
import { LayoutList, Network } from "lucide-react";
import { SKILL_FILTER_OPTIONS, type SkillFilter } from "@/features/skill-map";
import { Button, Tooltip } from "@/shared/ui";
import type { SkillMapView } from "../model/skillsSearch";
import styles from "./SkillsToolbar.module.css";

export interface SkillsToolbarProps {
  filter: SkillFilter;
  onFilterChange: (filter: SkillFilter) => void;
  view: SkillMapView;
  onViewChange: (view: SkillMapView) => void;
}

/** Filter pills and the view switch, laid out like the folder toolbar. */
export const SkillsToolbar = React.memo<SkillsToolbarProps>(
  ({ filter, onFilterChange, view, onViewChange }) => (
    <div className={styles.toolbar}>
      <div role="group" aria-label="Фильтр навыков" className={styles.pills}>
        {SKILL_FILTER_OPTIONS.map((option) => (
          <Button
            key={option.value}
            variant="ghost"
            size="sm"
            isActive={filter === option.value}
            onClick={(): void => onFilterChange(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>

      <div role="group" aria-label="Вид маршрута" className={styles.viewSwitch}>
        <Tooltip content="Вид: Граф" side="bottom">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Network size={14} />}
            isActive={view === "graph"}
            onClick={(): void => onViewChange("graph")}
          >
            Граф
          </Button>
        </Tooltip>
        <Tooltip content="Вид: Список" side="bottom">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<LayoutList size={14} />}
            isActive={view === "list"}
            onClick={(): void => onViewChange("list")}
          >
            Список
          </Button>
        </Tooltip>
      </div>
    </div>
  )
);

SkillsToolbar.displayName = "SkillsToolbar";
