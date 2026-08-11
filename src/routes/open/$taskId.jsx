import React from "react";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { JS_TASKS } from "../../javascript/data/tasksData";
import { ALL_TASKS } from "../../react/data/tasksData";
import { ALL_ALGO_TASKS } from "../../algorithms/data/tasksData";
import OpenEditorView from "../../components/task/OpenEditorView";

function OpenDirectTaskPage() {
  const { taskId } = useParams({ from: "/open/$taskId" });

  const algoTask = ALL_ALGO_TASKS.find((t) => String(t.id) === String(taskId));
  const jsTask = JS_TASKS.find((t) => String(t.id) === String(taskId));
  const reactTask = ALL_TASKS.find((t) => String(t.id) === String(taskId));

  const selectedTask = algoTask || jsTask || reactTask;
  const section = algoTask ? "algorithms" : jsTask ? "javascript" : "react";

  return <OpenEditorView task={selectedTask} section={section} />;
}

export const Route = createFileRoute("/open/$taskId")({
  component: OpenDirectTaskPage,
});
