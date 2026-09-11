import { lazy, Suspense, useState, type JSX } from "react";
import { Button, ErrorBoundary, ExpandablePanel } from "@/shared/ui";
import type { TaskVisualizationProps } from "../model/visualizer-props";
import { VisualizationSkeleton } from "./VisualizationSkeleton";
import { loadAlgorithmLab } from "../lib/load-algorithm-lab";
import styles from "./AlgorithmLab.module.css";

const LazyLab = lazy(() => loadAlgorithmLab().then((module) => ({ default: module.AlgorithmLab })));

export const TaskVisualization = (props: TaskVisualizationProps): JSX.Element => {
  const [expanded, setExpanded] = useState(false);
  const isFullscreen = props.isActive !== false && (props.isFullscreen ?? expanded);
  const toggleFullscreen = props.onToggleFullscreen ?? ((): void => setExpanded((value) => !value));
  const content = (
    <Suspense fallback={<VisualizationSkeleton />}>
      <LazyLab {...props} isFullscreen={isFullscreen} onToggleFullscreen={toggleFullscreen} />
    </Suspense>
  );
  return (
    <ErrorBoundary
      key={props.taskId}
      fallback={() => (
        <div className={styles.loadError} role="alert">
          <strong>Не удалось загрузить визуализацию</strong>
          <p>Проверьте подключение и перезагрузите страницу, чтобы заново получить модуль.</p>
          <Button onClick={() => window.location.reload()}>Перезагрузить страницу</Button>
        </div>
      )}
    >
      {props.isFullscreen === undefined ? (
        <ExpandablePanel
          expanded={isFullscreen}
          onCollapse={toggleFullscreen}
          label="Визуализация алгоритма"
        >
          {content}
        </ExpandablePanel>
      ) : (
        content
      )}
    </ErrorBoundary>
  );
};
