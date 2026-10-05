import { getTaskSolutionSource } from "@/entities/task";
import { useState, type JSX } from "react";
import { TaskVisualization } from "@/widgets/task-visualization";
import { UiFullscreenPanel } from "@/shared/ui";
import type { TaskVisualizationTabProps } from "../model/taskVisualizationTab";

export const TaskVisualizationTab = ({ task, active }: TaskVisualizationTabProps): JSX.Element => {
  const [visited, setVisited] = useState(active);
  if (active && !visited) setVisited(true);

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
