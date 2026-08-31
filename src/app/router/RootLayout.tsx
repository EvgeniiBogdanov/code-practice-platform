import React, { lazy, Suspense, useEffect, useLayoutEffect, useRef, memo } from "react";
import { Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { AppHeader } from "@/widgets/app-header";
import { AppSidebar } from "@/widgets/app-sidebar";
import { useProgressStore } from "@/entities/progress";
import { useReviewStore } from "@/entities/review";
import { useUIStore } from "@/entities/ui-state";
import { useGlobalShortcuts } from "@/shared/lib/hooks";
import { initSolutionsCache } from "@/shared/lib/storage";
import { ModalFallback, TooltipProvider, UiLoader } from "@/shared/ui";
import styles from "./RootLayout.module.css";

const FinderBreadcrumbs = lazy(() =>
  import("@/widgets/finder-breadcrumbs").then(({ FinderBreadcrumbs: component }) => ({
    default: component,
  }))
);
const StatsModal = lazy(() =>
  import("@/widgets/stats-modal").then(({ StatsModal: component }) => ({ default: component }))
);
const SettingsModal = lazy(() =>
  import("@/widgets/settings-modal").then(({ SettingsModal: component }) => ({
    default: component,
  }))
);
const CheatSheetModal = lazy(() =>
  import("@/widgets/cheat-sheet-modal").then(({ CheatSheetModal: component }) => ({
    default: component,
  }))
);
const CommandPalette = lazy(() =>
  import("@/widgets/command-palette").then(({ CommandPalette: component }) => ({
    default: component,
  }))
);

export const RootLayout = memo(() => {
  const initProgress = useProgressStore((state) => state.initProgress);
  const initReviews = useReviewStore((state) => state.initReviews);

  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const setSidebarOpen = useUIStore((state) => state.setSidebarOpen);
  const setPaletteOpen = useUIStore((state) => state.setPaletteOpen);
  const setPaletteQuery = useUIStore((state) => state.setPaletteQuery);
  const closeAllModals = useUIStore((state) => state.closeAllModals);
  const statsModalOpen = useUIStore((state) => state.statsModalOpen);
  const settingsModalOpen = useUIStore((state) => state.settingsModalOpen);
  const cheatSheetOpen = useUIStore((state) => state.cheatSheetOpen);
  const paletteOpen = useUIStore((state) => state.paletteOpen);

  const contentAreaRef = useRef<HTMLElement | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll reset on page transition (runs before browser paint to prevent jump)
  useLayoutEffect(() => {
    if (!window.location.hash && contentAreaRef.current) {
      contentAreaRef.current.scrollTop = 0;
    }
  }, [location.pathname]);

  // Responsive sidebar handling (<768px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768 && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen, setSidebarOpen]);

  // Initialize DB stores on mount
  useEffect(() => {
    initProgress();
    initReviews();
    initSolutionsCache();
  }, [initProgress, initReviews]);

  const isOpenMode = location.pathname.startsWith("/open") || location.pathname === "/editor";

  // Global Keyboard Shortcuts (Cmd+K, Escape, navigation)
  useGlobalShortcuts({
    isOpenMode,
    navigate,
    setPaletteOpen,
    setPaletteQuery,
    closeAllModals,
  });

  return (
    <TooltipProvider delayDuration={600} skipDelayDuration={300}>
      {isOpenMode ? (
        <Outlet />
      ) : (
        <div className={styles.appContainer}>
          <AppSidebar />

          {sidebarOpen && (
            <div
              className={styles.sidebarBackdrop}
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />
          )}

          <div className={styles.appContentWrapper}>
            <AppHeader
              breadcrumbs={
                location.pathname === "/" || location.pathname === "/home" ? null : (
                  <Suspense fallback={null}>
                    <FinderBreadcrumbs />
                  </Suspense>
                )
              }
            />
            <main className={styles.contentArea} ref={contentAreaRef}>
              <Suspense fallback={<UiLoader center size="lg" />}>
                <Outlet />
              </Suspense>
            </main>
          </div>
        </div>
      )}

      <Suspense fallback={<ModalFallback />}>
        {statsModalOpen && <StatsModal />}
        {settingsModalOpen && <SettingsModal />}
        {cheatSheetOpen && <CheatSheetModal />}
        {paletteOpen && <CommandPalette />}
      </Suspense>
    </TooltipProvider>
  );
});

RootLayout.displayName = "RootLayout";
