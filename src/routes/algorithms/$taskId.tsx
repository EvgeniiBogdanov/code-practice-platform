import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { TaskPage } from "@/pages/task";
import { GroupOverviewPage } from "@/pages/group-overview";
import { loadTaskSection } from "@/entities/task/catalog";

export interface TaskRouteSearch {
  tab?: string;
}

const AlgoTaskRoute = () => {
  const { taskId } = Route.useParams();
  const search = Route.useSearch();

  if (taskId && (taskId.startsWith("group-") || taskId.startsWith("subgroup-"))) {
    return <GroupOverviewPage groupId={taskId} />;
  }

  return <TaskPage taskId={taskId} section="algorithms" initialTab={search.tab || "candidate"} />;
};

export const Route = createFileRoute("/algorithms/$taskId")({
  loader: () => loadTaskSection("algorithms"),
  validateSearch: (search: Record<string, unknown>): TaskRouteSearch => ({
    tab: typeof search.tab === "string" ? search.tab : undefined,
  }),
  component: AlgoTaskRoute,
});
