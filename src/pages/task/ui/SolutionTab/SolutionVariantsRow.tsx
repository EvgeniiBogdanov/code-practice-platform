import React, { memo } from "react";
import { FileCode, Check } from "lucide-react";
import { clsx } from "clsx";
import { TaskSolution } from "@/entities/task";
import styles from "./SolutionTab.module.css";

export interface SolutionVariantsRowProps {
  solutions: TaskSolution[];
  selectedIdx: number;
  onSelect: (idx: number) => void;
}

export const SolutionVariantsRow = memo(
  ({ solutions, selectedIdx, onSelect }: SolutionVariantsRowProps) => {
    if (solutions.length <= 1) return null;

    return (
      <div className={styles.variantsRow}>
        {solutions.map((sol, idx) => {
          const isActive = idx === selectedIdx;
          return (
            <button
              key={sol.title || idx}
              type="button"
              className={clsx(styles.variantBtn, isActive && styles.activeVariant)}
              onClick={() => onSelect(idx)}
            >
              <FileCode size={13} />
              <span>{sol.title || `Вариант ${idx + 1}`}</span>
              {sol.isRecommended && <Check size={13} className={styles.recommendedCheck} />}
            </button>
          );
        })}
      </div>
    );
  }
);

SolutionVariantsRow.displayName = "SolutionVariantsRow";
