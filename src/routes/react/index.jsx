import { createFileRoute, redirect } from "@tanstack/react-router";
import { WARMUP_TASKS, REACT_TASKS } from "../../react/data/tasksData";

export const Route = createFileRoute("/react/")({
  beforeLoad: () => {
    let targetTaskId = WARMUP_TASKS[0]?.id || "1";
    try {
      const saved = localStorage.getItem("playground_last_selected_task_id");
      if (saved && REACT_TASKS.some((t) => String(t.id) === String(saved))) {
        targetTaskId = saved;
      }
    } catch {
      // fallback
    }

    throw redirect({
      to: "/react/$taskId",
      params: { taskId: String(targetTaskId) },
    });
  },
});
