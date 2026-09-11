import type { JSX } from "react";
import { Input } from "@/shared/ui";
import type { TraceParameterInputProps } from "../model/algorithm-input";
import styles from "./TraceInputs.module.css";

export const TraceParameterInput = ({
  errorId,
  ...props
}: TraceParameterInputProps): JSX.Element | null => {
  if (!props.definition.parameter) return null;
  return (
    <label className={styles.parameter}>
      <span className={styles.labelText}>{props.definition.parameter}</span>
      <Input
        containerClassName={styles.parameterInputContainer}
        size="md"
        inputMode="numeric"
        value={props.parameter}
        onChange={(event) => props.onParameter(event.target.value)}
        aria-invalid={Boolean(props.error)}
        aria-describedby={props.error ? errorId : undefined}
        maxLength={16}
      />
    </label>
  );
};
