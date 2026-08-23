import { createRootRoute } from "@tanstack/react-router";
import { RootLayout } from "@/app/router/RootLayout";
import { NotFoundPage } from "@/pages/not-found";

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
});
