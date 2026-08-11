import { createFileRoute, redirect } from "@tanstack/react-router";
import { ALGO_TASKS } from "../../algorithms/data/tasksData";
import { getAlgoGroupMetaByInfoId } from "../../algorithms/data/groupConfig";

export const Route = createFileRoute("/algorithms/")({
  beforeLoad: () => {
    let targetTaskId = "group-two-pointers";
    try {
      const saved =
        localStorage.getItem("playground_last_selected_task_id_algorithms") ||
        localStorage.getItem("playground_last_selected_task_id");
      if (
        saved &&
        (getAlgoGroupMetaByInfoId(saved) ||
          ALGO_TASKS.some((t) => String(t.id) === String(saved)))
      ) {
        targetTaskId = saved;
      }
    } catch {
      // fallback
    }

    throw redirect({
      to: "/algorithms/$taskId",
      params: { taskId: String(targetTaskId) },
    });
  },
});
