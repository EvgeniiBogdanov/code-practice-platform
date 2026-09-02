import React, { useMemo } from "react";
import { useLocation } from "@tanstack/react-router";
import { Menu, PanelLeft } from "lucide-react";
import { clsx } from "clsx";
import { useUIStore } from "@/entities/ui-state";
import type { SectionType, Task } from "@/entities/task/meta";
import { useTaskSection } from "@/entities/task/catalog";
import { useFinderDropdown } from "../model/useFinderDropdown";
import { parseBreadcrumbRoute } from "../lib/parseBreadcrumbRoute";
import { Tooltip } from "@/shared/ui";
import { FinderSectionDropdown } from "./FinderSectionDropdown";
import { FinderHomeHierarchy } from "./FinderHomeHierarchy";
import { FinderJsHierarchy } from "./FinderJsHierarchy";
import { FinderReactHierarchy } from "./FinderReactHierarchy";
import { FinderAlgoHierarchy } from "./FinderAlgoHierarchy";
import { FinderFavoritesHierarchy } from "./FinderFavoritesHierarchy";
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

  const isFavoritesPage = location.pathname.endsWith("/favorites");
  const taskSection: SectionType = section === "home" ? "react" : section;
  const { tasks } = useTaskSection(taskSection);
  const currentTask: Task | null = useMemo(() => {
    if (!taskId || isFavoritesPage) return null;
    return tasks.find((task) => String(task.id) === taskId) ?? null;
  }, [isFavoritesPage, taskId, tasks]);

  return (
    <nav
      className={styles.breadcrumbsContainer}
      ref={containerRef}
      aria-label="Хлебные крошки Finder"
    >
      <Tooltip
        content={sidebarOpen ? "Скрыть боковую панель" : "Показать боковую панель"}
        side="bottom"
      >
        <button
          type="button"
          className={clsx(styles.sidebarToggleBtn, sidebarOpen && styles.desktopHidden)}
          onClick={toggleSidebar}
          aria-label="Скрыть/Показать боковую панель"
        >
          {sidebarOpen ? <PanelLeft size={16} /> : <Menu size={16} />}
        </button>
      </Tooltip>

      {/* 1. Section Selector */}
      <FinderSectionDropdown
        section={section}
        activeDropdown={activeDropdown}
        toggleDropdown={toggleDropdown}
        closeAllDropdowns={closeAllDropdowns}
      />

      {/* 2. Home Page Hierarchy */}
      {section === "home" && <FinderHomeHierarchy />}

      {isFavoritesPage && section !== "home" && <FinderFavoritesHierarchy />}

      {/* 3. JavaScript Hierarchy: Group / Subgroup / Task */}
      {section === "javascript" && !isFavoritesPage && (
        <FinderJsHierarchy
          paramId={taskId}
          currentTask={currentTask}
          activeDropdown={activeDropdown}
          toggleDropdown={toggleDropdown}
          closeAllDropdowns={closeAllDropdowns}
        />
      )}

      {/* 4. React Hierarchy: Category / Task */}
      {section === "react" && !isFavoritesPage && (
        <FinderReactHierarchy
          paramId={taskId}
          currentTask={currentTask}
          activeDropdown={activeDropdown}
          toggleDropdown={toggleDropdown}
          closeAllDropdowns={closeAllDropdowns}
        />
      )}

      {/* 5. Algorithms Hierarchy: Group / Task */}
      {section === "algorithms" && !isFavoritesPage && (
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
