import { createFileRoute, redirect } from "@tanstack/react-router";
import { REACT_TASKS } from "../../react/data/tasksData";
import { isReactGroupValid } from "../../react/data/groupConfig";

export const Route = createFileRoute("/react/")({
  beforeLoad: () => {
    let targetTaskId = "group-warmup";
    try {
      const saved =
        localStorage.getItem("playground_last_selected_task_id_react") ||
        localStorage.getItem("playground_last_selected_task_id");
      if (
        saved &&
        (isReactGroupValid(saved) || REACT_TASKS.some((t) => String(t.id) === String(saved)))
      ) {
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
