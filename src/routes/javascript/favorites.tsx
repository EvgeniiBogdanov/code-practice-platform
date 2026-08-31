import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FavoritesPage } from "@/pages/favorites";

const JavascriptFavoritesRoute = (): React.JSX.Element => <FavoritesPage section="javascript" />;

export const Route = createFileRoute("/javascript/favorites")({
  component: JavascriptFavoritesRoute,
});
