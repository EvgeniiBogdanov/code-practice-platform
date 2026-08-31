import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FavoritesPage } from "@/pages/favorites";
import { loadTaskSection } from "@/entities/task/catalog";

const JavascriptFavoritesRoute = (): React.JSX.Element => <FavoritesPage section="javascript" />;

export const Route = createFileRoute("/javascript/favorites")({
  loader: () => loadTaskSection("javascript"),
  component: JavascriptFavoritesRoute,
});
