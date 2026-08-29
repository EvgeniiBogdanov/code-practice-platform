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

const getTabIconClass = (filename: string): string => {
  const ext = filename.split(".").pop()?.toLowerCase();
  if (ext === "jsx") return styles.fileIconJsx;
  if (ext === "tsx") return styles.fileIconTsx;
  if (ext === "ts" || ext === "mts" || ext === "cts") return styles.fileIconTs;
  if (ext === "css" || ext === "scss" || ext === "less") return styles.fileIconCss;
  if (ext === "html" || ext === "htm") return styles.fileIconHtml;
  if (ext === "json") return styles.fileIconJson;
  return styles.fileIconJs;
};

export function FileTabs({
  files,
  activeIndex,
  onSelectTab,
  isDirtyMap = {},
  className,
}: FileTabsProps): React.JSX.Element | null {
  if (files.length <= 1) return null;

  return (
    <div className={clsx(styles.tabsContainer, className)}>
      {files.map((file, idx) => {
        const isActive = idx === activeIndex;
        const isDirty = Boolean(isDirtyMap[idx]);
        const fileName = file.name || `File ${idx + 1}`;
        const iconClass = getTabIconClass(fileName);
        const isTextFile = fileName.endsWith(".css") || fileName.endsWith(".html");

        return (
          <button
            key={file.name || idx}
            type="button"
            className={clsx(styles.tab, isActive && styles.active)}
            onClick={() => onSelectTab(idx)}
          >
            {isTextFile ? (
              <FileText size={13} className={iconClass} />
            ) : (
              <FileCode size={13} className={iconClass} />
            )}
            <span>{fileName}</span>
            {isDirty && <span className={styles.dirtyDot} />}
          </button>
        );
      })}
    </div>
  );
}
