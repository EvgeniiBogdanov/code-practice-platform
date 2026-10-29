import React, { useId } from "react";
import { clsx } from "clsx";
import { Check } from "lucide-react";
import styles from "./UiChoiceList.module.css";

export type UiChoiceTone = "success";

export interface UiChoiceOption {
  id: string;
  label: React.ReactNode;
  /** Shown under the label, e.g. the trade-offs of the option once the question is answered. */
  description?: React.ReactNode;
  /** Short statuses next to the label: «Рекомендуем», «Ваш выбор». */
  tags?: React.ReactNode;
  /** Colours the whole row, e.g. the recommended option after an answer. */
  tone?: UiChoiceTone;
}

export interface UiChoiceListProps {
  options: readonly UiChoiceOption[];
  value: string | undefined;
  onChange: (id: string) => void;
  /** Id of the visible question that names the group. */
  labelledBy?: string;
  /** Marks the options A, B, C… like a test. */
  showKeys?: boolean;
  className?: string;
}

const KEY_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * Single choice as full-width cards on native radio inputs: arrow keys move between options, and
 * only the label names an option, while its tags and description describe it.
 */
export const UiChoiceList = ({
  options,
  value,
  onChange,
  labelledBy,
  showKeys = false,
  className,
}: UiChoiceListProps): React.JSX.Element => {
  const groupId = useId();

  return (
    <div className={clsx(styles.list, className)} role="radiogroup" aria-labelledby={labelledBy}>
      {options.map((option, index) => {
        const isChecked = option.id === value;
        const labelId = `${groupId}-${option.id}-label`;
        const tagsId = `${groupId}-${option.id}-tags`;
        const descriptionId = `${groupId}-${option.id}-description`;
        const describedBy = [
          option.tags !== undefined && tagsId,
          option.description !== undefined && descriptionId,
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <label
            key={option.id}
            className={clsx(
              styles.option,
              isChecked && styles.checked,
              option.tone && styles[option.tone]
            )}
          >
            <input
              type="radio"
              name={groupId}
              className={styles.input}
              checked={isChecked}
              onChange={() => onChange(option.id)}
              aria-labelledby={labelId}
              aria-describedby={describedBy || undefined}
            />
            <span className={styles.indicator} aria-hidden="true">
              {showKeys ? (
                <span className={styles.letter}>{KEY_LETTERS[index]}</span>
              ) : (
                <Check className={styles.checkIcon} size={12} strokeWidth={3} />
              )}
            </span>
            <span className={styles.body}>
              {option.tags !== undefined && (
                <span id={tagsId} className={styles.tags}>
                  {option.tags}
                </span>
              )}
              <span id={labelId} className={styles.label}>
                {option.label}
              </span>
              {option.description !== undefined && (
                <span id={descriptionId} className={styles.description}>
                  {option.description}
                </span>
              )}
            </span>
          </label>
        );
      })}
    </div>
  );
};

UiChoiceList.displayName = "UiChoiceList";
