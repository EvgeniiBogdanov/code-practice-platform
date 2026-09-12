import type { JSX } from "react";
import { UiSelect } from "@/shared/ui";
import type { TraceInputProps } from "../model/algorithm-input";
import styles from "./TraceInputs.module.css";

export const TraceExampleSelect = (
  props: Pick<TraceInputProps, "definition" | "exampleId" | "onExample">
): JSX.Element => {
  const taskExamples = props.definition.examples.filter((e) => e.isTask);
  const extraExamples = props.definition.examples.filter((e) => !e.isTask);

  return (
    <label className={styles.field}>
      <span className={styles.labelText}>Пример</span>
      <UiSelect
        value={props.exampleId}
        onChange={(event) => props.onExample(event.target.value)}
        className={styles.select}
      >
        {taskExamples.length > 0 && extraExamples.length > 0 ? (
          <>
            <optgroup label="Примеры из задачи">
              {taskExamples.map((example) => (
                <option key={example.id} value={example.id}>
                  {example.label}
                </option>
              ))}
            </optgroup>
            <optgroup label="Дополнительные примеры">
              {extraExamples.map((example) => (
                <option key={example.id} value={example.id}>
                  {example.label}
                </option>
              ))}
            </optgroup>
          </>
        ) : (
          props.definition.examples.map((example) => (
            <option key={example.id} value={example.id}>
              {example.label}
            </option>
          ))
        )}
        {props.exampleId === "custom" && <option value="custom">Свой пример</option>}
      </UiSelect>
    </label>
  );
};
