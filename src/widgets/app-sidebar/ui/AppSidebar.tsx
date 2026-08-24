import React, { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useLocation } from "@tanstack/react-router";
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
  const startXRef = useRef(0);
  const startWidthRef = useRef(sidebarWidth);
  const sidebarRef = useRef<HTMLElement>(null);

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
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
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
    if (sidebarWidth) {
      document.documentElement.style.setProperty("--sidebar-width", `${sidebarWidth}px`);
    }
  }, [sidebarWidth]);

  return (
    <aside
      ref={sidebarRef}
      style={{ width: sidebarOpen ? `${sidebarWidth}px` : "0px" } as React.CSSProperties}
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

        <div
          ref={contentRef}
          className={styles.content}
          tabIndex={-1}
          role={activeSectionKey !== "home" ? "tree" : undefined}
          aria-label={activeSectionKey !== "home" ? "Навигация по темам и задачам" : undefined}
        >
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
