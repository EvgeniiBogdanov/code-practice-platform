import type { JSX } from "react";
import type { TraceSceneProps } from "../model/trace-view";
import styles from "./TraceScene.module.css";

export const TraceSceneMetadata = ({
  step,
  definition,
}: Pick<TraceSceneProps, "step" | "definition">): JSX.Element => {
  const hintText = definition
    ? (definition.inputHint ??
      (definition.inputKind === "text"
        ? "До 32 символов ASCII. ␣ обозначает пробел."
        : `До 16 целых чисел. ${definition.inputKind === "sorted" ? "Массив по возрастанию. " : ""}Пустой массив: [].`))
    : null;

  return (
    <div className={styles.sceneMeta}>
      <span className={styles.sceneMetaStart}>ИНДЕКСЫ С 0</span>
      {hintText && <span className={styles.sceneHint}>{hintText}</span>}
      <span className={styles.sceneMetaEnd}>{step.values.length} элементов</span>
    </div>
  );
};
