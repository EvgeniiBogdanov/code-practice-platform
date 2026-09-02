import React, { memo } from "react";
import { Code2, Zap, Brain, FileText } from "lucide-react";
import { clsx } from "clsx";
import type { Task } from "@/entities/task/meta";
import { Badge, type BadgeVariant } from "@/shared/ui";
import styles from "./CommandPalette.module.css";

const SECTION_CONFIG: Record<
  string,
  { label: string; icon: React.ReactNode; variant: BadgeVariant }
> = {
  react: {
    label: "REACT",
    icon: <Code2 size={11} className={styles.iconReact} />,
    variant: "blue",
  },
  javascript: {
    label: "JS",
    icon: <Zap size={11} className={styles.iconJs} />,
    variant: "yellow",
  },
  algorithms: {
    label: "ALGO",
    icon: <Brain size={11} className={styles.iconAlgo} />,
    variant: "purple",
  },
};

const getDifficultyMeta = (diff?: string): { text: string; variant: BadgeVariant } => {
  const d = String(diff || "").toLowerCase();
  if (d === "warm-up" || d === "hard") {
    return { text: d === "warm-up" ? "Разминка" : "Сложно", variant: "red" };
  }
  if (d === "refactoring") {
    return { text: "Рефакторинг", variant: "blue" };
  }
  if (d === "middle" || d === "easy") {
    return { text: d === "middle" ? "Middle" : "Легко", variant: "green" };
  }
  if (d === "strong") {
    return { text: "Strong", variant: "purple" };
  }
  if (d === "ts" || d === "medium") {
    return { text: d === "ts" ? "TypeScript" : "Средне", variant: "yellow" };
  }
  return { text: "Легко", variant: "green" };
};

export interface CommandPaletteItemProps {
  task: Task;
  isSelected: boolean;
  showSectionBadge: boolean;
  onSelect: (task: Task) => void;
  onMouseEnter: () => void;
}

export const CommandPaletteItem = memo(
  ({ task, isSelected, showSectionBadge, onSelect, onMouseEnter }: CommandPaletteItemProps) => {
    const sec = SECTION_CONFIG[task.section] || SECTION_CONFIG.react;
    const diff = task.difficulty ? getDifficultyMeta(task.difficulty) : null;

    return (
      <button
        type="button"
        className={clsx(styles.paletteItem, isSelected && styles.active)}
        onClick={() => onSelect(task)}
        onMouseEnter={onMouseEnter}
      >
        {showSectionBadge && (
          <Badge
            size="sm"
            variant={sec.variant}
            icon={sec.icon}
            uppercase={true}
            className={styles.sectionBadge}
          >
            {sec.label}
          </Badge>
        )}

        <FileText size={15} className={styles.nodeFileIcon} />
        <span className={styles.paletteItemTitle}>{task.title}</span>

        {diff && (
          <Badge
            size="sm"
            variant={diff.variant}
            uppercase={true}
            className={styles.diffBadge}
          >
            {diff.text}
          </Badge>
        )}

        {task.group && (
          <Badge
            size="sm"
            variant="gray"
            uppercase={false}
            className={styles.groupBadge}
          >
            {task.group}
          </Badge>
        )}
      </button>
    );
  }
);

CommandPaletteItem.displayName = "CommandPaletteItem";
