import React, { lazy, Suspense, useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useLocation } from "@tanstack/react-router";
import { clsx } from "clsx";
import { useUIStore } from "@/entities/ui-state";
import type { SectionType } from "@/entities/task/meta";
import { Tooltip } from "@/shared/ui";
import { SidebarWorkspaceHeader } from "./SidebarWorkspaceHeader";
import { SidebarHomeSkeleton } from "./SidebarHomeOverview/SidebarHomeSkeleton";
import { SidebarListSkeleton } from "./SidebarListSkeleton";
import { useSidebarKeyboardNav } from "../model/use-sidebar-keyboard-nav";
import styles from "./AppSidebar.module.css";

const SidebarHomeOverview = lazy(() =>
  import("./SidebarHomeOverview/SidebarHomeOverview").then((module) => ({
    default: module.SidebarHomeOverview,
  }))
);
const SidebarReactList = lazy(() =>
  import("./SidebarReactList").then((module) => ({ default: module.SidebarReactList }))
);
const SidebarJsList = lazy(() =>
  import("./SidebarJsList").then((module) => ({ default: module.SidebarJsList }))
);
const SidebarAlgoList = lazy(() =>
  import("./SidebarAlgoList").then((module) => ({ default: module.SidebarAlgoList }))
);

export interface AppSidebarProps {
  className?: string;
}

export const AppSidebar = ({ className }: AppSidebarProps): React.JSX.Element => {
  const location = useLocation();
  const pathname = location.pathname;

  const contentRef = useRef<HTMLDivElement>(null);
  useSidebarKeyboardNav(contentRef);

  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const setSidebarOpen = useUIStore((state) => state.setSidebarOpen);
  const sidebarWidth = useUIStore((state) => state.sidebarWidth) || 280;
  const setSidebarWidth = useUIStore((state) => state.setSidebarWidth);

  const [isResizing, setIsResizing] = useState(false);
  const [draftSidebarWidth, setDraftSidebarWidth] = useState(sidebarWidth);
  const startXRef = useRef(0);
  const startWidthRef = useRef(sidebarWidth);
  const draftWidthRef = useRef(sidebarWidth);
  const sidebarRef = useRef<HTMLElement>(null);

  const displayedSidebarWidth = isResizing ? draftSidebarWidth : sidebarWidth;

  const activeSectionKey: "home" | SectionType = useMemo(() => {
    if (pathname.startsWith("/javascript")) return "javascript";
    if (pathname.startsWith("/algorithms")) return "algorithms";
    if (pathname.startsWith("/react")) return "react";
    return "home";
  }, [pathname]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsResizing(true);
      startXRef.current = e.clientX;
      startWidthRef.current = sidebarWidth;
      draftWidthRef.current = sidebarWidth;
      setDraftSidebarWidth(sidebarWidth);
    },
    [sidebarWidth]
  );

  const handleDoubleClick = useCallback(() => {
    setSidebarWidth(280);
  }, [setSidebarWidth]);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - startXRef.current;
      const newWidth = Math.min(Math.max(startWidthRef.current + delta, 220), 500);
      draftWidthRef.current = newWidth;
      setDraftSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setSidebarWidth(draftWidthRef.current);
      setIsResizing(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.body.classList.add("is-resizing");

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.classList.remove("is-resizing");
    };
  }, [isResizing, setSidebarWidth]);

  useEffect(() => {
    if (displayedSidebarWidth) {
      document.documentElement.style.setProperty("--sidebar-width", `${displayedSidebarWidth}px`);
    }
  }, [displayedSidebarWidth]);

  useEffect(() => {
    if (!isResizing) {
      draftWidthRef.current = sidebarWidth;
      setDraftSidebarWidth(sidebarWidth);
    }
  }, [isResizing, sidebarWidth]);

  return (
    <aside
      ref={sidebarRef}
      className={clsx(
        styles.sidebar,
        !sidebarOpen && styles.closed,
        isResizing && styles.isResizing,
        className
      )}
      aria-hidden={!sidebarOpen}
    >
      <div className={styles.sidebarInner}>
        <Tooltip.Provider delayDuration={600} skipDelayDuration={300}>
          <SidebarWorkspaceHeader
            activeSectionKey={activeSectionKey}
            onCloseSidebar={() => setSidebarOpen(false)}
          />

          <div
            ref={contentRef}
            className={styles.content}
            tabIndex={-1}
            role={activeSectionKey !== "home" ? "tree" : undefined}
            aria-label={activeSectionKey !== "home" ? "Навигация по темам и задачам" : undefined}
          >
            {activeSectionKey === "home" ? (
              <Suspense fallback={<SidebarHomeSkeleton />}>
                <SidebarHomeOverview
                  activeSectionKey={activeSectionKey}
                  isHomeActive={pathname === "/" || pathname === "/home"}
                />
              </Suspense>
            ) : (
              <Suspense
                key={activeSectionKey}
                fallback={<SidebarListSkeleton section={activeSectionKey} />}
              >
                {activeSectionKey === "javascript" && <SidebarJsList />}
                {activeSectionKey === "algorithms" && <SidebarAlgoList />}
                {activeSectionKey === "react" && <SidebarReactList />}
              </Suspense>
            )}
          </div>
        </Tooltip.Provider>
      </div>

      {sidebarOpen && (
        <Tooltip content="Перетащите для изменения ширины (двойной клик — сброс)" side="right">
          <div
            className={clsx(styles.resizer, isResizing && styles.active)}
            onMouseDown={handleMouseDown}
            onDoubleClick={handleDoubleClick}
            role="separator"
            aria-label="Изменить ширину боковой панели"
          />
        </Tooltip>
      )}
    </aside>
  );
};
