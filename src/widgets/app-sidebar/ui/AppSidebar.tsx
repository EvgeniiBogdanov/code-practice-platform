import React, { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useLocation } from "@tanstack/react-router";
import { clsx } from "clsx";
import { useUIStore } from "@/entities/ui-state";
import { SectionType } from "@/entities/task";
import { Tooltip } from "@/shared/ui";
import { SidebarWorkspaceHeader } from "./SidebarWorkspaceHeader";
import { SidebarHomeOverview } from "./SidebarHomeOverview";
import { SidebarReactList } from "./SidebarReactList";
import { SidebarJsList } from "./SidebarJsList";
import { SidebarAlgoList } from "./SidebarAlgoList";
import { useSidebarSync, useSidebarKeyboardNav } from "../model";
import styles from "./AppSidebar.module.css";

export interface AppSidebarProps {
  className?: string;
}

export const AppSidebar = ({ className }: AppSidebarProps): React.JSX.Element => {
  const location = useLocation();
  const pathname = location.pathname;

  // Auto-sync active task's category and scroll into view
  useSidebarSync();

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
            currentTaskId={pathname.split("/").pop() || ""}
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
              <SidebarHomeOverview
                activeSectionKey={activeSectionKey}
                isHomeActive={pathname === "/" || pathname === "/home"}
              />
            ) : activeSectionKey === "javascript" ? (
              <SidebarJsList />
            ) : activeSectionKey === "algorithms" ? (
              <SidebarAlgoList />
            ) : (
              <SidebarReactList />
            )}
          </div>
        </Tooltip.Provider>
      </div>

      {sidebarOpen && (
        <div
          className={clsx(styles.resizer, isResizing && styles.active)}
          onMouseDown={handleMouseDown}
          onDoubleClick={handleDoubleClick}
          title="Перетащите для изменения ширины (двойной клик — сброс)"
        />
      )}
    </aside>
  );
};
