import React, { useId } from "react";
import { Check } from "lucide-react";
import { Badge, Checkbox, SegmentedProgress } from "@/shared/ui";
import styles from "./StageRubric.module.css";

export interface StageRubricProps {
  items: readonly string[];
  checkedIndexes: readonly number[];
  onToggle: (index: number) => void;
  /** The forks are answered and every item is ticked. */
  isComplete: boolean;
}

/** Self-check against the reference: the stage is done once every item is ticked. */
export const StageRubric = ({
  items,
  checkedIndexes,
  onToggle,
  isComplete,
}: StageRubricProps): React.JSX.Element => {
  const headingId = useId();
  const checkedCount = items.filter((_, index) => checkedIndexes.includes(index)).length;

  return (
    <section className={styles.card} aria-labelledby={headingId}>
      <header className={styles.header}>
        <h3 id={headingId} className={styles.title}>
          Самопроверка
        </h3>
        {isComplete ? (
          <Badge variant="green" size="sm" icon={<Check size={12} aria-hidden="true" />}>
            Этап пройден
          </Badge>
        ) : (
          <span className={styles.counter}>
            {checkedCount} из {items.length}
          </span>
        )}
      </header>
      <SegmentedProgress
        label="Отмечено пунктов самопроверки"
        segments={items.map((_, index) => (checkedIndexes.includes(index) ? "success" : "neutral"))}
      />
      <p className={styles.hint}>Сверьте свою схему с эталоном и отметьте, что на ней есть.</p>
      <ul className={styles.list}>
        {items.map((item, index) => (
          <li key={item}>
            <Checkbox
              className={styles.item}
              color="green"
              strikethrough={false}
              checked={checkedIndexes.includes(index)}
              onChange={() => onToggle(index)}
              label={item}
            />
          </li>
        ))}
      </ul>
    </section>
  );
};
