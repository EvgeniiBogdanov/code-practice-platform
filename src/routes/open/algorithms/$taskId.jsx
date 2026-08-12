import React from "react";
import { createFileRoute, useParams, useSearch } from "@tanstack/react-router";
import OpenEditorView from "../../../components/task/OpenEditorView";
import { getTaskById } from "../../../data/tasksRegistry";

function OpenAlgorithmsTaskPage() {
  const { taskId } = useParams({ from: "/open/algorithms/$taskId" });
  const search = useSearch({ from: "/open/algorithms/$taskId" });
  const selectedTask = getTaskById(taskId);

  return <OpenEditorView task={selectedTask} section="algorithms" tab={search?.tab || "candidate"} />;
}

export const Route = createFileRoute("/open/algorithms/$taskId")({
  validateSearch: (search) => ({
    tab: typeof search?.tab === "string" ? search.tab : "candidate",
  }),
  component: OpenAlgorithmsTaskPage,
});
