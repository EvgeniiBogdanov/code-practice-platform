import { createFileRoute, redirect } from "@tanstack/react-router";
import { JS_TASKS } from "../../javascript/data/tasksData";

export const Route = createFileRoute("/javascript/")({
  beforeLoad: () => {
    let targetTaskId = "group-Циклы";
    try {
      const saved =
        localStorage.getItem("playground_last_selected_task_id_javascript") ||
        localStorage.getItem("playground_last_selected_task_id");
      if (saved) {
        const isTask = JS_TASKS.some((t) => String(t.id) === String(saved));
        const isGroup =
          saved.startsWith("group-") &&
          JS_TASKS.some(
            (t) => t.group === decodeURIComponent(saved.replace(/^group-/, ""))
          );
        const isSubgroup = saved.startsWith("subgroup-");

        if (isTask || isGroup || isSubgroup) {
          targetTaskId = saved;
        }
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
