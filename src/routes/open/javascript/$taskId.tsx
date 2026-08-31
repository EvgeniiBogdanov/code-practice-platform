import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { OpenEditorPage } from "@/pages/open-editor";
import { loadTaskSection } from "@/entities/task/catalog";

export interface OpenTaskSearch {
  tab?: "candidate" | "solution";
  view?: "split" | "preview" | "code";
}

const OpenJsTaskRoute = () => {
  const { taskId } = Route.useParams();
  const search = Route.useSearch();

  return (
    <OpenEditorPage taskId={taskId} section="javascript" tab={search.tab || "candidate"} initialViewMode={search.view} />
  );
};

export const Route = createFileRoute("/open/javascript/$taskId")({
  loader: () => loadTaskSection("javascript"),
  validateSearch: (search: Record<string, unknown>): OpenTaskSearch => ({
    tab: search.tab === "solution" ? "solution" : "candidate",
    view:
      search.view === "code"
        ? "code"
        : search.view === "preview"
          ? "preview"
          : search.view === "split"
            ? "split"
            : undefined,
  }),
  component: OpenJsTaskRoute,
});
