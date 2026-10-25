import React from "react";
import { Checkbox } from "@/shared/ui";
import styles from "./StageRubric.module.css";

export interface StageRubricProps {
  items: readonly string[];
  checkedIndexes: readonly number[];
  onToggle: (index: number) => void;
}

/** Self-check against the reference: the stage is done once every item is ticked. */
export const StageRubric = ({
  items,
  checkedIndexes,
  onToggle,
}: StageRubricProps): React.JSX.Element => (
  <ul className={styles.list}>
    {items.map((item, index) => (
      <li key={item}>
        <Checkbox
          color="green"
          checked={checkedIndexes.includes(index)}
          onChange={() => onToggle(index)}
          label={item}
        />
      </li>
    ))}
  </ul>
);
