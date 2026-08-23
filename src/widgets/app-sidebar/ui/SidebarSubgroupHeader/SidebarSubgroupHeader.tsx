import React from "react";
import { Folder } from "lucide-react";
import { NodeCount, TreeToggleIcon, TreeNodeHeader } from "@/shared/ui";
import styles from "./SidebarSubgroupHeader.module.css";

export interface SidebarSubgroupHeaderProps {
  to: string;
  params?: Record<string, string>;
  title: string;
  iconColor?: string;
  folderColor?: string;
  chevronExpanded: boolean;
  onToggle: (e: React.MouseEvent) => void;
  isActive?: boolean;
  isCompleted?: boolean;
  completedClass?: string;
  completedCount: number;
  totalCount: number;
  className?: string;
}

export const SidebarSubgroupHeader = React.memo(
  ({
    to,
    params,
    title,
    iconColor,
    folderColor,
    chevronExpanded,
    onToggle,
    isActive,
    isCompleted,
    completedClass,
    completedCount,
    totalCount,
    className,
  }: SidebarSubgroupHeaderProps) => {
    const icon = (
      <Folder
        size={16}
        color={folderColor}
        className={[styles.folderIcon, iconColor && styles[`folder_${iconColor}`]]
          .filter(Boolean)
          .join(" ")}
      />
    );

    return (
      <TreeNodeHeader to={to} params={params} isActive={isActive} className={className}>
        <TreeToggleIcon
          icon={icon}
          expanded={chevronExpanded}
          onToggle={onToggle}
          chevronSize={14}
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

SidebarSubgroupHeader.displayName = "SidebarSubgroupHeader";
