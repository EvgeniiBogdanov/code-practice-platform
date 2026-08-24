import React from "react";
import { clsx } from "clsx";
import { FileCode, FileText } from "lucide-react";
import { CodeViewerHeaderProps } from "../types";
import styles from "../CodeViewer.module.css";

export const CodeViewerHeader = ({
  langName,
  color,
  isNotepad,
  className,
}: CodeViewerHeaderProps): React.JSX.Element => {
  const Icon = isNotepad ? FileText : FileCode;
  const headerClasses = clsx(styles.header, className);

  return (
    <div className={headerClasses}>
      <div className={styles.fileTab}>
        <Icon size={13} color={color} className={styles.fileTabIcon} />
        <span>{langName}</span>
      </div>
    </div>
  );
};
