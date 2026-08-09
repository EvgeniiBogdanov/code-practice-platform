import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import "./reset.css";
import "./playground.css";

// Создание экземпляра роутера TanStack Router
const router = createRouter({
  routeTree,
  basepath: import.meta.env.BASE_URL,
  defaultPreload: "intent",
});

const rootElement = document.getElementById("root");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}
