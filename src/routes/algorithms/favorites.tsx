import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FavoritesPage } from "@/pages/favorites";
import { loadTaskSection } from "@/entities/task/catalog";

const AlgorithmsFavoritesRoute = (): React.JSX.Element => <FavoritesPage section="algorithms" />;

export const Route = createFileRoute("/algorithms/favorites")({
  loader: () => loadTaskSection("algorithms"),
  component: AlgorithmsFavoritesRoute,
});
