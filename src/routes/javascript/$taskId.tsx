import React, { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { loadTaskSection } from "@/entities/task/catalog";
import { UiLoader } from "@/shared/ui";

const GroupOverviewPage = lazy(() =>
  import("@/pages/group-overview").then(({ GroupOverviewPage: component }) => ({ default: component }))
);

const TaskPage = lazy(() =>
  import("@/pages/task").then(({ TaskPage: component }) => ({ default: component }))
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

  return (
    <Suspense fallback={<UiLoader center size="lg" label="Загружаем задачу..." />}>
      <TaskPage taskId={taskId} section="javascript" initialTab={search.tab || "candidate"} />
    </Suspense>
  );
};

export const Route = createFileRoute("/javascript/$taskId")({
  loader: async ({ params }) => {
    const isGroup = Boolean(
      params.taskId && (params.taskId.startsWith("group-") || params.taskId.startsWith("subgroup-"))
    );
    const [tasks] = await Promise.all([
      loadTaskSection("javascript"),
      isGroup ? import("@/pages/group-overview") : import("@/pages/task"),
    ]);
    return tasks;
  },
  validateSearch: (search: Record<string, unknown>): TaskRouteSearch => ({
    tab: typeof search.tab === "string" ? search.tab : undefined,
  }),
  component: JsTaskRoute,
});
