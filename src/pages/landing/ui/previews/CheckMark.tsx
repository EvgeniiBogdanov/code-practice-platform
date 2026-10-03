import React from "react";
import { clsx } from "clsx";
import styles from "./SectionPreviews.module.css";

export interface CheckMarkProps {
  className?: string;
}

/** Check icon whose stroke is drawn when its `.active` preview scope appears. */
export const CheckMark = ({ className }: CheckMarkProps): React.JSX.Element => (
  <svg
    className={clsx(styles.check, className)}
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M3 7.4 5.7 10 11 4.4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={1}
    />
  </svg>
);
