import { createFileRoute } from "@tanstack/react-router";
import { ReactOverviewPage } from "@/pages/section-overview";
import { loadTaskSection } from "@/entities/task/catalog";

export const Route = createFileRoute("/react/")({
  loader: () => loadTaskSection("react"),
  component: ReactOverviewPage,
});
