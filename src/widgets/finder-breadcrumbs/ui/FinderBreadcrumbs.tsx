import React, { useMemo } from "react";
import { useLocation } from "@tanstack/react-router";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { clsx } from "clsx";
import { useUIStore } from "@/entities/ui-state";
import { getTaskById, Task } from "@/entities/task";
import { useFinderDropdown } from "../model/useFinderDropdown";
import { parseBreadcrumbRoute } from "../lib/parseBreadcrumbRoute";
import { FinderSectionDropdown } from "./FinderSectionDropdown";
import { FinderHomeHierarchy } from "./FinderHomeHierarchy";
import { FinderJsHierarchy } from "./FinderJsHierarchy";
import { FinderReactHierarchy } from "./FinderReactHierarchy";
import { FinderAlgoHierarchy } from "./FinderAlgoHierarchy";
import styles from "./FinderBreadcrumbs.module.css";

export const FinderBreadcrumbs = () => {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const location = useLocation();

  const { activeDropdown, containerRef, toggleDropdown, closeAllDropdowns } = useFinderDropdown();

  const { section, taskId } = useMemo(
    () => parseBreadcrumbRoute(location.pathname),
    [location.pathname]
  );

  const currentTask: Task | null = useMemo(() => {
    if (!taskId) return null;
    return getTaskById(taskId) || null;
  }, [taskId]);

  return (
    <nav
      className={styles.breadcrumbsContainer}
      ref={containerRef}
      aria-label="Хлебные крошки Finder"
    >
      <button
        type="button"
        className={clsx(styles.sidebarToggleBtn, sidebarOpen && styles.desktopHidden)}
        onClick={toggleSidebar}
        title={sidebarOpen ? "Скрыть боковую панель" : "Показать боковую панель"}
        aria-label="Скрыть/Показать боковую панель"
      >
        {sidebarOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
      </button>

      {/* 1. Section Selector */}
      <FinderSectionDropdown
        section={section}
        activeDropdown={activeDropdown}
        toggleDropdown={toggleDropdown}
        closeAllDropdowns={closeAllDropdowns}
      />

      {/* 2. Home Page Hierarchy */}
      {section === "home" && <FinderHomeHierarchy />}

      {/* 3. JavaScript Hierarchy: Group / Subgroup / Task */}
      {section === "javascript" && (
        <FinderJsHierarchy
          paramId={taskId}
          currentTask={currentTask}
          activeDropdown={activeDropdown}
          toggleDropdown={toggleDropdown}
          closeAllDropdowns={closeAllDropdowns}
        />
      )}

      {/* 4. React Hierarchy: Category / Task */}
      {section === "react" && (
        <FinderReactHierarchy
          paramId={taskId}
          currentTask={currentTask}
          activeDropdown={activeDropdown}
          toggleDropdown={toggleDropdown}
          closeAllDropdowns={closeAllDropdowns}
        />
      )}

      {/* 5. Algorithms Hierarchy: Group / Task */}
      {section === "algorithms" && (
        <FinderAlgoHierarchy
          paramId={taskId}
          currentTask={currentTask}
          activeDropdown={activeDropdown}
          toggleDropdown={toggleDropdown}
          closeAllDropdowns={closeAllDropdowns}
        />
      )}
    </nav>
  );
};
