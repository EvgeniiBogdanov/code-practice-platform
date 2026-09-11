import { useState, useCallback, type JSX } from "react";
import { NumberScene } from "@/shared/ui/NumberScene";
import type { TraceSceneProps } from "../model/trace-view";
import { TraceSceneFallback } from "./TraceSceneFallback";
import { TracePointerLegend } from "./TracePointerLegend";
import { TraceSceneMetadata } from "./TraceSceneMetadata";
import styles from "./TraceScene.module.css";

export const AlgorithmTraceScene = ({
  step,
  reducedMotion,
  definition,
  zoom,
  onZoomChange,
}: TraceSceneProps): JSX.Element => {
  const [unavailable, setUnavailable] = useState(false);
  const onUnavailable = useCallback((): void => setUnavailable(true), []);

  return (
    <div className={styles.scene}>
      <TraceSceneMetadata step={step} definition={definition} />
      {!step.values.length ? (
        <div className={styles.emptyScene}>
          <span>∅</span>Нет элементов для сравнения
        </div>
      ) : unavailable ? (
        <TraceSceneFallback step={step} onRetry={() => setUnavailable(false)} />
      ) : (
        <NumberScene
          values={step.values}
          markers={step.pointers}
          focus={step.focus}
          settled={step.settled}
          dimmed={step.dimmed}
          transfer={step.transfer}
          reducedMotion={reducedMotion}
          onUnavailable={onUnavailable}
          zoom={zoom}
          onZoomChange={onZoomChange}
        />
      )}
      <TracePointerLegend step={step} />
      {!unavailable && <span className={styles.srOnly}>Массив: {JSON.stringify(step.values)}</span>}
      {step.values.length > 8 && (
        <p className={styles.scrollHint}>
          Прокрутите сцену по горизонтали, чтобы увидеть весь массив ↔
        </p>
      )}
    </div>
  );
};
