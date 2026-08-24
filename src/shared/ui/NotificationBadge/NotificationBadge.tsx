import React, { HTMLAttributes, memo } from "react";
import { clsx } from "clsx";
import styles from "./NotificationBadge.module.css";

export type NotificationBadgeVariant =
  | "yellow"
  | "red"
  | "green"
  | "blue"
  | "purple"
  | "neutral";

export type NotificationBadgeSize = "sm" | "md" | "lg";

export interface NotificationBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * The count or text to display. If 0 (and showZero is false) or negative/undefined, nothing is rendered.
   */
  count?: number | string;
  /**
   * Maximum count to show before displaying '{maxCount}+'. Defaults to 99.
   */
  maxCount?: number;
  /**
   * Render as a small indicator dot without text content.
   */
  dot?: boolean;
  /**
   * Color variant of the badge. Defaults to 'yellow'.
   */
  variant?: NotificationBadgeVariant;
  /**
   * Size variant of the badge. Defaults to 'md'.
   */
  size?: NotificationBadgeSize;
  /**
   * Whether to display the badge when count is 0. Defaults to false.
   */
  showZero?: boolean;
  /**
   * Whether the badge is positioned absolutely (pinned top-right of parent). Defaults to true.
   * Set to false for inline/standalone rendering.
   */
  pinned?: boolean;
  /**
   * Whether to include a cutout border/ring matching the theme background. Defaults to true.
   */
  ring?: boolean;
  /**
   * Custom aria-label for accessibility.
   */
  ariaLabel?: string;
}

export const NotificationBadge = memo(
  ({
    count,
    maxCount = 99,
    dot = false,
    variant = "yellow",
    size = "md",
    showZero = false,
    pinned = true,
    ring = true,
    ariaLabel,
    className,
    ...props
  }: NotificationBadgeProps): React.JSX.Element | null => {
    if (dot) {
      return (
        <span
          role="status"
          aria-label={ariaLabel ?? "Новое уведомление"}
          className={clsx(
            styles.badge,
            styles.dot,
            styles[`variant_${variant}`],
            styles[`size_${size}`],
            pinned && styles.pinned,
            ring && styles.ring,
            className
          )}
          {...props}
        />
      );
    }

    if (count === undefined || count === null) {
      return null;
    }

    const numericCount = typeof count === "number" ? count : Number(count);
    const isNumeric = !Number.isNaN(numericCount);

    if (isNumeric && numericCount <= 0 && !showZero) {
      return null;
    }

    const displayCount =
      isNumeric && numericCount > maxCount ? `${maxCount}+` : String(count);

    const defaultAriaLabel = isNumeric
      ? `${numericCount} уведомлений`
      : String(count);

    return (
      <span
        role="status"
        aria-label={ariaLabel ?? defaultAriaLabel}
        className={clsx(
          styles.badge,
          styles[`variant_${variant}`],
          styles[`size_${size}`],
          pinned && styles.pinned,
          ring && styles.ring,
          className
        )}
        {...props}
      >
        {displayCount}
      </span>
    );
  }
);

NotificationBadge.displayName = "NotificationBadge";
