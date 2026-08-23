import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { OpenEditorPage } from "@/pages/open-editor";

const OpenIndexRoute = () => {
  return <OpenEditorPage />;
};

export const Route = createFileRoute("/open/")({
  component: OpenIndexRoute,
});
