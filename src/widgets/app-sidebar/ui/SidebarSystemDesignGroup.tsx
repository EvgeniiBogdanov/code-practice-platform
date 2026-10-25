import React from "react";
import type { NodeCountVariant } from "@/shared/ui";
import { SidebarGroupHeader } from "./SidebarGroupHeader/SidebarGroupHeader";
import styles from "./SidebarSystemDesignList.module.css";

export interface SidebarSystemDesignGroupProps {
  /** The folder page: what lies inside the folder. */
  to: string;
  isActive: boolean;
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: (e: React.MouseEvent) => void;
  completedCount: number;
  totalCount: number;
  countVariant?: NodeCountVariant;
  /** The page list; it brings its own collapsing wrapper, so the guide line is drawn once. */
  children: React.ReactNode;
}

/** A folder of the system design sidebar: its title opens the folder page, the icon folds it. */
export const SidebarSystemDesignGroup = ({
  to,
  isActive,
  title,
  icon,
  isOpen,
  onToggle,
  completedCount,
  totalCount,
  countVariant,
  children,
}: SidebarSystemDesignGroupProps): React.JSX.Element => (
  <div className={styles.treeGroupBlock}>
    <SidebarGroupHeader
      to={to}
      isActive={isActive}
      title={title}
      icon={icon}
      chevronExpanded={isOpen}
      onToggle={onToggle}
      completedCount={completedCount}
      totalCount={totalCount}
      countVariant={countVariant}
    />
    {children}
  </div>
);
