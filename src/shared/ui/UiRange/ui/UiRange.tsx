import { useId, type JSX } from "react";
import { clsx } from "clsx";
import type { UiRangeProps } from "../model/uiRange";
import styles from "./UiRange.module.css";

export const UiRange = ({ className, id, ...props }: UiRangeProps): JSX.Element => {
  const generatedId = useId();

  return (
    <input
      {...props}
      id={id ?? generatedId}
      type="range"
      className={clsx(styles.range, className)}
    />
  );
};
