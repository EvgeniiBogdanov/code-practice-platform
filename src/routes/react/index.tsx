import { createFileRoute } from "@tanstack/react-router";
import { ReactOverviewPage } from "@/pages/section-overview";

export const Route = createFileRoute("/react/")({
  component: ReactOverviewPage,
});
