import React, { useEffect } from "react";
import { subscribeToSystemTheme } from "@/entities/ui-state";
import { ErrorBoundary } from "@/shared/ui";

export interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps): React.JSX.Element => {
  useEffect(subscribeToSystemTheme, []);

  return <ErrorBoundary>{children}</ErrorBoundary>;
};
