import React from "react";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { ALGO_TASKS } from "../../../algorithms/data/tasksData";
import OpenEditorView from "../../../components/task/OpenEditorView";

function OpenAlgorithmsTaskPage() {
  const { taskId } = useParams({ from: "/open/algorithms/$taskId" });
  const selectedTask = ALGO_TASKS.find((t) => String(t.id) === String(taskId));

  return <OpenEditorView task={selectedTask} section="algorithms" />;
}

export const Route = createFileRoute("/open/algorithms/$taskId")({
  component: OpenAlgorithmsTaskPage,
});
