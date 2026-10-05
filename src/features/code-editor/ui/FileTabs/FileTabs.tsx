import React from "react";
import { FileCode, FileText } from "lucide-react";
import { clsx } from "clsx";
import { TaskFile } from "@/shared/lib/code-editor";
import { getFileIconKind, type FileIconKind } from "../../lib/fileIcon";
import styles from "./FileTabs.module.css";

export interface FileTabsProps {
  files: TaskFile[];
  activeIndex: number;
  onSelectTab: (index: number) => void;
  isDirtyMap?: Record<number, boolean>;
  className?: string;
}

const ICON_CLASSES: Record<FileIconKind, string> = {
  js: styles.fileIconJs,
  jsx: styles.fileIconJsx,
  ts: styles.fileIconTs,
  tsx: styles.fileIconTsx,
  css: styles.fileIconCss,
  html: styles.fileIconHtml,
  json: styles.fileIconJson,
  other: styles.fileIcon,
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
        const iconClass = ICON_CLASSES[getFileIconKind(fileName)];
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
