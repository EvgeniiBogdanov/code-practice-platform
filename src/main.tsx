import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./app/App";

const bootstrap = (): void => {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    return;
  }

  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

bootstrap();
