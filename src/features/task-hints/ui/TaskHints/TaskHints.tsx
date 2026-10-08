import { useEffect, useState, type JSX, type ReactNode } from "react";
import { clsx } from "clsx";
import { ChevronDown, Compass, Lightbulb, TriangleAlert } from "lucide-react";
import { loadTaskHints, type SectionType, type TaskHints as TaskHintsData } from "@/entities/task";
import { Accordion, Button, Callout, MarkdownView, type CalloutColor } from "@/shared/ui";
import styles from "./TaskHints.module.css";

interface HintLevel {
  title: string;
  icon: ReactNode;
  color: CalloutColor;
  nextLabel: string;
}

const HINT_LEVELS: readonly HintLevel[] = [
  { title: "Идея", icon: <Lightbulb size={18} />, color: "yellow", nextLabel: "Показать идею" },
  {
    title: "Ловушки и граничные случаи",
    icon: <TriangleAlert size={18} />,
    color: "orange",
    nextLabel: "Показать ловушки",
  },
  {
    title: "План решения",
    icon: <Compass size={18} />,
    color: "green",
    nextLabel: "Показать план решения (почти спойлер)",
  },
];

export interface TaskHintsProps {
  section: SectionType;
  taskId: string | number;
  className?: string;
}

/** Progressive hints for one task. Mount it with `key={taskId}` so the revealed level resets. */
export const TaskHints = ({ section, taskId, className }: TaskHintsProps): JSX.Element | null => {
  const [hints, setHints] = useState<TaskHintsData | null>(null);
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    let isMounted = true;
    loadTaskHints(section, taskId).then((loaded) => {
      if (isMounted) setHints(loaded);
    });
    return (): void => {
      isMounted = false;
    };
  }, [section, taskId]);

  if (!hints) return null;

  const nextLevel = HINT_LEVELS[revealed];

  return (
    <Accordion
      size="xs"
      color="yellow"
      className={className}
      icon={<Lightbulb size={13} />}
      title={<strong>Подсказки</strong>}
      badge={
        <span className={styles.counter}>
          {revealed}/{HINT_LEVELS.length}
        </span>
      }
    >
      <div className={styles.body}>
        {HINT_LEVELS.slice(0, revealed).map((level, index) => (
          <Callout
            key={level.title}
            size="sm"
            color={level.color}
            icon={level.icon}
            title={level.title}
          >
            <MarkdownView content={hints[index]} compact />
          </Callout>
        ))}
        {nextLevel ? (
          <Button
            variant="ghost"
            size="sm"
            rightIcon={<ChevronDown size={14} />}
            className={clsx(styles.revealButton, styles[`reveal-${nextLevel.color}`])}
            onClick={(): void => setRevealed((count) => count + 1)}
          >
            {nextLevel.nextLabel}
          </Button>
        ) : null}
      </div>
    </Accordion>
  );
};
