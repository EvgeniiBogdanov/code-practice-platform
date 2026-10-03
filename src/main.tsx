import React from "react";
import ReactDOM from "react-dom/client";
import { readLocalAccount } from "@/shared/auth";
import { resolveEntryTarget, toBrowserPath, WORKSPACE_HOME_PATH } from "./app/entrypoint";

/**
 * Bootstrapper: the only code shared by both entries is React itself. Guests download the
 * landing bundle; the workspace bundle (router, stores, editor) is requested only after the
 * local account exists — either on boot or right after sign-up on the landing.
 */
const BASE_URL = import.meta.env.BASE_URL;

const replaceUrl = (url: string): void => {
  const { pathname, search, hash } = window.location;
  if (url !== `${pathname}${search}${hash}`) {
    window.history.replaceState(window.history.state, "", url);
  }
};

const renderWorkspace = async (root: ReactDOM.Root): Promise<void> => {
  const { App } = await import("./app/App");
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

const bootstrap = (): void => {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    return;
  }

  const root = ReactDOM.createRoot(rootElement);
  const entry = resolveEntryTarget(window.location, BASE_URL, readLocalAccount() !== null);
  replaceUrl(entry.url);

  if (entry.kind === "workspace") {
    void renderWorkspace(root);
    return;
  }

  let isEnteringWorkspace = false;
  const enterWorkspace = (targetPath?: string): void => {
    if (isEnteringWorkspace) return;
    isEnteringWorkspace = true;

    // The router reads the URL when its module is evaluated, so the URL must change first.
    const url = toBrowserPath(targetPath ?? entry.redirectTo ?? WORKSPACE_HOME_PATH, BASE_URL);
    replaceUrl(url);
    window.scrollTo(0, 0);
    renderWorkspace(root).catch(() => window.location.assign(url));
  };

  void import("./app/LandingApp").then(({ LandingApp }) => {
    root.render(
      <React.StrictMode>
        <LandingApp onEnterWorkspace={enterWorkspace} />
      </React.StrictMode>
    );
  });
};

bootstrap();
