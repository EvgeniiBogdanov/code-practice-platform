import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { OpenEditorPage } from "@/pages/open-editor";
import { loadTaskSection } from "@/entities/task";

export interface OpenTaskSearch {
  tab?: "candidate" | "solution" | "visualization";
  view?: "split" | "preview" | "code";
}

const OpenTsTaskRoute = (): React.JSX.Element => {
  const { taskId } = Route.useParams();
  const search = Route.useSearch();

  return (
    <OpenEditorPage
      taskId={taskId}
      section="typescript"
      tab={search.tab || "candidate"}
      initialViewMode={search.view}
    />
  );
};

export const Route = createFileRoute("/open/typescript/$taskId")({
  loader: () => loadTaskSection("typescript"),
  validateSearch: (search: Record<string, unknown>): OpenTaskSearch => ({
    tab:
      search.tab === "solution"
        ? "solution"
        : search.tab === "visualization"
          ? "visualization"
          : "candidate",
    view:
      search.view === "code"
        ? "code"
        : search.view === "preview"
          ? "preview"
          : search.view === "split"
            ? "split"
            : undefined,
  }),
  component: OpenTsTaskRoute,
});
