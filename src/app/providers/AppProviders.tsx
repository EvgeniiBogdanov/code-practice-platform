import React, { useEffect } from "react";
import { LazyMotion, MotionConfig, type FeatureBundle } from "motion/react";
import { subscribeToSystemTheme } from "@/entities/ui-state";
import { syncLocalAccountStore, useLocalAccountStore } from "@/shared/auth";
import { ErrorBoundary } from "@/shared/ui";

export interface AppProvidersProps {
  children: React.ReactNode;
}

const loadMotionFeatures = (): Promise<FeatureBundle> =>
  import("./motionFeatures").then((module) => module.default);

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

  return (
    <ErrorBoundary>
      {/* As on the landing: lightweight `m` components only, transforms honour reduced motion. */}
      <MotionConfig reducedMotion="user">
        <LazyMotion features={loadMotionFeatures} strict>
          {children}
        </LazyMotion>
      </MotionConfig>
    </ErrorBoundary>
  );
};
