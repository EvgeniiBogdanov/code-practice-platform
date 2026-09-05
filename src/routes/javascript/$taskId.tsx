import React, { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { loadTaskSection } from "@/entities/task/catalog";
import { UiLoader } from "@/shared/ui";
import { TaskPage } from "@/pages/task";

const GroupOverviewPage = lazy(() =>
  import("@/pages/group-overview").then(({ GroupOverviewPage: component }) => ({ default: component }))
);

export interface TaskRouteSearch {
  tab?: string;
}

const JsTaskRoute = () => {
  const { taskId } = Route.useParams();
  const search = Route.useSearch();

  if (taskId && (taskId.startsWith("group-") || taskId.startsWith("subgroup-"))) {
    return (
      <Suspense fallback={<UiLoader center size="lg" label="Загружаем тему..." />}>
        <GroupOverviewPage groupId={taskId} />
      </Suspense>
    );
  }

  return <TaskPage taskId={taskId} section="javascript" initialTab={search.tab || "candidate"} />;
};

export const Route = createFileRoute("/javascript/$taskId")({
  loader: () => loadTaskSection("javascript"),
  validateSearch: (search: Record<string, unknown>): TaskRouteSearch => ({
    tab: typeof search.tab === "string" ? search.tab : undefined,
  }),
  component: JsTaskRoute,
});
