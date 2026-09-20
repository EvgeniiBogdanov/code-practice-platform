import { createFileRoute } from "@tanstack/react-router";
import { TypescriptOverviewPage } from "@/pages/section-overview";
import { loadTaskSection } from "@/entities/task";

export const Route = createFileRoute("/typescript/")({
  loader: () => loadTaskSection("typescript"),
  component: TypescriptOverviewPage,
});
