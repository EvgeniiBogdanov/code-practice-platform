import { createFileRoute } from "@tanstack/react-router";
import { loadTaskSection } from "@/entities/task/catalog";
import { SystemDesignFolderPage } from "@/pages/system-design";

const SystemDesignDrillsRoute = () => <SystemDesignFolderPage folder="drills" />;

export const Route = createFileRoute("/system-design/drills")({
  loader: () => loadTaskSection("system-design"),
  component: SystemDesignDrillsRoute,
});
