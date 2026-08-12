import React from "react";
import { createFileRoute, useParams, useSearch } from "@tanstack/react-router";
import OpenEditorView from "../../components/task/OpenEditorView";
import { getTaskById, resolveTaskSection } from "../../data/tasksRegistry";

function OpenDirectTaskPage() {
  const { taskId } = useParams({ from: "/open/$taskId" });
  const search = useSearch({ from: "/open/$taskId" });

  const selectedTask = getTaskById(taskId);
  const section = resolveTaskSection(selectedTask);

  return <OpenEditorView task={selectedTask} section={section} tab={search?.tab || "candidate"} />;
}

export const Route = createFileRoute("/open/$taskId")({
  validateSearch: (search) => ({
    tab: typeof search?.tab === "string" ? search.tab : "candidate",
  }),
  component: OpenDirectTaskPage,
});
