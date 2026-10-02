import { getTaskSolutionSource } from "@/entities/task";
import { useEffect, useState, type JSX } from "react";
import { TaskVisualization } from "@/widgets/task-visualization";
import { UiFullscreenPanel } from "@/shared/ui";
import type { TaskVisualizationTabProps } from "../model/task-visualization-tab";

export const TaskVisualizationTab = ({ task, active }: TaskVisualizationTabProps): JSX.Element => {
  const [visited, setVisited] = useState(active);
  useEffect(() => {
    if (active) setVisited(true);
  }, [active]);

  return (
    <div hidden={!active}>
      {(active || visited) && (
        <UiFullscreenPanel active={active} label="Визуализация алгоритма">
          {({ isFullscreen, toggleFullscreen }) => (
            <TaskVisualization
              taskId={String(task.id)}
              isActive={active}
              isFullscreen={isFullscreen}
              onToggleFullscreen={toggleFullscreen}
              solution={getTaskSolutionSource(task)}
            />
          )}
        </UiFullscreenPanel>
      )}
    </div>
  );
};
