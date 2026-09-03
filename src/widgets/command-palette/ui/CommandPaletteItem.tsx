import React, { memo } from "react";
import { Code2, Zap, Brain, FileText } from "lucide-react";
import { clsx } from "clsx";
import type { Task } from "@/entities/task/meta";
import { getGroupMeta, getAlgoGroupMeta, REACT_GROUPS_CONFIG } from "@/entities/task/groups";
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
  if (d === "ts") {
    return { text: "TypeScript", variant: "blue" };
  }
  if (d === "medium") {
    return { text: "Средне", variant: "yellow" };
  }
  return { text: "Легко", variant: "green" };
};

const getGroupBadgeVariant = (group?: string, section?: string): BadgeVariant => {
  if (!group) return "gray";

  let colorStr = "";
  if (section === "javascript") {
    colorStr = getGroupMeta(group)?.color || "";
  } else if (section === "algorithms") {
    colorStr = getAlgoGroupMeta(group)?.color || "";
  } else {
    const reactEntry = Object.values(REACT_GROUPS_CONFIG).find(
      (g) => g.name === group || g.title === group
    );
    colorStr = reactEntry?.color || "";
  }

  if (colorStr.includes("pink")) return "pink";
  if (colorStr.includes("yellow")) return "yellow";
  if (colorStr.includes("cyan")) return "cyan";
  if (colorStr.includes("green")) return "green";
  if (colorStr.includes("blue")) return "blue";
  if (colorStr.includes("purple")) return "purple";
  if (colorStr.includes("orange")) return "orange";
  if (colorStr.includes("red")) return "red";

  return "gray";
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
            variant={getGroupBadgeVariant(task.group, task.section)}
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
