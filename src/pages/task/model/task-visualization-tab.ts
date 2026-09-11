import type { Task } from "@/entities/task";

export interface TaskVisualizationTabProps {
  readonly task: Task;
  readonly active: boolean;
}
