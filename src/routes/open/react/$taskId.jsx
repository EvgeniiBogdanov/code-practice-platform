import React from "react";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { ALL_TASKS, REACT_TASKS } from "../../../react/data/tasksData";
import OpenEditorView from "../../../components/task/OpenEditorView";

function OpenReactTaskPage() {
  const { taskId } = useParams({ from: "/open/react/$taskId" });
  const selectedTask =
    REACT_TASKS.find((t) => String(t.id) === String(taskId)) ||
    ALL_TASKS.find((t) => String(t.id) === String(taskId));

  return <OpenEditorView task={selectedTask} section="react" />;
}

export const Route = createFileRoute("/open/react/$taskId")({
  component: OpenReactTaskPage,
});
