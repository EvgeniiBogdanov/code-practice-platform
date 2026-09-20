import React, { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { loadTaskSection } from "@/entities/task";
import { UiLoader } from "@/shared/ui";

const GroupOverviewPage = lazy(() =>
  import("@/pages/group-overview").then(({ GroupOverviewPage: component }) => ({
    default: component,
  }))
);

const TaskPage = lazy(() =>
  import("@/pages/task").then(({ TaskPage: component }) => ({ default: component }))
);

export interface TaskRouteSearch {
  tab?: string;
}

const TsTaskRoute = (): React.JSX.Element => {
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
      <TaskPage taskId={taskId} section="typescript" initialTab={search.tab || "candidate"} />
    </Suspense>
  );
};

export const Route = createFileRoute("/typescript/$taskId")({
  loader: async ({ params }) => {
    const isGroup = Boolean(
      params.taskId && (params.taskId.startsWith("group-") || params.taskId.startsWith("subgroup-"))
    );
    const [tasks] = await Promise.all([
      loadTaskSection("typescript"),
      isGroup ? import("@/pages/group-overview") : import("@/pages/task"),
    ]);
    return tasks;
  },
  validateSearch: (search: Record<string, unknown>): TaskRouteSearch => ({
    tab: typeof search.tab === "string" ? search.tab : undefined,
  }),
  component: TsTaskRoute,
});
