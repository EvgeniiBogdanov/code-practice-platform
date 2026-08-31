import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { OpenEditorPage } from "@/pages/open-editor";
import { loadTaskSection } from "@/entities/task/catalog";
import { getTaskSectionById } from "@/entities/task/meta";

export interface OpenTaskSearch {
  tab?: "candidate" | "solution";
  view?: "preview" | "code";
}

const OpenTaskRoute = () => {
  const { taskId } = Route.useParams();
  const search = Route.useSearch();
  const section = getTaskSectionById(taskId);

  return (
    <OpenEditorPage
      taskId={taskId}
      section={section}
      tab={search.tab || "candidate"}
      initialViewMode={search.view}
    />
  );
};

export const Route = createFileRoute("/open/$taskId")({
  loader: ({ params }) => loadTaskSection(getTaskSectionById(params.taskId)),
  validateSearch: (search: Record<string, unknown>): OpenTaskSearch => ({
    tab: search.tab === "solution" ? "solution" : "candidate",
    view: search.view === "code" ? "code" : search.view === "preview" ? "preview" : undefined,
  }),
  component: OpenTaskRoute,
});
