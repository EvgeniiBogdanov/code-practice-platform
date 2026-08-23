import React from "react";
import ReactDOM from "react-dom/client";
import { ClickToComponent } from "click-to-react-component";
import { App } from "./app/App";

const rootElement = document.getElementById("root");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ClickToComponent />
      <App />
    </React.StrictMode>
  );
}
