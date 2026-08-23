import { createFileRoute } from "@tanstack/react-router";
import { JavascriptOverviewPage } from "@/pages/section-overview";

export const Route = createFileRoute("/javascript/")({
  component: JavascriptOverviewPage,
});
