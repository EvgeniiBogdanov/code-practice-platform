import { HTMLAttributes, memo } from "react";
import { clsx } from "clsx";
import styles from "./Tooltip.module.css";

export interface TooltipArrowProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const TooltipArrow = memo(({ className, ...props }: TooltipArrowProps) => {
  return <div className={clsx(styles.arrow, className)} {...props} />;
});

TooltipArrow.displayName = "TooltipArrow";
