import React from "react";
import { clsx } from "clsx";
import styles from "./UiKbd.module.css";

export type UiKbdSize = "sm" | "md";

export interface UiKbdProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Keys of the shortcut in press order, e.g. `["⌘", "K"]`. */
  keys: readonly string[];
  size?: UiKbdSize;
}

/** Keyboard shortcut hint rendered with semantic `<kbd>` elements. */
export const UiKbd = ({
  keys,
  size = "md",
  className,
  ...props
}: UiKbdProps): React.JSX.Element => (
  <span className={clsx(styles.combo, styles[`size_${size}`], className)} {...props}>
    {keys.map((key) => (
      <kbd key={key} className={styles.key}>
        {key}
      </kbd>
    ))}
  </span>
);

UiKbd.displayName = "UiKbd";
