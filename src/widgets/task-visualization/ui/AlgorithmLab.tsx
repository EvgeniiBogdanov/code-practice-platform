import { clsx } from "clsx";
import type { JSX } from "react";
import { getAlgorithmDefinition } from "@/entities/algorithm-trace";
import { TraceInputs, useAlgorithmInput } from "@/features/algorithm-input";
import type { AlgorithmLabProps, TaskVisualizationProps } from "../model/visualizer-props";
import { getSolutionCode } from "../lib/active-code-line";
import { VisualizationToolbar } from "./VisualizationToolbar";
import { TracePlayer } from "./TracePlayer";
import styles from "./AlgorithmLab.module.css";

const AlgorithmLabContent = ({
  definition,
  solution,
  isFullscreen = false,
  isActive,
  onToggleFullscreen,
}: AlgorithmLabProps): JSX.Element => {
  const input = useAlgorithmInput(definition);
  const inputsNode = (
    <TraceInputs
      definition={definition}
      exampleId={input.exampleId}
      draft={input.draft}
      parameter={input.parameter}
      error={input.error}
      onDraft={input.setDraft}
      onParameter={input.setParameter}
      onExample={input.selectExample}
      onApply={input.apply}
    />
  );

  return (
    <section
      className={clsx(styles.lab, isFullscreen && styles.fullscreen)}
      aria-label="Визуализация алгоритма"
    >
      <TracePlayer
        key={input.session.id}
        steps={input.session.steps}
        code={getSolutionCode(solution)}
        definition={definition}
        isActive={isActive}
        isFullscreen={isFullscreen}
        toolbar={
          <VisualizationToolbar
            className={styles.toolbar}
            isFullscreen={isFullscreen}
            onToggleFullscreen={onToggleFullscreen}
          />
        }
        inputs={inputsNode}
      />
    </section>
  );
};

export const AlgorithmLab = ({
  taskId,
  solution,
  isFullscreen,
  isActive,
  onToggleFullscreen,
}: TaskVisualizationProps): JSX.Element => {
  const definition = getAlgorithmDefinition(taskId);
  if (!definition)
    return <p className={styles.loadError}>Для этой задачи визуализация пока не добавлена.</p>;
  return (
    <AlgorithmLabContent
      key={taskId}
      definition={definition}
      solution={solution}
      isActive={isActive}
      isFullscreen={isFullscreen}
      onToggleFullscreen={onToggleFullscreen}
    />
  );
};
