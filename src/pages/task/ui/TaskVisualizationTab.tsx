import { getTaskSolutionSource } from "@/entities/task";
import { useEffect, useState, type JSX } from "react";
import { TaskVisualization } from "@/widgets/task-visualization";
import { useFullscreenNavigation } from "../model/use-fullscreen-navigation";
import type { TaskVisualizationTabProps } from "../model/task-visualization-tab";

export const TaskVisualizationTab = ({ task, active }: TaskVisualizationTabProps): JSX.Element => {
  const [visited, setVisited] = useState(active);
  useEffect(() => {
    if (active) setVisited(true);
  }, [active]);

  const { handleToggleFullscreen } = useFullscreenNavigation({
    task: { id: task.id, section: task.section },
    tab: "visualization",
    hasVisualComponent: false,
  });

  return (
    <div hidden={!active}>
      {(active || visited) && (
        <TaskVisualization
          taskId={String(task.id)}
          isActive={active}
          isFullscreen={false}
          onToggleFullscreen={handleToggleFullscreen}
          solution={getTaskSolutionSource(task)}
        />
      )}
    </div>
  );
};
