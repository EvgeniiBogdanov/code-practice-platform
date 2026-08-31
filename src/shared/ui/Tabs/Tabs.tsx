import React, { memo } from "react";
import { clsx } from "clsx";
import { NotificationBadge, NotificationBadgeVariant } from "../NotificationBadge";
import styles from "./Tabs.module.css";

export interface TabItem {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  badgeVariant?: NotificationBadgeVariant;
  disabled?: boolean;
}

export type TabsVariant = "underline" | "pills";
export type TabsSize = "sm" | "md";
export type TabsOrientation = "horizontal" | "vertical";

export interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  variant?: TabsVariant;
  size?: TabsSize;
  orientation?: TabsOrientation;
  ariaLabel?: string;
  className?: string;
}

export const Tabs = memo(
  ({
    items,
    activeId,
    onChange,
    variant = "underline",
    size = "md",
    orientation = "horizontal",
    ariaLabel,
    className,
  }: TabsProps): React.JSX.Element => {
    return (
      <div
        className={clsx(
          styles.tabList,
          variant === "pills" && styles.variant_pills,
          size === "sm" && styles.size_sm,
          orientation === "vertical" && styles.orientation_vertical,
          className
        )}
        role="tablist"
        aria-orientation={orientation}
        aria-label={ariaLabel}
      >
        {items.map((item) => {
          const isActive = item.id === activeId;
          const activeVariantClass =
            variant === "underline" && orientation === "horizontal"
              ? item.id === "candidate"
                ? styles.activeCandidate
                : item.id === "solution"
                  ? styles.activeSolution
                  : item.id === "materials"
                    ? styles.activeMaterials
                    : item.id === "checklist"
                      ? styles.activeChecklist
                      : item.id === "questions"
                        ? styles.activeQuestions
                        : ""
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
              <span className={styles.tabLabel}>{item.label}</span>
              {item.badge !== undefined &&
                (React.isValidElement(item.badge) ? (
                  item.badge
                ) : (
                  <NotificationBadge
                    count={item.badge as number | string}
                    variant={item.badgeVariant ?? "neutral"}
                    pinned={false}
                    ring={false}
                    size="tab"
                  />
                ))}
            </button>
          );
        })}
      </div>
    );
  }
);

Tabs.displayName = "Tabs";
