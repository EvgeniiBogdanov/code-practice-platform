import React from "react";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "../routeTree.gen";
import { UiLoader } from "@/shared/ui";
import { AppProviders } from "./providers";
import "./styles/reset.css";
import "./styles/tokens.css";
import "./styles/trace-tokens.css";
import "./styles/global.css";

const router = createRouter({
  routeTree,
  basepath: import.meta.env.BASE_URL,
  defaultPreload: "intent",
  defaultPendingComponent: () => <UiLoader center size="lg" />,
  // Show the spinner quickly instead of keeping the old page frozen (default is 1s), and keep it
  // long enough not to flash on fast loads.
  defaultPendingMs: 150,
  defaultPendingMinMs: 400,
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
