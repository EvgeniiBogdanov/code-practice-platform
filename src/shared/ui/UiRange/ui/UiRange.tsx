import type { JSX } from "react";
import { clsx } from "clsx";
import type { UiRangeProps } from "../model/ui-range";
import styles from "./UiRange.module.css";

export const UiRange = ({ className, ...props }: UiRangeProps): JSX.Element => (
  <input {...props} type="range" className={clsx(styles.range, className)} />
);
