import React, { memo } from "react";
import { Code2, Zap, Brain, FileText } from "lucide-react";
import { clsx } from "clsx";
import type { Task } from "@/entities/task/meta";
import { getGroupMeta, getAlgoGroupMeta } from "@/entities/task/groups";
import { Badge } from "@/shared/ui";
import styles from "./CommandPalette.module.css";

const SECTION_CONFIG: Record<
  string,
  { label: string; icon: React.ReactNode; color: string; bg: string }
> = {
  react: {
    label: "REACT",
    icon: <Code2 size={11} style={{ color: "#3b82f6" }} />,
    color: "#3b82f6",
    bg: "rgba(59, 130, 246, 0.12)",
  },
  javascript: {
    label: "JS",
    icon: <Zap size={11} style={{ color: "#f59e0b" }} />,
    color: "#f59e0b",
    bg: "rgba(245, 158, 11, 0.12)",
  },
  algorithms: {
    label: "ALGO",
    icon: <Brain size={11} style={{ color: "#a855f7" }} />,
    color: "#a855f7",
    bg: "rgba(168, 85, 247, 0.12)",
  },
};

const getDifficultyMeta = (diff?: string) => {
  const d = String(diff || "").toLowerCase();
  if (d === "warm-up") {
    return { text: "Разминка", color: "#ff6b6b", bg: "rgba(255, 107, 107, 0.12)" };
  }
  if (d === "refactoring") {
    return { text: "Рефакторинг", color: "#3b82f6", bg: "rgba(59, 130, 246, 0.12)" };
  }
  if (d === "middle") {
    return { text: "Middle", color: "#10b981", bg: "rgba(16, 185, 129, 0.12)" };
  }
  if (d === "strong") {
    return { text: "Strong", color: "#a855f7", bg: "rgba(168, 85, 247, 0.12)" };
  }
  if (d === "ts") {
    return { text: "TypeScript", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.12)" };
  }
  if (d === "hard") {
    return { text: "Сложно", color: "#ef4444", bg: "rgba(239, 68, 68, 0.12)" };
  }
  if (d === "medium") {
    return { text: "Средне", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.12)" };
  }
  return { text: "Легко", color: "#10b981", bg: "rgba(16, 185, 129, 0.12)" };
};

const renderGroupBadge = (task: Task) => {
  if (task.section === "javascript" && task.group) {
    const meta = getGroupMeta(task.group);
    return (
      <Badge
        size="sm"
        uppercase={false}
        style={{ color: meta.color, backgroundColor: meta.bg }}
        className={styles.groupBadge}
      >
        {task.group}
      </Badge>
    );
  }
  if (task.section === "algorithms" && task.group) {
    const meta = getAlgoGroupMeta(task.group);
    return (
      <Badge
        size="sm"
        uppercase={false}
        style={{ color: meta.color, backgroundColor: meta.bg }}
        className={styles.groupBadge}
      >
        {task.group}
      </Badge>
    );
  }
  return null;
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
            icon={sec.icon}
            uppercase={true}
            style={{ color: sec.color, backgroundColor: sec.bg }}
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
            uppercase={true}
            style={{ color: diff.color, backgroundColor: diff.bg }}
            className={styles.diffBadge}
          >
            {diff.text}
          </Badge>
        )}

        {renderGroupBadge(task)}
      </button>
    );
  }
);

CommandPaletteItem.displayName = "CommandPaletteItem";
