import React from "react";
import { ErrorBoundary } from "@/shared/ui";

export interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps): React.JSX.Element => {
  return <ErrorBoundary>{children}</ErrorBoundary>;
};
