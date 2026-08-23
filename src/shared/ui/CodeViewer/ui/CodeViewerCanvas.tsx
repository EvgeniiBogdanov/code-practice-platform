import React from "react";
import { clsx } from "clsx";
import { CodeCopyButton } from "./CodeCopyButton";
import { CodeViewerCanvasProps } from "../types";
import styles from "../CodeViewer.module.css";

export const CodeViewerCanvas = ({
  highlightedHtml,
  cleanCode,
  className,
}: CodeViewerCanvasProps) => {
  const canvasClasses = clsx(styles.canvas, className);

  return (
    <div className={canvasClasses}>
      <CodeCopyButton code={cleanCode} />
      <pre className={styles.preOnly}>
        <code dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
      </pre>
    </div>
  );
};
