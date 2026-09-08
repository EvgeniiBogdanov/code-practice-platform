import React, { memo } from "react";
import { clsx } from "clsx";
import styles from "./TelegramIcon.module.css";

export interface TelegramIconProps extends React.SVGAttributes<SVGSVGElement> {
  size?: number | string;
  className?: string;
  color?: string;
}

const TELEGRAM_PATH =
  "m20.665 3.717-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l-.313 4.673c.46 0 .663-.211.921-.46l2.211-2.15 4.6 3.398c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.434z";

export const TelegramIcon = memo(
  ({
    size = 24,
    className,
    color,
    "aria-label": ariaLabel,
    ...restProps
  }: TelegramIconProps): React.JSX.Element => {
    const isAriaHidden =
      ariaLabel === undefined && restProps["aria-hidden"] === undefined
        ? true
        : restProps["aria-hidden"];

    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={clsx(styles.icon, className)}
        color={color}
        aria-label={ariaLabel}
        aria-hidden={isAriaHidden}
        {...restProps}
      >
        <path d={TELEGRAM_PATH} fill="currentColor" />
      </svg>
    );
  }
);

TelegramIcon.displayName = "TelegramIcon";
