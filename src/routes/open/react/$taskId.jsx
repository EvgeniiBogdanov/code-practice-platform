import React from "react";
import { createFileRoute, useParams, useSearch } from "@tanstack/react-router";
import OpenEditorView from "../../../components/task/OpenEditorView";
import { getTaskById } from "../../../data/tasksRegistry";

function OpenReactTaskPage() {
  const { taskId } = useParams({ from: "/open/react/$taskId" });
  const search = useSearch({ from: "/open/react/$taskId" });
  const selectedTask = getTaskById(taskId);

  return <OpenEditorView task={selectedTask} section="react" tab={search?.tab || "candidate"} />;
}

export const Route = createFileRoute("/open/react/$taskId")({
  validateSearch: (search) => ({
    tab: typeof search?.tab === "string" ? search.tab : "candidate",
  }),
  component: OpenReactTaskPage,
});
