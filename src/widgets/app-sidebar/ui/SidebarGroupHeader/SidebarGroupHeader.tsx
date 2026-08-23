import React from "react";
import { NodeCount, TreeToggleIcon, TreeNodeHeader } from "@/shared/ui";
import styles from "./SidebarGroupHeader.module.css";

export interface SidebarGroupHeaderProps {
  to: string;
  params?: Record<string, string>;
  title: string;
  icon: React.ReactNode;
  chevronExpanded: boolean;
  onToggle: (e: React.MouseEvent) => void;
  isActive?: boolean;
  isCompleted?: boolean;
  completedClass?: string;
  completedCount: number;
  totalCount: number;
  className?: string;
}

export const SidebarGroupHeader = React.memo(
  ({
    to,
    params,
    title,
    icon,
    chevronExpanded,
    onToggle,
    isActive,
    isCompleted,
    completedClass,
    completedCount,
    totalCount,
    className,
  }: SidebarGroupHeaderProps) => {
    return (
      <TreeNodeHeader to={to} params={params} isActive={isActive} className={className}>
        <TreeToggleIcon
          icon={icon}
          expanded={chevronExpanded}
          onToggle={onToggle}
          chevronSize={15}
        />

        <span className={styles.nodeTitle}>{title}</span>

        <NodeCount
          completed={completedCount}
          total={totalCount}
          completedClass={completedClass}
          isCompleted={isCompleted}
        />
      </TreeNodeHeader>
    );
  }
);

SidebarGroupHeader.displayName = "SidebarGroupHeader";
