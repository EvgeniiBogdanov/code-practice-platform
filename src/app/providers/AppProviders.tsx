import React from "react";
import { ErrorBoundary } from "@/shared/ui";

export interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}
