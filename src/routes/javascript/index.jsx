import { createFileRoute, redirect } from "@tanstack/react-router";
import { JS_TASKS } from "../../javascript/data/tasksData";

export const Route = createFileRoute("/javascript/")({
  beforeLoad: () => {
    let targetTaskId = JS_TASKS[0]?.id || "js-loops-1";
    try {
      const saved = localStorage.getItem("playground_last_selected_task_id");
      if (saved && JS_TASKS.some((t) => String(t.id) === String(saved))) {
        targetTaskId = saved;
      }
    } catch {
      // fallback
    }

    throw redirect({
      to: "/javascript/$taskId",
      params: { taskId: String(targetTaskId) },
    });
  },
});
