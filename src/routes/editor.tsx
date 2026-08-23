import { createFileRoute } from "@tanstack/react-router";
import { OpenEditorPage } from "@/pages/open-editor";

export const Route = createFileRoute("/editor")({
  component: OpenEditorPage,
});
