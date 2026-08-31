import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FavoritesPage } from "@/pages/favorites";
import { loadTaskSection } from "@/entities/task/catalog";

const ReactFavoritesRoute = (): React.JSX.Element => <FavoritesPage section="react" />;

export const Route = createFileRoute("/react/favorites")({
  loader: () => loadTaskSection("react"),
  component: ReactFavoritesRoute,
});
