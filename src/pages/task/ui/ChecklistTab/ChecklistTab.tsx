import React from "react";
import { Task } from "@/entities/task";
import { useProgressStore } from "@/entities/progress";
import { Checkbox } from "@/shared/ui";
import styles from "./ChecklistTab.module.css";

export interface ChecklistTabProps {
  task: Task;
  className?: string;
}

export function ChecklistTab({ task, className }: ChecklistTabProps) {
  const checklistState = useProgressStore((state) => state.checklistState);
  const toggleChecklistItem = useProgressStore((state) => state.toggleChecklistItem);

  const checklistItems = task.checklist || [];
  const keys = checklistItems.map((_, i) => `check-${task.id}-${i}`);
  const doneCount = keys.filter((k) => checklistState[k]).length;
  const total = checklistItems.length || 1;
  const percent = Math.round((doneCount / total) * 100);

  return (
    <div className={[styles.container, className].filter(Boolean).join(" ")}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>📋 Самопроверка</h3>
          <p className={styles.subtitle}>
            Убедитесь, что ваше решение соответствует ключевым требованиям задачи и современным
            лучшим практикам.
          </p>
        </div>
        <div className={styles.scoreBadge}>{percent}% Готов к ответу</div>
      </div>

      {checklistItems.length > 0 ? (
        <div className={styles.section}>
          {checklistItems.map((item, i) => {
            const itemKey = `check-${task.id}-${i}`;
            const isChecked = Boolean(checklistState[itemKey]);

            return (
              <Checkbox
                key={itemKey}
                checked={isChecked}
                onChange={() => toggleChecklistItem(itemKey)}
                label={item}
                strikethrough
                color="blue"
              />
            );
          })}
        </div>
      ) : (
        <div className={styles.empty}>Для данной задачи чек-лист формируется.</div>
      )}
    </div>
  );
}
