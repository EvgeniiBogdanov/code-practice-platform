import { createFileRoute } from "@tanstack/react-router";
import { SystemDesignFolderPage } from "@/pages/system-design";

const SystemDesignTheoryRoute = () => <SystemDesignFolderPage folder="theory" />;

export const Route = createFileRoute("/system-design/topics/")({
  component: SystemDesignTheoryRoute,
});
