import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FavoritesPage } from "@/pages/favorites";

const ReactFavoritesRoute = (): React.JSX.Element => <FavoritesPage section="react" />;

export const Route = createFileRoute("/react/favorites")({
  component: ReactFavoritesRoute,
});
