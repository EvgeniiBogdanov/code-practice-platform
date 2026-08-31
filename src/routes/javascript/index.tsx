import { createFileRoute } from "@tanstack/react-router";
import { JavascriptOverviewPage } from "@/pages/section-overview";
import { loadTaskSection } from "@/entities/task/catalog";

export const Route = createFileRoute("/javascript/")({
  loader: () => loadTaskSection("javascript"),
  component: JavascriptOverviewPage,
});
