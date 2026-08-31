import { createFileRoute } from "@tanstack/react-router";
import { AlgorithmsOverviewPage } from "@/pages/section-overview";
import { loadTaskSection } from "@/entities/task/catalog";

export const Route = createFileRoute("/algorithms/")({
  loader: () => loadTaskSection("algorithms"),
  component: AlgorithmsOverviewPage,
});
