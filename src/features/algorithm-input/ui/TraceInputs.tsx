import { useId, type JSX } from "react";
import { Button, Input } from "@/shared/ui";
import type { TraceInputProps } from "../model/algorithm-input";
import { TraceParameterInput } from "./TraceParameterInput";
import { TraceExampleSelect } from "./TraceExampleSelect";
import styles from "./TraceInputs.module.css";

export const TraceInputs = (props: TraceInputProps): JSX.Element => {
  const id = useId();
  return (
    <form
      className={styles.inputs}
      onSubmit={(event) => {
        event.preventDefault();
        props.onApply();
      }}
    >
      <div className={styles.inputRow}>
        <TraceExampleSelect
          definition={props.definition}
          exampleId={props.exampleId}
          onExample={props.onExample}
        />
        <label className={styles.dataField}>
          <span className={styles.labelText}>
            {props.definition.inputLabel ??
              (props.definition.inputKind === "text" ? "Строка" : "Массив")}
          </span>
          <Input
            containerClassName={styles.dataInputContainer}
            size="md"
            value={props.draft}
            onChange={(event) => props.onDraft(event.target.value)}
            aria-invalid={Boolean(props.error)}
            aria-describedby={props.error ? `${id}-error` : undefined}
            maxLength={props.definition.inputKind === "text" ? 256 : 512}
          />
        </label>
        <TraceParameterInput {...props} errorId={`${id}-error`} />
        <Button type="submit" variant="outline" className={styles.apply}>
          Применить
        </Button>
      </div>
      {props.error && (
        <p id={`${id}-error`} role="alert" className={styles.error}>
          {props.error}
        </p>
      )}
    </form>
  );
};
