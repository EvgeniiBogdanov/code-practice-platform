import React from "react";
import { clsx } from "clsx";
import { ChevronRight } from "lucide-react";
import styles from "./TreeToggleIcon.module.css";

export interface TreeToggleIconProps {
  /** The default icon to display when not hovered */
  icon: React.ReactNode;
  /** Whether the tree node is currently expanded */
  expanded: boolean;
  /** Callback fired when the toggle button is clicked */
  onToggle: (e: React.MouseEvent) => void;
  /** Size variant: 'sm' (sidebar standard) | 'md' (page overview standard) */
  size?: "sm" | "md";
  /** Optional custom chevron icon size */
  chevronSize?: number;
  /** Optional custom title tooltip */
  title?: string;
  /** Optional custom className */
  className?: string;
}

export const TreeToggleIcon = React.memo<TreeToggleIconProps>(
  ({ icon, expanded, onToggle, size = "sm", chevronSize, title, className }) => {
    const computedChevronSize = chevronSize ?? (size === "md" ? 18 : 15);

    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onToggle(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        e.stopPropagation();
        onToggle(e as unknown as React.MouseEvent);
      }
    };

    return (
      <div
        className={clsx(styles.toggleWrapper, size === "md" && styles.sizeMd, className)}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        data-toggle-btn="true"
        data-expanded={expanded ? "true" : "false"}
        aria-expanded={expanded}
        title={
          title ??
          (expanded
            ? "Свернуть (Alt+клик: свернуть все)"
            : "Развернуть (Alt+клик: развернуть все)")
        }
        role="presentation"
        tabIndex={-1}
      >
        <div className={styles.iconDefault}>{icon}</div>
        <div className={clsx(styles.iconChevron, expanded && styles.expanded)}>
          <ChevronRight size={computedChevronSize} />
        </div>
      </div>
    );
  }
);

TreeToggleIcon.displayName = "TreeToggleIcon";
