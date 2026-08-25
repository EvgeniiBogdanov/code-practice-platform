import React from "react";
import { FileCode, FileText } from "lucide-react";
import { clsx } from "clsx";
import { TaskFile } from "@/shared/lib/code-editor";
import styles from "./FileTabs.module.css";

export interface FileTabsProps {
  files: TaskFile[];
  activeIndex: number;
  onSelectTab: (index: number) => void;
  isDirtyMap?: Record<number, boolean>;
  className?: string;
}

export function FileTabs({
  files,
  activeIndex,
  onSelectTab,
  isDirtyMap = {},
  className,
}: FileTabsProps) {
  if (files.length <= 1) return null;

  return (
    <div className={clsx(styles.tabsContainer, className)}>
      {files.map((file, idx) => {
        const isActive = idx === activeIndex;
        const isDirty = Boolean(isDirtyMap[idx]);

        return (
          <button
            key={file.name || idx}
            type="button"
            className={clsx(styles.tab, isActive && styles.active)}
            onClick={() => onSelectTab(idx)}
          >
            {file.name?.endsWith(".css") ? (
              <FileText size={13} className={styles.fileIcon} />
            ) : (
              <FileCode size={13} className={styles.fileIcon} />
            )}
            <span>{file.name || `File ${idx + 1}`}</span>
            {isDirty && <span className={styles.dirtyDot} />}
          </button>
        );
      })}
    </div>
  );
}
