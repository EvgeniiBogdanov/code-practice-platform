import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FavoritesPage } from "@/pages/favorites";

const AlgorithmsFavoritesRoute = (): React.JSX.Element => <FavoritesPage section="algorithms" />;

export const Route = createFileRoute("/algorithms/favorites")({
  component: AlgorithmsFavoritesRoute,
});
