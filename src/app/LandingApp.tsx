import React, { useEffect, useLayoutEffect } from "react";
import { LandingPage } from "@/pages/landing";
import { subscribeToLocalAccount } from "@/shared/auth";
import { ErrorBoundary } from "@/shared/ui";
import "./styles/reset.css";
import "./styles/tokens.css";

export interface LandingAppProps {
  /** Swaps the landing for the workspace bundle in the same React root. */
  onEnterWorkspace: (targetPath?: string) => void;
}

/**
 * Landing entry. Intentionally does not import `global.css` (the workspace locks the document
 * scroll) nor the router: the landing scrolls natively and links only to its own anchors.
 */
export const LandingApp = ({ onEnterWorkspace }: LandingAppProps): React.JSX.Element => {
  // The landing is light-only. The UI store is deliberately not imported here: evaluating it applies
  // the saved (possibly dark) theme and flashes it; the workspace bundle restores that theme itself.
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", "light");
    root.setAttribute("data-landing", "");
    return () => root.removeAttribute("data-landing");
  }, []);

  // An account created in another tab opens the workspace here as well.
  useEffect(
    () =>
      subscribeToLocalAccount((account) => {
        if (account) onEnterWorkspace();
      }),
    [onEnterWorkspace]
  );

  return (
    <ErrorBoundary>
      <LandingPage onAccountCreated={onEnterWorkspace} />
    </ErrorBoundary>
  );
};
