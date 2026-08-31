import React from "react";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "../routeTree.gen";
import { UiLoader } from "@/shared/ui";
import { AppProviders } from "./providers";
import "./styles/reset.css";
import "./styles/tokens.css";
import "./styles/global.css";

export const router = createRouter({
  routeTree,
  basepath: import.meta.env.BASE_URL,
  defaultPreload: "intent",
  defaultPendingComponent: () => <UiLoader center size="lg" />,
  defaultPendingMinMs: 0,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export const App = (): React.JSX.Element => {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
};
