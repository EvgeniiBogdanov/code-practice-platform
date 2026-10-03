import React from "react";
import { clsx } from "clsx";
import styles from "./TextHighlight.module.css";

export interface TextHighlightProps {
  children: React.ReactNode;
  /** Adds a blinking editor caret after the selection. */
  withCaret?: boolean;
  className?: string;
}

/** Heading accent styled as a text selection in the code editor. */
export const TextHighlight = ({
  children,
  withCaret = false,
  className,
}: TextHighlightProps): React.JSX.Element => (
  <em className={clsx(styles.highlight, className)}>
    {children}
    {withCaret && <span className={styles.caret} aria-hidden="true" />}
  </em>
);
