import React, { HTMLAttributes, forwardRef, memo } from "react";
import { clsx } from "clsx";
import styles from "./Icon.module.css";

export type IconSize = "sm" | "md";

export interface IconProps extends HTMLAttributes<HTMLSpanElement> {
  icon?: React.ReactNode;
  size?: IconSize;
  children?: React.ReactNode;
}

export const Icon = memo(
  forwardRef<HTMLSpanElement, IconProps>(
    ({ icon, size = "md", className, children, ...restProps }, ref) => {
      const iconClasses = clsx(styles.iconContainer, styles[`size_${size}`], className);

      return (
        <span
          ref={ref}
          className={iconClasses}
          aria-hidden={restProps["aria-label"] ? undefined : true}
          {...restProps}
        >
          {icon ?? children}
        </span>
      );
    }
  )
);

Icon.displayName = "Icon";
