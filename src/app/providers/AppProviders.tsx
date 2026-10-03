import React, { useEffect } from "react";
import { subscribeToSystemTheme } from "@/entities/ui-state";
import { syncLocalAccountStore, useLocalAccountStore } from "@/shared/auth";
import { ErrorBoundary } from "@/shared/ui";

export interface AppProvidersProps {
  children: React.ReactNode;
}

const leaveWorkspace = (): void => {
  window.location.replace(import.meta.env.BASE_URL);
};

export const AppProviders = ({ children }: AppProvidersProps): React.JSX.Element => {
  useEffect(subscribeToSystemTheme, []);

  // Session guard: signing out here, in another tab or before a bfcache restore opens the landing.
  // The guard subscribes before the sync so a missing account is caught right on mount.
  useEffect(() => {
    const unsubscribeGuard = useLocalAccountStore.subscribe(({ account }) => {
      if (!account) leaveWorkspace();
    });
    const stopSync = syncLocalAccountStore();
    return () => {
      stopSync();
      unsubscribeGuard();
    };
  }, []);

  return <ErrorBoundary>{children}</ErrorBoundary>;
};
