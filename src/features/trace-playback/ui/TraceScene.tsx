import { useState, useCallback, useMemo, type JSX } from "react";
import { UiDataBoard } from "@/shared/ui/UiDataBoard";
import { UiStackScene } from "@/shared/ui/UiStackScene";
import { UiDiagramScene } from "@/shared/ui/UiDiagramScene";
import { NumberScene } from "@/shared/ui/NumberScene";
import type { TraceSceneProps } from "../model/trace-view";
import { computePanelCapacities } from "../lib/trace-panel-slots";
import { TraceSceneFallback } from "./TraceSceneFallback";
import { TracePointerLegend } from "./TracePointerLegend";
import { TraceSceneMetadata } from "./TraceSceneMetadata";
import styles from "./TraceScene.module.css";

export const AlgorithmTraceScene = ({
  step,
  steps,
  reducedMotion,
  definition,
  zoom,
  onZoomChange,
}: TraceSceneProps): JSX.Element => {
  const [unavailable, setUnavailable] = useState(false);
  const onUnavailable = useCallback((): void => setUnavailable(true), []);

  const panelCapacities = useMemo(() => computePanelCapacities(steps), [steps]);

  return (
    <div className={styles.scene}>
      <TraceSceneMetadata step={step} definition={definition} />
      {step.structure?.stacks ? (
        <UiStackScene
          stacks={step.structure.stacks}
          action={step.structure.stackAction}
          stepId={step.id}
          reducedMotion={reducedMotion}
          zoom={zoom}
          onZoomChange={onZoomChange}
        />
      ) : step.structure ? (
        <UiDiagramScene
          label={step.structure.label}
          stateLabels={{
            done: step.structure.kind === "decisions" ? "Ответ" : "Обработан",
            rejected: definition?.inputKind === "oranges" ? "Гнилой" : "Отсечён",
          }}
          nodes={step.structure.nodes}
          edges={step.structure.edges}
          compact={step.structure.kind === "grid"}
          reducedMotion={reducedMotion}
          zoom={zoom}
          onZoomChange={onZoomChange}
        />
      ) : !step.values.length ? (
        <div className={styles.emptyScene}>
          <span>∅</span>Нет элементов для сравнения
        </div>
      ) : unavailable ? (
        <TraceSceneFallback step={step} onRetry={() => setUnavailable(false)} />
      ) : (
        <NumberScene
          shape={step.shape}
          band={step.band}
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
      {!step.structure && <TracePointerLegend step={step} />}
      {step.panels?.map((panel, index) => {
        const capacity = panelCapacities[index];
        return (
          <UiDataBoard
            key={`${panel.kind}-${index}`}
            label={panel.label}
            variant={panel.kind}
            entries={panel.entries}
            minSlots={capacity?.maxCount}
            placeholders={capacity?.placeholders}
            reducedMotion={reducedMotion}
          />
        );
      })}
      {!unavailable && <span className={styles.srOnly}>Массив: {JSON.stringify(step.values)}</span>}
      {!step.structure && step.values.length > 8 && (
        <p className={styles.scrollHint}>
          Прокрутите сцену по горизонтали, чтобы увидеть весь массив ↔
        </p>
      )}
    </div>
  );
};
