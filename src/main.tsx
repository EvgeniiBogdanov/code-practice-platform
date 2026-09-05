import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./app/App";

const waitForCriticalFonts = async (): Promise<void> => {
  if (
    typeof document === "undefined" ||
    !("fonts" in document) ||
    typeof document.fonts.load !== "function"
  ) {
    return;
  }

  try {
    const criticalWeights = ["400 1em Inter", "500 1em Inter", "600 1em Inter"];
    const fontPromises = criticalWeights.map((font) => document.fonts.load(font));

    // Wait for critical font faces or max 500ms timeout to prevent FOUT while preserving offline resilience
    await Promise.race([
      Promise.all([...fontPromises, document.fonts.ready]),
      new Promise<void>((resolve) => setTimeout(resolve, 500)),
    ]);
  } catch {
    // Non-blocking fail-safe: continue even if font loading fails
  }
};

const bootstrap = async (): Promise<void> => {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    return;
  }

  await waitForCriticalFonts();

  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

void bootstrap();
