import React, { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { preloadTaskHints } from "@/entities/task";
import { loadTaskSection } from "@/entities/task/catalog";
import { UiLoader } from "@/shared/ui";

const TaskPage = lazy(() =>
  import("@/pages/task").then(({ TaskPage: component }) => ({ default: component }))
);

export interface TaskRouteSearch {
  tab?: string;
}

const SystemDesignTaskRoute = () => {
  const { taskId } = Route.useParams();
  const search = Route.useSearch();

  return (
    <Suspense fallback={<UiLoader center size="lg" label="Загружаем задачу..." />}>
      <TaskPage taskId={taskId} section="system-design" initialTab={search.tab || "candidate"} />
    </Suspense>
  );
};

export const Route = createFileRoute("/system-design/$taskId")({
  loader: async () => {
    const [tasks] = await Promise.all([
      loadTaskSection("system-design"),
      import("@/pages/task"),
      preloadTaskHints("system-design"),
    ]);
    return tasks;
  },
  validateSearch: (search: Record<string, unknown>): TaskRouteSearch => ({
    tab: typeof search.tab === "string" ? search.tab : undefined,
  }),
  component: SystemDesignTaskRoute,
});
