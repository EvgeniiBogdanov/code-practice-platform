import React from "react";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { JS_TASKS } from "../../../javascript/data/tasksData";
import OpenEditorView from "../../../components/task/OpenEditorView";

function OpenJavascriptTaskPage() {
  const { taskId } = useParams({ from: "/open/javascript/$taskId" });
  const selectedTask = JS_TASKS.find((t) => String(t.id) === String(taskId));

  return <OpenEditorView task={selectedTask} section="javascript" />;
}

export const Route = createFileRoute("/open/javascript/$taskId")({
  component: OpenJavascriptTaskPage,
});
