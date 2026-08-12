import React from "react";
import { createFileRoute, useParams, useSearch } from "@tanstack/react-router";
import OpenEditorView from "../../../components/task/OpenEditorView";
import { getTaskById } from "../../../data/tasksRegistry";

function OpenJavascriptTaskPage() {
  const { taskId } = useParams({ from: "/open/javascript/$taskId" });
  const search = useSearch({ from: "/open/javascript/$taskId" });
  const selectedTask = getTaskById(taskId);

  return <OpenEditorView task={selectedTask} section="javascript" tab={search?.tab || "candidate"} />;
}

export const Route = createFileRoute("/open/javascript/$taskId")({
  validateSearch: (search) => ({
    tab: typeof search?.tab === "string" ? search.tab : "candidate",
  }),
  component: OpenJavascriptTaskPage,
});
