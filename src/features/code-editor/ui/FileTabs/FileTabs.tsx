import React from "react";
import { FileCode, FileText } from "lucide-react";
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
    <div className={[styles.tabsContainer, className].filter(Boolean).join(" ")}>
      {files.map((file, idx) => {
        const isActive = idx === activeIndex;
        const isDirty = Boolean(isDirtyMap[idx]);

        return (
          <button
            key={file.name || idx}
            type="button"
            className={[styles.tab, isActive && styles.active].filter(Boolean).join(" ")}
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
