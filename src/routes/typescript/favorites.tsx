import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FavoritesPage } from "@/pages/favorites";
import { loadTaskSection } from "@/entities/task";

const TypescriptFavoritesRoute = (): React.JSX.Element => <FavoritesPage section="typescript" />;

export const Route = createFileRoute("/typescript/favorites")({
  loader: () => loadTaskSection("typescript"),
  component: TypescriptFavoritesRoute,
});
