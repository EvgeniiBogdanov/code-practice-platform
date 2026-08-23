import React, { memo } from "react";
import { clsx } from "clsx";
import { ChevronDown } from "lucide-react";
import styles from "./Accordion.module.css";

export interface AccordionHeaderProps {
  title: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  size?: "xs" | "sm" | "md";
  isOpen: boolean;
  hasInteracted: boolean;
  onClick: () => void;
  className?: string;
}

export const AccordionHeader = memo(
  ({
    title,
    icon,
    badge,
    size = "md",
    isOpen,
    hasInteracted,
    onClick,
    className,
  }: AccordionHeaderProps) => {
    return (
      <button
        type="button"
        className={clsx(styles.toggleBtn, className)}
        onClick={onClick}
        aria-expanded={isOpen}
      >
        <div className={styles.headerLeft}>
          {icon && <span className={styles.icon}>{icon}</span>}
          <div className={styles.title}>{title}</div>
        </div>

        <div className={styles.headerRight}>
          {badge}
          <ChevronDown
            size={size === "xs" ? 12 : 14}
            className={clsx(
              styles.chevron,
              isOpen && styles.rotateOpen,
              !hasInteracted && styles.noTransition
            )}
          />
        </div>
      </button>
    );
  }
);

AccordionHeader.displayName = "AccordionHeader";
