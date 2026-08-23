import { createFileRoute } from "@tanstack/react-router";
import { AlgorithmsOverviewPage } from "@/pages/section-overview";

export const Route = createFileRoute("/algorithms/")({
  component: AlgorithmsOverviewPage,
});
