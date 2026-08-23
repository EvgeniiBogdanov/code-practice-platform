import React from "react";
import { clsx } from "clsx";
import styles from "./Tabs.module.css";

export interface TabItem {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ items, activeId, onChange, className }: TabsProps) {
  return (
    <div className={clsx(styles.tabList, className)} role="tablist">
      {items.map((item) => {
        const isActive = item.id === activeId;
        const activeVariantClass =
          item.id === "candidate"
            ? styles.activeCandidate
            : item.id === "solution"
              ? styles.activeSolution
              : item.id === "materials"
                ? styles.activeMaterials
                : item.id === "checklist"
                  ? styles.activeChecklist
                  : item.id === "questions"
                    ? styles.activeQuestions
                    : "";

        return (
          <button
            key={item.id}
            role="tab"
            aria-selected={isActive}
            disabled={item.disabled}
            className={clsx(styles.tab, isActive && styles.active, isActive && activeVariantClass)}
            onClick={() => onChange(item.id)}
            type="button"
          >
            {item.icon && <span className={styles.tabIcon}>{item.icon}</span>}
            <span>{item.label}</span>
            {item.badge !== undefined && <span className={styles.tabBadge}>{item.badge}</span>}
          </button>
        );
      })}
    </div>
  );
}
