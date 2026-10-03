import React from "react";
import { flushSync } from "react-dom";
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

const prefersReducedMotion = (): boolean =>
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Swaps the root's content with a cross-fade (View Transitions API) where the browser supports it. */
const swapWithTransition = (swap: () => void): void => {
  if (typeof document.startViewTransition !== "function" || prefersReducedMotion()) {
    swap();
    return;
  }
  document.startViewTransition(() => flushSync(swap));
};

const renderWorkspace = async (root: ReactDOM.Root, isSwap = false): Promise<void> => {
  // The chunk is loaded before the transition starts, so the cross-fade never waits on the network.
  const { App } = await import("./app/App");
  const render = (): void =>
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  if (isSwap) swapWithTransition(render);
  else render();
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
    renderWorkspace(root, true).catch(() => window.location.assign(url));
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
