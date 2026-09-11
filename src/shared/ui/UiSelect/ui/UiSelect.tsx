import type { JSX } from "react";
import { clsx } from "clsx";
import type { UiSelectProps } from "../model/ui-select";
import styles from "./UiSelect.module.css";

export const UiSelect = ({
  controlSize = "md",
  className,
  ...props
}: UiSelectProps): JSX.Element => (
  <select {...props} className={clsx(styles.select, styles[controlSize], className)} />
);
