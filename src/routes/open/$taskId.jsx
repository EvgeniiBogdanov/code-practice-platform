import React from "react";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { JS_TASKS } from "../../javascript/data/tasksData";
import { ALL_TASKS } from "../../react/data/tasksData";
import OpenEditorView from "../../components/task/OpenEditorView";

function OpenDirectTaskPage() {
  const { taskId } = useParams({ from: "/open/$taskId" });

  const jsTask = JS_TASKS.find((t) => String(t.id) === String(taskId));
  const reactTask = ALL_TASKS.find((t) => String(t.id) === String(taskId));

  const selectedTask = jsTask || reactTask;
  const section = jsTask ? "javascript" : "react";

  return <OpenEditorView task={selectedTask} section={section} />;
}

export const Route = createFileRoute("/open/$taskId")({
  component: OpenDirectTaskPage,
});
