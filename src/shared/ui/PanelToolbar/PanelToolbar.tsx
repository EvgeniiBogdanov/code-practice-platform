import { forwardRef, HTMLAttributes, memo, ReactNode } from "react";
import { clsx } from "clsx";
import styles from "./PanelToolbar.module.css";

export interface PanelToolbarProps extends HTMLAttributes<HTMLDivElement> {
  left?: ReactNode;
  right?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export const PanelToolbar = memo(
  forwardRef<HTMLDivElement, PanelToolbarProps>(
    ({ left, right, children, className, ...restProps }, ref): React.JSX.Element => {
      return (
        <div ref={ref} className={clsx(styles.toolbar, className)} {...restProps}>
          {left && <div className={styles.left}>{left}</div>}
          {children}
          {right && <div className={styles.right}>{right}</div>}
        </div>
      );
    }
  )
);

PanelToolbar.displayName = "PanelToolbar";
