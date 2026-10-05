import { useId, type JSX } from "react";
import { clsx } from "clsx";
import type { UiSelectProps } from "../model/uiSelect";
import styles from "./UiSelect.module.css";

export const UiSelect = ({
  controlSize = "md",
  className,
  id,
  ...props
}: UiSelectProps): JSX.Element => {
  const generatedId = useId();

  return (
    <select
      {...props}
      id={id ?? generatedId}
      className={clsx(styles.select, styles[controlSize], className)}
    />
  );
};
