import React, { useState } from "react";
import { clsx } from "clsx";
import styles from "./TypeBlock.module.css";

const COLLAPSED_LINES = 8;

export interface TypeBlockProps {
  label: string;
  code: string;
  className?: string;
}

/** A monospaced type or snippet; long ones are cut to a few lines until expanded. */
export const TypeBlock = ({ label, code, className }: TypeBlockProps): React.JSX.Element => {
  const [isExpanded, setIsExpanded] = useState(false);
  const lines = code.split("\n");
  const isLong = lines.length > COLLAPSED_LINES;
  const shown = isLong && !isExpanded ? lines.slice(0, COLLAPSED_LINES).join("\n") : code;

  return (
    <figure className={clsx(styles.block, className)}>
      <figcaption className={styles.label}>{label}</figcaption>
      <pre className={styles.code}>
        <code>{shown}</code>
      </pre>
      {isLong && (
        <button type="button" className={styles.more} onClick={() => setIsExpanded((v) => !v)}>
          {isExpanded ? "Свернуть" : "Показать полностью"}
        </button>
      )}
    </figure>
  );
};
