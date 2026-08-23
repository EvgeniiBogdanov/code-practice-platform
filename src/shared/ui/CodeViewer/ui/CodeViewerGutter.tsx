import React from "react";
import { clsx } from "clsx";
import { CodeViewerGutterProps } from "../types";
import styles from "../CodeViewer.module.css";

export const CodeViewerGutter = ({ linesCount, gutterWidth, className }: CodeViewerGutterProps) => {
  const lineIndices = Array.from({ length: linesCount }, (_, i) => i + 1);
  const gutterClasses = clsx(styles.gutter, className);

  return (
    <div
      className={gutterClasses}
      aria-hidden="true"
      style={{ width: `${gutterWidth}px`, minWidth: `${gutterWidth}px` }}
    >
      {lineIndices.map((lineNum) => (
        <div key={lineNum} className={styles.gutterLine}>
          {lineNum}
        </div>
      ))}
    </div>
  );
};
