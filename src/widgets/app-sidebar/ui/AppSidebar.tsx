import React, { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useLocation } from "@tanstack/react-router";
import { useUIStore } from "@/entities/ui-state";
import { SectionType } from "@/entities/task";
import { Tooltip } from "@/shared/ui";
import { DueTasksBadge } from "@/features/spaced-repetition";
import { SidebarWorkspaceHeader } from "./SidebarWorkspaceHeader";
import { SidebarHomeOverview } from "./SidebarHomeOverview";
import { SidebarReactList } from "./SidebarReactList";
import { SidebarJsList } from "./SidebarJsList";
import { SidebarAlgoList } from "./SidebarAlgoList";
import { useSidebarSync } from "../model/useSidebarSync";
import styles from "./AppSidebar.module.css";

export interface AppSidebarProps {
  className?: string;
}

export const AppSidebar = ({ className }: AppSidebarProps) => {
  const location = useLocation();
  const pathname = location.pathname;

  // Auto-sync active task's category and scroll into view
  useSidebarSync();

  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const setSidebarOpen = useUIStore((state) => state.setSidebarOpen);
  const sidebarWidth = useUIStore((state) => state.sidebarWidth) || 280;
  const setSidebarWidth = useUIStore((state) => state.setSidebarWidth);

  const [isResizing, setIsResizing] = useState(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(sidebarWidth);
  const sidebarRef = useRef<HTMLElement>(null);

  const activeSectionKey: "home" | SectionType = useMemo(() => {
    if (pathname.startsWith("/javascript")) return "javascript";
    if (pathname.startsWith("/algorithms")) return "algorithms";
    if (pathname.startsWith("/react")) return "react";
    return "home";
  }, [pathname]);

  // Reset sidebar width on double click
  const handleDoubleClick = useCallback(() => {
    const defaultWidth = 280;
    setSidebarWidth(defaultWidth);
    document.documentElement.style.setProperty("--sidebar-width", `${defaultWidth}px`);
  }, [setSidebarWidth]);

  // Sidebar drag resizer
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Direct double-click detection via DOM click count
      if (e.detail >= 2) {
        e.preventDefault();
        e.stopPropagation();
        handleDoubleClick();
        return;
      }

      e.preventDefault();
      setIsResizing(true);
      startXRef.current = e.clientX;
      startWidthRef.current = sidebarWidth;
      document.body.classList.add("is-resizing-sidebar");
    },
    [sidebarWidth, handleDoubleClick]
  );

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - startXRef.current;
      const newWidth = Math.min(Math.max(startWidthRef.current + delta, 220), 480);
      setSidebarWidth(newWidth);
      document.documentElement.style.setProperty("--sidebar-width", `${newWidth}px`);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.classList.remove("is-resizing-sidebar");
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.classList.remove("is-resizing-sidebar");
    };
  }, [isResizing, setSidebarWidth]);

  useEffect(() => {
    if (sidebarWidth) {
      document.documentElement.style.setProperty("--sidebar-width", `${sidebarWidth}px`);
    }
  }, [sidebarWidth]);

  return (
    <aside
      ref={sidebarRef}
      style={{ width: sidebarOpen ? `${sidebarWidth}px` : "0px" }}
      className={[
        styles.sidebar,
        !sidebarOpen && styles.closed,
        isResizing && styles.isResizing,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Tooltip.Provider delayDuration={600} skipDelayDuration={300}>
        <SidebarWorkspaceHeader
          activeSectionKey={activeSectionKey}
          onCloseSidebar={() => setSidebarOpen(false)}
        />

        <div className={styles.content}>
          <div className={styles.dueSection}>
            <DueTasksBadge />
          </div>

          {activeSectionKey === "home" ? (
            <SidebarHomeOverview activeSectionKey={activeSectionKey} />
          ) : activeSectionKey === "javascript" ? (
            <SidebarJsList />
          ) : activeSectionKey === "algorithms" ? (
            <SidebarAlgoList />
          ) : (
            <SidebarReactList />
          )}
        </div>
      </Tooltip.Provider>

      {sidebarOpen && (
        <div
          className={[styles.resizer, isResizing && styles.active].filter(Boolean).join(" ")}
          onMouseDown={handleMouseDown}
          onDoubleClick={handleDoubleClick}
          title="Перетащите для изменения ширины (двойной клик — сброс)"
        />
      )}
    </aside>
  );
};
