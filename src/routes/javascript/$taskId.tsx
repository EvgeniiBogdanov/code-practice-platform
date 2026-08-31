import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { TaskPage } from "@/pages/task";
import { GroupOverviewPage } from "@/pages/group-overview";
import { loadTaskSection } from "@/entities/task/catalog";

export interface TaskRouteSearch {
  tab?: string;
}

const JsTaskRoute = () => {
  const { taskId } = Route.useParams();
  const search = Route.useSearch();

  if (taskId && (taskId.startsWith("group-") || taskId.startsWith("subgroup-"))) {
    return <GroupOverviewPage groupId={taskId} />;
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
