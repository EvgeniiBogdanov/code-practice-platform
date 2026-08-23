import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { OpenEditorPage } from "@/pages/open-editor";

export interface OpenTaskSearch {
  tab?: "candidate" | "solution";
  view?: "preview" | "code";
}

const OpenAlgoTaskRoute = () => {
  const { taskId } = Route.useParams();
  const search = Route.useSearch();

  return (
    <OpenEditorPage taskId={taskId} tab={search.tab || "candidate"} initialViewMode={search.view} />
  );
};

export const Route = createFileRoute("/open/algorithms/$taskId")({
  validateSearch: (search: Record<string, unknown>): OpenTaskSearch => ({
    tab: search.tab === "solution" ? "solution" : "candidate",
    view: search.view === "code" ? "code" : search.view === "preview" ? "preview" : undefined,
  }),
  component: OpenAlgoTaskRoute,
});
